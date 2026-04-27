import React, { useState } from 'react';
import Header from './Header';

interface LoginPageProps {
    userType: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    onLogin: (grade?: string) => void;
    onBack: () => void;
    showGradeSelector?: boolean;
    requiredCredentials?: {
        username: string;
        password: string;
    };
    guestUnlockClicks?: number;
    disableGuestLogin?: boolean;
    guestLockedMessage?: string;
}

const LoginPage: React.FC<LoginPageProps> = ({
    userType,
    description,
    icon: Icon,
    onLogin,
    onBack,
    showGradeSelector = false,
    requiredCredentials,
    guestUnlockClicks = 0,
    disableGuestLogin = false,
    guestLockedMessage = 'למרחב המדריכים ניתן להיכנס עם שם משתמש וסיסמא',
}) => {
    const [selectedGrade, setSelectedGrade] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [guestTapCount, setGuestTapCount] = useState(0);
    const [guestUnlocked, setGuestUnlocked] = useState(guestUnlockClicks === 0);
    const grades = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'י"א', 'י"ב'];

    const resetGuestSequence = () => {
        if (guestUnlockClicks > 0) {
            setGuestTapCount(0);
            setGuestUnlocked(false);
        }
    };

    const handlePrimaryLogin = () => {
        setLoginError('');
        resetGuestSequence();

        if (requiredCredentials) {
            const isValid = username.trim() === requiredCredentials.username && password === requiredCredentials.password;
            if (!isValid) {
                setLoginError('שם משתמש או סיסמה שגויים.');
                return;
            }
        }

        onLogin(showGradeSelector ? (selectedGrade || undefined) : undefined);
    };

    const handleGuestLogin = () => {
        setLoginError('');

        if (!guestUnlocked && guestUnlockClicks > 0) {
            const nextCount = guestTapCount + 1;
            setGuestTapCount(nextCount);
            if (nextCount >= guestUnlockClicks) {
                setGuestUnlocked(true);
            }
            setLoginError(guestLockedMessage);
            return;
        }

        if (disableGuestLogin && guestUnlockClicks === 0) {
            setLoginError('למרחב המדריכים ניתן להיכנס רק עם שם משתמש וסיסמה.');
            return;
        }

        if (showGradeSelector) {
            // If a grade is selected, log in with it. Otherwise, log in without it (will lead to program selection).
            onLogin(selectedGrade || undefined);
        } else {
            onLogin();
        }
    };

    return (
        <div className="animate-fade-in">
            <button 
                onClick={onBack}
                className="mb-8 w-full sm:w-auto bg-brand-magenta hover:bg-pink-700 text-white font-bold py-2.5 sm:py-3 px-5 sm:px-8 text-base sm:text-xl rounded-full flex items-center justify-center transition-colors duration-300"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H15a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                חזרה
            </button>
            <Header />

            <div className="max-w-md mx-auto mt-10 sm:mt-12 card-surface p-5 sm:p-8 rounded-4xl border-2 border-brand-teal shadow-2xl glow-ring">
                <div className="flex flex-col items-center text-center">
                    <div className="p-4 rounded-full mb-4 shadow-md bg-brand-teal shadow-brand-teal/30">
                        <Icon className="w-12 h-12 text-white" />
                    </div>
                    <h2 className="text-3xl sm:text-5xl font-bold font-display text-brand-dark-blue">כניסת {userType}</h2>
                    <p className="mt-2 text-lg sm:text-2xl text-brand-dark-blue/80">{description}</p>
                </div>

                <div className="mt-8 space-y-4">
                    {showGradeSelector && (
                         <div>
                            <label className="block text-xl font-medium text-brand-dark-blue">כיתה</label>
                            <select
                                value={selectedGrade}
                                onChange={(e) => setSelectedGrade(e.target.value)}
                                className="w-full mt-1 bg-white p-3 sm:p-4 rounded-lg border-2 border-gray-300 focus:border-brand-teal focus:ring-brand-teal transition text-lg sm:text-xl"
                            >
                                <option value="" disabled>-- בחרו את כיתתכם --</option>
                                {grades.map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                        </div>
                    )}
                    <div>
                        <label className="block text-xl font-medium text-brand-dark-blue">שם משתמש</label>
                        <input
                            type="text"
                            placeholder="הזינו שם משתמש"
                            value={username}
                            onChange={(e) => { setUsername(e.target.value); resetGuestSequence(); }}
                            className="w-full mt-1 bg-white p-3 sm:p-4 rounded-lg border-2 border-gray-300 focus:border-brand-teal focus:ring-brand-teal transition text-lg sm:text-xl"
                        />
                    </div>
                    <div>
                        <label className="block text-xl font-medium text-brand-dark-blue">סיסמה</label>
                        <input
                            type="password"
                            placeholder="הזינו סיסמה"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); resetGuestSequence(); }}
                            className="w-full mt-1 bg-white p-3 sm:p-4 rounded-lg border-2 border-gray-300 focus:border-brand-teal focus:ring-brand-teal transition text-lg sm:text-xl"
                        />
                    </div>
                    {loginError && (
                        <p className="text-red-700 bg-red-100 border border-red-300 rounded-lg px-3 py-2 text-lg font-semibold">
                            {loginError}
                        </p>
                    )}
                </div>

                <div className="mt-8">
                     <button
                        disabled={(!requiredCredentials && showGradeSelector && !selectedGrade) || (!!requiredCredentials && (!username.trim() || !password))}
                        onClick={handlePrimaryLogin}
                        className="w-full cta-primary text-white font-bold py-3.5 sm:py-4 px-6 rounded-lg text-xl sm:text-2xl transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        כניסה
                    </button>
                    <button
                        onClick={handleGuestLogin}
                        className="w-full mt-3 cta-secondary text-brand-light-blue font-bold py-3.5 sm:py-4 px-6 rounded-lg text-xl sm:text-2xl border-2 border-brand-light-blue transition-colors disabled:bg-gray-300/50 disabled:border-gray-400 disabled:text-gray-500 disabled:cursor-not-allowed"
                    >
                        כניסת אורח
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;