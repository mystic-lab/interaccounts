#!/bin/bash
set -e

# Load shell variables
. ./network/hermes/variables.sh

### Configure the clients and connection
echo "Initiating connection handshake..."
$HERMES_BINARY -c $CONFIG_DIR create connection agoric osmosis
$HERMES_BINARY -c $CONFIG_DIR create connection agoric gaia

sleep 2
