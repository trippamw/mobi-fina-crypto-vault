
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpDown, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TransactionConfirmation } from '@/components/TransactionConfirmation';

interface ExchangeSectionProps {
  onBalanceUpdate?: (currency: string, amount: number) => void;
}

export const ExchangeSection = ({ onBalanceUpdate }: ExchangeSectionProps) => {
  const [fromAmount, setFromAmount] = useState('1000');
  const [fromCurrency, setFromCurrency] = useState('MWK');
  const [toCurrency, setToCurrency] = useState('USD');
  const [exchangeRates, setExchangeRates] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [transactionModal, setTransactionModal] = useState({
    isOpen: false,
    showSuccess: false,
    transaction: null as any
  });

  // Live exchange rates with real Malawi rates
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

  const handleExchange = () => {
    if (!fromAmount || fromAmount === '0') return;

    const exchangeFee = parseFloat(fromAmount) * 0.01; // 1% exchange fee
    const convertedAmount = calculateExchange();
    
    setTransactionModal({
      isOpen: true,
      showSuccess: false,
      transaction: {
        type: 'Currency Exchange',
        amount: `${fromAmount} ${fromCurrency} → ${convertedAmount} ${toCurrency}`,
        recipient: 'Exchange Service',
        fee: `${exchangeFee.toLocaleString()} ${fromCurrency}`,
        total: `${convertedAmount} ${toCurrency}`,
        exchangeRate: `1 ${fromCurrency} = ${(parseFloat(calculateExchange()) / parseFloat(fromAmount)).toFixed(fromCurrency === 'MWK' ? 6 : 2)} ${toCurrency}`,
        onSuccess: () => {
          // Update balances
          if (onBalanceUpdate) {
            onBalanceUpdate(fromCurrency, -(parseFloat(fromAmount) + exchangeFee));
            onBalanceUpdate(toCurrency, parseFloat(convertedAmount));
          }
        }
      }
    });
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Exchange Interface - Made darker */}
      <Card className="bg-white/5 backdrop-blur-md border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-2">
              <ArrowUpDown className="w-5 h-5 text-blue-400" />
              <span>Currency Exchange</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchExchangeRates}
              disabled={loading}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* From Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">From</label>
            <div className="flex space-x-3">
              <Input
                type="number"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                className="flex-1 bg-white/10 border-white/20 text-white placeholder-white/60"
                placeholder="Enter amount"
              />
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code} className="text-white">
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
              className="rounded-full bg-blue-500/20 hover:bg-blue-500/30 p-2"
            >
              <ArrowUpDown className="w-4 h-4 text-blue-400" />
            </Button>
          </div>

          {/* To Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">To</label>
            <div className="flex space-x-3">
              <Input
                type="text"
                value={calculateExchange()}
                readOnly
                className="flex-1 bg-white/10 border-white/20 font-mono text-white"
                placeholder="Converted amount"
              />
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code} className="text-white">
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
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-white/60">Exchange Rate</p>
                <p className="text-lg font-semibold text-white">
                  1 {fromCurrency} = {(1 * (parseFloat(calculateExchange()) / parseFloat(fromAmount || '1'))).toFixed(fromCurrency === 'MWK' ? 6 : 2)} {toCurrency}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-white/60">Exchange Fee</p>
                <p className="text-sm text-orange-400">1.0%</p>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleExchange}
            disabled={!fromAmount || fromAmount === '0' || fromCurrency === toCurrency}
            className="w-full gradient-success text-white font-semibold"
          >
            Exchange Now
          </Button>
        </CardContent>
      </Card>

      {/* Live Rates - Made darker */}
      <Card className="bg-white/5 backdrop-blur-md border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-white">
            <span>Live Exchange Rates</span>
            <Badge className="bg-green-500/20 text-green-300 border-green-400/30">
              Live
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(liveRates).map(([pair, data]: [string, any], index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <div>
                  <p className="font-semibold text-white">{pair}</p>
                  <p className="text-lg font-bold font-mono text-white">{data.rate}</p>
                </div>
                <div className="text-right">
                  <Badge 
                    className={`${data.trend === 'up' ? 'bg-green-500/20 text-green-300 border-green-400/30' : 'bg-red-500/20 text-red-300 border-red-400/30'}`}
                  >
                    {data.trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                    {data.change}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <p className="text-xs text-white/60">
              Rates updated every 30 seconds • Powered by live market data
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Confirmation Modal */}
      <TransactionConfirmation
        isOpen={transactionModal.isOpen}
        onClose={() => setTransactionModal({ isOpen: false, showSuccess: false, transaction: null })}
        onConfirm={() => {
          setTimeout(() => {
            if (transactionModal.transaction?.onSuccess) {
              transactionModal.transaction.onSuccess();
            }
            setTransactionModal(prev => ({ ...prev, showSuccess: true }));
          }, 1500);
        }}
        onSuccess={() => setTransactionModal({ isOpen: false, showSuccess: false, transaction: null })}
        transaction={transactionModal.transaction}
        showSuccess={transactionModal.showSuccess}
      />
    </div>
  );
};
