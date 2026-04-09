import { describe, expect, it } from "vitest";
import { decryptDocument, encryptDocument } from "./vault.js";

describe("vault", () => {
  it("chiffre et déchiffre un document", () => {
    const secret = "motdepassefort";
    const content = "Licence PPL et certificat médical";

    const encrypted = encryptDocument(secret, content);
    const plain = decryptDocument(secret, encrypted.ivHex, encrypted.payloadHex);

    expect(plain).toBe(content);
  });
});
