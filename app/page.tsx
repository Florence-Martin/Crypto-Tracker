"use client";

import React, { useState, useEffect } from "react";
import Wallet from "./components/Wallet/Wallet";
import { Table } from "./components/Table/Table";
import { SearchBar } from "./components/Searchbar/SearchBar";
import { useCrypto } from "../app/context/CryptoContext";
import { usePortfolio } from "../app/context/PortfolioContext";
import Loader from "./components/Loader/Loader";
import Hero from "./components/Hero/Hero";
import { CryptoDashboard } from "./components/Crypto/CryptoDashboard";
import { BadgeDollarSign } from "lucide-react";
import { Button } from "@/design-system";
import { LineChart, Line, CartesianGrid, Dot, XAxis, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
// import { debounce } from "lodash";
import debounce from "lodash/debounce";
import PortfolioOverview from "./components/Wallet/PortfolioOverview";
import CryptoAlert from "./components/CryptoAlert/CryptoAlert";

const chartConfig = {
  current_price: {
    label: "Current Price",
    color: "hsl(var(--chart-2))",
  },
};

const colors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
];

const HomePage: React.FC = () => {
  const { cryptos, isLoading, error } = useCrypto();
  const { addToPortfolio } = usePortfolio();

  const [filteredCryptos, setFilteredCryptos] = useState(cryptos || []);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [view, setView] = useState<"table" | "graph">("table");
  const [alerts, setAlerts] = useState<
    { name: string; symbol: string; price: number; priceChange: number }[]
  >([]);

  useEffect(() => {
    if (cryptos && cryptos.length > 0) {
      setFilteredCryptos(cryptos);
    }
  }, [cryptos]);

  const handleAlertChange = (updatedAlerts: typeof alerts) => {
    setAlerts(updatedAlerts);
  };

  const handleSearch = debounce((searchTerm: string) => {
    const filtered = cryptos.filter((crypto) =>
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCryptos(filtered);
  }, 300);

  const alertDetails =
    alerts.length > 0
      ? alerts.map((alert, index) => ({
          id: `${alert.symbol}-${index}`,
          type: alert.name,
          message: `${alert.name} is being tracked.`,
          timestamp: new Date(),
        }))
      : [
          {
            id: "no-alert",
            type: "No Alerts",
            message: "You have not selected any alerts.",
            timestamp: new Date(),
          },
        ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
      </div>
    );
  }
  return (
    <main className="relative w-screen min-h-screen bg-background overflow-auto mb-24">
      <div className="mt-44 md:mt-36 mb-10 md:mb-6">
        {/* Section Hero */}
        <Hero />

        <div className="grid grid-cols-1 md:grid-cols-2 border-2">
          {/* Section Popular Cryptocurrencies */}
          <CryptoDashboard />

          <PortfolioOverview />
        </div>
      </div>
      {/* Barre de recherche */}
      <div className="flex mx-4 flex-col md:flex-row mb-6 justify-center">
        <SearchBar onSearch={handleSearch} />
      </div>
      <div
        id="add_crypto"
        className="flex items-center gap-4 mr-4 justify-end mb-2"
      >
        <button
          onClick={() => setIsWalletOpen(true)}
          className="relative flex items-center gap-2 text-md font-semibold text-primary transition group"
        >
          <BadgeDollarSign className="w-6 h-6 relative z-10" />
          <span className="relative z-10">Add to Wallet</span>
          <span className="absolute inset-0 -rotate-6 bg-yellow-300 scale-x-0 group-hover:scale-x-100 transition-transform origin-bottom z-0"></span>
        </button>

        <Button
          primary={view === "table"}
          label="Table"
          onClick={() => setView("table")}
          backgroundColor={view === "table" ? "#4CAF50" : "#3F3F46"}
        />
        <Button
          primary={view === "graph"}
          label="Graph"
          onClick={() => setView("graph")}
          backgroundColor={view === "graph" ? "#4CAF50" : "#3F3F46"}
        />
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <Loader />
        </div>
      ) : view === "table" ? (
        <div className="mx-4">
          <Table
            data={filteredCryptos.map((crypto) => ({
              name: crypto.name,
              symbol: crypto.symbol,
              price: crypto.current_price,
              priceChange: crypto.price_change_percentage_24h,
            }))}
            selectedAlerts={alerts} // Liste des objets crypto sélectionnés
            onAlertChange={setAlerts} // Met à jour les alertes
          />
        </div>
      ) : filteredCryptos.length > 1 ? (
        <div className="mx-4">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Cryptocurrency Prices</CardTitle>
              <CardDescription>Real-time cryptocurrency data</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <LineChart
                  data={filteredCryptos.map((crypto, index) => ({
                    key: `${crypto.name}-${index}`,
                    name: crypto.name,
                    current_price: crypto.current_price,
                    fill: colors[index % colors.length],
                  }))}
                  margin={{ top: 24, left: 24, right: 24, bottom: 24 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                  />
                  <Tooltip
                    content={({ payload }) =>
                      payload?.[0] ? (
                        <div className="p-2 bg-gray-800 text-white rounded">
                          <p>{payload[0].payload.name}</p>
                          <p>${payload[0].payload.current_price.toFixed(2)}</p>
                        </div>
                      ) : null
                    }
                  />
                  <Line
                    dataKey="current_price"
                    type="monotone"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={2}
                    dot={({ cx, cy, payload }) => (
                      <Dot
                        key={`dot-${payload.name}`}
                        cx={cx}
                        cy={cy}
                        r={5}
                        fill={payload.fill}
                        stroke={payload.fill}
                      />
                    )}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="font-medium">Real-time updates</div>
              <div className="text-muted-foreground">
                Data fetched from your context.
              </div>
            </CardFooter>
          </Card>
        </div>
      ) : (
        <p className="text-center text-muted-foreground">
          Not enough data to display the graph.
        </p>
      )}

      {/* Alertes */}
      <CryptoAlert alerts={alertDetails} />

      {isWalletOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="relative bg-background text-foreground rounded-lg p-6 shadow-lg max-w-lg w-full">
            <button
              className="absolute top-2 right-2 text-foreground hover:text-primary"
              onClick={() => setIsWalletOpen(false)}
            >
              ✕
            </button>
            <Wallet
              cryptos={filteredCryptos}
              onAddToPortfolio={(crypto, quantity) => {
                addToPortfolio(crypto, quantity);
                setIsWalletOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </main>
  );
};

export default HomePage;
