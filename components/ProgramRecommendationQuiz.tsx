import React, { useState } from 'react';

interface Question {
  question: string;
  options: {
    text: string;
    program: 'hacham-bakis' | 'ma-bakis' | 'kisonim';
  }[];
}

const questions: Question[] = [
  {
    question: 'כמה ניסיון יש לכם בניהול תקציב אישי?',
    options: [
      { text: 'אני כבר מנהל/ת תקציב עם החלטות מורכבות', program: 'hacham-bakis' },
      { text: 'הכרות בסיסית עם הוצאות והכנסות', program: 'ma-bakis' },
      { text: 'אין ניסיון, רוצה להתחיל בקטן', program: 'kisonim' },
    ],
  },
  {
    question: 'איך אתם מרגישים עם מושגים כמו ריבית דריבית והשקעות?',
    options: [
      { text: 'בטוח/ה, רוצה סימולטור והשקעות מתקדמות', program: 'hacham-bakis' },
      { text: 'מכיר/ה בסיסית, רוצה ללמוד יותר', program: 'ma-bakis' },
      { text: 'עדיין לא מכיר/ה, צריך הסבר משחקי', program: 'kisonim' },
    ],
  },
  {
    question: 'איך הייתם רוצים ללמוד על עבודה ותלוש שכר?',
    options: [
      { text: 'רוצה לפענח תלוש ולדעת זכויות עובדים', program: 'hacham-bakis' },
      { text: 'רוצה להבין מהו שכר ודמי כיס', program: 'ma-bakis' },
      { text: 'רק להתחיל להבין מה זה כסף', program: 'kisonim' },
    ],
  },
  {
    question: 'איך תרצו להתנסות בהתמודדות עם מינוס/אשראי?',
    options: [
      { text: 'צריך סימולטור מינוס ותרגול ריביות', program: 'hacham-bakis' },
      { text: 'ללמוד להימנע ממינוס ולתכנן דמי כיס', program: 'ma-bakis' },
      { text: 'מעדיף ללמוד על חסכון פשוט ומטבעות', program: 'kisonim' },
    ],
  },
  {
    question: 'איך תרצו לתרגל צרכנות נבונה?',
    options: [
      { text: 'השוואת מחירים, חוזים והטיות', program: 'hacham-bakis' },
      { text: 'חוקי חצ"ר (חייב/צריך/רוצה) וקניות יומיומיות', program: 'ma-bakis' },
      { text: 'משחקי חנות ושוק צבעוני', program: 'kisonim' },
    ],
  },
  {
    question: 'איזה אופי למידה מתאים לכם יותר?',
    options: [
      { text: 'משימות עומק, ניתוחים, בחנים', program: 'hacham-bakis' },
      { text: 'חידות, מטלות קצרות ואתגרי צוות', program: 'ma-bakis' },
      { text: 'משחקי זיכרון, התאמות וסיפורים', program: 'kisonim' },
    ],
  },
  {
    question: 'איך תרצו ללמוד על יחסים וכסף?',
    options: [
      { text: 'דגש על יחסי עבודה וראיונות', program: 'hacham-bakis' },
      { text: 'שיח בבית ובחברים על כסף וכבוד', program: 'ma-bakis' },
      { text: 'ערכים בסיסיים של נתינה ושיתוף', program: 'kisonim' },
    ],
  },
  {
    question: 'איך תרצו להבין הבדלים בין שכיר לעצמאי?',
    options: [
      { text: 'כן, עם מודל SWOT ומשחקי מיון', program: 'hacham-bakis' },
      { text: 'בקטנה, רק היכרות', program: 'ma-bakis' },
      { text: 'מוקדם מדי, נלמד מושגים פשוטים', program: 'kisonim' },
    ],
  },
  {
    question: 'איך תרצו להתנסות בחקר כלכלי?',
    options: [
      { text: 'כן, משימת חקר אינפלציה וכלים דיגיטליים', program: 'hacham-bakis' },
      { text: 'כן, אבל ברמה בסיסית ומונופולים', program: 'ma-bakis' },
      { text: 'עדיף סיפורים ומשחקים ללא חקר', program: 'kisonim' },
    ],
  },
  {
    question: 'איך תרצו להכיר שוק הון והשקעות?',
    options: [
      { text: 'סימולטור מניות וריבית דריבית', program: 'hacham-bakis' },
      { text: 'היכרות עם חיסכון ומטרות', program: 'ma-bakis' },
      { text: 'איסוף מטבעות ושטרות צבעוניים', program: 'kisonim' },
    ],
  },
  {
    question: 'מהי רמת העברית/קריאה שלכם?',
    options: [
      { text: 'קריאה שוטפת, מוכנים לטקסטים מפורטים', program: 'hacham-bakis' },
      { text: 'קריאה טובה, מעדיפים טקסט קצר ומשחקי', program: 'ma-bakis' },
      { text: 'קריאה בסיסית, צריך אייקונים ומשחקים', program: 'kisonim' },
    ],
  },
  {
    question: 'מהו אורך המפגש הרצוי לכם?',
    options: [
      { text: '40-60 דקות עם עומק', program: 'hacham-bakis' },
      { text: '25-40 דקות עם פעילות', program: 'ma-bakis' },
      { text: '15-25 דקות עם משחק קצר', program: 'kisonim' },
    ],
  },
  {
    question: 'איך תרצו לתרגל עמידה מול קהל ותקשורת?',
    options: [
      { text: 'כן, תרגול עמידה מול קהל ושכנוע', program: 'ma-bakis' },
      { text: 'כן, כחלק מראיונות עבודה', program: 'hacham-bakis' },
      { text: 'פחות, רוצים משחקי דמיון בסיסיים', program: 'kisonim' },
    ],
  },
  {
    question: 'מהי רמת העצמאות המועדפת בלמידה?',
    options: [
      { text: 'עצמאות גבוהה, יכולים להתקדם לבד', program: 'hacham-bakis' },
      { text: 'זקוקים למסגרת, אבל לוקחים חלק פעיל', program: 'ma-bakis' },
      { text: 'צריכים ליווי צמוד ומשחקיות גבוהה', program: 'kisonim' },
    ],
  },
  {
    question: 'איך תרצו לעסוק ביזמות ובניית עסק?',
    options: [
      { text: 'רוצים לבנות תוכנית עסקית ולנתח שוק', program: 'hacham-bakis' },
      { text: 'רוצים רעיונות ליזמות קטנה ודמי כיס', program: 'ma-bakis' },
      { text: 'מעוניינים בדוכן משחקי או שוק צבעוני', program: 'kisonim' },
    ],
  },
];

interface ProgramRecommendationQuizProps {
  onBack: () => void;
}

const ProgramRecommendationQuiz: React.FC<ProgramRecommendationQuizProps> = ({ onBack }) => {
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(-1));
  const [result, setResult] = useState<'hacham-bakis' | 'ma-bakis' | 'kisonim' | null>(null);

  const handleSelect = (qIdx: number, optionIdx: number) => {
    const next = [...answers];
    next[qIdx] = optionIdx;
    setAnswers(next);
  };

  const allAnswered = answers.every(a => a >= 0);

  const handleSubmit = () => {
    const score = { 'hacham-bakis': 0, 'ma-bakis': 0, 'kisonim': 0 } as Record<'hacham-bakis' | 'ma-bakis' | 'kisonim', number>;
    answers.forEach((optIdx, qIdx) => {
      const program = questions[qIdx].options[optIdx].program;
      score[program] += 1;
    });
    const sorted = Object.entries(score).sort((a, b) => b[1] - a[1]);
    setResult(sorted[0][0] as 'hacham-bakis' | 'ma-bakis' | 'kisonim');
  };

  const handleReset = () => {
    setAnswers(Array(questions.length).fill(-1));
    setResult(null);
  };

  const programLabels: Record<'hacham-bakis' | 'ma-bakis' | 'kisonim', string> = {
    'hacham-bakis': 'חכם בכיס (ט׳-י"א)',
    'ma-bakis': 'מה בכיס (ה׳-ח׳)',
    'kisonim': 'כיסונים פיננסיים (א׳-ד׳)',
  };

  return (
    <div className="animate-fade-in">
      <button
        onClick={onBack}
        className="mb-6 w-full sm:w-auto bg-brand-magenta hover:bg-pink-700 text-white font-bold py-2.5 sm:py-3 px-5 sm:px-8 text-base sm:text-xl rounded-full flex items-center justify-center transition-colors duration-300"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H15a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        חזרה לבחירת תוכנית
      </button>

      <div className="card-surface rounded-3xl p-5 sm:p-7 shadow-xl">
        <h2 className="text-3xl sm:text-4xl font-bold font-display text-brand-dark-blue text-center mb-4">בוחן רמה לבחירת תוכנית</h2>
        <p className="text-center text-brand-dark-blue/80 text-lg sm:text-xl mb-6">
          ענו על 15 שאלות קצרות כדי לקבל המלצה לתוכנית המתאימה ביותר.
        </p>

        <div className="space-y-5 max-h-[60vh] overflow-auto pr-1">
          {questions.map((q, qIdx) => (
            <div key={qIdx} className="card-surface rounded-2xl p-4 border border-white/60">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-brand-light-blue text-white font-bold flex items-center justify-center">{qIdx + 1}</div>
                <p className="text-lg sm:text-xl font-semibold text-brand-dark-blue">{q.question}</p>
              </div>
              <div className="grid gap-2 sm:gap-3">
                {q.options.map((opt, optIdx) => {
                  const selected = answers[qIdx] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelect(qIdx, optIdx)}
                      className={`text-right w-full rounded-2xl border px-3 py-3 text-base sm:text-lg transition-all ${
                        selected
                          ? 'bg-brand-light-blue/20 border-brand-light-blue text-brand-dark-blue font-bold'
                          : 'bg-white/60 border-white hover:border-brand-light-blue/60 text-brand-dark-blue'
                      }`}
                    >
                      {opt.text}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className={`w-full sm:w-auto px-5 py-3 rounded-2xl font-bold text-white text-lg sm:text-xl transition-all ${
              allAnswered ? 'bg-brand-teal hover:bg-brand-light-blue' : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            קבלו המלצה
          </button>
          <button
            onClick={handleReset}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl font-bold text-brand-dark-blue text-lg sm:text-xl bg-white/70 hover:bg-white"
          >
            איפוס תשובות
          </button>
        </div>

        {result && (
          <div className="mt-6 card-surface rounded-2xl p-4 border border-white/60 text-center">
            <p className="text-lg sm:text-xl font-semibold text-brand-dark-blue">ההמלצה שלנו:</p>
            <p className="text-2xl sm:text-3xl font-bold text-brand-teal mt-1">{programLabels[result]}</p>
            <p className="text-brand-dark-blue/80 mt-2">בחרו את התוכנית במסך הקודם והתחילו ללמוד.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgramRecommendationQuiz;
