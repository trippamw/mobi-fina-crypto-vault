
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpDown, CreditCard, Wallet } from 'lucide-react';
import { TransactionConfirmation } from './TransactionConfirmation';
import { useLanguage } from '@/utils/languageApi';

interface AddMoneyToCardProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (transaction: any) => void;
  card?: {
    id: string;
    name: string;
    currency: string;
    balance: number;
  };
  wallets?: Array<{
    id: string;
    name: string;
    currency: string;
    balance: number;
  }>;
}

export const AddMoneyToCard = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  card,
  wallets = [
    { id: '1', name: 'Main Wallet', currency: 'MWK', balance: 50000 },
    { id: '2', name: 'USD Wallet', currency: 'USD', balance: 250 },
    { id: '3', name: 'Savings Wallet', currency: 'MWK', balance: 120000 }
  ]
}: AddMoneyToCardProps) => {
  const { t } = useLanguage();
  const [amount, setAmount] = useState('');
  const [selectedWallet, setSelectedWallet] = useState('');
  const [exchangeRate, setExchangeRate] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  const [transactionModal, setTransactionModal] = useState({
    isOpen: false,
    showSuccess: false,
    transaction: null as any
  });

  // Mock exchange rates - increased by 70% as requested
  const getExchangeRate = (fromCurrency: string, toCurrency: string): number => {
    if (fromCurrency === toCurrency) return 1;
    
    const baseRates: { [key: string]: number } = {
      'MWK-USD': 0.00059 * 1.7, // Increased by 70%
      'USD-MWK': 1695 * 1.7,    // Increased by 70%
      'MWK-GBP': 0.00047 * 1.7, // Increased by 70%
      'GBP-MWK': 2127 * 1.7,    // Increased by 70%
    };
    
    return baseRates[`${fromCurrency}-${toCurrency}`] || 1;
  };

  const calculateConversion = () => {
    if (!selectedWallet || !amount) return;
    
    const wallet = wallets.find(w => w.id === selectedWallet);
    if (!wallet || !card) return;
    
    const rate = getExchangeRate(wallet.currency, card.currency);
    const converted = parseFloat(amount) * rate;
    
    setExchangeRate(rate);
    setConvertedAmount(converted);
  };

  React.useEffect(() => {
    calculateConversion();
  }, [selectedWallet, amount]);

  const handleAddMoney = () => {
    if (!selectedWallet || !amount || parseFloat(amount) <= 0) {
      alert('Please fill in all fields with valid amounts');
      return;
    }

    const wallet = wallets.find(w => w.id === selectedWallet);
    if (!wallet) return;

    const amountNum = parseFloat(amount);
    if (amountNum > wallet.balance) {
      alert('Insufficient funds in selected wallet');
      return;
    }

    // Calculate fees - increased by 70%
    const baseFee = amountNum * 0.025; // 2.5% base fee
    const conversionFee = wallet.currency !== card?.currency ? amountNum * 0.015 : 0; // 1.5% conversion fee
    const totalFee = (baseFee + conversionFee) * 1.7; // Increased by 70%
    const totalDeduction = amountNum + totalFee;
    const finalAmount = wallet.currency === card?.currency ? amountNum : convertedAmount;

    // Show transaction confirmation
    setTransactionModal({
      isOpen: true,
      showSuccess: false,
      transaction: {
        type: 'Add Money to Card',
        amount: `${amountNum.toFixed(2)} ${wallet.currency}${wallet.currency !== card?.currency ? ` → ${finalAmount.toFixed(2)} ${card?.currency}` : ''}`,
        recipient: `${card?.name} (${card?.currency})`,
        reference: `ADD${Date.now()}`,
        fee: `${totalFee.toFixed(2)} ${wallet.currency}`,
        total: `${totalDeduction.toFixed(2)} ${wallet.currency}`,
        returnTo: 'Cards'
      }
    });
  };

  const confirmTransaction = () => {
    setLoading(true);
    
    setTimeout(() => {
      const wallet = wallets.find(w => w.id === selectedWallet);
      const amountNum = parseFloat(amount);
      const baseFee = amountNum * 0.025;
      const conversionFee = wallet?.currency !== card?.currency ? amountNum * 0.015 : 0;
      const totalFee = (baseFee + conversionFee) * 1.7;
      const finalAmount = wallet?.currency === card?.currency ? amountNum : convertedAmount;

      // Create transaction record
      const transaction = {
        type: 'Add Money to Card',
        amount: `+${finalAmount.toFixed(2)} ${card?.currency}`,
        description: `Added money from ${wallet?.name} to ${card?.name}`,
        time: 'Just now',
        status: 'completed'
      };

      if (onSuccess) {
        onSuccess(transaction);
      }

      setLoading(false);
      setTransactionModal(prev => ({ ...prev, showSuccess: true }));
      
      // Reset form
      setAmount('');
      setSelectedWallet('');
      setExchangeRate(1);
      setConvertedAmount(0);
    }, 2000);
  };

  const closeTransactionModal = () => {
    setTransactionModal({
      isOpen: false,
      showSuccess: false,
      transaction: null
    });
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5" />
              <span>{t('addMoney')} to Card</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {card && (
              <Card className="bg-gray-700/50 border-gray-600">
                <CardContent className="pt-4">
                  <div className="text-center">
                    <h3 className="font-medium text-white">{card.name}</h3>
                    <p className="text-sm text-gray-300">
                      Current Balance: {card.balance.toFixed(2)} {card.currency}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            <div>
              <Label className="text-white">Select Wallet</Label>
              <Select value={selectedWallet} onValueChange={setSelectedWallet}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Choose wallet to debit from" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {wallets.map((wallet) => (
                    <SelectItem key={wallet.id} value={wallet.id} className="text-white">
                      <div className="flex items-center justify-between w-full">
                        <span>{wallet.name}</span>
                        <span className="text-sm text-gray-300">
                          {wallet.balance.toFixed(2)} {wallet.currency}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-white">{t('amount')}</Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount to add"
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>

            {selectedWallet && amount && (() => {
              const wallet = wallets.find(w => w.id === selectedWallet);
              const needsConversion = wallet?.currency !== card?.currency;
              const amountNum = parseFloat(amount);
              const baseFee = amountNum * 0.025;
              const conversionFee = needsConversion ? amountNum * 0.015 : 0;
              const totalFee = (baseFee + conversionFee) * 1.7;

              return (
                <Card className="bg-gray-700/30 border-gray-600">
                  <CardContent className="pt-4">
                    <div className="space-y-2 text-sm">
                      {needsConversion && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-300">Exchange Rate:</span>
                            <span className="text-white">
                              1 {wallet?.currency} = {exchangeRate.toFixed(6)} {card?.currency}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">Converted Amount:</span>
                            <span className="text-white">
                              {convertedAmount.toFixed(2)} {card?.currency}
                            </span>
                          </div>
                        </>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-300">Platform Fee (2.5%):</span>
                        <span className="text-white">{baseFee.toFixed(2)} {wallet?.currency}</span>
                      </div>
                      {needsConversion && (
                        <div className="flex justify-between">
                          <span className="text-gray-300">Conversion Fee (1.5%):</span>
                          <span className="text-white">{conversionFee.toFixed(2)} {wallet?.currency}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-300">Fee Increase (70%):</span>
                        <span className="text-white">+{((baseFee + conversionFee) * 0.7).toFixed(2)} {wallet?.currency}</span>
                      </div>
                      <div className="border-t border-gray-600 pt-2">
                        <div className="flex justify-between font-semibold">
                          <span className="text-gray-300">Total Fee:</span>
                          <span className="text-white">{totalFee.toFixed(2)} {wallet?.currency}</span>
                        </div>
                        <div className="flex justify-between font-semibold">
                          <span className="text-gray-300">Total Deduction:</span>
                          <span className="text-white">{(amountNum + totalFee).toFixed(2)} {wallet?.currency}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })()}

            <div className="flex space-x-2">
              <Button onClick={onClose} variant="outline" className="flex-1 border-gray-600 text-gray-300">
                {t('cancel')}
              </Button>
              <Button 
                onClick={handleAddMoney}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={!selectedWallet || !amount || loading}
              >
                {loading ? t('processing') : `${t('addMoney')}`}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <TransactionConfirmation
        isOpen={transactionModal.isOpen}
        onClose={closeTransactionModal}
        onConfirm={confirmTransaction}
        onSuccess={closeTransactionModal}
        transaction={transactionModal.transaction}
        showSuccess={transactionModal.showSuccess}
      />
    </>
  );
};
