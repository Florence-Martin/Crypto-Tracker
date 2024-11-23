"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchCryptos, Crypto } from "@/services/cryptoService"; // Import du service et du type

interface CryptoContextProps {
  cryptos: Crypto[]; // Liste des cryptos disponibles
}

const CryptoContext = createContext<CryptoContextProps | undefined>(undefined);

export const CryptoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cryptos, setCryptos] = useState<Crypto[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCryptos(); // Appelle le service fetchCryptos
        setCryptos(data); // Met à jour l'état avec les données
      } catch (error) {
        console.error("Failed to fetch cryptocurrencies:", error);
      }
    };

    fetchData();
  }, []); // Le hook ne s'exécute qu'une seule fois au montage

  return (
    <CryptoContext.Provider value={{ cryptos }}>
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
