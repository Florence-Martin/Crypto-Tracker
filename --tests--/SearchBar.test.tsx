import { SearchBar } from "../components/Searchbar/SearchBar";
import { render, screen, fireEvent } from "@testing-library/react"; // Pour tester les composants React
import { describe, it, expect, vi } from "vitest"; // Les outils de Vitest
import "@testing-library/jest-dom"; // Pour les matchers supplémentaires

describe("SearchBar Component", () => {
  it("calls onSearch with the correct value when typing", () => {
    const mockOnSearch = vi.fn(); // Mock de la fonction onSearch
    render(<SearchBar onSearch={mockOnSearch} />); // Rendu du composant

    const input = screen.getByPlaceholderText("Search for a cryptocurrency...");
    fireEvent.change(input, { target: { value: "Bitcoin" } }); // Simule la saisie de l'utilisateur

    expect(mockOnSearch).toHaveBeenCalledWith("Bitcoin"); // Vérifie que onSearch est appelé avec "Bitcoin"
    expect(input).toHaveValue("Bitcoin"); // Vérifie que l'input contient la bonne valeur
  });

  it("resets the input and calls onSearch with an empty string when clicking reset", () => {
    const mockOnSearch = vi.fn();
    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText("Search for a cryptocurrency...");
    const button = screen.getByText("Reset");

    fireEvent.change(input, { target: { value: "Ethereum" } }); // Simule la saisie
    fireEvent.click(button); // Simule le clic sur le bouton reset

    expect(mockOnSearch).toHaveBeenCalledWith(""); // Vérifie que onSearch est appelé avec une chaîne vide
    expect(input).toHaveValue(""); // Vérifie que l'input est bien réinitialisé
  });

  it("applies error styles when the error prop is true", () => {
    const mockOnSearch = vi.fn();
    render(<SearchBar onSearch={mockOnSearch} error={true} />); // Rendu avec une erreur

    const input = screen.getByPlaceholderText("Search for a cryptocurrency...");
    expect(input).toHaveStyle("background-color: #ffe6e6"); // Vérifie le style d'erreur
    expect(input).toHaveStyle("color: #ff4d4f"); // Vérifie la couleur d'erreur
  });
});
