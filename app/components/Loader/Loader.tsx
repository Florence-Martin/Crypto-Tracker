"use client";
import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="flex items-center justify-center w-full h-full bg-transparent">
      <div className="relative flex items-center justify-center w-36 h-36 rounded-full bg-gradient-to-b from-red-500 to-red-700 animate-spin">
        <div className="absolute w-full h-full bg-transparent rounded-full"></div>
      </div>
    </div>
  );
};

export default Loader;
