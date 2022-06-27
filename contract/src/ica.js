// @ts-check
import { Far } from '@endo/marshal';
import { assert, details as X } from '@agoric/assert';
import { encodeBase64 } from '@endo/base64';
import { TxBody } from 'cosmjs-types/cosmos/tx/v1beta1/tx.js';
import { Any } from 'cosmjs-types/google/protobuf/any.js';

/**
 * @typedef {object} ICS27ICAPacket
 * @property {Type} type The int32 type of the transaction (ICA only supports Type 1)
 * @property {Data} data The byte encoding of a list of messages in {Type: xxx, Value: {}} format
 * @property {Memo} memo Optional memo for the tx. Defaults to blank ""
 */

// As specified in ICS27, the success result is a base64-encoded '\0x1' byte.
const ICS27_ICA_SUCCESS_RESULT = 'AQ==';

/**
 * @param {string} s
 */
const safeJSONParseObject = (s) => {
  /** @type {unknown} */
  let obj;
  try {
    obj = JSON.parse(s);
  } catch (e) {
    assert.note(e, X`${s} is not valid JSON`);
    throw e;
  }
  assert.typeof(obj, 'object', X`${s} is not a JSON object`);
  assert(obj !== null, X`${s} is null`);
  return obj;
};

/**
 * Create an ICA account/channel on the connection provided
 *
 * @param {Port} port
 * @param {object} connectionHandler
 * @param {string} controllerConnectionId
 * @param {string} hostConnectionId
 * @returns {Promise<Connection>}
 */
export const createICAAccount = async (
  port,
  connectionHandler,
  controllerConnectionId,
  hostConnectionId,
) => {
  const connString = JSON.stringify({
    version: 'ics27-1',
    controllerConnectionId,
    hostConnectionId,
    address: '',
    encoding: 'proto3',
    txType: 'sdk_multi_msg',
  });

  const connection = port.connect(
    `/ibc-hop/${controllerConnectionId}/ibc-port/icahost/ordered/${connString}`,
    connectionHandler,
  );

  return connection;
};

/**
 * Create an interchain transaction from a msg - {type, value}
 *
 * @param {Msg} msg
 * @returns {Promise<Any>}
 */
export const makeMsg = async ({ typeUrl, value }) => {
  // Asserts/checks
  assert.typeof(typeUrl, 'string', X`typeUrl ${typeUrl} must be a string`);
  assert.typeof(
    Buffer.from(value).toString('base64'),
    'string',
    X`Value must be a proto encoded Uint8Array serializable to base64`,
  );

  // Generate the msg.
  /** @type {Any} */
  const txmsg = Any.fromPartial({
    typeUrl,
    value,
  });
  return txmsg;
};

/**
 * Create an interchain transaction from a list of msg's
 *
 * @param {[Msg]} msgs
 * @returns {Promise<Bytes>}
 */
export const makeICS27ICAPacket = async (msgs) => {
  const body = TxBody.fromPartial({
    messages: Array.from(msgs),
  });

  const buf = TxBody.encode(body).finish();

  // Generate the ics27-1 packet.
  /** @type {ICS27ICAPacket} */
  const ics27 = {
    type: 1,
    data: encodeBase64(buf),
    memo: '',
  };

  const packet = JSON.stringify(ics27);

  return packet;
};

/**
 * Check the results of the packet.
 *
 * @param {Bytes} ack
 * @returns {Promise<void>}
 */
export const assertICS27ICAPacketAck = async (ack) => {
  const { result, error } = safeJSONParseObject(ack);
  assert(error === undefined, X`ICS27 ICA error ${error}`);
  assert(result !== undefined, X`ICS27 ICA missing result in ${ack}`);
  if (result !== ICS27_ICA_SUCCESS_RESULT) {
    // We don't want to throw an error here, because we want only to be able to
    // differentiate between a packet that failed and a packet that succeeded.
    console.warn(`ICS27 ICA succeeded with unexpected result: ${result}`);
  }
};

/**
 * Provide a connection object and the packet and send ICA Msg's
 *
 * @param {string} packet
 * @param {Connection} connection
 * @returns {Promise<string>}
 */
export const sendICAPacket = async (packet, connection) => {
  // Asserts/checks
  assert.typeof(
    JSON.parse(packet),
    'object',
    X`packet must be a stringify version of a JSON object`,
  );

  const res = await connection.send(packet);

  return res;
};

/** @type {ICAProtocol} */
export const ICS27ICAProtocol = Far('ics27-1 ICA protocol', {
  makeICAMsg: makeMsg,
  makeICAPacket: makeICS27ICAPacket,
  assertICAPacketAck: assertICS27ICAPacketAck,
  createICAAccount,
  sendICAPacket,
});
