import React, { useState } from "react";
import { Meta, StoryFn } from "@storybook/react";
import CryptoModal from "@/design-system/components/Modal/CryptoModal";

export default {
  title: "Components/CryptoModal",
  component: CryptoModal,
  argTypes: {
    isOpen: { control: "boolean" },
    initialQuantity: { control: "number" },
  },
} as Meta<typeof CryptoModal>;

// **Template** pour la modal
const Template: StoryFn<typeof CryptoModal> = (args) => {
  const [isOpen, setIsOpen] = useState(args.isOpen);

  const handleSave = (data: { quantity: number }) => {
    alert(`Quantité sauvegardée : ${data.quantity}`);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
      >
        Ouvrir la Modal
      </button>
      <CryptoModal
        {...args}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSave={handleSave}
      />
    </>
  );
};

// **Histoire par défaut**
export const Default = Template.bind({});
Default.args = {
  isOpen: true,
  initialQuantity: 1.5,
};

// **Histoire fermée**
export const Closed = Template.bind({});
Closed.args = {
  isOpen: false,
  initialQuantity: 0,
};
