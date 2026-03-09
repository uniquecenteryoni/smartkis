import { Category, Difficulty } from './JeopardyModule';

const palette: string[] = [
  'from-[#ff7c7c] to-[#ffb347]',
  'from-[#6a5acd] to-[#b19cd9]',
  'from-[#2f855a] to-[#9ae6b4]',
  'from-[#ff9f43] to-[#feca57]',
  'from-[#4b6cb7] to-[#182848]',
  'from-[#f53844] to-[#42378f]',
];

export const jeopardyChachamBanks: Record<Difficulty, Category[]> = {
  'קל': [
    {
      name: 'בניית תקציב',
      color: palette[0],
      questions: [
        { value: 100, prompt: 'אמת/שקר: תקציב הוא רשימה שמציגה את כל ההכנסות וההוצאות.', options: ['אמת', 'שקר'], correct: 0, type: 'multiple', instruction: 'אמת/שקר', correctText: 'אמת.' },
        { value: 200, prompt: 'מה השלב הראשון בבניית תקציב?', options: ['ריכוז כל מקורות ההכנסה וההוצאות', 'קנייה של קופה חדשה', 'בחירת יעד לחיסכון ארוך טווח'], correct: 0, type: 'multiple', instruction: 'אמריקאי', correctText: 'ריכוז כל הכנסות והוצאות.' },
        { value: 300, prompt: 'התאמה: סוג הכנסה ↔ דוגמה', options: [''], correct: 0, type: 'match', instruction: 'התאימו', matchLeft: ['קבועה', 'משתנה', 'חד-פעמית'], matchRight: ['שכר חודשי קבוע', 'בונוס על פרויקט', 'מתנת יום הולדת'], correctText: '1-ב, 2-א, 3-ג.' },
        { value: 400, prompt: 'חישוב: ההכנסות 1,000 ש"ח וההוצאות 750 ש"ח. כמה נשאר בסוף החודש?', options: [''], correct: 0, type: 'open', instruction: 'חיסור', correctText: '250 ש"ח.' },
        { value: 500, prompt: 'פתוחה: תנו טיפ אחד לשמירת תקציב מאוזן לאורך זמן.', options: [''], correct: 0, type: 'open', correctText: 'לדוגמה: לעקוב שבועית ולעדכן הוצאות בזמן.' },
      ],
    },
    {
      name: 'הוצאות חצ"ר',
      color: palette[1],
      questions: [
        { value: 100, prompt: 'אמת/שקר: "חייב" הוא הוצאה שחייבים כדי לתפקד, ו"רוצה" הוא הוצאה שלא הכרחית.', options: ['אמת', 'שקר'], correct: 0, type: 'multiple', instruction: 'אמת/שקר', correctText: 'אמת.' },
        { value: 200, prompt: 'לאיזה סעיף חצ"ר שייך חשבון חשמל?', options: ['חייב', 'צריך', 'רוצה'], correct: 0, type: 'multiple', instruction: 'אמריקאי', correctText: 'חייב.' },
        { value: 300, prompt: 'התאימו: סעיף חצ"ר ↔ דוגמה', options: [''], correct: 0, type: 'match', instruction: 'חברו סעיף לדוגמה', matchLeft: ['חייב', 'צריך', 'רוצה'], matchRight: ['תשלום שכר דירה', 'נעלי ספורט לחוג', 'קפה טייק אווי יומי'], correctText: '1-ב, 2-ג, 3-א.' },
        { value: 400, prompt: 'פתוחה: יש לכם 150 ש"ח לסעיף "רוצה" ואתם רוצים משחק שעולה 200 ש"ח. מה אפשר לעשות?', options: [''], correct: 0, type: 'open', correctText: 'לשמור עוד חודש/לחפש מבצע/לבחור חלופה זולה.' },
        { value: 500, prompt: 'פתוחה: איך מודל חצ"ר עוזר לקבל החלטה בין שתי הוצאות?', options: [''], correct: 0, type: 'open', correctText: 'מסווגים כל הוצאה ורואים מה חיוני ומה ניתן לדחות.' },
      ],
    },
    {
      name: 'הסכנה במינוס',
      color: palette[2],
      questions: [
        { value: 100, prompt: 'אמת/שקר: מינוס בבנק עולה כסף כי משלמים עליו ריבית.', options: ['אמת', 'שקר'], correct: 0, type: 'multiple', instruction: 'אמת/שקר', correctText: 'אמת.' },
        { value: 200, prompt: 'מה קורה כשחורגים ממסגרת האשראי?', options: ['משלמים ריבית ועמלת חריגה', 'הבנק מעלה את השכר', 'לא קורה כלום'], correct: 0, type: 'multiple', instruction: 'אמריקאי', correctText: 'משלמים ריבית ועמלת חריגה.' },
        { value: 300, prompt: 'התאימו: מושג ↔ הסבר', options: [''], correct: 0, type: 'match', instruction: 'חברו מושג להסבר', matchLeft: ['מסגרת אשראי', 'ריבית חריגה', 'התראה'], matchRight: ['הגבול שהבנק מאשר למינוס', 'עלות כספית על חריגה', 'מסר מהבנק לפני חריגה'], correctText: '1-ב, 2-ג, 3-א.' },
        { value: 400, prompt: 'חישוב: חריגה של 500 ש"ח בריבית 5% לחודש. כמה ריבית תשלמו החודש?', options: [''], correct: 0, type: 'open', instruction: 'אחוזים פשוטים', correctText: '25 ש"ח.' },
        { value: 500, prompt: 'פתוחה: שני צעדים פשוטים כדי להימנע ממינוס?', options: [''], correct: 0, type: 'open', correctText: 'לדוגמה: לעדכן תקציב שבועית ולהגדיר הוראות קבע לחיסכון קטן.' },
      ],
    },
    {
      name: 'זכויות עובדים',
      color: palette[3],
      questions: [
        { value: 100, prompt: 'אמת/שקר: לבני נוער יש שכר מינימום משלהם.', options: ['אמת', 'שקר'], correct: 0, type: 'multiple', instruction: 'אמת/שקר', correctText: 'אמת.' },
        { value: 200, prompt: 'מה חייב המעסיק לתת בתחילת העבודה?', options: ['טופס הודעה לעובד/חוזה', 'רק כרטיס עובד', 'שום מסמך'], correct: 0, type: 'multiple', instruction: 'אמריקאי', correctText: 'טופס הודעה לעובד או חוזה.' },
        { value: 300, prompt: 'התאימו: זכות ↔ משמעות', options: [''], correct: 0, type: 'match', instruction: 'חברו זכות להסבר', matchLeft: ['שכר מינימום', 'תלוש חודשי', 'הפסקה'], matchRight: ['שכר מינימלי לפי חוק', 'פירוט שכר וניכויים', 'זמן מנוחה במהלך המשמרת'], correctText: '1-ב, 2-ג, 3-א.' },
        { value: 400, prompt: 'חישוב: עבדתם 5 שעות ב-32 ש"ח לשעה. כמה ברוטו?', options: [''], correct: 0, type: 'open', instruction: 'כפל פשוט', correctText: '160 ש"ח.' },
        { value: 500, prompt: 'פתוחה: למה חשוב לדווח למעסיק על שעות העבודה בזמן?', options: [''], correct: 0, type: 'open', correctText: 'כדי לוודא תשלום מלא ובזמן ולשמור הוכחה לשכר.' },
      ],
    },
    {
      name: 'פענוח תלוש',
      color: palette[4],
      questions: [
        { value: 100, prompt: 'אמת/שקר: נטו הוא מה שנכנס לחשבון אחרי ניכויים.', options: ['אמת', 'שקר'], correct: 0, type: 'multiple', instruction: 'אמת/שקר', correctText: 'אמת.' },
        { value: 200, prompt: 'איזה רכיב בתלוש מראה כמה שעות עבדתם?', options: ['שעות/כמות', 'ברוטו', 'מס בריאות'], correct: 0, type: 'multiple', instruction: 'אמריקאי', correctText: 'שעות/כמות.' },
        { value: 300, prompt: 'התאימו: רכיב בתלוש ↔ פירוש', options: [''], correct: 0, type: 'match', instruction: 'חברו רכיב להסבר', matchLeft: ['ברוטו', 'נטו', 'ניכויי חובה'], matchRight: ['השכר לפני ניכויים', 'השכר לאחר ניכויים', 'מסים וביטוח לאומי'], correctText: '1-ב, 2-ג, 3-א.' },
        { value: 400, prompt: 'חישוב: ברוטו 1,500 ש"ח וניכויי חובה 120 ש"ח. מה הנטו?', options: [''], correct: 0, type: 'open', instruction: 'חיסור', correctText: '1,380 ש"ח.' },
        { value: 500, prompt: 'פתוחה: דבר אחד שכדאי לבדוק בתלוש כדי לוודא שהוא תקין.', options: [''], correct: 0, type: 'open', correctText: 'לדוגמה: התאמת שעות ושכר מינימום.' },
      ],
    },
    {
      name: 'חיסכון והשקעה',
      color: palette[5],
      questions: [
        { value: 100, prompt: 'אמת/שקר: חיסכון קטן וקבוע יכול להפוך לקרן חירום.', options: ['אמת', 'שקר'], correct: 0, type: 'multiple', instruction: 'אמת/שקר', correctText: 'אמת.' },
        { value: 200, prompt: 'מהי ריבית דריבית?', options: ['ריבית שמשלמים רק בסוף השנה', 'ריבית שנצברת גם על הריבית שכבר נצברה', 'ריבית ללא סיכון'], correct: 1, type: 'multiple', instruction: 'אמריקאי', correctText: 'ריבית שנצברת גם על ריבית קודמת.' },
        { value: 300, prompt: 'התאימו: מוצר חיסכון/השקעה ↔ מאפיין', options: [''], correct: 0, type: 'match', instruction: 'חברו מוצר למאפיין', matchLeft: ['פקדון יומי', 'חיסכון בבנק', 'מניה'], matchRight: ['זמינות יומית וריבית נמוכה', 'חיסכון בטוח יחסית לטווח קצר', 'סיכון גבוה ופוטנציאל תשואה'], correctText: '1-ב, 2-ג, 3-א.' },
        { value: 400, prompt: 'חישוב: חוסכים 80 ש"ח לחודש ל-6 חודשים. כמה יהיה בסוף בלי ריבית?', options: [''], correct: 0, type: 'open', instruction: 'כפל פשוט', correctText: '480 ש"ח.' },
        { value: 500, prompt: 'פתוחה: איך תבחרו בין חיסכון להשקעה?', options: [''], correct: 0, type: 'open', correctText: 'לפי טווח זמן, סיכון שיכולים לשאת ומטרה כספית.' },
      ],
    },
  ],
  'בינוני': [
    {
      name: 'בניית תקציב',
      color: palette[0],
      questions: [
        { value: 100, prompt: 'אמת/שקר: אם ההוצאות עולות על ההכנסות, מדובר בגירעון.', options: ['אמת', 'שקר'], correct: 0, type: 'multiple', instruction: 'אמת/שקר', correctText: 'אמת.' },
        { value: 200, prompt: 'מהי חלוקה טובה למעקב חודשי?', options: ['הכנסות, הוצאות חובה, חיסכון, רצונות', 'רק הוצאות', 'רק הכנסות'], correct: 0, type: 'multiple', instruction: 'אמריקאי', correctText: 'הכנסות, חובה, חיסכון ורצונות.' },
        { value: 300, prompt: 'התאימו: סוג הוצאה ↔ דוגמה', options: [''], correct: 0, type: 'match', instruction: 'התאימו סוג לדוגמה', matchLeft: ['קבועה', 'משתנה', 'חד-פעמית'], matchRight: ['שכר דירה', 'בילוי בסוף שבוע', 'תיקון מחשב'], correctText: '1-ב, 2-ג, 3-א.' },
        { value: 400, prompt: 'חישוב: הכנסה 2,400 ש"ח. חובה 1,200, חיסכון 300, רצונות 600. כמה נשאר/חסר?', options: [''], correct: 0, type: 'open', instruction: 'סכום קטגוריות', correctText: 'נשארים 300 ש"ח לא מנוצלים.' },
        { value: 500, prompt: 'פתוחה: אם התקציב בחריגה, איזה סעיף כדאי לבדוק קודם ולמה?', options: [''], correct: 0, type: 'open', correctText: 'לרוב רצונות/משתנה כי קל לצמצם שם.' },
      ],
    },
    {
      name: 'הוצאות חצ"ר',
      color: palette[1],
      questions: [
        { value: 100, prompt: 'אמת/שקר: העברת הוצאה מ"רוצה" ל"צריך" מגדילה את תקציב החובה.', options: ['אמת', 'שקר'], correct: 0, type: 'multiple', instruction: 'אמת/שקר', correctText: 'אמת.' },
        { value: 200, prompt: 'מה דוגמה טובה ל"צריך"?', options: ['ספר לימוד חובה', 'חופשת סקי', 'גיימפאס חדש'], correct: 0, type: 'multiple', instruction: 'אמריקאי', correctText: 'ספר לימוד חובה.' },
        { value: 300, prompt: 'התאימו: קטגוריה ↔ פעולה בזמן קיצוץ', options: [''], correct: 0, type: 'match', instruction: 'חברו קטגוריה לפעולה', matchLeft: ['חייב', 'צריך', 'רוצה'], matchRight: ['לבדוק איך להוזיל ספק', 'לשקול דחייה או מציאה זולה יותר', 'לבטל/להפחית תחילה'], correctText: '1-ב, 2-א, 3-ג.' },
        { value: 400, prompt: 'חישוב: בסעיף "רוצה" יש 500 ש"ח. הוצאה מתוכננת 620 ש"ח. כמה לקצץ או לדחות?', options: [''], correct: 0, type: 'open', instruction: 'פער תקציבי', correctText: 'להקטין ב-120 ש"ח או לדחות חלק מהרכישה.' },
        { value: 500, prompt: 'פתוחה: איך מודל חצ"ר עוזר בהצבת סדרי עדיפויות כשיש הכנסה בלתי צפויה?', options: [''], correct: 0, type: 'open', correctText: 'מחליטים קודם אם לחזק חייב/צריך לפני הרחבת רוצה.' },
      ],
    },
    {
      name: 'הסכנה במינוס',
      color: palette[2],
      questions: [
        { value: 100, prompt: 'אמת/שקר: ריבית במינוס יכולה להשתנות לפי רמת החריגה.', options: ['אמת', 'שקר'], correct: 0, type: 'multiple', instruction: 'אמת/שקר', correctText: 'אמת.' },
        { value: 200, prompt: 'מהי "עמלת חריגה"?', options: ['תשלום חד-פעמי בעת חריגה', 'בונוס מהבנק', 'מס הכנסה'], correct: 0, type: 'multiple', instruction: 'אמריקאי', correctText: 'תשלום חד-פעמי בעת חריגה.' },
        { value: 300, prompt: 'התאימו: מצב ↔ פעולה נכונה', options: [''], correct: 0, type: 'match', instruction: 'חברו מצב לפעולה', matchLeft: ['קבוע במינוס', 'חריגה נדירה', 'מסגרת כמעט מלאה'], matchRight: ['לבנות תוכנית צמצום הוצאות וחיסכון', 'להחזיר תוך ימים ולבדוק למה קרה', 'לעקוב יומית ולהקטין חיובים עתידיים'], correctText: '1-ב, 2-ג, 3-א.' },
        { value: 400, prompt: 'חישוב: מינוס 1,200 ש"ח, ריבית 7% לחודש. כמה ריבית תחושבו החודש?', options: [''], correct: 0, type: 'open', instruction: 'אחוזים', correctText: '84 ש"ח.' },
        { value: 500, prompt: 'פתוחה: ציינו שני סימנים מוקדמים לכך שמדרדרים למינוס.', options: [''], correct: 0, type: 'open', correctText: 'לדוגמה: דחיית חיובים, שימוש תכוף באשראי, ירידה בחיסכון.' },
      ],
    },
    {
      name: 'זכויות עובדים',
      color: palette[3],
      questions: [
        { value: 100, prompt: 'אמת/שקר: שעות נוספות לבני נוער מוגבלות בחוק.', options: ['אמת', 'שקר'], correct: 0, type: 'multiple', instruction: 'אמת/שקר', correctText: 'אמת.' },
        { value: 200, prompt: 'מה חובה לכלול בתלוש?', options: ['מספר שעות, שכר לשעה וניכויים', 'רק סכום נטו', 'שם המעסיק בלבד'], correct: 0, type: 'multiple', instruction: 'אמריקאי', correctText: 'מספר שעות, שכר לשעה וניכויים.' },
        { value: 300, prompt: 'התאימו: זכות ↔ מה לבדוק', options: [''], correct: 0, type: 'match', instruction: 'חברו זכות לבדיקה', matchLeft: ['שכר מינימום', 'ימי מחלה/חופשה', 'הודעה לעובד'], matchRight: ['גובה השכר לשעה בגילכם', 'ציון יתרות בתלוש', 'מסמך שמפרט תנאי העסקה'], correctText: '1-ב, 2-א, 3-ג.' },
        { value: 400, prompt: 'חישוב: עבדתם 18 שעות בשבוע, שכר 33 ש"ח לשעה. מה הברוטו השבועי?', options: [''], correct: 0, type: 'open', instruction: 'כפל', correctText: '594 ש"ח.' },
        { value: 500, prompt: 'פתוחה: מה עושים אם לא קיבלתם תלוש או שהתלוש לא ברור?', options: [''], correct: 0, type: 'open', correctText: 'לפנות למעסיק בכתב, לתעד, ולשקול ייעוץ/פניה למוקד זכויות עובדים.' },
      ],
    },
    {
      name: 'פענוח תלוש',
      color: palette[4],
      questions: [
        { value: 100, prompt: 'אמת/שקר: שעות נוספות צריכות להופיע בשורה נפרדת בתלוש.', options: ['אמת', 'שקר'], correct: 0, type: 'multiple', instruction: 'אמת/שקר', correctText: 'אמת.' },
        { value: 200, prompt: 'מה המשמעות של שורת "ניכויי חובה"?', options: ['מסים וביטוח לאומי', 'הטבות מהמעסיק', 'בונוסים'], correct: 0, type: 'multiple', instruction: 'אמריקאי', correctText: 'מסים וביטוח לאומי.' },
        { value: 300, prompt: 'התאימו: רכיב ↔ דוגמה', options: [''], correct: 0, type: 'match', instruction: 'חברו רכיב לדוגמה', matchLeft: ['הפרשות מעסיק', 'שעות רגילות', 'ברוטו'], matchRight: ['תשלום לפנסיה/חיסכון', 'סה"כ שעות בסיס', 'סכום לפני ניכויים'], correctText: '1-ב, 2-ג, 3-א.' },
        { value: 400, prompt: 'חישוב: ברוטו 2,000 ש"ח. ניכויי חובה 180 ש"ח, הטבת מס -20 ש"ח (מורידה את הניכוי). מה הנטו?', options: [''], correct: 0, type: 'open', instruction: 'חיסור', correctText: '1,840 ש"ח.' },
        { value: 500, prompt: 'פתוחה: ציינו שני דברים שחייבים להיות כתובים בתלוש כחוק.', options: [''], correct: 0, type: 'open', correctText: 'למשל: פרטי עובד ומעסיק, תקופת עבודה, שכר לשעה/חודש, שעות, ניכויים.' },
      ],
    },
    {
      name: 'חיסכון והשקעה',
      color: palette[5],
      questions: [
        { value: 100, prompt: 'אמת/שקר: חיסכון לטווח קצר לרוב עדיף להשאיר בנזילות גבוהה.', options: ['אמת', 'שקר'], correct: 0, type: 'multiple', instruction: 'אמת/שקר', correctText: 'אמת.' },
        { value: 200, prompt: 'מהי כרית ביטחון טובה?', options: ['3-6 חודשי הוצאות חיוניות', 'חודש אחד של הוצאות', '12 חודשי הכנסה'], correct: 0, type: 'multiple', instruction: 'אמריקאי', correctText: '3-6 חודשי הוצאות חיוניות.' },
        { value: 300, prompt: 'התאימו: מושג ↔ הסבר', options: [''], correct: 0, type: 'match', instruction: 'חברו מושג להסבר', matchLeft: ['סיכון', 'תשואה', 'פיזור'], matchRight: ['מידת אי-הוודאות', 'הרווח הצפוי מההשקעה', 'חלוקת כסף בין אפיקים שונים'], correctText: '1-ב, 2-ג, 3-א.' },
        { value: 400, prompt: 'חישוב: חיסכון חודשי 150 ש"ח, ריבית שנתית 4% (פשוטה לצורך השאלה). כמה תוספת ריבית לאחר שנה?', options: [''], correct: 0, type: 'open', instruction: 'הערכה פשוטה', correctText: 'כ-72 ש"ח (150×12=1,800; 4%≈72).' },
        { value: 500, prompt: 'פתוחה: מתי כדאי להשקיע במקום לחסוך בפיקדון?', options: [''], correct: 0, type: 'open', correctText: 'כשמדובר בטווח ארוך, אחרי שיש כרית חירום ואתם מבינים את הסיכון.' },
      ],
    },
  ],
  'מאתגר': [
    {
      name: 'בניית תקציב',
      color: palette[0],
      questions: [
        { value: 100, prompt: 'אמת/שקר: מעקב חודשי בלבד מספיק כדי למנוע גלישה להוצאות יתר.', options: ['אמת', 'שקר'], correct: 1, type: 'multiple', instruction: 'אמת/שקר', correctText: 'שקר. נדרש גם מעקב תדיר/שבועי.' },
        { value: 200, prompt: 'מהי הדרך הטובה ביותר לשלב יעדי חיסכון בתקציב?', options: ['להתייחס אליהם כהוצאה קבועה לכל חודש', 'להוסיף אותם רק אם נשאר כסף', 'לדחות לסוף שנה'], correct: 0, type: 'multiple', instruction: 'אמריקאי', correctText: 'להקצות כמו הוצאה קבועה בתחילת חודש.' },
        { value: 300, prompt: 'התאימו: מצב תקציבי ↔ פעולה מתקנת', options: [''], correct: 0, type: 'match', instruction: 'חברו מצב לפתרון', matchLeft: ['גירעון קבוע', 'עודף קבוע', 'תזרים משתנה מאוד'], matchRight: ['להגדיר חיסכון אוטומטי ולהעלות מסגרת חירום', 'לנתח הוצאות חובה ולצמצם', 'להכין תקציב שמרני ולהכניס בופר'], correctText: '1-ב, 2-א, 3-ג.' },
        { value: 400, prompt: 'חישוב: הכנסות 3,600 ש"ח. חובה 1,700, צריך 1,000, רוצה 700, חיסכון 400. מה מצבכם?', options: [''], correct: 0, type: 'open', instruction: 'סיכום קטגוריות', correctText: 'סך הוצאות+חיסכון 3,800 → חוסר של 200 ש"ח (גירעון).' },
        { value: 500, prompt: 'פתוחה: איך הייתם מכינים תקציב לשנה עם שלושה אירועים גדולים מתוכננים?', options: [''], correct: 0, type: 'open', correctText: 'פיזור החיסכון חודשי, יצירת קרן ייעודית ושמירת בופר להפתעות.' },
      ],
    },
    {
      name: 'הוצאות חצ"ר',
      color: palette[1],
      questions: [
        { value: 100, prompt: 'אמת/שקר: סעיף "צריך" יכול להפוך ל"חייב" כשאין חלופות זולות או דחייה.', options: ['אמת', 'שקר'], correct: 0, type: 'multiple', instruction: 'אמת/שקר', correctText: 'אמת.' },
        { value: 200, prompt: 'מהי דוגמה לדיוק סעיף "רוצה"?', options: ['הגבלת מספר בילויים בחודש', 'רכישת אוכל בסיסי', 'תשלום ביטוח'], correct: 0, type: 'multiple', instruction: 'אמריקאי', correctText: 'הגבלת מספר בילויים.' },
        { value: 300, prompt: 'התאימו: פעולה ↔ השפעה על תקציב', options: [''], correct: 0, type: 'match', instruction: 'חברו פעולה להשפעה', matchLeft: ['מעבר לספק זול יותר', 'דחיית רכישה של גאדג׳ט', 'ביטול מנוי שלא משתמשים בו'], matchRight: ['מוריד הוצאות חובה/צריך', 'מפנה כסף ב"רוצה"', 'מפנה כסף קבוע מדי חודש'], correctText: '1-ב, 2-ג, 3-א.' },
        { value: 400, prompt: 'חישוב: סעיף "רוצה" 900 ש"ח. רוצים להגדיל חיסכון ב-150 ש"ח. בכמה לצמצם את ה"רוצה"?', options: [''], correct: 0, type: 'open', instruction: 'קיזוז פשוט', correctText: 'לצמצם 150 ש"ח (ל-750).'},
        { value: 500, prompt: 'פתוחה: תארו תהליך של 3 שלבים לסיווג הוצאות חדשות במודל חצ"ר.', options: [''], correct: 0, type: 'open', correctText: 'למשל: לבדוק צורך/דחיפות, לחפש חלופה זולה, להחליט על קטגוריה ולתעד בתקציב.' },
      ],
    },
    {
      name: 'הסכנה במינוס',
      color: palette[2],
      questions: [
        { value: 100, prompt: 'אמת/שקר: גם אם המינוס מאושר במסגרת, זה עדיין עולה ריבית.', options: ['אמת', 'שקר'], correct: 0, type: 'multiple', instruction: 'אמת/שקר', correctText: 'אמת.' },
        { value: 200, prompt: 'מה ההבדל בין מינוס מאושר לחריגה בפועל?', options: ['מאושר-בריבית נמוכה יותר לרוב; חריגה-קנסות גבוהים', 'אין הבדל', 'חריגה זולה יותר'], correct: 0, type: 'multiple', instruction: 'אמריקאי', correctText: 'חריגה יקרה יותר ממינוס מאושר.' },
        { value: 300, prompt: 'התאימו: כלי פעולה ↔ מטרה', options: [''], correct: 0, type: 'match', instruction: 'חברו כלי למטרה', matchLeft: ['התראות אפליקציה', 'דחיית חיוב בכרטיס', 'פריסת חוב'], matchRight: ['למנוע חריגה מראש', 'להחליק הוצאה חד-פעמית', 'להקטין עומס חודשי במידה מבוקרת'], correctText: '1-ב, 2-ג, 3-א.' },
        { value: 400, prompt: 'חישוב: מינוס 2,000 ש"ח, ריבית 8% לחודש. כמה תשלמו ריבית אחרי חודשיים (פשוט, בלי דריבית)?', options: [''], correct: 0, type: 'open', instruction: 'אחוזים מצטברים פשוטים', correctText: '320 ש"ח (160 כל חודש).'},
        { value: 500, prompt: 'פתוחה: מהו "בופר" לתזרים ואיך הוא עוזר נגד מינוס?', options: [''], correct: 0, type: 'open', correctText: 'בופר הוא סכום בצד להפתעות חודשיות; מצמצם צורך בחריגה ומונע ריבית.' },
      ],
    },
    {
      name: 'זכויות עובדים',
      color: palette[3],
      questions: [
        { value: 100, prompt: 'אמת/שקר: ניתן לשלם חלק מהשכר "בשחור" אם העובד מסכים.', options: ['אמת', 'שקר'], correct: 1, type: 'multiple', instruction: 'אמת/שקר', correctText: 'שקר. זה לא חוקי ופוגע בזכויות.', },
        { value: 200, prompt: 'מה עושים אם השכר ששולם נמוך משכר המינימום לנוער?', options: ['פונים בכתב למעסיק ומבקשים תיקון', 'מחכים חודש', 'מוותרים'], correct: 0, type: 'multiple', instruction: 'אמריקאי', correctText: 'לפנות בכתב, לבקש תיקון ולשמור תיעוד.' },
        { value: 300, prompt: 'התאימו: זכות ↔ רמז לזיהוי פגיעה', options: [''], correct: 0, type: 'match', instruction: 'חברו זכות לרמז', matchLeft: ['פנסיה (לגילאים הרלוונטיים)', 'תלוש מפורט', 'שעות נוספות'], matchRight: ['אין הפרשות אחרי חצי שנה', 'חסרים נתוני שעות/ניכויים', 'שכר בסיס זהה למרות שעות נוספות'], correctText: '1-ג, 2-א, 3-ב.' },
        { value: 400, prompt: 'חישוב: שבוע עבודה 22 שעות, תעריף 34 ש"ח לשעה. מה ברוטו שבועי?', options: [''], correct: 0, type: 'open', instruction: 'כפל', correctText: '748 ש"ח.' },
        { value: 500, prompt: 'פתוחה: ציינו שני מקורות אמינים ללמוד על זכויות עובדים לנוער.', options: [''], correct: 0, type: 'open', correctText: 'לדוגמה: אתר משרד העבודה, קו חם/עמותות לזכויות עובדים.' },
      ],
    },
    {
      name: 'פענוח תלוש',
      color: palette[4],
      questions: [
        { value: 100, prompt: 'אמת/שקר: הפרשות המעסיק לפנסיה מופיעות בתלוש כחלק מהעלות הכוללת.', options: ['אמת', 'שקר'], correct: 0, type: 'multiple', instruction: 'אמת/שקר', correctText: 'אמת.' },
        { value: 200, prompt: 'מה מסמן סעיף "שעות 125%/150%"?', options: ['תשלום מוגדל עבור שעות נוספות/שבת', 'בונוס חודשי', 'חופשה'], correct: 0, type: 'multiple', instruction: 'אמריקאי', correctText: 'תשלום מוגדל לשעות נוספות/שבת.' },
        { value: 300, prompt: 'התאימו: רכיב ↔ למה לשים לב', options: [''], correct: 0, type: 'match', instruction: 'חברו רכיב לבקרה', matchLeft: ['ברוטו', 'שעות 150%', 'ניכוי בריאות'], matchRight: ['סך לפני ניכויים', 'שהשעות חושבו בתעריף הנכון', 'שיעור הניכוי תואם חוק'], correctText: '1-ב, 2-ג, 3-א.' },
        { value: 400, prompt: 'חישוב: ברוטו 2,500 ש"ח. שעות נוספות 150 ש"ח (כבר כלולות בברוטו). ניכויי חובה 230 ש"ח. הפרשת מעסיק 200 ש"ח (לא נכנס לנטו). מה הנטו?', options: [''], correct: 0, type: 'open', instruction: 'חיסור', correctText: '2,270 ש"ח.' },
        { value: 500, prompt: 'פתוחה: מה עושים אם יש פער בין שעות שנרשמו אצלכם לבין מה שמופיע בתלוש?', options: [''], correct: 0, type: 'open', correctText: 'מציגים רישום עצמאי למעסיק, מבקשים תיקון ותיעוד בכתב.' },
      ],
    },
    {
      name: 'חיסכון והשקעה',
      color: palette[5],
      questions: [
        { value: 100, prompt: 'אמת/שקר: פיזור השקעות מוריד סיכון מרוכז.', options: ['אמת', 'שקר'], correct: 0, type: 'multiple', instruction: 'אמת/שקר', correctText: 'אמת.' },
        { value: 200, prompt: 'מה יחס נכון בין כרית חירום להשקעות מסוכנות יותר?', options: ['קודם לבנות כרית חירום ואז להשקיע את העודף', 'להשקיע הכל מיד', 'לא לחסוך בכלל'], correct: 0, type: 'multiple', instruction: 'אמריקאי', correctText: 'קודם כרית חירום, אחר כך עודפים להשקעה.' },
        { value: 300, prompt: 'התאימו: טווח זמן ↔ כלי מתאים', options: [''], correct: 0, type: 'match', instruction: 'חברו טווח לכלי', matchLeft: ['חודשיים', 'שנה-שלוש', 'חמש שנים ומעלה'], matchRight: ['פיקדון נזיל', 'חיסכון/אג"ח סולידי', 'מניות/קופת השקעה מגוונת'], correctText: '1-ב, 2-א, 3-ג.' },
        { value: 400, prompt: 'חישוב: הפקדה חודשית 200 ש"ח להשקעה, תשואה שנתית ממוצעת 5% (פשוטה). מה תהיה התוספת השנתית מהתשואה?', options: [''], correct: 0, type: 'open', instruction: 'הערכה פשוטה', correctText: '≈120 ש"ח (200×12=2,400; 5%≈120).'},
        { value: 500, prompt: 'פתוחה: שתי דרכים להפחית סיכון פסיכולוגי כשמתחילים להשקיע.', options: [''], correct: 0, type: 'open', correctText: 'להתחיל בסכומים קטנים וקבועים (DCA), ולבחור פיזור רחב/קרן מחקה.' },
      ],
    },
  ],
};
