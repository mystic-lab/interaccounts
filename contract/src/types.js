// @ts-check

/**
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
 * @property {Data} data
 * @property {Memo} memo
 */

/**
 * @typedef {object} Msg
 * @property {MsgType} typeUrl
 * @property {MsgValue} value
 */

/**
 * @typedef {object} ICAProtocol
 * @property {(msg: Msg) => Promise<Msg>} makeICAMsg
 * @property {(msg: [Msg]) => Promise<Bytes>} makeICAPacket
 * @property {(ack: Bytes) => Promise<void>} assertICAPacketAck
 * @property {(port: Port, connectionHandler: object, controllerConnectionId: string, hostConnectionId: string) => Promise<Connection>} createICAAccount
 * @property {(packet: Bytes, connection: Connection) => Promise<string>} sendICAPacket
 */

/**
 * @typedef {(zcfSeat: ZCFSeat) => Promise<void>} Sender
 * @typedef {object} Courier
 * @property {Sender} send
 */
