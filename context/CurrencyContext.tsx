"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type Currency = "USD" | "EUR";

interface CurrencyContextProps {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  conversionRate: number; // Taux USD -> EUR
}

const CurrencyContext = createContext<CurrencyContextProps | undefined>(
  undefined
);

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currency, setCurrency] = useState<Currency>("USD");
  const [conversionRate, setConversionRate] = useState<number>(1); // Par défaut : 1 pour USD

  // Fonction pour récupérer le taux de conversion
  const fetchConversionRate = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_EXCHANGE_RATE_API!;
      const response = await fetch(API_URL);
      const data = await response.json();

      console.log("Réponse de l'API :", data); // Debug : voir la structure complète de la réponse

      if (data && data.conversion_rates && data.conversion_rates.EUR) {
        setConversionRate(data.conversion_rates.EUR); // Stocke le taux EUR
      } else {
        console.error("Erreur lors de la récupération des taux de conversion");
        setConversionRate(0.85); // Taux de secours
      }
    } catch (error) {
      console.error(
        "Erreur réseau pour récupérer les taux de conversion :",
        error
      );
      setConversionRate(0.85); // Taux de secours
    }
  };

  useEffect(() => {
    fetchConversionRate(); // Appel au chargement du composant
  }, []);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, conversionRate }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextProps => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};
