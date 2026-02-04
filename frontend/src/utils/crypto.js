// Crypto utilities for passwordless authentication

// Generate RSA key pair
export async function generateKeyPair() {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: 'RSASSA-PKCS1-v1_5',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256',
    },
    true,
    ['sign', 'verify']
  );
  return keyPair;
}

// Export public key to PEM format
export async function exportPublicKey(publicKey) {
  const exported = await window.crypto.subtle.exportKey('spki', publicKey);
  const exportedAsString = String.fromCharCode.apply(null, new Uint8Array(exported));
  const exportedAsBase64 = window.btoa(exportedAsString);
  return `-----BEGIN PUBLIC KEY-----\n${exportedAsBase64}\n-----END PUBLIC KEY-----`;
}

// Store private key in IndexedDB
export async function storePrivateKey(privateKey, email) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('BolBazarAuth', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = async () => {
      const db = request.result;
      const transaction = db.transaction(['keys'], 'readwrite');
      const store = transaction.objectStore('keys');
      
      const exported = await window.crypto.subtle.exportKey('pkcs8', privateKey);
      store.put({ email, privateKey: exported });
      
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('keys')) {
        db.createObjectStore('keys', { keyPath: 'email' });
      }
    };
  });
}

// Retrieve private key from IndexedDB
export async function getPrivateKey(email) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('BolBazarAuth', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['keys'], 'readonly');
      const store = transaction.objectStore('keys');
      const getRequest = store.get(email);

      getRequest.onsuccess = async () => {
        if (!getRequest.result) {
          resolve(null);
          return;
        }

        const privateKey = await window.crypto.subtle.importKey(
          'pkcs8',
          getRequest.result.privateKey,
          {
            name: 'RSASSA-PKCS1-v1_5',
            hash: 'SHA-256',
          },
          true,
          ['sign']
        );
        resolve(privateKey);
      };

      getRequest.onerror = () => reject(getRequest.error);
    };
  });
}

// Sign a challenge
export async function signChallenge(challenge, privateKey) {
  const encoder = new TextEncoder();
  const data = encoder.encode(challenge);
  const signature = await window.crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    privateKey,
    data
  );
  
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}

// Get device information
export function getDeviceInfo() {
  const { userAgent, platform } = navigator;
  const screenInfo = `${screen.width}x${screen.height}`;
  return `${platform} - ${screenInfo}`;
}
