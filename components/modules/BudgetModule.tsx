import React, { useState, useMemo, useEffect, ChangeEvent, useCallback, useRef } from 'react';
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
            <li>מלאו את פרטי הרכב והנהג שלב אחרי שלב.</li>
            <li>* היעזרו בהסבר שבכפתור הנחיות למילוי.</li>
            <li>בחרו את הצעת הביטוח המשתלמת ביותר.</li>
            <li>רשמו את המחיר ב<b className="font-bold">תיבת הסכום</b> ואת הפרטים העיקריים ב<b className="font-bold">תיבת ההערות</b>.</li>
        </ol>
    )},
    { id: 11, category: 'רכב- אגרות', amount: 0, task: (
        <ol className="list-decimal list-inside text-right space-y-2">
            <li>למדו מהן אגרות רישוי דרך <b className="font-bold">אייקון המידע</b>.</li>
            <li>עלות האגרה <b className="font-bold">חושבה אוטומטית</b>.</li>
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
            <li>הזינו את הסכום ב<b className="font-bold">תיבת הסכום</b>.</li>
        </ol>
    )},
];

const calculateIncomeTax = (salary: number, characterName: string): number => {
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
        if (salary > previousBracketLimit) {
            const taxableAmountInBracket = Math.min(salary - previousBracketLimit, bracket.upTo - previousBracketLimit);
            tax += taxableAmountInBracket * bracket.rate;
            processedSalary += taxableAmountInBracket;
        } else {
            break;
        }
    }

    const CREDIT_POINT_VALUE = 242; // For 2024
    let creditPoints = 2.25; // Default for male characters (דניאל, רוני)
    if (characterName === 'יובל' || characterName === 'מאיה') {
        creditPoints = 2.75; // For female characters
    }
    const taxCredit = creditPoints * CREDIT_POINT_VALUE;

    const finalTax = tax - taxCredit;
    
    return finalTax > 0 ? finalTax : 0;
};

const salaryDeductions = (salary: number, characterName: string): (BudgetItem & { isDeduction: boolean })[] => {
    const incomeTax = calculateIncomeTax(salary, characterName);

    // Bituach Leumi & Mas Briut calculation updated according to the official rates
    // published by the National Insurance Institute of Israel for 2024.
    // Source: https://www.btl.gov.il/Insurance/Rates/Pages/%D7%9C%D7%A2%D7%95%D7%91%D7%93%D7%99%D7%9D%20%D7%A9%D7%9B%D7%99%D7%A8%D7%99%D7%9D.aspx
    let bituachLeumi = 0;
    let masBriut = 0;
    
    const lowerBracketLimit = 7522; 
    const upperBracketLimit = 49030;

    if (salary <= lowerBracketLimit) {
        // Reduced rates on income up to 60% of the average wage
        bituachLeumi = salary * 0.004; // 0.40%
        masBriut = salary * 0.031; // 3.10%
    } else {
        // Calculate for the part up to the lower bracket
        let lowerPartAmount = lowerBracketLimit;
        bituachLeumi += lowerPartAmount * 0.004;
        masBriut += lowerPartAmount * 0.031;

        // Calculate for the part above the lower bracket up to the upper bracket
        let upperPartAmount = Math.min(salary, upperBracketLimit) - lowerBracketLimit;
        bituachLeumi += upperPartAmount * 0.07; // 7.00%
        masBriut += upperPartAmount * 0.05; // 5.00%

        // Income above the upper bracket is not subject to these deductions.
    }
    
    const pension = salary * 0.065; // Example rate remains as an approximation

    return [
        { id: 100, category: 'מס הכנסה', amount: parseFloat(incomeTax.toFixed(2)), isDeduction: true },
        { id: 101, category: 'ביטוח לאומי', amount: parseFloat(bituachLeumi.toFixed(2)), isDeduction: true },
        { id: 102, category: 'מס בריאות', amount: parseFloat(masBriut.toFixed(2)), isDeduction: true },
        { id: 103, category: 'הפרשה לפנסיה', amount: parseFloat(pension.toFixed(2)), isDeduction: true },
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

const termExplanations: Record<string, string> = {
    'שכר ברוטו': 'זהו השכר הכולל שלך לפני כל הניכויים. הוא כולל את שכר היסוד, שעות נוספות, בונוסים ותוספות אחרות.',
    'ניכויים': 'אלו סכומים שהמעסיק שלך מוריד משכר הברוטו שלך על פי חוק (כמו מסים וביטוחים) לפני שהכסף מגיע אליך.',
    'מס הכנסה': 'מס המוטל על הכנסתך. מחושב לפי מדרגות מס ומופחת על ידי נקודות זיכוי אישיות.',
    'ביטוח לאומי': 'תשלום חובה למוסד לביטוח לאומי, המבטח אותך במקרים של אבטלה, פגיעה בעבודה, נכות, ומממן קצבאות.',
    'מס בריאות': 'תשלום חובה המממן את מערכת הבריאות הציבורית ומאפשר לך לקבל שירותים רפואיים מקופת החולים.',
    'הפרשה לפנסיה': 'חיסכון חובה לגיל פרישה. חלק מהסכום מופרש על ידך וחלק על ידי המעסיק.',
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
        price: string;
        consumption: string;
        type: string;
        year: string;
        reliability: string;
    } | null>(null);

    const questions = [
        { question: "מה התקציב החודשי הכולל שלך לרכב (תשלומים, ביטוח, דלק)?", options: ["עד 1,500 ₪", "1,500 - 2,500 ₪", "מעל 2,500 ₪"] },
        { question: "כמה אנשים בדרך כלל תיסע איתם ברכב?", options: ["לרוב לבד או עם עוד מישהו", "3-4 אנשים", "5 אנשים או יותר"] },
        { question: "מה סדר העדיפויות שלך ברכישת רכב?", options: ["אמינות ושקט נפשי, גם אם המחיר גבוה יותר", "המחיר הזול ביותר, גם אם יידרשו תיקונים"] },
        { question: "מה יותר חשוב לך בנסיעה?", options: ["חיסכון בדלק, גם אם הרכב פחות חזק", "ביצועים וכוח, גם אם צריכת הדלק גבוהה"] },
        { question: "למה הרכב ישמש אותך בעיקר?", options: ["נסיעות עירוניות קצרות", "נסיעות ארוכות וטיולים", "גם וגם, שימוש מעורב"] }
    ];

    const handleAnswer = (qIndex: number, answer: string) => {
        const newAnswers = { ...answers, [qIndex]: answer };
        setAnswers(newAnswers);

        if (qIndex < questions.length - 1) {
            setStep(qIndex + 1);
        } else {
            // Calculate results based on all answers
            const priceResult = newAnswers[0] === 'עד 1,500 ₪' ? "עד 40,000 ₪" : newAnswers[0] === '1,500 - 2,500 ₪' ? "40,000 - 80,000 ₪" : "מעל 80,000 ₪";
            const typeResult = newAnswers[1] === '5 אנשים או יותר' ? "רכב גדול / 7 מקומות" : newAnswers[1] === '3-4 אנשים' ? "רכב משפחתי" : "רכב קטן / סופר-מיני";
            const reliabilityResult = newAnswers[2] === 'אמינות ושקט נפשי, גם אם המחיר גבוה יותר' ? "רכבים חדשים ואמינים יותר (לרוב יפניים/קוריאניים)" : "רכבים ישנים יותר, שעלולים לדרוש תחזוקה";
            const yearResult = newAnswers[2] === 'אמינות ושקט נפשי, גם אם המחיר גבוה יותר' ? "5 שנים ומטה" : "מעל 7 שנים";
            const consumptionResult = newAnswers[3] === 'חיסכון בדלק, גם אם הרכב פחות חזק' ? "מעל 15 ק\"מ/ליטר" : "סביב 12-15 ק\"מ/ליטר";
            
            setResults({
                price: priceResult,
                type: typeResult,
                reliability: reliabilityResult,
                year: yearResult,
                consumption: consumptionResult
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
                            <p><strong>סוג הרכב:</strong> {results?.type}</p>
                            <p><strong>טווח מחיר:</strong> {results?.price}</p>
                            <p><strong>שנתון מומלץ:</strong> {results?.year}</p>
                            <p><strong>צריכת דלק מומלצת:</strong> {results?.consumption}</p>
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

const RentQuestionnaireModal: React.FC<{ onClose: () => void, style?: React.CSSProperties }> = ({ onClose, style }) => {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [results, setResults] = useState<{
        budget: string;
        size: string;
        locationType: string;
        features: string;
    } | null>(null);

    const questions = [
        { 
            question: "מהו התקציב החודשי הריאלי שתרצו להקדיש לשכר דירה?", 
            note: "מומלץ שההוצאה על דיור לא תעלה על 35% מההכנסה נטו.",
            options: ["עד 3,000 ₪ (חסכוני)", "3,000 - 4,500 ₪ (סטנדרטי)", "מעל 4,500 ₪ (מפנק)"] 
        },
        { 
            question: "איך תעדיפו לגור?", 
            options: ["לבד (פרטיות מלאה, יקר יותר)", "עם שותף/ה אחד/ת (איזון בין עלויות לפרטיות)", "עם 2 שותפים או יותר (הכי חסכוני)"] 
        },
        { 
            question: "מה הכי חשוב לכם במיקום הדירה?", 
            options: ["קרבה למרכזי בילוי ותחבורה ציבורית", "שכונה שקטה עם פארקים ושטחים ירוקים", "המחיר הנמוך ביותר, גם אם זה רחוק מהמרכז"] 
        },
        { 
            question: "על מה לא תוכלו לוותר בדירה?", 
            options: ["חייב/ת מרפסת שמש", "חייבת להיות משופצת ומודרנית", "שתהיה מרוהטת (אפילו חלקית)", "העיקר המחיר, לא קריטי לי כלום"] 
        }
    ];

    const handleAnswer = (qIndex: number, answer: string) => {
        const newAnswers = { ...answers, [qIndex]: answer };
        setAnswers(newAnswers);

        if (qIndex < questions.length - 1) {
            setStep(qIndex + 1);
        } else {
            // Calculate results
            const sizeResult = newAnswers[1].includes('לבד') ? "דירת יחיד / 2 חדרים" : newAnswers[1].includes('אחד/ת') ? "דירת 3 חדרים" : "דירת 4+ חדרים";
            const locationTypeResult = newAnswers[2].includes('בילוי') ? "אזור עירוני ותוסס" : newAnswers[2].includes('שקטה') ? "שכונה ירוקה ורגועה" : "אזור משתלם כלכלית";
            const featuresResult = newAnswers[3].includes('העיקר המחיר') ? "התמקדו במחיר הנמוך ביותר" : `חפשו דירות עם דגש על: ${newAnswers[3].split(' ')[1]}`;
            
            setResults({
                budget: newAnswers[0],
                size: sizeResult,
                locationType: locationTypeResult,
                features: featuresResult,
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
                            <p><strong>🏠 סוג דירה:</strong> {results?.size}</p>
                            <p><strong>💰 תקציב מומלץ:</strong> {results?.budget}</p>
                            <p><strong>📍 אופי השכונה:</strong> {results?.locationType}</p>
                            <p><strong>✨ דגשים לחיפוש:</strong> {results?.features}</p>
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
    style?: React.CSSProperties;
}> = ({ onClose, onPurchaseComplete, details, setDetails, style }) => {
    
    const { model, adLink, year, km, fuelConsumption, hand, licensePlate, price, payments } = details;
    
    const setField = (field: string, value: any) => {
        setDetails({ ...details, [field]: value });
    };

    const [validationError, setValidationError] = useState('');
    const [kmWarning, setKmWarning] = useState('');
    const [priceWarning, setPriceWarning] = useState('');
    const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);

    const getEstimatedPrice = (yearNum: number, kmNum: number) => {
        if (isNaN(yearNum) || yearNum < 1990) return 0;
        const age = new Date().getFullYear() - yearNum;
        return Math.max(0, 120000 - (age * 7000) - (kmNum * 0.2));
    };

    useEffect(() => {
        const yearNum = parseInt(year);
        const kmNum = parseInt(km);
        if (!isNaN(yearNum) && !isNaN(kmNum) && yearNum < new Date().getFullYear()) {
            const age = new Date().getFullYear() - yearNum;
            const avgKmPerYear = age > 0 ? kmNum / age : kmNum;
            if (avgKmPerYear > 18000) {
                setKmWarning(`שימו לב: ממוצע הקילומטראז' לשנה (${Math.round(avgKmPerYear).toLocaleString()} ק"מ) גבוה מהממוצע הארצי (כ-18,000 ק"מ).`);
            } else {
                setKmWarning('');
            }
        } else {
            setKmWarning('');
        }
    }, [km, year]);

    useEffect(() => {
        const yearNum = parseInt(year);
        const kmNum = parseInt(km);
        const priceNum = parseFloat(price);
        if (!isNaN(yearNum) && !isNaN(kmNum) && !isNaN(priceNum)) {
            const estimatedPrice = getEstimatedPrice(yearNum, kmNum);
            if (estimatedPrice > 0 && priceNum > estimatedPrice * 1.1) { 
                setPriceWarning(`שימו לב: המחיר המבוקש גבוה ממחיר המחירון המשוער (כ-${Math.round(estimatedPrice).toLocaleString()} ₪)`);
            } else {
                setPriceWarning('');
            }
        } else {
            setPriceWarning('');
        }
    }, [price, year, km]);

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
    
    const allFieldsFilled = !!(model && adLink && year && km && fuelConsumption && hand && price);

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
            monthlyPayment: payments > 0 ? Math.round(monthlyPayment) : 0,
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
                        {renderField("adLink", "קישור למודעה*", "הדביקו כאן את הקישור", adLink, (v) => setField('adLink', v), "url")}
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
                    {renderField("licensePlate", "מספר לוחית רישוי", "אופציונלי", licensePlate, (v) => setField('licensePlate', v))}
                    {renderField("price", "מחיר*", "כמה עולה הרכב", price, (v) => setField('price', v), "number", priceWarning)}
                    
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

const InsuranceExplanationModal: React.FC<{ onClose: () => void, style?: React.CSSProperties }> = ({ onClose, style }) => {
    const [slideIndex, setSlideIndex] = useState(0);

    const slides = [
        {
            title: "ביטוחי רכב",
            content: "קיימים 3 סוגי ביטוחים עיקריים לרכב. בואו נבין מה כל אחד מהם מכסה."
        },
        {
            title: "ביטוח חובה",
            content: "כשמו כן הוא - חובה על פי חוק. מכסה נזקי גוף (פציעות) לנהג, לנוסעים ולהולכי רגל. הוא לא מכסה נזק לרכב שלך או לרכב אחר."
        },
        {
            title: "ביטוח צד ג'",
            content: "ביטוח רשות (לא חובה). מכסה נזקים שגרמת לרכוש של מישהו אחר (הצד השלישי), למשל, לרכב אחר בתאונה."
        },
        {
            title: "ביטוח מקיף",
            content: "ביטוח רשות והיקר ביותר. הוא כולל בתוכו גם ביטוח חובה וגם צד ג', ובנוסף מכסה נזקים לרכב שלך (מתאונה, גניבה, שריפה וכו')."
        },
        {
            title: "מה משפיע על מחיר הביטוח?",
            content: "המחיר (פרמיה) נקבע לפי: גיל הנהג, ותק הנהיגה, עבר ביטוחי (תאונות), סוג הרכב, גילו ואמצעי המיגון שמותקנים בו."
        },
        {
            title: "מהי השתתפות עצמית?",
            content: "הסכום הראשוני שאתה תשלם מכיסך במקרה של תביעה. ככל שההשתתפות העצמית גבוהה יותר, כך מחיר הביטוח (הפרמיה) בדרך כלל נמוך יותר."
        },
        {
            title: "מה חשוב לבדוק?",
            content: "לפני שבוחרים ביטוח, חשוב להשוות מחירים, לבדוק את גובה הכיסוי, את סכום ההשתתפות העצמית ואת איכות השירות של חברת הביטוח."
        }
    ];

    const currentSlide = slides[slideIndex];

    return (
        <div className="absolute bg-black bg-opacity-50 z-50 animate-fade-in" style={style}>
            <div className="bg-white p-8 rounded-2xl w-full max-w-lg shadow-2xl text-center">
                <h3 className="text-2xl font-bold mb-4 text-brand-light-blue">{currentSlide.title}</h3>
                <div className="min-h-[120px] flex items-center justify-center">
                    <p className="text-lg">{currentSlide.content}</p>
                </div>
                <div className="flex justify-between items-center mt-6">
                    <button onClick={() => setSlideIndex(s => s - 1)} disabled={slideIndex === 0} className="bg-gray-300 py-2 px-4 rounded-lg disabled:opacity-50">הקודם</button>
                    <span>{slideIndex + 1} / {slides.length}</span>
                    {slideIndex < slides.length - 1 ? (
                        <button onClick={() => setSlideIndex(s => s + 1)} className="bg-brand-teal text-white py-2 px-4 rounded-lg">הבא</button>
                    ) : (
                        <button onClick={onClose} className="bg-brand-magenta text-white py-2 px-4 rounded-lg">סיום</button>
                    )}
                </div>
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

type AccountsAnswers = { people: string; ac: string; shower: string; cooking: string; appliances: string; };

const AccountsCalculatorModal: React.FC<{
    onClose: () => void;
    onSave: (monthlyCost: number, note: string) => void;
    answers: AccountsAnswers;
    setAnswers: (answers: AccountsAnswers) => void;
    style?: React.CSSProperties;
}> = ({ onClose, onSave, answers, setAnswers, style }) => {
    const [step, setStep] = useState(1);
    const [result, setResult] = useState<{ 
        monthlyPerPerson: number; 
        note: string;
        breakdown: { name: string, value: number }[];
    } | null>(null);

    const handleAnswerChange = (question: keyof typeof answers, value: string) => {
        setAnswers({ ...answers, [question]: value });
    };

    const handleCalculate = () => {
        const peopleNum = parseInt(answers.people);

        let baseElectricity = 250;
        let baseWater = 100;
        let baseGas = 50;
        const baseMunicipal = 300; 

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
        
        const totalBiMonthly = baseElectricity + baseWater + baseGas + baseMunicipal;
        const monthlyTotal = totalBiMonthly / 2;
        const monthlyPerPerson = Math.round(monthlyTotal / peopleNum);

        const breakdown = [
            { name: 'חשמל', value: Math.round((baseElectricity / 2) / peopleNum) },
            { name: 'מים', value: Math.round((baseWater / 2) / peopleNum) },
            { name: 'גז', value: Math.round((baseGas / 2) / peopleNum) },
            { name: 'ארנונה ועד בית', value: Math.round((baseMunicipal / 2) / peopleNum) },
        ];
        
        const note = `הערכה לפי ${answers.people} נפשות, שימוש ${answers.ac} במזגן, מקלחות ${answers.shower}, בישול ${answers.cooking} ושימוש ${answers.appliances} במכשירים.`;

        setResult({ monthlyPerPerson, note, breakdown });
        setStep(2);
    };
    
    const handleSave = () => {
        if (result) {
            onSave(result.monthlyPerPerson, result.note);
            onClose();
        }
    };

    type AnswerKey = keyof typeof answers;
    const questionSet: { key: AnswerKey, label: string, options: string[] }[] = [
        { key: 'people', label: 'כמה אנשים גרים בדירה (כולל אותך)?', options: ['1', '2', '3', '4+'] },
        { key: 'ac', label: 'איך היית מגדיר/ה את השימוש שלך במזגן?', options: ['הרבה', 'לפעמים', 'כמעט ולא'] },
        { key: 'shower', label: 'איך נראות המקלחות שלך בדרך כלל?', options: ['ארוכות וחמות', 'רגילות'] },
        { key: 'cooking', label: 'מה הרגלי הבישול שלך?', options: ['כל יום', 'מדי פעם', 'כמעט ולא'] },
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
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {q.options.map(opt => (
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
                        <p className="font-bold text-6xl text-brand-magenta my-4">{result.monthlyPerPerson.toLocaleString()} ₪</p>
                        <div className="bg-gray-100 p-4 rounded-lg text-right">
                            <h5 className="font-bold text-lg mb-2">פירוט ההערכה:</h5>
                            <ul className="space-y-1">
                                {result.breakdown.map(item => (
                                    <li key={item.name} className="flex justify-between">
                                        <span>{item.name}:</span>
                                        <span className="font-mono">{item.value.toLocaleString()} ₪</span>
                                    </li>
                                ))}
                            </ul>
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
                    <input type="text" value={city} onChange={e => setField('city', e.target.value)} placeholder="מיקום הדירה (עיר)*" className="w-full p-2 rounded border" />
                    <input type="number" value={size} onChange={e => setField('size', e.target.value)} placeholder="גודל הדירה (מ&quot;ר)*" className="w-full p-2 rounded border" />
                    <input type="number" value={rooms} onChange={e => setField('rooms', e.target.value)} placeholder="מספר חדרים*" className="w-full p-2 rounded border" />
                    <input type="number" value={floor} onChange={e => setField('floor', e.target.value)} placeholder="קומה*" className="w-full p-2 rounded border" />
                    <input type="url" value={adLink} onChange={e => setField('adLink', e.target.value)} placeholder="קישור למודעה*" className="w-full p-2 rounded border" />
                    <div>
                        <input type="number" value={rent} onChange={e => setField('rent', e.target.value)} placeholder="שכר דירה (₪)*" className="w-full p-2 rounded border font-bold" />
                        {warning && <p className="text-red-500 text-sm mt-1">{warning}</p>}
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
                        {userExpenses.filter(e => e.amount > 0).map(item => (
                            <tr key={item.id} className="border-b">
                                <td className="p-3">{item.category}</td>
                                <td className="p-3 text-left font-mono">{item.amount.toLocaleString('he-IL', {style:'currency', currency:'ILS'})}</td>
                                <td className="p-3 text-sm text-gray-600">{item.note || '-'}</td>
                            </tr>
                        ))}
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
    onShare: () => void;
    onCopyLink: () => void;
    isProcessing: boolean;
    isCopied: boolean;
    style?: React.CSSProperties;
}> = ({ isOpen, onClose, onDownload, onShare, onCopyLink, isProcessing, isCopied, style }) => {
    if (!isOpen) return null;

    const canShare = !!navigator.share;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 animate-fade-in" onClick={onClose}>
            <div 
                style={style}
                className="absolute bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl" 
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
        </div>
    )
}

const ArrowIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
);


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
  const [shareModalStyle, setShareModalStyle] = useState<React.CSSProperties>({});

  const [fuelConsumption, setFuelConsumption] = useState<string>('');
  const [carDetails, setCarDetails] = useState<{ year: string; price: string; } | null>(null);
  const FUEL_PRICE_PER_LITER = 7.5; // Approximation

  const [insuranceInputString, setInsuranceInputString] = useState('');
  const [clothingInputString, setClothingInputString] = useState('');

  const [drivingScale, setDrivingScale] = useState(5);
  
  // States for preserving modal inputs
  const [carPurchaseDetails, setCarPurchaseDetails] = useState({ model: '', adLink: '', year: new Date().getFullYear().toString(), km: '', fuelConsumption: '', hand: '', licensePlate: '', price: '', payments: 36 });
  const [rentDetails, setRentDetails] = useState({ city: '', size: '', rooms: '', floor: '', rent: '', adLink: ''});
  const [accountsAnswers, setAccountsAnswers] = useState({ people: '1', ac: 'לפעמים', shower: 'רגילות', cooking: 'מדי פעם', appliances: 'ממוצע' });
  const [entertainmentItems, setEntertainmentItems] = useState([ { id: 1, name: 'מסעדה 🍽️', price: 80, count: 0, isEditable: false, customName: '' }, { id: 2, name: 'מסיבה/סרט 🎉', price: 100, count: 0, isEditable: false, customName: '' }, { id: 3, name: 'טיול יומי 🏞️', price: 150, count: 0, isEditable: false, customName: '' }, { id: 4, name: 'הזמנת אוכל הביתה 🥡', price: 90, count: 0, isEditable: false, customName: '' }, { id: 5, name: 'אחר 🤷', price: 0, count: 0, isEditable: true, customName: '' }, ]);
  const [selectedSubscriptions, setSelectedSubscriptions] = useState<string[]>([]);
  const [maintenanceCostInput, setMaintenanceCostInput] = useState('');


  const handleOpenShareModal = () => {
    if (!selectedCharacter) return;

    if (shareButtonRef.current) {
        const rect = shareButtonRef.current.getBoundingClientRect();
        setShareModalStyle({
            position: 'absolute',
            top: `${rect.top}px`,
            left: `${rect.left + rect.width / 2}px`,
            transform: 'translate(-50%, calc(-100% - 1rem))', // Position above with 1rem gap
        });
    }

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

  const handleDownload = async () => {
    setIsProcessing(true);
    const pdf = await generatePdfDocument();
    if (pdf && selectedCharacter) {
        pdf.save(`budget-report-${selectedCharacter.name}.pdf`);
    }
    setIsProcessing(false);
    setIsShareModalOpen(false);
  };

  const handleShare = async () => {
    setIsProcessing(true);
    const pdf = await generatePdfDocument();
    if (!pdf || !selectedCharacter) {
        alert("שגיאה: יצירת ה-PDF נכשלה.");
        setIsProcessing(false);
        return;
    }

    const blob = pdf.output('blob');
    const file = new File([blob], `budget-report-${selectedCharacter.name}.pdf`, { type: 'application/pdf' });
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
        const insuranceItem = expenses.find(e => e.category === 'רכב- ביטוח');
        if (insuranceItem) {
            setInsuranceInputString(String(insuranceItem.note?.match(/(\d+,?)+/) ? insuranceItem.note.match(/(\d+,?)+/)![0].replace(/,/g, '') : ''));
        }
        const clothingItem = expenses.find(e => e.category === 'הוצאות ביגוד');
        if (clothingItem) {
            setClothingInputString(String(clothingItem.note?.match(/(\d+,?)+/) ? clothingItem.note.match(/(\d+,?)+/)![0].replace(/,/g, '') : ''));
        }
    }, [expenses]);


  const openModal = (type: string, itemId?: number) => {
    
    if (activeModal?.type) {
        setActiveModal(null);
    }

    const itemIdentifier = `${type}-${itemId || 'global'}`;
    
    const rowEl = itemId ? Object.values(rowRefs.current).find((ref): ref is HTMLElement => ref instanceof HTMLElement && ref.dataset.id === String(itemId)) : undefined;

    let positionStyle: React.CSSProperties = {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 50,
    };
    
    if (rowEl) {
        const rect = rowEl.getBoundingClientRect();
        positionStyle = {
            position: 'absolute',
            top: `${rect.top + window.scrollY}px`,
            left: `${rect.left + rect.width / 2}px`,
            transform: 'translate(-50%, -100%) translateY(-1rem)',
            zIndex: 50,
        };
    } else if (type === 'createCharacter' || type === 'addCustomExpense') {
         positionStyle = {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 50,
        };
    }
    
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
      
      const rowEl = rowRefs.current[String(itemId)];
      let positionStyle: React.CSSProperties = {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 50,
      };

       if (rowEl) {
            const rect = rowEl.getBoundingClientRect();
            positionStyle = {
                position: 'absolute',
                top: `${rect.top + window.scrollY}px`,
                left: `${rect.left + rect.width / 2}px`,
                transform: 'translate(-50%, -100%) translateY(-1rem)',
                zIndex: 50,
            };
        }
      
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

  useEffect(() => {
    if (selectedCharacter) {
        const deductions = salaryDeductions(selectedCharacter.salary, selectedCharacter.name);
        setExpenses([...initialExpenses.map(e => ({...e, amount: 0})), ...deductions]);
    } else {
        setExpenses(initialExpenses.map(e => ({...e, amount: 0})));
    }
  }, [selectedCharacter]);

  const netIncome = useMemo(() => {
    if (!selectedCharacter) return 0;
    const totalDeductions = salaryDeductions(selectedCharacter.salary, selectedCharacter.name)
        .reduce((sum, item) => sum + item.amount, 0);
    return selectedCharacter.salary - totalDeductions;
  }, [selectedCharacter]);
  
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
    setSelectedCharacter(character);
    setStep(1);
  };
  
  const handleExpenseChange = (id: number, newAmount: number) => {
    setExpenses(prev => prev.map(e => (e.id === id ? { ...e, amount: newAmount } : e)));
  };

  const handleNoteChange = (id: number, newNote: string) => {
    setExpenses(prev => prev.map(e => (e.id === id ? { ...e, note: newNote } : e)));
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


  if (step === 0) {
    return (
        <ModuleView title={title} onBack={onBack}>
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
            </div>
        </ModuleView>
    );
  }

  return (
    <ModuleView title={title} onBack={() => setStep(0)}>
      {activeModal?.type === 'unforeseen' && <UnforeseenEventModal style={modalPosition} onClose={closeModal} onResult={handleUnforeseenResult} />}
      {activeModal?.type.startsWith('carQuestionnaire') && <CarQuestionnaireModal style={modalPosition} onClose={closeModal} />}
      {activeModal?.type.startsWith('rentQuestionnaire') && <RentQuestionnaireModal style={modalPosition} onClose={closeModal} />}
      {activeModal?.type.startsWith('supermarket') && <SupermarketModal
          style={modalPosition}
          onClose={closeModal}
          onSelect={(name) => handleNoteChange(2, name)}
      />}
       {activeModal?.type.startsWith('clothingStore') && <ClothingStoreModal
          style={modalPosition}
          onClose={closeModal}
          onSelect={(name) => handleNoteChange(14, `רשת: ${name}`)}
      />}
      {activeModal?.type.startsWith('subscriptions') && <SubscriptionsModal initialSelected={selectedSubscriptions} setInitialSelected={setSelectedSubscriptions} style={modalPosition} onClose={closeModal} onSave={handleSaveSubscriptions} />}
      {activeModal?.type.startsWith('carPurchase') && <CarPurchaseModal details={carPurchaseDetails} setDetails={setCarPurchaseDetails} style={modalPosition} onClose={closeModal} onPurchaseComplete={handlePurchaseComplete} />}
      {activeModal?.type.startsWith('insurance') && <InsuranceExplanationModal style={modalPosition} onClose={closeModal} />}
      {activeModal?.type.startsWith('licenseFee') && <LicenseFeeExplanationModal style={modalPosition} onClose={closeModal} />}
      {activeModal?.type.startsWith('fuelCost') && <FuelCostExplanationModal style={modalPosition} onClose={closeModal} />}
      {activeModal?.type.startsWith('maintenanceCalculator') && <CarMaintenanceCalculatorModal cost={maintenanceCostInput} setCost={setMaintenanceCostInput} style={modalPosition} onClose={closeModal} onSave={handleSaveMaintenance} drivingScale={drivingScale} setDrivingScale={setDrivingScale} />}
      {activeModal?.type.startsWith('maintenanceExplanation') && <CarMaintenanceExplanationModal style={modalPosition} onClose={closeModal} />}
      {activeModal?.type.startsWith('entertainmentSimulator') && <EntertainmentSimulatorModal items={entertainmentItems} setItems={setEntertainmentItems} style={modalPosition} onClose={closeModal} onSave={(total, note) => updateBudgetFromModal('בילויים ומסעדות', total, note)} />}
      {activeModal?.type.startsWith('accountsCalculator') && <AccountsCalculatorModal answers={accountsAnswers} setAnswers={setAccountsAnswers} style={modalPosition} onClose={closeModal} onSave={handleSaveAccounts} />}
      {activeModal?.type === 'createCharacter' && <CreateCharacterModal onClose={closeModal} onCreate={(char) => handleSelectCharacter(char)} />}
      {activeModal?.type === 'explanation' && activeModal.content && <ExplanationModal style={modalPosition} title={activeModal.content.title} content={activeModal.content.content} onClose={closeModal} />}
      {activeModal?.type.startsWith('rentPurchase') && <RentPurchaseModal 
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
     {activeModal?.type === 'addCustomExpense' && <AddCustomExpenseModal onClose={closeModal} onAdd={handleAddCustomExpense} style={modalPosition} />}
     {reportDataForPdf && (
        <div ref={reportRef} style={{ position: 'absolute', left: '-9999px', top: 0, zIndex: -1 }}>
            <SummaryReportForPdf {...reportDataForPdf} />
        </div>
     )}
     <ShareReportModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onDownload={handleDownload}
        onShare={handleShare}
        onCopyLink={handleCopyLink}
        isProcessing={isProcessing}
        isCopied={isCopied}
        style={shareModalStyle}
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
                <h4 className="font-bold text-[2.5rem] mb-3 text-brand-teal">איך מנהלים את התקציב?</h4>
                <ol className="list-decimal list-inside space-y-3 text-[1.4rem] text-brand-dark-blue/90">
                    <li>
                        <strong>חקרו כל סעיף:</strong> עברו על כל קטגוריה. לחצו על אייקון המידע
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 inline-block mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        כדי ללמוד על חשיבותו.
                    </li>
                    <li>
                        <strong>בצעו את המשימות:</strong> בכל סעיף יש משימה. השתמשו בכפתורים לפי הסדר (מימין לשמאל) כדי להשלים אותה.
                         <div className="mt-2 p-4 bg-white/40 rounded-lg text-lg space-y-3 border border-gray-200 shadow-inner">
                            <div className="flex items-center gap-3">
                                <span className="text-lg bg-[#1b2550] text-white py-1 px-3 rounded-full">משימה</span>
                                <span>- משימה לביצוע בסעיף</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-lg bg-[#01b2cf] text-black py-1 px-3 rounded-full">כלי עזר</span>
                                <span>- כלי עזר ופעולות (מחשבון/שאלון/בחירה/רכישה)</span>
                            </div>
                             <div className="flex items-center gap-3">
                                <span className="text-lg bg-brand-teal text-black py-1 px-3 rounded-full">קישור לאתר</span>
                                <span>- קישור לאתר חיצוני</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-lg bg-brand-magenta text-black py-1 px-3 rounded-full">סרטון</span>
                                <span>- צפייה בסרטון</span>
                            </div>
                        </div>
                    </li>
                    <li><strong>הזינו את התוצאות:</strong> לאחר כל משימה, הסכום החודשי וההערות יתעדכנו. ודאו שהכל נכון.</li>
                    <li><strong>נתחו את התקציב:</strong> בסיום, בחנו את תרשים העוגה ואת מאזן ההוצאות מול ההכנסות כדי להבין לאן הכסף שלכם הולך.</li>
                    <li><strong>הפיקו דו"ח:</strong> לחצו על "הפק דו"ח סיכום" כדי לקבל מסמך מסודר של התקציב שבניתם, אותו תוכלו לשמור או לשתף.</li>
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
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-3xl">{item.category}</span>
                                {categoryExplanations[item.category] && (
                                    <Tooltip 
                                        title={categoryExplanations[item.category].title}
                                        content={categoryExplanations[item.category].content}
                                    />
                                )}
                            </div>
                            <div className="relative flex-shrink-0">
                                {item.category === 'רכב- ביטוח' ? (
                                    <input 
                                        type="number" 
                                        placeholder="הזן סכום שנתי"
                                        value={insuranceInputString} 
                                        onChange={(e) => setInsuranceInputString(e.target.value)}
                                        onBlur={() => {
                                            const annual = parseFloat(insuranceInputString) || 0;
                                            const monthly = annual / 12;
                                            handleExpenseChange(item.id, Math.round(monthly));
                                            const currentNote = expenses.find(e => e.id === item.id)?.note || '';
                                            const noteWithoutAmount = currentNote.replace(/עלות שנתית: [\d,]+ ₪/g, '').trim();
                                            if (annual > 0) {
                                                handleNoteChange(item.id, `${noteWithoutAmount} עלות שנתית: ${annual.toLocaleString()} ₪`.trim());
                                            } else {
                                                handleNoteChange(item.id, noteWithoutAmount);
                                            }
                                        }}
                                        className={`w-48 text-left py-2 pr-2 pl-12 rounded-lg border-2 shadow-inner bg-white transition-all focus:border-brand-teal focus:ring-1 focus:ring-brand-teal text-base`}
                                    />
                                ) : item.category === 'הוצאות ביגוד' ? (
                                    <input 
                                        type="number" 
                                        placeholder="הזן סכום שנתי"
                                        value={clothingInputString} 
                                        onChange={(e) => setClothingInputString(e.target.value)}
                                        onBlur={() => {
                                            const annual = parseFloat(clothingInputString) || 0;
                                            const monthly = annual / 12;
                                            handleExpenseChange(item.id, Math.round(monthly));
                                            const currentNote = expenses.find(e => e.id === item.id)?.note || '';
                                            const noteWithoutAmount = currentNote.replace(/עלות שנתית: [\d,]+ ₪/g, '').trim();
                                            if (annual > 0) {
                                                handleNoteChange(item.id, `${noteWithoutAmount} עלות שנתית: ${annual.toLocaleString()} ₪`.trim());
                                            } else {
                                                handleNoteChange(item.id, noteWithoutAmount);
                                            }
                                        }}
                                        className={`w-48 text-left py-2 pr-2 pl-12 rounded-lg border-2 shadow-inner bg-white transition-all focus:border-brand-teal focus:ring-1 focus:ring-brand-teal text-base`}
                                    />
                                ) : (
                                    <input 
                                        type="number" 
                                        value={item.amount || ''} 
                                        onChange={(e) => handleExpenseChange(item.id, parseFloat(e.target.value) || 0)}
                                        readOnly={['חסכון והשקעות', 'רכב- דלק', 'מנויים', 'רכב- אגרות', 'רכב - טיפולים', 'בילויים ומסעדות', 'חשבונות', 'שכירות', 'רכב - קנייה'].includes(item.category)}
                                        className={`w-36 text-left py-2 pr-2 pl-12 rounded-lg border-2 shadow-inner bg-slate-50 transition-all focus:border-brand-teal focus:ring-1 focus:ring-brand-teal text-base ${
                                        ['חסכון והשקעות', 'רכב- דלק', 'מנויים', 'רכב- אגרות', 'רכב - טיפולים', 'בילויים ומסעדות', 'חשבונות', 'שכירות', 'רכב - קנייה'].includes(item.category) 
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
                               {item.task && ( <button onClick={() => openExplanationModal(item.id, 'משימה', item.task!)} className="text-base bg-[#1b2550] text-white py-1 px-3 rounded-full hover:bg-blue-900">משימה</button> )}
                                {item.category === 'שכירות' && ( <> <ArrowIcon className="w-5 h-5 text-gray-400" /> <button onClick={() => openModal('rentQuestionnaire', item.id)} className="text-base bg-[#01b2cf] text-black py-1 px-3 rounded-full hover:bg-cyan-500">שאלון ההכוונה</button> <ArrowIcon className="w-5 h-5 text-gray-400" /> <a href={categoryLinks[item.category]} target="_blank" rel="noopener noreferrer" className="text-base bg-brand-teal text-black py-1 px-3 rounded-full hover:bg-teal-500">קישור לאתר</a> <ArrowIcon className="w-5 h-5 text-gray-400" /> <button onClick={() => openModal('rentPurchase', item.id)} className="text-base bg-[#01b2cf] text-black py-1 px-3 rounded-full hover:bg-cyan-500">מלאו את פרטי הדירה</button> </> )}
                                {item.category === 'קניות בסופר' && ( <> <ArrowIcon className="w-5 h-5 text-gray-400" /> <button onClick={() => openModal('supermarket', item.id)} className="text-base bg-[#01b2cf] text-black py-1 px-3 rounded-full hover:bg-cyan-500">ביחרו רשת</button> </> )}
                                {item.category === 'חשבונות' && ( <> <ArrowIcon className="w-5 h-5 text-gray-400" /> <button onClick={() => openModal('accountsCalculator', item.id)} className="text-base bg-[#01b2cf] text-black py-1 px-3 rounded-full hover:bg-cyan-500">מחשבון</button> </> )}
                                {item.category === 'בילויים ומסעדות' && ( <> <ArrowIcon className="w-5 h-5 text-gray-400" /> <button onClick={() => openModal('entertainmentSimulator', item.id)} className="text-base bg-[#01b2cf] text-black py-1 px-3 rounded-full hover:bg-cyan-500">מחשבון</button> </> )}
                                {item.category === 'בלת"מים' && ( <> <ArrowIcon className="w-5 h-5 text-gray-400" /> <button onClick={() => openModal('unforeseen', item.id)} className="text-base bg-[#01b2cf] text-black py-1 px-3 rounded-full hover:bg-cyan-500">בחירה</button> </> )}
                                {item.category === 'מנויים' && ( <> <ArrowIcon className="w-5 h-5 text-gray-400" /> <button onClick={() => openModal('subscriptions', item.id)} className="text-base bg-[#01b2cf] text-black py-1 px-3 rounded-full hover:bg-cyan-500">בחירה</button> </> )}
                                {item.category === 'רכב - קנייה' && ( <> <ArrowIcon className="w-5 h-5 text-gray-400" /> <button onClick={() => openModal('carQuestionnaire', item.id)} className="text-base bg-[#01b2cf] text-black py-1 px-3 rounded-full hover:bg-cyan-500">שאלון הכוונה</button> <ArrowIcon className="w-5 h-5 text-gray-400" /> <a href={categoryLinks[item.category]} target="_blank" rel="noopener noreferrer" className="text-base bg-brand-teal text-black py-1 px-3 rounded-full hover:bg-teal-500">קישור לאתר</a> <ArrowIcon className="w-5 h-5 text-gray-400" /> <button onClick={() => openModal('carPurchase', item.id)} className="text-base bg-[#01b2cf] text-black py-1 px-3 rounded-full hover:bg-cyan-500">ביצוע הרכישה</button> </> )}
                                {item.category === 'רכב- ביטוח' && ( <> <ArrowIcon className="w-5 h-5 text-gray-400" /> <a href={categoryLinks[item.category]} target="_blank" rel="noopener noreferrer" className="text-base bg-brand-teal text-black py-1 px-3 rounded-full hover:bg-teal-500">קישור לאתר</a> <ArrowIcon className="w-5 h-5 text-gray-400" /> <a href="https://docs.google.com/presentation/d/1N_xUNS_ZQZW4VfumLDKk_dav53gvULiqjxjZ4NDj3fo/edit?usp=sharing" target="_blank" rel="noopener noreferrer" className="text-base bg-[#01b2cf] text-black py-1 px-3 rounded-full hover:bg-cyan-500">הנחיות למילוי</a> </> )}
                                {item.category === 'רכב- אגרות' && <></>}
                                {item.category === 'רכב- דלק' && <></>}
                                {item.category === 'רכב - טיפולים' && ( <> <ArrowIcon className="w-5 h-5 text-gray-400" /> <button onClick={() => openModal('maintenanceCalculator', item.id)} className="text-base bg-[#01b2cf] text-black py-1 px-3 rounded-full hover:bg-cyan-500">מחשבון</button> </> )}
                                {item.category === 'הוצאות ביגוד' && ( <> <ArrowIcon className="w-5 h-5 text-gray-400" /> <button onClick={() => openModal('clothingStore', item.id)} className="text-base bg-[#01b2cf] text-black py-1 px-3 rounded-full hover:bg-cyan-500">ביחרו רשת</button> </> )}
                                {categoryLinks[item.category] && !['רכב - קנייה', 'רכב- ביטוח', 'שכירות'].includes(item.category) && <a href={categoryLinks[item.category]} target="_blank" rel="noopener noreferrer" className="text-base bg-brand-teal text-black py-1 px-3 rounded-full hover:bg-teal-500">קישור לאתר</a>}
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
                  <button 
                    onClick={() => openModal('addCustomExpense')}
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
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <span className="font-bold text-3xl text-gray-700">{item.category}</span>
                           <Tooltip title={item.category} content={termExplanations[item.category] || 'הסבר בקרוב...'} />
                            {item.category === 'מס הכנסה' && (
                                <>
                                    <a href="https://youtu.be/s2KRKDfVxMQ" target="_blank" rel="noopener noreferrer" className="text-base bg-brand-magenta text-black py-1 px-3 rounded-full hover:bg-pink-700">
                                        סרטון
                                    </a>
                                    <ArrowIcon className="w-5 h-5 text-gray-400" />
                                    <a href={categoryLinks[item.category]} target="_blank" rel="noopener noreferrer" className="text-base bg-brand-teal text-black py-1 px-3 rounded-full hover:bg-teal-500">
                                        קישור לאתר
                                    </a>
                                </>
                            )}
                            {item.category === 'ביטוח לאומי' && (
                                <>
                                    <a href="https://youtu.be/QcPnUSlNffs" target="_blank" rel="noopener noreferrer" className="text-base bg-brand-magenta text-black py-1 px-3 rounded-full hover:bg-pink-700">
                                        סרטון
                                    </a>
                                    <ArrowIcon className="w-5 h-5 text-gray-400" />
                                    <a href={categoryLinks[item.category]} target="_blank" rel="noopener noreferrer" className="text-base bg-brand-teal text-black py-1 px-3 rounded-full hover:bg-teal-500">
                                        קישור לאתר
                                    </a>
                                </>
                            )}
                            {item.category === 'מס בריאות' && (
                                <>
                                    <a href="https://youtu.be/QcPnUSlNffs" target="_blank" rel="noopener noreferrer" className="text-base bg-brand-magenta text-black py-1 px-3 rounded-full hover:bg-pink-700">
                                        סרטון
                                    </a>
                                    <ArrowIcon className="w-5 h-5 text-gray-400" />
                                    <a href={categoryLinks[item.category]} target="_blank" rel="noopener noreferrer" className="text-base bg-brand-teal text-black py-1 px-3 rounded-full hover:bg-teal-500">
                                        קישור לאתר
                                    </a>
                                </>
                            )}
                            {item.category === 'הפרשה לפנסיה' && (
                                <a href="https://youtu.be/9g3CmmzXQlM" target="_blank" rel="noopener noreferrer" className="text-base bg-brand-magenta text-black py-1 px-3 rounded-full hover:bg-pink-700">
                                        סרטון
                                </a>
                            )}
                        </div>
                        <div className="relative">
                            <input
                              type="number"
                              value={item.amount}
                              readOnly
                              className="w-36 text-left py-2 pr-2 pl-12 rounded-lg border-2 border-gray-300 bg-gray-200 cursor-not-allowed shadow-inner text-base"
                            />
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-base">ש"ח</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  </div>
                </div>
              )}
        </div>
        
        {/* Bottom Section: Analysis + AI Feedback */}
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
                            <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label={({ name, percent }) => `${((Number(percent) || 0) * 100).toFixed(0)}%`}>
                                {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                            <RechartsTooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="bg-white/50 backdrop-blur-md border border-white/30 p-6 rounded-2xl flex flex-col items-center justify-center">
                <h3 className="text-center font-bold text-2xl mb-4">סיימתם לבנות את התקציב!</h3>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-40 h-40 my-2 text-brand-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-center mb-4">כל הכבוד על השלמת המשימה. עכשיו תוכלו לשתף את דו"ח התקציב המסודר שהכנתם.</p>
                <button 
                    ref={shareButtonRef}
                    onClick={handleOpenShareModal}
                    disabled={!areAllExpensesFilled}
                    title={!areAllExpensesFilled ? 'מלאו את סעיפי ההוצאות' : 'הפק דו"ח סיכום'}
                    className="w-full bg-brand-magenta hover:bg-pink-700 text-white font-bold py-4 px-4 rounded-xl transition-all transform hover:scale-105 text-3xl shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {areAllExpensesFilled ? 'הפק דו"ח סיכום' : 'מלאו את סעיפי ההוצאות'}
                </button>
            </div>
        </div>
      </div>
    </ModuleView>
  );
};

export default BudgetModule;