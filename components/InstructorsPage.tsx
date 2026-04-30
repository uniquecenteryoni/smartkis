import React, { useMemo, useState } from 'react';
import BudgetModule from './modules/BudgetModule';
import ExpensesModule from './modules/ExpensesModule';
import OverdraftModule from './modules/OverdraftModule';
import RightsModule from './modules/RightsModule';
import SalaryModule from './modules/SalaryModule';
import SalaryDeductionsModule from './modules/SalaryDeductionsModule';
import SelfEmployedModule from './modules/SelfEmployedModule';
import InterestModule from './modules/InterestModule';
import ResearchModule from './modules/ResearchModule';
import GovernmentBudgetModule from './modules/GovernmentBudgetModule';
import LinksModule from './modules/LinksModule';
import StoryOfMoneyModule from './modules/StoryOfMoneyModule';
import MoneyAndMeModule from './modules/MoneyAndMeModule';
import HowMuchCostModule from './modules/HowMuchCostModule';
import MonopoliesModule from './modules/MonopoliesModule';
import SmartConsumerismModule from './modules/SmartConsumerismModule';
import RelationshipsMoneyModule from './modules/RelationshipsMoneyModule';
import HowToEarnModule from './modules/HowToEarnModule';
import TimeManagementModule from './modules/TimeManagementModule';
import PublicSpeakingModule from './modules/PublicSpeakingModule';
import BuildBusinessModule from './modules/BuildBusinessModule';
import AliasGame from './modules/AliasGame';
import JeopardyModule from './modules/JeopardyModule';
import BullseyeGame from './modules/BullseyeGame';
import MillionDropGame from './modules/MillionDropGame';
import MyInvestmentPortfolioGame from './modules/MyInvestmentPortfolioGame';
import PayslipChallengeGame from './modules/PayslipChallengeGame';
import SupermarketRaceGame from './modules/SupermarketRaceGame';
import PicassoGame from './modules/PicassoGame';
import CarRaceGame from './modules/CarRaceGame';
import WorkerRightsParcelGame from './modules/WorkerRightsParcelGame';
import ParcelGame, { expensesItems, overdraftItems, paystubItems, employmentItems, savingsInvestItems, storyItems, personalItems, costsItems, monopolyItems, consumerItems, relationshipsItems, earnItems, timeItems, publicSpeakingItems, businessItems, mahBakisMixedItems, chachamBakisMixedItems, salaryDeductionItems } from './modules/ParcelGame';
import { HatsarStep } from './modules/HowMuchCostModule';
import { FutureManagersChallengeContent } from './modules/FutureManagersChallengeModule';
import { jeopardyChachamBanks } from './modules/jeopardyChachamBanks';
import { jeopardyHistoricalBanks } from './modules/jeopardyHistoricalBanks';
import SnowballGame from './modules/SnowballGame';
import { OverdraftSimulator } from './modules/OverdraftModule';
import CompoundInterestCalculator from './modules/CompoundInterestCalculator';
import InvestmentSimulator from './modules/InvestmentSimulator';
import { WordCloudHost } from './modules/WordCloudGame';
import InterviewerCardsModule from './modules/InterviewerCardsModule';
import WhereMoneyComesFromModule from './modules/kisonim/WhereMoneyComesFromModule';
import NeedsVsWantsModule from './modules/kisonim/NeedsVsWantsModule';
import SavingsAdventureModule from './modules/kisonim/SavingsAdventureModule';
import MagicStoreModule from './modules/kisonim/MagicStoreModule';
import JarBankModule from './modules/kisonim/JarBankModule';
import WorldTourModule from './modules/kisonim/WorldTourModule';
import AdSecretsModule from './modules/kisonim/AdSecretsModule';
import KisonimEarningMissions from './modules/kisonim/EarningMissionsModule';
import ColorfulMarketModule from './modules/kisonim/ColorfulMarketModule';
import ProgressiveTaxSimulator from './modules/ProgressiveTaxSimulator';
import CoinsVsBillsModule from './modules/kisonim/CoinsVsBillsModule';
import PowerOfGivingModule from './modules/kisonim/PowerOfGivingModule';
import SmallDecisionsModule from './modules/kisonim/SmallDecisionsModule';
import BudgetMeetingActivity from './modules/BudgetMeetingActivity';
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
  theme?: 'chacham' | 'mah' | 'kisonim' | 'custom' | 'tracking';
}

interface ProgramCardConfig {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  onSelect?: () => void;
  theme?: 'chacham' | 'mah' | 'kisonim' | 'custom' | 'tracking';
}

interface GlobalSearchResult {
  id: string;
  title: string;
  description: string;
  kind: 'program' | 'activity' | 'module' | 'video' | 'aid' | 'tool';
  program?: string;
  activity?: string;
  module?: string;
  subActivity?: string;
}

const actionCardThemes: Record<NonNullable<ActionCardProps['theme']>, {
  border: string;
  headerGradient: string;
  pill: string;
  iconBg: string;
  shadow: string;
  cta: string;
}> = {
  chacham: {
    border: 'border-cyan-300/80',
    headerGradient: 'from-cyan-500 to-teal-500',
    pill: 'bg-cyan-300/35 text-white/95',
    iconBg: 'from-cyan-300/80 to-teal-300/80',
    shadow: 'shadow-cyan-500/25',
    cta: 'text-cyan-700',
  },
  mah: {
    border: 'border-sky-300/80',
    headerGradient: 'from-sky-500 to-cyan-500',
    pill: 'bg-sky-300/35 text-white/95',
    iconBg: 'from-sky-300/80 to-cyan-300/80',
    shadow: 'shadow-sky-500/25',
    cta: 'text-sky-700',
  },
  kisonim: {
    border: 'border-fuchsia-300/80',
    headerGradient: 'from-fuchsia-500 to-pink-500',
    pill: 'bg-fuchsia-300/35 text-white/95',
    iconBg: 'from-fuchsia-300/80 to-pink-300/80',
    shadow: 'shadow-fuchsia-500/25',
    cta: 'text-fuchsia-700',
  },
  custom: {
    border: 'border-indigo-300/80',
    headerGradient: 'from-indigo-500 to-violet-500',
    pill: 'bg-indigo-300/35 text-white/95',
    iconBg: 'from-indigo-300/80 to-violet-300/80',
    shadow: 'shadow-indigo-500/25',
    cta: 'text-indigo-700',
  },
  tracking: {
    border: 'border-emerald-300/80',
    headerGradient: 'from-emerald-500 to-teal-500',
    pill: 'bg-emerald-300/35 text-white/95',
    iconBg: 'from-emerald-300/80 to-teal-300/80',
    shadow: 'shadow-emerald-500/25',
    cta: 'text-emerald-700',
  },
};

const ActionCard: React.FC<ActionCardProps> = ({ title, description, icon: Icon, onSelect, theme = 'chacham' }) => {
  const style = actionCardThemes[theme];
  const disabled = !onSelect;

  return (
    <button
      onClick={onSelect}
      disabled={disabled}
      className={`
        card-surface rounded-3xl border-2 overflow-hidden flex flex-col h-full text-right
        transition-all duration-300 ${style.border}
        ${disabled ? 'opacity-80 cursor-default' : `cursor-pointer hover:-translate-y-1.5 hover:shadow-2xl ${style.shadow}`}
      `}
    >
      <div className={`h-4 w-full bg-gradient-to-r ${style.headerGradient}`} />

      <div className="p-6 flex flex-col flex-1 items-center justify-between gap-4">
        <div className={`mx-auto mb-1 w-20 h-20 rounded-full bg-gradient-to-br ${style.iconBg} shadow-lg flex items-center justify-center border border-white/70`}>
          <Icon className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-4xl sm:text-5xl font-bold font-display text-brand-dark-blue text-center">{title}</h3>
        <p className={`mt-1 text-lg sm:text-xl font-semibold text-center rounded-full px-4 py-2 ${style.pill}`}>
          מרחב מדריכים
        </p>
        <p className="text-xl sm:text-2xl text-brand-dark-blue/80 text-center leading-relaxed">{description}</p>
        <span className={`text-lg sm:text-xl font-bold ${style.cta}`}>
          {disabled ? 'בקרוב' : 'כניסה לתוכנית'}
        </span>
      </div>
    </button>
  );
};

const PROGRAM_MODULES = ['סרטונים', 'פעילויות ומשחקים', 'עזרים ונספחים', 'מצגת', 'מערך שיעור'];
const PROGRAM_ACTIVITY_MODULES: Record<string, string[]> = {
  "'חכם בכיס'": [
    'ניהול התקציב הראשון שלי',
    'איך מנהלים הוצאות?',
    'הסכנה שבמינוס',
    'זכויות עובדים',
    'פענוח תלוש שכר',
    'ניכויי שכר',
    'שכירים ועצמאיים',
    'חיסכון והשקעות',
    'משימת למידת חקר',
    'תקציב המדינה',
    'רב תחומי',
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
  'תקציב המדינה',
];

const KISONIM_MODULE_INFO: Record<string, { icon: string; desc: string }> = {
  'מאיפה בא הכסף?':   { icon: '👷', desc: 'חקר מקורות הכנסה ועבודה ראשונה.' },
  'צרכים ורצונות':    { icon: '⚖️', desc: 'הבחנה בין צרכים לרצונות ותיעדוף נכון.' },
  'הרפתקת חיסכון':   { icon: '🐷', desc: 'עידוד חיסכון והתמדה במטרות.' },
  'חנות הקסמים':     { icon: '🏪', desc: 'התנסות בקנייה ומכירה בסביבה משחקית.' },
  'בנק הקופות':      { icon: '🏦', desc: 'ניהול חסכונות בקופות וריביות.' },
  'סיור עולמי':      { icon: '🌍', desc: 'חשיפה למטבעות וערכים בעולם.' },
  'סודות הפרסום':    { icon: '📢', desc: 'זיהוי טקטיקות פרסום.' },
  'משימות הרווחה':   { icon: '💪', desc: 'דרכים פשוטות להגדלת הכנסה.' },
  'שוק צבעוני':      { icon: '🎨', desc: 'חוויה של שוק ומחירים משתנים.' },
  'מטבעות ושטרות':   { icon: '🪙', desc: 'היכרות עם כסף מזומן.' },
  'כוח הנתינה':     { icon: '🎁', desc: 'השפעת תרומה ונתינה כלכלית.' },
  'החלטות קטנות':    { icon: '🧠', desc: 'השפעת החלטות יומיומיות על חיסכון.' },
};

const MODULE_SUMMARIES: Record<string, string> = {
  'ניהול התקציב הראשון שלי': 'בניית תקציב מאוזן והפקת דו"ח מסכם.',
  'איך מנהלים הוצאות?': 'סיווג הוצאות ומודל חצ"ר לחסכון חכם.',
  'הסכנה שבמינוס': 'הבנת ריבית מינוס וסיכוני חריגה בחשבון.',
  'זכויות עובדים': 'היכרות עם זכויות בסיסיות ובירור מקרים אמיתיים.',
  'פענוח תלוש שכר': 'קריאה והבנה של רכיבי תלוש השכר.',
  'ניכויי שכר': 'הבנת מס הכנסה, ביטוח לאומי, דמי בריאות ופנסיה באמצעות סימולטורים מעודכנים.',
  'שכירים ועצמאיים': 'הבדלים בין שכיר לעצמאי וניהול תרחישים עסקיים.',
  'חיסכון והשקעות': 'היכרות עם ריבית דריבית וכלים לחיסכון והשקעה.',
  'משימת למידת חקר': 'תרגול חקר אינפלציה והשפעתה על יוקר המחיה.',
  'תקציב המדינה': 'היכרות עם תקציב המדינה, משרדי הממשלה וישיבת ממשלה לחלוקת התקציב.',
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
  'ג׳פרדי היסטורי': 'משחק ג׳פרדי היסטורי: מלחמת העולם הראשונה בארבע מעצמות מרכזיות.',
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

interface VideoItem {
  title: string;
  url: string;
  youtubeId?: string;
  thumbnailUrl?: string;
  description?: string;
}

const VIDEO_LIBRARY: Record<string, Array<VideoItem>> = {
  'ניהול התקציב הראשון שלי': [
    {
      title: 'ניהול התקציב הראשון שלי',
      url: 'https://www.youtube.com/watch?v=IFut3x9eENA',
      youtubeId: 'IFut3x9eENA',
      description: 'סרטון הדרכה לתרגול בניית תקציב ראשון וקבלת החלטות פיננסיות.',
    },
  ],
  'הסכנה שבמינוס': [
    {
      title: '"הארנק שלי ריק כל הזמן": שתי משכורות, שלושה ילדים - ומינוס ענק בבנק',
      url: 'https://www.youtube.com/watch?v=JUl-f1CjD34',
      youtubeId: 'JUl-f1CjD34',
    },
    {
      title: 'ההלוואה הגרועה ביותר: מה זה מינוס וכמה הוא עולה לנו?',
      url: 'https://www.youtube.com/watch?v=NNQSFU08pNk&t=1s',
      youtubeId: 'NNQSFU08pNk',
    },
    {
      title: 'מצמצמים דמי כיס לילדים ומכינים אוכל בבית - וסוגרים בקושי את החודש | "מחזיקים מעמד": עצמאים',
      url: 'https://www.youtube.com/watch?v=V_N9saBwbnE',
      youtubeId: 'V_N9saBwbnE',
    },
    {
      title: 'עשירון 9 צריך לוותר על צהרון לילדים ועל פירות בסופר? "מחזיקים מעמד" - השכירים',
      url: 'https://www.youtube.com/watch?v=LhLAwZ14ehU',
      youtubeId: 'LhLAwZ14ehU',
    },
  ],
  'איך מנהלים הוצאות?': [
    {
      title: 'נכנסים לכיס: משפחת בן ארוש לא מתביישת לחשוף כמה היא מוציאה בכל חודש',
      url: 'https://www.youtube.com/watch?v=rYYeEc8-kNg',
      youtubeId: 'rYYeEc8-kNg',
    },
    {
      title: 'כך תתחילו לנהל תקציב ולחסוך כסף בקלות | כאן חסכנים',
      url: 'https://www.youtube.com/watch?v=JHNIVwpfAVw&t=106s',
      youtubeId: 'JHNIVwpfAVw',
    },
  ],
  'שכירים ועצמאיים': [
    {
      title: 'עשירון 9 צריך לוותר על צהרון לילדים ועל פירות בסופר? "מחזיקים מעמד" - השכירים',
      url: 'https://www.youtube.com/watch?v=LhLAwZ14ehU&t=361s',
      youtubeId: 'LhLAwZ14ehU',
    },
    {
      title: 'מצמצמים דמי כיס לילדים ומכינים אוכל בבית - וסוגרים בקושי את החודש | "מחזיקים מעמד": עצמאים',
      url: 'https://www.youtube.com/watch?v=V_N9saBwbnE&t=13s',
      youtubeId: 'V_N9saBwbnE',
    },
    {
      title: 'למה כוס קפה עולה 17 שקל? האמת מאחורי בתי הקפה | עם הספל - פרק 4',
      url: 'https://www.youtube.com/watch?v=QHYFmoRFPeY',
      youtubeId: 'QHYFmoRFPeY',
    },
    {
      title: 'למה עצמאים משלמים יותר לביטוח לאומי, ורק השכירים נהנים מדמי אבטלה?',
      url: 'https://www.youtube.com/watch?v=w5Dr4IQTvbc',
      youtubeId: 'w5Dr4IQTvbc',
    },
    {
      title: 'כאן מכירים | להיות עצמאי בישראל',
      url: 'https://www.youtube.com/watch?v=1rNtu9VHPgk',
      youtubeId: '1rNtu9VHPgk',
    },
    {
      title: 'חיות כיס | האם טענות העצמאים נכונות? 📝',
      url: 'https://www.youtube.com/watch?v=BatkzC9f0C0',
      youtubeId: 'BatkzC9f0C0',
    },
  ],
  'חיסכון והשקעות': [
    {
      title: 'איך אפשר לחסוך את הכסף שלנו?',
      url: 'https://www.youtube.com/watch?v=Wk5fp9g1PC8',
      youtubeId: 'Wk5fp9g1PC8',
    },
    {
      title: 'איך עובד המסחר בבורסה? | אליה מסביר דברים בעזרת צעצועים 🤖',
      url: 'https://www.youtube.com/watch?v=TG7HL5PsMGw',
      youtubeId: 'TG7HL5PsMGw',
    },
    {
      title: 'הסיפור האמיתי מאחורי נעלי הטיקטוק שגילו את שוק ההון',
      url: 'https://www.youtube.com/watch?v=ClBdg74maDQ',
      youtubeId: 'ClBdg74maDQ',
    },
    {
      title: 'איך חוסכים מאות שקלים - בשיחה אחת עם הבנק?',
      url: 'https://www.youtube.com/watch?v=lKGeafj-nRg',
      youtubeId: 'lKGeafj-nRg',
    },
    {
      title: 'המדריך למשקיע הצעיר: איך חוסכים לילדים? | תיק לכל ילד - פרק 1',
      url: 'https://www.youtube.com/watch?v=AJVVZpt0xfg',
      youtubeId: 'AJVVZpt0xfg',
    },
    {
      title: 'המדריך המלא לבני הנוער: איך להשקיע בלי ליפול בפח? | תיק לכל ילד - פרק 2',
      url: 'https://www.youtube.com/watch?v=68I9OA9Ml-A&t=441s',
      youtubeId: '68I9OA9Ml-A',
    },
    {
      title: 'השקעות בבורסה - או הימורים? השיטה של אפליקציות המסחר לסחוף את הצעירים',
      url: 'https://www.youtube.com/watch?v=MQqK1zQurnM',
      youtubeId: 'MQqK1zQurnM',
    },
    {
      title: 'מה זה שוק ההון ואיך הכסף שלנו מגיע לשם?',
      url: 'https://www.youtube.com/watch?v=j_QFXaRRkyY',
      youtubeId: 'j_QFXaRRkyY',
    },
    {
      title: 'מה צריך לדעת לפני שמשקיעים בשוק ההון?',
      url: 'https://www.youtube.com/watch?v=k7nZsI-bPH4',
      youtubeId: 'k7nZsI-bPH4',
    },
  ],
  'רב תחומי': [
    {
      title: 'חוזרים להורים, משקיעים במניות או קונים דירה: איך דור ה-Z שורד כלכלית?',
      url: 'https://www.youtube.com/watch?v=NiGD4rl-nPk&t=7s',
      youtubeId: 'NiGD4rl-nPk',
    },
    {
      title: '12 שעות עבודה ביום - שישים ימים בשבוע: מודל העבודה הקיצוני הגיע לארה"ב',
      url: 'https://www.youtube.com/watch?v=SU1S0UWMMvA',
      youtubeId: 'SU1S0UWMMvA',
    },
    {
      title: 'עבודה - על מה ולמה? הבנקים עושין עלינו קופה - הישראלים לא מתמקחים | דופקים קופה',
      url: 'https://www.youtube.com/watch?v=ddV5PPivFjE',
      youtubeId: 'ddV5PPivFjE',
    },
    {
      title: 'הבנקים גלגלו מיליארדים - ואיפה בנק ישראל והמפקח על הבנקים? | דופקים קופה',
      url: 'https://www.youtube.com/watch?v=9s4F-_BjB8w',
      youtubeId: '9s4F-_BjB8w',
    },
    {
      title: 'עוד יותר יקר: הגזירות הכלכליות ייכנסו ב-2026 - איך אפשר לחסוך בכל זאת?',
      url: 'https://www.youtube.com/watch?v=f3V5mTpf6DU&t=10s',
      youtubeId: 'f3V5mTpf6DU',
    },
    {
      title: '"מדינה לעשירים": הזוגות הצעירים שמתרחקים מחלום הדירה',
      url: 'https://www.youtube.com/watch?v=PoGnoldAxgg',
      youtubeId: 'PoGnoldAxgg',
    },
  ],
  'זכויות עובדים': [
    {
      title: 'מתחילים לעבוד בקיץ? כל הזכויות לבני הנוער במקום העבודה',
      url: 'https://www.youtube.com/watch?v=D4llD6rwvJU',
      youtubeId: 'D4llD6rwvJU',
    },
    {
      title: 'חופש גדול? עלייה בכנסת תלמידים אל שוק העבודה בחודשי הקיץ',
      url: 'https://www.youtube.com/watch?v=bX4gg63EuMo',
      youtubeId: 'bX4gg63EuMo',
    },
    {
      title: 'טיפים לבני נוער עובדים',
      url: 'https://www.youtube.com/shorts/4J6gqWtLxsI',
      youtubeId: '4J6gqWtLxsI',
    },
  ],
  'פענוח תלוש שכר': [
    {
      title: 'גישה קלה לכלכלה: איך קוראים תלוש משכורת?',
      url: 'https://www.youtube.com/watch?v=AlPSMOjh4BU',
      youtubeId: 'AlPSMOjh4BU',
    },
    {
      title: 'איך לקרוא את תלוש השכר?',
      url: 'https://www.youtube.com/watch?v=G6M90wUXARk',
      youtubeId: 'G6M90wUXARk',
    },
    {
      title: 'מדריך תלוש שכר - חלק 1',
      url: 'https://www.youtube.com/watch?v=Ru55W8nE0r0',
      youtubeId: 'Ru55W8nE0r0',
    },
    {
      title: 'מדריך תלוש שכר - חלק 2',
      url: 'https://www.youtube.com/watch?v=Adcmd6cBCR0',
      youtubeId: 'Adcmd6cBCR0',
    },
    {
      title: 'מדריך תלוש שכר - חלק 3',
      url: 'https://www.youtube.com/watch?v=Uk_Q5cKScrA',
      youtubeId: 'Uk_Q5cKScrA',
    },
    {
      title: 'מדריך תלוש שכר - חלק 4 ואחרון',
      url: 'https://www.youtube.com/watch?v=7M1L462QTnU',
      youtubeId: '7M1L462QTnU',
    },
  ],
  'ניכויי שכר': [
    {
      title: 'ביטוח לאומי ודמי בריאות',
      url: 'https://www.youtube.com/watch?v=QcPnUSlNffs',
      youtubeId: 'QcPnUSlNffs',
      description: 'הסבר על ביטוח לאומי ודמי בריאות: שיעורי הניכוי, היתרונות, ודרך החישוב.',
    },
    {
      title: 'מס הכנסה',
      url: 'https://www.youtube.com/watch?v=s2KRKDfVxMQ',
      youtubeId: 's2KRKDfVxMQ',
      description: 'סרטון הסברה על מסי הכנסה: מדרגות מס, שיעורים, וחישוב המס השנתי.',
    },
    {
      title: 'החזרי מס',
      url: 'https://www.youtube.com/watch?v=GchuesQVXig',
      youtubeId: 'GchuesQVXig',
      description: 'איך להגיש בקשה להחזר מס והסרטון על זיכוי לעובדים בעלי מס עודף.',
    },
    {
      title: 'פנסיה',
      url: 'https://www.youtube.com/watch?v=9g3CmmzXQlM',
      youtubeId: '9g3CmmzXQlM',
      description: 'סרטון על פנסיה בישראל: קרן הפנסיה, שיעורי הניכוי, ההצטברות, וההנאה בפרישה.',
    },
  ],
  'צרכנות נבונה': [
    {
      title: 'צרכנות נבונה 1',
      url: 'https://www.youtube.com/watch?v=U_rYXTwn4rc&t=20s',
      youtubeId: 'U_rYXTwn4rc',
      description: 'סרטון פתיחה על חשיבה צרכנית ובחירות קנייה חכמות.',
    },
    {
      title: 'צרכנות נבונה 2',
      url: 'https://www.youtube.com/watch?v=X285zJJjRyc',
      youtubeId: 'X285zJJjRyc',
      description: 'סרטון המשך על שיקולים צרכניים ומודעות לקנייה נבונה.',
    },
  ],
};

function extractYouTubeId(url?: string) {
  if (!url) return null;
  const watch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watch?.[1]) return watch[1];
  const short = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (short?.[1]) return short[1];
  const embed = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embed?.[1]) return embed[1];
  return null;
}

function extractDriveFileId(url?: string) {
  if (!url) return null;
  const filePath = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (filePath?.[1]) return filePath[1];
  const openParam = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (openParam?.[1]) return openParam[1];
  return null;
}

function getDriveThumbnail(fileId?: string | null) {
  if (!fileId) return null;
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
}

function getVideoThumbnail(video: VideoItem) {
  if (video.thumbnailUrl) return video.thumbnailUrl;
  const youtubeId = video.youtubeId || extractYouTubeId(video.url);
  if (youtubeId) return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
  const driveId = extractDriveFileId(video.url);
  if (driveId) return getDriveThumbnail(driveId);
  return null;
}

interface Aid {
  title: string;
  url: string;
  fileId?: string;
  fileIcon?: string;
  description?: string;
  thumbnailUrl?: string;
}

type StudentModuleComponent = React.ComponentType<unknown> | null;

function getStudentModuleComponent(activityName: string): StudentModuleComponent {
  const map: Record<string, StudentModuleComponent> = {
    'ניהול התקציב הראשון שלי': BudgetModule,
    'איך מנהלים הוצאות?': ExpensesModule,
    'הסכנה שבמינוס': OverdraftModule,
    'זכויות עובדים': RightsModule,
    'פענוח תלוש שכר': SalaryModule,
    'ניכויי שכר': SalaryDeductionsModule,
    'שכירים ועצמאיים': SelfEmployedModule,
    'חיסכון והשקעות': InterestModule,
    'משימת למידת חקר': ResearchModule,
    'תקציב המדינה': GovernmentBudgetModule,
    'מסמכים וקישורים שימושיים': LinksModule,
    'סיפורו של כסף': StoryOfMoneyModule,
    'הכסף ואני': MoneyAndMeModule,
    'כמה זה עולה לי?': HowMuchCostModule,
    'מונופולים בישראל': MonopoliesModule,
    'צרכנות נבונה': SmartConsumerismModule,
    'מערכות יחסים וכסף': RelationshipsMoneyModule,
    'איך להרוויח כסף?': HowToEarnModule,
    'ניהול זמן (זמן=כסף)': TimeManagementModule,
    'עמידה מול קהל': PublicSpeakingModule,
    'איך בונים עסק?': BuildBusinessModule,
    'מאיפה בא הכסף?': WhereMoneyComesFromModule,
    'צרכים ורצונות': NeedsVsWantsModule,
    'הרפתקת חיסכון': SavingsAdventureModule,
    'חנות הקסמים': MagicStoreModule,
    'בנק הקופות': JarBankModule,
    'סיור עולמי': WorldTourModule,
    'סודות הפרסום': AdSecretsModule,
    'משימות הרווחה': KisonimEarningMissions,
    'שוק צבעוני': ColorfulMarketModule,
    'מטבעות ושטרות': CoinsVsBillsModule,
    'כוח הנתינה': PowerOfGivingModule,
    'החלטות קטנות': SmallDecisionsModule,
  };
  return map[activityName] || null;
}

const AIDS_LIBRARY: Record<string, Array<Aid>> = {
  'ניהול התקציב הראשון שלי': [
    {
      title: 'תלוש שכר לדוגמא',
      url: 'https://drive.google.com/file/d/1CSZIJ6X52bBW2WZGrigtpWusrBCYh4uu/view?usp=sharing',
      fileId: '1CSZIJ6X52bBW2WZGrigtpWusrBCYh4uu',
      fileIcon: '📋',
      description: 'דוגמא של תלוש שכר לאנליזה',
    },
    {
      title: 'חוזה שכירות - דוגמא',
      url: 'https://drive.google.com/file/d/1gkPH2bOvaGt6LgXdzsvW9g2gNUajcUsI/view?usp=drive_link',
      fileId: '1gkPH2bOvaGt6LgXdzsvW9g2gNUajcUsI',
      fileIcon: '📄',
      description: 'חוזה שכירות לדוגמא לסטודנטים',
    },
    {
      title: 'כרטיסי דמויות',
      url: 'https://drive.google.com/file/d/1wa1wxnD2uTTNhbB9sTwGdjOPOLDGXOhU/view?usp=drive_link',
      fileId: '1wa1wxnD2uTTNhbB9sTwGdjOPOLDGXOhU',
      fileIcon: '🎭',
      description: 'דמויות לתרגול בניית תקציב',
    },
    {
      title: 'דף עזר הוצאות ביגוד',
      url: 'https://drive.google.com/file/d/1WUW1eLQ7LXbJ1N0c63Utr097_yGnt9pH/view?usp=sharing',
      fileId: '1WUW1eLQ7LXbJ1N0c63Utr097_yGnt9pH',
      fileIcon: '👕',
      description: 'דף עזר לניתוח הוצאות ביגוד',
    },
    {
      title: 'כרטיסיות לחישוב בילויים',
      url: 'https://drive.google.com/file/d/1iSk_rwqqudU-aTDWqHRGViHJyRsz5R-8/view?usp=sharing',
      fileId: '1iSk_rwqqudU-aTDWqHRGViHJyRsz5R-8',
      fileIcon: '🎮',
      description: 'כרטיסיות לתרגול חישוב בילויים',
    },
    {
      title: 'דף עזר לרשימת קניות',
      url: 'https://drive.google.com/file/d/1n_0Dda08Q6lu3tcfK3FLjexhilK9iwDQ/view?usp=drive_link',
      fileId: '1n_0Dda08Q6lu3tcfK3FLjexhilK9iwDQ',
      fileIcon: '🛒',
      description: 'תבנית לרשימת קניות מתוכננת',
    },
    {
      title: 'דף ניהול הוצאות',
      url: 'https://drive.google.com/file/d/1ux0z8ugD6DTPHQu54EZAbF4XNufwEeBv/view?usp=sharing',
      fileId: '1ux0z8ugD6DTPHQu54EZAbF4XNufwEeBv',
      fileIcon: '📊',
      description: 'דף עזר לניהול וניתוח הוצאות יומיומיות',
    },
    {
      title: 'כרטיסיות ניתוח תקציב',
      url: 'https://drive.google.com/file/d/1jWNJvdFLnaDIBAfnrBDdmB2lcEPXtiYm/view?usp=sharing',
      fileId: '1jWNJvdFLnaDIBAfnrBDdmB2lcEPXtiYm',
      fileIcon: '💳',
      description: 'כרטיסיות לתרגול ניתוח תקציבי',
    },
    {
      title: 'תלוש שכר 2 לדוגמא',
      url: 'https://drive.google.com/file/d/1a-8bYdhvIH-0XJMNxx-lwwUXs3qSQui3/view?usp=sharing',
      fileId: '1a-8bYdhvIH-0XJMNxx-lwwUXs3qSQui3',
      fileIcon: '📋',
      description: 'דוגמא נוספת של תלוש שכר',
    },
    {
      title: 'דף עזר ניתוח תדפיס עו"ש',
      url: 'https://drive.google.com/file/d/1JoCxv0FC4kIOzwPRF9Px0rVeD1t4B1nH/view?usp=sharing',
      fileId: '1JoCxv0FC4kIOzwPRF9Px0rVeD1t4B1nH',
      fileIcon: '💰',
      description: 'הנחיות לניתוח עמוד חשבון בנק',
    },
  ],
  'איך מנהלים הוצאות?': [
    {
      title: 'מודל החצ"ר - סימולטור',
      url: '#hatsar-simulator',
      fileIcon: '🧮',
      description: 'סימולטור סדרי עדיפויות חייב/צריך/רוצה מתוך פרק 5 של "כמה זה עולה לי?".',
    },
  ],
  'הסכנה שבמינוס': [
    {
      title: 'סימולטור מינוס',
      url: '#overdraft-simulator',
      fileIcon: '📉',
      description: 'אפקט כדור השלג: סימולטור מינוס מתוך הפרק השני של "הסכנה שבמינוס" במרחב התלמידים.',
    },
  ],
  'חיסכון והשקעות': [
    {
      title: 'מחשבון ריבית דה-ריבית',
      url: '#compound-interest',
      fileIcon: '📈',
      description: 'מחשבון לריבית דריבית עם הפקדה חודשית ומחזורים במהלך השנה.',
    },
    {
      title: 'סימולטור השקעות',
      url: '#investment-simulator',
      fileIcon: '💹',
      description: 'הדמיית תיק השקעות עם הפקדות חודשיות ותשואה שנתית צפויה.',
    },
  ],
  'שכירים ועצמאיים': [
    {
      title: 'שכירים ועצמאיים — עזר הדרכה',
      url: 'https://drive.google.com/file/d/1hzyUYsaFc-2NfrXyL9ZyPZjWWQli9DWi/view?usp=sharing',
      fileId: '1hzyUYsaFc-2NfrXyL9ZyPZjWWQli9DWi',
      thumbnailUrl: 'https://drive.google.com/uc?export=view&id=1hzyUYsaFc-2NfrXyL9ZyPZjWWQli9DWi',
      fileIcon: '📄',
      description: 'קובץ עזר למדריכים בנושא ההבדלים בין שכירים לעצמאים.',
    },
  ],
  'פענוח תלוש שכר': [
    {
      title: 'תלוש שכר ריק לתרגול',
      url: 'https://drive.google.com/file/d/1InUsxYhtzsokJ6-wearY0zSwjofyBDRJ/view?usp=sharing',
      fileId: '1InUsxYhtzsokJ6-wearY0zSwjofyBDRJ',
      fileIcon: '📝',
      description: 'תלוש שכר טמפלט לתרגול',
    },
    {
      title: 'תרגיל תלוש שכר הפוך',
      url: 'https://drive.google.com/file/d/1wkOdqEnkmkNz742UciFsY0m9a-4NQOXN/view?usp=sharing',
      fileId: '1wkOdqEnkmkNz742UciFsY0m9a-4NQOXN',
      fileIcon: '🔍',
      description: 'תרגיל הפוך למציאת קודמים בתלוש',
    },
  ],
  'סיפורו של כסף': [
    {
      title: 'כרטיסיות סחר חליפין להדפסה',
      url: 'https://drive.google.com/file/d/1I5EobedfSGPorzxPTcdu9crFy06462U4/view?usp=sharing',
      fileId: '1I5EobedfSGPorzxPTcdu9crFy06462U4',
      thumbnailUrl: 'https://drive.google.com/uc?export=view&id=1I5EobedfSGPorzxPTcdu9crFy06462U4',
      fileIcon: '🧾',
      description: 'גיזרו את הכרטיסיות , חלקו לקבוצות, הנחו אותם לגזור את הפריטים ולנסות לסחור בהם עם קבוצות אחרות בכדי להשיג את מה שהם צריכים',
    },
  ],
  'זכויות עובדים': [
    {
      title: 'טופס 101',
      url: 'https://drive.google.com/file/d/1s0lSUi2Og8TxWbAKsFE0iJ8C_rz1Hamn/view?usp=sharing',
      fileId: '1s0lSUi2Og8TxWbAKsFE0iJ8C_rz1Hamn',
      fileIcon: '📋',
      description: 'טופס 101 - בקשה להשבת שכר',
    },
    {
      title: 'דף מעקב שעות עבודה',
      url: 'https://drive.google.com/file/d/1M8weOLwKROpStPdiYrNZ1pSS5-2YVPzK/view?usp=sharing',
      fileId: '1M8weOLwKROpStPdiYrNZ1pSS5-2YVPzK',
      fileIcon: '⏱️',
      description: 'דף מעקב לשעות עבודה חודשיות',
    },
  ],
  'צרכנות נבונה': [
    {
      title: 'שאלות לבינגו',
      url: 'https://drive.google.com/file/d/1JCbVU8SxjWssMgqgAx9E-SGIe5c8dqKr/view?usp=sharing',
      fileId: '1JCbVU8SxjWssMgqgAx9E-SGIe5c8dqKr',
      fileIcon: '🧩',
      description: 'שאלות ותשובות לבינגו נמצאים בתיקיית הנספחים ועזרים.',
    },
  ],
};

const SMART_CONSUMERISM_BINGO_BOARDS = [
  { title: 'לוח בינגו 1', url: 'https://drive.google.com/file/d/1wIHTHM7f1G45kO9RzDZfc69IXhRJIqNI/view?usp=sharing', fileId: '1wIHTHM7f1G45kO9RzDZfc69IXhRJIqNI' },
  { title: 'לוח בינגו 2', url: 'https://drive.google.com/file/d/1wK4nU3Gb_-HgDtIsJft-RGk_akzVJj7u/view?usp=sharing', fileId: '1wK4nU3Gb_-HgDtIsJft-RGk_akzVJj7u' },
  { title: 'לוח בינגו 3', url: 'https://drive.google.com/file/d/1T4u-FZyNjbLrrIzHHm8p2xFOJXlSG7XN/view?usp=sharing', fileId: '1T4u-FZyNjbLrrIzHHm8p2xFOJXlSG7XN' },
  { title: 'לוח בינגו 4', url: 'https://drive.google.com/file/d/15_Urn8Cbw-GA8kxTVQxP2FKScqTWRorn/view?usp=sharing', fileId: '15_Urn8Cbw-GA8kxTVQxP2FKScqTWRorn' },
  { title: 'לוח בינגו 5', url: 'https://drive.google.com/file/d/1OrH1LdHP8D-lS9R2lgf-BSLgzfV-yzJ0/view?usp=sharing', fileId: '1OrH1LdHP8D-lS9R2lgf-BSLgzfV-yzJ0' },
  { title: 'לוח בינגו 6', url: 'https://drive.google.com/file/d/1x4S0x8S3IrGe6Yr_q7duBiwUYZDtQhWs/view?usp=sharing', fileId: '1x4S0x8S3IrGe6Yr_q7duBiwUYZDtQhWs' },
];

function getAidThumbnail(aid: Aid) {
  if (aid.thumbnailUrl) return aid.thumbnailUrl;
  const driveId = aid.fileId || extractDriveFileId(aid.url);
  return getDriveThumbnail(driveId);
}

function renderStudentContentCard(activityName: string, onOpen: (activity: string) => void) {
  const hasModule = !!getStudentModuleComponent(activityName);
  if (!activityName || !hasModule) return null;
  return (
    <button
      key={`student-${activityName}`}
      onClick={() => onOpen(activityName)}
      className="rounded-3xl border-2 border-dashed border-brand-teal/50 bg-white/95 text-right shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[12rem] flex flex-col"
    >
      <div className="relative h-40 bg-gradient-to-br from-teal-100 to-emerald-100 border-b-2 border-gray-200 overflow-hidden flex items-center justify-center text-5xl">
        📚
      </div>
      <div className="p-5 flex-1 flex flex-col items-start justify-center text-right w-full">
        <p className="text-xl font-bold text-brand-dark-blue">תוכן המודול · מרחב התלמידים</p>
        <p className="text-brand-dark-blue/70 mt-2 text-sm">פתחו את מודול התלמיד כדי להציג ולתרגל יחד עם הכיתה.</p>
        <span className="mt-3 inline-flex items-center gap-2 text-brand-teal font-bold text-sm">פתחו את המודול</span>
      </div>
    </button>
  );
}

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
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');
  const [isCustomPlanBuilder, setIsCustomPlanBuilder] = useState(false);
  const [customPlanSelections, setCustomPlanSelections] = useState<Set<string>>(new Set());
  const [customPlanName, setCustomPlanName] = useState('');
  const [savedCustomPlans, setSavedCustomPlans] = useState<Array<{ name: string; modules: Array<{ program: string; activity: string }> }>>([]);
  const [activeCustomPlan, setActiveCustomPlan] = useState<string | null>(null);
  const [activeStudentContent, setActiveStudentContent] = useState<string | null>(null);
  const [cameFromCustomPlan, setCameFromCustomPlan] = useState(false);

  const rootCards: ProgramCardConfig[] = [
    {
      title: "תוכנית 'חכם בכיס'",
      description: 'גישה למערכי שיעור, עזרים וסרטונים',
      icon: SalaryIcon,
      theme: 'chacham',
      onSelect: () => { setActiveProgram("'חכם בכיס'"); setActiveModule(null); setActiveActivity(null); setActiveSubActivity(null); setCameFromCustomPlan(false); },
    },
    {
      title: "תוכנית 'מה בכיס'",
      description: 'גישה למערכי שיעור, עזרים וסרטונים',
      icon: BusinessIcon,
      theme: 'mah',
      onSelect: () => { setActiveProgram("'מה בכיס'"); setActiveModule(null); setActiveActivity(null); setActiveSubActivity(null); setCameFromCustomPlan(false); },
    },
    {
      title: "תוכנית 'כיסונים פיננסים'",
      description: 'גישה למערכי שיעור, עזרים וסרטונים',
      icon: PiggyBankIcon,
      theme: 'kisonim',
      onSelect: () => { setActiveProgram("'כיסונים פיננסים'"); setActiveModule(null); setActiveActivity(null); setActiveSubActivity(null); setCameFromCustomPlan(false); },
    },
    {
      title: 'הרכבת תוכנית מותאמת',
      description: 'בנו שילוב מודולים מכל התוכניות ושמרו בשם מותאם',
      icon: BusinessIcon,
      theme: 'custom',
      onSelect: () => {
        setIsCustomPlanBuilder(true);
        setActiveProgram(null);
        setActiveModule(null);
        setActiveActivity(null);
        setActiveSubActivity(null);
        setCameFromCustomPlan(false);
      },
    },
    {
      title: 'מעקב אחר קבוצות למידה',
      description: 'ניהול התקדמות התלמידים וצפייה בתוצרים',
      icon: PodiumIcon,
      theme: 'tracking',
    },
  ];

  const findProgramsForActivity = (activityName: string) =>
    Object.entries(PROGRAM_ACTIVITY_MODULES)
      .filter(([, activities]) => activities.includes(activityName))
      .map(([program]) => program);

  const globalSearchIndex = useMemo<GlobalSearchResult[]>(() => {
    const results: GlobalSearchResult[] = [];

    Object.keys(PROGRAM_ACTIVITY_MODULES).forEach((program) => {
      results.push({
        id: `program-${program}`,
        title: `תוכנית ${program}`,
        description: 'תוכנית לימוד במרחב המדריכים',
        kind: 'program',
        program,
      });
    });

    Object.entries(PROGRAM_ACTIVITY_MODULES).forEach(([program, activities]) => {
      activities.forEach((activity) => {
        results.push({
          id: `activity-${program}-${activity}`,
          title: activity,
          description: getSummary(activity),
          kind: 'activity',
          program,
          activity,
        });

        PROGRAM_MODULES.forEach((moduleName) => {
          results.push({
            id: `module-${program}-${activity}-${moduleName}`,
            title: `${activity} / ${moduleName}`,
            description: `כניסה ל-${moduleName} עבור ${activity}`,
            kind: 'module',
            program,
            activity,
            module: moduleName,
          });
        });
      });
    });

    Object.entries(VIDEO_LIBRARY).forEach(([activity, videos]) => {
      const programs = findProgramsForActivity(activity);
      programs.forEach((program) => {
        videos.forEach((video) => {
          results.push({
            id: `video-${program}-${activity}-${video.title}`,
            title: video.title,
            description: `${activity} · סרטון`,
            kind: 'video',
            program,
            activity,
            module: 'סרטונים',
          });
        });
      });
    });

    Object.entries(AIDS_LIBRARY).forEach(([activity, aids]) => {
      const programs = findProgramsForActivity(activity);
      programs.forEach((program) => {
        aids.forEach((aid) => {
          results.push({
            id: `aid-${program}-${activity}-${aid.title}`,
            title: aid.title,
            description: `${activity} · עזר/נספח`,
            kind: 'aid',
            program,
            activity,
            module: 'עזרים ונספחים',
          });
        });
      });
    });

    results.push({
      id: 'tool-learning-groups',
      title: 'מעקב אחר קבוצות למידה',
      description: 'ניהול התקדמות התלמידים וצפייה בתוצרים',
      kind: 'tool',
    });

    return results;
  }, []);

  const normalizedGlobalSearchTerm = globalSearchTerm.trim().toLowerCase();
  const globalSearchResults = normalizedGlobalSearchTerm
    ? globalSearchIndex.filter((entry) =>
        `${entry.title} ${entry.description} ${entry.program || ''} ${entry.activity || ''} ${entry.module || ''}`
          .toLowerCase()
          .includes(normalizedGlobalSearchTerm),
      )
    : [];

  const toggleCustomPlanSelection = (program: string, activity: string) => {
    const key = `${program}||${activity}`;
    setCustomPlanSelections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const resetCustomPlan = () => {
    setCustomPlanSelections(new Set());
    setCustomPlanName('');
  };

  const saveCustomPlan = () => {
    if (customPlanSelections.size === 0) return;
    const planLabel = customPlanName.trim() || `הרכבת תוכנית מותאמת ${savedCustomPlans.length + 1}`;
    const modules = Array.from(customPlanSelections).map((entry) => {
      const [program, activity] = entry.split('||');
      return { program, activity };
    });
    setSavedCustomPlans((prev) => [...prev, { name: planLabel, modules }]);
    resetCustomPlan();
    setIsCustomPlanBuilder(false);
    setActiveCustomPlan(planLabel);
  };

  const openSearchResult = (result: GlobalSearchResult) => {
    setGlobalSearchTerm('');
    setCameFromCustomPlan(false);

    if (result.kind === 'tool') {
      setActiveProgram(null);
      setActiveActivity(null);
      setActiveModule(null);
      setActiveSubActivity(null);
      return;
    }

    setActiveProgram(result.program || null);
    setActiveActivity(result.activity || null);
    setActiveModule(result.module || null);
    setActiveSubActivity(result.subActivity || null);
  };

  const StudentContentComponent = activeStudentContent ? getStudentModuleComponent(activeStudentContent) : null;

  if (activeStudentContent && StudentContentComponent) {
    return (
      <div className="animate-fade-in container mx-auto px-4 py-8">
        <button 
          onClick={() => { setActiveStudentContent(null); }}
          className="mb-8 bg-brand-magenta hover:bg-pink-700 text-white font-bold py-3 px-8 text-xl rounded-full flex items-center transition-colors duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H15a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          חזרה לרשימת התוכן
        </button>
        <Header />
        <div className="my-8">
          <StudentContentComponent />
        </div>
      </div>
    );
  }

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

      <div className="max-w-4xl mx-auto mb-8 space-y-3">
        <input
          type="text"
          value={globalSearchTerm}
          onChange={(e) => setGlobalSearchTerm(e.target.value)}
          placeholder="חיפוש תוכנית, מודול, משחק, סרטון או נספח..."
          className="w-full rounded-2xl border-2 border-gray-300 bg-white/95 px-5 py-4 text-xl text-brand-dark-blue placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
        />

        {normalizedGlobalSearchTerm && (
          <div className="bg-white/95 rounded-2xl border border-gray-200 shadow-lg p-3 max-h-[28rem] overflow-auto">
            {globalSearchResults.length > 0 ? (
              <div className="space-y-2">
                {globalSearchResults.slice(0, 60).map((result) => (
                  <button
                    key={result.id}
                    onClick={() => openSearchResult(result)}
                    className="w-full text-right rounded-xl border border-gray-200 px-4 py-3 hover:bg-gray-50 transition"
                  >
                    <p className="text-lg font-bold text-brand-dark-blue">{result.title}</p>
                    <p className="text-sm text-brand-dark-blue/70">{result.description}</p>
                    <p className="text-xs text-brand-dark-blue/60 mt-1">
                      {result.program || 'כללי'}
                      {result.activity ? ` / ${result.activity}` : ''}
                      {result.module ? ` / ${result.module}` : ''}
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-center text-brand-dark-blue/70 py-4">לא נמצאו תוצאות עבור החיפוש.</p>
            )}
          </div>
        )}
      </div>

      {!activeProgram && isCustomPlanBuilder ? (
        <main className="mt-12 space-y-6">
          <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <p className="text-brand-dark-blue/70">הרכבת תוכנית מותאמת</p>
                <h3 className="text-2xl font-bold text-brand-dark-blue">הרכבת תוכנית אישית</h3>
                <p className="text-brand-dark-blue/60">בחרו מודולים מכל התוכניות, תנו שם ושמרו.</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => { setIsCustomPlanBuilder(false); resetCustomPlan(); }}
                  className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
                >
                  חזרה למסך הראשי
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(PROGRAM_ACTIVITY_MODULES).map(([program, activities]) => (
                <div key={program} className="rounded-2xl border-2 border-dashed border-gray-200 bg-white/80 p-4 space-y-3">
                  <div className="text-lg font-bold text-brand-dark-blue text-center mb-2">{program.replace(/'/g, '')}</div>
                  <div className="space-y-2">
                    {activities.map((activity) => {
                      const key = `${program}||${activity}`;
                      const selected = customPlanSelections.has(key);
                      return (
                        <label
                          key={key}
                          className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-2 text-right cursor-pointer transition ${selected ? 'border-brand-teal bg-brand-teal/10' : 'border-gray-200 bg-white/70 hover:border-brand-teal/50'}`}
                        >
                          <div>
                            <p className="font-bold text-brand-dark-blue">{activity}</p>
                            <p className="text-sm text-brand-dark-blue/60">{getSummary(activity)}</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => toggleCustomPlanSelection(program, activity)}
                            className="w-5 h-5 accent-brand-teal"
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex-1">
                <label className="block text-sm text-brand-dark-blue/70 mb-1">שם התוכנית המותאמת</label>
                <input
                  type="text"
                  value={customPlanName}
                  onChange={(e) => setCustomPlanName(e.target.value)}
                  placeholder="לדוגמה: תוכנית מתקדמים כיתה יא"
                  className="w-full rounded-xl border-2 border-gray-300 bg-white/95 px-4 py-3 text-lg text-brand-dark-blue placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={resetCustomPlan}
                  className="px-5 py-3 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
                >
                  נקה בחירות
                </button>
                <button
                  onClick={saveCustomPlan}
                  className="px-6 py-3 rounded-full bg-brand-magenta text-white font-bold hover:bg-pink-700 disabled:opacity-60"
                  disabled={customPlanSelections.size === 0}
                >
                  סיימתי ושמור תוכנית
                </button>
              </div>
            </div>

            {customPlanSelections.size > 0 && (
              <div className="rounded-2xl border border-brand-teal/40 bg-brand-teal/5 p-4">
                <p className="font-bold text-brand-dark-blue mb-2">מודולים שנבחרו</p>
                <div className="flex flex-wrap gap-2">
                  {Array.from(customPlanSelections).map((key) => {
                    const [program, activity] = key.split('||');
                    return (
                      <span key={key} className="px-3 py-1 rounded-full bg-white border border-brand-teal/40 text-brand-dark-blue text-sm">
                        {activity} · {program.replace(/'/g, '')}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </main>
      ) : !activeProgram && activeCustomPlan ? (
        <main className="mt-12 space-y-6">
          <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <p className="text-brand-dark-blue/70">תוכניות מותאמות</p>
                <h3 className="text-2xl font-bold text-brand-dark-blue">{activeCustomPlan}</h3>
                <p className="text-brand-dark-blue/60">המודולים שבחרתם — לחצו כדי לפתוח וללמד.</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setActiveCustomPlan(null)}
                  className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
                >
                  חזרה לתיקיית התוכניות המותאמות
                </button>
                <button
                  onClick={() => { setIsCustomPlanBuilder(true); resetCustomPlan(); }}
                  className="px-4 py-2 rounded-full bg-brand-magenta text-white font-bold hover:bg-pink-700"
                >
                  בנו תוכנית נוספת
                </button>
              </div>
            </div>
            {(() => {
              const plan = savedCustomPlans.find((p) => p.name === activeCustomPlan);
              if (!plan) return (
                <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white/70 p-10 text-center text-brand-dark-blue/50">
                  לא נמצאו מודולים לתוכנית זו.
                </div>
              );
              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {plan.modules.map((mod, idx) => (
                    <button
                      key={`${plan.name}-${idx}`}
                      onClick={() => {
                        setActiveProgram(mod.program as string);
                        setActiveActivity(mod.activity as string);
                        setActiveModule(null);
                        setActiveSubActivity(null);
                        setActiveCustomPlan(null);
                        setCameFromCustomPlan(true);
                      }}
                      className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-5 text-right shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[12rem] flex flex-col"
                    >
                      <p className="text-xl font-bold text-brand-dark-blue">{mod.activity}</p>
                      <p className="text-brand-dark-blue/60 mt-2 text-sm">{mod.program.replace(/'/g, '')}</p>
                    </button>
                  ))}
                </div>
              );
            })()}
          </div>
        </main>
      ) : !activeProgram ? (
        <main className="mt-12 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {rootCards.map((card) => (
              <ActionCard
                key={card.title}
                title={card.title}
                description={card.description}
                icon={card.icon}
                onSelect={card.onSelect}
                theme={card.theme}
              />
            ))}
          </div>

          {savedCustomPlans.length > 0 && (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-6 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-brand-dark-blue/70">תוכניות מותאמות</p>
                  <h3 className="text-2xl font-bold text-brand-dark-blue">תיקיית תוכניות מותאמות</h3>
                </div>
                <button
                  onClick={() => { setIsCustomPlanBuilder(true); setActiveProgram(null); setActiveModule(null); setActiveActivity(null); setActiveSubActivity(null); }}
                  className="px-4 py-2 rounded-full bg-brand-magenta text-white font-bold hover:bg-pink-700"
                >
                  בנו תוכנית נוספת
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedCustomPlans.map((plan) => (
                  <button
                    key={plan.name}
                    onClick={() => setActiveCustomPlan(plan.name)}
                    className="text-left rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-5 shadow-sm space-y-3 hover:-translate-y-1 hover:shadow-xl transition"
                  >
                    <p className="text-xl font-bold text-brand-dark-blue">{plan.name}</p>
                    <p className="text-sm text-brand-dark-blue/60">לחץ כדי לפתוח את התוכנית והמודולים שנבחרו.</p>
                    <div className="flex flex-wrap gap-2">
                      {plan.modules.map((mod, idx) => (
                        <span key={`${plan.name}-${idx}`} className="px-3 py-1 rounded-full bg-brand-teal/10 border border-brand-teal/30 text-sm text-brand-dark-blue">
                          {mod.activity} · {mod.program.replace(/'/g, '')}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </main>
      ) : !activeActivity ? (
        /* Step 2: pick a module name */
        <main className="mt-12 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {(PROGRAM_ACTIVITY_MODULES[activeProgram || ''] || []).map(moduleName => (
            <button
              key={moduleName}
              onClick={() => { setActiveActivity(moduleName); setActiveModule(null); setActiveSubActivity(null); setCameFromCustomPlan(false); }}
              className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
            >
              {KISONIM_MODULE_INFO[moduleName]?.icon && (
                <p className="text-4xl mb-3">{KISONIM_MODULE_INFO[moduleName].icon}</p>
              )}
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
          </div>
        </main>
      ) : !activeModule ? (
        /* Step 3: pick content type */
        <main className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 items-stretch">
          {activeActivity && renderStudentContentCard(activeActivity, (act) => setActiveStudentContent(act))}
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
                {module === 'מצגת' && 'מצגת מוכנה להקרנה בכיתה'}
                {module === 'מערך שיעור' && 'רצף שיעור, זמנים ומוקדי דגשים'}
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
          {activeModule === 'מצגת' ? (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-brand-dark-blue/70">מצגת</p>
                  <h3 className="text-2xl font-bold text-brand-dark-blue">{activeActivity || 'בחרו נושא'}</h3>
                  <p className="text-brand-dark-blue/60">
                    {activeActivity
                      ? `כאן תופיע מצגת מוכנה למודול "${activeActivity}".`
                      : 'בחרו נושא כדי לצפות במצגת המודול.'}
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => { setActiveModule(null); setActiveSubActivity(null); }}
                    className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
                  >
                    חזרה לסוגי התוכן
                  </button>
                  <button
                    onClick={() => { setActiveActivity(null); setActiveModule(null); setActiveSubActivity(null); }}
                    className="px-4 py-2 rounded-full bg-brand-magenta text-white font-bold hover:bg-pink-700"
                  >
                    חזרה לרשימת המודולים
                  </button>
                </div>
              </div>
              <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white/70 p-10 text-center text-brand-dark-blue/70 flex flex-col items-center justify-center min-h-[12rem]">
                <p className="text-5xl mb-4">🖥️</p>
                <p className="text-xl font-bold text-brand-dark-blue">מצגת תעלה בקרוב</p>
                <p className="text-base mt-2 text-brand-dark-blue/60">
                  {activeActivity ? `נוסיף קישור או קובץ מצגת עבור "${activeActivity}".` : 'נציג כאן קבצי מצגות לפי הנושא הנבחר.'}
                </p>
              </div>
            </div>
          ) : activeModule === 'מערך שיעור' ? (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-brand-dark-blue/70">מערך שיעור</p>
                  <h3 className="text-2xl font-bold text-brand-dark-blue">{activeActivity || 'בחרו נושא'}</h3>
                  <p className="text-brand-dark-blue/60">
                    {activeActivity
                      ? `כאן יופיע מערך שיעור מובנה עבור "${activeActivity}".`
                      : 'בחרו נושא כדי לצפות במערך שיעור.'}
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => { setActiveModule(null); setActiveSubActivity(null); }}
                    className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
                  >
                    חזרה לסוגי התוכן
                  </button>
                  <button
                    onClick={() => { setActiveActivity(null); setActiveModule(null); setActiveSubActivity(null); }}
                    className="px-4 py-2 rounded-full bg-brand-magenta text-white font-bold hover:bg-pink-700"
                  >
                    חזרה לרשימת המודולים
                  </button>
                </div>
              </div>
              <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white/70 p-10 text-center text-brand-dark-blue/70 flex flex-col items-center justify-center min-h-[12rem]">
                <p className="text-5xl mb-4">📘</p>
                <p className="text-xl font-bold text-brand-dark-blue">מערך שיעור יתווסף בקרוב</p>
                <p className="text-base mt-2 text-brand-dark-blue/60">
                  {activeActivity ? `נעלה כאן קובץ מערך שיעור וסדר יום עבור "${activeActivity}".` : 'כאן יוצגו מערכי שיעור בהתאם לנושא שתבחרו.'}
                </p>
              </div>
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && !activeActivity ? (
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
                <p className="text-4xl mb-3">💰</p>
                <p className="text-2xl font-bold text-brand-dark-blue">אל תפילו את המיליון</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק כיתתי על הוצאות מחיה והישרדות תקציבית.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('BLOOKET')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">🎮</p>
                <p className="text-2xl font-bold text-brand-dark-blue">BLOOKET</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">חידוני Blooket לתרגול ניהול תקציב.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('מירוץ מכוניות')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">🏎️</p>
                <p className="text-2xl font-bold text-brand-dark-blue">מירוץ מכוניות</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק מגניב ללמידה מתכני המודול.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('KAHOOT')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">🎵</p>
                <p className="text-2xl font-bold text-brand-dark-blue">KAHOOT</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">חידוני Kahoot לניהול תקציב.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('חבילה עוברת')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">📦</p>
                <p className="text-2xl font-bold text-brand-dark-blue">חבילה עוברת</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק חבילה עוברת עם משימות תקציב.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('פעילויות WORDWAELL')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">📝</p>
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
            <CarRaceGame onBack={() => setActiveSubActivity(null)} />
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
                <p className="text-4xl mb-3">💰</p>
                <p className="text-2xl font-bold text-brand-dark-blue">אל תפילו את המיליון</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק כיתתי על אבולוציית הכסף והחלטות כלכליות.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('חבילה עוברת')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">📦</p>
                <p className="text-2xl font-bold text-brand-dark-blue">חבילה עוברת</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק כיתתי עם שאלות ומשימות בנושא סיפורו של כסף.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('פעילות סחר חליפין')}
                className="rounded-3xl border-2 border-dashed border-brand-teal bg-teal-50 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">🔄</p>
                <p className="text-2xl font-bold text-brand-dark-blue">פעילות סחר חליפין</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">פעילות ניידת עם QR להבנת ערך, צורך ומחסור דרך סחר בין קבוצות.</p>
              </button>
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
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'סיפורו של כסף' && activeProgram === "'מה בכיס'" && activeSubActivity === 'פעילות סחר חליפין' ? (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-brand-dark-blue/70">פעילות כיתתית</p>
                  <h3 className="text-2xl font-bold text-brand-dark-blue">פעילות סחר חליפין</h3>
                  <p className="text-brand-dark-blue/60">התלמידים נכנסים דרך QR מהטלפון, סוחרים בפריטים ולומדים על פער בין ערך נתפס לצורך אמיתי.</p>
                </div>
                <button
                  onClick={() => setActiveSubActivity(null)}
                  className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
                >
                  חזרה לחלון המשחקים
                </button>
              </div>
              <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white">
                <iframe
                  title="פעילות סחר חליפין"
                  src="/games/barter-trade-challenge.html"
                  className="w-full h-[820px]"
                />
              </div>
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'הכסף ואני' && activeProgram === "'מה בכיס'" && !activeSubActivity ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <button
                onClick={() => setActiveSubActivity('אל תפילו את המיליון')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">💰</p>
                <p className="text-2xl font-bold text-brand-dark-blue">אל תפילו את המיליון</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק על קבלת החלטות אישית עם כסף וזהות פיננסית.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('חבילה עוברת')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">📦</p>
                <p className="text-2xl font-bold text-brand-dark-blue">חבילה עוברת</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק כיתתי עם שאלות ומשימות בנושא הכסף ואני.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('מנהלי העתיד: אתגר ה-5,000')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">🏆</p>
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
                <p className="text-4xl mb-3">💰</p>
                <p className="text-2xl font-bold text-brand-dark-blue">אל תפילו את המיליון</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק על מחירים, השוואות ועלויות נסתרות.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('חבילה עוברת')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">📦</p>
                <p className="text-2xl font-bold text-brand-dark-blue">חבילה עוברת</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק כיתתי עם שאלות ומשימות בנושא כמה זה עולה לי?</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('מחשבון מודל החצ"ר')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">🧮</p>
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
                <p className="text-4xl mb-3">💰</p>
                <p className="text-2xl font-bold text-brand-dark-blue">אל תפילו את המיליון</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק על כוח שוק, ריכוזיות והשפעתם על מחירים.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('חבילה עוברת')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">📦</p>
                <p className="text-2xl font-bold text-brand-dark-blue">חבילה עוברת</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק כיתתי עם שאלות ומשימות בנושא מונופולים בישראל.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('חכם בסופר')}
                className="rounded-3xl border-2 border-dashed border-brand-teal bg-teal-50 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">🛒</p>
                <p className="text-2xl font-bold text-brand-dark-blue">חכם בסופר</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק מונופולים כיתתי — מי שייך למי?</p>
              </button>
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
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'מונופולים בישראל' && activeProgram === "'מה בכיס'" && activeSubActivity === 'חכם בסופר' ? (
            <SupermarketRaceGame onBack={() => setActiveSubActivity(null)} />
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'צרכנות נבונה' && activeProgram === "'מה בכיס'" && !activeSubActivity ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <button
                onClick={() => setActiveSubActivity('אל תפילו את המיליון')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">💰</p>
                <p className="text-2xl font-bold text-brand-dark-blue">אל תפילו את המיליון</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק על השוואות מחירים, מבצעים וטעויות צרכניות נפוצות.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('חבילה עוברת')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">📦</p>
                <p className="text-2xl font-bold text-brand-dark-blue">חבילה עוברת</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק כיתתי עם שאלות ומשימות בנושא צרכנות נבונה.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('בינגו צרכנות נבונה')}
                className="rounded-3xl border-2 border-dashed border-brand-teal bg-teal-50 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">🧩</p>
                <p className="text-2xl font-bold text-brand-dark-blue">בינגו צרכנות נבונה</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">שאלות ותשובות לבינגו נמצאים בתיקיית הנספחים ועזרים</p>
              </button>
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
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'צרכנות נבונה' && activeProgram === "'מה בכיס'" && activeSubActivity === 'בינגו צרכנות נבונה' ? (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-brand-dark-blue/70">פעילות</p>
                  <h3 className="text-2xl font-bold text-brand-dark-blue">בינגו צרכנות נבונה</h3>
                  <p className="text-brand-dark-blue/60">שאלות ותשובות לבינגו נמצאים בתיקיית הנספחים ועזרים</p>
                </div>
                <button
                  onClick={() => setActiveSubActivity(null)}
                  className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
                >
                  חזרה לחלון המשחקים
                </button>
              </div>
              <a
                href="https://drive.google.com/file/d/1JCbVU8SxjWssMgqgAx9E-SGIe5c8dqKr/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-5 text-center shadow hover:-translate-y-1 hover:shadow-xl transition"
              >
                <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl border border-gray-200 bg-white p-4">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=https%3A%2F%2Fdrive.google.com%2Ffile%2Fd%2F1JCbVU8SxjWssMgqgAx9E-SGIe5c8dqKr%2Fview%3Fusp%3Dsharing"
                    alt="ברקוד בינגו צרכנות נבונה"
                    className="w-full h-auto object-contain"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <p className="mt-4 text-lg font-bold text-brand-dark-blue">פתיחה בחלון חדש</p>
              </a>
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'מערכות יחסים וכסף' && activeProgram === "'מה בכיס'" && !activeSubActivity ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <button
                onClick={() => setActiveSubActivity('אל תפילו את המיליון')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">💰</p>
                <p className="text-2xl font-bold text-brand-dark-blue">אל תפילו את המיליון</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק על תקשורת, גבולות והוגנות סביב כסף במערכות יחסים.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('חבילה עוברת')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">📦</p>
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
                <p className="text-4xl mb-3">💰</p>
                <p className="text-2xl font-bold text-brand-dark-blue">אל תפילו את המיליון</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק על דרכים להרוויח, תמחור ראשון ובטיחות בגיגים.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('חבילה עוברת')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">📦</p>
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
                <p className="text-4xl mb-3">💰</p>
                <p className="text-2xl font-bold text-brand-dark-blue">אל תפילו את המיליון</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק על ניהול זמן, דחיינות וערך שעה.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('חבילה עוברת')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">🕐</p>
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
                <p className="text-4xl mb-3">💰</p>
                <p className="text-2xl font-bold text-brand-dark-blue">אל תפילו את המיליון</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק על הצגה מול קהל, פיץ׳ ומסר ברור.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('חבילה עוברת')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">🎤</p>
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
                <p className="text-4xl mb-3">💰</p>
                <p className="text-2xl font-bold text-brand-dark-blue">אל תפילו את המיליון</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק על בניית עסק: ערך, MVP, תמחור ותזרים.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('חבילה עוברת')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">🏗️</p>
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
                <p className="text-4xl mb-3">🎯</p>
                <p className="text-2xl font-bold text-brand-dark-blue">ג׳פרדי פיננסי</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">{getSummary('ג׳פרדי פיננסי')}</p>
              </button>
              <button
                onClick={() => setActiveActivity('בול פגיעה')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">⚽</p>
                <p className="text-2xl font-bold text-brand-dark-blue">בול פגיעה</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק כדורגל מרובה משתתפים עם שאלות פיננסיות</p>
              </button>
              <button
                onClick={() => setActiveActivity('אל תפילו את המיליון - מה בכיס')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">💰</p>
                <p className="text-2xl font-bold text-brand-dark-blue">אל תפילו את המיליון</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק רב-תחומי עם שאלות על כל נושאי תוכנית מה בכיס</p>
              </button>
              <button
                onClick={() => setActiveActivity('חבילה עוברת - מה בכיס')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">📦</p>
                <p className="text-2xl font-bold text-brand-dark-blue">חבילה עוברת</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק חבילה עוברת עם שאלות מכל נושאי תוכנית מה בכיס</p>
              </button>
              <button
                onClick={() => setActiveActivity('פיקאסו פיננסי')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">🎨</p>
                <p className="text-2xl font-bold text-brand-dark-blue">פיקאסו פיננסי</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק פיקשיונרי פיננסי בזמן אמת — צייר, נחש, קבל ניקוד!</p>
              </button>
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'רב תחומי' && activeProgram === "'חכם בכיס'" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <button
                onClick={() => setActiveActivity('ג׳פרדי פיננסי')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">🎯</p>
                <p className="text-2xl font-bold text-brand-dark-blue">ג׳פרדי פיננסי</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">{getSummary('ג׳פרדי פיננסי')}</p>
              </button>
              <button
                onClick={() => setActiveActivity('ג׳פרדי היסטורי')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">🏛️</p>
                <p className="text-2xl font-bold text-brand-dark-blue">ג׳פרדי היסטורי</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">{getSummary('ג׳פרדי היסטורי')}</p>
              </button>
              <button
                onClick={() => setActiveActivity('בול פגיעה')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">⚽</p>
                <p className="text-2xl font-bold text-brand-dark-blue">בול פגיעה</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק כדורגל מרובה משתתפים עם שאלות פיננסיות</p>
              </button>
              <button
                onClick={() => setActiveActivity('אל תפילו את המיליון - חכם בכיס')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">💰</p>
                <p className="text-2xl font-bold text-brand-dark-blue">אל תפילו את המיליון</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק רב-תחומי עם שאלות על כל נושאי תוכנית חכם בכיס</p>
              </button>
              <button
                onClick={() => setActiveActivity('חבילה עוברת - חכם בכיס')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">📦</p>
                <p className="text-2xl font-bold text-brand-dark-blue">חבילה עוברת</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק חבילה עוברת עם שאלות מכל נושאי תוכנית חכם בכיס</p>
              </button>
              <button
                onClick={() => setActiveActivity('פיקאסו פיננסי')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">🎨</p>
                <p className="text-2xl font-bold text-brand-dark-blue">פיקאסו פיננסי</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק פיקשיונרי פיננסי בזמן אמת — צייר, נחש, קבל ניקוד!</p>
              </button>
              <button
                onClick={() => setActiveActivity('פעילות סיכום')}
                className="rounded-3xl border-2 border-dashed border-brand-teal bg-teal-50 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">☁️</p>
                <p className="text-2xl font-bold text-brand-dark-blue">פעילות סיכום</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">ענן מילים חי לרפלקציה קבוצתית — משתתפים שולחים מילים דרך QR</p>
              </button>
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'פעילות סיכום' ? (
            <WordCloudHost onBack={() => setActiveActivity('רב תחומי')} />
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'פיקאסו פיננסי' ? (
            <PicassoGame onBack={() => setActiveActivity('רב תחומי')} />
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'בול פגיעה' && (activeProgram === "'מה בכיס'" || activeProgram === "'חכם בכיס'") ? (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-4 sm:p-6">
              <BullseyeGame onBack={() => setActiveActivity('רב תחומי')} />
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
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'ג׳פרדי היסטורי' && activeProgram === "'חכם בכיס'" ? (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-4 sm:p-6">
              <JeopardyModule
                title="ג׳פרדי היסטורי — מלחמת העולם הראשונה"
                onBack={() => setActiveActivity('רב תחומי')}
                onComplete={() => {}}
                questionBanks={jeopardyHistoricalBanks}
              />
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === "חבילה עוברת - מה בכיס" ? (
            <ParcelGame items={mahBakisMixedItems} moduleTitle="רב תחומי — מה בכיס" moduleSubtitle="כל סיבוב נעצר בזמן אקראי" musicUrl="/havila.mp3" />
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === "חבילה עוברת - חכם בכיס" ? (
            <ParcelGame items={chachamBakisMixedItems} moduleTitle="רב תחומי — חכם בכיס" moduleSubtitle="כל סיבוב נעצר בזמן אקראי" musicUrl="/havila.mp3" />
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === "אל תפילו את המיליון - מה בכיס" ? (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-brand-dark-blue/70">פעילות רב-תחומית</p>
                  <h3 className="text-2xl font-bold text-brand-dark-blue">אל תפילו את המיליון — מה בכיס</h3>
                  <p className="text-brand-dark-blue/60">שאלות על כל נושאי תוכנית מה בכיס: כסף, תקציב, צרכנות, יחסים, הרוויח ועוד.</p>
                </div>
                <button
                  onClick={() => setActiveActivity('רב תחומי')}
                  className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
                >
                  חזרה לרב תחומי
                </button>
              </div>
              <MillionDropGame onBack={() => setActiveActivity('רב תחומי')} topic="mahBakis" />
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === "אל תפילו את המיליון - חכם בכיס" ? (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-brand-dark-blue/70">פעילות רב-תחומית</p>
                  <h3 className="text-2xl font-bold text-brand-dark-blue">אל תפילו את המיליון — חכם בכיס</h3>
                  <p className="text-brand-dark-blue/60">שאלות על כל נושאי תוכנית חכם בכיס: תקציב, הוצאות, מינוס, זכויות עובדים, תלוש ועוד.</p>
                </div>
                <button
                  onClick={() => setActiveActivity('רב תחומי')}
                  className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
                >
                  חזרה לרב תחומי
                </button>
              </div>
              <MillionDropGame onBack={() => setActiveActivity('רב תחומי')} topic="chachamBakis" />
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'איך מנהלים הוצאות?' && activeProgram === "'חכם בכיס'" && !activeSubActivity ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <button
                onClick={() => setActiveSubActivity('אל תפילו את המיליון')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">💰</p>
                <p className="text-2xl font-bold text-brand-dark-blue">אל תפילו את המיליון</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק על מודל חצ"ר, תיעוד הוצאות והחלטות קנייה.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('BLOOKET')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">🎮</p>
                <p className="text-2xl font-bold text-brand-dark-blue">BLOOKET</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">חידוני Blooket למודול זה.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('KAHOOT')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">🎵</p>
                <p className="text-2xl font-bold text-brand-dark-blue">KAHOOT</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">חידוני Kahoot למודול זה.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('WORDWALL')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">📝</p>
                <p className="text-2xl font-bold text-brand-dark-blue">WORDWALL</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">חידוני Wordwall למודול זה.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('חבילה עוברת')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">📦</p>
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
                <p className="text-4xl mb-3">💰</p>
                <p className="text-2xl font-bold text-brand-dark-blue">אל תפילו את המיליון</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק על מינוס, ריביות ודרכי יציאה מהחריגה.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('BLOOKET')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">🎮</p>
                <p className="text-2xl font-bold text-brand-dark-blue">BLOOKET</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">חידוני Blooket למודול זה.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('KAHOOT')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">🎵</p>
                <p className="text-2xl font-bold text-brand-dark-blue">KAHOOT</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">חידוני Kahoot למודול זה.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('WORDWALL')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">📝</p>
                <p className="text-2xl font-bold text-brand-dark-blue">WORDWALL</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">חידוני Wordwall למודול זה.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('חבילה עוברת')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">📦</p>
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
                <p className="text-4xl mb-3">💰</p>
                <p className="text-2xl font-bold text-brand-dark-blue">אל תפילו את המיליון</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק על זכויות בסיסיות, שעות נוספות והליך שימוע.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('BLOOKET')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">🎮</p>
                <p className="text-2xl font-bold text-brand-dark-blue">BLOOKET</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">חידוני Blooket למודול זה.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('KAHOOT')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">🎵</p>
                <p className="text-2xl font-bold text-brand-dark-blue">KAHOOT</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">חידוני Kahoot למודול זה.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('WORDWALL')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">📝</p>
                <p className="text-2xl font-bold text-brand-dark-blue">WORDWALL</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">חידוני Wordwall למודול זה.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('חבילה עוברת')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">📦</p>
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
                <p className="text-4xl mb-3">💰</p>
                <p className="text-2xl font-bold text-brand-dark-blue">אל תפילו את המיליון</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק על קריאת תלוש: ברוטו/נטו, ניכויים והפרשות.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('BLOOKET')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">🎮</p>
                <p className="text-2xl font-bold text-brand-dark-blue">BLOOKET</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">חידוני Blooket למודול זה.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('KAHOOT')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">🎵</p>
                <p className="text-2xl font-bold text-brand-dark-blue">KAHOOT</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">חידוני Kahoot למודול זה.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('WORDWALL')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">📝</p>
                <p className="text-2xl font-bold text-brand-dark-blue">WORDWALL</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">חידוני Wordwall למודול זה.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('חבילה עוברת')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">📦</p>
                <p className="text-2xl font-bold text-brand-dark-blue">חבילה עוברת</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">גרסה מודולרית לחבילה עוברת.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('אתגר התלוש')}
                className="rounded-3xl border-2 border-dashed border-teal-300 bg-gradient-to-br from-teal-50 to-cyan-50 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-2">🧾</p>
                <p className="text-2xl font-bold text-teal-800">אתגר התלוש</p>
                <p className="text-teal-700 mt-2 text-base">QR לנייד + מילוי תלוש מדומה עם שדות חסרים</p>
              </button>
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
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'פענוח תלוש שכר' && activeProgram === "'חכם בכיס'" && activeSubActivity === 'אתגר התלוש' ? (
            <PayslipChallengeGame onBack={() => setActiveSubActivity(null)} />
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'שכירים ועצמאיים' && activeProgram === "'חכם בכיס'" && !activeSubActivity ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <button
                onClick={() => setActiveSubActivity('אל תפילו את המיליון')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">💰</p>
                <p className="text-2xl font-bold text-brand-dark-blue">אל תפילו את המיליון</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק על ההבדלים בין שכיר לעצמאי, מסים ותזרים.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('BLOOKET')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">🎮</p>
                <p className="text-2xl font-bold text-brand-dark-blue">BLOOKET</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">חידוני Blooket למודול זה.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('KAHOOT')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">🎵</p>
                <p className="text-2xl font-bold text-brand-dark-blue">KAHOOT</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">חידוני Kahoot למודול זה.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('WORDWALL')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">📝</p>
                <p className="text-2xl font-bold text-brand-dark-blue">WORDWALL</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">חידוני Wordwall למודול זה.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('חבילה עוברת')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">📦</p>
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
                <p className="text-4xl mb-3">💰</p>
                <p className="text-2xl font-bold text-brand-dark-blue">אל תפילו את המיליון</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק על חיסכון, ריבית דריבית ופיזור השקעות.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('BLOOKET')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">🎮</p>
                <p className="text-2xl font-bold text-brand-dark-blue">BLOOKET</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">חידוני Blooket למודול זה.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('KAHOOT')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">🎵</p>
                <p className="text-2xl font-bold text-brand-dark-blue">KAHOOT</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">חידוני Kahoot למודול זה.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('WORDWALL')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">📝</p>
                <p className="text-2xl font-bold text-brand-dark-blue">WORDWALL</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">חידוני Wordwall למודול זה.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('חבילה עוברת')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">📦</p>
                <p className="text-2xl font-bold text-brand-dark-blue">חבילה עוברת</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">גרסה מודולרית לחבילה עוברת.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('תיק ההשקעות שלי')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">📈</p>
                <p className="text-2xl font-bold text-brand-dark-blue">תיק ההשקעות שלי</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">סימולציה מציאותית של בניית תיק, אירועי שוק וחישוב רווח/הפסד.</p>
              </button>
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
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'חיסכון והשקעות' && activeProgram === "'חכם בכיס'" && activeSubActivity === 'תיק ההשקעות שלי' ? (
            <MyInvestmentPortfolioGame onBack={() => setActiveSubActivity(null)} />
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'תקציב המדינה' && activeProgram === "'חכם בכיס'" && !activeSubActivity ? (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-brand-dark-blue/70">פעילויות ומשחקים</p>
                  <h3 className="text-2xl font-bold text-brand-dark-blue">תקציב המדינה</h3>
                  <p className="text-brand-dark-blue/60">בחרו פעילות קבוצתית למודול תקציב המדינה.</p>
                </div>
                <button
                  onClick={() => setActiveModule(null)}
                  className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
                >
                  חזרה לחלון הפעילויות
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <button
                  onClick={() => setActiveSubActivity('ישיבת תקציב')}
                  className="rounded-3xl border-2 border-dashed border-brand-teal bg-teal-50 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
                >
                  <p className="text-4xl mb-3">🏛️</p>
                  <p className="text-2xl font-bold text-brand-dark-blue">ישיבת תקציב</p>
                  <p className="text-brand-dark-blue/60 mt-3 text-lg">הגדירו קבוצות, שתפו QR, וקבלו על מסך המחשב את התקציבים שמוגשים מהטלפונים.</p>
                </button>
              </div>
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'תקציב המדינה' && activeProgram === "'חכם בכיס'" && activeSubActivity === 'ישיבת תקציב' ? (
            <BudgetMeetingActivity onBack={() => setActiveSubActivity(null)} />
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
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'ניכויי שכר' && activeProgram === "'חכם בכיס'" && !activeSubActivity ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <button
                onClick={() => setActiveSubActivity('BLOOKET')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">🎮</p>
                <p className="text-2xl font-bold text-brand-dark-blue">BLOOKET</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">חידוני Blooket למודול זה.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('KAHOOT')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">🎵</p>
                <p className="text-2xl font-bold text-brand-dark-blue">KAHOOT</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">חידוני Kahoot למודול זה.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('WORDWALL')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">📝</p>
                <p className="text-2xl font-bold text-brand-dark-blue">WORDWALL</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">חידוני Wordwall למודול זה.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('חבילה עוברת')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">📦</p>
                <p className="text-2xl font-bold text-brand-dark-blue">חבילה עוברת</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">גרסה מודולרית לחבילה עוברת.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('אל תפילו את המיליון')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">💰</p>
                <p className="text-2xl font-bold text-brand-dark-blue">אל תפילו את המיליון</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">משחק ישראלי לוויזיה על ניכויי שכר.</p>
              </button>
              <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white/70 p-8 text-center text-brand-dark-blue/50 min-h-[14rem] flex flex-col items-center justify-center">
                <p className="text-2xl font-bold">משחק נוסף</p>
                <p className="text-lg mt-2">בקרוב יתווסף משחק תומך.</p>
              </div>
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'ניכויי שכר' && activeProgram === "'חכם בכיס'" && activeSubActivity === 'אל תפילו את המיליון' ? (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-brand-dark-blue/70">פעילות</p>
                  <h3 className="text-2xl font-bold text-brand-dark-blue">אל תפילו את המיליון</h3>
                  <p className="text-brand-dark-blue/60">משחק על ניכויי שכר: מס הכנסה, ביטוח לאומי, דמי בריאות ופנסיה.</p>
                </div>
                <button
                  onClick={() => setActiveSubActivity(null)}
                  className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
                >
                  חזרה לחלון המשחקים
                </button>
              </div>
              <MillionDropGame onBack={() => setActiveSubActivity(null)} topic="salaryDeductions" />
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'ניכויי שכר' && activeProgram === "'חכם בכיס'" && activeSubActivity === 'חבילה עוברת' ? (
            <ParcelGame
              items={salaryDeductionItems}
              moduleTitle="ניכויי שכר"
              moduleSubtitle="כל סיבוב נעצר בזמן אקראי"
              musicUrl="/havila.mp3"
            />
          ) : activeModule === 'פעילויות ומשחקים' && activeActivity === 'ניכויי שכר' && activeProgram === "'חכם בכיס'" && (activeSubActivity === 'BLOOKET' || activeSubActivity === 'KAHOOT' || activeSubActivity === 'WORDWALL') ? (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-brand-dark-blue/70">פעילויות ומשחקים</p>
                  <h3 className="text-2xl font-bold text-brand-dark-blue">{activeSubActivity} — ניכויי שכר</h3>
                  <p className="text-brand-dark-blue/60">חידוני {activeSubActivity} למודול זה. הוסיפו לינקים רלוונטיים כשיהיו מוכנים.</p>
                </div>
                <button
                  onClick={() => setActiveSubActivity(null)}
                  className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
                >
                  חזרה לחלון המשחקים
                </button>
              </div>
              <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white/80 p-6 text-center text-brand-dark-blue/70 min-h-[12rem] flex flex-col items-center justify-center">
                <p className="text-2xl font-bold">חידוני {activeSubActivity}</p>
                <p className="text-lg mt-2">הוסיפו כאן לינקים ל{activeSubActivity} בנושא ניכויי שכר.</p>
              </div>
            </div>
          ) : activeModule === 'עזרים ונספחים' && activeProgram === "'חכם בכיס'" && (!activeActivity || activeActivity === 'ניכויי שכר') ? (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-brand-dark-blue/70">עזרים ונספחים</p>
                  <h3 className="text-2xl font-bold text-brand-dark-blue">ניכויי שכר</h3>
                  <p className="text-brand-dark-blue/60">בחרו עזר מתוך החלוניות.</p>
                </div>
                <button
                  onClick={() => setActiveActivity(null)}
                  className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
                >
                  חזרה לחומרי העזר
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <button
                  onClick={() => setActiveActivity('סימולטור מס הכנסה')}
                  className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
                >
                  <p className="text-4xl mb-3">📊</p>
                  <p className="text-2xl font-bold text-brand-dark-blue">סימולטור מס הכנסה</p>
                  <p className="text-brand-dark-blue/60 mt-3 text-lg">נקודות זיכוי וסימולטור מדרגות מס הכנסה.</p>
                </button>
                {!activeActivity && (PROGRAM_ACTIVITY_MODULES["'חכם בכיס'"] || []).map((moduleName) => (
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
            </div>
          ) : activeModule === 'עזרים ונספחים' && activeProgram === "'חכם בכיס'" && activeActivity === 'סימולטור מס הכנסה' ? (
            <ProgressiveTaxSimulator onBack={() => setActiveActivity(null)} />
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
                {(AIDS_LIBRARY['ניהול התקציב הראשון שלי'] || []).map((aid) => {
                  const thumb = getAidThumbnail(aid);
                  return (
                    <a
                      key={aid.fileId}
                      href={aid.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-3xl overflow-hidden border-2 border-dashed border-gray-300 bg-white/90 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[12rem] flex flex-col"
                    >
                      <div className="relative h-40 bg-gradient-to-br from-blue-100 to-teal-100 border-b-2 border-gray-200 overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center text-6xl" style={{ display: thumb ? 'none' : undefined }}>{aid.fileIcon || '📄'}</div>
                        {thumb ? (
                          <img
                            src={thumb}
                            alt={`תצוגה מקדימה: ${aid.title}`}
                            className="relative z-10 w-full h-full object-cover"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const icon = e.currentTarget.previousElementSibling as HTMLElement | null;
                              if (icon) icon.style.display = 'flex';
                            }}
                          />
                        ) : null}
                      </div>
                      <div className="p-5 flex-1 flex flex-col items-center justify-center">
                        <p className="text-xl font-bold text-brand-dark-blue">{aid.title}</p>
                        <p className="text-brand-dark-blue/60 mt-2 text-sm">{aid.description}</p>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          ) : activeModule === 'עזרים ונספחים' && activeProgram === "'חכם בכיס'" && activeActivity === 'איך מנהלים הוצאות?' && activeSubActivity === 'מודל החצ"ר' ? (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-brand-dark-blue/70">עזרים ונספחים</p>
                  <h3 className="text-2xl font-bold text-brand-dark-blue">מודל החצ"ר</h3>
                  <p className="text-brand-dark-blue/60">סימולטור סדרי עדיפויות חייב/צריך/רוצה מתוך פרק 5 של "כמה זה עולה לי?".</p>
                </div>
                <button
                  onClick={() => setActiveSubActivity(null)}
                  className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
                >
                  חזרה לחלון העזרים
                </button>
              </div>
              <HatsarStep />
            </div>
          ) : activeModule === 'עזרים ונספחים' && activeProgram === "'חכם בכיס'" && activeActivity === 'איך מנהלים הוצאות?' ? (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-brand-dark-blue/70">עזרים ונספחים</p>
                  <h3 className="text-2xl font-bold text-brand-dark-blue">איך מנהלים הוצאות?</h3>
                  <p className="text-brand-dark-blue/60">בחרו חלונית עזר או הפעילו את סימולטור מודל החצ"ר.</p>
                </div>
                <button
                  onClick={() => { setActiveActivity(null); setActiveSubActivity(null); }}
                  className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
                >
                  חזרה לחומרי העזר
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <button
                  onClick={() => setActiveSubActivity('מודל החצ"ר')}
                  className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
                >
                  <p className="text-4xl mb-3">🧮</p>
                  <p className="text-2xl font-bold text-brand-dark-blue">מודל החצ"ר</p>
                  <p className="text-brand-dark-blue/60 mt-3 text-lg">סימולטור סדרי עדיפויות חייב/צריך/רוצה בפרק "כמה זה עולה לי?".</p>
                </button>
                {(AIDS_LIBRARY['איך מנהלים הוצאות?'] || [])
                  .filter((aid) => aid.url !== '#hatsar-simulator')
                  .map((aid) => {
                    const thumb = getAidThumbnail(aid);
                    return (
                      <a
                        key={aid.fileId || aid.url}
                        href={aid.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-3xl overflow-hidden border-2 border-dashed border-gray-300 bg-white/90 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[12rem] flex flex-col"
                      >
                        <div className="relative h-40 bg-gradient-to-br from-blue-100 to-teal-100 border-b-2 border-gray-200 overflow-hidden">
                          <div className="absolute inset-0 flex items-center justify-center text-6xl" style={{ display: thumb ? 'none' : undefined }}>{aid.fileIcon || '📄'}</div>
                          {thumb ? (
                            <img
                              src={thumb}
                              alt={`תצוגה מקדימה: ${aid.title}`}
                              className="relative z-10 w-full h-full object-cover"
                              loading="lazy"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                const icon = e.currentTarget.previousElementSibling as HTMLElement | null;
                                if (icon) icon.style.display = 'flex';
                              }}
                            />
                          ) : null}
                        </div>
                        <div className="p-5 flex-1 flex flex-col items-center justify-center">
                          <p className="text-xl font-bold text-brand-dark-blue">{aid.title}</p>
                          <p className="text-brand-dark-blue/60 mt-2 text-sm">{aid.description}</p>
                        </div>
                      </a>
                    );
                  })}
              </div>
            </div>
          ) : activeModule === 'עזרים ונספחים' && activeProgram === "'חכם בכיס'" && activeActivity === 'הסכנה שבמינוס' && activeSubActivity === 'סימולטור מינוס' ? (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-brand-dark-blue/70">עזרים ונספחים</p>
                  <h3 className="text-2xl font-bold text-brand-dark-blue">סימולטור מינוס</h3>
                  <p className="text-brand-dark-blue/60">אפקט כדור השלג מתוך פרק "הסכנה שבמינוס" במרחב התלמידים.</p>
                </div>
                <button
                  onClick={() => setActiveSubActivity(null)}
                  className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
                >
                  חזרה לחלון העזרים
                </button>
              </div>
              <OverdraftSimulator />
            </div>
          ) : activeModule === 'עזרים ונספחים' && activeProgram === "'חכם בכיס'" && activeActivity === 'הסכנה שבמינוס' ? (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-brand-dark-blue/70">עזרים ונספחים</p>
                  <h3 className="text-2xl font-bold text-brand-dark-blue">הסכנה שבמינוס</h3>
                  <p className="text-brand-dark-blue/60">בחרו חלונית עזר או הפעילו את סימולטור המינוס (אפקט כדור השלג).</p>
                </div>
                <button
                  onClick={() => { setActiveActivity(null); setActiveSubActivity(null); }}
                  className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
                >
                  חזרה לחומרי העזר
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <button
                  onClick={() => setActiveSubActivity('סימולטור מינוס')}
                  className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
                >
                  <p className="text-4xl mb-3">📉</p>
                  <p className="text-2xl font-bold text-brand-dark-blue">סימולטור מינוס</p>
                  <p className="text-brand-dark-blue/60 mt-3 text-lg">הפעלה ישירה של אפקט כדור השלג מתוך מרחב התלמידים.</p>
                </button>
                {(AIDS_LIBRARY['הסכנה שבמינוס'] || [])
                  .filter((aid) => aid.url !== '#overdraft-simulator')
                  .map((aid) => {
                    const thumb = getAidThumbnail(aid);
                    return (
                      <a
                        key={aid.fileId || aid.url}
                        href={aid.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-3xl overflow-hidden border-2 border-dashed border-gray-300 bg-white/90 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[12rem] flex flex-col"
                      >
                        <div className="relative h-40 bg-gradient-to-br from-rose-100 to-red-100 border-b-2 border-gray-200 overflow-hidden">
                          <div className="absolute inset-0 flex items-center justify-center text-6xl" style={{ display: thumb ? 'none' : undefined }}>{aid.fileIcon || '📄'}</div>
                          {thumb ? (
                            <img
                              src={thumb}
                              alt={`תצוגה מקדימה: ${aid.title}`}
                              className="relative z-10 w-full h-full object-cover"
                              loading="lazy"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : null}
                        </div>
                        <div className="p-5 flex-1 flex flex-col items-center justify-center">
                          <p className="text-xl font-bold text-brand-dark-blue">{aid.title}</p>
                          <p className="text-brand-dark-blue/60 mt-2 text-sm">{aid.description}</p>
                        </div>
                      </a>
                    );
                  })}
              </div>
            </div>
          ) : activeModule === 'עזרים ונספחים' && activeProgram === "'חכם בכיס'" && activeActivity === 'חיסכון והשקעות' && activeSubActivity === 'מחשבון ריבית דה-ריבית' ? (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-4">
              <CompoundInterestCalculator onBack={() => setActiveSubActivity(null)} />
            </div>
          ) : activeModule === 'עזרים ונספחים' && activeProgram === "'חכם בכיס'" && activeActivity === 'חיסכון והשקעות' && activeSubActivity === 'סימולטור השקעות' ? (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-4">
              <InvestmentSimulator onBack={() => setActiveSubActivity(null)} />
            </div>
          ) : activeModule === 'עזרים ונספחים' && activeProgram === "'חכם בכיס'" && activeActivity === 'חיסכון והשקעות' ? (
                <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-4">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div>
                      <p className="text-brand-dark-blue/70">עזרים ונספחים</p>
                      <h3 className="text-2xl font-bold text-brand-dark-blue">חיסכון והשקעות</h3>
                      <p className="text-brand-dark-blue/60">בחרו חלונית עזר או הפעילו את מחשבון הריבית דה-ריבית.</p>
                    </div>
                    <button
                      onClick={() => { setActiveActivity(null); setActiveSubActivity(null); }}
                      className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
                    >
                      חזרה לחומרי העזר
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <button
                      onClick={() => setActiveSubActivity('מחשבון ריבית דה-ריבית')}
                      className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
                    >
                      <p className="text-4xl mb-3">📈</p>
                      <p className="text-2xl font-bold text-brand-dark-blue">מחשבון ריבית דה-ריבית</p>
                      <p className="text-brand-dark-blue/60 mt-3 text-lg">חישוב צמיחת חיסכון עם ריבית דריבית והפקדות שוטפות.</p>
                    </button>
                    <button
                      onClick={() => setActiveSubActivity('סימולטור השקעות')}
                      className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
                    >
                      <p className="text-4xl mb-3">💹</p>
                      <p className="text-2xl font-bold text-brand-dark-blue">סימולטור השקעות</p>
                      <p className="text-brand-dark-blue/60 mt-3 text-lg">הדמיית תיק עם תשואה שנתית צפויה והפקדות שוטפות.</p>
                    </button>
                    {(AIDS_LIBRARY['חיסכון והשקעות'] || [])
                      .filter((aid) => !['#compound-interest', '#investment-simulator'].includes(aid.url))
                      .map((aid) => {
                        const thumb = getAidThumbnail(aid);
                        return (
                          <a
                            key={aid.fileId || aid.url}
                            href={aid.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-3xl overflow-hidden border-2 border-dashed border-gray-300 bg-white/90 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[12rem] flex flex-col"
                          >
                            <div className="relative h-40 bg-gradient-to-br from-green-100 to-emerald-100 border-b-2 border-gray-200 overflow-hidden">
                              <div className="absolute inset-0 flex items-center justify-center text-6xl" style={{ display: thumb ? 'none' : undefined }}>{aid.fileIcon || '📄'}</div>
                              {thumb ? (
                                <img
                                  src={thumb}
                                  alt={`תצוגה מקדימה: ${aid.title}`}
                                  className="relative z-10 w-full h-full object-cover"
                                  loading="lazy"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              ) : null}
                            </div>
                            <div className="p-5 flex-1 flex flex-col items-center justify-center">
                              <p className="text-xl font-bold text-brand-dark-blue">{aid.title}</p>
                              <p className="text-brand-dark-blue/60 mt-2 text-sm">{aid.description}</p>
                            </div>
                          </a>
                        );
                      })}
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
                {(AIDS_LIBRARY['פענוח תלוש שכר'] || []).map((aid) => {
                  const thumb = getAidThumbnail(aid);
                  return (
                    <a
                      key={aid.fileId}
                      href={aid.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-3xl overflow-hidden border-2 border-dashed border-gray-300 bg-white/90 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[12rem] flex flex-col"
                    >
                        <div className="relative h-40 bg-gradient-to-br from-orange-100 to-amber-100 border-b-2 border-gray-200 overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center text-6xl" style={{ display: thumb ? 'none' : undefined }}>{aid.fileIcon || '📄'}</div>
                        {thumb ? (
                          <img
                            src={thumb}
                            alt={`תצוגה מקדימה: ${aid.title}`}
                            className="relative z-10 w-full h-full object-cover"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const icon = e.currentTarget.previousElementSibling as HTMLElement | null;
                              if (icon) icon.style.display = 'flex';
                            }}
                          />
                        ) : null}
                      </div>
                      <div className="p-5 flex-1 flex flex-col items-center justify-center">
                        <p className="text-xl font-bold text-brand-dark-blue">{aid.title}</p>
                        <p className="text-brand-dark-blue/60 mt-2 text-sm">{aid.description}</p>
                      </div>
                    </a>
                  );
                })}
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
                {(AIDS_LIBRARY['זכויות עובדים'] || []).map((aid) => {
                  const thumb = getAidThumbnail(aid);
                  return (
                    <a
                      key={aid.fileId}
                      href={aid.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-3xl overflow-hidden border-2 border-dashed border-gray-300 bg-white/90 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[12rem] flex flex-col"
                    >
                        <div className="relative h-40 bg-gradient-to-br from-purple-100 to-pink-100 border-b-2 border-gray-200 overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center text-6xl" style={{ display: thumb ? 'none' : undefined }}>{aid.fileIcon || '📄'}</div>
                        {thumb ? (
                          <img
                            src={thumb}
                            alt={`תצוגה מקדימה: ${aid.title}`}
                            className="relative z-10 w-full h-full object-cover"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const icon = e.currentTarget.previousElementSibling as HTMLElement | null;
                              if (icon) icon.style.display = 'flex';
                            }}
                          />
                        ) : null}
                      </div>
                      <div className="p-5 flex-1 flex flex-col items-center justify-center">
                        <p className="text-xl font-bold text-brand-dark-blue">{aid.title}</p>
                        <p className="text-brand-dark-blue/60 mt-2 text-sm">{aid.description}</p>
                      </div>
                    </a>
                  );
                })}
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
              {(AIDS_LIBRARY[activeActivity || ''] || []).length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(AIDS_LIBRARY[activeActivity || ''] || []).map((aid) => {
                    const thumb = getAidThumbnail(aid);
                    return (
                      <a
                        key={aid.fileId || aid.url}
                        href={aid.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-3xl overflow-hidden border-2 border-dashed border-gray-300 bg-white/90 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[12rem] flex flex-col"
                      >
                        <div className="relative h-40 bg-gradient-to-br from-blue-100 to-teal-100 border-b-2 border-gray-200 overflow-hidden">
                          <div className="absolute inset-0 flex items-center justify-center text-6xl" style={{ display: thumb ? 'none' : undefined }}>{aid.fileIcon || '📄'}</div>
                          {thumb ? (
                            <img
                              src={thumb}
                              alt={`תצוגה מקדימה: ${aid.title}`}
                              className="relative z-10 w-full h-full object-cover"
                              loading="lazy"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : null}
                        </div>
                        <div className="p-5 flex-1 flex flex-col items-center justify-center">
                          <p className="text-xl font-bold text-brand-dark-blue">{aid.title}</p>
                          <p className="text-brand-dark-blue/60 mt-2 text-sm">{aid.description}</p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white/70 p-10 text-center text-brand-dark-blue/50 flex flex-col items-center justify-center min-h-[12rem]">
                  <p className="text-5xl mb-4">📂</p>
                  <p className="text-xl font-bold text-brand-dark-blue">חומרים לנושא זה יתווספו בקרוב</p>
                  <p className="text-base mt-2 text-brand-dark-blue/60">דפי עבודה, קבצים והדפסות עבור "{activeActivity}" יועלו להמשך.</p>
                </div>
              )}
            </div>
          ) : activeModule === 'סרטונים' && activeProgram === "'חכם בכיס'" && !activeActivity ? (
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
          ) : activeModule === 'סרטונים' && !activeActivity ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(PROGRAM_ACTIVITY_MODULES[activeProgram as keyof typeof PROGRAM_ACTIVITY_MODULES] || []).map((moduleName) => (
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
          ) : activeModule === 'סרטונים' ? (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-brand-dark-blue/70">סרטונים</p>
                  <h3 className="text-2xl font-bold text-brand-dark-blue">{activeActivity}</h3>
                  <p className="text-brand-dark-blue/60">{getSummary(activeActivity || '')}</p>
                </div>
                <button
                  onClick={() => setActiveActivity(null)}
                  className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
                >
                  חזרה לרשימת הנושאים
                </button>
              </div>
              {(VIDEO_LIBRARY[activeActivity || ''] || []).length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(VIDEO_LIBRARY[activeActivity || ''] || []).map((video) => {
                    const thumb = getVideoThumbnail(video);
                    return (
                      <a
                        key={video.url}
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-3xl overflow-hidden border-2 border-dashed border-gray-300 bg-white/90 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[12rem] flex flex-col"
                      >
                        {thumb ? (
                          <div className="relative">
                            <img src={thumb} alt={video.title} className="w-full h-44 object-cover" />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                              <div className="w-16 h-16 rounded-full bg-white/90 text-red-600 text-3xl flex items-center justify-center shadow-lg">▶</div>
                            </div>
                          </div>
                        ) : (
                          <div className="h-44 bg-slate-100 flex items-center justify-center text-5xl">🎬</div>
                        )}
                        <div className="p-5 flex-1 flex flex-col items-center justify-center">
                          <p className="text-2xl font-bold text-brand-dark-blue">{video.title}</p>
                          <p className="text-brand-dark-blue/60 mt-2 text-base">{video.description || 'פתיחה בחלון חדש'}</p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white/70 p-10 text-center text-brand-dark-blue/50 flex flex-col items-center justify-center min-h-[12rem]">
                  <p className="text-5xl mb-4">🎬</p>
                  <p className="text-xl font-bold text-brand-dark-blue">סרטונים לנושא זה יתווספו בקרוב</p>
                  <p className="text-base mt-2 text-brand-dark-blue/60">סרטוני הדרכה עבור &quot;{activeActivity}&quot; יועלו להמשך.</p>
                </div>
              )}
            </div>
          ) : activeModule === 'עזרים ונספחים' && !activeActivity ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(PROGRAM_ACTIVITY_MODULES[activeProgram as keyof typeof PROGRAM_ACTIVITY_MODULES] || []).map((moduleName) => (
                <button
                  key={moduleName}
                  onClick={() => { setActiveActivity(moduleName); setActiveSubActivity(null); }}
                  className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
                >
                  <p className="text-2xl font-bold text-brand-dark-blue">{moduleName}</p>
                  <p className="text-brand-dark-blue/60 mt-3 text-lg">{getSummary(moduleName)}</p>
                </button>
              ))}
            </div>
          ) : activeModule === 'עזרים ונספחים' && activeProgram === "'מה בכיס'" && activeActivity === 'צרכנות נבונה' && activeSubActivity === 'לוחות בינגו פיזיים' ? (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-brand-dark-blue/70">עזרים ונספחים</p>
                  <h3 className="text-2xl font-bold text-brand-dark-blue">לוחות בינגו פיזיים</h3>
                  <p className="text-brand-dark-blue/60">6 לוחות בינגו להדפסה, חלקו את הכיתה לקבוצות</p>
                </div>
                <button
                  onClick={() => setActiveSubActivity(null)}
                  className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
                >
                  חזרה לחלון העזרים
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {SMART_CONSUMERISM_BINGO_BOARDS.map((board) => {
                  const thumb = getDriveThumbnail(board.fileId);
                  return (
                    <a
                      key={board.fileId}
                      href={board.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-3xl overflow-hidden border-2 border-dashed border-gray-300 bg-white/90 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[12rem] flex flex-col"
                    >
                      <div className="relative h-40 bg-gradient-to-br from-teal-100 to-cyan-100 border-b-2 border-gray-200 overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center text-6xl" style={{ display: thumb ? 'none' : undefined }}>🧩</div>
                        {thumb ? (
                          <img
                            src={thumb}
                            alt={`תצוגה מקדימה: ${board.title}`}
                            className="relative z-10 w-full h-full object-cover"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const icon = e.currentTarget.previousElementSibling as HTMLElement | null;
                              if (icon) icon.style.display = 'flex';
                            }}
                          />
                        ) : null}
                      </div>
                      <div className="p-5 flex-1 flex flex-col items-center justify-center">
                        <p className="text-xl font-bold text-brand-dark-blue">{board.title}</p>
                        <p className="text-brand-dark-blue/60 mt-2 text-sm">לפתיחה ולהדפסה</p>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          ) : activeModule === 'עזרים ונספחים' && activeProgram === "'מה בכיס'" && activeActivity === 'צרכנות נבונה' ? (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-brand-dark-blue/70">עזרים ונספחים</p>
                  <h3 className="text-2xl font-bold text-brand-dark-blue">צרכנות נבונה</h3>
                  <p className="text-brand-dark-blue/60">שאלות ותשובות לבינגו נמצאים בתיקיית הנספחים ועזרים</p>
                </div>
                <button
                  onClick={() => { setActiveActivity(null); setActiveSubActivity(null); }}
                  className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
                >
                  חזרה לרשימת הנושאים
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveSubActivity('לוחות בינגו פיזיים')}
                  className="rounded-3xl border-2 border-dashed border-brand-teal bg-teal-50 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[12rem] flex flex-col items-center justify-center"
                >
                  <p className="text-4xl mb-3">🧩</p>
                  <p className="text-2xl font-bold text-brand-dark-blue">לוחות בינגו פיזיים</p>
                  <p className="text-brand-dark-blue/60 mt-3 text-lg">6 לוחות בינגו להדפסה, חלקו את הכיתה לקבוצות</p>
                </button>
                {(AIDS_LIBRARY['צרכנות נבונה'] || []).map((aid) => {
                  const thumb = getAidThumbnail(aid);
                  return (
                    <a
                      key={aid.fileId || aid.url}
                      href={aid.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-3xl overflow-hidden border-2 border-dashed border-gray-300 bg-white/90 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[12rem] flex flex-col"
                    >
                      <div className="relative h-40 bg-gradient-to-br from-slate-100 to-sky-100 border-b-2 border-gray-200 overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center text-6xl" style={{ display: thumb ? 'none' : undefined }}>{aid.fileIcon || '📄'}</div>
                        {thumb ? (
                          <img
                            src={thumb}
                            alt={`תצוגה מקדימה: ${aid.title}`}
                            className="relative z-10 w-full h-full object-cover"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : null}
                      </div>
                      <div className="p-5 flex-1 flex flex-col items-center justify-center">
                        <p className="text-xl font-bold text-brand-dark-blue">{aid.title}</p>
                        <p className="text-brand-dark-blue/60 mt-2 text-sm">{aid.description}</p>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          ) : activeModule === 'עזרים ונספחים' ? (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-brand-dark-blue/70">עזרים ונספחים</p>
                  <h3 className="text-2xl font-bold text-brand-dark-blue">{activeActivity}</h3>
                  <p className="text-brand-dark-blue/60">{getSummary(activeActivity || '')}</p>
                </div>
                <button
                  onClick={() => setActiveActivity(null)}
                  className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
                >
                  חזרה לרשימת הנושאים
                </button>
              </div>
              {(AIDS_LIBRARY[activeActivity || ''] || []).length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(AIDS_LIBRARY[activeActivity || ''] || []).map((aid) => {
                    const thumb = getAidThumbnail(aid);
                    return (
                      <a
                        key={aid.fileId || aid.url}
                        href={aid.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-3xl overflow-hidden border-2 border-dashed border-gray-300 bg-white/90 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[12rem] flex flex-col"
                      >
                        <div className="relative h-40 bg-gradient-to-br from-slate-100 to-sky-100 border-b-2 border-gray-200 overflow-hidden">
                          <div className="absolute inset-0 flex items-center justify-center text-6xl" style={{ display: thumb ? 'none' : undefined }}>{aid.fileIcon || '📄'}</div>
                          {thumb ? (
                            <img
                              src={thumb}
                              alt={`תצוגה מקדימה: ${aid.title}`}
                              className="relative z-10 w-full h-full object-cover"
                              loading="lazy"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                const icon = e.currentTarget.previousElementSibling as HTMLElement | null;
                                if (icon) icon.style.display = 'flex';
                              }}
                            />
                          ) : null}
                        </div>
                        <div className="p-5 flex-1 flex flex-col items-center justify-center">
                          <p className="text-xl font-bold text-brand-dark-blue">{aid.title}</p>
                          <p className="text-brand-dark-blue/60 mt-2 text-sm">{aid.description}</p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white/70 p-10 text-center text-brand-dark-blue/50 flex flex-col items-center justify-center min-h-[12rem]">
                  <p className="text-5xl mb-4">📂</p>
                  <p className="text-xl font-bold text-brand-dark-blue">חומרים לנושא זה יתווספו בקרוב</p>
                  <p className="text-base mt-2 text-brand-dark-blue/60">דפי עבודה, קבצים והדפסות עבור &quot;{activeActivity}&quot; יועלו להמשך.</p>
                </div>
              )}
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeProgram === "'כיסונים פיננסים'" && !activeSubActivity ? (
            /* Kisonim: game selection grid with icon + BLOOKET/KAHOOT/WORDWALL */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <button
                onClick={() => setActiveSubActivity('משחק אינטראקטיבי')}
                className="rounded-3xl border-2 border-dashed border-brand-teal bg-teal-50 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">{KISONIM_MODULE_INFO[activeActivity || '']?.icon || '🎯'}</p>
                <p className="text-2xl font-bold text-brand-dark-blue">משחק אינטראקטיבי</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">{KISONIM_MODULE_INFO[activeActivity || '']?.desc || 'פעילות אינטראקטיבית למודול זה.'}</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('BLOOKET')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">🎮</p>
                <p className="text-2xl font-bold text-brand-dark-blue">BLOOKET</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">חידוני Blooket למודול זה.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('KAHOOT')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">🎵</p>
                <p className="text-2xl font-bold text-brand-dark-blue">KAHOOT</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">חידוני Kahoot למודול זה.</p>
              </button>
              <button
                onClick={() => setActiveSubActivity('WORDWALL')}
                className="rounded-3xl border-2 border-dashed border-gray-300 bg-white/90 p-8 text-center shadow hover:-translate-y-1 hover:shadow-xl transition min-h-[14rem] flex flex-col items-center justify-center"
              >
                <p className="text-4xl mb-3">📝</p>
                <p className="text-2xl font-bold text-brand-dark-blue">WORDWALL</p>
                <p className="text-brand-dark-blue/60 mt-3 text-lg">חידוני Wordwall למודול זה.</p>
              </button>
              <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white/70 p-8 text-center text-brand-dark-blue/50 min-h-[14rem] flex flex-col items-center justify-center">
                <p className="text-2xl font-bold">פעילות נוספת</p>
                <p className="text-lg mt-2">בקרוב יתווסף תוכן נוסף.</p>
              </div>
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeProgram === "'כיסונים פיננסים'" && activeSubActivity === 'משחק אינטראקטיבי' ? (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-brand-dark-blue/70">פעילויות ומשחקים</p>
                  <h3 className="text-2xl font-bold text-brand-dark-blue">
                    {KISONIM_MODULE_INFO[activeActivity || '']?.icon} {activeActivity} — משחק אינטראקטיבי
                  </h3>
                </div>
                <button
                  onClick={() => setActiveSubActivity(null)}
                  className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
                >
                  חזרה לחלון המשחקים
                </button>
              </div>
              {activeActivity === 'מאיפה בא הכסף?' && <WhereMoneyComesFromModule onBack={() => setActiveSubActivity(null)} onComplete={() => {}} title="מאיפה בא הכסף?" />}
              {activeActivity === 'צרכים ורצונות' && <NeedsVsWantsModule onBack={() => setActiveSubActivity(null)} onComplete={() => {}} title="צרכים ורצונות" />}
              {activeActivity === 'הרפתקת חיסכון' && <SavingsAdventureModule onBack={() => setActiveSubActivity(null)} onComplete={() => {}} title="הרפתקת חיסכון" />}
              {activeActivity === 'חנות הקסמים' && <MagicStoreModule onBack={() => setActiveSubActivity(null)} onComplete={() => {}} title="חנות הקסמים" />}
              {activeActivity === 'בנק הקופות' && <JarBankModule onBack={() => setActiveSubActivity(null)} onComplete={() => {}} title="בנק הקופות" />}
              {activeActivity === 'סיור עולמי' && <WorldTourModule onBack={() => setActiveSubActivity(null)} onComplete={() => {}} title="סיור עולמי" />}
              {activeActivity === 'סודות הפרסום' && <AdSecretsModule onBack={() => setActiveSubActivity(null)} onComplete={() => {}} title="סודות הפרסום" />}
              {activeActivity === 'משימות הרווחה' && <KisonimEarningMissions onBack={() => setActiveSubActivity(null)} onComplete={() => {}} title="משימות הרווחה" />}
              {activeActivity === 'שוק צבעוני' && <ColorfulMarketModule onBack={() => setActiveSubActivity(null)} onComplete={() => {}} title="שוק צבעוני" />}
              {activeActivity === 'מטבעות ושטרות' && <CoinsVsBillsModule onBack={() => setActiveSubActivity(null)} onComplete={() => {}} title="מטבעות ושטרות" />}
              {activeActivity === 'כוח הנתינה' && <PowerOfGivingModule onBack={() => setActiveSubActivity(null)} onComplete={() => {}} title="כוח הנתינה" />}
              {activeActivity === 'החלטות קטנות' && <SmallDecisionsModule onBack={() => setActiveSubActivity(null)} onComplete={() => {}} title="החלטות קטנות" />}
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeProgram === "'כיסונים פיננסים'" && activeSubActivity === 'BLOOKET' ? (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-brand-dark-blue/70">פעילויות ומשחקים</p>
                  <h3 className="text-2xl font-bold text-brand-dark-blue">🎮 BLOOKET — {activeActivity}</h3>
                  <p className="text-brand-dark-blue/60">חידוני Blooket למודול זה. הוסיפו לינקים רלוונטיים כשיהיו מוכנים.</p>
                </div>
                <button onClick={() => setActiveSubActivity(null)} className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300">חזרה לחלון המשחקים</button>
              </div>
              <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white/70 p-10 text-center text-brand-dark-blue/50 flex flex-col items-center justify-center min-h-[12rem]">
                <p className="text-5xl mb-4">🎮</p>
                <p className="text-xl font-bold text-brand-dark-blue">קישורי Blooket יתווספו כאן</p>
                <p className="text-base mt-2 text-brand-dark-blue/60">עבור המודול: {activeActivity}</p>
              </div>
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeProgram === "'כיסונים פיננסים'" && activeSubActivity === 'KAHOOT' ? (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-brand-dark-blue/70">פעילויות ומשחקים</p>
                  <h3 className="text-2xl font-bold text-brand-dark-blue">🎵 KAHOOT — {activeActivity}</h3>
                  <p className="text-brand-dark-blue/60">חידוני Kahoot למודול זה. הוסיפו לינקים רלוונטיים כשיהיו מוכנים.</p>
                </div>
                <button onClick={() => setActiveSubActivity(null)} className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300">חזרה לחלון המשחקים</button>
              </div>
              <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white/70 p-10 text-center text-brand-dark-blue/50 flex flex-col items-center justify-center min-h-[12rem]">
                <p className="text-5xl mb-4">🎵</p>
                <p className="text-xl font-bold text-brand-dark-blue">קישורי Kahoot יתווספו כאן</p>
                <p className="text-base mt-2 text-brand-dark-blue/60">עבור המודול: {activeActivity}</p>
              </div>
            </div>
          ) : activeModule === 'פעילויות ומשחקים' && activeProgram === "'כיסונים פיננסים'" && activeSubActivity === 'WORDWALL' ? (
            <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-brand-dark-blue/70">פעילויות ומשחקים</p>
                  <h3 className="text-2xl font-bold text-brand-dark-blue">📝 WORDWALL — {activeActivity}</h3>
                  <p className="text-brand-dark-blue/60">חידוני Wordwall למודול זה. הוסיפו לינקים רלוונטיים כשיהיו מוכנים.</p>
                </div>
                <button onClick={() => setActiveSubActivity(null)} className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300">חזרה לחלון המשחקים</button>
              </div>
              <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white/70 p-10 text-center text-brand-dark-blue/50 flex flex-col items-center justify-center min-h-[12rem]">
                <p className="text-5xl mb-4">📝</p>
                <p className="text-xl font-bold text-brand-dark-blue">קישורי Wordwall יתווספו כאן</p>
                <p className="text-base mt-2 text-brand-dark-blue/60">עבור המודול: {activeActivity}</p>
              </div>
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