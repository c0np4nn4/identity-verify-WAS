import * as ed25519 from '@stablelib/ed25519';

function gen_key() {
  const { publicKey, secretKey } = ed25519.generateKeyPair()

  return { publicKey, secretKey };
}

function sign(priv_key: Uint8Array, msg: Uint8Array) {

  const res = ed25519.sign(
    priv_key, msg
  );

  return res;
}

function verify(
  publ_key: Uint8Array,
  encoded_msg: Uint8Array,
  signed_msg: Uint8Array,
) {

  const res = ed25519.verify(
    publ_key,
    encoded_msg,
    signed_msg
  );

  return res;
}

function main() {
  const { publicKey: publ_key, secretKey: priv_key } = gen_key();
  console.log("[1] public  key: ", publ_key);
  console.log("[1] private key: ", priv_key);

  const msg = "VC_no_1337";
  const encoded_msg = Buffer.from(msg);
  const signed_msg: Uint8Array = sign(priv_key, encoded_msg);
  console.log("[2] signed_msg: ", signed_msg);

  const res = verify(publ_key, encoded_msg, signed_msg);
  console.log("[3] result: ", res);
}


main()
