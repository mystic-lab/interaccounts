// eslint-disable-next-line import/no-extraneous-dependencies
import { test } from '@agoric/swingset-vat/tools/prepare-test-env-ava.js';

import { gettingStartedWorkflowTest } from 'agoric/tools/getting-started.js';

test('workflow', t => {
  return gettingStartedWorkflowTest(t, {
    init: [
      '--dapp-template', 'dapp-fungible-faucet',
      '--dapp-branch', process.env.GITHUB_HEAD_REF,
    ]
  })
});
