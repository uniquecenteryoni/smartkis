import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="flex flex-col items-center justify-center text-center">
      <div className="relative inline-block">
        <div className="flex items-center font-display font-bold text-6xl sm:text-7xl">
          <span className="text-brand-dark-blue bg-brand-white px-3 py-1 rounded-lg border-2 border-gray-200">חכם</span>
          <div className="relative ml-2">
            <span className="text-brand-dark-blue z-10 relative">בכיס</span>
            <div className="absolute -inset-2 bg-brand-light-blue rounded-xl transform -skew-x-6 z-0"></div>
            <div className="absolute top-0 right-[-10px] text-2xl text-brand-teal font-bold z-20">₪</div>
          </div>
        </div>
      </div>
      <p className="text-brand-magenta text-xl sm:text-2xl font-display font-bold mt-3 tracking-wide">
        חינוך פיננסי חוויתי
      </p>
    </header>
  );
};

export default Header;