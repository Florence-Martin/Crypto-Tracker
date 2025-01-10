// Récupère les données des cryptos via le contexte useCrypto.
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchCryptos, Crypto } from "../services/cryptoService";

interface CryptoContextProps {
  cryptos: Crypto[]; // Liste des cryptos disponibles
}

const CryptoContext = createContext<CryptoContextProps | undefined>(undefined);

interface CryptoContextProps {
  cryptos: Crypto[];
  isLoading: boolean;
  error: string | null;
}

export const CryptoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cryptos, setCryptos] = useState<Crypto[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching cryptos...");
        const data = await fetchCryptos();
        setCryptos(data);
        setError(null);
      } catch {
        setError("Failed to fetch cryptocurrencies");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <CryptoContext.Provider value={{ cryptos, isLoading, error }}>
      {children}
    </CryptoContext.Provider>
  );
};

export const useCrypto = (): CryptoContextProps => {
  const context = useContext(CryptoContext);
  if (!context) {
    throw new Error("useCrypto must be used within a CryptoProvider");
  }
  return context;
};
