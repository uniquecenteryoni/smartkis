import React, { useState, useMemo, useEffect, ChangeEvent, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';
import type { BudgetItem, Character } from '../../types';
import ModuleView from '../ModuleView';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from 'recharts';

// Add type declarations for the new libraries
declare const html2canvas: (element: HTMLElement, options?: any) => Promise<HTMLCanvasElement>;
declare const jspdf: { jsPDF: new (options?: any) => any };


interface BudgetModuleProps {
  onBack: () => void;
  title: string;
  onComplete: () => void;
}

const characters: Character[] = [
    { 
        name: 'דניאל', 
        salary: 12000, 
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'אחראי משמרת בן 22, גר בהרצליה'
    },
    { 
        name: 'יובל', 
        salary: 12800, 
        avatar: 'https://images.pexels.com/photos/18580665/pexels-photo-18580665.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'מאמנת כושר בת 25, גרה בפתח תקווה'
    },
    { 
        name: 'רוני', 
        salary: 13500, 
        avatar: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'מדריך קומיקס בן 26, גר בתל אביב'
    },
    { 
        name: 'מאיה', 
        salary: 14000, 
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'מתכנתת מתחילה, בת 23, גרה בתל אביב'
    },
    { 
        name: 'איתן', 
        salary: 11500, 
        avatar: 'https://images.pexels.com/photos/18580633/pexels-photo-18580633.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'סטודנט בן 21, עובד בחנות בגדים בירושלים'
    },
];

const initialExpenses: (BudgetItem & { task?: React.ReactNode })[] = [
    { id: 1, category: 'שכירות', amount: 0, task: (
        <ol className="list-decimal list-inside text-right space-y-2">
            <li>למדו על שכירות ב<b className="font-bold">אייקון המידע</b>.</li>
            <li>היעזרו ב<b className="font-bold">שאלון ההכוונה</b> כדי להבין איזו דירה אתם צריכים.</li>
            <li>כנסו לאתר יד 2 דרך ה<b className="font-bold">קישור לאתר</b> וחפשו את הדירה המתאימה.</li>
            <li>מלאו את פרטי הדירה בכפתור <b className="font-bold">מלאו את פרטי הדירה</b>.</li>
        </ol>
    )},
    { id: 2, category: 'קניות בסופר', amount: 0, task: (
        <ol className="list-decimal list-inside text-right">
            <li>למדו על קניות בסופר דרך <b className="font-bold">אייקון המידע</b>.</li>
            <li>בחרו רשת שיווק בה תרצו לערוך <b className="font-bold">רשימת קניות חודשית</b>.</li>
            <li>כנסו לאתר הרשת דרך כפתור <b className="font-bold">בחרו רשת</b>.</li>
            <li>ערכו רשימת קניות חודשית שמספיקה לאדם אחד.</li>
            <li>הזינו את הסכום שקיבלתם ב<b className="font-bold">תיבת הסכום</b>.</li>
        </ol>
    )},
    { id: 3, category: 'חשבונות', amount: 0, task: (
        <ol className="list-decimal list-inside text-right space-y-2">
            <li>למדו על סוגי החשבונות השונים דרך <b className="font-bold">אייקון המידע</b>.</li>
            <li>לחצו על כפתור ה<b className="font-bold">מחשבון</b> כדי לפתוח את שאלון הערכת ההוצאות.</li>
            <li>ענו על השאלות לגבי הרגלי הצריכה שלכם.</li>
            <li>המחשבון יספק הערכה חודשית. לחצו "עדכן תקציב" כדי להזין את הסכום.</li>
        </ol>
    )},
    { id: 4, category: 'בילויים ומסעדות', amount: 0, task: (
        <ol className="list-decimal list-inside text-right space-y-2">
            <li>למדו על הוצאת הבילויים דרך <b className="font-bold">אייקון המידע</b>.</li>
            <li>דמיינו שאתם בגיל של הדמות שלכם.</li>
            <li>היעזרו ב<b className="font-bold">מחשבון</b> לבחירת סוגי הבילויים שהייתם בוחרים.</li>
            <li>ב<b className="font-bold">מחשבון</b>, תזינו כמה לדעתכם הבילויים שלכם עולים וכמה פעמים בחודש תבלו.
                <br/>
                *אם יש בילוי אחר שלא רשום - הוסיפו אותו בקטגוריית "<b className="font-bold">אחר</b>".
            </li>
            <li>לבסוף, לחצו על <b className="font-bold">עדכן תקציב</b>.</li>
        </ol>
    )},
    { id: 5, category: 'חסכון והשקעות', amount: 0, task: (
        <ul className="list-disc list-inside text-right">
            <li>קבעו באמצעות הסרגל איזה אחוז מההכנסה תרצו לחסוך.</li>
        </ul>
    )},
    { id: 6, category: 'נייד', amount: 0, task: (
         <ol className="list-decimal list-inside text-right space-y-2">
            <li>למדו על חבילות סלולר דרך <b className="font-bold">אייקון המידע</b>.</li>
            <li>כנסו לאתר "כמה זה?" דרך כפתור ה<b className="font-bold">קישור לאתר</b>.</li>
            <li>בחרו את חבילת הסלולר המתאימה והמשתלמת בעבורכם.</li>
            <li>רשמו את הסכום החודשי ב<b className="font-bold">תיבת הסכום</b>.</li>
            <li>ב<b className="font-bold">תיבת ההערות</b>, רשמו את ספק החבילה ופרטים עיקריים על החבילה.</li>
        </ol>
    )},
    { id: 7, category: 'מנויים', amount: 0, task: (
         <ol className="list-decimal list-inside text-right space-y-2">
            <li>למדו על המנויים השונים דרך <b className="font-bold">אייקון המידע</b>.</li>
            <li>לחצו על <b className="font-bold">כפתור הבחירה</b> ובחרו את המנויים שתרצו (לפחות 2).</li>
            <li>הסכום והמנויים יתעדכנו אוטומטית.</li>
        </ol>
    )},
    { id: 8, category: 'בלת"מים', amount: 0, task: (
        <ol className="list-decimal list-inside text-right space-y-2">
            <li>למדו מהם בלת"מים דרך <b className="font-bold">אייקון המידע</b>.</li>
            <li>לחצו על <b className="font-bold">כפתור הבחירה</b>.</li>
            <li>בחרו קלף שמאחוריו בלת"ם.</li>
            <li>הסכום והפרטים יתעדכנו אוטומטית.</li>
        </ol>
    )},
    { id: 9, category: 'רכב - קנייה', amount: 0, task: (
        <ol className="list-decimal list-inside text-right space-y-2">
            <li>למדו על הוצאות רכב דרך <b className="font-bold">אייקון המידע</b>.</li>
            <li>בצעו את שאלון ההכוונה כדי לקבל הכוונה על הרכב אותו אתם צריכים.</li>
            <li>כנסו לאתר יד 2 דרך הכפתור <b className="font-bold">קישור לאתר</b> ובחרו את הרכב המתאים לכם.</li>
            <li>בצעו את הרכישה בכפתור ביצוע הרכישה על ידי מילוי פרטי הרכב.</li>
            <li>*שימו לב שיש לכם אפשרות לחלוקת הקנייה לתשלומים.</li>
        </ol>
    )},
    { id: 10, category: 'רכב- ביטוח', amount: 0, task: (
        <ol className="list-decimal list-inside text-right space-y-2">
            <li>למדו על סוגי הביטוח דרך <b className="font-bold">אייקון המידע</b>.</li>
            <li>כנסו לאתר "חובה" דרך כפתור ה<b className="font-bold">קישור לאתר</b>.</li>
            <li>הזינו את פרטי הרכב, הנהג וענו על השאלות, ביחרו הצעת ביטוח, חלקו את הסכום ל-12 והזינו בתיבת הסכום.</li>
            <li className="list-none text-center font-bold">או</li>
            <li>פתחו את <b className="font-bold">מחשבון ביטוח</b> וענו על כל 10 השאלות.</li>
            <li>בחרו את הצעת הביטוח המשתלמת ביותר.</li>
            <li>לאחר בחירה, הסכום החודשי וההערות יתעדכנו אוטומטית.</li>
        </ol>
    )},
    { id: 11, category: 'רכב- אגרות', amount: 0, task: (
        <ol className="list-decimal list-inside text-right space-y-2">
            <li>למדו מהן אגרות רישוי דרך <b className="font-bold">אייקון המידע</b>.</li>
            <li>עלות האגרה <b className="font-bold">חושבה אוטומטית</b>.</li>
            <li>במידה ומצאתם טעות בסכום, כנסו לאתר בקישור, הזינו את פרטי הרכב, קבלו את העלות השנתית, חלקו אותה ל-12 והזינו בתיבת הסכום.</li>
        </ol>
    )},
    { id: 12, category: 'רכב- דלק', amount: 0, task: (
        <ol className="list-decimal list-inside text-right space-y-2">
            <li>למדו על הוצאת דלק דרך <b className="font-bold">אייקון המידע</b>.</li>
            <li>עלות הדלק <b className="font-bold">חושבה אוטומטית</b> לפי צריכת הדלק של הרכב ונסיעה חודשית ממוצעת.</li>
        </ol>
    )},
    { id: 13, category: 'רכב - טיפולים', amount: 0, task: (
        <ol className="list-decimal list-inside text-right space-y-2">
            <li>למדו על טיפולי רכב דרך <b className="font-bold">אייקון המידע</b>.</li>
            <li>בררו כמה עולה טיפול 10,000 והיעזרו ב<b className="font-bold">מחשבון</b> לחישוב עלות הטיפולים.</li>
            <li>לאחר שתלחצו על <b className="font-bold">עדכן תקציב</b>, הסכום והפרטים יוזנו אוטומטית.</li>
        </ol>
    )},
    { id: 14, category: 'הוצאות ביגוד', amount: 0, task: (
        <ol className="list-decimal list-inside text-right space-y-2">
            <li>למדו על הוצאות ביגוד דרך <b className="font-bold">אייקון המידע</b>.</li>
            <li>בחרו רשת ביגוד בעזרת כפתור <b className="font-bold">בחרו רשת</b>.</li>
            <li>באתר הרשת, צרו לעצמכם מלתחה לשנה שלמה.</li>
            <li>חלקו את הסכום הכולל ב-12 חודשים.</li>
            <li>הזינו את הסכום החודשי ב<b className="font-bold">תיבת הסכום</b>.</li>
        </ol>
    )},
];

const calculateIncomeTax = (salary: number, characterName: string): number => {
    const details = calculateIncomeTaxDetails(salary, characterName);
    return details.finalTax;
};

const calculateIncomeTaxDetails = (salary: number, characterName: string) => {
    const safeSalary = Math.max(0, salary);
    let tax = 0;
    const brackets = [
        { upTo: 7010, rate: 0.10 },
        { upTo: 10060, rate: 0.14 },
        { upTo: 16150, rate: 0.20 },
        { upTo: 22440, rate: 0.31 },
        { upTo: 46690, rate: 0.35 },
        { upTo: 60130, rate: 0.47 },
        { upTo: Infinity, rate: 0.50 },
    ];

    let processedSalary = 0;

    for (const bracket of brackets) {
        const previousBracketLimit = processedSalary;
        if (safeSalary > previousBracketLimit) {
            const taxableAmountInBracket = Math.min(safeSalary - previousBracketLimit, bracket.upTo - previousBracketLimit);
            tax += taxableAmountInBracket * bracket.rate;
            processedSalary += taxableAmountInBracket;
        } else {
            break;
        }
    }

    const CREDIT_POINT_VALUE = 242;

    // Male default: 2.25 credit points.
    let creditPoints = 2.25;

    // Keep existing female characters with 2.75 points.
    if (characterName === 'יובל' || characterName === 'מאיה') {
        creditPoints = 2.75;
    }

    const creditAmount = creditPoints * CREDIT_POINT_VALUE;
    const taxAfterCredits = Math.max(0, tax - creditAmount);

    return {
        grossTax: parseFloat(tax.toFixed(2)),
        creditPoints,
        creditAmount: parseFloat(creditAmount.toFixed(2)),
        finalTax: parseFloat(taxAfterCredits.toFixed(2)),
    };
};

const salaryDeductions = (salary: number, characterName: string): (BudgetItem & { isDeduction: boolean })[] => {
    const incomeTaxDetails = calculateIncomeTaxDetails(salary, characterName);
    const incomeTax = incomeTaxDetails.finalTax;

    // Bituach Leumi & Mas Briut calculation — employee rates per official table effective 01.01.2026.
    // Lower bracket (up to 7,703 ₪): ביטוח לאומי 1.04%, ביטוח בריאות 3.23%
    // Upper bracket (7,703–51,910 ₪): ביטוח לאומי 7.00%, ביטוח בריאות 5.17%
    let bituachLeumi = 0;
    let masBriut = 0;
    
    const lowerBracketLimit = 7703; 
    const upperBracketLimit = 51910;

    if (salary <= lowerBracketLimit) {
        bituachLeumi = salary * 0.0104; // 1.04%
        masBriut = salary * 0.0323; // 3.23%
    } else {
        // Lower bracket portion
        bituachLeumi += lowerBracketLimit * 0.0104;
        masBriut += lowerBracketLimit * 0.0323;

        // Upper bracket portion (capped at 51,910 ₪)
        const upperPartAmount = Math.min(salary, upperBracketLimit) - lowerBracketLimit;
        bituachLeumi += upperPartAmount * 0.07; // 7.00%
        masBriut += upperPartAmount * 0.0517; // 5.17%

        // Income above the upper bracket is not subject to these deductions.
    }
    
    const pension = salary * 0.065; // Example rate remains as an approximation

    // Build breakdown notes for ביטוח לאומי and מס בריאות
    const fmt = (n: number) => n.toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const buildInsuranceNote = (lowerRate: number, upperRate: number, lowerAmount: number, upperAmount: number, total: number): string => {
        if (salary <= lowerBracketLimit) {
            return `${(lowerRate * 100).toFixed(2)}% על ${fmt(salary)} ₪ = ${fmt(total)} ₪`;
        }
        const lowerPart = parseFloat((lowerAmount).toFixed(2));
        const upperPart = parseFloat((upperAmount).toFixed(2));
        return `${(lowerRate * 100).toFixed(2)}% על ${fmt(lowerBracketLimit)} ₪ = ${fmt(lowerPart)} ₪ | ${(upperRate * 100).toFixed(2)}% על ${fmt(Math.min(salary, upperBracketLimit) - lowerBracketLimit)} ₪ = ${fmt(upperPart)} ₪ | סה"כ: ${fmt(total)} ₪`;
    };

    const blLowerAmount = lowerBracketLimit * 0.0104;
    const blUpperAmount = salary <= lowerBracketLimit ? 0 : (Math.min(salary, upperBracketLimit) - lowerBracketLimit) * 0.07;
    const mbLowerAmount = lowerBracketLimit * 0.0323;
    const mbUpperAmount = salary <= lowerBracketLimit ? 0 : (Math.min(salary, upperBracketLimit) - lowerBracketLimit) * 0.0517;

    const bituachLeumiNote = buildInsuranceNote(0.0104, 0.07, blLowerAmount, blUpperAmount, bituachLeumi);
    const masBriutNote = buildInsuranceNote(0.0323, 0.0517, mbLowerAmount, mbUpperAmount, masBriut);

    return [
        {
            id: 100,
            category: 'מס הכנסה',
            amount: parseFloat(incomeTax.toFixed(2)),
            note: `מס לפני זיכוי: ${fmt(incomeTaxDetails.grossTax)} ₪ | זיכוי: ${incomeTaxDetails.creditPoints}×242 = ${fmt(incomeTaxDetails.creditAmount)} ₪ | לתשלום: ${fmt(incomeTaxDetails.finalTax)} ₪`,
            isDeduction: true
        },
        { id: 101, category: 'ביטוח לאומי', amount: parseFloat(bituachLeumi.toFixed(2)), note: bituachLeumiNote, isDeduction: true },
        { id: 102, category: 'מס בריאות', amount: parseFloat(masBriut.toFixed(2)), note: masBriutNote, isDeduction: true },
        { id: 103, category: 'הפרשה לפנסיה', amount: parseFloat(pension.toFixed(2)), note: `6.5% על ${fmt(salary)} ₪ = ${fmt(pension)} ₪ | המעסיק מוסיף עוד 6.5% (${fmt(salary * 0.065)} ₪) לחשבון הפנסיה שלך`, isDeduction: true },
    ];
};


const COLORS = ['#00b1a6', '#01b2cf', '#d52963', '#f59e0b', '#10b981', '#6366f1', '#f472b6', '#8b5cf6', '#34d399', '#fbbf24', '#a3e635', '#22d3ee'];

const categoryLinks: { [key: string]: string } = {
    'שכירות': 'https://www.yad2.co.il/realestate/rent',
    'נייד': 'https://www.kamaze.co.il/',
    'רכב - קנייה': 'https://www.yad2.co.il/vehicles/private-cars',
    'רכב- ביטוח': 'https://www.hova.co.il/third-party-insurance/calc/',
    'מס הכנסה': "https://secapp.taxes.gov.il/srsimulatorNZ/#/simulatorMasHachnasah",
    'ביטוח לאומי': "https://www.btl.gov.il/Simulators/Pages/BituahCalculator.aspx",
    'מס בריאות': "https://www.btl.gov.il/Simulators/Pages/BituahCalculator.aspx",
};

const placeholders: Record<string, string> = {
    'נייד': 'ספק (הוט מובייל/סלקום..), תוכנית',
    'רכב- ביטוח': 'רשמו את שם חברת הביטוח וסוג הביטוח',
};

const budgetGuideSteps = [
    {
        title: 'מתחילים בלמידה',
        shortText: 'קודם פותחים אייקון מידע כדי להבין את הסעיף.',
        iconLabel: 'מידע',
        buttonClass: 'bg-[#1b2550] text-white border-[#1b2550]',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )
    },
    {
        title: 'מבצעים משימה',
        shortText: 'עוברים על כפתור "משימה" ופועלים לפי ההנחיה.',
        iconLabel: 'משימה',
        buttonClass: 'bg-[#1b2550] text-white border-[#1b2550]',
        icon: <span className="font-bold text-sm">✓</span>
    },
    {
        title: 'משתמשים בכלי עזר',
        shortText: 'פותחים מחשבון/שאלון/בחירה לפי הסדר המופיע.',
        iconLabel: 'כלי עזר',
        buttonClass: 'bg-[#01b2cf] text-black border-[#01b2cf]',
        icon: <span className="font-bold text-sm">⚙</span>
    },
    {
        title: 'בודקים מקור חיצוני',
        shortText: 'נכנסים לקישור לאתר ומשווים מידע אמיתי.',
        iconLabel: 'קישור',
        buttonClass: 'bg-brand-teal text-black border-brand-teal',
        icon: <span className="font-bold text-sm">🔗</span>
    },
    {
        title: 'מעדכנים תוצאה',
        shortText: 'מזינים סכום והערה כדי להשלים את הסעיף.',
        iconLabel: 'תוצאה',
        buttonClass: 'bg-[#01b2cf] text-black border-[#01b2cf]',
        icon: <span className="font-bold text-sm">₪</span>
    },
    {
        title: 'מסיימים מחזור',
        shortText: 'מנתחים תרשים ומאזן, ואז מפיקים דו״ח סיכום.',
        iconLabel: 'סיכום',
        buttonClass: 'bg-brand-magenta text-black border-brand-magenta',
        icon: <span className="font-bold text-sm">📄</span>
    }
] as const;

const termExplanations: Record<string, string> = {
    'שכר ברוטו': 'זהו השכר הכולל שלך לפני כל הניכויים. הוא כולל את שכר היסוד, שעות נוספות, בונוסים ותוספות אחרות.',
    'ניכויים': 'אלו סכומים שהמעסיק שלך מוריד משכר הברוטו שלך על פי חוק (כמו מסים וביטוחים) לפני שהכסף מגיע אליך.',
    'מס הכנסה': 'מס המוטל על הכנסתך. החישוב במודול זה הוא פרוגרסיבי לפי מדרגות מס, ולאחר מכן מופחתות נקודות זיכוי אישיות.',
    'ביטוח לאומי': 'תשלום חובה למוסד לביטוח לאומי, המבטח אותך במקרים של אבטלה, פגיעה בעבודה, נכות, ומממן קצבאות.',
    'מס בריאות': 'תשלום חובה המממן את מערכת הבריאות הציבורית ומאפשר לך לקבל שירותים רפואיים מקופת החולים.',
    'הפרשה לפנסיה': 'חיסכון חובה לגיל פרישה. חלק מהסכום מופרש על ידך וחלק על ידי המעסיק.',
    'קרן השתלמות': 'חיסכון לטווח בינוני שניתן למשוך לאחר 6 שנים. העובד מפריש 2.5% והמעסיק מוסיף 7.5% — זהו אחד מההטבות הכי כדאיות לשכיר.',
};

const categoryExplanations: { [key: string]: { title: string; content: React.ReactNode } } = {
    'שכירות': {
        title: 'הסבר על שכירות',
        content: (
            <div className="text-right space-y-2">
                <p>שכירת דירה היא הוצאה גדולה וצעד חשוב לעצמאות. כשחושבים על זה, כדאי לקחת בחשבון כמה דברים:</p>
                <ul className="list-disc list-inside pr-4">
                    <li><strong>מיקום:</strong> דירה קרובה ללימודים או לעבודה יכולה לחסוך לכם הרבה כסף וזמן על נסיעות.</li>
                    <li><strong>שותפים:</strong> לגור עם שותפים זה לא רק כיף, זה גם מקטין משמעותית את שכר הדירה והחשבונות לכל אחד.</li>
                    <li><strong>חוזה שכירות:</strong> זהו מסמך משפטי שקובע את הכללים בין השוכר לבעל הדירה. חשוב להבין מה כתוב בו, למשל מי אחראי לתיקונים ומה כלול במחיר.</li>
                </ul>
            </div>
        )
    },
    'חשבונות': {
        title: 'הסבר על חשבונות',
        content: (
            <div className="text-right space-y-2">
                <p>מעבר לשכר הדירה, ישנם עוד מספר תשלומים חודשיים או דו-חודשיים שצריך להכיר:</p>
                <ul className="list-disc list-inside pr-4">
                    <li><strong>ארנונה:</strong> מס עירוני המשולם לרשות המקומית.</li>
                    <li><strong>חשמל:</strong> תשלום לחברת החשמל לפי צריכה.</li>
                    <li><strong>מים:</strong> תשלום לתאגיד המים המקומי לפי צריכה.</li>
                    <li><strong>ועד בית:</strong> תשלום חודשי לכיסוי הוצאות התחזוקה של הבניין.</li>
                    <li><strong>גז:</strong> תשלום עבור צריכת גז לבישול וחימום מים.</li>
                </ul>
            </div>
        )
    },
    'נייד': {
        title: 'הסבר על חבילת סלולר',
        content: (
            <div className="text-right space-y-2">
                 <p>השוואת חבילות סלולר היא דרך חכמה לחסוך כסף. הנה כמה דברים שכדאי לבדוק:</p>
                <ul className="list-disc list-inside pr-4">
                    <li><strong>חבילת גלישה:</strong> בדקו כמה ג'יגה (GB) אתם באמת צריכים בחודש.</li>
                    <li><strong>שיחות והודעות:</strong> רוב החבילות היום כוללות שיחות והודעות ללא הגבלה.</li>
                    <li><strong>שיחות לחו"ל:</strong> בדקו אם החבילה כוללת דקות שיחה למדינות שאתם צריכים.</li>
                    <li><strong>מחיר קבוע:</strong> ודאו שהמחיר המוצע אינו "מבצע" זמני שעולה משמעותית לאחר שנה.</li>
                </ul>
                 <p className="mt-2 font-bold">השתמשו באתרי השוואת מחירים כמו "כמה זה?" כדי למצוא את העסקה הטובה ביותר!</p>
            </div>
        )
    },
    'חסכון והשקעות': {
        title: 'הסבר על חיסכון והשקעות',
        content: (
            <div className="text-right space-y-2">
                <p>חיסכון הוא הרגל חשוב בניהול כספים נכון. זהו כסף שאתם שמים בצד היום כדי להשתמש בו בעתיד.</p>
                <ul className="list-disc list-inside pr-4">
                    <li><strong>למה לחסוך?</strong> למטרות גדולות (כמו טיול, לימודים), למקרי חירום, או פשוט כדי לבנות ביטחון כלכלי.</li>
                    <li><strong>מה זו השקעה?</strong> השקעה היא שימוש בכסף שחסכתם כדי "להעסיק" אותו ולייצר עוד כסף (למשל, בשוק ההון). השקעה טומנת בחובה סיכון, אך גם פוטנציאל לרווח גבוה יותר מחיסכון רגיל.</li>
                    <li><strong>כלל אצבע:</strong> מומלץ לחסוך לפחות 10% מההכנסה הפנויה שלכם בכל חודש.</li>
                </ul>
            </div>
        )
    },
    'בלת"מים': {
        title: 'הסבר על בלת"מ',
        content: (
            <div className="text-right space-y-2">
                <p>בלת"מ הוא קיצור של "בלתי מתוכנן". אלו הן כל ההוצאות שלא ציפינו להן, והן יכולות להפתיע אותנו בכל רגע.</p>
                <ul className="list-disc list-inside pr-4">
                    <li><strong>דוגמאות:</strong> דוח חנייה, תיקון פתאומי של המחשב או הטלפון, טיפול שיניים דחוף, מתנה לאירוע ששכחנו ממנו.</li>
                    <li><strong>למה זה חשוב?</strong> אם לא נהיה מוכנים, הוצאות כאלה יכולות להכניס אותנו למינוס. לכן, חשוב לשים בצד סכום קטן בכל חודש ל"קרן חירום" שתעזור לנו להתמודד עם הפתעות.</li>
                </ul>
            </div>
        )
    },
    'בילויים ומסעדות': {
        title: 'הסבר על בילויים ומסעדות',
        content: (
             <div className="text-right space-y-2">
                <p>קטגוריה זו כוללת את כל הכסף שאנחנו מוציאים על הנאות ופנאי. זוהי דוגמה ל"הוצאה משתנה", כלומר, הוצאה שיש לנו שליטה עליה ואפשר להתאים אותה לתקציב.</p>
                <ul className="list-disc list-inside pr-4">
                    <li><strong>מה כלול?</strong> יציאות עם חברים, מסעדות, בתי קפה, סרטים, הופעות, מסיבות וכל תחביב אחר שעולה כסף.</li>
                    <li><strong>המפתח לחיסכון:</strong> מכיוון שזו הוצאה גמישה, זה המקום הראשון שבו אפשר לקצץ אם רוצים לחסוך כסף למטרה אחרת.</li>
                    <li><strong>טיפ:</strong> תכננו מראש כמה אתם רוצים להוציא על בילויים כל חודש. זה יעזור לכם ליהנות בלי לחרוג מהתקציב.</li>
                </ul>
            </div>
        )
    },
    'קניות בסופר': {
        title: 'הסבר על קניות בסופר',
        content: (
            <div className="text-right space-y-2">
                <p>קניות בסופר הן הוצאה גדולה שאפשר לנהל בחוכמה. היא כוללת לא רק אוכל, אלא גם מוצרי ניקיון, טואלטיקה ועוד.</p>
                <ul className="list-disc list-inside pr-4">
                    <li><strong>תכנון מראש:</strong> הדרך הטובה ביותר לחסוך היא להכין רשימת קניות ולהיצמד אליה.</li>
                    <li><strong>לא קונים רעבים:</strong> כשרעבים, קונים יותר דברים לא מתוכננים.</li>
                    <li><strong>השוואת מחירים:</strong> שימו לב למחירים ליחידת מידה (ל-100 גרם / 1 ליטר) כדי למצוא את העסקה המשתלמת באמת.</li>
                </ul>
            </div>
        )
    },
    'מנויים': {
        title: 'הסבר על מנויים',
        content: (
            <div className="text-right space-y-2">
                <p>מנויים הם תשלומים חודשיים קבועים עבור שירותים. קל לשכוח מהם, והסכומים הקטנים האלה יכולים להצטבר לסכום גדול.</p>
                <ul className="list-disc list-inside pr-4">
                    <li><strong>דוגמאות:</strong> נטפליקס, ספוטיפיי, חדר כושר, מנוי למגזין, אפליקציות שונות.</li>
                    <li><strong>בדיקה תקופתית:</strong> מומלץ לעבור על רשימת המנויים שלכם פעם בכמה חודשים ולוודא שאתם עדיין משתמשים ונהנים מכולם.</li>
                    <li><strong>ביטול קל:</strong> אל תהססו לבטל מנויים שאתם לא משתמשים בהם. זה כסף קל לחיסכון!</li>
                </ul>
            </div>
        )
    },
    'רכב - קנייה': {
        title: 'הסבר על קניית רכב',
        content: (
            <div className="text-right space-y-2">
                <p>כשקונים רכב, לרוב לא משלמים את כל הסכום בבת אחת. סעיף זה מייצג את התשלום החודשי על הרכב (הלוואה או ליסינג).</p>
                <ul className="list-disc list-inside pr-4">
                    <li><strong>עלות כוללת:</strong> זכרו שההוצאה על רכב לא מסתכמת רק בתשלום החודשי. יש להוסיף ביטוח, דלק, טיפולים ואגרות.</li>
                    <li><strong>ירידת ערך:</strong> רכב הוא נכס שערכו יורד במהירות. חשוב לקחת זאת בחשבון בעת הרכישה.</li>
                    <li><strong>תכנון:</strong> לפני שקונים רכב, חשוב לוודא שההוצאה החודשית על הרכב מתאימה לתקציב הכללי שלכם.</li>
                </ul>
            </div>
        )
    },
    'הוצאות ביגוד': {
        title: 'הסבר על הוצאות ביגוד',
        content: (
            <div className="text-right space-y-2">
                <p>הוצאות על ביגוד והנעלה הן הוצאות משתנות. יש לנו שליטה מלאה על הסכום שאנו מוציאים בקטגוריה זו.</p>
                <ul className="list-disc list-inside pr-4">
                    <li><strong>צורך מול רצון:</strong> חשוב להבדיל בין בגד שאנחנו באמת צריכים (למשל, מעיל לחורף) לבין בגד שאנחנו פשוט רוצים כי הוא אופנתי.</li>
                    <li><strong>תכנון תקציב:</strong> הגדירו מראש סכום חודשי או עונתי שאתם מקצים לקניות בגדים. זה יעזור לכם להימנע מקניות אימפולסיביות.</li>
                    <li><strong>מבצעי סוף עונה:</strong> דרך מצוינת לחסוך היא לקנות בגדים מחוץ לעונה או לחכות למבצעי סוף עונה.</li>
                </ul>
            </div>
        )
    },
    'רכב- ביטוח': {
        title: 'הסבר על ביטוח רכב',
        content: (
            <div className="text-right space-y-2">
                <p>ביטוח רכב הוא חובה והוצאה משמעותית. קיימים 3 סוגים עיקריים:</p>
                <ul className="list-disc list-inside pr-4">
                    <li><strong>ביטוח חובה:</strong> מכסה נזקי גוף (פציעות) בלבד. חובה על פי חוק.</li>
                    <li><strong>ביטוח צד ג':</strong> מכסה נזקים לרכוש של אחרים (למשל, רכב אחר).</li>
                    <li><strong>ביטוח מקיף:</strong> כולל חובה, צד ג', וגם מכסה נזקים לרכב שלך (תאונה, גניבה וכו').</li>
                </ul>
                 <p className="font-bold mt-2">חשוב להשוות מחירים בין חברות הביטוח השונות!</p>
            </div>
        )
    },
    'רכב- אגרות': {
        title: 'הסבר על אגרות רכב',
        content: (
             <div className="text-right space-y-2">
                <p>אגרת רישוי (או "טסט") היא תשלום חובה שנתי שכל בעל רכב בישראל חייב לשלם למשרד התחבורה.</p>
                <p>גובה האגרה נקבע בעיקר לפי שווי הרכב כשהיה חדש, ופוחת עם השנים. יש לחלק את הסכום השנתי ב-12 כדי לקבל את העלות החודשית.</p>
            </div>
        )
    },
     'רכב- דלק': {
        title: 'הסבר על עלות דלק',
        content: (
             <div className="text-right space-y-2">
                <p>עלות הדלק היא הוצאה משתנה ותלויה בכמה אתם נוסעים ובצריכת הדלק של הרכב שלכם (ק"מ לליטר).</p>
                <p>החישוב מתבצע כך: (סה"כ ק"מ בחודש / צריכת דלק) * מחיר ליטר דלק.</p>
            </div>
        )
    },
    'רכב - טיפולים': {
        title: 'הסבר על טיפולי רכב',
        content: (
            <div className="text-right space-y-2">
                <p>טיפול שוטף (כמו "טיפול 10,000") חיוני לשמירה על תקינות ובטיחות הרכב. הוא כולל החלפת שמנים, פילטרים ובדיקת מערכות חיוניות.</p>
                <p>מומלץ לשים בצד סכום חודשי קבוע לכיסוי עלויות הטיפולים השוטפים ותיקונים בלתי צפויים.</p>
            </div>
        )
    }
};

// Tooltip component to reduce repetition
const Tooltip: React.FC<{ title: string; content: React.ReactNode }> = ({ title, content }) => (
    <div className="relative group flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div className="absolute bottom-full right-1/2 translate-x-1/2 mb-2 w-96 bg-brand-dark-blue text-white text-2xl rounded-lg p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50 shadow-lg text-right">
        <p className="font-bold">{title}</p>
        {typeof content === 'string' ? <p>{content}</p> : content}
        <div className="absolute top-full left-1/2 -ml-2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-brand-dark-blue"></div>
      </div>
    </div>
);
  
const UnforeseenEventModal: React.FC<{ onClose: () => void; onResult: (result: { label: string; value: number }) => void; style?: React.CSSProperties }> = ({ onClose, onResult, style }) => {
    const events = [
        { label: 'דוח חנייה (-100)', value: 100 },
        { label: 'שובר קניות (+100)', value: -100 },
        { label: 'חתונה של חבר (-600)', value: 600 },
        { label: 'מתנה מסבתא (+550)', value: -550 },
        { label: 'החזר מס (+400)', value: -400 },
        { label: 'תשלום לביטוח לאומי (-300)', value: 300 },
    ];

    const [shuffledEvents, setShuffledEvents] = useState<(typeof events)[0][]>([]);
    const [flippedIndex, setFlippedIndex] = useState<number | null>(null);

    useEffect(() => {
        setShuffledEvents([...events].sort(() => Math.random() - 0.5));
    }, []);

    const handleCardClick = (index: number) => {
        if (flippedIndex !== null) return;
        setFlippedIndex(index);
        const selectedEvent = shuffledEvents[index];
        onResult(selectedEvent);
    };

    return (
        <div className="absolute bg-black bg-opacity-50 z-50 animate-fade-in" style={style}>
            <div className="bg-white p-6 rounded-2xl w-full max-w-2xl shadow-2xl text-center">
                <h3 className="text-2xl font-bold mb-2 text-brand-light-blue">הפתעה!</h3>
                <p className="text-brand-dark-blue/90 mb-6">בחיים כמו בחיים לפעמים נופלות עלינו הוצאות והפתעות, ליחצו על אחד הקלפים וגלו את שלכם.</p>
                
                <div className="grid grid-cols-3 gap-4" style={{ perspective: '1000px' }}>
                    {shuffledEvents.map((event, index) => (
                        <div
                            key={index}
                            onClick={() => handleCardClick(index)}
                            className={`relative w-full h-48 cursor-pointer transition-transform duration-700 ${flippedIndex === index ? '[transform:rotateY(180deg)]' : ''}`}
                            style={{ transformStyle: 'preserve-3d' }}
                        >
                            {/* Card Front (Facedown) */}
                            <div className="absolute w-full h-full bg-brand-teal rounded-lg flex items-center justify-center" style={{ backfaceVisibility: 'hidden' }}>
                                <span className="text-white text-5xl font-bold">?</span>
                            </div>
                            {/* Card Back (Faceup) */}
                            <div className="absolute w-full h-full bg-gray-100 rounded-lg flex flex-col items-center justify-center p-4 border-2 border-brand-teal" style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}>
                                <p className="font-bold text-lg">{event.label.split('(')[0].trim()}</p>
                                <p className={`text-2xl font-bold ${event.value > 0 ? 'text-brand-magenta' : 'text-green-500'}`}>
                                    {event.value > 0 ? `-${event.value.toLocaleString()} ₪` : `+${(-event.value).toLocaleString()} ₪`}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                
                {flippedIndex !== null && <p className="font-bold text-xl mt-4 animate-fade-in">התקציב עודכן!</p>}
                
                <button 
                    onClick={onClose} 
                    className="mt-6 w-full bg-gray-300 hover:bg-gray-400 text-brand-dark-blue font-bold py-2 px-4 rounded-lg transition-colors">
                    סגור
                </button>
            </div>
        </div>
    );
};

const CarQuestionnaireModal: React.FC<{ onClose: () => void, style?: React.CSSProperties }> = ({ onClose, style }) => {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [results, setResults] = useState<{
        vehicleType: 'מיני' | 'גודל רגיל' | 'משפחתי' | 'אופנוע';
        recommendedFuel: string;
        priceRange: string;
        productionYears: string;
        propulsionType: string;
        mileageRange: string;
        price: string;
        consumption: string;
        type: string;
        year: string;
        reliability: string;
    } | null>(null);

    const questions = [
        {
            question: "איך נראה שבוע נסיעות רגיל שלך?",
            options: ["בעיקר עיר וחניה צפופה", "שילוב עיר ובין-עירוני", "הרבה בין-עירוני/כבישים מהירים"]
        },
        {
            question: "באיזו תדירות נוסעים איתך יותר מ-2 נוסעים?",
            options: ["כמעט אף פעם", "לפעמים", "לעיתים קרובות"]
        },
        {
            question: "מה חשוב לך יותר ביום-יום?",
            options: ["להקטין הוצאות שוטפות", "איזון בין נוחות לעלות", "נוחות וביצועים"]
        },
        {
            question: "מה מצב החניה הקבוע שלך?",
            options: ["אין חניה קבועה", "חניה קבועה", "חניה קבועה עם אפשרות טעינה"]
        },
        {
            question: "כמה חשוב לך ראש שקט מתקלות?",
            options: ["קריטי לי, מעדיפ/ה רכב צעיר", "חשוב אבל לא בכל מחיר", "מוכן/ה להתפשר על שנתון בשביל מחיר"]
        },
        {
            question: "מה רמת ההתחייבות החודשית שנוחה לך לאורך זמן?",
            options: ["נמוכה", "בינונית", "גבוהה"]
        },
        {
            question: "כמה ק" + '"' + "מ אתה עושה בערך בחודש?",
            options: ["עד 800", "800-1,500", "מעל 1,500"]
        }
    ];

    const handleAnswer = (qIndex: number, answer: string) => {
        const newAnswers = { ...answers, [qIndex]: answer };
        setAnswers(newAnswers);

        if (qIndex < questions.length - 1) {
            setStep(qIndex + 1);
        } else {
            const scores = {
                mini: 0,
                regular: 0,
                family: 0,
                motorcycle: 0,
            };

            if (newAnswers[0] === 'בעיקר עיר וחניה צפופה') {
                scores.mini += 3;
                scores.motorcycle += 3;
                scores.regular += 1;
            } else if (newAnswers[0] === 'שילוב עיר ובין-עירוני') {
                scores.regular += 3;
                scores.mini += 1;
                scores.family += 1;
            } else {
                scores.family += 3;
                scores.regular += 2;
            }

            if (newAnswers[1] === 'כמעט אף פעם') {
                scores.motorcycle += 2;
                scores.mini += 2;
            } else if (newAnswers[1] === 'לפעמים') {
                scores.regular += 2;
                scores.family += 1;
            } else {
                scores.family += 4;
                scores.regular += 2;
                scores.motorcycle -= 3;
            }

            if (newAnswers[2] === 'להקטין הוצאות שוטפות') {
                scores.mini += 2;
                scores.motorcycle += 2;
            } else if (newAnswers[2] === 'איזון בין נוחות לעלות') {
                scores.regular += 3;
                scores.family += 1;
            } else {
                scores.family += 2;
                scores.regular += 2;
            }

            if (newAnswers[3] === 'אין חניה קבועה') {
                scores.mini += 2;
                scores.motorcycle += 2;
            } else if (newAnswers[3] === 'חניה קבועה') {
                scores.regular += 1;
                scores.family += 1;
            } else {
                scores.regular += 2;
                scores.family += 1;
            }

            if (newAnswers[4] === 'קריטי לי, מעדיפ/ה רכב צעיר') {
                scores.regular += 1;
                scores.family += 1;
            } else if (newAnswers[4] === 'מוכן/ה להתפשר על שנתון בשביל מחיר') {
                scores.mini += 1;
                scores.motorcycle += 1;
            }

            const sortedTypes = Object.entries(scores).sort((a, b) => b[1] - a[1]);
            const topType = sortedTypes[0][0];

            const vehicleType: 'מיני' | 'גודל רגיל' | 'משפחתי' | 'אופנוע' =
                topType === 'motorcycle'
                    ? 'אופנוע'
                    : topType === 'family'
                        ? 'משפחתי'
                        : topType === 'regular'
                            ? 'גודל רגיל'
                            : 'מיני';

            const monthlyCommitment = newAnswers[5];
            const monthlyKm = newAnswers[6];

            const priceByCommitment: Record<string, string> = {
                'נמוכה': vehicleType === 'אופנוע' ? '12,000 - 35,000 ₪' : '20,000 - 55,000 ₪',
                'בינונית': vehicleType === 'אופנוע' ? '25,000 - 55,000 ₪' : '55,000 - 95,000 ₪',
                'גבוהה': vehicleType === 'אופנוע' ? '45,000 - 90,000 ₪' : '95,000 - 160,000 ₪',
            };

            const yearsByReliability: Record<string, string> = {
                'קריטי לי, מעדיפ/ה רכב צעיר': '2021-2026',
                'חשוב אבל לא בכל מחיר': '2018-2024',
                'מוכן/ה להתפשר על שנתון בשביל מחיר': '2014-2021',
            };

            const fuelByTypeAndUsage = (() => {
                if (vehicleType === 'אופנוע') return '25-35 ק"מ/ליטר';
                if (vehicleType === 'מיני') return monthlyKm === 'מעל 1,500' ? '17-22 ק"מ/ליטר' : '15-20 ק"מ/ליטר';
                if (vehicleType === 'משפחתי') return monthlyKm === 'מעל 1,500' ? '14-18 ק"מ/ליטר' : '12-16 ק"מ/ליטר';
                return monthlyKm === 'מעל 1,500' ? '15-19 ק"מ/ליטר' : '13-17 ק"מ/ליטר';
            })();

            const propulsionType = (() => {
                if (vehicleType === 'אופנוע') return 'בנזין חסכוני (250-500 סמ"ק)';
                if (newAnswers[3] === 'חניה קבועה עם אפשרות טעינה') return 'חשמלי/פלאג-אין היברידי';
                if (monthlyKm === 'מעל 1,500') return 'היברידי';
                return 'בנזין חסכוני או היברידי';
            })();

            const mileageRange = (() => {
                if (newAnswers[4] === 'קריטי לי, מעדיפ/ה רכב צעיר') {
                    return vehicleType === 'אופנוע' ? 'עד 30,000 ק"מ' : 'עד 80,000 ק"מ';
                }
                if (newAnswers[4] === 'חשוב אבל לא בכל מחיר') {
                    return vehicleType === 'אופנוע' ? '30,000-60,000 ק"מ' : '80,000-140,000 ק"מ';
                }
                return vehicleType === 'אופנוע' ? '60,000-90,000 ק"מ' : '140,000-200,000 ק"מ';
            })();

            const reliabilityResult = newAnswers[4] === 'קריטי לי, מעדיפ/ה רכב צעיר'
                ? 'התמקדו ברכב עם היסטוריית טיפולים מלאה ויד נמוכה.'
                : newAnswers[4] === 'חשוב אבל לא בכל מחיר'
                    ? 'חפשו איזון בין מחיר, תחזוקה וקילומטראז\'.'
                    : 'בדקו היטב מצב מכני לפני קנייה כדי לחסוך בעלות הרכישה.';
            
            setResults({
                vehicleType,
                recommendedFuel: fuelByTypeAndUsage,
                priceRange: priceByCommitment[monthlyCommitment] || '20,000 - 90,000 ₪',
                productionYears: yearsByReliability[newAnswers[4]] || '2018-2024',
                propulsionType,
                mileageRange,
                price: priceByCommitment[monthlyCommitment] || '20,000 - 90,000 ₪',
                type: vehicleType,
                reliability: reliabilityResult,
                year: yearsByReliability[newAnswers[4]] || '2018-2024',
                consumption: fuelByTypeAndUsage
            });
            setStep(qIndex + 1);
        }
    };

    return (
        <div className="absolute bg-black bg-opacity-50 z-50 animate-fade-in" style={style}>
            <div className="bg-white p-8 rounded-2xl w-full max-w-lg shadow-2xl">
                {step < questions.length ? (
                    <>
                        <h3 className="text-2xl font-bold mb-6 text-brand-light-blue">שאלון התאמת רכב ({step + 1}/{questions.length})</h3>
                        <p className="text-xl font-semibold mb-4">{questions[step].question}</p>
                        <div className="space-y-3">
                            {questions[step].options.map(opt => (
                                <button key={opt} onClick={() => handleAnswer(step, opt)} className="w-full bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-lg text-right transition-colors">
                                    {opt}
                                </button>
                            ))}
                        </div>
                        <button onClick={onClose} className="mt-6 w-full bg-gray-300 hover:bg-gray-400 text-brand-dark-blue font-bold py-2 px-4 rounded-lg transition-colors">
                            סגור
                        </button>
                    </>
                ) : (
                    <div className="text-center">
                        <h3 className="text-2xl font-bold mb-4 text-brand-teal">המלצת החיפוש שלך:</h3>
                        <div className="space-y-3 text-lg bg-gray-50 p-6 rounded-xl">
                            <p><strong>סוג הרכב:</strong> {results?.vehicleType}</p>
                            <p><strong>צריכת דלק מומלצת:</strong> {results?.recommendedFuel}</p>
                            <p><strong>טווח מחיר:</strong> {results?.priceRange}</p>
                            <p><strong>טווח שנות ייצור:</strong> {results?.productionYears}</p>
                            <p><strong>סוג הנעה מומלץ:</strong> {results?.propulsionType}</p>
                            <p><strong>טווח קילומטראז׳ מומלץ ביד2:</strong> {results?.mileageRange}</p>
                            <p><strong>דגש בחיפוש:</strong> {results?.reliability}</p>
                            <p className="text-sm mt-2 pt-2 border-t border-gray-300">
                                - שאר הקריטריונים כמו: יד, קילומטראז ודגם ישפיעו על המחיר ועליכם למצוא את הבחירה הכי מתשלמת.
                            </p>
                        </div>
                        <p className="mt-4">השתמשו בנתונים האלה כדי להתחיל את החיפוש באתר "יד2"!</p>
                        <button onClick={onClose} className="mt-6 w-full bg-brand-magenta text-white font-bold py-3 px-4 rounded-lg">סגור</button>
                    </div>
                )}
            </div>
        </div>
    );
};

const RentQuestionnaireModal: React.FC<{ onClose: () => void, style?: React.CSSProperties, selectedCharacter?: Character | null }> = ({ onClose, style, selectedCharacter }) => {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [results, setResults] = useState<{
        budget: string;
        sizeSqm: string;
        rooms: string;
        locationSuggestions: string[];
    } | null>(null);

    const cityMatch = selectedCharacter?.description.match(/גר(?:ה)?\s+ב([א-ת"'\-\s]+)/);
    const baseCity = cityMatch?.[1]?.trim() || 'תל אביב';

    const nearbyCitiesByBase: Record<string, string[]> = {
        'הרצליה': ['רמת השרון', 'רעננה', 'כפר סבא', 'הוד השרון', 'תל אביב'],
        'פתח תקווה': ['בני ברק', 'רמת גן', 'גבעת שמואל', 'קריית אונו', 'ראש העין'],
        'תל אביב': ['רמת גן', 'גבעתיים', 'חולון', 'בת ים', 'הרצליה'],
        'ירושלים': ['מבשרת ציון', 'מעלה אדומים', 'בית שמש', 'גבעת זאב', 'אבו גוש'],
    };

    const questions = [
        {
            question: "איזה סכום חודשי ירגיש לכם נוח לשכר דירה?",
            note: "קפיצות של 500 ש״ח כדי לדייק תקציב ריאלי.",
            options: ["עד 3,500 ₪", "3,500-4,500 ₪", "4,500-6,000 ₪", "6,000 ₪ ומעלה"]
        },
        {
            question: "איזה סגנון מגורים מתאים לכם ביום-יום?",
            options: ["דירה קטנה ומדויקת", "דירה בינונית ונוחה", "דירה גדולה ומרווחת"]
        },
        {
            question: "מה רמת הפרטיות שאתם צריכים בבית?",
            options: ["חלל עיקרי אחד מספיק לי", "חשוב לי חדר שינה נפרד", "חשובים לי כמה חללים נפרדים"]
        },
        {
            question: "באיזו תדירות תארחו בבית?",
            options: ["כמעט לא מארח/ת", "מארח/ת לפעמים", "מארח/ת הרבה"]
        },
        {
            question: "מה חשוב יותר בבחירת המיקום?",
            options: ["קרוב מאוד לעיר המגורים", "איזון בין מרחק למחיר", "מחיר עדיף גם אם רחוק יותר"]
        },
        {
            question: "אם צריך לבחור, על מה תתפשרו קודם?",
            options: ["לא מתפשר/ת על גודל", "פשרה חלקית על גודל", "מוכן/ה לדירה קטנה יותר בשביל מיקום/מחיר"]
        }
    ];

    const handleAnswer = (qIndex: number, answer: string) => {
        const newAnswers = { ...answers, [qIndex]: answer };
        setAnswers(newAnswers);

        if (qIndex < questions.length - 1) {
            setStep(qIndex + 1);
        } else {
            const budget = newAnswers[0] || '3,500 ₪';
            const lifestyleAnswer = newAnswers[1] || '';
            const privacyAnswer = newAnswers[2] || '';
            const hostingAnswer = newAnswers[3] || '';
            const locationPriority = newAnswers[4] || '';
            const compromiseAnswer = newAnswers[5] || '';

            let sizeScore = lifestyleAnswer.includes('גדולה') ? 3 : lifestyleAnswer.includes('בינונית') ? 2 : 1;
            if (hostingAnswer.includes('הרבה')) sizeScore += 1;
            if (compromiseAnswer.includes('קטנה יותר')) sizeScore -= 1;
            if (compromiseAnswer.includes('פשרה חלקית')) sizeScore -= 0.5;

            let roomsScore = privacyAnswer.includes('כמה חללים') ? 3 : privacyAnswer.includes('חדר שינה') ? 2 : 1;
            if (hostingAnswer.includes('הרבה')) roomsScore += 1;
            if (compromiseAnswer.includes('קטנה יותר')) roomsScore -= 1;

            const sizeSqm = sizeScore <= 1
                ? '30-45 מ"ר'
                : sizeScore <= 2
                    ? '45-65 מ"ר'
                    : sizeScore <= 3
                        ? '65-85 מ"ר'
                        : '85-105 מ"ר';

            const rooms = roomsScore <= 1
                ? '1-1.5 חדרים'
                : roomsScore <= 2
                    ? '2-2.5 חדרים'
                    : roomsScore <= 3
                        ? '3-3.5 חדרים'
                        : '4 חדרים';

            const baseSuggestions = nearbyCitiesByBase[baseCity] || ['רמת גן', 'גבעתיים', 'חולון', 'בת ים', 'הרצליה'];
            const locationSuggestions = locationPriority.includes('מחיר נמוך')
                ? [...baseSuggestions].reverse()
                : locationPriority.includes('איזון')
                    ? [baseSuggestions[0], baseSuggestions[2], baseSuggestions[1], baseSuggestions[4], baseSuggestions[3]].filter(Boolean)
                    : baseSuggestions;
            
            setResults({
                budget,
                sizeSqm,
                rooms,
                locationSuggestions,
            });
            setStep(qIndex + 1);
        }
    };
    
    return (
        <div className="absolute bg-black bg-opacity-50 z-50 animate-fade-in" style={style}>
            <div className="bg-white p-8 rounded-2xl w-full max-w-lg shadow-2xl">
                {step < questions.length ? (
                    <>
                        <h3 className="text-2xl font-bold mb-2 text-brand-light-blue">שאלון התאמת דירה ({step + 1}/{questions.length})</h3>
                        <p className="text-xl font-semibold mb-2">{questions[step].question}</p>
                        {questions[step].note && <p className="text-sm text-gray-600 mb-4">{questions[step].note}</p>}
                        <div className="space-y-3">
                            {questions[step].options.map(opt => (
                                <button key={opt} onClick={() => handleAnswer(step, opt)} className="w-full bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-lg text-right transition-colors">
                                    {opt}
                                </button>
                            ))}
                        </div>
                         <button onClick={onClose} className="mt-6 w-full bg-gray-300 hover:bg-gray-400 text-brand-dark-blue font-bold py-2 px-4 rounded-lg transition-colors">
                            סגור
                        </button>
                    </>
                ) : (
                    <div className="text-center">
                        <h3 className="text-2xl font-bold mb-4 text-brand-teal">המלצת החיפוש שלך:</h3>
                        <div className="space-y-3 text-lg bg-gray-50 p-6 rounded-xl text-right">
                            <p><strong>💰 תקציב השכירות:</strong> {results?.budget}</p>
                            <p><strong>📐 גודל במ״ר:</strong> {results?.sizeSqm}</p>
                            <p><strong>🚪 מספר חדרים:</strong> {results?.rooms}</p>
                            <div>
                                <p><strong>📍 מיקום מוצע (עד 20 ק״מ מ{baseCity}):</strong></p>
                                <ul className="list-disc list-inside mt-1">
                                    {results?.locationSuggestions.map(city => (
                                        <li key={city}>{city}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <p className="mt-4">השתמשו בנתונים האלה כדי להתחיל את החיפוש באתר "יד2"!</p>
                        <button onClick={onClose} className="mt-6 w-full bg-brand-magenta text-white font-bold py-3 px-4 rounded-lg">סגור והמשך</button>
                    </div>
                )}
            </div>
        </div>
    );
};


const SupermarketModal: React.FC<{
    onClose: () => void;
    onSelect: (name: string) => void;
    style?: React.CSSProperties;
}> = ({ onClose, onSelect, style }) => {
    const supermarkets = [
        { name: 'רמי לוי', url: 'https://www.rami-levy.co.il/' },
        { name: 'שופרסל', url: 'https://www.shufersal.co.il/' },
        { name: 'ויקטורי', url: 'https://www.victory.co.il/' },
        { name: 'חצי חינם', url: 'https://shop.hazi-hinam.co.il/' },
    ];

    return (
        <div className="absolute bg-black bg-opacity-50 z-50 animate-fade-in" style={style}>
            <div className="bg-white p-6 rounded-2xl w-full max-w-xs shadow-2xl text-center">
                <h3 className="text-2xl font-bold mb-4 text-brand-light-blue">בחר רשת שיווק</h3>
                <div className="flex flex-col gap-3">
                    {supermarkets.map(s => (
                        <a
                            key={s.name}
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => {
                                onSelect(s.name);
                                onClose();
                            }}
                            className="block w-full bg-brand-teal hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                        >
                            {s.name}
                        </a>
                    ))}
                </div>
                <button
                    onClick={onClose}
                    className="mt-6 w-full bg-gray-300 hover:bg-gray-400 text-brand-dark-blue font-bold py-2 px-4 rounded-lg transition-colors">
                    סגור
                </button>
            </div>
        </div>
    );
};

const ClothingStoreModal: React.FC<{
    onClose: () => void;
    onSelect: (name: string) => void;
    style?: React.CSSProperties;
}> = ({ onClose, onSelect, style }) => {
    const stores = [
        { name: 'Terminal X', url: 'https://www.terminalx.com/' },
        { name: 'Zara', url: 'https://www.zara.com/il/' },
        { name: 'H&M', url: 'https://www2.hm.com/he_il/index.html' },
        { name: 'Castro', url: 'https://www.castro.com/' },
        { name: 'Fox', url: 'https://www.fox.co.il/' },
    ];

    return (
        <div className="absolute bg-black bg-opacity-50 z-50 animate-fade-in" style={style}>
            <div className="bg-white p-6 rounded-2xl w-full max-w-xs shadow-2xl text-center">
                <h3 className="text-2xl font-bold mb-4 text-brand-light-blue">בחר רשת ביגוד</h3>
                <div className="flex flex-col gap-3">
                    {stores.map(s => (
                        <a
                            key={s.name}
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => onSelect(s.name)}
                            className="block w-full bg-brand-teal hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                        >
                            {s.name}
                        </a>
                    ))}
                </div>
                <button
                    onClick={onClose}
                    className="mt-6 w-full bg-gray-300 hover:bg-gray-400 text-brand-dark-blue font-bold py-2 px-4 rounded-lg transition-colors">
                    סגור
                </button>
            </div>
        </div>
    );
};


const subscriptionOptions = [
    { name: 'מנוי לחדר כושר', price: 250 },
    { name: 'מנוי לנטפליקס', price: 55 },
    { name: 'מנוי לבריכה', price: 300 },
    { name: 'מנוי לקורס דיגיטלי', price: 100 },
    { name: 'מנוי לגוגל', price: 12 },
    { name: 'מנוי לכלי בינה מלאכותית', price: 75 },
    { name: 'מנוי לקופת חולים', price: 40 },
];

const SubscriptionsModal: React.FC<{
    onClose: () => void;
    onSave: (total: number, selectedNames: string[]) => void;
    initialSelected: string[];
    setInitialSelected: (selected: string[]) => void;
    style?: React.CSSProperties;
}> = ({ onClose, onSave, initialSelected, setInitialSelected, style }) => {
    const [currentOptions, setCurrentOptions] = useState(subscriptionOptions);
    const [selected, setSelected] = useState<string[]>(initialSelected);
    const [newSubName, setNewSubName] = useState('');
    const [newSubPrice, setNewSubPrice] = useState('');


    const handleToggle = (name: string) => {
        const newSelected = selected.includes(name) ? selected.filter(item => item !== name) : [...selected, name];
        setSelected(newSelected);
        setInitialSelected(newSelected);
    };

    const handleSave = () => {
        const total = selected.reduce((sum, name) => {
            const sub = currentOptions.find(s => s.name === name);
            return sum + (sub ? sub.price : 0);
        }, 0);
        onSave(total, selected);
    };

    const handleAddSubscription = () => {
        if (newSubName.trim() && newSubPrice && !isNaN(Number(newSubPrice)) && Number(newSubPrice) > 0) {
            const newSub = { name: newSubName, price: Number(newSubPrice) };
            if (!currentOptions.some(opt => opt.name === newSubName)) {
                setCurrentOptions(prev => [...prev, newSub]);
            }
            setNewSubName('');
            setNewSubPrice('');
        }
    };
    
    const canSave = selected.length >= 2;

    return (
        <div className="absolute bg-black bg-opacity-50 z-50 animate-fade-in" style={style}>
            <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl">
                <h3 className="text-2xl font-bold mb-4 text-brand-light-blue">בחירת מנויים</h3>
                <p className="mb-4 text-brand-dark-blue/80">בחרו לפחות 2 מנויים מהרשימה:</p>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {currentOptions.map(sub => (
                        <label key={sub.name} className="flex items-center p-3 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200">
                            <input
                                type="checkbox"
                                checked={selected.includes(sub.name)}
                                onChange={() => handleToggle(sub.name)}
                                className="h-5 w-5 rounded border-gray-300 text-brand-teal focus:ring-brand-teal"
                            />
                            <span className="mr-3 text-lg">{sub.name}</span>
                            <span className="mr-auto font-mono text-gray-600">({sub.price} ₪)</span>
                        </label>
                    ))}
                </div>
                 <div className="mt-4 pt-4 border-t border-gray-300">
                    <h4 className="font-semibold mb-2">הוספת מנוי חדש:</h4>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input 
                            type="text" 
                            placeholder="שם המנוי" 
                            value={newSubName} 
                            onChange={(e) => setNewSubName(e.target.value)}
                            className="w-full p-2 border rounded-md"
                        />
                        <input 
                            type="number" 
                            placeholder="מחיר (₪)" 
                            value={newSubPrice} 
                            onChange={(e) => setNewSubPrice(e.target.value)}
                            className="w-full sm:w-28 p-2 border rounded-md"
                        />
                        <button onClick={handleAddSubscription} className="bg-gray-200 hover:bg-gray-300 p-2 rounded-md font-bold">הוסף</button>
                    </div>
                </div>
                <div className="mt-6 flex flex-col gap-2">
                     <button 
                        onClick={handleSave} 
                        disabled={!canSave}
                        className="w-full bg-brand-teal hover:bg-teal-500 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                     >
                        חשב סכומים
                    </button>
                    <button onClick={onClose} className="w-full bg-gray-300 hover:bg-gray-400 font-bold py-2 px-4 rounded-lg">
                        ביטול
                    </button>
                </div>
            </div>
        </div>
    );
};

const LicenseFeeExplanationModal: React.FC<{ onClose: () => void, style?: React.CSSProperties }> = ({ onClose, style }) => (
    <div className="absolute bg-black bg-opacity-50 z-50 animate-fade-in" style={style}>
        <div className="bg-white p-8 rounded-2xl w-full max-w-lg shadow-2xl text-center">
            <h3 className="text-2xl font-bold mb-4 text-brand-light-blue">מהי אגרת רישוי?</h3>
            <div className="text-lg text-right space-y-3">
                <p>אגרת רישוי (או "טסט") היא תשלום חובה שנתי שכל בעל רכב בישראל חייב לשלם למשרד התחבורה.</p>
                <p>התשלום מאפשר לרכב לנוע בכבישי הארץ באופן חוקי לשנה הקרובה, לאחר שעבר את מבחן הרישוי השנתי.</p>
                <p><strong>איך מחושב גובה האגרה?</strong> גובה האגרה נקבע בעיקר לפי שווי הרכב כשהיה חדש ("מחיר לצרכן"). ככל שהרכב היה יקר יותר, כך האגרה תהיה גבוהה יותר. עם זאת, גובה האגרה פוחת עם השנים ככל שהרכב מתיישן.</p>
            </div>
            <button onClick={onClose} className="mt-6 w-full bg-brand-magenta text-white font-bold py-3 px-4 rounded-lg">סגור</button>
        </div>
    </div>
);

const FuelCostExplanationModal: React.FC<{ onClose: () => void, style?: React.CSSProperties }> = ({ onClose, style }) => (
    <div className="absolute bg-black bg-opacity-50 z-50 animate-fade-in" style={style}>
        <div className="bg-white p-8 rounded-2xl w-full max-w-lg shadow-2xl text-center">
            <h3 className="text-2xl font-bold mb-4 text-brand-light-blue">איך חושבה עלות הדלק?</h3>
            <div className="text-lg text-right space-y-3">
                <p>עלות הדלק החודשית מחושבת על בסיס שלושה נתונים:</p>
                <ul className="list-disc list-inside space-y-2 pr-4">
                    <li><strong>נסיעה חודשית ממוצעת:</strong> הנחנו נסיעה של 1,500 ק"מ בחודש.</li>
                    <li><strong>צריכת הדלק של הרכב:</strong> הנתון שהזנתם בחלון "ביצוע הרכישה" (בק"מ לליטר).</li>
                    <li><strong>מחיר הדלק:</strong> הנחנו מחיר ממוצע של 7.5 ש"ח לליטר.</li>
                </ul>
                <p className="font-bold pt-2 border-t mt-2">הנוסחה היא: (1,500 ק"מ / צריכת דלק) * 7.5 ש"ח.</p>
            </div>
            <button onClick={onClose} className="mt-6 w-full bg-brand-magenta text-white font-bold py-3 px-4 rounded-lg">סגור</button>
        </div>
    </div>
);

const ExplanationModal: React.FC<{ title: string; content: React.ReactNode; onClose: () => void; style?: React.CSSProperties }> = ({ title, content, onClose, style }) => (
    <div className="absolute bg-black bg-opacity-50 z-50 animate-fade-in" style={style}>
        <div className="bg-white p-8 rounded-2xl w-full max-w-lg shadow-2xl text-center">
            <h3 className="text-2xl font-bold mb-4 text-brand-light-blue">{title}</h3>
            <div className="text-lg text-right space-y-3">{content}</div>
            <button onClick={onClose} className="mt-6 w-full bg-brand-magenta text-white font-bold py-3 px-4 rounded-lg">סגור</button>
        </div>
    </div>
);


const CarPurchaseModal: React.FC<{
    onClose: () => void;
    onPurchaseComplete: (details: { monthlyPayment: number; note: string; fuelConsumption: string; year: string; price: string; adLink: string; }) => void;
    details: any;
    setDetails: (details: any) => void;
    netIncome: number;
    style?: React.CSSProperties;
}> = ({ onClose, onPurchaseComplete, details, setDetails, netIncome, style }) => {
    
    const { model, adLink, year, km, fuelConsumption, hand, licensePlate, price, payments } = details;
    
    const setField = (field: string, value: any) => {
        setDetails({ ...details, [field]: value });
    };

    const [validationError, setValidationError] = useState('');
    const [kmWarning, setKmWarning] = useState('');
    const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);

    useEffect(() => {
        const yearNum = parseInt(year);
        const kmNum = parseInt(km);
        const currentYear = new Date().getFullYear();

        if (!isNaN(yearNum) && !isNaN(kmNum) && yearNum <= currentYear) {
            const yearsOnRoad = Math.max(1, currentYear - yearNum);
            const avgKmPerYear = kmNum / yearsOnRoad;
            if (avgKmPerYear > 18000) {
                setKmWarning('הק"מ שנסעו ברכב נחשב יחסית גבוה');
            } else {
                setKmWarning('');
            }
        } else {
            setKmWarning('');
        }
    }, [km, year]);

    useEffect(() => {
        const priceNum = parseFloat(price);
        if (!isNaN(priceNum) && priceNum > 0) {
            if (payments === 0) {
                setMonthlyPayment(priceNum);
            } else {
                const years = payments / 12;
                const annualInterestRate = 0.03 + (years * 0.002);
                const totalInterest = priceNum * annualInterestRate * years;
                const totalCost = priceNum + totalInterest;
                setMonthlyPayment(totalCost / payments);
            }
        } else {
            setMonthlyPayment(null);
        }
    }, [price, payments]);

    const showPaymentBudgetWarning =
        payments > 0 &&
        monthlyPayment !== null &&
        netIncome > 0 &&
        monthlyPayment > netIncome * 0.15;
    
    const allFieldsFilled = !!(model && year && km && fuelConsumption && hand && licensePlate && price);

    const handleConfirmPurchase = () => {
        if (!allFieldsFilled) {
            setValidationError('יש למלא את כל השדות כדי להמשיך.');
            setTimeout(() => setValidationError(''), 3000);
            return;
        }

        if (monthlyPayment === null || isNaN(monthlyPayment)) {
            setValidationError("אנא מלאו את מחיר הרכב.");
            setTimeout(() => setValidationError(''), 3000);
            return;
        }

        const paymentNote = payments > 0 ? `(${payments} תשלומים)` : '(תשלום מלא)';
        const note = `דגם: ${model}, שנה: ${year}, ק"מ: ${km}, יד: ${hand}, צריכה: 1/${fuelConsumption}, ${licensePlate ? `רישוי: ${licensePlate}, ` : ''}מחיר: ${price}₪ ${paymentNote}.`;
        onPurchaseComplete({
            monthlyPayment: Math.round(monthlyPayment),
            note: note,
            fuelConsumption: fuelConsumption,
            year: year,
            price: price,
            adLink: adLink,
        });
        onClose();
    };
    
    const renderField = (name: string, label: string, placeholder: string, value: string, setter: (val: string) => void, type = "text", warning?: string) => (
         <div>
            <label className="font-medium text-sm text-gray-700">{label}</label>
            <input type={type} value={value} onChange={e => setter(e.target.value)} placeholder={placeholder} className="w-full mt-1 bg-white p-2 rounded-lg border border-gray-300" />
            {warning && <p className="text-red-500 text-xs mt-1">{warning}</p>}
        </div>
    )

    return (
        <div className="absolute bg-black bg-opacity-50 z-50 animate-fade-in" style={style}>
            <div className="bg-white p-6 rounded-2xl w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
                 <h3 className="text-2xl font-bold mb-6 text-center">ביצוע רכישת רכב</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderField("model", "דגם*", "לדוגמא: מיצובישי לנסר", model, (v) => setField('model', v))}
                    {renderField("year", "שנת ייצור*", "רשמו את שנת ייצור הרכב", year, (v) => setField('year', v), "number")}
                    <div className="md:col-span-2">
                        {renderField("adLink", "קישור למודעה", "אופציונלי", adLink, (v) => setField('adLink', v), "url")}
                    </div>
                    {renderField("km", "קילומטראז'*", 'כמה ק"מ נסעו ברכב סה"כ', km, (v) => setField('km', v), "number", kmWarning)}
                    <div>
                        <label className="font-medium text-sm text-gray-700">צריכת דלק* (כמה ק"מ לליטר)</label>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="p-2 bg-gray-100 rounded-lg border border-gray-300">1 ליטר</span>
                            <span>/</span>
                            <input type="number" value={fuelConsumption} onChange={e => setField('fuelConsumption', e.target.value)} placeholder={'ק"מ'} className="w-full bg-white p-2 rounded-lg border border-gray-300" />
                        </div>
                    </div>
                    {renderField("hand", "יד*", "איזו יד הרכב", hand, (v) => setField('hand', v), "number")}
                    {renderField("licensePlate", "מספר לוחית רישוי*", "הזינו מספר לוחית רישוי", licensePlate, (v) => setField('licensePlate', v))}
                    {renderField("price", "מחיר*", "כמה עולה הרכב", price, (v) => setField('price', v), "number")}
                    
                    <div className="md:col-span-2">
                        <label className="font-medium text-sm text-gray-700">חלוקה לתשלומים ({payments > 0 ? `${payments} חודשים` : 'תשלום מלא'})</label>
                        <input type="range" min="0" max="60" step="12" value={payments} onChange={e => setField('payments', Number(e.target.value))} className="w-full mt-2"/>
                         {payments > 0 && (
                            <div className="text-sm text-yellow-800 bg-yellow-100/70 p-2 rounded-md mt-2 border border-yellow-300">
                                <strong>הערה חינוכית:</strong> פריסה לתשלומים לרוב כוללת ריבית, מה שמייקר את העלות הכוללת של הרכב. זוהי התחייבות כלכלית ארוכת טווח שיש לקחת בחשבון.
                            </div>
                        )}
                    </div>
                 </div>
                 
                 {monthlyPayment !== null && (
                    <div className="mt-6 p-4 bg-gray-100 rounded-lg text-center">
                        <h4 className="font-bold text-lg">{payments > 0 ? 'תשלום חודשי (כולל ריבית):' : 'סכום לתשלום מלא:'}</h4>
                        <p className="font-bold text-2xl text-brand-teal">{payments > 0 ? `${Math.round(monthlyPayment)} ₪` : `${parseFloat(price).toLocaleString()} ₪`}</p>
                        {showPaymentBudgetWarning && (
                            <p className="mt-2 text-sm text-yellow-800 bg-yellow-100/70 p-2 rounded-md border border-yellow-300">
                                ייתכן שהתשלום גבוה מידי עבור התקציב שלך
                            </p>
                        )}
                    </div>
                 )}
                 <div className="mt-6 flex flex-col gap-2">
                    <button 
                        onClick={handleConfirmPurchase} 
                        className={`w-full text-white font-bold py-3 px-4 rounded-lg transition-colors ${!allFieldsFilled ? 'bg-gray-400 cursor-not-allowed' : 'bg-brand-teal hover:bg-teal-600'}`}>
                        עדכן תקציב
                    </button>
                    {validationError && <p className="text-red-500 text-sm mt-1 text-center">{validationError}</p>}
                    <button onClick={onClose} className="w-full bg-gray-300 hover:bg-gray-400 font-bold py-2 px-4 rounded-lg">ביטול</button>
                 </div>
            </div>
        </div>
    );
};

const InsuranceCalculatorModal: React.FC<{
    onClose: () => void;
    onSelect: (annualPrice: number, company: string, insuranceType: string) => void;
    style?: React.CSSProperties;
}> = ({ onClose, onSelect, style }) => {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});

    const questions = [
        { question: 'מה שווי הרכב המשוער?', options: ['עד 40,000 ₪', '40,000-90,000 ₪', 'מעל 90,000 ₪'] },
        { question: 'בן כמה הרכב?', options: ['עד 5 שנים', '6-10 שנים', 'מעל 10 שנים'] },
        { question: 'מה גיל הנהג/ת הצעיר/ה בפוליסה?', options: ['מעל 30', '24-30', 'מתחת ל-24'] },
        { question: 'כמה שנות ותק נהיגה יש לנהג/ת העיקרי/ת?', options: ['מעל 7 שנים', '3-7 שנים', 'עד שנתיים'] },
        { question: 'מה היסטוריית התאונות ב-3 השנים האחרונות?', options: ['ללא תאונות', 'תאונה אחת', '2 תאונות ומעלה'] },
        { question: 'מה הקילומטראז׳ השנתי הממוצע?', options: ['עד 12,000 ק"מ', '12,000-20,000 ק"מ', 'מעל 20,000 ק"מ'] },
        { question: 'איפה הרכב חונה בדרך כלל בלילה?', options: ['חניה פרטית/מקורה', 'רחוב באזור שקט', 'רחוב באזור עמוס'] },
        { question: 'מה השימוש העיקרי ברכב?', options: ['נסיעות פרטיות קצרות', 'שימוש מעורב', 'נסיעות יומיות ארוכות'] },
        { question: 'מי נוהג ברכב?', options: ['נהג/ת יחיד/ה', 'זוג נהגים קבועים', 'כמה נהגים כולל צעירים'] },
        { question: 'מה הכי חשוב בביטוח?', options: ['מחיר נמוך', 'איזון בין מחיר לכיסוי', 'כיסוי רחב ושירות'] },
    ];

    const handleAnswer = (qIndex: number, answer: string) => {
        const nextAnswers = { ...answers, [qIndex]: answer };
        setAnswers(nextAnswers);

        if (qIndex < questions.length - 1) {
            setStep(qIndex + 1);
        } else {
            setStep(questions.length);
        }
    };

    const calculateOffers = () => {
        const riskScore =
            (answers[2] === 'מתחת ל-24' ? 3 : answers[2] === '24-30' ? 1 : 0) +
            (answers[3] === 'עד שנתיים' ? 3 : answers[3] === '3-7 שנים' ? 1 : 0) +
            (answers[4] === '2 תאונות ומעלה' ? 4 : answers[4] === 'תאונה אחת' ? 2 : 0) +
            (answers[5] === 'מעל 20,000 ק"מ' ? 2 : answers[5] === '12,000-20,000 ק"מ' ? 1 : 0) +
            (answers[6] === 'רחוב באזור עמוס' ? 2 : answers[6] === 'רחוב באזור שקט' ? 1 : 0) +
            (answers[8] === 'כמה נהגים כולל צעירים' ? 2 : answers[8] === 'זוג נהגים קבועים' ? 1 : 0);

        const coverageScore =
            (answers[0] === 'מעל 90,000 ₪' ? 3 : answers[0] === '40,000-90,000 ₪' ? 2 : 1) +
            (answers[1] === 'עד 5 שנים' ? 2 : answers[1] === '6-10 שנים' ? 1 : 0) +
            (answers[9] === 'כיסוי רחב ושירות' ? 3 : answers[9] === 'איזון בין מחיר לכיסוי' ? 2 : 1);

        const mandatoryBase = 1700 + riskScore * 120;
        const thirdPartyBase = 2800 + riskScore * 150;
        const comprehensiveBase = 4300 + riskScore * 180 + coverageScore * 120;
        const premiumComprehensiveBase = 5200 + riskScore * 200 + coverageScore * 170;

        return [
            {
                company: 'הפניקס',
                insuranceType: 'חובה',
                annualPrice: Math.round(mandatoryBase),
                coverages: 'נזקי גוף לנהג/נוסעים/צד ג\' בלבד',
            },
            {
                company: 'מגדל',
                insuranceType: 'חובה + צד ג\'',
                annualPrice: Math.round(thirdPartyBase),
                coverages: 'נזקי גוף + נזקי רכוש לצד ג\'',
            },
            {
                company: 'כלל',
                insuranceType: 'מקיף בסיסי',
                annualPrice: Math.round(comprehensiveBase),
                coverages: 'חובה + צד ג\' + גניבה + נזקי תאונה + שמשות',
            },
            {
                company: 'מנורה',
                insuranceType: 'מקיף מורחב',
                annualPrice: Math.round(premiumComprehensiveBase),
                coverages: 'מקיף מלא + רכב חלופי + שירותי דרך + גרירה',
            },
        ];
    };

    const offers = calculateOffers();

    return (
        <div className="absolute bg-black bg-opacity-50 z-50 animate-fade-in" style={style}>
            <div className="bg-white p-6 rounded-2xl w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
                {step < questions.length ? (
                    <>
                        <h3 className="text-2xl font-bold mb-2 text-brand-light-blue">מחשבון ביטוח ({step + 1}/{questions.length})</h3>
                        <p className="text-lg font-semibold mb-4">{questions[step].question}</p>
                        <div className="space-y-3">
                            {questions[step].options.map(option => (
                                <button
                                    key={option}
                                    onClick={() => handleAnswer(step, option)}
                                    className="w-full bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-right transition-colors"
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                        <button onClick={onClose} className="mt-6 w-full bg-gray-300 hover:bg-gray-400 text-brand-dark-blue font-bold py-2 px-4 rounded-lg transition-colors">
                            ביטול
                        </button>
                    </>
                ) : (
                    <>
                        <h3 className="text-2xl font-bold mb-4 text-brand-teal text-center">4 הצעות ביטוח מותאמות</h3>
                        <div className="space-y-3">
                            {offers.map(offer => (
                                <div key={`${offer.company}-${offer.insuranceType}`} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                        <div>
                                            <p className="font-bold text-lg">{offer.company} - {offer.insuranceType}</p>
                                            <p className="text-sm text-gray-700">{offer.coverages}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-brand-teal text-xl">{offer.annualPrice.toLocaleString()} ₪ לשנה</p>
                                            <p className="text-sm text-gray-600">כ-{Math.round(offer.annualPrice / 12).toLocaleString()} ₪ לחודש</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            onSelect(offer.annualPrice, offer.company, offer.insuranceType);
                                            onClose();
                                        }}
                                        className="mt-3 w-full bg-brand-magenta text-white font-bold py-2 rounded-lg hover:bg-pink-700"
                                    >
                                        בחרו בהצעה הזו
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button onClick={onClose} className="mt-6 w-full bg-gray-300 hover:bg-gray-400 text-brand-dark-blue font-bold py-2 px-4 rounded-lg transition-colors">
                            סגור
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

const CarMaintenanceCalculatorModal: React.FC<{
    onClose: () => void;
    onSave: (monthlyCost: number, annualCost: number) => void;
    cost: string;
    setCost: (cost: string) => void;
    drivingScale: number;
    setDrivingScale: (scale: number) => void;
    style?: React.CSSProperties;
}> = ({ onClose, onSave, cost, setCost, drivingScale, setDrivingScale, style }) => {
    const [result, setResult] = useState<{ monthly: number; annual: number } | null>(null);

    const handleCalculate = () => {
        const costNum = parseFloat(cost);
        if (isNaN(costNum) || costNum <= 0) {
            alert("אנא הזינו עלות טיפול חיובית.");
            return;
        }

        const kmNum = drivingScale * 300;
        const annualKm = kmNum * 12;
        const servicesPerYear = annualKm / 10000;
        const annualCost = servicesPerYear * costNum;
        const monthlyCost = annualCost / 12;

        setResult({ monthly: Math.round(monthlyCost), annual: Math.round(annualCost) });
    };

    const handleConfirm = () => {
        if (result) {
            onSave(result.monthly, result.annual);
            onClose();
        }
    };

    return (
        <div className="absolute bg-black bg-opacity-50 z-50 animate-fade-in" style={style}>
            <div className="bg-white p-6 rounded-2xl w-full max-w-lg shadow-2xl">
                <h3 className="text-2xl font-bold mb-4 text-center">מחשבון טיפולי רכב</h3>
                <div className="space-y-4">
                    <div>
                        <label>עלות טיפול 10,000 ממוצע (₪)</label>
                        <input type="number" value={cost} onChange={e => setCost(e.target.value)} className="w-full mt-1 p-2 rounded border" placeholder="בררו את העלות באינטרנט/שאלו את ההורים" />
                    </div>
                    <div>
                        <label>כמה תנהגו? (5 = ממוצע)</label>
                        <input 
                            type="range" 
                            min="1" 
                            max="10" 
                            value={drivingScale} 
                            onChange={e => setDrivingScale(Number(e.target.value))} 
                            className="w-full mt-1 h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                         <div className="text-center font-bold text-brand-light-blue">{drivingScale} ({ (drivingScale * 300).toLocaleString() } ק"מ בחודש)</div>
                    </div>
                    <button onClick={handleCalculate} className="w-full bg-brand-teal text-white font-bold py-2 rounded-lg">חשב עלות שנתית</button>
                </div>

                {result && (
                    <div className="mt-6 p-4 bg-gray-100 rounded-lg text-center animate-fade-in">
                        <h4 className="font-bold text-lg">עלות שנתית מוערכת לטיפולים:</h4>
                        <p className="font-bold text-2xl text-brand-teal">{result.annual.toLocaleString()} ₪</p>
                        <p className="font-bold text-lg mt-2">(כ-{result.monthly.toLocaleString()} ₪ לחודש)</p>
                        <button onClick={handleConfirm} className="mt-4 w-full bg-brand-magenta text-white font-bold py-2 rounded-lg">עדכן תקציב</button>
                    </div>
                )}
                <button onClick={onClose} className="mt-4 w-full bg-gray-300 py-2 rounded-lg">סגור</button>
            </div>
        </div>
    );
};

const CarMaintenanceExplanationModal: React.FC<{ onClose: () => void, style?: React.CSSProperties }> = ({ onClose, style }) => (
    <div className="absolute bg-black bg-opacity-50 z-50 animate-fade-in" style={style}>
        <div className="bg-white p-8 rounded-2xl w-full max-w-lg shadow-2xl text-center">
            <h3 className="text-2xl font-bold mb-4 text-brand-light-blue">מהו טיפול 10,000?</h3>
            <div className="text-lg text-right space-y-3">
                <p>טיפול 10,000 (או טיפול שוטף) הוא בדיקה ותחזוקה תקופתית לרכב, המומלצת בדרך כלל כל 10,000-15,000 ק"מ או פעם בשנה (המוקדם מביניהם).</p>
                <p>בטיפול זה מחליפים שמנים, פילטרים, ובודקים מערכות חיוניות כמו בלמים וצמיגים כדי לשמור על בטיחות ותקינות הרכב לאורך זמן.</p>
            </div>
            <button onClick={onClose} className="mt-6 w-full bg-brand-magenta text-white font-bold py-3 px-4 rounded-lg">סגור</button>
        </div>
    </div>
);

type EntertainmentItem = { id: number, name: string, price: number, count: number, isEditable: boolean, customName: string };

const EntertainmentSimulatorModal: React.FC<{
    onClose: () => void;
    onSave: (total: number, note: string) => void;
    items: EntertainmentItem[];
    setItems: (items: EntertainmentItem[]) => void;
    style?: React.CSSProperties;
}> = ({ onClose, onSave, items, setItems, style }) => {

    const handleItemChange = (id: number, field: 'price' | 'count' | 'customName', value: string | number) => {
        setItems(
            items.map(item =>
                item.id === id ? { ...item, [field]: value } : item
            )
        );
    };

    const handleAddItem = () => {
        const newItem = {
            id: Date.now(),
            name: '',
            price: 0,
            count: 0,
            isEditable: true,
            customName: '',
        };
        setItems([...items, newItem]);
    };

    const handleCalculate = () => {
        const total = items.reduce((sum, item) => sum + (Number(item.price) * Number(item.count)), 0);
        const noteParts = items
            .filter(item => Number(item.count) > 0)
            .map(item => {
                const name = item.isEditable ? (item.customName || 'אחר') : item.name.split(' ')[0];
                return `${name}: ${item.count}x`;
            });
        onSave(total, noteParts.join(', '));
        onClose();
    };
    
    const totalCost = items.reduce((sum, item) => sum + (Number(item.price) * Number(item.count)), 0);

    return (
        <div className="absolute bg-black bg-opacity-50 z-50 animate-fade-in" style={style}>
            <div className="bg-white p-6 rounded-2xl w-full max-w-2xl shadow-2xl">
                <h3 className="text-2xl font-bold mb-2 text-center">סימולטור בילויים חודשי</h3>
                <p className="text-center text-brand-dark-blue/80 mb-6">
                    ביחרו את הבילויים שמתאימים לכם, תמחרו אותם ורישמו את מספר הפעמים שתבלו בחודש
                </p>
                <div className="space-y-4">
                     <div className="grid grid-cols-4 gap-2 items-center font-bold text-center border-b pb-2">
                        <span>סוג הבילוי</span>
                        <span>עלות לפעם (₪)</span>
                        <span>מספר פעמים בחודש</span>
                        <span>סה"כ (₪)</span>
                    </div>
                    {items.map(item => (
                        <div key={item.id} className="grid grid-cols-4 gap-2 items-center">
                            {item.isEditable ? (
                                <input
                                    type="text"
                                    placeholder={item.name || "שם הבילוי"}
                                    value={item.customName}
                                    onChange={e => handleItemChange(item.id, 'customName', e.target.value)}
                                    className="w-full p-2 border rounded"
                                />
                            ) : (
                                <label className="font-bold">{item.name}</label>
                            )}
                            <input type="number" placeholder="עלות" value={item.price || ''} onChange={e => handleItemChange(item.id, 'price', Number(e.target.value))} className="w-full p-2 border rounded text-center" />
                            <input type="number" placeholder="כמות" value={item.count || ''} onChange={e => handleItemChange(item.id, 'count', Number(e.target.value))} className="w-full p-2 border rounded text-center" />
                            <span className="font-bold text-center">{(Number(item.price) * Number(item.count)).toLocaleString()} ₪</span>
                        </div>
                    ))}
                </div>

                <button onClick={handleAddItem} className="mt-4 text-sm bg-gray-200 hover:bg-gray-300 p-2 rounded w-full">
                    + הוספת שורה
                </button>

                <div className="mt-6 p-4 bg-gray-100 rounded-lg text-center">
                    <h4 className="font-bold text-lg">סה"כ הוצאות בילויים לחודש:</h4>
                    <p className="font-bold text-3xl text-brand-magenta">{totalCost.toLocaleString()} ₪</p>
                </div>
                
                <div className="mt-6 flex flex-col gap-2">
                    <button onClick={handleCalculate} className="w-full bg-brand-teal text-white font-bold py-3 rounded-lg">עדכן תקציב</button>
                    <button onClick={onClose} className="w-full bg-gray-300 py-2 rounded-lg">סגור</button>
                </div>
            </div>
        </div>
    );
};

type AccountsAnswers = {
    people: string;
    ac: string;
    shower: string;
    cooking: string;
    appliances: string;
    homeHours: string;
    laundry: string;
    apartmentSize: string;
};

const AccountsCalculatorModal: React.FC<{
    onClose: () => void;
    onSave: (monthlyCost: number, note: string) => void;
    answers: AccountsAnswers;
    setAnswers: (answers: AccountsAnswers) => void;
    selectedCharacter?: Character | null;
    style?: React.CSSProperties;
}> = ({ onClose, onSave, answers, setAnswers, selectedCharacter, style }) => {
    const [step, setStep] = useState(1);
    const [removedBreakdownItems, setRemovedBreakdownItems] = useState<string[]>([]);
    const [result, setResult] = useState<{ 
        monthlyPerPerson: number; 
        note: string;
        breakdown: { name: string, value: number }[];
    } | null>(null);

    const handleAnswerChange = (question: keyof typeof answers, value: string) => {
        setAnswers({ ...answers, [question]: value });
    };

    const cityMatch = selectedCharacter?.description.match(/גר(?:ה)?\s+ב([א-ת"'\-\s]+)/);
    const city = cityMatch?.[1]?.trim() || 'תל אביב';
    const arnonaRatePerSqmByCity: Record<string, number> = {
        'תל אביב': 8.5,
        'הרצליה': 8.1,
        'פתח תקווה': 7.2,
        'ירושלים': 6.8,
    };

    const handleCalculate = () => {
        const peopleNum = parseInt(answers.people);

        let baseElectricity = 250;
        let baseWater = 100;
        let baseGas = 50;
        const apartmentSizeNum = Math.max(25, parseInt(answers.apartmentSize) || 70);
        const arnonaRate = arnonaRatePerSqmByCity[city] || 7.6;
        const arnonaMonthly = Math.round((arnonaRate * apartmentSizeNum) / 2);
        const vaadMonthly = apartmentSizeNum >= 95 ? 170 : apartmentSizeNum >= 70 ? 130 : 90;

        baseElectricity *= (1 + (peopleNum - 1) * 0.4);
        baseWater *= (1 + (peopleNum - 1) * 0.6);
        baseGas *= (1 + (peopleNum - 1) * 0.5);

        if (answers.ac === 'הרבה') baseElectricity += 80;
        if (answers.ac === 'כמעט ולא') baseElectricity -= 30;
        if (answers.appliances === 'הרבה') baseElectricity += 50;
        if (answers.appliances === 'חיסכון') baseElectricity -= 20;
        if (answers.shower === 'ארוכות וחמות') baseWater += 30;
        if (answers.cooking === 'כל יום') baseGas += 20;
        if (answers.cooking === 'כמעט ולא') baseGas -= 10;
        if (answers.homeHours === 'הרבה') {
            baseElectricity += 40;
            baseWater += 15;
            baseGas += 10;
        }
        if (answers.homeHours === 'מעט') {
            baseElectricity -= 20;
            baseWater -= 10;
            baseGas -= 5;
        }
        if (answers.laundry === 'גבוהה') {
            baseElectricity += 10;
            baseWater += 20;
        }
        if (answers.laundry === 'נמוכה') {
            baseElectricity -= 5;
            baseWater -= 10;
        }
        const electricityMonthly = baseElectricity / 2;
        const waterMonthly = baseWater / 2;
        const gasMonthly = baseGas / 2;
        const monthlyTotal = electricityMonthly + waterMonthly + gasMonthly + arnonaMonthly + vaadMonthly;
        const monthlyPerPerson = Math.round(monthlyTotal / peopleNum);

        const breakdown = [
            { name: 'חשמל', value: Math.round(electricityMonthly / peopleNum) },
            { name: 'מים', value: Math.round(waterMonthly / peopleNum) },
            { name: 'גז', value: Math.round(gasMonthly / peopleNum) },
            { name: 'ארנונה', value: Math.round(arnonaMonthly / peopleNum) },
            { name: 'ועד בית', value: Math.round(vaadMonthly / peopleNum) },
        ];
        
        const note = `הערכה לפי ${answers.people} נפשות, דירה בגודל ${apartmentSizeNum} מ״ר, עיר ${city} (ארנונה חודשית מחושבת: גודל × תעריף למ״ר ÷ 2 = ${arnonaMonthly.toLocaleString()} ₪), מזגן ${answers.ac}, מקלחות ${answers.shower}, בישול ${answers.cooking}, מכשירים ${answers.appliances}, שעות בבית ${answers.homeHours}, כביסות ${answers.laundry}.`;

        setResult({ monthlyPerPerson, note, breakdown });
        setRemovedBreakdownItems([]);
        setStep(2);
    };

    const handleRemoveBreakdownItem = (itemName: string) => {
        setRemovedBreakdownItems(prev => prev.includes(itemName) ? prev : [...prev, itemName]);
    };

    const activeBreakdown = result
        ? result.breakdown.filter(item => !removedBreakdownItems.includes(item.name))
        : [];
    const adjustedMonthlyPerPerson = activeBreakdown.reduce((sum, item) => sum + item.value, 0);
    
    const handleSave = () => {
        if (result) {
            const removedText = removedBreakdownItems.length > 0
                ? ` הוסרו מהחישוב: ${removedBreakdownItems.join(', ')}.`
                : '';
            onSave(adjustedMonthlyPerPerson, `${result.note}${removedText}`);
            onClose();
        }
    };

    type AnswerKey = keyof typeof answers;
    const questionSet: { key: AnswerKey, label: string, options?: string[], inputType?: 'number' }[] = [
        { key: 'people', label: 'כמה אנשים גרים בדירה (כולל אותך)?', options: ['1', '2', '3', '4+'] },
        { key: 'homeHours', label: 'כמה שעות אתם בבית בימי חול?', options: ['מעט', 'בינוני', 'הרבה'] },
        { key: 'ac', label: 'איך היית מגדיר/ה את השימוש שלך במזגן?', options: ['הרבה', 'לפעמים', 'כמעט ולא'] },
        { key: 'shower', label: 'איך נראות המקלחות שלך בדרך כלל?', options: ['ארוכות וחמות', 'רגילות'] },
        { key: 'laundry', label: 'מה תדירות הכביסות בדירה?', options: ['נמוכה', 'בינונית', 'גבוהה'] },
        { key: 'cooking', label: 'מה הרגלי הבישול שלך?', options: ['כל יום', 'מדי פעם', 'כמעט ולא'] },
        { key: 'apartmentSize', label: 'מה גודל הדירה במ"ר?', inputType: 'number' },
        { key: 'appliances', label: 'מה לגבי מכשירי חשמל אחרים (מחשב, טלוויזיה)?', options: ['הרבה', 'ממוצע', 'חיסכון'] },
    ];
    
    return (
        <div className="absolute bg-black bg-opacity-50 z-50 animate-fade-in" style={style}>
            <div className="bg-white p-6 rounded-2xl w-full max-w-lg shadow-2xl">
                <h3 className="text-2xl font-bold mb-4 text-center">מחשבון הערכת חשבונות</h3>
                {step === 1 && (
                    <>
                        <p className="text-center mb-6 text-gray-600">ענו על השאלות כדי לקבל הערכה חודשית מותאמת אישית.</p>
                        <div className="space-y-6">
                            {questionSet.map(q => (
                                <div key={q.key}>
                                    <label className="font-bold text-lg">{q.label}</label>
                                    {q.inputType === 'number' ? (
                                        <input
                                            type="number"
                                            min={20}
                                            max={250}
                                            value={answers[q.key]}
                                            onChange={(e) => handleAnswerChange(q.key, e.target.value)}
                                            placeholder="לדוגמה: 70"
                                            className="w-full mt-2 p-3 rounded-lg border border-gray-300 focus:border-brand-teal focus:ring-1 focus:ring-brand-teal"
                                        />
                                    ) : (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {q.options?.map(opt => (
                                                <button
                                                    key={opt}
                                                    onClick={() => handleAnswerChange(q.key, opt)}
                                                    className={`py-2 px-4 rounded-full font-semibold transition-colors ${
                                                        answers[q.key] === opt
                                                            ? 'bg-brand-teal text-white'
                                                            : 'bg-gray-200 hover:bg-gray-300'
                                                    }`}
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 flex flex-col gap-2">
                            <button onClick={handleCalculate} className="w-full text-white font-bold py-3 rounded-lg bg-brand-magenta hover:bg-pink-700">
                                חשב הערכה
                            </button>
                            <button onClick={onClose} className="w-full bg-gray-300 py-2 rounded-lg">ביטול</button>
                        </div>
                    </>
                )}
                {step === 2 && result && (
                    <div className="text-center animate-fade-in">
                        <h4 className="font-bold text-xl">הערכת ההוצאה החודשית שלך:</h4>
                        <p className="font-bold text-6xl text-brand-magenta my-4">{adjustedMonthlyPerPerson.toLocaleString()} ₪</p>
                        <div className="bg-gray-100 p-4 rounded-lg text-right">
                            <h5 className="font-bold text-lg mb-2">פירוט ההערכה:</h5>
                            <ul className="space-y-1">
                                {activeBreakdown.map(item => (
                                    <li
                                        key={item.name}
                                        onClick={() => handleRemoveBreakdownItem(item.name)}
                                        className="group relative flex justify-between cursor-pointer rounded-md px-2 py-1 transition-colors hover:bg-red-50"
                                        title="לחצו להסרת החשבון"
                                    >
                                        <span>{item.name}:</span>
                                        <span className="font-mono">{item.value.toLocaleString()} ₪</span>
                                        <span className="pointer-events-none absolute left-2 right-2 top-1/2 hidden -translate-y-1/2 border-t-2 border-red-400 group-hover:block" />
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-3 text-sm text-gray-600">
                                ניתן להסיר חשבונות שכלולים בתשלום השכירות של הדירה שלכם
                            </p>
                        </div>
                        <div className="mt-8 flex flex-col gap-2">
                            <button onClick={handleSave} className="w-full text-white font-bold py-3 rounded-lg bg-brand-teal hover:bg-teal-600">
                                עדכן תקציב
                            </button>
                            <button onClick={() => setStep(1)} className="w-full bg-gray-300 py-2 rounded-lg">שנה תשובות</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};


const avatarOptions = [
    'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=400'
];

const CreateCharacterModal: React.FC<{ onClose: () => void, onCreate: (character: Character) => void }> = ({ onClose, onCreate }) => {
    const [name, setName] = useState('');
    const [salary, setSalary] = useState('');
    const [description, setDescription] = useState('');
    const [avatar, setAvatar] = useState(avatarOptions[0]);

    const handleCreate = () => {
        if (!name.trim() || !salary || !description.trim()) {
            alert("אנא מלאו את כל השדות.");
            return;
        }
        const salaryNum = parseInt(salary);
        if (isNaN(salaryNum) || salaryNum <= 0) {
            alert("אנא הזינו שכר חוקי (מספר חיובי).");
            return;
        }
        onCreate({ name, salary: salaryNum, description, avatar });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white p-8 rounded-2xl w-full max-w-lg shadow-2xl">
                <h3 className="text-2xl font-bold mb-6 text-center text-brand-light-blue">יצירת דמות חדשה</h3>
                <div className="space-y-4">
                    <div>
                        <label className="font-medium">שם</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="השם שלכם" className="w-full mt-1 p-2 rounded border"/>
                    </div>
                     <div>
                        <label className="font-medium">תיאור</label>
                        <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="לדוגמה: סטודנט, גר בתל אביב" className="w-full mt-1 p-2 rounded border"/>
                    </div>
                    <div>
                        <label className="font-medium">שכר ברוטו חודשי (₪)</label>
                        <input type="number" value={salary} onChange={e => setSalary(e.target.value)} placeholder="לדוגמה: 8000" className="w-full mt-1 p-2 rounded border"/>
                    </div>
                    <div>
                        <label className="font-medium">בחירת תמונה</label>
                        <div className="flex justify-center gap-4 mt-2">
                            {avatarOptions.map(opt => (
                                <img key={opt} src={opt} alt="avatar option" onClick={() => setAvatar(opt)} className={`w-20 h-20 rounded-full object-cover cursor-pointer border-4 ${avatar === opt ? 'border-brand-teal' : 'border-transparent'}`} />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="mt-8 flex flex-col gap-2">
                    <button onClick={handleCreate} className="w-full bg-brand-teal text-white font-bold py-3 rounded-lg">צור דמות והתחל</button>
                    <button onClick={onClose} className="w-full bg-gray-300 py-2 rounded-lg">ביטול</button>
                </div>
            </div>
        </div>
    );
};

const RentPurchaseModal: React.FC<{
    onClose: () => void;
    onSave: (details: { rent: number; note: string }) => void;
    netIncome: number;
    details: any;
    setDetails: (details: any) => void;
    style?: React.CSSProperties;
}> = ({ onClose, onSave, netIncome, details, setDetails, style }) => {
    const { city, size, rooms, floor, rent, adLink } = details;

    const setField = (field: string, value: any) => {
        setDetails({ ...details, [field]: value });
    };

    const [warning, setWarning] = useState('');
    const [validationError, setValidationError] = useState('');
    
    const allFieldsFilled = !!(city && size && rooms && floor && rent && adLink);

    useEffect(() => {
        const rentNum = parseFloat(rent);
        if (!isNaN(rentNum) && netIncome > 0 && rentNum > netIncome * 0.35) {
            setWarning('התראה לימודית: מומלץ שהוצאות הדיור לא יעלו על 35% מההכנסה הפנויה.');
        } else {
            setWarning('');
        }
    }, [rent, netIncome]);

    const handleSave = () => {
        if (!allFieldsFilled) {
            setValidationError('יש למלא את כל השדות כדי להמשיך.');
            setTimeout(() => setValidationError(''), 3000);
            return;
        }

        const rentNum = parseFloat(rent);
        if (isNaN(rentNum) || rentNum <= 0) {
            setValidationError("אנא הזינו סכום שכירות חוקי.");
            setTimeout(() => setValidationError(''), 3000);
            return;
        }

        const noteParts = [`מיקום: ${city}`, `גודל: ${size} מ"ר`, `חדרים: ${rooms}`, `קומה: ${floor}`];
        const baseNote = noteParts.join(', ');
        const finalNote = adLink ? `${baseNote} @@LINK@@${adLink}` : baseNote;

        onSave({ rent: rentNum, note: finalNote });
        onClose();
    };

    return (
        <div className="absolute bg-black bg-opacity-50 z-50 animate-fade-in" style={style}>
            <div className="bg-white p-6 rounded-2xl w-full max-w-lg shadow-2xl">
                <h3 className="text-2xl font-bold mb-6 text-center">הזנת פרטי שכירות</h3>
                <div className="space-y-4">
                    <div dir="ltr" className="grid grid-cols-[150px_minmax(0,1fr)] items-center gap-3">
                        <input type="text" value={city} onChange={e => setField('city', e.target.value)} className="w-full max-w-[260px] justify-self-start p-2 rounded border" />
                        <label className="text-sm font-semibold text-gray-700 text-right">מיקום הדירה (עיר)*</label>
                    </div>
                    <div dir="ltr" className="grid grid-cols-[150px_minmax(0,1fr)] items-center gap-3">
                        <input type="number" value={size} onChange={e => setField('size', e.target.value)} className="w-full max-w-[260px] justify-self-start p-2 rounded border" />
                        <label className="text-sm font-semibold text-gray-700 text-right">גודל הדירה (מ&quot;ר)*</label>
                    </div>
                    <div dir="ltr" className="grid grid-cols-[150px_minmax(0,1fr)] items-center gap-3">
                        <input type="number" value={rooms} onChange={e => setField('rooms', e.target.value)} className="w-full max-w-[260px] justify-self-start p-2 rounded border" />
                        <label className="text-sm font-semibold text-gray-700 text-right">מספר חדרים*</label>
                    </div>
                    <div dir="ltr" className="grid grid-cols-[150px_minmax(0,1fr)] items-center gap-3">
                        <input type="number" value={floor} onChange={e => setField('floor', e.target.value)} className="w-full max-w-[260px] justify-self-start p-2 rounded border" />
                        <label className="text-sm font-semibold text-gray-700 text-right">קומה*</label>
                    </div>
                    <div dir="ltr" className="grid grid-cols-[150px_minmax(0,1fr)] items-center gap-3">
                        <input type="url" value={adLink} onChange={e => setField('adLink', e.target.value)} className="w-full max-w-[260px] justify-self-start p-2 rounded border" />
                        <label className="text-sm font-semibold text-gray-700 text-right">קישור למודעה*</label>
                    </div>
                    <div dir="ltr" className="grid grid-cols-[150px_minmax(0,1fr)] items-start gap-3">
                        <div className="w-full max-w-[260px] justify-self-start">
                            <input type="number" value={rent} onChange={e => setField('rent', e.target.value)} className="w-full p-2 rounded border font-bold" />
                            {warning && <p className="text-red-500 text-sm mt-1">{warning}</p>}
                        </div>
                        <label className="text-sm font-semibold text-gray-700 text-right pt-2">שכר דירה (₪)*</label>
                    </div>
                </div>
                <div className="mt-6 flex flex-col gap-2">
                    <button 
                        onClick={handleSave} 
                        className={`w-full text-white font-bold py-3 rounded-lg transition-colors ${!allFieldsFilled ? 'bg-gray-400 cursor-not-allowed' : 'bg-brand-teal hover:bg-teal-600'}`}>
                        הזן
                    </button>
                    {validationError && <p className="text-red-500 text-sm mt-1 text-center">{validationError}</p>}
                    <button onClick={onClose} className="w-full bg-gray-300 py-2 rounded-lg">ביטול</button>
                </div>
            </div>
        </div>
    );
};

const AddCustomExpenseModal: React.FC<{
    onClose: () => void;
    onAdd: (name: string, amount: number, note: string) => void;
    style?: React.CSSProperties;
}> = ({ onClose, onAdd, style }) => {
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [isYearly, setIsYearly] = useState(false);

    const handleSave = () => {
        if (!name.trim() || !amount || isNaN(parseFloat(amount))) {
            alert('אנא מלאו שם וסכום תקינים.');
            return;
        }

        let val = parseFloat(amount);
        let note = '';

        if (isYearly) {
            note = `עלות שנתית: ${val.toLocaleString()} ₪ (מחושב אוטומטית לחודש)`;
            val = val / 12;
        } else {
            note = 'עלות חודשית';
        }

        onAdd(name, val, note);
        onClose();
    };

    return (
        <div className="absolute bg-black bg-opacity-50 z-50 animate-fade-in" style={style}>
            <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl">
                <h3 className="text-2xl font-bold mb-4 text-center text-brand-light-blue">הוספת הוצאה חדשה</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">שם ההוצאה</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="לדוגמה: ביטוח דירה, ועד בית..."
                            className="w-full p-2 border rounded-md focus:ring-brand-teal focus:border-brand-teal"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">סכום</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0"
                            className="w-full p-2 border rounded-md focus:ring-brand-teal focus:border-brand-teal"
                        />
                    </div>
                    <div className="flex items-center gap-4 bg-gray-100 p-3 rounded-lg">
                        <span className="font-bold text-gray-700">תדירות התשלום:</span>
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                checked={!isYearly}
                                onChange={() => setIsYearly(false)}
                                className="mr-2 text-brand-teal focus:ring-brand-teal"
                            />
                            <span className="mr-1">חודשי</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                checked={isYearly}
                                onChange={() => setIsYearly(true)}
                                className="mr-2 text-brand-teal focus:ring-brand-teal"
                            />
                            <span className="mr-1">שנתי</span>
                        </label>
                    </div>
                    {isYearly && amount && !isNaN(parseFloat(amount)) && (
                        <div className="text-center text-brand-teal font-bold bg-teal-50 p-2 rounded">
                            הסכום החודשי יהיה: {Math.round(parseFloat(amount) / 12).toLocaleString()} ₪
                        </div>
                    )}
                </div>
                <div className="mt-6 flex flex-col gap-2">
                    <button
                        onClick={handleSave}
                        className="w-full bg-brand-teal hover:bg-teal-600 text-white font-bold py-3 rounded-lg transition-colors"
                    >
                        הוסף הוצאה
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full bg-gray-300 hover:bg-gray-400 text-brand-dark-blue font-bold py-2 rounded-lg transition-colors"
                    >
                        ביטול
                    </button>
                </div>
            </div>
        </div>
    );
};

// This component is now only for PDF generation and won't be displayed as a modal.
const SummaryReportForPdf: React.FC<{
    character: Character;
    netIncome: number;
    totalUserExpenses: number;
    balance: number;
    allExpenses: (BudgetItem & { note?: string; isDeduction?: boolean })[];
}> = ({ character, netIncome, totalUserExpenses, balance, allExpenses }) => {
    
    const deductions = allExpenses.filter(e => e.isDeduction);
    const userExpenses = allExpenses.filter(e => !e.isDeduction);
    const defaultCategories = new Set(initialExpenses.map((item) => item.category));
    const changedUserExpenses = userExpenses.filter((item) => {
        const hasAmount = Math.round(item.amount) !== 0;
        const hasNote = !!item.note?.trim();
        const isCustomCategory = !defaultCategories.has(item.category);
        return hasAmount || hasNote || isCustomCategory;
    });

    return (
        <div id="pdf-content" className="bg-white p-8 w-[800px] font-sans">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-3xl font-bold font-display text-brand-dark-blue">דו"ח סיכום תקציב</h2>
                    <p className="text-lg text-gray-600">עבור: {character.name} ({character.description})</p>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-4 text-center my-6 p-4 bg-gray-50 rounded-lg">
                <div><p className="text-lg">שכר ברוטו</p><p className="font-bold text-2xl text-gray-700">{character.salary.toLocaleString('he-IL', {style:'currency', currency:'ILS'})}</p></div>
                <div><p className="text-lg">הכנסה נטו</p><p className="font-bold text-2xl text-green-600">{netIncome.toLocaleString('he-IL', {style:'currency', currency:'ILS'})}</p></div>
                <div><p className="text-lg">סה"כ הוצאות</p><p className="font-bold text-2xl text-red-500">{totalUserExpenses.toLocaleString('he-IL', {style:'currency', currency:'ILS'})}</p></div>
                <div><p className="text-lg">מאזן חודשי</p><p className={`font-bold text-2xl ${balance >= 0 ? 'text-brand-teal' : 'text-brand-magenta'}`}>{balance.toLocaleString('he-IL', {style:'currency', currency:'ILS'})}</p></div>
            </div>

            <h3 className="text-2xl font-bold mt-8 mb-4">פירוט הוצאות חודשי</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse">
                    <thead>
                        <tr className="bg-gray-100 border-b-2 border-gray-300">
                            <th className="p-3 font-bold">קטגוריה</th>
                            <th className="p-3 font-bold text-left">סכום חודשי</th>
                            <th className="p-3 font-bold">הערות</th>
                        </tr>
                    </thead>
                    <tbody>
                         <tr className="bg-gray-200 font-bold"><td colSpan={3} className="p-2">הוצאות מחייה</td></tr>
                        {changedUserExpenses.length > 0 ? changedUserExpenses.map(item => (
                            <tr key={item.id} className="border-b">
                                <td className="p-3">{item.category}</td>
                                <td className="p-3 text-left font-mono">{item.amount.toLocaleString('he-IL', {style:'currency', currency:'ILS'})}</td>
                                <td className="p-3 text-sm text-gray-600">{item.note || '-'}</td>
                            </tr>
                        )) : (
                            <tr className="border-b">
                                <td className="p-3 text-gray-600" colSpan={3}>לא נמצאו שורות הוצאה עם הזנה או שינוי.</td>
                            </tr>
                        )}
                         <tr className="bg-gray-200 font-bold"><td colSpan={3} className="p-2">ניכויים</td></tr>
                        {deductions.map(item => (
                            <tr key={item.id} className="border-b">
                                <td className="p-3">{item.category}</td>
                                <td className="p-3 text-left font-mono text-red-600">{item.amount.toLocaleString('he-IL', {style:'currency', currency:'ILS'})}</td>
                                <td className="p-3 text-sm text-gray-600">{item.note || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const ShareReportModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onDownload: () => void;
    onDownloadData: () => void;
    onShare: () => void;
    onCopyLink: () => void;
    isProcessing: boolean;
    isCopied: boolean;
}> = ({ isOpen, onClose, onDownload, onDownloadData, onShare, onCopyLink, isProcessing, isCopied }) => {
    if (!isOpen) return null;

    const canShare = !!navigator.share;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fade-in" onClick={onClose}>
            <div 
                className="w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl" 
                onClick={e => e.stopPropagation()}
            >
                <h3 className="text-2xl font-bold mb-6 text-center text-brand-dark-blue">שתף את דו"ח התקציב</h3>
                <div className="space-y-4">
                    <button
                        onClick={onDownload}
                        disabled={isProcessing}
                        className="w-full flex items-center justify-center gap-3 p-4 bg-brand-light-blue text-white rounded-lg text-lg font-bold transition transform hover:scale-105 disabled:bg-gray-400"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        <span>{isProcessing ? 'מעבד...' : 'הורד קובץ PDF'}</span>
                    </button>
                    <button
                        onClick={onDownloadData}
                        disabled={isProcessing}
                        className="w-full flex items-center justify-center gap-3 p-4 bg-brand-dark-blue text-white rounded-lg text-lg font-bold transition transform hover:scale-105 disabled:bg-gray-400"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16v-8m0 8l-3-3m3 3l3-3M5 20h14" /></svg>
                        <span>{isProcessing ? 'מעבד...' : 'הורד קובץ דמות לשחזור'}</span>
                    </button>
                    <button
                        onClick={onShare}
                        disabled={!canShare || isProcessing}
                        className="w-full flex items-center justify-center gap-3 p-4 bg-brand-teal text-white rounded-lg text-lg font-bold transition transform hover:scale-105 disabled:bg-gray-400 disabled:opacity-70"
                        title={!canShare ? "הדפדפן שלך אינו תומך בשיתוף קבצים" : ""}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367 2.684z" /></svg>
                         <span>{isProcessing ? 'מעבד...' : 'שלח קובץ'}</span>
                    </button>
                    <button
                        onClick={onCopyLink}
                        disabled={isProcessing}
                        className={`w-full flex items-center justify-center gap-3 p-4 rounded-lg text-lg font-bold transition transform hover:scale-105 disabled:bg-gray-400 ${isCopied ? 'bg-green-500 text-white' : 'bg-brand-magenta text-white'}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                        <span>{isCopied ? 'הקישור הועתק!' : (isProcessing ? 'מעבד...' : 'העתק קישור (Data URI)')}</span>
                    </button>
                </div>
                <button onClick={onClose} className="mt-6 w-full text-center text-gray-500 hover:text-gray-800">ביטול</button>
            </div>
        </div>,
        document.body
    )
}

const ArrowIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
);

type TriviaDifficulty = 'קל' | 'בינוני' | 'מאתגר';
type TriviaQuestion = { question: string; options: string[]; answer: string };

const budgetTriviaByDifficulty: Record<TriviaDifficulty, TriviaQuestion[]> = {
    קל: [
        { question: 'מה נחשב יעד בריא לחיסכון חודשי מההכנסה הנטו?', options: ['1%-2%', '5%-10%', '20%-30%', 'לא צריך לחסוך בכלל'], answer: '5%-10%' },
        { question: 'איזו פעולה עוזרת הכי הרבה להימנע ממינוס?', options: ['להימנע ממעקב', 'לשלם רק במזומן תמיד', 'לעקוב אחרי הוצאות מול הכנסות', 'לקחת הלוואה קטנה כל חודש'], answer: 'לעקוב אחרי הוצאות מול הכנסות' },
        { question: 'איך נכון להתייחס להוצאה שנתית (למשל ביטוח)?', options: ['להזין רק בחודש התשלום', 'לחלק ל-12 חודשים', 'להתעלם ממנה', 'להכפיל ב-12'], answer: 'לחלק ל-12 חודשים' },
        { question: 'מה המשמעות של מאזן חודשי חיובי?', options: ['ההוצאות גבוהות מההכנסות', 'אין הכנסות בכלל', 'נשאר כסף אחרי כל ההוצאות', 'צריך להגדיל הלוואות'], answer: 'נשאר כסף אחרי כל ההוצאות' },
        { question: 'לפני רכישה גדולה, מה צעד נכון?', options: ['לקנות מיד', 'לבדוק השפעה על התקציב החודשי', 'להגדיל מסגרת אשראי', 'להתעלם מהוצאות נוספות'], answer: 'לבדוק השפעה על התקציב החודשי' },
        { question: 'איזו הוצאה נחשבת בדרך כלל קבועה?', options: ['בילויים', 'שכירות', 'קניות ספונטניות', 'מתנות'], answer: 'שכירות' },
        { question: 'למה חשוב להשוות מחירים לפני קנייה?', options: ['כדי לבזבז יותר זמן', 'כדי לבחור מוצר יקר יותר', 'כדי לחסוך כסף', 'אין חשיבות להשוואה'], answer: 'כדי לחסוך כסף' },
        { question: 'מה נכון לעשות עם הוצאה גדולה לא צפויה?', options: ['להתעלם ממנה', 'לעדכן את התקציב מיד', 'להוציא עוד כסף כדי לאזן', 'למחוק אותה מהדוח'], answer: 'לעדכן את התקציב מיד' },
        { question: 'מהו יתרון מרכזי של מעקב תקציב?', options: ['מבלבל יותר', 'נותן שליטה על הכסף', 'מבטל את כל ההוצאות', 'מיותר לתלמידים'], answer: 'נותן שליטה על הכסף' },
        { question: 'כאשר ההוצאות עולות על ההכנסות, המאזן הוא:', options: ['חיובי', 'מאוזן', 'שלילי', 'לא רלוונטי'], answer: 'שלילי' }
    ],
    בינוני: [
        { question: 'אם הכנסת הנטו היא 9,000 ₪, כמה בערך כדאי לחסוך ב-10%?', options: ['90 ₪', '450 ₪', '900 ₪', '1,500 ₪'], answer: '900 ₪' },
        { question: 'הוצאה שנתית של 2,400 ₪ צריכה להופיע בתקציב חודשי כ:', options: ['100 ₪', '150 ₪', '200 ₪', '400 ₪'], answer: '200 ₪' },
        { question: 'מה היתרון המרכזי בשימוש בדוח סיכום תקציב?', options: ['רק לצורך עיצוב', 'לזיהוי דפוסי הוצאות ושיפור החלטות', 'אין יתרון מעשי', 'להגדלת הכנסות אוטומטית'], answer: 'לזיהוי דפוסי הוצאות ושיפור החלטות' },
        { question: 'מה עדיף לבדוק לפני התחייבות לתשלומים?', options: ['רק מחיר המוצר', 'רק מספר התשלומים', 'השפעה על מאזן חודשי + עלות כוללת', 'רק המלצה מחבר'], answer: 'השפעה על מאזן חודשי + עלות כוללת' },
        { question: 'איזו הוצאה הכי סביר לסווג כמשתנה?', options: ['שכירות', 'ארנונה', 'קניות בסופר', 'קרן פנסיה'], answer: 'קניות בסופר' },
        { question: 'אם המאזן החודשי קטן מאוד אך חיובי, מה צעד נכון?', options: ['להתעלם', 'להוסיף הוצאה קבועה חדשה', 'לייצר כרית ביטחון בהדרגה', 'להפסיק לעקוב'], answer: 'לייצר כרית ביטחון בהדרגה' },
        { question: 'מה המשמעות של "כרית ביטחון"?', options: ['הלוואה מהבנק', 'חיסכון לשעת חירום', 'קנייה גדולה מתוכננת', 'כרטיס אשראי נוסף'], answer: 'חיסכון לשעת חירום' },
        { question: 'מדוע חשוב לעדכן הערות ליד סעיפי הוצאה?', options: ['זה רק לעיצוב', 'כדי להבין מה עומד מאחורי המספר', 'כדי לנפח דוח', 'אין משמעות'], answer: 'כדי להבין מה עומד מאחורי המספר' },
        { question: 'איזה מצב מעיד לרוב על סיכון תקציבי?', options: ['חיסכון קבוע קטן', 'הוצאות גדולות קבועות בלי בדיקה', 'מאזן חיובי יציב', 'השוואת מחירים'], answer: 'הוצאות גדולות קבועות בלי בדיקה' },
        { question: 'הדרך היעילה לשיפור תקציב היא בדרך כלל:', options: ['צעד חד וקיצוני', 'מעקב ושינויים קטנים עקביים', 'עצירת כל ההוצאות', 'הימנעות מכל תכנון'], answer: 'מעקב ושינויים קטנים עקביים' }
    ],
    מאתגר: [
        { question: 'הכנסה נטו 11,200 ₪ והוצאות 10,360 ₪. מה המאזן?', options: ['840 ₪', '740 ₪', '1,200 ₪', '960 ₪'], answer: '840 ₪' },
        { question: 'אם הוספת הוצאה קבועה של 350 ₪ בחודש, מה צריך לבדוק קודם?', options: ['רק האם היא נחוצה', 'רק אם יש הנחה', 'אם המאזן החדש נשאר חיובי לאורך זמן', 'רק דעת חברים'], answer: 'אם המאזן החדש נשאר חיובי לאורך זמן' },
        { question: 'עלות שנתית 6,600 ₪ הופכת לחודשית של:', options: ['450 ₪', '500 ₪', '550 ₪', '600 ₪'], answer: '550 ₪' },
        { question: 'מה עלול לקרות אם משתמשים בתשלומים בלי לבדוק עלות כוללת?', options: ['אין השפעה', 'העלות הכוללת עלולה לעלות משמעותית', 'המחיר תמיד יורד', 'זה תמיד עדיף ממזומן'], answer: 'העלות הכוללת עלולה לעלות משמעותית' },
        { question: 'איזה צירוף מעיד על התנהלות תקציבית נכונה?', options: ['מאזן שלילי וחוסר מעקב', 'מאזן חיובי + מעקב + חיסכון', 'אין חיסכון ומינוס קבוע', 'הוצאות ספונטניות גבוהות'], answer: 'מאזן חיובי + מעקב + חיסכון' },
        { question: 'כיצד נכון להעריך השפעת רכישת רכב על התקציב?', options: ['רק מחיר הרכב', 'רק דלק', 'סכום תשלומים + ביטוח + דלק + אגרות + טיפולים', 'רק מחיר ביטוח'], answer: 'סכום תשלומים + ביטוח + דלק + אגרות + טיפולים' },
        { question: 'מה משמעות התאמת תקציב לדמות (פרופיל הכנסה)?', options: ['אותו תקציב לכולם', 'התאמת החלטות להיקף הכנסה אמיתי', 'בחירה אקראית בהוצאות', 'התעלמות מהכנסה נטו'], answer: 'התאמת החלטות להיקף הכנסה אמיתי' },
        { question: 'מתי עדיף להפחית הוצאות משתנות?', options: ['רק כשיש עודף גדול', 'כשמאזן נחלש או יעד חיסכון לא מושג', 'אין צורך להפחית לעולם', 'רק בסוף שנה'], answer: 'כשמאזן נחלש או יעד חיסכון לא מושג' },
        { question: 'אם יעד חיסכון הוא 8% מ-9,500 ₪, מה יעד החיסכון החודשי?', options: ['560 ₪', '660 ₪', '760 ₪', '860 ₪'], answer: '760 ₪' },
        { question: 'איזו החלטה מעידה על חשיבה ארוכת טווח?', options: ['להתמקד רק בחודש הנוכחי', 'להתחשב בהוצאות שנתיות וחירום בתכנון', 'להתעלם מביטוח ודלק', 'לבטל מעקב אחרי קניות'], answer: 'להתחשב בהוצאות שנתיות וחירום בתכנון' }
    ]
};


const BudgetModule: React.FC<BudgetModuleProps> = ({ onBack, title, onComplete }) => {
  const rowRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [activeModal, setActiveModal] = useState<{ type: string; itemId?: string; content?: { title: string; content: React.ReactNode; } } | null>(null);
  const [modalPosition, setModalPosition] = useState<React.CSSProperties | undefined>(undefined);

  const [step, setStep] = useState(0);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [expenses, setExpenses] = useState<(BudgetItem & { note?: string, task?: React.ReactNode, isDeduction?: boolean })[]>(initialExpenses.map(e => ({...e, amount: 0})));
  const [savingsPercentage, setSavingsPercentage] = useState(0);
  const [reportGenerated, setReportGenerated] = useState(false);
  
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const [reportDataForPdf, setReportDataForPdf] = useState<any>(null);
  const reportRef = useRef<HTMLDivElement>(null);
  
  const shareButtonRef = useRef<HTMLButtonElement>(null);
  const importFileRef = useRef<HTMLInputElement>(null);

  const [fuelConsumption, setFuelConsumption] = useState<string>('');
  const [carDetails, setCarDetails] = useState<{ year: string; price: string; } | null>(null);
  const FUEL_PRICE_PER_LITER = 7.5; // Approximation

    const [clothingInputString, setClothingInputString] = useState('0');
  const [includeKerenHishtalmut, setIncludeKerenHishtalmut] = useState(false);
  const [newExpenseRow, setNewExpenseRow] = useState<{ name: string; amount: string; note: string } | null>(null);

  const [drivingScale, setDrivingScale] = useState(5);
  
  // States for preserving modal inputs
  const [carPurchaseDetails, setCarPurchaseDetails] = useState({ model: '', adLink: '', year: new Date().getFullYear().toString(), km: '', fuelConsumption: '', hand: '', licensePlate: '', price: '', payments: 36 });
  const [rentDetails, setRentDetails] = useState({ city: '', size: '', rooms: '', floor: '', rent: '', adLink: ''});
    const [accountsAnswers, setAccountsAnswers] = useState<AccountsAnswers>({
        people: '1',
        ac: 'לפעמים',
        shower: 'רגילות',
        cooking: 'מדי פעם',
        appliances: 'ממוצע',
        homeHours: 'בינוני',
        laundry: 'בינונית',
        apartmentSize: '70'
    });
  const [entertainmentItems, setEntertainmentItems] = useState([ { id: 1, name: 'מסעדה 🍽️', price: 80, count: 0, isEditable: false, customName: '' }, { id: 2, name: 'מסיבה/סרט 🎉', price: 100, count: 0, isEditable: false, customName: '' }, { id: 3, name: 'טיול יומי 🏞️', price: 150, count: 0, isEditable: false, customName: '' }, { id: 4, name: 'הזמנת אוכל הביתה 🥡', price: 90, count: 0, isEditable: false, customName: '' }, { id: 5, name: 'אחר 🤷', price: 0, count: 0, isEditable: true, customName: '' }, ]);
  const [selectedSubscriptions, setSelectedSubscriptions] = useState<string[]>([]);
  const [maintenanceCostInput, setMaintenanceCostInput] = useState('');
  const [triviaQuestionIndex, setTriviaQuestionIndex] = useState(0);
  const [triviaScore, setTriviaScore] = useState(0);
  const [triviaSelectedAnswer, setTriviaSelectedAnswer] = useState<string | null>(null);
  const [triviaFeedback, setTriviaFeedback] = useState('');
  const [triviaFinished, setTriviaFinished] = useState(false);
    const [triviaDifficulty, setTriviaDifficulty] = useState<TriviaDifficulty | null>(null);
    const [hasOpenedBudgetGame, setHasOpenedBudgetGame] = useState(false);
    

    const activeTriviaQuestions = triviaDifficulty ? budgetTriviaByDifficulty[triviaDifficulty] : [];

    const goToStep = (targetStep: number) => {
        if (targetStep > 0 && !selectedCharacter) return;
        if (targetStep === 2 && !canMoveToSummaryChapter) return;
        setStep(targetStep);
    };

  const handleTriviaAnswer = (answer: string) => {
    if (triviaSelectedAnswer) return;
        if (!activeTriviaQuestions.length) return;
    setTriviaSelectedAnswer(answer);
        const correct = activeTriviaQuestions[triviaQuestionIndex].answer;
    if (answer === correct) {
        setTriviaScore(prev => prev + 1);
        setTriviaFeedback('נכון מאוד!');
    } else {
        setTriviaFeedback(`תשובה לא נכונה. התשובה הנכונה היא: ${correct}`);
    }
  };

  const handleNextTriviaQuestion = () => {
        if (triviaQuestionIndex < activeTriviaQuestions.length - 1) {
        setTriviaQuestionIndex(prev => prev + 1);
        setTriviaSelectedAnswer(null);
        setTriviaFeedback('');
    } else {
        setTriviaFinished(true);
        if (!reportGenerated) {
            onComplete();
            setReportGenerated(true);
        }
    }
  };

  const resetTrivia = () => {
    setTriviaQuestionIndex(0);
    setTriviaScore(0);
    setTriviaSelectedAnswer(null);
    setTriviaFeedback('');
    setTriviaFinished(false);
        setTriviaDifficulty(null);
  };

  const renderProgressBar = () => {
    const steps = [
        { id: 0, label: 'בחירת דמות', icon: '👤' },
        { id: 1, label: 'ניהול תקציב', icon: '📊' },
        { id: 2, label: 'דוח סיכום', icon: '📄' },
        { id: 3, label: 'טריוויה', icon: '🧠' },
    ];

    return (
        <div className="mb-8 bg-white/40 backdrop-blur-md border border-white/30 rounded-2xl p-4">
            <div className="flex items-start">
                {steps.map((stage, index) => (
                    <React.Fragment key={stage.id}>
                        <div className="flex flex-col items-center flex-1 cursor-default">
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${step >= stage.id ? 'bg-brand-teal border-brand-teal text-white' : 'bg-white/60 border-gray-300 text-gray-500'}`}>
                                <span className="text-2xl">{stage.icon}</span>
                            </div>
                            <p className={`mt-2 text-sm md:text-base text-center font-bold ${step >= stage.id ? 'text-brand-teal' : 'text-gray-500'}`}>{stage.label}</p>
                        </div>
                        {index < steps.length - 1 && (
                            <div className={`flex-1 h-1 mt-7 mx-2 ${step > stage.id ? 'bg-brand-teal' : 'bg-gray-300'}`}></div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
  };


  const handleOpenShareModal = () => {
    if (!selectedCharacter) return;

    setReportDataForPdf({
        character: selectedCharacter,
        netIncome,
        totalUserExpenses,
        balance,
        allExpenses: expenses
    });
    setIsShareModalOpen(true);

    if (!reportGenerated) {
        onComplete();
        setReportGenerated(true);
    }
  };
  
  const generatePdfDocument = async () => {
    const element = reportRef.current;
    if (!element) return null;

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jspdf.jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgProps = { width: canvas.width, height: canvas.height };
    const ratio = Math.min(pdfWidth / imgProps.width, pdfHeight / imgProps.height) * 0.95; // Use 95% of page for margin
    
    const imgFinalWidth = imgProps.width * ratio;
    const imgFinalHeight = imgProps.height * ratio;
    
    const x = (pdfWidth - imgFinalWidth) / 2;
    const y = (pdfHeight - imgFinalHeight) / 2;

    pdf.addImage(imgData, 'PNG', x, y, imgFinalWidth, imgFinalHeight);

    return pdf;
  };

    const createBudgetExportData = () => ({
        version: 1,
        exportedAt: new Date().toISOString(),
        character: selectedCharacter,
        expenses: expenses.map(({ task, ...rest }) => rest),
        savingsPercentage,
        includeKerenHishtalmut,
        fuelConsumption,
        drivingScale,
        clothingInputString,
        carPurchaseDetails,
        rentDetails,
        entertainmentItems,
        selectedSubscriptions,
        maintenanceCostInput,
        accountsAnswers,
    });

    const encodeExportData = (data: ReturnType<typeof createBudgetExportData>) =>
        btoa(unescape(encodeURIComponent(JSON.stringify(data))));

    const createEmbeddedPdfBlob = (pdf: any) => {
        const exportData = createBudgetExportData();
        const basePdfBlob = pdf.output('blob');
        const encodedData = encodeExportData(exportData);
        const marker = `\n%%SMARTKIS_EXPORT_START%%${encodedData}%%SMARTKIS_EXPORT_END%%`;

        return {
            exportData,
            pdfBlob: new Blob([basePdfBlob, marker], { type: 'application/pdf' }),
        };
    };

    const promptForExportFileName = (defaultFileName: string, extension: string, message: string) => {
        const userFileName = window.prompt(message, defaultFileName);

        if (userFileName === null) {
            return null;
        }

        const cleanedFileName = (userFileName.trim() || defaultFileName)
            .replace(/[\\/:*?"<>|]/g, '-')
            .replace(/\s+/g, ' ');

        return cleanedFileName.toLowerCase().endsWith(extension)
            ? cleanedFileName
            : `${cleanedFileName}${extension}`;
    };

  const handleDownload = async () => {
    if (!selectedCharacter) {
        return;
    }

    const defaultFileName = `budget-report-${selectedCharacter.name}`;
    const finalFileName = promptForExportFileName(defaultFileName, '.pdf', 'הקלידו שם לקובץ ה-PDF:');

    if (!finalFileName) {
        return;
    }

    setIsProcessing(true);
    const pdf = await generatePdfDocument();
    if (pdf) {
        const { pdfBlob } = createEmbeddedPdfBlob(pdf);
        const pdfUrl = URL.createObjectURL(pdfBlob);
        const pdfLink = document.createElement('a');
        pdfLink.href = pdfUrl;
        pdfLink.download = finalFileName;
        pdfLink.click();
        URL.revokeObjectURL(pdfUrl);
    }
    setIsProcessing(false);
    setIsShareModalOpen(false);
  };

  const handleDownloadData = () => {
    if (!selectedCharacter) {
        return;
    }

    const defaultFileName = `budget-character-${selectedCharacter.name}`;
    const finalFileName = promptForExportFileName(defaultFileName, '.smartkis', 'הקלידו שם לקובץ הדמות:');

    if (!finalFileName) {
        return;
    }

    setIsProcessing(true);
    try {
        const exportData = createBudgetExportData();
        const dataBlob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const dataUrl = URL.createObjectURL(dataBlob);
        const dataLink = document.createElement('a');
        dataLink.href = dataUrl;
        dataLink.download = finalFileName;
        dataLink.click();
        URL.revokeObjectURL(dataUrl);
        setIsShareModalOpen(false);
    } finally {
        setIsProcessing(false);
    }
  };

  const handleShare = async () => {
    setIsProcessing(true);
    const pdf = await generatePdfDocument();
    if (!pdf || !selectedCharacter) {
        alert("שגיאה: יצירת ה-PDF נכשלה.");
        setIsProcessing(false);
        return;
    }

    const { pdfBlob } = createEmbeddedPdfBlob(pdf);
    const file = new File([pdfBlob], `budget-report-${selectedCharacter.name}.pdf`, { type: 'application/pdf' });
    const shareData = {
        files: [file],
        title: `דו"ח התקציב של ${selectedCharacter.name}`,
        text: `מצורף דו"ח התקציב שהכנתי באפליקציית 'חכם בכיס'.`,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        try {
            await navigator.share(shareData);
            setIsShareModalOpen(false); // Close on success
        } catch (error) {
            if ((error as DOMException).name === 'AbortError') {
                 setIsShareModalOpen(false); // Also close if user cancels
            } else {
                console.error("Share failed:", error);
                alert("שגיאה: השיתוף נכשל.");
            }
        }
    } else {
      alert("הדפדפן שלך אינו תומך בשיתוף קבצים. נסה להוריד את הקובץ ולשתף אותו ידנית.");
    }

    setIsProcessing(false);
  };
  
  const handleCopyLink = async () => {
    setIsProcessing(true);
    const pdf = await generatePdfDocument();
    if (pdf) {
        try {
            const dataUri = pdf.output('datauristring');
            await navigator.clipboard.writeText(dataUri);
            setIsCopied(true);
            setTimeout(() => {
                setIsCopied(false);
                setIsShareModalOpen(false);
            }, 2500);
        } catch (error) {
            console.error("Copy failed:", error);
            alert("ההעתקה נכשלה. ייתכן שהקישור ארוך מדי עבור הדפדפן שלך. נסה להוריד את הקובץ במקום.");
        }
    } else {
         alert("שגיאה: יצירת ה-PDF נכשלה.");
    }
    setIsProcessing(false);
  };

    useEffect(() => {
        const clothingItem = expenses.find(e => e.category === 'הוצאות ביגוד');
        if (clothingItem) {
            setClothingInputString(String(clothingItem.note?.match(/(\d+,?)+/) ? clothingItem.note.match(/(\d+,?)+/)![0].replace(/,/g, '') : '0'));
        }
    }, [expenses]);


  const openModal = (type: string, itemId?: number) => {
    
    if (activeModal?.type) {
        setActiveModal(null);
    }

    const itemIdentifier = `${type}-${itemId || 'global'}`;

    const positionStyle: React.CSSProperties = {
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        padding: '1rem',
    };
    
    const item = initialExpenses.find(e => e.id === itemId);
    const category = item ? item.category : '';
    const content = categoryExplanations[category] || termExplanations[category];

    setTimeout(() => {
        setModalPosition(positionStyle);
        setActiveModal({ type, itemId: itemIdentifier, content: content as any });
    }, 100);
  };
  
  const openExplanationModal = (itemId: number, title: string, content: React.ReactNode) => {
      if (activeModal?.type) {
        setActiveModal(null);
      }
      const itemIdentifier = `explanation-${itemId}`;

            const positionStyle: React.CSSProperties = {
                position: 'fixed',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 50,
                padding: '1rem',
            };
      
      setTimeout(() => {
        setModalPosition(positionStyle);
        setActiveModal({ type: 'explanation', itemId: itemIdentifier, content: { title, content } });
      }, 100);
  }

  const closeModal = () => {
      setActiveModal(null);
  }
  
  const handleAddCustomExpense = (name: string, monthlyAmount: number, note: string) => {
      const newItem = {
          id: Date.now(),
          category: name,
          amount: Math.round(monthlyAmount),
          note: note,
          task: null,
          isDeduction: false
      };
      setExpenses(prev => [...prev, newItem]);
  };

  const confirmNewExpenseRow = () => {
      if (!newExpenseRow || !newExpenseRow.name.trim()) return;
      const amount = parseFloat(newExpenseRow.amount) || 0;
      handleAddCustomExpense(newExpenseRow.name.trim(), amount, newExpenseRow.note);
      setNewExpenseRow(null);
  };

  useEffect(() => {
    if (selectedCharacter) {
        const deductions = salaryDeductions(selectedCharacter.salary, selectedCharacter.name);
        const fmt = (n: number) => n.toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const kerenAmount = parseFloat((selectedCharacter.salary * 0.025).toFixed(2));
        const kerenItem = { id: 104, category: 'קרן השתלמות', amount: kerenAmount, note: `2.5% על ${fmt(selectedCharacter.salary)} ₪ = ${fmt(kerenAmount)} ₪ | המעסיק מוסיף עוד 7.5% (${fmt(selectedCharacter.salary * 0.075)} ₪) לקרן`, isDeduction: true };
        const allDeductions = includeKerenHishtalmut ? [...deductions, kerenItem] : deductions;
        setExpenses(prevExpenses => {
            const defaultExpenseIds = new Set(initialExpenses.map(item => item.id));
            const preservedBaseExpenses = initialExpenses.map(item => {
                const existingItem = prevExpenses.find(expense => expense.id === item.id && !expense.isDeduction);
                return existingItem ? { ...item, ...existingItem, task: item.task } : { ...item, amount: 0 };
            });
            const customExpenses = prevExpenses.filter(expense => !expense.isDeduction && !defaultExpenseIds.has(expense.id));

            return [...preservedBaseExpenses, ...customExpenses, ...allDeductions];
        });
    } else {
        setExpenses(initialExpenses.map(e => ({...e, amount: 0})));
    }
  }, [selectedCharacter, includeKerenHishtalmut]);

  const netIncome = useMemo(() => {
    if (!selectedCharacter) return 0;
    const totalDeductions = salaryDeductions(selectedCharacter.salary, selectedCharacter.name)
        .reduce((sum, item) => sum + item.amount, 0);
    const kerenAmount = includeKerenHishtalmut ? selectedCharacter.salary * 0.025 : 0;
    return selectedCharacter.salary - totalDeductions - kerenAmount;
  }, [selectedCharacter, includeKerenHishtalmut]);
  
  const userExpenses = useMemo(() => expenses.filter(e => !e.isDeduction), [expenses]);
  const deductionExpenses = useMemo(() => expenses.filter(e => e.isDeduction), [expenses]);

  const totalUserExpenses = useMemo(() => userExpenses.reduce((sum, item) => sum + item.amount, 0), [userExpenses]);
  const balance = useMemo(() => netIncome - totalUserExpenses, [netIncome, totalUserExpenses]);
  
  const chartData = useMemo(() => {
    return userExpenses
      .filter(e => e.amount > 0)
      .map(e => ({ name: e.category, value: e.amount }));
  }, [userExpenses]);
  
  const areAllExpensesFilled = useMemo(() => {
      const requiredCategories = initialExpenses
          .map(e => e.category)
          .filter(c => c !== 'חסכון והשקעות');
      
      return userExpenses
          .filter(e => requiredCategories.includes(e.category))
          .every(e => e.amount > 0);
  }, [userExpenses]);

    const canMoveToSummaryChapter = true;

    const openBudgetGame = () => {
        window.open('https://wordwall.net/resource/104754308', '_blank', 'noopener,noreferrer');
        setHasOpenedBudgetGame(true);
    };

    const renderChapterNavigation = () => {
        const isFirstStep = step === 0;
        const isLastStep = step === 3;
        const canGoNext =
            step === 0 ? !!selectedCharacter :
            step === 1 ? canMoveToSummaryChapter :
            step === 2 ? true :
            false;

        const handlePrev = () => {
            if (isFirstStep) return;
            goToStep(step - 1);
        };

        const handleNext = () => {
            if (!canGoNext || isLastStep) return;
            goToStep(step + 1);
        };

        return (
            <div className="sticky bottom-0 mt-8 z-20">
                <div className="bg-white/85 backdrop-blur-md border border-white/40 rounded-2xl p-3 grid grid-cols-1 sm:grid-cols-3 items-center gap-3">
                    <button
                        onClick={handlePrev}
                        disabled={isFirstStep}
                        className="bg-gray-300 hover:bg-gray-400 text-brand-dark-blue font-bold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-xl justify-self-start"
                    >
                        לפרק הקודם
                    </button>
                    {step === 1 ? (
                        <button
                            ref={shareButtonRef}
                            onClick={handleOpenShareModal}
                            className="bg-amber-400 hover:bg-amber-500 text-brand-dark-blue font-bold py-3 px-6 rounded-lg text-xl justify-self-center"
                        >
                            הפק דוח
                        </button>
                    ) : (
                        <div className="hidden sm:block" />
                    )}
                    <button
                        onClick={handleNext}
                        disabled={!canGoNext || isLastStep}
                        className={`font-bold py-3 px-6 rounded-lg text-xl text-white justify-self-end ${canGoNext && !isLastStep ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
                    >
                        לפרק הבא
                    </button>
                </div>
            </div>
        );
    };

  useEffect(() => {
    if (netIncome > 0) {
        const savingsAmount = Math.round((savingsPercentage / 100) * Number(netIncome));
        const newNote = savingsPercentage > 0 
            ? `כל הכבוד! אתם חוסכים ${savingsPercentage} אחוז משכר הנטו שלכם !`
            : '';
        setExpenses(prevExpenses => 
            prevExpenses.map(e => 
                e.category === 'חסכון והשקעות' 
                ? { ...e, amount: savingsAmount, note: newNote } 
                : e
            )
        );
    }
  }, [savingsPercentage, netIncome]);

  useEffect(() => {
    const consumption = parseFloat(fuelConsumption);
    let newAmount = 0;
    const monthlyDistance = drivingScale * 300;

    if (!isNaN(consumption) && consumption > 0) {
      const litersNeeded = monthlyDistance / consumption;
      newAmount = Math.round(litersNeeded * FUEL_PRICE_PER_LITER);
    }
    
    const newNote = newAmount > 0 ? `חושב אוטומטית (לפי ${monthlyDistance.toLocaleString()} ק"מ בחודש)` : '';

    setExpenses(prevExpenses => {
      const fuelItem = prevExpenses.find(e => e.category === 'רכב- דלק');
      if (fuelItem && (fuelItem.amount !== newAmount || fuelItem.note !== newNote)) {
        return prevExpenses.map(e => (e.category === 'רכב- דלק' ? { ...e, amount: newAmount, note: newNote } : e));
      }
      return prevExpenses;
    });
  }, [fuelConsumption, drivingScale]);

  useEffect(() => {
    if (carDetails && carDetails.price && carDetails.year) {
      const priceNum = parseFloat(carDetails.price);
      const yearNum = parseInt(carDetails.year);
      if (isNaN(priceNum) || isNaN(yearNum) || priceNum <= 0 || yearNum > new Date().getFullYear()) {
        setExpenses(prevExpenses => prevExpenses.map(e => (e.category === 'רכב- אגרות' ? { ...e, amount: 0, note: '' } : e)));
        return;
      }

      // Fee data based on the official 2024 table for non-hybrid/electric private cars
      const feesByGroup = {
        group1: [1114, 897, 740, 608, 502, 432, 374], // <= 135k
        group2: [1518, 1222, 1008, 829, 685, 590, 509], // <= 157k
        group3: [1845, 1485, 1225, 1007, 832, 716, 619], // <= 179k
        group4: [2246, 1808, 1491, 1226, 1013, 871, 753], // <= 241k
        group5: [3184, 2563, 2114, 1739, 1436, 1236, 1068], // <= 322k
        group6: [4688, 3774, 3112, 2558, 2114, 1820, 1572], // <= 485k
        group7: [5745, 4625, 3814, 3137, 2591, 2230, 1928], // > 485k
      };

      // 1. Determine Price Group
      let priceGroupKey: keyof typeof feesByGroup;
      if (priceNum <= 135000) priceGroupKey = 'group1';
      else if (priceNum <= 157000) priceGroupKey = 'group2';
      else if (priceNum <= 179000) priceGroupKey = 'group3';
      else if (priceNum <= 241000) priceGroupKey = 'group4';
      else if (priceNum <= 322000) priceGroupKey = 'group5';
      else if (priceNum <= 485000) priceGroupKey = 'group6';
      else priceGroupKey = 'group7';

      const feesForGroup = feesByGroup[priceGroupKey];

      // 2. Determine Age Group Index
      const vehicleAge = new Date().getFullYear() - yearNum;
      let ageIndex: number;
      if (vehicleAge <= 3) ageIndex = 0;
      else if (vehicleAge <= 6) ageIndex = 1;
      else if (vehicleAge <= 9) ageIndex = 2;
      else if (vehicleAge <= 12) ageIndex = 3;
      else if (vehicleAge <= 15) ageIndex = 4;
      else if (vehicleAge <= 19) ageIndex = 5;
      else ageIndex = 6;

      // 3. Get the final annual fee
      const finalFee = feesForGroup[ageIndex];
      const monthlyFee = finalFee / 12;

      // 4. Update state
      setExpenses(prevExpenses => prevExpenses.map(e => {
          if (e.category === 'רכב- אגרות') {
            return {
              ...e,
              amount: Math.round(monthlyFee),
              note: `אגרה שנתית: ${finalFee.toLocaleString()} ₪ (מחושב אוטומטית)`
            };
          }
          return e;
        }));
    }
  }, [carDetails]);
  
  const handleSelectCharacter = (character: Character) => {
        setExpenses(initialExpenses.map(e => ({ ...e, amount: 0 })));
    setSelectedCharacter(character);
        setHasOpenedBudgetGame(false);
    setStep(1);
  };

  const handleImportCharacter = (file: File) => {
    const lowerCaseFileName = file.name.toLowerCase();
    const isPdf = lowerCaseFileName.endsWith('.pdf');
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            let data: any;
            if (isPdf) {
                const binary = e.target?.result as string;
                const embeddedMatch = binary.match(/%%SMARTKIS_EXPORT_START%%([A-Za-z0-9+/=\r\n]+)%%SMARTKIS_EXPORT_END%%/);
                const metadataMatch = binary.match(/smartkis-export:([A-Za-z0-9+/=\s\r\n]+)/);
                const encodedData = embeddedMatch?.[1] ?? metadataMatch?.[1];

                if (!encodedData) {
                    alert('לא נמצאו נתוני דמות בקובץ ה-PDF. ודאו שהקובץ יוצא ממודול התקציב של SmartKIS.');
                    return;
                }

                data = JSON.parse(decodeURIComponent(escape(atob(encodedData.replace(/[\s\r\n]/g, '')))));
            } else {
                data = JSON.parse(e.target?.result as string);
            }
            if (!data.version || !data.character) {
                alert('קובץ לא תקין. ודאו שטענתם קובץ שיוצא מהמודול.');
                return;
            }
            setSelectedCharacter(data.character);
            const restoredExpenses = (data.expenses || []).map((exp: any) => {
                const original = initialExpenses.find(e => e.id === exp.id);
                return { ...exp, task: original?.task };
            });
            setExpenses(restoredExpenses);
            if (data.savingsPercentage !== undefined) setSavingsPercentage(data.savingsPercentage);
            if (data.includeKerenHishtalmut !== undefined) setIncludeKerenHishtalmut(data.includeKerenHishtalmut);
            if (data.fuelConsumption !== undefined) setFuelConsumption(data.fuelConsumption);
            if (data.drivingScale !== undefined) setDrivingScale(data.drivingScale);
            if (data.clothingInputString !== undefined) setClothingInputString(data.clothingInputString);
            if (data.carPurchaseDetails) setCarPurchaseDetails(data.carPurchaseDetails);
            if (data.rentDetails) setRentDetails(data.rentDetails);
            if (data.entertainmentItems) setEntertainmentItems(data.entertainmentItems);
            if (data.selectedSubscriptions) setSelectedSubscriptions(data.selectedSubscriptions);
            if (data.maintenanceCostInput !== undefined) setMaintenanceCostInput(data.maintenanceCostInput);
            if (data.accountsAnswers) setAccountsAnswers(data.accountsAnswers);
            setHasOpenedBudgetGame(false);
            setStep(1);
        } catch {
            alert('שגיאה בקריאת הקובץ. ודאו שהקובץ תקין.');
        }
    };
    if (isPdf) reader.readAsBinaryString(file);
    else reader.readAsText(file);
  };
  
  const handleExpenseChange = (id: number, newAmount: number) => {
    setExpenses(prev => prev.map(e => (e.id === id ? { ...e, amount: newAmount } : e)));
  };

  const handleNoteChange = (id: number, newNote: string) => {
    setExpenses(prev => prev.map(e => (e.id === id ? { ...e, note: newNote } : e)));
  };

    const handleAnnualAmountChange = (itemId: number, rawValue: string, setter: (value: string) => void) => {
        setter(rawValue);

        const annual = parseFloat(rawValue) || 0;
        const monthly = annual / 4;
        handleExpenseChange(itemId, Math.round(monthly));

        const currentNote = expenses.find(e => e.id === itemId)?.note || '';
        const noteWithoutAnnual = currentNote
            .replace(/עלות שנתית: [\d,]+ ₪/g, '')
            .replace(/סכום שנתי שהוזן: [\d,]+ ₪/g, '')
            .trim();

        if (annual > 0) {
            const annualNote = `סכום שנתי שהוזן: ${annual.toLocaleString()} ₪`;
            handleNoteChange(itemId, `${noteWithoutAnnual} ${annualNote}`.trim());
        } else {
            handleNoteChange(itemId, noteWithoutAnnual);
        }
    };

  const handleUnforeseenResult = (result: { label: string, value: number }) => {
      const unforeseenItem = expenses.find(e => e.category === 'בלת"מים');
      if (unforeseenItem) {
        handleExpenseChange(unforeseenItem.id, result.value);
        handleNoteChange(unforeseenItem.id, result.label);
      }
  };
  
  const updateBudgetFromModal = (category: string, amount: number, note: string) => {
    const item = expenses.find(e => e.category === category);
    if(item){
        handleExpenseChange(item.id, Math.round(amount));
        handleNoteChange(item.id, note);
    }
  };

  const handleSaveSubscriptions = (totalAmount: number, selectedNames: string[]) => {
    const subsItem = expenses.find(e => e.category === 'מנויים');
    if (subsItem) {
        handleExpenseChange(subsItem.id, totalAmount);
        handleNoteChange(subsItem.id, selectedNames.join(', '));
    }
    closeModal();
  };
  
  const handlePurchaseComplete = (details: { monthlyPayment: number; note: string; fuelConsumption: string; year: string; price: string; adLink: string; }) => {
    const finalNote = details.adLink ? `${details.note} @@LINK@@${details.adLink}` : details.note;
    updateBudgetFromModal('רכב - קנייה', details.monthlyPayment, finalNote);
    if (details.fuelConsumption) {
        setFuelConsumption(details.fuelConsumption);
    }
    setCarDetails({ year: details.year, price: details.price });
  };
  
  const handleSaveMaintenance = (monthlyCost: number, annualCost: number) => {
    const maintenanceItem = expenses.find(e => e.category === 'רכב - טיפולים');
    if (maintenanceItem) {
        handleExpenseChange(maintenanceItem.id, monthlyCost);
        handleNoteChange(maintenanceItem.id, `עלות שנתית מוערכת: ${annualCost.toLocaleString()} ₪`);
    }
  };
  
  const handleSaveAccounts = (monthlyCost: number, note: string) => {
      updateBudgetFromModal('חשבונות', monthlyCost, note);
  };

  const handleSaveInsurance = (annualPrice: number, company: string, insuranceType: string) => {
      const monthlyPrice = Math.round(annualPrice / 12);
      updateBudgetFromModal('רכב- ביטוח', monthlyPrice, `חברת הביטוח: ${company}, סוג הביטוח: ${insuranceType}, תשלום שנתי: ${annualPrice.toLocaleString()} ₪`);
  };


  if (step === 0) {
    return (
        <ModuleView title={title} onBack={onBack}>
            {renderProgressBar()}
            {activeModal?.type === 'createCharacter' && <CreateCharacterModal 
                onClose={closeModal}
                onCreate={(char) => {
                    handleSelectCharacter(char);
                    closeModal();
                }}
            />}
            <h3 className="text-4xl font-bold text-center mb-2 text-brand-light-blue">ניהול התקציב הראשון שלי</h3>
            <p className="text-center text-2xl mb-8 text-brand-dark-blue/90">ביחרו את הדמות שאיתה תצאו למסע ניהול התקציב החודשי</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {characters.map(char => (
                    <div key={char.name} onClick={() => handleSelectCharacter(char)} className="bg-white/60 backdrop-blur-lg p-4 rounded-2xl border-2 border-transparent hover:border-brand-teal transition-all duration-300 cursor-pointer text-center transform hover:-translate-y-2 shadow-lg">
                        <img src={char.avatar} alt={char.name} className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-white shadow-md"/>
                        <h4 className="font-bold text-3xl mt-4">{char.name}</h4>
                        <p className="text-lg">{char.description}</p>
                        <p className="font-bold text-2xl mt-2 text-brand-teal">{char.salary.toLocaleString()} ₪ (ברוטו)</p>
                    </div>
                ))}
                <div onClick={() => openModal('createCharacter')} className="bg-white/60 backdrop-blur-lg p-4 rounded-2xl border-2 border-dashed border-brand-teal hover:border-brand-teal hover:bg-teal-50/50 transition-all duration-300 cursor-pointer text-center transform hover:-translate-y-2 shadow-lg flex flex-col items-center justify-center">
                    <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-brand-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                    <h4 className="font-bold text-3xl">יצירת דמות חדשה</h4>
                    <p className="text-lg">התאימו את התקציב לנתונים שלכם</p>
                </div>
                <div onClick={() => importFileRef.current?.click()} className="bg-white/60 backdrop-blur-lg p-4 rounded-2xl border-2 border-dashed border-purple-400 hover:border-purple-500 hover:bg-purple-50/50 transition-all duration-300 cursor-pointer text-center transform hover:-translate-y-2 shadow-lg flex flex-col items-center justify-center">
                    <div className="w-32 h-32 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                    </div>
                    <h4 className="font-bold text-3xl">ייבוא דמות</h4>
                    <p className="text-lg">טענו קובץ SmartKIS, JSON או PDF שיוצא בעבר</p>
                    <input ref={importFileRef} type="file" accept=".smartkis,.json,.pdf" className="hidden"
                        onChange={(e) => { if (e.target.files?.[0]) handleImportCharacter(e.target.files[0]); e.target.value = ''; }} />
                </div>
            </div>
            {renderChapterNavigation()}
        </ModuleView>
    );
  }

    if (step === 2) {
        return (
            <ModuleView title={title} onBack={() => setStep(1)}>
                {renderProgressBar()}
                {reportDataForPdf && (
                    <div ref={reportRef} style={{ position: 'absolute', left: '-9999px', top: 0, zIndex: -1 }}>
                            <SummaryReportForPdf {...reportDataForPdf} />
                    </div>
                )}
                <ShareReportModal
                    isOpen={isShareModalOpen}
                    onClose={() => setIsShareModalOpen(false)}
                    onDownload={handleDownload}
                    onDownloadData={handleDownloadData}
                    onShare={handleShare}
                    onCopyLink={handleCopyLink}
                    isProcessing={isProcessing}
                    isCopied={isCopied}
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white/50 backdrop-blur-md border border-white/30 p-8 rounded-2xl space-y-6">
                        <h3 className="text-center font-bold text-2xl">ניתוח תזרים</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center my-6">
                            <div><p className="text-lg">הכנסה נטו</p><p className="font-bold text-3xl text-green-600">{netIncome.toLocaleString('he-IL', {style:'currency', currency:'ILS'})}</p></div>
                            <div><p className="text-lg">סה"כ הוצאות</p><p className="font-bold text-3xl text-red-500">{totalUserExpenses.toLocaleString('he-IL', {style:'currency', currency:'ILS'})}</p></div>
                            <div><p className="text-lg">מאזן חודשי</p><p className={`font-bold text-3xl ${balance >= 0 ? 'text-brand-teal' : 'text-brand-magenta'}`}>{balance.toLocaleString('he-IL', {style:'currency', currency:'ILS'})}</p></div>
                        </div>
                        <div className="h-96 w-full">
                            <h4 className="text-center font-bold text-lg mb-2">פירוט הוצאות</h4>
                            <ResponsiveContainer width="100%" height="90%">
                                <PieChart>
                                    <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label={({ percent }) => `${((Number(percent) || 0) * 100).toFixed(0)}%`}>
                                        {chartData.map((entry, index) => <Cell key={`summary-cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                    </Pie>
                                    <RechartsTooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="bg-white/50 backdrop-blur-md border border-white/30 p-6 rounded-2xl flex flex-col items-center justify-center">
                        <h3 className="text-center font-bold text-2xl mb-4">דוח הסיכום שלכם מוכן</h3>
                        <p className="text-center mb-4">כאן תוכלו להפיק, להוריד ולשתף את הדוח המסכם של התקציב שבניתם.</p>
                        <button
                            ref={shareButtonRef}
                            onClick={handleOpenShareModal}
                            title='הפק דו"ח סיכום'
                            className="w-full bg-brand-magenta hover:bg-pink-700 text-white font-bold py-4 px-4 rounded-xl transition-all transform hover:scale-105 text-3xl shadow-lg"
                        >
                            הפק דו"ח סיכום
                        </button>
                    </div>
                </div>
                {renderChapterNavigation()}
            </ModuleView>
        );
    }

    if (step === 3) {
        const currentQuestion = activeTriviaQuestions[triviaQuestionIndex];
        return (
            <ModuleView title={title} onBack={() => setStep(2)}>
                {renderProgressBar()}
                <div className="bg-white/50 backdrop-blur-md border border-white/30 p-8 rounded-2xl max-w-4xl mx-auto">
                    <h3 className="text-center font-bold text-4xl mb-4 text-brand-light-blue">טריוויה ניהול תקציב</h3>
                    {!triviaDifficulty ? (
                        <div className="text-center space-y-4">
                            <p className="text-2xl text-brand-dark-blue/80">בחרו רמת קושי לפני שמתחילים:</p>
                            <div className="flex flex-wrap gap-3 justify-center">
                                <button onClick={() => setTriviaDifficulty('קל')} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-2xl">קל</button>
                                <button onClick={() => setTriviaDifficulty('בינוני')} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-lg text-2xl">בינוני</button>
                                <button onClick={() => setTriviaDifficulty('מאתגר')} className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-lg text-2xl">מאתגר</button>
                            </div>
                        </div>
                    ) : !triviaFinished && currentQuestion ? (
                        <>
                            <p className="text-center text-xl mb-1 text-brand-dark-blue/80">רמה: <span className="font-bold">{triviaDifficulty}</span></p>
                            <p className="text-center text-xl mb-3 text-brand-dark-blue/80">שאלה {triviaQuestionIndex + 1} מתוך {activeTriviaQuestions.length}</p>
                            <h4 className="font-bold text-3xl mb-6 text-center">{currentQuestion.question}</h4>
                            <div className="space-y-3">
                                {currentQuestion.options.map(option => {
                                    const isSelected = triviaSelectedAnswer === option;
                                    const isCorrect = option === currentQuestion.answer;
                                    const className = triviaSelectedAnswer
                                        ? isCorrect
                                            ? 'bg-green-500 text-white'
                                            : isSelected
                                                ? 'bg-red-500 text-white'
                                                : 'bg-gray-200 text-gray-600'
                                        : 'bg-white hover:bg-brand-light-blue/20';

                                    return (
                                        <button
                                            key={option}
                                            onClick={() => handleTriviaAnswer(option)}
                                            disabled={!!triviaSelectedAnswer}
                                            className={`w-full text-right p-4 rounded-lg border border-gray-300 text-2xl transition-colors ${className}`}
                                        >
                                            {option}
                                        </button>
                                    );
                                })}
                            </div>
                            {triviaFeedback && <p className="mt-4 text-center font-bold text-xl">{triviaFeedback}</p>}
                            {triviaSelectedAnswer && (
                                <button onClick={handleNextTriviaQuestion} className="w-full mt-4 bg-brand-teal text-white font-bold py-3 rounded-lg text-2xl">
                                    {triviaQuestionIndex < activeTriviaQuestions.length - 1 ? 'לשאלה הבאה' : 'סיום טריוויה'}
                                </button>
                            )}
                        </>
                    ) : (
                        <div className="text-center">
                            <p className="text-3xl font-bold mb-3">סיימתם את הטריוויה!</p>
                            <p className="text-2xl mb-2">רמה: <span className="font-bold">{triviaDifficulty}</span></p>
                            <p className="text-2xl mb-4">הציון שלכם: {triviaScore} מתוך {activeTriviaQuestions.length}</p>
                            <button onClick={resetTrivia} className="bg-brand-magenta hover:bg-pink-700 text-white font-bold py-3 px-8 rounded-lg text-2xl">נסו שוב</button>
                        </div>
                    )}
                </div>
                {renderChapterNavigation()}
            </ModuleView>
        );
    }

  return (
    <ModuleView title={title} onBack={() => setStep(0)}>
            {renderProgressBar()}
            {activeModal && ReactDOM.createPortal(
                <>
                    {activeModal.type === 'unforeseen' && <UnforeseenEventModal style={modalPosition} onClose={closeModal} onResult={handleUnforeseenResult} />}
                    {activeModal.type.startsWith('carQuestionnaire') && <CarQuestionnaireModal style={modalPosition} onClose={closeModal} />}
                    {activeModal.type.startsWith('rentQuestionnaire') && <RentQuestionnaireModal style={modalPosition} onClose={closeModal} selectedCharacter={selectedCharacter} />}
                    {activeModal.type.startsWith('supermarket') && <SupermarketModal
                            style={modalPosition}
                            onClose={closeModal}
                            onSelect={(name) => handleNoteChange(2, name)}
                    />}
                    {activeModal.type.startsWith('clothingStore') && <ClothingStoreModal
                            style={modalPosition}
                            onClose={closeModal}
                            onSelect={(name) => handleNoteChange(14, `רשת: ${name}`)}
                    />}
                    {activeModal.type.startsWith('subscriptions') && <SubscriptionsModal initialSelected={selectedSubscriptions} setInitialSelected={setSelectedSubscriptions} style={modalPosition} onClose={closeModal} onSave={handleSaveSubscriptions} />}
                    {activeModal.type.startsWith('carPurchase') && <CarPurchaseModal details={carPurchaseDetails} setDetails={setCarPurchaseDetails} netIncome={netIncome} style={modalPosition} onClose={closeModal} onPurchaseComplete={handlePurchaseComplete} />}
                    {activeModal.type.startsWith('insuranceCalculator') && <InsuranceCalculatorModal style={modalPosition} onClose={closeModal} onSelect={handleSaveInsurance} />}
                    {activeModal.type.startsWith('licenseFee') && <LicenseFeeExplanationModal style={modalPosition} onClose={closeModal} />}
                    {activeModal.type.startsWith('fuelCost') && <FuelCostExplanationModal style={modalPosition} onClose={closeModal} />}
                    {activeModal.type.startsWith('maintenanceCalculator') && <CarMaintenanceCalculatorModal cost={maintenanceCostInput} setCost={setMaintenanceCostInput} style={modalPosition} onClose={closeModal} onSave={handleSaveMaintenance} drivingScale={drivingScale} setDrivingScale={setDrivingScale} />}
                    {activeModal.type.startsWith('maintenanceExplanation') && <CarMaintenanceExplanationModal style={modalPosition} onClose={closeModal} />}
                    {activeModal.type.startsWith('entertainmentSimulator') && <EntertainmentSimulatorModal items={entertainmentItems} setItems={setEntertainmentItems} style={modalPosition} onClose={closeModal} onSave={(total, note) => updateBudgetFromModal('בילויים ומסעדות', total, note)} />}
                    {activeModal.type.startsWith('accountsCalculator') && <AccountsCalculatorModal answers={accountsAnswers} setAnswers={setAccountsAnswers} selectedCharacter={selectedCharacter} style={modalPosition} onClose={closeModal} onSave={handleSaveAccounts} />}
                    {activeModal.type === 'createCharacter' && <CreateCharacterModal onClose={closeModal} onCreate={(char) => handleSelectCharacter(char)} />}
                    {activeModal.type === 'explanation' && activeModal.content && <ExplanationModal style={modalPosition} title={activeModal.content.title} content={activeModal.content.content} onClose={closeModal} />}
                    {activeModal.type.startsWith('rentPurchase') && <RentPurchaseModal 
                        details={rentDetails}
                        setDetails={setRentDetails}
                        style={modalPosition} 
                        onClose={closeModal} 
                        netIncome={netIncome}
                        onSave={({rent, note}) => {
                                const rentItem = expenses.find(e => e.category === 'שכירות');
                                if (rentItem) {
                                        handleExpenseChange(rentItem.id, rent);
                                        handleNoteChange(rentItem.id, note);
                                }
                        }} 
                 />}
                 {activeModal.type === 'addCustomExpense' && <AddCustomExpenseModal onClose={closeModal} onAdd={handleAddCustomExpense} style={modalPosition} />}
                </>,
                document.body
            )}
     {reportDataForPdf && (
        <div ref={reportRef} style={{ position: 'absolute', left: '-9999px', top: 0, zIndex: -1 }}>
            <SummaryReportForPdf {...reportDataForPdf} />
        </div>
     )}
     <ShareReportModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onDownload={handleDownload}
          onDownloadData={handleDownloadData}
        onShare={handleShare}
        onCopyLink={handleCopyLink}
        isProcessing={isProcessing}
        isCopied={isCopied}
     />
      
      <div className="space-y-8">
        {/* Top Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Character & Legend */}
            <div className="bg-white/50 backdrop-blur-md border border-white/30 p-6 rounded-2xl h-full flex flex-col">
              {selectedCharacter && (
                <>
                    <div className="text-center mb-4">
                        <img src={selectedCharacter.avatar} alt={selectedCharacter.name} className="w-40 h-40 rounded-full mx-auto object-cover border-4 border-white shadow-md"/>
                        <h4 className="font-bold text-[2.5rem] mt-3">{selectedCharacter.name}</h4>
                        <p className="text-[1.4rem] text-gray-600">{selectedCharacter.description}</p>
                    </div>
                     <div className="mt-4 space-y-2 text-[1.65rem] flex-grow">
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-gray-700 flex items-center gap-1">שכר ברוטו: <Tooltip title="שכר ברוטו" content={termExplanations['שכר ברוטו']}/></span>
                            <span className="font-mono">{selectedCharacter.salary.toLocaleString('he-IL', {style:'currency', currency:'ILS', minimumFractionDigits: 0})}</span>
                        </div>
                         <div className="pl-4 mr-2 space-y-1 text-[1.4rem]">
                             {deductionExpenses.map(item => (
                                <div key={item.id} className="flex justify-between items-center text-red-600">
                                    <span className="flex items-center gap-1">{item.category} <Tooltip title={item.category} content={termExplanations[item.category] || 'הסבר בקרוב...'} /></span>
                                    <span className="font-mono">{item.amount.toLocaleString('he-IL', {style:'currency', currency:'ILS'})}</span>
                                </div>
                             ))}
                         </div>

                        <div className="flex justify-between font-bold text-[2.1rem] mt-3 border-t-2 border-gray-300 pt-3">
                            <span className="text-green-700">הכנסה נטו:</span>
                            <span className="text-green-600 font-mono">{netIncome.toLocaleString('he-IL', {style:'currency', currency:'ILS', minimumFractionDigits: 0})}</span>
                        </div>

                    </div>
                </>
              )}
            </div>

            {/* Right Column: Instructions */}
            <div className="bg-white/50 backdrop-blur-md border border-white/30 p-6 rounded-2xl h-full">
                <h4 className="font-bold text-[2.2rem] mb-3 text-brand-teal">הנחיות עבודה</h4>

                <ol className="list-decimal list-inside space-y-3 text-[1.25rem] text-brand-dark-blue/90">
                    {budgetGuideSteps.slice(0, 5).map((guideStep, index) => (
                        <li key={`instruction-${guideStep.iconLabel}`}>
                            {(() => {
                                const useWhiteStyle = index === 0 || index === 4;
                                const isInfoStep = index === 0;
                                const badgeClass = useWhiteStyle
                                    ? 'bg-white text-black border border-gray-400'
                                    : guideStep.buttonClass;
                                const iconCircleClass = useWhiteStyle
                                    ? 'w-6 h-6 rounded-full bg-white border border-gray-400 text-black inline-flex items-center justify-center'
                                    : 'w-6 h-6 rounded-full bg-white/30 text-current inline-flex items-center justify-center';

                                return (
                            <span className="inline-flex items-center gap-2 font-bold">
                                <span className={`py-1 px-3 text-sm inline-flex items-center gap-1 ${isInfoStep ? 'rounded-full border border-gray-400 bg-white text-black' : `rounded-full ${badgeClass}`}`}>
                                    <span className={isInfoStep ? 'inline-flex items-center justify-center text-gray-500' : iconCircleClass}>{guideStep.icon}</span>
                                    <span>{guideStep.iconLabel}</span>
                                </span>
                                <span>{guideStep.title}</span>
                            </span>
                                );
                            })()}
                            <p className="mr-2 mt-1 text-[1.05rem] text-brand-dark-blue/80">{guideStep.shortText}</p>
                        </li>
                    ))}
                    <li>
                        <span className="inline-flex items-center gap-2 font-bold">
                            <span className="py-1 px-3 rounded-full text-sm inline-flex items-center gap-1 bg-red-500/25 text-black border border-red-400">
                                <span className="w-6 h-6 rounded-full bg-white/30 text-current inline-flex items-center justify-center">🎬</span>
                                <span>סרטון</span>
                            </span>
                            <span>צפו בהסבר קצר</span>
                        </span>
                        <p className="mr-2 mt-1 text-[1.05rem] text-brand-dark-blue/80">במיוחד בסעיף ניכויי השכר, לחיצה על כפתור הסרטון תפתח הסבר קצר וברור לפני המעבר לקישור החיצוני.</p>
                    </li>
                    {budgetGuideSteps.slice(5).map(guideStep => (
                        <li key={`instruction-${guideStep.iconLabel}`}>
                            <span className="inline-flex items-center gap-2 font-bold">
                                <span className={`py-1 px-3 rounded-full text-sm inline-flex items-center gap-1 ${guideStep.buttonClass}`}>
                                    <span className="w-6 h-6 rounded-full bg-white/30 text-current inline-flex items-center justify-center">{guideStep.icon}</span>
                                    <span>{guideStep.iconLabel}</span>
                                </span>
                                <span>{guideStep.title}</span>
                            </span>
                            <p className="mr-2 mt-1 text-[1.05rem] text-brand-dark-blue/80">{guideStep.shortText}</p>
                        </li>
                    ))}
                </ol>
            </div>
        </div>
        
        {/* Expenses Table Section */}
        <div className="bg-white/50 backdrop-blur-md border border-white/30 p-6 rounded-2xl">
            <h3 className="text-center font-bold text-4xl mb-6">טבלת ניהול תקציב חודשית</h3>
            <div className="bg-white/20 p-4 rounded-xl">
                <h4 className="font-bold text-3xl text-brand-dark-blue text-center mb-4 p-3 rounded-lg bg-cyan-200/50">הוצאות מחייה</h4>
                <div className="space-y-3">
                  {userExpenses.map(item => (
                    <div key={item.id} ref={(el) => (rowRefs.current[String(item.id)] = el)} data-id={item.id} className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-md p-4 border border-transparent hover:border-brand-light-blue/50">
                        {/* Top row */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                                <span className="font-bold text-3xl truncate">{item.category}</span>
                                {categoryExplanations[item.category] && (
                                    <Tooltip 
                                        title={categoryExplanations[item.category].title}
                                        content={categoryExplanations[item.category].content}
                                    />
                                )}
                            </div>
                            <div className="relative w-full sm:w-36 flex-shrink-0">
                                {item.category === 'הוצאות ביגוד' ? (
                                    <input 
                                        type="number" 
                                        value={clothingInputString} 
                                        onChange={(e) => handleAnnualAmountChange(item.id, e.target.value, setClothingInputString)}
                                        className={`w-full text-left py-2 pr-2 pl-12 rounded-lg border-2 shadow-inner bg-white transition-all focus:border-brand-teal focus:ring-1 focus:ring-brand-teal text-base`}
                                    />
                                ) : (
                                    <input 
                                        type="number" 
                                        value={item.amount || ''} 
                                        onChange={(e) => handleExpenseChange(item.id, parseFloat(e.target.value) || 0)}
                                        readOnly={['חסכון והשקעות', 'רכב- דלק', 'מנויים', 'רכב - טיפולים', 'בילויים ומסעדות', 'חשבונות', 'שכירות', 'רכב - קנייה'].includes(item.category)}
                                        className={`w-full text-left py-2 pr-2 pl-12 rounded-lg border-2 shadow-inner bg-slate-50 transition-all focus:border-brand-teal focus:ring-1 focus:ring-brand-teal text-base ${
                                        ['חסכון והשקעות', 'רכב- דלק', 'מנויים', 'רכב - טיפולים', 'בילויים ומסעדות', 'חשבונות', 'שכירות', 'רכב - קנייה'].includes(item.category) 
                                        ? 'bg-gray-200 cursor-not-allowed' 
                                        : 'bg-white'}`
                                    }
                                        placeholder="0"
                                    />
                                )}
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-base">ש"ח</span>
                            </div>
                        </div>
                         {/* Bottom controls */}
                        <div className="mt-3 pt-3 border-t border-gray-200 space-y-3">
                            <div className="flex flex-wrap items-center gap-2">
                               {item.task && ( <button onClick={() => openExplanationModal(item.id, 'משימה', item.task!)} className="text-base bg-[#1b2550] text-white py-1 px-3 rounded-full hover:bg-blue-900 inline-flex items-center gap-1"><span>✓</span><span>משימה</span></button> )}
                                {item.category === 'שכירות' && ( <> <ArrowIcon className="w-5 h-5 text-gray-400" /> <button onClick={() => openModal('rentQuestionnaire', item.id)} className="text-base bg-[#01b2cf] text-black py-1 px-3 rounded-full hover:bg-cyan-500 inline-flex items-center gap-1"><span>⚙</span><span>שאלון ההכוונה</span></button> <ArrowIcon className="w-5 h-5 text-gray-400" /> <a href={categoryLinks[item.category]} target="_blank" rel="noopener noreferrer" className="text-base bg-brand-teal text-black py-1 px-3 rounded-full hover:bg-teal-500 inline-flex items-center gap-1"><span>🔗</span><span>קישור לאתר</span></a> <ArrowIcon className="w-5 h-5 text-gray-400" /> <button onClick={() => openModal('rentPurchase', item.id)} className="text-base bg-[#01b2cf] text-black py-1 px-3 rounded-full hover:bg-cyan-500 inline-flex items-center gap-1"><span>⚙</span><span>מלאו את פרטי הדירה</span></button> </> )}
                                {item.category === 'קניות בסופר' && ( <> <ArrowIcon className="w-5 h-5 text-gray-400" /> <button onClick={() => openModal('supermarket', item.id)} className="text-base bg-[#01b2cf] text-black py-1 px-3 rounded-full hover:bg-cyan-500 inline-flex items-center gap-1"><span>⚙</span><span>ביחרו רשת</span></button> </> )}
                                {item.category === 'חשבונות' && ( <> <ArrowIcon className="w-5 h-5 text-gray-400" /> <button onClick={() => openModal('accountsCalculator', item.id)} className="text-base bg-[#01b2cf] text-black py-1 px-3 rounded-full hover:bg-cyan-500 inline-flex items-center gap-1"><span>⚙</span><span>מחשבון</span></button> </> )}
                                {item.category === 'בילויים ומסעדות' && ( <> <ArrowIcon className="w-5 h-5 text-gray-400" /> <button onClick={() => openModal('entertainmentSimulator', item.id)} className="text-base bg-[#01b2cf] text-black py-1 px-3 rounded-full hover:bg-cyan-500 inline-flex items-center gap-1"><span>⚙</span><span>מחשבון</span></button> </> )}
                                {item.category === 'בלת"מים' && ( <> <ArrowIcon className="w-5 h-5 text-gray-400" /> <button onClick={() => openModal('unforeseen', item.id)} className="text-base bg-[#01b2cf] text-black py-1 px-3 rounded-full hover:bg-cyan-500 inline-flex items-center gap-1"><span>⚙</span><span>בחירה</span></button> </> )}
                                {item.category === 'מנויים' && ( <> <ArrowIcon className="w-5 h-5 text-gray-400" /> <button onClick={() => openModal('subscriptions', item.id)} className="text-base bg-[#01b2cf] text-black py-1 px-3 rounded-full hover:bg-cyan-500 inline-flex items-center gap-1"><span>⚙</span><span>בחירה</span></button> </> )}
                                {item.category === 'רכב - קנייה' && ( <> <ArrowIcon className="w-5 h-5 text-gray-400" /> <button onClick={() => openModal('carQuestionnaire', item.id)} className="text-base bg-[#01b2cf] text-black py-1 px-3 rounded-full hover:bg-cyan-500 inline-flex items-center gap-1"><span>⚙</span><span>שאלון הכוונה</span></button> <ArrowIcon className="w-5 h-5 text-gray-400" /> <a href={categoryLinks[item.category]} target="_blank" rel="noopener noreferrer" className="text-base bg-brand-teal text-black py-1 px-3 rounded-full hover:bg-teal-500 inline-flex items-center gap-1"><span>🔗</span><span>קישור לאתר</span></a> <ArrowIcon className="w-5 h-5 text-gray-400" /> <button onClick={() => openModal('carPurchase', item.id)} className="text-base bg-[#01b2cf] text-black py-1 px-3 rounded-full hover:bg-cyan-500 inline-flex items-center gap-1"><span>⚙</span><span>ביצוע הרכישה</span></button> </> )}
                                {item.category === 'רכב- ביטוח' && ( <> <ArrowIcon className="w-5 h-5 text-gray-400" /> <a href={categoryLinks[item.category]} target="_blank" rel="noopener noreferrer" className="text-base bg-brand-teal text-black py-1 px-3 rounded-full hover:bg-teal-500 inline-flex items-center gap-1"><span>🔗</span><span>קישור לאתר</span></a> <span className="text-base font-bold text-gray-600">או</span> <button onClick={() => openModal('insuranceCalculator', item.id)} className="text-base bg-[#01b2cf] text-black py-1 px-3 rounded-full hover:bg-cyan-500 inline-flex items-center gap-1"><span>⚙</span><span>מחשבון ביטוח</span></button> </> )}
                                {item.category === 'רכב- אגרות' && ( <> <ArrowIcon className="w-5 h-5 text-gray-400" /> <a href="https://www.carzone.co.il/finance/registration-tax/" target="_blank" rel="noopener noreferrer" className="text-base bg-brand-teal text-black py-1 px-3 rounded-full hover:bg-teal-500 inline-flex items-center gap-1"><span>🔗</span><span>קישור לאתר</span></a> </> )}
                                {item.category === 'רכב- דלק' && <></>}
                                {item.category === 'רכב - טיפולים' && ( <> <ArrowIcon className="w-5 h-5 text-gray-400" /> <button onClick={() => openModal('maintenanceCalculator', item.id)} className="text-base bg-[#01b2cf] text-black py-1 px-3 rounded-full hover:bg-cyan-500 inline-flex items-center gap-1"><span>⚙</span><span>מחשבון</span></button> </> )}
                                {item.category === 'הוצאות ביגוד' && ( <> <ArrowIcon className="w-5 h-5 text-gray-400" /> <button onClick={() => openModal('clothingStore', item.id)} className="text-base bg-[#01b2cf] text-black py-1 px-3 rounded-full hover:bg-cyan-500 inline-flex items-center gap-1"><span>⚙</span><span>ביחרו רשת</span></button> </> )}
                                {categoryLinks[item.category] && !['רכב - קנייה', 'רכב- ביטוח', 'שכירות'].includes(item.category) && <a href={categoryLinks[item.category]} target="_blank" rel="noopener noreferrer" className="text-base bg-brand-teal text-black py-1 px-3 rounded-full hover:bg-teal-500 inline-flex items-center gap-1"><span>🔗</span><span>קישור לאתר</span></a>}
                            </div>
                           
                            {item.category === 'חסכון והשקעות' && ( <div className="mt-2"> <div className="flex items-center gap-2"> <input type="range" min="0" max="50" value={savingsPercentage} onChange={(e) => setSavingsPercentage(Number(e.target.value))} className="w-full" /> <span className="font-bold w-16 text-center">{savingsPercentage}%</span> </div> <p className="text-xs text-center text-gray-600">מהכנסה נטו ({netIncome.toLocaleString()} ₪)</p> </div> )}
                            {item.category === 'רכב- דלק' && ( <div className="mt-2 flex items-center gap-2"> <label className="text-sm">צריכת דלק (ק"מ/ליטר):</label> <input type="number" value={fuelConsumption} onChange={(e) => setFuelConsumption(e.target.value)} className="w-24 p-1 rounded-md border border-gray-300" placeholder="לדוג׳ 15" /> <span className="text-xs text-gray-600">(לפי {(drivingScale * 300).toLocaleString()} ק"מ בחודש)</span> </div> )}
                            
                            {(() => {
                                const noteText = item.note || '';
                                const hasLink = noteText.includes('@@LINK@@');
                                const isReadOnly = ['חסכון והשקעות', 'רכב- אגרות', 'רכב - טיפולים', 'בילויים ומסעדות', 'חשבונות', 'שכירות', 'רכב - קנייה', 'רכב- דלק', 'הוצאות ביגוד', 'רכב- ביטוח'].includes(item.category);
                                if (hasLink) {
                                    const [mainNote, linkUrl] = noteText.split('@@LINK@@');
                                    return ( <div className="w-full mt-2 p-2 rounded-md text-xl border border-gray-200 bg-gray-100 break-words"> {mainNote} {linkUrl && ( <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-bold ml-2"> קישור למודעה </a> )} </div> );
                                }
                                return ( <input type="text" value={item.note || ''} onChange={(e) => handleNoteChange(item.id, e.target.value)} placeholder={ item.category === 'נייד' || item.category === 'רכב- ביטוח' ? (placeholders[item.category] || 'הערה...') : '' } readOnly={isReadOnly} className={`w-full mt-2 p-2 rounded-md text-xl border border-gray-200 transition-colors ${isReadOnly ? 'bg-gray-100' : 'bg-white/70'}`} /> );
                            })()}
                        </div>
                    </div>
                  ))}
                  {newExpenseRow && (
                    <div className="bg-white/80 border-2 border-brand-teal rounded-2xl p-4 mt-3 space-y-3">
                      <input
                        type="text"
                        value={newExpenseRow.name}
                        onChange={e => setNewExpenseRow(prev => prev ? { ...prev, name: e.target.value } : prev)}
                        placeholder="שם ההוצאה (לדוגמה: ועד בית)"
                        autoFocus
                        className="w-full p-2 rounded-lg border border-gray-300 text-xl focus:outline-none focus:ring-2 focus:ring-brand-teal"
                      />
                      <div className="relative">
                        <input
                          type="number"
                          value={newExpenseRow.amount}
                          onChange={e => setNewExpenseRow(prev => prev ? { ...prev, amount: e.target.value } : prev)}
                          placeholder={'סכום בש"ח'}
                          className="w-full p-2 pl-12 rounded-lg border border-gray-300 text-xl focus:outline-none focus:ring-2 focus:ring-brand-teal"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-base pointer-events-none">ש"ח</span>
                      </div>
                      <input
                        type="text"
                        value={newExpenseRow.note}
                        onChange={e => setNewExpenseRow(prev => prev ? { ...prev, note: e.target.value } : prev)}
                        placeholder="פירוט / הערה (אופציונלי)"
                        className="w-full p-2 rounded-lg border border-gray-300 text-xl focus:outline-none focus:ring-2 focus:ring-brand-teal"
                      />
                      <div className="flex gap-3 justify-end">
                        <button onClick={() => setNewExpenseRow(null)} className="px-4 py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100 font-bold">ביטול</button>
                        <button onClick={confirmNewExpenseRow} className="px-4 py-2 rounded-xl bg-brand-teal text-white font-bold hover:bg-teal-600">הוסף</button>
                      </div>
                    </div>
                  )}
                  <button 
                    onClick={() => setNewExpenseRow({ name: '', amount: '', note: '' })}
                    className="w-full py-3 px-4 rounded-2xl border-2 border-dashed border-gray-400 text-gray-600 hover:border-brand-teal hover:text-brand-teal hover:bg-teal-50 transition-all font-bold text-xl flex items-center justify-center gap-2 mt-4"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    הוספת הוצאה חדשה
                  </button>
                </div>
            </div>

              {deductionExpenses.length > 0 && (
                <div className="bg-white/20 p-4 rounded-xl mt-4">
                  <h4 className="font-bold text-3xl text-brand-dark-blue text-center mb-2 p-3 rounded-lg bg-cyan-200/50 flex items-center justify-center gap-2">
                    <span>ניכויים</span>
                    <Tooltip title="מהם ניכויים?" content={termExplanations['ניכויים']} />
                  </h4>
                   <p className="text-center text-xl text-brand-dark-blue/80 mb-4">
                        סכומים אלו חושבו אוטומטית ולכן אין צורך לבצע משימה בסעיפים אלו.
                        <br />
                        עם זאת, אתם מוזמנים לצפות בסרטוני ההסבר ולנסות לחשב את הסכומים בעצמכם בעזרת הקישורים לאתרים.
                    </p>
                  <div className="space-y-3">
                  {deductionExpenses.map(item => (
                    <div key={item.id} className="bg-gray-100/70 p-4 rounded-2xl shadow-inner">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                                <div className="flex flex-wrap items-center gap-2 min-w-0">
                           <span className="font-bold text-3xl text-gray-700">{item.category}</span>
                           <Tooltip title={item.category} content={termExplanations[item.category] || 'הסבר בקרוב...'} />
                            {item.category === 'מס הכנסה' && (
                                <>
                                    <a href="https://youtu.be/s2KRKDfVxMQ" target="_blank" rel="noopener noreferrer" className="text-base bg-red-500/25 border border-red-400 text-black py-1 px-3 rounded-full hover:bg-red-500/35 inline-flex items-center gap-1">
                                        <span>🎬</span>
                                        <span>סרטון</span>
                                    </a>
                                    <ArrowIcon className="w-5 h-5 text-gray-400" />
                                    <a href={categoryLinks[item.category]} target="_blank" rel="noopener noreferrer" className="text-base bg-brand-teal text-black py-1 px-3 rounded-full hover:bg-teal-500 inline-flex items-center gap-1">
                                        <span>🔗</span>
                                        <span>קישור לאתר</span>
                                    </a>
                                </>
                            )}
                            {item.category === 'ביטוח לאומי' && (
                                <>
                                    <a href="https://youtu.be/QcPnUSlNffs" target="_blank" rel="noopener noreferrer" className="text-base bg-red-500/25 border border-red-400 text-black py-1 px-3 rounded-full hover:bg-red-500/35 inline-flex items-center gap-1">
                                        <span>🎬</span>
                                        <span>סרטון</span>
                                    </a>
                                    <ArrowIcon className="w-5 h-5 text-gray-400" />
                                    <a href={categoryLinks[item.category]} target="_blank" rel="noopener noreferrer" className="text-base bg-brand-teal text-black py-1 px-3 rounded-full hover:bg-teal-500 inline-flex items-center gap-1">
                                        <span>🔗</span>
                                        <span>קישור לאתר</span>
                                    </a>
                                </>
                            )}
                            {item.category === 'מס בריאות' && (
                                <>
                                    <a href="https://youtu.be/QcPnUSlNffs" target="_blank" rel="noopener noreferrer" className="text-base bg-red-500/25 border border-red-400 text-black py-1 px-3 rounded-full hover:bg-red-500/35 inline-flex items-center gap-1">
                                        <span>🎬</span>
                                        <span>סרטון</span>
                                    </a>
                                    <ArrowIcon className="w-5 h-5 text-gray-400" />
                                    <a href={categoryLinks[item.category]} target="_blank" rel="noopener noreferrer" className="text-base bg-brand-teal text-black py-1 px-3 rounded-full hover:bg-teal-500 inline-flex items-center gap-1">
                                        <span>🔗</span>
                                        <span>קישור לאתר</span>
                                    </a>
                                </>
                            )}
                            {item.category === 'הפרשה לפנסיה' && (
                                <a href="https://youtu.be/9g3CmmzXQlM" target="_blank" rel="noopener noreferrer" className="text-base bg-red-500/25 border border-red-400 text-black py-1 px-3 rounded-full hover:bg-red-500/35 inline-flex items-center gap-1">
                                        <span>🎬</span>
                                        <span>סרטון</span>
                                </a>
                            )}
                        </div>
                                                <div className="relative w-full sm:w-36 flex-shrink-0">
                            <input
                              type="number"
                              value={Math.round(item.amount)}
                              readOnly
                                                            className="w-full text-left py-2 pr-2 pl-12 rounded-lg border-2 border-gray-300 bg-gray-200 cursor-not-allowed shadow-inner text-base"
                            />
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-base">ש"ח</span>
                        </div>
                      </div>
                                            {item.note && (
                                                <p className="mt-2 text-sm text-gray-700 bg-white/70 border border-gray-200 rounded-lg px-3 py-2">
                                                    {item.note}
                                                </p>
                                            )}
                    </div>
                  ))}
                  </div>
                  {/* Keren Hishtalmut toggle */}
                  <div className="mt-4 flex justify-center">
                    <button
                      onClick={() => setIncludeKerenHishtalmut(prev => !prev)}
                      className={`flex items-center gap-2 px-5 py-2 rounded-full font-bold text-base border-2 transition-all ${includeKerenHishtalmut ? 'bg-emerald-100 border-emerald-500 text-emerald-800' : 'bg-white/60 border-gray-300 text-gray-700 hover:border-emerald-400'}`}
                    >
                      <span>{includeKerenHishtalmut ? '✅' : '➕'}</span>
                      <span>הוספת הפרשה לקרן השתלמות</span>
                    </button>
                  </div>
                </div>
              )}
        </div>
        
        {/* Bottom Section: External game task */}
        <div className="grid grid-cols-1 gap-8">
            <div className="bg-white/50 backdrop-blur-md border border-white/30 p-6 rounded-2xl flex flex-col items-center justify-center">
                <h3 className="text-center font-bold text-2xl mb-4">משימת משחק מסכמת</h3>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-40 h-40 my-2 text-brand-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-center mb-4">אפשר לשחק במשחק החיצוני כהעשרה, אבל כפתור המעבר לפרק הבא זמין כעת בכל שלב.</p>
                <button 
                    onClick={openBudgetGame}
                    title='פתח משחק חיצוני'
                    className="w-full bg-brand-magenta hover:bg-pink-700 text-white font-bold py-4 px-4 rounded-xl transition-all transform hover:scale-105 text-2xl shadow-lg"
                >
                    מעבר למשחק
                </button>
                {hasOpenedBudgetGame && <p className="mt-3 text-green-700 font-bold text-xl">המשחק נפתח ✅</p>}
                <p className="mt-2 text-center text-brand-dark-blue/80 text-lg">אפשר להמשיך לדוח הסיכום גם בלי להשלים את כל סעיפי ההוצאה.</p>
            </div>
        </div>
        {renderChapterNavigation()}
      </div>
    </ModuleView>
  );
};

export default BudgetModule;