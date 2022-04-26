#!/bin/bash

# Configure predefined mnemonic pharses
BINARY=rly
CHAIN_DIR=./network/data
RELAYER_DIR=./relayer
MNEMONIC_2="record gift you once hip style during joke field prize dust unique length more pencil transfer quit train device arrive energy sort steak upset"
MNEMONIC_3="record gift you once hip style during joke field prize dust unique length more pencil transfer quit train device arrive energy sort steak upset"

# Ensure rly is installed
if ! [ -x "$(command -v $BINARY)" ]; then
    echo "$BINARY is required to run this script..."
    echo "You can download at https://github.com/cosmos/relayer"
    exit 1
fi

echo "Initializing $BINARY..."
$BINARY config init --home $CHAIN_DIR/$RELAYER_DIR

echo "Adding configurations for all chains..."
$BINARY config add-chains $PWD/network/relayer/interchain-acc-config/chains --home $CHAIN_DIR/$RELAYER_DIR
$BINARY config add-paths $PWD/network/relayer/interchain-acc-config/paths --home $CHAIN_DIR/$RELAYER_DIR

echo "Restoring accounts..."
$BINARY keys restore agoric agoric "$MNEMONIC_2" --home $CHAIN_DIR/$RELAYER_DIR
$BINARY keys restore theta-testnet-001 theta-testnet-001 "$MNEMONIC_3" --home $CHAIN_DIR/$RELAYER_DIR

echo "Initializing light clients for all chains..."
$BINARY light init agoric -f --home $CHAIN_DIR/$RELAYER_DIR
$BINARY light init theta-testnet-001 -f --home $CHAIN_DIR/$RELAYER_DIR

echo "Linking all chains..."
$BINARY tx link agoric-account-theta-testnet-001 --home $CHAIN_DIR/$RELAYER_DIR
$BINARY tx link agoric-account-theta-testnet-001-transfer --home $CHAIN_DIR/$RELAYER_DIR

echo "Starting to listen relayer..."
$BINARY start agoric-account-theta-testnet-001 --home $CHAIN_DIR/$RELAYER_DIR
$BINARY start agoric-account-theta-testnet-001-transfer --home $CHAIN_DIR/$RELAYER_DIR
