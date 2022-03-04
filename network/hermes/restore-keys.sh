#!/bin/bash
set -e

# Load shell variables
. ./network/hermes/variables.sh

### Sleep is needed otherwise the relayer crashes when trying to init
sleep 1s
### Restore Keys
<<<<<<< HEAD
$HERMES_BINARY -c ./network/hermes/config.toml keys restore agoric -p "m/44'/564'/0'/0/0" -m "alley afraid soup fall idea toss can goose become valve initial strong forward bright dish figure check leopard decide warfare hub unusual join cart"
=======
$HERMES_BINARY -c ./network/hermes/config.toml keys restore agoric -m "alley afraid soup fall idea toss can goose become valve initial strong forward bright dish figure check leopard decide warfare hub unusual join cart"
>>>>>>> 4c0fa0105dee057907351500946c20b90ce082c5
sleep 5s

$HERMES_BINARY -c ./network/hermes/config.toml keys restore osmosis -m "record gift you once hip style during joke field prize dust unique length more pencil transfer quit train device arrive energy sort steak upset"
sleep 5s

$HERMES_BINARY -c ./network/hermes/config.toml keys restore gaia -m "license bulk van praise awake clown annual material direct angry unfair hollow spoil wage peasant tissue gold supreme boost slab parade artwork spawn couch"
sleep 5s
