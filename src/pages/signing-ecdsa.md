---
title: "ECDSA"
section: "Request signing"
ordering: 3
---

ECDSA is an additional signing method that can be used on balance-modifying requests, such as order/transfer submissions or withdrawals.

Using ECDSA-based signatures mainly consists in using [EIP-712](https://eips.ethereum.org/EIPS/eip-712) structured data hashing and signing to sign the request structure at hand.
For more information about the specific structures that need to be hashed for each request type, refer to [Loopring's protocol
specification](https://github.com/Loopring/protocols/blob/master/packages/loopring_v3/DESIGN.md).

## Example

Let's have a look at a brief example.

The following lines of code represent what has to be done to sign a generic request. The example uses `web3js` (which has to have a preloaded Ethereum account, either by manually loading it through a private key or by using an injected Ethereum provider such as the one provided by Metamask). Since we're using `web3js`, the example at hand is written using `JavaScript`.

```js
import sha256 from 'crypto-js/sha256';

// encoding the request in order to make it ready to be signed
const encodeRequest = (request) => {
    const hashableInput = JSON.stringify(
        // this is a generic example, but in a real one, this request should
        // be encoded using a very specific format
        request
    );
    // notice that the output is going to be interpreted as an hex string
    return `0x${sha256(hashableInput).toString())}`;
}

const unsignedRequest = {
    // request body
};

// perform signature using web3.eth.sign. The passed in `unlockedAccountAddress`
// has to be, like the name says, an unlocked web3js account
const signature = await web3.eth.sign(encodeRequest(unsignedRequest), unlockedAccountAddress);
```

Once this has been executed, we end up with the `signature` variable. This now contains the value that must be passed in the `X-API-SIG` header to make the request correctly authorized.
