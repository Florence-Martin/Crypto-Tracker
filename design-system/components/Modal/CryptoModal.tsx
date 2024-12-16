import React from "react";
import "./cryptoModal.css";

interface CryptoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { quantity: number }) => void;
  initialQuantity: number;
}

const CryptoModal: React.FC<CryptoModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialQuantity,
}) => {
  const [quantity, setQuantity] = React.useState(initialQuantity);

  const handleSubmit = () => {
    onSave({ quantity });
  };

  if (!isOpen) return null;

  return (
    <div className="crypto-modal-overlay">
      <div className="crypto-modal">
        <div className="crypto-modal-header">
          <h2>Modifier la Cryptomonnaie</h2>
          <button className="close-button" onClick={onClose}>
            ✖
          </button>
        </div>
        <div className="crypto-modal-content">
          <label>Quantité :</label>
          <input
            type="number"
            step="0.01"
            value={quantity}
            onChange={(e) => setQuantity(parseFloat(e.target.value))}
          />
          <button className="save-button" onClick={handleSubmit}>
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  );
};

export default CryptoModal;
