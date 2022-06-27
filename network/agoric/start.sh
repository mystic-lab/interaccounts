#!/bin/bash

kill $(lsof -t -i:26657)

rm agoric.log

~/bin/agoric start local-chain >& agoric.log &
