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

```javascript
// Get the ibc port objects list
home.ibcport
// Get a port from the port list
port = history[0][0]
```
Set up the connection handlers. Feel free to change as you please.

```javascript
connectionHandler = Far('handler', { "infoMessage": (...args) => { console.log(...args) }, "onReceive": (c, p) => { console.log('received packet: ', p); }, "onOpen": (c) => { console.log('opened') } });
```
Create the ICA account. The connection object returned is what we will use to send ICA packets to the host chain.

```controllerConnectionId``` = the Agoric connection ID to connect to (string)

```hostConnectionId``` = the counterparty connection ID to connect to (string)

```javascript
connection = E(instance.publicFacet).createICAAccount(port, connectionHandler, controllerConnectionId, hostConnectionId)
```

## Sending ICA Transactions
```javascript
raw_msg = {
    "from_address":"cosmos15ccshhmp0gsx29qpqq6g4zmltnnvgmyu9ueuadh9y2nc5zj0szls5gtddz",
    "to_address":"cosmos10h9stc5v6ntgeygf5xf945njqq5h32r53uquvw",
    "amount": [
        {
            "denom": "stake",
            "amount": "1000"
        }
    ]
}

// You must use protobuf to encode the raw msg into a uint8array you use for the value input. Look at the test contract to see an example with MsgSend
msg =  E(instance.publicFacet).makeMsg({type: "/cosmos.bank.v1beta1.MsgSend", value: proto_msg_uint8array})

packet = E(instance.publicFacet).makeICAPacket([msg]);

connection.send(JSON.stringify(packet))
```