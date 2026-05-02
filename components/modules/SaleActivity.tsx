import React from 'react';

interface SaleActivityProps {
  onBack: () => void;
}

export default function SaleActivity({ onBack }: SaleActivityProps) {
  const rawBasePath = import.meta.env.BASE_URL || '/';
  const basePath = rawBasePath.startsWith('/') ? rawBasePath : `/${rawBasePath}`;
  const basePathWithSlash = basePath.endsWith('/') ? basePath : `${basePath}/`;
  const mobilePath = `${basePathWithSlash}games/sale-worksheet.html`;
  const mobileUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${mobilePath}`
    : mobilePath;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=420x420&data=${encodeURIComponent(mobileUrl)}`;

  return (
    <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-5" dir="rtl">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="text-brand-dark-blue/70">פעילות - שיעור סיכום</p>
          <h3 className="text-2xl font-bold text-brand-dark-blue">המכירה</h3>
          <p className="text-brand-dark-blue/60">סרקו את ה-QR ושלחו תלמידים לבנות חשבון עסקה מחושב אוטומטית בנייד.</p>
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
        >
          חזרה לחלון המשחקים
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
        <div className="rounded-3xl border-2 border-dashed border-cyan-300 bg-cyan-50 p-6 flex flex-col items-center justify-center text-center">
          <p className="text-4xl mb-3">📱</p>
          <h4 className="text-2xl font-black text-brand-dark-blue mb-2">סריקה לנייד</h4>
          <p className="text-brand-dark-blue/70 mb-4">התלמיד מזין שם, סכום כסף, מוצרים, מחיר יחידה וכמות - והכל מחושב לבד.</p>
          <a
            href={mobileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-brand-teal text-white px-5 py-2 font-bold hover:opacity-90"
          >
            פתיחה בחלון חדש
          </a>
        </div>

        <div className="rounded-3xl border-2 border-slate-200 bg-white p-5 flex flex-col items-center justify-center">
          <img
            src={qrUrl}
            alt="QR לפתיחת פעילות המכירה בנייד"
            className="w-full max-w-[280px] h-auto object-contain rounded-2xl border border-slate-200"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          <p className="text-sm text-brand-dark-blue/60 mt-3 text-center">סרקו עם מצלמת הטלפון כדי לפתוח את הטופס</p>
        </div>
      </div>
    </div>
  );
}
