function replacer(key, value) {
  if (typeof value === 'bigint') {
    return Number(value.toString());
  } else {
    return value;
  }
}

let main = async () => {
  const buildEddsa = require("circomlibjs").buildEddsa;
  // const buildBabyjub = require("circomlibjs").buildBabyjub;
  const fs = require("fs");

  function buffer2bits(buff) {
    const res = [];
    for (let i = 0; i < buff.length; i++) {
      for (let j = 0; j < 8; j++) {
        if ((buff[i] >> j) & 1) {
          res.push(1n);
        } else {
          res.push(0n);
        }
      }
    }
    return res;
  }


  let eddsa;
  let babyJub;

  eddsa = await buildEddsa();
  // babyJub = await buildBabyjub();

  // VC_no_1337
  const msg = Buffer.from("00f1020304050607080900010203040506070809000102030405060708090011", "hex");

  // NEAR Private Key
  // const prvKey = Buffer.from("0001020304050607080900010203040506070809000102030405060708090001", "hex");
  const prvKey = Buffer.from("eb1796f5dfdf6bead7eed7a44268ac359a287b45530455bfb7d12028ae2cd36a", "hex");
  console.log(prvKey.length)

  // deriv from prvKey
  const pubKey = eddsa.prv2pub(prvKey);
  console.log("1. [pubkey]: ", pubKey);

  // drive from pubKey
  const pPubKey = eddsa.babyJub.packPoint(pubKey);
  console.log("2. [pubkey]: ", pPubKey);

  // deriv from prvKey, msg
  const signature = eddsa.signPedersen(prvKey, msg);
  console.log("3. [sign]: ", signature);

  // deriv from Signature
  const pSignature = eddsa.packSignature(signature);
  console.log("4. [p sign]: ", pSignature);
  const uSignature = eddsa.unpackSignature(pSignature);

  // check validity
  console.assert(eddsa.verifyPedersen(msg, uSignature, pubKey));

  // output: {msg, pSignature, pPubKey}
  const msgBits = buffer2bits(msg);
  const r8Bits = buffer2bits(pSignature.slice(0, 32));
  const sBits = buffer2bits(pSignature.slice(32, 64));
  const aBits = buffer2bits(pPubKey);

  console.log("lenghts:", msgBits.length, r8Bits.length, sBits.length, aBits.length)

  // const inputs = {A: aBits, R8: r8Bits, S: sBits, msg: msgBits}

  const inputs = {
    isu_pub_key: aBits,
    sig_r: r8Bits,
    sig_s: sBits,
    msg: msgBits
  };

  console.log(inputs)

  fs.writeFileSync('./input.json', JSON.stringify(inputs, replacer));
}

main()
