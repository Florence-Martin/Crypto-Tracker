// pour étendre la devise à toute l’application
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type Currency = "USD" | "EUR";

interface CurrencyContextProps {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  conversionRate: number; // Ex: taux USD -> EUR
}

const CurrencyContext = createContext<CurrencyContextProps | undefined>(
  undefined
);

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currency, setCurrency] = useState<Currency>("USD");
  const conversionRate = 0.85; // Exemple : 1 USD = 0.85 EUR

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
