import React, { useState, useEffect } from 'react';
import ModuleView from '../ModuleView';
import { TrophyIcon } from '../icons/Icons';

interface SalaryModuleProps {
  onBack: () => void;
  title: string;
  onComplete: () => void;
}

// --- Data Structures ---

const paySlipData = {
    details: {
        companyName: 'חברת הצלחה בע"מ',
        employeeName: 'ישראל ישראלי',
        employeeId: '123456789',
        payPeriod: 'אפריל 2024',
        startDate: '01/10/2022',
        bank: '12 (הפועלים)',
        branch: '612',
        account: '123456',
    },
    payments: {
        title: 'תשלומים (ברוטו)',
        items: [
            { name: 'שכר יסוד', quantity: 186.00, rate: 31.61, value: 5880.06 },
            { name: 'שעות נוספות 125%', quantity: 4.00, rate: 39.51, value: 158.04 },
            { name: 'שעות נוספות 150%', quantity: 3.00, rate: 47.42, value: 142.26 },
            { name: 'נסיעות', quantity: 1.00, rate: 400.00, value: 400.00 },
            { name: 'תמורת חופשה', quantity: 0.83, rate: 252.88, value: 209.89 },
            { name: 'הבראה חודשי', quantity: 1.00, rate: 174.17, value: 174.17 },
            { name: 'תמורה עבור ימי חג', quantity: 1.00, rate: 252.88, value: 252.88 },
            { name: 'מחלה', quantity: 1.00, rate: 252.88, value: 252.88 },
        ],
        total: 7470.18
    },
    deductions: {
        mandatory: {
            title: 'ניכויי חובה',
            items: [
                { name: 'מס הכנסה', value: 142.42 },
                { name: 'ביטוח לאומי', value: 29.88 },
                { name: 'דמי בריאות', value: 231.58 },
                { name: 'פנסיה', value: 424.21 },
            ],
            total: 828.09
        },
        voluntary: {
            title: 'ניכויי רשות',
            items: [
                 { name: 'קרן השתלמות', value: 176.75 },
            ],
            total: 176.75
        },
        total: 1004.84
    },
    summary: {
        netSalary: 6465.34,
    },
    informative: {
        marginalTax: 10.00,
        creditPoints: 2.25,
        employerPension: 459.56,
        employerStudyFund: 530.26,
    }
};

const termExplanations: Record<string, string> = {
    'שכר יסוד': 'השכר הבסיסי שלך לפני כל התוספות והניכויים, מחושב לפי שכר המינימום העדכני.',
    'שעות נוספות 125%': 'תשלום עבור שעות עבודה מעבר למשרה מלאה. על השעתיים הראשונות מקבלים תוספת של 25%.',
    'שעות נוספות 150%': 'תשלום עבור שעות עבודה נוספות מעבר לשעתיים הראשונות, עליהן מקבלים תוספת של 50%.',
    'נסיעות': 'החזר הוצאות נסיעה מהבית לעבודה ובחזרה, לפי תעריף הקבוע בחוק.',
    'תמורת חופשה': 'תשלום עבור ימי חופשה שניצלת.',
    'הבראה חודשי': 'תשלום שנתי שמטרתו לסייע לעובד לצאת לחופשה להתרעננות. לעיתים הוא מחולק לתשלומים חודשיים.',
    'תמורה עבור ימי חג': 'תשלום עבור ימי חג רשמיים שבהם לא עבדת.',
    'מחלה': 'תשלום עבור ימי מחלה שניצלת, בהתאם לאישור רפואי.',
    'סה"כ תשלומים (ברוטו)': 'סך כל התשלומים שמגיעים לך מהמעסיק לפני הורדת ניכויים כלשהם.',
    'מס הכנסה': 'מס המוטל על הכנסתך. מחושב לפי מדרגות מס ומופחת על ידי נקודות זיכוי אישיות.',
    'ביטוח לאומי': 'תשלום חובה למוסד לביטוח לאומי, המבטח אותך במקרים של אבטלה, פגיעה בעבודה, נכות, ומממן קצבאות.',
    'דמי בריאות': 'תשלום חובה המממן את מערכת הבריאות הציבורית ומאפשר לך לקבל שירותים רפואיים מקופת החולים.',
    'פנסיה': 'חיסכון חובה לגיל פרישה. חלק מהסכום מופרש על ידך וחלק על ידי המעסיק.',
    'קרן השתלמות': 'תוכנית חיסכון לטווח בינוני, בדרך כלל ל-6 שנים. זהו ניכוי רשות (לא חובה) והטבה נפוצה.',
    'סה"כ ניכויים': 'סך כל הסכומים שמנוכים משכר הברוטו שלך.',
    'נטו לתשלום': 'הסכום הסופי שייכנס לחשבון הבנק שלך, אחרי שכל הניכויים ירדו משכר הברוטו.',
    'מס שולי': 'אחוז המס הגבוה ביותר שאתה משלם. הוא חל רק על החלק העליון של השכר שלך, שנכנס למדרגת המס הגבוהה ביותר שלך.',
    'נקודות זיכוי': 'הטבה המפחיתה את סכום מס ההכנסה שעליך לשלם. כל תושב זכאי למספר נקודות בסיסי, וישנן נקודות נוספות למצבים שונים.',
    'קופ"ג מעביד': 'הסכום שהמעסיק שלך מפריש עבורך לקופת הגמל או לקרן הפנסיה, בנוסף לחלק שאתה מפריש בעצמך.',
    'קה"ל מעביד': 'הסכום שהמעסיק שלך מפריש עבורך לקרן ההשתלמות, בנוסף לחלק שלך.'
};

const quizQuestions = [
    { question: "מהו סכום ה'נטו לתשלום' המעודכן?", options: ["7,470.18 ₪", "6,465.34 ₪", "1,004.84 ₪", "5,880.06 ₪"], answer: "6,465.34 ₪" },
    { question: "מהו סך התשלומים ברוטו המעודכן?", options: ["6,465.34 ₪", "1,004.84 ₪", "7,470.18 ₪", "8,000.00 ₪"], answer: "7,470.18 ₪" },
    { question: "כמה כסף נוכה עבור 'ביטוח לאומי'?", options: ["231.58 ₪", "424.21 ₪", "29.88 ₪", "142.42 ₪"], answer: "29.88 ₪" },
    { question: "מהו 'שכר היסוד' של העובד, המבוסס על שכר מינימום?", options: ["7,470.18 ₪", "6,465.34 ₪", "5,880.06 ₪", "4,650.00 ₪"], answer: "5,880.06 ₪" },
    { question: "מהו 'המס השולי' של העובד באחוזים?", options: ["2.25%", "14%", "10%", "20%"], answer: "10%" },
    { question: "כמה 'נקודות זיכוי' יש לעובד?", options: ["10", "2.25", "1", "אין מידע"], answer: "2.25" },
    { question: "איזה מהבאים הוא 'ניכוי רשות' ולא חובה?", options: ["מס הכנסה", "דמי בריאות", "קרן השתלמות", "פנסיה"], answer: "קרן השתלמות" },
    { question: "מהו הסכום הכולל של 'ניכויי החובה' (כולל מס הכנסה)?", options: ["176.75 ₪", "1,004.84 ₪", "828.09 ₪", "685.67 ₪"], answer: "828.09 ₪" },
    { question: "מהו הסכום הכולל שהמעסיק הפריש עבור העובד לפנסיה ולקרן השתלמות?", options: ["530.26 ₪", "459.56 ₪", "989.82 ₪", "1,004.84 ₪"], answer: "989.82 ₪" },
    { question: "אם העובד היה מוותר על 'קרן השתלמות', בכמה בערך היה גדל הנטו שלו (בהתעלם מהשפעת המס)?", options: ["ב-176.75 ₪", "ב-530.26 ₪", "ב-707.01 ₪", "הנטו לא היה משתנה"], answer: "ב-176.75 ₪" },
];

// --- Sub-components ---

const CheckIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
);

const CrossIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const InfoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 text-gray-400 group-hover:text-brand-light-blue transition-colors ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);


const Tooltip: React.FC<{ text: string; explanation: string; children: React.ReactNode; className?: string }> = ({ text, explanation, children, className }) => (
    <div className={`relative group ${className || ''}`}>
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-96 bg-brand-dark-blue text-white text-xl rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 shadow-lg text-right">
        <p className="font-bold text-2xl">{text}</p>
        <p>{explanation}</p>
        <div className="absolute top-full left-1/2 -ml-2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-brand-dark-blue"></div>
      </div>
    </div>
);

const PaymentsTable: React.FC<{
    title: string;
    items: { name: string; quantity?: number | string; rate?: number | string; value: number }[];
    total?: { name: string; value: number };
}> = ({ title, items, total }) => {
    return (
        <div className="border border-gray-300 rounded-lg p-2 text-2xl">
            <div className="font-bold text-3xl text-center bg-gray-200 rounded-t-md p-2">{title}</div>
            <div className="grid grid-cols-10 gap-2 p-1 font-bold border-b border-gray-300 text-xl">
                <span className="text-right col-span-4">תאור</span>
                <span className="text-center col-span-2">כמות</span>
                <span className="text-center col-span-2">תעריף</span>
                <span className="text-left col-span-2">סה"כ</span>
            </div>
            {items.map(item => (
                 <div key={item.name} className="grid grid-cols-10 gap-2 p-1 hover:bg-gray-100 rounded items-center">
                    <Tooltip className="col-span-4" text={item.name} explanation={termExplanations[item.name] || ''}>
                      <span className="flex items-center gap-1.5 text-right cursor-pointer">{item.name} <InfoIcon /></span>
                    </Tooltip>
                    <span className="text-center font-mono col-span-2">{item.quantity ? (typeof item.quantity === 'number' ? item.quantity.toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : item.quantity) : ''}</span>
                    <span className="text-center font-mono col-span-2">{item.rate ? (typeof item.rate === 'number' ? item.rate.toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : item.rate) : ''}</span>
                    <span className="text-left font-mono col-span-2">{item.value.toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
            ))}
            {total && (
                <Tooltip text={total.name} explanation={termExplanations[total.name] || ''}>
                    <div className="grid grid-cols-10 gap-2 p-1 font-bold border-t border-gray-400 mt-1 pt-1 text-3xl">
                        <span className="flex items-center gap-1.5 text-right col-span-8 cursor-pointer">{total.name} <InfoIcon /></span>
                        <span className="text-left font-mono col-span-2">{total.value.toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                </Tooltip>
            )}
        </div>
    );
};

const DeductionsTable: React.FC<{
    title: string;
    items: { name: string; value: number }[];
}> = ({ title, items }) => (
    <div className="border border-gray-300 rounded-lg p-2 h-full flex flex-col text-2xl">
        <div className="font-bold text-3xl text-center bg-gray-200 rounded-t-md p-2">{title}</div>
        <div className="grid grid-cols-2 gap-2 p-1 font-bold border-b border-gray-300 text-xl">
            <span className="text-right">תאור</span>
            <span className="text-left">סה"כ</span>
        </div>
        <div className="flex-grow">
            {items.map(item => (
                <div key={item.name} className="grid grid-cols-2 gap-2 p-1 hover:bg-gray-100 rounded items-center">
                    <Tooltip text={item.name} explanation={termExplanations[item.name] || ''}>
                        <span className="flex items-center gap-1.5 text-right cursor-pointer">{item.name} <InfoIcon /></span>
                    </Tooltip>
                    <span className="text-left font-mono">{item.value.toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
            ))}
        </div>
    </div>
);

const InfoRow: React.FC<{ term: string, value: string | number }> = ({ term, value }) => (
    <Tooltip text={term} explanation={termExplanations[term] || ''}>
        <div className="flex justify-between items-center cursor-pointer">
            <span className="flex items-center gap-1.5">{term} <InfoIcon /></span>
            <span className="font-mono text-left">{typeof value === 'number' ? value.toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : value}</span>
        </div>
    </Tooltip>
);

// ─── Step 0 — Explanation ─────────────────────────────────────────────────────

const ExplainStep: React.FC = () => {
  const concepts = [
    { icon: '💼', title: 'מה זה תלוש שכר?',  color: 'from-brand-teal to-teal-600',       text: 'מסמך חודשי שהמעסיק חייב למסור לכל עובד. הוא מפרט כמה הרווחת, כמה נוכה ומה תקבל בפועל.' },
    { icon: '💰', title: 'ברוטו (Gross)',       color: 'from-green-500 to-emerald-600',     text: 'השכר לפני שמורידים ניכויים. כולל שכר יסוד + שעות נוספות + תוספות (נסיעות, הבראה, חג).' },
    { icon: '🏦', title: 'נטו (Net)',           color: 'from-brand-light-blue to-cyan-600', text: 'מה שנכנס לחשבון הבנק שלך בפועל. חישוב: ברוטו − כל הניכויים.' },
    { icon: '📉', title: 'ניכויי חובה',        color: 'from-red-500 to-rose-600',          text: 'מנוכים לפי חוק ואין לך שליטה: מס הכנסה, ביטוח לאומי, דמי בריאות ופנסיה.' },
    { icon: '🔧', title: 'ניכויי רשות',        color: 'from-purple-500 to-violet-600',     text: 'ניכויים שהעובד בחר, כגון קרן השתלמות. בדרך כלל משתלמים — המעסיק מפריש מנגד.' },
    { icon: '⏰', title: 'שעות נוספות',        color: 'from-orange-500 to-amber-600',      text: 'שעתיים ראשונות = 125% מהתעריף. מהשעה השלישית ואילך = 150% מהתעריף.' },
  ];

  return (
    <div className="space-y-8 animate-fade-in" dir="rtl">
      <div className="text-center">
        <div className="text-6xl mb-3">📋</div>
        <h2 className="text-4xl font-black text-brand-dark-blue mb-2">הסבר: מה זה תלוש שכר?</h2>
        <p className="text-2xl text-brand-dark-blue/70 max-w-3xl mx-auto">
          כל עובד שכיר מקבל מדי חודש תלוש שכר. בפרק זה נלמד להבין כל שדה בתלוש — ומה הוא אומר על הכסף שלנו.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {concepts.map(c => (
          <div key={c.title} className="rounded-2xl overflow-hidden shadow-lg bg-white/80 border border-white/60">
            <div className={`bg-gradient-to-l ${c.color} p-4 flex items-center gap-3`}>
              <span className="text-4xl">{c.icon}</span>
              <h3 className="text-2xl font-black text-white">{c.title}</h3>
            </div>
            <p className="p-4 text-xl text-brand-dark-blue/80 leading-relaxed">{c.text}</p>
          </div>
        ))}
      </div>
      <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl p-6">
        <h3 className="text-2xl font-bold text-center text-brand-dark-blue mb-6">📊 איך מחשבים משכורת?</h3>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {[
            { label: 'שכר יסוד + תוספות', color: '#22c55e' },
            { label: '⟶', plain: true },
            { label: 'ברוטו', color: '#3b82f6' },
            { label: '−', plain: true },
            { label: 'ניכויים', color: '#ef4444' },
            { label: '=', plain: true },
            { label: 'נטו ✓', color: '#8b5cf6' },
          ].map((s, i) =>
            s.plain
              ? <span key={i} className="text-3xl font-black text-brand-dark-blue/40">{s.label}</span>
              : <div key={i} className="w-40 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg text-center px-2" style={{ background: s.color }}>{s.label}</div>
          )}
        </div>
      </div>
      <div className="bg-gradient-to-l from-brand-teal to-brand-light-blue p-5 rounded-2xl text-white text-center shadow-xl">
        <p className="text-2xl mb-1 opacity-90">הנוסחה החשובה ביותר:</p>
        <p className="text-3xl font-black">ברוטו − ניכויים = נטו ✓</p>
      </div>
      <div className="text-center">
        <a href="https://drive.google.com/file/d/1CSZIJ6X52bBW2WZGrigtpWusrBCYh4uu/view?usp=sharing"
           target="_blank" rel="noopener noreferrer"
           className="inline-block bg-white/70 border-2 border-brand-teal text-brand-teal font-bold py-2 px-5 rounded-xl hover:bg-brand-teal/10 transition-colors text-xl">
          📄 לדוגמת תלוש שכר אמיתי
        </a>
      </div>
    </div>
  );
};

// ─── Shared real pay-slip document ───────────────────────────────────────────
// Used by both Step 1 (read-only with tooltips) and Step 2 (fill-in).
// Each cell that needs a value receives either a plain formatted string
// or a React node (e.g. an <input>) via the `cell` prop.

interface SlipRowData {
  name: string;
  qty:  React.ReactNode;
  rate: React.ReactNode;
  amt:  React.ReactNode;
  tooltip?: string;
}
interface DedRowData {
  name: string;
  amt:  React.ReactNode;
  tooltip?: string;
}

const fmtNum = (n: number) => n.toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ── reusable cell that shows a tooltip on its label ──
const LabelCell: React.FC<{ label: string; tip?: string }> = ({ label, tip }) => {
  if (!tip) return <span>{label}</span>;
  return (
    <Tooltip text={label} explanation={tip}>
      <span className="flex items-center gap-1 cursor-pointer">{label} <InfoIcon /></span>
    </Tooltip>
  );
};

// ── professional slip shell — same markup in both steps ──
const SlipShell: React.FC<{
  companyName: string;
  employeeName: string;
  employeeId: string;
  role: string;
  startDate: string;
  period: string;
  bank: string;
  branch: string;
  account: string;
  paymentRows: SlipRowData[];
  grossCell: React.ReactNode;
  mandatoryRows: DedRowData[];
  voluntaryRows: DedRowData[];
  totalDedCell: React.ReactNode;
  netCell: React.ReactNode;
  marginalTax: string;
  creditPoints: string;
  employerPension: string;
  employerStudyFund: string;
}> = ({
  companyName, employeeName, employeeId, role, startDate, period,
  bank, branch, account,
  paymentRows, grossCell,
  mandatoryRows, voluntaryRows,
  totalDedCell, netCell,
  marginalTax, creditPoints, employerPension, employerStudyFund,
}) => (
  <div dir="rtl" className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden text-gray-800 font-sans">

    {/* ── Header bar ── */}
    <div className="bg-slate-800 text-white px-6 py-4 flex items-center justify-between">
      <div>
        <p className="text-3xl font-black tracking-wide">{companyName}</p>
        <p className="text-xl text-slate-300 mt-0.5">תלוש משכורת</p>
      </div>
      <div className="text-left">
        <p className="text-xl text-slate-300">תקופת שכר</p>
        <p className="text-2xl font-bold">{period}</p>
      </div>
    </div>

    {/* ── Employee details ── */}
    <div className="grid grid-cols-3 gap-0 border-b border-gray-300 text-xl">
      {[
        ['שם עובד', employeeName],
        ['ת.ז', employeeId],
        ['תפקיד', role],
        ['תאריך תחילת עבודה', startDate],
        ['בנק', bank],
        ['סניף / חשבון', `${branch} / ${account}`],
      ].map(([k, v]) => (
        <div key={k} className="border-l border-b border-gray-200 px-4 py-2 last:border-l-0">
          <p className="text-gray-500 text-lg">{k}</p>
          <p className="font-semibold">{v}</p>
        </div>
      ))}
    </div>

    {/* ── Payments table ── */}
    <div className="px-4 pt-4 pb-2">
      <p className="text-xl font-black text-slate-700 bg-slate-100 rounded-lg px-3 py-1.5 mb-1">תשלומים</p>
      <table className="w-full text-xl border-collapse">
        <thead>
          <tr className="border-b-2 border-slate-300 text-gray-500 text-lg">
            <th className="text-right py-1.5 font-semibold pl-2 w-2/5">תיאור</th>
            <th className="text-center py-1.5 font-semibold w-1/5">כמות / שעות</th>
            <th className="text-center py-1.5 font-semibold w-1/5">תעריף</th>
            <th className="text-left py-1.5 font-semibold pr-2 w-1/5">סכום ₪</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {paymentRows.map((r, i) => (
            <tr key={i} className="hover:bg-slate-50 transition-colors">
              <td className="py-2 pl-2"><LabelCell label={r.name} tip={r.tooltip} /></td>
              <td className="py-2 text-center font-mono">{r.qty}</td>
              <td className="py-2 text-center font-mono">{r.rate}</td>
              <td className="py-2 text-left pr-2 font-mono font-semibold">{r.amt}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-slate-400 bg-slate-50">
            <td colSpan={3} className="py-2 pl-2 font-black text-slate-700">
              <LabelCell label='סה"כ תשלומים (ברוטו)' tip={termExplanations['סה"כ תשלומים (ברוטו)']} />
            </td>
            <td className="py-2 text-left pr-2 font-black font-mono text-lg">{grossCell}</td>
          </tr>
        </tfoot>
      </table>
    </div>

    {/* ── Deductions – side by side ── */}
    <div className="grid grid-cols-2 gap-0 px-4 pb-2">
      {/* Mandatory */}
      <div className="border-l border-gray-200 pl-2">
        <p className="text-xl font-black text-slate-700 bg-red-50 rounded-lg px-3 py-1.5 mb-1">ניכויי חובה</p>
        <table className="w-full text-xl border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-gray-500 text-lg">
              <th className="text-right py-1 font-semibold">תיאור</th>
              <th className="text-left py-1 font-semibold">סכום ₪</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {mandatoryRows.map((r, i) => (
              <tr key={i} className="hover:bg-red-50/40 transition-colors">
                <td className="py-1.5"><LabelCell label={r.name} tip={r.tooltip} /></td>
                <td className="py-1.5 text-left font-mono">{r.amt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Voluntary */}
      <div className="pr-2">
        <p className="text-xl font-black text-slate-700 bg-purple-50 rounded-lg px-3 py-1.5 mb-1">ניכויי רשות</p>
        <table className="w-full text-xl border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-gray-500 text-lg">
              <th className="text-right py-1 font-semibold">תיאור</th>
              <th className="text-left py-1 font-semibold">סכום ₪</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {voluntaryRows.map((r, i) => (
              <tr key={i} className="hover:bg-purple-50/40 transition-colors">
                <td className="py-1.5"><LabelCell label={r.name} tip={r.tooltip} /></td>
                <td className="py-1.5 text-left font-mono">{r.amt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* ── Total deductions bar ── */}
    <div className="mx-4 border-t-2 border-slate-400 py-2 flex justify-between items-center text-xl font-black text-slate-700 bg-slate-50 rounded-b-lg px-3 mb-2">
      <LabelCell label='סה"כ ניכויים' tip={termExplanations['סה"כ ניכויים']} />
      <span className="font-mono text-red-700">{totalDedCell}</span>
    </div>

    {/* ── Net pay bar ── */}
    <div className="mx-4 mb-4 bg-slate-800 text-white rounded-xl px-5 py-4 flex justify-between items-center">
      <span className="text-2xl font-black flex items-center gap-2">
        <LabelCell label="נטו לתשלום" tip={termExplanations['נטו לתשלום']} />
      </span>
      <span className="text-3xl font-black font-mono">{netCell}</span>
    </div>

    {/* ── Informative footer ── */}
    <div className="grid grid-cols-2 gap-0 border-t border-gray-200 text-xl bg-gray-50 px-4 py-3">
      <div className="border-l border-gray-200 pl-2 space-y-1">
        <p className="font-bold text-gray-500 text-lg">נתונים נוספים</p>
        <div className="flex justify-between"><LabelCell label="מס שולי" tip={termExplanations['מס שולי']} /><span className="font-mono">{marginalTax}</span></div>
        <div className="flex justify-between"><LabelCell label="נקודות זיכוי" tip={termExplanations['נקודות זיכוי']} /><span className="font-mono">{creditPoints}</span></div>
      </div>
      <div className="pr-2 space-y-1">
        <p className="font-bold text-gray-500 text-lg">הפרשות מעביד</p>
        <div className="flex justify-between"><LabelCell label='קופ"ג מעביד' tip={termExplanations['קופ"ג מעביד']} /><span className="font-mono">{employerPension}</span></div>
        <div className="flex justify-between"><LabelCell label='קה"ל מעביד' tip={termExplanations['קה"ל מעביד']} /><span className="font-mono">{employerStudyFund}</span></div>
      </div>
    </div>
  </div>
);

// ─── Step 1 — Interactive pay slip (full‑width) ───────────────────────────────

const PaySlipStep: React.FC = () => {
  const d = paySlipData;
  const payRows: SlipRowData[] = d.payments.items.map(it => ({
    name: it.name,
    qty:  fmtNum(it.quantity as number),
    rate: fmtNum(it.rate as number),
    amt:  fmtNum(it.value),
    tooltip: termExplanations[it.name],
  }));
  const mandRows: DedRowData[] = d.deductions.mandatory.items.map(it => ({
    name: it.name, amt: fmtNum(it.value), tooltip: termExplanations[it.name],
  }));
  const volRows: DedRowData[] = d.deductions.voluntary.items.map(it => ({
    name: it.name, amt: fmtNum(it.value), tooltip: termExplanations[it.name],
  }));

  return (
    <div className="space-y-4 animate-fade-in" dir="rtl">
      <div className="text-center mb-2">
        <h2 className="text-3xl font-bold text-brand-dark-blue mb-1">תלוש שכר אינטראקטיבי</h2>
        <p className="text-xl text-brand-dark-blue/70">עברו עם העכבר על כל שם שדה עם ⓘ כדי לקבל הסבר מפורט.</p>
      </div>
      <SlipShell
        companyName={d.details.companyName}
        employeeName={d.details.employeeName}
        employeeId={d.details.employeeId}
        role="עובד שכיר"
        startDate={d.details.startDate}
        period={d.details.payPeriod}
        bank={d.details.bank}
        branch={d.details.branch}
        account={d.details.account}
        paymentRows={payRows}
        grossCell={fmtNum(d.payments.total)}
        mandatoryRows={mandRows}
        voluntaryRows={volRows}
        totalDedCell={fmtNum(d.deductions.total)}
        netCell={fmtNum(d.summary.netSalary)}
        marginalTax={`${d.informative.marginalTax.toFixed(2)}%`}
        creditPoints={String(d.informative.creditPoints)}
        employerPension={fmtNum(d.informative.employerPension)}
        employerStudyFund={fmtNum(d.informative.employerStudyFund)}
      />
    </div>
  );
};

// ─── Step 2 — multi-case fill-in exercise ────────────────────────────────────

// ── Case 1: אילנית — שעות נוספות ⭐ ──────────────────────────────────────────
const C1_HOURLY=40, C1_REG_H=156, C1_OT125_H=7, C1_OT150_H=6, C1_TRAVEL=350;
const C1_BASE         = C1_HOURLY * C1_REG_H;                              // 6240
const C1_OT125_RATE   = C1_HOURLY * 1.25;                                  // 50
const C1_OT125        = C1_OT125_H * C1_OT125_RATE;                       // 350
const C1_OT150_RATE   = C1_HOURLY * 1.5;                                   // 60
const C1_OT150        = C1_OT150_H * C1_OT150_RATE;                       // 360
const C1_GROSS        = C1_BASE + C1_OT125 + C1_OT150 + C1_TRAVEL;        // 7300
const C1_TAX=209.50, C1_BI=243.25, C1_HEALTH=215.45;
const C1_PENSION      = parseFloat((C1_BASE*0.06).toFixed(2));                      // 374.40 — פנסיה על שכר יסוד בלבד (שע"נ משתנות אינן בבסיס לפנסיה)
const C1_TOTAL_DED    = parseFloat((C1_TAX+C1_BI+C1_HEALTH+C1_PENSION).toFixed(2));
const C1_NET          = parseFloat((C1_GROSS-C1_TOTAL_DED).toFixed(2));

// ── Case 2: דניאל — ניכוי ימי מחלה ⭐⭐ ─────────────────────────────────────
const C2_BASE_M=9000, C2_TRAVEL_2=450;
const C2_DAILY        = parseFloat((C2_BASE_M/30).toFixed(2));             // 300
const C2_SICK_DED     = C2_DAILY;                                           // 300
const C2_GROSS        = parseFloat((C2_BASE_M-C2_SICK_DED+C2_TRAVEL_2).toFixed(2)); // 9150
const C2_TAX=320, C2_BI=271.50, C2_HEALTH=283.65;
const C2_PENSION      = parseFloat((C2_GROSS*0.06).toFixed(2));            // 549
const C2_TOTAL_DED    = parseFloat((C2_TAX+C2_BI+C2_HEALTH+C2_PENSION).toFixed(2));
const C2_NET          = parseFloat((C2_GROSS-C2_TOTAL_DED).toFixed(2));

// ── Case 3: מיכל — ותק והבראה ⭐⭐⭐ ─────────────────────────────────────────
const C3_BASE=8800, C3_HAVRAAH=167, C3_TRAVEL_3=380;
const C3_VATEK        = parseFloat((C3_BASE*0.05).toFixed(2));             // 440
const C3_GROSS        = parseFloat((C3_BASE+C3_VATEK+C3_HAVRAAH+C3_TRAVEL_3).toFixed(2)); // 9787
const C3_TAX=450, C3_BI=298.70, C3_HEALTH=303.40;
const C3_PENSION      = parseFloat((C3_BASE*0.06).toFixed(2));             // 528 (base only)
const C3_KEREN        = parseFloat((C3_BASE*0.025).toFixed(2));            // 220 (base only)
const C3_TOTAL_DED    = parseFloat((C3_TAX+C3_BI+C3_HEALTH+C3_PENSION+C3_KEREN).toFixed(2));
const C3_NET          = parseFloat((C3_GROSS-C3_TOTAL_DED).toFixed(2));

// ── Case 4: שירה — מדרגות מס ⭐⭐⭐⭐ ─────────────────────────────────────────
const C4_BASE=14000, C4_TRAVEL_4=500;
const C4_GROSS        = C4_BASE + C4_TRAVEL_4;                             // 14500
const C4_TAX=1325, C4_BI=483.55, C4_HEALTH=557.08;
const C4_PENSION      = parseFloat((C4_BASE*0.06).toFixed(2));             // 840
const C4_KEREN        = parseFloat((C4_BASE*0.025).toFixed(2));            // 350
const C4_TOTAL_DED    = parseFloat((C4_TAX+C4_BI+C4_HEALTH+C4_PENSION+C4_KEREN).toFixed(2));
const C4_NET          = parseFloat((C4_GROSS-C4_TOTAL_DED).toFixed(2));

// ── Case 5: עמיר — שישי שבת ועמלה ⭐⭐⭐⭐⭐ ───────────────────────────────────
const C5_HOURLY=38, C5_REG_H=150, C5_FRI_H=10, C5_SAT_H=6;
const C5_COMMISSION=1800, C5_TRAVEL_5=400;
const C5_REG          = C5_HOURLY * C5_REG_H;                              // 5700
const C5_FRI_RATE     = parseFloat((C5_HOURLY*1.5).toFixed(2));             // 57
const C5_FRI_AMT      = parseFloat((C5_FRI_H*C5_FRI_RATE).toFixed(2));    // 570
const C5_SAT_RATE     = parseFloat((C5_HOURLY*2).toFixed(2));               // 76
const C5_SAT_AMT      = parseFloat((C5_SAT_H*C5_SAT_RATE).toFixed(2));    // 456
const C5_GROSS        = parseFloat((C5_REG+C5_FRI_AMT+C5_SAT_AMT+C5_COMMISSION+C5_TRAVEL_5).toFixed(2)); // 8926
const C5_TAX=195, C5_BI=188, C5_HEALTH=276.71;
const C5_PENSION      = parseFloat(((C5_REG+C5_FRI_AMT+C5_SAT_AMT)*0.06).toFixed(2)); // 403.56
const C5_TOTAL_DED    = parseFloat((C5_TAX+C5_BI+C5_HEALTH+C5_PENSION).toFixed(2));
const C5_NET          = parseFloat((C5_GROSS-C5_TOTAL_DED).toFixed(2));
// ── Per-case fill specs ──────────────────────────────────────────────────────

type FStatus = 'empty' | 'correct' | 'wrong';
interface FieldState { value: string; status: FStatus; }

const CASE_FILLS: Array<{ ids: string[]; answers: Record<string, number> }> = [
  {
    ids: ['base', 'ot125_rate', 'ot125_amt', 'ot150_rate', 'ot150_amt', 'gross', 'net'],
    answers: { base: C1_BASE, ot125_rate: C1_OT125_RATE, ot125_amt: C1_OT125, ot150_rate: C1_OT150_RATE, ot150_amt: C1_OT150, gross: C1_GROSS, net: C1_NET },
  },
  {
    ids: ['daily', 'sick_ded', 'gross', 'pension', 'net'],
    answers: { daily: C2_DAILY, sick_ded: C2_SICK_DED, gross: C2_GROSS, pension: C2_PENSION, net: C2_NET },
  },
  {
    ids: ['vatek', 'gross', 'pension', 'keren', 'total_ded', 'net'],
    answers: { vatek: C3_VATEK, gross: C3_GROSS, pension: C3_PENSION, keren: C3_KEREN, total_ded: C3_TOTAL_DED, net: C3_NET },
  },
  {
    ids: ['pension', 'keren', 'total_ded', 'net'],
    answers: { pension: C4_PENSION, keren: C4_KEREN, total_ded: C4_TOTAL_DED, net: C4_NET },
  },
  {
    ids: ['fri_rate', 'fri_amt', 'sat_rate', 'sat_amt', 'gross', 'pension', 'net'],
    answers: { fri_rate: C5_FRI_RATE, fri_amt: C5_FRI_AMT, sat_rate: C5_SAT_RATE, sat_amt: C5_SAT_AMT, gross: C5_GROSS, pension: C5_PENSION, net: C5_NET },
  },
];

const CASE_META = [
  { stars: 1, name: 'אילנית', tag: 'שעות נוספות',      subtag: 'חישוב שכר שעתי + שע"נ 125%/150%',  gradient: 'from-emerald-400 to-teal-500',   emoji: '👩‍💼' },
  { stars: 2, name: 'דניאל',  tag: 'ניכוי ימי מחלה',   subtag: 'יום מחלה ראשון = ניכוי מלא',         gradient: 'from-sky-400 to-blue-500',        emoji: '👨‍💼' },
  { stars: 3, name: 'מיכל',   tag: 'ותק והבראה',        subtag: 'בונוס ותק + דמי הבראה',             gradient: 'from-violet-400 to-purple-500',   emoji: '👩‍💼' },
  { stars: 4, name: 'שירה',   tag: 'מדרגות מס',         subtag: 'שכר גבוה — מס שולי',                gradient: 'from-orange-400 to-amber-500',    emoji: '👩‍💼' },
  { stars: 5, name: 'עמיר',   tag: 'שישי שבת ועמלה',   subtag: 'עבודה בשישי/שבת + עמלת מכירות',    gradient: 'from-rose-400 to-red-600',        emoji: '👨‍💼' },
];

// ── FillInStep ───────────────────────────────────────────────────────────────
const FillInStep: React.FC = () => {
  const fmt = fmtNum;
  const [selectedCase, setSelectedCase] = useState<number | null>(null);
  const [fields, setFields] = useState<Record<string, FieldState>>({});
  const [checked, setChecked] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);

  const selectCase = (idx: number) => {
    setSelectedCase(idx);
    const ids = CASE_FILLS[idx].ids;
    setFields(Object.fromEntries(ids.map(id => [id, { value: '', status: 'empty' as FStatus }])));
    setChecked(false);
    setShowAnswers(false);
  };

  const setVal = (id: string, val: string) => {
    if (checked) return;
    setFields(prev => ({ ...prev, [id]: { value: val, status: 'empty' } }));
  };

  const checkAnswers = () => {
    if (selectedCase === null) return;
    const { ids, answers } = CASE_FILLS[selectedCase];
    const upd = { ...fields };
    ids.forEach(id => {
      const entered = parseFloat(upd[id].value.replace(/,/g, ''));
      upd[id] = { value: upd[id].value, status: Math.abs(entered - answers[id]) < 0.5 ? 'correct' : 'wrong' };
    });
    setFields(upd);
    setChecked(true);
  };

  const reset = () => {
    if (selectedCase === null) return;
    const ids = CASE_FILLS[selectedCase].ids;
    setFields(Object.fromEntries(ids.map(id => [id, { value: '', status: 'empty' as FStatus }])));
    setChecked(false);
    setShowAnswers(false);
  };

  const allCorrect = checked && selectedCase !== null &&
    CASE_FILLS[selectedCase].ids.every(id => fields[id]?.status === 'correct');

  const inp = (id: string) => {
    const fs = fields[id] ?? { value: '', status: 'empty' as FStatus };
    let cls = 'border border-dashed border-blue-400 bg-blue-50 focus:bg-white focus:border-brand-teal';
    if (fs.status === 'correct') cls = 'border border-green-500 bg-green-50 text-green-800';
    if (fs.status === 'wrong')   cls = 'border border-red-500 bg-red-50 text-red-800';
    return (
      <span className="inline-flex items-center gap-1">
        <input
          type="number"
          value={fs.value}
          onChange={e => setVal(id, e.target.value)}
          disabled={checked}
          placeholder="___"
          className={`w-24 rounded-lg px-2 py-0.5 text-right font-mono text-xl outline-none transition-colors ${cls}`}
        />
        {fs.status === 'correct' && <span className="text-green-600">✅</span>}
        {fs.status === 'wrong' && (
          <span className="text-red-500 text-sm font-bold" title={`תשובה: ${fmt(CASE_FILLS[selectedCase!].answers[id])}`}>❌</span>
        )}
      </span>
    );
  };

  const given = (val: number) => (
    <span className="inline-block bg-amber-50 border border-amber-300 rounded-lg px-2 py-0.5 font-mono text-xl text-amber-800">{fmt(val)}</span>
  );

  // ── Case selector ──────────────────────────────────────────────────────────
  if (selectedCase === null) {
    return (
      <div className="space-y-6 animate-fade-in" dir="rtl">
        <div className="text-center">
          <h2 className="text-3xl font-black text-brand-dark-blue mb-2">🎯 בחרו מקרה לתרגול</h2>
          <p className="text-xl text-gray-600">לכל מקרה רמת קושי שונה — בחרו לפי הרמה שלכם</p>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {CASE_META.map((meta, idx) => (
            <button
              key={idx}
              onClick={() => selectCase(idx)}
              className="w-full text-right rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 border-2 border-transparent hover:border-white group"
            >
              <div className={`bg-gradient-to-l ${meta.gradient} p-4 flex items-center gap-4`}>
                <span className="text-5xl">{meta.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-black text-2xl">{meta.name}</span>
                    <span className="text-white/80 text-xl font-bold">— {meta.tag}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{'⭐'.repeat(meta.stars)}</span>
                    <span className="bg-white/20 text-white rounded-full px-3 py-0.5 text-lg font-semibold">{meta.subtag}</span>
                  </div>
                </div>
                <span className="text-white text-3xl opacity-60 group-hover:opacity-100 transition-all">←</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const meta = CASE_META[selectedCase];

  // ── Case-specific slip content ─────────────────────────────────────────────
  let storyContent: React.ReactNode;
  let slipProps: React.ComponentProps<typeof SlipShell>;
  let solutionRows: React.ReactNode;

  if (selectedCase === 0) {
    // ── Case 1: אילנית ────────────────────────────────────────────────────────
    const payRows: SlipRowData[] = [
      { name: 'שכר יסוד',         qty: fmt(C1_REG_H),   rate: fmt(C1_HOURLY),   amt: inp('base'),      tooltip: termExplanations['שכר יסוד'] },
      { name: 'שעות נוספות 125%', qty: fmt(C1_OT125_H), rate: inp('ot125_rate'), amt: inp('ot125_amt'), tooltip: termExplanations['שעות נוספות 125%'] },
      { name: 'שעות נוספות 150%', qty: fmt(C1_OT150_H), rate: inp('ot150_rate'), amt: inp('ot150_amt'), tooltip: termExplanations['שעות נוספות 150%'] },
      { name: 'נסיעות',           qty: '1.00',           rate: fmt(C1_TRAVEL),   amt: fmt(C1_TRAVEL),   tooltip: termExplanations['נסיעות'] },
    ];
    const mandRows: DedRowData[] = [
      { name: 'מס הכנסה',    amt: given(C1_TAX),     tooltip: termExplanations['מס הכנסה'] },
      { name: 'ביטוח לאומי', amt: given(C1_BI),      tooltip: termExplanations['ביטוח לאומי'] },
      { name: 'דמי בריאות',  amt: given(C1_HEALTH),  tooltip: termExplanations['דמי בריאות'] },
      { name: 'פנסיה (6% מהיסוד)',  amt: given(C1_PENSION), tooltip: 'חיסכון חובה לגיל פרישה. הפרשה לפנסיה מחושבת על שכר היסוד בלבד (ולרכיבים קבועים כגון שעות נוספות גלובליות), ולא על שעות נוספות משתנות.' },
    ];
    storyContent = (
      <>
        <p className="text-xl text-brand-dark-blue/80 leading-relaxed">
          שמי <strong>אילנית</strong>, בת 22, מוכרת בחנות ספרים.
          שכרי <strong className="text-teal-700">40 ₪/שעה</strong>.
          בינואר עבדתי <strong className="text-teal-700">156 שעות רגילות</strong> +{' '}
          <strong className="text-orange-600">7 שעות נוספות ב-125%</strong> +{' '}
          <strong className="text-red-600">6 שעות נוספות ב-150%</strong>,
          ומקבלת <strong>350 ₪ החזר נסיעות</strong>. הניכויים נתונים — חשבו את שאר השדות!
        </p>
        <p className="text-base text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 mt-2">
          💡 <strong>שימו לב:</strong> הפרשה לפנסיה מחושבת על <strong>שכר היסוד בלבד</strong> (6240 ₪), לא על שעות נוספות משתנות — אלו אינן חלק מבסיס השכר הפנסיוני.
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-lg">
          <span className="bg-white border border-teal-200 rounded-lg px-3 py-1 font-semibold">💰 40 ₪/שעה</span>
          <span className="bg-white border border-teal-200 rounded-lg px-3 py-1 font-semibold">🕐 156 שעות רגילות</span>
          <span className="bg-white border border-orange-200 rounded-lg px-3 py-1 font-semibold">⏰ 7 שע׳ × 125%</span>
          <span className="bg-white border border-red-200 rounded-lg px-3 py-1 font-semibold">⏰ 6 שע׳ × 150%</span>
          <span className="bg-white border border-amber-200 rounded-lg px-3 py-1 font-semibold">🚌 350 ₪ נסיעות</span>
        </div>
      </>
    );
    slipProps = {
      companyName: 'חנות הספרים', employeeName: 'אילנית כהן', employeeId: '987654321',
      role: 'מוכרת', startDate: '01/03/2023', period: 'ינואר 2024',
      bank: '17 (מזרחי-טפחות)', branch: '201', account: '654321',
      paymentRows: payRows, grossCell: inp('gross'),
      mandatoryRows: mandRows, voluntaryRows: [{ name: 'קרן השתלמות', amt: <span className="text-gray-400 italic">—</span> }],
      totalDedCell: given(C1_TOTAL_DED), netCell: inp('net'),
      marginalTax: '10%', creditPoints: '2.25',
      employerPension: fmt(C1_BASE*0.075),
      employerStudyFund: fmt((C1_BASE+C1_OT125+C1_OT150)*0.075),
    };
    solutionRows = (
      <>
        <tr><td className="py-1.5">שכר יסוד</td><td className="text-gray-500">156 × 40</td><td className="font-mono font-bold text-green-700 text-left">{fmt(C1_BASE)} ₪</td></tr>
        <tr><td className="py-1.5">שעות נוספות 125%</td><td className="text-gray-500">7 × 40 × 1.25 = 7 × {fmt(C1_OT125_RATE)}</td><td className="font-mono font-bold text-green-700 text-left">{fmt(C1_OT125)} ₪</td></tr>
        <tr><td className="py-1.5">שעות נוספות 150%</td><td className="text-gray-500">6 × 40 × 1.50 = 6 × {fmt(C1_OT150_RATE)}</td><td className="font-mono font-bold text-green-700 text-left">{fmt(C1_OT150)} ₪</td></tr>
        <tr><td className="py-1.5">נסיעות</td><td className="text-gray-500">ניתן</td><td className="font-mono font-bold text-green-700 text-left">{fmt(C1_TRAVEL)} ₪</td></tr>
        <tr className="bg-green-50 font-black"><td>ברוטו</td><td></td><td className="font-mono text-green-800 text-left">{fmt(C1_GROSS)} ₪</td></tr>
        <tr><td className="py-1.5">מס/ביטוח/בריאות/פנסיה</td><td className="text-gray-500">ניתנו</td><td className="font-mono text-red-600 text-left">−{fmt(C1_TOTAL_DED)} ₪</td></tr>
        <tr className="bg-blue-100 font-black"><td>נטו 💳</td><td className="text-gray-500">{fmt(C1_GROSS)} − {fmt(C1_TOTAL_DED)}</td><td className="font-mono text-blue-800 text-left">{fmt(C1_NET)} ₪</td></tr>
      </>
    );

  } else if (selectedCase === 1) {
    // ── Case 2: דניאל ────────────────────────────────────────────────────────
    const payRows: SlipRowData[] = [
      { name: 'שכר חודשי',                         qty: '1.00', rate: fmt(C2_BASE_M),   amt: fmt(C2_BASE_M),   tooltip: termExplanations['שכר יסוד'] },
      { name: 'ניכוי יום מחלה ראשון (לא משולם)',    qty: '1.00', rate: inp('daily'),     amt: inp('sick_ded'),  tooltip: 'בישראל — יום מחלה ראשון מנוכה כולו לפי חוק' },
      { name: 'נסיעות',                             qty: '1.00', rate: fmt(C2_TRAVEL_2), amt: fmt(C2_TRAVEL_2), tooltip: termExplanations['נסיעות'] },
    ];
    const mandRows: DedRowData[] = [
      { name: 'מס הכנסה',    amt: given(C2_TAX),    tooltip: termExplanations['מס הכנסה'] },
      { name: 'ביטוח לאומי', amt: given(C2_BI),     tooltip: termExplanations['ביטוח לאומי'] },
      { name: 'דמי בריאות',  amt: given(C2_HEALTH), tooltip: termExplanations['דמי בריאות'] },
      { name: 'פנסיה (6%)',  amt: inp('pension'),   tooltip: termExplanations['פנסיה'] },
    ];
    storyContent = (
      <>
        <p className="text-xl text-brand-dark-blue/80 leading-relaxed">
          שמי <strong>דניאל</strong>, עובד משרד בשכר חודשי של <strong className="text-blue-700">9,000 ₪</strong>.
          בפברואר הייתי חולה יום אחד — ולפי <strong className="text-red-600">חוק דמי מחלה</strong>,
          יום ראשון של מחלה <strong className="text-red-600">לא משולם כלל</strong>.
          מקבל גם <strong>450 ₪ נסיעות</strong>. חשבו: מה השכר היומי? כמה ינוכה? מה הברוטו? מה הנטו?
        </p>
        <div className="mt-3 bg-blue-50 border border-blue-200 rounded-xl p-3 text-lg">
          <strong>📌 זכות עובד — וגם ניכוי חוקי:</strong>{' '}
          לפי חוק דמי מחלה (1976), יום מחלה <em>ראשון</em> לא מקבל תשלום. מיום שני ומעלה — 50%–100% בהתאם לוותק.
        </div>
        <div className="mt-2 flex flex-wrap gap-2 text-lg">
          <span className="bg-white border border-blue-200 rounded-lg px-3 py-1 font-semibold">💰 9,000 ₪/חודש</span>
          <span className="bg-white border border-red-200 rounded-lg px-3 py-1 font-semibold">🤒 יום מחלה 1 (לא משולם)</span>
          <span className="bg-white border border-amber-200 rounded-lg px-3 py-1 font-semibold">🚌 450 ₪ נסיעות</span>
        </div>
      </>
    );
    slipProps = {
      companyName: 'חברת הייטק בע"מ', employeeName: 'דניאל לוי', employeeId: '123456789',
      role: 'מנהל פרויקטים', startDate: '15/06/2021', period: 'פברואר 2024',
      bank: '12 (הפועלים)', branch: '030', account: '789456',
      paymentRows: payRows, grossCell: inp('gross'),
      mandatoryRows: mandRows, voluntaryRows: [{ name: 'קרן השתלמות', amt: <span className="text-gray-400 italic">—</span> }],
      totalDedCell: given(C2_TOTAL_DED), netCell: inp('net'),
      marginalTax: '10%', creditPoints: '2.25',
      employerPension: fmt(C2_GROSS * 0.075),
      employerStudyFund: fmt(C2_GROSS * 0.075),
    };
    solutionRows = (
      <>
        <tr><td className="py-1.5">שכר חודשי בסיסי</td><td className="text-gray-500">ניתן</td><td className="font-mono font-bold text-green-700 text-left">{fmt(C2_BASE_M)} ₪</td></tr>
        <tr><td className="py-1.5">שכר יומי</td><td className="text-gray-500">9,000 ÷ 30</td><td className="font-mono text-gray-700 text-left">{fmt(C2_DAILY)} ₪/יום</td></tr>
        <tr><td className="py-1.5">ניכוי יום מחלה (יום 1)</td><td className="text-gray-500">יום ראשון = ניכוי מלא</td><td className="font-mono text-red-600 text-left">−{fmt(C2_SICK_DED)} ₪</td></tr>
        <tr><td className="py-1.5">נסיעות</td><td className="text-gray-500">ניתן</td><td className="font-mono font-bold text-green-700 text-left">{fmt(C2_TRAVEL_2)} ₪</td></tr>
        <tr className="bg-green-50 font-black"><td>ברוטו</td><td className="text-gray-500">9,000 − {fmt(C2_SICK_DED)} + {fmt(C2_TRAVEL_2)}</td><td className="font-mono text-green-800 text-left">{fmt(C2_GROSS)} ₪</td></tr>
        <tr><td className="py-1.5">פנסיה (6%)</td><td className="text-gray-500">6% × {fmt(C2_GROSS)}</td><td className="font-mono text-red-600 text-left">−{fmt(C2_PENSION)} ₪</td></tr>
        <tr><td className="py-1.5">מס/ביטוח/בריאות</td><td className="text-gray-500">ניתנו</td><td className="font-mono text-red-600 text-left">−{fmt(C2_TAX+C2_BI+C2_HEALTH)} ₪</td></tr>
        <tr className="bg-red-50 font-black"><td>סה"כ ניכויים</td><td></td><td className="font-mono text-red-700 text-left">−{fmt(C2_TOTAL_DED)} ₪</td></tr>
        <tr className="bg-blue-100 font-black"><td>נטו 💳</td><td className="text-gray-500">{fmt(C2_GROSS)} − {fmt(C2_TOTAL_DED)}</td><td className="font-mono text-blue-800 text-left">{fmt(C2_NET)} ₪</td></tr>
      </>
    );

  } else if (selectedCase === 2) {
    // ── Case 3: מיכל ────────────────────────────────────────────────────────
    const payRows: SlipRowData[] = [
      { name: 'שכר יסוד',          qty: '1.00', rate: fmt(C3_BASE),    amt: fmt(C3_BASE),    tooltip: termExplanations['שכר יסוד'] },
      { name: 'בונוס ותק (5%)',     qty: '—',    rate: '5% × יסוד',    amt: inp('vatek'),    tooltip: 'ותק: שנות עבודה × 1% מהשכר הבסיסי. מיכל — 5 שנים ← 5%' },
      { name: 'דמי הבראה',          qty: '1.00', rate: fmt(C3_HAVRAAH), amt: fmt(C3_HAVRAAH), tooltip: 'זכות חוקית — תשלום שנתי המחולק ל-12 חודשים' },
      { name: 'נסיעות',             qty: '1.00', rate: fmt(C3_TRAVEL_3), amt: fmt(C3_TRAVEL_3), tooltip: termExplanations['נסיעות'] },
    ];
    const mandRows: DedRowData[] = [
      { name: 'מס הכנסה',    amt: given(C3_TAX),    tooltip: termExplanations['מס הכנסה'] },
      { name: 'ביטוח לאומי', amt: given(C3_BI),     tooltip: termExplanations['ביטוח לאומי'] },
      { name: 'דמי בריאות',  amt: given(C3_HEALTH), tooltip: termExplanations['דמי בריאות'] },
      { name: 'פנסיה (6%)',  amt: inp('pension'),   tooltip: 'פנסיה מחושבת על שכר יסוד בלבד' },
    ];
    const volRows: DedRowData[] = [
      { name: 'קרן השתלמות (2.5%)', amt: inp('keren'), tooltip: 'ק. השתלמות על שכר יסוד בלבד' },
    ];
    storyContent = (
      <>
        <p className="text-xl text-brand-dark-blue/80 leading-relaxed">
          שמי <strong>מיכל</strong>, מדריכת כושר עם ותק של <strong className="text-purple-700">5 שנים</strong> בחברה.
          שכר יסוד <strong className="text-purple-700">8,800 ₪</strong>.
          מגיע לי בונוס ותק של <strong>5%</strong> + <strong>דמי הבראה</strong> חודשיים + <strong>380 ₪ נסיעות</strong>.
          פנסיה וקרן השתלמות — רק על שכר יסוד. חשבו!
        </p>
        <div className="mt-3 bg-purple-50 border border-purple-200 rounded-xl p-3 text-lg">
          <strong>📌 ותק:</strong> כל שנת עבודה = 1% נוסף. 5 שנים = 5% × שכר יסוד.<br/>
          <strong>📌 הבראה:</strong> זכות חוקית — {fmt(C3_HAVRAAH * 12)} ₪/שנה, מחולק ל-12 = {fmt(C3_HAVRAAH)} ₪/חודש.
        </div>
        <div className="mt-2 flex flex-wrap gap-2 text-lg">
          <span className="bg-white border border-purple-200 rounded-lg px-3 py-1 font-semibold">💰 8,800 ₪ יסוד</span>
          <span className="bg-white border border-purple-200 rounded-lg px-3 py-1 font-semibold">🏆 5 שנות ותק</span>
          <span className="bg-white border border-purple-200 rounded-lg px-3 py-1 font-semibold">🏖 הבראה 167 ₪</span>
          <span className="bg-white border border-amber-200 rounded-lg px-3 py-1 font-semibold">🚌 380 ₪ נסיעות</span>
        </div>
      </>
    );
    slipProps = {
      companyName: 'מרכז ספורט "אקטיב"', employeeName: 'מיכל גרינברג', employeeId: '456789123',
      role: 'מדריכת כושר', startDate: '01/01/2019', period: 'מרץ 2024',
      bank: '20 (מזרחי)', branch: '155', account: '321654',
      paymentRows: payRows, grossCell: inp('gross'),
      mandatoryRows: mandRows, voluntaryRows: volRows,
      totalDedCell: inp('total_ded'), netCell: inp('net'),
      marginalTax: '14%', creditPoints: '2.25',
      employerPension: fmt(C3_BASE * 0.075),
      employerStudyFund: fmt(C3_BASE * 0.075),
    };
    solutionRows = (
      <>
        <tr><td className="py-1.5">שכר יסוד</td><td className="text-gray-500">ניתן</td><td className="font-mono font-bold text-green-700 text-left">{fmt(C3_BASE)} ₪</td></tr>
        <tr><td className="py-1.5">בונוס ותק 5%</td><td className="text-gray-500">5% × 8,800</td><td className="font-mono font-bold text-green-700 text-left">{fmt(C3_VATEK)} ₪</td></tr>
        <tr><td className="py-1.5">דמי הבראה</td><td className="text-gray-500">ניתן</td><td className="font-mono font-bold text-green-700 text-left">{fmt(C3_HAVRAAH)} ₪</td></tr>
        <tr><td className="py-1.5">נסיעות</td><td className="text-gray-500">ניתן</td><td className="font-mono font-bold text-green-700 text-left">{fmt(C3_TRAVEL_3)} ₪</td></tr>
        <tr className="bg-green-50 font-black"><td>ברוטו</td><td className="text-gray-500">8,800+440+167+380</td><td className="font-mono text-green-800 text-left">{fmt(C3_GROSS)} ₪</td></tr>
        <tr><td className="py-1.5">פנסיה (6%)</td><td className="text-gray-500">6% × 8,800 (יסוד בלבד)</td><td className="font-mono text-red-600 text-left">−{fmt(C3_PENSION)} ₪</td></tr>
        <tr><td className="py-1.5">קרן השתלמות (2.5%)</td><td className="text-gray-500">2.5% × 8,800</td><td className="font-mono text-red-600 text-left">−{fmt(C3_KEREN)} ₪</td></tr>
        <tr><td className="py-1.5">מס/ביטוח/בריאות</td><td className="text-gray-500">ניתנו</td><td className="font-mono text-red-600 text-left">−{fmt(C3_TAX+C3_BI+C3_HEALTH)} ₪</td></tr>
        <tr className="bg-red-50 font-black"><td>סה"כ ניכויים</td><td></td><td className="font-mono text-red-700 text-left">−{fmt(C3_TOTAL_DED)} ₪</td></tr>
        <tr className="bg-blue-100 font-black"><td>נטו 💳</td><td className="text-gray-500">{fmt(C3_GROSS)} − {fmt(C3_TOTAL_DED)}</td><td className="font-mono text-blue-800 text-left">{fmt(C3_NET)} ₪</td></tr>
      </>
    );

  } else if (selectedCase === 3) {
    // ── Case 4: שירה ────────────────────────────────────────────────────────
    const payRows: SlipRowData[] = [
      { name: 'שכר חודשי', qty: '1.00', rate: fmt(C4_BASE),     amt: fmt(C4_BASE),     tooltip: termExplanations['שכר יסוד'] },
      { name: 'נסיעות',    qty: '1.00', rate: fmt(C4_TRAVEL_4), amt: fmt(C4_TRAVEL_4), tooltip: termExplanations['נסיעות'] },
    ];
    const mandRows: DedRowData[] = [
      { name: 'מס הכנסה (מדרגות)', amt: given(C4_TAX),    tooltip: 'מחושב לפי מדרגות מס פרוגרסיביות' },
      { name: 'ביטוח לאומי',       amt: given(C4_BI),     tooltip: termExplanations['ביטוח לאומי'] },
      { name: 'דמי בריאות',         amt: given(C4_HEALTH), tooltip: termExplanations['דמי בריאות'] },
      { name: 'פנסיה (6%)',         amt: inp('pension'),   tooltip: termExplanations['פנסיה'] },
    ];
    const volRows: DedRowData[] = [
      { name: 'קרן השתלמות (2.5%)', amt: inp('keren'), tooltip: termExplanations['קרן השתלמות'] },
    ];
    storyContent = (
      <>
        <p className="text-xl text-brand-dark-blue/80 leading-relaxed">
          שמי <strong>שירה</strong>, מנהלת שיווק בחברת סטארטאפ. שכרי <strong className="text-orange-700">14,000 ₪/חודש</strong> + <strong>500 ₪ נסיעות</strong>.
          המס חושב לפי <strong className="text-orange-600">מדרגות</strong> — הניכויים הכבדים נתונים. חשבו פנסיה, קרן השתלמות, סה"כ ניכויים ונטו.
        </p>
        <div className="mt-3 bg-orange-50 border border-orange-200 rounded-xl p-3 text-lg">
          <strong>📌 מדרגות מס:</strong> לא כל ההכנסה ממוסה באותו אחוז!
          עד {fmt(7010)} ₪ — 10%, הסכום הבא עד {fmt(10060)} ₪ — 14%, וכן הלאה.
          המס הכולל ({fmt(C4_TAX)} ₪) כבר חושב עבורכם.
        </div>
        <div className="mt-2 flex flex-wrap gap-2 text-lg">
          <span className="bg-white border border-orange-200 rounded-lg px-3 py-1 font-semibold">💰 14,000 ₪/חודש</span>
          <span className="bg-white border border-orange-200 rounded-lg px-3 py-1 font-semibold">📊 מס שולי: מדרגות</span>
          <span className="bg-white border border-amber-200 rounded-lg px-3 py-1 font-semibold">🚌 500 ₪ נסיעות</span>
        </div>
      </>
    );
    slipProps = {
      companyName: 'StartUp IL בע"מ', employeeName: 'שירה פרידמן', employeeId: '321654987',
      role: 'מנהלת שיווק', startDate: '01/09/2020', period: 'אפריל 2024',
      bank: '11 (דיסקונט)', branch: '044', account: '147258',
      paymentRows: payRows, grossCell: given(C4_GROSS),
      mandatoryRows: mandRows, voluntaryRows: volRows,
      totalDedCell: inp('total_ded'), netCell: inp('net'),
      marginalTax: '20%', creditPoints: '2.25',
      employerPension: fmt(C4_BASE * 0.075),
      employerStudyFund: fmt(C4_BASE * 0.075),
    };
    solutionRows = (
      <>
        <tr><td className="py-1.5">שכר חודשי</td><td className="text-gray-500">ניתן</td><td className="font-mono font-bold text-green-700 text-left">{fmt(C4_BASE)} ₪</td></tr>
        <tr><td className="py-1.5">נסיעות</td><td className="text-gray-500">ניתן</td><td className="font-mono font-bold text-green-700 text-left">{fmt(C4_TRAVEL_4)} ₪</td></tr>
        <tr className="bg-green-50 font-black"><td>ברוטו</td><td></td><td className="font-mono text-green-800 text-left">{fmt(C4_GROSS)} ₪</td></tr>
        <tr><td className="py-1.5">מס הכנסה (מדרגות)</td><td className="text-gray-500">ניתן</td><td className="font-mono text-red-600 text-left">−{fmt(C4_TAX)} ₪</td></tr>
        <tr><td className="py-1.5">ביטוח לאומי</td><td className="text-gray-500">ניתן</td><td className="font-mono text-red-600 text-left">−{fmt(C4_BI)} ₪</td></tr>
        <tr><td className="py-1.5">דמי בריאות</td><td className="text-gray-500">ניתן</td><td className="font-mono text-red-600 text-left">−{fmt(C4_HEALTH)} ₪</td></tr>
        <tr><td className="py-1.5">פנסיה (6%)</td><td className="text-gray-500">6% × 14,000</td><td className="font-mono text-red-600 text-left">−{fmt(C4_PENSION)} ₪</td></tr>
        <tr><td className="py-1.5">קרן השתלמות (2.5%)</td><td className="text-gray-500">2.5% × 14,000</td><td className="font-mono text-red-600 text-left">−{fmt(C4_KEREN)} ₪</td></tr>
        <tr className="bg-red-50 font-black"><td>סה"כ ניכויים</td><td></td><td className="font-mono text-red-700 text-left">−{fmt(C4_TOTAL_DED)} ₪</td></tr>
        <tr className="bg-blue-100 font-black"><td>נטו 💳</td><td className="text-gray-500">{fmt(C4_GROSS)} − {fmt(C4_TOTAL_DED)}</td><td className="font-mono text-blue-800 text-left">{fmt(C4_NET)} ₪</td></tr>
      </>
    );

  } else {
    // ── Case 5: עמיר ────────────────────────────────────────────────────────
    const payRows: SlipRowData[] = [
      { name: 'שעות רגילות',   qty: fmt(C5_REG_H), rate: fmt(C5_HOURLY),  amt: fmt(C5_REG),    tooltip: termExplanations['שכר יסוד'] },
      { name: 'שישי (150%)',   qty: fmt(C5_FRI_H), rate: inp('fri_rate'), amt: inp('fri_amt'), tooltip: 'עבודה ביום שישי — 150% לפי חוק' },
      { name: 'שבת (200%)',    qty: fmt(C5_SAT_H), rate: inp('sat_rate'), amt: inp('sat_amt'), tooltip: 'עבודה בשבת — 200% לפי חוק' },
      { name: 'עמלת מכירות',  qty: '—',            rate: '—',             amt: fmt(C5_COMMISSION), tooltip: 'עמלה — נספרת לברוטו אך לא לחישוב פנסיה' },
      { name: 'נסיעות',        qty: '1.00',         rate: fmt(C5_TRAVEL_5), amt: fmt(C5_TRAVEL_5), tooltip: termExplanations['נסיעות'] },
    ];
    const mandRows: DedRowData[] = [
      { name: 'מס הכנסה',    amt: given(C5_TAX),    tooltip: termExplanations['מס הכנסה'] },
      { name: 'ביטוח לאומי', amt: given(C5_BI),     tooltip: termExplanations['ביטוח לאומי'] },
      { name: 'דמי בריאות',  amt: given(C5_HEALTH), tooltip: termExplanations['דמי בריאות'] },
      { name: 'פנסיה (6%)',  amt: inp('pension'),   tooltip: 'פנסיה על שכר + שע"נ בלבד — לא על עמלה/נסיעות' },
    ];
    storyContent = (
      <>
        <p className="text-xl text-brand-dark-blue/80 leading-relaxed">
          שמי <strong>עמיר</strong>, עובד אבטחה בקניון. שכרי <strong className="text-red-700">38 ₪/שעה</strong>.
          בחודש מאי עבדתי <strong>150 שעות רגילות</strong> +{' '}
          <strong className="text-orange-600">10 שעות בשישי (150%)</strong> +{' '}
          <strong className="text-red-700">6 שעות בשבת (200%)</strong> +{' '}
          <strong>1,800 ₪ עמלת מכירות</strong> + <strong>400 ₪ נסיעות</strong>.
          פנסיה — רק על שכר ושע"נ (לא עמלה).
        </p>
        <div className="mt-3 bg-red-50 border border-red-200 rounded-xl p-3 text-lg">
          <strong>📌 שישי:</strong> 150% = שכר × 1.5 &nbsp;|&nbsp; <strong>שבת:</strong> 200% = שכר × 2.<br/>
          <strong>📌 עמלה:</strong> נספרת לברוטו (וגם למס!) — אך <em>לא</em> לחישוב פנסיה, כי זו הכנסה לא קבועה.
        </div>
        <div className="mt-2 flex flex-wrap gap-2 text-lg">
          <span className="bg-white border border-red-200 rounded-lg px-3 py-1 font-semibold">💰 38 ₪/שעה</span>
          <span className="bg-white border border-orange-200 rounded-lg px-3 py-1 font-semibold">📅 10 שע׳ שישי × 150%</span>
          <span className="bg-white border border-red-200 rounded-lg px-3 py-1 font-semibold">✡ 6 שע׳ שבת × 200%</span>
          <span className="bg-white border border-green-200 rounded-lg px-3 py-1 font-semibold">💼 1,800 ₪ עמלה</span>
          <span className="bg-white border border-amber-200 rounded-lg px-3 py-1 font-semibold">🚌 400 ₪ נסיעות</span>
        </div>
      </>
    );
    slipProps = {
      companyName: 'קניון הגדול', employeeName: 'עמיר שמש', employeeId: '654321789',
      role: 'מאבטח', startDate: '10/03/2022', period: 'מאי 2024',
      bank: '04 (יהב)', branch: '012', account: '963852',
      paymentRows: payRows, grossCell: inp('gross'),
      mandatoryRows: mandRows, voluntaryRows: [{ name: 'קרן השתלמות', amt: <span className="text-gray-400 italic">—</span> }],
      totalDedCell: given(C5_TOTAL_DED), netCell: inp('net'),
      marginalTax: '10%', creditPoints: '2.25',
      employerPension: fmt((C5_REG+C5_FRI_AMT+C5_SAT_AMT)*0.075),
      employerStudyFund: fmt((C5_REG+C5_FRI_AMT+C5_SAT_AMT)*0.075),
    };
    solutionRows = (
      <>
        <tr><td className="py-1.5">שעות רגילות</td><td className="text-gray-500">150 × 38</td><td className="font-mono font-bold text-green-700 text-left">{fmt(C5_REG)} ₪</td></tr>
        <tr><td className="py-1.5">שישי (150%)</td><td className="text-gray-500">10 × 38 × 1.5 = 10 × {fmt(C5_FRI_RATE)}</td><td className="font-mono font-bold text-green-700 text-left">{fmt(C5_FRI_AMT)} ₪</td></tr>
        <tr><td className="py-1.5">שבת (200%)</td><td className="text-gray-500">6 × 38 × 2 = 6 × {fmt(C5_SAT_RATE)}</td><td className="font-mono font-bold text-green-700 text-left">{fmt(C5_SAT_AMT)} ₪</td></tr>
        <tr><td className="py-1.5">עמלה</td><td className="text-gray-500">ניתן</td><td className="font-mono font-bold text-green-700 text-left">{fmt(C5_COMMISSION)} ₪</td></tr>
        <tr><td className="py-1.5">נסיעות</td><td className="text-gray-500">ניתן</td><td className="font-mono font-bold text-green-700 text-left">{fmt(C5_TRAVEL_5)} ₪</td></tr>
        <tr className="bg-green-50 font-black"><td>ברוטו</td><td className="text-gray-500">{fmt(C5_REG)}+{fmt(C5_FRI_AMT)}+{fmt(C5_SAT_AMT)}+{fmt(C5_COMMISSION)}+{fmt(C5_TRAVEL_5)}</td><td className="font-mono text-green-800 text-left">{fmt(C5_GROSS)} ₪</td></tr>
        <tr><td className="py-1.5">פנסיה (6%)</td><td className="text-gray-500">6% × ({fmt(C5_REG)}+{fmt(C5_FRI_AMT)}+{fmt(C5_SAT_AMT)})</td><td className="font-mono text-red-600 text-left">−{fmt(C5_PENSION)} ₪</td></tr>
        <tr><td className="py-1.5">מס/ביטוח/בריאות</td><td className="text-gray-500">ניתנו</td><td className="font-mono text-red-600 text-left">−{fmt(C5_TAX+C5_BI+C5_HEALTH)} ₪</td></tr>
        <tr className="bg-red-50 font-black"><td>סה"כ ניכויים</td><td></td><td className="font-mono text-red-700 text-left">−{fmt(C5_TOTAL_DED)} ₪</td></tr>
        <tr className="bg-blue-100 font-black"><td>נטו 💳</td><td className="text-gray-500">{fmt(C5_GROSS)} − {fmt(C5_TOTAL_DED)}</td><td className="font-mono text-blue-800 text-left">{fmt(C5_NET)} ₪</td></tr>
      </>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in" dir="rtl">

      {/* Back button + case badge */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSelectedCase(null)}
          className="flex items-center gap-1 text-gray-500 hover:text-brand-dark-blue font-bold text-xl transition-colors"
        >
          → חזרה לבחירת מקרה
        </button>
        <span className="text-gray-300">|</span>
        <span className={`bg-gradient-to-l ${meta.gradient} text-white font-black px-4 py-1 rounded-full text-lg`}>
          {meta.emoji} {meta.name} — {'⭐'.repeat(meta.stars)}
        </span>
      </div>

      {/* Story banner */}
      <div className="bg-gradient-to-l from-pink-50 to-indigo-50 border-2 border-indigo-200 rounded-2xl p-5 relative overflow-hidden">
        <div className="absolute top-3 left-4 text-8xl opacity-10 select-none pointer-events-none">{meta.emoji}</div>
        <h2 className="text-2xl font-black text-brand-dark-blue mb-2 flex items-center gap-2">📖 הסיפור של {meta.name}</h2>
        {storyContent}
        <div className="mt-3 flex items-center gap-2 text-lg text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-1.5 w-fit">
          📌 שדות <span className="font-mono bg-amber-100 border border-amber-300 rounded px-1 text-amber-800">ניתן</span> מלאים מראש.
          שדות <span className="font-mono bg-blue-100 border border-dashed border-blue-400 rounded px-1 text-blue-800">?</span> — ממלאים אתם!
        </div>
      </div>

      {/* Pay slip */}
      <SlipShell {...slipProps} />

      {/* Success banner */}
      {allCorrect && (
        <div className="bg-green-100 border-2 border-green-400 rounded-2xl p-4 text-center">
          <div className="text-5xl mb-1">🎉</div>
          <p className="text-2xl font-black text-green-800">כל הכבוד! מילאתם נכון את כל השדות של {meta.name}!</p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3 flex-wrap">
        {!checked
          ? <button onClick={checkAnswers} className="flex-1 bg-brand-teal hover:bg-teal-600 text-white font-black text-xl py-3 rounded-xl transition-colors shadow-md">✔ בדיקת תשובות</button>
          : <button onClick={reset}        className="flex-1 bg-gray-200 hover:bg-gray-300 text-brand-dark-blue font-black text-xl py-3 rounded-xl transition-colors">🔄 נסו שוב</button>
        }
        <button onClick={() => setShowAnswers(v => !v)}
          className="px-5 py-3 rounded-xl font-bold text-xl border-2 border-brand-magenta text-brand-magenta hover:bg-brand-magenta/10 transition-colors">
          {showAnswers ? 'הסתירו פתרון' : '📋 הצגת פתרון מלא'}
        </button>
      </div>

      {/* Solution table */}
      {showAnswers && (
        <div className="bg-brand-dark-blue/5 border border-brand-dark-blue/20 rounded-2xl p-5 text-xl" dir="rtl">
          <p className="font-black text-brand-dark-blue text-2xl mb-3">📊 פתרון מלא — תלוש של {meta.name}</p>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-brand-dark-blue/20">
                <th className="text-right py-1 font-bold">רכיב</th>
                <th className="text-right py-1 font-bold">חישוב</th>
                <th className="text-left py-1 font-bold">סכום</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {solutionRows}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ─── Step 3 — Quiz ────────────────────────────────────────────────────────────

const QuizStep: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [quizState, setQuizState] = useState<'not_started' | 'in_progress' | 'finished'>('not_started');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        if (quizState === 'finished' && (score / quizQuestions.length) >= 0.8) onComplete();
    }, [quizState, score, onComplete]);

    const handleAnswer = (answer: string) => {
        if (selectedAnswer) return;
        setSelectedAnswer(answer);
        const correctAnswer = quizQuestions[currentQuestionIndex].answer;
        if (answer === correctAnswer) { setScore(prev => prev + 1); setFeedback('נכון מאוד! 🎉'); }
        else setFeedback(`טעות — התשובה הנכונה: ${correctAnswer}`);
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < quizQuestions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setFeedback('');
        } else {
            setQuizState('finished');
        }
    };

    const restartQuiz = () => {
        setQuizState('in_progress');
        setCurrentQuestionIndex(0);
        setScore(0);
        setSelectedAnswer(null);
        setFeedback('');
    };

    if (quizState === 'finished') {
        const isCompleted = (score / quizQuestions.length) >= 0.8;
        return (
            <div className="text-center p-6 bg-white/80 border-4 border-yellow-400 rounded-2xl shadow-2xl animate-fade-in">
                <TrophyIcon className="w-24 h-24 mx-auto text-yellow-500" />
                <h3 className="text-4xl font-bold mb-2 mt-4 text-brand-dark-blue">סיימת את הבוחן!</h3>
                <p className="text-2xl mb-4 text-brand-dark-blue/80">
                    {isCompleted ? 'מעולה! עמדתם ביעד והשלמתם את המודול!' : 'עבודה טובה, אבל צריך 80% כדי להשלים. נסו שוב!'}
                </p>
                <div className="bg-brand-light-blue/20 p-4 rounded-xl inline-block my-3">
                    <p className="text-3xl">הציון שלך:</p>
                    <p className="text-6xl font-black text-brand-light-blue">{score}/{quizQuestions.length}</p>
                </div>
                <div className="mt-4">
                    <button onClick={restartQuiz} className="bg-brand-teal hover:bg-teal-500 text-white font-black py-3 px-8 rounded-xl text-2xl transition-colors">שחקו שוב</button>
                </div>
            </div>
        );
    }

    if (quizState === 'not_started') return (
        <div className="text-center space-y-6 animate-fade-in">
            <div className="text-6xl">🧠</div>
            <h3 className="text-3xl font-black text-brand-dark-blue">מוכנים? בחנו את עצמכם</h3>
            <p className="text-xl text-brand-dark-blue/70">יש לענות נכון על לפחות 80% ({Math.ceil(quizQuestions.length * 0.8)} מתוך {quizQuestions.length}) כדי להשלים את המודול.</p>
            <button onClick={() => setQuizState('in_progress')} className="bg-brand-magenta hover:bg-pink-700 text-white font-black py-3 px-8 rounded-xl text-2xl transition-colors shadow-lg">
                התחל בוחן
            </button>
        </div>
    );

    const q = quizQuestions[currentQuestionIndex];
    return (
        <div className="space-y-5 animate-fade-in">
            <div>
                <div className="bg-gray-300 rounded-full h-2.5">
                    <div className="bg-brand-teal h-2.5 rounded-full transition-all duration-500" style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }} />
                </div>
                <p className="text-center text-xl mt-1 text-brand-dark-blue/70">שאלה {currentQuestionIndex + 1} מתוך {quizQuestions.length} | ניקוד: {score}</p>
            </div>
            <h4 className="font-bold text-3xl text-brand-dark-blue">{q.question}</h4>
            <div className="space-y-3">
                {q.options.map(opt => {
                    const isCorrect = opt === q.answer;
                    const isSelected = opt === selectedAnswer;
                    let cls = 'bg-white/60 border-brand-light-blue/30 text-brand-dark-blue hover:bg-brand-light-blue/20';
                    if (selectedAnswer) {
                        if (isCorrect) cls = 'bg-green-500 text-white border-green-600';
                        else if (isSelected) cls = 'bg-red-500 text-white border-red-600';
                        else cls = 'bg-gray-200/50 text-gray-400 border-gray-300 opacity-50';
                    }
                    return (
                        <button key={opt} onClick={() => handleAnswer(opt)} disabled={!!selectedAnswer}
                            className={`flex justify-between items-center w-full text-right p-4 rounded-xl border-2 transition-all text-2xl ${cls}`}>
                            <span>{opt}</span>
                            {selectedAnswer && isCorrect && <CheckIcon />}
                            {selectedAnswer && isSelected && !isCorrect && <CrossIcon />}
                        </button>
                    );
                })}
            </div>
            {feedback && (
                <p className={`p-3 rounded-xl font-bold text-center text-xl ${feedback.startsWith('נכון') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {feedback}
                </p>
            )}
            {selectedAnswer && (
                <button onClick={handleNextQuestion} className="w-full bg-brand-light-blue text-white font-black py-3 rounded-xl text-xl hover:bg-cyan-600 transition-colors">
                    {currentQuestionIndex < quizQuestions.length - 1 ? 'לשאלה הבאה →' : 'סיים בוחן'}
                </button>
            )}
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const STEPS = ['מה זה תלוש?', 'תלוש לדוגמה', 'התלוש של אילנית', 'בוחן ידע'];

const SalaryModule: React.FC<SalaryModuleProps> = ({ onBack, title, onComplete }) => {
    const [step, setStep] = useState(0);

    return (
        <ModuleView title={title} onBack={onBack}>
            {/* Step progress bar */}
            <div className="mb-8">
                <div className="flex items-start">
                    {STEPS.map((s, i) => (
                        <React.Fragment key={s}>
                            <button onClick={() => setStep(i)} className="flex flex-col items-center flex-1 group">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors font-bold
                                    ${step >= i ? 'bg-brand-teal border-brand-teal text-white' : 'bg-white/50 border-gray-300 text-gray-400 group-hover:border-brand-teal/50'}`}>
                                    {i + 1}
                                </div>
                                <p className={`mt-2 text-xs text-center font-bold transition-colors leading-tight ${step >= i ? 'text-brand-teal' : 'text-gray-400'}`}>{s}</p>
                            </button>
                            {i < STEPS.length - 1 && (
                                <div className={`flex-1 h-1 mt-5 mx-1 transition-colors ${step > i ? 'bg-brand-teal' : 'bg-gray-300'}`} />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Step content */}
            {step === 0 && <ExplainStep />}
            {step === 1 && <PaySlipStep />}
            {step === 2 && <FillInStep />}
            {step === 3 && <QuizStep onComplete={onComplete} />}

            {/* Navigation */}
            <div className="flex justify-between mt-8">
                <button onClick={() => setStep(s => s - 1)} disabled={step === 0}
                    className="bg-gray-300 hover:bg-gray-400 text-brand-dark-blue font-bold py-2 px-6 rounded-lg disabled:opacity-40 transition-colors text-xl">
                    הקודם
                </button>
                <button onClick={() => setStep(s => s + 1)} disabled={step === STEPS.length - 1}
                    className="bg-brand-teal hover:bg-teal-600 text-white font-bold py-2 px-6 rounded-lg disabled:opacity-40 transition-colors text-xl">
                    הבא
                </button>
            </div>
        </ModuleView>
    );
};

export default SalaryModule;