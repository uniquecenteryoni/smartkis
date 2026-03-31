import React, { useMemo, useState } from 'react';

interface Props {
  onBack: () => void;
}

const currencyFormat = (value: number) =>
  value.toLocaleString('he-IL', { style: 'currency', currency: 'ILS', maximumFractionDigits: 0 });

const CompoundInterestCalculator: React.FC<Props> = ({ onBack }) => {
  const [principal, setPrincipal] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [annualRate, setAnnualRate] = useState(5);
  const [years, setYears] = useState(10);
  const [timesPerYear, setTimesPerYear] = useState(12);

  const { schedule, totalContributions, finalBalance, totalInterest } = useMemo(() => {
    const periods = years * timesPerYear;
    const ratePerPeriod = annualRate / 100 / timesPerYear;
    const rows: Array<{ year: number; balance: number; contributed: number; interest: number }> = [];

    let balance = principal;
    let contributed = principal;
    for (let i = 1; i <= periods; i++) {
      balance *= 1 + ratePerPeriod;
      balance += monthlyContribution;
      contributed += monthlyContribution;
      if (i % timesPerYear === 0) {
        rows.push({
          year: i / timesPerYear,
          balance,
          contributed,
          interest: balance - contributed,
        });
      }
    }

    const finalBalance = rows[rows.length - 1]?.balance ?? principal;
    const totalContributions = principal + monthlyContribution * periods;
    const totalInterest = finalBalance - totalContributions;

    return { schedule: rows, totalContributions, finalBalance, totalInterest };
  }, [annualRate, monthlyContribution, principal, timesPerYear, years]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="text-brand-dark-blue/70">מחשבון</p>
          <h3 className="text-2xl font-bold text-brand-dark-blue">מחשבון ריבית דה-ריבית</h3>
          <p className="text-brand-dark-blue/60">הזינו סכום התחלתי, הפקדה חודשית, ריבית ומספר שנים כדי לראות את אפקט הריבית דריבית.</p>
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
        >
          חזרה לחלון העזרים
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="bg-white/80 rounded-2xl border border-gray-200 p-4 space-y-2">
          <label className="text-sm text-brand-dark-blue/70">סכום התחלתי (₪)</label>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(Math.max(0, Number(e.target.value)))}
            className="w-full rounded-xl border border-gray-300 bg-white p-3 text-lg focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
          />
        </div>
        <div className="bg-white/80 rounded-2xl border border-gray-200 p-4 space-y-2">
          <label className="text-sm text-brand-dark-blue/70">הפקדה חודשית (₪)</label>
          <input
            type="number"
            value={monthlyContribution}
            onChange={(e) => setMonthlyContribution(Number(e.target.value))}
            className="w-full rounded-xl border border-gray-300 bg-white p-3 text-lg focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
          />
        </div>
        <div className="bg-white/80 rounded-2xl border border-gray-200 p-4 space-y-2">
          <label className="text-sm text-brand-dark-blue/70">ריבית שנתית (% בשנה)</label>
          <input
            type="number"
            value={annualRate}
            onChange={(e) => setAnnualRate(Number(e.target.value))}
            className="w-full rounded-xl border border-gray-300 bg-white p-3 text-lg focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
          />
        </div>
        <div className="bg-white/80 rounded-2xl border border-gray-200 p-4 space-y-2">
          <label className="text-sm text-brand-dark-blue/70">שנים</label>
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(Math.max(1, Number(e.target.value)))}
            className="w-full rounded-xl border border-gray-300 bg-white p-3 text-lg focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
          />
          <label className="text-sm text-brand-dark-blue/70 mt-2 block">מספר חישובי ריבית בשנה</label>
          <select
            value={timesPerYear}
            onChange={(e) => setTimesPerYear(Number(e.target.value))}
            className="w-full rounded-xl border border-gray-300 bg-white p-3 text-lg focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
          >
            <option value={1}>שנתי (פקדונות בנקאים)</option>
            <option value={12}>חודשי (קופות גמל, קרנות השתלמות, פנסיה)</option>
            <option value={365}>יומי (מניות למשל)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-green-50 to-emerald-100 p-4">
          <p className="text-sm text-emerald-700 font-semibold">יתרה סופית</p>
          <p className="text-3xl font-black text-emerald-900">{currencyFormat(finalBalance)}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-cyan-100 p-4">
          <p className="text-sm text-blue-700 font-semibold">סה"כ שהופקד</p>
          <p className="text-3xl font-black text-blue-900">{currencyFormat(totalContributions)}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-amber-50 to-orange-100 p-4">
          <p className="text-sm text-amber-700 font-semibold">ריבית שנצברה</p>
          <p className="text-3xl font-black text-amber-900">{currencyFormat(totalInterest)}</p>
        </div>
      </div>

      <div className="bg-white/80 rounded-3xl border border-gray-200 p-4 overflow-auto">
        <table className="min-w-full text-right">
          <thead>
            <tr className="text-brand-dark-blue/70 text-sm">
              <th className="px-3 py-2 font-semibold">שנה</th>
              <th className="px-3 py-2 font-semibold">יתרה בסוף שנה</th>
              <th className="px-3 py-2 font-semibold">סה"כ הפקדות</th>
              <th className="px-3 py-2 font-semibold">ריבית שנצברה</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((row) => (
              <tr key={row.year} className="border-t border-gray-100">
                <td className="px-3 py-2 text-brand-dark-blue font-semibold">{row.year}</td>
                <td className="px-3 py-2 text-brand-dark-blue">{currencyFormat(row.balance)}</td>
                <td className="px-3 py-2 text-brand-dark-blue">{currencyFormat(row.contributed)}</td>
                <td className="px-3 py-2 text-brand-dark-blue">{currencyFormat(row.interest)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompoundInterestCalculator;
