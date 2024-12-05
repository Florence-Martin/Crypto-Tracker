import React from "react";
import { CryptoData, Table } from "./Table";

export const CryptoTable: React.FC<{
  cryptos: CryptoData[];
  alerts: CryptoData[];
  onAlertChange: (updatedAlerts: CryptoData[]) => void;
}> = ({ cryptos, alerts, onAlertChange }) => {
  return (
    <Table
      data={cryptos}
      selectedAlerts={alerts}
      onAlertChange={onAlertChange}
    />
  );
};
