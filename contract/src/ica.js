// @ts-check
import { Far } from '@endo/marshal';
import { assert, details as X } from '@agoric/assert';
import { encodeBase64 } from '@endo/base64';
import { Tx, TxBody } from "cosmjs-types/cosmos/tx/v1beta1/tx.js";
import { Any } from "cosmjs-types/google/protobuf/any.js";

/**
 * @typedef {Object} ICS27ICAPacket
 * @property {Type} type The int32 type of the transaction (ICA only supports Type 1)
 * @property {Data} data The byte encoding of a list of messages in {Type: xxx, Value: {}} format
 * @property {Memo} memo Optional memo for the tx. Defaults to blank ""
 */

// As specified in ICS27, the success result is a base64-encoded '\0x1' byte.
const ICS27_ICA_SUCCESS_RESULT = 'AQ==';

/**
 * @param {object} json
 */
var JsonToArray = function(json)
{
	var str = JSON.stringify(json, null, 0);
	var ret = new Uint8Array(str.length);
	for (var i = 0; i < str.length; i++) {
		ret[i] = str.charCodeAt(i);
	}
	return ret
};

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
 * @returns {Promise<Any>}
 */
export const makeMsg = async ({
  typeUrl,
  value,
}) => {
  // Asserts/checks
  assert.typeof(typeUrl, 'string', X`typeUrl ${typeUrl} must be a string`);
  assert.typeof(JSON.stringify(value), 'string', X`Receiver ${value} must be serializable into a json string`);

  // Generate the msg.
  /** @type {Any} */
  const txmsg = Any.fromPartial({
    typeUrl: typeUrl,
    value: value
  })
  return txmsg;
};

/**
 * Create an interchain transaction from a list of msg's
 * @param {[Msg]} msgs
 * @returns {Promise<Bytes>}
 */
 export const makeICS27ICAPacket = async (msgs) => {

  const body = TxBody.fromPartial({
    messages: Array.from(msgs)
  })

  const buf = TxBody.encode(body).finish()

  // Generate the ics27-1 packet.
  /** @type {ICS27ICAPacket} */
  var ics27 = {
    type: 1,
    data: encodeBase64(buf),
    memo: "",
  };

  const packet = JSON.stringify(ics27)
  
  return packet;
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
  makeICAMsg: makeMsg,
  makeICAPacket: makeICS27ICAPacket,
  assertICAPacketAck: assertICS27ICAPacketAck
});