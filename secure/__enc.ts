// IMPORTANT: This file is SERVER-ONLY. Never import it from client components.

// import "server-only";
import crypto from "crypto";

const SECRET_KEY = process.env.NEXT_PUBLIC_ENC_KEY;
if (!SECRET_KEY) throw new Error("Missing ENC_KEY in environment (server-only variable)");

const keyBuffer = Buffer.from(SECRET_KEY, "hex");

// AES-256-CBC Encryption
export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", keyBuffer, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

// AES-256-CBC Decryption
export function decrypt(data?: string): string | null {
  if (!data) return null;
  try {
    const [ivHex, encrypted] = data.split(":");
    if (!ivHex || !encrypted) return null;
    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv("aes-256-cbc", keyBuffer, iv);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch {
    return null;
  }
}