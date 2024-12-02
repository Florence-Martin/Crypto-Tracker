import { Card } from "@/components/ui/card";
import Image from "next/image";

interface CryptoAlert {
  id: string;
  type: string;
  message: string;
  timestamp: Date;
}

interface CryptoAlertsProps {
  alerts: CryptoAlert[];
}

export default function CryptoAlert({ alerts }: CryptoAlertsProps) {
  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-6">Recent Alerts</h1>
      <div className="space-y-4">
        {alerts.map((alert) => (
          <Card
            key={alert.id}
            className="p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden">
                <Image
                  src={`/placeholder.svg?height=64&width=64`}
                  alt={`${alert.type} icon`}
                  width={64}
                  height={64}
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-1">
                  {alert.type} Alert
                </h2>
                <p className="text-muted-foreground">{alert.message}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
