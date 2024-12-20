export const convertCurrency = (
  price: number,
  conversionRate: number,
  currency: "USD" | "EUR"
): string => {
  // Ne pas convertir si la devise est USD
  const convertedPrice = currency === "EUR" ? price * conversionRate : price;

  // Formatage du prix
  return `${convertedPrice.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${currency}`;
};
