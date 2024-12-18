"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { House, Wallet, Moon, Sun, Menu, X } from "lucide-react";
import CryptoLogo3D from "../Crypto/CryptoLogo3D";
import { useTheme } from "next-themes";

const NavBar: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // État pour le menu mobile

  useEffect(() => {
    setMounted(true); // Une fois monté côté client
  }, []);

  if (!mounted) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex items-center justify-between px-4 h-16">
        {/* Section Logo */}
        <div className="flex items-center space-x-4">
          <CryptoLogo3D />
          <Link
            href="/"
            className="text-lg font-bold hover:text-gray-400 transition-colors md:text-2xl"
          >
            Crypto Tracker
          </Link>
        </div>

        {/* Navigation Desktop */}
        <div className="hidden md:flex items-center space-x-6">
          <nav className="flex items-center space-x-6">
            <Link
              href="/"
              className="flex items-center text-md md:text-lg hover:text-gray-400 transition-colors"
            >
              <House className="w-5 h-5 mr-1" />
              Home
            </Link>
            <Link
              href="/portfolio"
              className="flex items-center text-md md:text-lg hover:text-gray-400 transition-colors"
            >
              <Wallet className="w-5 h-5 mr-1" />
              Wallet
            </Link>
          </nav>

          {/* Bouton Thème */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {theme === "dark" ? (
              <Sun className="text-yellow-400" size={24} />
            ) : (
              <Moon className="text-gray-400" size={24} />
            )}
          </button>
        </div>

        {/* Menu Hamburger (Mobile) */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="rounded-full p-2 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t">
          <nav className="flex flex-col items-center space-y-4 py-4">
            <Link
              href="/"
              className="flex items-center text-lg hover:text-gray-400 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <House className="w-5 h-5 mr-2" />
              Home
            </Link>
            <Link
              href="/portfolio"
              className="flex items-center text-lg hover:text-gray-400 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <Wallet className="w-5 h-5 mr-2" />
              Wallet
            </Link>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex items-center space-x-2 text-lg transition-colors hover:text-gray-400"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="text-yellow-400" size={24} />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="text-gray-400" size={24} />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default NavBar;
