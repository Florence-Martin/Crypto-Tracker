import React from "react";
import { useCurrency } from "@/context/CurrencyContext";

const CurrencySwitch: React.FC = () => {
  const { currency, setCurrency } = useCurrency();

  const handleCurrencyChange = (newCurrency: "USD" | "EUR") => {
    setCurrency(newCurrency);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
          currency === "USD"
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
        }`}
        onClick={() => handleCurrencyChange("USD")}
        aria-pressed={currency === "USD"}
      >
        $
      </button>
      <button
        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
          currency === "EUR"
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
        }`}
        onClick={() => handleCurrencyChange("EUR")}
        aria-pressed={currency === "EUR"}
      >
        €
      </button>
    </div>
  );
};

export default CurrencySwitch;
