"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ed25519 = require("@stablelib/ed25519");
function gen_key() {
    var _a = ed25519.generateKeyPair(), publicKey = _a.publicKey, secretKey = _a.secretKey;
    return { publicKey: publicKey, secretKey: secretKey };
}
function sign(priv_key, msg) {
    var res = ed25519.sign(priv_key, msg);
    return res;
}
function verify(publ_key, encoded_msg, signed_msg) {
    var res = ed25519.verify(publ_key, encoded_msg, signed_msg);
    return res;
}
function main() {
    var _a = gen_key(), publ_key = _a.publicKey, priv_key = _a.secretKey;
    console.log('[1] public  key: ', publ_key);
    console.log('[1] private key: ', priv_key);
    var msg = 'VC_no_1337';
    var encoded_msg = Buffer.from(msg);
    console.log('[*] msg: ', encoded_msg);
    var signed_msg = sign(priv_key, encoded_msg);
    console.log('[2] signed_msg: ', signed_msg);
    var res = verify(publ_key, encoded_msg, signed_msg);
    console.log('[3] result: ', res);
}
main();
