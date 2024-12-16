// lib/currencyConverter.ts

export const convertCurrency = (
  price: number,
  conversionRate: number,
  currency: "USD" | "EUR"
): string => {
  const convertedPrice =
    currency === "EUR" ? price * conversionRate : price / conversionRate;

  return `${convertedPrice.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${currency}`;
};
