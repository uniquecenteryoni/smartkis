import React, { useEffect, useMemo, useState } from 'react';

type CreditProfile = 'single-man' | 'single-woman' | 'custom';

type CreditBenefitOption = {
  id: string;
  label: string;
  emoji: string;
  sourceNote: string;
  pointsPerUnit: number;
  perChild?: boolean;
};

const CREDIT_PROFILE_BASE_POINTS: Record<CreditProfile, number> = {
  'single-man': 2.25,
  'single-woman': 2.75,
  'custom': 0,
};

interface TaxBracket {
  rate: number;
  cap: number | null;
  monthlyLabel: string;
  annualLabel: string;
  rateLabel: string;
}

const BRACKET_COLORS = [
  { bg: 'bg-cyan-50', border: 'border-cyan-400', progress: 'from-cyan-400 to-cyan-500', text: 'text-cyan-700' },
  { bg: 'bg-blue-50', border: 'border-blue-400', progress: 'from-blue-400 to-blue-500', text: 'text-blue-700' },
  { bg: 'bg-purple-50', border: 'border-purple-400', progress: 'from-purple-400 to-purple-500', text: 'text-purple-700' },
  { bg: 'bg-pink-50', border: 'border-pink-400', progress: 'from-pink-400 to-pink-500', text: 'text-pink-700' },
  { bg: 'bg-orange-50', border: 'border-orange-400', progress: 'from-orange-400 to-orange-500', text: 'text-orange-700' },
  { bg: 'bg-amber-50', border: 'border-amber-400', progress: 'from-amber-400 to-amber-500', text: 'text-amber-700' },
  { bg: 'bg-red-50', border: 'border-red-400', progress: 'from-red-400 to-red-500', text: 'text-red-700' },
];

const INCOME_TAX_BRACKETS: TaxBracket[] = [
  { rate: 0.10, cap: 7010, monthlyLabel: 'עד 7,010 ₪', annualLabel: 'עד 84,120 ₪', rateLabel: '10%' },
  { rate: 0.14, cap: 10060, monthlyLabel: '7,011 - 10,060 ₪', annualLabel: '84,121 - 120,720 ₪', rateLabel: '14%' },
  { rate: 0.20, cap: 16150, monthlyLabel: '10,061 - 16,150 ₪', annualLabel: '120,721 - 193,800 ₪', rateLabel: '20%' },
  { rate: 0.31, cap: 22440, monthlyLabel: '16,151 - 22,440 ₪', annualLabel: '193,801 - 269,280 ₪', rateLabel: '31%' },
  { rate: 0.35, cap: 46690, monthlyLabel: '22,441 - 46,690 ₪', annualLabel: '269,281 - 560,280 ₪', rateLabel: '35%' },
  { rate: 0.47, cap: 60130, monthlyLabel: '46,691 - 60,130 ₪', annualLabel: '560,281 - 721,560 ₪', rateLabel: '47%' },
  { rate: 0.50, cap: null, monthlyLabel: '60,131 ₪ ומעלה', annualLabel: '721,561 ₪ ומעלה', rateLabel: '*50%' },
];

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
      : taxableInBracket > 0 ? 100 : 0;

    const row = { index, taxableInBracket, taxInBracket, fillPercent, bracket };
    if (bracket.cap) previousCap = bracket.cap;
    return row;
  });

  const totalTaxBeforeCredits = rows.reduce((sum, row) => sum + row.taxInBracket, 0);
  return { rows, totalTaxBeforeCredits };
};

interface ProgressiveTaxSimulatorProps {
  onBack: () => void;
}

const ProgressiveTaxSimulator: React.FC<ProgressiveTaxSimulatorProps> = ({ onBack }) => {
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
      if (progress < 1) rafId = requestAnimationFrame(step);
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
      return { ...row, animatedTaxable, animatedTax, animatedFillPercent: row.fillPercent * stageProgress };
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-full bg-gray-300 text-gray-800 font-bold hover:bg-gray-400 transition"
          >
            ← חזרה לעזרים ונספחים
          </button>
        </div>

        <div className="space-y-6">
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
                        className={`rounded-xl border-2 p-4 transition-colors ${
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
              </div>

              <div className="mt-3 bg-yellow-50 border border-yellow-300 rounded-lg px-4 py-3 text-sm text-yellow-900">
                ⚠️ <span className="font-semibold">שימו לב:</span> קיימים קריטריונים נוספים רבים לקבלת נקודות זיכוי שאינם מופיעים כאן, כגון: הורה יחיד/ה, ילד/בוגר עם מוגבלות, עולה חדש/ה, תואר אקדמי/לימודי מקצוע, תושב יישוב מזכה ועוד. לחישוב מלא ומדויק, השתמשו ב<a href="https://secapp.taxes.gov.il/srsimulatorNZ/#/simulator" target="_blank" rel="noreferrer" className="underline font-bold">סימולטור רשות המסים</a> או בייעוץ מול פקיד השומה.
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-700">שווי חודשי מהנקודות</p>
                <p className="text-2xl font-bold text-green-800">{formatILS(monthlyCreditByCalculator, 2, 2)}</p>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                <p className="text-sm text-emerald-700">שווי שנתי מהנקודות</p>
                <p className="text-2xl font-bold text-emerald-800">{formatILS(yearlyCreditByCalculator, 2, 2)}</p>
              </div>
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

              <div className="mt-5 p-4 bg-blue-50 rounded-lg border border-blue-200 text-sm text-blue-900 leading-relaxed">
                💡 הדגמה זו היא חינוכית ומבוססת על מדרגות מס נפוצות והערכת ערך נקודת זיכוי. החישוב בפועל בתלוש מושפע מפרטים אישיים נוספים.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressiveTaxSimulator;
