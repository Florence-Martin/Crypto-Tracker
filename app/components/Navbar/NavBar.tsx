import React from "react";
import Link from "next/link";
import { House, Wallet } from "lucide-react";
import CryptoLogo3D from "../Crypto/CryptoLogo3D";

const NavBar: React.FC = () => {
  return (
    <nav className="bg-gray-900 text-white py-6 shadow-lg fixed top-0 w-full">
      {/* Conteneur principal */}
      <div className="container  flex flex-col md:flex-row items-center justify-between px-6">
        {/* Logo et Titre */}
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <CryptoLogo3D />
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            <Link href="/" className="hover:text-gray-400 transition-colors">
              Crypto Tracker
            </Link>
          </h1>
        </div>

        {/* Liens de Navigation */}
        <div className="w-full md:w-auto">
          <ul className="flex flex-col justify-end md:flex-row space-y-4 md:space-y-0 md:space-x-6">
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
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
