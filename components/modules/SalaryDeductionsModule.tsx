import React, { useEffect, useMemo, useState } from 'react';
import ModuleView from '../ModuleView';
import { TrophyIcon } from '../icons/Icons';

interface SalaryDeductionsModuleProps {
  onBack: () => void;
  title: string;
  onComplete: () => void;
}

// --- Chapter Data ---
const chapters = [
  {
    id: 'intro',
    title: 'הסבר כולל על ניכויי שכר בישראל',
    icon: '💰',
  },
  {
    id: 'income-tax',
    title: 'מס הכנסה',
    icon: '📊',
  },
  {
    id: 'insurance',
    title: 'ביטוח לאומי ודמי בריאות',
    icon: '🏥',
  },
  {
    id: 'pension',
    title: 'פנסיה',
    icon: '🏛️',
  },
  {
    id: 'summary',
    title: 'סיכום',
    icon: '✅',
  },
];

type IncomeTaxBracket = {
  rate: number;
  cap: number | null;
  monthlyLabel: string;
  annualLabel: string;
  rateLabel: string;
};

const INCOME_TAX_BRACKETS: IncomeTaxBracket[] = [
  { rate: 0.10, cap: 7010, monthlyLabel: 'עד 7,010 ₪', annualLabel: 'עד 84,120 ₪', rateLabel: '10%' },
  { rate: 0.14, cap: 10060, monthlyLabel: '7,011 - 10,060 ₪', annualLabel: '84,121 - 120,720 ₪', rateLabel: '14%' },
  { rate: 0.20, cap: 16150, monthlyLabel: '10,061 - 16,150 ₪', annualLabel: '120,721 - 193,800 ₪', rateLabel: '20%' },
  { rate: 0.31, cap: 22440, monthlyLabel: '16,151 - 22,440 ₪', annualLabel: '193,801 - 269,280 ₪', rateLabel: '31%' },
  { rate: 0.35, cap: 46690, monthlyLabel: '22,441 - 46,690 ₪', annualLabel: '269,281 - 560,280 ₪', rateLabel: '35%' },
  { rate: 0.47, cap: 60130, monthlyLabel: '46,691 - 60,130 ₪', annualLabel: '560,281 - 721,560 ₪', rateLabel: '47%' },
  { rate: 0.50, cap: null, monthlyLabel: '60,131 ₪ ומעלה', annualLabel: '721,561 ₪ ומעלה', rateLabel: '*50%' },
];

const formatILS = (value: number, minFractionDigits = 0, maxFractionDigits = 0) =>
  `${value.toLocaleString('he-IL', { minimumFractionDigits: minFractionDigits, maximumFractionDigits: maxFractionDigits })} ₪`;

const calculateIncomeTaxBreakdown = (grossMonthly: number) => {
  let previousCap = 0;

  const rows = INCOME_TAX_BRACKETS.map((bracket, index) => {
    const upperBound = bracket.cap ?? grossMonthly;
    const taxableInBracket = Math.max(0, Math.min(grossMonthly, upperBound) - previousCap);
    const taxInBracket = taxableInBracket * bracket.rate;
    const bracketWidth = bracket.cap ? Math.max(1, bracket.cap - previousCap) : Math.max(1, taxableInBracket);
    const fillPercent = bracket.cap
      ? Math.max(0, Math.min(100, (taxableInBracket / bracketWidth) * 100))
      : taxableInBracket > 0
        ? 100
        : 0;

    const row = {
      index,
      taxableInBracket,
      taxInBracket,
      fillPercent,
      bracket,
    };

    if (bracket.cap) {
      previousCap = bracket.cap;
    }

    return row;
  });

  const totalTaxBeforeCredits = rows.reduce((sum, row) => sum + row.taxInBracket, 0);
  return { rows, totalTaxBeforeCredits };
};

// --- Chapter 1: Introduction ---
const IntroductionChapter: React.FC = () => (
  <div className="space-y-6">
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-brand-teal p-8 rounded-2xl">
      <h3 className="text-4xl font-bold text-brand-teal mb-4">🎯 מהו "ניכוי שכר"?</h3>
      <p className="text-2xl text-gray-800 leading-relaxed">
        כשמגיעה לך משכורת, לא כל הכסף שהמעסיק שלך מעביר לחשבון הבנק שלך הוא שלך. חלק מהשכר נוכה (מופחת) כדי לעמוד בחוקים ישראליים שונים. ניכויי השכר הם אחד המרכיבים החשובים ביותר בהבנת תלוש השכר שלך.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-6 rounded-xl border-2 border-brand-teal">
        <h4 className="text-2xl font-bold text-brand-teal mb-3">📈 שכר ברוטו</h4>
        <p className="text-xl text-gray-800">
          הסכום הכולל שמעסיקך מעביר לך <span className="font-bold">לפני</span> כל ניכוי.
        </p>
      </div>
      <div className="bg-gradient-to-br from-magenta-50 to-magenta-100 p-6 rounded-xl border-2 border-brand-magenta">
        <h4 className="text-2xl font-bold text-brand-magenta mb-3">💳 שכר נטו</h4>
        <p className="text-xl text-gray-800">
          הסכום שאתה באמת מקבל בחשבון הבנק <span className="font-bold">אחרי</span> כל הניכויים.
        </p>
      </div>
    </div>

    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-500 p-8 rounded-2xl">
      <h4 className="text-2xl font-bold text-yellow-700 mb-4">⚠️ שימו לב!</h4>
      <p className="text-xl text-yellow-800 leading-relaxed">
        בישראל, ניכויי השכר הם <span className="font-bold">חובה על פי חוק</span>. זה אומר שכל מעסיק חייב להוריד מהשכר שלך ולהעביר לרשויות הממלכה.
      </p>
      <p className="text-xl text-yellow-800 leading-relaxed mt-4">
        הניכויים מתחלקים לשתי קטגוריות עיקריות:
      </p>
      <ul className="text-xl text-yellow-800 leading-relaxed mt-4">
        <li className="mb-2">✓ <span className="font-bold">ניכויי חובה</span> - חוקיים ולא ניתן להימנע מהם</li>
        <li>✓ <span className="font-bold">ניכויי רשות</span> - אופציונליים (לפי בחירה)</li>
      </ul>
    </div>

    <div className="bg-white border-2 border-gray-300 p-8 rounded-2xl">
      <h4 className="text-2xl font-bold text-brand-dark-blue mb-4">💡 דוגמה פשוטה</h4>
      <div className="space-y-3 text-xl text-gray-800">
        <div className="flex justify-between items-center p-3 bg-green-100 rounded-lg">
          <span>✓ שכר ברוטו (כל הכסף):</span>
          <span className="font-bold text-2xl">10,000 ₪</span>
        </div>
        <div className="flex items-center justify-center text-3xl text-gray-400 my-3">↓</div>
        <div className="flex justify-between items-center p-3 bg-red-100 rounded-lg">
          <span>✗ ניכויים:</span>
          <span className="font-bold text-2xl">-2,000 ₪</span>
        </div>
        <div className="flex items-center justify-center text-3xl text-gray-400 my-3">↓</div>
        <div className="flex justify-between items-center p-3 bg-blue-100 rounded-lg">
          <span>✓ שכר נטו (כל הכסף):</span>
          <span className="font-bold text-2xl">8,000 ₪</span>
        </div>
      </div>
    </div>
  </div>
);

// Color palette for tax brackets (bright, distinct colors)
const BRACKET_COLORS = [
  { bg: 'bg-cyan-50', border: 'border-cyan-400', progress: 'from-cyan-400 to-cyan-500', text: 'text-cyan-700' },
  { bg: 'bg-blue-50', border: 'border-blue-400', progress: 'from-blue-400 to-blue-500', text: 'text-blue-700' },
  { bg: 'bg-purple-50', border: 'border-purple-400', progress: 'from-purple-400 to-purple-500', text: 'text-purple-700' },
  { bg: 'bg-pink-50', border: 'border-pink-400', progress: 'from-pink-400 to-pink-500', text: 'text-pink-700' },
  { bg: 'bg-orange-50', border: 'border-orange-400', progress: 'from-orange-400 to-orange-500', text: 'text-orange-700' },
  { bg: 'bg-amber-50', border: 'border-amber-400', progress: 'from-amber-400 to-amber-500', text: 'text-amber-700' },
  { bg: 'bg-red-50', border: 'border-red-400', progress: 'from-red-400 to-red-500', text: 'text-red-700' },
];

type CreditProfile = 'single-man' | 'single-woman' | 'custom';

const CREDIT_PROFILE_BASE_POINTS: Record<CreditProfile, number> = {
  'single-man': 2.25,
  'single-woman': 2.75,
  custom: 0,
};

type CreditBenefitOption = {
  id: string;
  label: string;
  emoji: string;
  sourceNote: string;
  pointsPerUnit: number;
  perChild?: boolean;
};

const CREDIT_BENEFIT_OPTIONS: CreditBenefitOption[] = [
  {
    id: 'youth-16-18',
    label: 'נוער עובד/ת בגיל 16–18',
    emoji: '🎒',
    sourceNote: 'מקור: סימולטור רשות המסים — תוספת של נקודת זיכוי אחת לנוער עובד/ת.',
    pointsPerUnit: 1,
  },
  {
    id: 'children-under-5',
    label: 'ילדים מתחת לגיל 5',
    emoji: '👶',
    sourceNote: 'מקור: פקודת מס הכנסה ס׳ 40 — כ-2 נק\' לכל ילד/ה עבור ההורה המטפל/ת העיקרי/ת.',
    pointsPerUnit: 2,
    perChild: true,
  },
  {
    id: 'children-6-17',
    label: 'ילדים בגיל 6–17',
    emoji: '🧒',
    sourceNote: 'מקור: פקודת מס הכנסה ס׳ 40 — כ-1 נק\' לכל ילד/ה (בכפוף למצב משפחתי).',
    pointsPerUnit: 1,
    perChild: true,
  },
  {
    id: 'military-or-national-service',
    label: 'חייל/ת משוחרר/ת או שירות לאומי',
    emoji: '🎖️',
    sourceNote: 'מקור: כל-זכות / רשות המסים — כ-1 נק\' לתקופה מוגדרת לאחר השחרור.',
    pointsPerUnit: 1,
  },
];

// --- Chapter 2: Income Tax ---
const IncomeTaxChapter: React.FC = () => {
  const [grossSalary, setGrossSalary] = useState<number>(12000);
  const [creditPoints, setCreditPoints] = useState<number>(2.25);
  const [creditProfile, setCreditProfile] = useState<CreditProfile>('single-man');
  const [extraCreditPoints, setExtraCreditPoints] = useState<number>(0);
  const [selectedBenefitIds, setSelectedBenefitIds] = useState<string[]>([]);
  const [childCountByBenefitId, setChildCountByBenefitId] = useState<Record<string, number>>({});
  const [animationProgress, setAnimationProgress] = useState<number>(1);

  const toggleBenefit = (id: string) => {
    setSelectedBenefitIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const safeGrossSalary = Number.isFinite(grossSalary) ? Math.max(0, grossSalary) : 0;
  const safeCreditPoints = Number.isFinite(creditPoints) ? Math.max(0, creditPoints) : 0;
  const safeExtraCreditPoints = Number.isFinite(extraCreditPoints) ? Math.max(0, extraCreditPoints) : 0;
  const taxBreakdown = useMemo(() => calculateIncomeTaxBreakdown(safeGrossSalary), [safeGrossSalary]);

  useEffect(() => {
    let rafId = 0;
    const durationMs = 1400;
    const start = performance.now();

    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / durationMs);
      setAnimationProgress(progress);
      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      }
    };

    setAnimationProgress(0);
    rafId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(rafId);
  }, [safeGrossSalary]);

  const animatedRows = useMemo(() => {
    const count = Math.max(1, taxBreakdown.rows.length);

    return taxBreakdown.rows.map((row, idx) => {
      const stageProgress = Math.max(0, Math.min(1, animationProgress * count - idx));
      const animatedTaxable = row.taxableInBracket * stageProgress;
      const animatedTax = row.taxInBracket * stageProgress;

      return {
        ...row,
        animatedTaxable,
        animatedTax,
        animatedFillPercent: row.fillPercent * stageProgress,
      };
    });
  }, [animationProgress, taxBreakdown.rows]);

  const animatedTotalTax = useMemo(
    () => animatedRows.reduce((sum, row) => sum + row.animatedTax, 0),
    [animatedRows],
  );

  const estimatedCreditValue = 242;
  const selectedBaseCreditPoints = CREDIT_PROFILE_BASE_POINTS[creditProfile];
  const selectedBenefitPoints = selectedBenefitIds.reduce((sum, id) => {
    const option = CREDIT_BENEFIT_OPTIONS.find((o) => o.id === id);
    if (!option) return sum;
    const count = option.perChild ? Math.max(1, childCountByBenefitId[id] ?? 1) : 1;
    return sum + option.pointsPerUnit * count;
  }, 0);
  const calculatedCreditPoints = selectedBaseCreditPoints + safeExtraCreditPoints + selectedBenefitPoints;
  const monthlyCreditByCalculator = calculatedCreditPoints * estimatedCreditValue;
  const yearlyCreditByCalculator = monthlyCreditByCalculator * 12;
  const creditsAmount = safeCreditPoints * estimatedCreditValue;
  const estimatedTaxAfterCredits = Math.max(0, taxBreakdown.totalTaxBeforeCredits - creditsAmount);

  return (
  <div className="space-y-6">
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-brand-teal p-8 rounded-2xl">
      <h3 className="text-4xl font-bold text-brand-teal mb-4">📊 מס הכנסה</h3>
      <p className="text-2xl text-gray-800 leading-relaxed">
        מס הכנסה הוא דמי שאתה משלם למדינת ישראל בעבור ההכנסה שלך. זה אחד הניכויים הגדולים ביותר מהמשכורת שלך.
      </p>
    </div>

    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl border-2 border-purple-400">
      <h4 className="text-3xl font-bold text-purple-700 mb-4">🎯 למה יש מס הכנסה?</h4>
      <p className="text-xl text-purple-900 leading-relaxed mb-4">
        הממשלה משתמשת בכסף מהמסים כדי:
      </p>
      <ul className="text-xl text-purple-900 space-y-2">
        <li>🏫 לבנות בתי ספר וחינוך</li>
        <li>🏥 לתמוך במערכת הבריאות</li>
        <li>🚗 לבנות ולתחזוק כבישים</li>
        <li>🛡️ להגן על המדינה</li>
        <li>👨‍👩‍👧‍👦 לסייע לקשישים ולמשפחות</li>
      </ul>
    </div>

    <div className="bg-white border-2 border-gray-300 p-8 rounded-2xl">
      <h4 className="text-2xl font-bold text-brand-dark-blue mb-6">📈 מדרגות מס הכנסה (2025-2026)</h4>
      <p className="text-xl text-gray-700 mb-6 italic">
        בישראל, מס הכנסה הוא פרוגרסיבי: כל חלק מהשכר מחויב לפי מדרגה אחרת. המדרגות כאן עודכנו לפי הטבלה שצירפת:
      </p>
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-right min-w-[780px]">
          <thead className="bg-slate-100 text-slate-800">
            <tr>
              <th className="p-3 text-lg font-bold">שיעור המס</th>
              <th className="p-3 text-lg font-bold">הכנסה חודשית</th>
              <th className="p-3 text-lg font-bold">הכנסה שנתית</th>
            </tr>
          </thead>
          <tbody>
            {INCOME_TAX_BRACKETS.map((bracket) => (
              <tr key={`${bracket.rate}-${bracket.monthlyLabel}`} className="border-t border-gray-200 bg-white">
                <td className="p-3 text-lg font-bold text-brand-dark-blue">{bracket.rateLabel}</td>
                <td className="p-3 text-lg text-gray-800">{bracket.monthlyLabel}</td>
                <td className="p-3 text-lg text-gray-800">{bracket.annualLabel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-gray-600 mt-4 italic">
        * במדרגת 50% הכוונה למס שולי גבוה כולל מס יסף. יש להתייחס לתלוש בפועל ולנתוני נקודות הזיכוי האישיים.
      </p>
    </div>

    <div className="bg-blue-50 border-2 border-blue-300 p-8 rounded-2xl">
      <h4 className="text-2xl font-bold text-blue-700 mb-4">🎁 נקודות זיכוי (צמצום מס)</h4>
      <p className="text-xl text-blue-900 leading-relaxed mb-4">
        נקודות זיכוי מפחיתות ישירות את מס ההכנסה לתשלום. נכון לשנת 2026, כל נקודת זיכוי שווה בדיוק {formatILS(estimatedCreditValue)} בחודש ({formatILS(estimatedCreditValue * 12)} בשנה).
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <div className="bg-white p-4 rounded-lg border-l-4 border-blue-400">
          <span className="font-bold text-blue-700">✓ גבר רווק: 2.25 נק'</span>
          <p className="text-gray-800 mt-1">זכאות בסיס לתושב ישראל</p>
        </div>
        <div className="bg-white p-4 rounded-lg border-l-4 border-blue-400">
          <span className="font-bold text-blue-700">✓ אישה רווקה: 2.75 נק'</span>
          <p className="text-gray-800 mt-1">כולל תוספת 0.5 נק' לנשים</p>
        </div>
      </div>

      <div className="bg-white border border-blue-200 rounded-xl p-5 space-y-4">
        <h5 className="text-xl font-bold text-blue-800">🧠 מחשבון נקודות זיכוי (בסיס + תוספות)</h5>
        <p className="text-base text-blue-900">
          המחשבון הבא נותן אומדן מהיר לפי מצב משפחתי בסיסי. ייתכנו נקודות נוספות עבור ילדים, שירות צבאי/לאומי, לימודים, מוגבלות, הורות יחידנית ועוד.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <label className="block">
            <span className="text-sm font-semibold text-gray-700">פרופיל בסיס:</span>
            <select
              value={creditProfile}
              onChange={(e) => setCreditProfile(e.target.value as CreditProfile)}
              className="mt-2 w-full rounded-lg border-2 border-blue-300 px-3 py-2 text-base font-semibold text-brand-dark-blue focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="single-man">גבר רווק (2.25)</option>
              <option value="single-woman">אישה רווקה (2.75)</option>
              <option value="custom">מותאם אישית (0)</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-gray-700">תוספת ידנית (אם צריך):</span>
            <input
              type="number"
              min={0}
              step={0.25}
              value={extraCreditPoints}
              onChange={(e) => setExtraCreditPoints(Number(e.target.value))}
              className="mt-2 w-full rounded-lg border-2 border-blue-300 px-3 py-2 text-base font-semibold text-brand-dark-blue focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex flex-col justify-center">
            <p className="text-sm text-blue-700">סה"כ נקודות במחשבון</p>
            <p className="text-2xl font-bold text-blue-900">{calculatedCreditPoints.toLocaleString('he-IL')}</p>
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-sm font-semibold text-blue-900">סעיפי זכאות נוספים — סמן/י את הרלוונטי/ים:</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            {CREDIT_BENEFIT_OPTIONS.map((option) => {
              const isChecked = selectedBenefitIds.includes(option.id);
              const count = childCountByBenefitId[option.id] ?? 1;
              const totalPoints = option.perChild ? option.pointsPerUnit * count : option.pointsPerUnit;
              return (
                <div
                  key={option.id}
                  className={`rounded-xl border-2 p-4 transition-colors select-none ${
                    isChecked
                      ? 'bg-blue-100 border-blue-500 shadow-sm'
                      : 'bg-white border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleBenefit(option.id)}
                      className="mt-0.5 h-5 w-5 cursor-pointer accent-blue-600"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="font-bold text-sm text-gray-900">
                          {option.emoji} {option.label}
                        </span>
                        <span
                          className={`text-sm font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap ${
                            isChecked ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          +{totalPoints} נק'
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 leading-snug">{option.sourceNote}</p>
                    </div>
                  </label>

                  {isChecked && option.perChild && (
                    <div className="mt-3 flex items-center gap-3 pr-8">
                      <span className="text-xs font-semibold text-gray-700">מספר ילדים:</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setChildCountByBenefitId((prev) => ({
                              ...prev,
                              [option.id]: Math.max(1, (prev[option.id] ?? 1) - 1),
                            }))
                          }
                          className="w-7 h-7 rounded-full bg-blue-200 text-blue-800 font-bold text-lg leading-none hover:bg-blue-300 transition-colors"
                        >
                          −
                        </button>
                        <span className="text-base font-bold text-blue-900 min-w-[20px] text-center">{count}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setChildCountByBenefitId((prev) => ({
                              ...prev,
                              [option.id]: (prev[option.id] ?? 1) + 1,
                            }))
                          }
                          className="w-7 h-7 rounded-full bg-blue-200 text-blue-800 font-bold text-lg leading-none hover:bg-blue-300 transition-colors"
                        >
                          +
                        </button>
                        <span className="text-xs text-blue-700 font-semibold">
                          = {totalPoints} נק'
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-3 bg-yellow-50 border border-yellow-300 rounded-lg px-4 py-3 text-sm text-yellow-900">
            ⚠️ <span className="font-semibold">שימו לב:</span> קיימים קריטריונים נוספים רבים לקבלת נקודות זיכוי שאינם מופיעים כאן, כגון: הורה יחיד/ה, ילד/בוגר עם מוגבלות, עולה חדש/ה, תואר אקדמי/לימודי מקצוע, תושב יישוב מזכה ועוד. לחישוב מלא ומדויק, השתמשו ב<a href="https://secapp.taxes.gov.il/srsimulatorNZ/#/simulator" target="_blank" rel="noreferrer" className="underline font-bold">סימולטור רשות המסים</a> או בייעוץ מול פקיד השומה.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-700">שווי חודשי מהנקודות</p>
            <p className="text-2xl font-bold text-green-800">{formatILS(monthlyCreditByCalculator, 2, 2)}</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
            <p className="text-sm text-emerald-700">שווי שנתי מהנקודות</p>
            <p className="text-2xl font-bold text-emerald-800">{formatILS(yearlyCreditByCalculator, 2, 2)}</p>
          </div>
        </div>

        <div className="bg-sky-50 border border-sky-200 rounded-lg p-3">
          <p className="text-sm text-sky-700">סיכום חישוב נקודות:</p>
          <p className="text-base text-sky-900 mt-1">
            בסיס: <span className="font-bold">{selectedBaseCreditPoints.toLocaleString('he-IL')}</span>
            {' + '}
            סעיפים נבחרים: <span className="font-bold">{selectedBenefitPoints.toLocaleString('he-IL')}</span>
            {' + '}
            תוספת ידנית: <span className="font-bold">{safeExtraCreditPoints.toLocaleString('he-IL')}</span>
            {' = '}
            סה"כ: <span className="font-bold text-sky-950">{calculatedCreditPoints.toLocaleString('he-IL')} נק'</span>
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCreditPoints(calculatedCreditPoints)}
          className="w-full md:w-auto rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 transition-colors"
        >
          החל את תוצאת המחשבון בסימולטור המס
        </button>
      </div>

      <p className="text-sm text-blue-900 mt-5 leading-relaxed">
        מקורות מידע: כל-זכות (נקודות זיכוי ממס הכנסה) וסימולטור נקודות זיכוי של רשות המסים.
        {' '}
        <a href="https://www.kolzchut.org.il/he/%D7%A0%D7%A7%D7%95%D7%93%D7%95%D7%AA_%D7%96%D7%99%D7%9B%D7%95%D7%99_%D7%9E%D7%9E%D7%A1_%D7%94%D7%9B%D7%A0%D7%A1%D7%94" target="_blank" rel="noreferrer" className="underline font-semibold">
          לכל-זכות
        </a>
        {' · '}
        <a href="https://secapp.taxes.gov.il/srsimulatorNZ/#/simulator" target="_blank" rel="noreferrer" className="underline font-semibold">
          לסימולטור רשות המסים
        </a>
      </p>
      <p className="text-sm text-blue-900 mt-2 leading-relaxed font-semibold">
        💼 טיפ חשוב: ודאו שטופס 101 מעודכן אצל המעסיק כדי שנקודות הזיכוי יופיעו בפועל בתלוש.
      </p>
    </div>

    <div className="bg-yellow-50 border-2 border-yellow-400 p-8 rounded-2xl">
      <h4 className="text-2xl font-bold text-yellow-700 mb-4">🧮 סימולטור מדרגות מס (עם אנימציה)</h4>
      <div className="bg-white p-6 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <label className="block">
            <span className="text-lg font-semibold text-gray-700">הכנס שכר ברוטו חודשי:</span>
            <input
              type="number"
              min={0}
              step={100}
              value={grossSalary}
              onChange={(e) => setGrossSalary(Number(e.target.value))}
              className="mt-2 w-full rounded-lg border-2 border-yellow-300 px-4 py-3 text-xl font-bold text-brand-dark-blue focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </label>
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 flex flex-col justify-center">
            <p className="text-lg text-gray-600">שכר שהוזן:</p>
            <p className="text-3xl font-bold text-brand-dark-blue">{formatILS(safeGrossSalary)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <label className="block">
            <span className="text-lg font-semibold text-gray-700">נקודות זיכוי:</span>
            <input
              type="number"
              min={0}
              step={0.25}
              value={creditPoints}
              onChange={(e) => setCreditPoints(Number(e.target.value))}
              className="mt-2 w-full rounded-lg border-2 border-blue-300 px-4 py-3 text-xl font-bold text-brand-dark-blue focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-600 mt-2">כל נקודה = 242 ₪ בחודש</p>
          </label>
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-4 flex flex-col justify-center">
            <p className="text-lg text-blue-700">שווי זיכוי חודשי:</p>
            <p className="text-3xl font-bold text-blue-800">{formatILS(creditsAmount, 2, 2)}</p>
          </div>
        </div>

        <div className="space-y-3">
          {animatedRows.map((row) => {
            const colors = BRACKET_COLORS[row.index % BRACKET_COLORS.length];
            return (
              <div key={row.index} className={`rounded-lg border-2 ${colors.border} ${colors.bg} p-4`}>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className={`text-base font-bold ${colors.text}`}>
                    מדרגה {row.index + 1}: {row.bracket.monthlyLabel} ({row.bracket.rateLabel})
                  </span>
                  <span className={`text-sm font-semibold ${colors.text}`}>
                    הכנסה במדרגה:{' '}
                    <span className="font-bold text-[1.15rem]">{formatILS(row.animatedTaxable, 2, 2)}</span>
                  </span>
                </div>
                <div className="h-5 bg-white rounded-full overflow-hidden border border-gray-300 shadow-sm">
                  <div
                    className={`h-full bg-gradient-to-r ${colors.progress} transition-all duration-300`}
                    style={{ width: `${row.animatedFillPercent}%` }}
                  />
                </div>
                <div className="flex justify-between items-center mt-2 text-sm">
                  <span className={`font-semibold ${colors.text}`}>מס מהמדרגה:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-red-700 text-[1.15rem] bg-red-100 border border-red-200 rounded-md px-2.5 py-1">
                      -{formatILS(row.animatedTax, 2, 2)}
                    </span>
                    <span
                      className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-300 text-gray-700 font-bold cursor-help hover:bg-gray-400 transition-colors"
                      title={`${formatILS(row.animatedTaxable, 2, 2)} × ${row.bracket.rateLabel} = ${formatILS(row.animatedTax, 2, 2)}`}
                      aria-label="הצגת חישוב המס במדרגה"
                    >
                      i
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="flex justify-between p-3 bg-red-100 rounded border-t-2 border-red-300 mt-4">
            <span className="text-lg font-bold">סה"כ מס (לפני זיכויים):</span>
            <span className="font-bold text-lg text-red-700">-{formatILS(animatedTotalTax, 2, 2)}</span>
          </div>

          <div className="flex justify-between p-3 bg-green-100 rounded font-bold">
            <span className="text-lg">הערכה אחרי {safeCreditPoints.toLocaleString('he-IL')} נק' זיכוי:</span>
            <span className="text-lg text-green-800">~{formatILS(estimatedTaxAfterCredits, 2, 2)}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

// --- Chapter 3: National Insurance & Health ---
// --- National Insurance rates (btl.gov.il, effective 01.01.2025 / 01.02.2025) ---
// Reduced threshold updated to 7,703 ₪ as of 01.01.2026
const NI_REDUCED_THRESHOLD = 7_703;
const NI_MAX_INCOME = 47_465; // approx 2026 ceiling
const EMP_NI_REDUCED    = 0.0104; // 1.04 %
const EMP_HEALTH_REDUCED = 0.0323; // 3.23 %
const EMP_NI_FULL        = 0.07;   // 7 %
const EMP_HEALTH_FULL    = 0.0517; // 5.17 %
const EMPR_NI_REDUCED    = 0.0451; // 4.51 % (employer share – shown for info)
const EMPR_NI_FULL       = 0.076;  // 7.6 %

const calcInsurance = (gross: number) => {
  const income = Math.min(Math.max(0, gross), NI_MAX_INCOME);
  const below = Math.min(income, NI_REDUCED_THRESHOLD);
  const above = Math.max(0, income - NI_REDUCED_THRESHOLD);
  const niEmp      = below * EMP_NI_REDUCED    + above * EMP_NI_FULL;
  const healthEmp  = below * EMP_HEALTH_REDUCED + above * EMP_HEALTH_FULL;
  const niEmployer = below * EMPR_NI_REDUCED    + above * EMPR_NI_FULL;
  return { niEmp, healthEmp, total: niEmp + healthEmp, niEmployer, below, above };
};

// --- Chapter 3: National Insurance & Health ---
const InsuranceChapter: React.FC = () => {
  const [simSalary, setSimSalary] = useState<number>(12_000);
  const safeSalary = Number.isFinite(simSalary) ? Math.max(0, simSalary) : 0;
  const ins = calcInsurance(safeSalary);

  return (
  <div className="space-y-6">

    {/* Header */}
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-brand-teal p-8 rounded-2xl">
      <h3 className="text-4xl font-bold text-brand-teal mb-4">🏥 ביטוח לאומי ודמי בריאות</h3>
      <p className="text-2xl text-gray-800 leading-relaxed">
        שני ניכויי חובה שמגנים עליך — הביטוח הלאומי מבטיח קצבאות ושירותים סוציאליים, ודמי הבריאות מממנים את קופת החולים שלך.
      </p>
    </div>

    {/* What's covered */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-2xl border-2 border-red-400">
        <h4 className="text-2xl font-bold text-red-700 mb-3">🛡️ ביטוח לאומי</h4>
        <ul className="text-lg text-red-900 space-y-1.5">
          <li>💼 קצבת אבטלה — אם תפוטר</li>
          <li>⚠️ פגיעה בעבודה — תאונה בעבודה</li>
          <li>♿ קצבת נכות כללית</li>
          <li>👶 קצבת ילדים — לכל ילד</li>
          <li>🤰 דמי לידה ואבהות</li>
          <li>👴 קצבת אזרח ותיק</li>
        </ul>
      </div>
      <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border-2 border-green-400">
        <h4 className="text-2xl font-bold text-green-700 mb-3">💊 דמי ביטוח בריאות</h4>
        <ul className="text-lg text-green-900 space-y-1.5">
          <li>🏥 ביקורים אצל רופא משפחה/מומחה</li>
          <li>💉 תרופות וחיסונים בהנחה</li>
          <li>🏨 אשפוז בבית חולים ציבורי</li>
          <li>🔬 בדיקות מעבדה ודיאגנוסטיקה</li>
          <li>🚑 שירותי חירום ואמבולנס</li>
        </ul>
        <p className="text-sm text-green-800 mt-3 italic">קופות: כללית, מכבי, מאוחדת, לאומית</p>
      </div>
    </div>

    {/* Official rates table */}
    <div className="bg-white border-2 border-gray-300 p-6 rounded-2xl">
      <h4 className="text-2xl font-bold text-brand-dark-blue mb-2">📋 שיעורים רשמיים לעובד שכיר, גיל 18–פרישה (2025-2026)</h4>
      <p className="text-sm text-gray-500 mb-4">
        מקור:{' '}
        <a href="https://www.btl.gov.il/Insurance/Rates/Pages/%D7%9C%D7%A2%D7%95%D7%91%D7%93%D7%99%D7%9D%20%D7%A9%D7%9B%D7%99%D7%A8%D7%99%D7%9D.aspx" target="_blank" rel="noreferrer" className="underline font-semibold text-blue-700">
          אתר הביטוח הלאומי
        </a>
        {' '}(עודכן 01.01.2025 / 01.02.2025)
      </p>
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-right text-sm">
          <thead>
            <tr className="bg-slate-100 text-slate-800">
              <th className="p-3 font-bold text-base" rowSpan={2}>סוג ניכוי</th>
              <th className="p-3 font-bold text-base text-center" colSpan={2}>שיעור מופחת<br /><span className="font-normal text-xs">(עד 7,703 ₪/חודש)</span></th>
              <th className="p-3 font-bold text-base text-center border-r border-gray-300" colSpan={2}>שיעור מלא<br /><span className="font-normal text-xs">(מעל 7,703 ₪/חודש)</span></th>
            </tr>
            <tr className="bg-slate-50 text-slate-700">
              <th className="p-2 text-center text-xs font-semibold">עובד</th>
              <th className="p-2 text-center text-xs font-semibold">מעסיק</th>
              <th className="p-2 text-center text-xs font-semibold border-r border-gray-300">עובד</th>
              <th className="p-2 text-center text-xs font-semibold">מעסיק</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-gray-200 bg-red-50">
              <td className="p-3 font-bold text-red-800">🛡️ ביטוח לאומי</td>
              <td className="p-3 text-center font-bold text-red-700">1.04%</td>
              <td className="p-3 text-center text-gray-600">4.51%</td>
              <td className="p-3 text-center font-bold text-red-700 border-r border-gray-300">7.00%</td>
              <td className="p-3 text-center text-gray-600">7.60%</td>
            </tr>
            <tr className="border-t border-gray-200 bg-green-50">
              <td className="p-3 font-bold text-green-800">💊 דמי בריאות</td>
              <td className="p-3 text-center font-bold text-green-700">3.23%</td>
              <td className="p-3 text-center text-gray-400">—</td>
              <td className="p-3 text-center font-bold text-green-700 border-r border-gray-300">5.17%</td>
              <td className="p-3 text-center text-gray-400">—</td>
            </tr>
            <tr className="border-t-2 border-gray-400 bg-blue-50 font-bold">
              <td className="p-3 text-blue-900">סה"כ (עובד)</td>
              <td className="p-3 text-center text-blue-800">4.27%</td>
              <td className="p-3 text-center text-gray-500">4.51%</td>
              <td className="p-3 text-center text-blue-800 border-r border-gray-300">12.17%</td>
              <td className="p-3 text-center text-gray-500">7.60%</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-500 mt-3">* הכנסה מרבית לחישוב דמי ביטוח ≈ 47,465 ₪/חודש (מתעדכנת לפי מדד ינואר). מעל תקרה זו לא מנוכה דמי ביטוח נוסף.</p>
    </div>

    {/* Simulator */}
    <div className="bg-yellow-50 border-2 border-yellow-400 p-6 rounded-2xl">
      <h4 className="text-2xl font-bold text-yellow-700 mb-4">🧮 סימולטור ביטוח לאומי ודמי בריאות</h4>
      <div className="bg-white p-5 rounded-xl space-y-5">

        {/* Salary input */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-lg font-semibold text-gray-700">שכר ברוטו חודשי:</span>
            <input
              type="number"
              min={0}
              step={100}
              value={simSalary}
              onChange={(e) => setSimSalary(Number(e.target.value))}
              className="mt-2 w-full rounded-lg border-2 border-yellow-300 px-4 py-3 text-xl font-bold text-brand-dark-blue focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </label>
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 flex flex-col justify-center">
            <p className="text-base text-gray-600">שכר שהוזן:</p>
            <p className="text-3xl font-bold text-brand-dark-blue">{formatILS(safeSalary)}</p>
            {safeSalary > NI_MAX_INCOME && (
              <p className="text-xs text-amber-700 mt-1 font-semibold">⚠️ מעל התקרה — חישוב מוגבל ל-{formatILS(NI_MAX_INCOME)}</p>
            )}
          </div>
        </div>

        {/* Tier explanation */}
        {safeSalary > 0 && (
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 text-sm text-blue-900 space-y-1">
            <p className="font-semibold">📊 פירוט מדרגות על בסיס השכר שהוזנת:</p>
            <p>חלק במדרגה מופחתת (עד 7,703 ₪): <span className="font-bold">{formatILS(ins.below)}</span></p>
            {ins.above > 0 && (
              <p>חלק במדרגה מלאה (מעל 7,703 ₪): <span className="font-bold">{formatILS(ins.above)}</span></p>
            )}
          </div>
        )}

        {/* Results */}
        <div className="space-y-3">
          <div className="rounded-lg border-2 border-red-300 bg-red-50 p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-red-800">🛡️ ביטוח לאומי</p>
                <p className="text-xs text-red-600 mt-0.5">
                  {ins.below > 0 && `${formatILS(ins.below)} × 1.04%`}
                  {ins.above > 0 && ` + ${formatILS(ins.above)} × 7%`}
                </p>
              </div>
              <span className="text-xl font-bold text-red-700 bg-red-100 border border-red-200 rounded-lg px-3 py-1.5">
                -{formatILS(ins.niEmp, 2, 2)}
              </span>
            </div>
            <div className="mt-3 h-4 bg-red-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-400 to-red-600 transition-all duration-500"
                style={{ width: safeSalary > 0 ? `${Math.min(100, (ins.niEmp / (safeSalary * 0.12)) * 100)}%` : '0%' }}
              />
            </div>
          </div>

          <div className="rounded-lg border-2 border-green-300 bg-green-50 p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-green-800">💊 דמי ביטוח בריאות</p>
                <p className="text-xs text-green-600 mt-0.5">
                  {ins.below > 0 && `${formatILS(ins.below)} × 3.23%`}
                  {ins.above > 0 && ` + ${formatILS(ins.above)} × 5.17%`}
                </p>
              </div>
              <span className="text-xl font-bold text-green-700 bg-green-100 border border-green-200 rounded-lg px-3 py-1.5">
                -{formatILS(ins.healthEmp, 2, 2)}
              </span>
            </div>
            <div className="mt-3 h-4 bg-green-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500"
                style={{ width: safeSalary > 0 ? `${Math.min(100, (ins.healthEmp / (safeSalary * 0.12)) * 100)}%` : '0%' }}
              />
            </div>
          </div>

          <div className="rounded-lg border-2 border-orange-400 bg-orange-50 p-4 flex justify-between items-center">
            <span className="text-lg font-bold text-orange-900">סה"כ ניכוי (עובד):</span>
            <span className="text-2xl font-bold text-orange-800">-{formatILS(ins.total, 2, 2)}</span>
          </div>

          <div className="rounded-lg border border-gray-300 bg-gray-50 p-4 flex justify-between items-center">
            <span className="text-base text-gray-700">חלק המעסיק (ביטל"י בלבד — לא מנוכה מהשכר שלך):</span>
            <span className="text-lg font-bold text-gray-600">{formatILS(ins.niEmployer, 2, 2)}</span>
          </div>
        </div>

      </div>
    </div>

    {/* Key facts */}
    <div className="bg-purple-50 border-2 border-purple-300 p-6 rounded-2xl">
      <h4 className="text-2xl font-bold text-purple-700 mb-4">⚡ עובדות חשובות</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[
          { icon: '🇮🇱', title: 'חובה מגיל 18', text: 'כל עובד שכיר בישראל חייב בניכוי החל מגיל 18.' },
          { icon: '💼', title: 'גם המעסיק משלם', text: 'המעסיק משלם 4.51%–7.6% ביטל"י נוסף — לא מנוכה משכרך.' },
          { icon: '📈', title: 'מדרגה מופחתת', text: 'עד 7,703 ₪/חודש (01.01.2026) חל שיעור מופחת נמוך יותר.' },
          { icon: '🔝', title: 'תקרת הכנסה', text: 'מעל ≈47,465 ₪/חודש לא מנוכים דמי ביטוח נוספים.' },
        ].map((f) => (
          <div key={f.title} className="bg-white rounded-lg p-4">
            <p className="font-bold text-purple-700 text-base">{f.icon} {f.title}</p>
            <p className="text-gray-800 text-sm mt-1">{f.text}</p>
          </div>
        ))}
      </div>
    </div>

  </div>
  );
};
// --- Chapter 4: Pension ---
type PensionTrack = 'high' | 'medium' | 'low';

const RETIREMENT_AGE = 67;
const EMPLOYEE_PENSION_RATE = 0.06;
const EMPLOYER_PENSION_RATE = 0.065;
const EMPLOYER_SEVERANCE_RATE = 0.06;
const ANNUITY_FACTOR_ESTIMATE = 200;

const PENSION_TRACKS: Record<PensionTrack, { label: string; annualReturn: number; chipClass: string }> = {
  high: { label: 'סיכון גבוה', annualReturn: 0.07, chipClass: 'bg-red-100 text-red-800 border-red-300' },
  medium: { label: 'סיכון בינוני', annualReturn: 0.05, chipClass: 'bg-amber-100 text-amber-800 border-amber-300' },
  low: { label: 'סיכון נמוך', annualReturn: 0.035, chipClass: 'bg-green-100 text-green-800 border-green-300' },
};

const calculateFutureValueFromMonthlyDeposit = (monthlyDeposit: number, monthlyReturn: number, months: number) => {
  if (months <= 0 || monthlyDeposit <= 0) return 0;
  if (monthlyReturn === 0) return monthlyDeposit * months;
  return monthlyDeposit * ((Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn);
};

const PensionChapter: React.FC = () => {
  const [salary, setSalary] = useState<number>(12000);
  const [age, setAge] = useState<number>(28);
  const [track, setTrack] = useState<PensionTrack>('medium');

  const safeSalary = Number.isFinite(salary) ? Math.max(0, salary) : 0;
  const safeAge = Number.isFinite(age) ? Math.min(90, Math.max(18, age)) : 18;
  const monthsToRetirement = Math.max(0, (RETIREMENT_AGE - safeAge) * 12);

  const employeeMonthlyDeposit = safeSalary * EMPLOYEE_PENSION_RATE;
  const employerMonthlyDeposit = safeSalary * EMPLOYER_PENSION_RATE;
  const employerSeveranceMonthlyDeposit = safeSalary * EMPLOYER_SEVERANCE_RATE;
  const totalMonthlyDeposit = employeeMonthlyDeposit + employerMonthlyDeposit + employerSeveranceMonthlyDeposit;

  const annualReturn = PENSION_TRACKS[track].annualReturn;
  const monthlyReturn = Math.pow(1 + annualReturn, 1 / 12) - 1;
  const projectedAccumulation = calculateFutureValueFromMonthlyDeposit(totalMonthlyDeposit, monthlyReturn, monthsToRetirement);
  const projectedMonthlyPension = projectedAccumulation / ANNUITY_FACTOR_ESTIMATE;

  return (
  <div className="space-y-6">
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-brand-teal p-8 rounded-2xl">
      <h3 className="text-4xl font-bold text-brand-teal mb-4">🏛️ פנסיה וחיסכון לגיל פרישה</h3>
      <p className="text-2xl text-gray-800 leading-relaxed">
        חיסכון חובה שנבנה לאורך השנים. המחשבון למטה נותן הערכה מהירה לצבירה ולקצבה חודשית צפויה לפי השכר, הגיל ומסלול ההשקעה.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4">
        <p className="text-sm text-blue-700">הפרשת עובד</p>
        <p className="text-2xl font-bold text-blue-900">6%</p>
      </div>
      <div className="bg-teal-50 border-2 border-teal-300 rounded-xl p-4">
        <p className="text-sm text-teal-700">תגמולי מעסיק</p>
        <p className="text-2xl font-bold text-teal-900">6.5%</p>
      </div>
      <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-4">
        <p className="text-sm text-purple-700">פיצויי מעסיק</p>
        <p className="text-2xl font-bold text-purple-900">6%</p>
      </div>
    </div>

    <div className="bg-yellow-50 border-2 border-yellow-400 p-6 rounded-2xl">
      <h4 className="text-2xl font-bold text-yellow-700 mb-4">🧮 מחשבון פנסיה</h4>

      <div className="bg-white rounded-xl p-5 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-lg font-semibold text-gray-700">שכר ברוטו חודשי</span>
            <input
              type="number"
              min={0}
              step={100}
              value={salary}
              onChange={(e) => setSalary(Number(e.target.value))}
              className="mt-2 w-full rounded-lg border-2 border-yellow-300 px-4 py-3 text-xl font-bold text-brand-dark-blue focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </label>

          <label className="block">
            <span className="text-lg font-semibold text-gray-700">גיל נוכחי</span>
            <input
              type="number"
              min={18}
              max={90}
              step={1}
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="mt-2 w-full rounded-lg border-2 border-yellow-300 px-4 py-3 text-xl font-bold text-brand-dark-blue focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </label>
        </div>

        <div>
          <p className="text-lg font-semibold text-gray-700 mb-2">מסלול השקעה</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {(Object.entries(PENSION_TRACKS) as [PensionTrack, { label: string; annualReturn: number; chipClass: string }][]).map(([key, value]) => {
              const selected = track === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTrack(key)}
                  className={`rounded-xl border-2 px-4 py-4 text-right transition-all ${selected ? 'border-brand-teal bg-brand-teal/10 shadow-md' : 'border-gray-300 bg-white hover:border-gray-400'}`}
                >
                  <p className="text-lg font-bold text-gray-800">{value.label}</p>
                  <span className={`inline-block mt-2 rounded-full border px-3 py-1 text-sm font-semibold ${value.chipClass}`}>
                    תשואה שנתית משוערת: {(value.annualReturn * 100).toFixed(1)}%
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-blue-900 text-sm space-y-1">
          <p className="font-semibold">משך חיסכון משוער עד פרישה:</p>
          <p>{monthsToRetirement > 0 ? `${Math.floor(monthsToRetirement / 12)} שנים ו-${monthsToRetirement % 12} חודשים` : 'את/ה בגיל פרישה או מעליו - לא חושבה תקופת צבירה נוספת.'}</p>
          <p>גיל פרישה בחישוב זה: {RETIREMENT_AGE}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg border-2 border-gray-200 bg-gray-50 p-4">
            <p className="text-sm text-gray-600">הפקדה חודשית שלך (6%)</p>
            <p className="text-2xl font-bold text-gray-900">{formatILS(employeeMonthlyDeposit, 2, 2)}</p>
          </div>
          <div className="rounded-lg border-2 border-teal-200 bg-teal-50 p-4">
            <p className="text-sm text-teal-700">הפקדה חודשית מעסיק (6.5% + 6%)</p>
            <p className="text-2xl font-bold text-teal-900">{formatILS(employerMonthlyDeposit + employerSeveranceMonthlyDeposit, 2, 2)}</p>
          </div>
          <div className="rounded-lg border-2 border-indigo-300 bg-indigo-50 p-4 md:col-span-2">
            <p className="text-sm text-indigo-700">סה"כ הפקדה חודשית לקרן</p>
            <p className="text-3xl font-bold text-indigo-900">{formatILS(totalMonthlyDeposit, 2, 2)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border-2 border-green-300 bg-green-50 p-5">
            <p className="text-sm text-green-700">סכום מצטבר משוער בגיל פרישה</p>
            <p className="text-3xl font-bold text-green-900 mt-1">{formatILS(projectedAccumulation, 0, 0)}</p>
          </div>
          <div className="rounded-xl border-2 border-orange-300 bg-orange-50 p-5">
            <p className="text-sm text-orange-700">קצבה חודשית צפויה (הערכה)</p>
            <p className="text-3xl font-bold text-orange-900 mt-1">{formatILS(projectedMonthlyPension, 0, 0)}</p>
            <p className="text-xs text-orange-700 mt-2">מבוסס על מקדם קצבה משוער של 200.</p>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-amber-50 border-2 border-amber-300 p-6 rounded-2xl">
      <h4 className="text-2xl font-bold text-amber-700 mb-3">⚠️ חשוב לדעת על החישוב</h4>
      <ul className="text-base text-amber-900 space-y-2">
        <li>החישוב הוא סימולציה בלבד, לא ייעוץ פנסיוני או התחייבות לתשואה.</li>
        <li>ההנחה: השכר החודשי נשאר קבוע עד גיל פרישה.</li>
        <li>ההנחה: שיעורי ההפרשה נשארים זהים לאורך כל התקופה.</li>
        <li>ההנחה: תשואה שנתית קבועה לפי המסלול שנבחר (ללא תנודתיות).</li>
        <li>לא נלקחו בחשבון דמי ניהול, שינויי רגולציה, שינוי מקדם קצבה או תקופות אבטלה/חופשה.</li>
      </ul>
    </div>
  </div>
  );
};

// --- Chapter 5: Summary ---
const SUMMARY_ASSUMED_CREDIT_POINTS = 2.25;
const SUMMARY_CREDIT_POINT_VALUE = 242;

const SummaryChapter: React.FC = () => {
  const [salary, setSalary] = useState<number>(12000);

  const safeSalary = Number.isFinite(salary) ? Math.max(0, salary) : 0;

  const taxBreakdown = useMemo(() => calculateIncomeTaxBreakdown(safeSalary), [safeSalary]);
  const monthlyCredit = SUMMARY_ASSUMED_CREDIT_POINTS * SUMMARY_CREDIT_POINT_VALUE;
  const incomeTaxAfterCredits = Math.max(0, taxBreakdown.totalTaxBeforeCredits - monthlyCredit);

  const insurance = useMemo(() => calcInsurance(safeSalary), [safeSalary]);
  const nationalInsurance = insurance.niEmp;
  const healthInsurance = insurance.healthEmp;

  const monthlyPensionEmployee = safeSalary * EMPLOYEE_PENSION_RATE;
  const totalDeductions = incomeTaxAfterCredits + nationalInsurance + healthInsurance + monthlyPensionEmployee;
  const netSalary = Math.max(0, safeSalary - totalDeductions);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-brand-teal p-8 rounded-2xl">
        <h3 className="text-4xl font-bold text-brand-teal mb-4">✅ סיכום ניכויי שכר</h3>
        <p className="text-2xl text-gray-800 leading-relaxed">
          סימולטור אחד שמרכז את כל מה שלמדנו: מס הכנסה, ביטוח לאומי, דמי בריאות ופנסיה חודשית.
        </p>
      </div>

      <div className="bg-white border-2 border-gray-300 p-6 rounded-2xl">
        <h4 className="text-2xl font-bold text-brand-dark-blue mb-4">🧮 סימולטור נטו חודשי</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <label className="block">
            <span className="text-lg font-semibold text-gray-700">שכר ברוטו חודשי</span>
            <input
              type="number"
              min={0}
              step={100}
              value={salary}
              onChange={(e) => setSalary(Number(e.target.value))}
              className="mt-2 w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-xl font-bold text-brand-dark-blue focus:outline-none focus:ring-2 focus:ring-brand-teal"
            />
          </label>

          <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 flex flex-col justify-center">
            <p className="text-sm text-gray-600">ברוטו שהוזן:</p>
            <p className="text-3xl font-bold text-gray-900">{formatILS(safeSalary)}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between p-3 bg-red-50 border border-red-200 rounded text-lg">
            <span>1. מס הכנסה (אחרי {SUMMARY_ASSUMED_CREDIT_POINTS} נק' זיכוי):</span>
            <span className="font-bold text-red-700">-{formatILS(incomeTaxAfterCredits, 2, 2)}</span>
          </div>

          <div className="flex justify-between p-3 bg-orange-50 border border-orange-200 rounded text-lg">
            <span>2. ביטוח לאומי:</span>
            <span className="font-bold text-orange-700">-{formatILS(nationalInsurance, 2, 2)}</span>
          </div>

          <div className="flex justify-between p-3 bg-green-50 border border-green-200 rounded text-lg">
            <span>3. דמי בריאות:</span>
            <span className="font-bold text-green-700">-{formatILS(healthInsurance, 2, 2)}</span>
          </div>

          <div className="flex justify-between p-3 bg-blue-50 border border-blue-200 rounded text-lg">
            <span>4. פנסיה חודשית (עובד 6%):</span>
            <span className="font-bold text-blue-700">-{formatILS(monthlyPensionEmployee, 2, 2)}</span>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <div className="flex justify-between p-4 bg-red-100 rounded-lg border-2 border-red-300 font-bold text-2xl">
            <span>סה"כ ניכויים מהעובד:</span>
            <span className="text-red-700">-{formatILS(totalDeductions, 2, 2)}</span>
          </div>

          <div className="flex justify-between p-4 bg-blue-100 rounded-lg border-2 border-blue-300 font-bold text-2xl">
            <span>שכר נטו משוער:</span>
            <span className="text-blue-700">{formatILS(netSalary, 2, 2)}</span>
          </div>
        </div>
      </div>

      <div className="bg-purple-50 border-2 border-purple-300 p-6 rounded-2xl">
        <h4 className="text-2xl font-bold text-purple-700 mb-4">📌 מה מעודכן כאן?</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-white rounded-lg p-4">
            <p className="font-bold text-purple-700">מס הכנסה לפי מדרגות</p>
            <p className="text-sm text-gray-800 mt-1">אותו מנגנון חישוב מדרגות כמו בפרק מס הכנסה.</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="font-bold text-purple-700">ביטוח לאומי + בריאות</p>
            <p className="text-sm text-gray-800 mt-1">מדרגה מופחתת עד 7,703 ₪ ומדרגה מלאה מעליה (נתוני BTL).</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="font-bold text-purple-700">פנסיה חודשית</p>
            <p className="text-sm text-gray-800 mt-1">ניכוי עובד: 6% מהשכר החודשי.</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="font-bold text-purple-700">נקודות זיכוי בהדגמה</p>
            <p className="text-sm text-gray-800 mt-1">נלקחה הנחת בסיס: 2.25 נק' × 242 ₪ לנקודה לחודש.</p>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border-2 border-amber-300 p-6 rounded-2xl">
        <h4 className="text-2xl font-bold text-amber-700 mb-3">⚠️ הסתייגות חשובה</h4>
        <ul className="text-base text-amber-900 space-y-2">
          <li>החישוב הוא הערכה חינוכית ואינו מחליף תלוש שכר או ייעוץ מקצועי.</li>
          <li>מס הכנסה מושפע מנקודות זיכוי אישיות (ילדים, שירות, מצב משפחתי ועוד).</li>
          <li>לא נכללו כאן ניכויים/תוספות נוספים כמו קרן השתלמות, נסיעות, שעות נוספות, בונוסים או הטבות מס מיוחדות.</li>
          <li>שיעורי מס ודמי ביטוח עשויים להתעדכן מעת לעת.</li>
        </ul>
      </div>
    </div>
  );
};

// --- Quiz Questions ---
const quizQuestions = [
  {
    question: "מה ההבדל בין שכר ברוטו לשכר נטו?",
    options: [
      "שכר ברוטו לפני הניכויים, נטו אחרי",
      "אין הבדל",
      "שכר נטו לפני הניכויים, ברוטו אחרי",
      "אלה שם משהו כלכלי אחר לגמרי"
    ],
    answer: "שכר ברוטו לפני הניכויים, נטו אחרי"
  },
  {
    question: "אילו מהבאים הוא ניכוי חוקי חובה מהשכר?",
    options: [
      "מס הכנסה",
      "ביטוח לאומי",
      "פנסיה",
      "כל התשובות נכונות"
    ],
    answer: "כל התשובות נכונות"
  },
  {
    question: "מהי מדרגת המס השולית הגבוהה ביותר בטבלה המעודכנת?",
    options: [
      "31%",
      "35%",
      "47%",
      "50%"
    ],
    answer: "50%"
  },
  {
    question: "מה מממן ביטוח לאומי?",
    options: [
      "בדיקות רפואיות בלבד",
      "אבטלה, פגיעה בעבודה, נכות וקצבאות",
      "בנייה של בתי ספר",
      "רק שירות צבא"
    ],
    answer: "אבטלה, פגיעה בעבודה, נכות וקצבאות"
  },
  {
    question: "דמי בריאות מממנים:",
    options: [
      "בדיקות רפואיות ותרופות",
      "בדיקות שיניים",
      "אשפוז",
      "כל התשובות נכונות"
    ],
    answer: "כל התשובות נכונות"
  },
  {
    question: "מה הגיל לפרישה בישראל כיום?",
    options: [
      "60 שנים",
      "65 שנים",
      "67 שנים",
      "70 שנים"
    ],
    answer: "67 שנים"
  },
  {
    question: "כמה בעד מהשכר בערך נוכה לפנסיה?",
    options: [
      "1-2%",
      "3-4%",
      "5-6%",
      "10-11%"
    ],
    answer: "5-6%"
  },
  {
    question: "המעסיק שלך משלם גם הוא לפנסיה שלך?",
    options: [
      "לא, רק אתה משלם",
      "כן, בערך 6-7% נוסף",
      "כן, אבל רק מעסיקים גדולים",
      "לא, זה אסור"
    ],
    answer: "כן, בערך 6-7% נוסף"
  },
];

// --- Main Component ---
const SalaryDeductionsModule: React.FC<SalaryDeductionsModuleProps> = ({ onBack, title, onComplete }) => {
  const [currentChapter, setCurrentChapter] = useState<string>('intro');
  const [score, setScore] = useState<number>(0);
  const [showQuiz, setShowQuiz] = useState<boolean>(false);
  const [quizIndex, setQuizIndex] = useState<number>(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [completedChapters, setCompletedChapters] = useState<Set<string>>(new Set());

  const chapterOrder = ['intro', 'income-tax', 'insurance', 'pension', 'summary'];
  const currentChapterIndex = chapterOrder.indexOf(currentChapter);
  const progressPercentage = ((currentChapterIndex + 1) / chapters.length) * 100;

  const handleChapterClick = (chapterId: string) => {
    setCurrentChapter(chapterId);
    setCompletedChapters(prev => new Set([...prev, chapterId]));
  };

  const handleQuizAnswer = (answer: string) => {
    const question = quizQuestions[quizIndex];
    const isCorrect = answer === question.answer;
    
    if (!selectedAnswers[quizIndex]) {
      setSelectedAnswers(prev => ({ ...prev, [quizIndex]: answer }));
      if (isCorrect) {
        setScore(prev => prev + 1);
      }
      setAnsweredQuestions(prev => new Set([...prev, quizIndex]));
    }
  };

  const handleNextQuestion = () => {
    if (quizIndex < quizQuestions.length - 1) {
      setQuizIndex(prev => prev + 1);
    } else {
      setShowQuiz(false);
      setQuizIndex(0);
      onComplete();
    }
  };

  const currentChapterObj = chapters.find(ch => ch.id === currentChapter);

  return (
    <ModuleView onBack={onBack} title={title}>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
        {!showQuiz ? (
          <div className="max-w-6xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-bold text-gray-700">
                  התקדמות: {currentChapterIndex + 1} מתוך {chapters.length}
                </span>
                <span className="text-lg font-bold text-brand-teal">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
              <div className="w-full bg-gray-300 rounded-full h-4 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-brand-teal to-brand-light-blue h-4 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Chapter Navigation */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2 mb-6">
                {chapters.map((ch) => (
                  <button
                    key={ch.id}
                    onClick={() => handleChapterClick(ch.id)}
                    className={`px-4 py-3 rounded-lg font-bold text-lg transition-all ${
                      currentChapter === ch.id
                        ? 'bg-gradient-to-r from-brand-teal to-brand-light-blue text-white ring-4 ring-brand-teal'
                        : 'bg-white text-gray-800 border-2 border-gray-300 hover:border-brand-teal'
                    }`}
                  >
                    {ch.icon} {ch.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Chapter Content */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              {currentChapter === 'intro' && <IntroductionChapter />}
              {currentChapter === 'income-tax' && <IncomeTaxChapter />}
              {currentChapter === 'insurance' && <InsuranceChapter />}
              {currentChapter === 'pension' && <PensionChapter />}
              {currentChapter === 'summary' && <SummaryChapter />}
            </div>

            {/* Start Quiz Button */}
            {currentChapter === 'summary' && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setShowQuiz(true)}
                  className="px-8 py-4 bg-gradient-to-r from-brand-teal to-brand-light-blue text-white font-bold text-2xl rounded-xl hover:shadow-lg transition-all"
                >
                  🎯 בואו נבחן את הידע שלנו!
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Quiz View */
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-bold text-gray-700">
                    שאלה {quizIndex + 1} מתוך {quizQuestions.length}
                  </span>
                  <span className="text-xl font-bold text-brand-teal">
                    ✓ {score} נקודות
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-brand-teal to-brand-light-blue h-3 rounded-full transition-all"
                    style={{ width: `${((quizIndex + 1) / quizQuestions.length) * 100}%` }}
                  />
                </div>
              </div>

              <h3 className="text-3xl font-bold text-gray-800 mb-8">
                {quizQuestions[quizIndex].question}
              </h3>

              <div className="space-y-3 mb-8">
                {quizQuestions[quizIndex].options.map((option, idx) => {
                  const isSelected = selectedAnswers[quizIndex] === option;
                  const isCorrect = option === quizQuestions[quizIndex].answer;
                  const isAnswered = quizIndex in selectedAnswers;

                  let buttonClasses = 'w-full p-4 text-left text-xl font-bold rounded-lg border-2 transition-all ';
                  
                  if (!isAnswered) {
                    buttonClasses += 'bg-white border-gray-300 hover:border-brand-teal cursor-pointer';
                  } else if (isSelected) {
                    buttonClasses += isCorrect
                      ? 'bg-green-100 border-green-500'
                      : 'bg-red-100 border-red-500';
                  } else if (isCorrect) {
                    buttonClasses += 'bg-green-100 border-green-500';
                  } else {
                    buttonClasses += 'bg-white border-gray-300';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleQuizAnswer(option)}
                      disabled={isAnswered}
                      className={buttonClasses}
                    >
                      <div className="flex justify-between items-center">
                        <span>{option}</span>
                        {isAnswered && isCorrect && <span className="text-2xl">✓</span>}
                        {isAnswered && isSelected && !isCorrect && <span className="text-2xl">✗</span>}
                      </div>
                    </button>
                  );
                })}
              </div>

              {quizIndex in selectedAnswers && (
                <button
                  onClick={handleNextQuestion}
                  className="w-full px-8 py-4 bg-gradient-to-r from-brand-teal to-brand-light-blue text-white font-bold text-2xl rounded-xl hover:shadow-lg transition-all"
                >
                  {quizIndex === quizQuestions.length - 1 ? '🎉 סיימנו!' : 'שאלה הבאה →'}
                </button>
              )}
            </div>

            {/* Final Score */}
            {quizIndex === quizQuestions.length - 1 && quizIndex in selectedAnswers && (
              <div className="mt-8 bg-gradient-to-r from-green-100 to-teal-100 border-2 border-green-500 rounded-2xl p-8 text-center">
                <h3 className="text-4xl font-bold text-green-700 mb-4">🏆 הניקוד הסופי!</h3>
                <p className="text-3xl font-bold text-green-700 mb-2">
                  {score} מתוך {quizQuestions.length}
                </p>
                <p className="text-2xl text-green-700">
                  {((score / quizQuestions.length) * 100).toFixed(0)}%
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </ModuleView>
  );
};

export default SalaryDeductionsModule;
