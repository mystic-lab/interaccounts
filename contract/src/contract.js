// @ts-check
import { makeDurableZone } from '@agoric/zone/durable.js';
import { M } from '@agoric/store';
import { MessageShape, prepareICS27ICAProtocol } from './ica.js';

/**
 * @param {unknown} _zcf
 * @param {unknown} _pa
 * @param {import('@agoric/swingset-liveslots').Baggage} baggage
 */
const start = (_zcf, _pa, baggage) => {
  const zone = makeDurableZone(baggage);

  const makeICS27ICAProtocol = prepareICS27ICAProtocol(zone);
  const ICS27ICAProtocol = makeICS27ICAProtocol();

  const PublicFacetGuard = M.interface('ICS27ICA', {
    createICAAccount:
      M.call(M.remotable('port'), M.any(), M.string(), M.string())
        .returns(M.promise()),
    sendICATxPacket: M.call(M.arrayOf(MessageShape), M.any()).returns(M.promise()),
  });

  /** @type {import('./types.js').ICA} */
  const publicFacet = zone.exo('publicFacet', PublicFacetGuard, {
    // Public faucet for anyone to call
    /**
     * @param {import('@agoric/network').Port} port
     * @param {object} connectionHandler
     * @param {string} controllerConnectionId
     * @param {string} hostConnectionId
     */
    createICAAccount: (
      port,
      connectionHandler,
      controllerConnectionId,
      hostConnectionId,
    ) =>
      ICS27ICAProtocol.createICAAccount(
        port,
        connectionHandler,
        controllerConnectionId,
        hostConnectionId,
      ),

    /**
     * @param {import('./types.js').Msg[]} msgs
     * @param {import('@agoric/network').Connection} connection 
     */
    sendICATxPacket: (
      msgs,
      connection,
    ) => ICS27ICAProtocol.sendICAPacket(msgs, connection),
  });

  return harden({ publicFacet });
};

harden(start);
export { start };
