# Interchain Accounts Agoric Contract

This is the Agoric smart contract for ICS-27 transactions via IBC. You can send cross-chain transactions from Agoric utilizing this contract.

## Getting Started
You will need to have Golang, NodeJS and Rust installed to get started.

## Installation

```sh
git clone https://github.com/schnetzlerjoe/interaccounts

cd interaccounts

# Install all required software. Agoric, Gaia, Osmosis and Hermes Relayer
make install

# Start a local Agoric chain
make start
```

## Setup

Keep an eye in agoric.log file. Once Agoric starts up, initialize all the connections and the Hermes relayer
```sh
make init
```

Once the process above completes, start the Hermes Relayer to relay transactions across chains. hermes.log tracks all the logs for Hermes
```sh
make start-rly
```

## Deploying the Contract

In a seperate terminal, run the following command to start the local-solo. You will have to keep this terminal up running the solo
```sh
agoric start local-solo --reset
# once local-solo starts up, run
agoric open --repl
```

Once the repl opens, lets deploy the ICS-27 contract to Zoe so we can use it from our repl and our other contracts. Move back to an open terminal and run the following commands
```sh
# Make sure you are in the base contract directory
cd ~/interaccounts/contract

agoric deploy ./deploy.js
```

## Get Deployed Contract

Use the ```INSTALLATION_BOARD_ID``` in the file /```interaccounts/ui/public/conf/installationConstants.js``` generated from the contract deployment to get the installation.

```javascript
// Get installation from board
installation = E(home.board).getValue(Installation_ID)

// Start the instance from above
instance = E(home.zoe).startInstance(installation)
```

## Setting Up ICA Accounts on Host Chain

In the local solo repl, run the following commands.

Identify the home.ibcport that has the icacontroller prefix
```shell
home.ibcport.then(ps => Promise.all(ps.map(p => E(p).getLocalAddress())))
```

Replace the position with the number of the icacontroller prefix above, most likely will be the position 2. Remember that it is 0 indexed.

```javascript
// Get the ibc port objects list
home.ibcport
// Get a port from the port list
port = history[0][<position>]
```

Set up the connection handlers. Feel free to change as you please.

```javascript
let connectionHandler = Far('handler', { "infoMessage": (...args) => { console.log(...args) }, "onReceive": (c, p) => { console.log('received packet: ', p); }, "onOpen": (c) => { console.log('opened') } });
```
Create the ICA account. The connection object returned is what we will use to send ICA packets to the host chain.

```controllerConnectionId``` = the Agoric connection ID to connect to (string)

```hostConnectionId``` = the counterparty connection ID to connect to (string)

```javascript
const connection = await E(instance.publicFacet).createICAAccount(port, connectionHandler, controllerConnectionId, hostConnectionId)
```

## Sending ICA Transactions
Please note, you must supply a base64 protobuf encoded message like the below to the sendICAPacket function.

```javascript
const rawMsg = {
    amount: [{ denom: 'uatom', amount: '450000' }],
    fromAddress:
        'cosmos1h03590djp2jtg7n89pvvak0c73645gpct0nrnzfwhm62vvjzrd5sk20cxg',
    toAddress: 'cosmos17dtl0mjt3t77kpuhg2edqzjpszulwhgzuj9ljs',
};
const msgType = MsgSend.fromPartial(rawMsg);

const msgBytes = MsgSend.encode(msgType).finish();

const bytesBase64 = encodeBase64(msgBytes);

const res = await E(instance.publicFacet).sendICATxPacket(
    [
        {
            typeUrl: '/cosmos.bank.v1beta1.MsgSend',
            data: bytesBase64,
        }
    ],
    connection,
);
```

## How to upgrade Agoric package resolutions

Run `agoric-sdk/scripts/upgrade-agoric-resolutions.sh` within this directory.
