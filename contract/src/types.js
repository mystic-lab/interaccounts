// @ts-check

import '@agoric/zoe/src/types-ambient.js';

/**
 * @import { PromiseVow } from '@agoric/vow';
 * @import { Bytes, Connection, Port } from '@agoric/network';
 */
/**
 *
 * @typedef {number} Type
 * @typedef {string} Memo
 * @typedef {string} MsgType
 * @typedef {Uint8Array} MsgValue
 */

/**
 * @typedef {object} Packet
 * @property {Type} type
 * @property {Bytes} data
 * @property {Memo} memo
 */

/**
 * @typedef {object} Msg
 * @property {string} typeUrl
 * @property {string} data
 */

/**
 * @typedef {object} ICAProtocol
 * @property {(msgs: Msg[], connection: Connection) => PromiseVow<string>} sendICAPacket
 * @property {(port: Port, connectionHandler: object, controllerConnectionId: string, hostConnectionId: string) => PromiseVow<Connection>} createICAAccount
 */

/**
 * @typedef {object} ICA
 * @property {(port: Port, connectionHandler: object, controllerConnectionId: string, hostConnectionId: string) => Promise<Connection>} createICAAccount
 * @property {(msgs: Msg[], connection: Connection) => Promise<string>} sendICATxPacket
 */

/**
 * @typedef {(zcfSeat: ZCFSeat) => Promise<void>} Sender
 * @typedef {object} Courier
 * @property {Sender} send
 */

/**
 * @typedef {object} ICS27ICAPacket
 * @property {Type} type The int32 type of the transaction (ICA only supports Type 1)
 * @property {Bytes} data The byte encoding of a list of messages in {Type: xxx, Value: {}} format
 * @property {Memo} memo Optional memo for the tx. Defaults to blank ""
 */
