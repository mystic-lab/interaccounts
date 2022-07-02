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
    makeMsg: (/** @type {Msg} */ msg) => ICS27ICAProtocol.makeICAMsg(msg),
    createICAAccount: (/** @type {Port} */ port, /** @type {object} */ connectionHandler, /** @type {string} */ controllerConnectionId, /** @type {string} */ hostConnectionId) => ICS27ICAProtocol.createICS27Account(port, connectionHandler, controllerConnectionId, hostConnectionId),
    makeICAPacket: (/** @type {[Msg]} */ msgs) => ICS27ICAProtocol.makeICAPacket(msgs),
    sendICAPacket: (/** @type {Bytes} */ packet, /** @type {Connection} */ connection) => ICS27ICAProtocol.sendICAPacket(packet, connection),
  });

  return harden({ creatorFacet, publicFacet });
};

harden(start);
export { start };
