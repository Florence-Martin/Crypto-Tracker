import React, { useState } from "react";
import { Input } from "../../../design-system";

export const SearchBar: React.FC<{
  onSearch: (value: string) => void;
  error?: boolean; // Prop optionnelle pour indiquer une erreur
}> = ({ onSearch, error }) => {
  const [value, setValue] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onSearch(newValue);
  };

  return (
    <Input
      placeholder="Search for a cryptocurrency..."
      value={value} // Liaison avec l'état local
      onChange={handleChange} // Gestionnaire de changement
      size="medium" // Exemple de taille, peut être ajusté
      backgroundColor={error ? "#ffe6e6" : "#f5f5f5"} // Couleur de fond selon l'état d'erreur
      color={error ? "#ff4d4f" : "#333"} // Couleur du texte selon l'état d'erreur
      error={error} // Passe la prop d'erreur à l'Input
    />
  );
};
