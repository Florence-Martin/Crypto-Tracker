"use client";
import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-background text-foreground">
      <div className="relative flex justify-center items-center w-12 h-12 rounded-full">
        <span className="absolute w-12 h-12 border-2 border-gray-300 rounded-full animate-spin">
          <span className="absolute top-[-10px] left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-lime-400 shadow-[0_0_20px_rgb(10,10,10),0_0_60px_rgb(10,10,10)]"></span>
        </span>
      </div>
    </div>
  );
};

export default Loader;
