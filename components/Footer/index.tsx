import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-background border-t text-primary-foreground  dark:text-card-foreground py-6 mt-8 fixed bottom-0 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Texte du footer */}
          <p className="text-sm">
            © {new Date().getFullYear()} Crypto Tracker. All rights reserved.
          </p>

          {/* Liens ou icônes sociales */}
          <div className="flex space-x-4">
            <a
              href="https://github.com/Florence-Martin"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/florence-martin-922b3861/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
