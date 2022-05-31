// @ts-check
// eslint-disable-next-line spaced-comment
/// <reference types="ses"/>

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
 * @property {(msg: Msg) => Promise<Msg>} makeICAMsg
 * @property {(msg: [Msg]) => Promise<Bytes>} makeICAPacket
 * @property {(ack: Bytes) => Promise<void>} assertICAPacketAck
 */

/**
 * @typedef {(zcfSeat: ZCFSeat) => Promise<void>} Sender
 * @typedef {Object} Courier
 * @property {Sender} send
 */