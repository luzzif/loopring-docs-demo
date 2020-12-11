---
title: "ECDSA"
section: "Request signing"
ordering: 3
---

EdDSA is the signing method of choice to be used on balance-modifying requests, such as order/transfer submissions or withdrawals.

Using ECDSA-based signatures mainly consists in using [EIP712](https://eips.ethereum.org/EIPS/eip-712) structured data hashing and signing to sign the request structure at hand.
For more information about the specific structures that need to be hashed for each request type, refer to [Loopring's protocol
specification](https://github.com/Loopring/protocols/blob/master/packages/loopring_v3/DESIGN.md).
