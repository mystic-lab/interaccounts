#!/bin/bash

BINARY=gaiad
CHAIN_DIR=./network/data
CHAINID_1=theta-testnet-001
DEMO_MNEMONIC_1="veteran try aware erosion drink dance decade comic dawn museum release episode original list ability owner size tuition surface ceiling depth seminar capable only"
RLY_MNEMONIC_1="record gift you once hip style during joke field prize dust unique length more pencil transfer quit train device arrive energy sort steak upset"
P2PPORT_1=16656
RPCPORT_1=16657
RESTPORT_1=1316
ROSETTA_1=8080

echo "Removing previous data..."
rm -rf $CHAIN_DIR/$CHAINID_1 &> /dev/null

# Add directories for all chains, exit if an error occurs
if ! mkdir -p $CHAIN_DIR/$CHAINID_1 2>/dev/null; then
    echo "Failed to create chain folder. Aborting..."
    exit 1
fi

echo "Initializing $CHAINID_1..."
$BINARY init test --home $CHAIN_DIR/$CHAINID_1 --chain-id=$CHAINID_1

echo "Adding accounts..."
echo $DEMO_MNEMONIC_1 | $BINARY keys add demowallet --home $CHAIN_DIR/$CHAINID_1 --recover --keyring-backend=test
echo $RLY_MNEMONIC_1 | $BINARY keys add rly --home $CHAIN_DIR/$CHAINID_1 --recover --keyring-backend=test 

/workspace/bin/agoric start local-chain >& agoric.log &

$HERMES_BINARY -c $CONFIG_DIR start >& hermes.log &
