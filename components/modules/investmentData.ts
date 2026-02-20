// This file contains hardcoded historical stock data for the investment simulator.
// The data is plausible but not real-time or guaranteed to be accurate. It's for educational purposes only.

export type StockData = {
  [key: string]: { date: string; price: number }[];
};

function generateStockData(
    startDate: string, 
    endDate: string, 
    startPrice: number, 
    volatility: number, 
    trend: number
): { date: string; price: number }[] {
  const data = [];
  let currentDate = new Date(startDate);
  const finalDate = new Date(endDate);
  let currentPrice = startPrice;

  while (currentDate <= finalDate) {
    const day = currentDate.getDay();
    // Only generate data for weekdays
    if (day !== 0 && day !== 6) {
        data.push({
            date: currentDate.toISOString().split('T')[0],
            price: parseFloat(currentPrice.toFixed(2))
        });
    }

    const changePercent = 2 * volatility * Math.random();
    let changeAmount = currentPrice * changePercent;
    if (Math.random() > 0.5) {
      changeAmount *= -1;
    }
    
    currentPrice += changeAmount;
    currentPrice += trend; // Apply a small daily trend

    // Ensure price doesn't go below a certain threshold to avoid negative values
    if (currentPrice < startPrice / 5) {
        currentPrice = startPrice / 5;
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }
  return data;
}

const stockConfigs = {
    AAPL: { start: 172, volatility: 0.019, trend: 0.08 },
    GOOGL: { start: 145, volatility: 0.020, trend: 0.07 },
    MSFT: { start: 300, volatility: 0.017, trend: 0.16 },
    AMZN: { start: 165, volatility: 0.028, trend: 0.05 },
    NFLX: { start: 520, volatility: 0.038, trend: 0.1 },
    TSLA: { start: 260, volatility: 0.050, trend: -0.02 },
    NKE: { start: 160, volatility: 0.024, trend: -0.03 },
    SBUX: { start: 105, volatility: 0.021, trend: -0.01 },
    DIS: { start: 115, volatility: 0.030, trend: -0.04 },
    MCD: { start: 260, volatility: 0.014, trend: 0.04 },
};

const startDate = '2022-01-01';
const endDate = '2024-07-01';

const generatedStockData: StockData = {};
for (const [symbol, params] of Object.entries(stockConfigs)) {
    generatedStockData[symbol] = generateStockData(startDate, endDate, params.start, params.volatility, params.trend);
}

export const stockData: StockData = generatedStockData;