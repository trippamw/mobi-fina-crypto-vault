
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpDown, TrendingUp, TrendingDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const ExchangeSection = () => {
  const [fromAmount, setFromAmount] = useState('1000');
  const [fromCurrency, setFromCurrency] = useState('MWK');
  const [toCurrency, setToCurrency] = useState('BTC');

  const exchangeRates = [
    { pair: 'BTC/MWK', rate: '65,000,000', change: '+2.4%', trend: 'up' },
    { pair: 'ETH/MWK', rate: '2,500,000', change: '+1.8%', trend: 'up' },
    { pair: 'USD/MWK', rate: '1,250', change: '-0.3%', trend: 'down' },
    { pair: 'BTC/USD', rate: '52,000', change: '+3.2%', trend: 'up' }
  ];

  const calculateExchange = () => {
    // Simplified exchange calculation
    const rates: { [key: string]: number } = {
      'MWK-BTC': 0.000000015,
      'BTC-MWK': 65000000,
      'MWK-ETH': 0.0000004,
      'ETH-MWK': 2500000,
      'MWK-USD': 0.0008,
      'USD-MWK': 1250
    };
    
    const rate = rates[`${fromCurrency}-${toCurrency}`] || 1;
    return (parseFloat(fromAmount) * rate).toFixed(8);
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
          <CardTitle className="flex items-center space-x-2">
            <ArrowUpDown className="w-5 h-5 text-primary" />
            <span>Currency Exchange</span>
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
                <SelectTrigger className="w-24 bg-white/5 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MWK">MWK</SelectItem>
                  <SelectItem value="BTC">BTC</SelectItem>
                  <SelectItem value="ETH">ETH</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
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
                className="flex-1 bg-white/5 border-white/10"
                placeholder="Converted amount"
              />
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger className="w-24 bg-white/5 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MWK">MWK</SelectItem>
                  <SelectItem value="BTC">BTC</SelectItem>
                  <SelectItem value="ETH">ETH</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button className="w-full gradient-primary text-white font-semibold">
            Exchange Now
          </Button>
        </CardContent>
      </Card>

      {/* Live Rates */}
      <Card className="gradient-card border-border/50">
        <CardHeader>
          <CardTitle>Live Exchange Rates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exchangeRates.map((rate, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <div>
                  <p className="font-semibold">{rate.pair}</p>
                  <p className="text-2xl font-bold">{rate.rate}</p>
                </div>
                <div className="text-right">
                  <Badge 
                    variant="secondary" 
                    className={`${rate.trend === 'up' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'} border-0 mb-2`}
                  >
                    {rate.trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                    {rate.change}
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
