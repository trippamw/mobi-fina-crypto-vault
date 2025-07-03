
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, CreditCard, Banknote, Smartphone } from 'lucide-react';
import { TransactionConfirmation } from './TransactionConfirmation';
import { useLanguage } from '@/utils/languageApi';

interface DepositSectionProps {
  onBalanceUpdate?: (currency: string, amount: number) => void;
  onTransactionUpdate?: (transaction: any) => void;
  onBack?: () => void;
}

export const DepositSection: React.FC<DepositSectionProps> = ({ onBalanceUpdate, onTransactionUpdate, onBack }) => {
  const { t } = useLanguage();
  const [selectedMethod, setSelectedMethod] = useState('');
  const [currency, setCurrency] = useState('MWK');
  const [amount, setAmount] = useState('');
  const [transactionModal, setTransactionModal] = useState({
    isOpen: false,
    showSuccess: false,
    transaction: null as any
  });

  const depositMethods = [
    { id: 'bank_transfer', name: t('bankTransfer'), icon: CreditCard, description: 'Transfer from your bank account' },
    { id: 'cash_deposit', name: t('cashDeposit'), icon: Banknote, description: 'Deposit cash at our agents' },
    { id: 'mobile_money', name: t('mobileMoney'), icon: Smartphone, description: 'Transfer from mobile money' },
  ];

  const currencies = [
    { code: 'MWK', name: 'Malawian Kwacha', flag: '🇲🇼' },
    { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
    { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
    { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
    { code: 'ZAR', name: 'South African Rand', flag: '🇿🇦' },
  ];

  const handleDeposit = () => {
    if (!selectedMethod || !amount || !currency) {
      alert('Please fill in all fields');
      return;
    }

    const depositAmount = parseFloat(amount);
    const fee = depositAmount * 0.01; // 1% fee
    const total = depositAmount - fee;

    const method = depositMethods.find(m => m.id === selectedMethod);

    setTransactionModal({
      isOpen: true,
      showSuccess: false,
      transaction: {
        type: t('deposit'),
        amount: `${amount} ${currency}`,
        recipient: method?.name || 'Deposit Method',
        reference: `DEP${Date.now()}`,
        fee: `${fee.toFixed(2)} ${currency}`,
        total: `${total.toFixed(2)} ${currency}`
      }
    });
  };

  const confirmTransaction = () => {
    const depositAmount = parseFloat(amount);
    const fee = depositAmount * 0.01;
    const netAmount = depositAmount - fee;

    if (onBalanceUpdate) {
      onBalanceUpdate(currency, netAmount);
    }

    if (onTransactionUpdate) {
      const method = depositMethods.find(m => m.id === selectedMethod);
      onTransactionUpdate({
        type: t('deposit'),
        amount: `+${netAmount.toFixed(2)} ${currency}`,
        description: `${t('deposit')} via ${method?.name}`,
        time: 'Just now',
        status: 'completed'
      });
    }

    setTransactionModal(prev => ({ ...prev, showSuccess: true }));

    // Reset form
    setSelectedMethod('');
    setAmount('');
  };

  const closeTransactionModal = () => {
    setTransactionModal({
      isOpen: false,
      showSuccess: false,
      transaction: null
    });
  };

  return (
    <div className="space-y-6 pb-24">
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
          <h2 className="text-2xl font-bold text-white">{t('addMoney')}</h2>
        </div>
      )}

      <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white">{t('selectDepositMethod')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            {depositMethods.map((method) => {
              const IconComponent = method.icon;
              return (
                <div
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedMethod === method.id
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-gray-600/50 bg-gray-800/60 hover:bg-gray-700/60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <IconComponent className="w-6 h-6 text-white" />
                    <div>
                      <h3 className="text-white font-medium">{method.name}</h3>
                      <p className="text-gray-400 text-sm">{method.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {selectedMethod && (
            <div className="space-y-4 pt-4 border-t border-gray-600/50">
              <div>
                <label className="block text-sm font-medium text-white mb-2">{t('currency')}</label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="bg-gray-800/60 border-gray-600/50 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    {currencies.map((curr) => (
                      <SelectItem key={curr.code} value={curr.code} className="text-white">
                        {curr.flag} {curr.code} - {curr.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">{t('amount')}</label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={`Enter amount in ${currency}`}
                  className="bg-gray-800/60 border-gray-600/50 text-white placeholder-gray-400"
                />
              </div>

              {amount && (
                <div className="bg-gray-800/60 p-3 rounded-lg border border-gray-600/30">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">{t('depositAmount')}:</span>
                    <span className="text-white">{amount} {currency}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">{t('fee')} (1%):</span>
                    <span className="text-white">{(parseFloat(amount || '0') * 0.01).toFixed(2)} {currency}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-gray-600/30 pt-2 mt-2">
                    <span className="text-gray-300">{t('total')}:</span>
                    <span className="text-white font-medium">{(parseFloat(amount || '0') - parseFloat(amount || '0') * 0.01).toFixed(2)} {currency}</span>
                  </div>
                </div>
              )}

              <Button 
                onClick={handleDeposit}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold"
                disabled={!amount}
              >
                {t('proceedWithDeposit')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

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
