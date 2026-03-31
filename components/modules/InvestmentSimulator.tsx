import React, { useMemo, useState } from 'react';

interface Props {
  onBack: () => void;
}

type PortfolioLine = {
  id: string;
  assetId: string;
  weight: number;
};

type Asset = {
  id: string;
  name: string;
  type: 'stock' | 'bond' | 'index';
  baseMonthlyReturn: number; // average monthly
  volatility: number; // monthly std-ish
};

const ASSETS: Asset[] = [
  { id: 'sp500', name: 'מדד S&P 500 (מניות)', type: 'index', baseMonthlyReturn: 0.0065, volatility: 0.045 },
  { id: 'ta125', name: 'ת"א 125 (מניות)', type: 'index', baseMonthlyReturn: 0.0055, volatility: 0.04 },
  { id: 'tech', name: 'סקטור טכנולוגיה', type: 'stock', baseMonthlyReturn: 0.0075, volatility: 0.06 },
  { id: 'govbond', name: 'אג"ח ממשלתי', type: 'bond', baseMonthlyReturn: 0.0022, volatility: 0.01 },
  { id: 'corp', name: 'אג"ח קונצרני', type: 'bond', baseMonthlyReturn: 0.003, volatility: 0.015 },
  { id: 'world', name: 'MSCI World (מדד עולמי)', type: 'index', baseMonthlyReturn: 0.0058, volatility: 0.04 },
];

const currencyFormat = (value: number) =>
  value.toLocaleString('he-IL', { style: 'currency', currency: 'ILS', maximumFractionDigits: 0 });

const percentFormat = (value: number) => `${(value * 100).toFixed(1)}%`;

function monthsBetween(start: Date, end: Date) {
  const months: Array<{ year: number; month: number; label: string; index: number }> = [];
  const s = new Date(start.getFullYear(), start.getMonth(), 1);
  const e = new Date(end.getFullYear(), end.getMonth(), 1);
  let idx = 0;
  while (s <= e) {
    months.push({ year: s.getFullYear(), month: s.getMonth(), label: `${s.getMonth() + 1}/${s.getFullYear()}`, index: idx });
    s.setMonth(s.getMonth() + 1);
    idx += 1;
  }
  return months;
}

function pseudoReturn(asset: Asset, monthIndex: number) {
  // deterministic “random” monthly return around base
  const noise = Math.sin(monthIndex * 1.37 + asset.id.length) * 0.5 + Math.cos(monthIndex * 0.73 + asset.id.length * 0.3) * 0.5;
  const adj = noise * asset.volatility * 0.8;
  return asset.baseMonthlyReturn + adj;
}

const InvestmentSimulator: React.FC<Props> = ({ onBack }) => {
  const [startDate, setStartDate] = useState('2020-01-01');
  const [endDate, setEndDate] = useState('2024-12-31');
  const [startingCapital, setStartingCapital] = useState(50000);
  const [lines, setLines] = useState<PortfolioLine[]>([
    { id: 'l1', assetId: 'sp500', weight: 60 },
    { id: 'l2', assetId: 'govbond', weight: 40 },
  ]);

  const totalWeight = lines.reduce((sum, l) => sum + (Number.isFinite(l.weight) ? l.weight : 0), 0);

  const { timeline, finalValue, totalReturn, annualized } = useMemo(() => {
    const s = new Date(startDate);
    const e = new Date(endDate);
    if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime()) || s > e) {
      return { timeline: [], finalValue: startingCapital, totalReturn: 0, annualized: 0 };
    }

    const months = monthsBetween(s, e);
    let balance = startingCapital;
    const rows: Array<{ label: string; value: number; monthlyReturn: number }> = [];

    months.forEach((m) => {
      const monthlyR = lines.reduce((acc, line) => {
        const asset = ASSETS.find((a) => a.id === line.assetId);
        if (!asset || !Number.isFinite(line.weight) || totalWeight <= 0) return acc;
        const w = line.weight / totalWeight;
        return acc + w * pseudoReturn(asset, m.index);
      }, 0);

      balance *= 1 + monthlyR;
      rows.push({ label: m.label, value: balance, monthlyReturn: monthlyR });
    });

    const totalReturn = balance / startingCapital - 1;
    const years = months.length / 12;
    const annualized = years > 0 ? Math.pow(1 + totalReturn, 1 / years) - 1 : 0;

    return { timeline: rows, finalValue: balance, totalReturn, annualized };
  }, [startDate, endDate, lines, startingCapital, totalWeight]);

  const updateLine = (id: string, changes: Partial<PortfolioLine>) => {
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, ...changes } : l)));
  };

  const addLine = () => {
    const nextId = `l${Date.now()}`;
    setLines((prev) => [...prev, { id: nextId, assetId: ASSETS[0].id, weight: 0 }]);
  };

  const removeLine = (id: string) => {
    setLines((prev) => prev.filter((l) => l.id !== id));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="text-brand-dark-blue/70">סימולטור</p>
          <h3 className="text-2xl font-bold text-brand-dark-blue">סימולטור השקעות (Backtest)</h3>
          <p className="text-brand-dark-blue/60">בנו תיק ממניות/אג"ח/מדדים, בחרו טווח תאריכים בעבר, וקבלו ביצועים מצטברים (נתוני דמה סימולטיביים).</p>
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
          <label className="text-sm text-brand-dark-blue/70">תאריך התחלה</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white p-3 text-lg focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
          />
        </div>
        <div className="bg-white/80 rounded-2xl border border-gray-200 p-4 space-y-2">
          <label className="text-sm text-brand-dark-blue/70">תאריך סיום</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white p-3 text-lg focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
          />
        </div>
        <div className="bg-white/80 rounded-2xl border border-gray-200 p-4 space-y-2">
          <label className="text-sm text-brand-dark-blue/70">סכום פתיחה (₪)</label>
          <input
            type="number"
            value={startingCapital}
            onChange={(e) => setStartingCapital(Math.max(0, Number(e.target.value)))}
            className="w-full rounded-xl border border-gray-300 bg-white p-3 text-lg focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
          />
        </div>
        <div className="bg-white/80 rounded-2xl border border-gray-200 p-4 space-y-2">
          <label className="text-sm text-brand-dark-blue/70">משקל כולל בתיק</label>
          <div className={`text-3xl font-black ${Math.abs(totalWeight - 100) < 0.01 ? 'text-emerald-700' : 'text-red-600'}`}>
            {totalWeight.toFixed(1)}%
          </div>
          <p className="text-sm text-brand-dark-blue/60">כוונו ל-100% עבור תיק מאוזן.</p>
        </div>
      </div>

      <div className="bg-white/80 rounded-3xl border border-gray-200 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-brand-dark-blue font-bold">הרכב התיק</div>
          <button onClick={addLine} className="px-3 py-2 rounded-xl bg-brand-teal text-white font-bold hover:bg-teal-600">+ הוסף נכס</button>
        </div>
        <div className="space-y-2">
          {lines.map((line) => (
            <div key={line.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center bg-white/60 rounded-2xl border border-gray-200 p-3">
              <div className="md:col-span-5">
                <label className="text-xs text-brand-dark-blue/60">נכס</label>
                <select
                  value={line.assetId}
                  onChange={(e) => updateLine(line.id, { assetId: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 bg-white p-3 text-lg focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                >
                  {ASSETS.map((asset) => (
                    <option key={asset.id} value={asset.id}>{asset.name}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-3">
                <label className="text-xs text-brand-dark-blue/60">משקל (%)</label>
                <input
                  type="number"
                  value={line.weight}
                  onChange={(e) => updateLine(line.id, { weight: Number(e.target.value) })}
                  className="w-full rounded-xl border border-gray-300 bg-white p-3 text-lg focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal"
                />
              </div>
              <div className="md:col-span-3 text-sm text-brand-dark-blue/70">
                <div className="font-semibold">אפיון</div>
                <div>{ASSETS.find((a) => a.id === line.assetId)?.type === 'bond' ? 'אג"ח' : ASSETS.find((a) => a.id === line.assetId)?.type === 'index' ? 'מדד' : 'מניות'}</div>
              </div>
              <div className="md:col-span-1 flex justify-end">
                <button
                  onClick={() => removeLine(line.id)}
                  className="text-sm px-3 py-2 rounded-xl bg-red-100 text-red-700 font-bold hover:bg-red-200"
                >
                  הסר
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-green-50 to-emerald-100 p-4">
          <p className="text-sm text-emerald-700 font-semibold">שווי סופי</p>
          <p className="text-3xl font-black text-emerald-900">{currencyFormat(finalValue)}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-cyan-100 p-4">
          <p className="text-sm text-blue-700 font-semibold">תשואה מצטברת</p>
          <p className={`text-3xl font-black ${totalReturn >= 0 ? 'text-blue-900' : 'text-red-700'}`}>{percentFormat(totalReturn)}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-amber-50 to-orange-100 p-4">
          <p className="text-sm text-amber-700 font-semibold">תשואה שנתית ממוצעת</p>
          <p className={`text-3xl font-black ${annualized >= 0 ? 'text-amber-900' : 'text-red-700'}`}>{percentFormat(annualized)}</p>
        </div>
      </div>

      <div className="bg-white/80 rounded-3xl border border-gray-200 p-4 overflow-auto">
        <table className="min-w-full text-right">
          <thead>
            <tr className="text-brand-dark-blue/70 text-sm">
              <th className="px-3 py-2 font-semibold">חודש</th>
              <th className="px-3 py-2 font-semibold">שווי תיק</th>
              <th className="px-3 py-2 font-semibold">תשואה חודשית</th>
            </tr>
          </thead>
          <tbody>
            {timeline.map((row) => (
              <tr key={row.label} className="border-t border-gray-100">
                <td className="px-3 py-2 text-brand-dark-blue font-semibold">{row.label}</td>
                <td className="px-3 py-2 text-brand-dark-blue">{currencyFormat(row.value)}</td>
                <td className="px-3 py-2 text-brand-dark-blue">{percentFormat(row.monthlyReturn)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvestmentSimulator;
