#!/bin/bash
set -e

# Load shell variables
. ./network/hermes/variables.sh

### Sleep is needed otherwise the relayer crashes when trying to init
sleep 1s
### Restore Keys
$HERMES_BINARY --config ./network/hermes/config.toml keys restore agoric -p "m/44'/564'/0'/0/0" -m "record gift you once hip style during joke field prize dust unique length more pencil transfer quit train device arrive energy sort steak upset"
sleep 5s

$HERMES_BINARY --config ./network/hermes/config.toml keys restore theta-testnet-001 -m "record gift you once hip style during joke field prize dust unique length more pencil transfer quit train device arrive energy sort steak upset"
sleep 5s
