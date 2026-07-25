import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const SECRET_KEY =
  process.env.ENCRYPTION_KEY ||
  process.env.NEXTAUTH_SECRET ||
  (process.env.NODE_ENV !== "production"
    ? "verdict-dev-encryption-key-32b-secret"
    : null);

if (!SECRET_KEY) {
  throw new Error(
    "CRITICAL SECURITY ERROR: ENCRYPTION_KEY environment variable is required."
  );
}

// Ensure key length is exactly 32 bytes for aes-256-gcm
function getKey(): Buffer {
  return crypto.createHash("sha256").update(SECRET_KEY as string).digest();
}

/**
 * Encrypts an API key string using AES-256-GCM.
 * Format: enc_v1:<iv_hex>:<authTag_hex>:<ciphertext_hex>
 */
export function encryptKey(plainKey: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
  let encrypted = cipher.update(plainKey, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");

  return `enc_v1:${iv.toString("hex")}:${authTag}:${encrypted}`;
}

/**
 * Decrypts an AES-256-GCM encrypted key string.
 */
export function decryptKey(encryptedKey: string): string {
  if (!encryptedKey.startsWith("enc_v1:")) {
    return encryptedKey.replace(/^enc_/, "");
  }

  const parts = encryptedKey.split(":");
  if (parts.length !== 4) {
    throw new Error("Invalid encrypted key format");
  }

  const [, ivHex, tagHex, cipherTextHex] = parts;
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(tagHex, "hex");
  const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(cipherTextHex, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
