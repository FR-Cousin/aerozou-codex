import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

export type VaultDocument = {
  id: string;
  ownerId: string;
  name: string;
  createdAtUtc: string;
  ivHex: string;
  payloadHex: string;
};

const ALGO = "aes-256-gcm";

function deriveKey(secret: string): Buffer {
  return createHash("sha256").update(secret).digest();
}

export function encryptDocument(secret: string, content: string): { ivHex: string; payloadHex: string } {
  const key = deriveKey(secret);
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGO, key, iv);

  const encrypted = Buffer.concat([cipher.update(content, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return {
    ivHex: iv.toString("hex"),
    payloadHex: Buffer.concat([encrypted, authTag]).toString("hex"),
  };
}

export function decryptDocument(secret: string, ivHex: string, payloadHex: string): string {
  const key = deriveKey(secret);
  const iv = Buffer.from(ivHex, "hex");
  const payload = Buffer.from(payloadHex, "hex");

  const encrypted = payload.subarray(0, payload.length - 16);
  const authTag = payload.subarray(payload.length - 16);

  const decipher = createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(authTag);

  const plain = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return plain.toString("utf8");
}
