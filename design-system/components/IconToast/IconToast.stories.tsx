import type { Meta, StoryObj } from "@storybook/react";
import { CheckCircle, AlertTriangle, XCircle, InfoIcon } from "lucide-react";
import { IconToast } from "./IconToast";
console.log("IconToast:", IconToast);

const meta = {
  title: "Components/IconToast",
  component: IconToast,
  parameters: {
    layout: "centered", // Centrer le composant
  },
  tags: ["autodocs"],
  argTypes: {
    level: {
      control: {
        type: "select",
        options: ["success", "error", "info", "warning"],
      },
    },
    iconSize: {
      control: {
        type: "number", // Contrôle pour ajuster la taille de l'icône
      },
    },
  },
  args: {
    onClose: () => alert("Toast closed"),
    onPin: () => alert("Toast pinned"),
  },
} satisfies Meta<typeof IconToast>;

export default meta;
type Story = StoryObj<typeof meta>;

// Variantes des toasts

export const Success: Story = {
  args: {
    icon: <CheckCircle />,
    iconSize: 20,
    immediate: true,
    level: "success",
    title: "Hello world",
    children: "This is a success toast.",
  },
};

export const Error: Story = {
  args: {
    icon: <XCircle />,
    iconSize: 20,
    immediate: true,
    level: "error",
    title: "Error!",
    children: "Something went wrong.",
  },
};

export const Info: Story = {
  args: {
    icon: <InfoIcon />,
    iconSize: 20,
    immediate: true,
    level: "info",
    title: "Info!",
    children: "This is an info toast.",
  },
};

export const Warning: Story = {
  args: {
    icon: <AlertTriangle />,
    iconSize: 20,
    immediate: true,
    level: "warning",
    title: "Warning!",
    children: "This is a warning toast.",
  },
};
