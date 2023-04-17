// @ts-check
import '@agoric/zoe/exported.js';
import { Far } from '@endo/marshal/src/make-far.js';
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
    sendICATxPacket: (
      /** @type {[Msg]} */ msgs,
      /** @type {Connection} */ connection,
    ) => ICS27ICAProtocol.sendICATx(msgs, connection),
  });

  return harden({ creatorFacet, publicFacet });
};

harden(start);
export { start };
