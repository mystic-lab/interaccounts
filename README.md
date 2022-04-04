# Interchain Accounts Agoric Contract

This is the Agoric smart contract for ICS-27 transactions via IBC. You can send cross-chain transactions from Agoric utilizing this contract.

## Getting Started
You will need to have Golang, NodeJS and Rust installed to get started.

```sh
git clone https://github.com/schnetzlerjoe/interaccounts

cd interaccounts

# Install all required software. Agoric, Gaia, Osmosis and Hermes Relayer
make install

# Start a local Agoric chain
agoric start local-chain --reset
```

Once the chain starts from above, in a second terminal start the local Agoric solo.
```sh
agoric start local-solo 8000 --reset
```

In a third terminal, start up the other two chains (Gaia and Osmosis) and create an IBC connection to them with the Hermes Relayer
```sh
make init
```

Once the process above completes, in the same third terminal from above, start the Hermes Relayer to relay transactions across chains
```sh
make start-rly
```

## Deploying the Contract

In a fourth terminal, run the following command to open up the local solo with the repl enabled
```sh
agoric open --repl
```

Once the repl opens, lets deploy the ICS-27 contract to Zoe so we can use it from our repl and our other contracts. Move back to the fourth terminal from above and run the following commands
```sh
# Make sure you are in the base contract directory
cd ~/interaccounts/contract

agoric deploy ./deploy.js
```

## Setting Up ICA Accounts on Host Chain
In the local solo repl, run the following commands.

```javascript
// Get the ibc port objects
home.ibcport
```
Use the history object from the above command to get the specific port. Grabs the first port from list of ports returned. Keep note of this history number as well for the connect command later on.
```javascript
history[0][0]
```
Set up the connection string for our version.
```javascript
connString = JSON.stringify({"version": "ics27-1","controllerConnectionId":"connection-1","hostConnectionId":"connection-0","address":"","encoding":"proto3","txType":"sdk_multi_msg"})
```
Set up the connection handlers. Feel free to change as you please.
```javascript
connectionHandler = Far('handler', { "infoMessage": (...args) => { console.log(...args) }, "onReceive": (c, p) => { console.log('received packet: ', p); }, "onOpen": (c) => { console.log('opened') } });
```
Create the ICA account. The connection object returned is what we will use to send ICA packets to the host chain. Keep track of the history number returned.
```javascript
connection = E(history[1]).connect("/ibc-hop/connection-1/ibc-port/icahost/ordered/" + connString, connectionHandler)
```

## Sending ICA Transactions
Use the ```INSTALLATION_BOARD_ID``` in the file /```interaccounts/ui/public/conf/installationConstants.js``` generated from the contract deployment to get the installation.
```javascript
installation = E(home.board).getValue(Installation_ID)
```