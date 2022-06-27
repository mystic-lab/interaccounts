#!/bin/bash

# Install the specialized, agoric sdk for ICA
cd $HOME
yes | rm -r agoric-sdk
git clone https://github.com/schnetzlerjoe/agoric-sdk
cd agoric-sdk
yarn install
yarn build
yarn link-cli ~/bin/agoric
cd ./packages/cosmic-swingset && make