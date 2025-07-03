import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet, Bitcoin, CreditCard, ArrowUpRight, ArrowDownLeft, TrendingUp, PiggyBank, Eye, EyeOff, Users, Zap, User as UserIcon, Plus, UserPlus, Send, ArrowLeft } from 'lucide-react';
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
import { SendSection } from '@/components/SendSection';
import { MobileNavigation } from '@/components/MobileNavigation';
import { CreateWalletModal } from '@/components/CreateWalletModal';
import { TransactionConfirmation } from '@/components/TransactionConfirmation';

const Index = () => {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notificationCount, setNotificationCount] = useState(3);
  const [recentTransactions, setRecentTransactions] = useState([
    { type: 'Received', amount: '+MWK 50,000', description: 'TNM Mobile Money', time: '2 min ago', status: 'completed' },
    { type: 'Exchange', amount: '0.001 BTC → MWK 294,000', description: 'Crypto Exchange', time: '1 hour ago', status: 'completed' },
    { type: 'Investment', amount: '+MWK 25,000', description: 'Savings Goal', time: '3 hours ago', status: 'pending' }
  ]);
  
  const [wallets, setWallets] = useState([
    {
      currency: 'MWK',
      balance: 1250000,
      icon: 'wallet',
      gradient: 'bg-gradient-to-br from-slate-800 to-slate-900',
      change: '+5.2%',
      isDefault: true
    },
    {
      currency: 'USD',
      balance: 5420,
      icon: 'dollar',
      gradient: 'bg-gradient-to-br from-emerald-800 to-emerald-900',
      change: '+2.1%'
    },
    {
      currency: 'GBP',
      balance: 3250,
      icon: 'pound',
      gradient: 'bg-gradient-to-br from-purple-800 to-purple-900',
      change: '+1.8%'
    },
    {
      currency: 'EUR',
      balance: 4180,
      icon: 'euro',
      gradient: 'bg-gradient-to-br from-amber-800 to-amber-900',
      change: '+2.5%'
    },
    {
      currency: 'ZAR',
      balance: 82500,
      icon: 'rand',
      gradient: 'bg-gradient-to-br from-orange-800 to-orange-900',
      change: '+3.1%'
    },
    {
      currency: 'BTC',
      balance: 0.0453,
      icon: 'bitcoin',
      gradient: 'bg-gradient-to-br from-yellow-700 to-orange-800',
      change: '+12.8%',
      usdValue: 2890
    },
    {
      currency: 'ETH',
      balance: 1.2567,
      icon: 'ethereum',
      gradient: 'bg-gradient-to-br from-blue-800 to-indigo-900',
      change: '+8.4%',
      usdValue: 3150
    },
    {
      currency: 'USDT',
      balance: 8750,
      icon: 'usdt',
      gradient: 'bg-gradient-to-br from-green-800 to-teal-900',
      change: '+0.1%'
    },
    {
      currency: 'USDC',
      balance: 6430,
      icon: 'usdc',
      gradient: 'bg-gradient-to-br from-blue-700 to-cyan-800',
      change: '+0.1%'
    }
  ]);

  const [purchasedCards, setPurchasedCards] = useState([]);

  const [transactionModal, setTransactionModal] = useState({
    isOpen: false,
    showSuccess: false,
    transaction: null as any
  });

  const handleBalanceUpdate = (currency: string, amount: number) => {
    setWallets(prevWallets => 
      prevWallets.map(wallet => 
        wallet.currency === currency 
          ? { ...wallet, balance: Math.max(0, wallet.balance + amount) }
          : wallet
      )
    );
  };

  const handleTransactionUpdate = (transaction: any) => {
    setRecentTransactions(prev => [transaction, ...prev.slice(0, 4)]);
  };

  const handleCardPurchase = (cardType: string) => {
    // Get card details
    const cardDetails = {
      Standard: { price: 0 },
      Gold: { price: 15000 },
      Platinum: { price: 35000 }
    };

    const cardInfo = cardDetails[cardType as keyof typeof cardDetails];
    if (!cardInfo) return;

    // Deduct cost from wallet
    if (cardInfo.price > 0) {
      handleBalanceUpdate('MWK', -cardInfo.price);
    }

    const newCard = {
      id: Date.now(),
      type: cardType,
      number: `**** **** **** ${Math.floor(1000 + Math.random() * 9000)}`,
      balance: 0,
      status: 'Active',
      purchasedAt: new Date().toISOString()
    };
    setPurchasedCards(prev => [...prev, newCard]);

    // Add to transaction history
    handleTransactionUpdate({
      type: 'Card Purchase',
      amount: cardInfo.price > 0 ? `-MWK ${cardInfo.price.toLocaleString()}` : 'FREE',
      description: `${cardType} Virtual Card purchased`,
      time: 'Just now',
      status: 'completed'
    });
  };

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
    // Create actual wallet object with proper structure
    const walletToAdd = {
      currency: newWallet.currency,
      balance: 0,
      icon: newWallet.type === 'crypto' ? 'bitcoin' : 'wallet',
      gradient: newWallet.type === 'crypto' ? 'bg-gradient-to-br from-yellow-700 to-orange-800' : 'bg-gradient-to-br from-slate-800 to-slate-900',
      change: '+0.0%',
      isDefault: false
    };
    setWallets(prevWallets => [...prevWallets, walletToAdd]);
  };

  const handleTransaction = (transactionDetails: any) => {
    // Add return navigation info to transaction
    const transactionWithReturn = {
      ...transactionDetails,
      returnTo: getReturnDestination(transactionDetails.type),
      hasFee: transactionDetails.fee && transactionDetails.fee !== 'FREE' && transactionDetails.fee !== 'No charge'
    };

    setTransactionModal({
      isOpen: true,
      showSuccess: false,
      transaction: transactionWithReturn
    });
  };

  const getReturnDestination = (transactionType: string) => {
    if (transactionType.includes('Card')) return 'Cards';
    if (transactionType.includes('Investment') || transactionType.includes('Group')) return 'Save';
    if (transactionType.includes('Exchange')) return 'Exchange';
    return 'Home';
  };

  const confirmTransaction = () => {
    setTimeout(() => {
      setTransactionModal(prev => ({ ...prev, showSuccess: true }));
    }, 1000);
  };

  const closeTransactionModal = () => {
    const returnTo = transactionModal.transaction?.returnTo;
    
    setTransactionModal({
      isOpen: false,
      showSuccess: false,
      transaction: null
    });

    // Navigate to appropriate tab after closing
    if (returnTo === 'Cards') {
      setActiveTab('cards');
    } else if (returnTo === 'Save') {
      setActiveTab('invest');
    } else if (returnTo === 'Exchange') {
      setActiveTab('exchange');
    } else {
      setActiveTab('dashboard');
    }
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
        return <DepositSection 
          onBalanceUpdate={handleBalanceUpdate} 
          onTransactionUpdate={handleTransactionUpdate}
          onBack={() => setActiveTab('dashboard')}
        />;
      case 'send':
        return <SendSection 
          onBalanceUpdate={handleBalanceUpdate} 
          onTransactionUpdate={handleTransactionUpdate}
          onBack={() => setActiveTab('dashboard')}
        />;
      case 'receive':
        return <ReceiveSection onBack={() => setActiveTab('dashboard')} />;
      case 'invite':
        return <InviteSection onBack={() => setActiveTab('dashboard')} />;
      case 'exchange':
        return <ExchangeSection 
          onBalanceUpdate={handleBalanceUpdate}
          onTransactionUpdate={handleTransactionUpdate}
          onBack={() => setActiveTab('dashboard')}
        />;
      case 'cards':
        return (
          <div className="space-y-6 pb-24">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <Button
                  onClick={() => setActiveTab('dashboard')}
                  variant="ghost"
                  size="sm"
                  className="text-white/70 hover:text-white hover:bg-white/10"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <h2 className="text-2xl font-bold text-white">Wallet & Cards</h2>
              </div>
              <CreateWalletModal onCreateWallet={handleCreateWallet} />
            </div>
            <VirtualCardsSection 
              onCardPurchase={handleCardPurchase}
              purchasedCards={purchasedCards}
            />
          </div>
        );
      case 'invest':
        return <InvestmentSection 
          onBalanceUpdate={handleBalanceUpdate}
          onTransactionUpdate={handleTransactionUpdate}
          onBack={() => setActiveTab('dashboard')}
        />;
      case 'village':
        return <VillageBankSection onBack={() => setActiveTab('invest')} />;
      case 'bills':
        return <BillsSection 
          onBalanceUpdate={handleBalanceUpdate}
          onTransactionUpdate={handleTransactionUpdate}
          onBack={() => setActiveTab('dashboard')}
        />;
      case 'profile':
        return <UserProfile onBack={() => setActiveTab('dashboard')} />;
      default:
        return (
          <div className="space-y-4 sm:space-y-6 pb-32 sm:pb-24">
            {/* Total Balance Card - Enhanced Design with Bold Font */}
            <Card className="bg-gradient-to-br from-slate-900/95 to-gray-800/90 backdrop-blur-2xl border-gray-600/30 card-hover shadow-2xl">
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="flex items-center justify-between text-base sm:text-lg text-white">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-black text-xl tracking-tight">Total Portfolio</span>
                  </div>
                  <Badge className="bg-green-500/20 text-green-300 border-green-400/30 text-xs px-3 py-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +8.7%
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="mb-4">
                  {balanceVisible ? (
                    <div className="space-y-2">
                      <h2 className="text-5xl sm:text-6xl font-black tracking-tighter bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                        MWK {wallets.reduce((total, wallet) => total + (wallet.currency === 'MWK' ? wallet.balance : 0), 0).toLocaleString()}
                      </h2>
                      <p className="text-xl sm:text-2xl font-bold text-white/90 tracking-wide">
                        ≈ $1,625 USD
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <h2 className="text-5xl sm:text-6xl font-black text-white/20 tracking-tighter">
                        ••••••••••
                      </h2>
                      <p className="text-xl sm:text-2xl font-bold text-white/20">
                        ••••••••
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-white/70 font-semibold">
                    🔄 Updated just now
                  </p>
                  <div className="flex items-center space-x-2 text-green-400">
                    <span className="text-sm font-bold">+MWK 47,300</span>
                    <span className="text-xs font-medium">Today</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Dashboard - Enhanced */}
            <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-xl">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Button
                    className="quick-action h-20 flex-col space-y-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 border-green-400/30 backdrop-blur-sm"
                    onClick={() => setActiveTab('deposit')}
                  >
                    <Plus className="w-6 h-6" />
                    <span className="text-xs font-medium">Deposit</span>
                  </Button>
                  <Button
                    className="quick-action h-20 flex-col space-y-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border-blue-400/30 backdrop-blur-sm"
                    onClick={() => setActiveTab('send')}
                  >
                    <Send className="w-6 h-6" />
                    <span className="text-xs font-medium">Send</span>
                  </Button>
                  <Button
                    className="quick-action h-20 flex-col space-y-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-400/30 backdrop-blur-sm"
                    onClick={() => setActiveTab('receive')}
                  >
                    <ArrowDownLeft className="w-6 h-6" />
                    <span className="text-xs font-medium">Receive</span>
                  </Button>
                  <Button
                    className="quick-action h-20 flex-col space-y-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border-purple-400/30 backdrop-blur-sm"
                    onClick={() => setActiveTab('cards')}
                  >
                    <CreditCard className="w-6 h-6" />
                    <span className="text-xs font-medium">Cards</span>
                  </Button>
                  <Button
                    className="quick-action h-20 flex-col space-y-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 border-yellow-400/30 backdrop-blur-sm"
                    onClick={() => setActiveTab('exchange')}
                  >
                    <Bitcoin className="w-6 h-6" />
                    <span className="text-xs font-medium">Exchange</span>
                  </Button>
                  <Button
                    className="quick-action h-20 flex-col space-y-2 bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 border-pink-400/30 backdrop-blur-sm"
                    onClick={() => setActiveTab('invest')}
                  >
                    <PiggyBank className="w-6 h-6" />
                    <span className="text-xs font-medium">Save</span>
                  </Button>
                  <Button
                    className="quick-action h-20 flex-col space-y-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border-orange-400/30 backdrop-blur-sm"
                    onClick={() => setActiveTab('bills')}
                  >
                    <Zap className="w-6 h-6" />
                    <span className="text-xs font-medium">Bills</span>
                  </Button>
                  <Button
                    className="quick-action h-20 flex-col space-y-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border-cyan-400/30 backdrop-blur-sm"
                    onClick={() => setActiveTab('invite')}
                  >
                    <UserPlus className="w-6 h-6" />
                    <span className="text-xs font-medium">Invite</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Wallets Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {wallets.map((wallet, index) => (
                <WalletCard
                  key={index}
                  wallet={wallet}
                  balanceVisible={balanceVisible}
                />
              ))}
            </div>

            {/* Recent Activity - Enhanced */}
            <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-xl">
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="text-base sm:text-lg text-white font-bold">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {recentTransactions.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors border border-gray-600/30">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm sm:text-base truncate text-white">{activity.type}</p>
                        <p className="text-xs sm:text-sm text-gray-300 truncate">{activity.description}</p>
                      </div>
                      <div className="text-right ml-2">
                        <p className="font-medium text-xs sm:text-sm text-white">{activity.amount}</p>
                        <p className="text-[10px] sm:text-xs text-gray-300">{activity.time}</p>
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
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-2xl border-b border-white/20 sticky top-0 z-40">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 gradient-primary rounded-xl flex items-center justify-center">
                <Wallet className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-premium font-wealth">
                  NeoVault
                </h1>
                <p className="text-[10px] sm:text-xs text-white/60">All Things Money. One App</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setBalanceVisible(!balanceVisible)}
                className="text-white/70 hover:text-white hover:bg-white/10 rounded-full"
              >
                {balanceVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab('profile')}
                className="w-8 h-8 gradient-secondary rounded-full flex items-center justify-center p-0 relative"
              >
                <UserIcon className="w-4 h-4 text-white" />
                {notificationCount > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notificationCount > 99 ? '99+' : notificationCount}
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-32 sm:pb-24">
        {renderContent()}
      </div>

      {/* Mobile Navigation - Fixed with proper padding */}
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
        notificationCount={notificationCount}
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
