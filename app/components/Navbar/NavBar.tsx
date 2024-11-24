"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { House, Wallet, Moon, Sun } from "lucide-react";
import CryptoLogo3D from "../Crypto/CryptoLogo3D";
import { useTheme } from "next-themes";

const NavBar: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Une fois monté côté client
  }, []);

  if (!mounted) return null;

  return (
    <nav className="bg-primary text-primary-foreground dark:bg-card dark:text-card-foreground py-2 shadow-lg fixed top-0 w-full z-50">
      {/* Conteneur principal */}
      <div className="container flex flex-col md:flex-row items-center justify-between px-6">
        {/* Logo et Titre */}
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <CryptoLogo3D />
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            <Link href="/" className="hover:text-gray-400 transition-colors">
              Crypto Tracker
            </Link>
          </h1>
        </div>

        {/* Liens de Navigation et Bouton Thème */}
        <div className="flex items-center space-x-6">
          <ul className="flex space-x-6">
            <li>
              <Link
                href="/"
                className="flex items-center text-lg hover:text-gray-400 transition-colors"
              >
                <House className="w-6 h-6 mr-2" />
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/portfolio"
                className="flex items-center text-lg hover:text-gray-400 transition-colors"
              >
                <Wallet className="w-6 h-6 mr-2" />
                Wallet
              </Link>
            </li>
          </ul>

          {/* Bouton Thème */}
          <button
            className="rounded-full px-1 py-1 md:px-4 md:py-4 text-sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="text-yellow-400" size={24} />
            ) : (
              <Moon className="text-gray-400" size={24} />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
