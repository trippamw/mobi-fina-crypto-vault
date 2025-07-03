
interface ExchangeRates {
  [key: string]: number;
}

interface CurrencyAPIResponse {
  success: boolean;
  timestamp: number;
  base: string;
  date: string;
  rates: ExchangeRates;
}

const CURRENCY_API_KEY = 'AIzaSyCS59olq48K-W8PfqKValBHqVPayeapEKA';
const CURRENCY_API_URL = 'https://api.exchangerate-api.com/v4/latest';

// Cache for exchange rates (valid for 1 hour)
let cachedRates: ExchangeRates | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

export const fetchLiveExchangeRates = async (): Promise<ExchangeRates> => {
  // Check if we have valid cached data
  const now = Date.now();
  if (cachedRates && (now - cacheTimestamp) < CACHE_DURATION) {
    return cachedRates;
  }

  try {
    const response = await fetch(`${CURRENCY_API_URL}/USD`);
    
    if (!response.ok) {
      throw new Error(`Exchange rate API error: ${response.status}`);
    }

    const data: CurrencyAPIResponse = await response.json();
    
    if (data.success !== false) {
      // Update cache
      cachedRates = {
        'USD': 1,
        'MWK': data.rates.MWK || 1751,
        'GBP': data.rates.GBP || 0.79,
        'EUR': data.rates.EUR || 0.92,
        'ZAR': data.rates.ZAR || 18.2,
        'BTC': 1 / (data.rates.USD || 1) * 0.000015,
        'ETH': 1 / (data.rates.USD || 1) * 0.00026,
        'USDT': 1,
        'USDC': 1
      };
      cacheTimestamp = now;
      return cachedRates;
    }
  } catch (error) {
    console.error('Failed to fetch live exchange rates:', error);
  }

  // Fallback to static rates if API fails
  return {
    'USD': 1,
    'MWK': 1751,
    'GBP': 0.79,
    'EUR': 0.92,
    'ZAR': 18.2,
    'BTC': 0.000015,
    'ETH': 0.00026,
    'USDT': 1,
    'USDC': 1
  };
};

export const getExchangeRate = async (from: string, to: string): Promise<number> => {
  if (from === to) return 1;
  
  const rates = await fetchLiveExchangeRates();
  
  const fromRate = rates[from] || 1;
  const toRate = rates[to] || 1;
  
  return toRate / fromRate;
};

export const convertCurrency = async (amount: number, from: string, to: string): Promise<number> => {
  const rate = await getExchangeRate(from, to);
  return amount * rate;
};
