import React, { useState } from 'react';
import ModuleView from '../ModuleView';
import { TrophyIcon } from '../icons/Icons';


interface LinksModuleProps {
  onBack: () => void;
  title: string;
  onComplete: () => void;
}

const linkCategories = [
  {
    categoryTitle: 'ממשל וזכויות',
    color: 'brand-light-blue',
    links: [
      { name: 'כל זכות', desc: 'מאגר המידע המקיף על זכויות תושבי ישראל.', url: 'https://www.kolzchut.org.il/' },
      { name: 'רשות המסים', desc: 'מידע על מס הכנסה, נקודות זיכוי, תיאום מס ועוד.', url: 'https://www.gov.il/he/departments/israel_tax_authority' },
      { name: 'המוסד לביטוח לאומי', desc: 'מידע על דמי אבטלה, תאונות עבודה וזכויות סוציאליות.', url: 'https://www.btl.gov.il/' },
    ]
  },
  {
    categoryTitle: 'מחשבונים פיננסיים',
    color: 'brand-teal',
    links: [
      { name: 'מחשבון שכר נטו - כל זכות', desc: 'בדקו כמה יישאר לכם מהמשכורת אחרי כל הניכויים.', url: 'https://www.kolzchut.org.il/he/%D7%9E%D7%97%D7%A9%D7%91%D7%95%D7%9F_%D7%A9%D7%9B%D7%A8_%D7%A0%D7%98%D7%95' },
      { name: 'מחשבון מס הכנסה - חילן', desc: 'סימולטור לחישוב מס הכנסה על השכר.', url: 'https://www.hilan.co.il/%D7%9E%D7%A8%D7%9B%D7%96-%D7%99%D7%93%D7%A2/%D7%9E%D7%97%D7%A9%D7%91%D7%95%D7%A0%D7%99%D7%9D/%D7%98%D7%91%D7%9C%D7%AA-%D7%9E%D7%A1-%D7%94%D7%9B%D7%A0%D7%A1%D7%94/' },
      { name: 'מחשבון ביטוח לאומי - חילן', desc: 'סימולטור לחישוב דמי ביטוח לאומי ומס בריאות.', url: 'https://www.hilan.co.il/%D7%9E%D7%A8%D7%9B%D7%96-%D7%99%D7%93%D7%A2/%D7%9E%D7%97%D7%A9%D7%91%D7%95%D7%A0%D7%99%D7%9D/%D7%98%D7%91%D7%9C%D7%AA-%D7%91%D7%99%D7%98%D7%95%D7%97-%D7%9C%D7%90%D7%95%D7%9E%D7%99/' },
      { name: 'מחשבון ריבית דריבית', desc: 'ראו איך החיסכון שלכם יכול לצמוח לאורך זמן.', url: 'https://lazyinvestor.co.il/compound-interest-calculator/' },
      { name: 'מחשבון החזר הלוואה', desc: 'תכננו את החזרי ההלוואה שלכם בצורה חכמה.', url: 'https://www.supermarker.themarker.com/Calculators/Loan/LoanCalculator.aspx' },
    ]
  },
  {
    categoryTitle: 'צרכנות נבונה',
    color: 'brand-magenta',
    links: [
      { name: 'המועצה הישראלית לצרכנות', desc: 'מידע על זכויות צרכנים, ביטול עסקה ועוד.', url: 'https://www.consumers.org.il/' },
      { name: 'כמה זה? (KamaZe)', desc: 'אתר להשוואת מחירים בתחומי התקשורת והסלולר.', url: 'https://www.kamaze.co.il/' },
      { name: 'Zap השוואת מחירים', desc: 'השוואת מחירים למגוון רחב של מוצרים.', url: 'https://www.zap.co.il/' },
      { name: 'מחשבון עמלות כרטיסי אשראי', desc: 'כלי של בנק ישראל להשוואת עמלות.', url: 'https://www.supermarker.themarker.com/CreditCards/CompareCreditCards.aspx?page=2&Issuer=&Type=' },
    ]
  },
   {
    categoryTitle: 'פודקאסטים מומלצים',
    color: 'purple-500',
    links: [
      { name: 'חיות כיס', desc: 'הפודקאסט הכלכלי של כאן, בהגשת שאול אמסטרדמסקי.', url: 'https://open.spotify.com/show/6if3f2252g3OTdTHE22iR5' },
      { name: 'התמונה המלאה', desc: 'פודקאסט על כלכלה, עסקים ויזמות בהנחיית מתן חודורוב.', url: 'https://open.spotify.com/show/3xXKEgYt8nHDsACf70bYpQ' },
      { name: 'עושים חשבון', desc: 'פודקאסט שמנגיש מושגים כלכליים מורכבים בצורה פשוטה.', url: 'https://open.spotify.com/show/2I722Ec2jPbe26f50pG5xS' },
      { name: 'השקעות לעצלנים', desc: 'פודקאסט פרקטי על השקעות בשוק ההון למתחילים.', url: 'https://open.spotify.com/show/5P4kZ8k3G5A2M8d9JkS7xQ' },
    ]
  },
  {
    categoryTitle: 'אפליקציות שימושיות',
    color: 'purple-500',
    links: [
      { name: 'השכר שלי', desc: 'אפליקציה למעקב וחישוב שכר העבודה שלכם.', url: 'https://play.google.com/store/apps/details?id=salary.com&pcampaignid=web_share' },
    ]
  },
  {
    categoryTitle: 'חיפוש עבודה',
    color: 'yellow-500',
    links: [
      { name: 'שירות התעסוקה לנוער', desc: 'מידע, זכויות ועבודות לבני נוער בישראל.', url: 'https://www.taasuka.gov.il/he/pages/noar.aspx' },
      { name: 'AllJobs', desc: 'אחד מאתרי הדרושים הגדולים בישראל.', url: 'https://www.alljobs.co.il/' },
    ]
  },
];

const Quiz: React.FC<{onComplete: () => void}> = ({ onComplete }) => {
    const questions = [
        { q: "באמצעות 'מחשבון שכר נטו', מהו בערך שכר הנטו עבור שכר ברוטו של 8,000 ש\"ח לרווק/ה ללא ילדים?", a: "כ-7,100 ש\"ח" },
        { q: "לפי אתר 'רשות המסים' או 'כל זכות', כמה נקודות זיכוי מקבל תושב ישראל (גבר)?", a: "2.25 נקודות" },
        { q: "איזה סוג מידע ניתן למצוא באתר 'המוסד לביטוח לאומי'?", a: "מידע על קצבאות וזכויות סוציאליות" },
        { q: "מהי המטרה העיקרית של אתר 'כמה זה?'?", a: "השוואת מחירים בתחום התקשורת" },
        { q: "לפי אתר 'שירות התעסוקה', מהו בדרך כלל גיל המינימום להעסקת נוער בחופשת לימודים?", a: "גיל 14" },
    ];
    const options = [
        ["כ-6,500 ש\"ח", "כ-7,100 ש\"ח", "כ-8,000 ש\"ח"],
        ["נקודה אחת", "2.25 נקודות", "5 נקודות"],
        ["מידע על מניות בבורסה", "מידע על קצבאות וזכויות סוציאליות", "מידע על החזרי מס"],
        ["קניית מוצרים באינטרנט", "השוואת מחירים בתחום התקשורת", "מכירת רכבים"],
        ["גיל 16", "גיל 14", "אין הגבלת גיל"]
    ];
    
    const [current, setCurrent] = useState(0);
    const [score, setScore] = useState(0);
    const [selected, setSelected] = useState('');
    const [finished, setFinished] = useState(false);

    const handleSelect = (opt: string) => {
        if(selected) return;
        setSelected(opt);
        if(opt === questions[current].a) {
            setScore(s => s + 1);
        }
    };
    
    const handleNext = () => {
        if(current < questions.length - 1) {
            setCurrent(c => c + 1);
            setSelected('');
        } else {
            setFinished(true);
            if (score + (selected === questions[current].a ? 1 : 0) >= 4) {
              onComplete();
            }
        }
    };
    
    if (finished) {
        const finalScore = score;
        const isCompleted = finalScore >= 4;
        const resultMessage = isCompleted
            ? "כל הכבוד! עמדתם ביעד והשלמתם את המודול!"
            : "עבודה טובה! נסו שוב כדי להגיע ל-80% הצלחה.";
        return (
            <div className="text-center">
                <TrophyIcon className="w-16 h-16 mx-auto text-yellow-500" />
                <h3 className="text-3xl font-bold mt-2">סיימתם את הבוחן!</h3>
                <p className="text-lg">{resultMessage}</p>
                <p className="text-2xl my-2">הציון שלך: <span className="font-bold">{finalScore} / {questions.length}</span></p>
            </div>
        )
    }

    return (
        <div>
            <h4 className="font-bold text-xl mb-2">{questions[current].q}</h4>
            <div className="space-y-2">
                {options[current].map(opt => (
                    <button key={opt} onClick={() => handleSelect(opt)} disabled={!!selected}
                        className={`block w-full text-right p-2 rounded-md text-lg ${selected ? (opt === questions[current].a ? 'bg-green-500 text-white' : (opt === selected ? 'bg-red-500 text-white' : 'bg-white/40')) : 'bg-white/80 hover:bg-white'}`}>
                        {opt}
                    </button>
                ))}
            </div>
            {selected && <button onClick={handleNext} className="mt-4 bg-brand-teal text-white p-2 rounded w-full text-lg">הבא</button>}
        </div>
    )
};


const getCategoryStyles = (color: string) => {
    switch (color) {
        case 'brand-light-blue': return { border: 'border-brand-light-blue/50', text: 'text-brand-light-blue' };
        case 'brand-teal': return { border: 'border-brand-teal/50', text: 'text-brand-teal' };
        case 'brand-magenta': return { border: 'border-brand-magenta/50', text: 'text-brand-magenta' };
        case 'yellow-500': return { border: 'border-yellow-500/50', text: 'text-yellow-500' };
        case 'purple-500': return { border: 'border-purple-500/50', text: 'text-purple-500' };
        default: return { border: 'border-gray-300', text: 'text-gray-800' };
    }
};

const LinkCard: React.FC<{name: string, desc: string, url: string}> = ({ name, desc, url }) => (
    <a href={url} target="_blank" rel="noopener noreferrer" className="block bg-white/70 p-4 rounded-xl hover:bg-white transition-all transform hover:scale-105 shadow-md hover:shadow-lg backdrop-blur-sm">
        <h4 className="font-bold text-xl text-brand-dark-blue">{name}</h4>
        <p className="text-sm text-brand-dark-blue/80">{desc}</p>
        <span className="text-xs text-brand-light-blue font-bold mt-2 inline-block">עבור לאתר &raquo;</span>
    </a>
);

const DocumentCard: React.FC<{name: string, desc: string, url: string}> = ({ name, desc, url }) => (
    <a href={url} target="_blank" rel="noopener noreferrer" className="block bg-white/70 p-4 rounded-xl hover:bg-white transition-all transform hover:scale-105 shadow-md hover:shadow-lg backdrop-blur-sm">
        <div className="flex items-center justify-between">
            <h4 className="font-bold text-xl text-brand-dark-blue">{name}</h4>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
        </div>
        <p className="text-sm text-brand-dark-blue/80">{desc}</p>
        <span className="text-xs text-brand-light-blue font-bold mt-2 inline-block">הורד מסמך &raquo;</span>
    </a>
);


const LinksModule: React.FC<LinksModuleProps> = ({ onBack, title, onComplete }) => {
  const [activeTab, setActiveTab] = useState<'documents' | 'links'>('documents');
  const [showQuiz, setShowQuiz] = useState(false);
  
  return (
    <ModuleView title={title} onBack={onBack}>
      <p className="text-center text-xl text-brand-dark-blue/90 mb-8">
        ריכזנו עבורכם מסמכים, קישורים וכלים שימושיים שיעזרו לכם בצעדים הראשונים בעולם הפיננסי.
      </p>

       {/* Tab Buttons */}
        <div className="flex justify-center mb-6 border-b-2 border-gray-300/50">
            <button 
                onClick={() => setActiveTab('documents')}
                className={`px-6 py-3 text-lg font-bold transition-colors ${activeTab === 'documents' ? 'border-b-4 border-brand-teal text-brand-teal' : 'text-gray-500 hover:text-brand-teal'}`}
            >
                מסמכים שימושיים
            </button>
            <button 
                onClick={() => setActiveTab('links')}
                className={`px-6 py-3 text-lg font-bold transition-colors ${activeTab === 'links' ? 'border-b-4 border-brand-teal text-brand-teal' : 'text-gray-500 hover:text-brand-teal'}`}
            >
                קישורים שימושיים
            </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'documents' && (
            <div className="animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <DocumentCard 
                        name="טופס 101"
                        desc="טופס פרטים אישיים של עובד שיש למלא בתחילת כל עבודה."
                        url="https://drive.google.com/file/d/1aokcfi-KvsxWS8apQTw0182rWklOQM6K/view?usp=sharing"
                    />
                    <DocumentCard 
                        name="דוח מעקב שעות עבודה"
                        desc="טבלה למעקב אחר שעות העבודה שלכם כדי לוודא שהשכר תקין."
                        url="https://drive.google.com/file/d/1M8weOLwKROpStPdiYrNZ1pSS5-2YVPzK/view?usp=sharing"
                    />
                </div>
            </div>
        )}

        {activeTab === 'links' && (
            <div className="animate-fade-in">
                <div className="space-y-8">
                    {linkCategories.map(category => {
                        const styles = getCategoryStyles(category.color);
                        return (
                            <div key={category.categoryTitle}>
                                <h3 className={`text-3xl font-bold mb-4 border-b-2 pb-2 ${styles.border} ${styles.text}`}>
                                    {category.categoryTitle}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {category.links.map(link => <LinkCard key={link.name} {...link} />)}
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                <div className="mt-8 pt-8 border-t-2 border-brand-teal/30">
                    <h3 className="text-3xl font-bold mb-4 text-center text-brand-teal">בחן את עצמך!</h3>
                    <div className="bg-white/40 p-6 rounded-lg">
                        {!showQuiz ? (
                            <div className="text-center">
                                <p className="mb-4 text-brand-dark-blue/90 text-lg">
                                    לאחר שעברת על הקישורים השונים במודול זה, הגיע הזמן לבחון את עצמך.
                                    <br/>
                                    <strong>משימתכם היא להשתמש בקישורים שסקרתם כדי לענות על השאלות הבאות.</strong>
                                    <br/>
                                    עליכם לענות נכון על 4 מתוך 5 שאלות כדי להשלים את המודול.
                                </p>
                                <button onClick={() => setShowQuiz(true)} className="bg-brand-magenta text-white font-bold p-3 rounded-lg text-lg">אני מוכן/ה לבוחן</button>
                            </div>
                        ) : (
                            <Quiz onComplete={onComplete} />
                        )}
                    </div>
                </div>
            </div>
        )}
    </ModuleView>
  );
};

export default LinksModule;