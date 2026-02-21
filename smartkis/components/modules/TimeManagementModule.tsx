import React, { useState, useEffect, useRef } from 'react';
import ModuleView from '../ModuleView';
import { TrophyIcon } from '../icons/Icons';

// Props interface
interface TimeManagementModuleProps {
  onBack: () => void;
  title: string;
  onComplete: () => void;
}

// --- Helper Icons ---
const CheckIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>);
const CrossIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>);

const stepData = [
    { title: "זמן=כסף", icon: '💰' },
    { title: "דחוף או חשוב?", icon: '⚖️' },
    { title: "מד האנרגיה", icon: '🔋' },
    { title: "יום בחיי", icon: '🗓️' },
    { title: "בוחן סיום", icon: '🏆' }
];


// Step 1: Introduction
const IntroductionStep: React.FC = () => {
    const [hourlyRate, setHourlyRate] = useState(30);
    const [hoursSpent, setHoursSpent] = useState(2);
    const opportunityCost = hourlyRate * hoursSpent;

    return (
        <div className="bg-white/40 p-8 rounded-2xl text-center animate-fade-in">
            <h3 className="text-4xl font-bold text-brand-teal mb-4">למה אומרים שזמן שווה כסף?</h3>
            <p className="text-2xl mb-6 text-brand-dark-blue/80">כל שעה שאתם "מבזבזים" על משהו אחד, היא שעה שיכלתם להשקיע במשהו אחר - למשל, לעבוד ולהרוויח כסף. לזה קוראים <strong>"עלות אלטרנטיבית"</strong>.</p>
            <div className="bg-white/60 p-6 rounded-xl max-w-lg mx-auto shadow-lg">
                <h4 className="text-3xl font-bold mb-4">מחשבון עלות אלטרנטיבית:</h4>
                <div className="grid grid-cols-2 gap-4 items-center mb-4">
                    <div>
                        <label className="font-semibold text-xl">אם אני מרוויח/ה בשעה:</label>
                        <div className="flex items-center justify-center gap-2 mt-1">
                            <input type="number" value={hourlyRate} onChange={e => setHourlyRate(Number(e.target.value))} className="w-24 p-2 rounded-lg text-center text-2xl font-bold" />
                            <span>ש"ח</span>
                        </div>
                    </div>
                    <div>
                        <label className="font-semibold text-xl">ובזבזתי על X שעות:</label>
                         <div className="flex items-center justify-center gap-2 mt-1">
                            <input type="number" value={hoursSpent} onChange={e => setHoursSpent(Number(e.target.value))} className="w-24 p-2 rounded-lg text-center text-2xl font-bold" />
                            <span>שעות</span>
                        </div>
                    </div>
                </div>
                <div className="bg-yellow-100/70 p-4 rounded-lg border-2 border-yellow-300">
                    <p className="text-2xl">ה"מחיר" האמיתי של הפעילות הזו הוא:</p>
                    <p className="text-6xl font-bold text-brand-magenta animate-pulse">{opportunityCost.toLocaleString()} ₪</p>
                    <p className="text-base">(הכסף שיכלתם להרוויח בזמן הזה)</p>
                </div>
            </div>
        </div>
    );
};

// Step 2: Eisenhower Matrix
const EisenhowerMatrixStep: React.FC = () => {
    const quadrants = {
        'חשוב ודחוף': [], 'חשוב ולא דחוף': [],
        'לא חשוב ודחוף': [], 'לא חשוב ולא דחוף': []
    } as Record<string, {name: string, isCorrect: boolean}[]>;

    const initialTasks = [
        { name: 'שיעורי בית למחר', category: 'חשוב ודחוף' },
        { name: 'לתכנן פרויקט ארוך טווח', category: 'חשוב ולא דחוף' },
        { name: 'לענות להודעת וואטסאפ', category: 'לא חשוב ודחוף' },
        { name: 'לגלוש בטיקטוק', category: 'לא חשוב ולא דחוף' },
        { name: 'לקבוע תור לרופא שיניים', category: 'חשוב ולא דחוף' },
        { name: 'לסדר את החדר לפני שאורחים מגיעים', category: 'חשוב ודחוף' }
    ];

    const [tasks, setTasks] = useState(initialTasks.map(t => t.name));
    const [assignedTasks, setAssignedTasks] = useState(quadrants);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskName: string) => {
        e.dataTransfer.setData('taskName', taskName);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, category: string) => {
        e.preventDefault();
        const taskName = e.dataTransfer.getData('taskName');
        const task = initialTasks.find(t => t.name === taskName);

        if (task && tasks.includes(taskName)) {
            setTasks(prev => prev.filter(t => t !== taskName));
            setAssignedTasks(prev => ({
                ...prev,
                [category]: [...prev[category], { name: taskName, isCorrect: task.category === category }]
            }));
        }
    };

    return (
        <div className="bg-white/40 p-8 rounded-2xl animate-fade-in">
            <h3 className="text-4xl font-bold text-center mb-4">מטריצת אייזנהאואר: דחוף או חשוב?</h3>
            <p className="text-2xl text-center mb-6">לא כל משימה "דחופה" היא באמת חשובה. למדו לתעדף: גררו כל משימה לרביע המתאים.</p>
            
            <div className="p-4 bg-white/30 rounded-lg mb-6 shadow-inner">
                <h4 className="font-bold text-center mb-2 text-2xl">משימות למיון:</h4>
                <div className="flex flex-wrap justify-center gap-3 min-h-[40px]">
                    {tasks.map(task => (
                        <div key={task} draggable onDragStart={(e) => handleDragStart(e, task)}
                             className="p-3 rounded-lg bg-yellow-200 cursor-grab shadow-md hover:bg-yellow-300 transition-colors text-lg">{task}</div>
                    ))}
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div onDrop={(e) => handleDrop(e, 'חשוב ודחוף')} onDragOver={(e) => e.preventDefault()} className="bg-red-100/70 p-4 rounded-lg min-h-[150px] border-2 border-dashed border-red-300"><h4 className="font-bold text-red-700 text-2xl text-center">🔥 חשוב ודחוף (לעשות מיד)</h4>{assignedTasks['חשוב ודחוף'].map(t => <div key={t.name} className={`p-1 rounded mt-1 text-xl flex justify-between items-center ${t.isCorrect ? 'bg-green-200' : 'bg-red-300'}`}><span>{t.name}</span><span>{t.isCorrect ? '✔' : '✖'}</span></div>)}</div>
                <div onDrop={(e) => handleDrop(e, 'חשוב ולא דחוף')} onDragOver={(e) => e.preventDefault()} className="bg-blue-100/70 p-4 rounded-lg min-h-[150px] border-2 border-dashed border-blue-300"><h4 className="font-bold text-blue-700 text-2xl text-center">🗓️ חשוב ולא דחוף (לתכנן)</h4>{assignedTasks['חשוב ולא דחוף'].map(t => <div key={t.name} className={`p-1 rounded mt-1 text-xl flex justify-between items-center ${t.isCorrect ? 'bg-green-200' : 'bg-red-300'}`}><span>{t.name}</span><span>{t.isCorrect ? '✔' : '✖'}</span></div>)}</div>
                <div onDrop={(e) => handleDrop(e, 'לא חשוב ודחוף')} onDragOver={(e) => e.preventDefault()} className="bg-yellow-100/70 p-4 rounded-lg min-h-[150px] border-2 border-dashed border-yellow-300"><h4 className="font-bold text-yellow-700 text-2xl text-center">🤝 לא חשוב ודחוף (להאציל)</h4>{assignedTasks['לא חשוב ודחוף'].map(t => <div key={t.name} className={`p-1 rounded mt-1 text-xl flex justify-between items-center ${t.isCorrect ? 'bg-green-200' : 'bg-red-300'}`}><span>{t.name}</span><span>{t.isCorrect ? '✔' : '✖'}</span></div>)}</div>
                <div onDrop={(e) => handleDrop(e, 'לא חשוב ולא דחוף')} onDragOver={(e) => e.preventDefault()} className="bg-gray-200/70 p-4 rounded-lg min-h-[150px] border-2 border-dashed border-gray-400"><h4 className="font-bold text-gray-700 text-2xl text-center">🗑️ לא חשוב ולא דחוף (למחוק)</h4>{assignedTasks['לא חשוב ולא דחוף'].map(t => <div key={t.name} className={`p-1 rounded mt-1 text-xl flex justify-between items-center ${t.isCorrect ? 'bg-green-200' : 'bg-red-300'}`}><span>{t.name}</span><span>{t.isCorrect ? '✔' : '✖'}</span></div>)}</div>
            </div>
        </div>
    );
};

// Step 3: Energy Meter Game
const EnergyMeterStep: React.FC = () => {
    const tasks = [
        { name: 'ללמוד למבחן', cost: -40, icon: '📚' }, { name: 'לסדר את החדר', cost: -20, icon: '🧹' },
        { name: 'לצאת להליכה', cost: 15, icon: '🚶‍♂️' }, { name: 'לשחק במחשב', cost: -30, icon: '🎮' },
        { name: 'לשמוע מוזיקה', cost: 20, icon: '🎵' }, { name: 'שיעורי בית', cost: -25, icon: '✏️' }
    ];
    const [energy, setEnergy] = useState(100);
    const [completedTasks, setCompletedTasks] = useState<string[]>([]);

    const handleTaskClick = (task: typeof tasks[0]) => {
        if (completedTasks.includes(task.name)) return;
        const newEnergy = energy + task.cost;
        if (newEnergy < 0) {
            alert("אין לך מספיק אנרגיה למשימה הזו! בחר פעילות מרגיעה קודם.");
            return;
        }
        setEnergy(newEnergy > 100 ? 100 : newEnergy);
        setCompletedTasks(prev => [...prev, task.name]);
    };
    
    const energyColor = energy > 60 ? 'bg-green-500' : energy > 30 ? 'bg-yellow-500' : 'bg-red-500';

    return (
         <div className="bg-white/40 p-8 rounded-2xl animate-fade-in">
            <h3 className="text-4xl font-bold text-center mb-4">משחק: מד האנרגיה 🔋</h3>
            <p className="text-center text-2xl mb-6">ניהול זמן הוא גם ניהול אנרגיה. בצעו משימות (שמורידות אנרגיה) ופעילויות מרגיעות (שמעלות אנרגיה) כדי להשלים את כל המטלות בלי להתעייף!</p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                <div className="w-full md:w-1/3">
                    <h4 className="font-bold text-3xl mb-2 text-center">מד האנרגיה שלך</h4>
                    <div className="w-48 h-48 mx-auto bg-gray-200 rounded-full flex items-center justify-center relative overflow-hidden">
                        <div className={`absolute bottom-0 w-full ${energyColor} transition-all duration-500`} style={{ height: `${energy}%` }}></div>
                        <span className="relative text-5xl font-bold text-white" style={{textShadow: '2px 2px 4px #00000080'}}>{energy}%</span>
                    </div>
                </div>
                <div className="w-full md:w-2/3">
                     <h4 className="font-bold text-3xl mb-2 text-center">בחר פעילות:</h4>
                    <div className="grid grid-cols-2 gap-4">
                        {tasks.map(task => {
                            const isCompleted = completedTasks.includes(task.name);
                            return (
                                <button key={task.name} onClick={() => handleTaskClick(task)} disabled={isCompleted}
                                    className={`p-4 rounded-xl text-center transition-all ${isCompleted ? 'bg-gray-300 opacity-50' : 'bg-white/70 hover:bg-white transform hover:scale-105'}`}>
                                    <span className="text-4xl">{task.icon}</span>
                                    <p className="font-bold text-xl">{task.name}</p>
                                    <p className={`font-semibold text-lg ${task.cost > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {task.cost > 0 ? `+${task.cost}` : task.cost} אנרגיה
                                    </p>
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>
            {completedTasks.length === tasks.length && <p className="mt-6 text-center text-2xl font-bold text-green-600">כל הכבוד! ניהלתם את האנרגיה שלכם בצורה מושלמת!</p>}
        </div>
    );
};

// Step 4: A Day in the Life Game
const DayInLifeStep: React.FC = () => {
    const initialTasks = [
        { id: 1, name: 'שיעורי בית', duration: 2, importance: 'High', icon: '📚' },
        { id: 2, name: 'לסדר את החדר', duration: 1, importance: 'Medium', icon: '🧹' },
        { id: 3, name: 'לשחק במחשב', duration: 3, importance: 'Low', icon: '🎮' },
        { id: 4, name: 'להתכונן למבחן', duration: 2, importance: 'High', icon: '🧠' },
    ] as const;
    const distractions = [
        { name: 'חבר מתקשר להזמין אותך לצאת', duration: 2, happiness: 20 },
        { name: 'פרק חדש בסדרה האהובה עליך יצא', duration: 1, happiness: 10 },
    ] as const;

    type Task = typeof initialTasks[number];
    type Distraction = typeof distractions[number] & { icon: string };
    type TimelineItem = Task | Distraction;
    
    const TOTAL_HOURS = 8;
    const [tasks, setTasks] = useState(initialTasks);
    const [timeline, setTimeline] = useState<(TimelineItem | null)[]>(Array(TOTAL_HOURS).fill(null));
    const [distraction, setDistraction] = useState<(typeof distractions[number]) | null>(null);
    const [results, setResults] = useState<{ score: number, happiness: number, tasksDone: number } | null>(null);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, task: Task) => {
        e.dataTransfer.setData('task', JSON.stringify(task));
    };
    const handleDrop = (e: React.DragEvent<HTMLDivElement>, hourIndex: number) => {
        const task: Task = JSON.parse(e.dataTransfer.getData('task'));
        if (hourIndex + task.duration > TOTAL_HOURS || timeline.slice(hourIndex, hourIndex + task.duration).some(h => h)) return;
        setTasks(prev => prev.filter(t => t.id !== task.id));
        const newTimeline = [...timeline];
        for (let i = 0; i < task.duration; i++) newTimeline[hourIndex + i] = task;
        setTimeline(newTimeline);
    };

    const handleDistraction = (accept: boolean) => {
        if (accept && distraction) {
            let placed = false;
            for (let i = 0; i <= TOTAL_HOURS - distraction.duration; i++) {
                if (!timeline.slice(i, i + distraction.duration).some(h => h)) {
                    const newTimeline = [...timeline];
                    for (let j = 0; j < distraction.duration; j++) newTimeline[i + j] = { ...distraction, icon: '🥳' };
                    setTimeline(newTimeline);
                    placed = true;
                    break;
                }
            }
        }
        setDistraction(null);
    };
    
    // FIX: Add type casts to resolve `unknown` type errors from complex type inference.
    const calculateResults = () => {
        let score = 0;
        let happiness = 0;
        const uniqueTasks = [...new Set(timeline.filter((t): t is TimelineItem => t !== null))];
        
        uniqueTasks.forEach(task => {
            const typedTask = task as TimelineItem;
            if ('importance' in typedTask) { // Type guard for Task
                if (typedTask.importance === 'High') score += 50;
                if (typedTask.importance === 'Medium') score += 20;
            }
            if ('happiness' in typedTask) { // Type guard for Distraction
                happiness += typedTask.happiness;
            }
        });

        setResults({ score, happiness, tasksDone: uniqueTasks.filter(t => 'importance' in (t as TimelineItem)).length });
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (tasks.length > 0 && !distraction && !results) {
                setDistraction(distractions[Math.floor(Math.random() * distractions.length)]);
            }
        }, 5000);
        return () => clearTimeout(timer);
    }, [tasks, distraction, results]);

    return (
         <div className="bg-white/40 p-8 rounded-2xl animate-fade-in">
            <h3 className="text-4xl font-bold text-center mb-4">משחק: יום בחיי 🗓️</h3>
            <p className="text-center text-2xl mb-6">יש לך {TOTAL_HOURS} שעות פנויות. גרור את המשימות לציר הזמן כדי לתכנן את היום, אבל היזהר מהסחות דעת!</p>

            <div className="flex gap-6">
                <div className="w-1/4">
                    <h4 className="font-bold text-xl text-center">משימות</h4>
                    <div className="space-y-2">
                        {tasks.map(task => (
                            <div key={task.id} draggable onDragStart={(e) => handleDragStart(e, task)}
                                className="p-2 bg-white/70 rounded-lg cursor-grab text-center">
                                <span className="text-2xl">{task.icon}</span>
                                <p className="font-semibold">{task.name} ({task.duration} שע')</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="w-3/4">
                     <h4 className="font-bold text-xl text-center">לו"ז ({TOTAL_HOURS} שעות)</h4>
                    <div className="grid grid-cols-8 gap-1 bg-gray-200 p-2 rounded-lg">
                        {timeline.map((task, i) => (
                            <div key={i} onDrop={(e) => handleDrop(e, i)} onDragOver={(e) => e.preventDefault()}
                                className="h-24 border border-gray-300 flex items-center justify-center text-center p-1 rounded bg-white/50">
                                {task && <span title={task.name}>{task.icon}</span>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            {distraction && <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-2xl"><div className="bg-yellow-200 p-6 rounded-lg text-center"><p className="text-2xl font-bold mb-4">{distraction.name}!</p><button onClick={() => handleDistraction(true)} className="p-2 bg-green-500 text-white rounded mr-2">בטח!</button><button onClick={() => handleDistraction(false)} className="p-2 bg-red-500 text-white rounded">לא עכשיו</button></div></div>}
            
            {!results ? (
                <button onClick={calculateResults} className="mt-6 block mx-auto bg-brand-magenta text-white font-bold p-3 rounded-lg">סיים את היום ובדוק תוצאות</button>
            ) : (
                <div className="mt-6 text-center p-4 bg-white/60 rounded-lg">
                    <h4 className="font-bold text-3xl">סיכום היום:</h4>
                    <p className="text-xl">ציון פרודוקטיביות: {results.score}, מדד כיף: {results.happiness}, משימות שהושלמו: {results.tasksDone}</p>
                </div>
            )}
        </div>
    );
};


// Step 5: Quiz
const QuizStep: React.FC<{onComplete: () => void}> = ({ onComplete }) => {
    const questions = [
        { q: 'מהי "עלות אלטרנטיבית"?', o: ['המחיר של מוצר בחנות אחרת', 'הרווח שהפסדת כי בחרת באפשרות אחרת', 'מס נוסף על בזבוזים'], a: 'הרווח שהפסדת כי בחרת באפשרות אחרת' },
        { q: 'במטריצת אייזנהאואר, מה עושים עם משימה שהיא "חשובה אבל לא דחופה"?', o: ['עושים מיד', 'לא עושים בכלל', 'מתכננים מתי לעשות אותה'], a: 'מתכננים מתי לעשות אותה' },
        { q: 'איזו פעילות מעלה את מד האנרגיה?', o: ['ללמוד למבחן', 'לשמוע מוזיקה', 'לשחק במחשב'], a: 'לשמוע מוזיקה' },
    ];
    const [current, setCurrent] = useState(0);
    const [score, setScore] = useState(0);
    const [selected, setSelected] = useState('');
    const [finished, setFinished] = useState(false);

    useEffect(() => {
        if(finished && (score / questions.length) >= 0.75) { onComplete(); }
    }, [finished, score, onComplete, questions.length]);

    const handleSelect = (opt: string) => {
        if(selected) return;
        setSelected(opt);
        if(opt === questions[current].a) { setScore(s => s + 1); }
    };
    
    const handleNext = () => {
        if (current < questions.length - 1) {
            setCurrent(c => c + 1);
            setSelected('');
        } else {
            setFinished(true);
        }
    };
    
    if (finished) return <div className="text-center p-6 bg-white/70 rounded-xl"><TrophyIcon className="w-16 h-16 mx-auto text-yellow-500" /><h3 className="text-3xl font-bold mt-2">סיימת!</h3><p className="text-2xl">הציון: {score}/{questions.length}</p></div>;

    return (
        <div className="bg-white/50 p-6 rounded-lg">
            <h3 className="font-bold text-2xl mb-4">{questions[current].q}</h3>
            <div className="space-y-2">
                {questions[current].o.map(opt => (
                    <button key={opt} onClick={() => handleSelect(opt)} disabled={!!selected}
                        className={`block w-full text-right p-3 rounded-md transition-colors text-xl ${selected ? (opt === questions[current].a ? 'bg-green-500 text-white' : (opt === selected ? 'bg-red-500 text-white' : 'bg-white/40')) : 'bg-white/80 hover:bg-white'}`}>
                         {opt}
                    </button>
                ))}
            </div>
            {selected && <button onClick={handleNext} className="mt-4 w-full bg-brand-teal text-white p-3 rounded-lg text-xl">הבא</button>}
        </div>
    );
};

// Main Component
const TimeManagementModule: React.FC<TimeManagementModuleProps> = ({ onBack, title, onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);

    const renderStepContent = () => {
        // FIX: Replaced 'current' with 'currentStep' to use the correct state variable.
        switch (currentStep) {
            case 0: return <IntroductionStep />;
            case 1: return <EisenhowerMatrixStep />;
            case 2: return <EnergyMeterStep />;
            case 3: return <DayInLifeStep />;
            case 4: return <QuizStep onComplete={onComplete} />;
            default: return <IntroductionStep />;
        }
    };

    return (
        <ModuleView title="ניהול זמן (זמן=כסף)" onBack={onBack}>
            <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                    {stepData.map((step, index) => (
                        <React.Fragment key={index}>
                            <div className="flex flex-col items-center flex-1">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 text-2xl font-bold ${currentStep >= index ? 'bg-brand-teal text-white' : 'bg-white/50'}`}>
                                    {step.icon}
                                </div>
                                <p className={`mt-2 text-xs text-center font-bold ${currentStep >= index ? 'text-brand-teal' : 'text-gray-500'}`}>{step.title}</p>
                            </div>
                            {index < stepData.length - 1 && <div className={`flex-1 h-1 mx-2 ${currentStep > index ? 'bg-brand-teal' : 'bg-gray-300'}`}></div>}
                        </React.Fragment>
                    ))}
                </div>
            </div>
            {renderStepContent()}
            <div className="flex justify-between mt-8">
                <button onClick={() => setCurrentStep(s => s - 1)} disabled={currentStep === 0} className="bg-gray-300 hover:bg-gray-400 text-brand-dark-blue font-bold py-3 px-8 rounded-lg disabled:opacity-50 text-2xl">הקודם</button>
                <button onClick={() => setCurrentStep(s => s + 1)} disabled={currentStep === stepData.length - 1} className="bg-brand-teal hover:bg-teal-500 text-white font-bold py-3 px-8 rounded-lg disabled:opacity-50 text-2xl">הבא</button>
            </div>
        </ModuleView>
    );
};

// FIX: Added default export to match the import statement in App.tsx.
export default TimeManagementModule;
