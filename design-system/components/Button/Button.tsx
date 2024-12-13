"use client";
import React from "react";

import "./button.css";

export interface ButtonProps {
  /** Is this the principal call to action on the page? */
  primary?: boolean;
  /** What background color to use */
  backgroundColor?: string;
  /** Text color */
  color?: string;
  /** How large should the button be? */
  size?: "small" | "medium" | "large";
  /** Button contents */
  label?: string;
  /** Optional icon to display alongside the label */
  icon?: React.ReactNode;
  /** Optional click handler */
  onClick?: () => void;
  /** Optional class name */
  className?: string;
}

/** Primary UI component for user interaction */
export const Button: React.FC<ButtonProps> = ({
  primary = false,
  size = "medium",
  backgroundColor,
  color = "white",
  label,
  icon,
  ...props
}: ButtonProps) => {
  const mode = primary
    ? "storybook-button--primary"
    : "storybook-button--secondary";
  return (
    <button
      type="button"
      className={["storybook-button", `storybook-button--${size}`, mode].join(
        " "
      )}
      {...props}
    >
      {icon && <span className="button-icon">{icon}</span>}
      <span className="button-label">{label}</span>
      <style jsx>{`
        button {
          background-color: ${backgroundColor};
          color: ${color};
          display: flex;
          align-items: center;
          gap: 8px; /* Adjust spacing between icon and label */
        }
        .button-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </button>
  );
};
