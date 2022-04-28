#!/bin/bash

# Create the agoric rly account
echo "y" | echo "record gift you once hip style during joke field prize dust unique length more pencil transfer quit train device arrive energy sort steak upset" | /workspace/agoric-sdk/golang/cosmos/build/agd keys add rly1 --home=_agstate/keys --keyring-backend test --recover

# Send some BLD and RUN tokens to the rly account from the provision account
/workspace/agoric-sdk/golang/cosmos/build/agd tx bank send provision agoric13c4scsfy4tjvm3gqrry9fwmz8w7xa2tuprkzdm 100000000000ubld --gas auto --home=_agstate/keys --keyring-backend test -y --chain-id agoric
/workspace/agoric-sdk/golang/cosmos/build/agd tx bank send provision agoric13c4scsfy4tjvm3gqrry9fwmz8w7xa2tuprkzdm 100000000000urun --gas auto --home=_agstate/keys --keyring-backend test -y --chain-id agoric