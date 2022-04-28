// @ts-check
import '@agoric/zoe/exported.js';
import { Far } from '@endo/marshal';
import { ICS27ICAProtocol } from './ica.js'

/**
 *
 * @type {ContractStartFn}
 */
const start = async (zcf) => {

  const creatorFacet = Far('creatorFacet', {
    // The creator of the instance can be called by the creator
  });

  const publicFacet = Far('publicFacet', {
    // Public faucet for anyone to call
    makeMsg: async (/** @type {MsgType} */ type, /** @type {MsgValue} */ value) => await ICS27ICAProtocol.makeICAMsg(type, value),
    makeICAPacket: async (/** @type {[Msg]} */ msgs) => await ICS27ICAProtocol.makeICAPacket(msgs),
  });

  return harden({ creatorFacet, publicFacet });
};

harden(start);
export { start };
