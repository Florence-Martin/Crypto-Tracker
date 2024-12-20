import { useCrypto } from "@/context/CryptoContext";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { format } from "date-fns";
import { useCurrency } from "@/context/CurrencyContext"; // Importer le hook
import { convertCurrency } from "../../lib/convertCurrency"; // Importer la fonction de conversion

interface CryptoAlert {
  id: string;
  type: string;
  symbol: string;
  message: string;
  timestamp: Date;
  image: string;
}

interface CryptoAlertsProps {
  alerts: CryptoAlert[];
}

export default function CryptoAlert({ alerts }: CryptoAlertsProps) {
  const { cryptos } = useCrypto();
  const { currency, conversionRate } = useCurrency(); // Accéder à la devise et au taux de conversion

  console.log("Cryptos from context in CryptoAlert:", cryptos);

  const filteredCryptos = cryptos.filter((crypto) => crypto.symbol);
  console.log("Filtered cryptos:", filteredCryptos);

  const formatDate = (date: Date): string =>
    format(new Date(date), "dd/MM/yyyy HH:mm");

  const getCryptoData = (symbol: string) => {
    if (!symbol) return undefined;

    const normalizedSymbol = symbol.trim().toUpperCase();
    const result = filteredCryptos.find(
      (crypto) => crypto.symbol.trim().toUpperCase() === normalizedSymbol
    );

    if (!result) {
      console.warn(`No match found for symbol "${symbol}" in cryptos.`);
    }

    return result;
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-6">Recent Alerts</h1>
      <div className="space-y-4">
        {alerts.length > 0 ? (
          alerts.map((alert, index) => {
            const cryptoData = getCryptoData(alert.symbol);

            return (
              <Card
                key={`${alert.id}-${index}`}
                className="p-4 dark:border-white"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden">
                    <Image
                      src={alert.image || "/images/alertWarning.svg"}
                      alt={alert.type}
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-red-600">
                      {alert.type}
                    </h2>
                    <p>{alert.message}</p>
                    <p>{formatDate(alert.timestamp)}</p>
                    {cryptoData && (
                      <div>
                        <p>
                          Current Price:
                          <span className="ml-2">
                            {convertCurrency(
                              cryptoData.current_price ?? 0,
                              conversionRate,
                              currency
                            )}
                          </span>
                        </p>
                        <p>
                          24h Change:
                          <span
                            className={`ml-2 ${
                              cryptoData?.price_change_percentage_24h < 0
                                ? "text-red-500"
                                : "text-green-500"
                            }`}
                          >
                            {cryptoData?.price_change_percentage_24h ?? "N/A"}%
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        ) : (
          <p>No alerts available.</p>
        )}
      </div>
    </div>
  );
}
