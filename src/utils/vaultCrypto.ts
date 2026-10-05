/**
 * Stark Industries Cryptographic Vault Utility
 * Military-grade AES-256-GCM with PBKDF2 Key Derivation
 * Ensures bank credentials and sensitive account data are never stored in plain text.
 */

export interface EncryptedPayload {
  ciphertext: string; // Base64
  salt: string;       // Hex
  iv: string;         // Hex
  timestamp: number;
}

// Convert ArrayBuffer to Hex string
function bufToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Convert Hex string to Uint8Array
function hexToBuf(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
}

// Convert Uint8Array to Base64
function bufToBase64(buffer: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < buffer.byteLength; i++) {
    binary += String.fromCharCode(buffer[i]);
  }
  return btoa(binary);
}

// Convert Base64 to Uint8Array
function base64ToBuf(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Derives an AES-GCM 256-bit encryption key using PBKDF2 with 100,000 rounds
 */
async function deriveKey(masterSecret: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(masterSecret),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as unknown as BufferSource,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts sensitive bank credential data into a secure AES-256-GCM envelope
 */
export async function encryptVaultData(
  plaintext: string,
  masterKeySeed: string = 'STARK-SECURE-VAULT-2026'
): Promise<EncryptedPayload> {
  try {
    const enc = new TextEncoder();
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit standard for GCM

    const key = await deriveKey(masterKeySeed, salt);
    const encryptedBuf = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv as unknown as BufferSource,
      },
      key,
      enc.encode(plaintext)
    );

    return {
      ciphertext: bufToBase64(new Uint8Array(encryptedBuf)),
      salt: bufToHex(salt.buffer),
      iv: bufToHex(iv.buffer),
      timestamp: Date.now(),
    };
  } catch (err) {
    console.error('Cryptographic encryption failed:', err);
    throw new Error('Encryption vaulting failed');
  }
}

/**
 * Decrypts a secure AES-256-GCM envelope back to plaintext
 */
export async function decryptVaultData(
  payload: EncryptedPayload,
  masterKeySeed: string = 'STARK-SECURE-VAULT-2026'
): Promise<string> {
  try {
    const salt = hexToBuf(payload.salt);
    const iv = hexToBuf(payload.iv);
    const ciphertext = base64ToBuf(payload.ciphertext);

    const key = await deriveKey(masterKeySeed, salt);
    const decryptedBuf = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv as unknown as BufferSource,
      },
      key,
      ciphertext as unknown as BufferSource
    );

    const dec = new TextDecoder();
    return dec.decode(decryptedBuf);
  } catch (err) {
    console.error('Cryptographic decryption failed:', err);
    throw new Error('Invalid vault key or corrupted payload');
  }
}

/**
 * Generates SHA-256 hash for transaction ledger verification
 */
export async function generateTransactionHash(data: string): Promise<string> {
  const enc = new TextEncoder();
  const hashBuf = await crypto.subtle.digest('SHA-256', enc.encode(data));
  return '0x' + bufToHex(hashBuf).slice(0, 32);
}
