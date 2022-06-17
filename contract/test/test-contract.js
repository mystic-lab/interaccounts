// @ts-nocheck
import '@agoric/babel-standalone';

import { test } from '@agoric/zoe/tools/prepare-test-env-ava.js';
import path from 'path';

import bundleSource from '@endo/bundle-source';

import { E } from '@endo/eventual-send';
import { makeFakeVatAdmin } from '@agoric/zoe/tools/fakeVatAdmin.js';
import {
  makeNetworkProtocol,
  makeLoopbackProtocolHandler,
} from '@agoric/swingset-vat/src/vats/network/index.js';
import { makeZoeKit } from '@agoric/zoe';
import { Far } from '@endo/marshal';
import { makePromiseKit } from '@endo/promise-kit';

const filename = new URL(import.meta.url).pathname;
const dirname = path.dirname(filename);

const contractPath = `${dirname}/../src/contract.js`;

const getPublicFacetFromZoe = async t => {
  const { zoeService } = makeZoeKit(makeFakeVatAdmin().admin);
  const feePurse = E(zoeService).makeFeePurse();
  const zoe = E(zoeService).bindDefaultFeePurse(feePurse);
  // pack the contract
  const bundle = await bundleSource(contractPath);
  // install the contract
  const installation = E(zoe).install(bundle);
  // Start the contract instance
  const { instance } = await E(zoe).startInstance(installation);
  return E(zoe).getPublicFacet(instance);
};

const testPublicFacet = async (t, publicFacet) => {
  // Create a network protocol to be used for testing
  const protocol = makeNetworkProtocol(makeLoopbackProtocolHandler());

  const closed = makePromiseKit();

  // Get public faucet from ICA instance
  // Create constant with raw json msg for a GDex swap
  const raw_msg = {
    "swap_requester_address": "cosmos1v8ezz6fslyd0rcxm9kh4q8zlwehh6q68n6zmr3",
    "pool_id": "5",
    "swap_type_id": 1,
    "offer_coin": {
      "denom": "uatom",
      "amount": "10000"
    },
    "demand_coin_denom": "ibc/2181AAB0218EAC24BC9F86BD1364FBBFA3E6E3FCC25E88E3E68C15DC6E752D86",
    "offer_coin_fee": {
      "denom": "uatom",
      "amount": "15"
    },
    "order_price": "23.156819999999999737"
  };
  // Create a swap msg
  const msg = await E(publicFacet).makeMsg({type: "liquidity/MsgSwapWithinBatch", value: raw_msg});

  // Create an ICA packet with the swap msg
  const send_packet = await E(publicFacet).makeICAPacket([msg]);

  // Create first port that packet will be sent to
  const port = await protocol.bind('/loopback/foo');

  /**
   * Create the listener for the test port
   * @type {import('../src/vats/network').ListenHandler}
   */
  const listener = Far('listener', {
    async onAccept(_p, _localAddr, _remoteAddr, _listenHandler) {
      return harden({
        async onReceive(c, packet, _connectionHandler) {
          // Check that recieved packet is the packet we created above
          console.log(packet);
          t.is(`${packet}`, `${send_packet}`, 'expected ping');
          return 'pingack';
        },
      });
    },
  });
  await port.addListener(listener);

  // Create and send packet to first port utilizing port 2
  const port2 = await protocol.bind('/loopback/bar');
  await port2.connect(
    port.getLocalAddress(),
    Far('opener', {
      async onOpen(c, localAddr, remoteAddr, _connectionHandler) {
        t.is(localAddr, '/loopback/bar/nonce/1');
        t.is(remoteAddr, '/loopback/foo/nonce/2');
        const pingack = await c.send(send_packet);
        t.is(pingack, 'pingack', 'expected pingack');
        closed.resolve();
      },
    }),
  );

  await closed.promise;

  await port.removeListener(listener);  
};

test('zoe - send interchain tx', async t => {
  const publicFacet = getPublicFacetFromZoe();
  await testPublicFacet(t, publicFacet);
});

test('raw - send interchain tx', async t => {
  const mod = await import(contractPath);
  const { publicFacet } = await mod.start();
  await testPublicFacet(t, publicFacet);
});
