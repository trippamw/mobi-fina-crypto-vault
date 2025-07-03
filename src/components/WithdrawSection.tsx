
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, CreditCard, Building2, Smartphone, DollarSign, AlertCircle } from 'lucide-react';
import { useLanguage } from './LanguageProvider';

interface WithdrawSectionProps {
  onBack?: () => void;
  walletBalance?: number;
  walletCurrency?: string;
  onBalanceUpdate?: (newBalance: number) => void;
  onTransactionUpdate?: (transaction: any) => void;
}

export const WithdrawSection = ({ 
  onBack, 
  walletBalance = 50000, 
  walletCurrency = 'MWK',
  onBalanceUpdate,
  onTransactionUpdate 
}: WithdrawSectionProps) => {
  const { t } = useLanguage();
  const [selectedMethod, setSelectedMethod] = useState('');
  const [amount, setAmount] = useState('');
  const [accountDetails, setAccountDetails] = useState({
    accountNumber: '',
    accountName: '',
    bankName: '',
    phoneNumber: '',
    reference: ''
  });
  const [showConfirmation, setShowConfirmation] = useState(false);

  const withdrawMethods = [
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      icon: Building2,
      fee: '2.5%',
      minAmount: 1000,
      description: 'Transfer to bank account'
    },
    {
      id: 'mobile_money',
      name: 'Mobile Money',
      icon: Smartphone,
      fee: '1.8%',
      minAmount: 500,
      description: 'Airtel Money, TNM Mpamba'
    },
    {
      id: 'debit_card',
      name: 'To Debit Card',
      icon: CreditCard,
      fee: '3.2%',
      minAmount: 2000,
      description: 'Withdraw to linked card'
    }
  ];

  const calculateFee = (amt: number, method: string) => {
    const feePercentages = {
      'bank_transfer': 0.025,
      'mobile_money': 0.018,
      'debit_card': 0.032
    };
    return Math.round(amt * (feePercentages[method] || 0.025));
  };

  const handleWithdraw = () => {
    const withdrawAmount = parseFloat(amount);
    const selectedMethodData = withdrawMethods.find(m => m.id === selectedMethod);
    const fee = calculateFee(withdrawAmount, selectedMethod);
    const totalDeduction = withdrawAmount + fee;

    if (totalDeduction > walletBalance) {
      alert('Insufficient balance for this withdrawal');
      return;
    }

    // Update balance
    onBalanceUpdate?.(walletBalance - totalDeduction);

    // Add transaction
    onTransactionUpdate?.({
      type: 'Withdrawal',
      amount: `-${walletCurrency} ${withdrawAmount.toLocaleString()}`,
      description: `${selectedMethodData?.name} withdrawal (Fee: ${walletCurrency} ${fee.toLocaleString()})`,
      time: 'Just now',
      status: 'completed'
    });

    alert(`Withdrawal of ${walletCurrency} ${withdrawAmount.toLocaleString()} successful!`);
    setShowConfirmation(false);
    setAmount('');
    setAccountDetails({
      accountNumber: '',
      accountName: '',
      bankName: '',
      phoneNumber: '',
      reference: ''
    });
    setSelectedMethod('');
  };

  const renderMethodForm = () => {
    const method = withdrawMethods.find(m => m.id === selectedMethod);
    if (!method) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg">
          <method.icon className="w-6 h-6 text-blue-400" />
          <div>
            <h3 className="text-white font-medium">{method.name}</h3>
            <p className="text-gray-300 text-sm">{method.description}</p>
          </div>
        </div>

        <div>
          <Label className="text-gray-300">Amount ({walletCurrency})</Label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-gray-700/50 border-gray-600/50 text-white"
            placeholder={`Min: ${walletCurrency} ${method.minAmount.toLocaleString()}`}
          />
          {amount && parseFloat(amount) < method.minAmount && (
            <p className="text-red-400 text-sm mt-1">
              Minimum amount is {walletCurrency} {method.minAmount.toLocaleString()}
            </p>
          )}
        </div>

        {selectedMethod === 'bank_transfer' && (
          <>
            <div>
              <Label className="text-gray-300">Bank Name</Label>
              <Select value={accountDetails.bankName} onValueChange={(value) => 
                setAccountDetails(prev => ({ ...prev, bankName: value }))
              }>
                <SelectTrigger className="bg-gray-700/50 border-gray-600/50 text-white">
                  <SelectValue placeholder="Select bank" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="standard_bank">Standard Bank</SelectItem>
                  <SelectItem value="national_bank">National Bank</SelectItem>
                  <SelectItem value="nedbank">NedBank</SelectItem>
                  <SelectItem value="fmb">FMB Bank</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-300">Account Number</Label>
              <Input
                value={accountDetails.accountNumber}
                onChange={(e) => setAccountDetails(prev => ({ ...prev, accountNumber: e.target.value }))}
                className="bg-gray-700/50 border-gray-600/50 text-white"
                placeholder="Enter account number"
              />
            </div>
            <div>
              <Label className="text-gray-300">Account Name</Label>
              <Input
                value={accountDetails.accountName}
                onChange={(e) => setAccountDetails(prev => ({ ...prev, accountName: e.target.value }))}
                className="bg-gray-700/50 border-gray-600/50 text-white"
                placeholder="Enter account holder name"
              />
            </div>
          </>
        )}

        {selectedMethod === 'mobile_money' && (
          <>
            <div>
              <Label className="text-gray-300">Mobile Money Provider</Label>
              <Select value={accountDetails.bankName} onValueChange={(value) => 
                setAccountDetails(prev => ({ ...prev, bankName: value }))
              }>
                <SelectTrigger className="bg-gray-700/50 border-gray-600/50 text-white">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="airtel_money">Airtel Money</SelectItem>
                  <SelectItem value="tnm_mpamba">TNM Mpamba</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-300">Phone Number</Label>
              <Input
                value={accountDetails.phoneNumber}
                onChange={(e) => setAccountDetails(prev => ({ ...prev, phoneNumber: e.target.value }))}
                className="bg-gray-700/50 border-gray-600/50 text-white"
                placeholder="+265 xxx xxx xxx"
              />
            </div>
          </>
        )}

        {amount && parseFloat(amount) >= method.minAmount && (
          <div className="bg-gray-700/50 p-3 rounded-lg">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Withdrawal Amount:</span>
                <span className="text-white">{walletCurrency} {parseFloat(amount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Processing Fee ({method.fee}):</span>
                <span className="text-white">{walletCurrency} {calculateFee(parseFloat(amount), selectedMethod).toLocaleString()}</span>
              </div>
              <div className="border-t border-gray-600 pt-2">
                <div className="flex justify-between font-semibold">
                  <span className="text-gray-300">Total Deduction:</span>
                  <span className="text-white">{walletCurrency} {(parseFloat(amount) + calculateFee(parseFloat(amount), selectedMethod)).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <Button
          onClick={() => setShowConfirmation(true)}
          disabled={!amount || parseFloat(amount) < method.minAmount || 
                   (selectedMethod === 'bank_transfer' && (!accountDetails.accountNumber || !accountDetails.bankName)) ||
                   (selectedMethod === 'mobile_money' && !accountDetails.phoneNumber)}
          className="w-full bg-red-600 hover:bg-red-700 text-white"
        >
          <DollarSign className="w-4 h-4 mr-2" />
          Proceed to Withdraw
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
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
          <h2 className="text-xl font-bold text-white">{t('withdraw')}</h2>
        </div>
      )}

      <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white">Available Balance</CardTitle>
          <div className="text-2xl font-bold text-green-400">
            {walletCurrency} {walletBalance.toLocaleString()}
          </div>
        </CardHeader>
      </Card>

      {!selectedMethod ? (
        <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white">Select Withdrawal Method</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {withdrawMethods.map((method) => (
                <Button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  variant="outline"
                  className="h-auto p-4 border-gray-600 hover:bg-gray-700/50 text-left justify-start"
                >
                  <method.icon className="w-6 h-6 text-blue-400 mr-3" />
                  <div>
                    <div className="font-medium text-white">{method.name}</div>
                    <div className="text-sm text-gray-400">{method.description}</div>
                    <div className="text-xs text-gray-500">Fee: {method.fee} | Min: {walletCurrency} {method.minAmount.toLocaleString()}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              Withdrawal Details
              <Button
                onClick={() => setSelectedMethod('')}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                Change Method
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderMethodForm()}
          </CardContent>
        </Card>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Withdrawal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-3 flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
              <div>
                <p className="text-yellow-300 font-medium">Important Notice</p>
                <p className="text-yellow-200 text-sm">Withdrawals are typically processed within 24 hours. Fees are non-refundable.</p>
              </div>
            </div>

            <div className="bg-gray-700/50 p-4 rounded-lg">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Method:</span>
                  <span className="text-white">{withdrawMethods.find(m => m.id === selectedMethod)?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Amount:</span>
                  <span className="text-white">{walletCurrency} {parseFloat(amount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Fee:</span>
                  <span className="text-white">{walletCurrency} {calculateFee(parseFloat(amount), selectedMethod).toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-600 pt-2">
                  <div className="flex justify-between font-semibold">
                    <span className="text-gray-300">Total Deduction:</span>
                    <span className="text-white">{walletCurrency} {(parseFloat(amount) + calculateFee(parseFloat(amount), selectedMethod)).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowConfirmation(false)}
                className="flex-1 border-gray-600 text-gray-300 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={handleWithdraw}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                Confirm Withdrawal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
