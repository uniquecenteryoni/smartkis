import React, { useMemo, useState } from 'react';

interface HowWasItForUsActivityProps {
  onBack: () => void;
}

const STARTERS = [
  'הכי עניין אותי...',
  'לא ידעתי ש...',
  'הכי אהבתי כש...',
  'לא התחברתי ל...',
  'היה לי קשה עם...',
  'גיליתי על עצמי ש...',
  'הופתעתי לגלות ש...',
  'לקחתי מהשיעורים את...',
  'הטיפ הכי שימושי בשבילי הוא...',
  'אני מתכוון ליישם בבית את...',
  'שינה לי חשיבה במיוחד...',
  'החלק שהכי זכור לי הוא...',
  'אם הייתי מסביר לחבר, הייתי אומר ש...',
  'הבנתי לראשונה איך...',
  'עזר לי במיוחד להבין את...',
  'הייתי רוצה להעמיק עוד ב...',
  'האתגר הכי גדול בשבילי היה...',
  'הצלחתי להשתפר ב...',
  'עזר לי הכי הרבה כש...',
  'הרגשתי ביטחון יותר כש...',
  'המסר המרכזי שאני לוקח הוא...',
  'אני יוצא מהתוכנית עם...',
  'החלק הכי פרקטי עבורי היה...',
  'עכשיו אני מבין טוב יותר את...',
  'הדבר שהייתי משנה הוא...',
  'הייתי שמח שעוד תלמידים ידעו ש...',
  'אני גאה בעצמי על כך ש...',
  'הייתי ממליץ לשמור על...',
  'המשפט שמסכם לי את התהליך הוא...',
  'הצעד הבא שלי מעכשיו הוא...',
];

export default function HowWasItForUsActivity({ onBack }: HowWasItForUsActivityProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const shuffledStarters = useMemo(() => {
    const copy = [...STARTERS];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }, []);

  return (
    <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-5" dir="rtl">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="text-brand-dark-blue/70">פעילות - שיעור סיכום</p>
          <h3 className="text-2xl font-bold text-brand-dark-blue">איך היה לנו?</h3>
          <p className="text-brand-dark-blue/60">בחרו כרטיס פתיחה והשלימו משפט סיכום קצר.</p>
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
        >
          חזרה לחלון המשחקים
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {shuffledStarters.map((starter) => (
            <button
              key={starter}
              onClick={() => setSelected(starter)}
              className={`rounded-2xl border-2 p-5 text-right text-xl font-bold transition shadow-sm hover:-translate-y-0.5 ${
                selected === starter
                  ? 'border-brand-teal bg-teal-50 text-brand-dark-blue shadow-md'
                  : 'border-gray-200 bg-white text-brand-dark-blue/80 hover:border-brand-teal/60'
              }`}
            >
              {starter}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-slate-50 p-6 min-h-[14rem] flex flex-col items-center justify-center text-center">
          {selected ? (
            <>
              <p className="text-sm text-brand-dark-blue/60 mb-2">הכרטיס שנבחר:</p>
              <p className="text-3xl font-black text-brand-dark-blue">{selected}</p>
              <p className="mt-4 text-brand-dark-blue/70">עכשיו תנו לתלמיד או לקבוצה להשלים את המשפט.</p>
            </>
          ) : (
            <>
              <p className="text-5xl mb-3">💬</p>
              <p className="text-xl font-bold text-brand-dark-blue">בחרו כרטיס לפתיחת שיתוף</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
