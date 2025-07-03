
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, Users, Smartphone, Building, User, ArrowLeft } from 'lucide-react';

interface SendSectionProps {
  onBalanceUpdate?: (currency: string, amount: number) => void;
  onTransactionUpdate?: (transaction: any) => void;
  onBack?: () => void;
}

export const SendSection = ({ onBalanceUpdate, onTransactionUpdate, onBack }: SendSectionProps) => {
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [recipient, setRecipient] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [mobileMoneyProvider, setMobileMoneyProvider] = useState('');
  const [transactionFee, setTransactionFee] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const sendMethods = [
    { name: 'Mobile Money', icon: Smartphone },
    { name: 'NeoVault User', icon: User },
    { name: 'Bank Transfer', icon: Building },
    { name: 'Bulk Transfer', icon: Users }
  ];

  const mobileMoneyProviders = [
    { name: 'TNM Mpamba', fee: '1%', prefix: '088' },
    { name: 'Airtel Money', fee: '1.2%', prefix: '099' },
    { name: 'MO626', fee: '0.8%', prefix: '085' }
  ];

  const banks = [
    'Standard Bank', 'FDH Bank', 'NBS Bank', 'National Bank',
    'CDH Investment Bank', 'Centenary Bank', 'FCB'
  ];

  const calculateFee = (amount: number) => {
    const fee = amount * 0.01; // 1% transaction fee
    setTransactionFee(fee);
    setTotalAmount(amount + fee);
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
    if (value) {
      calculateFee(parseFloat(value));
    } else {
      setTransactionFee(0);
      setTotalAmount(0);
    }
  };

  const handleSendMoney = async () => {
    if (!amount || !recipient) {
      alert('Please fill in all required fields.');
      return;
    }

    // Validate mobile money specific fields
    if (selectedMethod === 'mobile' && (!recipientPhone || !mobileMoneyProvider)) {
      alert('Please enter recipient phone number and select mobile money provider.');
      return;
    }

    setIsProcessing(true);

    // Simulate processing delay
    setTimeout(() => {
      const sendAmount = parseFloat(amount);

      // Update wallet balance
      if (onBalanceUpdate) {
        onBalanceUpdate('MWK', -totalAmount);
      }

      // Add to transaction history
      if (onTransactionUpdate) {
        const description = selectedMethod === 'mobile' 
          ? `Sent to ${recipientPhone} via ${mobileMoneyProvider}`
          : `Sent to ${recipient} via ${selectedMethod}`;
        
        onTransactionUpdate({
          type: 'Send Money',
          amount: `-MWK ${sendAmount.toLocaleString()}`,
          description: description,
          time: 'Just now',
          status: 'completed'
        });
      }

      setIsProcessing(false);

      // Show success message
      const successMessage = selectedMethod === 'mobile'
        ? `Successfully sent MWK ${sendAmount.toLocaleString()} to ${recipientPhone} via ${mobileMoneyProvider}`
        : `Successfully sent MWK ${sendAmount.toLocaleString()} to ${recipient}`;
      
      alert(successMessage);

      // Reset form
      setAmount('');
      setRecipient('');
      setRecipientPhone('');
      setMobileMoneyProvider('');
      setSelectedMethod('');
      setTransactionFee(0);
      setTotalAmount(0);
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
          <h2 className="text-xl sm:text-2xl font-bold text-white">Send Money</h2>
        </div>
      )}

      <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-2xl">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2 text-base sm:text-lg text-white">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Send className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span>Send Money</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="amount" className="text-sm text-white">Amount to Send (MWK)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              className="text-base sm:text-lg font-semibold bg-gray-800/60 border-gray-600/50 text-white placeholder-gray-400 mt-1"
            />
          </div>

          <Tabs value={selectedMethod} onValueChange={setSelectedMethod} className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-4 h-auto bg-gray-800/60 border-gray-600/50">
              <TabsTrigger 
                value="mobile"
                className="text-xs sm:text-sm p-2 text-white data-[state=active]:bg-gray-700/60"
              >
                <span className="hidden sm:inline">Mobile Money</span>
                <span className="sm:hidden">Mobile</span>
              </TabsTrigger>
              <TabsTrigger 
                value="neovault"
                className="text-xs sm:text-sm p-2 text-white data-[state=active]:bg-gray-700/60"
              >
                <span className="hidden sm:inline">NeoVault User</span>
                <span className="sm:hidden">NeoVault</span>
              </TabsTrigger>
              <TabsTrigger 
                value="bank"
                className="text-xs sm:text-sm p-2 text-white data-[state=active]:bg-gray-700/60"
              >
                <span className="hidden sm:inline">Bank Transfer</span>
                <span className="sm:hidden">Bank</span>
              </TabsTrigger>
              <TabsTrigger 
                value="bulk"
                className="text-xs sm:text-sm p-2 text-white data-[state=active]:bg-gray-700/60"
              >
                <span className="hidden sm:inline">Bulk Transfer</span>
                <span className="sm:hidden">Bulk</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="mobile" className="space-y-4">
              <div>
                <Label className="text-white text-sm">Recipient Phone Number</Label>
                <Input
                  placeholder="Enter recipient's mobile number"
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  className="bg-gray-800/60 border-gray-600/50 text-white placeholder-gray-400 mt-1"
                />
              </div>
              <div>
                <Label className="text-white text-sm">Select Mobile Money Provider</Label>
                <Select value={mobileMoneyProvider} onValueChange={setMobileMoneyProvider}>
                  <SelectTrigger className="bg-gray-800/60 border-gray-600/50 text-white mt-1">
                    <SelectValue placeholder="Choose provider" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    {mobileMoneyProviders.map((provider) => (
                      <SelectItem key={provider.name} value={provider.name} className="text-white">
                        {provider.name} - Fee: {provider.fee}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="neovault" className="space-y-4">
              <div>
                <Label className="text-white text-sm">NeoVault Username/Email</Label>
                <Input
                  placeholder="Enter recipient's username or email"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="bg-gray-800/60 border-gray-600/50 text-white placeholder-gray-400 mt-1"
                />
              </div>
            </TabsContent>

            <TabsContent value="bank" className="space-y-4">
              <div>
                <Label className="text-white text-sm">Bank Account Number</Label>
                <Input
                  placeholder="Enter recipient's bank account number"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="bg-gray-800/60 border-gray-600/50 text-white placeholder-gray-400 mt-1"
                />
              </div>
              <div>
                <Label className="text-white text-sm">Select Bank</Label>
                <Select onValueChange={setSelectedMethod}>
                  <SelectTrigger className="bg-gray-800/60 border-gray-600/50 text-white mt-1">
                    <SelectValue placeholder="Choose bank" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    {banks.map((bank) => (
                      <SelectItem key={bank} value={bank} className="text-white">{bank}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="bulk" className="space-y-4">
              <div>
                <Label className="text-white text-sm">Upload CSV File</Label>
                <Input
                  type="file"
                  className="bg-gray-800/60 border-gray-600/50 text-white placeholder-gray-400 mt-1"
                />
              </div>
            </TabsContent>
          </Tabs>

          {transactionFee > 0 && (
            <div className="bg-gray-800/40 p-3 rounded-lg border border-gray-600/30">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Transaction Fee:</span>
                <span className="text-white">MWK {transactionFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-base font-semibold border-t border-gray-600/30 pt-2 mt-2">
                <span className="text-white">Total:</span>
                <span className="text-white">MWK {totalAmount.toLocaleString()}</span>
              </div>
            </div>
          )}

          <Button
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold"
            onClick={handleSendMoney}
            disabled={isProcessing || !amount || (selectedMethod === 'mobile' ? (!recipientPhone || !mobileMoneyProvider) : !recipient)}
          >
            {isProcessing ? 'Processing...' : 'Send Money'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
