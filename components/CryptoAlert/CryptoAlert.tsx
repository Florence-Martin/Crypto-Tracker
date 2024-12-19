import { Card } from "@/components/ui/card";
import Image from "next/image";

interface CryptoAlert {
  id: string;
  type: string;
  message: string;
  timestamp: Date;
  image: string;
}

interface CryptoAlertsProps {
  alerts: CryptoAlert[];
}

export default function CryptoAlert({ alerts }: CryptoAlertsProps) {
  console.log("Alerts in CryptoAlert component:", alerts);
  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-6">Recent Alerts</h1>
      <div className="space-y-4">
        {alerts.length > 0 ? (
          alerts.map((alert, index) => (
            <Card
              key={`${alert.id}-${index}`}
              className="p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden">
                  <Image
                    src={alert.image || "/images/alertWarning.svg"}
                    alt={`${alert.type} icon`}
                    width={64}
                    height={64}
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h2
                    className={`text-xl font-semibold mb-1 ${
                      alert.type === "No Alerts selected"
                        ? "text-green-500"
                        : "text-red-600"
                    }`}
                  >
                    {alert.type}
                  </h2>
                  <p className="text-muted-foreground">{alert.message}</p>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-4 hover:shadow-lg transition-shadow text-center">
            <p className="text-muted-foreground">
              You haven&apos;t selected any cryptocurrencies for alerts.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
