---
title: "Request signing"
section: "Fundamentals"
---

import { NoticeBox } from "../components/notice-box";

Loopring's API involves three different authorization mechanism, and an authentication one.
Authentication is generally performed by attaching the Loopring API key to a given API request, while authorization for off-chain requests can be performed using the following methods:

-   ECDSA signature
-   EdDSA signature
-   On-chain approval hash

## EdDSA-based request authorization

### Algorithm

Following we have a specification of the algorithm that can be used to sign off-chain requests using an EdDSA keypair.
EdDSA-based authorization is generally passed along in a specific header, called `X-API-SIG`.

-   Initialize `signatureBase` to an empty string.
-   Append the API's HTTP method (either `GET`, `POST`, `PUT` or `DELETE`, in all uppercase) to `signatureBase`.
-   Append `'＆'` (blank space) to `signatureBase`.
-   Append _percent-encoded_ full URL path (including protocol, and without `?` or any query parameters) to `signatureBase`.
-   Append `'&'` to `signatureBase`.
-   Initialize `parameterString` to an empty string.
-   For `GET`/`DELETE` requests:
    -   Sort query parameters in ascending order lexicographically;
    -   Append _percent-encoded_ key name to `parameterString`;
    -   Append an `'='` to `parameterString`;
    -   Append _percent-encoded_ value to `parameterString`;
    -   Append a `'&'` if there are more key value pairs.
-   For `POST`/`PUT` requests:
    -   Append request body as a string to `parameterString`.
-   Append _percent-encoded_ `parameterString` to `signatureBase`
-   Calculate the **SHA-256** hash of `signatureBase` as `hash`.
-   Sign `hash` with the EdDSA private key and get `Rx`, `Ry`, and `S`.
-   Concatenate `Rx`,`Ry`, and`S` using `','` as: `${Rx},${Ry},${S}`.

#### Example

For the above url with the following url query parameters:

```
https://api.loopring.io/api/v2/apiKey?publicKeyX=13375450901292179417154974849571793069
911517354720397125027633242680470075859&publicKeyY=133754509012921794171549748495717930
69911517354720397125027633242680470075859&accountId=1
```

`parameterString` shoule be:

```
accountId=1&publicKeyX=1337545090129217941715497484957179306991151735472039712502763324
2680470075859&publicKeyY=13375450901292179417154974849571793069911517354720397125027633
242680470075859
```

and `signatureBase` should be:

```
GET&https%3A%2F%2Fapi.loopring.io%2Fapi%2Fv2%2FapiKey&accountId%3D1%26publicKeyX%3D1337
5450901292179417154974849571793069911517354720397125027633242680470075859%26publicKeyY%
3D13375450901292179417154974849571793069911517354720397125027633242680470075859
```

Loopring 3.6, in addition, handles API requests that will result in modifications to the L2 Merkle tree by asking for additional signature authorization regarding request bodies.

In order to compute the required signature:

-   Regularize the request body `r` (JSON) to generate a string `s`.
-   Calculate the **Poseidon** hash `h` of `s` as (see [signing example](#signing-orders) for an example).
-   Sign `h` with the account's EdDSA private key `privateKey` and get three values: `Rx`,`Ry`, and `S` (see the following section).
-   Combine `Rx`, `Ry`, and `S` into an hexadecimal strings as such: `0x{Rx}{Ry}{S}`.

This additional signature is generally passed along with the request body, and included among its the attribute (generally using an `eddsaSignature` key).

### Generic signing example

You need to seralized specific fields of an order into an integer array, then calculate the Poseidon hash of the array, and then sign the hash with your EdDSA private key.

<NoticeBox mode="info">
    The rules for serialization of orders, hashing, and signature methods must
    strictly follow [Loopring's
    Specification](https://github.com/Loopring/protocols/blob/master/packages/loopring_v3/DESIGN.md).
</NoticeBox>

Below we use Python code as a demo:

```python
def sign_int_array(privateKey, serialized, t):
    PoseidonHashParams = poseidon_params(
        SNARK_SCALAR_FIELD,
        t,
        6,
        53,
        b'poseidon',
        5,
        security_target=128
    )

    hash = poseidon(serialized, PoseidonHashParams)
    signedMessage = PoseidonEdDSA.sign(hash, FQ(int(privateKey)))
    return ({
        "hash": str(hash),
        "signatureRx": str(signedMessage.sig.R.x),
        "signatureRy": str(signedMessage.sig.R.y),
        "signatureS": str(signedMessage.sig.s),
    })

def serialize_order(order):
    return [
        int(order["exchangeId"]),
        int(order["orderId"]),
        int(order["accountId"]),
        int(order["tokenSId"]),
        int(order["tokenBId"]),
        int(order["amountS"]),
        int(order["amountB"]),
        int(order["allOrNone"]=="true"),
        int(order["validSince"]),
        int(order["validUntil"]),
        int(order["maxFeeBips"]),
        int(order["buy"]=="true"),
        int(order["label"])
    ]

def sign_order(privateKey, order):
	serialized = serialize_order(order)
	signed = sign_int_array(serialized, 14 /* Pay attention to this t value */)
    order.update(signed)
```

<NoticeBox mode="info">
    If you don't use the _ethsnarks_ library to calculate Poseidon hash, please
    pay attention to the values of the Poseidon parameters to ensure that they
    are entirely consistent with those used by Loopring. Otherwise, signature
    verification will fail.
</NoticeBox>
