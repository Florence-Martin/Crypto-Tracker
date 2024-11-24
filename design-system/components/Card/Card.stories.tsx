import type { Meta, StoryObj } from "@storybook/react"; // Importation des types pour Storybook
import { Card } from "./Card";
import "./card.css";

// Définition des métadonnées pour le composant Card dans Storybook
const meta = {
  title: "Design System/Card", // Catégorie et nom du composant dans l'interface Storybook
  component: Card, // Le composant principal
  parameters: {
    layout: "centered", // Permet de centrer le composant dans la zone de prévisualisation
  },
  tags: ["autodocs"], // Génère automatiquement la documentation pour le composant
  argTypes: {
    // Définition des contrôles interactifs pour Storybook
    name: {
      control: "text", // Type de contrôle pour cette propriété (ici, champ texte)
      description: "Nom de la cryptomonnaie", // Description visible dans Storybook
    },
    symbol: {
      control: "text", // Champ texte
      description: "Symbole de la cryptomonnaie", // Description
    },
    price: {
      control: "number", // Champ numérique
      description: "Prix actuel de la cryptomonnaie", // Description
    },
    priceChange: {
      control: "number", // Champ numérique
      description: "Pourcentage de changement du prix sur 24h", // Description
    },
  },
} satisfies Meta<typeof Card>; // Vérification des types entre les métadonnées et le composant

export default meta; // Exportation des métadonnées pour que Storybook les utilise
type Story = StoryObj<typeof meta>; // Type générique pour les histoires (variants du composant)

// Définition des différentes variantes du composant Card
export const Default: Story = {
  // Histoire par défaut
  args: {
    name: "Bitcoin", // Exemple de nom
    symbol: "BTC", // Exemple de symbole
    price: 45000.55, // Exemple de prix
    priceChange: 3.25, // Exemple de changement positif en pourcentage
  },
};

export const NegativeChange: Story = {
  // Histoire avec un changement de prix négatif
  args: {
    name: "Ethereum", // Exemple de nom
    symbol: "ETH", // Exemple de symbole
    price: 3000.99, // Exemple de prix
    priceChange: -2.14, // Exemple de changement négatif en pourcentage
  },
};

export const CustomCard: Story = {
  // Histoire personnalisée
  args: {
    name: "Dogecoin", // Exemple de nom
    symbol: "DOGE", // Exemple de symbole
    price: 0.072, // Exemple de prix
    priceChange: 12.34, // Exemple de changement positif important
  },
};
