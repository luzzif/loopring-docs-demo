---
title: "EdDSA"
section: "Request signing"
ordering: 2
---

import { NoticeBox } from "../components/notice-box";

EdDSA is a signing method mainly used on balance-modifying requests, such as order/transfer submissions or withdrawals.

## Algorithm

Following we have a specification of the algorithm that can be used to sign off-chain requests using an EdDSA keypair.

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
-   Concatenate `Rx`,`Ry`, and `S`, appending `0x` in front (`0x${Rx}${Ry}${S}`).

### Example

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

## Generic signing example

We've seen a high-level explanation on how to perform EdDSA request body signing above, but now we'll see a practical example with some code written in Python.

In order to start, we first need to transform the request we want to send in an integer array, keeping a very specific order for the signed fields.

<NoticeBox mode="warning">
    The order in which various attributes are specified in the integer array is **fundamental** for the purpose of signature verification.
    This example is meant to be generic, but you can find specific information about how integer arrays can be constructed by consulting [Loopring's
    Specification](https://github.com/Loopring/protocols/blob/master/packages/loopring_v3/DESIGN.md).
</NoticeBox>

We then need to calculate the Poseidon hash of the array, and then sign the hash with the user's EdDSA private key.
Talk is cheap though, so here's a coded example that shows you how to generally construct a correct EdDSA signature.

```python
def sign_serialized_request(private_key, serialized_request, t):
    PoseidonHashParams = poseidon_params(
        SNARK_SCALAR_FIELD,
        t,
        6,
        53,
        b'poseidon',
        5,
        security_target = 128
    )
    hash = poseidon(serialized_request, PoseidonHashParams)
    wrapped_signature = PoseidonEdDSA.sign(hash, FQ(int(private_key)))
    return "0x" +
        str(wrapped_signature.sig.R.x).encode("utf-8").hex() +
        str(wrapped_signature.sig.R.y).encode("utf-8").hex() +
        str(wrapped_signature.sig.s).encode("utf-8").hex()

def serialize_request(request):
    # Again, this code is meant to be generic, check out Loopring protocol's
    # specification in order to know how to serialize requests depending
    # on their type.
    return [
        int(request["attribute1"]),
        int(request["attribute2"])
    ]

def sign_request(eddsa_private_key, request):
	serialized_request = serialize_request(request)
    # The second parameter passed here is the t value. It's paramount that
    # it conforms to the Loopring protocol in order for the signature to be valid
	signature = sign_serialized_request(serialized_request, 14)
    request.update(signaturen)
```

<NoticeBox mode="warning">
    If you don't use the _ethsnarks_ library to calculate Poseidon hash, please
    pay attention to the values of the Poseidon parameters to ensure that they
    are entirely consistent with those used by Loopring. Otherwise, signature
    verification will fail.
</NoticeBox>
