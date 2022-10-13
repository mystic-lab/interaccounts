// @ts-check
import '@agoric/zoe/exported.js';
import { Far } from '@endo/marshal';
import { ICS27ICAProtocol } from './ica.js';

/**
 *
 * @type {ContractStartFn}
 */
const start = async () => {
  const creatorFacet = Far('creatorFacet', {
    // The creator of the instance can be called by the creator
  });

  const publicFacet = Far('publicFacet', {
    // Public faucet for anyone to call
    makeMsg: (/** @type {string} */ typeUrl, /** @type {Uint8Array} */ value) =>
      ICS27ICAProtocol.makeICAMsg(typeUrl, value),
    createICAAccount: (
      /** @type {Port} */ port,
      /** @type {object} */ connectionHandler,
      /** @type {string} */ controllerConnectionId,
      /** @type {string} */ hostConnectionId,
    ) =>
      ICS27ICAProtocol.createICS27Account(
        port,
        connectionHandler,
        controllerConnectionId,
        hostConnectionId,
      ),
    makeICAPacket: (
      /** @type {[{typeUrl: string, value: Uint8Array}]} */ msgs,
    ) => ICS27ICAProtocol.makeICAPacket(msgs),
    sendICAPacket: (
      /** @type {Bytes} */ packet,
      /** @type {Connection} */ connection,
    ) => ICS27ICAProtocol.sendICAPacket(packet, connection),
  });

  return harden({ creatorFacet, publicFacet });
};

harden(start);
export { start };
