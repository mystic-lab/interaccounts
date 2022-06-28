#!/bin/bash

# Kill tendermint
kill $(lsof -t -i:26657)
# kill ag-solo
kill $(lsof -t -i:8000)
# kill hermes
kill $(lsof -t -i:3000)
