// @ts-nocheck
import '@agoric/babel-standalone';
import { MsgSend } from 'cosmjs-types/cosmos/bank/v1beta1/tx.js';

import { test } from './prepare-test-env-ava.js';
import path from 'path';

import { E } from '@endo/eventual-send';
import { encodeBase64 } from '@endo/base64';
import {
  makeNetworkProtocol,
  makeLoopbackProtocolHandler,
} from '@agoric/swingset-vat/src/vats/network/index.js';
import { Far } from '@endo/marshal/src/make-far.js';
import { makePromiseKit } from '@endo/promise-kit';
import bundleSource from '@endo/bundle-source';
import { makeFakeVatAdmin } from '@agoric/zoe/tools/fakeVatAdmin.js';
import { makeZoeKit } from '@agoric/zoe';

const filename = new URL(import.meta.url).pathname;
const dirname = path.dirname(filename);

const contractPath = `${dirname}/../src/contract.js`;

const testPublicFacet = async (t) => {
  const { zoeService: zoe } = makeZoeKit(makeFakeVatAdmin().admin);

  const bundle = await bundleSource(contractPath);
  const installation = await E(zoe).install(bundle);
  const instance = await E(zoe).startInstance(installation);

  // Create a network protocol to be used for testing
  const protocol = makeNetworkProtocol(makeLoopbackProtocolHandler());

  const closed = makePromiseKit();

  // Get public faucet from ICA instance
  // Create constant with raw json msg for a GDex swap
  const rawMsg = {
    amount: [{ denom: 'uaxl', amount: '100000' }],
    fromAddress:
      'axelar1tw556a6ag5e60wnpgkf970k9nzuugzem33tag2x06e3xlhwsvyzq236pur',
    toAddress: 'axelar15h7alr3adasctq5k9wrzg5axexl43ler6ryl7p',
  };
  const msgType = MsgSend.fromPartial(rawMsg);

  const msgBytes = MsgSend.encode(msgType).finish();

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
          console.log('Received Packet on Port 1:', packet);
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
        const pingack = await E(instance.publicFacet).sendICATxPacket(
          [
            {
              typeUrl: '/cosmos.bank.v1beta1.MsgSend',
              data: encodeBase64(msgBytes),
            }
          ],
          c,
        );
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
