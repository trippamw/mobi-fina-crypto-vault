
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpDown, TrendingUp, TrendingDown, ArrowLeft, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ExchangeSectionProps {
  onBalanceUpdate?: (currency: string, amount: number) => void;
  onTransactionUpdate?: (transaction: any) => void;
  onBack?: () => void;
}

export const ExchangeSection: React.FC<ExchangeSectionProps> = ({ onBalanceUpdate, onTransactionUpdate, onBack }) => {
  const [fromCurrency, setFromCurrency] = useState('');
  const [toCurrency, setToCurrency] = useState('');
  const [amount, setAmount] = useState('');
  const [exchangeRate, setExchangeRate] = useState(0);
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [recentExchanges, setRecentExchanges] = useState([
    { id: 1, from: 'USD', to: 'MWK', amount: '100', converted: '103,000', rate: '1,030', date: '2024-01-15', status: 'Completed' },
    { id: 2, from: 'MWK', to: 'USD', amount: '206,000', converted: '200', rate: '0.00097', date: '2024-01-14', status: 'Completed' },
    { id: 3, from: 'GBP', to: 'MWK', amount: '50', converted: '64,500', rate: '1,290', date: '2024-01-13', status: 'Completed' }
  ]);

  const [currencies, setCurrencies] = useState([
    { code: 'MWK', name: 'Malawian Kwacha', rate: 1, flag: '🇲🇼', change: '+0.2%' },
    { code: 'USD', name: 'US Dollar', rate: 0.00097, flag: '🇺🇸', change: '+1.5%' },
    { code: 'GBP', name: 'British Pound', rate: 0.00078, flag: '🇬🇧', change: '+2.1%' },
    { code: 'EUR', name: 'Euro', rate: 0.00092, flag: '🇪🇺', change: '-0.8%' },
    { code: 'ZAR', name: 'South African Rand', rate: 0.018, flag: '🇿🇦', change: '+0.5%' },
    { code: 'BTC', name: 'Bitcoin', rate: 0.000000034, flag: '₿', change: '+3.2%' },
    { code: 'ETH', name: 'Ethereum', rate: 0.00000041, flag: 'Ξ', change: '+2.8%' }
  ]);

  // Fetch live exchange rates (simulated)
  const fetchExchangeRates = async () => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Real exchange rates as of July 3, 2025 (simulated realistic rates)
      const updatedCurrencies = [
        { code: 'MWK', name: 'Malawian Kwacha', rate: 1, flag: '🇲🇼', change: '+0.1%' },
        { code: 'USD', name: 'US Dollar', rate: 0.00096, flag: '🇺🇸', change: '+1.2%' },
        { code: 'GBP', name: 'British Pound', rate: 0.00076, flag: '🇬🇧', change: '+1.8%' },
        { code: 'EUR', name: 'Euro', rate: 0.00089, flag: '🇪🇺', change: '-0.5%' },
        { code: 'ZAR', name: 'South African Rand', rate: 0.0175, flag: '🇿🇦', change: '+0.3%' },
        { code: 'BTC', name: 'Bitcoin', rate: 0.000000032, flag: '₿', change: '+4.5%' },
        { code: 'ETH', name: 'Ethereum', rate: 0.00000038, flag: 'Ξ', change: '+3.1%' }
      ];
      
      setCurrencies(updatedCurrencies);
      setLastUpdated(new Date());
      
      // Recalculate if exchange is already set up
      if (fromCurrency && toCurrency && amount) {
        calculateExchange(updatedCurrencies);
      }
    } catch (error) {
      console.error('Failed to fetch exchange rates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load rates on component mount
  useEffect(() => {
    fetchExchangeRates();
  }, []);

  const handleCurrencyChange = (type: 'from' | 'to', value: string) => {
    if (type === 'from') {
      setFromCurrency(value);
    } else {
      setToCurrency(value);
    }

    if ((type === 'from' ? value : fromCurrency) && (type === 'to' ? value : toCurrency) && amount) {
      setTimeout(() => calculateExchange(), 100);
    }
  };

  const calculateExchange = (currencyData = currencies) => {
    if (!fromCurrency || !toCurrency || !amount) return;

    const fromRate = currencyData.find(c => c.code === fromCurrency)?.rate || 1;
    const toRate = currencyData.find(c => c.code === toCurrency)?.rate || 1;
    
    const rate = toRate / fromRate;
    const converted = parseFloat(amount) * rate;
    
    setExchangeRate(rate);
    setConvertedAmount(converted);
  };

  const handleExchange = () => {
    if (!fromCurrency || !toCurrency || !amount || !convertedAmount) {
      alert('Please fill in all fields');
      return;
    }

    const fee = parseFloat(amount) * 0.005; // 0.5% fee
    const netAmount = parseFloat(amount) + fee;

    // Add to recent exchanges
    const newExchange = {
      id: Date.now(),
      from: fromCurrency,
      to: toCurrency,
      amount: amount,
      converted: convertedAmount.toFixed(2),
      rate: exchangeRate.toFixed(6),
      date: new Date().toISOString().split('T')[0],
      status: 'Completed'
    };

    setRecentExchanges(prev => [newExchange, ...prev.slice(0, 4)]);

    // Update balances
    if (onBalanceUpdate) {
      onBalanceUpdate(fromCurrency, -netAmount);
      onBalanceUpdate(toCurrency, convertedAmount);
    }

    // Add to transaction history
    if (onTransactionUpdate) {
      onTransactionUpdate({
        type: 'Exchange',
        amount: `${amount} ${fromCurrency} → ${convertedAmount.toFixed(2)} ${toCurrency}`,
        description: `Currency exchange from ${fromCurrency} to ${toCurrency}`,
        time: 'Just now',
        status: 'completed'
      });
    }

    // Reset form
    setFromCurrency('');
    setToCurrency('');
    setAmount('');
    setExchangeRate(0);
    setConvertedAmount(0);

    alert(`Exchange successful! ${fee.toFixed(2)} ${fromCurrency} fee applied.`);
  };

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    calculateExchange();
  };

  useEffect(() => {
    if (fromCurrency && toCurrency && amount) {
      calculateExchange();
    }
  }, [fromCurrency, toCurrency, amount]);

  return (
    <div className="space-y-6 pb-24">
      {/* Header with Back Button */}
      {onBack && (
        <div className="flex items-center space-x-3">
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-2xl font-bold text-white">Currency Exchange</h2>
        </div>
      )}

      {/* Exchange Rates */}
      <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Live Exchange Rates</CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              onClick={fetchExchangeRates}
              disabled={isLoading}
              size="sm"
              variant="outline"
              className="text-white border-gray-600"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <span className="text-xs text-gray-400">
              Updated: {lastUpdated.toLocaleTimeString()}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {currencies.slice(1).map((currency) => (
              <div key={currency.code} className="bg-gray-800/60 p-3 rounded-lg border border-gray-600/50">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-lg">{currency.flag}</span>
                  <span className="font-medium text-white">{currency.code}</span>
                </div>
                <p className="text-sm text-white/60">1 {currency.code} = {(1/currency.rate).toLocaleString()} MWK</p>
                <Badge className={`mt-1 ${currency.change.startsWith('+') ? 'bg-green-500/20 text-green-300 border-green-400/30' : 'bg-red-500/20 text-red-300 border-red-400/30'} text-xs`}>
                  {currency.change.startsWith('+') ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                  {currency.change}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Exchange Form */}
      <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white">Currency Exchange</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-5 gap-4 items-end">
            {/* From Currency */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-white mb-2">From</label>
              <Select value={fromCurrency} onValueChange={(value) => handleCurrencyChange('from', value)}>
                <SelectTrigger className="bg-gray-800/60 border-gray-600/50 text-white">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code} className="text-white">
                      {currency.flag} {currency.code} - {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="mt-2 bg-gray-800/60 border-gray-600/50 text-white placeholder-gray-400"
              />
            </div>

            {/* Swap Button */}
            <div className="col-span-1 flex justify-center">
              <Button
                onClick={swapCurrencies}
                className="bg-gray-800/60 hover:bg-gray-700/60 border-gray-600/50 rounded-full p-3"
              >
                <ArrowUpDown className="w-4 h-4 text-white" />
              </Button>
            </div>

            {/* To Currency */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-white mb-2">To</label>
              <Select value={toCurrency} onValueChange={(value) => handleCurrencyChange('to', value)}>
                <SelectTrigger className="bg-gray-800/60 border-gray-600/50 text-white">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code} className="text-white">
                      {currency.flag} {currency.code} - {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="mt-2 p-3 bg-gray-800/60 rounded-lg border border-gray-600/50">
                <p className="text-white font-medium">
                  {convertedAmount > 0 ? convertedAmount.toLocaleString() : '0'} {toCurrency || ''}
                </p>
              </div>
            </div>
          </div>

          {exchangeRate > 0 && (
            <div className="bg-gray-800/60 p-3 rounded-lg border border-gray-600/30">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Exchange Rate:</span>
                <span className="text-white">1 {fromCurrency} = {exchangeRate.toFixed(6)} {toCurrency}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Fee (0.5%):</span>
                <span className="text-white">{(parseFloat(amount || '0') * 0.005).toFixed(2)} {fromCurrency}</span>
              </div>
            </div>
          )}

          <Button 
            onClick={handleExchange}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold"
            disabled={!fromCurrency || !toCurrency || !amount || isLoading}
          >
            {isLoading ? 'Updating Rates...' : 'Exchange Currency'}
          </Button>
        </CardContent>
      </Card>

      {/* Recent Exchanges */}
      <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white">Recent Exchanges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentExchanges.map((exchange) => (
              <div key={exchange.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors border border-gray-600/30">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm text-white truncate">
                    {exchange.amount} {exchange.from} → {exchange.converted} {exchange.to}
                  </p>
                  <p className="text-xs text-gray-300 truncate">Rate: {exchange.rate}</p>
                </div>
                <div className="text-right ml-2">
                  <p className="text-xs text-gray-300">{exchange.date}</p>
                  <Badge className="bg-green-500/20 text-green-300 border-green-400/30 text-xs">
                    {exchange.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
