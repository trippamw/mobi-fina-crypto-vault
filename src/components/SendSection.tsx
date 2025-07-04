
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, Smartphone, Building, User, ArrowLeft } from 'lucide-react';
import { TransactionConfirmation } from './TransactionConfirmation';
import { useUserData } from '@/hooks/useUserData';
import { apiService } from '@/lib/api';

interface SendSectionProps {
  onBalanceUpdate?: (currency: string, amount: number) => void;
  onTransactionUpdate?: (transaction: any) => void;
  onBack?: () => void;
}

export const SendSection = ({ onBalanceUpdate, onTransactionUpdate, onBack }: SendSectionProps) => {
  const { wallets, refreshData } = useUserData();
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [recipient, setRecipient] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [mobileMoneyProvider, setMobileMoneyProvider] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [transactionFee, setTransactionFee] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const [transactionModal, setTransactionModal] = useState({
    isOpen: false,
    showSuccess: false,
    transaction: null as any
  });

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
    if (!amount || !selectedMethod) {
      alert('Please fill in all required fields.');
      return;
    }

    // Validate method-specific fields
    if (selectedMethod === 'mobile' && (!recipientPhone || !mobileMoneyProvider)) {
      alert('Please enter recipient phone number and select mobile money provider.');
      return;
    }

    if (selectedMethod === 'neovault' && !recipient) {
      alert('Please enter recipient username or email.');
      return;
    }

    if (selectedMethod === 'bank' && (!recipient || !selectedBank)) {
      alert('Please enter bank account number and select bank.');
      return;
    }

    const sendAmount = parseFloat(amount);
    let recipientInfo = '';
    let methodInfo = '';

    // Set recipient info based on method
    switch (selectedMethod) {
      case 'mobile':
        recipientInfo = recipientPhone;
        methodInfo = mobileMoneyProvider;
        break;
      case 'neovault':
        recipientInfo = recipient;
        methodInfo = 'NeoVault User';
        break;
      case 'bank':
        recipientInfo = recipient;
        methodInfo = selectedBank;
        break;
      default:
        recipientInfo = recipient;
        methodInfo = selectedMethod;
    }

    // Show transaction confirmation
    setTransactionModal({
      isOpen: true,
      showSuccess: false,
      transaction: {
        type: 'Send Money',
        amount: `MWK ${sendAmount.toLocaleString()}`,
        recipient: recipientInfo,
        reference: `SEND${Date.now()}`,
        fee: `MWK ${transactionFee.toFixed(2)}`,
        total: `MWK ${totalAmount.toFixed(2)}`,
        returnTo: 'Send Money'
      }
    });
  };

  const confirmTransaction = async () => {
    setIsProcessing(true);
    
    try {
      const sendAmount = parseFloat(amount);
      
      // Get recipient user ID - for now using a mock ID, in real app you'd lookup by email/phone
      const toUserId = 'recipient-user-id'; // This should be looked up from recipient email/phone
      
      // Get sender's MWK wallet
      const mwkWallet = wallets.find(w => w.currency_code === 'MWK');
      if (!mwkWallet) {
        throw new Error('MWK wallet not found');
      }

      // Call the actual backend API
      const result = await apiService.send(
        mwkWallet.id,
        toUserId,
        sendAmount,
        'MWK',
        `Send to ${recipient || recipientPhone}`
      );

      // Refresh user data to get updated balances
      refreshData();

      // Add to transaction history
      if (onTransactionUpdate) {
        let description = '';
        switch (selectedMethod) {
          case 'mobile':
            description = `Sent to ${recipientPhone} via ${mobileMoneyProvider}`;
            break;
          case 'neovault':
            description = `Sent to ${recipient} via NeoVault`;
            break;
          case 'bank':
            description = `Sent to ${recipient} via ${selectedBank}`;
            break;
          default:
            description = `Sent to ${recipient}`;
        }
        
        onTransactionUpdate({
          type: 'Send Money',
          amount: `-MWK ${sendAmount.toLocaleString()}`,
          description: description,
          time: 'Just now',
          status: 'completed'
        });
      }

      // Show success
      setTransactionModal(prev => ({ ...prev, showSuccess: true }));

      // Reset form
      setAmount('');
      setRecipient('');
      setRecipientPhone('');
      setMobileMoneyProvider('');
      setSelectedBank('');
      setSelectedMethod('');
      setTransactionFee(0);
      setTotalAmount(0);
      
    } catch (error) {
      console.error('Send error:', error);
      alert(`Send failed: ${error.message}`);
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
            <TabsList className="grid w-full grid-cols-3 mb-4 h-auto bg-gray-800/60 border-gray-600/50">
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
                <Select value={selectedBank} onValueChange={setSelectedBank}>
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
          </Tabs>

          {transactionFee > 0 && (
            <div className="bg-gray-800/40 p-3 rounded-lg border border-gray-600/30">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Transaction Fee:</span>
                <span className="text-white">MWK {transactionFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold border-t border-gray-600/30 pt-2 mt-2">
                <span className="text-white">Total:</span>
                <span className="text-white">MWK {totalAmount.toFixed(2)}</span>
              </div>
            </div>
          )}

          <Button
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold"
            onClick={handleSendMoney}
            disabled={isProcessing || !amount || !selectedMethod}
          >
            {isProcessing ? 'Processing...' : 'Send Money'}
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
