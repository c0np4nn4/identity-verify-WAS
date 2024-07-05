const nearApi = require('near-api-js')

// NEVER SHARE your private (secret) keys! (The key I used below is not used anywhere)
const keyPair = nearApi.KeyPair.fromString('ed25519:3onivihW6fQRkB4NKiYUfXvzxQc1BkJ6B7hzUGLawPQYeDH4Q92QRWjoGXLfE3mdxXNVy3yoHe95yj9RQCEdghBh')

console.log(keyPair.getPublicKey().toString())
