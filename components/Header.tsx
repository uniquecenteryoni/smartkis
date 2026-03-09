import React from 'react';

interface HeaderProps {
  onLogoClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogoClick }) => {
  return (
    <header className="flex flex-col items-center justify-center text-center px-2">
      <div
        className="relative inline-block select-none group rounded-2xl bg-white px-4 py-2 shadow-sm"
        onClick={onLogoClick}
        style={{ cursor: onLogoClick ? 'pointer' : 'default' }}
      >
        <img
          src="/logo2.svg"
          alt="חכם בכיס"
          className="h-28 sm:h-40 lg:h-48 w-auto drop-shadow-lg group-hover:drop-shadow-xl transition-all duration-300"
        />
      </div>
    </header>
  );
};

export default Header;