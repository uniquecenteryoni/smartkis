import React, { useMemo, useState } from 'react';
import ModuleView from '../ModuleView';

interface HatsarModelModuleProps {
  onBack: () => void;
  title: string;
  onComplete: () => void;
}

type HatsarType = 'חייב' | 'צריך' | 'רוצה';
type Answer = 'כן' | 'לא';
type ResultStatus = 'buy' | 'wait';

interface HatsarState {
  type: HatsarType | '';
  q1: Answer | null;
  q2: Answer | null;
}

interface HatsarResult {
  status: ResultStatus;
  priority: string;
  text: string;
}

const steps = ['פתיחה', 'בחירת עדיפות', 'שאלה 1', 'שאלה 2', 'תוצאה'];

const HatsarModelModule: React.FC<HatsarModelModuleProps> = ({ onBack, title, onComplete }) => {
  const [hatsarStep, setHatsarStep] = useState(0);
  const [hatsarData, setHatsarData] = useState<HatsarState>({ type: '', q1: null, q2: null });
  const [isCompleted, setIsCompleted] = useState(false);

  const handleStart = (type: HatsarType) => {
    setHatsarData({ type, q1: null, q2: null });
    setHatsarStep(2);
  };

  const handleFinish = () => {
    if (!isCompleted) {
      onComplete();
      setIsCompleted(true);
    }
    setHatsarStep(4);
  };

  const handleRestart = () => {
    setHatsarData({ type: '', q1: null, q2: null });
    setHatsarStep(0);
  };

  const getHatsarResult = (): HatsarResult | null => {
    const { type, q1, q2 } = hatsarData;

    if (!type || !q1 || !q2) {
      return null;
    }

    if (type === 'חייב') {
      const priority = 'עדיפות 1: הכרח';
      if (q1 === 'כן' && q2 === 'לא') {
        return { status: 'buy', priority, text: 'הסבר: אתה חייב את זה עכשיו ואין מחיר טוב יותר כרגע. זו קנייה נבונה.' };
      }
      if (q1 === 'כן' && q2 === 'כן') {
        return { status: 'wait', priority, text: 'הסבר: למרות שאתה חייב את זה עכשיו, המחיר גבוה. מומלץ לנסות לחפש מקום זול יותר לפני הרכישה.' };
      }
      if (q1 === 'לא' && q2 === 'כן') {
        return { status: 'wait', priority, text: 'הסבר: אתה לא חייב את זה עכשיו וגם המחיר גבוה. כדאי להמתין.' };
      }
      return { status: 'wait', priority, text: 'הסבר: למרות שהמחיר טוב, אתה לא חייב את זה עכשיו ולכן מוטב לחסוך למה שאתה חייב קודם.' };
    }

    if (type === 'צריך') {
      const priority = 'עדיפות 2: צורך';
      if (q1 === 'כן' && q2 === 'כן') {
        return {
          status: 'buy',
          priority,
          text: 'הסבר: אתה צריך ואתה יכול להרשות לעצמך. שים לב שבמידה שיש משהו שאתה "חייב" ועוד לא קנית, הוא קודם למה שאתה "צריך".'
        };
      }
      if (q1 === 'כן' && q2 === 'לא') {
        return {
          status: 'wait',
          priority,
          text: 'הסבר: אתה אמנם צריך, אך התקציב כרגע לא מאפשר זאת בצורה בטוחה.'
        };
      }
      if (q1 === 'לא' && q2 === 'כן') {
        return {
          status: 'wait',
          priority,
          text: 'הסבר: אתה יכול להרשות לעצמך אך אינך צריך כרגע. רכישה כזו עלולה לפגוע ביכולת שלך לקנות דברים שתהיה "חייב" בהמשך.'
        };
      }
      return {
        status: 'wait',
        priority,
        text: 'הסבר: אתה לא צריך ולא יכול להרשות לעצמך - אין סיבה כלכלית לבצע את הרכישה.'
      };
    }

    const priority = 'עדיפות 3: רצון';
    if (q1 === 'כן' && q2 === 'כן') {
      return {
        status: 'buy',
        priority,
        text: 'הסבר: אתה רוצה ואתה יכול להרשות לעצמך. מותר להתפנק מדי פעם, רק ודא שאין משהו שאתה צריך או חייב קודם.'
      };
    }
    if (q1 === 'כן' && q2 === 'לא') {
      return {
        status: 'wait',
        priority,
        text: 'הסבר: זהו רצון שאינו תואם את היכולת הכלכלית שלך כרגע. כדאי לחסוך עבור זה בנפרד.'
      };
    }
    if (q1 === 'לא' && q2 === 'כן') {
      return {
        status: 'wait',
        priority,
        text: 'הסבר: למרות שאתה יכול להרשות לעצמך, אתה לא באמת רוצה את זה מספיק. חבל לבזבז כסף על רכישה רגשית חולפת.'
      };
    }
    return {
      status: 'wait',
      priority,
      text: 'הסבר: אתה לא באמת רוצה ואתה לא יכול להרשות לעצמך. זהו בזבוז כסף מוחלט.'
    };
  };

  const result = useMemo(() => getHatsarResult(), [hatsarData]);

  const askFirstQuestion = hatsarData.type === 'חייב'
    ? 'האם אתה חייב את זה עכשיו?'
    : hatsarData.type === 'צריך'
      ? 'האם אתה באמת צריך את זה?'
      : 'האם אתה באמת רוצה את זה?';

  const askSecondQuestion = hatsarData.type === 'חייב'
    ? 'האם ניתן להשיג במחיר טוב יותר?'
    : 'האם אתה יכול להרשות לעצמך כרגע?';

  return (
    <ModuleView title={title} onBack={onBack}>
      <div className="max-w-4xl mx-auto text-right" dir="rtl">
        <div className="mb-8">
          <div className="flex items-center justify-between gap-4 mb-3">
            <h3 className="text-3xl font-bold text-brand-dark-blue">מחשבון מודל החצ״ר</h3>
            <span className="text-sm bg-brand-light-blue/10 text-brand-dark-blue font-bold px-3 py-1 rounded-full">
              שלב {hatsarStep + 1} מתוך {steps.length}
            </span>
          </div>
          <p className="text-lg text-brand-dark-blue/80">
            קניות מזדמנות הן המקום שבו הכסף "בורח" מהכיס. לפני שקונים, עוצרים רגע וחושבים לפי סדר העדיפויות: חייב, צריך, רוצה.
          </p>
        </div>

        {hatsarStep === 0 && (
          <div className="bg-white/60 border border-white/40 rounded-3xl p-8 text-center">
            <div className="text-6xl mb-4">🧠💸</div>
            <p className="text-xl text-brand-dark-blue/90 mb-8 font-semibold">
              בחרו סוג הוצאה כדי להתחיל את תהליך קבלת ההחלטה.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button onClick={() => handleStart('חייב')} className="bg-brand-magenta hover:bg-pink-700 text-white rounded-2xl py-5 text-2xl font-black transition-colors">חייב</button>
              <button onClick={() => handleStart('צריך')} className="bg-brand-teal hover:bg-teal-600 text-white rounded-2xl py-5 text-2xl font-black transition-colors">צריך</button>
              <button onClick={() => handleStart('רוצה')} className="bg-brand-light-blue hover:bg-cyan-600 text-white rounded-2xl py-5 text-2xl font-black transition-colors">רוצה</button>
            </div>
          </div>
        )}

        {(hatsarStep === 2 || hatsarStep === 3) && hatsarData.type && (
          <div className="bg-white/60 border border-white/40 rounded-3xl p-8">
            <div className="mb-6 flex items-center justify-between">
              <button
                onClick={() => setHatsarStep(prev => (prev === 2 ? 0 : 2))}
                className="bg-brand-magenta/10 hover:bg-brand-magenta/20 text-brand-magenta font-bold px-4 py-2 rounded-xl transition-colors"
              >
                חזרה
              </button>
              <span className="bg-brand-dark-blue text-white px-4 py-2 rounded-full font-bold">
                {hatsarData.type}
              </span>
            </div>

            <h4 className="text-2xl font-bold text-brand-dark-blue mb-8 text-center">
              {hatsarStep === 2 ? askFirstQuestion : askSecondQuestion}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => {
                  if (hatsarStep === 2) {
                    setHatsarData(prev => ({ ...prev, q1: 'כן' }));
                    setHatsarStep(3);
                  } else {
                    setHatsarData(prev => ({ ...prev, q2: 'כן' }));
                    handleFinish();
                  }
                }}
                className="bg-brand-dark-blue hover:opacity-90 text-white rounded-2xl py-5 text-2xl font-black transition-opacity"
              >
                כן
              </button>
              <button
                onClick={() => {
                  if (hatsarStep === 2) {
                    setHatsarData(prev => ({ ...prev, q1: 'לא' }));
                    setHatsarStep(3);
                  } else {
                    setHatsarData(prev => ({ ...prev, q2: 'לא' }));
                    handleFinish();
                  }
                }}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-2xl py-5 text-2xl font-black transition-colors"
              >
                לא
              </button>
            </div>
          </div>
        )}

        {hatsarStep === 4 && result && (
          <div className="bg-white/70 border border-white/50 rounded-3xl p-8 text-center">
            <div className="mb-4 inline-block px-4 py-1 rounded-full bg-brand-dark-blue/10 text-brand-dark-blue text-sm font-bold">
              {result.priority}
            </div>
            <div className={`mx-auto mb-6 w-24 h-24 rounded-3xl flex items-center justify-center text-5xl ${result.status === 'buy' ? 'bg-brand-teal' : 'bg-brand-magenta'}`}>
              {result.status === 'buy' ? '✅' : '🛑'}
            </div>
            <h4 className="text-3xl font-black mb-5 text-brand-dark-blue">
              המלצה: {result.status === 'buy' ? 'קונים' : 'לא קונים'}
            </h4>
            <p className="bg-white/80 border border-slate-100 p-5 rounded-2xl text-lg text-brand-dark-blue/90 font-semibold leading-relaxed mb-8">
              {result.text}
            </p>

            <button
              onClick={handleRestart}
              className="bg-brand-dark-blue hover:opacity-90 text-white font-black text-lg px-8 py-3 rounded-full transition-opacity"
            >
              בדיקה נוספת
            </button>
          </div>
        )}
      </div>
    </ModuleView>
  );
};

export default HatsarModelModule;
