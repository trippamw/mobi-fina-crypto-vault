
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus, Send, Settings, Trash2, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { TransactionConfirmation } from '@/components/TransactionConfirmation';
import { useLanguage } from '@/utils/languageApi';
import { useToast } from '@/hooks/use-toast';

interface WalletManagementProps {
  wallet: any;
  onBack: () => void;
  onBalanceUpdate: (currency: string, amount: number) => void;
  onTransactionUpdate: (transaction: any) => void;
}

export const WalletManagement = ({ wallet, onBack, onBalanceUpdate, onTransactionUpdate }: WalletManagementProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [depositAmount, setDepositAmount] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [selectedDepositMethod, setSelectedDepositMethod] = useState('');
  const [selectedSendMethod, setSelectedSendMethod] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [agentCode, setAgentCode] = useState('');
  const [sourceWallet, setSourceWallet] = useState('');
  const [isWalletFrozen, setIsWalletFrozen] = useState(false);
  const [dailyLimit, setDailyLimit] = useState('100000');
  const [monthlyLimit, setMonthlyLimit] = useState('1000000');
  const [balanceVisible, setBalanceVisible] = useState(true);
  
  const [transactionModal, setTransactionModal] = useState({
    isOpen: false,
    showSuccess: false,
    transaction: null as any
  });

  const mobileMoneyProviders = [
    { name: 'TNM Mpamba', fee: '1%', code: 'tnm' },
    { name: 'Airtel Money', fee: '1.2%', code: 'airtel' },
    { name: 'MO626', fee: '0.8%', code: 'mo626' }
  ];

  const banks = [
    'Standard Bank', 'FDH Bank', 'NBS Bank', 'National Bank',
    'CDH Investment Bank', 'Centenary Bank', 'FCB'
  ];

  const mockWallets = [
    { currency: 'MWK', balance: 50000 },
    { currency: 'USD', balance: 1000 },
    { currency: 'BTC', balance: 0.05 },
    { currency: 'ETH', balance: 2.5 }
  ];

  const isCrypto = wallet.currency === 'BTC' || wallet.currency === 'ETH' || wallet.currency === 'USDT' || wallet.currency === 'USDC';
  const isFiat = !isCrypto;

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (amount <= 0) {
      toast({
        title: t('error'),
        description: 'Please enter a valid amount',
        variant: 'destructive'
      });
      return;
    }

    if (isFiat) {
      if (!selectedDepositMethod) {
        toast({
          title: t('error'),
          description: 'Please select a deposit method',
          variant: 'destructive'
        });
        return;
      }
      
      if (selectedDepositMethod === 'mobile' && (!mobileNumber || !selectedProvider)) {
        toast({
          title: t('error'),
          description: 'Please enter your mobile number and select a provider',
          variant: 'destructive'
        });
        return;
      }
      
      if (selectedDepositMethod === 'bank' && (!selectedBank || !accountNumber)) {
        toast({
          title: t('error'),
          description: 'Please select a bank and enter account number',
          variant: 'destructive'
        });
        return;
      }

      if (selectedDepositMethod === 'agent' && !agentCode) {
        toast({
          title: t('error'),
          description: 'Please enter agent code',
          variant: 'destructive'
        });
        return;
      }
    } else {
      if (!sourceWallet) {
        toast({
          title: t('error'),
          description: 'Please select source wallet',
          variant: 'destructive'
        });
        return;
      }
    }

    const fee = isCrypto ? '0.001 ETH' : selectedDepositMethod === 'mobile' ? 
      mobileMoneyProviders.find(p => p.code === selectedProvider)?.fee || 'FREE' : 'FREE';
    
    setTransactionModal({
      isOpen: true,
      showSuccess: false,
      transaction: {
        type: t('deposit'),
        amount: `+${wallet.currency} ${amount.toLocaleString()}`,
        recipient: `${wallet.currency} ${t('wallet')}`,
        fee: fee,
        total: `${wallet.currency} ${amount.toLocaleString()}`,
        returnTo: 'Wallet'
      }
    });
  };

  const handleSend = () => {
    const amount = parseFloat(sendAmount);
    if (amount <= 0) {
      toast({
        title: t('error'),
        description: 'Please enter a valid amount',
        variant: 'destructive'
      });
      return;
    }

    if (amount > wallet.balance) {
      toast({
        title: t('error'),
        description: 'Insufficient balance',
        variant: 'destructive'
      });
      return;
    }

    if (!recipientAddress) {
      toast({
        title: t('error'),
        description: 'Please enter recipient information',
        variant: 'destructive'
      });
      return;
    }

    if (!selectedSendMethod) {
      toast({
        title: t('error'),
        description: 'Please select a send method',
        variant: 'destructive'
      });
      return;
    }
    
    if (selectedSendMethod === 'bank' && !accountNumber) {
      toast({
        title: t('error'),
        description: 'Please enter account number',
        variant: 'destructive'
      });
      return;
    }

    const fee = 'FREE';
    
    setTransactionModal({
      isOpen: true,
      showSuccess: false,
      transaction: {
        type: t('send'),
        amount: `-${wallet.currency} ${amount.toLocaleString()}`,
        recipient: recipientAddress,
        fee: fee,
        total: `-${wallet.currency} ${amount.toLocaleString()}`,
        returnTo: 'Wallet'
      }
    });
  };

  const confirmTransaction = () => {
    setTimeout(() => {
      const transaction = transactionModal.transaction;
      if (transaction.type === t('deposit')) {
        let convertedAmount = parseFloat(depositAmount);
        
        if (isCrypto && sourceWallet) {
          // Define conversion rates properly
          const conversionRates: { [key: string]: { [key: string]: number } } = {
            'BTC': { 'MWK': 0.000000015, 'USD': 0.000025 },
            'ETH': { 'MWK': 0.0000003, 'USD': 0.0005 }
          };
          
          const rate = conversionRates[wallet.currency]?.[sourceWallet] || 1;
          const sourceAmount = convertedAmount / rate;
          // In a real app, you would deduct from the source wallet here
        }
        
        onBalanceUpdate(wallet.currency, convertedAmount);
        setDepositAmount('');
        setSelectedDepositMethod('');
        setMobileNumber('');
        setSelectedBank('');
        setAccountNumber('');
        setSelectedProvider('');
        setAgentCode('');
        setSourceWallet('');
      } else if (transaction.type === t('send')) {
        onBalanceUpdate(wallet.currency, -parseFloat(sendAmount));
        setSendAmount('');
        setRecipientAddress('');
        setSelectedSendMethod('');
        setAccountNumber('');
      }
      
      onTransactionUpdate({
        type: transaction.type,
        amount: transaction.amount,
        description: `${transaction.type} - ${wallet.currency} ${t('wallet')}`,
        time: 'Just now',
        status: 'completed'
      });

      setTransactionModal(prev => ({ ...prev, showSuccess: true }));
    }, 1000);
  };

  const handleSettingsUpdate = () => {
    toast({
      title: t('success'),
      description: 'Wallet settings updated successfully',
    });
  };

  const formatBalance = (balance: number, currency: string) => {
    if (currency === 'BTC') {
      return `${balance.toFixed(6)} BTC`;
    } else if (currency === 'ETH') {
      return `${balance.toFixed(4)} ETH`;
    } else if (currency === 'USDT' || currency === 'USDC') {
      return `${balance.toLocaleString()} ${currency}`;
    } else if (currency === 'MWK') {
      return `MWK ${balance.toLocaleString()}`;
    } else if (currency === 'USD') {
      return `$${balance.toLocaleString()}`;
    } else if (currency === 'GBP') {
      return `£${balance.toLocaleString()}`;
    } else if (currency === 'EUR') {
      return `€${balance.toLocaleString()}`;
    } else if (currency === 'ZAR') {
      return `R${balance.toLocaleString()}`;
    } else {
      return `${balance.toLocaleString()} ${currency}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-3 pb-24">
      <div className="container mx-auto max-w-lg space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-lg font-bold text-white text-center flex-1">
            {wallet.currency} {t('wallet')}
          </h1>
          <div className="w-16"></div>
        </div>

        {/* Wallet Overview Card */}
        <Card className={`${wallet.gradient} border-gray-600/50 shadow-xl`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">💰</div>
                <div>
                  <h3 className="text-lg font-bold text-white">{wallet.currency}</h3>
                  <p className="text-sm text-white/70">{t('balance')}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setBalanceVisible(!balanceVisible)}
                className="text-white/70 hover:text-white p-2"
              >
                {balanceVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </Button>
            </div>

            <div className="mb-4">
              <div className="text-2xl font-bold text-white mb-1">
                {balanceVisible ? formatBalance(wallet.balance, wallet.currency) : '••••••'}
              </div>
              {wallet.usdValue && (
                <div className="text-sm text-white/70">
                  ≈ ${wallet.usdValue.toLocaleString()} USD
                </div>
              )}
              <Badge className={`${wallet.change.startsWith('+') ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'} border-0 mt-2`}>
                {wallet.change}
              </Badge>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-2">
              <Button
                onClick={() => setActiveTab('deposit')}
                size="sm"
                className="bg-green-600/20 hover:bg-green-600/30 text-green-300 border-green-400/30 text-xs p-2"
              >
                <Plus className="w-3 h-3 mr-1" />
                {t('deposit')}
              </Button>
              {isFiat && (
                <Button
                  onClick={() => setActiveTab('send')}
                  size="sm"
                  className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border-blue-400/30 text-xs p-2"
                >
                  <Send className="w-3 h-3 mr-1" />
                  {t('send')}
                </Button>
              )}
              <Button
                onClick={() => setActiveTab('settings')}
                size="sm"
                className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border-purple-400/30 text-xs p-2"
              >
                <Settings className="w-3 h-3 mr-1" />
                {t('settings')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tab Navigation */}
        <div className="flex space-x-1 overflow-x-auto bg-gray-800/50 rounded-lg p-1">
          {['overview', 'deposit', ...(isFiat ? ['send'] : []), 'settings'].map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab(tab)}
              className={`${
                activeTab === tab 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              } text-xs px-3 py-2 whitespace-nowrap flex-1`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <Card className="bg-gray-900/90 backdrop-blur-xl border-gray-700/50 shadow-xl">
            <CardHeader className="p-4">
              <CardTitle className="text-white text-base">Wallet Information</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-800/50 p-3 rounded-lg">
                  <Label className="text-gray-400 text-xs">{t('currency')}</Label>
                  <p className="text-white font-semibold">{wallet.currency}</p>
                </div>
                <div className="bg-gray-800/50 p-3 rounded-lg">
                  <Label className="text-gray-400 text-xs">Status</Label>
                  <p className="text-green-400 font-semibold">Active</p>
                </div>
                <div className="bg-gray-800/50 p-3 rounded-lg">
                  <Label className="text-gray-400 text-xs">{t('balance')}</Label>
                  <p className="text-white font-semibold text-sm">{formatBalance(wallet.balance, wallet.currency)}</p>
                </div>
                <div className="bg-gray-800/50 p-3 rounded-lg">
                  <Label className="text-gray-400 text-xs">24h Change</Label>
                  <p className={`font-semibold text-sm ${wallet.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                    {wallet.change}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'deposit' && (
          <Card className="bg-gray-900/90 backdrop-blur-xl border-gray-700/50 shadow-xl">
            <CardHeader className="p-4">
              <CardTitle className="text-white text-base">{t('deposit')} {wallet.currency}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-4">
              <div>
                <Label htmlFor="depositAmount" className="text-white text-sm">{t('amount')}</Label>
                <Input
                  id="depositAmount"
                  type="number"
                  placeholder={`Enter ${wallet.currency} amount`}
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="bg-gray-800/60 border-gray-600/50 text-white placeholder-gray-400 mt-1"
                />
              </div>
              
              {isFiat && (
                <>
                  <div>
                    <Label className="text-white text-sm">Deposit Method</Label>
                    <Select value={selectedDepositMethod} onValueChange={setSelectedDepositMethod}>
                      <SelectTrigger className="bg-gray-800/60 border-gray-600/50 text-white mt-1">
                        <SelectValue placeholder="Select deposit method" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700 z-50">
                        <SelectItem value="mobile" className="text-white">Mobile Money</SelectItem>
                        <SelectItem value="bank" className="text-white">Bank Transfer</SelectItem>
                        <SelectItem value="agent" className="text-white">Agent Deposit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedDepositMethod === 'mobile' && (
                    <div className="space-y-3">
                      <div>
                        <Label className="text-white text-sm">Mobile Number</Label>
                        <Input
                          placeholder="Enter your mobile number"
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value)}
                          className="bg-gray-800/60 border-gray-600/50 text-white placeholder-gray-400 mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-white text-sm">Select Provider</Label>
                        <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                          <SelectTrigger className="bg-gray-800/60 border-gray-600/50 text-white mt-1">
                            <SelectValue placeholder="Choose mobile money provider" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-900 border-gray-700 z-50">
                            {mobileMoneyProviders.map((provider) => (
                              <SelectItem key={provider.code} value={provider.code} className="text-white">
                                {provider.name} (Fee: {provider.fee})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {selectedDepositMethod === 'bank' && (
                    <div className="space-y-3">
                      <div>
                        <Label className="text-white text-sm">Select Bank</Label>
                        <Select value={selectedBank} onValueChange={setSelectedBank}>
                          <SelectTrigger className="bg-gray-800/60 border-gray-600/50 text-white mt-1">
                            <SelectValue placeholder="Choose your bank" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-900 border-gray-700 z-50">
                            {banks.map((bank) => (
                              <SelectItem key={bank} value={bank} className="text-white">{bank}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-white text-sm">Account Number</Label>
                        <Input
                          placeholder="Enter your account number"
                          value={accountNumber}
                          onChange={(e) => setAccountNumber(e.target.value)}
                          className="bg-gray-800/60 border-gray-600/50 text-white placeholder-gray-400 mt-1"
                        />
                      </div>
                    </div>
                  )}

                  {selectedDepositMethod === 'agent' && (
                    <div>
                      <Label className="text-white text-sm">Agent Code</Label>
                      <Input
                        placeholder="Enter agent code"
                        value={agentCode}
                        onChange={(e) => setAgentCode(e.target.value)}
                        className="bg-gray-800/60 border-gray-600/50 text-white placeholder-gray-400 mt-1"
                      />
                    </div>
                  )}
                </>
              )}

              {isCrypto && (
                <div>
                  <Label className="text-white text-sm">Source Wallet</Label>
                  <Select value={sourceWallet} onValueChange={setSourceWallet}>
                    <SelectTrigger className="bg-gray-800/60 border-gray-600/50 text-white mt-1">
                      <SelectValue placeholder="Select wallet to debit from" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700 z-50">
                      {mockWallets.filter(w => w.currency !== wallet.currency).map((w) => (
                        <SelectItem key={w.currency} value={w.currency} className="text-white">
                          {w.currency} (Balance: {formatBalance(w.balance, w.currency)})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button 
                onClick={handleDeposit}
                disabled={!depositAmount || parseFloat(depositAmount) <= 0}
                className="w-full bg-green-600 hover:bg-green-700 mt-4"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t('deposit')} {wallet.currency}
              </Button>
            </CardContent>
          </Card>
        )}

        {activeTab === 'send' && isFiat && (
          <Card className="bg-gray-900/90 backdrop-blur-xl border-gray-700/50 shadow-xl">
            <CardHeader className="p-4">
              <CardTitle className="text-white text-base">{t('send')} {wallet.currency}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-4">
              <div>
                <Label htmlFor="sendAmount" className="text-white text-sm">{t('amount')}</Label>
                <Input
                  id="sendAmount"
                  type="number"
                  placeholder={`Enter ${wallet.currency} amount`}
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                  className="bg-gray-800/60 border-gray-600/50 text-white placeholder-gray-400 mt-1"
                />
              </div>
              <div>
                <Label htmlFor="recipientAddress" className="text-white text-sm">Recipient</Label>
                <Input
                  id="recipientAddress"
                  placeholder="Enter phone number or account"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  className="bg-gray-800/60 border-gray-600/50 text-white placeholder-gray-400 mt-1"
                />
              </div>

              <div>
                <Label className="text-white text-sm">Send Method</Label>
                <Select value={selectedSendMethod} onValueChange={setSelectedSendMethod}>
                  <SelectTrigger className="bg-gray-800/60 border-gray-600/50 text-white mt-1">
                    <SelectValue placeholder="Select send method" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700 z-50">
                    <SelectItem value="mobile" className="text-white">Mobile Money</SelectItem>
                    <SelectItem value="bank" className="text-white">Bank Transfer</SelectItem>
                    <SelectItem value="neovault" className="text-white">NeoVault User</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedSendMethod === 'bank' && (
                <div>
                  <Label className="text-white text-sm">Account Number</Label>
                  <Input
                    placeholder="Enter recipient account number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="bg-gray-800/60 border-gray-600/50 text-white placeholder-gray-400 mt-1"
                  />
                </div>
              )}

              <Button 
                onClick={handleSend}
                disabled={!sendAmount || !recipientAddress || parseFloat(sendAmount) <= 0 || parseFloat(sendAmount) > wallet.balance}
                className="w-full bg-blue-600 hover:bg-blue-700 mt-4"
              >
                <Send className="w-4 h-4 mr-2" />
                {t('send')} {wallet.currency}
              </Button>
              {parseFloat(sendAmount) > wallet.balance && (
                <p className="text-red-400 text-sm mt-2">Insufficient balance</p>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-4">
            <Card className="bg-gray-900/90 backdrop-blur-xl border-gray-700/50 shadow-xl">
              <CardHeader className="p-4">
                <CardTitle className="text-white text-base">Wallet Security</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-4">
                <div className="flex items-center justify-between bg-gray-800/50 p-3 rounded-lg">
                  <Label className="text-white text-sm">Freeze Wallet</Label>
                  <Switch checked={isWalletFrozen} onCheckedChange={setIsWalletFrozen} />
                </div>
                <p className="text-sm text-gray-400">
                  Freezing your wallet will prevent all transactions until unfrozen.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/90 backdrop-blur-xl border-gray-700/50 shadow-xl">
              <CardHeader className="p-4">
                <CardTitle className="text-white text-base">Transaction Limits</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-4">
                <div>
                  <Label className="text-white text-sm">Daily Limit ({wallet.currency})</Label>
                  <Input
                    type="number"
                    value={dailyLimit}
                    onChange={(e) => setDailyLimit(e.target.value)}
                    className="bg-gray-800/60 border-gray-600/50 text-white mt-1"
                  />
                </div>
                <div>
                  <Label className="text-white text-sm">Monthly Limit ({wallet.currency})</Label>
                  <Input
                    type="number"
                    value={monthlyLimit}
                    onChange={(e) => setMonthlyLimit(e.target.value)}
                    className="bg-gray-800/60 border-gray-600/50 text-white mt-1"
                  />
                </div>
                <Button onClick={handleSettingsUpdate} className="w-full bg-green-600 hover:bg-green-700">
                  Update Limits
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-red-900/20 border-red-500/20 shadow-xl">
              <CardHeader className="p-4">
                <CardTitle className="text-red-400 flex items-center text-base">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-4">
                <p className="text-gray-300 text-sm">
                  Deleting this wallet is permanent and cannot be undone. Make sure to transfer all funds first.
                </p>
                <Button variant="destructive" className="w-full bg-red-600 hover:bg-red-700">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Wallet
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Transaction Confirmation Modal */}
        <TransactionConfirmation
          isOpen={transactionModal.isOpen}
          onClose={() => setTransactionModal({ isOpen: false, showSuccess: false, transaction: null })}
          onConfirm={confirmTransaction}
          onSuccess={() => setTransactionModal({ isOpen: false, showSuccess: false, transaction: null })}
          transaction={transactionModal.transaction}
          showSuccess={transactionModal.showSuccess}
        />
      </div>
    </div>
  );
};
