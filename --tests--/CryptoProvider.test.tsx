import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, vi, expect } from "vitest";
import { CryptoProvider, useCrypto } from "../context/CryptoContext";
import { fetchCryptos } from "../services/cryptoService";

// Mock du service fetchCryptos
vi.mock("../services/cryptoService", () => ({
  fetchCryptos: vi.fn(),
}));

// Composant de test utilisant le contexte Crypto
const TestComponent = () => {
  const { cryptos, isLoading, error } = useCrypto();
  return (
    <div>
      <div data-testid="loading">{isLoading ? "Loading..." : "Loaded"}</div>
      <div data-testid="error">{error}</div>
      <ul data-testid="cryptos">
        {cryptos.map((crypto) => (
          <li key={crypto.id}>{crypto.name}</li>
        ))}
      </ul>
    </div>
  );
};

describe("CryptoProvider", () => {
  it("renders initial state correctly", () => {
    render(
      <CryptoProvider>
        <TestComponent />
      </CryptoProvider>
    );

    // Vérifie l'état initial
    expect(screen.getByTestId("loading").textContent).toBe("Loading...");
    expect(screen.getByTestId("error").textContent).toBe("");
    expect(screen.getByTestId("cryptos").children.length).toBe(0);
  });

  it("loads cryptos successfully", async () => {
    (fetchCryptos as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      [
        { id: 1, name: "Bitcoin" },
        { id: 2, name: "Ethereum" },
      ]
    );

    render(
      <CryptoProvider>
        <TestComponent />
      </CryptoProvider>
    );

    // Vérifie que les données sont chargées correctement
    await waitFor(() =>
      expect(screen.getByTestId("loading").textContent).toBe("Loaded")
    );
    expect(screen.getByTestId("cryptos").children.length).toBe(2);
    expect(screen.getByText("Bitcoin")).toBeTruthy();
    expect(screen.getByText("Ethereum")).toBeTruthy();
  });

  it("handles fetch error correctly", async () => {
    // Simule une erreur dans fetchCryptos
    (fetchCryptos as unknown as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error("Network error")
    );

    render(
      <CryptoProvider>
        <TestComponent />
      </CryptoProvider>
    );

    // Vérifie que le chargement se termine
    await waitFor(() =>
      expect(screen.getByTestId("loading").textContent).toBe("Loaded")
    );

    // Vérifie que l'état d'erreur est mis à jour correctement
    expect(screen.getByTestId("error").textContent).toBe(
      "Failed to fetch cryptocurrencies"
    );

    // Vérifie que la liste des cryptos reste vide
    expect(screen.getByTestId("cryptos").children.length).toBe(0);
  });

  it("throws an error if useCrypto is used outside of provider", () => {
    // Empêche l'erreur d'afficher dans la console
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    expect(() => render(<TestComponent />)).toThrow(
      "useCrypto must be used within a CryptoProvider"
    );

    // Restaure le comportement normal de console.error
    consoleError.mockRestore();
  });
});
