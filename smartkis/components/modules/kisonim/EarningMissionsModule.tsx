import React, { useState, useEffect, useRef } from 'react';
import ModuleView from '../../ModuleView';

interface ModuleProps {
  onBack: () => void;
  title: string;
  onComplete: () => void;
}

const missions = [
    { id: 1, name: 'סידור החדר', icon: '🛏️', reward: 2 },
    { id: 2, name: 'עזרה בגינה', icon: '🌱', reward: 4 },
    { id: 3, name: 'שטיפת כלים', icon: '🍽️', reward: 1 },
    { id: 4, name: 'טיול עם הכלב', icon: '🐕', reward: 2 },
    { id: 5, name: 'עריכת שולחן', icon: '🍴', reward: 1 },
    { id: 6, name: 'שטיפת המכונית', icon: '🚗', reward: 5 },
    { id: 7, name: 'בייביסיטר', icon: '👶', reward: 6 },
    { id: 8, name: 'למכור לימונדה', icon: '🥤', reward: 7 },
];

interface ActiveMission {
    holeIndex: number;
    missionIndex: number;
}

const EarningMissionsModule: React.FC<ModuleProps> = ({ onBack, title, onComplete }) => {
    const [gameState, setGameState] = useState<'intro' | 'playing' | 'finished'>('intro');
    const [totalEarnings, setTotalEarnings] = useState(0);
    const [activeMissions, setActiveMissions] = useState<ActiveMission[]>([]);
    const [score, setScore] = useState(0);
    const gameTimer = useRef<ReturnType<typeof setTimeout>>();

    const showRandomMissions = () => {
        const holeIndices = Array.from({ length: 6 }, (_, i) => i);
        const shuffledHoles = holeIndices.sort(() => 0.5 - Math.random());
        const [hole1, hole2] = shuffledHoles.slice(0, 2);

        const missionIndices = Array.from({ length: missions.length }, (_, i) => i);
        const shuffledMissions = missionIndices.sort(() => 0.5 - Math.random());
        const [mission1, mission2] = shuffledMissions.slice(0, 2);

        setActiveMissions([
            { holeIndex: hole1, missionIndex: mission1 },
            { holeIndex: hole2, missionIndex: mission2 }
        ]);

        gameTimer.current = setTimeout(() => {
            if (score < 10 && gameState === 'playing') {
                 setActiveMissions([]);
                 setTimeout(showRandomMissions, 500);
            }
        }, 6000); // Increased duration
    };

    useEffect(() => {
        if (gameState === 'playing' && score < 10) {
            const initialTimeout = setTimeout(showRandomMissions, 1000);
            return () => clearTimeout(initialTimeout);
        }
    }, [gameState, score]);

    const handleMissionClick = (missionIndex: number) => {
        if (activeMissions.length === 0 || gameState !== 'playing') return;

        const mission = missions[missionIndex];
        setTotalEarnings(prev => prev + mission.reward);
        const newScore = score + 1;
        setScore(newScore);

        setActiveMissions([]);
        clearTimeout(gameTimer.current);

        if (newScore < 10) {
            setTimeout(showRandomMissions, 400);
        } else {
            setGameState('finished');
        }
    };
    
    useEffect(() => {
        if (gameState === 'finished') {
            onComplete();
        }
    }, [gameState, onComplete]);
    
    const startGame = () => {
        setScore(0);
        setTotalEarnings(0);
        setActiveMissions([]);
        clearTimeout(gameTimer.current);
        setGameState('playing');
    }

    return (
        <ModuleView title={title} onBack={onBack}>
             <style>{`
                @keyframes popup {
                  0% { transform: translateY(100%) scale(0.8); opacity: 0; }
                  20%, 80% { transform: translateY(-10%) scale(1); opacity: 1; }
                  100% { transform: translateY(100%) scale(0.8); opacity: 0; }
                }
                .animate-popup {
                    animation: popup 6s ease-in-out;
                }
            `}</style>
            <div className="text-center bg-white/40 backdrop-blur-md p-4 sm:p-8 rounded-3xl shadow-xl border border-white/50">
                <h3 className="text-4xl font-bold text-brand-teal mb-4">אתגר הבחירה!</h3>
                <div className="my-6 bg-white/50 p-6 rounded-2xl max-w-3xl mx-auto shadow-inner border border-white/50">
                    <h4 className="text-3xl font-bold mb-2 text-brand-dark-blue">איך מרוויחים דמי כיס? 💸</h4>
                    <p className="text-2xl leading-relaxed">במשחק הזה, יופיעו שתי משימות בו-זמנית. עליכם לבחור איזו מהן לבצע כדי להרוויח מטבעות. בחירה במשימה אחת פירושה ויתור על השנייה. השלימו 10 משימות!</p>
                </div>
                
                <div className="flex flex-col md:flex-row justify-around items-center mb-8 bg-white/50 p-6 rounded-2xl shadow-inner border border-white/50 gap-4">
                     <div className="text-center bg-white/70 p-4 rounded-2xl shadow-lg">
                        <h4 className="text-3xl font-bold">הצלחות</h4>
                        <p className="text-5xl font-bold">{score} / 10</p>
                    </div>
                    <div className="text-center bg-white/70 p-4 rounded-2xl shadow-lg">
                        <h4 className="text-3xl font-bold">הרווחים שלכם</h4>
                        <p className="text-5xl font-bold text-yellow-500 drop-shadow-md">{totalEarnings} 🪙</p>
                    </div>
                </div>

                {gameState === 'intro' ? (
                     <button onClick={startGame} className="bg-brand-magenta text-white font-bold py-4 px-10 rounded-2xl text-3xl mb-6 shadow-lg hover:scale-105 transform transition-transform">
                        התחל משחק
                    </button>
                ) : (
                    <div className="bg-gradient-to-b from-brand-light-blue/30 to-brand-teal/30 p-6 rounded-3xl shadow-2xl">
                        <div className="grid grid-cols-3 gap-6 h-96">
                            {Array.from({ length: 6 }).map((_, index) => {
                                const activeMissionData = activeMissions.find(m => m.holeIndex === index);
                                return (
                                    <div key={index} className="relative flex items-end justify-center">
                                        <div className="w-28 h-28 bg-blue-900/20 rounded-full border-[10px] border-brand-dark-blue/30 shadow-inner"></div>
                                        {activeMissionData && gameState === 'playing' && (
                                            <div 
                                                onClick={() => handleMissionClick(activeMissionData.missionIndex)}
                                                className="absolute bottom-4 text-center cursor-pointer animate-popup w-40"
                                            >
                                                <div className="p-4 bg-white/90 rounded-2xl shadow-lg border border-white/50 transform hover:scale-110 transition-transform">
                                                    <div className="text-7xl drop-shadow-lg">{missions[activeMissionData.missionIndex].icon}</div>
                                                    <div className="text-black font-bold text-lg p-1 rounded-md">{missions[activeMissionData.missionIndex].name}</div>
                                                    <div className="font-bold text-xl text-yellow-600">+{missions[activeMissionData.missionIndex].reward}🪙</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
                
                <div className="mt-8 bg-yellow-100/70 p-4 rounded-2xl border-2 border-yellow-300 max-w-3xl mx-auto">
                    <p className="text-yellow-900 font-bold text-xl">💡 חשוב לזכור: עזרה בבית היא קודם כל חלק מהיותנו משפחה, ולא תמיד מקבלים עליה תשלום. לפעמים, אפשר להסכים עם ההורים על משימות מיוחדות שיזכו אתכם בדמי כיס נוספים!</p>
                </div>

                 {gameState === 'finished' ? (
                    <div className="mt-8">
                        <p className="text-4xl font-bold text-green-600 animate-bounce">מעולה! אתם אלופי המשימות!</p>
                        <button onClick={startGame} className="mt-4 bg-brand-magenta text-white font-bold py-2 px-6 rounded-lg text-lg">שחק שוב</button>
                    </div>
                 ) : (
                    <p className="mt-4 text-2xl font-bold h-8"></p>
                 )}
            </div>
        </ModuleView>
    );
};

export default EarningMissionsModule;