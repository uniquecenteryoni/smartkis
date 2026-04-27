import React from 'react';

type PayslipChallengeGameProps = {
  onBack: () => void;
};

const PayslipChallengeGame: React.FC<PayslipChallengeGameProps> = ({ onBack }) => {
  const gameUrl = `${import.meta.env.BASE_URL}games/payslip-challenge-game.html`;

  return (
    <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-4" dir="rtl">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="text-brand-dark-blue/70">פעילות</p>
          <h3 className="text-2xl font-bold text-brand-dark-blue">אתגר התלוש</h3>
          <p className="text-brand-dark-blue/60">
            סריקת QR לנייד, קריאת סיפור קצר ומילוי תלוש משכורת מדומה עם שדות חסרים.
          </p>
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
        >
          חזרה לחלון המשחקים
        </button>
      </div>

      <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white">
        <iframe
          title="Payslip Challenge Game"
          src={gameUrl}
          className="w-full"
          style={{ height: '84vh', minHeight: '680px', border: '0' }}
          allow="clipboard-read; clipboard-write"
        />
      </div>
    </div>
  );
};

export default PayslipChallengeGame;
