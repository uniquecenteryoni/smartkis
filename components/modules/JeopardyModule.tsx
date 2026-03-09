import React, { useEffect, useMemo, useState } from 'react';

interface JeopardyModuleProps {
  onBack: () => void;
  title: string;
  onComplete: () => void;
  questionBanks?: Record<Difficulty, Category[]>;
}

export type QuestionType = 'multiple' | 'open' | 'fill' | 'match' | 'visual';
export type Difficulty = 'קל' | 'בינוני' | 'מאתגר';
type Step = 'welcome' | 'difficulty' | 'teams' | 'board' | 'results';

export interface Question {
  value: number;
  prompt: string;
  options: string[];
  correct: number;
  type: QuestionType;
  instruction?: string;
  matchLeft?: string[];
  matchRight?: string[];
  correctText?: string;
}

export interface Category {
  name: string;
  color: string;
  questions: Question[];
}

const categoryPalette: string[] = [
  'from-[#ff7c7c] to-[#ffb347]', // coral → amber
  'from-[#6a5acd] to-[#b19cd9]', // slate purple → lavender
  'from-[#2f855a] to-[#9ae6b4]', // forest → mint
  'from-[#ff9f43] to-[#feca57]', // orange → warm yellow
  'from-[#4b6cb7] to-[#182848]', // indigo → midnight
  'from-[#f53844] to-[#42378f]', // cherry → violet
];

const defaultQuestionBanks: Record<Difficulty, Category[]> = {
  'קל': [
    {
      name: 'צרכנות נבונה',
      color: categoryPalette[0],
      questions: [
        { value: 100, prompt: 'אמת/שקר: כדאי להשוות מחיר ל-100 גרם כדי לדעת מה זול.', options: ['אמת', 'שקר'], correct: 0, type: 'multiple', instruction: 'אמת/שקר', correctText: 'אמת.' },
        { value: 200, prompt: 'מהי רכישה מתוכננת?', options: ['קנייה לפי רשימה מראש', 'קנייה כי ראיתי שלט עכשיו', 'קנייה כי חבר קנה'], correct: 0, type: 'multiple', instruction: 'אמריקאי', correctText: 'קנייה לפי רשימה מראש.' },
        { value: 300, prompt: 'התאמה: סוג מבצע ↔ מה מקבלים', options: [''], correct: 0, type: 'match', instruction: 'חברו כל מבצע למשמעות', matchLeft: ['1+1', '10% הנחה', 'משלוח חינם'], matchRight: ['מקבלים שניים במחיר אחד', 'משלמים פחות מהמחיר הרגיל', 'לא משלמים על שליחה'], correctText: '1-ב, 2-א, 3-ג.' },
        { value: 400, prompt: 'חישוב: חטיף עולה 5 ש"ח. קונים שניים. כמה תשלמו?', options: [''], correct: 0, type: 'open', instruction: 'חישוב פשוט', correctText: '10 ש"ח.' },
        { value: 500, prompt: 'פתוחה: תנו טיפ אחד לצרכנות נבונה בבית.', options: [''], correct: 0, type: 'open', correctText: 'לדוגמה: להכין רשימה ולהשוות מחירים.' },
      ],
    },
    {
      name: 'ניהול תקציב',
      color: categoryPalette[1],
      questions: [
        { value: 100, prompt: 'אמת/שקר: תקציב עוזר לראות כמה כסף נכנס וכמה יוצא.', options: ['אמת', 'שקר'], correct: 0, type: 'multiple', instruction: 'אמת/שקר', correctText: 'אמת.' },
        { value: 200, prompt: 'מהי דוגמה להכנסה?', options: ['שכר עבודה', 'קניית בגדים', 'טיול'], correct: 0, type: 'multiple', instruction: 'אמריקאי', correctText: 'שכר עבודה.' },
        { value: 300, prompt: 'התאמה: סוג הוצאה ↔ דוגמה', options: [''], correct: 0, type: 'match', instruction: 'התאימו', matchLeft: ['קבועה', 'משתנה', 'בלתי צפויה'], matchRight: ['תשלום חוג קבוע', 'גלידה עם חבר', 'תיקון פתאומי'], correctText: '1-ב, 2-ג, 3-א.' },
        { value: 400, prompt: 'חישוב: יש לך 100 ש"ח וחסכת 20 ש"ח. כמה נשאר לך להוצאות?', options: [''], correct: 0, type: 'open', instruction: 'חיסור פשוט', correctText: '80 ש"ח.' },
        { value: 500, prompt: 'פתוחה: למה כדאי לשים קצת כסף בצד כל חודש?', options: [''], correct: 0, type: 'open', correctText: 'כדי להיות מוכנים למקרי חירום או יעדים.' },
      ],
    },
    {
      name: 'יזמות',
      color: categoryPalette[2],
      questions: [
        { value: 100, prompt: 'אמת/שקר: יזם מחפש צורך ומציע פתרון.', options: ['אמת', 'שקר'], correct: 0, type: 'multiple', instruction: 'אמת/שקר', correctText: 'אמת.' },
        { value: 200, prompt: 'מה רעיון פשוט ליזם צעיר?', options: ['מכירת לימונדה', 'בניית רכבת', 'קניית חנות ענק'], correct: 0, type: 'multiple', instruction: 'אמריקאי', correctText: 'מכירת לימונדה.' },
        { value: 300, prompt: 'התאמה: מושג ↔ הסבר', options: [''], correct: 0, type: 'match', instruction: 'חברו מושג להסבר', matchLeft: ['קהל יעד', 'רווח', 'חומרי גלם'], matchRight: ['האנשים שקונים ממך', 'מה שנשאר אחרי הוצאות', 'הדברים שמהם מייצרים'], correctText: '1-ב, 2-א, 3-ג.' },
        { value: 400, prompt: 'חישוב: עלות חומר לעוגייה 2 ש"ח, מוכרים ב-5 ש"ח. כמה מרוויחים על 1 עוגייה?', options: [''], correct: 0, type: 'open', instruction: 'חיסור פשוט', correctText: '3 ש"ח.' },
        { value: 500, prompt: 'פתוחה: מה היתרון ב"גרסה ראשונית" של מוצר?', options: [''], correct: 0, type: 'open', correctText: 'אפשר לבדוק מהר אצל לקוחות ולשפר.' },
      ],
    },
    {
      name: 'תעסוקה',
      color: categoryPalette[3],
      questions: [
        { value: 100, prompt: 'אמת/שקר: לבני נוער יש הגבלת שעות עבודה.', options: ['אמת', 'שקר'], correct: 0, type: 'multiple', instruction: 'אמת/שקר', correctText: 'אמת.' },
        { value: 200, prompt: 'מהי שיחה לפני קבלת עבודה?', options: ['ראיון עבודה', 'שיעור בבית ספר', 'חוג'], correct: 0, type: 'multiple', instruction: 'אמריקאי', correctText: 'ראיון עבודה.' },
        { value: 300, prompt: 'התאמה: מושג שכר ↔ הסבר', options: [''], correct: 0, type: 'match', instruction: 'חברו', matchLeft: ['שכר ברוטו', 'שכר נטו', 'חוזה עבודה'], matchRight: ['לפני ניכויים', 'מה שנכנס לבנק', 'מסמך שמגדיר תנאים'], correctText: '1-ב, 2-א, 3-ג.' },
        { value: 400, prompt: 'חישוב: 3 שעות עבודה ב-30 ש"ח לשעה. כמה שכר?', options: [''], correct: 0, type: 'open', instruction: 'כפל פשוט', correctText: '90 ש"ח.' },
        { value: 500, prompt: 'פתוחה: מה חשוב לומר למעסיק לפני משמרת?', options: [''], correct: 0, type: 'open', correctText: 'למשל זמינות, מגבלות וזמנים.' },
      ],
    },
    {
      name: 'כלכלה עולמית',
      color: categoryPalette[4],
      questions: [
        { value: 100, prompt: 'אמת/שקר: שער חליפין הוא מחיר של מטבע מול מטבע אחר.', options: ['אמת', 'שקר'], correct: 0, type: 'multiple', instruction: 'אמת/שקר', correctText: 'אמת.' },
        { value: 200, prompt: 'מהו יבוא?', options: ['קנייה מחו"ל למדינה', 'מכירה לחו"ל', 'טיול'], correct: 0, type: 'multiple', instruction: 'אמריקאי', correctText: 'קנייה מחו"ל למדינה.' },
        { value: 300, prompt: 'התאמה: מוסד ↔ תפקיד', options: [''], correct: 0, type: 'match', instruction: 'חברו', matchLeft: ['בנק מרכזי', 'בורסה', 'חנות מקומית'], matchRight: ['קובע ריבית וכסף', 'מסחר במניות', 'קונה ומוכר לקוחות'], correctText: '1-ב, 2-א, 3-ג.' },
        { value: 400, prompt: 'חישוב: דולר = 4 ש"ח. מוצר עולה 10$. כמה בשקלים?', options: [''], correct: 0, type: 'open', instruction: 'כפל פשוט', correctText: '40 ש"ח.' },
        { value: 500, prompt: 'פתוחה: למה מחירי נפט משפיעים על מחירי מוצרים?', options: [''], correct: 0, type: 'open', correctText: 'נפט משפיע על הובלה וייצור, ולכן על המחיר.' },
      ],
    },
    {
      name: 'סיפורו של כסף',
      color: categoryPalette[5],
      questions: [
        { value: 100, prompt: 'אמת/שקר: פעם שילמו עם צדפים ומלח.', options: ['אמת', 'שקר'], correct: 0, type: 'multiple', instruction: 'אמת/שקר', correctText: 'אמת.' },
        { value: 200, prompt: 'מה היתרון במטבעות מתכת?', options: ['קלים לסחיבה וערך מוסכם', 'טעימים יותר', 'זוהרים יותר'], correct: 0, type: 'multiple', instruction: 'אמריקאי', correctText: 'קלים לסחיבה וערך מוסכם.' },
        { value: 300, prompt: 'התאמה: אמצעי תשלום ↔ תקופה', options: [''], correct: 0, type: 'match', instruction: 'חברו', matchLeft: ['צדפים', 'מטבעות מתכת', 'שטרות נייר'], matchRight: ['תקופה קדומה', 'עת עתיקה', 'סין כ-1000 שנה'], correctText: '1-ב, 2-א, 3-ג.' },
        { value: 400, prompt: 'חישוב: 2 שטרות של 50 ש"ח ועוד 3 מטבעות של 10 ש"ח. כמה כסף יש?', options: [''], correct: 0, type: 'open', instruction: 'חיבור פשוט', correctText: '130 ש"ח.' },
        { value: 500, prompt: 'פתוחה: מה נותן לכסף ערך היום?', options: [''], correct: 0, type: 'open', correctText: 'אמון הציבור והחוק שקובע שהוא אמצעי תשלום.' },
      ],
    },
  ],
  'בינוני': [
    {
      name: 'צרכנות נבונה',
      color: categoryPalette[0],
      questions: [
        { value: 100, prompt: 'אמת/שקר: "יחידת מידה" (מחיר ל-100 גרם) עוזרת לדעת איזה מוצר זול יותר גם כשגדלי האריזות שונים.', options: ['אמת', 'שקר'], correct: 0, type: 'multiple', instruction: 'אמת/שקר', correctText: 'אמת.' },
        { value: 200, prompt: 'מהו "קנייה רגשית"?', options: ['קניית מתנה למישהו שאוהבים', 'קנייה לא מתוכננת שנובעת מדחף רגעי', 'קנייה של מוצר יד שנייה'], correct: 1, type: 'multiple', instruction: 'אמריקאי', correctText: "ב' (קנייה מדחף רגעי)." },
        { value: 300, prompt: 'התאמה: סוג מבצע ↔ משמעות', options: [''], correct: 0, type: 'match', instruction: 'התאימו בין סוג המבצע למשמעות', matchLeft: ['1+1', 'הנחה של 20%', 'כמות כפולה באותו מחיר'], matchRight: ['קיבלת שני מוצרים במחיר אחד', 'שילמת פחות על אותו מוצר', 'המחיר ל-100 גרם ירד ב-50%'], correctText: '1-ב (1+1=כפול), 2-א (20%=פחות כסף), 3-ג (כמות כפולה=50% פחות לגרם).' },
        { value: 400, prompt: 'חישוב: בקבוק קולה עולה 8 ש"ח. השני ב-50% הנחה. כמה יעלו 2 בקבוקים?', options: [''], correct: 0, type: 'open', instruction: 'חישוב בעל פה', correctText: '12 ש"ח.' },
        { value: 500, prompt: 'שאלה פתוחה: למה חברות משתמשות במשפיעני רשת וכיצד זה משפיע על שיקול הדעת שלנו כצרכנים?', options: [''], correct: 0, type: 'open', correctText: 'המלצת המשפיען נתפסת כאישית ופחות כפרסומת, מה שמוריד הגנות צרכניות.' },
      ],
    },
    {
      name: 'ניהול תקציב',
      color: categoryPalette[1],
      questions: [
        { value: 100, prompt: 'אמת/שקר: תקציב מאוזן הוא מצב שבו ההוצאות גדולות מההכנסות.', options: ['אמת', 'שקר'], correct: 1, type: 'multiple', instruction: 'אמת/שקר', correctText: 'שקר. (זהו גירעון).' },
        { value: 200, prompt: 'מהו "חיסכון"?', options: ['כסף שנשאר בארנק בסוף היום', 'סכום כסף שאנו שומרים בצד למטרה עתידית', 'כסף שמקבלים כמתנה ליום הולדת'], correct: 1, type: 'multiple', instruction: 'אמריקאי', correctText: "ב' (סכום למטרה עתידית)." },
        { value: 300, prompt: 'התאמה: סוג הוצאה ↔ דוגמה', options: [''], correct: 0, type: 'match', instruction: 'התאימו סוג הוצאה לדוגמה', matchLeft: ['הוצאה קבועה', 'הוצאה משתנה', 'הוצאה בלתי צפויה'], matchRight: ['תשלום ועד בית חודשי', 'קניית פיצה עם חברים', 'תיקון פנצ׳ר באופניים'], correctText: '1-ב (ועד בית), 2-ג (פיצה), 3-א (פנצ׳ר).' },
        { value: 400, prompt: 'חישוב: אלון מקבל 200 ש"ח דמי כיס וחוסך 25% בכל חודש. כמה יהיה לו אחרי חצי שנה?', options: [''], correct: 0, type: 'open', instruction: 'חישוב חודשי × 6', correctText: '300 ש"ח. (50 ש"ח לחודש למשך חצי שנה).' },
        { value: 500, prompt: 'שאלה פתוחה: מה ההבדל בין צורך לרצון? תן דוגמה למקרה שרצון הופך לצורך.', options: [''], correct: 0, type: 'open', correctText: 'צורך הוא הישרדותי; רצון הוא שדרוג. רצון הופך לצורך כשהוא חיוני לתפקוד חברתי/לימודי.' },
      ],
    },
    {
      name: 'יזמות',
      color: categoryPalette[2],
      questions: [
        { value: 100, prompt: 'אמת/שקר: יזם מזהה בעיה או צורך ויוצר פתרון חדש.', options: ['אמת', 'שקר'], correct: 0, type: 'multiple', instruction: 'אמת/שקר', correctText: 'אמת.' },
        { value: 200, prompt: 'מה זה "סקר שוק"?', options: ['ללכת לשוק ולבדוק מחירי ירקות', 'בדיקה אם הלקוחות הפוטנציאליים מעוניינים במוצר שלי', 'פרסום המוצר ברשתות החברתיות'], correct: 1, type: 'multiple', instruction: 'אמריקאי', correctText: "ב' (בדיקת עניין הלקוחות)." },
        { value: 300, prompt: 'התאמה: מושג יזמי ↔ הגדרה', options: [''], correct: 0, type: 'match', instruction: 'התאימו את המושג להגדרה', matchLeft: ['קהל יעד', 'מתחרים', 'מוצר מינימלי (MVP)'], matchRight: ['האנשים שהכי סביר שיקנו ממני', 'עסקים אחרים שמוכרים מוצר דומה', 'הגרסה הראשונית והפשוטה ביותר של הרעיון'], correctText: '1-ב (קהל יעד), 2-א (מתחרים), 3-ג (MVP).' },
        { value: 400, prompt: 'חישוב: עלות חומרים לצמיד היא 5 ש"ח ומחיר מכירה 15 ש"ח. כמה צמידים צריך למכור כדי להגיע לרווח של 300 ש"ח?', options: [''], correct: 0, type: 'open', instruction: 'חישוב רווח ליחידה × כמות', correctText: '30 צמידים. (רווח של 10 ש"ח על כל צמיד).' },
        { value: 500, prompt: 'שאלה פתוחה: מהו "סיכון מחושב" ביזמות ולמה חשוב לקחת אותו?', options: [''], correct: 0, type: 'open', correctText: 'הערכת הפסד מקסימלי מול סיכוי להצלחה כדי לא להמר בצורה עיוורת.' },
      ],
    },
    {
      name: 'תעסוקה',
      color: categoryPalette[3],
      questions: [
        { value: 100, prompt: 'אמת/שקר: מותר לבני נוער לעבוד בכל שעה ביום, כולל לילה, אם מקבלים שכר מינימום.', options: ['אמת', 'שקר'], correct: 1, type: 'multiple', instruction: 'אמת/שקר', correctText: 'שקר. (יש מגבלות חוקיות).' },
        { value: 200, prompt: 'מהו "שכר מינימום"?', options: ['השכר הכי נמוך שהמעסיק חייב לשלם לפי החוק', 'השכר שמתחילים איתו בחודש הראשון', 'שכר שמקבלים על עבודות פשוטות בלבד'], correct: 0, type: 'multiple', instruction: 'אמריקאי', correctText: "א' (השכר הכי נמוך בחוק)." },
        { value: 300, prompt: 'התאמה: מושג שכר ↔ הגדרה', options: [''], correct: 0, type: 'match', instruction: 'התאימו בין המושג להגדרה', matchLeft: ['ברוטו', 'נטו', 'ניכויי חובה'], matchRight: ['השכר לפני שירדו ממנו תשלומים', 'הסכום שנכנס לחשבון הבנק', 'תשלומים שיורדים מהשכר (כמו מיסים)'], correctText: '1-ג (ברוטו=לפני), 2-א (נטו=בנק), 3-ב (ניכויים=מיסים).' },
        { value: 400, prompt: 'חישוב: שכר מינימום לנער הוא 30 ש"ח לשעה, ובשבת 150%. כמה ירוויח נער שעבד 4 שעות ביום חול ו-2 שעות בשבת?', options: [''], correct: 0, type: 'open', instruction: 'חישוב שכר רגיל ושבת', correctText: '210 ש"ח. (120 ש"ח חול + 90 ש"ח שבת).' },
        { value: 500, prompt: 'שאלה פתוחה: שלושה פרמטרים חשובים שמעסיק מחפש (מלבד ידע מקצועי)?', options: [''], correct: 0, type: 'open', correctText: 'אחריות, דייקנות (עמידה בזמנים) ויחסי אנוש (עבודת צוות).' },
      ],
    },
    {
      name: 'כלכלה עולמית',
      color: categoryPalette[4],
      questions: [
        { value: 100, prompt: 'אמת/שקר: "שער חליפין" הוא המחיר של מטבע אחד לעומת מטבע אחר.', options: ['אמת', 'שקר'], correct: 0, type: 'multiple', instruction: 'אמת/שקר', correctText: 'אמת.' },
        { value: 200, prompt: 'מהי "אינפלציה"?', options: ['עליית מחירים כללית שגורמת לכסף לקנות פחות', 'מצב שבו יש יותר מדי כסף בבנק', 'ירידה חדה בערך המניות בבורסה'], correct: 0, type: 'multiple', instruction: 'אמריקאי', correctText: "א' (עליית מחירים כללית)." },
        { value: 300, prompt: 'התאמה: מוסד כלכלי ↔ תפקיד', options: [''], correct: 0, type: 'match', instruction: 'התאימו את המוסד לתפקידו', matchLeft: ['בנק מרכזי', 'בורסה', 'בנק מסחרי'], matchRight: ['הגוף שאחראי על הדפסת הכסף והריבית במדינה', 'מקום שבו קונים ומוכרים מניות', 'מקום שבו אנשים פרטיים שומרים את כספם'], correctText: '1-ב (בנק מרכזי=ריבית), 2-א (בורסה=מניות), 3-ג (בנק מסחרי=חשבון פרטי).' },
        { value: 400, prompt: 'חישוב: שער דולר 3.5 ש"ח. מוצר עולה 40$ ומשלוח 10$. כמה זה יעלה בשקלים?', options: [''], correct: 0, type: 'open', instruction: 'המרה מדולר לשקל', correctText: '175 ש"ח. (50 דולר כפול 3.5).' },
        { value: 500, prompt: 'שאלה פתוחה: איך אירוע עולמי (חסימת תעלת סואץ/מלחמה רחוקה) יכול לייקר חלב בישראל?', options: [''], correct: 0, type: 'open', correctText: 'שיבוש בשינוע מייקר חומרי גלם (דלק/מספוא), מה שמעלה את מחיר המוצר הסופי.' },
      ],
    },
    {
      name: 'סיפורו של כסף',
      color: categoryPalette[5],
      questions: [
        { value: 100, prompt: 'אמת/שקר: לפני המצאת המטבעות השתמשו בסחר חליפין (למשל תרנגולת תמורת שק חיטה).', options: ['אמת', 'שקר'], correct: 0, type: 'multiple', instruction: 'אמת/שקר', correctText: 'אמת.' },
        { value: 200, prompt: 'מדוע עברו להשתמש במטבעות מתכת במקום סחר חליפין?', options: ['כי מטבעות היו יפים יותר לקישוט', 'כי קשה לסחוב סחורה ולסכם ערך אחיד לכל מוצר', 'כי מלכים רצו אוסף זהב בארמון'], correct: 1, type: 'multiple', instruction: 'אמריקאי', correctText: "ב' (קושי בסחיבת סחורה והסכמה על ערך)." },
        { value: 300, prompt: 'התאמה: אמצעי תשלום ↔ תקופה', options: [''], correct: 0, type: 'match', instruction: 'התאימו מושג לתקופה', matchLeft: ['צדפים ומלח', 'שטרות נייר', 'מטבעות זהב וכסף'], matchRight: ['שבטים קדומים וראשית הציוויליזציה', 'סין לפני כ-1,000 שנה ואירופה מאוחר יותר', 'העת העתיקה (לפני כ-2,500 שנה)'], correctText: '1-ב (צדפים=קדום), 2-ג (שטרות=סין), 3-א (מטבעות זהב=עת עתיקה).' },
        { value: 400, prompt: 'חישוב: שטר כסף בסין היה שווה ל-1,000 מטבעות נחושת. אם יש 3,500 מטבעות, כמה שטרות יקבלו ומה העודף?', options: [''], correct: 0, type: 'open', instruction: 'חלוקה ליחידות של 1,000', correctText: '3 שטרות ועודף של 500 מטבעות.' },
        { value: 500, prompt: 'שאלה פתוחה: מהו "כסף פיאט" וכיצד הוא שונה מכסף מגובה זהב?', options: [''], correct: 0, type: 'open', correctText: 'כסף ללא ערך עצמי שאינו מגובה בזהב, אלא נשען על אמון הציבור והחוק.' },
      ],
    },
  ],
  'מאתגר': [
    {
      name: 'צרכנות נבונה',
      color: categoryPalette[0],
      questions: [
        { value: 100, prompt: 'אמת/שקר: פיצול קנייה ל"מבצעי בזק" נועד לגרום לנו לשלם יותר בלי לשים לב.', options: ['אמת', 'שקר'], correct: 0, type: 'multiple', instruction: 'אמת/שקר', correctText: 'אמת.' },
        { value: 200, prompt: 'מהי "עלות כוללת לבעלות"?', options: ['מחיר קנייה בלבד', 'מחיר + תחזוקה/שימוש לאורך זמן', 'רק משלוח'], correct: 1, type: 'multiple', instruction: 'אמריקאי', correctText: 'מחיר + תחזוקה/שימוש לאורך זמן.' },
        { value: 300, prompt: 'התאמה: סוג הטיית קנייה ↔ דוגמה', options: [''], correct: 0, type: 'match', instruction: 'חברו הטיה לדוגמה', matchLeft: ['עוגן', 'מחסור מזויף', 'חבילת ערך'], matchRight: ['מציגים מחיר מקורי גבוה כדי שהמבצע ייראה ענק', 'כיתוב "כמעט נגמר" בלי נתון אמיתי', 'מוסיפים מוצר קטן כדי לייקר את העיקרי'], correctText: '1-ב, 2-א, 3-ג.' },
        { value: 400, prompt: 'חישוב: 3 חטיפים ב-25 ש"ח או כל חטיף ב-9 ש"ח. אם קונים 3, מה המחיר הממוצע ליחידה בכל אופציה?', options: [''], correct: 0, type: 'open', instruction: 'חשב ממוצע ליחידה', correctText: 'מבצע: ≈8.33 ש"ח; רגיל: 9 ש"ח.' },
        { value: 500, prompt: 'פתוחה: איך היית בודק אם ביקורת אונליין אמינה לפני קנייה?', options: [''], correct: 0, type: 'open', correctText: 'לדוגמה: לבדוק מקורות שונים, תמונות משתמשים ותאריך ביקורות.' },
      ],
    },
    {
      name: 'ניהול תקציב',
      color: categoryPalette[1],
      questions: [
        { value: 100, prompt: 'אמת/שקר: אם חסר כסף בסוף חודש, זו אינדיקציה לתזרים שלילי.', options: ['אמת', 'שקר'], correct: 0, type: 'multiple', instruction: 'אמת/שקר', correctText: 'אמת.' },
        { value: 200, prompt: 'מהו "חוק 50/30/20"?', options: ['50 חובה, 30 רצונות, 20 חיסכון', '50 חיסכון, 30 חובה, 20 רצונות', '50 רצונות, 30 חיסכון, 20 חובה'], correct: 0, type: 'multiple', instruction: 'אמריקאי', correctText: '50 חובה, 30 רצונות, 20 חיסכון.' },
        { value: 300, prompt: 'התאמה: מדד ↔ הסבר', options: [''], correct: 0, type: 'match', instruction: 'חברו מדד להסבר', matchLeft: ['יתרה', 'תזרים מזומנים', 'חיסכון חירום'], matchRight: ['מה שנשאר אחרי הכנסות-הוצאות', 'כסף נכנס מול יוצא בתקופה', 'כסף זמין לבלתי צפוי (3-6 חודשי הוצאות)'], correctText: '1-ב, 2-א, 3-ג.' },
        { value: 400, prompt: 'חישוב: תקציב חודשי 2,400 ש"ח. הוצאות חובה 1,200, רצונות 700. כמה נשאר לחיסכון ואם רוצים להגיע ל-20% חיסכון, כמה צריך לקצץ?', options: [''], correct: 0, type: 'open', instruction: 'חשב חיסכון והקיצוץ', correctText: 'נשארים 500 ש"ח (≈21%). כדי להגיע מדויק ל-20% צריך מינימום 480; אין קיצוץ נדרש, אפשר להוסיף 20 לחיסכון.' },
        { value: 500, prompt: 'פתוחה: איך היית בונה קרן חירום אם ההכנסה משתנה מחודש לחודש?', options: [''], correct: 0, type: 'open', correctText: 'למשל ממוצע הכנסה, יעד מינימום, העברה אוטומטית כשיש עודף.' },
      ],
    },
    {
      name: 'יזמות',
      color: categoryPalette[2],
      questions: [
        { value: 100, prompt: 'אמת/שקר: מוצר מינימלי (MVP) נועד לבדוק שוק במהירות עם פחות השקעה.', options: ['אמת', 'שקר'], correct: 0, type: 'multiple', instruction: 'אמת/שקר', correctText: 'אמת.' },
        { value: 200, prompt: 'מהי בעיית "חוסר התאמה לשוק" (Product-Market Fit)?', options: ['המוצר לא פוגש צורך אמיתי של לקוחות', 'המחיר גבוה מדי', 'אין צוות מספיק גדול'], correct: 0, type: 'multiple', instruction: 'אמריקאי', correctText: 'המוצר לא פוגש צורך אמיתי.' },
        { value: 300, prompt: 'התאמה: ערוץ שיווק ↔ שימוש', options: [''], correct: 0, type: 'match', instruction: 'חברו ערוץ למטרה', matchLeft: ['שיווק משפיענים', 'שיווק מפה לאוזן', 'מודעות ממומנות'], matchRight: ['תשלום ליוצרי תוכן שימליצו', 'לקוחות מספרים לחברים', 'קונים חשיפה בפלטפורמות'], correctText: '1-ב, 2-א, 3-ג.' },
        { value: 400, prompt: 'חישוב: עלות ייצור יחידה 12 ש"ח, מחיר מכירה 30 ש"ח. תקציב שיווק חודשי 180 ש"ח. כמה יחידות צריך למכור לכסות ייצור+שיווק ולהגיע לרווח 240 ש"ח?', options: [''], correct: 0, type: 'open', instruction: 'חשב רווח ליחידה ותרחיש', correctText: 'רווח ליחידה 18 ש"ח. צריך (180+240)/18 ≈ 23.3 → 24 יחידות לפחות.' },
        { value: 500, prompt: 'פתוחה: איך מגדירים סיכון מחושב לפני השקת מוצר חדש?', options: [''], correct: 0, type: 'open', correctText: 'מגדירים הפסד מקסימלי, ניסוי קטן, מדדי הצלחה ותחנת עצירה.' },
      ],
    },
    {
      name: 'תעסוקה',
      color: categoryPalette[3],
      questions: [
        { value: 100, prompt: 'אמת/שקר: עבודה בלילה לבני נוער מוגבלת ודורשת אישור מיוחד.', options: ['אמת', 'שקר'], correct: 0, type: 'multiple', instruction: 'אמת/שקר', correctText: 'אמת.' },
        { value: 200, prompt: 'מה חשוב לבדוק לפני חתימה על חוזה?', options: ['שכר, שעות, זכויות', 'צבע הקירות', 'לוגו החברה'], correct: 0, type: 'multiple', instruction: 'אמריקאי', correctText: 'שכר, שעות, זכויות.' },
        { value: 300, prompt: 'התאמה: זכות ↔ משמעות', options: [''], correct: 0, type: 'match', instruction: 'חברו זכות להגדרה', matchLeft: ['שכר מינימום', 'הפסקה', 'תלוש שכר'], matchRight: ['סכום מינימלי לפי חוק', 'זמן מנוחה מוגדר', 'מסמך מפורט על השכר והניכויים'], correctText: '1-ב, 2-א, 3-ג.' },
        { value: 400, prompt: 'חישוב: 6 שעות ב-32 ש"ח, ו-3 שעות במוצ"ש ב-125%. כמה שכר ברוטו?', options: [''], correct: 0, type: 'open', instruction: 'חשב רגיל ומוצ"ש', correctText: '6×32=192; מוצ"ש 3×40=120; יחד 312 ש"ח.' },
        { value: 500, prompt: 'פתוחה: איך תתכונן לראיון עבודה ראשון?', options: [''], correct: 0, type: 'open', correctText: 'להכיר את התפקיד, לתרגל הצגה עצמית, להכין שאלות ולהגיע בזמן.' },
      ],
    },
    {
      name: 'כלכלה עולמית',
      color: categoryPalette[4],
      questions: [
        { value: 100, prompt: 'אמת/שקר: פיחות מטבע הופך ייבוא ליקר יותר.', options: ['אמת', 'שקר'], correct: 0, type: 'multiple', instruction: 'אמת/שקר', correctText: 'אמת.' },
        { value: 200, prompt: 'מה קורה באינפלציה גבוהה?', options: ['ערך הכסף נשחק והמחירים עולים', 'ערך הכסף עולה', 'אין שינוי'], correct: 0, type: 'multiple', instruction: 'אמריקאי', correctText: 'ערך הכסף נשחק והמחירים עולים.' },
        { value: 300, prompt: 'התאמה: מושג ↔ תיאור', options: [''], correct: 0, type: 'match', instruction: 'חברו', matchLeft: ['תמ"ג לנפש', 'מאזן סחר', 'ריבית בסיס'], matchRight: ['הכנסה ממוצעת לאדם', 'יבוא מול יצוא', 'עלות הכסף שקובע הבנק המרכזי'], correctText: '1-ב, 2-ג, 3-א.' },
        { value: 400, prompt: 'חישוב: יורו = 3.9 ש"ח. מוצר 30€ ומשלוח 12€. כמה זה יחד בשקלים?', options: [''], correct: 0, type: 'open', instruction: 'כפל וחיבור', correctText: '42€ × 3.9 ≈ 163.8 ש"ח.' },
        { value: 500, prompt: 'פתוחה: איך עליית ריבית בעולם משפיעה על הלוואות בישראל?', options: [''], correct: 0, type: 'open', correctText: 'מייקרת עלויות מימון לבנקים, שיכולות לגלגל זאת לריבית על הלוואות.' },
      ],
    },
    {
      name: 'סיפורו של כסף',
      color: categoryPalette[5],
      questions: [
        { value: 100, prompt: 'אמת/שקר: שטרות נייר הומצאו כדי לחסוך נשיאת מטבעות רבים.', options: ['אמת', 'שקר'], correct: 0, type: 'multiple', instruction: 'אמת/שקר', correctText: 'אמת.' },
        { value: 200, prompt: 'מה הבדל מרכזי בין כסף סחיר (זהב) לכסף פיאט?', options: ['לכסף פיאט אין ערך עצמי והוא מבוסס אמון', 'פיאט כבד יותר', 'זהב אי אפשר לחלק'], correct: 0, type: 'multiple', instruction: 'אמריקאי', correctText: 'לכסף פיאט אין ערך עצמי והוא מבוסס אמון.' },
        { value: 300, prompt: 'התאמה: שלב בהתפתחות כסף ↔ תיאור', options: [''], correct: 0, type: 'match', instruction: 'חברו', matchLeft: ['סחר חליפין', 'תקן זהב', 'כסף דיגיטלי'], matchRight: ['החלפת סחורות ישירות', 'ערך מגובה בזהב', 'יתרות בבנקים/אפליקציות'], correctText: '1-ב, 2-א, 3-ג.' },
        { value: 400, prompt: 'חישוב: אם 1 שטר יואן מייצג 1,000 מטבעות נחושת, כמה מטבעות שווים 7 שטרות?', options: [''], correct: 0, type: 'open', instruction: 'כפל', correctText: '7,000 מטבעות.' },
        { value: 500, prompt: 'פתוחה: מה הסיכון והיתרון בכסף דיגיטלי לעומת מזומן?', options: [''], correct: 0, type: 'open', correctText: 'יתרון: נוחות ומעקב; סיכון: תלות בטכנולוגיה ופרטיות.' },
      ],
    },
  ],
};

function playJeopardySound(type: 'select' | 'correct' | 'wrong' | 'win') {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (type === 'select') {
      [440, 550, 660].forEach((freq, i) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.type = 'sine'; o.frequency.value = freq;
        g.gain.setValueAtTime(0.22, ctx.currentTime + i * 0.09);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.09 + 0.2);
        o.start(ctx.currentTime + i * 0.09); o.stop(ctx.currentTime + i * 0.09 + 0.2);
      });
    } else if (type === 'correct') {
      [523, 659, 784, 1047].forEach((freq, i) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.type = 'triangle'; o.frequency.value = freq;
        g.gain.setValueAtTime(0.28, ctx.currentTime + i * 0.11);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.11 + 0.28);
        o.start(ctx.currentTime + i * 0.11); o.stop(ctx.currentTime + i * 0.11 + 0.28);
      });
    } else if (type === 'wrong') {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(280, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 0.45);
      g.gain.setValueAtTime(0.3, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
      o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.45);
    } else if (type === 'win') {
      [523, 659, 784, 1047, 784, 1047, 1319].forEach((freq, i) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.type = 'triangle'; o.frequency.value = freq;
        g.gain.setValueAtTime(0.32, ctx.currentTime + i * 0.13);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.13 + 0.32);
        o.start(ctx.currentTime + i * 0.13); o.stop(ctx.currentTime + i * 0.13 + 0.32);
      });
    }
  } catch {}
}

const JeopardyModule: React.FC<JeopardyModuleProps> = ({ onBack, title, onComplete, questionBanks }) => {
  const [difficulty, setDifficulty] = useState<Difficulty>('בינוני');
  const [step, setStep] = useState<Step>('welcome');
  const [active, setActive] = useState<{ cat: number; idx: number } | null>(null);
  const [answered, setAnswered] = useState<Set<string>>(new Set());
  const [results, setResults] = useState<Record<string, 'correct' | 'incorrect'>>({});
  const [scoreBoard, setScoreBoard] = useState<{ name: string; score: number }[]>([]);
  const [currentTeamIdx, setCurrentTeamIdx] = useState(0);
  const [newTeamName, setNewTeamName] = useState('');
  const [feedback, setFeedback] = useState<string>('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [completionNotified, setCompletionNotified] = useState(false);
  const [matchMapping, setMatchMapping] = useState<number[]>([]); // left index -> right index or -1
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [resultFlash, setResultFlash] = useState<'correct' | 'incorrect' | null>(null);

  const banks = useMemo(() => questionBanks || defaultQuestionBanks, [questionBanks]);
  const categories = useMemo(() => banks[difficulty] || [], [banks, difficulty]);
  const totalQuestions = useMemo(() => categories.reduce((sum, c) => sum + c.questions.length, 0), [categories]);

  const answeredCount = answered.size;

  const activeQuestion = useMemo(() => {
    if (active === null) return null;
    return categories[active.cat].questions[active.idx];
  }, [active, categories]);

  const keyFor = (cat: number, idx: number) => `${cat}-${idx}`;

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const resetForDifficulty = (level: Difficulty) => {
    setDifficulty(level);
    setActive(null);
    setAnswered(new Set());
    setResults({});
    setFeedback('');
    setToast(null);
    setCompletionNotified(false);
    setCurrentTeamIdx(0);
    setScoreBoard(prev => prev.map(t => ({ ...t, score: 0 })));
    setMatchMapping([]);
    setDraggingIdx(null);
    setTypedAnswer('');
  };

  const resetGame = () => {
    setDifficulty('בינוני');
    setStep('welcome');
    setActive(null);
    setAnswered(new Set());
    setResults({});
    setFeedback('');
    setToast(null);
    setCompletionNotified(false);
    setCurrentTeamIdx(0);
    setScoreBoard([]);
    setNewTeamName('');
    setMatchMapping([]);
    setDraggingIdx(null);
    setTypedAnswer('');
  };

  const openQuestion = (catIdx: number, qIdx: number) => {
    if (answered.has(keyFor(catIdx, qIdx))) return;
    setActive({ cat: catIdx, idx: qIdx });
    setFeedback('');
    playJeopardySound('select');
  };

  const submitAnswer = (optIdx?: number, isCorrectManual?: boolean) => {
    if (!activeQuestion || active === null) return;
    const teamName = scoreBoard[currentTeamIdx]?.name ?? 'קבוצה';
    const isCorrect = typeof isCorrectManual === 'boolean' ? isCorrectManual : optIdx === activeQuestion.correct;
    const correctText = activeQuestion.correctText || activeQuestion.options[activeQuestion.correct] || '';
    const delta = isCorrect ? activeQuestion.value : 0;

    setScoreBoard(prev => prev.map((t, i) => i === currentTeamIdx ? { ...t, score: t.score + delta } : t));

    const qKey = keyFor(active.cat, active.idx);
    setAnswered(prev => {
      const next = new Set(prev);
      next.add(qKey);
      return next;
    });
    setResults(prev => ({ ...prev, [qKey]: isCorrect ? 'correct' : 'incorrect' }));

    setFeedback(
      isCorrect
        ? `כל הכבוד ${teamName}! +${activeQuestion.value} נקודות`
        : `${teamName}, לא מדויק. לא נצברו נקודות`
    );

    if (isCorrect) {
      showToast(correctText ? `תשובה נכונה! ${correctText}` : 'תשובה נכונה!', 'success');
    } else {
      showToast(`טעות. התשובה הנכונה: ${correctText || '—'}`, 'error');
    }

    playJeopardySound(isCorrect ? 'correct' : 'wrong');
    setResultFlash(isCorrect ? 'correct' : 'incorrect');
    setTimeout(() => setResultFlash(null), 1400);

    setActive(null);
    setCurrentTeamIdx(prev => (prev + 1) % scoreBoard.length);
  };

  const addTeam = () => {
    const trimmed = newTeamName.trim();
    if (!trimmed) return;
    setScoreBoard(prev => [...prev, { name: trimmed, score: 0 }]);
    setNewTeamName('');
  };

  const handleAddTeamSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addTeam();
  };

  useEffect(() => {
    if (activeQuestion && activeQuestion.type === 'match' && activeQuestion.matchLeft) {
      setMatchMapping(activeQuestion.matchLeft.map(() => -1));
      setDraggingIdx(null);
      setTypedAnswer('');
    } else {
      setMatchMapping([]);
      setDraggingIdx(null);
      setTypedAnswer('');
    }
  }, [activeQuestion]);

  useEffect(() => {
    if (!completionNotified && totalQuestions > 0 && answeredCount === totalQuestions) {
      setCompletionNotified(true);
      setStep('results');
      onComplete();
    }
  }, [answeredCount, completionNotified, onComplete, totalQuestions]);

  const totalScore = scoreBoard.reduce((sum, t) => sum + t.score, 0);
  const leadingTeam = scoreBoard.length ? scoreBoard.reduce((best, t) => t.score > best.score ? t : best, scoreBoard[0]) : null;
  const podium = [...scoreBoard].sort((a, b) => b.score - a.score).slice(0, 3);
  const canStartGame = scoreBoard.length > 0;

  const finishGame = () => {
    if (!completionNotified) {
      setCompletionNotified(true);
      onComplete();
    }
    playJeopardySound('win');
    setStep('results');
  };

  const parseNumeric = (text?: string) => {
    if (!text) return NaN;
    const match = text.match(/-?\d+(?:[.,]\d+)?/);
    if (!match) return NaN;
    const normalized = match[0].replace(',', '.');
    return parseFloat(normalized);
  };

  const handleTypedSubmit = () => {
    if (!activeQuestion || activeQuestion.value !== 400) return;
    const expected = parseNumeric(activeQuestion.correctText || activeQuestion.options[activeQuestion.correct]);
    const given = parseFloat(typedAnswer);
    const isCorrect = !Number.isNaN(expected) && !Number.isNaN(given) && Math.abs(given - expected) < 1e-6;
    submitAnswer(undefined, isCorrect);
  };

  const handleMatchDrop = (leftIdx: number, rightIdx: number) => {
    setMatchMapping(prev => {
      const next = [...prev];
      const prevOwner = next.findIndex(v => v === rightIdx);
      if (prevOwner !== -1) next[prevOwner] = -1;
      next[leftIdx] = rightIdx;
      return next;
    });
    setDraggingIdx(null);
  };

  const handleMatchSubmit = () => {
    if (!activeQuestion || !activeQuestion.matchLeft) return;
    const allAssigned = matchMapping.length > 0 && matchMapping.every(v => v >= 0);
    if (!allAssigned) return;
    const allCorrect = matchMapping.every((rightIdx, leftIdx) => rightIdx === leftIdx);
    submitAnswer(undefined, allCorrect);
  };

  return (
    <div className="animate-fade-in space-y-4" dir="rtl">

      {/* Result flash overlay */}
      {resultFlash && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none"
          style={{ background: resultFlash === 'correct' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)' }}
        >
          <div className="text-[10rem] drop-shadow-2xl animate-bounce">
            {resultFlash === 'correct' ? '✅' : '❌'}
          </div>
        </div>
      )}

      {step === 'welcome' && (
        <div
          className="rounded-3xl p-8 shadow-2xl space-y-6"
          style={{ background: 'linear-gradient(145deg,#0f0c29 0%,#302b63 55%,#24243e 100%)', border: '2px solid rgba(255,215,0,0.35)' }}
        >
          <div className="text-center space-y-2">
            <p className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold" style={{ background: 'rgba(255,215,0,0.15)', color: '#ffd700', border: '1px solid rgba(255,215,0,0.4)' }}>שלב 1 • פתיחה</p>
            <h2 className="text-5xl font-black text-white" style={{ textShadow: '0 0 32px rgba(255,215,0,0.7)' }}>🎯 {title}</h2>
            <p className="text-purple-200 text-xl">משחק ידע פיננסי בקצב קבוצות, עם פודיום סופי!</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: '🎮', title: 'איך משחקים', text: 'בוחרים ערך בלוח, עונים בתור, מקבלים ירוק/אדום וסכום נצבר.' },
              { icon: '💰', title: 'ניקוד', text: 'תשובה נכונה = ערך מלא; טעות = אין נקודות.' },
              { icon: '🏆', title: 'סיום', text: 'פודיום יופיע כשכל הלוח נענה או בלחיצה על סיום משחק.' },
            ].map(card => (
              <div key={card.title} className="rounded-2xl p-5 text-center space-y-2" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,215,0,0.2)' }}>
                <p className="text-4xl">{card.icon}</p>
                <p className="font-bold text-yellow-300 text-lg">{card.title}</p>
                <p className="text-purple-200 text-sm leading-relaxed">{card.text}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center">
            <button onClick={onBack} className="px-5 py-2.5 rounded-xl font-bold text-white" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>חזרה</button>
            <button
              onClick={() => setStep('difficulty')}
              className="px-8 py-3 rounded-2xl font-black text-xl text-black transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg,#ffd700,#ff9500)', boxShadow: '0 0 30px rgba(255,215,0,0.6)' }}
            >המשך לבחירת רמת קושי →</button>
          </div>
        </div>
      )}

      {step === 'difficulty' && (
        <div
          className="rounded-3xl p-8 shadow-2xl space-y-6 text-center"
          style={{ background: 'linear-gradient(145deg,#0f0c29 0%,#302b63 55%,#24243e 100%)', border: '2px solid rgba(255,215,0,0.35)' }}
        >
          <div className="space-y-1">
            <p className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold" style={{ background: 'rgba(255,215,0,0.15)', color: '#ffd700', border: '1px solid rgba(255,215,0,0.4)' }}>שלב 2 • רמת קושי</p>
            <h2 className="text-4xl font-black text-white" style={{ textShadow: '0 0 24px rgba(255,215,0,0.5)' }}>בחרו אתגר</h2>
            <p className="text-purple-300">מעבר רמה מאפס את הניקוד והלוח</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {(['קל','בינוני','מאתגר'] as Difficulty[]).map(level => (
              <button
                key={level}
                onClick={() => resetForDifficulty(level)}
                className="px-8 py-4 rounded-2xl text-xl font-black transition-all hover:scale-105"
                style={difficulty === level
                  ? { background: 'linear-gradient(135deg,#ffd700,#ff9500)', color: '#000', boxShadow: '0 0 28px rgba(255,215,0,0.65)' }
                  : { background: 'rgba(255,255,255,0.1)', color: '#fff', border: '2px solid rgba(255,255,255,0.2)' }}
              >{level}</button>
            ))}
          </div>
          <div className="flex justify-between">
            <button onClick={() => setStep('welcome')} className="px-5 py-2.5 rounded-xl font-bold text-white" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>חזרה</button>
            <button
              onClick={() => setStep('teams')}
              className="px-8 py-3 rounded-2xl font-black text-xl text-black transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg,#ffd700,#ff9500)', boxShadow: '0 0 28px rgba(255,215,0,0.55)' }}
            >המשך להזנת קבוצות →</button>
          </div>
        </div>
      )}

      {step === 'teams' && (
        <div
          className="rounded-3xl p-8 shadow-2xl space-y-6"
          style={{ background: 'linear-gradient(145deg,#0f0c29 0%,#302b63 55%,#24243e 100%)', border: '2px solid rgba(255,215,0,0.35)' }}
        >
          <div className="text-center space-y-1">
            <p className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold" style={{ background: 'rgba(255,215,0,0.15)', color: '#ffd700', border: '1px solid rgba(255,215,0,0.4)' }}>שלב 3 • קבוצות</p>
            <h2 className="text-4xl font-black text-white" style={{ textShadow: '0 0 24px rgba(255,215,0,0.5)' }}>הוסיפו קבוצות</h2>
            <p className="text-purple-300">לפחות קבוצה אחת כדי להתחיל</p>
          </div>
          <form onSubmit={handleAddTeamSubmit} className="flex gap-2">
            <input
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              placeholder="שם קבוצה חדש"
              className="flex-1 rounded-xl px-4 py-3 text-lg font-bold text-white focus:outline-none focus:ring-2"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,215,0,0.4)', focusRingColor: '#ffd700' } as React.CSSProperties}
            />
            <button type="submit" className="px-5 py-3 rounded-xl font-black text-black" style={{ background: 'linear-gradient(135deg,#ffd700,#ff9500)' }}>הוסף</button>
          </form>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {scoreBoard.map((team, idx) => (
              <div key={team.name + idx} className="rounded-xl p-3 text-center font-bold" style={{ background: 'rgba(255,215,0,0.12)', border: '1px solid rgba(255,215,0,0.3)', color: '#ffd700' }}>
                {team.name}
              </div>
            ))}
            {scoreBoard.length === 0 && (
              <div className="col-span-4 rounded-xl p-4 text-center text-purple-300" style={{ border: '1px dashed rgba(255,255,255,0.2)' }}>הוסיפו קבוצה כדי להתחיל</div>
            )}
          </div>
          <div className="flex justify-between">
            <button onClick={() => setStep('difficulty')} className="px-5 py-2.5 rounded-xl font-bold text-white" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>חזרה</button>
            <button
              onClick={() => canStartGame && setStep('board')}
              disabled={!canStartGame}
              className="px-8 py-3 rounded-2xl font-black text-xl transition-all hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: canStartGame ? 'linear-gradient(135deg,#ffd700,#ff9500)' : 'rgba(255,255,255,0.1)', color: canStartGame ? '#000' : '#fff', boxShadow: canStartGame ? '0 0 28px rgba(255,215,0,0.55)' : 'none' }}
            >🎮 התחל משחק!</button>
          </div>
        </div>
      )}

      {step === 'board' && (
        <div className="space-y-4">
          {/* Top bar */}
          <div
            className="rounded-2xl px-6 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3"
            style={{ background: 'linear-gradient(135deg,#0f0c29,#302b63)', border: '2px solid rgba(255,215,0,0.3)', boxShadow: '0 0 32px rgba(255,215,0,0.12)' }}
          >
            <div className="space-y-1">
              <h2 className="text-3xl font-black text-white flex items-center gap-3 flex-wrap">
                <span
                  className="px-5 py-1.5 rounded-full text-base font-black"
                  style={{ background: 'linear-gradient(135deg,#ffd700,#ff9500)', color: '#000' }}
                >
                  🎤 תור: {scoreBoard[currentTeamIdx]?.name}
                </span>
                <span style={{ textShadow: '0 0 20px rgba(255,215,0,0.5)' }}>{title}</span>
              </h2>
              <p className="text-purple-300 text-sm">בחרו ערך בלוח, ענו ביחד, ועברו לקבוצה הבאה אוטומטית.</p>
            </div>
            <div className="flex flex-wrap gap-2 items-center text-base">
              <span className="px-4 py-2 rounded-xl text-white font-bold" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>עניתם: <strong className="text-yellow-300">{answeredCount}</strong> / {totalQuestions}</span>
              <span className="px-4 py-2 rounded-xl text-white font-bold" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>סה"כ: <strong className="text-yellow-300">{totalScore}</strong></span>
              <span className="px-4 py-2 rounded-xl text-white font-bold" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>רמה: <strong className="text-yellow-300">{difficulty}</strong></span>
            </div>
          </div>

          {/* Score + controls */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Scoreboard */}
            <div className="rounded-2xl p-5 space-y-3" style={{ background: 'linear-gradient(135deg,#1e1b4b,#2d2a5e)', border: '1px solid rgba(255,215,0,0.2)' }}>
              <p className="text-lg font-black text-yellow-300">🏅 לוח תוצאות</p>
              <div className="grid grid-cols-1 gap-2">
                {scoreBoard.map((team, idx) => (
                  <div
                    key={team.name + idx}
                    className="rounded-xl px-4 py-2.5 flex items-center justify-between transition-all"
                    style={idx === currentTeamIdx
                      ? { background: 'linear-gradient(135deg,rgba(255,215,0,0.25),rgba(255,149,0,0.2))', border: '2px solid rgba(255,215,0,0.6)', boxShadow: '0 0 16px rgba(255,215,0,0.3)' }
                      : { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    <span className="font-bold text-white">{team.name} {idx === currentTeamIdx && '🎤'}</span>
                    <span className="text-2xl font-black" style={{ color: '#ffd700', textShadow: '0 0 10px rgba(255,215,0,0.5)' }}>{team.score}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Controls */}
            <div className="rounded-2xl p-5 space-y-3" style={{ background: 'linear-gradient(135deg,#1e1b4b,#2d2a5e)', border: '1px solid rgba(255,215,0,0.2)' }}>
              <p className="text-lg font-black text-yellow-300">⚙️ פעולות</p>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setStep('difficulty')} className="px-4 py-2 rounded-xl text-white text-sm font-bold" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>שינוי רמה</button>
                <button onClick={() => setStep('teams')} className="px-4 py-2 rounded-xl text-white text-sm font-bold" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>ניהול קבוצות</button>
                <button onClick={finishGame} className="px-4 py-2 rounded-xl text-black text-sm font-black" style={{ background: 'linear-gradient(135deg,#ffd700,#ff9500)' }}>🏆 פודיום</button>
                <button onClick={onBack} className="px-4 py-2 rounded-xl text-white text-sm font-bold" style={{ background: 'rgba(214,51,99,0.7)', border: '1px solid rgba(214,51,99,0.5)' }}>חזרה</button>
              </div>
              <p className="text-purple-300 text-xs">שינוי רמה מאפס את הלוח והניקוד.</p>
            </div>
            {/* Leader */}
            <div className="rounded-2xl p-5 flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#1e1b4b,#2d2a5e)', border: '1px solid rgba(255,215,0,0.2)' }}>
              <div className="text-center space-y-1">
                <p className="text-purple-300 text-sm font-bold">👑 מוביל/ה</p>
                <p className="text-2xl font-black text-yellow-300" style={{ textShadow: '0 0 16px rgba(255,215,0,0.6)' }}>{leadingTeam?.name ?? '—'}</p>
                <p className="text-white font-bold text-xl">{leadingTeam?.score ?? 0} נק'</p>
              </div>
            </div>
          </div>

          {/* Categories board */}
          <div
            className="rounded-3xl p-5"
            style={{ background: 'linear-gradient(145deg,#0a0820,#1a1640)', border: '2px solid rgba(255,215,0,0.25)', boxShadow: '0 0 60px rgba(0,0,0,0.6) inset' }}
          >
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${categories.length}, minmax(0,1fr))` }}>
              {/* Category headers */}
              {categories.map((cat, catIdx) => (
                <div
                  key={cat.name + '-header'}
                  className={`rounded-2xl px-3 py-4 text-center font-black text-white text-sm sm:text-base leading-tight shadow-lg bg-gradient-to-b ${cat.color}`}
                  style={{ minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.5)', textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}
                >
                  {cat.name}
                </div>
              ))}
              {/* Question tiles — row by row */}
              {Array.from({ length: 5 }).map((_, qIdx) =>
                categories.map((cat, catIdx) => {
                  const q = cat.questions[qIdx];
                  if (!q) return <div key={`empty-${catIdx}-${qIdx}`} />;
                  const qKey = keyFor(catIdx, qIdx);
                  const isAnswered = answered.has(qKey);
                  const status = results[qKey];
                  return (
                    <button
                      key={qKey}
                      onClick={() => openQuestion(catIdx, qIdx)}
                      disabled={isAnswered}
                      className="flex flex-col items-center justify-center rounded-2xl font-black transition-all duration-200 select-none"
                      style={{
                        minHeight: '90px',
                        fontSize: '1.4rem',
                        ...(status === 'correct'
                          ? { background: 'linear-gradient(135deg,#064e3b,#10b981)', border: '2px solid #34d399', color: '#6ee7b7', boxShadow: '0 0 16px rgba(16,185,129,0.4)' }
                          : status === 'incorrect'
                          ? { background: 'linear-gradient(135deg,#450a0a,#dc2626)', border: '2px solid #f87171', color: '#fca5a5', boxShadow: '0 0 16px rgba(239,68,68,0.4)' }
                          : isAnswered
                          ? { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.2)', cursor: 'not-allowed' }
                          : { background: 'linear-gradient(145deg,#1e3a5f,#1e1b4b)', border: '2px solid rgba(255,215,0,0.35)', color: '#ffd700', boxShadow: '0 4px 16px rgba(0,0,0,0.4)', cursor: 'pointer' })
                      }}
                      onMouseEnter={e => { if (!isAnswered) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.06)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 28px rgba(255,215,0,0.5)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = ''; (e.currentTarget as HTMLButtonElement).style.boxShadow = isAnswered ? 'none' : '0 4px 16px rgba(0,0,0,0.4)'; }}
                    >
                      {status === 'correct' ? '✅' : status === 'incorrect' ? '❌' : (
                        <span style={{ textShadow: '0 0 12px rgba(255,215,0,0.7)' }}>₪{q.value}</span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {step === 'results' && (
        <div
          className="rounded-3xl p-8 shadow-2xl space-y-6 text-center"
          style={{ background: 'linear-gradient(145deg,#0f0c29 0%,#302b63 55%,#24243e 100%)', border: '2px solid rgba(255,215,0,0.45)' }}
        >
          <div className="space-y-2">
            <p className="text-6xl animate-bounce">🏆</p>
            <h2 className="text-5xl font-black text-white" style={{ textShadow: '0 0 32px rgba(255,215,0,0.8)' }}>תוצאות סופיות!</h2>
            <p className="text-purple-300 text-lg">שיחקתם {answeredCount} שאלות ברמת {difficulty}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {podium.map((team, idx) => {
              const medals = ['🥇','🥈','🥉'];
              const styles = [
                { background: 'linear-gradient(145deg,#854d0e,#ca8a04)', border: '2px solid #fbbf24', boxShadow: '0 0 40px rgba(251,191,36,0.5)' },
                { background: 'linear-gradient(145deg,#374151,#6b7280)', border: '2px solid #9ca3af' },
                { background: 'linear-gradient(145deg,#7c2d12,#c2410c)', border: '2px solid #fb923c' },
              ];
              return (
                <div key={team.name + idx} className="rounded-2xl p-6 space-y-2" style={styles[idx] || styles[2]}>
                  <p className="text-5xl">{medals[idx]}</p>
                  <p className="text-xl font-black text-white" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>{team.name}</p>
                  <p className="text-3xl font-black" style={{ color: '#ffd700', textShadow: '0 0 16px rgba(255,215,0,0.7)' }}>{team.score} נק'</p>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between items-center">
            <button onClick={onBack} className="px-5 py-2.5 rounded-xl font-bold text-white" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>סיום</button>
            <div className="flex gap-3">
              <button onClick={() => setStep('board')} className="px-5 py-2.5 rounded-xl font-bold text-white" style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)' }}>חזרה למשחק</button>
              <button onClick={resetGame} className="px-6 py-3 rounded-2xl font-black text-black transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg,#ffd700,#ff9500)', boxShadow: '0 0 28px rgba(255,215,0,0.55)' }}>🔄 סבב חדש!</button>
            </div>
          </div>
        </div>
      )}

      {activeQuestion && active !== null && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-3 py-4" style={{ background: 'rgba(10,8,32,0.88)', backdropFilter: 'blur(10px)' }}>
          <div
            className="rounded-3xl p-7 w-full shadow-2xl animate-fade-in space-y-5"
            style={{
              maxWidth: '860px',
              background: 'linear-gradient(145deg,#1e1b4b 0%,#312e81 50%,#5b21b6 100%)',
              border: '2px solid rgba(255,215,0,0.4)',
              boxShadow: '0 0 80px rgba(124,58,237,0.4), 0 0 40px rgba(255,215,0,0.15)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <span className="font-black text-white text-xl" style={{ textShadow: '0 0 16px rgba(255,215,0,0.5)' }}>{categories[active.cat].name}</span>
                <span className="px-3 py-1 rounded-full text-sm font-bold text-purple-200" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>סוג: {activeQuestion.type}</span>
              </div>
              <span
                className="px-6 py-2 rounded-full text-xl font-black text-black"
                style={{ background: 'linear-gradient(135deg,#ffd700,#ff9500)', boxShadow: '0 0 24px rgba(255,215,0,0.7)', border: '1px solid #fbbf24' }}
              >
                💰 {activeQuestion.value} נק'
              </span>
            </div>

            {/* Question box */}
            <div
              className="rounded-2xl px-6 py-5"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,215,0,0.25)', boxShadow: '0 0 20px rgba(124,58,237,0.2) inset' }}
            >
              <p className="text-2xl font-bold text-white leading-relaxed" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>{activeQuestion.prompt}</p>
            </div>
            {activeQuestion.instruction && (
              <p className="text-yellow-300 text-sm font-semibold">💡 {activeQuestion.instruction}</p>
            )}

            {/* Match type */}
            {activeQuestion.type === 'match' && activeQuestion.matchLeft && activeQuestion.matchRight && activeQuestion.value === 300 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-right">
                <div className="lg:col-span-2 space-y-2">
                  <p className="font-bold text-purple-200 text-sm">גררו הגדרות למושגים ואז לחצו הגש</p>
                  {activeQuestion.matchLeft.map((item, idx) => {
                    const assignedRightIdx = matchMapping[idx];
                    const assignedLabel = assignedRightIdx !== undefined && assignedRightIdx >= 0 ? activeQuestion.matchRight![assignedRightIdx] : 'גררו לכאן';
                    return (
                      <div key={item + idx} className="rounded-xl px-4 py-3 flex items-center justify-between gap-2" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
                        <span className="font-bold text-white">{item}</span>
                        <div
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => { e.preventDefault(); const rightIdx = Number(e.dataTransfer.getData('text/plain')); handleMatchDrop(idx, rightIdx); }}
                          className="flex-1 text-left rounded-lg px-3 py-2 transition-all"
                          style={assignedRightIdx >= 0
                            ? { background: 'rgba(16,185,129,0.25)', border: '1px solid rgba(16,185,129,0.5)', color: '#6ee7b7' }
                            : { background: 'rgba(255,255,255,0.04)', border: '1px dashed rgba(255,215,0,0.3)', color: 'rgba(255,255,255,0.4)' }}
                        >
                          {assignedLabel}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="space-y-2">
                  <p className="font-bold text-purple-200 text-sm">הגדרות לגרירה</p>
                  {activeQuestion.matchRight.map((item, idx) => {
                    const isAssigned = matchMapping.includes(idx);
                    return (
                      <button
                        key={item + idx}
                        draggable={!isAssigned}
                        onDragStart={(e) => { e.dataTransfer.setData('text/plain', String(idx)); setDraggingIdx(idx); }}
                        onDragEnd={() => setDraggingIdx(null)}
                        className="w-full text-right rounded-xl px-3 py-2.5 transition-all font-semibold"
                        style={isAssigned
                          ? { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.25)', cursor: 'not-allowed', border: '1px solid rgba(255,255,255,0.08)' }
                          : { background: 'rgba(255,215,0,0.12)', color: '#fff', border: '1px solid rgba(255,215,0,0.3)', cursor: 'grab' }}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {/* Numeric input for 400pt */}
            {activeQuestion.value === 400 && (
              <div className="space-y-2">
                <p className="font-bold text-purple-200">כתבו את התשובה</p>
                <input
                  value={typedAnswer}
                  onChange={(e) => setTypedAnswer(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="התשובה שלכם"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="w-full rounded-xl px-4 py-3 text-xl text-white font-bold focus:outline-none"
                  style={{ background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(255,215,0,0.4)', boxShadow: '0 0 16px rgba(255,215,0,0.1) inset' }}
                />
              </div>
            )}

            {/* Open / manual judge */}
            {activeQuestion.type === 'open' || (activeQuestion.type === 'match' && activeQuestion.value !== 300) ? (
              <div className="flex flex-wrap justify-end gap-3">
                <button
                  onClick={() => activeQuestion.value === 400 ? handleTypedSubmit() : submitAnswer(undefined, true)}
                  className="px-6 py-3 rounded-2xl font-black text-white text-lg transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg,#10b981,#059669)', boxShadow: '0 0 20px rgba(16,185,129,0.55)' }}
                >
                  {activeQuestion.value === 400 ? '✅ הגש תשובה' : '✅ נכון'}
                </button>
                <button
                  onClick={() => submitAnswer(undefined, false)}
                  className="px-6 py-3 rounded-2xl font-black text-white text-lg transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg,#ef4444,#b91c1c)', boxShadow: '0 0 20px rgba(239,68,68,0.55)' }}
                >❌ טעות</button>
              </div>
            ) : activeQuestion.type !== 'match' ? (
              <div className="space-y-2">
                {activeQuestion.options.map((opt, idx) => (
                  <button
                    key={opt + idx}
                    onClick={() => submitAnswer(idx)}
                    className="w-full text-right rounded-2xl px-5 py-3.5 text-lg font-bold text-white transition-all hover:scale-[1.02]"
                    style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,215,0,0.2)', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,215,0,0.18)'; (e.currentTarget as HTMLButtonElement).style.border = '1px solid rgba(255,215,0,0.5)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLButtonElement).style.border = '1px solid rgba(255,215,0,0.2)'; }}
                  >
                    {opt || '✔ סימון ידני / תשובה פתוחה'}
                  </button>
                ))}
              </div>
            ) : null}

            {/* Match submit */}
            {activeQuestion.type === 'match' && activeQuestion.value === 300 && (
              <div className="flex flex-wrap justify-end gap-3">
                <button
                  onClick={handleMatchSubmit}
                  disabled={!(matchMapping.length > 0 && matchMapping.every(v => v >= 0))}
                  className="px-6 py-3 rounded-2xl font-black text-white text-lg transition-all hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={matchMapping.length > 0 && matchMapping.every(v => v >= 0)
                    ? { background: 'linear-gradient(135deg,#7c3aed,#a78bfa)', boxShadow: '0 0 20px rgba(124,58,237,0.55)' }
                    : { background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}
                >✅ הגש התאמות</button>
                <button onClick={() => setActive(null)} className="px-5 py-3 rounded-2xl font-bold text-white" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>סגירה</button>
              </div>
            )}

            {activeQuestion.type !== 'match' && (
              <div className="flex justify-end">
                <button onClick={() => setActive(null)} className="px-5 py-2.5 rounded-xl font-bold text-white" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>סגירה</button>
              </div>
            )}
          </div>
        </div>
      )}

      {feedback && (
        <div
          className="mt-2 rounded-2xl p-4 text-xl font-bold text-center"
          style={{ background: 'linear-gradient(135deg,#1e1b4b,#312e81)', border: '1px solid rgba(255,215,0,0.3)', color: '#ffd700', boxShadow: '0 0 20px rgba(255,215,0,0.15)' }}
        >
          {feedback}
        </div>
      )}

      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-6 py-4 rounded-2xl shadow-2xl text-lg font-black transition-all`}
          style={toast.type === 'success'
            ? { background: 'linear-gradient(135deg,#10b981,#059669)', color: '#fff', border: '2px solid #34d399', boxShadow: '0 0 24px rgba(16,185,129,0.5)' }
            : { background: 'linear-gradient(135deg,#ef4444,#b91c1c)', color: '#fff', border: '2px solid #f87171', boxShadow: '0 0 24px rgba(239,68,68,0.5)' }}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default JeopardyModule;
