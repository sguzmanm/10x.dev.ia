import { describe, expect, it } from "vitest";
import { validateTweetText } from "../tweet-validator";

describe("Caso de uso: Validar texto de tweet", () => {
  it("DEBE aceptar un texto valido entre 1 y 280 caracteres", () => {
    const result = validateTweetText("Hello X clone");
    expect(result).toEqual({ valid: true });
  });

  it("NO DEBE permitir tweets vacios", () => {
    const result = validateTweetText("   ");
    expect(result).toEqual({
      valid: false,
      reason: "Tweet text cannot be empty",
    });
  });

  it("NO DEBE permitir tweets de mas de 280 caracteres", () => {
    const tooLong = "x".repeat(281);
    const result = validateTweetText(tooLong);
    expect(result).toEqual({
      valid: false,
      reason: "Tweet text exceeds 280 characters",
    });
  });
});
