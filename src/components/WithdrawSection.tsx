
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUp, Smartphone, Building, User, ArrowLeft } from 'lucide-react';

interface WithdrawSectionProps {
  onBalanceUpdate?: (currency: string, amount: number) => void;
  onTransactionUpdate?: (transaction: any) => void;
  onBack?: () => void;
  walletCurrency?: string;
  walletBalance?: number;
}

export const WithdrawSection = ({ onBalanceUpdate, onTransactionUpdate, onBack, walletCurrency = 'MWK', walletBalance = 0 }: WithdrawSectionProps) => {
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const withdrawMethods = [
    { name: 'Mobile Money', icon: Smartphone },
    { name: 'Bank Transfer', icon: Building },
    { name: 'Agent Withdrawal', icon: User }
  ];

  const mobileMoneyProviders = [
    'TNM Mpamba', 'Airtel Money', 'Mo626'
  ];

  const banks = [
    'Standard Bank', 'FDH Bank', 'NBS Bank', 'National Bank'
  ];

  const handleWithdraw = async () => {
    if (!amount || !accountNumber || !selectedMethod) {
      alert('Please fill in all fields.');
      return;
    }

    const withdrawAmount = parseFloat(amount);
    if (withdrawAmount > walletBalance) {
      alert('Insufficient balance.');
      return;
    }

    setIsProcessing(true);

    // Simulate processing delay
    setTimeout(() => {
      // Update wallet balance
      if (onBalanceUpdate) {
        onBalanceUpdate(walletCurrency, -withdrawAmount);
      }

      // Add to transaction history
      if (onTransactionUpdate) {
        onTransactionUpdate({
          type: 'Withdraw',
          amount: `-${walletCurrency} ${withdrawAmount.toLocaleString()}`,
          description: `Withdraw via ${selectedMethod}`,
          time: 'Just now',
          status: 'completed'
        });
      }

      setIsProcessing(false);

      // Show success message
      alert(`Successfully withdrew ${walletCurrency} ${withdrawAmount.toLocaleString()} via ${selectedMethod}`);

      // Reset form
      setAmount('');
      setAccountNumber('');
      setReferenceNumber('');
      setSelectedMethod('');
    }, 2000);
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
          <h2 className="text-2xl font-bold text-white">Withdraw Money</h2>
        </div>
      )}

      <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-2xl">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2 text-base sm:text-lg text-white">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-red-500 to-orange-600 rounded-lg flex items-center justify-center">
              <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span>Withdraw Money</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="amount" className="text-sm text-white">Amount to Withdraw ({walletCurrency})</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-base sm:text-lg font-semibold bg-gray-800/60 border-gray-600/50 text-white placeholder-gray-400 mt-1"
            />
            <p className="text-xs text-gray-400 mt-1">Available: {walletCurrency} {walletBalance.toLocaleString()}</p>
          </div>

          <Tabs defaultValue="mobile" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4 h-auto bg-gray-800/60 border-gray-600/50">
              <TabsTrigger value="mobile" className="text-xs p-2 text-white data-[state=active]:bg-gray-700/60">Mobile</TabsTrigger>
              <TabsTrigger value="bank" className="text-xs p-2 text-white data-[state=active]:bg-gray-700/60">Bank</TabsTrigger>
              <TabsTrigger value="agent" className="text-xs p-2 text-white data-[state=active]:bg-gray-700/60">Agent</TabsTrigger>
            </TabsList>

            <TabsContent value="mobile" className="space-y-4">
              <div>
                <Label className="text-white">Mobile Number</Label>
                <Input
                  placeholder="Enter mobile number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="bg-gray-800/60 border-gray-600/50 text-white placeholder-gray-400 mt-1"
                />
              </div>
              <div>
                <Label className="text-white">Select Provider</Label>
                <Select onValueChange={setSelectedMethod}>
                  <SelectTrigger className="bg-gray-800/60 border-gray-600/50 text-white">
                    <SelectValue placeholder="Choose provider" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    {mobileMoneyProviders.map((provider) => (
                      <SelectItem key={provider} value={provider} className="text-white">{provider}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                className="w-full bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white font-semibold"
                onClick={handleWithdraw}
                disabled={!selectedMethod || !accountNumber || !amount || isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Withdraw to Mobile Money'}
              </Button>
            </TabsContent>

            <TabsContent value="bank" className="space-y-4">
              <div>
                <Label className="text-white">Account Number</Label>
                <Input
                  placeholder="Enter bank account number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="bg-gray-800/60 border-gray-600/50 text-white placeholder-gray-400 mt-1"
                />
              </div>
              <div>
                <Label className="text-white">Select Bank</Label>
                <Select onValueChange={setSelectedMethod}>
                  <SelectTrigger className="bg-gray-800/60 border-gray-600/50 text-white">
                    <SelectValue placeholder="Choose bank" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    {banks.map((bank) => (
                      <SelectItem key={bank} value={bank} className="text-white">{bank}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                className="w-full bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white font-semibold"
                onClick={handleWithdraw}
                disabled={!selectedMethod || !accountNumber || !amount || isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Withdraw to Bank'}
              </Button>
            </TabsContent>

            <TabsContent value="agent" className="space-y-4">
              <div>
                <Label className="text-white">Agent Account Number</Label>
                <Input
                  placeholder="Enter agent account number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="bg-gray-800/60 border-gray-600/50 text-white placeholder-gray-400 mt-1"
                />
              </div>
              <div>
                <Label className="text-white">Reference Number (Optional)</Label>
                <Input
                  placeholder="Enter reference number"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  className="bg-gray-800/60 border-gray-600/50 text-white placeholder-gray-400 mt-1"
                />
              </div>
              <Button 
                className="w-full bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white font-semibold"
                onClick={() => {
                  setSelectedMethod('Agent Withdrawal');
                  handleWithdraw();
                }}
                disabled={!accountNumber || !amount || isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Withdraw via Agent'}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
