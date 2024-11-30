import { Card, CardContent } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

interface CryptoPriceProps {
  name: string;
  symbol: string;
  price: number;
  percentageChange: number;
  icon?: "dollar" | "diamond" | "leaf";
}

export default function CryptoPriceCard({
  name = "Bitcoin",
  symbol = "BTC",
  price = 57320,
  percentageChange = 0.23,
}: CryptoPriceProps) {
  return (
    <Card className="w-full max-w-[240px]">
      <CardContent className="pt-6 px-6 pb-4">
        <div className="flex flex-col items-center text-center space-y-1.5">
          <div className="bg-gray-100 p-4 rounded-full">
            <div className="w-8 h-8 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
          <h3 className="font-medium text-lg">{name}</h3>
          <p className="text-sm text-muted-foreground">{symbol}</p>
          <p className="text-2xl font-semibold mt-2">
            ${price.toLocaleString()}
          </p>
          <p
            className={`text-sm ${
              percentageChange >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {percentageChange >= 0 ? "+" : ""}
            {percentageChange.toFixed(2)}%
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
