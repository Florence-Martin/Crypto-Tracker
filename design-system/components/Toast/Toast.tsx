import React from "react";
import "./toast.css";

interface ToastProps {
  level: "success" | "error" | "info" | "warning"; // Type de toast
  variant?: "colored" | "outlined"; // Apparence du toast
  immediate?: boolean; // Affichage immédiat ou non
  onClose: () => void; // Fonction de fermeture
  onPin?: () => void; // Optionnel : fonction pour "épingler" le toast
  children: React.ReactNode; // Contenu du toast
}

const Toast: React.FC<ToastProps> = ({
  level,
  variant = "colored",
  immediate = false,
  onClose,
  onPin,
  children,
}) => {
  // Définir les classes dynamiques en fonction des props
  const toastClass = `toast toast-${level} toast-${variant} ${
    immediate ? "toast-visible" : ""
  }`;

  return (
    <div className={toastClass}>
      <div className="toast-content">{children}</div>
      <div className="toast-actions">
        {onPin && (
          <button className="toast-pin" onClick={onPin} aria-label="Pin toast">
            📌
          </button>
        )}
        <button
          className="toast-close"
          onClick={onClose}
          aria-label="Close toast"
        >
          ✖
        </button>
      </div>
    </div>
  );
};

export default Toast;
