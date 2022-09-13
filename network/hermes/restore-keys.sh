#!/bin/bash
set -e

# Load shell variables
. ./network/hermes/variables.sh

### Sleep is needed otherwise the relayer crashes when trying to init
sleep 1s
### Restore Keys
$HERMES_BINARY --config ./network/hermes/config.toml keys add --key-name agoric --hd-path "m/44'/564'/0'/0/0" --mnemonic-file $HERMES_DIRECTORY/mnemonic.txt --chain agoric --overwrite
sleep 5s

$HERMES_BINARY --config ./network/hermes/config.toml keys add --key-name theta-testnet-001 --mnemonic-file $HERMES_DIRECTORY/mnemonic.txt --chain theta-testnet-001 --overwrite
sleep 5s
