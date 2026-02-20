import React, { useState, useEffect } from 'react';
import ModuleView from '../../ModuleView';

interface ModuleProps {
  onBack: () => void;
  title: string;
  onComplete: () => void;
}

type Player = 'X' | 'O';
const questions = [
    { q: 'קניית צעצוע חדש היא...', a: 'בזבוזים' },
    { q: 'לשים כסף בצד לטיול גדול זה...', a: 'חיסכון' },
    { q: 'לתת כסף למישהו שצריך עזרה זה...', a: 'נתינה' },
    { q: 'לקנות ממתקים זה...', a: 'בזבוזים' },
    { q: 'לשמור כסף לקנות מתנה לאמא זה...', a: 'נתינה' },
    { q: 'לא לבזבז את כל דמי הכיס מיד זה...', a: 'חיסכון' },
];

const JarBankModule: React.FC<ModuleProps> = ({ onBack, title, onComplete }) => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [turn, setTurn] = useState<Player>('X');
    const [winner, setWinner] = useState<Player | 'תיקו' | null>(null);
    const [showQuestion, setShowQuestion] = useState<{ index: number; question: typeof questions[0] } | null>(null);

    const checkWinner = (currentBoard: (Player | null)[]) => {
        const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
        for (let line of lines) {
            const [a, b, c] = line;
            if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
                return currentBoard[a];
            }
        }
        if (currentBoard.every(cell => cell)) return 'תיקו';
        return null;
    };
    
    const handleCellClick = (index: number) => {
        if (board[index] || winner || turn !== 'X') return;
        const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
        setShowQuestion({ index, question: randomQuestion });
    };

    const handleAnswer = (answer: string) => {
        if (!showQuestion) return;
        const { index, question } = showQuestion;

        if (answer === question.a) {
            const newBoard = [...board];
            newBoard[index] = 'X';
            setBoard(newBoard);
            setTurn('O');
            
            const gameWinner = checkWinner(newBoard);
            if(gameWinner) {
                setWinner(gameWinner);
                if(gameWinner === 'X' || gameWinner === 'תיקו') onComplete();
                return;
            }
            setTimeout(() => computerMove(newBoard), 500);
        }
        setShowQuestion(null);
    };

    const computerMove = (currentBoard: (Player|null)[]) => {
        const newBoard = [...currentBoard];
        const emptyCells = newBoard.map((c, i) => (c === null ? i : null)).filter(i => i !== null);
        if (emptyCells.length > 0) {
            const move = emptyCells[Math.floor(Math.random() * emptyCells.length)] as number;
            newBoard[move] = 'O';
            setBoard(newBoard);
            const gameWinner = checkWinner(newBoard);
            if(gameWinner) {
                setWinner(gameWinner);
            } else {
                setTurn('X');
            }
        }
    };
    
    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setTurn('X');
        setWinner(null);
        setShowQuestion(null);
    }

    return (
        <ModuleView title={title} onBack={onBack}>
            <div className="text-center bg-white/40 backdrop-blur-md p-4 sm:p-8 rounded-3xl shadow-xl border border-white/50">
                <h3 className="text-4xl font-bold text-brand-teal mb-4">איקס עיגול פיננסי!</h3>
                <div className="my-6 bg-white/50 p-6 rounded-2xl max-w-4xl mx-auto shadow-inner border border-white/50">
                    <h4 className="text-3xl font-bold mb-4 text-brand-dark-blue">שיטת הצנצנות 🏺</h4>
                    <p className="text-xl leading-relaxed mb-6">דרך מצוינת ללמוד לנהל דמי כיס היא לחלק אותם ל-3 צנצנות דמיוניות:</p>
                    <div className="flex flex-col md:flex-row justify-center items-stretch gap-6 text-xl">
                        <div className="flex-1 p-6 bg-white/70 rounded-2xl shadow-lg border border-red-300 transform hover:scale-105 transition-transform">
                            <p className="text-6xl">💸</p>
                            <p className="font-bold text-2xl text-red-500 mt-2">בזבוזים</p>
                            <p>לדברים כיפיים ומידיים</p>
                        </div>
                        <div className="flex-1 p-6 bg-white/70 rounded-2xl shadow-lg border border-green-300 transform hover:scale-105 transition-transform">
                            <p className="text-6xl">🐷</p>
                            <p className="font-bold text-2xl text-green-500 mt-2">חיסכון</p>
                            <p>למטרות גדולות בעתיד</p>
                        </div>
                        <div className="flex-1 p-6 bg-white/70 rounded-2xl shadow-lg border border-blue-300 transform hover:scale-105 transition-transform">
                             <p className="text-6xl">💖</p>
                            <p className="font-bold text-2xl text-blue-500 mt-2">נתינה</p>
                            <p>לעזרה לאחרים או מתנות</p>
                        </div>
                    </div>
                </div>
                <p className="text-2xl text-brand-dark-blue/90 mb-6">
                    ענו נכון על השאלה כדי להניח 'איקס'. נסו לנצח את המחשב!
                </p>

                <div className="relative w-full max-w-md mx-auto bg-white/50 p-4 rounded-3xl shadow-2xl border border-white/50">
                    <div className="grid grid-cols-3 gap-3">
                        {board.map((cell, index) => (
                            <div key={index} onClick={() => handleCellClick(index)} className="w-full aspect-square bg-white/80 rounded-2xl flex items-center justify-center text-7xl font-bold cursor-pointer hover:bg-white transition-colors border-4 border-brand-dark-blue/20 shadow-inner">
                                {cell === 'X' && <span className="text-brand-light-blue drop-shadow-lg">X</span>}
                                {cell === 'O' && <span className="text-brand-magenta drop-shadow-lg">O</span>}
                            </div>
                        ))}
                    </div>

                    {showQuestion && (
                        <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-3xl animate-fade-in z-10">
                            <div className="bg-white p-8 rounded-2xl text-brand-dark-blue max-w-sm w-11/12 shadow-2xl">
                                <h4 className="font-bold text-2xl mb-4">{showQuestion.question.q}</h4>
                                <div className="flex flex-col gap-3">
                                    {['בזבוזים', 'חיסכון', 'נתינה'].map(opt => (
                                        <button key={opt} onClick={() => handleAnswer(opt)} className="p-3 bg-gray-200 hover:bg-gray-300 rounded-lg text-xl font-semibold transition-colors">
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {winner && (
                         <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center rounded-3xl text-white animate-fade-in z-10">
                             <p className="text-6xl font-bold animate-bounce drop-shadow-lg">
                                 {winner === 'X' && 'ניצחת!'}
                                 {winner === 'O' && 'המחשב ניצח!'}
                                 {winner === 'תיקו' && 'תיקו!'}
                            </p>
                             <button onClick={resetGame} className="mt-8 bg-brand-teal text-white py-3 px-6 rounded-2xl font-bold text-xl shadow-lg hover:scale-105 transform transition-transform">שחק שוב</button>
                        </div>
                    )}
                </div>
            </div>
        </ModuleView>
    );
};

export default JarBankModule;