import React from "react";

interface CryptoLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

const CryptoLogo: React.FC<CryptoLogoProps> = ({
  width = 200,
  height = 200,
  className = "",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4A90E2" />
          <stop offset="100%" stopColor="#73f07f" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Main circle */}
      <circle cx="100" cy="100" r="90" fill="url(#grad1)" />

      {/* Blockchain representation */}
      <g filter="url(#glow)">
        <path
          d="M60 100 L90 70 L130 70 L160 100 L130 130 L90 130 Z"
          stroke="white"
          strokeWidth="4"
          fill="none"
        />
        <circle cx="60" cy="100" r="8" fill="white" />
        <circle cx="90" cy="70" r="8" fill="white" />
        <circle cx="130" cy="70" r="8" fill="white" />
        <circle cx="160" cy="100" r="8" fill="white" />
        <circle cx="130" cy="130" r="8" fill="white" />
        <circle cx="90" cy="130" r="8" fill="white" />
      </g>

      {/* Central cube */}
      <g transform="translate(100 100) scale(0.8)">
        <path
          d="M0 -20 L-17.32 -10 L-17.32 10 L0 20 L17.32 10 L17.32 -10 Z"
          fill="white"
        />
        <path d="M0 -20 L17.32 -10 L0 0 L-17.32 -10 Z" fill="#D0D0D0" />
        <path d="M17.32 -10 L17.32 10 L0 20 L0 0 Z" fill="#A0A0A0" />
      </g>

      {/* Orbiting particles */}
      <g opacity="0.7">
        <circle cx="70" cy="50" r="4" fill="white" />
        <circle cx="150" cy="60" r="3" fill="white" />
        <circle cx="140" cy="150" r="5" fill="white" />
        <circle cx="40" cy="130" r="3" fill="white" />
      </g>
    </svg>
  );
};

export default CryptoLogo;
