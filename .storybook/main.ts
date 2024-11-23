import type { StorybookConfig } from "@storybook/nextjs";
import Input from "../stories/Input.mdx";

const config: StorybookConfig = {
  stories: [
    "../design-system/components/**/*.stories.@(js|jsx|ts|tsx|mdx)",
    "../app/components/**/*.stories.@(js|jsx|ts|tsx|mdx)",
  ],
  addons: [
    "@storybook/addon-onboarding",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  docs: {
    autodocs: "tag", // Active la génération automatique basée sur les balises
  },
  staticDirs: ["../public"],
};

export default config;
