import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ModuleCard from './components/ModuleCard';
import { Module } from './types';
import BudgetModule from './components/modules/BudgetModule';
import SalaryModule from './components/modules/SalaryModule';
import RightsModule from './components/modules/RightsModule';
import InterestModule from './components/modules/InterestModule';
import OverdraftModule from './components/modules/OverdraftModule';
import ExpensesModule from './components/modules/ExpensesModule';
import ResearchModule from './components/modules/ResearchModule';
import FinalExam from './components/FinalExam';
import LinksModule from './components/modules/LinksModule';
// FIX: SelfEmployedModule now has a default export.
import SelfEmployedModule from './components/modules/SelfEmployedModule';
import LandingPage from './components/LandingPage';
import PlaceholderModule from './components/PlaceholderModule';
import MainLandingPage from './components/MainLandingPage';
import InstructorsPage from './components/InstructorsPage';
import ParentsPage from './components/ParentsPage';
import LoginPage from './components/LoginPage';
import StoryOfMoneyModule from './components/modules/StoryOfMoneyModule';
import MoneyAndMeModule from './components/modules/MoneyAndMeModule';
import HowMuchCostModule from './components/modules/HowMuchCostModule';
import MonopoliesModule from './components/modules/MonopoliesModule';
import SmartConsumerismModule from './components/modules/SmartConsumerismModule';
import RelationshipsMoneyModule from './components/modules/RelationshipsMoneyModule';
import HowToEarnModule from './components/modules/HowToEarnModule';
import TimeManagementModule from './components/modules/TimeManagementModule';
import PublicSpeakingModule from './components/modules/PublicSpeakingModule';
import BuildBusinessModule from './components/modules/BuildBusinessModule';
import { BudgetIcon, SalaryIcon, InterestIcon, OverdraftIcon, ExpensesIcon, ResearchIcon, LockIcon, TrophyIcon, RightsIcon, LinksIcon, SelfEmployedIcon, TimeIcon, PodiumIcon, BusinessIcon, PiggyBankIcon, HeartIcon, CoinIcon, GlobeIcon, StarIcon, StoreIcon } from './components/icons/Icons';
import WhereMoneyComesFromModule from './components/modules/kisonim/WhereMoneyComesFromModule';
import NeedsVsWantsModule from './components/modules/kisonim/NeedsVsWantsModule';
import SavingsAdventureModule from './components/modules/kisonim/SavingsAdventureModule';
import MagicStoreModule from './components/modules/kisonim/MagicStoreModule';
import JarBankModule from './components/modules/kisonim/JarBankModule';
import WorldTourModule from './components/modules/kisonim/WorldTourModule';
import AdSecretsModule from './components/modules/kisonim/AdSecretsModule';
import EarningMissionsModule from './components/modules/kisonim/EarningMissionsModule';
import ColorfulMarketModule from './components/modules/kisonim/ColorfulMarketModule';
import CoinsVsBillsModule from './components/modules/kisonim/CoinsVsBillsModule';
import PowerOfGivingModule from './components/modules/kisonim/PowerOfGivingModule';
import SmallDecisionsModule from './components/modules/kisonim/SmallDecisionsModule';

// --- Colorful Icons for Kisonim Program ---
const KisonimSalaryIcon: React.FC<{ className?: string }> = ({ className }) => ( <svg className={className} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="a" x1="32" x2="32" y1="8" y2="56" gradientUnits="userSpaceOnUse"><stop stopColor="#01b2cf" offset="0"/><stop stopColor="#00b1a6" offset="1"/></linearGradient></defs><rect width="48" height="48" x="8" y="8" fill="url(#a)" rx="6" ry="6"/><path fill="#fff" d="M24 20h16v4H24zM24 28h16v4H24zM24 36h10v4H24z"/><path fill="#fff" d="M40 40a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm-2 5h-2v2h2v-2zm2-1h-2v-2h2v2z"/></svg> );
const KisonimHeartIcon: React.FC<{ className?: string }> = ({ className }) => ( <svg className={className} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="b" x1="32" x2="32" y1="12" y2="55" gradientUnits="userSpaceOnUse"><stop stopColor="#f9a8d4" offset="0"/><stop stopColor="#d52963" offset="1"/></linearGradient></defs><path fill="url(#b)" d="M32 55.8l-3-2.7C14.2 39.5 6 32.3 6 23.8A11.8 11.8 0 0 1 17.8 12c3.5 0 6.8 1.6 9 4.2l5.2 5.2.2-.2c2.2-2.6 5.5-4.2 9-4.2A11.8 11.8 0 0 1 58 23.8c0 8.5-8.2 15.7-23 29.3z"/><path fill="#fff" fillOpacity=".3" d="M19 21a3 3 0 0 1 3-3 3.5 3.5 0 0 1 3.5 3.5c0 2-2 3.5-3.5 4.5s-3 .5-3-1z"/></svg> );
const KisonimPiggyBankIcon: React.FC<{ className?: string }> = ({ className }) => ( <svg className={className} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="c" x1="34" x2="34" y1="18" y2="50" gradientUnits="userSpaceOnUse"><stop stopColor="#fb7185" offset="0"/><stop stopColor="#d52963" offset="1"/></linearGradient><radialGradient id="d" cx="0" cy="0" r="1" gradientTransform="matrix(0 30 -22.5 0 32 24)" gradientUnits="userSpaceOnUse"><stop stopColor="#ffc107" offset="0"/><stop stopColor="#ff8f00" offset="1"/></radialGradient></defs><rect width="48" height="32" x="8" y="18" fill="url(#c)" rx="16" ry="16"/><circle cx="48" cy="26" r="5" fill="#f472b6"/><rect width="4" height="10" x="18" y="46" fill="#be185d" rx="2" ry="2"/><rect width="4" height="10" x="42" y="46" fill="#be185d" rx="2" ry="2"/><path d="M12 28a8 8 0 0 1 8-8" fill="none" stroke="#be185d" strokeWidth="4"/><circle cx="32" cy="24" r="15" fill="url(#d)"/><path fill="#fff" d="M32 15c-3.3 0-6 4-6 9s2.7 9 6 9 6-4 6-9-2.7-9-6-9zm0 15a3 3 0 0 1-3-3v-6a3 3 0 0 1 6 0v6a3 3 0 0 1-3 3z"/></svg> );
const KisonimStoreIcon: React.FC<{ className?: string }> = ({ className }) => ( <svg className={className} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path fill="#01b2cf" d="M56 58H8a4 4 0 0 1-4-4V24h56v30a4 4 0 0 1-4 4z"/><path fill="#fff" d="M60 24H4l-4-10h64z"/><path d="M60 14l-1.1 3-1.1-3-1.1 3-1.1-3-1.1 3-1.1-3-1.1 3-1.1-3-1.1 3-1.1-3-1.1 3-1.1-3-1.1 3-1.1-3-1.1 3-1.1-3-1.1 3-1.1-3-1.1 3-1.1-3-1.1 3-1.1-3-1.1 3-1.1-3-1.1 3-1.1-3-1.1 3-1.1-3-1.1 3-1.1-3-1.1 3-1.1-3-1.1 3-1.1-3-1.1 3-1.1-3-1.1 3-1.1-3L4 14" fill="#d52963"/><rect width="40" height="18" x="12" y="28" fill="#81d4fa" rx="2" ry="2"/><rect width="10" height="30" x="27" y="28" fill="#e0f2fe" rx="1" ry="1"/><circle cx="24" cy="50" r="2" fill="#d52963"/><circle cx="40" cy="50" r="2" fill="#d52963"/></svg> );
const KisonimBudgetIcon: React.FC<{ className?: string }> = ({ className }) => ( <svg className={className} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path fill="#00b1a6" d="M32 8a24 24 0 0 0 0 48V8z"/><path fill="#d52963" d="M32 8a24 24 0 0 0-17 41l17-17V8z"/><path fill="#01b2cf" d="M32 32v24a24 24 0 0 0 17-7z"/><circle cx="32" cy="32" r="8" fill="#fff"/></svg> );
const KisonimGlobeIcon: React.FC<{ className?: string }> = ({ className }) => ( <svg className={className} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="e" x1="32" x2="32" y1="6" y2="58" gradientUnits="userSpaceOnUse"><stop stopColor="#81d4fa" offset="0"/><stop stopColor="#01b2cf" offset="1"/></linearGradient></defs><circle cx="32" cy="32" r="26" fill="url(#e)"/><path fill="#a5d6a7" d="M42 18a10 10 0 0 0-10-10c-5.5 0-10 4.5-10 10a12 12 0 0 0 12 12c8 0 12-8 12-12zm-2 18c-4 4-10 6-16 4-6-2-8-8-6-14s8-8 14-6 8 8 6 14z"/><path fill="#fff" fillOpacity=".5" d="M22 28a10 10 0 0 1 10-10c1.5 0 3 .3 4.3.9A12 12 0 0 0 22 28z"/></svg> );
const KisonimResearchIcon: React.FC<{ className?: string }> = ({ className }) => ( <svg className={className} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="f" x1="28" x2="28" y1="10" y2="46" gradientUnits="userSpaceOnUse"><stop stopColor="#01b2cf" offset="0"/><stop stopColor="#d52963" offset="1"/></linearGradient></defs><circle cx="28" cy="28" r="18" fill="url(#f)"/><circle cx="28" cy="28" r="12" fill="#fff"/><path d="M40 40l14 14" stroke="#1b2550" strokeWidth="8" strokeLinecap="round"/><path fill="#fff" fillOpacity=".3" d="M28 16a12 12 0 0 0-8.5 3.5 12 12 0 0 0 17 8.5 12 12 0 0 0-8.5-12z"/></svg> );
const KisonimStarIcon: React.FC<{ className?: string }> = ({ className }) => ( <svg className={className} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g" x1="32" x2="32" y1="2" y2="62" gradientUnits="userSpaceOnUse"><stop stopColor="#ffca28" offset="0"/><stop stopColor="#ff8f00" offset="1"/></linearGradient></defs><path fill="url(#g)" d="M32 2l-7.5 22.8H2l19.5 14L14 62l18-14 18 14-7.5-23.2L62 24.8H40z"/><path fill="#fff" fillOpacity=".3" d="M32 2v34l-11.2 7.7 2.1-12.5-9-6.5h11.6z"/></svg> );
const KisonimExpensesIcon: React.FC<{ className?: string }> = ({ className }) => ( <svg className={className} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="h" x1="32" x2="32" y1="12" y2="36" gradientUnits="userSpaceOnUse"><stop stopColor="#81d4fa" offset="0"/><stop stopColor="#01b2cf" offset="1"/></linearGradient></defs><circle cx="18" cy="52" r="5" fill="#1b2550"/><circle cx="46" cy="52" r="5" fill="#1b2550"/><path d="M10 12h50l-8 24H18z" fill="url(#h)"/><path d="M14 16h40l-6 18H20z" fill="#e0f7fa"/><circle cx="22" cy="25" r="3" fill="#d52963"/><circle cx="32" cy="25" r="3" fill="#ffc107"/><circle cx="42" cy="25" r="3" fill="#4caf50"/><path d="M14 40h34" stroke="#1b2550" strokeWidth="4" strokeLinecap="round"/></svg> );
const KisonimCoinIcon: React.FC<{ className?: string }> = ({ className }) => ( <svg className={className} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="i" cx="0" cy="0" r="1" gradientTransform="matrix(0 20 -20 0 32 38)" gradientUnits="userSpaceOnUse"><stop stopColor="#e0e0e0" offset="0"/><stop stopColor="#9e9e9e" offset="1"/></radialGradient><radialGradient id="j" cx="0" cy="0" r="1" gradientTransform="matrix(0 20 -20 0 32 26)" gradientUnits="userSpaceOnUse"><stop stopColor="#ffecb3" offset="0"/><stop stopColor="#ffc107" offset="1"/></radialGradient></defs><circle cx="32" cy="38" r="20" fill="url(#i)"/><path d="M32 29a9 9 0 0 0 0 18" fill="none" stroke="#fff" strokeWidth="2"/><circle cx="32" cy="26" r="20" fill="url(#j)"/><path fill="#c77700" d="M32 17c-4 0-7 3-7 5s1 4 3 5v-3a2 2 0 1 1 4 0v3c2-1 3-3 3-5s-3-5-3-5zm-2 11h4v2h-4z"/></svg> );
const KisonimPodiumIcon: React.FC<{ className?: string }> = ({ className }) => ( <svg className={className} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path fill="#ffecb3" d="M24 22c-5 0-8 4-8 8s3 8 8 8c4 0 7-3 8-6h-8v-4h12c0-5-4-6-8-6z"/><path fill="#d52963" d="M50 38a12 12 0 0 1-12-12c0-5 3-9 7-11-5-1-10 2-10 8 0 7 6 12 13 12a13 13 0 0 0 2-1z"/><path fill="#f4a2b3" d="M22 22h-4v20h4z"/><path fill="#81d4fa" d="M42 22h4v20h-4z"/></svg> );
const KisonimBusinessIcon: React.FC<{ className?: string }> = ({ className }) => ( <svg className={className} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="k" cx="0" cy="0" r="1" gradientTransform="matrix(0 40 -32 0 32 32)" gradientUnits="userSpaceOnUse"><stop stopColor="#fff" offset=".5"/><stop stopColor="#ffc107" offset="1"/></radialGradient></defs><path d="M32 58C19.8 58 10 48.2 10 36s9.8-22 22-22 22 9.8 22 22-9.8 22-22 22z" fill="#ffc107"/><path d="M32 26V10" stroke="#ffc107" strokeWidth="8" strokeLinecap="round"/><circle cx="32" cy="32" r="20" fill="url(#k)"/><path d="M24 10h16" stroke="#ffc107" strokeWidth="8" strokeLinecap="round"/></svg> );


const hachamBakisModules: Module[] = [
  {
    id: 'budget',
    title: 'ניהול תקציב ראשון',
    description: 'בנו תקציב חודשי מאוזן באמצעות משימות אינטראקטיביות, ולמדו לנתח את ההוצאות שלכם. בסיום, הפיקו דו"ח PDF מסכם.',
    icon: BudgetIcon,
    component: BudgetModule,
    completionGoal: 'השלמת כל סעיפי ההוצאה הנדרשים והפקת דו"ח.'
  },
  {
    id: 'salary',
    title: 'פענוח תלוש שכר',
    description: 'גלו מה מסתתר בתלוש השכר שלכם! לחצו על כל רכיב בתלוש אינטראקטיבי כדי לקבל הסבר, ובחנו את הידע שלכם.',
    icon: SalaryIcon,
    component: SalaryModule,
    completionGoal: 'יש להשיג ציון של 80% ומעלה בבוחן המסכם.'
  },
  {
    id: 'rights',
    title: 'זכויות עובדים',
    description: 'הפכו ל"מגני זכויות"! פתרו "תיקים" משפטיים מהחיים האמיתיים, עזרו לדמויות לקבל את מה שמגיע להן, ולמדו על זכויותיכם בעבודה.',
    icon: RightsIcon,
    component: RightsModule,
    completionGoal: 'יש לפתור נכון לפחות 8 מתוך 10 תיקים.'
  },
  {
    id: 'selfEmployed',
    title: 'שכירים ועצמאיים',
    description: 'גלו את ההבדלים בין שכיר לעצמאי דרך משחקי מיון, בחנו תרחישים עסקיים, נתחו הוצאות של עסק, ובחנו את עצמכם עם מודל SWOT.',
    icon: SelfEmployedIcon,
    component: SelfEmployedModule,
    completionGoal: 'השלמת כל חמשת הפרקים במודול.'
  },
  {
    id: 'links',
    title: 'מסמכים וקישורים שימושיים',
    description: 'מאגר קישורים לאתרים, מחשבונים וכלים פיננסיים שיעזרו לכם להתנהל נכון עם הכסף שלכם. כולל בוחן קצר.',
    icon: LinksIcon,
    component: LinksModule,
  },
  {
    id: 'interest',
    title: 'חיסכון והשקעות',
    description: 'צאו ל"הרפתקה אל העושר"! למדו מהי השקעה, גלו את כוחה של ריבית דריבית, התנסו בסימולטור מניות, ובחנו את הידע שלכם.',
    icon: InterestIcon,
    component: InterestModule,
    completionGoal: 'יש להשיג ציון של 80% ומעלה בבוחן הידע.'
  },
  {
    id: 'overdraft',
    title: 'הסכנה שבמינוס (אוברדראפט)',
    description: 'גלו מהו מינוס ואיך הוא תופח בעזרת סימולטור אינטראקטיבי. שאלו את היועץ הפיננסי שאלות ובחנו את הידע שלכם.',
    icon: OverdraftIcon,
    component: OverdraftModule,
    completionGoal: 'יש להשיג ציון של 80% ומעלה בבוחן המסכם.'
  },
  {
    id: 'expenses',
    title: 'איך מנהלים הוצאות?',
    description: 'התמודדו עם "אתגר מיון ההוצאות"! למדו על סוגי הוצאות ומודל חצ"ר בחמישה שלבים, שחקו וסווגו הוצאות, והשתמשו בסורק המחירים.',
    icon: ExpensesIcon,
    component: ExpensesModule,
    completionGoal: 'השלמת שני משחקי המיון בהצלחה.'
  },
  {
    id: 'research',
    title: 'משימת למידת חקר',
    description: 'הפכו לבלשים פיננסיים! הבינו מהי אינפלציה, איך היא משפיעה על הכסף שלכם, ותרגלו חקר כלכלי עצמאי ברשת.',
    icon: ResearchIcon,
    component: ResearchModule,
    completionGoal: 'יש להשיג ציון של 80% ומעלה בבוחן הידע.'
  },
];

const maBakisModules: Module[] = [
  {
    id: 'story-of-money',
    title: 'סיפורו של כסף',
    description: 'גלו איך הכל התחיל! נצא למסע בזמן ונלמד על המצאת הכסף, סחר חליפין, ואיך הוא התפתח והפך למה שאנחנו מכירים היום.',
    icon: SalaryIcon,
    component: StoryOfMoneyModule,
    completionGoal: 'השלמת בוחן הידע בהצלחה.',
  },
  {
    id: 'money-and-me',
    title: 'הכסף ואני',
    description: 'בואו נכיר את מערכת היחסים האישית שלכם עם כסף. נלמד להציב מטרות, לתכנן תקציב, להבין מהו מינוס ואיך אפשר להרוויח את דמי הכיס הראשונים.',
    icon: BudgetIcon,
    component: MoneyAndMeModule,
    completionGoal: 'השלמת בוחן הידע בהצלחה.',
  },
  {
    id: 'how-much-cost',
    title: 'כמה זה עולה לי?',
    description: 'הצטרפו לחווית קניות וירטואלית! נלמד לקבל החלטות כלכליות חכמות, להתמודד עם פיתויים, ונבין איך המחירים נקבעים בחנויות.',
    icon: ExpensesIcon,
    component: HowMuchCostModule,
    completionGoal: 'השלמת בוחן הידע בהצלחה.',
  },
  {
    id: 'monopolies',
    title: 'מונופולים בישראל',
    description: 'מי שולט בשוק? נגלה מהו מונופול, איך הוא משפיע על המחירים שכולנו משלמים, ונלמד לזהות את השחקנים הגדולים במשק.',
    icon: SelfEmployedIcon,
    component: MonopoliesModule,
    completionGoal: 'השלמת חידון המונופולים בהצלחה.',
  },
  {
    id: 'smart-consumerism',
    title: 'צרכנות נבונה',
    description: 'אל תהיו פראיירים! במודול זה נלמד להיות צרכנים חכמים: נשווה מחירים, נזהה מבצעים משתלמים, ונבין איך לקנות יותר בפחות.',
    icon: ResearchIcon,
    component: SmartConsumerismModule,
    completionGoal: 'השלמת כל חמשת הפרקים.',
  },
  {
    id: 'relationships-money',
    title: 'מערכות יחסים וכסף',
    description: 'כסף הוא לא רק מספרים. נחקור איך כסף משפיע על מערכות היחסים שלנו עם חברים ומשפחה, ונרכוש כלים לתקשורת פתוחה ובריאה.',
    icon: RightsIcon,
    component: RelationshipsMoneyModule,
    completionGoal: 'השלמת כל שלושת הפרקים.',
  },
  {
    id: 'how-to-earn',
    title: 'איך להרוויח כסף?',
    description: 'רוצים להגדיל את דמי הכיס? גלו את החוזקות שלכם, קבלו רעיונות לעסקים קטנים, והתנסו בהתמודדות עם הלקוח הראשון שלכם.',
    icon: InterestIcon,
    component: HowToEarnModule,
    completionGoal: 'השלמת בוחן הידע.',
  },
  {
    id: 'time-management',
    title: 'ניהול זמן (זמן=כסף)',
    description: 'למדו טכניקות לניהול זמן חכם, קבעו סדרי עדיפויות, והבינו את הקשר בין זמן לכסף דרך משחקים וסימולציות.',
    icon: TimeIcon,
    component: TimeManagementModule,
    completionGoal: 'השלמת בוחן הסיום.',
  },
  {
    id: 'public-speaking',
    title: 'עמידה מול קהל',
    description: 'הביטחון לדבר מול אנשים הוא כלי להצלחה. נתרגל עמידה מול קהל, נלמד איך לשכנע, ונבין איך זה קשור ליכולת שלנו "למכור" רעיונות.',
    icon: PodiumIcon,
    component: PublicSpeakingModule,
    completionGoal: 'השלמת מחוון ההצלחה.',
  },
  {
    id: 'build-business',
    title: 'איך בונים עסק?',
    description: 'חלמתם פעם להקים עסק? נצא למסע השראה בעולם היזמות, נלמד איך לזהות הזדמנויות ולהפוך רעיון למציאות.',
    icon: BusinessIcon,
    component: BuildBusinessModule,
    completionGoal: 'השלמת התוכנית העסקית.',
  },
  {
    id: 'useful-docs',
    title: 'מסמכים שימושיים',
    description: 'כל המסמכים והקישורים שאתם צריכים במקום אחד. מטפסים חשובים ועד לאתרים שימושיים שיעזרו לכם להתנהל בעולם הפיננסי.',
    icon: LinksIcon,
    component: LinksModule,
  },
];

const kisonimModules: Module[] = [
  {
    id: 'where-money-comes-from',
    title: 'מאיפה בא הכסף?',
    description: 'נצא להרפתקה ונבין איך מבוגרים "משיגים" כסף. נשחק במשחק סימולציה בו כל אחד בוחר מקצוע ומקבל "משכורת" ראשונה.',
    icon: KisonimSalaryIcon,
    component: WhereMoneyComesFromModule,
    completionGoal: 'יש להתאים את כל הכלים לבעלי המקצוע.',
  },
  {
    id: 'needs-vs-wants',
    title: 'משחק צרכים ורצונות',
    description: 'מה חייבים ומה סתם רוצים? נשחק במשחק מיון צבעוני ונלמד להבדיל בין דברים שאנחנו באמת צריכים לדברים שפשוט כיף לקבל.',
    icon: KisonimHeartIcon,
    component: NeedsVsWantsModule,
    completionGoal: 'יש לסיים את משחק המיון בהצלחה.',
  },
  {
    id: 'savings-adventure',
    title: 'הרפתקת החיסכון',
    description: 'עזרו לסנאי המתוק לאסוף מטבעות זהב! נלמד לחסוך כסף למטרה גדולה וכיפית, כמו צעצוע חדש או טיול בפארק.',
    icon: KisonimPiggyBankIcon,
    component: SavingsAdventureModule,
    completionGoal: 'יש לאסוף את כל 10 הבלוטים.',
  },
  {
    id: 'magic-store',
    title: 'חנות המכולת הקסומה',
    description: 'יש לכם רשימת קניות ותקציב מוגבל. האם תצליחו לקנות את כל מה שצריך מבלי לבזבז יותר מדי? משחק סימולציה מהנה.',
    icon: KisonimStoreIcon,
    component: MagicStoreModule,
    completionGoal: 'יש להשלים את הקנייה בהצלחה.',
  },
  {
    id: 'jar-bank',
    title: 'בנק הצנצנות',
    description: 'נלמד לחלק את דמי הכיס שלנו לשלוש צנצנות קסומות: בזבוזים, חיסכון ונתינה. דרך פשוטה לנהל את הכסף הראשון שלנו.',
    icon: KisonimBudgetIcon,
    component: JarBankModule,
    completionGoal: 'יש לנצח במשחק איקס עיגול.',
  },
  {
    id: 'world-tour',
    title: 'מסע עולמי: מטבעות וארצות',
    description: 'בואו נכיר את הכסף של מדינות אחרות! נגלה איך נראים הדולר, האירו והיין, ונלמד על התרבויות שמאחוריהם.',
    icon: KisonimGlobeIcon,
    component: WorldTourModule,
    completionGoal: 'יש להתאים את כל המטבעות למדינות.',
  },
  {
    id: 'ad-secrets',
    title: 'סודות הפרסומות',
    description: 'למה אנחנו פתאום רוצים את הצעצוע שראינו בטלוויזיה? נגלה את הטריקים של הפרסומות ונלמד איך לקבל החלטות בעצמנו.',
    icon: KisonimResearchIcon,
    component: AdSecretsModule,
    completionGoal: 'יש לגלות את כל 4 סודות הפרסום.',
  },
  {
    id: 'earning-missions',
    title: 'משימות להרוויח כסף',
    description: 'נצא למשימות מיוחדות בבית ובסביבה (כמו סידור החדר או עזרה בגינה) ונבין איך עבודה שווה כסף.',
    icon: KisonimStarIcon,
    component: EarningMissionsModule,
    completionGoal: 'יש להשלים 10 משימות.',
  },
  {
    id: 'colorful-market',
    title: 'השוק הצבעוני',
    description: 'בואו נקים שוק! כל ילד יקבל דוכן למכור ולקנות מוצרים. נלמד על מחירים, משא ומתן, ואיך להיות מוכרים וקונים חכמים.',
    icon: KisonimExpensesIcon,
    component: ColorfulMarketModule,
    completionGoal: 'יש להשלים 3 סיבובי מכירה.',
  },
  {
    id: 'coins-vs-bills',
    title: 'מטבעות או שטרות?',
    description: 'כמה שווה כל מטבע? וכמה כל שטר? נשחק במשחק זיכרון ובתרגילים כיפיים כדי להכיר את הכסף שלנו מקרוב.',
    icon: KisonimCoinIcon,
    component: CoinsVsBillsModule,
    completionGoal: 'יש להשלים את כל סבבי ההתאמה.',
  },
  {
    id: 'power-of-giving',
    title: 'כוחה של נתינה',
    description: 'כסף יכול גם לעשות טוב לאחרים! נלמד על חשיבות התרומה והעזרה, ונחשוב יחד איך אנחנו יכולים לעזור לקהילה שלנו.',
    icon: KisonimPodiumIcon,
    component: PowerOfGivingModule,
    completionGoal: 'יש לבצע בחירה אחת.',
  },
  {
    id: 'small-decisions',
    title: 'סיפורי החלטות',
    description: 'דרך סיפורים אינטראקטיביים נראה איך החלטה קטנה היום (כמו לקנות ממתק או לחסוך) יכולה להשפיע על המחר שלנו.',
    icon: KisonimBusinessIcon,
    component: SmallDecisionsModule,
    completionGoal: 'יש להגיע לסוף הסיפור.',
  },
];

const programModules: Record<string, Module[]> = {
  'hacham-bakis': hachamBakisModules,
  'ma-bakis': maBakisModules,
  'kisonim': kisonimModules,
};

type AppState = 'user_selection' | 'student_login' | 'instructor_login' | 'parent_login' | 'program_selection' | 'instructors_page' | 'parents_page';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('user_selection');
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [visitedModules, setVisitedModules] = useState<Set<string>>(new Set());
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);

  useEffect(() => {
    const storedVisited = localStorage.getItem('visitedModules');
    if (storedVisited) {
      setVisitedModules(new Set(JSON.parse(storedVisited)));
    }
  }, []);

  const handleSelectProgram = (programId: string) => {
    setSelectedProgram(programId);
  };
  
  const handleSelectModule = (module: Module) => {
    setSelectedModule(module);
  };

  const handleBackToUserSelection = () => {
    setAppState('user_selection');
    setSelectedProgram(null);
  };
  
  const handleBackToProgramSelection = () => {
    setSelectedProgram(null);
    setAppState('program_selection');
  }

  const handleStudentLogin = (grade?: string) => {
    if (!grade) {
        setAppState('program_selection');
        setSelectedProgram(null); // Ensure no program is pre-selected
        return;
    }

    let programId = '';
    const highSchool = ['ט', 'י', 'י"א', 'י"ב'];
    const middleSchool = ['ה', 'ו', 'ז', 'ח'];
    const elementarySchool = ['א', 'ב', 'ג', 'ד'];

    if (highSchool.includes(grade)) {
        programId = 'hacham-bakis';
    } else if (middleSchool.includes(grade)) {
        programId = 'ma-bakis';
    } else if (elementarySchool.includes(grade)) {
        programId = 'kisonim';
    }

    if (programId) {
        setSelectedProgram(programId);
        // Fall through to render the module grid directly
    } else {
        alert('אנא בחר כיתה חוקית.');
    }
  };

  const handleBackFromModule = () => {
    setSelectedModule(null);
  };

  const handleModuleComplete = (moduleId: string) => {
    setVisitedModules(prev => {
      const newVisited = new Set(prev);
      newVisited.add(moduleId);
      localStorage.setItem('visitedModules', JSON.stringify(Array.from(newVisited)));
      return newVisited;
    });
  };

  const renderContent = () => {
    // If a program is selected, show its modules
    if (selectedProgram) {
         const currentProgramModules = programModules[selectedProgram] || [];
         const requiredModules = currentProgramModules.filter(m => m.completionGoal);
         

         if (selectedModule) {
            const ModuleComponent = selectedModule.component;
            return (
                <ModuleComponent 
                onBack={handleBackFromModule} 
                title={selectedModule.title}
                onComplete={() => handleModuleComplete(selectedModule.id)}
                />
            );
         }

        const completedRequiredCount = requiredModules.filter(m => visitedModules.has(m.id)).length;
        const progress = requiredModules.length > 0 ? (completedRequiredCount / requiredModules.length) * 100 : 0;
        const canTakeExam = progress >= 80;


        return (
            <>
                <Header />
                <button 
                  onClick={handleBackToProgramSelection}
                  className="mb-8 w-full sm:w-auto bg-brand-magenta hover:bg-pink-700 text-white font-bold py-2.5 sm:py-3 px-5 sm:px-8 text-base sm:text-2xl rounded-full flex items-center justify-center transition-colors duration-300"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H15a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                  חזרה לבחירת תוכנית
                </button>
                <main className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 ${selectedProgram === 'kisonim' ? 'kisonim-grid' : ''}`}>
                  {currentProgramModules.map(module => (
                    <ModuleCard
                      key={module.id}
                      title={module.title}
                      description={module.description}
                      icon={module.icon}
                      onClick={() => handleSelectModule(module)}
                      isVisited={visitedModules.has(module.id)}
                      completionGoal={module.completionGoal}
                    />
                  ))}
                   <div className="md:col-span-2 lg:col-span-3">
                        {requiredModules.length > 0 && (
                            <div className="mb-4 bg-white/60 p-4 rounded-2xl shadow-lg">
                                <h4 className="font-bold text-2xl text-center mb-2">התקדמות לקראת בוחן הסיום</h4>
                                <div className="w-full bg-gray-200 rounded-full h-8 border-2 border-white/50">
                                    <div 
                                        className="bg-brand-teal h-full rounded-full flex items-center justify-center text-white font-bold text-xl transition-all duration-500"
                                        style={{ width: `${progress}%` }}
                                    >
                                        {Math.round(progress)}%
                                    </div>
                                </div>
                            </div>
                        )}
                       
                       {(selectedProgram === 'hacham-bakis' || selectedProgram === 'ma-bakis' || selectedProgram === 'kisonim') && (
                           <button
                            onClick={() => handleSelectModule({ id: 'final-exam', title: 'בוחן סיום', description: '', icon: TrophyIcon, component: FinalExam })}
                            disabled={!canTakeExam}
                            className={`w-full p-4 md:p-6 rounded-3xl text-white font-bold text-lg sm:text-3xl transition-all duration-300 flex items-center justify-center gap-2 sm:gap-4 ${!canTakeExam ? 'bg-gray-400 cursor-not-allowed' : 'bg-brand-magenta hover:bg-pink-700 transform hover:-translate-y-1'}`}
                          >
                            <TrophyIcon className="w-8 h-8"/>
                            <span>
                                {canTakeExam ? "כל הכבוד! אפשר לגשת לבוחן הסיום" : "עליכם להשלים 80% מהנושאים כדי לגשת לבוחן"}
                            </span>
                            {!canTakeExam && <LockIcon className="w-8 h-8"/>}
                          </button>
                       )}
                  </div>
                </main>
            </>
        );
    }
    
    // Router for initial states
    switch(appState) {
        case 'user_selection':
            return (
                <MainLandingPage 
                    onSelectStudents={() => setAppState('student_login')}
                    onSelectInstructors={() => setAppState('instructor_login')}
                    onSelectParents={() => setAppState('parent_login')}
                />
            );
        case 'student_login':
            return (
                <LoginPage
                    userType="תלמידים"
                    description="ברוכים הבאים! בחרו את כיתתכם כדי שניקח אתכם לתוכנית הלמידה המתאימה לכם, או היכנסו כאורחים כדי לבחור תוכנית בעצמכם."
                    icon={RightsIcon}
                    onLogin={handleStudentLogin}
                    onBack={handleBackToUserSelection}
                    showGradeSelector={true}
                />
            );
        case 'instructor_login':
            return (
                <LoginPage
                    userType="מדריכים"
                    description="כאן תוכלו למצוא מערכי שיעור, עזרים, סרטונים ולעקוב אחר התקדמות הקבוצות שלכם."
                    icon={PodiumIcon}
                    onLogin={() => setAppState('instructors_page')}
                    onBack={handleBackToUserSelection}
                />
            );
        case 'parent_login':
             return (
                <LoginPage
                    userType="הורים"
                    description="עקבו אחר תהליך הלמידה של ילדכם וקבלו כלים ועזרים להמשך החינוך הפיננסי בבית."
                    icon={HeartIcon}
                    onLogin={() => setAppState('parents_page')}
                    onBack={handleBackToUserSelection}
                />
            );
        case 'program_selection':
             return (
                <LandingPage 
                    onSelectProgram={handleSelectProgram} 
                    onBack={handleBackToUserSelection}
                />
            );
        case 'instructors_page':
            return <InstructorsPage onBack={handleBackToUserSelection} />;
        case 'parents_page':
            return <ParentsPage onBack={handleBackToUserSelection} />;
        default:
             return (
                <MainLandingPage 
                    onSelectStudents={() => setAppState('student_login')}
                    onSelectInstructors={() => setAppState('instructor_login')}
                    onSelectParents={() => setAppState('parent_login')}
                />
            );
    }
  };
  
  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {renderContent()}
    </div>
  )
};

export default App;