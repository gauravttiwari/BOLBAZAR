const crypto = require('crypto');

// Generate a random challenge for authentication
function generateChallenge() {
  return crypto.randomBytes(32).toString('base64');
}

// Verify RSA signature
function verifySignature(publicKeyPEM, challenge, signature) {
  try {
    console.log('🔍 Verifying signature...');
    console.log('📝 Challenge:', challenge);
    console.log('📝 Signature (first 50 chars):', signature.substring(0, 50));
    console.log('🔑 Public Key (first 100 chars):', publicKeyPEM.substring(0, 100));
    
    const verify = crypto.createVerify('SHA256');
    verify.update(challenge);
    verify.end();
    
    const result = verify.verify(publicKeyPEM, signature, 'base64');
    console.log('✅ Verification result:', result);
    return result;
  } catch (error) {
    console.error('❌ Signature verification error:', error.message);
    return false;
  }
}

module.exports = {
  generateChallenge,
  verifySignature
};
