# Interchain Accounts Agoric Smart Contract

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

Then navigate to http://localhost:8000 to your local running solo.

## Deploying the Contract

## Sending ICA Transactions