pragma circom 2.1.6;

include "../node_modules/circomlib/circuits/eddsa.circom";

template ZolGwa(n) {
  signal input msg[n];
  signal input isu_pub_key[256];  // public key
  signal input sig_r[256];        // signature r
  signal input sig_s[256];        // signature s

  component eddsa =  EdDSAVerifier(256);

  eddsa.msg <-- msg;
  eddsa.A <-- isu_pub_key;
  eddsa.R8 <-- sig_r;
  eddsa.S <-- sig_s;
}

component main{public [isu_pub_key]} = ZolGwa(256);
