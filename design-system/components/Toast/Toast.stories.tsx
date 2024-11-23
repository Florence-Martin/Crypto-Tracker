import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import Toast from "./Toast"; // Adjust the import path as necessary

// Configuration de base pour les stories
const meta = {
  title: "Components/Toast",
  component: Toast,
  parameters: {
    layout: "centered", // Centrer le composant dans la zone Canvas
  },
  tags: ["autodocs"], // Générer automatiquement la documentation
  argTypes: {
    level: {
      control: {
        type: "select",
        options: ["success", "error", "info", "warning"], // Types de niveau
      },
    },
    variant: {
      control: {
        type: "select",
        options: ["colored", "outlined"], // Variantes visuelles
      },
    },
  },
  args: {
    onClose: fn(), // Action pour surveiller les fermetures dans l'onglet "Actions"
    onPin: fn(), // Action pour surveiller les "épinglages" dans l'onglet "Actions"
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

// Stories pour les différentes variantes de Toast

export const Success: Story = {
  args: {
    level: "success",
    variant: "colored",
    immediate: true,
    children: "This is a success toast!",
  },
};

export const Error: Story = {
  args: {
    level: "error",
    variant: "colored",
    immediate: true,
    children: "This is an error toast!",
  },
};

export const Info: Story = {
  args: {
    level: "info",
    variant: "outlined",
    immediate: true,
    children: "This is an info toast!",
  },
};

export const Warning: Story = {
  args: {
    level: "warning",
    variant: "outlined",
    immediate: true,
    children: "This is a warning toast!",
  },
};
