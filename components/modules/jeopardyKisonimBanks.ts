import { Category, Difficulty } from './JeopardyModule';

const palette: string[] = [
  'from-[#ff7c7c] to-[#ffb347]',
  'from-[#6a5acd] to-[#b19cd9]',
  'from-[#2f855a] to-[#9ae6b4]',
  'from-[#ff9f43] to-[#feca57]',
  'from-[#4b6cb7] to-[#182848]',
  'from-[#f53844] to-[#42378f]',
];

export const jeopardyKisonimBanks: Record<Difficulty, Category[]> = {
  'קל': [
    {
      name: 'מאיפה בא הכסף?',
      color: palette[0],
      questions: [
        { value: 100, prompt: 'אמת/שקר: כסף מגיע רק ממכונות הדפסה בבנק ישראל.', options: ['אמת', 'שקר'], correct: 1, type: 'multiple', instruction: 'אמת/שקר', correctText: 'שקר. כסף מגיע מעבודה, מתנות ועוד.' },
        { value: 200, prompt: 'איזו דוגמה להכנסה לילדים?', options: ['דמי כיס', 'תשלום חשמל', 'קניית צעצוע'], correct: 0, type: 'multiple', instruction: 'אמריקאי', correctText: 'דמי כיס.' },
        { value: 300, prompt: 'התאימו: מקור הכנסה ↔ דוגמה', options: [''], correct: 0, type: 'match', instruction: 'חברו מקור לדוגמה', matchLeft: ['עבודה', 'מתנה', 'מכירה'], matchRight: ['דמי כיס על מטלות', 'כסף ליומולדת', 'מכירת צעצוע ישן'], correctText: '1-ב, 2-ג, 3-א.' },
        { value: 400, prompt: 'חישוב: קיבלתם 20 ש"ח דמי כיס ועוד 10 ש"ח מתנה. כמה כסף יש לכם?', options: [''], correct: 0, type: 'open', instruction: 'חיבור פשוט', correctText: '30 ש"ח.' },
        { value: 500, prompt: 'פתוחה: שם פעולה אחת שילדים יכולים לעשות כדי להרוויח קצת כסף.', options: [''], correct: 0, type: 'open', correctText: 'למשל: לעזור בשכונה, בייביסיטר קצר או מכירת מאפה.' },
      ],
    },
    {
      name: 'צרכים ורצונות',
      color: palette[1],
      questions: [
        { value: 100, prompt: 'אמת/שקר: גלידה היא צורך בסיסי.', options: ['אמת', 'שקר'], correct: 1, type: 'multiple', instruction: 'אמת/שקר', correctText: 'שקר. גלידה היא רצון.' },
        { value: 200, prompt: 'מהו צורך?', options: ['משהו שחייבים כדי לחיות', 'דבר שרוצים כי הוא מגניב', 'קישוט לחדר'], correct: 0, type: 'multiple', instruction: 'אמריקאי', correctText: 'משהו שחייבים כדי לחיות או להרגיש בטוח.' },
        { value: 300, prompt: 'התאימו: צורך/רצון ↔ דוגמה', options: [''], correct: 0, type: 'match', instruction: 'חברו כל סעיף לדוגמה', matchLeft: ['צורך', 'רצון', 'חיסכון'], matchRight: ['מים ואוכל', 'משחק חדש', 'כסף לעתיד'], correctText: '1-ב, 2-ג, 3-א.' },
        { value: 400, prompt: 'חישוב: יש 30 ש"ח. צריך מחברת ב-15 ש"ח ורוצה צעצוע ב-20 ש"ח. מה אפשר לקנות?', options: [''], correct: 0, type: 'open', instruction: 'בחירה בתקציב', correctText: 'אפשר המחברת בטוח, הצעצוע לא מספיק. או לחכות ולחסוך.' },
        { value: 500, prompt: 'פתוחה: איך תחליטו אם משהו הוא צורך או רצון?', options: [''], correct: 0, type: 'open', correctText: 'שואלים אם חייבים עכשיו או שאפשר לדחות/בלי זה מסתדרים.' },
      ],
    },
    {
      name: 'הרפתקת חיסכון',
      color: palette[2],
      questions: [
        { value: 100, prompt: 'אמת/שקר: חיסכון קטן וקבוע מצטבר לסכום גדול.', options: ['אמת', 'שקר'], correct: 0, type: 'multiple', instruction: 'אמת/שקר', correctText: 'אמת.' },
        { value: 200, prompt: 'מה עוזר לחסוך טוב יותר?', options: ['להגדיר מטרה', 'לבזבז מיד', 'לא לחשוב על זה'], correct: 0, type: 'multiple', instruction: 'אמריקאי', correctText: 'להגדיר מטרה.' },
        { value: 300, prompt: 'התאימו: כלי חיסכון ↔ שימוש', options: [''], correct: 0, type: 'match', instruction: 'חברו כלי לשימוש', matchLeft: ['קופה', 'טבלה', 'מטרה'], matchRight: ['מקום לשים כסף פיזי', 'מעקב אחרי סכומים', 'יעד שמדרבן לחסוך'], correctText: '1-ב, 2-ג, 3-א.' },
        { value: 400, prompt: 'חישוב: חוסכים 5 ש"ח בשבוע למשך 6 שבועות. כמה חיסכון?', options: [''], correct: 0, type: 'open', instruction: 'כפל', correctText: '30 ש"ח.' },
        { value: 500, prompt: 'פתוחה: ציינו רעיון אחד לחסוך מבלי לוותר על כיף.', options: [''], correct: 0, type: 'open', correctText: 'למשל: לבחור בילוי חינמי במקום יקר פעם בשבוע.' },
      ],
    },
    {
      name: 'חנות הקסמים',
      color: palette[3],
      questions: [
        { value: 100, prompt: 'אמת/שקר: כדאי להשוות מחירים גם בחנות צעצועים.', options: ['אמת', 'שקר'], correct: 0, type: 'multiple', instruction: 'אמת/שקר', correctText: 'אמת.' },
        { value: 200, prompt: 'מה עושים לפני קנייה?', options: ['בודקים מחיר ומשווים', 'קונים מיד', 'מבקשים שתיים'], correct: 0, type: 'multiple', instruction: 'אמריקאי', correctText: 'בודקים ומשווים.' },
        { value: 300, prompt: 'התאימו: סוג מבצע ↔ פירוש', options: [''], correct: 0, type: 'match', instruction: 'חברו מבצע למשמעות', matchLeft: ['1+1', 'הנחה 10%', 'מתנה ברכישה'], matchRight: ['מקבלים שניים במחיר אחד', 'משלמים קצת פחות', 'מוצר קטן נוסף'], correctText: '1-ב, 2-ג, 3-א.' },
        { value: 400, prompt: 'חישוב: צעצוע עולה 25 ש"ח. יש 10% הנחה. כמה ישלם?', options: [''], correct: 0, type: 'open', instruction: 'אחוזים פשוטים', correctText: '22.5 ש"ח (≈23).'},
        { value: 500, prompt: 'פתוחה: איך מזהים פרסומת שמנסה לגרום לנו לקנות מהר?', options: [''], correct: 0, type: 'open', correctText: 'למשל: "רק היום", טיימר, צבע אדום, לחץ זמן.' },
      ],
    },
    {
      name: 'בנק הקופות',
      color: palette[4],
      questions: [
        { value: 100, prompt: 'אמת/שקר: קופה שמחולקת לתאים יכולה לעזור לחסוך למטרות שונות.', options: ['אמת', 'שקר'], correct: 0, type: 'multiple', instruction: 'אמת/שקר', correctText: 'אמת.' },
        { value: 200, prompt: 'למה מחלקים כסף לכמה תאים?', options: ['כדי לדעת כמה לכל מטרה', 'כדי לאבד כסף', 'כדי לא להשתמש בו'], correct: 0, type: 'multiple', instruction: 'אמריקאי', correctText: 'כדי לשלוט בכמה לכל מטרה.' },
        { value: 300, prompt: 'התאימו: תא קופה ↔ דוגמה', options: [''], correct: 0, type: 'match', instruction: 'חברו תא למטרה', matchLeft: ['חיסכון', 'נדבה', 'כיף'], matchRight: ['כסף לעתיד', 'כסף לעזרה לאחרים', 'כסף לבילוי'], correctText: '1-ב, 2-ג, 3-א.' },
        { value: 400, prompt: 'חישוב: יש 12 ש"ח בתא חיסכון ו-8 ש"ח בתא כיף. כמה סה"כ?', options: [''], correct: 0, type: 'open', instruction: 'חיבור', correctText: '20 ש"ח.' },
        { value: 500, prompt: 'פתוחה: רעיון למטרה שתשימו בתא חיסכון.', options: [''], correct: 0, type: 'open', correctText: 'למשל: אופניים, משחק גדול, טיול כיתה.' },
      ],
    },
    {
      name: 'סיור עולמי',
      color: palette[5],
      questions: [
        { value: 100, prompt: 'אמת/שקר: בכל מדינה משתמשים באותו המטבע.', options: ['אמת', 'שקר'], correct: 1, type: 'multiple', instruction: 'אמת/שקר', correctText: 'שקר. יש מטבעות שונים.' },
        { value: 200, prompt: 'מהו דולר?', options: ['מטבע של ארה"ב', 'צעצוע', 'שם של סלט'], correct: 0, type: 'multiple', instruction: 'אמריקאי', correctText: 'מטבע של ארה"ב.' },
        { value: 300, prompt: 'התאימו: מדינה ↔ מטבע', options: [''], correct: 0, type: 'match', instruction: 'חברו מדינה למטבע', matchLeft: ['ישראל', 'ארה"ב', 'אירופה (איחוד)'], matchRight: ['שקל', 'דולר', 'אירו'], correctText: '1-ב, 2-ג, 3-א.' },
        { value: 400, prompt: 'חישוב: יש 10 שקלים ו-1 דולר ששווה 3.5 שקלים. כמה כסף בשקלים?', options: [''], correct: 0, type: 'open', instruction: 'חיבור והמרה', correctText: '13.5 ש"ח.' },
        { value: 500, prompt: 'פתוחה: מה חשוב לזכור כשנוסעים לחו"ל לגבי כסף?', options: [''], correct: 0, type: 'open', correctText: 'להמיר למטבע מקומי ולדעת מחירים.' },
      ],
    },
  ],
  'בינוני': [
    {
      name: 'מאיפה בא הכסף?',
      color: palette[0],
      questions: [
        { value: 100, prompt: 'אמת/שקר: עבודה היא הדרך היחידה לקבל כסף.', options: ['אמת', 'שקר'], correct: 1, type: 'multiple', instruction: 'אמת/שקר', correctText: 'שקר. יש גם מתנות, מלגות, מכירה ועוד.' },
        { value: 200, prompt: 'מה ההבדל בין הכנסה קבועה למזדמנת?', options: ['קבועה חוזרת כל חודש, מזדמנת לא בטוח', 'אין הבדל', 'מזדמנת תמיד גדולה יותר'], correct: 0, type: 'multiple', instruction: 'אמריקאי', correctText: 'קבועה חוזרת, מזדמנת לא בטוח.' },
        { value: 300, prompt: 'התאימו: מקור ↔ מאפיין', options: [''], correct: 0, type: 'match', instruction: 'חברו מקור למאפיין', matchLeft: ['דמי כיס', 'בייביסיטר', 'מכירת חפצים'], matchRight: ['הורה נותן קבוע', 'הכנסה לפי שעות', 'תלוי כמה מוכרים'], correctText: '1-ב, 2-א, 3-ג.' },
        { value: 400, prompt: 'חישוב: קיבלתם 30 ש"ח דמי כיס ו-25 ש"ח משמירה. כמה יחד?', options: [''], correct: 0, type: 'open', instruction: 'חיבור', correctText: '55 ש"ח.' },
        { value: 500, prompt: 'פתוחה: רעיון לבקשת תשלום הוגן על עזרה בבית/בקהילה.', options: [''], correct: 0, type: 'open', correctText: 'להציע משימה, זמן ועלות סבירה מראש.' },
      ],
    },
    {
      name: 'צרכים ורצונות',
      color: palette[1],
      questions: [
        { value: 100, prompt: 'אמת/שקר: צורך יכול להפוך לרצון עם הזמן.', options: ['אמת', 'שקר'], correct: 1, type: 'multiple', instruction: 'אמת/שקר', correctText: 'שקר. רצון אולי נהיה חשוב, אבל צורך נשאר בסיסי.' },
        { value: 200, prompt: 'מה שאלה טובה לפני קנייה?', options: ['האם אני באמת צריך את זה עכשיו?', 'איזה צבע זה?', 'האם החברים שלי קנו?'], correct: 0, type: 'multiple', instruction: 'אמריקאי', correctText: 'לשאול אם באמת צריך עכשיו.' },
        { value: 300, prompt: 'התאימו: החלטה ↔ השפעה', options: [''], correct: 0, type: 'match', instruction: 'חברו החלטה להשפעה', matchLeft: ['קונה מיד', 'מחכה שבוע', 'חוסך'], matchRight: ['אולי מצטער על בזבוז', 'בודק אם באמת רוצה', 'מגדיל כסף לעתיד'], correctText: '1-ב, 2-ג, 3-א.' },
        { value: 400, prompt: 'חישוב: יש 60 ש"ח. צורך ב-30 ש"ח, רצון ב-40 ש"ח. מה נשאר אם קונים רק צורך?', options: [''], correct: 0, type: 'open', instruction: 'חיסור', correctText: '30 ש"ח.' },
        { value: 500, prompt: 'פתוחה: איך אפשר לשלב רצון בתקציב בלי לפגוע בחיסכון?', options: [''], correct: 0, type: 'open', correctText: 'להקצות חלק קטן לרצונות אחרי שחיסכון וחובה מכוסים.' },
      ],
    },
    {
      name: 'הרפתקת חיסכון',
      color: palette[2],
      questions: [
        { value: 100, prompt: 'אמת/שקר: יעד ברור גורם לחיסכון להיות קל יותר.', options: ['אמת', 'שקר'], correct: 0, type: 'multiple', instruction: 'אמת/שקר', correctText: 'אמת.' },
        { value: 200, prompt: 'מהו יעד קצר טווח?', options: ['משהו לחודש-שלושה חודשים', 'משהו לשנים קדימה', 'משהו לסוף היום בלבד'], correct: 0, type: 'multiple', instruction: 'אמריקאי', correctText: 'עד כמה חודשים.' },
        { value: 300, prompt: 'התאימו: כלי ↔ יתרון', options: [''], correct: 0, type: 'match', instruction: 'חברו כלי ליתרון', matchLeft: ['קופה מחולקת', 'אפליקציה פשוטה', 'טבלת נייר'], matchRight: ['עוזרת לשים לפי מטרות', 'תזכורות והתראות', 'קל לצייר ולהבין'], correctText: '1-ב, 2-ג, 3-א.' },
        { value: 400, prompt: 'חישוב: חוסכים 12 ש"ח בשבוע 8 שבועות. כמה יש?', options: [''], correct: 0, type: 'open', instruction: 'כפל', correctText: '96 ש"ח.' },
        { value: 500, prompt: 'פתוחה: מה עושים אם קשה להתמיד בחיסכון?', options: [''], correct: 0, type: 'open', correctText: 'לקבוע תזכורת, לבקש חבר שיזכיר, להתחיל בסכום קטן יותר.' },
      ],
    },
    {
      name: 'חנות הקסמים',
      color: palette[3],
      questions: [
        { value: 100, prompt: 'אמת/שקר: שלטי "רק היום" נועדו לגרום לנו לקנות מהר.', options: ['אמת', 'שקר'], correct: 0, type: 'multiple', instruction: 'אמת/שקר', correctText: 'אמת.' },
        { value: 200, prompt: 'מהי דרך לבדוק אם מבצע באמת משתלם?', options: ['להשוות מחיר ליחידה', 'לשאול חבר', 'לקנות מהר'], correct: 0, type: 'multiple', instruction: 'אמריקאי', correctText: 'להשוות ליחידה.' },
        { value: 300, prompt: 'התאימו: פרסומת ↔ סימן', options: [''], correct: 0, type: 'match', instruction: 'חברו פרסומת לסימן', matchLeft: ['הטבה ענקית', 'טיימר ספירה', 'חבילה גדולה'], matchRight: ['אולי עוגן מחיר', 'לחץ זמן', 'לא בטוח זול יותר ליחידה'], correctText: '1-ב, 2-א, 3-ג.' },
        { value: 400, prompt: 'חישוב: מוצר ב-30 ש"ח. מבצע: השני בחצי מחיר. כמה עולים שניים?', options: [''], correct: 0, type: 'open', instruction: 'חישוב פשוט', correctText: '45 ש"ח.' },
        { value: 500, prompt: 'פתוחה: מה אפשר לשאול את עצמנו לפני קנייה אימפולסיבית?', options: [''], correct: 0, type: 'open', correctText: 'האם אני באמת צריך? האם חיכיתי יום? האם יש זול יותר?' },
      ],
    },
    {
      name: 'בנק הקופות',
      color: palette[4],
      questions: [
        { value: 100, prompt: 'אמת/שקר: לחסוך לכמה מטרות יחד עוזר להתקדם בהדרגה.', options: ['אמת', 'שקר'], correct: 0, type: 'multiple', instruction: 'אמת/שקר', correctText: 'אמת.' },
        { value: 200, prompt: 'מה היתרון בחלוקת כסף ל"חיסכון", "כיף" ו"נתינה"?', options: ['שקיפות ושליטה במטרות', 'אין יתרון', 'מבזבזים יותר'], correct: 0, type: 'multiple', instruction: 'אמריקאי', correctText: 'יודעים כמה לכל מטרה.' },
        { value: 300, prompt: 'התאימו: מטרה ↔ פעולה', options: [''], correct: 0, type: 'match', instruction: 'חברו מטרה לפעולה', matchLeft: ['חיסכון', 'כיף', 'נתינה'], matchRight: ['להגדיל סכום לעתיד', 'ליהנות ללא אשמה', 'לעזור לאחרים'], correctText: '1-ב, 2-ג, 3-א.' },
        { value: 400, prompt: 'חישוב: בתא חיסכון 40 ש"ח, כיף 18 ש"ח, נתינה 12 ש"ח. כמה סה"כ?', options: [''], correct: 0, type: 'open', instruction: 'חיבור', correctText: '70 ש"ח.' },
        { value: 500, prompt: 'פתוחה: רעיון לחלוקת אחוזים בין התאים.', options: [''], correct: 0, type: 'open', correctText: 'לדוגמה: 50% חיסכון, 30% כיף, 20% נתינה.' },
      ],
    },
    {
      name: 'סיור עולמי',
      color: palette[5],
      questions: [
        { value: 100, prompt: 'אמת/שקר: שיעור החלפה אומר כמה מטבע אחד שווה במטבע אחר.', options: ['אמת', 'שקר'], correct: 0, type: 'multiple', instruction: 'אמת/שקר', correctText: 'אמת.' },
        { value: 200, prompt: 'מה צריך לעשות לפני שקונים בחו"ל?', options: ['לדעת כמה המטבע שווה', 'לא לבדוק כלום', 'להמר במחיר'], correct: 0, type: 'multiple', instruction: 'אמריקאי', correctText: 'לדעת ערך מטבע.' },
        { value: 300, prompt: 'התאימו: מושג ↔ הסבר', options: [''], correct: 0, type: 'match', instruction: 'חברו מושג להסבר', matchLeft: ['שקל', 'דולר', 'אירו'], matchRight: ['מטבע ישראל', 'מטבע ארה"ב', 'מטבע האיחוד האירופי'], correctText: '1-ב, 2-ג, 3-א.' },
        { value: 400, prompt: 'חישוב: 2 יורו, שער 4 ש"ח ליורו. כמה זה בשקלים?', options: [''], correct: 0, type: 'open', instruction: 'כפל', correctText: '8 ש"ח.' },
        { value: 500, prompt: 'פתוחה: למה מחירים שונים במדינות שונות?', options: [''], correct: 0, type: 'open', correctText: 'עלויות ייצור, מסים, שכר מקומי והובלה.' },
      ],
    },
  ],
  'מאתגר': [
    {
      name: 'מאיפה בא הכסף?',
      color: palette[0],
      questions: [
        { value: 100, prompt: 'אמת/שקר: גם תרומה של זמן יכולה להפוך למקור הכנסה עקיף.', options: ['אמת', 'שקר'], correct: 0, type: 'multiple', instruction: 'אמת/שקר', correctText: 'אמת (יוצרת הזדמנויות).' },
        { value: 200, prompt: 'מהו "ערך תמורה" בעבודה?', options: ['מה שאני נותן ומה שמקבל חזרה', 'רק השכר', 'רק הכיף'], correct: 0, type: 'multiple', instruction: 'אמריקאי', correctText: 'השילוב של תרומה ותמורה.' },
        { value: 300, prompt: 'התאימו: סוג הכנסה ↔ תכנון', options: [''], correct: 0, type: 'match', instruction: 'חברו סוג לתכנון', matchLeft: ['קבועה', 'משתנה', 'חד-פעמית'], matchRight: ['להכניס לתקציב חודשי קבוע', 'לשמור בופר כי לא בטוח', 'להחליט מראש אם לחסוך/להקדיש'], correctText: '1-ב, 2-א, 3-ג.' },
        { value: 400, prompt: 'חישוב: שלושה מקורות: 40, 25, 15 ש"ח. כמה יחד?', options: [''], correct: 0, type: 'open', instruction: 'חיבור', correctText: '80 ש"ח.' },
        { value: 500, prompt: 'פתוחה: איך הייתם מסבירים לחבר למה אין דבר כזה כסף "חינם"?', options: [''], correct: 0, type: 'open', correctText: 'תמיד יש זמן/מאמץ/תנאי כלשהו שמישהו משלם או נותן.' },
      ],
    },
    {
      name: 'צרכים ורצונות',
      color: palette[1],
      questions: [
        { value: 100, prompt: 'אמת/שקר: דחיית סיפוקים עוזרת לחסוך.', options: ['אמת', 'שקר'], correct: 0, type: 'multiple', instruction: 'אמת/שקר', correctText: 'אמת.' },
        { value: 200, prompt: 'מהי שאלה נכונה לפני הוצאה?', options: ['מה הערך שאקבל ומה אפסיד?', 'איזה צבע הכי יפה?', 'כמה חברים יש לי?'], correct: 0, type: 'multiple', instruction: 'אמריקאי', correctText: 'לבחון ערך מול עלות.' },
        { value: 300, prompt: 'התאימו: מצב ↔ החלטה', options: [''], correct: 0, type: 'match', instruction: 'חברו מצב להחלטה', matchLeft: ['תקציב צפוף', 'יעד חיסכון חשוב', 'אין דחיפות'], matchRight: ['לדחות רצונות', 'להקצות עוד לחיסכון', 'לחכות ולבדוק שוב'], correctText: '1-ב, 2-ג, 3-א.' },
        { value: 400, prompt: 'חישוב: רוצים מוצר ב-90 ש"ח. יש 50 ש"ח עכשיו וחיסכון חודשי 10 ש"ח. כמה חודשים עד שתקנו?', options: [''], correct: 0, type: 'open', instruction: 'חיסור וחלוקה', correctText: 'כ-4 חודשים (40 חסר /10 לחודש).' },
        { value: 500, prompt: 'פתוחה: תנו דוגמה לרצון שהפך לצורך אמיתי אצלכם.', options: [''], correct: 0, type: 'open', correctText: 'למשל: מחשב ללימודים מרחוק.' },
      ],
    },
    {
      name: 'הרפתקת חיסכון',
      color: palette[2],
      questions: [
        { value: 100, prompt: 'אמת/שקר: חיסכון אוטומטי (קבוע) מקל על התמדה.', options: ['אמת', 'שקר'], correct: 0, type: 'multiple', instruction: 'אמת/שקר', correctText: 'אמת.' },
        { value: 200, prompt: 'מהי ריבית?', options: ['תוספת שמקבלים על כסף שחוסכים בבנק', 'קנס על חיסכון', 'משהו סודי'], correct: 0, type: 'multiple', instruction: 'אמריקאי', correctText: 'תוספת שמקבלים על כסף שחוסכים או משלמים על הלוואה.' },
        { value: 300, prompt: 'התאימו: כלי ↔ יתרון', options: [''], correct: 0, type: 'match', instruction: 'חברו כלי ליתרון', matchLeft: ['קופה מחולקת', 'חיסכון בבנק', 'יעד כתוב'], matchRight: ['נותן סדר למטרות', 'יכול לצבור ריבית', 'מזכיר למה חוסכים'], correctText: '1-ב, 2-א, 3-ג.' },
        { value: 400, prompt: 'חישוב: חיסכון שבועי 15 ש"ח ל-10 שבועות. כמה בסוף?', options: [''], correct: 0, type: 'open', instruction: 'כפל', correctText: '150 ש"ח.' },
        { value: 500, prompt: 'פתוחה: איך תעודדו חבר שמתקשה לחסוך?', options: [''], correct: 0, type: 'open', correctText: 'להתחיל בקטן, יעד ברור, לוודא חיזוקים קטנים בדרך.' },
      ],
    },
    {
      name: 'חנות הקסמים',
      color: palette[3],
      questions: [
        { value: 100, prompt: 'אמת/שקר: השוואת מחיר ליחידה מגלה אם חבילה גדולה באמת משתלמת.', options: ['אמת', 'שקר'], correct: 0, type: 'multiple', instruction: 'אמת/שקר', correctText: 'אמת.' },
        { value: 200, prompt: 'מהו "עוגן מחיר"?', options: ['מחיר גבוה שמוצג כדי שהמבצע ירגיש זול', 'עוגן בים', 'מחיר קבוע לכולם'], correct: 0, type: 'multiple', instruction: 'אמריקאי', correctText: 'עוגן מחיר מבליט מבצע כזול.' },
        { value: 300, prompt: 'התאימו: טכניקה ↔ זיהוי', options: [''], correct: 0, type: 'match', instruction: 'חברו טכניקה לסימן', matchLeft: ['מחסור מזויף', 'באנדל (חבילה)', 'ביקורת מזויפת'], matchRight: ['"כמעט נגמר" בלי נתון', 'שילוב מוצרים במחיר אחיד', 'ביקורות לא אמינות'], correctText: '1-ב, 2-ג, 3-א.' },
        { value: 400, prompt: 'חישוב: שלושה מוצרים ב-27 ש"ח. מה המחיר ליחידה?', options: [''], correct: 0, type: 'open', instruction: 'חלוקה', correctText: '9 ש"ח ליחידה.' },
        { value: 500, prompt: 'פתוחה: למה לפעמים שווה לחכות יום לפני קנייה?', options: [''], correct: 0, type: 'open', correctText: 'כדי לראות אם זה באמת חשוב ולהימנע מרכישה אימפולסיבית.' },
      ],
    },
    {
      name: 'בנק הקופות',
      color: palette[4],
      questions: [
        { value: 100, prompt: 'אמת/שקר: שימוש בתאי קופה ייעודיים מלמד סדר עדיפויות.', options: ['אמת', 'שקר'], correct: 0, type: 'multiple', instruction: 'אמת/שקר', correctText: 'אמת.' },
        { value: 200, prompt: 'מה עושים כשמקבלים כסף בלתי צפוי?', options: ['מחליטים כמה לחיסכון/כיף/נתינה', 'מבזבזים מיד', 'מחביאים ללא תכנון'], correct: 0, type: 'multiple', instruction: 'אמריקאי', correctText: 'לחלק לפי מטרות.' },
        { value: 300, prompt: 'התאימו: פעולה ↔ קטגוריה', options: [''], correct: 0, type: 'match', instruction: 'חברו פעולה לקטגוריה', matchLeft: ['הגדלת חיסכון', 'שדרוג בילוי', 'תרומה קטנה'], matchRight: ['מכניסים יותר לתא חיסכון', 'לוקחים קצת מתא כיף', 'שמים בצד לתא נתינה'], correctText: '1-ב, 2-א, 3-ג.' },
        { value: 400, prompt: 'חישוב: בתא חיסכון 55 ש"ח, כיף 25 ש"ח, נתינה 15 ש"ח. מוסיפים 15 ש"ח לחיסכון. כמה יש בו?', options: [''], correct: 0, type: 'open', instruction: 'חיבור', correctText: '70 ש"ח.' },
        { value: 500, prompt: 'פתוחה: איך תחליטו על אחוזי חלוקה כשיש יעד גדול?', options: [''], correct: 0, type: 'open', correctText: 'להגדיל זמנית את אחוז החיסכון ולהקטין כיף עד היעד.' },
      ],
    },
    {
      name: 'סיור עולמי',
      color: palette[5],
      questions: [
        { value: 100, prompt: 'אמת/שקר: מחירי מוצרים מושפעים גם ממסים במדינות שונות.', options: ['אמת', 'שקר'], correct: 0, type: 'multiple', instruction: 'אמת/שקר', correctText: 'אמת.' },
        { value: 200, prompt: 'מה צריך לבדוק כשמזמינים מחו"ל?', options: ['מחיר משלוח ומכס', 'רק צבע', 'רק ביקורות'], correct: 0, type: 'multiple', instruction: 'אמריקאי', correctText: 'משלוח ומסים.' },
        { value: 300, prompt: 'התאימו: מושג ↔ דוגמה', options: [''], correct: 0, type: 'match', instruction: 'חברו מושג לדוגמה', matchLeft: ['שער חליפין', 'מכס', 'משלוח'], matchRight: ['כמה מטבע אחד שווה', 'תשלום למדינה על יבוא', 'עלות הבאת מוצר'], correctText: '1-ב, 2-ג, 3-א.' },
        { value: 400, prompt: 'חישוב: מוצר עולה 10$ ושער 3.6 ש"ח. משלוח 12 ש"ח. כמה הכול?', options: [''], correct: 0, type: 'open', instruction: 'המרה וחיבור', correctText: '48 ש"ח.' },
        { value: 500, prompt: 'פתוחה: למה מטבעות משתנים בערכם?', options: [''], correct: 0, type: 'open', correctText: 'ביקוש והיצע, כלכלה, ריביות ואירועים בעולם.' },
      ],
    },
  ],
};
