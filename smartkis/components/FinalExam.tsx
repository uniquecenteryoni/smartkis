import React, { useState, useEffect } from 'react';
import ModuleView from './ModuleView';

interface FinalExamProps {
  onBack: () => void;
  title: string;
}

// --- Question Types ---
type Question = MultipleChoiceQuestion | MatchingQuestion | CategorizationQuestion;

interface BaseQuestion {
    id: number;
    question: string;
}

interface MultipleChoiceQuestion extends BaseQuestion {
    type: 'multiple-choice';
    options: string[];
    answer: string;
}

interface MatchingQuestion extends BaseQuestion {
    type: 'matching';
    pairs: { term: string; definition: string }[];
}

interface CategorizationQuestion extends BaseQuestion {
    type: 'categorization';
    categories: string[];
    items: { name: string; category: string }[];
}


// --- Question Bank ---
const allQuestions: Question[] = [
    // --- Multiple Choice (Easy) ---
    {
        id: 1, type: 'multiple-choice',
        question: "בניית תקציב מאוזן פירושה:",
        options: ["שההוצאות גבוהות מההכנסות", "שההכנסות שוות להוצאות או גבוהות מהן", "לחסוך את כל הכסף", "להוציא כסף רק על דברים קבועים"],
        answer: "שההכנסות שוות להוצאות או גבוהות מהן"
    },
    {
        id: 2, type: 'multiple-choice',
        question: "מה ההבדל העיקרי בין שכר 'ברוטו' לשכר 'נטו'?",
        options: ["אין הבדל, אלו שני שמות לאותו הדבר", "נטו הוא מה שנכנס לבנק אחרי כל הניכויים, ברוטו הוא הסכום לפני הניכויים", "ברוטו הוא מה שנכנס לבנק, נטו הוא לפני ניכויים", "ברוטו הוא רק השכר הבסיסי, נטו כולל שעות נוספות"],
        answer: "נטו הוא מה שנכנס לבנק אחרי כל הניכויים, ברוטו הוא הסכום לפני הניכויים"
    },
    {
        id: 3, type: 'multiple-choice',
        question: "מדוע מינוס (אוברדראפט) נחשב למסוכן?",
        options: ["כי הבנק יכול לסגור את החשבון בכל רגע", "כי הבנק גובה עליו ריבית גבוהה מאוד, מה שמגדיל את החוב", "כי אי אפשר להשתמש בכרטיס אשראי כשנמצאים בו", "כי הוא מדווח מיידית לכל הגופים הפיננסיים"],
        answer: "כי הבנק גובה עליו ריבית גבוהה מאוד, מה שמגדיל את החוב"
    },
    {
        id: 4, type: 'multiple-choice',
        question: "כאשר יש אינפלציה, מה קורה לכוח הקנייה של הכסף?",
        options: ["הוא גדל", "הוא נשאר זהה", "הוא נחלש (אפשר לקנות פחות באותו סכום)", "הוא הופך ללא יציב"],
        answer: "הוא נחלש (אפשר לקנות פחות באותו סכום)"
    },
    {
        id: 5, type: 'multiple-choice',
        question: "מהי הדוגמה הטובה ביותר ל'הוצאה קבועה'?",
        options: ["קניות בסופרמרקט", "חשבון חשמל", "דמי שכירות חודשיים", "בילוי בקולנוע"],
        answer: "דמי שכירות חודשיים"
    },
    // --- Categorization (Medium) ---
    {
        id: 6, type: 'categorization',
        question: "גררו כל הוצאה לעמודה הנכונה: הוצאות קבועות או משתנות.",
        categories: ['הוצאות קבועות', 'הוצאות משתנות'],
        items: [
            { name: 'שכר דירה', category: 'הוצאות קבועות' },
            { name: 'יציאה למסעדה', category: 'הוצאות משתנות' },
            { name: 'חשבון חשמל', category: 'הוצאות משתנות' },
            { name: 'מנוי לחדר כושר', category: 'הוצאות קבועות' },
            { name: 'קניית בגדים', category: 'הוצאות משתנות' },
            { name: 'ביטוח רכב', category: 'הוצאות קבועות' }
        ]
    },
    // --- Multiple Choice (Medium) ---
    {
        id: 7, type: 'multiple-choice',
        question: "מהי 'ריבית דריבית'?",
        options: ["ריבית שהבנק דורש ממך לשלם על המינוס", "ריבית שמחושבת גם על הקרן וגם על הריבית שנצברה, מה שגורם לצמיחה מהירה", "סוג של מס על חסכונות", "ריבית שמשלמים רק בסוף תקופת החיסכון"],
        answer: "ריבית שמחושבת גם על הקרן וגם על הריבית שנצברה, מה שגורם לצמיחה מהירה"
    },
    {
        id: 8, type: 'multiple-choice',
        question: "איזה מהרכיבים הבאים *אינו* ניכוי חובה בתלוש השכר?",
        options: ["מס הכנסה", "ביטוח לאומי", "קרן השתלמות", "מס בריאות"],
        answer: "קרן השתלמות"
    },
     // --- Matching (Medium) ---
    {
        id: 9, type: 'matching',
        question: "התאימו בין המושג להסבר שלו.",
        pairs: [
            { term: 'תקציב', definition: 'תוכנית הכנסות והוצאות לתקופה מסוימת' },
            { term: 'אינפלציה', definition: 'שחיקה בכוח הקנייה של הכסף' },
            { term: 'נכס', definition: 'פריט בעל ערך כלכלי שבבעלותך' },
            { term: 'התחייבות', definition: 'חוב כספי או מחויבות פיננסית' }
        ]
    },
    {
        id: 10, type: 'multiple-choice',
        question: "מהי הדרך הטובה ביותר להתחיל לצאת ממינוס?",
        options: ["לקחת הלוואה גדולה כדי לכסות אותו", "להתעלם ממנו ולקוות שיסתדר", "לבנות תקציב, לעקוב אחר הוצאות ולקצץ בהוצאות משתנות", "להשקיע את כל הכסף שנשאר במניות מסוכנות"],
        answer: "לבנות תקציב, לעקוב אחר הוצאות ולקצץ בהוצאות משתנות"
    },
    // --- Multiple Choice (Hard) ---
    {
        id: 11, type: 'multiple-choice',
        question: "איזה גורם משפיע בצורה החזקה ביותר על גודל החיסכון לטווח ארוך (30+ שנים) בעזרת ריבית דריבית?",
        options: ["הסכום ההתחלתי", "גובה ההפקדה החודשית", "אחוז הריבית השנתית", "זמן (מספר השנים)"],
        answer: "זמן (מספר השנים)"
    },
    {
        id: 12, type: 'multiple-choice',
        question: "אם שכר הברוטו שלך הוא 10,000 ש\"ח וסך הניכויים הוא 2,500 ש\"ח, מה יהיה שכר הנטו שלך?",
        options: ["12,500 ש\"ח", "10,000 ש\"ח", "7,500 ש\"ח", "אי אפשר לדעת מהנתונים האלה"],
        answer: "7,500 ש\"ח"
    },
      // --- Matching (Hard) ---
    {
        id: 13, type: 'matching',
        question: "התאימו בין סוג ההשקעה לרמת הסיכון האופיינית לו.",
        pairs: [
            { term: 'מניית טכנולוגיה', definition: 'סיכון גבוה' },
            { term: 'פיקדון בנקאי', definition: 'סיכון נמוך' },
            { term: 'אגרת חוב ממשלתית', definition: 'סיכון נמוך-בינוני' },
            { term: 'קרן סל S&P 500', definition: 'סיכון בינוני' }
        ]
    },
    {
        id: 14, type: 'multiple-choice',
        question: "מה בנק ישראל עושה בדרך כלל כדי להילחם באינפלציה גבוהה?",
        options: ["מוריד את הריבית כדי לעודד צריכה", "מדפיס עוד כסף כדי שיהיה לאנשים יותר", "מעלה את הריבית כדי 'לקרר' את הכלכלה ולהפחית את הביקושים", "ממליץ לממשלה להוריד מסים"],
        answer: "מעלה את הריבית כדי 'לקרר' את הכלכלה ולהפחית את הביקושים"
    },
     // --- Categorization (Hard) ---
    {
        id: 15, type: 'categorization',
        question: "גררו כל פעולה לקטגוריה הנכונה: מגדילה או מקטינה הון עצמי.",
        categories: ['מגדיל הון עצמי', 'מקטין הון עצמי'],
        items: [
            { name: 'חיסכון חודשי בפיקדון', category: 'מגדיל הון עצמי' },
            { name: 'לקיחת הלוואה לקניית רכב', category: 'מקטין הון עצמי' },
            { name: 'קבלת העלאה במשכורת', category: 'מגדיל הון עצמי' },
            { name: 'תשואה חיובית על השקעה', category: 'מגדיל הון עצמי' },
            { name: 'יציאה לחופשה יקרה', category: 'מקטין הון עצמי' },
        ]
    },
];

// --- Question Components ---

const MC_Question: React.FC<{ questionData: MultipleChoiceQuestion, onAnswered: (correct: boolean) => void }> = ({ questionData, onAnswered }) => {
    const [selectedOption, setSelectedOption] = useState('');
    const [feedback, setFeedback] = useState('');

    const handleSelect = (option: string) => {
        if(selectedOption) return;
        setSelectedOption(option);
        const isCorrect = option === questionData.answer;
        setFeedback(isCorrect ? 'נכון מאוד!' : `טעות. התשובה הנכונה: "${questionData.answer}"`);
        onAnswered(isCorrect);
    };

    return (
        <div>
            <p className="text-2xl mb-4">{questionData.question}</p>
            <div className="space-y-3">
                {questionData.options.map(opt => (
                     <button key={opt} onClick={() => handleSelect(opt)} disabled={!!selectedOption} className={`block w-full text-right p-4 rounded-md transition-colors text-xl ${selectedOption ? (opt === questionData.answer ? 'bg-green-600 text-white' : (opt === selectedOption ? 'bg-red-600 text-white' : 'bg-white/50')) : 'bg-white/80 hover:bg-white'}`}>
                        {opt}
                    </button>
                ))}
            </div>
            {feedback && <p className="mt-4 p-3 bg-white/40 rounded-lg font-bold text-lg">{feedback}</p>}
        </div>
    );
};

const Matching_Question: React.FC<{ questionData: MatchingQuestion, onAnswered: (correct: boolean) => void }> = ({ questionData, onAnswered }) => {
    const [terms] = useState(() => questionData.pairs.map(p => p.term).sort(() => Math.random() - 0.5));
    const [definitions] = useState(() => questionData.pairs.map(p => p.definition).sort(() => Math.random() - 0.5));
    const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
    const [matches, setMatches] = useState<{[key: string]: string}>({});
    const [submitted, setSubmitted] = useState(false);

    const handleTermSelect = (term: string) => {
        if (submitted || matches[term]) return;
        setSelectedTerm(term);
    };

    const handleDefinitionSelect = (definition: string) => {
        if (submitted || !selectedTerm || Object.values(matches).includes(definition)) return;
        setMatches(prev => ({...prev, [selectedTerm]: definition}));
        setSelectedTerm(null);
    };
    
    const handleSubmit = () => {
        if (submitted) return;
        setSubmitted(true);
        let correctMatches = 0;
        questionData.pairs.forEach(pair => {
            if (matches[pair.term] === pair.definition) {
                correctMatches++;
            }
        });
        onAnswered(correctMatches === questionData.pairs.length);
    };
    
    const isCorrect = (term: string) => questionData.pairs.find(p => p.term === term)?.definition === matches[term];

    return (
        <div>
            <p className="text-2xl mb-4">{questionData.question}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">{terms.map(term => (
                    <button key={term} onClick={() => handleTermSelect(term)} disabled={submitted || !!matches[term]}
                        className={`w-full p-3 rounded text-xl transition-colors text-white ${submitted ? (isCorrect(term) ? 'bg-green-600' : 'bg-red-600') : (selectedTerm === term ? 'bg-yellow-500' : 'bg-brand-dark-blue hover:bg-gray-600')} disabled:opacity-50`}>
                        {term}
                    </button>
                ))}</div>
                <div className="space-y-2">{definitions.map(def => (
                    <button key={def} onClick={() => handleDefinitionSelect(def)} disabled={submitted || Object.values(matches).includes(def)}
                         className={`w-full p-3 rounded text-xl transition-colors ${submitted ? 'bg-white/50' : 'bg-white/80 hover:bg-white'} disabled:opacity-50`}>
                        {def}
                    </button>
                ))}</div>
            </div>
            {Object.keys(matches).length === terms.length && !submitted &&
                <button onClick={handleSubmit} className="mt-4 w-full bg-brand-magenta text-white font-bold p-3 rounded-lg text-xl">בדיקה</button>
            }
             {submitted && <p className="mt-4 p-3 bg-white/40 rounded-lg font-bold text-lg">{isCorrect ? "כל ההתאמות נכונות!" : "נמצאו טעויות בהתאמה."}</p>}
        </div>
    );
};

const Categorization_Question: React.FC<{ questionData: CategorizationQuestion, onAnswered: (correct: boolean) => void }> = ({ questionData, onAnswered }) => {
    const [unassignedItems, setUnassignedItems] = useState(() => questionData.items.map(i => i.name));
    const [assignments, setAssignments] = useState<{[key: string]: string[]}>({});
    const [submitted, setSubmitted] = useState(false);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: string) => {
        if (submitted) return;
        e.dataTransfer.setData('text/plain', item);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetCategory: string) => {
        if (submitted) return;
        e.preventDefault();
        const item = e.dataTransfer.getData('text/plain');

        if (unassignedItems.includes(item)) {
            setUnassignedItems(prev => prev.filter(i => i !== item));
            setAssignments(prev => ({
                ...prev,
                [targetCategory]: [...(prev[targetCategory] || []), item]
            }));
        }
    };

    const handleSubmit = () => {
        if (submitted) return;
        setSubmitted(true);
        let allCorrect = true;
        questionData.items.forEach(item => {
            const assignedCategory = Object.keys(assignments).find(cat => assignments[cat]?.includes(item.name));
            if (assignedCategory !== item.category) {
                allCorrect = false;
            }
        });
        onAnswered(allCorrect);
    };
    
    return (
        <div>
            <p className="text-2xl mb-4">{questionData.question}</p>
            <div className="p-4 bg-white/30 rounded-lg mb-4">
                <h3 className="text-xl font-bold text-center mb-2">פריטים למיון</h3>
                <div className="flex flex-wrap justify-center gap-2 min-h-[40px]">
                    {unassignedItems.map(item => (
                        <div key={item} draggable onDragStart={(e) => handleDragStart(e, item)} className="p-3 rounded bg-white shadow-md hover:bg-gray-100 cursor-move transition-colors text-lg">
                            {item}
                        </div>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {questionData.categories.map(cat => (
                    <div key={cat} onDrop={(e) => handleDrop(e, cat)} onDragOver={handleDragOver} className="p-4 bg-white/30 rounded-lg min-h-[150px]">
                        <h3 className="text-center font-bold text-xl text-brand-light-blue border-b-2 border-brand-light-blue pb-2 mb-2">{cat}</h3>
                        <div className="space-y-2">
                            {(assignments[cat] || []).map(item => {
                                const isCorrect = questionData.items.find(i => i.name === item)?.category === cat;
                                return <div key={item} className={`p-2 rounded text-center text-lg text-white ${submitted ? (isCorrect ? 'bg-green-600' : 'bg-red-600') : 'bg-white text-brand-dark-blue'}`}>{item}</div>
                            })}
                        </div>
                    </div>
                ))}
            </div>
            {unassignedItems.length === 0 && !submitted &&
                <button onClick={handleSubmit} className="mt-4 w-full bg-brand-magenta text-white font-bold p-3 rounded-lg text-xl">בדיקה</button>
            }
            {submitted && <p className="mt-4 p-3 bg-white/40 rounded-lg font-bold text-lg">תשובתך נבדקה. תוכל להמשיך לשאלה הבאה.</p>}
        </div>
    );
};


// --- Main Component ---
const FinalExam: React.FC<FinalExamProps> = ({ onBack, title }) => {
    const [examState, setExamState] = useState<'nameInput' | 'quiz' | 'results'>('nameInput');
    const [userName, setUserName] = useState('');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [answerSubmitted, setAnswerSubmitted] = useState(false);
    
    useEffect(() => {
        setQuestions(allQuestions.sort(() => Math.random() - 0.5));
    }, []);

    const handleAnswer = (isCorrect: boolean) => {
        if (isCorrect) {
            setScore(prev => prev + 1);
        }
        setAnswerSubmitted(true);
    };
    
    const nextQuestion = () => {
        if(currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setAnswerSubmitted(false);
        } else {
            setExamState('results');
        }
    }

    const startQuiz = () => {
        if (userName.trim()) {
            setExamState('quiz');
        }
    }
    
    const renderCurrentQuestion = () => {
        const q = questions[currentQuestionIndex];
        if (!q) return null;

        switch (q.type) {
            case 'multiple-choice':
                return <MC_Question questionData={q} onAnswered={handleAnswer} />;
            case 'matching':
                return <Matching_Question questionData={q} onAnswered={handleAnswer} />;
            case 'categorization':
                return <Categorization_Question questionData={q} onAnswered={handleAnswer} />;
            default:
                return <div>סוג שאלה לא נתמך.</div>;
        }
    };


    const renderContent = () => {
        switch(examState) {
            case 'nameInput':
                return (
                    <div className="text-center bg-white/60 backdrop-blur-md border border-white/30 p-8 rounded-lg">
                        <h3 className="text-4xl font-bold text-brand-teal mb-4">רגע לפני שמתחילים</h3>
                        <p className="text-2xl mb-6">אנא הזינו את שמכם המלא כדי שיופיע בתעודת הסיום.</p>
                        <input
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="שם מלא"
                            className="w-full max-w-sm mx-auto bg-white text-brand-dark-blue p-3 rounded-lg border-2 border-gray-300 text-center text-xl"
                        />
                        <button 
                            onClick={startQuiz}
                            disabled={!userName.trim()}
                            className="mt-6 w-full max-w-sm mx-auto bg-brand-magenta hover:bg-pink-700 disabled:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg text-xl transition-colors"
                        >
                            התחלת המבחן
                        </button>
                    </div>
                );
            
            case 'quiz':
                const currentQuestion = questions[currentQuestionIndex];
                if (!currentQuestion) return null;
                return (
                    <div className="bg-white/60 backdrop-blur-md border border-white/30 p-6 rounded-lg">
                      <h4 className="font-bold text-xl mb-4 text-brand-light-blue">{`שאלה ${currentQuestionIndex + 1}/${questions.length}`}</h4>
                      <div key={currentQuestion.id}>
                        {renderCurrentQuestion()}
                      </div>
                      {answerSubmitted && <button onClick={nextQuestion} className="mt-4 w-full bg-brand-teal text-white font-bold p-3 rounded-lg text-xl">
                          {currentQuestionIndex < questions.length - 1 ? 'לשאלה הבאה' : 'סיים מבחן'}
                      </button>}
                  </div>
                );

            case 'results':
                 return (
                    <div className="text-center bg-white/80 backdrop-blur-sm p-8 rounded-lg border-4 border-brand-teal shadow-2xl">
                        <h3 className="text-5xl font-bold text-brand-teal mb-4">כל הכבוד, {userName}!</h3>
                        <p className="text-2xl mb-2">סיימת את המבחן המסכם של "חכם בכיס".</p>
                        <p className="text-3xl font-bold mb-6 bg-brand-light-blue/20 py-2 px-4 rounded-md inline-block">{`הציון שלך: ${score} מתוך ${questions.length}`}</p>
                        
                        <div className="bg-white/50 p-4 rounded-lg mt-8 border border-brand-magenta">
                            <p className="text-xl font-bold">משימה אחרונה:</p>
                            <p className="text-lg">יש לצלם את המסך ולשלוח לאלון כהן בווטסאפ למספר: <b dir="ltr">050-4443326</b></p>
                        </div>
                        
                        <button onClick={onBack} className="mt-8 bg-brand-magenta hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-lg text-xl">
                            חזרה למסך הראשי
                        </button>
                    </div>
                );
        }
    }


    return (
        <ModuleView title={title} onBack={onBack}>
           {renderContent()}
        </ModuleView>
    );
};

export default FinalExam;