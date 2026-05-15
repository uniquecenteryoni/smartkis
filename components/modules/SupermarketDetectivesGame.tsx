import React, { useMemo, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface SupermarketDetectivesGameProps {
  onBack: () => void;
}

type DetectiveOption = {
  id: string;
  label: string;
  isMonopoly: boolean;
};

const DETECTIVE_OPTIONS: DetectiveOption[] = [
  { id: 'osem', label: 'אסם', isMonopoly: true },
  { id: 'tnuva', label: 'תנובה', isMonopoly: true },
  { id: 'central', label: 'החברה המרכזית', isMonopoly: true },
  { id: 'strauss', label: 'שטראוס', isMonopoly: true },
  { id: 'shestovich', label: 'שסטוביץ', isMonopoly: true },
  { id: 'leiman', label: 'ליימן שלייסל', isMonopoly: true },
  { id: 'unilever', label: 'יוניליוור', isMonopoly: true },
  { id: 'diplomat', label: 'דיפלומט', isMonopoly: true },
  { id: 'wissotzky', label: 'וויסוצקי', isMonopoly: true },
  { id: 'other', label: 'אחר - לא מונופול', isMonopoly: false },
];

const PLAYER_HASH = '#supermarket-detectives-player';

const getBaseUrl = () => {
  const { origin, pathname, search } = window.location;
  return `${origin}${pathname}${search}`;
};

const getPlayerUrl = () => `${getBaseUrl()}${PLAYER_HASH}`;

const createEmptyCounts = (): Record<string, number> =>
  Object.fromEntries(DETECTIVE_OPTIONS.map((option) => [option.id, 0]));

const SupermarketDetectivesMobile: React.FC = () => {
  const [pressCounts, setPressCounts] = useState<Record<string, number>>(() => createEmptyCounts());
  const [showReport, setShowReport] = useState(false);

  const selectedOptions = useMemo(
    () => DETECTIVE_OPTIONS.filter((option) => (pressCounts[option.id] || 0) > 0),
    [pressCounts],
  );

  const monopolyCount = selectedOptions.reduce(
    (sum, option) => sum + (option.isMonopoly ? pressCounts[option.id] || 0 : 0),
    0,
  );
  const nonMonopolyCount = selectedOptions.reduce(
    (sum, option) => sum + (!option.isMonopoly ? pressCounts[option.id] || 0 : 0),
    0,
  );
  const totalSelections = monopolyCount + nonMonopolyCount;
  const monopolyPercent = totalSelections > 0 ? Math.round((monopolyCount / totalSelections) * 100) : 0;
  const nonMonopolyPercent = totalSelections > 0 ? Math.round((nonMonopolyCount / totalSelections) * 100) : 0;

  const summaryText =
    totalSelections === 0
      ? 'לא בוצעו בחירות עדיין. נסו לבחור מוצרים ולסיים שוב.'
      : monopolyPercent >= 80
        ? 'נראה שהסל שבחרתם נשלט ברובו על ידי שחקנים דומיננטיים.'
        : monopolyPercent >= 50
          ? 'יש תמהיל מעורב, אבל עדיין ניכרת נוכחות חזקה של מונופולים.'
          : 'יפה! בחרתם יחסית הרבה מוצרים שאינם מונופוליים.';

  const incrementOption = (id: string) => {
    if (showReport) return;
    setPressCounts((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const decrementOption = (id: string) => {
    if (showReport) return;
    setPressCounts((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) - 1),
    }));
  };

  const resetSelections = () => {
    if (showReport) return;
    setPressCounts(createEmptyCounts());
  };

  const resetGame = () => {
    setPressCounts(createEmptyCounts());
    setShowReport(false);
  };

  if (showReport) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-cyan-50 to-teal-100 px-4 py-6" dir="rtl">
        <div className="mx-auto max-w-md rounded-3xl bg-white shadow-xl border border-cyan-100 p-5 space-y-4">
          <h1 className="text-2xl font-black text-brand-dark-blue text-center">דו"ח בלשי הסופר</h1>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="rounded-2xl bg-red-50 border border-red-200 p-3">
              <p className="text-sm text-red-700">מונופולים</p>
              <p className="text-3xl font-black text-red-600">{monopolyCount}</p>
              <p className="text-sm font-bold text-red-700">{monopolyPercent}%</p>
            </div>
            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3">
              <p className="text-sm text-emerald-700">ללא מונופול</p>
              <p className="text-3xl font-black text-emerald-600">{nonMonopolyCount}</p>
              <p className="text-sm font-bold text-emerald-700">{nonMonopolyPercent}%</p>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 text-center">
            <p className="text-sm text-slate-600">יחס מונופולים / ללא מונופולים</p>
            <p className="text-2xl font-black text-brand-dark-blue mt-1">{totalSelections > 0 ? `${monopolyCount}:${nonMonopolyCount}` : '-'}</p>
          </div>

          <div className="rounded-2xl bg-cyan-50 border border-cyan-200 p-4 space-y-2">
            <p className="text-sm font-bold text-cyan-800">דוח סיכום</p>
            <p className="text-brand-dark-blue">{summaryText}</p>
            <p className="text-sm text-brand-dark-blue/70">סה"כ לחיצות במיפוי: {totalSelections}</p>
            {selectedOptions.length > 0 && (
              <ul className="text-sm text-brand-dark-blue/70 space-y-1">
                {selectedOptions
                  .sort((a, b) => (pressCounts[b.id] || 0) - (pressCounts[a.id] || 0))
                  .map((option) => (
                    <li key={option.id} className="flex justify-between">
                      <span>{option.label}</span>
                      <span className="font-bold">{pressCounts[option.id] || 0}</span>
                    </li>
                  ))}
              </ul>
            )}
          </div>

          <button
            onClick={resetGame}
            className="w-full rounded-full bg-brand-teal hover:bg-teal-700 text-white font-black py-3 text-lg"
          >
            התחלה מחדש
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-cyan-50 to-teal-100 px-4 py-6" dir="rtl">
      <div className="mx-auto max-w-md rounded-3xl bg-white shadow-xl border border-cyan-100 p-5">
        <h1 className="text-2xl font-black text-brand-dark-blue text-center">בלשי הסופר</h1>
        <p className="text-center text-brand-dark-blue/70 mt-2 mb-5">
          לחצו על החברות שמצאתם על המוצרים בעגלה שלכם.
        </p>

        <div className="grid grid-cols-2 gap-3">
          {DETECTIVE_OPTIONS.map((option) => {
            const count = pressCounts[option.id] || 0;
            const isSelected = count > 0;
            return (
              <div key={option.id} className="space-y-2">
                <button
                  onClick={() => incrementOption(option.id)}
                  className={`aspect-square w-full rounded-full border-2 px-2 text-sm font-black leading-tight transition-transform active:scale-95 ${
                    isSelected
                      ? option.isMonopoly
                        ? 'bg-red-500 text-white border-red-600 shadow-lg'
                        : 'bg-emerald-500 text-white border-emerald-600 shadow-lg'
                      : 'bg-white text-brand-dark-blue border-cyan-200 hover:border-brand-teal'
                  }`}
                >
                  <div className="flex h-full w-full flex-col items-center justify-center gap-1">
                    <span>{option.label}</span>
                    <span className={`text-xs font-black px-2 py-0.5 rounded-full ${isSelected ? 'bg-white/90 text-brand-dark-blue' : 'bg-slate-100 text-slate-500'}`}>
                      {count}
                    </span>
                  </div>
                </button>
                <button
                  onClick={() => decrementOption(option.id)}
                  disabled={count === 0}
                  className="w-full rounded-full border-2 border-slate-300 bg-white py-1.5 text-sm font-black text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  מינוס −1
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-6 space-y-2">
          <button
            onClick={resetSelections}
            disabled={totalSelections === 0}
            className="w-full rounded-full bg-slate-200 hover:bg-slate-300 text-brand-dark-blue font-black py-3 text-lg disabled:opacity-40 disabled:cursor-not-allowed"
          >
            אפס בחירות
          </button>
          <button
            onClick={() => setShowReport(true)}
            className="w-full rounded-full bg-brand-magenta hover:bg-pink-700 text-white font-black py-3 text-lg"
          >
            סיימתי
          </button>
          <p className="text-center text-xs text-brand-dark-blue/60">
            סימנתם עד עכשיו {totalSelections} לחיצות במיפוי.
          </p>
        </div>
      </div>
    </div>
  );
};

export const SupermarketDetectivesPlayerView: React.FC = () => {
  return <SupermarketDetectivesMobile />;
};

const SupermarketDetectivesGame: React.FC<SupermarketDetectivesGameProps> = ({ onBack }) => {
  const playerUrl = useMemo(() => getPlayerUrl(), []);

  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold text-brand-dark-blue">בלשי הסופר</h2>
          <p className="text-brand-dark-blue/60">סרקו QR, בחרו מותגים בטלפון, וקבלו דוח יחס מונופולים/ללא מונופולים.</p>
        </div>
        <button onClick={onBack} className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300">חזרה</button>
      </div>

      <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        <div className="rounded-2xl border-2 border-dashed border-cyan-200 bg-cyan-50/50 p-5 space-y-4">
          <h3 className="text-xl font-black text-brand-dark-blue">הנחיות למדריך</h3>
          <ol className="list-decimal list-inside space-y-2 text-brand-dark-blue/80">
            <li>בקשו מהתלמידים לסרוק את ה-QR עם הטלפון.</li>
            <li>הם מסמנים מותגים שנמצאו בעגלה שלהם בלחיצה על כפתורים עגולים.</li>
            <li>בלחיצה על "סיימתי" יוצג לכל תלמיד דוח אישי עם יחס וסיכום.</li>
          </ol>
          <a
            href={playerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-brand-teal text-white font-bold px-5 py-2 hover:bg-teal-700"
          >
            פתיחה ישירה בנייד
          </a>
          <p className="text-xs text-brand-dark-blue/60 break-all">{playerUrl}</p>
        </div>

        <div className="flex flex-col items-center justify-center gap-3">
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow">
            <QRCodeSVG value={playerUrl} size={220} bgColor="#ffffff" fgColor="#1b2550" level="M" />
          </div>
          <p className="text-center text-brand-dark-blue/70 font-bold">סרקו כדי לפתוח את "בלשי הסופר" בטלפון</p>
        </div>
      </div>
    </div>
  );
};

export default SupermarketDetectivesGame;
