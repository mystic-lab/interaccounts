/* eslint-disable node/no-missing-import */
// @ts-check
import { E } from '@endo/far';
import { M } from '@agoric/store';
import { TxBody } from '@agoric/cosmic-proto/cosmos/tx/v1beta1/tx.js';
import { Any } from '@agoric/cosmic-proto/google/protobuf/any.js';
import { decodeBase64 as fromBase64, encodeBase64 as toBase64 } from '@endo/base64';

/**
 * @import { Msg, ICAProtocol, ICS27ICAPacket } from './types.js';
 * @import { PromiseVow } from '@agoric/vow';
 * @import { ConnectionHandler, Connection, Port, Bytes } from '@agoric/network';
 */

  export const MessageShape = harden({
    typeUrl: M.string(),
    data: M.string(),
  });
  const ICS27ICAProtocolGuard = M.interface('ICS27ICAProtocol', {
    createICAAccount: M.call(M.remotable('port'), M.any(), M.string(), M.string()).returns(M.promise()),
    sendICAPacket: M.call(M.arrayOf(MessageShape), M.any()).returns(M.promise()),
  });

/**
 * @param {import('@agoric/base-zone').Zone} zone
 * @returns {() => ICAProtocol}
 */
export const prepareICS27ICAProtocol = zone => {
  const singleton = zone.exo('ICS27ICAProtocol', ICS27ICAProtocolGuard, {
    /**
     * Create an ICA account/channel on the connection provided
     *
     * @param {Port} port
     * @param {ConnectionHandler} connectionHandler
     * @param {string} controllerConnectionId
     * @param {string} hostConnectionId
     * @returns {PromiseVow<Connection>}
     */
    async createICAAccount(
      port,
      connectionHandler,
      controllerConnectionId,
      hostConnectionId,
    ) {
      const connString = JSON.stringify({
        version: 'ics27-1',
        controllerConnectionId,
        hostConnectionId,
        address: '',
        encoding: 'proto3',
        txType: 'sdk_multi_msg',
      });

      return E(port).connect(
        `/ibc-hop/${controllerConnectionId}/ibc-port/icahost/ordered/${connString}`,
        connectionHandler,
      );
    },

    /**
     * Provide a connection object and a list of msgs and send them through the ICA channel.
     *
     * @param {Msg[]} msgs
     * @param {Connection} connection
     * @returns {Promise<string>}
     */
    async sendICAPacket(msgs, connection) {
      const allMsgs = []
      // Asserts/checks
      for (const msg of msgs) {
        // Convert the base64 string into a uint8array
        const valueBytes = fromBase64(msg.data)

        // Generate the msg.
        const txmsg = Any.fromPartial({
          typeUrl: msg.typeUrl,
          value: valueBytes,
        });

        // add the new message to all msg array
        allMsgs.push(txmsg)
      }
      const body = TxBody.fromPartial({
        messages: Array.from(allMsgs),
      });

      const buf = TxBody.encode(body).finish();

      // Generate the ics27-1 packet.
      /** @type {ICS27ICAPacket} */
      const ics27 = {
        type: 1,
        data: toBase64(buf),
        memo: '',
      };

        /** @type {Bytes} */
      const packet = JSON.stringify(ics27);

      return E(connection).send(packet);
    },
  });

  return () => singleton;
};
