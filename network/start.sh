#!/bin/bash

BINARY=agd
AGORIC_CHAIN_DIR=./_agstate/agoric-servers/local-chain-26657
CHAIN_DIR=./network/data
CHAINID_1=osmosis
CHAINID_2=agoric
CHAINID_3=gaia
GRPCPORT_1=7090
GRPCPORT_2=9090
GRPCPORT_3=8090
GRPCWEB_1=7091
GRPCWEB_2=9091
GRPCWEB_3=8091


#echo "Starting $CHAINID_2 in $CHAIN_DIR..."
#echo "Creating log file at $AGORIC_CHAIN_DIR.log"
#$BINARY start --log_level trace --log_format json --home $AGORIC_CHAIN_DIR --pruning=nothing --grpc.address="0.0.0.0:$GRPCPORT_2" --grpc-web.address="0.0.0.0:$GRPCWEB_2" > $AGORIC_CHAIN_DIR.log 2>&1 &

#echo "Sleeping for 10 minutes to allow for Agoric swingset setup"
#sleep 300

echo "Starting Osmosis in $CHAIN_DIR..."
echo "Creating log file at $CHAIN_DIR/osmosis.log"
osmosisd start --log_level trace --log_format json --home $CHAIN_DIR/$CHAINID_1 --pruning=nothing --grpc.address="0.0.0.0:$GRPCPORT_1" --grpc-web.address="0.0.0.0:$GRPCWEB_1" > $CHAIN_DIR/$CHAINID_1.log 2>&1 &

echo "Starting Cosmos/Gaia in $CHAIN_DIR..."
echo "Creating log file at $CHAIN_DIR/gaia.log"
gaiad start --log_level trace --log_format json --home $CHAIN_DIR/$CHAINID_3 --pruning=nothing --grpc.address="0.0.0.0:$GRPCPORT_3" --grpc-web.address="0.0.0.0:$GRPCWEB_3" > $CHAIN_DIR/$CHAINID_3.log 2>&1 &
