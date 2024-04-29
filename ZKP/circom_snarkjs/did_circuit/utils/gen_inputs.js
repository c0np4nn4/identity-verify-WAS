function replacer(key, value) {
  if (typeof value === 'bigint') {
    return Number(value.toString());
  } else {
    return value;
  }
}

let main = async () => {
  const buildEddsa = require("circomlibjs").buildEddsa;
  const buildBabyjub = require("circomlibjs").buildBabyjub;
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
  babyJub = await buildBabyjub();

  const msg = Buffer.from("00f1020304050607080900010203040506070809000102030405060708090011", "hex");

  const prvKey = Buffer.from("0001020304050607080900010203040506070809000102030405060708090001", "hex");

  const pubKey = eddsa.prv2pub(prvKey);

  const pPubKey = babyJub.packPoint(pubKey);

  const signature = eddsa.signPedersen(prvKey, msg);

  const pSignature = eddsa.packSignature(signature);
  const uSignature = eddsa.unpackSignature(pSignature);

  console.assert(eddsa.verifyPedersen(msg, uSignature, pubKey));

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
