import React, { useEffect, useMemo, useRef, useState } from 'react';

type Gender = 'male' | 'female';

type TextByGender = {
  male: string;
  female: string;
};

type SavedComment = {
  id: number;
  name: string;
  comment: string;
};

type CommentStyle = 'warm' | 'direct' | 'humorous' | 'inspiring' | 'reflective' | 'poetic';

interface FromMeToYouCommentGeneratorProps {
  onBack?: () => void;
}

const BASE_TRAITS_DB: Record<string, TextByGender> = {
  curiosity: { male: 'סקרנות', female: 'סקרנות' },
  diligence: { male: 'חריצות', female: 'חריצות' },
  maturity: { male: 'בגרות', female: 'בגרות' },
  wit: { male: 'שנינות', female: 'שנינות' },
  leadership: { male: 'מנהיגות', female: 'מנהיגות' },
  responsibility: { male: 'אחריות', female: 'אחריות' },
  creativity: { male: 'יצירתיות', female: 'יצירתיות' },
  perseverance: { male: 'התמדה', female: 'התמדה' },
  initiative: { male: 'יוזמה', female: 'יוזמה' },
  sensitivity: { male: 'רגישות', female: 'רגישות' },
};

const TRAIT_PHRASE_BY_KEY: Record<string, string> = {
  curiosity: 'הסקרנות הייחודית שלך',
  diligence: 'החריצות מעוררת ההשראה',
  wit: 'השנינות יוצאת הדופן',
  leadership: 'המנהיגות הטבעית שלך',
  perseverance: 'ההתמדה העקבית',
  sensitivity: 'הרגישות הגבוהה שלך לאחרים',
  initiative: 'היוזמה שמבדילה אותך מאחרים',
  maturity: 'הבגרות שהיא חלק מיכולת המנהיגות שלך',
};

const SKILLS_DB: Record<string, TextByGender> = {
  analysis: { male: 'יכולת הבנה וניתוח מתקדמות', female: 'יכולת הבנה וניתוח מתקדמות' },
  quick_grasp: { male: 'תפיסה מהירה וחדה', female: 'תפיסה מהירה וחדה' },
  perseverance: { male: 'התמדה מול אתגרים', female: 'התמדה מול אתגרים' },
  deep_thinking: { male: 'ירידה לפרטים והעמקה', female: 'ירידה לפרטים והעמקה' },
  questioning: { male: 'מיומנות שאילת שאלות', female: 'מיומנות שאילת שאלות' },
  active_listening: { male: 'יכולת הקשבה פעילה', female: 'יכולת הקשבה פעילה' },
  independent_learning: { male: 'יכולת למידה עצמאית ויוזמה אישית', female: 'יכולת למידה עצמאית ויוזמה אישית' },
  problem_solving: { male: 'יכולת פתרון בעיות', female: 'יכולת פתרון בעיות' },
  adaptability: { male: 'כושר הסתגלות מעולה לשינויים', female: 'כושר הסתגלות מעולה לשינויים' },
};

const ACADEMIC_LABELS: Record<number, string> = {
  10: 'יוצא מן הכלל, סקרן, חוקר ויורד לעומקם של דברים',
  9: 'מצוין, בעל יכולת ניתוח חדה והבנה מהירה ביותר',
  8: 'טוב מאוד, לומד מתוך עניין, תורם ומעמיק',
  7: 'טוב, מגלה מעורבות ומקשיב היטב בשיעורים',
  6: 'משתדל ומפגין הבנה בסיסית ורצון ללמוד',
  5: 'בינוני, חווה לעיתים קושי אך לא מוותר על הלמידה',
  4: 'נדרש מאמץ נוסף, בעל פוטנציאל שזקוק ליותר הכוונה והתמדה',
  3: 'חווה קושי משמעותי, זקוק לתמיכה וליווי צמוד',
  2: 'חוסר עניין וקשיים בלמידה הדורשים בירור מעמיק',
  1: 'קושי קריטי בלמידה וחוסר השתתפות מוחלט',
};

const BEHAVIOR_LABELS: Record<number, string> = {
  10: 'מופת ודוגמה אישית, מנהיג חברתי חיובי ומכבד',
  9: 'נפלא, שותף פעיל התורם רבות למרקם הכיתתי',
  8: 'מכבד וקשוב, מאפשר לאחרים לצמוח לצדו',
  7: 'חיובי, משתף פעולה בצורה טובה ונעימה',
  6: 'נפתח בפעילויות ומשחקים, אך זקוק למיקוד קשב',
  5: 'נבון מאוד, אך נוטה לפטפוטים ולהסחות דעת',
  4: 'מפטפט רבות, לעיתים מפריע למהלך השיעור',
  3: 'מאתגר חברתית, מראה קושי לשמור על קשב וגבולות',
  2: 'התנהגות המונעת ממנו ומאחרים ללמוד',
  1: 'קושי התנהגותי קיצוני הדורש טיפול מקצועי',
};

const STYLES: Array<{ value: CommentStyle; label: string }> = [
  { value: 'warm', label: 'חם ומעצים (הסגנון הטבעי שלך)' },
  { value: 'direct', label: 'ענייני ומקצועי' },
  { value: 'humorous', label: 'משעשע ומקרב בגובה העיניים' },
  { value: 'inspiring', label: 'מעורר השראה וחזון לעתיד' },
  { value: 'reflective', label: 'רפלקטיבי וממוקד תהליך' },
  { value: 'poetic', label: 'פיוטי, עמוק ומרגש' },
];

const getDeterministicIndex = (name: string, count: number) => {
  if (!name || count <= 0) return 0;
  let sum = 0;
  for (let i = 0; i < name.length; i += 1) {
    sum += name.charCodeAt(i);
  }
  return sum % count;
};

const joinHebrewList = (items: string[]) => {
  const cleanedItems = items.map((item) => item.trim()).filter(Boolean);
  if (cleanedItems.length === 0) return '';
  if (cleanedItems.length === 1) return cleanedItems[0];
  if (cleanedItems.length === 2) return `${cleanedItems[0]} ו${cleanedItems[1]}`;
  return `${cleanedItems.slice(0, -1).join(', ')}, ו${cleanedItems[cleanedItems.length - 1]}`;
};

const prefixHebrewList = (prefix: string, items: string[]) => {
  const joined = joinHebrewList(items);
  return joined ? `${prefix}${joined}` : '';
};

const FromMeToYouCommentGenerator: React.FC<FromMeToYouCommentGeneratorProps> = ({ onBack }) => {
  const [className, setClassName] = useState("ט'2");
  const [courseName, setCourseName] = useState('חינוך פיננסי');
  const [topic1, setTopic1] = useState('ניהול תקציב אישי');
  const [topic2, setTopic2] = useState('חיסכון וצרכנות נבונה');
  const [topic3, setTopic3] = useState('עולם הבנקים והאשראי');
  const [topic4, setTopic4] = useState('תכנון פיננסי לעתיד');

  const [studentName, setStudentName] = useState('');
  const [currentGender, setCurrentGender] = useState<Gender>('male');
  const [traitsDb, setTraitsDb] = useState<Record<string, TextByGender>>(BASE_TRAITS_DB);
  const [selectedTraits, setSelectedTraits] = useState<string[]>(['curiosity', 'diligence']);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['analysis', 'questioning']);
  const [customTrait, setCustomTrait] = useState('');

  const [academicRating, setAcademicRating] = useState(8);
  const [behaviorRating, setBehaviorRating] = useState(8);
  const [commentStyle, setCommentStyle] = useState<CommentStyle>('warm');
  const [specialMemory, setSpecialMemory] = useState('');
  const [rewriteSeed, setRewriteSeed] = useState(0);

  const [outputComment, setOutputComment] = useState('');
  const [isManualEditMode, setIsManualEditMode] = useState(false);
  const [savedComments, setSavedComments] = useState<SavedComment[]>([]);
  const [toastMessage, setToastMessage] = useState('');
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, number>>({});

  const toastTimeoutRef = useRef<number | null>(null);

  const activeTraits = useMemo(
    () => selectedTraits.map((key) => traitsDb[key]?.[currentGender] || key),
    [selectedTraits, traitsDb, currentGender],
  );

  const activeSkills = useMemo(
    () => selectedSkills.map((key) => SKILLS_DB[key]?.[currentGender] || key),
    [selectedSkills, currentGender],
  );

  const showToast = (message: string) => {
    setToastMessage(message);
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = window.setTimeout(() => {
      setToastMessage('');
    }, 3500);
  };

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        window.clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const generateComment = () => {
    const name = studentName.trim();
    if (!name) return '';

    const isMale = currentGender === 'male';
    const firstName = name.split(/\s+/)[0] || name;

    const g = {
      dear: isMale ? 'היקר' : 'היקרה',
      you: isMale ? 'אתה' : 'את',
      clever: isMale ? 'נבון' : 'נבונה',
      choose: isMale ? 'שתבחר' : 'שתבחרי',
    };

    const header = `${firstName} ${g.dear},\n\n`;
    const openingVariants = [
      'ראשית, רציתי להודות לך על הזכות להיות חלק מתהליך הלמידה שלך; נהניתי מאוד ללמד אותך ואף נתרמתי בעצמי מהדרך המשותפת.',
      'סיום מחצית זו  הזדמנות מצוינת לעצור לרגע, להוקיר את הטוב, להכיר בתהליך ולהודות לך על הדרך המשותפת.',
      'הגענו לסיום הקורס, וזו  הזדמנות מצוינת לעצור, להביט לאחור ולהעריך את הדרך שעברת.',
      'רציתי להודות לך על תקופה משותפת מלאה בחוויות, אתגרים ולמידה משותפת ומשמעותית.',
      'ארצה להתחיל ולומר שהיה לי הכבוד ללמד אותך, ואני שמח מאוד לכתוב לך את סיכום התהליך מנקודת המבט שלי.',
      'לפני הכול, היה לי חשוב לעצור ולהודות לך על הדרך הרצינית והבוגרת שהבאת איתך לכל מפגש לאורך המחצית.',
      'במבט מסכם על התקופה שעברנו, אני חש צורך אמיתי להוקיר את ההשקעה שלך ואת האופן שבו גדלת והתפתחת בתוך התהליך.',
    ];

    const traitsImpactVariants = [
      'תכונות נפלאות אלו הפכו את הנוכחות שלך למשמעותית ומיוחדת במינה.',
      'תכונות אלו העניקו לנוכחות שלך ערך רב ותרומה ממשית למפגשים.',
      'החוזקות הללו הפכו אותך לדמות בולטת וחיובית בתהליך הלמידה.',
      'השילוב בין תכונות אלו יצר נוכחות יציבה, בוגרת ומעוררת הערכה.',
      'תכונות אלו תרמו לאווירה הלימודית והבליטו את הייחודיות שלך בקבוצה.',
      'בזכות תכונות אלו הנוכחות שלך הורגשה לטובה לאורך כל המחצית.',
      'המאפיינים הללו חיזקו את מקומך בקבוצה והפכו את התרומה שלך למשמעותית.',
      'תכונות אלו שיקפו את הייחודיות שלך  והפכו את המפגשים לעשירים ומדויקים יותר.',
      'השילוב בין תכונות אלו הבליט עומק, יציבות ותרומה עקבית שלך לתהליך.',
      'תכונות אלו הדגישו את האופי הייחודי שלך והעצימו את הערך שהבאת לכיתה.',
    ];

    const openingBaseIndex = getDeterministicIndex(`${firstName}_${commentStyle}`, openingVariants.length);
    const openingIndex = selectedVariants['para_1'] ?? (openingBaseIndex + rewriteSeed) % openingVariants.length;
    const opening = openingVariants[openingIndex % openingVariants.length];

    const professionalTopics = joinHebrewList([
      topic1 || '_______',
      topic2 || '_______',
      topic3 || '_______',
      topic4 || '_______',
    ]);
    const courseSentenceVariants = [
      `בקורס ${courseName || '_______'} נחשפנו לתכנים רבים הנוגעים להיבטים כלכליים בחיי היומיום כמו ${professionalTopics}.`,
      `במהלך קורס ${courseName || '_______'} נגענו בסוגיות רבות ובנושאים הנוגעים להיבטים כלכליים שונים במציאות שלנו, כמו ${professionalTopics}.`,
      `לאורך הלמידה בקורס ${courseName || '_______'} פרסנו את אתגרי המציאות ולמדנו כיצד אנו מושפעים מסוגיות כלכליות. לשם כך למדנו נושאים רלוונטיים כמו ${professionalTopics}.`,
      `בקורס ${courseName || '_______'} הקפדנו על ראייה מפוקחת וריאלית של המציאות הכלכלית, בחרנו נושאים תוך נאמנות לתוכן ושמירה על חוויית למידה מדויקת ומהנה. למדנו נושאים שונים כמו ${professionalTopics}.`,
    ];
    const courseBaseIndex = getDeterministicIndex(`${courseName}_${firstName}_course`, courseSentenceVariants.length);
    const courseIndex = selectedVariants['para_2'] ?? (courseBaseIndex + rewriteSeed) % courseSentenceVariants.length;
    const professionalSentence = courseSentenceVariants[courseIndex % courseSentenceVariants.length];

    const fallbackTraitKeys = ['curiosity', 'diligence', 'maturity', 'leadership'];
    const selectedTraitKeys = (selectedTraits.length > 0 ? selectedTraits : fallbackTraitKeys).slice(0, 4);
    while (selectedTraitKeys.length < 4) {
      selectedTraitKeys.push(fallbackTraitKeys[selectedTraitKeys.length]);
    }
    const traitsWithDescriptors = selectedTraitKeys.map((key) => {
      const mappedPhrase = TRAIT_PHRASE_BY_KEY[key];
      if (mappedPhrase) return mappedPhrase;
      const rawTrait = traitsDb[key]?.[currentGender] || key;
      return rawTrait.includes(' ') ? rawTrait : (rawTrait.startsWith('ה') ? rawTrait : `ה${rawTrait}`);
    });
    const traitsImpactBaseIndex = getDeterministicIndex(`${firstName}_${courseName}_traits`, traitsImpactVariants.length);
    const traitsImpactIndex = selectedVariants['para_3'] ?? (traitsImpactBaseIndex + rewriteSeed) % traitsImpactVariants.length;
    const traitsImpact = traitsImpactVariants[traitsImpactIndex % traitsImpactVariants.length];
    const traitsSentence = `לאורך המפגשים זכיתי להכיר את היכולות והתכונות הייחודיות שלך כמו ${joinHebrewList(traitsWithDescriptors)}. ${traitsImpact}`;

    const fallbackSkills = ['יכולת הבנה וניתוח מתקדמות', 'מיומנות שאילת שאלות', 'יכולת הקשבה פעילה'];
    const selectedSkillsText = (activeSkills.length > 0 ? activeSkills : fallbackSkills).slice(0, 3);
    while (selectedSkillsText.length < 3) {
      selectedSkillsText.push(fallbackSkills[selectedSkillsText.length]);
    }
    const learningSentence = `בתחום הלימודי, הפגנת ${joinHebrewList(selectedSkillsText)}.`;

    let academicFeedback = '';
    if (academicRating >= 9) {
      academicFeedback = 'הבנתך את התוכן הנלמד היא יסודית וברמה גבוהה, יישר כוח!';
    } else if (academicRating >= 7) {
      academicFeedback = 'ניכר כי הבנת את הנושאים אותם למדנו אך אמליץ להמשיך ולהעמיק על מנת לשפר את הבקיאות, בעבורך זו לא תהיה משימה קשה מידי.';
    } else if (academicRating >= 5) {
      academicFeedback = 'ניכר כי הבנת את הנושאים אותם למדנו אך אמליץ להמשיך ולהעמיק על מנת לשפר את הבקיאות, בעבורך זו לא תהיה משימה קשה מידי.';
    } else {
      academicFeedback = 'אציע לך להמשיך ולהעמיק בלמידה שכן התרשמתי שההבנה שבחלק מנושאי הקורס יכלה להיות מושגת הבנה נרחבת יותר.';
    }

    let socialSentence = '';
    let behavioralFeedback = '';
    if (behaviorRating >= 9) {
      behavioralFeedback = 'התנהלותך הנהדרת בשיעורים תרמה לאווירה הלימודית ואף היוותה דוגמה לתרבות דיון ושיח בעבור אחרים.';
    } else if (behaviorRating >= 7) {
      behavioralFeedback = 'התנהלותך הנהדרת בשיעורים תרמה לאווירה הלימודית ואף היוותה דוגמה לתרבות דיון ושיח בעבור אחרים.';
    } else if (behaviorRating >= 4) {
      behavioralFeedback = 'נוכחותך והתנהגותך בשיעורים הייתה טובה מאוד.';
    } else {
      behavioralFeedback = 'להמשך אציע לשים דגש לעיתים על תרבות דיון והקשבה לאחר לשם שיפור יכולות הלמידה ושמירה על החוויה הלימודית של האחרים.';
    }

    if (behaviorRating >= 9) {
      socialSentence = 'חברתית, היית דוגמה אישית חיובית, הובלת בגישה מכבדת ותרמת רבות לאקלים הכיתתי.';
    } else if (behaviorRating >= 7) {
      socialSentence = 'חברתית, השתלבת היטב בקבוצה, הקשבת לחבריך ושמרת על אווירה נעימה ומכבדת.';
    } else if (behaviorRating >= 5) {
      socialSentence = 'חברתית, היו רגעים מאתגרים סביב קשב ופטפוטים, אך לאורך הדרך ניכרה גם יכולת טובה לתקן ולהתקדם.';
    } else {
      socialSentence = 'חברתית, נדרשה עבודה משמעותית יותר על גבולות, קשב והתנהלות לימודית עקבית בתוך המפגשים.';
    }

    const memorySentence = specialMemory.trim()
      ? ` זכרתי במיוחד את הרגע שבו שיתפת אותנו ב${specialMemory.trim()}, והוא שיקף היטב את האישיות הייחודית שלך.`
      : '';

    const closingVariants = [
      `תודה על דרך משותפת ומלמדת. אני מאמין בך מאוד ואני משוכנע ${isMale ? 'שתמצא' : 'שתמצאי'} הצלחה וסיפוק בכל מה ${g.choose} לעשות. אני מאחל לך המון הצלחה בהמשך הדרך!`,
      'תודה רבה על האמון, שיתוף הפעולה והתרומה לחוויה הלימודית, אאחל הצלחה בהמשך הדרך.',
      `אני משוכנע שהדרך שלך תוביל אותך להישגים ושיאים מרגשים ומאחל לך הצלחה. תודה על דרך משותפת.`,
    ];
    const closingBaseIndex = getDeterministicIndex(`${firstName}_closing`, closingVariants.length);
    const closingIndex = selectedVariants['para_5'] ?? (closingBaseIndex + rewriteSeed) % closingVariants.length;
    const closing = closingVariants[closingIndex % closingVariants.length];

    return `${header}${opening}\n\n${professionalSentence}\n\n${traitsSentence}\n${learningSentence}\n${academicFeedback}\n${behavioralFeedback}\n\n${socialSentence}${memorySentence}\n\n${closing}`;
  };

  useEffect(() => {
    if (isManualEditMode) return;
    setOutputComment(generateComment());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    className,
    courseName,
    topic1,
    topic2,
    topic3,
    topic4,
    studentName,
    currentGender,
    selectedTraits,
    selectedSkills,
    traitsDb,
    academicRating,
    behaviorRating,
    commentStyle,
    specialMemory,
    rewriteSeed,
    selectedVariants,
    isManualEditMode,
  ]);

  const toggleTrait = (key: string) => {
    setSelectedTraits((prev) => (prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]));
  };

  const toggleSkill = (key: string) => {
    setSelectedSkills((prev) => (prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]));
  };

  const addCustomTrait = () => {
    const traitVal = customTrait.trim();
    if (!traitVal) return;
    const key = `custom_${Date.now()}`;
    setTraitsDb((prev) => ({ ...prev, [key]: { male: traitVal, female: traitVal } }));
    setSelectedTraits((prev) => [...prev, key]);
    setCustomTrait('');
  };

  const resetForm = () => {
    setStudentName('');
    setSpecialMemory('');
    setAcademicRating(8);
    setBehaviorRating(8);
    setSelectedTraits(['curiosity', 'diligence']);
    setSelectedSkills(['analysis', 'questioning']);
    setIsManualEditMode(false);
  };

  const regenerateWording = () => {
    if (!studentName.trim()) {
      showToast('הזן שם תלמיד כדי ליצור ניסוח חלופי.');
      return;
    }
    setIsManualEditMode(false);
    setRewriteSeed((prev) => prev + 1);
  };

  const commentParts = [
    { id: 'opening', label: 'פתיחה' },
    { id: 'course', label: 'קורס' },
    { id: 'traits', label: 'תכונות' },
    { id: 'academic', label: 'לימודי' },
    { id: 'behavioral', label: 'התנהגותי' },
    { id: 'closing', label: 'סיכום' },
  ];

  const cycleVariant = (partId: string, maxVariants: number) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [partId]: ((prev[partId] || 0) + 1) % maxVariants,
    }));
    setRewriteSeed((prev) => prev + 1);
  };

  const getCommentVariants = () => {
    const name = studentName.trim();
    if (!name) return null;

    const isMale = currentGender === 'male';
    const firstName = name.split(/\s+/)[0] || name;

    const openingVariants = [
      'ראשית, רציתי להודות לך על הזכות להיות חלק מתהליך הלמידה שלך; נהניתי מאוד ללמד אותך ואף נתרמתי בעצמי מהדרך המשותפת.',
      'סיום מחצית זו  הזדמנות מצוינת לעצור לרגע, להוקיר את הטוב, להכיר בתהליך ולהודות לך על הדרך המשותפת.',
      'הגענו לסיום הקורס, וזו  הזדמנות מצוינת לעצור, להביט לאחור ולהעריך את הדרך שעברת.',
      'רציתי להודות לך על תקופה משותפת מלאה בחוויות, אתגרים ולמידה משותפת ומשמעותית.',
      'ארצה להתחיל ולומר שהיה לי הכבוד ללמד אותך, ואני שמח מאוד לכתוב לך את סיכום התהליך מנקודת המבט שלי.',
      'לפני הכול, היה לי חשוב לעצור ולהודות לך על הדרך הרצינית והבוגרת שהבאת איתך לכל מפגש לאורך המחצית.',
      'במבט מסכם על התקופה שעברנו, אני חש צורך אמיתי להוקיר את ההשקעה שלך ואת האופן שבו גדלת והתפתחת בתוך התהליך.',
      'החוויה של הלמידה איתך הייתה עשירה ומעמיקה, והיא תרמה הרבה לעבודתי כמחנך',
      'ברצוני להודות לך על הניסיון המשותף שלנו, על הרצינות בה התגברת על אתגרים.',
      'את/ה הצגת בפנינו תובנות וראיות שהעשירו את התהליך הלימודי של הקבוצה כולה.',
      'הדרך שלך כלל מרגעים של הבנה עמוקה, גדילה ואתגרים שמתוך כולם חצבת קשיות ועיקשות.',
      'רציתי שתדעי/י שהיה זה כבוד ותענוג ללמד אותך, וראיתי בך תלמיד/ה אמיתי/ת העמוק/ה בגדילה והתפתחות.',
      'בעת שנסקור את התקופה שעברנו, מתגלות רגעים של כושר יצירה, שאלות חדשות וחשיבה מחודשת.',
      'הצורך שלך ללמוד בעוד עמוקות, וההנאה שלך מתהליך הלמידה, היוו למני השראה.',
      'האחריות שלך לעצמך וטבעך הסקרן יצרו סביבה חזקה של למידה משמעותית',
      'ראיתי בך כל לאורך השנה דוגמה של אדם שלוקח את עצמו ברצינות ומחויב ללמידה.',
    ];

    const professionalTopics = joinHebrewList([
      topic1 || '_______',
      topic2 || '_______',
      topic3 || '_______',
      topic4 || '_______',
    ]);
    const courseSentenceVariants = [
      `בקורס ${courseName || '_______'} נחשפנו לתכנים רבים הנוגעים להיבטים כלכליים בחיי היומיום כמו ${professionalTopics}.`,
      `במהלך קורס ${courseName || '_______'} נגענו בסוגיות רבות ובנושאים הנוגעים להיבטים כלכליים שונים במציאות שלנו, כמו ${professionalTopics}.`,
      `לאורך הלמידה בקורס ${courseName || '_______'} פרסנו את אתגרי המציאות ולמדנו כיצד אנו מושפעים מסוגיות כלכליות. לשם כך למדנו נושאים רלוונטיים כמו ${professionalTopics}.`,
      `בקורס ${courseName || '_______'} הקפדנו על ראייה מפוקחת וריאלית של המציאות הכלכלית, בחרנו נושאים תוך נאמנות לתוכן ושמירה על חוויית למידה מדויקת ומהנה. למדנו נושאים שונים כמו ${professionalTopics}.`,
    ];

    const traitsImpactVariants = [
      'תכונות נפלאות אלו הפכו את הנוכחות שלך למשמעותית ומיוחדת במינה.',
      'תכונות אלו העניקו לנוכחות שלך ערך רב ותרומה ממשית למפגשים.',
      'החוזקות הללו הפכו אותך לדמות בולטת וחיובית בתהליך הלמידה.',
      'השילוב בין תכונות אלו יצר נוכחות יציבה, בוגרת ומעוררת הערכה.',
      'תכונות אלו תרמו לאווירה הלימודית והבליטו את הייחודיות שלך בקבוצה.',
      'בזכות תכונות אלו הנוכחות שלך הורגשה לטובה לאורך כל המחצית.',
      'המאפיינים הללו חיזקו את מקומך בקבוצה והפכו את התרומה שלך למשמעותית.',
      'תכונות אלו שיקפו את הייחודיות שלך  והפכו את המפגשים לעשירים ומדויקים יותר.',
      'השילוב בין תכונות אלו הבליט עומק, יציבות ותרומה עקבית שלך לתהליך.',
      'תכונות אלו הדגישו את האופי הייחודי שלך והעצימו את הערך שהבאת לכיתה.',
    ];

    const closingVariants = [
      `תודה על דרך משותפת ומלמדת. אני מאמין בך מאוד ואני משוכנע ${isMale ? 'שתמצא' : 'שתמצאי'} הצלחה וסיפוק בכל מה שתבחר לעשות. אני מאחל לך המון הצלחה בהמשך הדרך!`,
      'תודה רבה על האמון, שיתוף הפעולה והתרומה לחוויה הלימודית, אאחל הצלחה בהמשך הדרך.',
      `אני משוכנע שהדרך שלך תוביל אותך להישגים ושיאים מרגשים ומאחל לך הצלחה. תודה על דרך משותפת.`,
    ];

    return {
      opening: openingVariants,
      course: courseSentenceVariants,
      traits: traitsImpactVariants,
      closing: closingVariants,
    };
  };

  const copyToClipboard = async () => {
    const text = outputComment.trim();
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      showToast('ההערה הועתקה ללוח בהצלחה!');
    } catch {
      showToast('לא ניתן היה להעתיק אוטומטית. אפשר לסמן ולהעתיק ידנית.');
    }
  };

  const insertToTable = () => {
    const name = studentName.trim();
    const comment = outputComment.trim();

    if (!name) {
      showToast('אנא הזן שם תלמיד לפני ההזנה לטבלה.');
      return;
    }

    setSavedComments((prev) => [...prev, { id: Date.now(), name, comment }]);
    resetForm();
    showToast('התלמיד נרשם בטבלה בהצלחה! הטופס מוכן לתלמיד הבא.');
  };

  const loadFromHistory = (id: number) => {
    const found = savedComments.find((item) => item.id === id);
    if (!found) return;
    setStudentName(found.name);
    setOutputComment(found.comment);
    window.scrollTo({ top: 260, behavior: 'smooth' });
  };

  const deleteFromHistory = (id: number) => {
    setSavedComments((prev) => prev.filter((item) => item.id !== id));
  };

  const exportTableToCSV = () => {
    if (savedComments.length === 0) {
      showToast('הטבלה ריקה! הזן לפחות תלמיד אחד לפני הפקת הקובץ.');
      return;
    }

    let csvContent = '\uFEFF';
    csvContent += '"שם התלמיד","הערה"\n';

    savedComments.forEach((item) => {
      const escapedName = item.name.replace(/"/g, '""');
      const escapedComment = item.comment.replace(/"/g, '""');
      csvContent += `"${escapedName}","${escapedComment}"\n`;
    });

    const cleanClassName = (className.trim() || 'כללי').replace(/[^a-zA-Z0-9א-ת\s-_]/g, '');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `הערות_תלמידים_כיתה_${cleanClassName}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const emptyState = studentName.trim().length === 0;

  return (
    <div className="space-y-6">
      {onBack && (
        <button
          onClick={onBack}
          className="px-5 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
        >
          חזרה לכלים לניהול קבוצה
        </button>
      )}

      <header className="bg-gradient-to-r from-indigo-600 to-violet-700 text-white shadow-md rounded-3xl py-6 px-4 sm:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm">✍️</div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">מחולל הערות "ממני אליך"</h1>
              <p className="text-indigo-100 text-sm mt-1">מערכת לכתיבת משוב אישי ומדויק לתלמידים ותלמידות</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-indigo-800/50 px-4 py-2 rounded-lg border border-indigo-500/30 text-xs sm:text-sm">
            <span>מחזור פעיל: מחצית א' / ב'</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <section className="bg-white rounded-2xl p-6 shadow-sm border-2 border-indigo-100 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-indigo-900">הגדרות קורס כלליות (להזנה חד-פעמית)</h2>
              <p className="text-xs text-slate-400 mt-1">הנתונים כאן משולבים בכל ההערות ובשם קובץ הדוח.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">שם הכיתה (לשם הקובץ בלבד)</label>
                <input value={className} onChange={(e) => setClassName(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">שם הקורס (יופיע בהערה)</label>
                <input value={courseName} onChange={(e) => setCourseName(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">4 נושאי הקורס העיקריים (יופיעו בהערה לפי הסדר)</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <input value={topic1} onChange={(e) => setTopic1(e.target.value)} className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs" />
                <input value={topic2} onChange={(e) => setTopic2(e.target.value)} className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs" />
                <input value={topic3} onChange={(e) => setTopic3(e.target.value)} className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs" />
                <input value={topic4} onChange={(e) => setTopic4(e.target.value)} className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs" />
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-800">הזנת נתוני התלמיד/ה</h2>
              <button onClick={resetForm} className="text-xs text-slate-400 hover:text-red-500">איפוס טופס נוכחי</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">שם התלמיד/ה</label>
                <input value={studentName} onChange={(e) => setStudentName(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">מגדר</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setCurrentGender('male')}
                    className={`py-2 px-3 rounded-lg text-sm font-medium border ${currentGender === 'male' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  >
                    בן (היקר)
                  </button>
                  <button
                    onClick={() => setCurrentGender('female')}
                    className={`py-2 px-3 rounded-lg text-sm font-medium border ${currentGender === 'female' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  >
                    בת (היקרה)
                  </button>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-slate-700">תכונות אופי בולטות</label>
                <span className="text-xs text-slate-400">מומלץ לבחור 2-3 תכונות</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.entries(traitsDb).map(([key, value]) => (
                  <label key={key} className="flex items-center gap-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer text-xs font-semibold text-slate-600">
                    <input
                      type="checkbox"
                      checked={selectedTraits.includes(key)}
                      onChange={() => toggleTrait(key)}
                      className="rounded text-indigo-600 w-4 h-4"
                    />
                    <span>{value[currentGender]}</span>
                  </label>
                ))}
              </div>
              <div className="mt-2.5 flex gap-2">
                <input
                  value={customTrait}
                  onChange={(e) => setCustomTrait(e.target.value)}
                  placeholder="הוסף תכונה מותאמת אישית..."
                  className="flex-grow px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                />
                <button onClick={addCustomTrait} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg">
                  הוספה
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-slate-700">יכולות למידה וחוזקות</label>
                <span className="text-xs text-slate-400">מומלץ לבחור 1-2 חוזקות</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.entries(SKILLS_DB).map(([key, value]) => (
                  <label key={key} className="flex items-center gap-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer text-xs font-semibold text-slate-600">
                    <input
                      type="checkbox"
                      checked={selectedSkills.includes(key)}
                      onChange={() => toggleSkill(key)}
                      className="rounded text-indigo-600 w-4 h-4"
                    />
                    <span>{value[currentGender]}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-700">דירוג לימודי (1-10)</label>
                  <span className="bg-indigo-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">{academicRating}</span>
                </div>
                <input type="range" min={1} max={10} value={academicRating} onChange={(e) => setAcademicRating(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg" />
                <p className="text-xs text-indigo-600 font-medium min-h-[1.5rem]">{ACADEMIC_LABELS[academicRating]}</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-700">דירוג התנהגותי (1-10)</label>
                  <span className="bg-violet-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">{behaviorRating}</span>
                </div>
                <input type="range" min={1} max={10} value={behaviorRating} onChange={(e) => setBehaviorRating(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg" />
                <p className="text-xs text-violet-600 font-medium min-h-[1.5rem]">{BEHAVIOR_LABELS[behaviorRating]}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">סגנון הכתיבה</label>
                <select value={commentStyle} onChange={(e) => setCommentStyle(e.target.value as CommentStyle)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white">
                  {STYLES.map((style) => (
                    <option key={style.value} value={style.value}>{style.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">הערה מיוחדת או זיכרון כיתתי (אופציונלי)</label>
                <input value={specialMemory} onChange={(e) => setSpecialMemory(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
              </div>
            </div>
          </section>
        </div>

        <section className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow-md border border-slate-100 flex-grow flex flex-col overflow-hidden">
            <div className="bg-slate-900 text-slate-100 p-4 flex justify-between items-center">
              <h3 className="font-bold text-sm sm:text-base">תצוגה מקדימה חיה</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsManualEditMode((prev) => !prev)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded text-slate-300 border border-slate-700"
                >
                  {isManualEditMode ? 'חזרה לחלופות' : 'עריכה ידנית'}
                </button>
                <button onClick={regenerateWording} className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded text-slate-300 border border-slate-700">
                  ניסוח אחר
                </button>
              </div>
            </div>

            <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
              <div className="bg-slate-50 p-5 rounded-xl border border-dashed border-slate-200 flex-grow overflow-y-auto min-h-[300px] max-h-[500px]">
                {isManualEditMode ? (
                  <textarea
                    value={outputComment}
                    onChange={(e) => setOutputComment(e.target.value)}
                    className="w-full h-full min-h-[280px] bg-transparent resize-none border-none outline-none text-slate-700 leading-relaxed font-medium text-sm sm:text-base"
                  />
                ) : (
                  <div
                    className="text-slate-700 leading-relaxed font-medium text-sm sm:text-base whitespace-pre-wrap"
                  >
                    {outputComment ? (
                    <>
                      {outputComment.split('\n\n').map((paragraph, idx) => {
                        const variants = getCommentVariants();
                        const variantIndex = selectedVariants[`para_${idx}`] || 0;
                        const sectionMap: Record<number, { key: string; options: string[] }> = {
                          1: { key: 'opening', options: variants?.opening || [] },
                          2: { key: 'course', options: variants?.course || [] },
                          3: { key: 'traits', options: variants?.traits || [] },
                          5: { key: 'closing', options: variants?.closing || [] },
                        };
                        const sectionInfo = sectionMap[idx];

                        return (
                          <button
                            key={idx}
                            type="button"
                            className="mb-4 w-full text-right p-3 rounded-lg transition-colors relative"
                            onMouseEnter={() => sectionInfo && setHoveredPart(`para_${idx}`)}
                            onMouseLeave={() => sectionInfo && setHoveredPart(null)}
                            onClick={() => {
                              if (!sectionInfo || sectionInfo.options.length === 0) return;
                              setSelectedVariants((prev) => ({
                                ...prev,
                                [`para_${idx}`]: (variantIndex + 1) % sectionInfo.options.length,
                              }));
                              setIsManualEditMode(false);
                            }}
                            style={{
                              backgroundColor: sectionInfo && hoveredPart === `para_${idx}` ? 'rgb(226, 232, 240)' : 'transparent',
                              cursor: sectionInfo ? 'pointer' : 'default',
                            }}
                          >
                            <span className="block whitespace-pre-wrap">{paragraph}</span>
                            {hoveredPart === `para_${idx}` && sectionInfo && (
                              <span className="mt-2 inline-block px-2 py-1 text-xs bg-indigo-600 text-white rounded">
                                לחץ להחלפה {variantIndex + 1}/{sectionInfo.options.length}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </>
                  ) : (
                    <div className="text-center text-slate-400 py-12">
                      <p className="font-bold">מחכה לשם התלמיד...</p>
                      <p className="text-xs mt-1">הזן שם למעלה והמערכת תתחיל להרכיב את ההערה</p>
                    </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button onClick={copyToClipboard} className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold py-3 px-4 rounded-xl text-sm">
                    העתק טקסט
                  </button>
                  <button onClick={insertToTable} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl text-sm">
                    הזן לטבלה ועבור לבא
                  </button>
                </div>
                {toastMessage && (
                  <div className="text-xs text-center font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 py-2.5 rounded-lg">
                    {toastMessage}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800">טבלת מעקב והפקת דוחות</h3>
            <p className="text-xs text-slate-400 mt-1">רשימת התלמידים וההערות שהוזנו במושב הנוכחי</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button onClick={exportTableToCSV} className="flex-grow sm:flex-grow-0 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-5 rounded-xl text-sm">
              הפק טבלה (הורדת קובץ אקסל)
            </button>
            <span className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl border border-slate-200">
              סה"כ: {savedComments.length} תלמידים
            </span>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-right border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                <th className="p-3.5 w-48">שם התלמיד/ה</th>
                <th className="p-3.5">הערה מפורטת ("ממני אליך")</th>
                <th className="p-3.5 w-32 text-center">פעולות</th>
              </tr>
            </thead>
            <tbody className="text-slate-600 divide-y divide-slate-100">
              {savedComments.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-slate-400">אין תלמידים רשומים בטבלה כרגע.</td>
                </tr>
              ) : (
                savedComments.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5 font-bold text-slate-800 whitespace-nowrap">{item.name}</td>
                    <td className="p-3.5 text-xs text-slate-600 leading-relaxed">
                      <div className="max-h-20 overflow-auto whitespace-pre-line">{item.comment}</div>
                    </td>
                    <td className="p-3.5 text-center">
                      <div className="flex justify-center gap-1.5">
                        <button onClick={() => loadFromHistory(item.id)} className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold px-2.5 py-1.5 rounded-lg border border-indigo-200">
                          טען
                        </button>
                        <button onClick={() => deleteFromHistory(item.id)} className="text-xs bg-slate-50 hover:bg-red-500 hover:text-white text-slate-500 font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200">
                          מחק
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default FromMeToYouCommentGenerator;
