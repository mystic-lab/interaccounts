// @ts-check
import { Nat } from '@agoric/nat';
import { Far } from '@endo/marshal';
import { assert, details as X } from '@agoric/assert';

/**
 * @typedef {Object} ICS27ICAPacket
 * @property {Type} type The int32 type of the transaction (ICA only supports Type 1)
 * @property {Data} data The byte encoding of a list of messages in {Type: xxx, Value: {}} format
 * @property {Memo} memo Optional memo for the tx. Defaults to blank ""
 */

// As specified in ICS27, the success result is a base64-encoded '\0x1' byte.
const ICS27_ICA_SUCCESS_RESULT = 'AQ==';

/**
 * @param {string} s
 */
const safeJSONParseObject = s => {
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
 * Create an interchain transaction from a msg - {type, value}
 * @param {Msg} msg
 * @returns {Promise<Bytes>}
 */
export const makeICS27ICAPacket = async ({
  type,
  value,
}) => {
  // Asserts/checks
  assert.typeof(type, 'string', X`Denom ${type} must be a string`);
  assert.typeof(value, 'string', X`Receiver ${value} must be a string`);

  // Generate the msg.
  /** @type {Msg} */
  const txmsg = {
    type: type,
    value: value,
  };

  // Generate the ics27-1 packet.
  /** @type {ICS27ICAPacket} */
  const ics27 = {
    type: BigInt(1),
    data: JSON.stringify(txmsg),
    memo: "",
  };

  return JSON.stringify(ics27);
};

/**
 * Check the results of the packet.
 *
 * @param {Bytes} ack
 * @returns {Promise<void>}
 */
export const assertICS27ICAPacketAck = async ack => {
  const { result, error } = safeJSONParseObject(ack);
  assert(error === undefined, X`ICS27 ICA error ${error}`);
  assert(result !== undefined, X`ICS27 ICA missing result in ${ack}`);
  if (result !== ICS27_ICA_SUCCESS_RESULT) {
    // We don't want to throw an error here, because we want only to be able to
    // differentiate between a packet that failed and a packet that succeeded.
    console.warn(`ICS27 ICA succeeded with unexpected result: ${result}`);
  }
};

/** @type {ICAProtocol} */
export const ICS27ICAProtocol = Far('ics27-1 ICA protocol', {
  makeICAPacket: makeICS27ICAPacket,
  assertICAPacketAck: assertICS27ICAPacketAck
});
