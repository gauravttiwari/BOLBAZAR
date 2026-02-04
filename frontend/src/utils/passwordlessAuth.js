import {
  generateKeyPair,
  exportPublicKey,
  storePrivateKey,
  getPrivateKey,
  signChallenge,
  getDeviceInfo,
} from './crypto';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Passwordless Signup
export async function passwordlessSignup(fname, lname, email) {
  try {
    // Generate key pair
    const keyPair = await generateKeyPair();
    
    // Export public key
    const publicKey = await exportPublicKey(keyPair.publicKey);
    
    // Store private key
    await storePrivateKey(keyPair.privateKey, email);
    
    // Get device info
    const deviceInfo = getDeviceInfo();
    
    // Send signup request
    const response = await fetch(`${API_BASE_URL}/api/passwordless-auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fname,
        lname,
        email,
        publicKey,
        deviceInfo,
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Signup failed');
    }
    
    const data = await response.json();
    
    // Store token
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    
    return data;
  } catch (error) {
    console.error('Passwordless signup error:', error);
    throw error;
  }
}

// Passwordless Login
export async function passwordlessLogin(email) {
  try {
    // Request challenge
    const challengeResponse = await fetch(
      `${API_BASE_URL}/api/passwordless-auth/request-challenge`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      }
    );
    
    if (!challengeResponse.ok) {
      const error = await challengeResponse.json();
      throw new Error(error.message || 'Challenge request failed');
    }
    
    const { challenge } = await challengeResponse.json();
    
    // Get private key from IndexedDB
    const privateKey = await getPrivateKey(email);
    if (!privateKey) {
      throw new Error('No private key found. Please sign up first on this device.');
    }
    
    // Sign challenge
    const signature = await signChallenge(challenge, privateKey);
    
    // Verify signature
    const verifyResponse = await fetch(
      `${API_BASE_URL}/api/passwordless-auth/verify-challenge`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, signature }),
      }
    );
    
    if (!verifyResponse.ok) {
      const error = await verifyResponse.json();
      throw new Error(error.message || 'Login failed');
    }
    
    const data = await verifyResponse.json();
    
    // Store token
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    
    return data;
  } catch (error) {
    console.error('Passwordless login error:', error);
    throw error;
  }
}

// Get user's devices
export async function getUserDevices(email) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/passwordless-auth/devices/${email}`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch devices');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Get devices error:', error);
    throw error;
  }
}

// Remove a device
export async function removeDevice(email, deviceIndex) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/passwordless-auth/devices/${email}/${deviceIndex}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to remove device');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Remove device error:', error);
    throw error;
  }
}
