import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpDown, TrendingUp, TrendingDown, ArrowLeft, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TransactionConfirmation } from './TransactionConfirmation';
import { useLanguage } from '@/utils/languageApi';
import { useUserData } from '@/hooks/useUserData';
import { apiService } from '@/lib/api';
// Currency service removed - using simplified rates

interface ExchangeSectionProps {
  onBalanceUpdate?: (currency: string, amount: number) => void;
  onTransactionUpdate?: (transaction: any) => void;
  onBack?: () => void;
}

export const ExchangeSection: React.FC<ExchangeSectionProps> = ({ onBalanceUpdate, onTransactionUpdate, onBack }) => {
  const { t } = useLanguage();
  const { wallets, refreshData } = useUserData();
  const [fromCurrency, setFromCurrency] = useState('');
  const [toCurrency, setToCurrency] = useState('');
  const [amount, setAmount] = useState('');
  const [exchangeRate, setExchangeRate] = useState(0);
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [exchangeRates, setExchangeRates] = useState<any>({});

  const [transactionModal, setTransactionModal] = useState({
    isOpen: false,
    showSuccess: false,
    transaction: null as any
  });

  const fiatCurrencies = [
    { code: 'MWK', name: 'Malawian Kwacha', flag: '🇲🇼' },
    { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
    { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
    { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
    { code: 'ZAR', name: 'South African Rand', flag: '🇿🇦' },
  ];

  const cryptoCurrencies = [
    { code: 'BTC', name: 'Bitcoin', flag: '₿' },
    { code: 'ETH', name: 'Ethereum', flag: 'Ξ' },
    { code: 'USDT', name: 'Tether', flag: '₮' },
    { code: 'USDC', name: 'USD Coin', flag: '$' },
  ];

  const allCurrencies = [...fiatCurrencies, ...cryptoCurrencies];

  // Use the same exchange rates as AddMoneyToCard - updated rates
  const standardExchangeRates = {
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

  // Fetch live exchange rates using the currency service
  const fetchAllRates = async () => {
    setIsLoading(true);
    try {
      // Use the same exchange rates as AddMoneyToCard
      setExchangeRates(standardExchangeRates);
      setLastUpdated(new Date());
      
      // Recalculate if exchange is already set up
      if (fromCurrency && toCurrency && amount) {
        calculateExchange();
      }
    } catch (error) {
      console.error('Failed to fetch exchange rates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load rates on component mount
  useEffect(() => {
    fetchAllRates();
  }, []);

  const calculateExchange = async () => {
    if (!fromCurrency || !toCurrency || !amount) return;

    try {
      // Use standard exchange rates for consistency
      const fromRate = standardExchangeRates[fromCurrency as keyof typeof standardExchangeRates] || 1;
      const toRate = standardExchangeRates[toCurrency as keyof typeof standardExchangeRates] || 1;
      const rate = toRate / fromRate;
      const converted = parseFloat(amount) * rate;
      
      setExchangeRate(rate);
      setConvertedAmount(converted);
    } catch (error) {
      console.error('Error calculating exchange:', error);
    }
  };

  const handleExchange = () => {
    if (!fromCurrency || !toCurrency || !amount || !convertedAmount) {
      alert('Please fill in all fields');
      return;
    }

    const fee = parseFloat(amount) * 0.0475; // 4.75% fee (increased by 90%)
    const total = parseFloat(amount) + fee;

    // Show transaction confirmation
    setTransactionModal({
      isOpen: true,
      showSuccess: false,
      transaction: {
        type: 'Exchange',
        amount: `${amount} ${fromCurrency} → ${convertedAmount.toFixed(6)} ${toCurrency}`,
        recipient: `${fromCurrency} to ${toCurrency}`,
        reference: `EXC${Date.now()}`,
        fee: `${fee.toFixed(6)} ${fromCurrency}`,
        total: `${total.toFixed(6)} ${fromCurrency}`,
        returnTo: 'Exchange'
      }
    });
  };

  const confirmTransaction = async () => {
    setIsLoading(true);
    
    try {
      const depositAmount = parseFloat(amount);
      
      // Get user's wallets
      const fromWallet = wallets.find(w => w.currency_code === fromCurrency);
      const toWallet = wallets.find(w => w.currency_code === toCurrency);
      
      if (!fromWallet) {
        throw new Error(`${fromCurrency} wallet not found`);
      }
      if (!toWallet) {
        throw new Error(`${toCurrency} wallet not found`);
      }

      // Call the actual backend API
      const result = await apiService.exchange(
        fromWallet.id,
        toWallet.id,
        depositAmount
      );

      // Refresh user data to get updated balances
      refreshData();

      // Add to transaction history
      if (onTransactionUpdate) {
        onTransactionUpdate({
          type: 'Exchange',
          amount: `${amount} ${fromCurrency} → ${convertedAmount.toFixed(6)} ${toCurrency}`,
          description: `Currency exchange from ${fromCurrency} to ${toCurrency}`,
          time: 'Just now',
          status: 'completed'
        });
      }

      // Show success
      setTransactionModal(prev => ({ ...prev, showSuccess: true }));

      // Reset form
      setFromCurrency('');
      setToCurrency('');
      setAmount('');
      setExchangeRate(0);
      setConvertedAmount(0);
      
    } catch (error) {
      console.error('Exchange error:', error);
      alert(`Exchange failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const closeTransactionModal = () => {
    setTransactionModal({
      isOpen: false,
      showSuccess: false,
      transaction: null
    });
  };

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    calculateExchange();
  };

  useEffect(() => {
    if (fromCurrency && toCurrency && amount && Object.keys(exchangeRates).length > 0) {
      calculateExchange();
    }
  }, [fromCurrency, toCurrency, amount, exchangeRates]);

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
          <h2 className="text-2xl font-bold text-white">
            Exchange Currency
          </h2>
        </div>
      )}

      {/* Live Rates Display */}
      <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Live Exchange Rates</CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              onClick={fetchAllRates}
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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* Display exchange rates using the currency service data */}
            {Object.entries(exchangeRates).map(([currency, rate]) => {
              const currencyInfo = allCurrencies.find(c => c.code === currency);
              if (!currencyInfo || currency === 'USD') return null;
              
              return (
                <div key={currency} className="bg-gray-800/60 p-3 rounded-lg border border-gray-600/50">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-lg">{currencyInfo.flag}</span>
                    <span className="font-medium text-white">{currency}</span>
                  </div>
                  <p className="text-sm text-white/60">
                    1 USD = {typeof rate === 'number' ? rate.toFixed(2) : String(rate)} {currency}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Exchange Form */}
      <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white">
            Exchange Currency
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-5 gap-4 items-end">
            {/* From Currency */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-white mb-2">From</label>
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger className="bg-gray-800/60 border-gray-600/50 text-white">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  {allCurrencies.map((currency) => (
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
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger className="bg-gray-800/60 border-gray-600/50 text-white">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  {allCurrencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code} className="text-white">
                      {currency.flag} {currency.code} - {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="mt-2 p-3 bg-gray-800/60 rounded-lg border border-gray-600/50">
                <p className="text-white font-medium">
                  {convertedAmount > 0 ? convertedAmount.toFixed(8) : '0'} {toCurrency || ''}
                </p>
              </div>
            </div>
          </div>

          {exchangeRate > 0 && (
            <div className="bg-gray-800/60 p-3 rounded-lg border border-gray-600/30">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Exchange Rate:</span>
                <span className="text-white">1 {fromCurrency} = {exchangeRate.toFixed(8)} {toCurrency}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Fee (4.75%):</span>
                <span className="text-white">{(parseFloat(amount || '0') * 0.0475).toFixed(8)} {fromCurrency}</span>
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

      {/* Transaction Confirmation Modal */}
      <TransactionConfirmation
        isOpen={transactionModal.isOpen}
        onClose={closeTransactionModal}
        onConfirm={confirmTransaction}
        onSuccess={closeTransactionModal}
        transaction={transactionModal.transaction}
        showSuccess={transactionModal.showSuccess}
      />
    </div>
  );
};
