use ed25519_dalek::Verifier;
use ed25519_dalek::{SecretKey, Signature, Signer, SigningKey};
use rand::{rngs::OsRng, RngCore};

fn main() {
    let mut csprng = OsRng;
    let mut secret_key: [u8; 32] = SecretKey::default();

    secret_key
        .iter_mut()
        .for_each(|v| *v = csprng.next_u32() as u8);

    // println!("sk: {:?}", secret_key);

    let signing_key = SigningKey::from_bytes(&secret_key);

    let message: &[u8] = b"This is a test of the tsunami alert system.";
    let signature: Signature = signing_key.sign(message);

    println!("signature r bytes: {:?}", signature.r_bytes());
    println!("signature s bytes: {:?}", signature.s_bytes());

    /// verification
    assert!(signing_key.verify(message, &signature).is_ok());

    {
        let test: Signature =
            Signature::from_components(signature.r_bytes().clone(), signature.s_bytes().clone());

        println!("111: {:?}", signature);
        println!("222: {:?}", test);
    }

    // // serialization
    // use ed25519_dalek::VerifyingKey;
    // use ed25519_dalek::{KEYPAIR_LENGTH, PUBLIC_KEY_LENGTH, SECRET_KEY_LENGTH, SIGNATURE_LENGTH};

    // // 1. encoding
    // let verifying_key_bytes: [u8; PUBLIC_KEY_LENGTH] = signing_key.verifying_key().to_bytes();
    // let secret_key_bytes: [u8; SECRET_KEY_LENGTH] = signing_key.to_bytes();
    // let signing_key_bytes: [u8; KEYPAIR_LENGTH] = signing_key.to_keypair_bytes();
    // let signature_bytes: [u8; SIGNATURE_LENGTH] = signature.to_bytes();

    // // 2. decoding
    // let verifying_key: VerifyingKey = VerifyingKey::from_bytes(&verifying_key_bytes).unwrap();
    // let signing_key: SigningKey = SigningKey::from_bytes(&signing_key_bytes);
    // let signature: Signature = Signature::try_from(&signature_bytes[..]).unwrap();
}
