---
title: "Overview"
section: "Request signing"
ordering: 1
---

Loopring's APIs involve three different authorization mechanism, and am single authentication one.
Authentication is generally performed by attaching the Loopring API key to a given API request through a specific `X-API-KEY` header parameter, while authorization for off-chain requests can be performed using the following methods:

-   ECDSA signature (mainly for account-related requests such as API key fetching, order canceling etc)
-   EdDSA signature (mainly for balance-related requests such as order submissions, transfer requests etc)
-   On-chain approval hash (mainly for AMM-related operations such as join/exit pool/s)

Signatures must be passed along with any additional data through a `X-API-SIG` header parameter on requests needing strong authorization guarantees.

In the next sections, we'll go over each of the signing methods listed above in more detail, explaining how each can be used to authenticate different requests.
