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
import { toBytes } from '@agoric/swingset-vat/src/vats/network/bytes.js';
import { Far } from '@endo/marshal';

const filename = new URL(import.meta.url).pathname;
const dirname = path.dirname(filename);

const contractPath = `${dirname}/../src/contract.js`;

const network = makeNetworkProtocol(makeLoopbackProtocolHandler());

const portP = E(network).bind('/ibc-hop/connection-0/ibc-port/icahost/ordered/');
const portName = await E(portP).getLocalAddress();

test('zoe - send interchain tx', async (t) => {
  const { zoeService } = makeZoeKit(makeFakeVatAdmin().admin);
  const feePurse = E(zoeService).makeFeePurse();
  const zoe = E(zoeService).bindDefaultFeePurse(feePurse);

  // pack the contract
  const bundle = await bundleSource(contractPath);

  // install the contract
  const installation = E(zoe).install(bundle);

  const { creatorFacet, instance } = await E(zoe).startInstance(installation);

  // Create connection
  const connString = JSON.stringify({"version": "ics27-1","controllerConnectionId":"connection-0","hostConnectionId":"connection-0","address":"","encoding":"proto3","txType":"sdk_multi_msg"})

  const connectionHandler = Far('handler', { "infoMessage": (...args) => { console.log(...args) }, "onReceive": (c, p) => { console.log('received packet: ', p); }, "onOpen": (c) => { console.log('opened') } });
  
  const conn = await E(portP).connect("/ibc-hop/connection-0/ibc-port/icahost/ordered/" + connString, connectionHandler)  

  const publicFacet = E(zoe).getPublicFacet(instance);
  const msgvalue = {
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
  const msgvaluebuffer = Buffer.from(JSON.stringify(msgvalue), 'utf-8');
  const msgvaluebytes = toBytes(msgvaluebuffer)
  const icaPacket = await E(publicFacet).makeICAPacket({type: "liquidity/MsgSwapWithinBatch", value: toBytes(msgvaluebytes)});

  const ret = conn.send(toBytes(icaPacket));

  console.log(ret)
});
