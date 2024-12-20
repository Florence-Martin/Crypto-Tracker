import { usePortfolio } from "../../context/PortfolioContext";
import { useCrypto } from "../../context/CryptoContext";
import { Card } from "@/components/ui/card";
import { DollarSign, TrendingUp } from "lucide-react";
import { useCurrency } from "../../context/CurrencyContext"; // Importer le contexte de devise
import { convertCurrency } from "../../lib/convertCurrency"; // Importer la fonction de conversion

interface PortfolioMetric {
  icon: JSX.Element;
  label: string;
  value: string;
  className?: string;
}

export default function PortfolioOverview() {
  const { portfolio } = usePortfolio();
  const { cryptos } = useCrypto();
  const { currency, conversionRate } = useCurrency(); // Récupère la devise et le taux de conversion

  // Regrouper les cryptos identiques dans le portefeuille
  const groupedPortfolio = portfolio.reduce(
    (
      accumulator: {
        [key: string]: {
          quantity: number;
          total_value: number;
          current_price: number;
          id: string;
        };
      },
      item
    ) => {
      if (accumulator[item.id]) {
        accumulator[item.id].quantity += item.quantity;
        accumulator[item.id].total_value += item.quantity * item.current_price;
      } else {
        accumulator[item.id] = {
          ...item,
          total_value: item.quantity * item.current_price,
        };
      }
      return accumulator;
    },
    {}
  );

  // Transformer l'objet regroupé en tableau
  const portfolioArray = Object.values(groupedPortfolio);

  // Calculer la valeur actuelle et les gains/pertes pour chaque crypto
  const updatedPortfolio = portfolioArray.map((item) => {
    const matchingCrypto = cryptos.find((crypto) => crypto.id === item.id);

    const currentPrice = matchingCrypto?.current_price || item.current_price;
    const priceChange = matchingCrypto?.price_change_percentage_24h || 0;

    return {
      ...item,
      current_price: currentPrice,
      total_value: item.quantity * currentPrice,
      priceChange: parseFloat(priceChange.toFixed(2)), // Utilisation directe de `price_change_percentage_24h`
      gainLossValue:
        item.quantity * (currentPrice - item.total_value / item.quantity),
    };
  });

  // Calculer la valeur totale du portefeuille
  const totalValue = updatedPortfolio.reduce(
    (acc, item) => acc + item.total_value,
    0
  );

  // Convertir la valeur totale du portefeuille dans la devise sélectionnée
  const convertedTotalValue = convertCurrency(
    totalValue,
    conversionRate,
    currency
  );

  // Calculer les gains/pertes totaux en valeur monétaire
  const totalGainLossValue = updatedPortfolio.reduce(
    (acc, item) => acc + item.gainLossValue,
    0
  );

  // Calculer les gains/pertes totaux en pourcentage
  const initialTotalValue = updatedPortfolio.reduce(
    (acc, item) => acc + item.total_value / (1 + item.priceChange / 100),
    0
  );

  const totalGainLoss =
    initialTotalValue > 0 ? (totalGainLossValue / initialTotalValue) * 100 : 0;

  // Définir les métriques pour l'affichage
  const metrics: PortfolioMetric[] = [
    {
      icon: <DollarSign className="w-6 h-6 text-yellow-500" />,
      label: "Updated just now",
      value: `${convertedTotalValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-blue-500" />,
      label: "Since first investment",
      value: `${totalGainLoss > 0 ? "+" : ""}${totalGainLoss.toFixed(2)}%`,
      className: totalGainLoss >= 0 ? "text-green-600" : "text-red-600",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl text-center font-bold mb-8">
        Portfolio Overview
      </h1>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
        {metrics.map((metric, index) => (
          <Card
            key={index}
            className="w-full sm:w-auto p-6 border-none shadow-none "
          >
            <div className="flex flex-row sm:flex-col justify-center items-center gap-4">
              <div className="bg-gray-100 p-4 rounded-full">{metric.icon}</div>
              <div className="space-y-1 text-center sm:text-left">
                <p className="text-sm text-muted-foreground">{metric.label}</p>
                <p className={`text-2xl font-bold ${metric.className}`}>
                  {metric.value}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
