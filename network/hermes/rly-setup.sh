#!/bin/bash

# Send some BLD and RUN tokens to the rly account from the provision account
~/go/bin/agd tx bank send provision agoric13c4scsfy4tjvm3gqrry9fwmz8w7xa2tuprkzdm 100000000000ubld --gas auto --home=_agstate/keys --keyring-backend test -y --chain-id agoric
~/go/bin/agd tx bank send provision agoric13c4scsfy4tjvm3gqrry9fwmz8w7xa2tuprkzdm 100000000000urun --gas auto --home=_agstate/keys --keyring-backend test -y --chain-id agoric

agd tx bank send provision agoric13c4scsfy4tjvm3gqrry9fwmz8w7xa2tuprkzdm 100000000ubld --home ./_agstate/keys --keyring-backend test --chain-id agoric