import React, { useState } from 'react';
import AliasGame from './modules/AliasGame';
import JeopardyModule from './modules/JeopardyModule';
import MillionDropGame from './modules/MillionDropGame';
import BudgetArcadeGame from './modules/BudgetArcadeGame';
import WorkerRightsParcelGame from './modules/WorkerRightsParcelGame';
import ParcelGame, { expensesItems, overdraftItems, paystubItems, employmentItems, savingsInvestItems, storyItems, personalItems, costsItems, monopolyItems, consumerItems, relationshipsItems, earnItems, timeItems, publicSpeakingItems, businessItems } from './modules/ParcelGame';
import { HatsarStep } from './modules/HowMuchCostModule';
import { FutureManagersChallengeContent } from './modules/FutureManagersChallengeModule';
import { jeopardyChachamBanks } from './modules/jeopardyChachamBanks';
import SnowballGame from './modules/SnowballGame';
import InterviewerCardsModule from './modules/InterviewerCardsModule';
import Header from './Header';
import { SalaryIcon, BusinessIcon, PiggyBankIcon, PodiumIcon } from './icons/Icons';

interface InstructorsPageProps {
  onBack: () => void;
}

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  onSelect?: () => void;
}

const ActionCard: React.FC<ActionCardProps> = ({ title, description, icon: Icon, onSelect }) => (
  <button
    onClick={onSelect}
    className="relative text-center bg-white/60 backdrop-blur-lg p-8 rounded-4xl border-2 border-gray-300 flex flex-col shadow-xl h-full transition hover:-translate-y-1 hover:shadow-2xl"
  >
    <div className="p-4 rounded-full mb-4 shadow-md bg-gray-300 mx-auto">
      <Icon className="w-12 h-12 text-white" />
    </div>
    <h3 className="text-4xl sm:text-5xl font-bold font-display text-gray-700">{title}</h3>
    <p className="text-xl sm:text-2xl mt-2 text-gray-500">{description}</p>
  </button>
);

const PROGRAM_MODULES = ['סרטונים', 'פעילויות ומשחקים', 'עזרים ונספחים'];
const PROGRAM_ACTIVITY_MODULES: Record<string, string[]> = {
  "'חכם בכיס'": [
    'ניהול התקציב הראשון שלי',
    'איך מנהלים הוצאות?',
    'הסכנה שבמינוס',
    'זכויות עובדים',
    'פענוח תלוש שכר',
    'שכירים ועצמאיים',
    'חיסכון והשקעות',
    'משימת למידת חקר',
    'רב תחומי',
    'מסמכים וקישורים שימושיים',
  ],
  "'מה בכיס'": [
    'סיפורו של כסף',
    'הכסף ואני',
    'כמה זה עולה לי?',
    'מונופולים בישראל',
    'צרכנות נבונה',
    'מערכות יחסים וכסף',
    'איך להרוויח כסף?',
    'ניהול זמן (זמן=כסף)',
    'עמידה מול קהל',
    'איך בונים עסק?',
    'רב תחומי',
    'מסמכים שימושיים',
  ],
  "'כיסונים פיננסים'": [
    'מאיפה בא הכסף?',
    'צרכים ורצונות',
    'הרפתקת חיסכון',
    'חנות הקסמים',
    'בנק הקופות',
    'סיור עולמי',
    'סודות הפרסום',
    'משימות הרווחה',
    'שוק צבעוני',
    'מטבעות ושטרות',
    'כוח הנתינה',
    'החלטות קטנות',
  ],
};

const CHACHAM_GENERIC_GAME_ACTIVITIES = [
  'איך מנהלים הוצאות?',
  'הסכנה שבמינוס',
  'זכויות עובדים',
  'פענוח תלוש שכר',
  'שכירים ועצמאיים',
  'חיסכון והשקעות',
];

const MODULE_SUMMARIES: Record<string, string> = {
  'ניהול התקציב הראשון שלי': 'בניית תקציב מאוזן והפקת דו"ח מסכם.',
  'איך מנהלים הוצאות?': 'סיווג הוצאות ומודל חצ"ר לחסכון חכם.',
  'הסכנה שבמינוס': 'הבנת ריבית מינוס וסיכוני חריגה בחשבון.',
  'זכויות עובדים': 'היכרות עם זכויות בסיסיות ובירור מקרים אמיתיים.',
  'פענוח תלוש שכר': 'קריאה והבנה של רכיבי תלוש השכר.',
  'שכירים ועצמאיים': 'הבדלים בין שכיר לעצמאי וניהול תרחישים עסקיים.',
  'חיסכון והשקעות': 'היכרות עם ריבית דריבית וכלים לחיסכון והשקעה.',
  'משימת למידת חקר': 'תרגול חקר אינפלציה והשפעתה על יוקר המחיה.',
  'מסמכים וקישורים שימושיים': 'אוסף חומרים תומכים ומחשובנים לשימוש חופשי.',
  'סיפורו של כסף': 'מסע בזמן על התפתחות אמצעי התשלום והכסף.',
  'הכסף ואני': 'עיצוב מערכת יחסים אישית עם כסף והצבת מטרות.',
  'כמה זה עולה לי?': 'קבלת החלטות קנייה מושכלות והבנת תמחור.',
  'מחשבון מודל החצ"ר': 'תרגול סדר עדיפויות: חייב, צריך, רוצה.',
  "מנהלי העתיד: אתגר ה-5,000": 'ניהול תקציב צוותי מול בלת"מים חודשיים.',
  'מונופולים בישראל': 'זיהוי שחקנים דומיננטיים בשוק והשפעתם.',
  'צרכנות נבונה': 'השוואת מחירים, מבצעים וטיפים לצרכן חכם.',
  'מערכות יחסים וכסף': 'תקשורת פתוחה סביב כסף והשפעתו החברתית.',
  'איך להרוויח כסף?': 'רעיונות לעסקים קטנים והכנסה ראשונה.',
  'ניהול זמן (זמן=כסף)': 'קישור בין תכנון זמן לתוצאות כלכליות.',
  'עמידה מול קהל': 'מיומנויות שכנוע והצגת רעיונות.',
  'איך בונים עסק?': 'מסע יזמות מזיהוי הזדמנות עד תוכנית עסקית.',
  'רב תחומי': 'מרחב לפעילויות חוצות-מודולים בכל תוכנית.',
  'ג׳פרדי פיננסי': 'משחק ג׳פרדי כיתתי מותאם לנושאי התוכנית.',
  'מאיפה בא הכסף?': 'היכרות עם מקורות הכנסה ועבודה ראשונה.',
  'צרכים ורצונות': 'הבחנה בין צרכים לרצונות ותיעדוף נכון.',
  'הרפתקת חיסכון': 'עידוד חיסכון והתמדה במטרות פיננסיות.',
  'חנות הקסמים': 'התנסות בקנייה ומכירה בסביבה משחקית.',
  'בנק הקופות': 'ניהול חסכונות בקופות וריביות בסיסיות.',
  'סיור עולמי': 'חשיפה למטבעות וערכי כסף בעולם.',
  'סודות הפרסום': 'זיהוי טקטיקות פרסום והגברת מודעות צרכנית.',
  'משימות הרווחה': 'דרכים פשוטות להגדלת הכנסה אישית.',
  'שוק צבעוני': 'חוויה משחקית של שוק ומחירים משתנים.',
  'מטבעות ושטרות': 'היכרות עם כסף מזומן וצורתו.',
  'כוח הנתינה': 'השפעת תרומה ונתינה כלכלית.',
  'החלטות קטנות': 'השפעת החלטות יומיומיות על כסף וחיסכון.',
};

const getSummary = (name: string) => MODULE_SUMMARIES[name] || 'תוכן יתווסף בהמשך עבור מודול זה.';

type BudgetChallenge = {
  title: string;
  prompt: string;
  target: string;
  hint: string;
};

const budgetChallenges: BudgetChallenge[] = [
  {
    title: 'תקציב ראשון בלי מינוס',
    prompt: 'הכנסה 1,200 ש"ח. הוצאות חובה 800, הוצאות כיף 500. מה צריך לשנות כדי להישאר מאוזנים?',
    target: 'להוריד 100 ש"ח מכיף או להגדיל הכנסה/חיסכון כדי לסגור ל-1,200.',
    hint: 'חובה + כיף חייבים להיות ≤ הכנסה.',
  },
  {
    title: 'תקציב עם חיסכון יעד',
    prompt: 'הכנסה 1,400 ש"ח. רוצים לשמור 200 ש"ח לחיסכון. חובה 900, כיף 400. מה עושים?',
    target: 'לצמצם כיף ב-100 ש"ח או למצוא הכנסה נוספת כדי לשמור 200 לחיסכון.',
    hint: 'קודם חובה, אחר כך חיסכון יעד, ואז כיף.',
  },
  {
    title: 'בלאי מפתיע',
    prompt: 'הכנסה 1,300 ש"ח. חובה 850, כיף 350. אופניים התקלקלו וצריך 150 ש"ח. איך מאזנים?',
    target: 'להוריד 150 מכיף או לפצל: 100 מכיף, 50 הכנסה נוספת/חיסכון קודם.',
    hint: 'בנו בופר חירום קטן בתוך התקציב.',
  },
  {
    title: 'ריבוי מנויים',
    prompt: 'הכנסה 1,500 ש"ח. חובה 950, חיסכון 150, כיף 500 (שלושה מנויים). איך מיישרים קו?',
    target: 'לוותר על מנוי או שניים כדי לרדת לכ-400 כיף ולהישאר מאוזנים.',
    hint: 'בדקו מנויים לא מנוצלים ודללו.',
  },
  {
    title: 'שדרוג טלפון',
    prompt: 'הכנסה 1,600 ש"ח. חובה 1,000, חיסכון 150, כיף 450. רוצים לשדרג טלפון ב-300 ש"ח החודש. פתרון?',
    target: 'לפרוס ל-2-3 חודשים, להוריד זמנית כיף/חיסכון קטן, או לדחות ולחסוך מראש.',
    hint: 'פריסה ותעדוף לפני חריגה.',
  },
  {
    title: 'חודש חגים',
    prompt: 'הכנסה 1,800 ש"ח. חובה 1,050, חיסכון 200, כיף 600 (מתנות/טיולים). איך נשארים חיוביים?',
    target: 'להגדיר תקרת כיף 450-500, להשאיר חיסכון 200, אולי להקדים הוצאה לחודש הבא/קודם.',
    hint: 'קובעים תקרה לכיף, שומרים חיסכון בסיסי.',
  },
  {
    title: 'עבודה חלקית',
    prompt: 'הכנסה ירדה ל-1,100 ש"ח. חובה 800, חיסכון 100, כיף 300. מה לשנות?',
    target: 'להוריד כיף ל-200 או פחות, להשאיר חיסכון קטן, לבדוק הכנסות נוספות.',
    hint: 'כשיש ירידה בהכנסה, כיף יורד ראשון.',
  },
  {
    title: 'בונוס חד פעמי',
    prompt: 'הכנסה רגילה 1,300 ש"ח + בונוס 300 ש"ח. חובה 900, כיף 300, חיסכון 100. מה עושים עם הבונוס?',
    target: 'להגדיל חיסכון/חוב קודם לבונוסים בכיף; לשמור לפחות חצי לחיסכון.',
    hint: 'בונוס הוא הזדמנות לחזק חיסכון או חוב.',
  },
];

const BudgetPractice: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showTarget, setShowTarget] = useState(false);
  const [newTeam, setNewTeam] = useState('');
  const [teams, setTeams] = useState<{ name: string; score: number }[]>([]);

  const challenge = budgetChallenges[currentIdx];

  const addTeam = () => {
    const name = newTeam.trim();
    if (!name) return;
    setTeams(prev => [...prev, { name, score: 0 }]);
    setNewTeam('');
  };

  const scoreTeam = (index: number, delta: number) => {
    setTeams(prev => prev.map((t, i) => i === index ? { ...t, score: t.score + delta } : t));
  };

  const nextChallenge = () => {
    setShowTarget(false);
    setCurrentIdx(prev => (prev + 1) % budgetChallenges.length);
  };

  return (
    <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-6 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xl text-brand-dark-blue/70">כרטיס אתגר</p>
          <h3 className="text-3xl font-bold text-brand-dark-blue">{challenge.title}</h3>
        </div>
        <button
          onClick={() => setShowTarget(s => !s)}
          className="px-4 py-2 rounded-full bg-brand-magenta text-white font-bold hover:bg-pink-700"
        >
          {showTarget ? 'הסתר פתרון' : 'הצג פתרון'}
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 rounded-2xl border border-dashed border-gray-300 p-4 bg-white">
          <p className="text-lg text-brand-dark-blue/80 mb-2">תיאור האתגר</p>
          <p className="text-2xl font-semibold text-brand-dark-blue">{challenge.prompt}</p>
          <p className="mt-3 text-brand-dark-blue/70 text-lg">רמז: {challenge.hint}</p>
          {showTarget && (
            <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-brand-dark-blue">
              <p className="font-bold">פתרון מוצע</p>
              <p>{challenge.target}</p>
            </div>
          )}
        </div>
        <div className="rounded-2xl border border-dashed border-gray-300 p-4 bg-white space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newTeam}
              onChange={(e) => setNewTeam(e.target.value)}
              placeholder="שם קבוצה"
              className="flex-1 rounded-xl border border-gray-300 px-3 py-2"
            />
            <button onClick={addTeam} className="px-4 py-2 rounded-full bg-brand-dark-blue text-white font-bold hover:bg-blue-800">הוספה</button>
          </div>
          <div className="space-y-2 max-h-64 overflow-auto">
            {teams.length === 0 && <p className="text-brand-dark-blue/60">הוסיפו קבוצות כדי להתחיל ניקוד.</p>}
            {teams.map((team, i) => (
              <div key={team.name + i} className="flex items-center justify-between rounded-xl border border-gray-200 px-3 py-2">
                <div className="font-bold text-brand-dark-blue">{team.name}</div>
                <div className="flex items-center gap-2">
                  <span className="text-brand-dark-blue/70">{team.score} נק'</span>
                  <button onClick={() => scoreTeam(i, 10)} className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 text-sm font-bold hover:bg-emerald-200">+10</button>
                  <button onClick={() => scoreTeam(i, 5)} className="px-2 py-1 rounded-full bg-amber-100 text-amber-800 text-sm font-bold hover:bg-amber-200">+5</button>
                  <button onClick={() => scoreTeam(i, -5)} className="px-2 py-1 rounded-full bg-red-100 text-red-700 text-sm font-bold hover:bg-red-200">-5</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="text-brand-dark-blue/80 text-lg">הנחו את הקבוצות לפתור, ואז חלקו ניקוד לפי דיוק ויצירתיות.</div>
        <button onClick={nextChallenge} className="px-5 py-3 rounded-full bg-brand-magenta text-white font-bold hover:bg-pink-700">כרטיס הבא</button>
      </div>
    </div>
  );
};

const InstructorsPage: React.FC<InstructorsPageProps> = ({ onBack }) => {
  const [activeProgram, setActiveProgram] = useState<string | null>(null);
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [activeActivity, setActiveActivity] = useState<string | null>(null);
  const [activeSubActivity, setActiveSubActivity] = useState<string | null>(null);

  return (
    <div className="animate-fade-in container mx-auto px-4 py-8">
       <button 
        onClick={onBack}
        className="mb-8 bg-brand-magenta hover:bg-pink-700 text-white font-bold py-3 px-8 text-xl rounded-full flex items-center transition-colors duration-300"
      >
         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H15a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        חזרה לבחירת משתמש
      </button>

      <Header />
      <div className="text-center my-8 max-w-3xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-bold font-display text-brand-dark-blue mb-2">מרחב מדריכים</h2>
        <p className="text-2xl sm:text-3xl text-brand-dark-blue/90">
          {activeProgram && !activeActivity && `בחרו מודול מתוכנית ${activeProgram}`}
          {activeProgram && activeActivity && !activeModule && `בחרו סוג תוכן: "${activeActivity}"`}
          {activeProgram && activeActivity && activeModule && !activeSubActivity && `${activeActivity} / ${activeModule}`}
          {activeProgram && activeActivity && activeModule && activeSubActivity && `${activeActivity} / ${activeModule} / ${activeSubActivity}`}
          {!activeProgram && 'כאן תוכלו למצוא את כל הכלים הדרושים לכם להדרכה מוצלחת.'}
        </p>
      </div>
      {!activeProgram ? (
        <main className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          <ActionCard 
              title="תוכנית 'חכם בכיס'"
              description="גישה למערכי שיעור, עזרים וסרטונים"
              icon={SalaryIcon}
                onSelect={() => { setActiveProgram("'חכם בכיס'"); setActiveModule(null); setActiveActivity(null); setActiveSubActivity(null); }}
          />
          <ActionCard 
              title="תוכנית 'מה בכיס'"
              description="גישה למערכי שיעור, עזרים וסרטונים"
              icon={BusinessIcon}
                onSelect={() => { setActiveProgram("'מה בכיס'"); setActiveModule(null); setActiveActivity(null); setActiveSubActivity(null); }}
          />
          <ActionCard 
              title="תוכנית 'כיסונים פיננסים'"
              description="גישה למערכי שיעור, עזרים וסרטונים"
              icon={PiggyBankIcon}
              onSelect={() => { setActiveProgram("'כיסונים פיננסים'"); setActiveModule(null); setActiveActivity(null); setActiveSubActivity(null); }}
          />
          <ActionCard 
              title="מעקב אחר קבוצות למידה"
              description="ניהול התקדמות התלמידים וצפייה בתוצרים"
              icon={PodiumIcon}
          />
        </main>
      ) : !activeActivity ? (
        /* Step 2: pick a module name */
        <main className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {(PROGRAM_ACTIVITY_MODULES[activeProgram || ''] || []).map(moduleName => (
            <button
              key={moduleName}
              onClick={() => { setActiveActivity(moduleName); setActiveModule(null); setActiveSubActivity(null); }}
              className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
            >
              <p className="text-2xl font-bold text-brand-dark-blue">{moduleName}</p>
              <p className="text-brand-dark-blue/60 mt-3 text-lg">{getSummary(moduleName)}</p>
            </button>
          ))}
          {(PROGRAM_ACTIVITY_MODULES[activeProgram || ''] || []).length === 0 && (
            <div className="col-span-3 rounded-3xl border-2 border-dashed border-gray-200 bg-white/70 p-10 text-center text-brand-dark-blue/50 min-h-[14rem] flex flex-col items-center justify-center">
              <p className="text-2xl font-bold">אין מודולים זמינים</p>
            </div>
          )}
          <div className="sm:col-span-2 lg:col-span-3 flex justify-center mt-4">
            <button
              onClick={() => { setActiveProgram(null); setActiveModule(null); setActiveActivity(null); setActiveSubActivity(null); }}
              className="px-6 py-3 rounded-full bg-brand-magenta text-white font-bold hover:bg-pink-700"
            >
              חזרה לרשימת התוכניות
            </button>
          </div>
        </main>
      ) : !activeModule ? (
        /* Step 3: pick content type */
        <main className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 items-stretch">
          {PROGRAM_MODULES.map(module => (
            <button
              key={module}
              onClick={() => { setActiveModule(module); setActiveSubActivity(null); }}
              className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/70 p-10 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
            >
              <p className="text-3xl font-bold text-brand-dark-blue">{module}</p>
              <p className="text-brand-dark-blue/60 mt-3 text-lg">
                {module === 'סרטונים' && 'חומרים מצולמים לתמיכה בהדרכה'}
                {module === 'פעילויות ומשחקים' && 'בנק משימות, משחקים ותרגולים למדריך'}
                {module === 'עזרים ונספחים' && 'חומרי עזר, נספחים ודפי עבודה'}
              </p>
            </button>
          ))}
          <div className="sm:col-span-3 flex justify-center gap-3 mt-4">
            <button
              onClick={() => { setActiveActivity(null); setActiveModule(null); setActiveSubActivity(null); }}
              className="px-6 py-3 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
            >
              חזרה לרשימת המודולים
            </button>
            <button
              onClick={() => { setActiveProgram(null); setActiveModule(null); setActiveActivity(null); setActiveSubActivity(null); }}
              className="px-6 py-3 rounded-full bg-brand-magenta text-white font-bold hover:bg-pink-700"
            >
              חזרה לרשימת התוכניות
            </button>
          </div>
        </main>
      ) : (
        <main className="mt-12">
          {activeModule === 'פעילויות ומשחקים' && !activeActivity ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(PROGRAM_ACTIVITY_MODULES[activeProgram || ''] || []).map((moduleName) => (
                <button
                  key={moduleName}
                  onClick={() => { setActiveActivity(moduleName); setActiveSubActivity(null); }}
                  className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
                >
                  <p className="text-2xl font-bold text-brand-dark-blue">{moduleName}</p>
                  <p className="text-brand-dark-blue/60 mt-3 text-lg">{getSummary(moduleName)}</p>
                </button>
              ))}
              {(PROGRAM_ACTIVITY_MODULES[activeProgram || ''] || []).length === 0 && (
                <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white/70 p-10 text-center text-brand-dark-blue/50 min-h-[14rem] flex flex-col items-center justify-center">
                  <p className="text-2xl font-bold">אין מודולים זמינים</p>
                  <p className="text-lg mt-2">הוסיפו שמות מודולים למפה</p>
                </div>
              )}
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'ניהול התקציב הראשון שלי' && !activeSubActivity ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <button
                onClick={() => setActiveSubActivity('אל תפילו את המיליון')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-2xl font-bold text-brand-dark-blue">אל תפילו את המיליון</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק כיתתי על הוצאות מחיה והישרדות תקציבית.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('BLOOKET')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-2xl font-bold text-brand-dark-blue">BLOOKET</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">חידוני Blooket לתרגול ניהול תקציב.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('מירוץ מכוניות')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-2xl font-bold text-brand-dark-blue">מירוץ מכוניות</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק מגניב ללמידה מתכני המודול.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('KAHOOT')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-2xl font-bold text-brand-dark-blue">KAHOOT</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">חידוני Kahoot לניהול תקציב.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('חבילה עוברת')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-2xl font-bold text-brand-dark-blue">חבילה עוברת</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק חבילה עוברת עם משימות תקציב.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('פעילויות WORDWAELL')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-2xl font-bold text-brand-dark-blue">פעילויות WORDWAELL</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">חידוני Wordwall לתרגול תקציב והוצאות.</p>
              </button>
              <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white/70 p-8 text-center text-brand-dark-blue/50 min-h-[14rem] flex flex-col items-center justify-center">
                <p className="text-2xl font-bold">משחק נוסף</p>
                <p className="text-lg mt-2">בקרוב יתווסף משחק תומך.</p>
              </div>
              <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white/70 p-8 text-center text-brand-dark-blue/50 min-h-[14rem] flex flex-col items-center justify-center">
                <p className="text-2xl font-bold">אתגר כיתתי</p>
                <p className="text-lg mt-2">בקרוב יתווסף אתגר כיתתי.</p>
              </div>
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'ניהול התקציב הראשון שלי' && activeSubActivity === 'אל תפילו את המיליון' ? (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-brand-dark-blue/70">פעילות</p>
                  <h3 className="text-2xl font-bold text-brand-dark-blue">אל תפילו את המיליון</h3>
                  <p className="text-brand-dark-blue/60">שאלות אמריקאיות על הוצאות מחיה, עם הקצאת מיליון ש"ח ומשחק כיתתי תחרותי.</p>
                </div>
                <button
                  onClick={() => setActiveSubActivity(null)}
                  className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
                >
                  חזרה לחלון המשחקים
                </button>
              </div>
              <MillionDropGame onBack={() => setActiveSubActivity(null)} topic="budget" />
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'ניהול התקציב הראשון שלי' && activeSubActivity === 'KAHOOT' ? (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-brand-dark-blue/70">פעילויות ומשחקים</p>
                  <h3 className="text-2xl font-bold text-brand-dark-blue">KAHOOT</h3>
                  <p className="text-brand-dark-blue/60">חידוני Kahoot לניהול התקציב הראשון שלי.</p>
                </div>
                <button
                  onClick={() => setActiveSubActivity(null)}
                  className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
                >
                  חזרה לחלון המשחקים
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <a
                  href="https://create.kahoot.it/share/1/69147468-717a-4285-99d6-ea787781ea3f"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-6 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[12rem] flex flex-col items-center justify-center"
                >
                  <p className="text-2xl font-bold text-brand-dark-blue">חידון הוצאות מחייה</p>
                  <p className="text-brand-dark-blue/60 mt-2 text-lg">Kahoot</p>
                </a>
                <a
                  href="https://create.kahoot.it/details/594cd9c4-8833-46b1-9039-b0deb2e21fec"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-6 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[12rem] flex flex-col items-center justify-center"
                >
                  <p className="text-2xl font-bold text-brand-dark-blue">חידון ניכויי שכר</p>
                  <p className="text-brand-dark-blue/60 mt-2 text-lg">Kahoot</p>
                </a>
                <a
                  href="https://create.kahoot.it/share/7/cca9560a-e9d7-46c0-9ec6-4b7d76c756cf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-6 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[12rem] flex flex-col items-center justify-center"
                >
                  <p className="text-2xl font-bold text-brand-dark-blue">חידון שכירות</p>
                  <p className="text-brand-dark-blue/60 mt-2 text-lg">Kahoot</p>
                </a>
              </div>
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'ניהול התקציב הראשון שלי' && activeSubActivity === 'מירוץ מכוניות' ? (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-brand-dark-blue/70">פעילויות ומשחקים</p>
                  <h3 className="text-2xl font-bold text-brand-dark-blue">מירוץ מכוניות</h3>
                  <p className="text-brand-dark-blue/60">משחק ארקייד חווייתי ללמידה מתכני ניהול התקציב הראשון שלי.</p>
                </div>
                <button
                  onClick={() => setActiveSubActivity(null)}
                  className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
                >
                  חזרה לחלון המשחקים
                </button>
              </div>
              <div className="space-y-3">
                <p className="text-brand-dark-blue/70">הזיזו את מכונית המירוץ עם חיצי המקלדת או הכפתורים, אספו הוצאות קבועות והימנעו מהוצאות משתנות וממכוניות אחרות.</p>
                <BudgetArcadeGame />
              </div>
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'ניהול התקציב הראשון שלי' && activeSubActivity === 'חבילה עוברת' ? (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-brand-dark-blue/70">פעילויות ומשחקים</p>
                  <h3 className="text-2xl font-bold text-brand-dark-blue">חבילה עוברת</h3>
                  <p className="text-brand-dark-blue/60">משחק חבילה עוברת עם משימות ניהול תקציב והוצאות.</p>
                </div>
                <button
                  onClick={() => setActiveSubActivity(null)}
                  className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
                >
                  חזרה לחלון המשחקים
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <a
                  href="https://www.yo-yoo.co.il/passit/v/nfnPJqu17pja2kXVxMfm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-6 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[12rem] flex flex-col items-center justify-center"
                >
                  <p className="text-2xl font-bold text-brand-dark-blue">חבילה עוברת</p>
                  <p className="text-brand-dark-blue/60 mt-2 text-lg">פתיחה בחלון חדש</p>
                </a>
              </div>
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'ניהול התקציב הראשון שלי' && activeSubActivity === 'BLOOKET' ? (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-brand-dark-blue/70">פעילויות ומשחקים</p>
                  <h3 className="text-2xl font-bold text-brand-dark-blue">BLOOKET</h3>
                  <p className="text-brand-dark-blue/60">חידוני Blooket לניהול התקציב הראשון שלי.</p>
                </div>
                <button
                  onClick={() => setActiveSubActivity(null)}
                  className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
                >
                  חזרה לחלון המשחקים
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <a
                  href="https://dashboard.blooket.com/set/65b4dc5d7b3c389b699c4158"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-6 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[12rem] flex flex-col items-center justify-center"
                >
                  <p className="text-2xl font-bold text-brand-dark-blue">חידון הוצאות מחייה</p>
                  <p className="text-brand-dark-blue/60 mt-2 text-lg">Blooket</p>
                </a>
              </div>
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'ניהול התקציב הראשון שלי' && activeSubActivity === 'פעילויות WORDWAELL' ? (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-brand-dark-blue/70">פעילויות ומשחקים</p>
                  <h3 className="text-2xl font-bold text-brand-dark-blue">פעילויות WORDWAELL</h3>
                  <p className="text-brand-dark-blue/60">חידוני Wordwall לתרגול ניהול תקציב, הוצאות קבועות ומערכת יחסים עם כסף.</p>
                </div>
                <button
                  onClick={() => setActiveSubActivity(null)}
                  className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
                >
                  חזרה לחלון המשחקים
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                <a
                  href="https://wordwall.net/resource/104754308"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-6 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[12rem] flex flex-col items-center justify-center"
                >
                  <p className="text-2xl font-bold text-brand-dark-blue">חידון ניהול תקציב</p>
                  <p className="text-brand-dark-blue/60 mt-2 text-lg">Wordwall</p>
                </a>
                <a
                  href="https://wordwall.net/resource/104571758"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-6 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[12rem] flex flex-col items-center justify-center"
                >
                  <p className="text-2xl font-bold text-brand-dark-blue">חידון הוצאות קבועות</p>
                  <p className="text-brand-dark-blue/60 mt-2 text-lg">Wordwall</p>
                </a>
                <a
                  href="https://wordwall.net/resource/108161368"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-6 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[12rem] flex flex-col items-center justify-center"
                >
                  <p className="text-2xl font-bold text-brand-dark-blue">מערכת היחסים שלי עם כסף</p>
                  <p className="text-brand-dark-blue/60 mt-2 text-lg">Wordwall</p>
                </a>
                <a
                  href="https://wordwall.net/resource/107906055"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-6 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[12rem] flex flex-col items-center justify-center"
                >
                  <p className="text-2xl font-bold text-brand-dark-blue">חידון ניהול תקציב 2</p>
                  <p className="text-brand-dark-blue/60 mt-2 text-lg">Wordwall</p>
                </a>
              </div>
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'סיפורו של כסף' && activeProgram === "'מה בכיס'" && !activeSubActivity ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <button
                onClick={() => setActiveSubActivity('אל תפילו את המיליון')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-2xl font-bold text-brand-dark-blue">אל תפילו את המיליון</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק כיתתי על אבולוציית הכסף והחלטות כלכליות.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('חבילה עוברת')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-2xl font-bold text-brand-dark-blue">חבילה עוברת</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק כיתתי עם שאלות ומשימות בנושא סיפורו של כסף.</p>
              </button>
              <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white/70 p-8 text-center text-brand-dark-blue/50 min-h-[14rem] flex flex-col items-center justify-center">
                <p className="text-2xl font-bold">אתגר כיתתי</p>
                <p className="text-lg mt-2">בקרוב יתווסף אתגר כיתתי.</p>
              </div>
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'סיפורו של כסף' && activeProgram === "'מה בכיס'" && activeSubActivity === 'אל תפילו את המיליון' ? (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-brand-dark-blue/70">פעילות</p>
                  <h3 className="text-2xl font-bold text-brand-dark-blue">אל תפילו את המיליון</h3>
                  <p className="text-brand-dark-blue/60">משחק "אל תפילו את המיליון" סביב סיפורו של הכסף והחלטות כלכליות בהיסטוריה.</p>
                </div>
                <button
                  onClick={() => setActiveSubActivity(null)}
                  className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
                >
                  חזרה לחלון המשחקים
                </button>
              </div>
              <MillionDropGame onBack={() => setActiveSubActivity(null)} topic="story" />
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'סיפורו של כסף' && activeProgram === "'מה בכיס'" && activeSubActivity === 'חבילה עוברת' ? (
            <ParcelGame items={storyItems} moduleTitle="סיפורו של כסף" moduleSubtitle="כל סיבוב נעצר בזמן אקראי" musicUrl="/havila.mp3" />
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'הכסף ואני' && activeProgram === "'מה בכיס'" && !activeSubActivity ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <button
                onClick={() => setActiveSubActivity('אל תפילו את המיליון')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-2xl font-bold text-brand-dark-blue">אל תפילו את המיליון</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק על קבלת החלטות אישית עם כסף וזהות פיננסית.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('חבילה עוברת')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-2xl font-bold text-brand-dark-blue">חבילה עוברת</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק כיתתי עם שאלות ומשימות בנושא הכסף ואני.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('מנהלי העתיד: אתגר ה-5,000')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-2xl font-bold text-brand-dark-blue">מנהלי העתיד: אתגר ה-5,000</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">לוח בקרה כיתתי לניהול תקציב צוותי מול בלת״מים חודשיים.</p>
              </button>
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'הכסף ואני' && activeProgram === "'מה בכיס'" && activeSubActivity === 'מנהלי העתיד: אתגר ה-5,000' ? (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-brand-dark-blue/70">פעילות כיתתית</p>
                  <h3 className="text-2xl font-bold text-brand-dark-blue">מנהלי העתיד: אתגר ה-5,000</h3>
                  <p className="text-brand-dark-blue/60">לוח בקרה כיתתי לניהול תקציב צוותי מול בלת״מים חודשיים.</p>
                </div>
                <button
                  onClick={() => setActiveSubActivity(null)}
                  className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
                >
                  חזרה לחלון המשחקים
                </button>
              </div>
              <FutureManagersChallengeContent onComplete={() => {}} />
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'הכסף ואני' && activeProgram === "'מה בכיס'" && activeSubActivity === 'אל תפילו את המיליון' ? (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-brand-dark-blue/70">פעילות</p>
                  <h3 className="text-2xl font-bold text-brand-dark-blue">אל תפילו את המיליון</h3>
                  <p className="text-brand-dark-blue/60">משחק על זהות וכסף: בחירות אישיות, ערכים והשפעתן.</p>
                </div>
                <button
                  onClick={() => setActiveSubActivity(null)}
                  className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
                >
                  חזרה לחלון המשחקים
                </button>
              </div>
              <MillionDropGame onBack={() => setActiveSubActivity(null)} topic="personal" />
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'הכסף ואני' && activeProgram === "'מה בכיס'" && activeSubActivity === 'חבילה עוברת' ? (
            <ParcelGame items={personalItems} moduleTitle="הכסף ואני" moduleSubtitle="כל סיבוב נעצר בזמן אקראי" musicUrl="/havila.mp3" />
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'כמה זה עולה לי?' && activeProgram === "'מה בכיס'" && !activeSubActivity ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <button
                onClick={() => setActiveSubActivity('אל תפילו את המיליון')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-2xl font-bold text-brand-dark-blue">אל תפילו את המיליון</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק על מחירים, השוואות ועלויות נסתרות.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('חבילה עוברת')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-2xl font-bold text-brand-dark-blue">חבילה עוברת</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק כיתתי עם שאלות ומשימות בנושא כמה זה עולה לי?</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('מחשבון מודל החצ"ר')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-2xl font-bold text-brand-dark-blue">מחשבון מודל החצ"ר</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">תרגול קבלת החלטות קנייה לפי סדר עדיפויות: חייב, צריך, רוצה.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('אליאס פיננסי')}
                className="rounded-3xl border-2 border-dashed border-brand-teal bg-teal-50 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-2">🃏</p>
                <p className="text-2xl font-bold text-brand-dark-blue">אליאס פיננסי</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק אליאס עם מונחים פיננסיים — שחקנים מתחברים דרך QR לטלפון.</p>
              </button>
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'כמה זה עולה לי?' && activeProgram === "'מה בכיס'" && activeSubActivity === 'אליאס פיננסי' ? (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-brand-dark-blue/70">פעילות</p>
                  <h3 className="text-2xl font-bold text-brand-dark-blue">🃏 אליאס פיננסי</h3>
                  <p className="text-brand-dark-blue/60">משחק אליאס עם מונחים פיננסיים — ניהול הוצאות, תקציב וצרכנות חכמה.</p>
                </div>
                <button
                  onClick={() => setActiveSubActivity(null)}
                  className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
                >
                  חזרה לחלון המשחקים
                </button>
              </div>
              <AliasGame onBack={() => setActiveSubActivity(null)} />
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'כמה זה עולה לי?' && activeProgram === "'מה בכיס'" && activeSubActivity === 'אל תפילו את המיליון' ? (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-4">
              <div className="flex items-center justify_between gap-3 flex-wrap">
                <div>
                  <p className="text-brand-dark-blue/70">פעילות</p>
                  <h3 className="text-2xl font-bold text-brand-dark-blue">אל תפילו את המיליון</h3>
                  <p className="text-brand-dark-blue/60">משחק על עלויות נסתרות, השוואות מחירים וצרכנות חכמה.</p>
                </div>
                <button
                  onClick={() => setActiveSubActivity(null)}
                  className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
                >
                  חזרה לחלון המשחקים
                </button>
              </div>
              <MillionDropGame onBack={() => setActiveSubActivity(null)} topic="costs" />
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'כמה זה עולה לי?' && activeProgram === "'מה בכיס'" && activeSubActivity === 'חבילה עוברת' ? (
            <ParcelGame items={costsItems} moduleTitle="כמה זה עולה לי?" moduleSubtitle="כל סיבוב נעצר בזמן אקראי" musicUrl="/havila.mp3" />
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'כמה זה עולה לי?' && activeProgram === "'מה בכיס'" && activeSubActivity === 'מחשבון מודל החצ"ר' ? (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-brand-dark-blue/70">פעילות</p>
                  <h3 className="text-2xl font-bold text-brand-dark-blue">מחשבון מודל החצ"ר</h3>
                  <p className="text-brand-dark-blue/60">תרגול קבלת החלטות קנייה לפי סדר עדיפויות: חייב, צריך, רוצה.</p>
                </div>
                <button
                  onClick={() => setActiveSubActivity(null)}
                  className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
                >
                  חזרה לחלון המשחקים
                </button>
              </div>
              <HatsarStep />
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'מונופולים בישראל' && activeProgram === "'מה בכיס'" && !activeSubActivity ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <button
                onClick={() => setActiveSubActivity('אל תפילו את המיליון')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-2xl font-bold text-brand-dark-blue">אל תפילו את המיליון</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק על כוח שוק, ריכוזיות והשפעתם על מחירים.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('חבילה עוברת')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-2xl font-bold text-brand-dark-blue">חבילה עוברת</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק כיתתי עם שאלות ומשימות בנושא מונופולים בישראל.</p>
              </button>
              <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white/70 p-8 text-center text-brand-dark-blue/50 min-h-[14rem] flex flex-col items-center justify-center">
                <p className="text-2xl font-bold">אתגר כיתתי</p>
                <p className="text-lg mt-2">בקרוב יתווסף אתגר כיתתי.</p>
              </div>
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'מונופולים בישראל' && activeProgram === "'מה בכיס'" && activeSubActivity === 'אל תפילו את המיליון' ? (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-brand-dark-blue/70">פעילות</p>
                  <h3 className="text-2xl font-bold text-brand-dark-blue">אל תפילו את המיליון</h3>
                  <p className="text-brand-dark-blue/60">משחק על מונופולים, תחרות ומחירים במשק הישראלי.</p>
                </div>
                <button
                  onClick={() => setActiveSubActivity(null)}
                  className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
                >
                  חזרה לחלון המשחקים
                </button>
              </div>
              <MillionDropGame onBack={() => setActiveSubActivity(null)} topic="monopoly" />
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'מונופולים בישראל' && activeProgram === "'מה בכיס'" && activeSubActivity === 'חבילה עוברת' ? (
            <ParcelGame items={monopolyItems} moduleTitle="מונופולים בישראל" moduleSubtitle="כל סיבוב נעצר בזמן אקראי" musicUrl="/havila.mp3" />
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'צרכנות נבונה' && activeProgram === "'מה בכיס'" && !activeSubActivity ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <button
                onClick={() => setActiveSubActivity('אל תפילו את המיליון')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-2xl font-bold text-brand-dark-blue">אל תפילו את המיליון</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק על השוואות מחירים, מבצעים וטעויות צרכניות נפוצות.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('חבילה עוברת')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-2xl font-bold text-brand-dark-blue">חבילה עוברת</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק כיתתי עם שאלות ומשימות בנושא צרכנות נבונה.</p>
              </button>
              <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white/70 p-8 text-center text-brand-dark-blue/50 min-h-[14rem] flex flex-col items-center justify-center">
                <p className="text-2xl font-bold">אתגר כיתתי</p>
                <p className="text-lg mt-2">בקרוב יתווסף אתגר כיתתי.</p>
              </div>
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'צרכנות נבונה' && activeProgram === "'מה בכיס'" && activeSubActivity === 'אל תפילו את המיליון' ? (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-4">
              <div className="flex items-center justify_between gap-3 flex-wrap">
                <div>
                  <p className="text-brand-dark-blue/70">פעילות</p>
                  <h3 className="text-2xl font-bold text-brand-dark-blue">אל תפילו את המיליון</h3>
                  <p className="text-brand-dark-blue/60">משחק על צרכנות נבונה: מלכודות מבצעים, הבנת עלות כוללת והחלטות חכמות.</p>
                </div>
                <button
                  onClick={() => setActiveSubActivity(null)}
                  className="px-4 py-2 rounded_full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
                >
                  חזרה לחלון המשחקים
                </button>
              </div>
              <MillionDropGame onBack={() => setActiveSubActivity(null)} topic="consumer" />
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'צרכנות נבונה' && activeProgram === "'מה בכיס'" && activeSubActivity === 'חבילה עוברת' ? (
            <ParcelGame items={consumerItems} moduleTitle="צרכנות נבונה" moduleSubtitle="כל סיבוב נעצר בזמן אקראי" musicUrl="/havila.mp3" />
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'מערכות יחסים וכסף' && activeProgram === "'מה בכיס'" && !activeSubActivity ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <button
                onClick={() => setActiveSubActivity('אל תפילו את המיליון')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-2xl font-bold text-brand-dark-blue">אל תפילו את המיליון</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק על תקשורת, גבולות והוגנות סביב כסף במערכות יחסים.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('חבילה עוברת')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-2xl font-bold text-brand-dark-blue">חבילה עוברת</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק כיתתי עם שאלות ומשימות בנושא מערכות יחסים וכסף.</p>
              </button>
              <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white/70 p-8 text-center text-brand-dark-blue/50 min-h-[14rem] flex flex-col items-center justify-center">
                <p className="text-2xl font-bold">אתגר כיתתי</p>
                <p className="text-lg mt-2">בקרוב יתווסף אתגר כיתתי.</p>
              </div>
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'מערכות יחסים וכסף' && activeProgram === "'מה בכיס'" && activeSubActivity === 'אל תפילו את המיליון' ? (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-brand-dark-blue/70">פעילות</p>
                  <h3 className="text-2xl font-bold text-brand-dark-blue">אל תפילו את המיליון</h3>
                  <p className="text-brand-dark-blue/60">משחק על מערכות יחסים וכסף: תקשורת, גבולות והחלטות משותפות.</p>
                </div>
                <button
                  onClick={() => setActiveSubActivity(null)}
                  className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
                >
                  חזרה לחלון המשחקים
                </button>
              </div>
              <MillionDropGame onBack={() => setActiveSubActivity(null)} topic="relationships" />
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'מערכות יחסים וכסף' && activeProgram === "'מה בכיס'" && activeSubActivity === 'חבילה עוברת' ? (
            <ParcelGame items={relationshipsItems} moduleTitle="מערכות יחסים וכסף" moduleSubtitle="כל סיבוב נעצר בזמן אקראי" musicUrl="/havila.mp3" />
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'איך להרוויח כסף?' && activeProgram === "'מה בכיס'" && !activeSubActivity ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <button
                onClick={() => setActiveSubActivity('אל תפילו את המיליון')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-2xl font-bold text-brand-dark-blue">אל תפילו את המיליון</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק על דרכים להרוויח, תמחור ראשון ובטיחות בגיגים.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('חבילה עוברת')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-2xl font-bold text-brand-dark-blue">חבילה עוברת</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק כיתתי עם שאלות ומשימות בנושא איך להרוויח כסף?</p>
              </button>
              <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white/70 p-8 text-center text-brand-dark-blue/50 min-h-[14rem] flex flex-col items-center justify-center">
                <p className="text-2xl font-bold">אתגר כיתתי</p>
                <p className="text-lg mt-2">בקרוב יתווסף אתגר כיתתי.</p>
              </div>
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'איך להרוויח כסף?' && activeProgram === "'מה בכיס'" && activeSubActivity === 'אל תפילו את המיליון' ? (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-brand-dark-blue/70">פעילות</p>
                  <h3 className="text-2xl font-bold text-brand-dark-blue">אל תפילו את המיליון</h3>
                  <p className="text-brand-dark-blue/60">משחק על תמחור, לקוחות ראשונים והתנהלות בטוחה כדי להרוויח כסף.</p>
                </div>
                <button
                  onClick={() => setActiveSubActivity(null)}
                  className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
                >
                  חזרה לחלון המשחקים
                </button>
              </div>
              <MillionDropGame onBack={() => setActiveSubActivity(null)} topic="earn" />
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'איך להרוויח כסף?' && activeProgram === "'מה בכיס'" && activeSubActivity === 'חבילה עוברת' ? (
            <ParcelGame items={earnItems} moduleTitle="איך להרוויח כסף?" moduleSubtitle="כל סיבוב נעצר בזמן אקראי" musicUrl="/havila.mp3" />
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'ניהול זמן (זמן=כסף)' && activeProgram === "'מה בכיס'" && !activeSubActivity ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <button
                onClick={() => setActiveSubActivity('אל תפילו את המיליון')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-2xl font-bold text-brand-dark-blue">אל תפילו את המיליון</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק על ניהול זמן, דחיינות וערך שעה.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('חבילה עוברת')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-2xl font-bold text-brand-dark-blue">חבילה עוברת</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק כיתתי עם שאלות ומשימות בנושא ניהול זמן.</p>
              </button>
              <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white/70 p-8 text-center text-brand-dark-blue/50 min-h-[14rem] flex flex-col items-center justify-center">
                <p className="text-2xl font-bold">אתגר כיתתי</p>
                <p className="text-lg mt-2">בקרוב יתווסף אתגר כיתתי.</p>
              </div>
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'ניהול זמן (זמן=כסף)' && activeProgram === "'מה בכיס'" && activeSubActivity === 'אל תפילו את המיליון' ? (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-brand-dark-blue/70">פעילות</p>
                  <h3 className="text-2xl font-bold text-brand-dark-blue">אל תפילו את המיליון</h3>
                  <p className="text-brand-dark-blue/60">משחק על ערך הזמן, תיעדוף ודחיינות שמחירים כסף.</p>
                </div>
                <button
                  onClick={() => setActiveSubActivity(null)}
                  className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
                >
                  חזרה לחלון המשחקים
                </button>
              </div>
              <MillionDropGame onBack={() => setActiveSubActivity(null)} topic="time" />
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'ניהול זמן (זמן=כסף)' && activeProgram === "'מה בכיס'" && activeSubActivity === 'חבילה עוברת' ? (
            <ParcelGame items={timeItems} moduleTitle="ניהול זמן (זמן=כסף)" moduleSubtitle="כל סיבוב נעצר בזמן אקראי" musicUrl="/havila.mp3" />
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'עמידה מול קהל' && activeProgram === "'מה בכיס'" && !activeSubActivity ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <button
                onClick={() => setActiveSubActivity('אל תפילו את המיליון')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-2xl font-bold text-brand-dark-blue">אל תפילו את המיליון</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק על הצגה מול קהל, פיץ׳ ומסר ברור.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('חבילה עוברת')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-2xl font-bold text-brand-dark-blue">חבילה עוברת</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק כיתתי עם שאלות ומשימות בנושא עמידה מול קהל.</p>
              </button>
              <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white/70 p-8 text-center text-brand-dark-blue/50 min-h-[14rem] flex flex-col items-center justify-center">
                <p className="text-2xl font-bold">אתגר כיתתי</p>
                <p className="text-lg mt-2">בקרוב יתווסף אתגר כיתתי.</p>
              </div>
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'עמידה מול קהל' && activeProgram === "'מה בכיס'" && activeSubActivity === 'אל תפילו את המיליון' ? (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-brand-dark-blue/70">פעילות</p>
                  <h3 className="text-2xl font-bold text-brand-dark-blue">אל תפילו את המיליון</h3>
                  <p className="text-brand-dark-blue/60">משחק על עמידה מול קהל: מסר חד, שפת גוף והתמודדות עם שאלות.</p>
                </div>
                <button
                  onClick={() => setActiveSubActivity(null)}
                  className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
                >
                  חזרה לחלון המשחקים
                </button>
              </div>
              <MillionDropGame onBack={() => setActiveSubActivity(null)} topic="publicSpeaking" />
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'עמידה מול קהל' && activeProgram === "'מה בכיס'" && activeSubActivity === 'חבילה עוברת' ? (
            <ParcelGame items={publicSpeakingItems} moduleTitle="עמידה מול קהל" moduleSubtitle="כל סיבוב נעצר בזמן אקראי" musicUrl="/havila.mp3" />
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'איך בונים עסק?' && activeProgram === "'מה בכיס'" && !activeSubActivity ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <button
                onClick={() => setActiveSubActivity('אל תפילו את המיליון')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-2xl font-bold text-brand-dark-blue">אל תפילו את המיליון</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק על בניית עסק: ערך, MVP, תמחור ותזרים.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('חבילה עוברת')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-2xl font-bold text-brand-dark-blue">חבילה עוברת</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק כיתתי עם שאלות ומשימות בנושא איך בונים עסק?</p>
              </button>
              <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white/70 p-8 text-center text-brand-dark-blue/50 min-h-[14rem] flex flex-col items-center justify-center">
                <p className="text-2xl font-bold">אתגר כיתתי</p>
                <p className="text-lg mt-2">בקרוב יתווסף אתגר כיתתי.</p>
              </div>
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'איך בונים עסק?' && activeProgram === "'מה בכיס'" && activeSubActivity === 'אל תפילו את המיליון' ? (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-brand-dark-blue/70">פעילות</p>
                  <h3 className="text-2xl font-bold text-brand-dark-blue">אל תפילו את המיליון</h3>
                  <p className="text-brand-dark-blue/60">משחק על בניית עסק: הצעת ערך, בדיקת שוק, תמחור ותזרים.</p>
                </div>
                <button
                  onClick={() => setActiveSubActivity(null)}
                  className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
                >
                  חזרה לחלון המשחקים
                </button>
              </div>
              <MillionDropGame onBack={() => setActiveSubActivity(null)} topic="business" />
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'איך בונים עסק?' && activeProgram === "'מה בכיס'" && activeSubActivity === 'חבילה עוברת' ? (
            <ParcelGame items={businessItems} moduleTitle="איך בונים עסק?" moduleSubtitle="כל סיבוב נעצר בזמן אקראי" musicUrl="/havila.mp3" />
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'רב תחומי' && activeProgram === "'מה בכיס'" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <button
                onClick={() => setActiveActivity('ג׳פרדי פיננסי')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-2xl font-bold text-brand-dark-blue">ג׳פרדי פיננסי</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">{getSummary('ג׳פרדי פיננסי')}</p>
              </button>
              <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white/70 p-8 text-center text-brand-dark-blue/50 min-h-[14rem] flex flex-col items-center justify-center">
                <p className="text-2xl font-bold">פעילות נוספת</p>
                <p className="text-lg mt-2">תוכן יתווסף בהמשך עבור מודול זה.</p>
              </div>
              <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white/70 p-8 text-center text-brand-dark-blue/50 min-h-[14rem] flex flex-col items-center justify-center">
                <p className="text-2xl font-bold">פעילות נוספת</p>
                <p className="text-lg mt-2">תוכן יתווסף בהמשך עבור מודול זה.</p>
              </div>
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'רב תחומי' && activeProgram === "'חכם בכיס'" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <button
                onClick={() => setActiveActivity('ג׳פרדי פיננסי')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-2xl font-bold text-brand-dark-blue">ג׳פרדי פיננסי</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">{getSummary('ג׳פרדי פיננסי')}</p>
              </button>
              <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white/70 p-8 text-center text-brand-dark-blue/50 min-h-[14rem] flex flex-col items-center justify-center">
                <p className="text-2xl font-bold">פעילות אינטגרטיבית</p>
                <p className="text-lg mt-2">תוכן יתווסף בהמשך עבור מודול זה.</p>
              </div>
              <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white/70 p-8 text-center text-brand-dark-blue/50 min-h-[14rem] flex flex-col items-center justify-center">
                <p className="text-2xl font-bold">סיומת תכנית</p>
                <p className="text-lg mt-2">תוכן יתווסף בהמשך עבור מודול זה.</p>
              </div>
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'ג׳פרדי פיננסי' && activeProgram === "'מה בכיס'" ? (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-4 sm:p-6">
              <JeopardyModule
                title="ג׳פרדי פיננסי — מרחב מדריכים"
                onBack={() => setActiveActivity('רב תחומי')}
                onComplete={() => {}}
              />
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'ג׳פרדי פיננסי' && activeProgram === "'חכם בכיס'" ? (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-4 sm:p-6">
              <JeopardyModule
                title="ג׳פרדי פיננסי — חכם בכיס"
                onBack={() => setActiveActivity('רב תחומי')}
                onComplete={() => {}}
                questionBanks={jeopardyChachamBanks}
              />
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'איך מנהלים הוצאות?' && activeProgram === "'חכם בכיס'" && !activeSubActivity ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <button
                onClick={() => setActiveSubActivity('אל תפילו את המיליון')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-2xl font-bold text-brand-dark-blue">אל תפילו את המיליון</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק על מודל חצ"ר, תיעוד הוצאות והחלטות קנייה.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('BLOOKET')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-2xl font-bold text-brand-dark-blue">BLOOKET</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">חידוני Blooket למודול זה.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('KAHOOT')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-2xl font-bold text-brand-dark-blue">KAHOOT</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">חידוני Kahoot למודול זה.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('WORDWALL')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-2xl font-bold text-brand-dark-blue">WORDWALL</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">חידוני Wordwall למודול זה.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('חבילה עוברת')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-2xl font-bold text-brand-dark-blue">חבילה עוברת</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">גרסה מודולרית לחבילה עוברת.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('אליאס פיננסי')}
                className="rounded-3xl border-2 border-dashed border-brand-teal bg-teal-50 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-2">🃏</p>
                <p className="text-2xl font-bold text-brand-dark-blue">אליאס פיננסי</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק אליאס עם מונחים פיננסיים — שחקנים מתחברים דרך QR לטלפון.</p>
              </button>
              <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white/70 p-8 text-center text-brand-dark-blue/50 min-h-[14rem] flex flex-col items-center justify-center">
                <p className="text-2xl font-bold">אתגר כיתתי</p>
                <p className="text-lg mt-2">בקרוב יתווסף אתגר כיתתי.</p>
              </div>
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'איך מנהלים הוצאות?' && activeProgram === "'חכם בכיס'" && activeSubActivity === 'אליאס פיננסי' ? (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-brand-dark-blue/70">פעילות</p>
                  <h3 className="text-2xl font-bold text-brand-dark-blue">🃏 אליאס פיננסי</h3>
                  <p className="text-brand-dark-blue/60">משחק אליאס עם מונחים פיננסיים — ניהול הוצאות, תקציב וצרכנות חכמה.</p>
                </div>
                <button
                  onClick={() => setActiveSubActivity(null)}
                  className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
                >
                  חזרה לחלון המשחקים
                </button>
              </div>
              <AliasGame onBack={() => setActiveSubActivity(null)} />
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'איך מנהלים הוצאות?' && activeProgram === "'חכם בכיס'" && activeSubActivity === 'אל תפילו את המיליון' ? (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-brand-dark-blue/70">פעילות</p>
                  <h3 className="text-2xl font-bold text-brand-dark-blue">אל תפילו את המיליון</h3>
                  <p className="text-brand-dark-blue/60">משחק על סיווג הוצאות, תקציב חצ"ר והחלטות קנייה חכמות.</p>
                </div>
                <button
                  onClick={() => setActiveSubActivity(null)}
                  className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
                >
                  חזרה לחלון המשחקים
                </button>
              </div>
              <MillionDropGame onBack={() => setActiveSubActivity(null)} topic="expenses" />
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'הסכנה שבמינוס' && activeProgram === "'חכם בכיס'" && !activeSubActivity ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <button
                onClick={() => setActiveSubActivity('אל תפילו את המיליון')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-2xl font-bold text-brand-dark-blue">אל תפילו את המיליון</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק על מינוס, ריביות ודרכי יציאה מהחריגה.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('BLOOKET')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-2xl font-bold text-brand-dark-blue">BLOOKET</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">חידוני Blooket למודול זה.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('KAHOOT')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-2xl font-bold text-brand-dark-blue">KAHOOT</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">חידוני Kahoot למודול זה.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('WORDWALL')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-2xl font-bold text-brand-dark-blue">WORDWALL</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">חידוני Wordwall למודול זה.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('חבילה עוברת')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-2xl font-bold text-brand-dark-blue">חבילה עוברת</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">גרסה מודולרית לחבילה עוברת.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('משחק השלג')}
                className="rounded-3xl border-2 border-dashed border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-2">⛄</p>
                <p className="text-2xl font-bold text-blue-700">משחק השלג</p>
                <p className="text-blue-500 mt-2 text-base">משחק ארקייד על הימנעות מהוצאות מיותרות</p>
              </button>
              <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white/70 p-8 text-center text-brand-dark-blue/50 min-h-[14rem] flex flex-col items-center justify-center">
                <p className="text-2xl font-bold">אתגר כיתתי</p>
                <p className="text-lg mt-2">בקרוב יתווסף אתגר כיתתי.</p>
              </div>
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'הסכנה שבמינוס' && activeProgram === "'חכם בכיס'" && activeSubActivity === 'משחק השלג' ? (
            <SnowballGame onBack={() => setActiveSubActivity(null)} />
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'הסכנה שבמינוס' && activeProgram === "'חכם בכיס'" && activeSubActivity === 'אל תפילו את המיליון' ? (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-brand-dark-blue/70">פעילות</p>
                  <h3 className="text-2xl font-bold text-brand-dark-blue">אל תפילו את המיליון</h3>
                  <p className="text-brand-dark-blue/60">משחק על הסכנה שבמינוס, ריביות, חריגה ממסגרת ובניית בופר.</p>
                </div>
                <button
                  onClick={() => setActiveSubActivity(null)}
                  className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
                >
                  חזרה לחלון המשחקים
                </button>
              </div>
              <MillionDropGame onBack={() => setActiveSubActivity(null)} topic="overdraft" />
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'זכויות עובדים' && activeProgram === "'חכם בכיס'" && !activeSubActivity ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <button
                onClick={() => setActiveSubActivity('אל תפילו את המיליון')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-2xl font-bold text-brand-dark-blue">אל תפילו את המיליון</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק על זכויות בסיסיות, שעות נוספות והליך שימוע.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('BLOOKET')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-2xl font-bold text-brand-dark-blue">BLOOKET</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">חידוני Blooket למודול זה.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('KAHOOT')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-2xl font-bold text-brand-dark-blue">KAHOOT</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">חידוני Kahoot למודול זה.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('WORDWALL')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-2xl font-bold text-brand-dark-blue">WORDWALL</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">חידוני Wordwall למודול זה.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('חבילה עוברת')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-2xl font-bold text-brand-dark-blue">חבילה עוברת</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">גרסה מודולרית לחבילה עוברת.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('כרטיסיות מראיינים')}
                className="rounded-3xl border-2 border-dashed border-indigo-300 bg-gradient-to-br from-indigo-50 to-purple-50 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-2">🎴</p>
                <p className="text-2xl font-bold text-indigo-700">כרטיסיות מראיינים</p>
                <p className="text-indigo-500 mt-2 text-base">9 תרחישי ראיון עבודה לתרגול</p>
              </button>
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'זכויות עובדים' && activeProgram === "'חכם בכיס'" && activeSubActivity === 'כרטיסיות מראיינים' ? (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5">
              <InterviewerCardsModule onBack={() => setActiveSubActivity(null)} />
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'זכויות עובדים' && activeProgram === "'חכם בכיס'" && activeSubActivity === 'אל תפילו את המיליון' ? (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-brand-dark-blue/70">פעילות</p>
                  <h3 className="text-2xl font-bold text-brand-dark-blue">אל תפילו את המיליון</h3>
                  <p className="text-brand-dark-blue/60">משחק על זכויות עובדים: שכר מינימום, שעות נוספות, הפרשות וסיום העסקה.</p>
                </div>
                <button
                  onClick={() => setActiveSubActivity(null)}
                  className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
                >
                  חזרה לחלון המשחקים
                </button>
              </div>
              <MillionDropGame onBack={() => setActiveSubActivity(null)} topic="workerRights" />
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'זכויות עובדים' && activeProgram === "'חכם בכיס'" && activeSubActivity === 'חבילה עוברת' ? (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-brand-dark-blue/70">פעילויות ומשחקים</p>
                  <h3 className="text-2xl font-bold text-brand-dark-blue">חבילה עוברת</h3>
                  <p className="text-brand-dark-blue/60">משחק חבילה עוברת עם 10 שאלות ו-5 משימות בנושא זכויות עובדים.</p>
                </div>
                <button
                  onClick={() => setActiveSubActivity(null)}
                  className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
                >
                  חזרה לחלון המשחקים
                </button>
              </div>
              <WorkerRightsParcelGame />
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'פענוח תלוש שכר' && activeProgram === "'חכם בכיס'" && !activeSubActivity ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <button
                onClick={() => setActiveSubActivity('אל תפילו את המיליון')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-2xl font-bold text-brand-dark-blue">אל תפילו את המיליון</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק על קריאת תלוש: ברוטו/נטו, ניכויים והפרשות.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('BLOOKET')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-2xl font-bold text-brand-dark-blue">BLOOKET</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">חידוני Blooket למודול זה.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('KAHOOT')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-2xl font-bold text-brand-dark-blue">KAHOOT</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">חידוני Kahoot למודול זה.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('WORDWALL')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-2xl font-bold text-brand-dark-blue">WORDWALL</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">חידוני Wordwall למודול זה.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('חבילה עוברת')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-2xl font-bold text-brand-dark-blue">חבילה עוברת</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">גרסה מודולרית לחבילה עוברת.</p>
              </button>
              <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white/70 p-8 text-center text-brand-dark-blue/50 min-h-[14rem] flex flex-col items-center justify-center">
                <p className="text-2xl font-bold">משחק נוסף</p>
                <p className="text-lg mt-2">בקרוב יתווסף משחק תומך.</p>
              </div>
              <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white/70 p-8 text-center text-brand-dark-blue/50 min-h-[14rem] flex flex-col items-center justify-center">
                <p className="text-2xl font-bold">אתגר כיתתי</p>
                <p className="text-lg mt-2">בקרוב יתווסף אתגר כיתתי.</p>
              </div>
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'פענוח תלוש שכר' && activeProgram === "'חכם בכיס'" && activeSubActivity === 'אל תפילו את המיליון' ? (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-brand-dark-blue/70">פעילות</p>
                  <h3 className="text-2xl font-bold text-brand-dark-blue">אל תפילו את המיליון</h3>
                  <p className="text-brand-dark-blue/60">משחק על פענוח תלוש שכר: ברוטו/נטו, ניכויים, זיכויי מס והפרשות.</p>
                </div>
                <button
                  onClick={() => setActiveSubActivity(null)}
                  className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
                >
                  חזרה לחלון המשחקים
                </button>
              </div>
              <MillionDropGame onBack={() => setActiveSubActivity(null)} topic="paystub" />
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'שכירים ועצמאיים' && activeProgram === "'חכם בכיס'" && !activeSubActivity ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <button
                onClick={() => setActiveSubActivity('אל תפילו את המיליון')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-2xl font-bold text-brand-dark-blue">אל תפילו את המיליון</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק על ההבדלים בין שכיר לעצמאי, מסים ותזרים.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('BLOOKET')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-2xl font-bold text-brand-dark-blue">BLOOKET</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">חידוני Blooket למודול זה.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('KAHOOT')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-2xl font-bold text-brand-dark-blue">KAHOOT</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">חידוני Kahoot למודול זה.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('WORDWALL')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-2xl font-bold text-brand-dark-blue">WORDWALL</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">חידוני Wordwall למודול זה.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('חבילה עוברת')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-2xl font-bold text-brand-dark-blue">חבילה עוברת</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">גרסה מודולרית לחבילה עוברת.</p>
              </button>
              <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white/70 p-8 text-center text-brand-dark-blue/50 min-h-[14rem] flex flex-col items-center justify-center">
                <p className="text-2xl font-bold">משחק נוסף</p>
                <p className="text-lg mt-2">בקרוב יתווסף משחק תומך.</p>
              </div>
              <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white/70 p-8 text-center text-brand-dark-blue/50 min-h-[14rem] flex flex-col items-center justify-center">
                <p className="text-2xl font-bold">אתגר כיתתי</p>
                <p className="text-lg mt-2">בקרוב יתווסף אתגר כיתתי.</p>
              </div>
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'שכירים ועצמאיים' && activeProgram === "'חכם בכיס'" && activeSubActivity === 'אל תפילו את המיליון' ? (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-brand-dark-blue/70">פעילות</p>
                  <h3 className="text-2xl font-bold text-brand-dark-blue">אל תפילו את המיליון</h3>
                  <p className="text-brand-dark-blue/60">משחק על שכירים ועצמאיים: מס, זכויות, חשבוניות ותזרים.</p>
                </div>
                <button
                  onClick={() => setActiveSubActivity(null)}
                  className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
                >
                  חזרה לחלון המשחקים
                </button>
              </div>
              <MillionDropGame onBack={() => setActiveSubActivity(null)} topic="employment" />
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'חיסכון והשקעות' && activeProgram === "'חכם בכיס'" && !activeSubActivity ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <button
                onClick={() => setActiveSubActivity('אל תפילו את המיליון')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-2xl font-bold text-brand-dark-blue">אל תפילו את המיליון</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק על חיסכון, ריבית דריבית ופיזור השקעות.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('BLOOKET')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-2xl font-bold text-brand-dark-blue">BLOOKET</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">חידוני Blooket למודול זה.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('KAHOOT')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-2xl font-bold text-brand-dark-blue">KAHOOT</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">חידוני Kahoot למודול זה.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('WORDWALL')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-2xl font-bold text-brand-dark-blue">WORDWALL</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">חידוני Wordwall למודול זה.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('חבילה עוברת')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-2xl font-bold text-brand-dark-blue">חבילה עוברת</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">גרסה מודולרית לחבילה עוברת.</p>
              </button>
              <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white/70 p-8 text-center text-brand-dark-blue/50 min-h-[14rem] flex flex-col items-center justify-center">
                <p className="text-2xl font-bold">משחק נוסף</p>
                <p className="text-lg mt-2">בקרוב יתווסף משחק תומך.</p>
              </div>
              <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white/70 p-8 text-center text-brand-dark-blue/50 min-h-[14rem] flex flex-col items-center justify-center">
                <p className="text-2xl font-bold">אתגר כיתתי</p>
                <p className="text-lg mt-2">בקרוב יתווסף אתגר כיתתי.</p>
              </div>
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'חיסכון והשקעות' && activeProgram === "'חכם בכיס'" && activeSubActivity === 'אל תפילו את המיליון' ? (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-brand-dark-blue/70">פעילות</p>
                  <h3 className="text-2xl font-bold text-brand-dark-blue">אל תפילו את המיליון</h3>
                  <p className="text-brand-dark-blue/60">משחק על חיסכון והשקעות: ריבית דריבית, פיזור, סיכון-תשואה.</p>
                </div>
                <button
                  onClick={() => setActiveSubActivity(null)}
                  className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
                >
                  חזרה לחלון המשחקים
                </button>
              </div>
              <MillionDropGame onBack={() => setActiveSubActivity(null)} topic="savingsInvest" />
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeProgram === "'חכם בכיס'" && CHACHAM_GENERIC_GAME_ACTIVITIES.includes(activeActivity || '') && activeSubActivity === 'BLOOKET' ? (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-brand-dark-blue/70">פעילויות ומשחקים</p>
                  <h3 className="text-2xl font-bold text-brand-dark-blue">BLOOKET — {activeActivity}</h3>
                  <p className="text-brand-dark-blue/60">חידוני Blooket למודול זה. הוסיפו לינקים רלוונטיים כשיהיו מוכנים.</p>
                </div>
                <button
                  onClick={() => setActiveSubActivity(null)}
                  className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
                >
                  חזרה לחלון המשחקים
                </button>
              </div>
              <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white/80 p-6 text-center text-brand-dark-blue/70 min-h-[12rem] flex flex-col items-center justify-center">
                <p className="text-2xl font-bold">חידוני Blooket</p>
                <p className="text-lg mt-2">הוסיפו כאן לינקים לסטים בנושא {activeActivity}.</p>
              </div>
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeProgram === "'חכם בכיס'" && CHACHAM_GENERIC_GAME_ACTIVITIES.includes(activeActivity || '') && activeSubActivity === 'KAHOOT' ? (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-brand-dark-blue/70">פעילויות ומשחקים</p>
                  <h3 className="text-2xl font-bold text-brand-dark-blue">KAHOOT — {activeActivity}</h3>
                  <p className="text-brand-dark-blue/60">חידוני Kahoot למודול זה. הוסיפו לינקים רלוונטיים כשיהיו מוכנים.</p>
                </div>
                <button
                  onClick={() => setActiveSubActivity(null)}
                  className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
                >
                  חזרה לחלון המשחקים
                </button>
              </div>
              <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white/80 p-6 text-center text-brand-dark-blue/70 min-h-[12rem] flex flex-col items-center justify-center">
                <p className="text-2xl font-bold">חידוני Kahoot</p>
                <p className="text-lg mt-2">הוסיפו כאן לינקים לסטים בנושא {activeActivity}.</p>
              </div>
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeProgram === "'חכם בכיס'" && CHACHAM_GENERIC_GAME_ACTIVITIES.includes(activeActivity || '') && activeSubActivity === 'WORDWALL' ? (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-brand-dark-blue/70">פעילויות ומשחקים</p>
                  <h3 className="text-2xl font-bold text-brand-dark-blue">WORDWALL — {activeActivity}</h3>
                  <p className="text-brand-dark-blue/60">חידוני Wordwall למודול זה. הוסיפו לינקים רלוונטיים כשיהיו מוכנים.</p>
                </div>
                <button
                  onClick={() => setActiveSubActivity(null)}
                  className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
                >
                  חזרה לחלון המשחקים
                </button>
              </div>
              <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white/80 p-6 text-center text-brand-dark-blue/70 min-h-[12rem] flex flex-col items-center justify-center">
                <p className="text-2xl font-bold">חידוני Wordwall</p>
                <p className="text-lg mt-2">הוסיפו כאן לינקים לסטים בנושא {activeActivity}.</p>
              </div>
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeProgram === "'חכם בכיס'" && activeActivity === 'איך מנהלים הוצאות?' && activeSubActivity === 'חבילה עוברת' ? (
            <ParcelGame
              items={expensesItems}
              moduleTitle="איך מנהלים הוצאות?"
              moduleSubtitle="כל סיבוב נעצר בזמן אקראי"
              musicUrl="/havila.mp3"
            />
          ) : activeModule === 'פעילויות ומשחקים' && activeProgram === "'חכם בכיס'" && activeActivity === 'הסכנה שבמינוס' && activeSubActivity === 'חבילה עוברת' ? (
            <ParcelGame
              items={overdraftItems}
              moduleTitle="הסכנה שבמינוס"
              moduleSubtitle="כל סיבוב נעצר בזמן אקראי"
              musicUrl="/havila.mp3"
            />
          ) : activeModule === 'פעילויות ומשחקים' && activeProgram === "'חכם בכיס'" && activeActivity === 'פענוח תלוש שכר' && activeSubActivity === 'חבילה עוברת' ? (
            <ParcelGame
              items={paystubItems}
              moduleTitle="פענוח תלוש שכר"
              moduleSubtitle="כל סיבוב נעצר בזמן אקראי"
              musicUrl="/havila.mp3"
            />
          ) : activeModule === 'פעילויות ומשחקים' && activeProgram === "'חכם בכיס'" && activeActivity === 'שכירים ועצמאיים' && activeSubActivity === 'חבילה עוברת' ? (
            <ParcelGame
              items={employmentItems}
              moduleTitle="שכירים ועצמאיים"
              moduleSubtitle="כל סיבוב נעצר בזמן אקראי"
              musicUrl="/havila.mp3"
            />
          ) : activeModule === 'פעילויות ומשחקים' && activeProgram === "'חכם בכיס'" && activeActivity === 'חיסכון והשקעות' && activeSubActivity === 'חבילה עוברת' ? (
            <ParcelGame
              items={savingsInvestItems}
              moduleTitle="חיסכון והשקעות"
              moduleSubtitle="כל סיבוב נעצר בזמן אקראי"
              musicUrl="/havila.mp3"
            />
          ) : activeModule === 'פעילויות ומשחקים' && activeProgram === "'חכם בכיס'" && CHACHAM_GENERIC_GAME_ACTIVITIES.includes(activeActivity || '') && activeSubActivity === 'חבילה עוברת' ? (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-4">
              <p className="text-brand-dark-blue/70 text-center py-10">פעילות חבילה עוברת בנושא {activeActivity} תתווסף בקרוב.</p>
            </div>
          ) : activeModule === 'עזרים ונספחים' && activeProgram === "'חכם בכיס'" && !activeActivity ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(PROGRAM_ACTIVITY_MODULES["'חכם בכיס'"] || []).map((moduleName) => (
                <button
                  key={moduleName}
                  onClick={() => setActiveActivity(moduleName)}
                  className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
                >
                  <p className="text-2xl font-bold text-brand-dark-blue">{moduleName}</p>
                  <p className="text-brand-dark-blue/60 mt-3 text-lg">{getSummary(moduleName)}</p>
                </button>
              ))}
            </div>
          ) : activeModule === 'עזרים ונספחים' && activeProgram === "'חכם בכיס'" && activeActivity === 'ניהול התקציב הראשון שלי' ? (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-brand-dark-blue/70">עזרים ונספחים</p>
                  <h3 className="text-2xl font-bold text-brand-dark-blue">ניהול התקציב הראשון שלי</h3>
                  <p className="text-brand-dark-blue/60">הדפסות ודפי עבודה לתרגול חלוקת תקציב וחצ"ר.</p>
                </div>
                <button
                  onClick={() => setActiveActivity(null)}
                  className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
                >
                  חזרה לחומרי העזר
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <a
                  href="https://drive.google.com/file/d/1CSZIJ6X52bBW2WZGrigtpWusrBCYh4uu/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-6 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[12rem] flex flex-col items-center justify-center"
                >
                  <p className="text-2xl font-bold text-brand-dark-blue">תלוש שכר לדוגמא</p>
                  <p className="text-brand-dark-blue/60 mt-2 text-lg">פתיחה בחלון חדש</p>
                </a>
                <a
                  href="https://drive.google.com/file/d/1gkPH2bOvaGt6LgXdzsvW9g2gNUajcUsI/view?usp=drive_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-6 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[12rem] flex flex-col items-center justify-center"
                >
                  <p className="text-2xl font-bold text-brand-dark-blue">חוזה שכירות - דוגמא</p>
                  <p className="text-brand-dark-blue/60 mt-2 text-lg">פתיחה בחלון חדש</p>
                </a>
                <a
                  href="https://drive.google.com/file/d/1wa1wxnD2uTTNhbB9sTwGdjOPOLDGXOhU/view?usp=drive_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-6 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[12rem] flex flex-col items-center justify-center"
                >
                  <p className="text-2xl font-bold text-brand-dark-blue">כרטיסי דמויות</p>
                  <p className="text-brand-dark-blue/60 mt-2 text-lg">פתיחה בחלון חדש</p>
                </a>
                <a
                  href="https://drive.google.com/file/d/1WUW1eLQ7LXbJ1N0c63Utr097_yGnt9pH/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-6 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[12rem] flex flex-col items-center justify-center"
                >
                  <p className="text-2xl font-bold text-brand-dark-blue">דף עזר הוצאות ביגוד</p>
                  <p className="text-brand-dark-blue/60 mt-2 text-lg">פתיחה בחלון חדש</p>
                </a>
                <a
                  href="https://drive.google.com/file/d/1iSk_rwqqudU-aTDWqHRGViHJyRsz5R-8/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-6 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[12rem] flex flex-col items-center justify-center"
                >
                  <p className="text-2xl font-bold text-brand-dark-blue">כרטיסיות לחישוב בילויים</p>
                  <p className="text-brand-dark-blue/60 mt-2 text-lg">פתיחה בחלון חדש</p>
                </a>
                <a
                  href="https://drive.google.com/file/d/1n_0Dda08Q6lu3tcfK3FLjexhilK9iwDQ/view?usp=drive_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-6 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[12rem] flex flex-col items-center justify-center"
                >
                  <p className="text-2xl font-bold text-brand-dark-blue">דף עזר לרשימת קניות</p>
                  <p className="text-brand-dark-blue/60 mt-2 text-lg">פתיחה בחלון חדש</p>
                </a>
                <a
                  href="https://drive.google.com/file/d/1ux0z8ugD6DTPHQu54EZAbF4XNufwEeBv/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-6 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[12rem] flex flex-col items-center justify-center"
                >
                  <p className="text-2xl font-bold text-brand-dark-blue">דף ניהול הוצאות</p>
                  <p className="text-brand-dark-blue/60 mt-2 text-lg">פתיחה בחלון חדש</p>
                </a>
                <a
                  href="https://drive.google.com/file/d/1jWNJvdFLnaDIBAfnrBDdmB2lcEPXtiYm/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-6 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[12rem] flex flex-col items-center justify-center"
                >
                  <p className="text-2xl font-bold text-brand-dark-blue">כרטיסיות ניתוח תקציב</p>
                  <p className="text-brand-dark-blue/60 mt-2 text-lg">פתיחה בחלון חדש</p>
                </a>
                <a
                  href="https://drive.google.com/file/d/1a-8bYdhvIH-0XJMNxx-lwwUXs3qSQui3/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-6 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[12rem] flex flex-col items-center justify-center"
                >
                  <p className="text-2xl font-bold text-brand-dark-blue">תלוש שכר 2 לדוגמא</p>
                  <p className="text-brand-dark-blue/60 mt-2 text-lg">פתיחה בחלון חדש</p>
                </a>
                <a
                  href="https://drive.google.com/file/d/1JoCxv0FC4kIOzwPRF9Px0rVeD1t4B1nH/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-6 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[12rem] flex flex-col items-center justify-center"
                >
                  <p className="text-2xl font-bold text-brand-dark-blue">דף עזר ניתוח תדפיס עו"ש</p>
                  <p className="text-brand-dark-blue/60 mt-2 text-lg">פתיחה בחלון חדש</p>
                </a>
              </div>
            </div>
          ) : activeModule === 'עזרים ונספחים' && activeProgram === "'חכם בכיס'" && activeActivity === 'פענוח תלוש שכר' ? (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-brand-dark-blue/70">עזרים ונספחים</p>
                  <h3 className="text-2xl font-bold text-brand-dark-blue">פענוח תלוש שכר</h3>
                  <p className="text-brand-dark-blue/60">דפי עבודה ותרגולים לפענוח תלוש שכר.</p>
                </div>
                <button
                  onClick={() => setActiveActivity(null)}
                  className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
                >
                  חזרה לחומרי העזר
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <a
                  href="https://drive.google.com/file/d/1InUsxYhtzsokJ6-wearY0zSwjofyBDRJ/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-6 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[12rem] flex flex-col items-center justify-center"
                >
                  <p className="text-2xl font-bold text-brand-dark-blue">תלוש שכר ריק לתרגול</p>
                  <p className="text-brand-dark-blue/60 mt-2 text-lg">פתיחה בחלון חדש</p>
                </a>
                <a
                  href="https://drive.google.com/file/d/1wkOdqEnkmkNz742UciFsY0m9a-4NQOXN/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-6 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[12rem] flex flex-col items-center justify-center"
                >
                  <p className="text-2xl font-bold text-brand-dark-blue">תרגיל תלוש שכר הפוך</p>
                  <p className="text-brand-dark-blue/60 mt-2 text-lg">פתיחה בחלון חדש</p>
                </a>
              </div>
            </div>
          ) : activeModule === 'עזרים ונספחים' && activeProgram === "'חכם בכיס'" && activeActivity === 'זכויות עובדים' ? (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-brand-dark-blue/70">עזרים ונספחים</p>
                  <h3 className="text-2xl font-bold text-brand-dark-blue">זכויות עובדים</h3>
                  <p className="text-brand-dark-blue/60">טפסים ודפי עבודה לנושא זכויות עובדים.</p>
                </div>
                <button
                  onClick={() => setActiveActivity(null)}
                  className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
                >
                  חזרה לחומרי העזר
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <a
                  href="https://drive.google.com/file/d/1s0lSUi2Og8TxWbAKsFE0iJ8C_rz1Hamn/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-6 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[12rem] flex flex-col items-center justify-center"
                >
                  <p className="text-2xl font-bold text-brand-dark-blue">טופס 101</p>
                  <p className="text-brand-dark-blue/60 mt-2 text-lg">פתיחה בחלון חדש</p>
                </a>
                <a
                  href="https://drive.google.com/file/d/1M8weOLwKROpStPdiYrNZ1pSS5-2YVPzK/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-6 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[12rem] flex flex-col items-center justify-center"
                >
                  <p className="text-2xl font-bold text-brand-dark-blue">דף מעקב שעות עבודה</p>
                  <p className="text-brand-dark-blue/60 mt-2 text-lg">פתיחה בחלון חדש</p>
                </a>
              </div>
            </div>
          ) : activeModule === 'עזרים ונספחים' && activeProgram === "'חכם בכיס'" && activeActivity ? (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-6 space-y-5">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-brand-dark-blue/70">עזרים ונספחים — חכם בכיס</p>
                  <h3 className="text-2xl font-bold text-brand-dark-blue">{activeActivity}</h3>
                  <p className="text-brand-dark-blue/60">{getSummary(activeActivity)}</p>
                </div>
                <button
                  onClick={() => setActiveActivity(null)}
                  className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
                >
                  חזרה לחומרי העזר
                </button>
              </div>
              <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white/70 p-10 text-center text-brand-dark-blue/50 flex flex-col items-center justify-center min-h-[12rem]">
                <p className="text-5xl mb-4">📂</p>
                <p className="text-xl font-bold text-brand-dark-blue">חומרים לנושא זה יתווספו בקרוב</p>
                <p className="text-base mt-2 text-brand-dark-blue/60">דפי עבודה, קבצים והדפסות עבור "{activeActivity}" יועלו להמשך.</p>
              </div>
            </div>
          ) : activeModule === 'סרטונים' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(PROGRAM_ACTIVITY_MODULES[activeProgram || ''] || []).map((moduleName) => (
                <div
                  key={moduleName}
                  className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow min-h-[14rem] flex flex-col items-center justify-center"
                >
                  <p className="text-2xl font-bold text-brand-dark-blue">{moduleName}</p>
                  <p className="text-brand-dark-blue/60 mt-3 text-lg">{getSummary(moduleName)}</p>
                </div>
              ))}
              {(PROGRAM_ACTIVITY_MODULES[activeProgram || ''] || []).length === 0 && (
                <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white/70 p-10 text-center text-brand-dark-blue/50 min-h-[14rem] flex flex-col items-center justify-center">
                  <p className="text-2xl font-bold">אין מודולים זמינים</p>
                  <p className="text-lg mt-2">הוסיפו שמות מודולים למפה</p>
                </div>
              )}
            </div>
          ) : activeModule === 'עזרים ונספחים' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(PROGRAM_ACTIVITY_MODULES[activeProgram || ''] || []).map((moduleName) => (
                <div
                  key={moduleName}
                  className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow min-h-[14rem] flex flex-col items-center justify-center"
                >
                  <p className="text-2xl font-bold text-brand-dark-blue">{moduleName}</p>
                  <p className="text-brand-dark-blue/60 mt-3 text-lg">{getSummary(moduleName)}</p>
                </div>
              ))}
              {(PROGRAM_ACTIVITY_MODULES[activeProgram || ''] || []).length === 0 && (
                <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white/70 p-10 text-center text-brand-dark-blue/50 min-h-[14rem] flex flex-col items-center justify-center">
                  <p className="text-2xl font-bold">אין מודולים זמינים</p>
                  <p className="text-lg mt-2">הוסיפו שמות מודולים למפה</p>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-gray-300 bg-white/70 p-10 shadow-xl min-h-[18rem] flex flex-col items-center justify-center text-center">
              <p className="text-3xl font-bold text-brand-dark-blue mb-3">מרחב המודול: {activeModule}</p>
              <p className="text-xl text-brand-dark-blue/70 max-w-2xl">כאן תוכלו להוסיף בעתיד תוכן, קבצים, וידאו או פעילויות עבור מודול זה.</p>
            </div>
          )}
          <div className="flex flex-wrap gap-3 justify-center mt-6">
            <button
              onClick={() => { setActiveSubActivity(null); setActiveModule(null); }}
              className="px-6 py-3 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
            >
              חזרה לבחירת סוג תוכן
            </button>
            <button
              onClick={() => { setActiveActivity(null); setActiveModule(null); setActiveSubActivity(null); }}
              className="px-6 py-3 rounded-full bg-gray-300 text-brand-dark-blue font-bold hover:bg-gray-400"
            >
              חזרה לרשימת המודולים
            </button>
            <button
              onClick={() => { setActiveProgram(null); setActiveModule(null); setActiveActivity(null); setActiveSubActivity(null); }}
              className="px-6 py-3 rounded-full bg-brand-magenta text-white font-bold hover:bg-pink-700"
            >
              חזרה לרשימת התוכניות
            </button>
          </div>
        </main>
      )}
    </div>
  );
};

export default InstructorsPage;