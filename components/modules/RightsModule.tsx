import React, { useState, useEffect } from 'react';
import ModuleView from '../ModuleView';
import { TrophyIcon } from '../icons/Icons';

interface RightsModuleProps {
  onBack: () => void;
  title: string;
  onComplete: () => void;
}

// --- Icons for Chapters ---
const FileTextIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>);
const ScaleIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>);
const LogOutIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>);
const ShieldCheckIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>);
const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
const XCircleIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);


const steps = [
  { title: "קבלה לעבודה", icon: FileTextIcon },
  { title: "זכויות בעבודה", icon: ScaleIcon },
  { title: "סיום העסקה", icon: LogOutIcon },
  { title: "מגני הזכויות", icon: ShieldCheckIcon },
];

// --- Chapter 1: Getting Hired ---
const GettingHiredChapter: React.FC = () => (
    <div className="space-y-8 animate-fade-in">
        <div className="bg-white/50 p-6 rounded-2xl shadow-lg border border-white/40">
            <h4 className="font-bold text-4xl text-brand-light-blue mb-4">📜 חתימה על חוזה וטפסים</h4>
            <p className="text-2xl mb-4">התקבלתם לעבודה? מזל טוב! לפני שמתחילים, יש כמה דברים חשובים:</p>
            <ul className="space-y-3 list-disc list-inside text-2xl">
                <li><strong>הודעה על תנאי העסקה:</strong> המעסיק חייב למסור לכם תוך 30 יום מסמך המפרט את תנאי העבודה שלכם, כולל תפקיד, שכר, שעות עבודה ותנאים סוציאליים. <strong>זוהי זכותכם המלאה!</strong></li>
                <li><strong>טופס 101:</strong> זהו טופס של רשות המסים שחובה למלא בתחילת כל עבודה. הוא משמש לחישוב מס ההכנסה שלכם וכולל פרטים אישיים ובקשות להקלות מס (כמו נקודות זיכוי).</li>
            </ul>
             <div className="mt-4 p-3 bg-yellow-100/70 border-r-4 border-yellow-500 text-yellow-900 text-2xl">
                <strong>חשוב לזכור:</strong> חוקים וטפסים עשויים להשתנות. למידע העדכני והמדויק ביותר, מומלץ תמיד לבדוק באתרים רשמיים כמו <a href="https://www.gov.il/he/departments/israel_tax_authority" target="_blank" rel="noopener noreferrer" className="font-bold underline">רשות המסים</a> ו<a href="https://www.kolzchut.org.il/" target="_blank" rel="noopener noreferrer" className="font-bold underline">כל-זכות</a>.
            </div>
        </div>
        <div className="bg-white/50 p-6 rounded-2xl shadow-lg border border-white/40">
            <h4 className="font-bold text-4xl text-brand-light-blue mb-4">💼 טיפים לראיון עבודה מוצלח</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-100/60 p-4 rounded-xl border-l-4 border-green-500">
                    <h5 className="font-bold text-[2rem] leading-tight text-green-800">👍 מה כן לעשות:</h5>
                    <ul className="list-disc list-inside mt-2 text-[1.6rem] leading-relaxed">
                        <li>הגיעו בזמן</li>
                        <li>התלבשו בצורה מכובדת</li>
                        <li>למדו קצת על מקום העבודה מראש</li>
                        <li>הכינו שאלות לשאול את המראיין</li>
                    </ul>
                </div>
                <div className="bg-red-100/60 p-4 rounded-xl border-l-4 border-red-500">
                    <h5 className="font-bold text-[2rem] leading-tight text-red-800">👎 מה לא לעשות:</h5>
                    <ul className="list-disc list-inside mt-2 text-[1.6rem] leading-relaxed">
                        <li>לדבר לא יפה על מעסיקים קודמים</li>
                        <li>לשחק בטלפון במהלך הראיון</li>
                        <li>לא להראות התלהבות או עניין</li>
                        <li>לשאול רק על כסף בתחילת הראיון</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
);

// --- Chapter 2: Workplace Rights ---
const WorkplaceRightsChapter: React.FC = () => {
    const rights = [
        { title: 'שכר מינימום', content: 'החוק קובע שכר מינימום שאסור לשלם פחות ממנו. השכר משתנה לפי גיל (לנוער) ומתעדכן מעת לעת.' },
        { title: 'שעות נוספות', content: 'עבור השעתיים הנוספות הראשונות ביום, זכאים ל-125% מהשכר. מהשעה השלישית ואילך, זכאים ל-150%.' },
        { title: 'ימי מחלה', content: 'על היום הראשון לא מקבלים תשלום. על היום השני והשלישי מקבלים 50%, ומהיום הרביעי 100%.' },
        { title: 'החזר נסיעות', content: 'המעסיק חייב להשתתף בהוצאות הנסיעה לעבודה, עד לתקרה יומית הקבועה בחוק.' },
        { title: 'ימי חופשה', content: 'כל עובד צובר ימי חופשה בתשלום בהתאם לוותק שלו. אסור למעסיק "למחוק" ימי חופשה שלא נוצלו.' },
        { title: 'דמי הבראה', content: 'לאחר השלמת שנת עבודה מלאה, כל עובד זכאי לתשלום דמי הבראה פעם בשנה.' },
        { title: 'הפסקות', content: 'ביום עבודה של 6 שעות ומעלה, זכאים להפסקה של 45 דקות (לרוב לא בתשלום).' },
        { title: 'פנסיה', content: 'המעסיק חייב להפריש עבורכם כסף לחיסכון פנסיוני. חלק מההפרשה יורד מהשכר שלכם וחלק המעסיק מוסיף.' },
    ];
    return (
        <div className="space-y-4 animate-fade-in">
            <div className="p-4 bg-yellow-100/80 border-t-4 border-yellow-500 text-yellow-900 rounded-b-lg shadow-md text-2xl">
                <strong>⚠️ סייג חשוב:</strong> המידע המוצג כאן הוא כללי ומיועד להכרות ראשונית בלבד. דיני העבודה בישראל מורכבים ומתעדכנים. למידע המלא והמדויק ביותר, יש לפנות לאתר <a href="https://www.kolzchut.org.il/he/%D7%96%D7%9B%D7%95%D7%99%D7%95%D7%AA_%D7%A2%D7%95%D7%91%D7%93%D7%99%D7%9D" target="_blank" rel="noopener noreferrer" className="font-bold underline">"כל זכות"</a>.
            </div>
            {rights.map(right => (
                <details key={right.title} className="bg-white/60 p-4 rounded-xl shadow-md cursor-pointer group">
                    <summary className="font-bold text-4xl flex justify-between items-center text-brand-dark-blue">
                        {right.title}
                        <span className="transform transition-transform duration-300 group-open:rotate-90">▶</span>
                    </summary>
                    <p className="mt-2 text-[1.75rem] leading-relaxed text-brand-dark-blue/90">{right.content}</p>
                </details>
            ))}
        </div>
    );
};

// --- Chapter 3: Ending Employment ---
const EndingEmploymentChapter: React.FC = () => (
    <div className="space-y-8 animate-fade-in">
        <div className="bg-white/50 p-6 rounded-2xl shadow-lg border border-white/40">
            <h4 className="font-bold text-4xl text-brand-light-blue mb-3">התפטרות ופיטורים</h4>
            <p className="text-[1.75rem] mb-4">בין אם בחרתם לעזוב ובין אם המעסיק החליט לסיים את עבודתכם, ישנם כללים חשובים:</p>
            <ul className="space-y-4 list-disc list-inside text-[1.75rem]">
                <li><strong>הודעה מוקדמת:</strong> שני הצדדים (עובד ומעסיק) חייבים לתת הודעה בכתב לפני סיום העסקה. משך הזמן תלוי בוותק. לדוגמה, עובד בשנה הראשונה צריך לתת יום הודעה על כל חודש עבודה.</li>
                <li><strong>שימוע לפני פיטורים:</strong> למעסיק אסור לפטר עובד בלי לערוך לו שימוע. בשימוע, המעסיק מציג את הסיבות לפיטורים והעובד מקבל הזדמנות להגיב ולהשמיע את טענותיו.</li>
                <li><strong>פיצויי פיטורים:</strong> עובד שפוטר לאחר שהשלים שנת עבודה מלאה, זכאי בדרך כלל לפיצויי פיטורים (משכורת חודש אחד עבור כל שנת עבודה). ישנם מקרים מסוימים בהם גם עובד שהתפטר זכאי לפיצויים.</li>
            </ul>
        </div>
        <div className="p-4 bg-red-100/80 border-t-4 border-red-500 text-red-900 rounded-b-lg shadow-md text-2xl">
            <strong>⚠️ לתשומת לבכם:</strong> נושא סיום העסקה הוא מורכב במיוחד. המידע כאן הוא בסיסי בלבד ואינו מהווה תחליף לייעוץ משפטי. במקרה של ספק, חשוב מאוד להתייעץ עם גורם מקצועי או לפנות למקורות מידע מהימנים.
        </div>
    </div>
);


// --- Chapter 4: Rights Defenders Game ---
interface Dilemma {
  id: number;
  title: string;
  character: { name: string; avatar: string; };
  story: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  image: string;
}

const dilemmas: Dilemma[] = [
    { id: 1, title: 'שעות נוספות', character: { name: 'דנה', avatar: '👩‍🍳' }, story: 'עבדתי בפיצרייה והמשמרת שלי הייתה אמורה להסתיים ב-22:00. הבוס ביקש שאישאר עד 23:30 בגלל לחץ. כשקיבלתי את המשכורת, ראיתי ששילמו לי שכר רגיל על כל השעות.', question: 'האם דנה הייתה צריכה לקבל תשלום נוסף?', options: ['לא, מכיוון שהיא הסכימה להישאר.', 'כן, 125% על השעה וחצי הנוספות.', 'כן, תוספת של 100 ש"ח כפיצוי.', 'כן, תשלום רגיל ויום חופש נוסף.'], answer: 'כן, 125% על השעה וחצי הנוספות.', explanation: 'על פי החוק, עבור השעתיים הנוספות הראשונות ביום עבודה יש לשלם 125% מהשכר הרגיל. על כל שעה נוספת לאחר מכן יש לשלם 150%.', image: 'https://images.pexels.com/photos/2271107/pexels-photo-2271107.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { id: 2, title: 'ימי מחלה', character: { name: 'יוני', avatar: '🤒' }, story: 'הרגשתי ממש לא טוב והודעתי למנהל בבית הקפה שלא אגיע. הוא אמר שאין בעיה, אבל שהיום הזה ירד לי מימי החופשה השנתיים.', question: 'האם המנהל פעל כשורה?', options: ['כן, יום מחלה ראשון תמיד יורד מהחופשה.', 'לא, יום מחלה משולם בנפרד (מהיום השני) ואסור להורידו מהחופשה.', 'לא, הוא היה צריך להביא אישור רופא באותו היום.', 'כן, אבל הוא צריך לשלם לו חצי יום חופשה בלבד.'], answer: 'לא, יום מחלה משולם בנפרד (מהיום השני) ואסור להורידו מהחופשה.', explanation: 'ימי מחלה וימי חופשה הם שני דברים נפרדים. על היום הראשון למחלה לא מקבלים תשלום, על השני והשלישי 50%, ומהרביעי 100%. אסור למעסיק להוריד ימי מחלה מימי החופשה.', image: 'https://images.pexels.com/photos/4167544/pexels-photo-4167544.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { id: 3, title: 'החזר נסיעות', character: { name: 'מאיה', avatar: '🚌' }, story: 'אני גרה ברעננה ועובדת בחנות בתל אביב, ונוסעת כל יום באוטובוס. בסוף החודש גיליתי שהמעסיק לא הוסיף לי כסף עבור הנסיעות.', question: 'האם המעסיק היה חייב לשלם לה על הנסיעות?', options: ['לא, נסיעות הן הטבה שהמעסיק יכול לבחור אם לתת.', 'כן, הוא חייב לשלם החזר נסיעות עד לתקרה בחוק.', 'כן, אבל רק אם היא מגיעה ברכב פרטי.', 'כן, הוא צריך לשלם את מלוא עלות הנסיעה, ללא תקרה.'], answer: 'כן, הוא חייב לשלם החזר נסיעות עד לתקרה בחוק.', explanation: 'כל עובד זכאי להחזר הוצאות נסיעה. הסכום מחושב לפי עלות כרטיסייה או "חופשי חודשי" מוזל, ועד לתקרה יומית הקבועה בחוק.', image: 'https://images.pexels.com/photos/1601042/pexels-photo-1601042.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { id: 4, title: 'תלוש שכר', character: { name: 'איתי', avatar: '✉️' }, story: 'אני עובד כבר חודשיים בחנות נוחות. בסוף כל חודש, הבעלים נותן לי מזומן במעטפה ואומר "זה השכר שלך", בלי שום מסמך.', question: 'האם המעסיק פועל כשורה?', options: ['כן, תשלום במזומן הוא חוקי ואין צורך במסמכים.', 'לא, המעסיק חייב למסור תלוש שכר מפורט.', 'זה חוקי רק אם אני עובד זמני.', 'כן, כל עוד הוא מנהל רישום פנימי.'], answer: 'לא, המעסיק חייב למסור תלוש שכר מפורט.', explanation: 'המעסיק מחויב על פי חוק למסור לעובד תלוש שכר מפורט עד היום התשיעי של החודש העוקב. התלוש הוא הוכחה לתשלום ומפרט את כל רכיבי השכר והניכויים.', image: 'https://images.pexels.com/photos/4386433/pexels-photo-4386433.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { id: 5, title: 'ניכויים אסורים', character: { name: 'נועה', avatar: '🍽️' }, story: 'במהלך משמרת במסעדה, הפלתי בטעות מגש עם שתי צלחות שנשברו. המנהל כעס ואמר שינכה לי 100 ש"ח מהמשכורת על הנזק.', question: 'האם מותר למנהל לנכות לה כסף מהשכר?', options: ['כן, עובד אחראי על כל נזק במשמרת שלו.', 'לא, אסור לנכות שכר על נזק שנגרם בטעות בעבודה.', 'מותר, אבל רק אם הנזק עולה על 200 ש"ח.', 'מותר, אבל רק אם היא הסכימה בכתב.'], answer: 'לא, אסור לנכות שכר על נזק שנגרם בטעות בעבודה.', explanation: 'ככלל, אסור למעסיק לנכות משכר העובד פיצוי על נזקים שנגרמו במסגרת העבודה הרגילה, אלא אם מדובר בנזק שנגרם בזדון או ברשלנות חמורה.', image: 'https://images.pexels.com/photos/1075841/pexels-photo-1075841.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { id: 6, title: 'דמי הבראה', character: { name: 'רון', avatar: '🏖️' }, story: 'אני עובד באולם אירועים כבר שנה וחצי. שמעתי מחברים על "דמי הבראה" אבל אף פעם לא ראיתי סעיף כזה בתלוש שלי.', question: 'האם רון זכאי לדמי הבראה?', options: ['לא, דמי הבראה מקבלים רק עובדי מדינה.', 'כן, כל עובד שהשלים שנת עבודה זכאי לדמי הבראה.', 'כן, אבל רק אם יצא לחופשה בפועל באותה שנה.', 'לא, זה תלוי ברצון הטוב של המעסיק.'], answer: 'כן, כל עובד שהשלים שנת עבודה זכאי לדמי הבראה.', explanation: 'כל עובד שהשלים שנת עבודה מלאה אצל אותו מעסיק זכאי לדמי הבראה. מספר ימי ההבראה עולה בהתאם לוותק של העובד במקום העבודה.', image: 'https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { id: 7, title: 'תאונת עבודה', character: { name: 'עמית', avatar: '🩹' }, story: 'בזמן שניקיתי את המטבח במסעדה, החלקתי על רצפה רטובה ושברתי את היד. הטיפול הרפואי עלה כסף ואני גם לא יכול לעבוד חודש.', question: 'מי צריך לכסות את הנזק?', options: ['עמית, זו אחריותו האישית להיזהר.', 'המעסיק, הוא צריך לשלם משכורת מלאה ופיצויים.', 'ביטוח לאומי, שמכסה את הטיפול ואובדן ההכנסה.', 'קופת החולים, כי זו פגיעה רפואית.'], answer: 'ביטוח לאומי, שמכסה את הטיפול ואובדן ההכנסה.', explanation: 'פגיעה שנגרמה תוך כדי ועקב העבודה נחשבת לתאונת עבודה. במקרה כזה, המוסד לביטוח לאומי מכסה את עלויות הטיפול הרפואי ומשלם "דמי פגיעה" כתחליף לשכר.', image: 'https://images.pexels.com/photos/6029323/pexels-photo-6029323.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { id: 8, title: 'הפסקות', character: { name: 'שירה', avatar: '⏳' }, story: 'אני עובדת משמרת של 7 שעות בחנות. המנהלת אומרת שאין זמן להפסקה אמיתית לאכול כי החנות עמוסה.', question: 'האם שירה זכאית להפסקה?', options: ['לא, אם החנות עמוסה אין חובת הפסקה.', 'כן, בעבודה של 6 שעות ומעלה, היא זכאית ל-45 דקות הפסקה.', 'כן, היא זכאית להפסקה רק אם היא עובדת 8 שעות מלאות.', 'כן, אבל על חשבון הזמן הפנוי שלה אחרי העבודה.'], answer: 'כן, בעבודה של 6 שעות ומעלה, היא זכאית ל-45 דקות הפסקה.', explanation: 'עובד המועסק 6 שעות או יותר זכאי להפסקה של 45 דקות, מתוכה חצי שעה רצופה. בדרך כלל ההפסקה אינה בתשלום, אלא אם הוסכם אחרת.', image: 'https://images.pexels.com/photos/3951901/pexels-photo-3951901.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { id: 9, title: 'שכר מינימום לנוער', character: { name: 'עומר', avatar: '👦' }, story: 'אני בן 16 והתחלתי לעבוד בגלידרייה. הבעלים הציע לי 22 ש"ח לשעה כי "אני צעיר ובלי ניסיון".', question: 'האם השכר שהוצע לעומר חוקי?', options: ['כן, המעסיק קובע את השכר לפי הניסיון.', 'לא, אסור לשלם פחות משכר המינימום לנוער, המותאם לגיל.', 'כן, זה שכר סביר לעבודה ראשונה.', 'לא, אבל מותר אם הוא הסכים לכך בכתב.'], answer: 'לא, אסור לשלם פחות משכר המינימום לנוער, המותאם לגיל.', explanation: 'קיים שכר מינימום מיוחד לנוער, והוא מותאם לגיל. אסור למעסיק לשלם פחות מהסכום הקבוע בחוק!', image: 'https://images.pexels.com/photos/1352270/pexels-photo-1352270.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { id: 10, title: 'הודעה מוקדמת', character: { name: 'גיא', avatar: '👋' }, story: 'אחרי שלושה חודשים, החלטתי לעזוב את עבודתי כשליח. הודעתי לבוס שאני לא מגיע יותר מהיום.', question: 'האם גיא פעל כשורה?', options: ['כן, כל עוד הוא מודיע על כך בטלפון.', 'לא, הוא חייב לתת הודעה מוקדמת בכתב.', 'לא, הוא חייב להישאר עד שימצאו לו מחליף.', 'כן, כי הוא עבד רק שלושה חודשים.'], answer: 'לא, הוא חייב לתת הודעה מוקדמת בכתב.', explanation: 'כשעובד רוצה להתפטר או כשמעסיק רוצה לפטר, שני הצדדים מחויבים לתת "הודעה מוקדמת" בכתב. משך הזמן תלוי בוותק. בשלושת החודשים הראשונים, נדרש יום הודעה על כל חודש עבודה.', image: 'https://images.pexels.com/photos/7869680/pexels-photo-7869680.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' }
].sort(() => Math.random() - 0.5); // Shuffle dilemmas


const RightsDefendersGame: React.FC<{ onGameComplete: () => void }> = ({ onGameComplete }) => {
    const [currentDilemmaIndex, setCurrentDilemmaIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, { selected: string; isCorrect: boolean }>>({});
    const [gameState, setGameState] = useState<'playing' | 'finished'>('playing');

    const currentDilemma = dilemmas[currentDilemmaIndex];
    const selectedAnswer = answers[currentDilemma.id.toString()]?.selected;
    // FIX: Cast Object.values to provide an explicit type for 'a', resolving a TS error where it was inferred as 'unknown'.
    const score = (Object.values(answers) as { isCorrect: boolean }[]).filter(a => a.isCorrect).length;

    useEffect(() => {
        if (gameState === 'finished' && score >= 8) {
            onGameComplete();
        }
    }, [gameState, score, onGameComplete]);

    const handleAnswerSelect = (option: string) => {
        if (selectedAnswer) return;
        const isCorrect = option === currentDilemma.answer;
        setAnswers(prev => ({ ...prev, [currentDilemma.id.toString()]: { selected: option, isCorrect } }));
    };

    const handleNext = () => {
        if (currentDilemmaIndex < dilemmas.length - 1) {
            setCurrentDilemmaIndex(prev => prev + 1);
        } else {
            setGameState('finished');
        }
    };

    const handleRestart = () => {
        setCurrentDilemmaIndex(0);
        setAnswers({});
        setGameState('playing');
    };

    if (gameState === 'finished') {
        const isCompleted = score >= 8;
        return (
            <div className="text-center bg-white/60 p-8 rounded-3xl animate-fade-in shadow-xl">
                <TrophyIcon className="w-24 h-24 mx-auto text-yellow-500" />
                <h3 className="text-5xl font-bold font-display text-brand-teal mt-4 mb-4">סיכום התיקים</h3>
                <p className="text-3xl mb-6">{isCompleted ? "הצלחתם במשימה והשלמתם את המודול!" : "עבודה טובה! נסו שוב כדי להגיע ל-80% הצלחה."}</p>
                <div className="bg-brand-light-blue/20 p-4 rounded-xl my-4 inline-block">
                    <p className="text-4xl font-semibold">הציון הסופי:</p>
                    <p className="text-7xl font-bold text-brand-light-blue">{score}<span className="text-5xl text-brand-dark-blue/70"> / {dilemmas.length}</span></p>
                </div>
                {!isCompleted && <p className="text-red-500 mb-4 font-semibold text-2xl">יש לפתור נכון 8 תיקים לפחות כדי להשלים את המודול.</p>}
                <button onClick={handleRestart} className="mt-6 bg-brand-magenta hover:bg-pink-700 text-white font-bold py-3 px-8 rounded-xl text-3xl transition-transform transform hover:scale-105">שחק שוב</button>
            </div>
        );
    }
    
    return (
        <div className="animate-fade-in">
             <div className="flex justify-center gap-1 sm:gap-2 mb-6">
                {dilemmas.map((d, index) => {
                    const answerRecord = answers[d.id.toString()];
                    const isCompleted = !!answerRecord;
                    const isCorrect = answerRecord ? answerRecord.isCorrect : false;
                    return <div key={d.id} className={`h-3 flex-1 rounded-full transition-all duration-300 ${index === currentDilemmaIndex ? 'bg-brand-teal' : isCompleted ? (isCorrect ? 'bg-green-400' : 'bg-red-400') : 'bg-gray-300'}`} title={`תיק ${index + 1}`}></div>;
                })}
            </div>
            <div className="bg-white/60 backdrop-blur-md border border-white/30 p-6 rounded-3xl shadow-xl">
                <h3 className="text-4xl sm:text-5xl font-bold font-display text-brand-dark-blue mb-4 text-center">תיק #{currentDilemma.id}: <span className="text-brand-light-blue">{currentDilemma.title}</span></h3>
                <img src={currentDilemma.image} alt={currentDilemma.title} className="w-full h-64 object-cover rounded-2xl mb-6 shadow-lg" />
                <div className="bg-white/50 p-6 rounded-2xl">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="flex-shrink-0 text-7xl bg-gray-200 w-24 h-24 rounded-full flex items-center justify-center">{currentDilemma.character.avatar}</div>
                        <div className="relative bg-gray-100 p-4 rounded-xl flex-1"><div className="absolute top-4 -right-3 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-gray-100"></div><p className="font-semibold text-2xl text-brand-dark-blue">{currentDilemma.character.name} מספר/ת:</p><p className="italic text-brand-dark-blue/90 text-4xl">"{currentDilemma.story}"</p></div>
                    </div>
                    <div className="bg-brand-light-blue/20 p-4 rounded-xl">
                        <h4 className="font-bold text-5xl text-brand-dark-blue mb-4 text-center">{currentDilemma.question}</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {currentDilemma.options.map((option) => {
                                const isSelected = selectedAnswer === option;
                                const isCorrect = currentDilemma.answer === option;
                                let buttonClass = 'bg-white hover:bg-gray-50 border-gray-300';
                                if (selectedAnswer) { if (isCorrect) buttonClass = 'bg-green-500 text-white border-green-600'; else if (isSelected) buttonClass = 'bg-red-500 text-white border-red-600'; else buttonClass = 'bg-gray-200/50 opacity-60 border-gray-300'; }
                                return <button key={option} onClick={() => handleAnswerSelect(option)} disabled={!!selectedAnswer} className={`flex items-center justify-between w-full text-right p-4 rounded-xl transition-all duration-300 border-2 ${buttonClass}`}><span className="flex-1 text-4xl">{option}</span>{selectedAnswer && isCorrect && <CheckCircleIcon className="w-8 h-8 text-white flex-shrink-0" />}{selectedAnswer && isSelected && !isCorrect && <XCircleIcon className="w-8 h-8 text-white flex-shrink-0" />}</button>;
                            })}
                        </div>
                    </div>
                </div>
                {selectedAnswer && (<div className="mt-6 p-4 bg-yellow-100/60 border-r-4 border-yellow-500 rounded-lg animate-fade-in flex items-start gap-4"><ScaleIcon className="w-16 h-16 text-yellow-800 flex-shrink-0 mt-1" /><div><p className="font-bold text-3xl text-yellow-900">חוות דעת מומחה:</p><p className="text-yellow-900/90 text-2xl">{currentDilemma.explanation}</p></div></div>)}
            </div>
            <div className="mt-6 text-center"><button onClick={handleNext} disabled={!selectedAnswer} className="bg-brand-teal hover:bg-teal-500 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed text-2xl">{currentDilemmaIndex < dilemmas.length - 1 ? 'לתיק הבא' : 'סיים בוחן'}</button></div>
        </div>
    );
};

// --- Main Module Component ---
const RightsModule: React.FC<RightsModuleProps> = ({ onBack, title, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const renderStepContent = () => {
    switch (currentStep) {
        case 0: return <GettingHiredChapter />;
        case 1: return <WorkplaceRightsChapter />;
        case 2: return <EndingEmploymentChapter />;
        case 3: return <RightsDefendersGame onGameComplete={onComplete} />;
        default: return <GettingHiredChapter />;
    }
  };

  return (
    <ModuleView title="המדריך המלא לזכויות עובדים" onBack={onBack}>
      <div className="mb-8">
        <div className="flex items-start mb-2">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center flex-1" onClick={() => setCurrentStep(index)}>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300 cursor-pointer ${currentStep >= index ? 'bg-brand-teal border-brand-teal text-white' : 'bg-white/50 border-gray-300'}`}>
                  <step.icon className="w-10 h-10" />
                </div>
                <p className={`mt-2 text-xl text-center font-bold ${currentStep >= index ? 'text-brand-teal' : 'text-gray-500'}`}>{step.title}</p>
              </div>
              {index < steps.length - 1 && <div className={`flex-1 h-1 mt-8 mx-2 ${currentStep > index ? 'bg-brand-teal' : 'bg-gray-300'}`}></div>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {renderStepContent()}

      <div className="flex justify-between mt-8">
        <button onClick={() => setCurrentStep(s => s - 1)} disabled={currentStep === 0} className="bg-gray-300 hover:bg-gray-400 text-brand-dark-blue font-bold py-3 px-8 rounded-lg disabled:opacity-50 text-2xl">הקודם</button>
        <button onClick={() => setCurrentStep(s => s + 1)} disabled={currentStep === steps.length - 1} className="bg-brand-teal hover:bg-teal-500 text-white font-bold py-3 px-8 rounded-lg disabled:opacity-50 text-2xl">הבא</button>
      </div>
    </ModuleView>
  );
};

export default RightsModule;