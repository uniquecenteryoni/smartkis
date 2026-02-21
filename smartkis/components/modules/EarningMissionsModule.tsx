import React, { useState, useEffect, useRef } from 'react';
import ModuleView from '../ModuleView';

interface ModuleProps {
  onBack: () => void;
  title: string;
  onComplete: () => void;
}

const missions = [
    { id: 1, name: 'סידור החדר', icon: '🛏️', reward: 2 },
    { id: 2, name: 'עזרה בגינה', icon: '🌱', reward: 3 },
    { id: 3, name: 'שטיפת כלים', icon: '🍽️', reward: 2 },
    { id: 4, name: 'טיול עם הכלב', icon: '🐕', reward: 1 },
    { id: 5, name: 'עריכת שולחן', icon: '🍴', reward: 1 },
    { id: 6, name: 'שטיפת המכונית', icon: '🚗', reward: 4 },
];

const EarningMissionsModule: React.FC<ModuleProps> = ({ onBack, title, onComplete }) => {
    const [totalEarnings, setTotalEarnings] = useState(0);
    const [activeMission, setActiveMission] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    // FIX: Changed NodeJS.Timeout to ReturnType<typeof setTimeout> for browser compatibility.
    // The NodeJS namespace is not available in the browser environment.
    const gameTimer = useRef<ReturnType<typeof setTimeout>>();

    const showRandomMission = () => {
        const randomIndex = Math.floor(Math.random() * missions.length);
        setActiveMission(randomIndex);

        gameTimer.current = setTimeout(() => {
            setActiveMission(null);
            showRandomMission();
        }, 2500); // Slower: How long the mission stays up
    };

    useEffect(() => {
        showRandomMission();
        return () => {
            if (gameTimer.current) {
                clearTimeout(gameTimer.current);
            }
        };
    }, []);

    const handleMissionClick = (missionIndex: number) => {
        if (activeMission === missionIndex) {
            const mission = missions[missionIndex];
            setTotalEarnings(prev => prev + mission.reward);
            setScore(prev => prev + 1);
            setActiveMission(null);
            if(gameTimer.current) clearTimeout(gameTimer.current);
            showRandomMission();
        }
    };
    
    const isGameFinished = score >= 10;

    useEffect(() => {
        if (isGameFinished) {
            if(gameTimer.current) clearTimeout(gameTimer.current);
            onComplete();
        }
    }, [isGameFinished, onComplete]);

    return (
        <ModuleView title={title} onBack={onBack}>
            <div className="text-center">
                <h3 className="text-3xl font-bold text-brand-teal mb-2">הכה את המשימה!</h3>
                <p className="text-2xl text-brand-dark-blue/90 mb-6">
                    לחצו על המשימה שקופצת כדי להשלים אותה ולהרוויח מטבעות. השלימו 10 משימות!
                </p>
                
                <div className="flex justify-around items-center mb-6 bg-white/40 p-4 rounded-2xl">
                     <div className="text-center">
                        <h4 className="text-2xl font-bold">הצלחות</h4>
                        <p className="text-4xl font-bold">{score} / 10</p>
                    </div>
                    <div className="text-center">
                        <h4 className="text-2xl font-bold">הרווחים שלכם</h4>
                        <p className="text-4xl font-bold text-yellow-500">{totalEarnings} 🪙</p>
                    </div>
                </div>

                <div className="bg-green-300/50 p-6 rounded-2xl">
                    <div className="grid grid-cols-3 gap-6 h-96">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div key={index} className="relative bg-yellow-800/30 rounded-full flex items-center justify-center">
                                <div className="w-24 h-24 bg-black/40 rounded-full border-8 border-yellow-900/50"></div>
                                {activeMission === index && (
                                    <div 
                                        onClick={() => handleMissionClick(index)}
                                        className="absolute bottom-12 text-center cursor-pointer animate-popup"
                                    >
                                        <div className="text-7xl">{missions[index].icon}</div>
                                        <div className="bg-black/50 text-white font-bold p-1 rounded-md">{missions[index].name}</div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                 {isGameFinished && <p className="mt-8 text-2xl font-bold text-green-600 animate-bounce">מעולה! אתם אלופי המשימות!</p>}
            </div>
             <style>{`
                @keyframes popup {
                  0% { transform: translateY(100%); }
                  50% { transform: translateY(0); }
                  100% { transform: translateY(100%); }
                }
                .animate-popup {
                    animation: popup 2.5s linear;
                }
            `}</style>
        </ModuleView>
    );
};

export default EarningMissionsModule;