import React, { useEffect, useMemo, useState } from 'react';
import ModuleView from '../ModuleView';
import { QRCodeSVG } from 'qrcode.react';

interface GovernmentBudgetModuleProps {
  onBack: () => void;
  title: string;
  onComplete: () => void;
}

export type BudgetItem = {
  id: string;
  title: string;
  shortTitle: string;
  type: 'ministry' | 'national';
  category: 'social' | 'security' | 'growth' | 'governance';
  reference: number;
  purpose: string;
  lowImpact: string;
  highImpact: string;
};

export type AllocationMap = Record<string, number>;
export type OtherCutPercents = Record<string, number>;

// סכום 15 הסעיפים המפורטים מלבד "משרדים אחרים": 585.512 מיליארד
// שארית "משרדים אחרים": 699 - 585.512 = 113.488 מיליארד
export const TOTAL_BUDGET = 699;

export const budgetItems: BudgetItem[] = [
  {
    id: 'defense',
    title: 'משרד הביטחון',
    shortTitle: 'ביטחון',
    type: 'ministry',
    category: 'security',
    reference: 144.9,
    purpose: 'מממן את צה"ל, אימונים, ציוד, הגנה אווירית ושמירה על ביטחון המדינה.',
    lowImpact: 'פחות אימונים, פחות ציוד ופחות מוכנות למצבי חירום.',
    highImpact: 'יותר השקעה בצבא, בציוד ובהגנה, אך פחות כסף נשאר לשירותים אזרחיים.',
  },
  {
    id: 'education',
    title: 'משרד החינוך',
    shortTitle: 'חינוך',
    type: 'ministry',
    category: 'social',
    reference: 101,
    purpose: 'אחראי על בתי ספר, גנים, מורים, תוכניות לימוד וחינוך בלתי פורמלי.',
    lowImpact: 'כיתות צפופות יותר, פחות שעות תגבור ופחות השקעה בצוותי הוראה.',
    highImpact: 'יותר תגבור, יותר תוכניות, ותנאים טובים יותר לתלמידים ולמורים.',
  },
  {
    id: 'health',
    title: 'משרד הבריאות',
    shortTitle: 'בריאות',
    type: 'ministry',
    category: 'social',
    reference: 65.2,
    purpose: 'מממן בתי חולים, קופות חולים, חיסונים, רפואה מונעת ובריאות הציבור.',
    lowImpact: 'זמני המתנה ארוכים יותר ופחות ציוד, כוח אדם ושירותי מניעה.',
    highImpact: 'יותר מיטות, יותר רופאים והשקעה גדולה יותר בבריאות הציבור.',
  },
  {
    id: 'social-security',
    title: 'המוסד לביטוח לאומי',
    shortTitle: 'ביטוח לאומי',
    type: 'national',
    category: 'social',
    reference: 63,
    purpose: 'מממן קצבאות ילדים, זקנה, נכות, אבטלה ושאר רשת הביטחון הסוציאלית.',
    lowImpact: 'פחות רשת ביטחון למשפחות, ילדים, קשישים ואזרחים במצוקה.',
    highImpact: 'יותר תמיכה ישירה באזרחים, אך פחות גמישות להשקעות אחרות.',
  },
  {
    id: 'welfare',
    title: 'משרד הרווחה',
    shortTitle: 'רווחה',
    type: 'ministry',
    category: 'social',
    reference: 20,
    purpose: 'מסייע למשפחות במצוקה, אזרחים ותיקים, אנשים עם מוגבלות ונוער בסיכון.',
    lowImpact: 'פחות תמיכה למשפחות חלשות ופחות מסגרות סיוע קהילתיות.',
    highImpact: 'רשת ביטחון חברתית רחבה יותר ושירותי תמיכה זמינים יותר.',
  },
  {
    id: 'employment',
    title: 'משרד התעסוקה',
    shortTitle: 'תעסוקה',
    type: 'ministry',
    category: 'social',
    reference: 5,
    purpose: 'מקדם תעסוקה, הכשרות מקצועיות, זכויות עובדים ומניעת אבטלה.',
    lowImpact: 'פחות הכשרות מקצועיות ופחות תמיכה במובטלים.',
    highImpact: 'יותר אנשים בשוק העבודה ותנאי עבודה טובים יותר.',
  },
  {
    id: 'culture',
    title: 'משרד המדע, התרבות והספורט',
    shortTitle: 'מדע תרבות וספורט',
    type: 'ministry',
    category: 'social',
    reference: 3,
    purpose: 'מממן תרבות, מוזיאונים, ספריות, ספורט, מחקר ואוניברסיטאות.',
    lowImpact: 'פחות פעילויות תרבות וספורט ופחות מימון מוסדות אקדמיים.',
    highImpact: 'יותר חוגים, מתקנים, אירועי תרבות ותמיכה בספורט ובמחקר.',
  },
  {
    id: 'national-security',
    title: 'המשרד לביטחון לאומי',
    shortTitle: 'ביטחון לאומי',
    type: 'ministry',
    category: 'security',
    reference: 32,
    purpose: 'מממן משטרה, שב"ס, כבאות ומערכי חירום אזרחיים.',
    lowImpact: 'פחות נוכחות משטרתית ופחות מענה מהיר באירועי חירום.',
    highImpact: 'כוחות חירום חזקים יותר, יותר שיטור וציוד מתקדם יותר.',
  },
  {
    id: 'transport',
    title: 'משרד התחבורה',
    shortTitle: 'תחבורה',
    type: 'ministry',
    category: 'growth',
    reference: 45.6,
    purpose: 'אחראי על כבישים, תחבורה ציבורית, רכבות, בטיחות בדרכים ותשתיות ניידות.',
    lowImpact: 'פחות אוטובוסים, עיכובים בפרויקטים ופקקים גדולים יותר.',
    highImpact: 'השקעה מהירה יותר ברכבות, כבישים ותחבורה ציבורית נוחה.',
  },
  {
    id: 'economy',
    title: 'משרד הכלכלה והתעשייה',
    shortTitle: 'כלכלה ותעשייה',
    type: 'ministry',
    category: 'growth',
    reference: 4.9,
    purpose: 'מקדם תעשייה, עסקים קטנים, חדשנות, ייצוא ותחרותיות כלכלית.',
    lowImpact: 'פחות תמיכה בעסקים ובייצוא ופחות הכשרות מקצועיות.',
    highImpact: 'יותר מנועי צמיחה, תמיכה בעסקים ויצירת מקומות עבודה.',
  },
  {
    id: 'agriculture',
    title: 'משרד החקלאות',
    shortTitle: 'חקלאות',
    type: 'ministry',
    category: 'growth',
    reference: 1.9,
    purpose: 'תומך בחקלאים, ייצור מזון מקומי, חדשנות חקלאית וביטחון מזון.',
    lowImpact: 'פחות תמיכה בחקלאות ופחות יציבות באספקת מזון מקומית.',
    highImpact: 'חקלאות חזקה יותר, חדשנות ושיפור עצמאות המזון של המדינה.',
  },
  {
    id: 'environment',
    title: 'המשרד להגנת הסביבה',
    shortTitle: 'סביבה',
    type: 'ministry',
    category: 'social',
    reference: 0.549,
    purpose: 'מטפל בזיהום, מחזור, שמירה על אוויר נקי ושטחים פתוחים.',
    lowImpact: 'יותר מפגעים סביבתיים ופחות אכיפה סביבתית.',
    highImpact: 'ערים נקיות יותר, אכיפה חזקה יותר ושמירה על איכות החיים.',
  },
  {
    id: 'tourism',
    title: 'משרד התיירות',
    shortTitle: 'תיירות',
    type: 'ministry',
    category: 'growth',
    reference: 0.643,
    purpose: 'מקדם תיירות נכנסת, אתרי תיירות, תעסוקה מקומית והכנסות למדינה.',
    lowImpact: 'פחות תיירים, פחות הכנסות ופחות פיתוח אזורי תיירות.',
    highImpact: 'קידום תיירות, תעסוקה מקומית וחיזוק ערים ואתרים.',
  },
  {
    id: 'finance',
    title: 'משרד האוצר',
    shortTitle: 'אוצר',
    type: 'ministry',
    category: 'governance',
    reference: 7.52,
    purpose: 'מתכנן את התקציב, גובה מסים, מפקח על הוצאות ומנהל מדיניות כלכלית.',
    lowImpact: 'פחות יכולת ניהול, בקרה ותכנון רוחבי של תקציב המדינה.',
    highImpact: 'יותר השקעה בתכנון, בדיגיטציה ובניהול כלכלי ארוך טווח.',
  },
  {
    id: 'pmo',
    title: 'משרד ראש הממשלה',
    shortTitle: 'ראש הממשלה',
    type: 'ministry',
    category: 'governance',
    reference: 6.8,
    purpose: 'מרכז פעילות ממשלתית, תיאום בין-משרדי, ביטחון לאומי ומדיניות אסטרטגית.',
    lowImpact: 'פחות תיאום ממשלתי ופחות מענה למשברים בין-משרדיים.',
    highImpact: 'מנגנון ממשלתי יעיל יותר ויכולת קבלת החלטות מהירה.',
  },
  {
    id: 'debt',
    title: 'החזרי חובות',
    shortTitle: 'החזרי חובות',
    type: 'national',
    category: 'governance',
    reference: 84,
    purpose: 'תשלומי ריבית וקרן על הלוואות והתחייבויות עבר של המדינה.',
    lowImpact: 'אי אפשר לקצץ בקלות; אי תשלום ייצור משבר אשראי חמור.',
    highImpact: 'תשלום חוב מסודר משפר אמון שוקי ההון, אך הכסף לא זמין לשירותים שוטפים.',
  },
  {
    id: 'other',
    title: 'משרדים אחרים',
    shortTitle: 'משרדים אחרים',
    type: 'national',
    category: 'governance',
    reference: 113.488,
    purpose: 'כולל את כלל הסעיפים התקציביים הנוספים שאינם מפורטים בנפרד: משרד הפנים, משרד החוץ, משרד המשפטים, השכלה גבוהה, דיור ממשלתי, גמלאות ועוד.',
    lowImpact: 'קיצוץ בסעיפים אלה משפיע על עשרות שירותים ממשלתיים שונים.',
    highImpact: 'הגדלה מאפשרת חיזוק מגוון שירותים שאינם בחזית הציבורית אך חיוניים לתפקוד השוטף.',
  },
];

const chapterMeta = [
  { id: 'basics', title: 'הסבר על תקציב המדינה', icon: '📘' },
  { id: 'ministries', title: 'משרדי הממשלה', icon: '🏛️' },
  { id: 'simulation', title: 'ישיבת ממשלה', icon: '🧮' },
  { id: 'review', title: 'בדיקת התקציב', icon: '✅' },
];

export const formatBillions = (value: number) => `${value.toLocaleString('he-IL', { maximumFractionDigits: 2 })} מיליארד ₪`;
export const debtReference = budgetItems.find((item) => item.id === 'debt')?.reference ?? 84;
export const debtMinimum = Number((debtReference * 0.9).toFixed(1));
export const otherReference = budgetItems.find((item) => item.id === 'other')?.reference ?? 113.488;

export type OtherOfficeOption = {
  id: string;
  title: string;
  amount: number;
};

export const OTHER_OFFICE_OPTIONS: OtherOfficeOption[] = [
  { id: 'justice', title: 'משרד המשפטים', amount: 5.048 },
  { id: 'foreign', title: 'משרד החוץ', amount: 3.342 },
  { id: 'higher-education', title: 'המשרד להשכלה גבוהה', amount: 14.983 },
  { id: 'religious-services', title: 'המשרד לשירותי דת', amount: 0.878 },
  { id: 'aliya', title: 'משרד קליטת העליה', amount: 1.539 },
  { id: 'energy', title: 'משרד האנרגיה', amount: 0.543 },
  { id: 'housing', title: 'משרד הבינוי והשיכון', amount: 6.688 },
  { id: 'water', title: 'משרד משק המים', amount: 0.84 },
  { id: 'interior-local', title: 'משרד הפנים ושלטון מקומי', amount: 8.432 },
  { id: 'communications', title: 'משרד התקשורת', amount: 0.085 },
  { id: 'national-reserve', title: 'הרזרבה הלאומית', amount: 12.8 },
  { id: 'pensions', title: 'גמלאות', amount: 26.752 },
  { id: 'misc', title: 'הוצאות שונות', amount: 31.558 },
];

export const normalizePercent = (value: number) => {
  if (!Number.isFinite(value)) return 0;
  return Number(Math.min(100, Math.max(0, value)).toFixed(1));
};

export const buildDefaultOtherCutPercents = (): OtherCutPercents =>
  Object.fromEntries(OTHER_OFFICE_OPTIONS.map((option) => [option.id, 0]));

export const getOtherCutAmountFromPercents = (cutPercents: OtherCutPercents) =>
  OTHER_OFFICE_OPTIONS.reduce(
    (sum, option) => sum + option.amount * ((cutPercents[option.id] || 0) / 100),
    0,
  );

export const getOtherAmountFromCutPercents = (cutPercents: OtherCutPercents) =>
  Number(Math.max(0, otherReference - getOtherCutAmountFromPercents(cutPercents)).toFixed(3));

export const buildReferenceAllocations = (): AllocationMap =>
  Object.fromEntries(budgetItems.map((item) => [item.id, item.reference]));

export const buildInitialAllocations = (): AllocationMap => ({
  debt: debtReference,
  other: otherReference,
});

export const buildEqualAllocations = (): AllocationMap => {
  const base = Number((TOTAL_BUDGET / budgetItems.length).toFixed(1));
  const allocations: AllocationMap = {};
  let running = 0;

  budgetItems.forEach((item, index) => {
    const value = index === budgetItems.length - 1 ? Number((TOTAL_BUDGET - running).toFixed(1)) : base;
    allocations[item.id] = value;
    running += value;
  });

  return allocations;
};

export const getUsedBudget = (allocations: AllocationMap) =>
  Number(budgetItems.reduce((sum, item) => sum + (allocations[item.id] || 0), 0).toFixed(1));

export const getStateIdentity = (allocations: AllocationMap) => {
  const by = (id: string) => allocations[id] || 0;
  const social = by('education') + by('health') + by('welfare') + by('social-security') + by('employment') + by('culture');
  const security = by('defense') + by('national-security');
  const growth = by('transport') + by('economy') + by('agriculture') + by('tourism');

  if (security > social && security > growth) {
    return {
      title: 'מדינת חירום ממוקדת ביטחון',
      description: 'בחרתם להפנות חלק גדול מהכסף לביטחון ולהגנה. המדינה שלכם מרגישה מוגנת יותר, אבל השירותים האזרחיים עלולים להיות לחוצים יותר.',
      accent: 'from-rose-500 to-orange-500',
    };
  }

  if (social > security && social > growth) {
    return {
      title: 'מדינה חברתית עם דגש על שירותים',
      description: 'בחרתם לשים את האנשים במרכז: חינוך, בריאות ורווחה קיבלו משקל גבוה. התושבים נהנים מיותר שירותים, אך נדרש איזון מול צרכים אחרים.',
      accent: 'from-teal-500 to-cyan-500',
    };
  }

  if (growth > social && growth > security) {
    return {
      title: 'מדינת צמיחה ותשתיות',
      description: 'בחרתם להשקיע בכבישים, דיור, תעסוקה וחדשנות. זו מדינה שרוצה לצמוח מהר, לבנות הרבה ולהשפיע על העתיד.',
      accent: 'from-indigo-500 to-sky-500',
    };
  }

  return {
    title: 'מדינה מאוזנת',
    description: 'התקציב שלכם מחלק משאבים בין ביטחון, שירותים חברתיים ותשתיות בצורה יחסית מאוזנת. זו בחירה שמחפשת יציבות ורציפות.',
    accent: 'from-emerald-500 to-blue-500',
  };
};

const BudgetBasicsChapter: React.FC = () => (
  <div className="space-y-6 animate-fade-in">
    <div className="bg-gradient-to-r from-cyan-50 to-teal-100 border-2 border-brand-teal rounded-3xl p-8">
      <h3 className="text-4xl font-bold text-brand-teal mb-4">מהו תקציב המדינה?</h3>
      <p className="text-2xl text-brand-dark-blue/90 leading-relaxed">
        תקציב המדינה הוא התוכנית הכלכלית של הממשלה לשנה הקרובה: כמה כסף המדינה צפויה לקבל ממסים וממקורות נוספים,
        ולאן היא תבחר להעביר אותו. דרך התקציב הממשלה מחליטה אילו שירותים יחוזקו, איפה יבנו, וכמה כסף יקבל כל תחום בחיים שלנו.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white/80 rounded-3xl border border-cyan-100 p-6 shadow-lg">
        <h4 className="text-2xl font-bold text-brand-dark-blue mb-3">איך התקציב נקבע?</h4>
        <ol className="space-y-3 text-xl text-brand-dark-blue/80 list-decimal list-inside leading-relaxed">
          <li>משרדי הממשלה מבקשים כסף עבור מטרות, שירותים ותוכניות.</li>
          <li>משרד האוצר בודק כמה כסף יש למדינה ומה סדרי העדיפויות.</li>
          <li>הממשלה דנה, מתווכחת ומציעה חלוקה בין התחומים.</li>
          <li>הכנסת מצביעה ומאשרת את התקציב.</li>
        </ol>
      </div>
      <div className="bg-white/80 rounded-3xl border border-teal-100 p-6 shadow-lg">
        <h4 className="text-2xl font-bold text-brand-dark-blue mb-3">למה זה חשוב לנו?</h4>
        <ul className="space-y-3 text-xl text-brand-dark-blue/80 leading-relaxed">
          <li>🏫 התקציב משפיע על בתי הספר והחוגים.</li>
          <li>🏥 התקציב קובע כמה אפשר להשקיע בבתי חולים וברפואה.</li>
          <li>🚌 התקציב משפיע על אוטובוסים, רכבות וכבישים.</li>
          <li>🛡️ התקציב קובע גם כמה מושקע בביטחון ובהיערכות לחירום.</li>
        </ul>
      </div>
    </div>

    <div className="bg-gradient-to-r from-amber-50 to-yellow-100 border-2 border-yellow-300 rounded-3xl p-8">
      <h4 className="text-2xl font-bold text-yellow-800 mb-3">תקציב הייחוס במודול</h4>
      <p className="text-xl text-yellow-900 leading-relaxed">
        תקציב המדינה לשנת 2026 עומד על <span className="font-bold">699 מיליארד ₪</span>. בסימולציה תראו את המשרדים המרכזיים עם התקציבים האמיתיים שלהם, ובסעיף "משרדים אחרים" נכללת יתרת התקציב המחולקת בין עשרות גופים ממשלתיים נוספים.
      </p>
    </div>
  </div>
);

const MinistriesChapter: React.FC = () => {
  const ministries = budgetItems.filter((item) => item.type === 'ministry');
  const nationalItems = budgetItems.filter((item) => item.type === 'national');

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h3 className="text-3xl font-bold text-brand-dark-blue mb-4">משרדי הממשלה השונים</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {ministries.map((item) => (
            <div key={item.id} className="rounded-3xl bg-white/85 border border-white/70 shadow-lg p-5 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h4 className="text-2xl font-bold text-brand-dark-blue">{item.title}</h4>
              </div>
              <p className="text-lg text-brand-dark-blue/80 leading-relaxed">{item.purpose}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-indigo-100 bg-indigo-50/80 p-6 space-y-4">
        <h4 className="text-2xl font-bold text-indigo-800">וגם: סעיפי רוחב לאומיים</h4>
        <p className="text-lg text-indigo-900/80 leading-relaxed">
          בישיבת תקציב אמיתית לא מחלקים כסף רק למשרדים. יש גם סעיפים גדולים כמו קצבאות, תשלומי חוב ורזרבות לחירום.
          גם הם חלק מתקציב המדינה ולכן תראו אותם בפרק ההתנסות.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {nationalItems.map((item) => (
            <div key={item.id} className="rounded-2xl bg-white p-4 border border-indigo-100 shadow-sm">
              <div className="font-bold text-brand-dark-blue">{item.title}</div>
              <p className="text-brand-dark-blue/70 mt-2">{item.purpose}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

type SimulationChapterProps = {
  allocations: AllocationMap;
  usedBudget: number;
  remainingBudget: number;
  onAllocationChange: (id: string, value: number | null) => void;
  otherCutPercents: OtherCutPercents;
  onOtherCutPercentChange: (cutId: string, percent: number) => void;
  onLoadEqual: () => void;
  onLoadReference: () => void;
  onReset: () => void;
  onSubmitBudget: () => void;
  mobileUrl: string;
};

const SimulationChapter: React.FC<SimulationChapterProps> = ({
  allocations,
  usedBudget,
  remainingBudget,
  onAllocationChange,
  otherCutPercents,
  onOtherCutPercentChange,
  onLoadEqual,
  onLoadReference,
  onReset,
  onSubmitBudget,
  mobileUrl,
}) => {
  const [isOtherModalOpen, setIsOtherModalOpen] = useState(false);
  const [itemAdjustPercents, setItemAdjustPercents] = useState<Record<string, number>>({});
  const selectedCutAmount = useMemo(
    () => Number(getOtherCutAmountFromPercents(otherCutPercents).toFixed(3)),
    [otherCutPercents],
  );

  const setItemAdjustPercent = (id: string, value: number) => {
    setItemAdjustPercents((prev) => ({ ...prev, [id]: normalizePercent(value) }));
  };

  const applyItemPercentChange = (id: string, mode: 'cut' | 'add') => {
    const current = allocations[id] ?? 0;
    const percent = normalizePercent(itemAdjustPercents[id] ?? 0);
    const delta = current * (percent / 100);
    const nextValue = mode === 'cut' ? Math.max(0, current - delta) : current + delta;
    onAllocationChange(id, Number(nextValue.toFixed(1)));
  };

  return (
  <div className="space-y-6 animate-fade-in">
    <div className="bg-gradient-to-r from-fuchsia-50 to-pink-100 border-2 border-pink-200 rounded-3xl p-8">
      <h3 className="text-3xl font-bold text-brand-magenta mb-3">ישיבת הממשלה מתחילה</h3>
      <p className="text-xl text-brand-dark-blue/80 leading-relaxed">
        אתם עכשיו השרים. לפניכם {formatBillions(TOTAL_BUDGET)} לחלק בין כל משרדי הממשלה וסעיפי הרוחב. אפשר לבחור לתגבר משרד מסוים,
        או לקצץ במשרד אחר לפי סדרי העדיפויות שלכם.
      </p>
    </div>

    <div className="rounded-3xl bg-gradient-to-l from-indigo-50 to-purple-50 border-2 border-indigo-200 p-6 flex flex-col sm:flex-row items-center gap-6">
      <div className="flex-shrink-0 bg-white rounded-2xl p-3 shadow-md">
        <QRCodeSVG value={mobileUrl} size={140} />
      </div>
      <div className="text-right">
        <h4 className="text-2xl font-bold text-indigo-800 mb-2">🎮 שחקו גם בטלפון!</h4>
        <p className="text-lg text-indigo-900/80 leading-relaxed mb-3">
          סרקו את הברקוד בטלפון וחלקו את תקציב המדינה בעצמכם — ממשק מותאם לנייד שמאפשר לכל תלמיד לנסות בנפרד.
        </p>
        <div className="inline-block bg-indigo-100 rounded-xl px-4 py-2">
          <span className="text-sm font-mono text-indigo-700 break-all">{mobileUrl}</span>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="rounded-3xl bg-white/85 border border-white/70 p-5 shadow-lg text-center">
        <div className="text-brand-dark-blue/70 text-lg">סך התקציב</div>
        <div className="text-4xl font-bold text-brand-dark-blue mt-2">{formatBillions(TOTAL_BUDGET)}</div>
      </div>
      <div className="rounded-3xl bg-white/85 border border-white/70 p-5 shadow-lg text-center">
        <div className="text-brand-dark-blue/70 text-lg">כבר חילקתם</div>
        <div className="text-4xl font-bold text-brand-teal mt-2">{formatBillions(usedBudget)}</div>
      </div>
      <div className={`rounded-3xl border p-5 shadow-lg text-center ${remainingBudget === 0 ? 'bg-emerald-50 border-emerald-200' : remainingBudget > 0 ? 'bg-amber-50 border-amber-200' : 'bg-rose-50 border-rose-200'}`}>
        <div className="text-brand-dark-blue/70 text-lg">יתרה לחלוקה</div>
        <div className="text-4xl font-bold mt-2">{formatBillions(remainingBudget)}</div>
      </div>
    </div>

    <div className="flex flex-wrap gap-3">
      <button onClick={onLoadEqual} className="px-5 py-3 rounded-full bg-cyan-100 text-cyan-800 font-bold hover:bg-cyan-200">חלוקה שווה</button>
      <button onClick={onLoadReference} className="px-5 py-3 rounded-full bg-emerald-100 text-emerald-800 font-bold hover:bg-emerald-200">התקציב האמיתי</button>
      <button onClick={onReset} className="px-5 py-3 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300">אפס הכול</button>
    </div>

    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      {budgetItems.map((item) => {
        const isDebt = item.id === 'debt';
        const isOther = item.id === 'other';
        return (
          <div key={item.id} className="rounded-3xl bg-white/90 border border-white/80 shadow p-5 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className="text-2xl font-bold text-brand-dark-blue">{item.title}</h4>
                <p className="text-brand-dark-blue/65 mt-1">{item.purpose}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${item.type === 'ministry' ? 'bg-brand-light-blue/10 text-brand-light-blue' : 'bg-indigo-100 text-indigo-700'}`}>
                {item.type === 'ministry' ? 'משרד' : 'סעיף רוחב'}
              </span>
            </div>

            <div>
              <label className="block">
                <span className="text-sm text-brand-dark-blue/70">
                  {isOther ? 'תקציב נגזר מרשימת הקיצוצים שבחרתם' : 'תקציב שבחרתם (מיליארדים)'}
                </span>
                <input
                  type="number"
                  min={0}
                  step={0.5}
                  value={isOther ? (allocations[item.id] ?? otherReference) : (allocations[item.id] ?? '')}
                  onChange={(e) => {
                    if (isOther) return;
                    const raw = e.target.value;
                    if (raw === '') {
                      onAllocationChange(item.id, null);
                      return;
                    }
                    onAllocationChange(item.id, Number(raw));
                  }}
                  disabled={isOther}
                  className={`mt-2 w-full rounded-2xl border-2 px-4 py-3 text-xl font-bold focus:outline-none focus:ring-2 ${isOther ? 'border-indigo-200 bg-indigo-50 text-indigo-800 cursor-not-allowed focus:ring-indigo-300' : 'border-gray-200 text-brand-dark-blue focus:ring-brand-teal'}`}
                />
                {isDebt && (
                  <p className="mt-2 text-sm text-amber-700">
                    ניתן להקטין החזר חוב עד {formatBillions(debtMinimum)} בלבד (עד 10%- מתקציב הייחוס).
                  </p>
                )}
                {!isOther && (
                  <div className="mt-3 rounded-2xl border border-cyan-100 bg-cyan-50/70 p-3 space-y-3">
                    <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
                      <label className="text-sm text-brand-dark-blue/70 shrink-0">שינוי %</label>
                      <div className="flex items-center gap-2 shrink-0">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          step={1}
                          value={itemAdjustPercents[item.id] ?? 0}
                          onChange={(e) => setItemAdjustPercent(item.id, Number(e.target.value))}
                          className="w-24 rounded-xl border border-gray-300 px-3 py-2 font-bold text-brand-dark-blue"
                        />
                        <span className="text-brand-dark-blue/70">%</span>
                      </div>
                      <button
                        onClick={() => applyItemPercentChange(item.id, 'cut')}
                        className="px-3 py-1.5 rounded-full bg-rose-100 text-rose-700 text-sm font-bold hover:bg-rose-200 shrink-0"
                      >
                        קצץ
                      </button>
                      <button
                        onClick={() => applyItemPercentChange(item.id, 'add')}
                        className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold hover:bg-emerald-200 shrink-0"
                      >
                        הגדל
                      </button>
                    </div>
                  </div>
                )}
                {isOther && (
                  <div className="mt-3 space-y-2">
                    <button
                      onClick={() => setIsOtherModalOpen(true)}
                      className="px-4 py-2 rounded-full bg-indigo-100 text-indigo-800 font-bold hover:bg-indigo-200"
                    >
                      בחרו מאילו משרדים לקצץ
                    </button>
                    <p className="text-sm text-indigo-800/80">
                      סך הקיצוץ שנבחר: {formatBillions(selectedCutAmount)}
                    </p>
                  </div>
                )}
              </label>
            </div>
          </div>
        );
      })}
    </div>

    <div className="rounded-3xl border-2 border-dashed border-brand-teal/40 bg-brand-teal/5 p-6 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
      <p className="text-xl text-brand-dark-blue/80 leading-relaxed">
        כדי לעבור לפרק המשוב, התקציב חייב להסתכם בדיוק ב-{formatBillions(TOTAL_BUDGET)}. כרגע היתרה היא {formatBillions(remainingBudget)}.
      </p>
      <button
        onClick={onSubmitBudget}
        disabled={remainingBudget !== 0}
        className="px-6 py-4 rounded-full bg-brand-magenta text-white font-bold text-xl hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        בדקו את התקציב שבניתם
      </button>
    </div>

    {isOtherModalOpen && (
      <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" dir="rtl">
        <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl p-6 space-y-4 max-h-[85vh] overflow-y-auto">
          <div className="flex items-center justify-between gap-3">
            <h4 className="text-2xl font-bold text-brand-dark-blue">בחירת קיצוץ מתוך "משרדים אחרים"</h4>
            <button onClick={() => setIsOtherModalOpen(false)} className="px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200">סגור</button>
          </div>
          <p className="text-brand-dark-blue/80">
            הגדירו לכל משרד את אחוז הקיצוץ הרצוי (0%-100%).
          </p>
          <div className="space-y-2">
            {OTHER_OFFICE_OPTIONS.map((option) => (
              <div key={option.id} className="rounded-2xl border border-gray-200 p-3 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-brand-dark-blue">{option.title}</span>
                  <span className="font-bold text-brand-dark-blue/80">{formatBillions(option.amount)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-sm text-brand-dark-blue/70">אחוז קיצוץ</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step={1}
                    value={otherCutPercents[option.id] ?? 0}
                    onChange={(e) => onOtherCutPercentChange(option.id, Number(e.target.value))}
                    className="w-28 rounded-xl border border-gray-300 px-3 py-2 font-bold text-brand-dark-blue"
                  />
                  <span className="text-brand-dark-blue/70">%</span>
                  <span className="text-sm text-indigo-800 font-semibold">
                    קיצוץ בפועל: {formatBillions(Number((option.amount * ((otherCutPercents[option.id] || 0) / 100)).toFixed(3)))}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-2xl bg-indigo-50 border border-indigo-100 p-4 text-indigo-900 font-semibold">
            תקציב "משרדים אחרים" לאחר הקיצוץ: {formatBillions(allocations.other ?? otherReference)}
          </div>
          <div className="flex justify-end">
            <button onClick={() => setIsOtherModalOpen(false)} className="px-5 py-2 rounded-full bg-brand-teal text-white font-bold hover:bg-teal-500">סיום</button>
          </div>
        </div>
      </div>
    )}
  </div>
  );
};

type EvaluationChapterProps = {
  submittedBudget: AllocationMap | null;
  submittedOtherCutPercents: OtherCutPercents;
};

const EvaluationChapter: React.FC<EvaluationChapterProps> = ({ submittedBudget, submittedOtherCutPercents }) => {
  const evaluation = useMemo(() => {
    if (!submittedBudget) return null;

    const rows = budgetItems.map((item) => {
      const chosen = submittedBudget[item.id] || 0;
      const gap = Number((chosen - item.reference).toFixed(1));
      const ratio = item.reference === 0 ? 1 : chosen / item.reference;
      return { ...item, chosen, gap, ratio };
    }).sort((a, b) => b.chosen - a.chosen);

    const totalShift = Number((rows.filter((row) => row.gap > 0).reduce((sum, row) => sum + row.gap, 0)).toFixed(1));
    const similarity = Math.max(0, Math.round(100 - (totalShift / TOTAL_BUDGET) * 100));
    const biggestGaps = [...rows].sort((a, b) => Math.abs(b.gap) - Math.abs(a.gap)).slice(0, 6);
    const identity = getStateIdentity(submittedBudget);

    const narrative: string[] = [];

    const describeSector = (id: string) => rows.find((row) => row.id === id);

    [
      describeSector('education'),
      describeSector('health'),
      describeSector('transport'),
      describeSector('welfare'),
      describeSector('defense'),
      describeSector('housing'),
    ].forEach((row) => {
      if (!row) return;
      if (row.ratio < 0.85) narrative.push(`${row.title}: ${row.lowImpact}`);
      else if (row.ratio > 1.15) narrative.push(`${row.title}: ${row.highImpact}`);
    });

    if (narrative.length === 0) {
      narrative.push('התקציב שבחרתם קרוב יחסית לתקציב הייחוס, ולכן מתקבלת מדינה עם שירותים דומים יחסית למצב הקיים.');
    }

    const debtRow = rows.find((row) => row.id === 'debt');
    if (debtRow && debtRow.chosen < debtRow.reference) {
      const deferred = Number((debtRow.reference - debtRow.chosen).toFixed(1));
      narrative.push(`החזרי חובות: הקטנתם השנה ב-${formatBillions(deferred)} ולכן חלק מהנטל צפוי לעבור לשנים הבאות.`);
    }

    const otherCutSummary = OTHER_OFFICE_OPTIONS
      .filter((option) => (submittedOtherCutPercents[option.id] || 0) > 0)
      .map((option) => {
        const percent = submittedOtherCutPercents[option.id] || 0;
        const cutAmount = Number((option.amount * (percent / 100)).toFixed(3));
        return `${option.title}: ${percent}% (${formatBillions(cutAmount)})`;
      });

    return { rows, biggestGaps, similarity, identity, narrative, otherCutSummary };
  }, [submittedBudget, submittedOtherCutPercents]);

  if (!evaluation) {
    return (
      <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white/70 p-10 text-center text-brand-dark-blue/60 animate-fade-in">
        קודם צריך להשלים את ישיבת הממשלה ולחלק את כל התקציב, ואז נוכל לבדוק את הבחירות שלכם.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className={`rounded-3xl bg-gradient-to-r ${evaluation.identity.accent} text-white p-8 shadow-xl`}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h3 className="text-4xl font-bold mb-2">{evaluation.identity.title}</h3>
            <p className="text-2xl text-white/90 leading-relaxed">{evaluation.identity.description}</p>
          </div>
          <div className="bg-white/20 rounded-3xl px-6 py-5 min-w-[12rem] text-center">
            <div className="text-lg text-white/80">מדד התאמה לתקציב הייחוס</div>
            <div className="text-5xl font-black">{evaluation.similarity}%</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-3xl bg-white/90 border border-white/70 shadow-lg p-6">
          <h4 className="text-2xl font-bold text-brand-dark-blue mb-4">הפערים הגדולים ביותר</h4>
          <div className="space-y-3">
            {evaluation.biggestGaps.map((row) => (
              <div key={row.id} className="rounded-2xl border border-gray-100 p-4 bg-slate-50">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-bold text-brand-dark-blue">{row.title}</div>
                  <div className={`font-bold ${row.gap > 0 ? 'text-emerald-600' : row.gap < 0 ? 'text-rose-600' : 'text-slate-500'}`}>
                    {row.gap > 0 ? '+' : ''}{formatBillions(row.gap)}
                  </div>
                </div>
                <div className="text-sm text-brand-dark-blue/65 mt-1">
                  בחרתם {formatBillions(row.chosen)} מול {formatBillions(row.reference)} בתקציב הייחוס
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white/90 border border-white/70 shadow-lg p-6">
          <h4 className="text-2xl font-bold text-brand-dark-blue mb-4">איך המדינה שלכם תיראה?</h4>
          <div className="space-y-3">
            {evaluation.narrative.map((line) => (
              <div key={line} className="rounded-2xl bg-brand-teal/5 border border-brand-teal/20 p-4 text-lg text-brand-dark-blue/85 leading-relaxed">
                {line}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-white/90 border border-white/70 shadow-lg p-6 overflow-x-auto">
        <h4 className="text-2xl font-bold text-brand-dark-blue mb-4">טבלת השוואה מלאה</h4>
        <table className="w-full min-w-[880px] text-right">
          <thead>
            <tr className="bg-slate-100 text-brand-dark-blue">
              <th className="p-3 font-bold">משרד / סעיף</th>
              <th className="p-3 font-bold">בחרתם</th>
              <th className="p-3 font-bold">תקציב ייחוס</th>
              <th className="p-3 font-bold">פער</th>
            </tr>
          </thead>
          <tbody>
            {evaluation.rows.map((row) => (
              <tr key={row.id} className="border-t border-gray-100 bg-white">
                <td className="p-3 text-brand-dark-blue font-semibold">{row.title}</td>
                <td className="p-3 text-brand-dark-blue">{formatBillions(row.chosen)}</td>
                <td className="p-3 text-brand-dark-blue/75">{formatBillions(row.reference)}</td>
                <td className={`p-3 font-bold ${row.gap > 0 ? 'text-emerald-600' : row.gap < 0 ? 'text-rose-600' : 'text-slate-500'}`}>
                  {row.gap > 0 ? '+' : ''}{formatBillions(row.gap)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {evaluation.otherCutSummary.length > 0 && (
        <div className="rounded-3xl bg-white/90 border border-white/70 shadow-lg p-6">
          <h4 className="text-2xl font-bold text-brand-dark-blue mb-4">מאילו משרדים קוצץ סעיף "משרדים אחרים"?</h4>
          <div className="space-y-2">
            {evaluation.otherCutSummary.map((line) => (
              <div key={line} className="rounded-2xl border border-indigo-100 bg-indigo-50 p-3 text-brand-dark-blue">
                {line}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const GovernmentBudgetModule: React.FC<GovernmentBudgetModuleProps> = ({ onBack, title, onComplete }) => {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [allocations, setAllocations] = useState<AllocationMap>(() => buildInitialAllocations());
  const [otherCutPercents, setOtherCutPercents] = useState<OtherCutPercents>(() => buildDefaultOtherCutPercents());
  const [submittedOtherCutPercents, setSubmittedOtherCutPercents] = useState<OtherCutPercents>(() => buildDefaultOtherCutPercents());
  const [submittedBudget, setSubmittedBudget] = useState<AllocationMap | null>(null);

  const usedBudget = useMemo(() => getUsedBudget(allocations), [allocations]);
  const remainingBudget = useMemo(() => Number((TOTAL_BUDGET - usedBudget).toFixed(1)), [usedBudget]);

  const mobileUrl = useMemo(() => {
    const base = window.location.origin + window.location.pathname.replace(/\/+$/, '');
    return `${base}?mode=budget-mobile`;
  }, []);

  useEffect(() => {
    if (submittedBudget) onComplete();
  }, [submittedBudget, onComplete]);

  const setAllocation = (id: string, value: number | null) => {
    if (id === 'other') return;
    if (value === null) {
      setAllocations((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      return;
    }

    if (id === 'debt' && value < debtReference) {
      window.alert('שימו לב: הקטנת סכום החזר החוב השנה תגדיל את הנטל בשנים הבאות.');
    }

    const safeValue = Number.isFinite(value) ? Math.max(0, Number(value)) : 0;
    const cappedDebt = id === 'debt' ? Math.max(debtMinimum, safeValue) : safeValue;
    setAllocations((prev) => ({ ...prev, [id]: Number(cappedDebt.toFixed(1)) }));
  };

  const setOtherCutPercent = (cutId: string, percent: number) => {
    setOtherCutPercents((prev) => {
      const next = { ...prev, [cutId]: normalizePercent(percent) };
      setAllocations((prevAllocations) => ({ ...prevAllocations, other: getOtherAmountFromCutPercents(next) }));
      return next;
    });
  };

  const loadEqualBudget = () => {
    const equal = buildEqualAllocations();
    equal.debt = Math.max(debtMinimum, Number((equal.debt || debtReference).toFixed(1)));
    equal.other = otherReference;
    setOtherCutPercents(buildDefaultOtherCutPercents());
    setAllocations(equal);
  };
  const loadReferenceBudget = () => {
    setOtherCutPercents(buildDefaultOtherCutPercents());
    setAllocations(buildReferenceAllocations());
  };
  const resetBudget = () => {
    setOtherCutPercents(buildDefaultOtherCutPercents());
    setAllocations(buildInitialAllocations());
  };

  const submitBudget = () => {
    if (remainingBudget !== 0) return;
    setSubmittedBudget({ ...allocations, other: getOtherAmountFromCutPercents(otherCutPercents) });
    setSubmittedOtherCutPercents({ ...otherCutPercents });
    setCurrentChapter(3);
  };

  const renderChapter = () => {
    switch (currentChapter) {
      case 0:
        return <BudgetBasicsChapter />;
      case 1:
        return <MinistriesChapter />;
      case 2:
        return (
          <SimulationChapter
            allocations={allocations}
            usedBudget={usedBudget}
            remainingBudget={remainingBudget}
            onAllocationChange={setAllocation}
            otherCutPercents={otherCutPercents}
            onOtherCutPercentChange={setOtherCutPercent}
            onLoadEqual={loadEqualBudget}
            onLoadReference={loadReferenceBudget}
            onReset={resetBudget}
            onSubmitBudget={submitBudget}
            mobileUrl={mobileUrl}
          />
        );
      case 3:
        return <EvaluationChapter submittedBudget={submittedBudget} submittedOtherCutPercents={submittedOtherCutPercents} />;
      default:
        return null;
    }
  };

  return (
    <ModuleView title={title} onBack={onBack}>
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {chapterMeta.map((chapter, index) => {
            const unlocked = index < 3 || !!submittedBudget;
            return (
              <button
                key={chapter.id}
                onClick={() => unlocked && setCurrentChapter(index)}
                disabled={!unlocked}
                className={`rounded-3xl border p-5 text-center transition ${currentChapter === index ? 'bg-brand-teal text-white border-brand-teal shadow-lg' : unlocked ? 'bg-white/80 text-brand-dark-blue border-white/70 hover:-translate-y-1 hover:shadow-lg' : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'}`}
              >
                <div className="text-4xl mb-2">{chapter.icon}</div>
                <div className="font-bold text-xl">{index + 1}. {chapter.title}</div>
              </button>
            );
          })}
        </div>

        {renderChapter()}

        <div className="flex justify-between gap-3 flex-wrap">
          <button
            onClick={() => setCurrentChapter((prev) => Math.max(0, prev - 1))}
            disabled={currentChapter === 0}
            className="px-6 py-3 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300 disabled:opacity-50"
          >
            הקודם
          </button>
          <button
            onClick={() => setCurrentChapter((prev) => Math.min(chapterMeta.length - 1, prev + 1))}
            disabled={currentChapter === chapterMeta.length - 1 || (currentChapter === 2 && !submittedBudget)}
            className="px-6 py-3 rounded-full bg-brand-teal text-white font-bold hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
            title={currentChapter === 2 && !submittedBudget ? 'יש להגיש תקציב מלא כדי לעבור לפרק הבדיקה' : ''}
          >
            {currentChapter === 2 && !submittedBudget ? 'הגישו תקציב תחילה' : 'הבא'}
          </button>
        </div>
      </div>
    </ModuleView>
  );
};

export default GovernmentBudgetModule;

// ======= Mobile standalone view (loaded via ?mode=budget-mobile) =======
export const MobileBudgetView: React.FC = () => {
  const [allocations, setAllocations] = useState<AllocationMap>(() => buildInitialAllocations());
  const [otherCutPercents, setOtherCutPercents] = useState<OtherCutPercents>(() => buildDefaultOtherCutPercents());
  const [itemAdjustPercents, setItemAdjustPercents] = useState<Record<string, number>>({});
  const [isOtherModalOpen, setIsOtherModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const used = useMemo(() => getUsedBudget(allocations), [allocations]);
  const remaining = useMemo(() => Number((TOTAL_BUDGET - used).toFixed(1)), [used]);
  const selectedOtherCutAmount = useMemo(
    () => Number(getOtherCutAmountFromPercents(otherCutPercents).toFixed(3)),
    [otherCutPercents],
  );

  const setAlloc = (id: string, value: number) => {
    if (id === 'other') return;
    const safe = Number.isFinite(value) ? Math.max(0, value) : 0;
    const cappedDebt = id === 'debt' ? Math.max(debtMinimum, safe) : safe;
    if (id === 'debt' && safe < debtReference) {
      window.alert('שימו לב: הקטנת סכום החזר החוב השנה תגדיל את הנטל בשנים הבאות.');
    }
    setAllocations((prev) => ({ ...prev, [id]: Number(cappedDebt.toFixed(1)) }));
  };

  const clearAlloc = (id: string) => {
    if (id === 'other') return;
    setAllocations((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const setOtherCutPercent = (cutId: string, percent: number) => {
    setOtherCutPercents((prev) => {
      const next = { ...prev, [cutId]: normalizePercent(percent) };
      setAllocations((prevAllocations) => ({ ...prevAllocations, other: getOtherAmountFromCutPercents(next) }));
      return next;
    });
  };

  const setItemAdjustPercent = (id: string, value: number) => {
    setItemAdjustPercents((prev) => ({ ...prev, [id]: normalizePercent(value) }));
  };

  const applyItemPercentChange = (id: string, mode: 'cut' | 'add') => {
    const current = allocations[id] ?? 0;
    const percent = normalizePercent(itemAdjustPercents[id] ?? 0);
    const delta = current * (percent / 100);
    const nextValue = mode === 'cut' ? Math.max(0, current - delta) : current + delta;
    setAlloc(id, Number(nextValue.toFixed(1)));
  };

  const loadEqual = () => {
    const equal = buildEqualAllocations();
    equal.debt = Math.max(debtMinimum, Number((equal.debt || debtReference).toFixed(1)));
    equal.other = otherReference;
    setOtherCutPercents(buildDefaultOtherCutPercents());
    setAllocations(equal);
  };

  const reset = () => {
    setOtherCutPercents(buildDefaultOtherCutPercents());
    setAllocations(buildInitialAllocations());
  };

  if (submitted) {
    const rows = [...budgetItems]
      .map((item) => ({ ...item, chosen: allocations[item.id] || 0, gap: Number(((allocations[item.id] || 0) - item.reference).toFixed(1)) }))
      .sort((a, b) => b.chosen - a.chosen);
    const identity = getStateIdentity(allocations);
    const totalShift = Number((rows.filter((row) => row.gap > 0).reduce((sum, row) => sum + row.gap, 0)).toFixed(1));
    const similarity = Math.max(0, Math.round(100 - (totalShift / TOTAL_BUDGET) * 100));
    const strengths = rows
      .filter((row) => row.reference > 0 && row.chosen / row.reference > 1.15)
      .slice(0, 4)
      .map((row) => `${row.title}: ${row.highImpact}`);
    const drawbacks = rows
      .filter((row) => row.reference > 0 && row.chosen / row.reference < 0.85)
      .slice(0, 4)
      .map((row) => `${row.title}: ${row.lowImpact}`);
    const otherCutSummary = OTHER_OFFICE_OPTIONS
      .filter((option) => (otherCutPercents[option.id] || 0) > 0)
      .map((option) => {
        const percent = otherCutPercents[option.id] || 0;
        const cutAmount = Number((option.amount * (percent / 100)).toFixed(3));
        return `${option.title}: ${percent}% (${formatBillions(cutAmount)})`;
      });
    const deferredDebt = allocations.debt && allocations.debt < debtReference
      ? Number((debtReference - allocations.debt).toFixed(1))
      : 0;
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 space-y-4" dir="rtl">
        <div className={`rounded-3xl bg-gradient-to-r ${identity.accent} text-white p-6 shadow-xl space-y-4`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black mb-2">{identity.title}</h2>
              <p className="text-lg text-white/90 leading-relaxed">{identity.description}</p>
            </div>
            <div className="rounded-2xl bg-white/20 px-4 py-3 text-center min-w-[6.5rem]">
              <div className="text-sm text-white/80">התאמה</div>
              <div className="text-3xl font-black">{similarity}%</div>
            </div>
          </div>
        </div>
        {deferredDebt > 0 && (
          <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-amber-900 font-semibold">
            הקטנתם את החזרי החובות ב-{formatBillions(deferredDebt)} ולכן חלק מהנטל יעבור לשנים הבאות.
          </div>
        )}
        <div className="grid grid-cols-1 gap-3">
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 space-y-2">
            <h3 className="font-bold text-emerald-800">יתרונות</h3>
            {(strengths.length > 0 ? strengths : ['התקציב שבחרתם לא יצר תוספות גדולות במיוחד ביחס לתקציב הייחוס.']).map((line) => (
              <div key={line} className="text-brand-dark-blue leading-relaxed">{line}</div>
            ))}
          </div>
          <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 space-y-2">
            <h3 className="font-bold text-rose-800">חסרונות</h3>
            {(drawbacks.length > 0 ? drawbacks : ['לא נרשמו קיצוצים חריגים במיוחד, ולכן גם החסרונות יחסית מתונים.']).map((line) => (
              <div key={line} className="text-brand-dark-blue leading-relaxed">{line}</div>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          {rows.map((row) => (
            <div key={row.id} className="rounded-2xl bg-white shadow p-4 flex items-center justify-between gap-3">
              <span className="font-bold text-brand-dark-blue text-lg">{row.shortTitle}</span>
              <div className="flex items-center gap-3">
                <span className="font-bold text-brand-dark-blue">{formatBillions(row.chosen)}</span>
                <span className={`text-sm font-bold px-2 py-1 rounded-full ${row.gap > 0 ? 'bg-emerald-100 text-emerald-700' : row.gap < 0 ? 'bg-rose-100 text-rose-700' : 'bg-gray-100 text-gray-500'}`}>
                  {row.gap > 0 ? '+' : ''}{row.gap !== 0 ? formatBillions(row.gap) : '✓'}
                </span>
              </div>
            </div>
          ))}
        </div>
        {otherCutSummary.length > 0 && (
          <div className="rounded-2xl bg-white shadow p-4 space-y-2">
            <h3 className="font-bold text-brand-dark-blue">קיצוצים מתוך "משרדים אחרים"</h3>
            {otherCutSummary.map((line) => (
              <div key={line} className="rounded-xl bg-indigo-50 border border-indigo-100 p-3 text-brand-dark-blue">
                {line}
              </div>
            ))}
          </div>
        )}
        <button onClick={() => setSubmitted(false)} className="w-full py-4 rounded-3xl bg-brand-teal text-white font-bold text-xl">
          נסו שוב
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 to-indigo-50 p-4 pt-24 space-y-4" dir="rtl">
      <div className="rounded-3xl bg-gradient-to-l from-brand-magenta to-indigo-600 text-white p-5 shadow-xl">
        <h1 className="text-3xl font-black mb-1">ישיבת ממשלה 🏛️</h1>
        <p className="text-lg text-white/90">חלקו את תקציב המדינה — {formatBillions(TOTAL_BUDGET)}</p>
      </div>

      {/* sticky bar */}
      <div className="fixed top-0 left-0 right-0 z-40 p-3">
        <div className={`mx-auto max-w-3xl rounded-2xl p-4 shadow-lg flex justify-between items-center gap-3 backdrop-blur transition-colors ${remaining === 0 ? 'bg-emerald-500 text-white' : remaining > 0 ? 'bg-amber-400 text-amber-900' : 'bg-rose-500 text-white'}`}>
          <span className="font-bold text-lg">יתרה לחלוקה</span>
          <span className="font-black text-2xl">{formatBillions(remaining)}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button onClick={loadEqual} className="py-3 rounded-2xl bg-cyan-100 text-cyan-800 font-bold text-sm">חלוקה שווה</button>
        <button onClick={reset} className="py-3 rounded-2xl bg-gray-200 text-brand-dark-blue font-bold text-sm">אפס הכול</button>
      </div>

      <div className="space-y-3">
        {budgetItems.map((item) => {
          const isOther = item.id === 'other';
          const isDebt = item.id === 'debt';
          return (
          <div key={item.id} className="rounded-3xl bg-white shadow-md p-4 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-bold text-brand-dark-blue text-xl leading-tight">{item.title}</h3>
              <span className={`text-xs px-2 py-1 rounded-full font-bold ${item.type === 'ministry' ? 'bg-cyan-100 text-cyan-700' : 'bg-indigo-100 text-indigo-700'}`}>
                {item.type === 'ministry' ? 'משרד' : 'סעיף רוחב'}
              </span>
            </div>
            <p className="text-sm text-brand-dark-blue/65 leading-relaxed">{item.purpose}</p>
            <div className="flex items-center gap-3">
              <button
                disabled={isOther}
                onClick={() => setAlloc(item.id, Math.max(0, Number(((allocations[item.id] || 0) - 0.5).toFixed(1))))}
                className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 font-black text-2xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >−</button>
              <input
                type="number"
                min={0}
                step={0.5}
                value={isOther ? (allocations[item.id] ?? otherReference) : (allocations[item.id] ?? '')}
                onChange={(e) => {
                  if (isOther) return;
                  const raw = e.target.value;
                  if (raw === '') {
                    clearAlloc(item.id);
                    return;
                  }
                  setAlloc(item.id, Number(raw));
                }}
                disabled={isOther}
                className={`flex-1 rounded-2xl border-2 px-4 py-3 text-xl font-bold text-center focus:outline-none focus:ring-2 ${isOther ? 'border-indigo-200 bg-indigo-50 text-indigo-800 cursor-not-allowed focus:ring-indigo-300' : 'border-gray-200 text-brand-dark-blue focus:ring-brand-teal'}`}
              />
              <button
                disabled={isOther}
                onClick={() => setAlloc(item.id, Number(((allocations[item.id] || 0) + 0.5).toFixed(1)))}
                className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 font-black text-2xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >+</button>
            </div>
            {isDebt && (
              <p className="text-sm text-amber-700">
                ניתן להקטין החזר חוב עד {formatBillions(debtMinimum)} בלבד.
              </p>
            )}
            {!isOther && (
              <div className="rounded-2xl border border-cyan-100 bg-cyan-50/70 p-3">
                <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
                  <label className="text-sm text-brand-dark-blue/70 shrink-0">שינוי %</label>
                  <div className="flex items-center gap-2 shrink-0">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      step={1}
                      value={itemAdjustPercents[item.id] ?? 0}
                      onChange={(e) => setItemAdjustPercent(item.id, Number(e.target.value))}
                      className="w-20 rounded-xl border border-gray-300 px-3 py-2 font-bold text-brand-dark-blue"
                    />
                    <span className="text-brand-dark-blue/70">%</span>
                  </div>
                  <button
                    onClick={() => applyItemPercentChange(item.id, 'cut')}
                    className="px-3 py-1.5 rounded-full bg-rose-100 text-rose-700 text-sm font-bold hover:bg-rose-200 shrink-0"
                  >
                    קצץ
                  </button>
                  <button
                    onClick={() => applyItemPercentChange(item.id, 'add')}
                    className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold hover:bg-emerald-200 shrink-0"
                  >
                    הגדל
                  </button>
                </div>
              </div>
            )}
            {isOther && (
              <div className="space-y-2">
                <button
                  onClick={() => setIsOtherModalOpen(true)}
                  className="w-full py-3 rounded-2xl bg-indigo-100 text-indigo-800 font-bold"
                >
                  בחרו אחוזי קיצוץ למשרדים האחרים
                </button>
                <p className="text-sm text-indigo-800/80">
                  סך הקיצוץ שנבחר: {formatBillions(selectedOtherCutAmount)}
                </p>
              </div>
            )}
          </div>
        );})}
      </div>

      <div className="flex gap-3 pb-8">
        <button
          onClick={() => remaining === 0 && setSubmitted(true)}
          disabled={remaining !== 0}
          className="w-full py-4 rounded-3xl bg-brand-magenta text-white font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {remaining === 0 ? 'בדקו את התקציב שלכם ✓' : `נותרו ${formatBillions(remaining)}`}
        </button>
      </div>

      {isOtherModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" dir="rtl">
          <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between gap-3">
              <h4 className="text-2xl font-bold text-brand-dark-blue">בחירת קיצוץ מתוך "משרדים אחרים"</h4>
              <button onClick={() => setIsOtherModalOpen(false)} className="px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200">סגור</button>
            </div>
            <p className="text-brand-dark-blue/80">הגדירו לכל משרד את אחוז הקיצוץ הרצוי (0%-100%).</p>
            <div className="space-y-2">
              {OTHER_OFFICE_OPTIONS.map((option) => (
                <div key={option.id} className="rounded-2xl border border-gray-200 p-3 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold text-brand-dark-blue">{option.title}</span>
                    <span className="font-bold text-brand-dark-blue/80">{formatBillions(option.amount)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-brand-dark-blue/70">אחוז קיצוץ</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      step={1}
                      value={otherCutPercents[option.id] ?? 0}
                      onChange={(e) => setOtherCutPercent(option.id, Number(e.target.value))}
                      className="w-24 rounded-xl border border-gray-300 px-3 py-2 font-bold text-brand-dark-blue"
                    />
                    <span className="text-brand-dark-blue/70">%</span>
                  </div>
                  <div className="text-sm text-indigo-800 font-semibold">
                    קיצוץ בפועל: {formatBillions(Number((option.amount * ((otherCutPercents[option.id] || 0) / 100)).toFixed(3)))}
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-2xl bg-indigo-50 border border-indigo-100 p-4 text-indigo-900 font-semibold">
              תקציב "משרדים אחרים" לאחר הקיצוץ: {formatBillions(allocations.other ?? otherReference)}
            </div>
            <div className="flex justify-end">
              <button onClick={() => setIsOtherModalOpen(false)} className="px-5 py-2 rounded-full bg-brand-teal text-white font-bold hover:bg-teal-500">סיום</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};