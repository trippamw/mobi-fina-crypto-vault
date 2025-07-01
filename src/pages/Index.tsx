import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet, Bitcoin, CreditCard, ArrowUpRight, ArrowDownLeft, TrendingUp, PiggyBank, Eye, EyeOff, Users, Zap, User as UserIcon, Plus, UserPlus, Send } from 'lucide-react';
import { WalletCard } from '@/components/WalletCard';
import { ExchangeSection } from '@/components/ExchangeSection';
import { InvestmentSection } from '@/components/InvestmentSection';
import { TransactionHistory } from '@/components/TransactionHistory';
import { VirtualCardsSection } from '@/components/VirtualCardsSection';
import { VillageBankSection } from '@/components/VillageBankSection';
import { DepositSection } from '@/components/DepositSection';
import { ReceiveSection } from '@/components/ReceiveSection';
import { InviteSection } from '@/components/InviteSection';
import { UserProfile } from '@/components/UserProfile';
import { BillsSection } from '@/components/BillsSection';
import { MobileNavigation } from '@/components/MobileNavigation';
import { CreateWalletModal } from '@/components/CreateWalletModal';
import { TransactionConfirmation } from '@/components/TransactionConfirmation';

const Index = () => {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [wallets, setWallets] = useState([
    {
      currency: 'MWK',
      balance: 1250000,
      icon: 'wallet',
      gradient: 'gradient-primary',
      change: '+5.2%',
      isDefault: true
    },
    {
      currency: 'USD',
      balance: 5420,
      icon: 'dollar',
      gradient: 'gradient-secondary',
      change: '+2.1%'
    },
    {
      currency: 'GBP',
      balance: 3250,
      icon: 'pound',
      gradient: 'gradient-tertiary',
      change: '+1.8%'
    },
    {
      currency: 'EUR',
      balance: 4180,
      icon: 'euro',
      gradient: 'gradient-quaternary',
      change: '+2.5%'
    },
    {
      currency: 'ZAR',
      balance: 82500,
      icon: 'rand',
      gradient: 'gradient-quinary',
      change: '+3.1%'
    },
    {
      currency: 'BTC',
      balance: 0.0453,
      icon: 'bitcoin',
      gradient: 'gradient-bitcoin',
      change: '+12.8%',
      usdValue: 2890
    },
    {
      currency: 'ETH',
      balance: 1.2567,
      icon: 'ethereum',
      gradient: 'gradient-ethereum',
      change: '+8.4%',
      usdValue: 3150
    },
    {
      currency: 'USDT',
      balance: 8750,
      icon: 'usdt',
      gradient: 'gradient-usdt',
      change: '+0.1%'
    },
    {
      currency: 'USDC',
      balance: 6430,
      icon: 'usdc',
      gradient: 'gradient-usdc',
      change: '+0.1%'
    }
  ]);

  const [transactionModal, setTransactionModal] = useState({
    isOpen: false,
    showSuccess: false,
    transaction: null as any
  });

  const quickActions = [
    { icon: Plus, label: 'Deposit', color: 'text-green-400', action: 'deposit' },
    { icon: Send, label: 'Send', color: 'text-blue-400', action: 'send' },
    { icon: ArrowDownLeft, label: 'Receive', color: 'text-emerald-400', action: 'receive' },
    { icon: Bitcoin, label: 'Exchange', color: 'text-yellow-400', action: 'exchange' },
    { icon: PiggyBank, label: 'Save', color: 'text-purple-400', action: 'save' },
    { icon: CreditCard, label: 'Cards', color: 'text-pink-400', action: 'cards' },
    { icon: Zap, label: 'Bills', color: 'text-orange-400', action: 'bills' },
    { icon: Users, label: 'Village Bank', color: 'text-cyan-400', action: 'village' },
    { icon: UserPlus, label: 'Invite', color: 'text-indigo-400', action: 'invite' }
  ];

  const handleCreateWallet = (newWallet: any) => {
    setWallets([...wallets, newWallet]);
  };

  const handleTransaction = (transactionDetails: any) => {
    setTransactionModal({
      isOpen: true,
      showSuccess: false,
      transaction: transactionDetails
    });
  };

  const confirmTransaction = () => {
    // Simulate transaction processing
    setTimeout(() => {
      setTransactionModal(prev => ({
        ...prev,
        showSuccess: true
      }));
    }, 1000);
  };

  const closeTransactionModal = () => {
    setTransactionModal({
      isOpen: false,
      showSuccess: false,
      transaction: null
    });
  };

  const handleQuickAction = (action: string) => {
    if (action === 'save') {
      setActiveTab('invest');
    } else if (action === 'receive') {
      setActiveTab('deposit');
    } else if (action === 'invite') {
      // Handle invite logic here
      console.log('Invite friends to NeoVault');
    } else {
      setActiveTab(action);
    }
  };

  const handleProfileClick = () => {
    setActiveTab('profile');
  };

  const handleMobileNavigation = (tab: string) => {
    if (tab === 'home') {
      setActiveTab('dashboard');
    } else if (tab === 'wallet') {
      setActiveTab('cards');
    } else if (tab === 'save') {
      setActiveTab('invest');
    } else {
      setActiveTab(tab);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'deposit':
        return <DepositSection />;
      case 'receive':
        return <ReceiveSection />;
      case 'invite':
        return <InviteSection />;
      case 'send':
        return (
          <Card className="gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Send className="w-5 h-5 text-primary" />
                <span>Send Money</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mb-4">
                  <Send className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Send Money Instantly</h3>
                <p className="text-muted-foreground mb-6">
                  Send money to NeoVault users for FREE or to mobile money, banks, and other services
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
                  <Button 
                    className="gradient-primary"
                    onClick={() => handleTransaction({
                      type: 'Send to NeoVault User',
                      amount: 'MWK 50,000',
                      recipient: 'John Doe',
                      fee: 'FREE',
                      total: 'MWK 50,000'
                    })}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    To NeoVault User
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleTransaction({
                      type: 'External Transfer',
                      amount: 'MWK 25,000',
                      recipient: 'Mobile Money',
                      fee: 'MWK 250',
                      total: 'MWK 25,250'
                    })}
                  >
                    <ArrowUpRight className="w-4 h-4 mr-2" />
                    External Transfer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      case 'exchange':
        return <ExchangeSection />;
      case 'cards':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Wallet & Cards</h2>
              <CreateWalletModal onCreateWallet={handleCreateWallet} />
            </div>
            <VirtualCardsSection />
          </div>
        );
      case 'invest':
        return <InvestmentSection />;
      case 'village':
        return <VillageBankSection />;
      case 'bills':
        return <BillsSection />;
      case 'profile':
        return <UserProfile />;
      default:
        return (
          <div className="space-y-4 sm:space-y-6">
            {/* Total Balance Card - Mobile Optimized */}
            <Card className="gradient-card border-border/50 card-hover">
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="flex items-center justify-between text-base sm:text-lg">
                  <span>Total Balance</span>
                  <Badge variant="secondary" className="bg-accent/20 text-accent text-xs">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +8.7%
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl sm:text-3xl font-bold mb-2">
                  {balanceVisible ? (
                    <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      MWK 2,847,230
                    </span>
                  ) : (
                    <span className="text-muted-foreground">••••••••</span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  ≈ $1,625 USD • Updated now
                </p>
              </CardContent>
            </Card>

            {/* Quick Actions Dashboard */}
            <Card className="gradient-card border-border/50">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Button
                    variant="ghost"
                    className="h-20 flex-col space-y-2 bg-primary/10 hover:bg-primary/20 text-primary"
                    onClick={() => setActiveTab('deposit')}
                  >
                    <Plus className="w-6 h-6" />
                    <span className="text-xs">Deposit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="h-20 flex-col space-y-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400"
                    onClick={() => setActiveTab('send')}
                  >
                    <Send className="w-6 h-6" />
                    <span className="text-xs">Send</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="h-20 flex-col space-y-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400"
                    onClick={() => setActiveTab('receive')}
                  >
                    <ArrowDownLeft className="w-6 h-6" />
                    <span className="text-xs">Receive</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="h-20 flex-col space-y-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400"
                    onClick={() => setActiveTab('cards')}
                  >
                    <CreditCard className="w-6 h-6" />
                    <span className="text-xs">Cards</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="h-20 flex-col space-y-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400"
                    onClick={() => setActiveTab('exchange')}
                  >
                    <Bitcoin className="w-6 h-6" />
                    <span className="text-xs">Exchange</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="h-20 flex-col space-y-2 bg-pink-500/10 hover:bg-pink-500/20 text-pink-400"
                    onClick={() => setActiveTab('invest')}
                  >
                    <PiggyBank className="w-6 h-6" />
                    <span className="text-xs">Save</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="h-20 flex-col space-y-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400"
                    onClick={() => setActiveTab('bills')}
                  >
                    <Zap className="w-6 h-6" />
                    <span className="text-xs">Bills</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="h-20 flex-col space-y-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400"
                    onClick={() => setActiveTab('invite')}
                  >
                    <UserPlus className="w-6 h-6" />
                    <span className="text-xs">Invite</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Wallets Grid - Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {wallets.map((wallet, index) => (
                <WalletCard
                  key={index}
                  wallet={wallet}
                  balanceVisible={balanceVisible}
                />
              ))}
            </div>

            {/* Recent Activity - Mobile Optimized */}
            <Card className="gradient-card border-border/50">
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="text-base sm:text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {[
                    { type: 'Received', amount: '+MWK 50,000', from: 'TNM Mobile Money', time: '2 min ago', status: 'completed' },
                    { type: 'Exchange', amount: '0.001 BTC → MWK 294,000', from: 'Crypto Exchange', time: '1 hour ago', status: 'completed' },
                    { type: 'Investment', amount: '+MWK 25,000', from: 'Savings Goal', time: '3 hours ago', status: 'pending' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm sm:text-base truncate text-foreground">{activity.type}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">{activity.from}</p>
                      </div>
                      <div className="text-right ml-2">
                        <p className="font-medium text-xs sm:text-sm text-foreground">{activity.amount}</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Header - Mobile Optimized */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-xl sticky top-0 z-40">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 gradient-primary rounded-xl flex items-center justify-center">
                <Wallet className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  NeoVault
                </h1>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Digital Banking Revolution</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setBalanceVisible(!balanceVisible)}
                className="text-muted-foreground hover:text-foreground"
              >
                {balanceVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab('profile')}
                className="w-8 h-8 gradient-secondary rounded-full flex items-center justify-center p-0"
              >
                <UserIcon className="w-4 h-4 text-white" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {renderContent()}
      </div>

      {/* Mobile Navigation */}
      <MobileNavigation 
        activeTab={activeTab} 
        onTabChange={(tab) => {
          if (tab === 'home') {
            setActiveTab('dashboard');
          } else if (tab === 'wallet') {
            setActiveTab('cards');
          } else if (tab === 'save') {
            setActiveTab('invest');
          } else {
            setActiveTab(tab);
          }
        }} 
      />

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

export default Index;
