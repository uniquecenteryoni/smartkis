import React, { useMemo, useState } from 'react';
import ModuleView from '../ModuleView';
import { TrophyIcon } from '../icons/Icons';

interface MonopoliesModuleProps {
  onBack: () => void;
  title: string;
  onComplete: () => void;
}

const steps = ['מהו מונופול?', 'אתגר השוקו', 'שרשרת הצריכה', 'מיזוגים ורכישות', 'מי שומר עלינו?', 'חידון המונופולים'];
const BASE = import.meta.env.BASE_URL;

const IntroductionStep: React.FC = () => {
  const [mode, setMode] = useState<'competitive' | 'oligopoly' | 'monopoly' | 'bigSupplier'>('competitive');

  const model = {
    competitive: {
      title: 'שוק תחרותי',
      icon: '🏪🏪🏪',
      color: 'text-green-700',
      bg: 'bg-green-50 border-green-300',
      text: 'הרבה מוכרים, מחירים נמוכים, מבחר גדול – הצרכן מרוויח.',
    },
    oligopoly: {
      title: 'אוליגופול',
      icon: '🏢🏢🏢',
      color: 'text-yellow-700',
      bg: 'bg-yellow-50 border-yellow-300',
      text: 'מעט חברות גדולות שולטות ברוב השוק – התחרות מוגבלת.',
    },
    monopoly: {
      title: 'מונופול',
      icon: '👑',
      color: 'text-red-700',
      bg: 'bg-red-50 border-red-300',
      text: 'לפי חוק התחרות הכלכלית (בנוסחו לאחר תיקון 2019): מונופול הוא מי שמחזיק ביותר ממחצית מכלל אספקת הנכס/השירות בשוק מסוים, או ביותר ממחצית מכלל רכישתו.',
    },
    bigSupplier: {
      title: 'ספק גדול',
      icon: '🏭',
      color: 'text-indigo-700',
      bg: 'bg-indigo-50 border-indigo-300',
      text: 'בענף המזון: ספק שמחזור המכירות השנתי שלו בישראל עולה על 300 מיליון ש״ח (לפי חוק המזון).',
    },
  }[mode];

  return (
    <div className="bg-white/40 backdrop-blur-md border border-white/30 p-6 rounded-2xl space-y-5 animate-fade-in">
      <h3 className="text-3xl font-bold text-brand-teal text-center">מהו מונופול?</h3>
      <p className="text-xl text-center text-brand-dark-blue/85">עברו בין שלושת המצבים כדי להבין איך מבנה השוק משפיע עלינו.</p>

      <div className="flex justify-center gap-2 flex-wrap">
        <button onClick={() => setMode('competitive')} className={`px-4 py-2 rounded-full font-bold border-2 ${mode === 'competitive' ? 'bg-green-600 text-white border-green-600' : 'bg-white border-gray-300 text-brand-dark-blue'}`}>תחרותי</button>
        <button onClick={() => setMode('oligopoly')} className={`px-4 py-2 rounded-full font-bold border-2 ${mode === 'oligopoly' ? 'bg-yellow-500 text-white border-yellow-500' : 'bg-white border-gray-300 text-brand-dark-blue'}`}>אוליגופול</button>
        <button onClick={() => setMode('monopoly')} className={`px-4 py-2 rounded-full font-bold border-2 ${mode === 'monopoly' ? 'bg-red-600 text-white border-red-600' : 'bg-white border-gray-300 text-brand-dark-blue'}`}>מונופול</button>
        <button onClick={() => setMode('bigSupplier')} className={`px-4 py-2 rounded-full font-bold border-2 ${mode === 'bigSupplier' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-gray-300 text-brand-dark-blue'}`}>ספק גדול</button>
      </div>

      <div className={`rounded-2xl border-2 p-6 text-center ${model.bg}`}>
        <p className="text-5xl mb-2">{model.icon}</p>
        <h4 className={`text-2xl font-black ${model.color}`}>{model.title}</h4>
        <p className="text-lg text-brand-dark-blue mt-2">{model.text}</p>
      </div>

      <div className="bg-white/70 border border-gray-200 rounded-2xl p-4">
        <p className="text-sm font-bold text-brand-dark-blue/70 mb-2 text-center">המונופולים והספקים הגדולים בישראל</p>
        <img
          src={`${BASE}LOGOSMONOPOLY.SVG.svg`}
          alt="המונופולים והספקים הגדולים בישראל"
          className="w-full rounded-xl border border-gray-200"
        />
      </div>
    </div>
  );
};

const ShokoGame: React.FC = () => {
  const [round, setRound] = useState(0);
  const rounds = [
    {
      title: 'סיבוב 1 — שוק תחרותי',
      desc: 'בחרו מאיזו חנות לקנות שוקו. יש הרבה אפשרויות.',
      cards: [
        { name: 'שוקו-כיף', price: 5, icon: '🥛', color: 'bg-green-500' },
        { name: 'שוקו-לנד', price: 4, icon: '🧃', color: 'bg-blue-500' },
        { name: 'שוקו-פרימיום', price: 7, icon: '✨', color: 'bg-purple-500' },
      ],
      insight: 'תחרות = מחירים נוחים ובחירה אמיתית.',
    },
    {
      title: 'סיבוב 2 — אוליגופול',
      desc: 'החברות הקטנות נרכשו ונשארו רק 3 גדולות.',
      cards: [
        { name: 'מגה-שוקו א׳', price: 9, icon: '🏢', color: 'bg-yellow-500' },
        { name: 'מגה-שוקו ב׳', price: 9, icon: '🏢', color: 'bg-yellow-500' },
        { name: 'מגה-שוקו ג׳', price: 10, icon: '🏢', color: 'bg-yellow-600' },
      ],
      insight: 'פחות תחרות = מחירים דומים וגבוהים יותר.',
    },
    {
      title: 'סיבוב 3 — מונופול',
      desc: 'נשאר שחקן אחד בלבד בשוק.',
      cards: [{ name: 'תאגיד השוקו', price: 18, icon: '👑', color: 'bg-red-600' }],
      insight: 'מונופול = כוח שוק גבוה, והצרכן משלם יותר.',
    },
  ];

  const current = rounds[round];

  return (
    <div className="bg-white/40 backdrop-blur-md border border-white/30 p-6 rounded-2xl space-y-5 animate-fade-in text-center">
      <h3 className="text-3xl font-bold text-brand-teal">אתגר השוקו</h3>
      <p className="text-brand-dark-blue/80 text-lg">{current.desc}</p>

      <div className={`grid gap-3 ${current.cards.length === 1 ? 'grid-cols-1 max-w-xs mx-auto' : 'grid-cols-1 md:grid-cols-3'}`}>
        {current.cards.map(c => (
          <div key={c.name} className={`${c.color} rounded-2xl p-5 text-white border-4 border-white/40`}>
            <p className="text-4xl mb-2">{c.icon}</p>
            <p className="text-xl font-black">{c.name}</p>
            <p className="text-4xl font-black mt-1">₪{c.price}</p>
          </div>
        ))}
      </div>

      <div className="bg-white/70 border border-gray-200 rounded-xl p-4">
        <p className="font-bold text-brand-dark-blue">{current.insight}</p>
      </div>

      <div className="flex justify-center gap-2">
        <button onClick={() => setRound(r => Math.max(0, r - 1))} disabled={round === 0} className="px-5 py-2 rounded-full font-bold bg-gray-200 text-brand-dark-blue disabled:opacity-40">הקודם</button>
        <button onClick={() => setRound(r => Math.min(rounds.length - 1, r + 1))} disabled={round === rounds.length - 1} className="px-5 py-2 rounded-full font-bold bg-brand-teal text-white disabled:opacity-40">הבא</button>
      </div>
    </div>
  );
};

const chainStages = [
  {
    name: 'יצרן',
    icon: '🏭',
    extra: 'עלות ייצור + חומרי גלם',
    pct: '≈ 35%',
    why: 'אם יש מעט יצרנים גדולים, כוח המיקוח שלהם מול השוק עולה.',
  },
  {
    name: 'יבואן / מפיץ',
    icon: '🚚',
    extra: 'שינוע, אחסון והפצה',
    pct: '≈ 15%',
    why: 'ריכוזיות בהפצה יכולה לייקר את המעבר מהיצרן למדף.',
  },
  {
    name: 'קמעונאי (רשת)',
    icon: '🏪',
    extra: 'שכר, שכירות, תפעול ורווח',
    pct: '≈ 35%',
    why: 'רשתות גדולות קובעות את נקודת המחיר הסופית לצרכן.',
  },
  {
    name: 'צרכן',
    icon: '🛒',
    extra: 'המחיר בקופה',
    pct: '≈ 15%',
    why: 'בסוף השרשרת, כל עלייה בדרך מתגלגלת אל הצרכן.',
  },
];

const chainPins = [
  { icon: '🏭', label: 'יצרן', top: '22%', left: '14%' },
  { icon: '🚚', label: 'מפיץ', top: '60%', left: '36%' },
  { icon: '🏪', label: 'סופר', top: '34%', left: '63%' },
  { icon: '🛒', label: 'צרכן', top: '66%', left: '84%' },
];

const ConsumptionChainStep: React.FC = () => {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const stage = chainStages[active];

  return (
    <div className="bg-white/40 backdrop-blur-md border border-white/30 p-6 rounded-2xl space-y-5 animate-fade-in">
      <h3 className="text-3xl font-bold text-brand-teal text-center">שרשרת הצריכה</h3>
      <p className="text-center text-brand-dark-blue/80 text-lg">איך מוצר מגיע למדף — ומה קורה למחיר בכל תחנה בדרך.</p>

      <div className="relative rounded-2xl border border-gray-200 bg-white/80 p-2 overflow-hidden">
        <img
          src={`${BASE}consumelink2.svg`}
          alt="שרשרת הצריכה"
          className="w-full rounded-xl border border-gray-200 bg-white"
        />
        <div className="hidden md:block absolute inset-0 pointer-events-none">
          {chainPins.map((pin, i) => (
            <button
              key={pin.label}
              onClick={() => setActive(i)}
              className={`pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 rounded-full px-2 py-1 text-xs font-black border-2 shadow ${i === active ? 'bg-brand-teal text-white border-brand-teal' : 'bg-white text-brand-dark-blue border-gray-300'}`}
              style={{ top: pin.top, left: pin.left }}
            >
              <span className="ml-1">{pin.icon}</span>
              {pin.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <button onClick={() => setZoomed(true)} className="px-5 py-2 rounded-full border-2 border-brand-teal text-brand-teal font-bold bg-white hover:bg-brand-teal hover:text-white transition">
          🔍 הגדל תמונה
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {chainStages.map((s, i) => (
          <button
            key={s.name}
            onClick={() => setActive(i)}
            className={`rounded-xl py-2 px-2 text-center border-2 font-bold transition ${i === active ? 'bg-brand-teal text-white border-brand-teal' : 'bg-white border-gray-300 text-brand-dark-blue'}`}
          >
            <span className="block text-2xl">{s.icon}</span>
            <span className="text-xs">{s.name}</span>
          </button>
        ))}
      </div>

      <div className="bg-white/80 rounded-2xl border border-gray-200 p-4 space-y-2">
        <p className="text-xl font-black text-brand-dark-blue">{stage.icon} {stage.name}</p>
        <p className="text-sm font-bold text-brand-teal">מרכיב מחיר משוער: {stage.pct}</p>
        <p className="text-brand-dark-blue/80">{stage.extra}</p>
        <p className="text-brand-dark-blue/90 font-bold">{stage.why}</p>
      </div>

      <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 text-amber-800 font-bold">
        💡 מסקנה: גם בלי שינוי בעלות הייצור, כוח שוק באחת התחנות יכול להעלות את המחיר לצרכן.
      </div>

      {zoomed && (
        <div className="fixed inset-0 z-50 bg-black/85 p-4 md:p-8 flex flex-col" dir="rtl">
          <div className="flex justify-between items-center mb-3">
            <p className="text-white font-black text-lg">שרשרת הצריכה — תצוגה מוגדלת</p>
            <button onClick={() => setZoomed(false)} className="px-4 py-2 rounded-full bg-white text-brand-dark-blue font-bold">סגור ✕</button>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <img
              src={`${BASE}consumelink2.svg`}
              alt="שרשרת הצריכה מוגדל"
              className="max-h-full max-w-full object-contain rounded-xl border-2 border-white"
            />
          </div>
        </div>
      )}
    </div>
  );
};

const mergers = [
  { year: '2006', title: 'נסטלה מרחיבה אחיזה באסם', text: 'חיזוק כוח בשוק המזון הארוז.' },
  { year: '2008', title: 'שותפויות גדולות בתחום החלב', text: 'שחקנים גדולים מתקרבים זה לזה.' },
  { year: '2011', title: 'מחאת הקוטג׳', text: 'לחץ צרכני הביא לשינוי במחירים.' },
  { year: '2013', title: 'חוק הריכוזיות', text: 'ניסיון מדינתי לצמצם כוח מרוכז במשק.' },
  { year: '2021', title: 'בדיקות מיזוגים בשוק המזון', text: 'רשות התחרות בוחנת פגיעה אפשרית בצרכן.' },
];

const MergersStep: React.FC = () => {
  const [visible, setVisible] = useState(2);

  return (
    <div className="bg-white/40 backdrop-blur-md border border-white/30 p-6 rounded-2xl space-y-4 animate-fade-in">
      <h3 className="text-3xl font-bold text-brand-teal text-center">מיזוגים ורכישות</h3>
      <p className="text-center text-brand-dark-blue/80 text-lg">מונופולים מתחזקים לא רק דרך מכירה — אלא גם דרך קנייה של מתחרים.</p>

      <div className="space-y-3">
        {mergers.slice(0, visible).map((m, i) => (
          <div key={i} className="rounded-xl border-2 border-blue-200 bg-blue-50 p-4">
            <p className="font-black text-blue-900">{m.year} — {m.title}</p>
            <p className="text-blue-800">{m.text}</p>
          </div>
        ))}
      </div>

      {visible < mergers.length ? (
        <button onClick={() => setVisible(v => v + 1)} className="w-full py-3 rounded-full bg-brand-teal text-white font-black">הצג אירוע נוסף</button>
      ) : (
        <div className="text-center text-green-700 font-bold bg-green-50 border border-green-300 rounded-xl p-3">סיימתם את ציר הזמן ✅</div>
      )}
    </div>
  );
};

const AuthorityStep: React.FC = () => {
  const tools = [
    { icon: '🚫', title: 'הכרזה על מונופול', desc: 'חברה עם כוח שוק משמעותי נכנסת לפיקוח מוגבר.' },
    { icon: '⛔', title: 'בדיקת מיזוגים', desc: 'רכישות גדולות נבדקות כדי למנוע פגיעה בתחרות.' },
    { icon: '⚖️', title: 'איסור קרטלים', desc: 'תיאום מחירים בין מתחרים אסור על פי חוק.' },
    { icon: '🧾', title: 'אכיפה וקנסות', desc: 'לרשות התחרות יש סמכויות אכיפה וכלים משפטיים.' },
  ];

  return (
    <div className="bg-white/40 backdrop-blur-md border border-white/30 p-6 rounded-2xl space-y-5 animate-fade-in">
      <h3 className="text-3xl font-bold text-brand-teal text-center">מי שומר עלינו?</h3>
      <p className="text-center text-brand-dark-blue/80 text-lg">רשות התחרות פועלת כדי לשמור על שוק הוגן ועל הצרכנים.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {tools.map(t => (
          <div key={t.title} className="rounded-xl p-4 border-2 bg-white/70 border-gray-200">
            <p className="text-2xl mb-1">{t.icon}</p>
            <p className="font-black text-brand-dark-blue">{t.title}</p>
            <p className="text-brand-dark-blue/80 text-sm">{t.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const quizQuestions = [
  { product: 'מילקי', image: `${BASE}milki(shtraus).jpg.svg`, options: ['שטראוס', 'תנובה', 'אסם', 'אחר'], correct: 'שטראוס', fact: 'מילקי שייך לקבוצת שטראוס.' },
  { product: 'פרינגלס', image: `${BASE}pringles(diplomat).jpg.svg`, options: ['דיפלומט', 'אסם', 'שסטוביץ׳', 'אחר'], correct: 'דיפלומט', fact: 'פרינגלס מופץ בישראל ע״י דיפלומט.' },
  { product: 'נביעות', image: `${BASE}neviot(cocacola).jpg.svg`, options: ['החברה המרכזית', 'יפאורה', 'טמפו', 'אחר'], correct: 'החברה המרכזית', fact: 'נביעות שייכת לחברה המרכזית למשקאות.' },
  { product: 'אוראל-B', image: `${BASE}oralb(diplomat).jpg.svg`, options: ['דיפלומט', 'שסטוביץ׳', 'יוניליוור', 'אחר'], correct: 'דיפלומט', fact: 'Oral-B מופץ בארץ ע"י דיפלומט.' },
  { product: 'מנטוס', image: `${BASE}mentos(leiman).jpg.svg`, options: ['ליימן שלייסל', 'אסם', 'שטראוס', 'אחר'], correct: 'ליימן שלייסל', fact: 'מנטוס מופץ בישראל על ידי ליימן שלייסל.' },
  { product: 'גבינה לבנה', image: `${BASE}whitecheese(tnuva).jpg.svg`, options: ['תנובה', 'שטראוס', 'טרה', 'אחר'], correct: 'תנובה', fact: 'לתנובה נתח שוק גבוה במוצרי חלב.' },
  { product: 'קורנפלקס', image: `${BASE}kornflex(uniliver).jpg.svg`, options: ['יוניליוור', 'אסם', 'שסטוביץ׳', 'אחר'], correct: 'יוניליוור', fact: 'המוצר משויך כאן לפעילות יוניליוור.' },
  { product: 'מולר', image: `${BASE}muller(cocacola).jpg.svg`, options: ['החברה המרכזית', 'תנובה', 'שטראוס', 'אחר'], correct: 'החברה המרכזית', fact: 'מותג מולר מופץ בישראל ע"י החברה המרכזית.' },
];

const MonopolyQuiz: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [reveal, setReveal] = useState(false);
  const [done, setDone] = useState(false);

  const q = quizQuestions[idx];

  const handleChoose = (option: string) => {
    if (selected) return;
    setSelected(option);
    setReveal(true);
    if (option === q.correct) setScore(s => s + 1);
  };

  const next = () => {
    if (idx < quizQuestions.length - 1) {
      setIdx(i => i + 1);
      setSelected(null);
      setReveal(false);
    } else {
      setDone(true);
      if ((score + (selected === q.correct ? 1 : 0)) / quizQuestions.length >= 0.7) {
        onComplete();
      }
    }
  };

  const finalScore = useMemo(() => {
    if (!done) return score;
    return score;
  }, [done, score]);

  if (done) {
    const pct = Math.round((finalScore / quizQuestions.length) * 100);
    return (
      <div className="text-center p-8 bg-white/80 rounded-2xl space-y-4 animate-fade-in">
        <TrophyIcon className="w-16 h-16 mx-auto text-yellow-500" />
        <h3 className="text-3xl font-black">סיימתם את החידון!</h3>
        <p className="text-2xl">ציון: <span className="font-black text-brand-teal">{finalScore} / {quizQuestions.length}</span></p>
        {pct >= 70 ? (
          <p className="text-green-700 font-black text-xl">כל הכבוד! זיהיתם את מוקדי הכוח בשוק 👏</p>
        ) : (
          <p className="text-red-600 font-black text-xl">נסו שוב כדי להגיע ל-70% ומעלה.</p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-brand-dark-blue rounded-2xl p-4 md:p-6 text-white shadow-2xl animate-fade-in">
      <p className="text-center text-lg font-bold mb-3">שאלה {idx + 1} מתוך {quizQuestions.length}</p>
      <div className="bg-white/10 rounded-xl p-4 text-center border border-brand-light-blue">
        <p className="text-2xl font-black mb-3">מי שולט במוצר: {q.product}?</p>
        <img
          src={q.image}
          alt={q.product}
          className="h-44 mx-auto object-contain rounded-xl"
          onError={e => {
            (e.target as HTMLImageElement).src = `https://placehold.co/260x180?text=${encodeURIComponent(q.product)}`;
          }}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        {q.options.map(option => {
          const isCorrect = option === q.correct;
          const isChosen = option === selected;
          const cls = !reveal
            ? 'bg-brand-dark-blue border-brand-light-blue hover:bg-brand-light-blue/20'
            : isCorrect
              ? 'bg-green-600 border-green-400'
              : isChosen
                ? 'bg-red-600 border-red-400'
                : 'bg-brand-dark-blue/60 border-brand-light-blue/50';

          return (
            <button
              key={option}
              onClick={() => handleChoose(option)}
              disabled={!!selected}
              className={`min-h-[68px] p-3 rounded-xl border-2 text-lg font-bold transition ${cls}`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {reveal && (
        <div className="mt-4 space-y-3">
          <div className={`p-3 rounded-xl border-2 font-bold ${selected === q.correct ? 'bg-green-500/20 border-green-400' : 'bg-red-500/20 border-red-400'}`}>
            {selected === q.correct ? '✅ תשובה נכונה!' : '❌ לא מדויק.'} {q.fact}
          </div>
          <button onClick={next} className="w-full py-3 rounded-xl bg-brand-magenta hover:bg-pink-700 font-black text-xl">
            {idx === quizQuestions.length - 1 ? 'סיום חידון 🏁' : 'לשאלה הבאה →'}
          </button>
        </div>
      )}
    </div>
  );
};

const MonopoliesModule: React.FC<MonopoliesModuleProps> = ({ onBack, title, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const renderStep = () => {
    switch (currentStep) {
      case 0: return <IntroductionStep />;
      case 1: return <ShokoGame />;
      case 2: return <ConsumptionChainStep />;
      case 3: return <MergersStep />;
      case 4: return <AuthorityStep />;
      case 5: return <MonopolyQuiz onComplete={onComplete} />;
      default: return <IntroductionStep />;
    }
  };

  return (
    <ModuleView title={title} onBack={onBack}>
      <div className="mb-8 overflow-x-auto">
        <div className="flex justify-between items-center min-w-[620px]">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <button onClick={() => setCurrentStep(index)} className="flex flex-col items-center flex-1 group">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 font-bold ${
                  currentStep > index
                    ? 'bg-brand-teal border-brand-teal text-white'
                    : currentStep === index
                      ? 'bg-brand-teal border-brand-teal text-white scale-110 shadow-lg'
                      : 'bg-white/50 border-gray-300 group-hover:border-brand-teal'
                }`}>
                  {currentStep > index ? '✓' : index + 1}
                </div>
                <p className={`mt-1 text-xs text-center font-bold transition-colors ${currentStep >= index ? 'text-brand-teal' : 'text-gray-400'}`}>{step}</p>
              </button>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-1 rounded-full transition-all duration-500 ${currentStep > index ? 'bg-brand-teal' : 'bg-gray-300'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {renderStep()}

      <div className="flex justify-between mt-8">
        <button onClick={() => setCurrentStep(s => Math.max(0, s - 1))} disabled={currentStep === 0} className="bg-gray-300 hover:bg-gray-400 text-brand-dark-blue font-bold py-2 px-6 rounded-lg disabled:opacity-50">הקודם</button>
        <button onClick={() => setCurrentStep(s => Math.min(steps.length - 1, s + 1))} disabled={currentStep === steps.length - 1} className="bg-brand-teal hover:bg-teal-500 text-white font-bold py-2 px-6 rounded-lg disabled:opacity-50">הבא</button>
      </div>
    </ModuleView>
  );
};

export default MonopoliesModule;
