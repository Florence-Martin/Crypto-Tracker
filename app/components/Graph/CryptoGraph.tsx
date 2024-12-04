import React from "react";
import { LineChart, Line, CartesianGrid, Dot, XAxis, Tooltip } from "recharts";
import { CardContent } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";

export interface CryptoGraphData {
  name: string;
  current_price: number;
  fill: string;
}

export interface CryptoGraphProps {
  data: CryptoGraphData[];
  chartConfig?: Record<string, { label: string; color: string }>;
}

export const CryptoGraph: React.FC<CryptoGraphProps> = ({
  data,
  chartConfig,
}) => {
  const defaultChartConfig = {};
  return (
    <CardContent>
      <ChartContainer config={chartConfig || defaultChartConfig}>
        <LineChart
          data={data}
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
  );
};
