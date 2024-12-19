import React from "react";

interface ConfirmCardProps {
  message: string;
  onConfirm: () => void; // Fonction appelée lors de la confirmation
  onCancel: () => void; // Fonction appelée lors de l'annulation
}

const ConfirmCard: React.FC<ConfirmCardProps> = ({
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-card text-card-foreground p-6 rounded-lg shadow-lg max-w-sm w-full">
        <p className="text-lg font-semibold mb-4">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm bg-muted text-foreground rounded hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm bg-destructive text-white rounded hover:bg-red-600 transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmCard;
