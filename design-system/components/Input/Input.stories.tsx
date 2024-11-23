import type { Meta, StoryObj } from "@storybook/react";
import { Input, InputProps } from "./Input";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    backgroundColor: { control: "color" },
    size: { control: { type: "radio" }, options: ["small", "medium", "large"] },
  },
};

export default meta;
type Story = StoryObj<InputProps>;

export const Default: Story = {
  args: {
    placeholder: "Enter text...",
    value: "",
    size: "medium",
    onChange: (e) => console.log("Input value changed:", e.target.value),
  },
};
