// @ts-check
// eslint-disable-next-line spaced-comment
/// <reference types="ses"/>

import { Tx } from "cosmjs-types/cosmos/tx/v1beta1/tx";

/**
/**
 * @typedef {number} Type
 * @typedef {string} Memo
 * @typedef {string} MsgType
 * @typedef {JSON} MsgValue
 */

/**
 * @typedef {Object} Packet
 * @property {Type} type
 * @property {Data} data
 * @property {Memo} memo
 */

/**
 * @typedef {Object} Msg
 * @property {MsgType} type
 * @property {MsgValue} value
 */

/**
 * @typedef {Object} ICAProtocol
 * @property {(msg: Msg) => Promise<Tx>} makeICAMsg
 * @property {(msg: [Tx]) => Promise<Bytes>} makeICAPacket
 * @property {(ack: Bytes) => Promise<void>} assertICAPacketAck
 */

/**
 * @typedef {(zcfSeat: ZCFSeat) => Promise<void>} Sender
 * @typedef {Object} Courier
 * @property {Sender} send
 */
