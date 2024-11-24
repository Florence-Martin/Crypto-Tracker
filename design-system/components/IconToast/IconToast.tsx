import React from "react";
import "./iconToast.css";

interface IconToastProps {
  title: string; // Titre principal du toast
  children: string; // Description secondaire ou contenu
  icon: React.ReactNode; // Icône personnalisée
  iconSize?: number; // Taille de l'icône (optionnel)
  immediate?: boolean; // Affichage immédiat ou non
  level: "success" | "error" | "info" | "warning"; // Type de toast
  onClose: () => void; // Fonction de fermeture
  onPin?: () => void; // Fonction optionnelle pour "épingler" le toast
}

export const IconToast: React.FC<IconToastProps> = ({
  title,
  children,
  icon,
  iconSize = 20,
  immediate = false,
  level,
  onClose,
  onPin,
}) => {
  const levelClass = {
    success: "border-green-500",
    error: "border-red-500",
    info: "border-blue-500",
    warning: "border-yellow-500",
  };

  return (
    <div
      className={`icon-toast flex items-center p-4 rounded-lg shadow-md border-l-4 bg-gray-800 text-white ${
        levelClass[level]
      } ${immediate ? "toast-visible" : ""}`}
    >
      {/* Icône */}
      <div
        className="icon-toast-icon mr-4"
        style={{ fontSize: `${iconSize}px` }}
      >
        {icon}
      </div>

      {/* Contenu */}
      <div className="icon-toast-content flex-1">
        <strong className="block text-lg">{title}</strong>
        <p className="text-sm text-gray-400">{children}</p>
      </div>

      {/* Actions */}
      <div className="icon-toast-actions flex items-center">
        {onPin && (
          <button
            className="icon-toast-pin mr-2"
            onClick={onPin}
            aria-label="Pin toast"
          >
            📌
          </button>
        )}
        <button
          className="icon-toast-close"
          onClick={onClose}
          aria-label="Close toast"
        >
          ✖
        </button>
      </div>
    </div>
  );
};
