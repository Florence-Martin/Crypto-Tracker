"use client";

import React, { useState, useEffect } from "react";
import Wallet from "./components/Wallet/Wallet";
import { Table } from "./components/Table/Table";
import { SearchBar } from "./components/Searchbar/SearchBar";
import { useCrypto } from "../app/context/CryptoContext";
import { usePortfolio } from "../app/context/PortfolioContext";
import { LineChart, Line, CartesianGrid, Dot } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartTooltip,
  ChartTooltipContent,
  ChartContainer,
} from "@/components/ui/chart";
import { Button } from "@/design-system";
import { BadgeDollarSign } from "lucide-react";

// Configuration des données du graphique
const chartConfig = {
  current_price: {
    label: "Current Price",
    color: "hsl(var(--chart-2))",
  },
} as const;

const colors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
];

const HomePage: React.FC = () => {
  const { cryptos } = useCrypto();
  const { addToPortfolio } = usePortfolio();

  const [filteredCryptos, setFilteredCryptos] = useState(cryptos || []);
  const [view, setView] = useState<"table" | "graph">("table");
  const [isWalletOpen, setIsWalletOpen] = useState(false); // État pour ouvrir/fermer la modal

  useEffect(() => {
    setFilteredCryptos(cryptos || []);
  }, [cryptos]);

  const handleSearch = (value: string) => {
    const filtered = cryptos.filter((crypto) =>
      crypto.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCryptos(filtered);
  };

  return (
    <main className="relative w-screen h-screen bg-background">
      <div className="mx-8 my-44 md:my-36">
        {/* Barre de recherche */}
        <div className="flex flex-col md:flex-row justify-between mb-6">
          <SearchBar onSearch={handleSearch} />
          {/* Boutons pour basculer entre tableau et graphique */}
          <div className="flex items-center gap-4">
            {/* Bouton pour ouvrir la modal Wallet */}
            <button
              onClick={() => setIsWalletOpen(true)}
              className="flex items-center gap-2 text-sm text-primary hover:text-[#75ef75] transition"
            >
              <BadgeDollarSign className="w-6 h-6" />
              Add to Wallet
            </button>

            <Button
              primary={view === "table"}
              label="Table"
              onClick={() => setView("table")}
              backgroundColor={view === "table" ? "#4CAF50" : "#D3D3D3"}
            />
            <Button
              primary={view === "graph"}
              label="Graph"
              onClick={() => setView("graph")}
              backgroundColor={view === "graph" ? "#4CAF50" : "#D3D3D3"}
            />
          </div>
        </div>

        {/* Affichage conditionnel */}
        {view === "table" ? (
          <div className="mb-6">
            <Table
              data={filteredCryptos.map((crypto) => ({
                name: crypto.name,
                symbol: crypto.symbol,
                price: crypto.current_price,
                priceChange: crypto.price_change_percentage_24h,
              }))}
            />
          </div>
        ) : filteredCryptos.length > 1 ? (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Cryptocurrency Prices</CardTitle>
              <CardDescription>Real-time data</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <LineChart
                  data={filteredCryptos.map((crypto, index) => ({
                    name: crypto.name,
                    current_price: crypto.current_price,
                    fill: colors[index % colors.length],
                  }))}
                  margin={{ top: 24, left: 24, right: 24 }}
                >
                  <CartesianGrid vertical={false} />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        indicator="line"
                        nameKey="current_price"
                        hideLabel
                      />
                    }
                  />
                  <Line
                    dataKey="current_price"
                    type="natural"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={2}
                    dot={({
                      payload,
                      ...props
                    }: {
                      payload: { name: string; fill: string };
                      cx: number;
                      cy: number;
                    }) => (
                      <Dot
                        key={payload.name}
                        r={5}
                        cx={props.cx}
                        cy={props.cy}
                        fill={payload.fill}
                        stroke={payload.fill}
                      />
                    )}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="flex gap-2 font-medium leading-none">
                Real-time price updates
              </div>
              <div className="leading-none text-muted-foreground">
                Data for available cryptocurrencies.
              </div>
            </CardFooter>
          </Card>
        ) : (
          <p className="text-center text-muted-foreground">
            Not enough data to display the graph.
          </p>
        )}

        {/* Modal Wallet */}
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
      </div>
    </main>
  );
};

export default HomePage;
