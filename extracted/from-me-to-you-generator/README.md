# מחולל הערות "ממני אליך" — חבילה להטמעה

חבילה עצמאית שנחלצה מהפרויקט **חכם בכיס** (`smartkis`) לשימוש באתר אחר.

## מיקום בקוד המקורי

| מה | איפה |
|---|---|
| **קומפוננטה ראשית** | `components/modules/FromMeToYouCommentGenerator.tsx` |
| **נקודת כניסה באתר** | `components/InstructorsPage.tsx` |
| **נתיב ניווט** | מרחב מדריכים → כלים לניהול קבוצה → מחולל הערות ממני אליך |

### איך זה מחובר ב-InstructorsPage

```tsx
import FromMeToYouCommentGenerator from './modules/FromMeToYouCommentGenerator';

// כפתור בחירה:
onClick={() => setActiveActivity('מחולל הערות ממני אליך')}

// רינדור:
{activeActivity === 'מחולל הערות ממני אליך' && (
  <FromMeToYouCommentGenerator onBack={() => setActiveActivity(null)} />
)}
```

## מה כוללת החבילה

- **`FromMeToYouCommentGenerator.tsx`** — כל הלוגיקה, ה-UI, מחולל הטקסט, טבלת מעקב וייצוא CSV
- **`ExampleApp.tsx`** — דוגמת שילוב מינימלית
- **`index.html`** — דף HTML עצמאי לבדיקה מהירה

## תלויות

| תלות | נדרש? | הערות |
|---|---|---|
| React 18+ / 19 | כן | hooks בלבד |
| Tailwind CSS | כן | CDN או build — רוב המחלקות הן indigo/slate סטנדרטיות |
| API חיצוני / Gemini | **לא** | הכל רץ בדפדפן, ללא שרת |
| שירותים אחרים מהפרויקט | **לא** | קומפוננטה עצמאית לחלוטין |

## הטמעה מהירה בפרויקט React קיים

### 1. העתקת הקובץ

```bash
cp FromMeToYouCommentGenerator.tsx /path/to/your-project/src/components/
```

### 2. שימוש

```tsx
import FromMeToYouCommentGenerator from './components/FromMeToYouCommentGenerator';

function MyPage() {
  return (
    <div dir="rtl" lang="he" className="p-4">
      <FromMeToYouCommentGenerator />
      {/* onBack אופציונלי — מציג כפתור "חזרה" */}
    </div>
  );
}
```

### 3. Tailwind

ודא ש-Tailwind פעיל. אם משתמשים ב-CDN, הוסיפו ל-`index.html`:

```html
<script src="https://cdn.tailwindcss.com"></script>
```

מומלץ גם פונט עברי:

```html
<link href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;700&display=swap" rel="stylesheet">
```

### 4. RTL

הקומפוננטה מיועדת לעברית. עטפו ב-`dir="rtl"`.

## Props

```tsx
interface FromMeToYouCommentGeneratorProps {
  onBack?: () => void;  // אופציונלי — כפתור חזרה
}
```

## יכולות

- הגדרות קורס (שם כיתה, שם קורס, 4 נושאים)
- הזנת נתוני תלמיד/ה (שם, מגדר, תכונות, יכולות, דירוגים)
- תצוגה מקדימה חיה עם ניסוחים חלופיים
- עריכה ידנית
- שמירה לטבלה + ייצוא CSV (Excel)
- העתקה ללוח

## הרצה עצמאית (לבדיקה)

```bash
cd extracted/from-me-to-you-generator
npm install
npm run dev
```

## התאמות נפוצות

- **ברירות מחדל של קורס/נושאים** — שורות 126–131 ב-`FromMeToYouCommentGenerator.tsx`
- **מאגר תכונות אופי** — `BASE_TRAITS_DB` (שורות 23–34)
- **מאגר יכולות למידה** — `SKILLS_DB` (שורות 47–57)
- **תבניות ניסוח** — פונקציות `generateComment` ו-`getCommentVariants`
- **סגנונות כתיבה** — מערך `STYLES` (שורות 85–92)

## רישיון / שימוש

הקוד נחלץ מהפרויקט המקורי שלך. ודא שיש לך זכות להעתיק ולהטמיע באתר היעד.
