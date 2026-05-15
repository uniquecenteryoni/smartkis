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

const SupermarketDetectivesMobile: React.FC = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showReport, setShowReport] = useState(false);

  const selectedOptions = useMemo(
    () => DETECTIVE_OPTIONS.filter((option) => selectedIds.includes(option.id)),
    [selectedIds],
  );

  const monopolyCount = selectedOptions.filter((option) => option.isMonopoly).length;
  const nonMonopolyCount = selectedOptions.filter((option) => !option.isMonopoly).length;
  const totalSelections = selectedOptions.length;
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

  const toggleOption = (id: string) => {
    if (showReport) return;
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((currentId) => currentId !== id) : [...prev, id],
    );
  };

  const resetGame = () => {
    setSelectedIds([]);
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
            <p className="text-2xl font-black text-brand-dark-blue mt-1">{`${monopolyCount}:${nonMonopolyCount}`}</p>
          </div>

          <div className="rounded-2xl bg-cyan-50 border border-cyan-200 p-4 space-y-2">
            <p className="text-sm font-bold text-cyan-800">דוח סיכום</p>
            <p className="text-brand-dark-blue">{summaryText}</p>
            {selectedOptions.length > 0 && (
              <p className="text-sm text-brand-dark-blue/70">
                נבחרו: {selectedOptions.map((option) => option.label).join(' | ')}
              </p>
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
            const isSelected = selectedIds.includes(option.id);
            return (
              <button
                key={option.id}
                onClick={() => toggleOption(option.id)}
                className={`aspect-square rounded-full border-2 px-2 text-sm font-black leading-tight transition-transform active:scale-95 ${
                  isSelected
                    ? option.isMonopoly
                      ? 'bg-red-500 text-white border-red-600 shadow-lg'
                      : 'bg-emerald-500 text-white border-emerald-600 shadow-lg'
                    : 'bg-white text-brand-dark-blue border-cyan-200 hover:border-brand-teal'
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <div className="mt-6 space-y-2">
          <button
            onClick={() => setShowReport(true)}
            className="w-full rounded-full bg-brand-magenta hover:bg-pink-700 text-white font-black py-3 text-lg"
          >
            סיימתי
          </button>
          <p className="text-center text-xs text-brand-dark-blue/60">
            סימנתם עד עכשיו {selectedIds.length} בחירות.
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
