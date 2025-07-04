import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Download, Building, Smartphone, User as UserIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/utils/languageApi';
import { TransactionConfirmation } from './TransactionConfirmation';
import { useUserData } from '@/hooks/useUserData';
import { apiService } from '@/lib/api';

interface WithdrawSectionProps {
  onBack?: () => void;
  onBalanceUpdate?: (currency: string, amount: number) => void;
  onTransactionUpdate?: (transaction: any) => void;
}

export const WithdrawSection = ({ onBack, onBalanceUpdate, onTransactionUpdate }: WithdrawSectionProps) => {
  const { t } = useTranslation();
  const { wallets, refreshData } = useUserData();
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [transactionFee, setTransactionFee] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const [transactionModal, setTransactionModal] = useState({
    isOpen: false,
    showSuccess: false,
    transaction: null as any
  });

  const withdrawMethods = [
    {
      name: 'Mobile Money',
      icon: Smartphone,
      fee: 2.5,
      providers: [
        'TNM Mpamba',
        'Airtel Money',
        'Mo626'
      ]
    },
    {
      name: 'Bank Transfer',
      icon: Building,
      fee: 1.5,
      providers: [
        'Standard Bank',
        'FDH Bank', 
        'NBS Bank',
        'National Bank',
        'CDH Investment Bank',
        'Centenary Bank',
        'FCB'
      ]
    },
    {
      name: 'Agent Network',
      icon: UserIcon,
      fee: 3.0,
      providers: [
        'NeoVault Agents'
      ]
    }
  ];

  const calculateFee = (amount: number, method: string) => {
    const selectedMethodData = withdrawMethods.find(m => m.name === method);
    const feePercentage = selectedMethodData?.fee || 1.0;
    const fee = amount * (feePercentage / 100);
    setTransactionFee(fee);
    setTotalAmount(amount + fee);
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
    if (value && selectedMethod) {
      calculateFee(parseFloat(value), selectedMethod);
    } else {
      setTransactionFee(0);
      setTotalAmount(0);
    }
  };

  const handleMethodChange = (method: string) => {
    setSelectedMethod(method);
    setSelectedProvider('');
    if (amount && method) {
      calculateFee(parseFloat(amount), method);
    }
  };

  const handleWithdraw = async () => {
    if (!amount || !selectedMethod || !selectedProvider || !accountNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const withdrawAmount = parseFloat(amount);

    // Show transaction confirmation
    setTransactionModal({
      isOpen: true,
      showSuccess: false,
      transaction: {
        type: 'Withdrawal',
        amount: `MWK ${withdrawAmount.toLocaleString()}`,
        recipient: selectedProvider,
        reference: `WTH${Date.now()}`,
        fee: `MWK ${transactionFee.toLocaleString()}`,
        total: `MWK ${totalAmount.toLocaleString()}`,
        returnTo: 'Withdraw Money'
      }
    });
  };

  const confirmTransaction = async () => {
    setIsProcessing(true);
    
    try {
      const withdrawAmount = parseFloat(amount);
      
      // Get user's MWK wallet
      const mwkWallet = wallets.find(w => w.currency_code === 'MWK');
      if (!mwkWallet) {
        throw new Error('MWK wallet not found');
      }

      // Call the actual backend API
      const result = await apiService.withdraw(
        mwkWallet.id,
        withdrawAmount,
        'MWK',
        selectedMethod.toLowerCase().replace(' ', '_'), // mobile_money, bank_transfer, agent_network
        {
          accountNumber,
          provider: selectedProvider
        }
      );

      // Refresh user data to get updated balances
      refreshData();

      // Add to transaction history
      if (onTransactionUpdate) {
        onTransactionUpdate({
          type: 'Withdrawal',
          amount: `-MWK ${withdrawAmount.toLocaleString()}`,
          description: `Withdrawn via ${selectedProvider} (Fee: MWK ${transactionFee.toLocaleString()})`,
          time: 'Just now',
          status: 'completed'
        });
      }

      // Show success
      setTransactionModal(prev => ({ ...prev, showSuccess: true }));

      // Reset form
      setAmount('');
      setAccountNumber('');
      setSelectedMethod('');
      setSelectedProvider('');
      setTransactionFee(0);
      setTotalAmount(0);
      
    } catch (error) {
      console.error('Withdraw error:', error);
      alert(`Withdrawal failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const closeTransactionModal = () => {
    setTransactionModal({
      isOpen: false,
      showSuccess: false,
      transaction: null
    });
  };

  const getPlaceholderText = () => {
    switch (selectedMethod) {
      case 'Mobile Money':
        return 'Enter mobile number (e.g., +265 123 456 789)';
      case 'Bank Transfer':
        return 'Enter account number';
      case 'Agent Network':
        return 'Enter reference number or ID';
      default:
        return 'Enter account/reference number';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-24">
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
          <h2 className="text-2xl font-bold text-white">{t('withdraw')} Money</h2>
        </div>
      )}

      <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-2xl">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2 text-base sm:text-lg text-white">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <Download className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span>{t('withdraw')} Money</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="amount" className="text-sm text-white">{t('amount')} to Withdraw (MWK)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              className="text-base sm:text-lg font-semibold bg-gray-800/60 border-gray-600/50 text-white placeholder-gray-400 mt-1"
            />
          </div>

          <div>
            <Label className="text-white">Withdrawal Method</Label>
            <Select onValueChange={handleMethodChange}>
              <SelectTrigger className="bg-gray-800/60 border-gray-600/50 text-white mt-1">
                <SelectValue placeholder="Choose withdrawal method" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                {withdrawMethods.map((method) => (
                  <SelectItem key={method.name} value={method.name} className="text-white">
                    <div className="flex items-center space-x-2">
                      <method.icon className="w-4 h-4" />
                      <span>{method.name}</span>
                      <span className="text-xs text-gray-400">({method.fee}% fee)</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedMethod && (
            <div>
              <Label className="text-white">Select Provider</Label>
              <Select onValueChange={setSelectedProvider}>
                <SelectTrigger className="bg-gray-800/60 border-gray-600/50 text-white mt-1">
                  <SelectValue placeholder="Choose provider" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  {withdrawMethods
                    .find(method => method.name === selectedMethod)
                    ?.providers.map((provider) => (
                      <SelectItem key={provider} value={provider} className="text-white">
                        {provider}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {selectedMethod && (
            <div>
              <Label className="text-white">Account/Reference Number</Label>
              <Input
                placeholder={getPlaceholderText()}
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="bg-gray-800/60 border-gray-600/50 text-white placeholder-gray-400 mt-1"
              />
            </div>
          )}

          {transactionFee > 0 && (
            <div className="bg-gray-800/40 p-3 rounded-lg border border-gray-600/30">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Withdrawal Amount:</span>
                <span className="text-white">MWK {parseFloat(amount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Transaction Fee:</span>
                <span className="text-white">MWK {transactionFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-base font-semibold border-t border-gray-600/30 pt-2 mt-2">
                <span className="text-white">Total Deducted:</span>
                <span className="text-white">MWK {totalAmount.toLocaleString()}</span>
              </div>
            </div>
          )}

          <Button
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold"
            onClick={handleWithdraw}
            disabled={isProcessing || !amount || !selectedMethod || !selectedProvider || !accountNumber}
          >
            {isProcessing ? 'Processing Withdrawal...' : 'Withdraw Money'}
          </Button>

          <div className="text-xs text-gray-400 text-center">
            <p>Processing time varies by method:</p>
            <p>Mobile Money: Instant • Bank Transfer: 1-2 days • Agents: Instant</p>
          </div>
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
