import { convertCurrency } from "../lib/convertCurrency";
import { describe, it, expect } from "vitest";

describe("convertCurrency", () => {
  it("returns the price unchanged when the currency is USD", () => {
    const result = convertCurrency(100, 1.1, "USD");
    expect(result).toBe("100,00 USD"); // Vérifie que le prix reste inchangé
  });

  it("converts the price to EUR when the currency is EUR", () => {
    const result = convertCurrency(100, 1.1, "EUR");
    expect(result).toBe("110,00 EUR"); // Vérifie que le prix est bien multiplié par le taux
  });

  it("formats the price with two decimal places", () => {
    const result = convertCurrency(123.456, 1.1, "USD");
    expect(result).toBe("123,46 USD"); // Vérifie l'arrondi à deux décimales
  });

  it("handles zero price correctly", () => {
    const result = convertCurrency(0, 1.1, "EUR");
    expect(result).toBe("0,00 EUR"); // Vérifie que le zéro est bien formaté
  });

  it("handles zero conversion rate correctly for EUR", () => {
    const result = convertCurrency(100, 0, "EUR");
    expect(result).toBe("0,00 EUR"); // Vérifie que le prix devient 0 avec un taux de conversion 0
  });

  it("handles large numbers correctly", () => {
    const result = convertCurrency(1_000_000, 1.2, "EUR");
    expect(result).toMatch(/1\s200\s000,00 EUR/); // \s correspond à tout type d'espace
  });
});
