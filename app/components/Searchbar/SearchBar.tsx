import React, { useState } from "react";
import { Input, Button } from "../../../design-system";

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

  const handleReset = () => {
    setValue(""); // Réinitialiser la valeur
    onSearch(""); // Exécuter une recherche vide
  };

  return (
    <div className="flex w-1/4 items-center space-x-4 mb-4">
      {/* Input de recherche */}
      <Input
        placeholder="Search for a cryptocurrency..."
        value={value} // Liaison avec l'état local
        onChange={handleChange} // Gestionnaire de changement
        size="medium" // Exemple de taille, peut être ajusté
        backgroundColor={error ? "#ffe6e6" : "#f5f5f5"}
        color={error ? "#ff4d4f" : "#333"}
        error={error}
      />

      {/* Bouton de réinitialisation */}
      <Button
        label="Reset"
        onClick={handleReset}
        backgroundColor="#f5f5f5"
        color="#333"
        size="small"
      />
    </div>
  );
};
