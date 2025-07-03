import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, Smartphone, Building, User, CheckCircle, QrCode, Link, Share2, Copy, ArrowLeft } from 'lucide-react';
import { TransactionConfirmation } from './TransactionConfirmation';
import { useLanguage } from '@/utils/languageApi';

interface DepositSectionProps {
  onBalanceUpdate?: (currency: string, amount: number) => void;
  onTransactionUpdate?: (transaction: any) => void;
  onBack?: () => void;
}

export const DepositSection = ({ onBalanceUpdate, onTransactionUpdate, onBack }: DepositSectionProps) => {
  const { t } = useLanguage();
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [paymentLink, setPaymentLink] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);
  const [agentAccount, setAgentAccount] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);

  const [transactionModal, setTransactionModal] = useState({
    isOpen: false,
    showSuccess: false,
    transaction: null as any
  });

  const mobileMoneyProviders = [
    { name: 'TNM Mpamba', fee: '1%', logo: '📱', prefix: '088' },
    { name: 'Airtel Money', fee: '1.2%', logo: '📱', prefix: '099' },
    { name: 'MO626', fee: '0.8%', logo: '🏦', prefix: '085' }
  ];

  const banks = [
    'Standard Bank', 'FDH Bank', 'NBS Bank', 'National Bank',
    'CDH Investment Bank', 'Centenary Bank', 'FCB'
  ];

  const agents = [
    { name: 'NeoVault Agent Network', description: 'Find agents nationwide' },
    { name: 'Authorized Money Transfer Agent', description: 'Licensed agents only' },
    { name: 'Community Banking Agent', description: 'Local community agents' }
  ];

  const processDeposit = async (method: string) => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const depositAmount = parseFloat(amount);
    const fee = depositAmount * 0.01; // 1% fee
    const total = depositAmount + fee;

    // Show transaction confirmation
    setTransactionModal({
      isOpen: true,
      showSuccess: false,
      transaction: {
        type: t('deposit'),
        amount: `MWK ${depositAmount.toLocaleString()}`,
        recipient: method,
        reference: `DEP${Date.now()}`,
        fee: fee > 0 ? `MWK ${fee.toLocaleString()}` : 'FREE',
        total: `MWK ${total.toLocaleString()}`
      }
    });
  };

  const confirmTransaction = () => {
    setLoading(true);
    
    // Simulate processing delay
    setTimeout(() => {
      const depositAmount = parseFloat(amount);
      
      // Update wallet balance
      if (onBalanceUpdate) {
        onBalanceUpdate('MWK', depositAmount);
      }

      // Add to transaction history
      if (onTransactionUpdate) {
        onTransactionUpdate({
          type: t('deposit'),
          amount: `+MWK ${depositAmount.toLocaleString()}`,
          description: `${t('deposit')} via ${selectedMethod}`,
          time: 'Just now',
          status: 'completed'
        });
      }
      
      setLoading(false);
      
      // Show success
      setTransactionModal(prev => ({ ...prev, showSuccess: true }));
      
      // Reset form
      setAmount('');
      setSelectedMethod('');
      setMobileNumber('');
      setBankAccount('');
      setSelectedBank('');
      setCardNumber('');
      setExpiryDate('');
      setCvv('');
      setAgentAccount('');
    }, 2000);
  };

  const closeTransactionModal = () => {
    setTransactionModal({
      isOpen: false,
      showSuccess: false,
      transaction: null
    });
  };

  const generatePaymentLink = () => {
    const link = `https://neovault.app/pay?amount=${amount}&id=${Math.random().toString(36).substring(7)}`;
    setPaymentLink(link);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
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
          <h2 className="text-2xl font-bold text-white">{t('deposit')} {t('currency')}</h2>
        </div>
      )}

      <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-2xl">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2 text-base sm:text-lg text-white">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span>{t('deposit')} {t('currency')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="amount" className="text-sm text-white">{t('amount')} to {t('deposit')}</Label>
            <Input
              id="amount"
              type="number"
              placeholder={`${t('enterAmount')} in MWK`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-base sm:text-lg font-semibold bg-gray-800/60 border-gray-600/50 text-white placeholder-gray-400 mt-1"
            />
          </div>

          <Tabs defaultValue="mobile" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-4 h-auto bg-gray-800/60 border-gray-600/50">
              <TabsTrigger value="mobile" className="text-xs p-2 text-white data-[state=active]:bg-gray-700/60">Mobile</TabsTrigger>
              <TabsTrigger value="bank" className="text-xs p-2 text-white data-[state=active]:bg-gray-700/60">Bank</TabsTrigger>
              <TabsTrigger value="agent" className="text-xs p-2 text-white data-[state=active]:bg-gray-700/60">Agent</TabsTrigger>
              <TabsTrigger value="card" className="text-xs p-2 text-white data-[state=active]:bg-gray-700/60">Card</TabsTrigger>
              <TabsTrigger value="request" className="text-xs p-2 text-white data-[state=active]:bg-gray-700/60">Request</TabsTrigger>
            </TabsList>

            <TabsContent value="mobile" className="space-y-4">
              <div>
                <Label className="text-white">Mobile Number</Label>
                <Input
                  placeholder="Enter mobile number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="bg-gray-800/60 border-gray-600/50 text-white placeholder-gray-400 mt-1"
                />
              </div>
              <div className="grid gap-3">
                {mobileMoneyProviders.map((provider, index) => (
                  <div 
                    key={index}
                    onClick={() => setSelectedMethod(provider.name)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                      selectedMethod === provider.name 
                        ? 'border-blue-400/50 bg-blue-500/20' 
                        : 'border-gray-600/50 bg-gray-800/40 hover:bg-gray-700/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{provider.logo}</span>
                        <div>
                          <p className="font-medium text-white">{provider.name}</p>
                          <p className="text-sm text-gray-300">Fee: {provider.fee}</p>
                        </div>
                      </div>
                      {selectedMethod === provider.name && (
                        <CheckCircle className="w-5 h-5 text-blue-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <Button 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold"
                onClick={() => processDeposit(`Mobile Money (${selectedMethod})`)}
                disabled={!selectedMethod || !mobileNumber || !amount || loading}
              >
                {loading ? t('processing') : 'Continue with Mobile Money'}
              </Button>
            </TabsContent>

            <TabsContent value="bank" className="space-y-4">
              <div>
                <Label className="text-white">Select Bank</Label>
                <Select value={selectedBank} onValueChange={setSelectedBank}>
                  <SelectTrigger className="bg-gray-800/60 border-gray-600/50 text-white">
                    <SelectValue placeholder="Choose your bank" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    {banks.map((bank) => (
                      <SelectItem key={bank} value={bank} className="text-white">{bank}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="account" className="text-white">Account Number</Label>
                <Input 
                  id="account" 
                  placeholder="Enter your account number"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  className="bg-gray-800/60 border-gray-600/50 text-white placeholder-gray-400"
                />
              </div>
              <Button 
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold"
                onClick={() => processDeposit(`Bank Transfer (${selectedBank})`)}
                disabled={!selectedBank || !bankAccount || !amount || loading}
              >
                {loading ? t('processing') : 'Initiate Bank Transfer'}
              </Button>
            </TabsContent>

            <TabsContent value="agent" className="space-y-4">
              <div>
                <Label htmlFor="agentAccount" className="text-white">Agent Account Number</Label>
                <Input
                  id="agentAccount"
                  placeholder="Enter agent account number"
                  value={agentAccount}
                  onChange={(e) => setAgentAccount(e.target.value)}
                  className="bg-gray-800/60 border-gray-600/50 text-white placeholder-gray-400"
                />
              </div>
              <div className="space-y-3">
                {agents.map((agent, index) => (
                  <div key={index} className="p-3 sm:p-4 rounded-lg border border-gray-600/50 bg-gray-800/40">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 mt-1" />
                        <div>
                          <p className="font-medium text-sm sm:text-base text-white">{agent.name}</p>
                          <p className="text-xs sm:text-sm text-gray-300">{agent.description}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="ml-2 border-gray-600/50 text-white hover:bg-gray-700/50">Select</Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold"
                onClick={() => processDeposit('Agent Deposit')}
                disabled={!agentAccount || !amount || loading}
              >
                {loading ? t('processing') : 'Deposit via Agent'}
              </Button>
            </TabsContent>

            <TabsContent value="card" className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xs">MC</span>
                </div>
                <span className="text-sm font-medium text-white">Mastercard</span>
              </div>
              <div>
                <Label htmlFor="cardNumber" className="text-white">Card Number</Label>
                <Input 
                  id="cardNumber" 
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="bg-gray-800/60 border-gray-600/50 text-white placeholder-gray-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry" className="text-white">Expiry Date</Label>
                  <Input 
                    id="expiry" 
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="bg-gray-800/60 border-gray-600/50 text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <Label htmlFor="cvv" className="text-white">CVV</Label>
                  <Input 
                    id="cvv" 
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    className="bg-gray-800/60 border-gray-600/50 text-white placeholder-gray-400"
                  />
                </div>
              </div>
              <Button 
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold"
                onClick={() => processDeposit('Card Deposit')}
                disabled={!cardNumber || !expiryDate || !cvv || !amount || loading}
              >
                {loading ? t('processing') : 'Add Card & Deposit'}
              </Button>
            </TabsContent>

            <TabsContent value="request" className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold mb-2 text-white">Request Money</h3>
                <p className="text-sm text-gray-300">Generate QR code or payment link to receive money</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4 bg-gray-800/60 border-gray-600/50">
                  <div className="text-center space-y-4">
                    <QrCode className="w-16 h-16 mx-auto text-blue-400" />
                    <h4 className="font-semibold text-white">QR Code</h4>
                    <p className="text-xs text-gray-300">Let others scan to pay you</p>
                    <Button 
                      onClick={() => setShowQRCode(true)}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600"
                      disabled={!amount}
                    >
                      Generate QR Code
                    </Button>
                  </div>
                </Card>

                <Card className="p-4 bg-gray-800/60 border-gray-600/50">
                  <div className="text-center space-y-4">
                    <Link className="w-16 h-16 mx-auto text-cyan-400" />
                    <h4 className="font-semibold text-white">Payment Link</h4>
                    <p className="text-xs text-gray-300">Share a link to receive payment</p>
                    <Button 
                      onClick={generatePaymentLink}
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-600"
                      disabled={!amount}
                    >
                      Generate Link
                    </Button>
                  </div>
                </Card>
              </div>

              {paymentLink && (
                <Card className="p-4 bg-cyan-500/10 border-cyan-400/30">
                  <div className="space-y-3">
                    <Label className="text-white">Your Payment Link</Label>
                    <div className="flex items-center space-x-2">
                      <Input value={paymentLink} readOnly className="flex-1 bg-gray-800/60 border-gray-600/50 text-white" />
                      <Button size="sm" onClick={() => copyToClipboard(paymentLink)} className="bg-cyan-500 hover:bg-cyan-600">
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              {showQRCode && amount && (
                <Card className="p-6 bg-white text-center border-gray-600/50">
                  <div className="w-48 h-48 mx-auto bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                    <QrCode className="w-24 h-24 text-white" />
                  </div>
                  <p className="text-lg font-semibold text-gray-800">MWK {amount}</p>
                  <p className="text-sm text-gray-600">Scan to pay via NeoVault</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setShowQRCode(false)}
                  >
                    {t('close')}
                  </Button>
                </Card>
              )}
            </TabsContent>
          </Tabs>
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
