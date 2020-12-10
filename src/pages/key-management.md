---
title: "Key management"
section: "Fundamentals"
---

import { NoticeBox } from "../components/notice-box";

Loopring uses two key types in order to correctly authenticate/authorize API calls, namely a Loopring-generated key (extensively referred to as Loopring API key in the documentation) and an EdDSA keypair generated starting from your own Ethereum's private ECDSA key.

Each key has a very different role, and while the Loopring API key is used to authenticate the user performing the request (mainly on read operations), the EdDSA keypair is generally used to sign request in cases where a write operation must be performed on an account (examples might be withdrawal requests or order submission/cancelation).

## Obtaining your own EdDSA keypair and API key

For test purposes or to make certain applications either read or write informations on your own Loopring Exchange account on your behalf, you might want to quickly obtain you API key and EdDSA keypair from the Loopring Exchange's UI.

You can do so by going to the [Loopring Exchange's frontend](https://exchange.loopring.io/), unlocking your L2 account, accessing the right sidebar and clicking on "export account" among the items shown there.

The exported JSON should look something like the following:

```json
{
    "exchangeName": "LoopringDEX: Beta 1",
    "exchangeAddress": "0x944644Ea989Ec64c2Ab9eF341D383cEf586A5777",
    "accountAddress": "0xe9577b420d96adfc97ff1e9e0557f8c73d7247fe",
    "accountId": 12345,
    "apiKey": "qXJpfTKrF0O5jIDPYIu7YkVgLFbvm5uIgPKBmHP2kBpcdKZjgfFKhIlE8evo9lKa",
    "publicKeyX": "20230748339558541226323870947000799026059173889124399831342481595010628000129",
    "publicKeyY": "4980637490279511620100245514492532318691849019959343538108355525575855311214",
    "privateKey": "1242957328515765470505817310060337585626176314364086438653683782645761561015"
}
```

From this JSON file, you can extract your Loopring API key (`apiKey`), and your public EdDSA key (made up of the `publicKeyX` and `publicKeyY` attributes).

<NoticeBox mode="danger">
    The information contained in the above JSON structure should always remain confidential. 
    Your own personal EdDSA keypair and API key give the ability to any malicious actor to potentially steal your funds from your L2 account.
</NoticeBox>

## EdDSA keypair generation

The protocol does not define a specific way on which the EdDSA keypair must be generated or managed.

Loopring Exchange for example derives the EdDSA key pair from a seed obtained by hashing the output of the Ethereum signing of a specific message, which is exchange-specific and shown in the formula spec below. The message to be signed contains a nonce, so that keypairs can actually be updated in extreme cases.

The formula used to determine the seed is:

```
sha256(ethereumSigning("Sign this message to access Loopring Exchange: {exchangeAddress} with key nonce: {nonce}"))
```
