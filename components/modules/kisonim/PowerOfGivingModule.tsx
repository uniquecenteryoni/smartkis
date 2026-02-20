// FIX: The original file content was corrupted. This is a complete rewrite
// of the PowerOfGivingModule component based on its description in App.tsx.
import React, { useState } from 'react';
import ModuleView from '../../ModuleView';

interface ModuleProps {
  onBack: () => void;
  title: string;
  onComplete: () => void;
}

const PowerOfGivingModule: React.FC<ModuleProps> = ({ onBack, title, onComplete }) => {
  const [choiceMade, setChoiceMade] = useState(false);

  const handleChoice = () => {
    if (!choiceMade) {
      setChoiceMade(true);
      onComplete();
    }
  };

  const options = [
    {
      icon: '💖',
      title: 'לתרום לבעלי חיים',
      description: 'לתרום כסף לעמותה שמטפלת בכלבים וחתולים נטושים.',
    },
    {
      icon: '🌳',
      title: 'לשמור על הסביבה',
      description: 'לתרום כסף לארגון שנוטע עצים ומנקה יערות.',
    },
    {
      icon: '🤝',
      title: 'לעזור לחברים',
      description: 'לקנות מתנה לחבר/ה שמרגיש/ה קצת עצוב/ה לאחרונה.',
    },
  ];

  return (
    <ModuleView title={title} onBack={onBack}>
      <div className="text-center bg-white/40 backdrop-blur-md p-4 sm:p-8 rounded-3xl shadow-xl border border-white/50">
        <h3 className="text-4xl font-bold text-brand-teal mb-4">כוחה של נתינה</h3>
        <p className="text-2xl text-brand-dark-blue/90 mb-8">
          כסף הוא לא רק לקניות! אפשר להשתמש בו גם כדי לעשות טוב לאחרים ולעולם.
          <br/>
          איך הייתם רוצים לעזור? בחרו אפשרות אחת.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {options.map((option, index) => (
            <div
              key={index}
              onClick={handleChoice}
              className={`p-6 bg-white/70 rounded-2xl shadow-lg border-4 transition-all duration-300 cursor-pointer ${
                choiceMade ? 'border-brand-teal scale-105' : 'border-transparent hover:border-brand-light-blue hover:scale-105'
              }`}
            >
              <div className="text-7xl mb-4">{option.icon}</div>
              <h4 className="text-2xl font-bold mb-2 text-brand-dark-blue">{option.title}</h4>
              <p className="text-lg">{option.description}</p>
            </div>
          ))}
        </div>

        {choiceMade && (
          <div className="mt-8 p-4 bg-green-100/70 rounded-2xl border-2 border-green-300 animate-fade-in">
            <p className="text-green-800 font-bold text-2xl">
              כל הכבוד! כל בחירה שעושה טוב היא בחירה מצוינת.
              <br/>
              השלמתם את המודול!
            </p>
          </div>
        )}
      </div>
    </ModuleView>
  );
};

export default PowerOfGivingModule;
