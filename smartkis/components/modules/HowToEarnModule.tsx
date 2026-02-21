import React, { useState, useEffect, useRef } from 'react';
import ModuleView from '../ModuleView';
import { TrophyIcon } from '../icons/Icons';
import { GoogleGenAI } from "@google/genai";
import { getClientSimulationResponse } from '../../services/geminiService';

interface HowToEarnModuleProps {
  onBack: () => void;
  title: string;
  onComplete: () => void;
}

type Message = { sender: 'client' | 'user'; text: string };

const steps = ["גלו את כוח העל", "שוק הרעיונות", "הלקוח הראשון", "צרו מודעה", "בוחן ידע"];

// --- Visual Components ---
const CheckIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
);
const CrossIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
);

// --- Step 1: Superpower Quiz ---
type Superpower = 'creative' | 'social' | 'analytical' | 'practical';
const SuperpowerQuiz: React.FC<{ onQuizComplete: (power: Superpower) => void }> = ({ onQuizComplete }) => {
    const questions = [
        { q: 'כשחברים צריכים עזרה, הם פונים אליך בעיקר בשביל...', options: { creative: 'רעיונות מקוריים', social: 'אוזן קשבת ועצה טובה', analytical: 'תכנון הגיוני של הצעדים', practical: 'עזרה מעשית בלתקן משהו' } },
        { q: 'את/ה מרגיש/ה הכי במיטבך כשאת/ה...', options: { creative: 'יוצר/ת משהו חדש (ציור, סיפור)', social: 'מבלה ומדבר/ת עם אנשים', analytical: 'פותר/ת חידה או בעיה מורכבת', practical: 'בונה או מרכיב/ה משהו' } },
        { q: 'פרויקט החלומות שלך לסוף השבוע הוא...', options: { creative: 'לצלם ולערוך סרטון קצר', social: 'לארגן מפגש חברים קטן', analytical: 'ללמוד שפת תכנות בסיסית', practical: 'לשפץ רהיט ישן' } },
    ];
    const [answers, setAnswers] = useState<Record<number, Superpower | null>>({});
    
    const handleAnswer = (qIndex: number, power: Superpower) => {
        setAnswers(prev => ({ ...prev, [qIndex]: power }));
    };

    useEffect(() => {
        if (Object.keys(answers).length === questions.length) {
            const counts: Record<Superpower, number> = { creative: 0, social: 0, analytical: 0, practical: 0 };
            Object.values(answers).forEach(power => { if (typeof power === 'string') counts[power as Superpower]++; });
            const dominantPower = (Object.keys(counts) as Superpower[]).reduce((a, b) => (counts[a] > counts[b] ? a : b));
            setTimeout(() => onQuizComplete(dominantPower), 500);
        }
    }, [answers, questions.length, onQuizComplete]);

    return (
        <div className="bg-white/40 p-8 rounded-2xl text-center">
            <h3 className="text-4xl font-bold text-brand-teal mb-4">מהו כוח העל שלכם?</h3>
            <p className="text-2xl mb-8">ענו על השאלות הקצרות וגלו מהי החוזקה המיוחדת שלכם שתעזור לכם להרוויח כסף.</p>
            <div className="space-y-8">
                {questions.map((q, i) => (
                    <div key={i}>
                        <h4 className="font-bold text-3xl mb-4">{q.q}</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {Object.entries(q.options).map(([power, text]) => (
                                <button key={power} onClick={() => handleAnswer(i, power as Superpower)}
                                    className={`p-4 rounded-lg transition-all text-xl min-h-[100px] flex items-center justify-center text-center ${answers[i] === power ? 'bg-brand-light-blue text-white ring-4 ring-brand-teal' : 'bg-white/70 hover:bg-white'}`}>
                                    {text}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- Step 2: Idea Market ---
const IdeaMarket: React.FC<{ superpower: Superpower; onIdeaSelected: (idea: string) => void }> = ({ superpower, onIdeaSelected }) => {
    const superpowersInfo: Record<Superpower, { name: string; icon: string; desc: string; ideas: string[] }> = {
        creative: { name: 'יצירתיות', icon: '🎨', desc: 'אתם אוהבים להמציא, לעצב וליצור דברים חדשים.', ideas: ['עיצוב לוגואים', 'כתיבת ברכות', 'ניהול רשתות חברתיות'] },
        social: { name: 'כישורים חברתיים', icon: '💬', desc: 'אתם טובים עם אנשים, אוהבים לעזור, להקשיב וללמד.', ideas: ['בייביסיטר', 'דוגיסיטר', 'שיעורים פרטיים'] },
        analytical: { name: 'חשיבה אנליטית', icon: '🧠', desc: 'אתם אוהבים סדר, פתרון בעיות וארגון מידע.', ideas: ['עזרה בשיעורי בית', 'בניית מצגות', 'ארגון קבצים במחשב'] },
        practical: { name: 'ידיים טובות', icon: '🛠️', desc: 'אתם אוהבים לבנות, לתקן ולהשתמש בכלים.', ideas: ['תיקון אופניים', 'עזרה בגינון', 'סידור ארונות'] },
    };
    const info = superpowersInfo[superpower];

    return (
        <div className="bg-white/40 p-8 rounded-2xl text-center">
            <h3 className="text-4xl font-bold text-brand-teal mb-4">כוח העל שלכם: {info.icon} {info.name}!</h3>
            <p className="text-2xl mb-8">{info.desc}</p>
            <h4 className="text-3xl font-bold mb-4">שוק הרעיונות</h4>
            <p className="mb-6 text-xl">אלו רק כמה רעיונות לעסקים קטנים שמתאימים לכם. בחרו אחד כדי להמשיך:</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {info.ideas.map(idea => (
                    <button key={idea} onClick={() => onIdeaSelected(idea)}
                        className="p-6 rounded-2xl bg-white/70 hover:bg-white shadow-lg transform hover:-translate-y-2 transition-all">
                        <p className="text-4xl font-bold text-brand-light-blue">{idea}</p>
                    </button>
                ))}
            </div>
        </div>
    );
};


// --- Step 3: Client Chat ---
const ClientChat: React.FC<{ businessIdea: string, onChatComplete: () => void }> = ({ businessIdea, onChatComplete }) => {
    const [messages, setMessages] = useState<Message[]>([{ sender: 'client', text: `היי! ראיתי שאת/ה מציע/ה שירותי ${businessIdea}. אני צריך/ה עזרה.` }]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [feedbackHistory, setFeedbackHistory] = useState<string[]>([]);
    const [chatEnded, setChatEnded] = useState(false);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!userInput.trim() || isLoading) return;

        const newMessages: Message[] = [...messages, { sender: 'user', text: userInput }];
        setMessages(newMessages);
        setUserInput('');
        setIsLoading(true);

        try {
            const aiResponse = await getClientSimulationResponse(businessIdea, newMessages);
            
            setMessages(prev => [...prev, { sender: 'client', text: aiResponse.responseText }]);
            if (aiResponse.feedbackText) {
                setFeedbackHistory(prev => [...prev, aiResponse.feedbackText]);
            }
        } catch(e) {
            console.error(e);
            setMessages(prev => [...prev, { sender: 'client', text: 'אופס, הייתה בעיה. בוא/י ננסה שוב.' }]);
        } finally {
            setIsLoading(false);
        }

        if (newMessages.filter(m => m.sender === 'user').length >= 3) {
            setTimeout(() => {
                setChatEnded(true);
                onChatComplete();
            }, 1500);
        }
    };
    
    return (
        <div className="bg-white/40 p-8 rounded-2xl">
            <h3 className="text-4xl font-bold text-center mb-4">סימולציה: הלקוח/ה הראשונ/ה שלכם!</h3>
            <div className="bg-gray-200/50 h-80 p-4 rounded-lg overflow-y-auto flex flex-col gap-3 mb-4">
                {messages.map((msg, i) => (
                    <div key={i} className={`p-3 rounded-lg max-w-xs text-xl ${msg.sender === 'client' ? 'bg-white self-start' : 'bg-blue-200 self-end'}`}>
                        {msg.text}
                    </div>
                ))}
                {isLoading && <div className="p-3 rounded-lg max-w-xs bg-white self-start animate-pulse text-xl">Alex מקליד/ה...</div>}
                <div ref={messagesEndRef} />
            </div>
            
            {chatEnded ? (
                <div className="text-center p-4 bg-green-100/70 rounded-lg border-2 border-green-300">
                    <h4 className="font-bold text-3xl text-green-700">כל הכבוד, סיימתם את הסימולציה!</h4>
                    <div className="text-right mt-4">
                        <p className="font-bold text-xl">נקודות למחשבה מהשיחה:</p>
                        <ul className="list-disc list-inside text-xl">
                            {feedbackHistory.map((fb, i) => <li key={i}>{fb}</li>)}
                        </ul>
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={userInput} 
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="כתבו את תשובתכם..."
                            className="flex-1 p-3 rounded-lg border-2 border-gray-300 text-xl"
                            disabled={isLoading}
                        />
                        <button onClick={handleSend} className="p-3 bg-brand-teal text-white rounded-lg font-bold disabled:bg-gray-400" disabled={isLoading}>שלח</button>
                    </div>
                    {feedbackHistory.length > 0 && (
                        <div className="mt-4 p-2 bg-yellow-100/60 rounded-lg text-yellow-800 text-lg">
                            <strong>💡 טיפ מהמאמן:</strong> {feedbackHistory[feedbackHistory.length - 1]}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

// --- Step 4: Ad Creator ---
const AdCreator: React.FC<{ businessIdea: string }> = ({ businessIdea }) => {
    const [adInfo, setAdInfo] = useState({
        name: '',
        slogan: '',
        audience: '',
        services: '',
        style: 'modern and professional'
    });
    const [logoUrl, setLogoUrl] = useState('');
    const [logoLoading, setLogoLoading] = useState(false);
    const [logoError, setLogoError] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setAdInfo({ ...adInfo, [e.target.name]: e.target.value });
    };

    const handleGenerateLogo = async () => {
        if (!adInfo.name || !adInfo.services) {
            alert('אנא מלאו לפחות שם עסק ותיאור שירותים.');
            return;
        }
        setLogoLoading(true);
        setLogoError('');
        setLogoUrl('');

        const prompt = `Logo for a new small business called "${adInfo.name}". 
        It provides "${adInfo.services}" for a target audience of "${adInfo.audience}". 
        The business slogan is "${adInfo.slogan}". 
        The desired style is "${adInfo.style}". 
        Create a simple, iconic, vector-style logo on a clean white background.`;

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: prompt,
                config: {
                    numberOfImages: 1,
                    outputMimeType: 'image/png',
                    aspectRatio: '1:1',
                },
            });
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            setLogoUrl(`data:image/png;base64,${base64ImageBytes}`);
        } catch (error) {
            console.error("Error generating logo:", error);
            setLogoError('אופס, יצירת הלוגו נכשלה. נסו שוב מאוחר יותר.');
        } finally {
            setLogoLoading(false);
        }
    };

    return (
         <div className="bg-white/40 p-8 rounded-2xl">
            <h3 className="text-4xl font-bold text-center mb-6">עצבו את המודעה הראשונה שלכם!</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <input type="text" name="name" value={adInfo.name} onChange={handleInputChange} placeholder="שם העסק" className="w-full p-2 rounded text-xl"/>
                    <input type="text" name="slogan" value={adInfo.slogan} onChange={handleInputChange} placeholder="סלוגן קליט" className="w-full p-2 rounded text-xl"/>
                    <input type="text" name="audience" value={adInfo.audience} onChange={handleInputChange} placeholder="קהל יעד (למשל: בני נוער, הורים)" className="w-full p-2 rounded text-xl"/>
                    <input type="text" name="services" value={adInfo.services} onChange={handleInputChange} placeholder="השירותים העיקריים" className="w-full p-2 rounded text-xl"/>
                    <select name="style" value={adInfo.style} onChange={handleInputChange} className="w-full p-2 rounded bg-white text-xl">
                        <option value="modern and professional">מודרני ומקצועי</option>
                        <option value="fun and playful">כיפי ומשחקי</option>
                        <option value="handmade and rustic">בעבודת יד וכפרי</option>
                        <option value="minimalist and clean">מינימליסטי ונקי</option>
                    </select>
                    <button onClick={handleGenerateLogo} disabled={logoLoading} className="w-full p-3 bg-brand-magenta text-white font-bold rounded-lg disabled:bg-gray-400 text-xl">
                        {logoLoading ? 'יוצר לוגו...' : 'צור לוגו עם AI!'}
                    </button>
                </div>
                <div className="bg-white p-6 rounded-lg border-4 border-dashed border-brand-teal text-center flex flex-col justify-center items-center">
                    <div className="w-32 h-32 mb-4 flex items-center justify-center bg-gray-200 rounded-full">
                        {logoLoading ? (
                           <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-teal"></div>
                        ) : logoUrl ? (
                            <img src={logoUrl} alt="Generated Logo" className="w-full h-full object-cover rounded-full" />
                        ) : (
                            <span className="text-gray-500">הלוגו שלכם</span>
                        )}
                    </div>
                    {logoError && <p className="text-red-500 text-sm">{logoError}</p>}
                    <h4 className="text-4xl font-bold">{adInfo.name || 'שם העסק שלך'}</h4>
                    <p className="text-2xl italic text-gray-600">{businessIdea}</p>
                    <p className="mt-4 text-3xl font-semibold">"{adInfo.slogan || 'הסלוגן שלך כאן'}"</p>
                </div>
            </div>
        </div>
    );
};


// --- Step 5: Quiz ---
const QuizStep: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const questions = [
        { q: 'מהו "כוח העל" העיקרי של אדם שאוהב לפתור חידות ובעיות?', a: 'חשיבה אנליטית' },
        { q: 'בסימולציית הצ\'אט, מה הייתה התגובה המומלצת לשאלת המחיר של הלקוח?', a: 'להבין קודם את הצורך' },
        { q: 'איזה מהבאים הוא דוגמה לעסק שמתאים למישהו עם "ידיים טובות"?', a: 'תיקון אופניים' },
        { q: 'מהי המטרה של יצירת סלוגן קליט במודעה?', a: 'לגרום לאנשים לזכור את העסק' },
    ];
    const options = [
        ['יצירתיות', 'כישורים חברתיים', 'חשיבה אנליטית'],
        ['לקבוע מחיר קבוע', 'לשאול מה התקציב', 'להבין קודם את הצורך'],
        ['כתיבת סיפורים', 'תיקון אופניים', 'בייביסיטר'],
        ['להראות כמה העסק גדול', 'לגרום לאנשים לזכור את העסק', 'לבלבל את המתחרים'],
    ];
    
    const [current, setCurrent] = useState(0);
    const [score, setScore] = useState(0);
    const [selected, setSelected] = useState('');
    const [finished, setFinished] = useState(false);

    useEffect(() => {
        if (finished) {
            if (score / questions.length >= 0.75) {
              onComplete();
            }
        }
    }, [finished, score, onComplete, questions.length]);

    const handleSelect = (opt: string) => {
        if(selected) return;
        setSelected(opt);
        if(opt === questions[current].a) {
            setScore(s => s + 1);
        }
    };
    
    const handleNext = () => {
        if (current < questions.length - 1) {
            setCurrent(c => c + 1);
            setSelected('');
        } else {
            setFinished(true);
        }
    };
    
    if (finished) return <div className="text-center p-6 bg-white/70 rounded-xl"><TrophyIcon className="w-16 h-16 mx-auto text-yellow-500" /><h3 className="text-4xl font-bold mt-2">סיימת!</h3><p className="text-2xl">הציון: {score}/{questions.length}</p></div>;

    return (
        <div className="bg-white/50 p-6 rounded-lg">
            <h3 className="font-bold text-2xl mb-4">{questions[current].q}</h3>
            <div className="space-y-2">
                {options[current].map(opt => (
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


// --- Main Module Component ---
const HowToEarnModule: React.FC<HowToEarnModuleProps> = ({ onBack, title, onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [userSuperpower, setUserSuperpower] = useState<Superpower | null>(null);
    const [userBusinessIdea, setUserBusinessIdea] = useState<string | null>(null);
    const [isChatCompleted, setIsChatCompleted] = useState(false);

    const handleQuizComplete = (power: Superpower) => {
        setUserSuperpower(power);
        setCurrentStep(1);
    };
    const handleIdeaSelected = (idea: string) => {
        setUserBusinessIdea(idea);
        setCurrentStep(2);
    };
     const handleChatComplete = () => {
        setIsChatCompleted(true);
        // We don't auto-advance here to let user see feedback
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0: return <SuperpowerQuiz onQuizComplete={handleQuizComplete} />;
            case 1: return userSuperpower ? <IdeaMarket superpower={userSuperpower} onIdeaSelected={handleIdeaSelected} /> : null;
            case 2: return userBusinessIdea ? <ClientChat businessIdea={userBusinessIdea} onChatComplete={handleChatComplete} /> : null;
            case 3: return userBusinessIdea ? <AdCreator businessIdea={userBusinessIdea} /> : null;
            case 4: return <QuizStep onComplete={onComplete} />;
            default: return null;
        }
    };
    
    return (
        <ModuleView title={title} onBack={onBack}>
             <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                    {steps.map((step, index) => (
                        <React.Fragment key={index}>
                            <div className="flex flex-col items-center flex-1">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${currentStep >= index ? 'bg-brand-teal text-white' : 'bg-white/50'}`}>{index + 1}</div>
                                <p className={`mt-2 text-xs text-center font-bold ${currentStep >= index ? 'text-brand-teal' : 'text-gray-500'}`}>{step}</p>
                            </div>
                            {index < steps.length - 1 && <div className={`flex-1 h-1 mx-2 ${currentStep > index ? 'bg-brand-teal' : 'bg-gray-300'}`}></div>}
                        </React.Fragment>
                    ))}
                </div>
            </div>
            {renderStepContent()}
            <div className="flex justify-between mt-8">
                <button onClick={() => setCurrentStep(s => s - 1)} disabled={currentStep === 0} className="bg-gray-300 font-bold py-2 px-6 rounded-lg disabled:opacity-50">הקודם</button>
                <button 
                  onClick={() => setCurrentStep(s => s + 1)} 
                  disabled={
                    currentStep === steps.length - 1 || 
                    (currentStep === 0 && !userSuperpower) || 
                    (currentStep === 1 && !userBusinessIdea) ||
                    (currentStep === 2 && !isChatCompleted)
                  } 
                  className="bg-brand-teal text-white font-bold py-2 px-6 rounded-lg disabled:opacity-50">
                    הבא
                </button>
            </div>
        </ModuleView>
    );
};

export default HowToEarnModule;