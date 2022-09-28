// @ts-nocheck
import '@agoric/babel-standalone';
import { MsgSend } from 'cosmjs-types/cosmos/bank/v1beta1/tx.js';

import { test } from '@agoric/zoe/tools/prepare-test-env-ava.js';
import path from 'path';

import { E } from '@endo/eventual-send';
import {
  makeNetworkProtocol,
  makeLoopbackProtocolHandler,
} from '@agoric/swingset-vat/src/vats/network/index.js';
import { Far } from '@endo/marshal';
import { makePromiseKit } from '@endo/promise-kit';
import bundleSource from '@endo/bundle-source';
import { makeFakeVatAdmin } from '@agoric/zoe/tools/fakeVatAdmin.js';
import { makeZoeKit } from '@agoric/zoe';

const filename = new URL(import.meta.url).pathname;
const dirname = path.dirname(filename);

const contractPath = `${dirname}/../src/contract.js`;

const testPublicFacet = async (t) => {
  const { zoeService } = makeZoeKit(makeFakeVatAdmin().admin);
  const feePurse = E(zoeService).makeFeePurse();
  const zoe = E(zoeService).bindDefaultFeePurse(feePurse);

  const bundle = await bundleSource(contractPath);
  const installation = await E(zoe).install(bundle);
  const instance = await E(zoe).startInstance(installation);

  // Create a network protocol to be used for testing
  const protocol = makeNetworkProtocol(makeLoopbackProtocolHandler());

  const closed = makePromiseKit();

  // Get public faucet from ICA instance
  // Create constant with raw json msg for a GDex swap
  const rawMsg = {
    amount: [{ denom: 'uatom', amount: '450000' }],
    fromAddress:
      'cosmos1h03590djp2jtg7n89pvvak0c73645gpct0nrnzfwhm62vvjzrd5sk20cxg',
    toAddress: 'cosmos17dtl0mjt3t77kpuhg2edqzjpszulwhgzuj9ljs',
  };
  const msgType = MsgSend.fromPartial(rawMsg);

  const msgBytes = MsgSend.encode(msgType).finish();

  // Create a swap msg
  const msg = await E(instance.publicFacet).makeMsg({
    typeUrl: '/cosmos.bank.v1beta1.MsgSend',
    value: msgBytes,
  });

  // Create an ICA packet with the swap msg
  const sendPacket = await E(instance.publicFacet).makeICAPacket([msg]);

  // Create first port that packet will be sent to
  const port = await protocol.bind('/loopback/foo');

  /**
   * Create the listener for the test port
   *
   * @type {import('../src/vats/network').ListenHandler}
   */
  const listener = Far('listener', {
    async onAccept(_p, _localAddr, _remoteAddr, _listenHandler) {
      return harden({
        async onReceive(c, packet, _connectionHandler) {
          // Check that recieved packet is the packet we created above
          console.log("Received Packet on Port 1:", packet);
          t.is(`${packet}`, `${sendPacket}`, 'expected ping');
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
        const pingack = await E(instance.publicFacet).sendICAPacket(sendPacket, c);;
        t.is(pingack, 'pingack', 'expected pingack');
        closed.resolve();
      },
    }),
  );

  await closed.promise;

  await port.removeListener(listener);
};

test('raw - send interchain tx', async (t) => {
  await testPublicFacet(t);
});
