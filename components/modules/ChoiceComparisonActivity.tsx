import React, { useMemo, useState } from 'react';

type StrategyId = 'high-risk' | 'low-risk' | 'no-invest' | 'failed' | 'index' | 'custom';

type Scenario = {
  id: number;
  title: string;
  strategy: StrategyId;
  initialAmount: number;
  monthlyDeposit: number;
  annualReturn: number;
  years: number;
};

interface ChoiceComparisonActivityProps {
  onBack: () => void;
}

const STRATEGIES: Record<StrategyId, { label: string; annualReturn: number; hint: string }> = {
  'high-risk': { label: 'השקעה בסיכון גבוה', annualReturn: 12, hint: 'פוטנציאל גבוה, תנודתיות גבוהה.' },
  'low-risk': { label: 'השקעה בסיכון נמוך', annualReturn: 5, hint: 'תשואה מתונה עם יציבות יחסית.' },
  'no-invest': { label: 'אי השקעה', annualReturn: 0, hint: 'הכסף לא עובד עבורך.' },
  failed: { label: 'השקעה כושלת', annualReturn: -8, hint: 'תרחיש הפסדי ללמידת סיכון.' },
  index: { label: 'השקעת מדד', annualReturn: 8, hint: 'פיזור רחב לאורך זמן.' },
  custom: { label: 'מותאם אישית', annualReturn: 0, hint: 'הזינו תשואה בעצמכם.' },
};

const STRATEGY_STYLES: Record<StrategyId, { card: string; pill: string; glow: string }> = {
  'high-risk': { card: 'from-rose-50 to-orange-50 border-rose-200', pill: 'bg-rose-100 text-rose-700', glow: 'shadow-rose-100' },
  'low-risk': { card: 'from-emerald-50 to-teal-50 border-emerald-200', pill: 'bg-emerald-100 text-emerald-700', glow: 'shadow-emerald-100' },
  'no-invest': { card: 'from-slate-50 to-gray-100 border-slate-200', pill: 'bg-slate-200 text-slate-700', glow: 'shadow-slate-100' },
  failed: { card: 'from-red-50 to-pink-50 border-red-200', pill: 'bg-red-100 text-red-700', glow: 'shadow-red-100' },
  index: { card: 'from-sky-50 to-blue-50 border-sky-200', pill: 'bg-sky-100 text-sky-700', glow: 'shadow-sky-100' },
  custom: { card: 'from-violet-50 to-fuchsia-50 border-violet-200', pill: 'bg-violet-100 text-violet-700', glow: 'shadow-violet-100' },
};

const DEFAULT_SCENARIOS: Scenario[] = [
  { id: 1, title: 'בחירה 1', strategy: 'high-risk', initialAmount: 50000, monthlyDeposit: 500, annualReturn: 12, years: 5 },
  { id: 2, title: 'בחירה 2', strategy: 'low-risk', initialAmount: 50000, monthlyDeposit: 500, annualReturn: 5, years: 5 },
  { id: 3, title: 'בחירה 3', strategy: 'no-invest', initialAmount: 50000, monthlyDeposit: 500, annualReturn: 0, years: 5 },
  { id: 4, title: 'בחירה 4', strategy: 'failed', initialAmount: 50000, monthlyDeposit: 500, annualReturn: -8, years: 5 },
  { id: 5, title: 'בחירה 5', strategy: 'index', initialAmount: 50000, monthlyDeposit: 500, annualReturn: 8, years: 5 },
  { id: 6, title: 'בחירה 6', strategy: 'custom', initialAmount: 50000, monthlyDeposit: 500, annualReturn: 10, years: 5 },
];

const toCurrency = (value: number) =>
  value.toLocaleString('he-IL', { style: 'currency', currency: 'ILS', maximumFractionDigits: 0 });

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const calculateFinalAmount = (scenario: Scenario) => {
  const months = Math.max(0, Math.round(scenario.years * 12));
  const monthlyRate = scenario.annualReturn / 100 / 12;
  let balance = Math.max(0, scenario.initialAmount);

  for (let i = 0; i < months; i += 1) {
    balance += Math.max(0, scenario.monthlyDeposit);
    balance *= 1 + monthlyRate;
    if (!Number.isFinite(balance)) return 0;
  }

  return Math.max(0, balance);
};

const ChoiceComparisonActivity: React.FC<ChoiceComparisonActivityProps> = ({ onBack }) => {
  const [scenarios, setScenarios] = useState<Scenario[]>(DEFAULT_SCENARIOS);

  const updateScenario = (id: number, updater: (prev: Scenario) => Scenario) => {
    setScenarios((prev) => prev.map((scenario) => (scenario.id === id ? updater(scenario) : scenario)));
  };

  const results = useMemo(() => {
    return scenarios.map((scenario) => {
      const finalAmount = calculateFinalAmount(scenario);
      const invested = Math.max(0, scenario.initialAmount) + Math.max(0, scenario.monthlyDeposit) * scenario.years * 12;
      const profit = finalAmount - invested;
      return {
        ...scenario,
        invested,
        finalAmount,
        profit,
      };
    });
  }, [scenarios]);

  const sortedResults = useMemo(
    () => [...results].sort((a, b) => b.finalAmount - a.finalAmount),
    [results],
  );

  const best = sortedResults[0];
  const worst = sortedResults[sortedResults.length - 1];

  return (
    <div className="bg-gradient-to-br from-white/95 via-cyan-50/60 to-sky-50/70 rounded-3xl border border-white/80 shadow-2xl p-5 space-y-5" dir="rtl">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="text-brand-dark-blue/70">פעילות השוואה</p>
          <h3 className="text-2xl font-bold text-brand-dark-blue">השוואת בחירות</h3>
          <p className="text-brand-dark-blue/60">השוו 6 תרחישי חיסכון והשקעה, ערכו שמות לכל תיבה ונתונים, וקבלו טבלת סיכום.</p>
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
        >
          חזרה
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {scenarios.map((scenario) => {
          const strategyMeta = STRATEGIES[scenario.strategy];
          const finalAmount = calculateFinalAmount(scenario);
          return (
            <div key={scenario.id} className={`rounded-2xl border bg-gradient-to-br p-4 space-y-3 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl ${STRATEGY_STYLES[scenario.strategy].card} ${STRATEGY_STYLES[scenario.strategy].glow}`}>
              <input
                type="text"
                value={scenario.title}
                onChange={(e) => updateScenario(scenario.id, (prev) => ({ ...prev, title: e.target.value }))}
                className="w-full rounded-xl border border-white bg-white/90 shadow-sm px-3 py-2 font-bold text-brand-dark-blue focus:outline-none focus:ring-2 focus:ring-brand-teal/40"
                placeholder={`שם בחירה ${scenario.id}`}
              />

              <div>
                <div className="flex items-center justify-between gap-2">
                  <label className="text-sm font-bold text-brand-dark-blue/80">אסטרטגיה</label>
                  <span className={`text-xs font-black px-2 py-1 rounded-full ${STRATEGY_STYLES[scenario.strategy].pill}`}>{strategyMeta.label}</span>
                </div>
                <select
                  value={scenario.strategy}
                  onChange={(e) => {
                    const nextStrategy = e.target.value as StrategyId;
                    updateScenario(scenario.id, (prev) => ({
                      ...prev,
                      strategy: nextStrategy,
                      annualReturn:
                        nextStrategy === 'custom' ? prev.annualReturn : STRATEGIES[nextStrategy].annualReturn,
                    }));
                  }}
                  className="w-full mt-1 rounded-xl border border-white bg-white/90 shadow-sm px-3 py-2"
                >
                  {Object.entries(STRATEGIES).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-brand-dark-blue/60 mt-1">{strategyMeta.hint}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-brand-dark-blue/80">סכום התחלתי</label>
                  <input
                    type="number"
                    min={0}
                    value={scenario.initialAmount}
                    onChange={(e) =>
                      updateScenario(scenario.id, (prev) => ({
                        ...prev,
                        initialAmount: clamp(Number(e.target.value) || 0, 0, 100000000),
                      }))
                    }
                    className="w-full mt-1 rounded-lg border border-white bg-white/90 shadow-sm px-2 py-1.5"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-brand-dark-blue/80">הפקדה חודשית</label>
                  <input
                    type="number"
                    min={0}
                    value={scenario.monthlyDeposit}
                    onChange={(e) =>
                      updateScenario(scenario.id, (prev) => ({
                        ...prev,
                        monthlyDeposit: clamp(Number(e.target.value) || 0, 0, 1000000),
                      }))
                    }
                    className="w-full mt-1 rounded-lg border border-white bg-white/90 shadow-sm px-2 py-1.5"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-brand-dark-blue/80">תשואה שנתית (%)</label>
                  <input
                    type="number"
                    min={-99}
                    max={80}
                    value={scenario.annualReturn}
                    onChange={(e) =>
                      updateScenario(scenario.id, (prev) => ({
                        ...prev,
                        annualReturn: clamp(Number(e.target.value) || 0, -99, 80),
                        strategy: prev.strategy === 'custom' ? 'custom' : prev.strategy,
                      }))
                    }
                    className="w-full mt-1 rounded-lg border border-white bg-white/90 shadow-sm px-2 py-1.5"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-brand-dark-blue/80">מספר שנים</label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={scenario.years}
                    onChange={(e) =>
                      updateScenario(scenario.id, (prev) => ({
                        ...prev,
                        years: clamp(Number(e.target.value) || 1, 1, 50),
                      }))
                    }
                    className="w-full mt-1 rounded-lg border border-white bg-white/90 shadow-sm px-2 py-1.5"
                  />
                </div>
              </div>

              <div className="rounded-xl bg-white/95 border border-cyan-200 p-3 text-center shadow-inner">
                <p className="text-xs text-brand-dark-blue/60">שווי עתידי משוער</p>
                <p className="text-2xl font-black text-brand-teal">{toCurrency(finalAmount)}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/95 shadow-lg p-4 space-y-3">
        <h4 className="text-xl font-black text-brand-dark-blue">טבלת סיכום נתונים</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-right border-b border-slate-200 text-brand-dark-blue/70 bg-slate-50">
                <th className="py-2 px-3">שם בחירה</th>
                <th className="py-2 px-3">אסטרטגיה</th>
                <th className="py-2 px-3">תשואה שנתית</th>
                <th className="py-2 px-3">הון שהופקד</th>
                <th className="py-2 px-3">שווי סופי</th>
                <th className="py-2 px-3">רווח/הפסד</th>
              </tr>
            </thead>
            <tbody>
              {sortedResults.map((row, index) => (
                <tr key={row.id} className={`border-b border-slate-100 ${index === 0 ? 'bg-emerald-50/60' : ''}`}>
                  <td className="py-2 px-3 font-bold">{row.title || `בחירה ${row.id}`}</td>
                  <td className="py-2 px-3">{STRATEGIES[row.strategy].label}</td>
                  <td className="py-2 px-3">{row.annualReturn}%</td>
                  <td className="py-2 px-3">{toCurrency(row.invested)}</td>
                  <td className="py-2 px-3 font-bold text-brand-teal">{toCurrency(row.finalAmount)}</td>
                  <td className={`py-2 px-3 font-bold ${row.profit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {toCurrency(row.profit)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {best && worst && (
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-sm text-brand-dark-blue/80">
            <p>
              הבחירה המובילה כרגע: <strong>{best.title || `בחירה ${best.id}`}</strong> עם {toCurrency(best.finalAmount)}.
            </p>
            <p>
              פער מול הבחירה החלשה ביותר: <strong>{toCurrency(best.finalAmount - worst.finalAmount)}</strong>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChoiceComparisonActivity;
