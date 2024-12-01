import { Card } from "@/components/ui/card";
import { DollarSign, TrendingUp } from "lucide-react";

interface PortfolioMetric {
  icon: JSX.Element;
  label: string;
  value: string;
  className?: string;
}

export default function PortfolioOverview() {
  const metrics: PortfolioMetric[] = [
    {
      icon: <DollarSign className="w-6 h-6" />,
      label: "Total Assets",
      value: "$10,000",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      label: "Total Gain/Loss",
      value: "+10%",
      className: "text-green-600",
    },
  ];

  return (
    // <div className="flex flex-col  w-full max-w-4xl p-6 justify-center items-center mr-9">
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl text-center font-bold mb-8">
        Portfolio Overview
      </h1>
      <div className="grid grid-cols-2 gap-6 rounded-full ">
        {metrics.map((metric, index) => (
          <Card key={index} className="p-6 border-none shadow-none">
            <div className="flex flex-col items-center gap-4">
              <div className="bg-gray-100 p-4 rounded-full">{metric.icon}</div>
              <div className="space-y-1">
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
