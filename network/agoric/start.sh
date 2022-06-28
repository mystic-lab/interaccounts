#!/bin/bash

rm agoric.log

~/bin/agoric start local-chain >& agoric.log &
