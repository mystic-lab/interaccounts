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
 * @property {(packet: Bytes, connection: Connection) => Promise<string>} sendICAPacket
 * @property {(port: Port, connectionHandler: object, controllerConnectionId: string, hostConnectionId: string) => Promise<Connection>} createICS27Account
 */

/**
 * @typedef {(zcfSeat: ZCFSeat) => Promise<void>} Sender
 * @typedef {object} Courier
 * @property {Sender} send
 */

/**
 * @typedef {object} ICS27ICAPacket
 * @property {Type} type The int32 type of the transaction (ICA only supports Type 1)
 * @property {Data} data The byte encoding of a list of messages in {Type: xxx, Value: {}} format
 * @property {Memo} memo Optional memo for the tx. Defaults to blank ""
 */
