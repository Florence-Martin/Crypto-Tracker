import React from "react";
import "./input.css";

export interface InputProps {
  /** Placeholder text for the input */
  placeholder?: string;
  /** Current value of the input */
  value: string;
  /** Handler for change events */
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Size of the input */
  size?: "small" | "medium" | "large";
  /** Optional background color */
  backgroundColor?: string;
  /** Optional text color */
  color?: string;
  /** Nouvelle prop */
  disabled?: boolean;
  error?: boolean;
}

/** Primary UI component for user input */
export const Input: React.FC<InputProps> = ({
  placeholder = "Enter text...",
  value,
  onChange,
  size = "medium",
  backgroundColor,
  color,
  ...props
}) => {
  const sizeClass = `storybook-input--${size}`;
  return (
    <input
      type="text"
      className={["storybook-input", sizeClass].join(" ")}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{ backgroundColor, color }}
      {...props}
    />
  );
};

export default Input;
