import React, { useState } from 'react';

interface Card {
  id: number;
  emoji: string;
  workplace: string;
  role: string;
  background: string;
  challenge: string;
}

const CARDS: Card[] = [
  {
    id: 1,
    emoji: '☕',
    workplace: 'בית קפה "הרחוב" ברמת גן',
    role: 'מנהל בית הקפה — בן 38, ניהל מקום כזה 10 שנים',
    background: 'מחפשים מלצר/ית לשישי-שבת. המקום עמוס ודורש עמידה בלחץ גבוה. הכישורים הנדרשים: יחסי אנוש, קצב עבודה מהיר, אמינות.',
    challenge: '⚠️ האתגר: המועמד/ת הגיע/ה 20 דקות מאוחר לראיון, ממש כמו שהתור הכי ארוך בבוקר שישי היה אז.'
  },
  {
    id: 2,
    emoji: '💻',
    workplace: 'חברת הייטק "SoftVision" בתל אביב',
    role: 'מנהלת משאבי אנוש — מקצועית, ישירה, מעריכה הכנה מוקדמת',
    background: 'מחפשים עוזר/ת אדמיניסטרטיבי/ת לקיץ. הכישורים: ארגון, אקסל בסיסי, שירות. החברה פרסמה את משרת הקיץ לפני 3 שבועות.',
    challenge: '⚠️ האתגר: כשנשאל/ת "מה אתה/ת יודע/ת על החברה?" — המועמד/ת שתק/ה לחלוטין. לא עשה/תה שום מחקר מקדים.'
  },
  {
    id: 3,
    emoji: '📚',
    workplace: 'חנות ספרים "הספרייה הישנה" בירושלים',
    role: 'הבעלים — אדם שקט, אוהב ספרים, מחפש מישהו אמין ולא בוחר לפי מחיר',
    background: 'מחפשים עובד/ת לקופה ולסידור מדפים. משרה של 3 ימים בשבוע. השכר מוגדר — 37 ₪ לשעה.',
    challenge: '⚠️ האתגר: המועמד/ת פתח/ה בדרישה ל-55 ₪ לשעה ואמר/ה שזה "פחות ממה שמגיע לו/ה" — בלי להסביר למה.'
  },
  {
    id: 4,
    emoji: '🛍️',
    workplace: 'רשת "סטייל" — חנות ביגוד בקניון',
    role: 'מנהלת הסניף — אנרגטית, מעריכה חיוך ונוכחות, מחפשת כימיה עם הצוות',
    background: 'מחפשים עובד/ת מכירות לקיץ. חשוב: עבודת צוות, יחסי לקוחות, גמישות בשעות. הראיון מתקיים בסניף פעיל.',
    challenge: '⚠️ האתגר: המועמד/ת עונה על כל שאלה בחיוביות — אבל באמצע הראיון הוציא/ה טלפון ויצא/ה להודות בתגובה לסטורי.'
  },
  {
    id: 5,
    emoji: '🤝',
    workplace: 'עמותת "ילד בטוח" — עמותת רווחה לילדים',
    role: 'רכזת המתנדבים — אידיאליסטית, ישירה, מאמינה שמוטיבציה חשובה יותר מניסיון',
    background: 'מחפשים צעיר/ה לעבודה אדמיניסטרטיבית שיום בשבוע. לא תפקיד שכיר — עם מלגה סמלית. הדגש: כוונות אמיתיות.',
    challenge: '⚠️ האתגר: כמעט כל שאלות המועמד/ת היו "כמה ימי חופש יש?", "אפשר לצאת מוקדם?" ו"יש בונוס?" — ושום שאלה על הילדים.'
  },
  {
    id: 6,
    emoji: '🍳',
    workplace: 'מסעדת שף "המטבח של גל" בחיפה',
    role: 'מנהל המטבח — שף ותיק, דורשני, לא סובל חוסר כנות, מוצא ב-2 שניות מי שמגזים',
    background: 'מחפשים עוזר/ת מטבח לסופי שבוע. הכישורים: עמידות בלחץ, עבודה פיזית, פינקטואליות. הניסיון הקולינרי — יתרון.',
    challenge: '⚠️ האתגר: המועמד/ת טוען/ת שעבד/ה שנה במסעדת כוכב בצרפת — אבל כשנשאל/ת פרטים בסיסיים, לא יכול/ה לתאר שום דבר ממשי.'
  },
  {
    id: 7,
    emoji: '📋',
    workplace: 'חברת ביטוח "ביטוח פלוס" בבאר שבע',
    role: 'מנהל מחלקה — סבלני, אנליטי, יודע לקרוא בין השורות',
    background: 'מחפשים עוזר/ת אדמיניסטרטיבי/ת. עבודה מול לקוחות בטלפון. הכישורים: דיוק, שירות, יכולת עמידה בלחץ טלפוני.',
    challenge: '⚠️ האתגר: כששאלתם "למה עזבת את המקום הקודם?" — המועמד/ת פרץ/ה בביקורת קשה על המנהל הישן, הצוות, ובעצם על כולם.'
  },
  {
    id: 8,
    emoji: '🏕️',
    workplace: 'מחנה נוער "שבילים" בגליל',
    role: 'מנהל המחנה — חינוכי, אוהב צוות, מחפש אנרגיה ולב פתוח לילדים',
    background: 'מחפשים מדריך/ה לגיל 10-12 לקיץ שלם. 6 שבועות. הכישורים: אחריות, סבלנות, חוסן, חוש הומור.',
    challenge: '⚠️ האתגר: המועמד/ת שאל/ה אם "אולי החבר/ה שלו/ה יכול/ה לבוא לעבוד איתו/ה" — וכשנשלל, הייתה היסוס ניכר לגבי ההתחייבות.'
  },
  {
    id: 9,
    emoji: '🖥️',
    workplace: 'סטארטאפ "DataFlow" בהרצליה',
    role: 'מייסד שותף — צעיר, ישיר, מעריך אנשים שאומרים "אני לא יודע אבל אלמד"',
    background: 'מחפשים עוזר/ת תפעול לכ-3 חודשים. אין ניסיון נדרש — כן נדרשת סקרנות. הסביבה: מהירה, משתנה, לוחצת.',
    challenge: '⚠️ האתגר: המועמד/ת ענה/תה על כל שאלה בתשובות חד-הברתיות — "כן", "לא", "בסדר" — ולא שאל/ה אפילו שאלה אחת.'
  }
];

interface Props {
  onBack: () => void;
}

export default function InterviewerCardsModule({ onBack }: Props) {
  const [flipped, setFlipped] = useState<Set<number>>(new Set());
  const [selected, setSelected] = useState<number | null>(null);

  const handleFlip = (id: number) => {
    setFlipped(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
    setSelected(id);
  };

  const reset = () => {
    setFlipped(new Set());
    setSelected(null);
  };

  return (
    <div style={{ direction: 'rtl' }}>
      {/* Header */}
      <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 mb-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <p className="text-brand-dark-blue/70">עזרים ונספחים — זכויות עובדים</p>
            <h3 className="text-2xl font-bold text-brand-dark-blue">כרטיסיות מראיינים</h3>
            <p className="text-brand-dark-blue/60 mt-1">9 קלפים הפוכים — בחרו קלף, גלו את תרחיש הראיון שלכם ועמדו באתגר!</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={reset}
              className="px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-bold hover:bg-indigo-200 transition"
            >
              איפוס קלפים
            </button>
            <button
              onClick={onBack}
              className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300 transition"
            >
              חזרה לחלון המשחקים
            </button>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-indigo-50 rounded-2xl border border-indigo-200 p-4 mb-6 text-center">
        <p className="text-indigo-800 font-bold text-lg">🎴 לחצו על קלף כדי לחשוף את תרחיש הראיון שלכם</p>
        <p className="text-indigo-600 mt-1">אתם המראיינים — קראו את הסצנה ובחנו את המועמד/ת!</p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {CARDS.map(card => {
          const isFlipped = flipped.has(card.id);
          return (
            <div
              key={card.id}
              onClick={() => handleFlip(card.id)}
              style={{
                perspective: '1000px',
                cursor: 'pointer',
                minHeight: isFlipped ? 'auto' : '14rem'
              }}
              className="select-none"
            >
              <div
                style={{
                  position: 'relative',
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  minHeight: '14rem',
                }}
              >
                {/* Front (face down) */}
                <div
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    position: 'absolute',
                    inset: 0,
                    minHeight: '14rem',
                  }}
                  className="rounded-3xl border-2 border-dashed border-indigo-300 bg-gradient-to-br from-indigo-600 to-purple-700 flex flex-col items-center justify-center shadow-lg hover:-translate-y-1 hover:shadow-xl transition-transform"
                >
                  <p className="text-6xl mb-3">🎴</p>
                  <p className="text-white font-bold text-xl">תרחיש {card.id}</p>
                  <p className="text-indigo-200 mt-1 text-sm">לחצו לחשיפה</p>
                </div>

                {/* Back (face up) */}
                <div
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    position: isFlipped ? 'relative' : 'absolute',
                    inset: 0,
                  }}
                  className="rounded-3xl border-2 border-indigo-300 bg-white shadow-xl p-5 flex flex-col gap-3"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{card.emoji}</span>
                    <span className="text-xs font-bold text-white bg-indigo-600 rounded-full px-3 py-1">תרחיש {card.id}</span>
                    <span
                      onClick={e => { e.stopPropagation(); handleFlip(card.id); }}
                      className="mr-auto text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
                    >✕ סגור</span>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-1">📍 מקום העבודה</p>
                    <p className="text-brand-dark-blue font-bold text-base">{card.workplace}</p>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-1">🧑‍💼 תפקיד המראיין</p>
                    <p className="text-brand-dark-blue text-sm">{card.role}</p>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-1">📋 רקע</p>
                    <p className="text-brand-dark-blue/80 text-sm">{card.background}</p>
                  </div>

                  <div className="bg-amber-50 rounded-xl border border-amber-200 p-3">
                    <p className="text-sm text-amber-800 font-semibold">{card.challenge}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-6 text-center">
        <p className="text-brand-dark-blue/50 text-sm">
          {flipped.size} מתוך {CARDS.length} קלפים נחשפו
        </p>
      </div>
    </div>
  );
}
