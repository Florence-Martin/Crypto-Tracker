import React, { useState, useEffect } from "react";
import { Button } from "@/design-system";
import { Edit, XCircle } from "lucide-react";

interface CryptoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { action: string; quantity: number }) => void;
  realQuantity: number; // Quantité réelle depuis la BDD
  initialQuantity: number;
}

const CryptoModal: React.FC<CryptoModalProps> = ({
  isOpen,
  onClose,
  onSave,
  realQuantity,
}) => {
  const [quantity, setQuantity] = useState<string>("0");
  const [action, setAction] = useState<"buy" | "sell" | "convert" | "">("");
  const [error, setError] = useState<string | null>(null);
  const [newQuantity, setNewQuantity] = useState<number>(realQuantity);

  useEffect(() => {
    // Met à jour la nouvelle quantité en fonction de l'action et de l'input
    const parsedQuantity = parseFloat(quantity) || 0;

    if (action === "buy") {
      setNewQuantity(realQuantity + parsedQuantity);
    } else if (action === "sell") {
      setNewQuantity(realQuantity - parsedQuantity);
    } else {
      setNewQuantity(realQuantity);
    }
  }, [quantity, action, realQuantity]);

  const handleSubmit = () => {
    setError(null);

    const parsedQuantity = parseFloat(quantity);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      setError("Please enter a valid quantity.");
      return;
    }

    if (action === "sell" && newQuantity < 0) {
      setError("Insufficient quantity to sell.");
      return;
    }

    onSave({ action, quantity: parsedQuantity });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-card text-card-foreground shadow-lg rounded-lg w-96 p-6 border border-border">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2 mr-10">
            <Edit className="w-5 h-5" />
            Edit Cryptocurrency
          </h2>
          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-600 focus:outline-none"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        {/* Quantité actuelle */}
        <p className="text-sm mb-4">
          Current quantity:{" "}
          <span className="font-bold">{realQuantity.toFixed(2)}</span>
        </p>

        {/* Actions */}
        <div className="flex justify-between mb-4">
          <Button
            label="Buy"
            size="small"
            primary={action === "buy"}
            backgroundColor={
              action === "buy" ? "var(--chart-2)" : "var(--muted)"
            }
            color={action === "buy" ? "white" : "var(--foreground)"}
            onClick={() => setAction("buy")}
          />
          <Button
            label="Sell"
            size="small"
            primary={action === "sell"}
            backgroundColor={
              action === "sell" ? "var(--destructive)" : "var(--muted)"
            }
            color={action === "sell" ? "white" : "var(--foreground)"}
            onClick={() => setAction("sell")}
          />
          <Button
            label="Convert"
            size="small"
            primary={action === "convert"}
            backgroundColor={
              action === "convert" ? "var(--chart-4)" : "var(--muted)"
            }
            color={action === "convert" ? "white" : "var(--foreground)"}
            onClick={() => setAction("convert")}
          />
        </div>

        {/* Input de quantité */}
        <div className="mb-4">
          <label
            htmlFor="quantity"
            className="block text-sm font-medium text-muted-foreground mb-2"
          >
            {action
              ? `Quantity to ${action === "buy" ? "buy" : "sell"}:`
              : "Please select an action"}
          </label>
          <input
            id="quantity"
            type="number"
            className="block w-full bg-muted text-foreground border border-border rounded-md py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Enter quantity"
            disabled={!action}
          />
        </div>

        {/* Nouvelle quantité totale */}
        {action && (
          <p
            className={`text-sm font-medium mb-4 ${
              newQuantity < 0 ? "text-red-500" : "text-green-500"
            }`}
          >
            New total quantity: <span>{newQuantity.toFixed(2)}</span>
          </p>
        )}

        {/* Erreur */}
        {error && (
          <div className="text-sm text-destructive-foreground bg-destructive p-2 rounded mb-4">
            {error}
          </div>
        )}

        {/* Boutons de sauvegarde */}
        <div className="flex justify-end gap-4">
          <Button
            label="Save"
            primary
            size="small"
            onClick={handleSubmit}
            backgroundColor="var(--primary)"
            color="var(--primary-foreground)"
          />
          <Button
            label="Cancel"
            size="small"
            onClick={onClose}
            backgroundColor="var(--muted)"
            color="var(--foreground)"
          />
        </div>
      </div>
    </div>
  );
};

export default CryptoModal;
