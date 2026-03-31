import React from 'react';

interface HeaderProps {
  onLogoClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogoClick }) => {
  return (
    <header className="flex flex-col items-center justify-center text-center px-2">
      <div
        className="relative inline-block select-none"
        onClick={onLogoClick}
        style={{ cursor: onLogoClick ? 'pointer' : 'default' }}
      >
        <img
          src={`${import.meta.env.BASE_URL}logo2.svg`}
          alt="חכם בכיס"
          className="h-28 sm:h-40 lg:h-48 w-auto drop-shadow-lg transition-all duration-300"
        />
      </div>
    </header>
  );
};

export default Header;