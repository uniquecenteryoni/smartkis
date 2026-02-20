import React, { useState, useEffect } from 'react';
import ModuleView from '../../ModuleView';

interface ModuleProps {
  onBack: () => void;
  title: string;
  onComplete: () => void;
}

const countries = [
    { id: 'usa', name: 'ארצות הברית', currency: 'דולר', symbol: '$', fact: 'הידעתם? על שטר הדולר מסתתרת ינשוף קטן!', position: { top: '35%', left: '20%' }, flag: 'https://flagcdn.com/w160/us.png' },
    { id: 'eu', name: 'אירופה', currency: 'אירו', symbol: '€', fact: 'על שטרי האירו מצוירים גשרים, אבל אף אחד מהם לא קיים באמת!', position: { top: '30%', left: '48%' }, flag: 'https://flagcdn.com/w160/eu.png' },
    { id: 'uk', name: 'בריטניה', currency: 'פאונד', symbol: '£', fact: 'הפאונד הבריטי הוא המטבע העתיק בעולם שעדיין נמצא בשימוש!', position: { top: '25%', left: '42%' }, flag: 'https://flagcdn.com/w160/gb.png' },
    { id: 'japan', name: 'יפן', currency: 'ין', symbol: '¥', fact: 'מטבע של ין יפני אחד כל כך קל שהוא יכול לצוף על המים!', position: { top: '35%', left: '80%' }, flag: 'https://flagcdn.com/w160/jp.png' },
    { id: 'china', name: 'סין', currency: 'יואן', symbol: '¥', fact: 'בסין, נהוג לתת כסף במעטפות אדומות מיוחדות בחגים!', position: { top: '40%', left: '72%' }, flag: 'https://flagcdn.com/w160/cn.png' },
    { id: 'india', name: 'הודו', currency: 'רופי', symbol: '₹', fact: 'על כל שטר רופי הודי, הסכום כתוב ב-17 שפות שונות!', position: { top: '55%', left: '65%' }, flag: 'https://flagcdn.com/w160/in.png' },
    { id: 'australia', name: 'אוסטרליה', currency: 'דולר אוסטרלי', symbol: 'A$', fact: 'השטרות באוסטרליה עשויים מפלסטיק והם עמידים במים!', position: { top: '80%', left: '80%' }, flag: 'https://flagcdn.com/w160/au.png' },
].sort(() => Math.random() - 0.5);

const WorldTourModule: React.FC<ModuleProps> = ({ onBack, title, onComplete }) => {
    const [matches, setMatches] = useState<string[]>([]);
    const [message, setMessage] = useState('לחצו על הדגל הנכון עבור המטבע!');
    const [fact, setFact] = useState<string | null>(null);

    const currentCountry = countries.find(c => !matches.includes(c.id));

    const handleCountryClick = (countryId: string) => {
        if (!currentCountry || matches.includes(currentCountry.id)) return;

        if (countryId === currentCountry.id) {
            setMatches(prev => [...prev, countryId]);
            setMessage('נהדר! התאמה נכונה!');
            setFact(currentCountry.fact);
            setTimeout(() => setFact(null), 4000);
        } else {
            setMessage('אופס, זו לא המדינה הנכונה. נסו שוב!');
        }
    };
    
    useEffect(() => {
        if (matches.length === countries.length) {
            setMessage('כל הכבוד! השלמתם את המסע העולמי!');
            onComplete();
        }
    }, [matches, onComplete]);

    return (
        <ModuleView title={title} onBack={onBack}>
            <div className="text-center bg-white/40 backdrop-blur-md p-4 sm:p-8 rounded-3xl shadow-xl border border-white/50">
                <h3 className="text-4xl font-bold text-brand-teal mb-4">מסביב לעולם עם כסף!</h3>
                <p className="text-2xl text-brand-dark-blue/90 mb-6">
                   לכל מדינה כסף משלה. לחצו על הדגל הנכון עבור המטבע שמופיע.
                </p>

                <div className="mb-8 bg-white/60 p-6 rounded-2xl inline-block shadow-lg border border-white/50">
                    <h4 className="text-3xl font-bold">המטבע הנוכחי:</h4>
                    {currentCountry ? (
                        <div className="text-8xl font-bold text-brand-magenta flex items-center justify-center gap-4 drop-shadow-lg">
                            {currentCountry.symbol}
                            <span className="text-5xl font-semibold text-brand-dark-blue/80">({currentCountry.currency})</span>
                        </div>
                    ) : (
                         <div className="text-5xl font-bold text-green-600 animate-bounce">סיימתם! 🎉</div>
                    )}
                </div>


                <div className="relative w-full max-w-4xl mx-auto aspect-[2/1] bg-blue-300 rounded-2xl overflow-hidden border-4 border-brand-light-blue shadow-2xl">
                    <img src="https://storage.googleapis.com/smartkis-ai-assets/simplified-world-map.svg" alt="מפת העולם" className="w-full h-full object-cover opacity-70" />
                    {countries.map(country => (
                        <button
                            key={country.id}
                            onClick={() => handleCountryClick(country.id)}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 p-1 rounded-full transition-all duration-300 bg-white/50 shadow-lg"
                            style={country.position}
                            disabled={matches.includes(country.id)}
                        >
                            {matches.includes(country.id) ? (
                                <div className="text-center bg-green-500 text-white w-24 h-24 flex flex-col items-center justify-center rounded-full shadow-lg animate-fade-in transform scale-110">
                                    <div className="text-4xl font-bold">{country.symbol}</div>
                                    <div className="font-bold text-md">{country.name}</div>
                                </div>
                            ) : (
                                <img src={country.flag} alt={country.name} className="w-16 h-16 rounded-full object-cover border-4 border-white transition-transform transform hover:scale-125 hover:rotate-6"/>
                            )}
                        </button>
                    ))}
                    {fact && (
                         <div className="absolute top-4 right-4 bg-yellow-200 p-4 rounded-xl shadow-lg max-w-xs text-yellow-900 font-semibold animate-fade-in border-2 border-yellow-300 z-10">
                            💡 {fact}
                        </div>
                    )}
                </div>

                {message && <p className="mt-8 text-3xl font-bold text-brand-teal">{message}</p>}
            </div>
        </ModuleView>
    );
};

export default WorldTourModule;