
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Send, ArrowDownLeft, Settings, Trash2, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { TransactionConfirmation } from '@/components/TransactionConfirmation';

interface WalletManagementProps {
  wallet: any;
  onBack: () => void;
  onBalanceUpdate: (currency: string, amount: number) => void;
  onTransactionUpdate: (transaction: any) => void;
}

export const WalletManagement = ({ wallet, onBack, onBalanceUpdate, onTransactionUpdate }: WalletManagementProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [depositAmount, setDepositAmount] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [isWalletFrozen, setIsWalletFrozen] = useState(false);
  const [dailyLimit, setDailyLimit] = useState('100000');
  const [monthlyLimit, setMonthlyLimit] = useState('1000000');
  const [balanceVisible, setBalanceVisible] = useState(true);
  
  const [transactionModal, setTransactionModal] = useState({
    isOpen: false,
    showSuccess: false,
    transaction: null as any
  });

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (amount > 0) {
      setTransactionModal({
        isOpen: true,
        showSuccess: false,
        transaction: {
          type: 'Deposit',
          amount: `+${wallet.currency} ${amount.toLocaleString()}`,
          recipient: `${wallet.currency} Wallet`,
          fee: 'FREE',
          total: `${wallet.currency} ${amount.toLocaleString()}`
        }
      });
    }
  };

  const handleSend = () => {
    const amount = parseFloat(sendAmount);
    if (amount > 0 && recipientAddress) {
      setTransactionModal({
        isOpen: true,
        showSuccess: false,
        transaction: {
          type: 'Send',
          amount: `-${wallet.currency} ${amount.toLocaleString()}`,
          recipient: recipientAddress,
          fee: wallet.currency === 'BTC' || wallet.currency === 'ETH' ? '0.001 ETH' : 'FREE',
          total: `-${wallet.currency} ${amount.toLocaleString()}`
        }
      });
    }
  };

  const confirmTransaction = () => {
    setTimeout(() => {
      const transaction = transactionModal.transaction;
      if (transaction.type === 'Deposit') {
        onBalanceUpdate(wallet.currency, parseFloat(depositAmount));
        setDepositAmount('');
      } else if (transaction.type === 'Send') {
        onBalanceUpdate(wallet.currency, -parseFloat(sendAmount));
        setSendAmount('');
        setRecipientAddress('');
      }
      
      onTransactionUpdate({
        type: transaction.type,
        amount: transaction.amount,
        description: `${transaction.type} - ${wallet.currency} Wallet`,
        time: 'Just now',
        status: 'completed'
      });

      setTransactionModal(prev => ({ ...prev, showSuccess: true }));
    }, 1000);
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
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button
          onClick={onBack}
          variant="ghost"
          size="sm"
          className="text-white/70 hover:text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-2xl font-bold text-white">{wallet.currency} Wallet</h2>
      </div>

      {/* Wallet Overview */}
      <Card className={`${wallet.gradient} border-border/50 shadow-2xl`}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">💰</div>
              <div>
                <h3 className="text-xl font-bold text-white">{wallet.currency}</h3>
                <p className="text-sm text-white/70">Current Balance</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setBalanceVisible(!balanceVisible)}
              className="text-white/70 hover:text-white"
            >
              {balanceVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </Button>
          </div>

          <div className="mb-6">
            <div className="text-3xl font-bold text-white mb-2">
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
          <div className="grid grid-cols-3 gap-3">
            <Button
              onClick={() => setActiveTab('deposit')}
              className="bg-green-600/20 hover:bg-green-600/30 text-green-300 border-green-400/30"
            >
              <Plus className="w-4 h-4 mr-2" />
              Deposit
            </Button>
            <Button
              onClick={() => setActiveTab('send')}
              className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border-blue-400/30"
            >
              <Send className="w-4 h-4 mr-2" />
              Send
            </Button>
            <Button
              onClick={() => setActiveTab('settings')}
              className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border-purple-400/30"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <div className="flex space-x-2">
        <Button
          variant={activeTab === 'overview' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('overview')}
          className={activeTab === 'overview' ? 'bg-blue-600' : 'text-gray-300'}
        >
          Overview
        </Button>
        <Button
          variant={activeTab === 'deposit' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('deposit')}
          className={activeTab === 'deposit' ? 'bg-green-600' : 'text-gray-300'}
        >
          Deposit
        </Button>
        <Button
          variant={activeTab === 'send' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('send')}
          className={activeTab === 'send' ? 'bg-blue-600' : 'text-gray-300'}
        >
          Send
        </Button>
        <Button
          variant={activeTab === 'settings' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('settings')}
          className={activeTab === 'settings' ? 'bg-purple-600' : 'text-gray-300'}
        >
          Settings
        </Button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white">Wallet Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Currency</Label>
                <p className="text-white font-semibold">{wallet.currency}</p>
              </div>
              <div>
                <Label className="text-gray-300">Status</Label>
                <p className="text-green-400 font-semibold">Active</p>
              </div>
              <div>
                <Label className="text-gray-300">Balance</Label>
                <p className="text-white font-semibold">{formatBalance(wallet.balance, wallet.currency)}</p>
              </div>
              <div>
                <Label className="text-gray-300">24h Change</Label>
                <p className={`font-semibold ${wallet.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                  {wallet.change}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'deposit' && (
        <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white">Deposit {wallet.currency}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="depositAmount" className="text-white">Amount</Label>
              <Input
                id="depositAmount"
                type="number"
                placeholder={`Enter ${wallet.currency} amount`}
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="bg-gray-800/60 border-gray-600/50 text-white placeholder-gray-400"
              />
            </div>
            <Button 
              onClick={handleDeposit}
              disabled={!depositAmount || parseFloat(depositAmount) <= 0}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Deposit {wallet.currency}
            </Button>
          </CardContent>
        </Card>
      )}

      {activeTab === 'send' && (
        <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white">Send {wallet.currency}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="sendAmount" className="text-white">Amount</Label>
              <Input
                id="sendAmount"
                type="number"
                placeholder={`Enter ${wallet.currency} amount`}
                value={sendAmount}
                onChange={(e) => setSendAmount(e.target.value)}
                className="bg-gray-800/60 border-gray-600/50 text-white placeholder-gray-400"
              />
            </div>
            <div>
              <Label htmlFor="recipientAddress" className="text-white">Recipient Address</Label>
              <Input
                id="recipientAddress"
                placeholder="Enter wallet address or phone number"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                className="bg-gray-800/60 border-gray-600/50 text-white placeholder-gray-400"
              />
            </div>
            <Button 
              onClick={handleSend}
              disabled={!sendAmount || !recipientAddress || parseFloat(sendAmount) <= 0 || parseFloat(sendAmount) > wallet.balance}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Send className="w-4 h-4 mr-2" />
              Send {wallet.currency}
            </Button>
            {parseFloat(sendAmount) > wallet.balance && (
              <p className="text-red-400 text-sm">Insufficient balance</p>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-6">
          <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white">Wallet Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-white">Freeze Wallet</Label>
                <Switch checked={isWalletFrozen} onCheckedChange={setIsWalletFrozen} />
              </div>
              <p className="text-sm text-gray-400">
                Freezing your wallet will prevent all transactions until unfrozen.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white">Transaction Limits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-white">Daily Limit ({wallet.currency})</Label>
                <Input
                  type="number"
                  value={dailyLimit}
                  onChange={(e) => setDailyLimit(e.target.value)}
                  className="bg-gray-800/60 border-gray-600/50 text-white"
                />
              </div>
              <div>
                <Label className="text-white">Monthly Limit ({wallet.currency})</Label>
                <Input
                  type="number"
                  value={monthlyLimit}
                  onChange={(e) => setMonthlyLimit(e.target.value)}
                  className="bg-gray-800/60 border-gray-600/50 text-white"
                />
              </div>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Update Limits
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-red-900/20 border-red-500/20 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
  );
};
