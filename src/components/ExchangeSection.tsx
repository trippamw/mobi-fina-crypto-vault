
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpDown, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const ExchangeSection = () => {
  const [fromAmount, setFromAmount] = useState('1000');
  const [fromCurrency, setFromCurrency] = useState('MWK');
  const [toCurrency, setToCurrency] = useState('USD');
  const [exchangeRates, setExchangeRates] = useState<any>({});
  const [loading, setLoading] = useState(false);

  // Live exchange rates (simulated with real-world rates for Malawi)
  const liveRates = {
    'USD/MWK': { rate: '1,751.00', change: '+0.5%', trend: 'up' },
    'GBP/MWK': { rate: '2,210.50', change: '+0.8%', trend: 'up' },
    'EUR/MWK': { rate: '1,875.25', change: '+0.3%', trend: 'up' },
    'ZAR/MWK': { rate: '96.80', change: '-0.2%', trend: 'down' },
    'BTC/MWK': { rate: '168,192,000', change: '+2.4%', trend: 'up' },
    'ETH/MWK': { rate: '6,303,600', change: '+1.8%', trend: 'up' },
    'USDT/MWK': { rate: '1,751.00', change: '+0.1%', trend: 'up' },
    'USDC/MWK': { rate: '1,750.75', change: '+0.1%', trend: 'up' }
  };

  const currencies = [
    { code: 'MWK', name: 'Malawian Kwacha', flag: '🇲🇼' },
    { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
    { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
    { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
    { code: 'ZAR', name: 'South African Rand', flag: '🇿🇦' },
    { code: 'BTC', name: 'Bitcoin', flag: '₿' },
    { code: 'ETH', name: 'Ethereum', flag: 'Ξ' },
    { code: 'USDT', name: 'Tether USD', flag: '₮' },
    { code: 'USDC', name: 'USD Coin', flag: '◎' }
  ];

  const fetchExchangeRates = async () => {
    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setExchangeRates(liveRates);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    fetchExchangeRates();
  }, []);

  const calculateExchange = () => {
    const conversionRates: { [key: string]: number } = {
      'MWK-USD': 1/1751,
      'USD-MWK': 1751,
      'MWK-GBP': 1/2210.50,
      'GBP-MWK': 2210.50,
      'MWK-EUR': 1/1875.25,
      'EUR-MWK': 1875.25,
      'MWK-ZAR': 1/96.80,
      'ZAR-MWK': 96.80,
      'MWK-BTC': 1/168192000,
      'BTC-MWK': 168192000,
      'MWK-ETH': 1/6303600,
      'ETH-MWK': 6303600,
      'MWK-USDT': 1/1751,
      'USDT-MWK': 1751,
      'MWK-USDC': 1/1750.75,
      'USDC-MWK': 1750.75
    };
    
    const rate = conversionRates[`${fromCurrency}-${toCurrency}`] || 1;
    const result = parseFloat(fromAmount) * rate;
    
    if (toCurrency === 'BTC' || toCurrency === 'ETH') {
      return result.toFixed(8);
    }
    return result.toFixed(2);
  };

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  return (
    <div className="space-y-6">
      {/* Exchange Interface */}
      <Card className="gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ArrowUpDown className="w-5 h-5 text-primary" />
              <span>Currency Exchange</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchExchangeRates}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* From Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium">From</label>
            <div className="flex space-x-3">
              <Input
                type="number"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                className="flex-1 bg-white/5 border-white/10"
                placeholder="Enter amount"
              />
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger className="w-32 bg-white/5 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      <div className="flex items-center space-x-2">
                        <span>{currency.flag}</span>
                        <span>{currency.code}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={swapCurrencies}
              className="rounded-full bg-primary/10 hover:bg-primary/20 p-2"
            >
              <ArrowUpDown className="w-4 h-4" />
            </Button>
          </div>

          {/* To Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium">To</label>
            <div className="flex space-x-3">
              <Input
                type="text"
                value={calculateExchange()}
                readOnly
                className="flex-1 bg-white/5 border-white/10 font-mono"
                placeholder="Converted amount"
              />
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger className="w-32 bg-white/5 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      <div className="flex items-center space-x-2">
                        <span>{currency.flag}</span>
                        <span>{currency.code}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Exchange Rate Display */}
          <div className="bg-white/5 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">Exchange Rate</p>
            <p className="text-lg font-semibold">
              1 {fromCurrency} = {(1 * (parseFloat(calculateExchange()) / parseFloat(fromAmount || '1'))).toFixed(fromCurrency === 'MWK' ? 6 : 2)} {toCurrency}
            </p>
          </div>

          <Button className="w-full gradient-primary text-white font-semibold">
            Exchange Now
          </Button>
        </CardContent>
      </Card>

      {/* Live Rates */}
      <Card className="gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Live Exchange Rates</span>
            <Badge variant="secondary" className="bg-green-500/20 text-green-300">
              Live
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(liveRates).map(([pair, data]: [string, any], index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <div>
                  <p className="font-semibold">{pair}</p>
                  <p className="text-lg font-bold font-mono">{data.rate}</p>
                </div>
                <div className="text-right">
                  <Badge 
                    variant="secondary" 
                    className={`${data.trend === 'up' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'} border-0`}
                  >
                    {data.trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                    {data.change}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground">
              Rates updated every 30 seconds • Powered by NeoVault Exchange
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
