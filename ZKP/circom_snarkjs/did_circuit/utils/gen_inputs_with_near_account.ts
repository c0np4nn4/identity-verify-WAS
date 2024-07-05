import bs58 from 'bs58';
import * as ed25519 from '@stablelib/ed25519';

// for test
const ISSUER_PRI_KEY = "3onivihW6fQRkB4NKiYUfXvzxQc1BkJ6B7hzUGLawPQYeDH4Q92QRWjoGXLfE3mdxXNVy3yoHe95yj9RQCEdghBh";

// const ISSUER_PRI_KEY = "eb1796f5dfdf6bead7eed7a44268ac359a287b45530455bfb7d12028ae2cd36a";
const ISSUER_PUB_KEY = "5CE818E633D55124B5872E5075E878FB1D5D0CAE8C79963992223A5B998F5298";

// for test
import * as fs from "fs";
import { buildBabyjub, buildEddsa } from 'circomlibjs';


function replacer(_: any, value: any) {
  if (typeof value === 'bigint') {
    return Number(value.toString());
  } else {
    return value;
  }
}


// // inputs 객체 반환하는 함수
// let generateZkProof = async (vcNumberString: string, proofValue: string, hexIssuerPubKey: string) => {

//   function buffer2bits(buff: Buffer) {
//     const res: bigint[] = [];
//     for (let i = 0; i < buff.length; i++) {
//       for (let j = 0; j < 8; j++) {
//         if ((buff[i] >> j) & 1) {
//           res.push(1n);
//         } else {
//           res.push(0n);
//         }
//       }
//     }
//     return res;
//   }

//   // 1. msg
//   const msg: Buffer = Buffer.from(padLeftTo32(stringToHexString(vcNumberString), '0'));

//   // 2. (issuer) public key
//   let pubKeyHexBuffer: Buffer = Buffer.from(bs58.decode(hexIssuerPubKey));

//   // 3. Signature (sign with Issuer private key)
//   const sigBuffer = Buffer.from(bs58.decode(proofValue))

//   console.log(sigBuffer.length)

//   // 3-1. split signature into `r_sig` and `s_sig`
//   const r_sig = sigBuffer.subarray(32, 64);
//   const s_sig = sigBuffer.subarray(0, 32);

//   console.log("[test]: ", msg.toString())
//   console.log("[test]: ", r_sig.toString())
//   console.log("[test]: ", s_sig.toString())
//   console.log("[test]: ", pubKeyHexBuffer.toString())

//   const msgBits = buffer2bits(msg);
//   const r8Bits = buffer2bits(r_sig);
//   const sBits = buffer2bits(s_sig);
//   const aBits = buffer2bits(pubKeyHexBuffer);

//   console.log("lenghts:", msgBits.length, r8Bits.length, sBits.length, aBits.length)

//   const inputs = {
//     isu_pub_key: aBits,
//     sig_r: r8Bits,
//     sig_s: sBits,
//     msg: msgBits
//   };


//   console.log(inputs)

//   fs.writeFileSync('./input.json', JSON.stringify(inputs, replacer));

//   return inputs
// }




// inputs 객체 반환하는 함수
let generateZkProof = async (vcNumberString: string, proofValue: string, hexIssuerPubKey: string) => {

  function buffer2bits(buff: Buffer) {
    const res: bigint[] = [];
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


  // 1. msg
  const msg: Buffer = Buffer.from(padLeftTo32(stringToHexString(vcNumberString), '0'));

  // 2. (issuer) public key
  let pubKeyHexBuffer: Buffer = Buffer.from(bs58.decode(hexIssuerPubKey));

  // 3. Signature (sign with Issuer private key)
  const sigBuffer = Buffer.from(bs58.decode(proofValue))

  console.log(sigBuffer.length)

  // 3-1. split signature into `r_sig` and `s_sig`
  const r_sig = sigBuffer.subarray(32, 64);
  const s_sig = sigBuffer.subarray(0, 32);

  // console.log("[test]: ", msg.toString())
  // console.log("[test]: ", r_sig.toString())
  // console.log("[test]: ", s_sig.toString())
  // console.log("[test]: ", pubKeyHexBuffer.toString())

  const msgBits = buffer2bits(msg);
  const r8Bits = buffer2bits(r_sig);
  const sBits = buffer2bits(s_sig);
  const aBits = buffer2bits(pubKeyHexBuffer);

  // console.log("lenghts:", msgBits.length, r8Bits.length, sBits.length, aBits.length)

  const inputs = {
    isu_pub_key: aBits,
    sig_r: r8Bits,
    sig_s: sBits,
    msg: msgBits
  };


  // console.log(inputs)

  fs.writeFileSync('./input.json', JSON.stringify(inputs, replacer));

  return inputs
}


// function form 'BE/issuer/issuer-api.service.ts'
let genMockProofValue = async (): Promise<{ proofValue: string, mock_message: string }> => {
  // test
  let eddsa;
  let babyJub;

  eddsa = await buildEddsa();
  babyJub = await buildBabyjub();
  const prvKey = Buffer.from(ISSUER_PRI_KEY, "hex");
  // const prvKey = Buffer.from("8c61e9b6c4d4da52efec688d7e969fa0324d898778e87b59b80f9684028c270d3746f53a4df63b5db65e5bb78a4bd38c4e217339150b7e2b28d6a3a36f3241c4", "hex");
  // const prvKey = Buffer.from("12", "hex");

  // deriv from prvKey
  const pubKey = eddsa.prv2pub(prvKey);
  const pPubKey = eddsa.babyJub.packPoint(pubKey);

  console.log("[genMockProofValue] pubkey 11: ", pPubKey);
  console.log("[genMockProofValue] pubkey 22: ", ISSUER_PUB_KEY);
  // console.log("[genMockProofValue] pubkey 22: ", bs58.decode(ISSUER_PUB_KEY));

  // ---------------

  const mock_message: string = "VC_no_1337";
  return {
    proofValue: bs58.encode(
      ed25519.sign(bs58.decode(ISSUER_PRI_KEY), Buffer.from(mock_message)),
    ),
    mock_message,
  };
}

function padLeftTo32(input: string, padChar: string = '0'): string {
  if (input.length >= 32) {
    return input.slice(0, 32);
  }

  const padLength = 32 - input.length;
  const padding = padChar.repeat(padLength);

  return padding + input;
}


function stringToHexString(msg: string): string {
  let res: string = "";
  for (let i = 0; i < msg.length; i++) {
    let tmp: string = msg.charCodeAt(i).toString(16);
    while (tmp.length < 2) {
      tmp = '0' + tmp;
    }
    res += tmp;
  }
  return res;
}

// ------------------------------------------------------------
//  execution part
// ------------------------------------------------------------

let main = async () => {
  const { proofValue, mock_message } = await genMockProofValue();


  generateZkProof(
    //
    // 메세지: `VC_no_1337`
    mock_message,
    //
    // proofValue: 시그니처
    proofValue,
    //
    // Issuer public key (base58 인코딩된거)
    ISSUER_PUB_KEY
  );
}

main();
