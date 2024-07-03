// @ts-check
import '@agoric/babel-standalone';
// eslint-disable-next-line import/order
import { test, makeTestContext } from './prepare-test-env-ava.js';

// eslint-disable-next-line node/no-missing-import
import { MsgSend } from '@agoric/cosmic-proto/cosmos/bank/v1beta1/tx.js';

import path from 'path';

import { E, Far } from '@endo/far';
import { encodeBase64 } from '@endo/base64';
import { makePromiseKit } from '@endo/promise-kit';
import bundleSource from '@endo/bundle-source';
import { makeZoeKitForTest } from '@agoric/zoe/tools/setup-zoe.js';

const filename = new URL(import.meta.url).pathname;
const dirname = path.dirname(filename);

const contractPath = `${dirname}/../src/contract.js`;

test.beforeEach(async (t) => {
  t.context = await makeTestContext(t);
});

/**
 * @param {import('./prepare-test-env-ava.js').ExecutionContext} t 
 */
const testPublicFacet = async (t) => {
  const { zoeService: zoe } = makeZoeKitForTest();

  const bundle = await bundleSource(contractPath);
  const installation = await E(zoe).install(bundle);
  const instance = await E(zoe).startInstance(installation);

  // Create a network protocol to be used for testing
  const { protocol, when } = t.context;

  /** @type {import('@endo/promise-kit').PromiseRecord<void>} */
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
  const port = await when(E(protocol).bindPort('/loopback/foo'));

  /**
   * Create the listener for the test port
   *
   * @type {import('@agoric/network').ListenHandler}
   */
  const listener = Far('listener', {
    async onAccept(_p, _localAddr, _remoteAddr, _listenHandler) {
      return Far('connection', {
        async onReceive(c, packet, _connectionHandler) {
          // Check that recieved packet is the packet we created above
          console.log('Received Packet on Port 1:', packet);
          return 'pingack';
        },
      });
    },
  });
  await when(E(port).addListener(listener));

  // Create and send packet to first port utilizing port 2
  const port2 = when(E(protocol).bindPort('/loopback/bar'));
  await when(E(port2).connect(
    await when(E(port).getLocalAddress()),
    Far('opener', {
      async onOpen(c, localAddr, remoteAddr, _connectionHandler) {
        t.is(localAddr, '/loopback/bar/nonce/1');
        t.is(remoteAddr, '/loopback/foo/nonce/2');

        const pingack = await when(E(instance.publicFacet).sendICATxPacket(
          [
            {
              typeUrl: '/cosmos.bank.v1beta1.MsgSend',
              data: encodeBase64(msgBytes),
            }
          ],
          c,
        ));
        t.is(pingack, 'pingack', 'expected pingack');
        closed.resolve();
      },
    }),
  ));

  await closed.promise;

  await when(E(port).removeListener(listener));
};

test('raw - send interchain tx', async (t) => {
  await testPublicFacet(t);
});
