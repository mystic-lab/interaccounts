/* eslint-disable import/no-extraneous-dependencies */
import 'ses/dist/ses.umd'; // adds lockdown, harden, and Compartment
import '@endo/eventual-send/shim'; // adds support needed by E

// Help lock down the JS environment.  The start compartment (current evaluation context)
// can still access powerful globals, but this start compartment can use `new Compartment(...)`
// to evaluate code with stricter confinement.
lockdown({
  errorTaming: 'unsafe',
  overrideTaming: 'severe',
});

Error.stackTraceLimit = Infinity;
