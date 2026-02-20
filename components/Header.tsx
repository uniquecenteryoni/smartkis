import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="flex flex-col items-center justify-center text-center px-2">
      <div className="relative inline-block">
        <div className="flex items-center font-display font-bold text-4xl sm:text-6xl lg:text-7xl">
          <span className="text-brand-dark-blue bg-brand-white px-2 sm:px-3 py-1 rounded-lg border-2 border-gray-200">חכם</span>
          <div className="relative ml-1 sm:ml-2">
            <span className="text-brand-dark-blue z-10 relative">בכיס</span>
            <div className="absolute -inset-2 bg-brand-light-blue rounded-xl transform -skew-x-6 z-0"></div>
            <div className="absolute top-0 right-[-8px] sm:right-[-10px] text-lg sm:text-2xl text-brand-teal font-bold z-20">₪</div>
          </div>
        </div>
      </div>
      <p className="text-brand-magenta text-lg sm:text-2xl font-display font-bold mt-2 sm:mt-3 tracking-wide">
        חינוך פיננסי חוויתי
      </p>
    </header>
  );
};

export default Header;