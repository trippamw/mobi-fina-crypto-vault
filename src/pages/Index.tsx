import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet, Bitcoin, CreditCard, ArrowUpRight, ArrowDownLeft, TrendingUp, PiggyBank, Eye, EyeOff, Users, Zap, User as UserIcon, Plus, UserPlus, Send, ArrowLeft, Download, LogOut } from 'lucide-react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
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
import { WithdrawSection } from '@/components/WithdrawSection';
import { MobileNavigation } from '@/components/MobileNavigation';
import { CreateWalletModal } from '@/components/CreateWalletModal';
import { TransactionConfirmation } from '@/components/TransactionConfirmation';
import { WalletManagement } from '@/components/WalletManagement';
import { VillageBankManagement } from '@/components/VillageBankManagement';
import { VillageBankGroupCreation } from '@/components/VillageBankGroupCreation';
import { useLanguage } from '@/utils/languageApi';
import { useUserData } from '@/hooks/useUserData';
import { apiService } from '@/lib/api';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const { t } = useLanguage();
  const { user, signOut } = useAuth();
  const { userData, loading, error, refreshData, wallets: userWallets, transactions: userTransactions } = useUserData();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedWallet, setSelectedWallet] = useState<any>(null);
  const [currentLanguage, setCurrentLanguage] = useState('English');

  // Helper functions for wallet display
  const getWalletIcon = (currencyCode: string, walletType: string) => {
    if (walletType === 'crypto') {
      switch (currencyCode) {
        case 'BTC': return 'bitcoin';
        case 'ETH': return 'ethereum';
        case 'USDT': return 'usdt';
        case 'USDC': return 'usdc';
        default: return 'bitcoin';
      }
    } else {
      switch (currencyCode) {
        case 'USD': return 'dollar';
        case 'GBP': return 'pound';
        case 'EUR': return 'euro';
        case 'ZAR': return 'rand';
        default: return 'wallet';
      }
    }
  };

  const getWalletGradient = (currencyCode: string, walletType: string) => {
    if (walletType === 'crypto') {
      switch (currencyCode) {
        case 'BTC': return 'bg-gradient-to-br from-yellow-700 to-orange-800';
        case 'ETH': return 'bg-gradient-to-br from-indigo-700 to-purple-800';
        case 'USDT': return 'bg-gradient-to-br from-green-700 to-emerald-800';
        case 'USDC': return 'bg-gradient-to-br from-blue-700 to-cyan-800';
        default: return 'bg-gradient-to-br from-yellow-700 to-orange-800';
      }
    } else {
      switch (currencyCode) {
        case 'USD': return 'bg-gradient-to-br from-emerald-800 to-emerald-900';
        case 'GBP': return 'bg-gradient-to-br from-purple-800 to-purple-900';
        case 'EUR': return 'bg-gradient-to-br from-yellow-800 to-yellow-900';
        case 'ZAR': return 'bg-gradient-to-br from-orange-800 to-orange-900';
        default: return 'bg-gradient-to-br from-slate-800 to-slate-900';
      }
    }
  };

  // Real-time updates for transactions
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('realtime-transactions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          // Refresh data when transactions change
          refreshData();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'wallets',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          // Refresh data when wallets change
          refreshData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, refreshData]);

  // Use real data from API or fallback to mock data
  const wallets = userWallets.length > 0 ? userWallets.map(wallet => ({
    ...wallet,
    currency: wallet.currency_code, // Map currency_code to currency for WalletCard
    balance: parseFloat(wallet.balance) || 0,
    icon: getWalletIcon(wallet.currency_code, wallet.wallet_type),
    gradient: getWalletGradient(wallet.currency_code, wallet.wallet_type),
    change: '+0.0%',
    isDefault: wallet.is_primary
  })) : [
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
    }
  ];

  const recentTransactions = userTransactions.length > 0 
    ? userTransactions.slice(0, 5).map(tx => ({
        type: tx.transaction_type,
        amount: `${tx.amount > 0 ? '+' : ''}${tx.currency_code} ${Math.abs(tx.amount).toLocaleString()}`,
        description: tx.description || 'Transaction',
        time: new Date(tx.created_at).toLocaleString(),
        status: tx.status
      }))
    : [
        { type: t('received'), amount: '+MWK 50,000', description: 'TNM Mobile Money', time: '2 min ago', status: 'completed' },
        { type: t('exchange'), amount: '0.001 BTC → MWK 294,000', description: 'Crypto Exchange', time: '1 hour ago', status: 'completed' },
        { type: t('investment'), amount: '+MWK 25,000', description: 'Savings Goal', time: '3 hours ago', status: 'pending' }
      ];

  const [purchasedCards, setPurchasedCards] = useState([]);

  const [transactionModal, setTransactionModal] = useState({
    isOpen: false,
    showSuccess: false,
    transaction: null as any
  });

  const handleBalanceUpdate = (currency: string, amount: number) => {
    // Refresh data from API after balance update
    refreshData();
  };

  const handleTransactionUpdate = (transaction: any) => {
    // Refresh data from API after transaction update
    refreshData();
  };

  const handleCardPurchase = (cardType: string) => {
    const cardDetails = {
      Standard: { price: 0 },
      Gold: { price: 15000 },
      Platinum: { price: 35000 }
    };

    const cardInfo = cardDetails[cardType as keyof typeof cardDetails];
    if (!cardInfo) return;

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

    handleTransactionUpdate({
      type: 'Card Purchase',
      amount: cardInfo.price > 0 ? `-MWK ${cardInfo.price.toLocaleString()}` : 'FREE',
      description: `${cardType} Virtual Card purchased`,
      time: 'Just now',
      status: 'completed'
    });
  };

  const handleWalletClick = (wallet: any) => {
    setSelectedWallet(wallet);
    setActiveTab('wallet-management');
  };

  const handleCreateWallet = (newWallet: any) => {
    // Refresh data after wallet creation
    refreshData();
  };

  const handleTransaction = (transactionDetails: any) => {
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

  const handleLanguageChange = (language: string) => {
    setCurrentLanguage(language);
    document.documentElement.lang = language.toLowerCase();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'wallet-management':
        return <WalletManagement 
          wallet={selectedWallet}
          onBack={() => setActiveTab('dashboard')}
          onBalanceUpdate={handleBalanceUpdate}
          onTransactionUpdate={handleTransactionUpdate}
        />;
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
      case 'withdraw':
        return <WithdrawSection 
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
          <div className="space-y-4 pb-24">
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
                <h2 className="text-lg sm:text-2xl font-bold text-white">{t('wallet')} & {t('cards')}</h2>
              </div>
              <CreateWalletModal onCreateWallet={handleCreateWallet} />
            </div>
            <VirtualCardsSection 
              onBalanceUpdate={handleBalanceUpdate}
              onTransactionUpdate={handleTransactionUpdate}
              onBack={() => setActiveTab('dashboard')}
              wallets={wallets}
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
        return <VillageBankSection 
          onBack={() => setActiveTab('invest')}
          onBalanceUpdate={handleBalanceUpdate}
          onTransactionUpdate={handleTransactionUpdate}
        />;
      case 'village-create':
        return <VillageBankGroupCreation 
          onBack={() => setActiveTab('village')}
        />;
      case 'bills':
        return <BillsSection 
          onBalanceUpdate={handleBalanceUpdate}
          onTransactionUpdate={handleTransactionUpdate}
          onBack={() => setActiveTab('dashboard')}
        />;
      case 'profile':
        return <UserProfile 
          onBack={() => setActiveTab('dashboard')}
          onLanguageChange={handleLanguageChange}
        />;
      default:
        return (
          <div className="space-y-4 pb-32 sm:pb-24">
            {/* Total Balance Card - Mobile Optimized */}
            <Card className="bg-gradient-to-br from-slate-900/95 to-gray-800/90 backdrop-blur-2xl border-gray-600/30 card-hover shadow-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-sm sm:text-lg text-white">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Wallet className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <span className="font-black text-xs sm:text-xl tracking-tight">{t('balance')}</span>
                  </div>
                  <Badge className="bg-green-500/20 text-green-300 border-green-400/30 text-[10px] sm:text-xs px-1 sm:px-3 py-1">
                    <TrendingUp className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                    +8.7%
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="mb-3">
                  {balanceVisible ? (
                    <div className="space-y-1">
                      <h2 className="text-base sm:text-2xl md:text-3xl font-black tracking-tighter bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                        MWK {wallets.reduce((total, wallet) => total + (wallet.currency === 'MWK' ? wallet.balance : 0), 0).toLocaleString()}
                      </h2>
                      <p className="text-xs sm:text-base md:text-lg font-bold text-white/90 tracking-wide">
                        ≈ $1,625 USD
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <h2 className="text-base sm:text-2xl md:text-3xl font-black text-white/20 tracking-tighter">
                        ••••••••••
                      </h2>
                      <p className="text-xs sm:text-base md:text-lg font-bold text-white/20">
                        ••••••••
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[10px] sm:text-sm text-white/70 font-semibold">
                    🔄 {t('loading')}
                  </p>
                  <div className="flex items-center space-x-1 text-green-400">
                    <span className="text-[10px] sm:text-sm font-bold">+MWK 47,300</span>
                    <span className="text-[8px] sm:text-xs font-medium">Today</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Dashboard - Enhanced */}
            <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-xl">
              <CardContent className="p-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <Button
                    className="h-16 sm:h-20 flex-col space-y-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 border-green-400/30 backdrop-blur-sm"
                    onClick={() => setActiveTab('deposit')}
                  >
                    <Plus className="w-4 h-4 sm:w-6 sm:h-6" />
                    <span className="text-[10px] sm:text-xs font-medium">{t('deposit')}</span>
                  </Button>
                  <Button
                    className="h-16 sm:h-20 flex-col space-y-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border-blue-400/30 backdrop-blur-sm"
                    onClick={() => setActiveTab('send')}
                  >
                    <Send className="w-4 h-4 sm:w-6 sm:h-6" />
                    <span className="text-[10px] sm:text-xs font-medium">{t('send')}</span>
                  </Button>
                  <Button
                    className="h-16 sm:h-20 flex-col space-y-1 bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border-orange-400/30 backdrop-blur-sm"
                    onClick={() => setActiveTab('withdraw')}
                  >
                    <Download className="w-4 h-4 sm:w-6 sm:h-6" />
                    <span className="text-[10px] sm:text-xs font-medium">{t('withdraw')}</span>
                  </Button>
                  <Button
                    className="h-16 sm:h-20 flex-col space-y-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-400/30 backdrop-blur-sm"
                    onClick={() => setActiveTab('receive')}
                  >
                    <ArrowDownLeft className="w-4 h-4 sm:w-6 sm:h-6" />
                    <span className="text-[10px] sm:text-xs font-medium">{t('receive')}</span>
                  </Button>
                  <Button
                    className="h-16 sm:h-20 flex-col space-y-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border-purple-400/30 backdrop-blur-sm"
                    onClick={() => setActiveTab('cards')}
                  >
                    <CreditCard className="w-4 h-4 sm:w-6 sm:h-6" />
                    <span className="text-[10px] sm:text-xs font-medium">{t('cards')}</span>
                  </Button>
                  <Button
                    className="h-16 sm:h-20 flex-col space-y-1 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 border-yellow-400/30 backdrop-blur-sm"
                    onClick={() => setActiveTab('exchange')}
                  >
                    <Bitcoin className="w-4 h-4 sm:w-6 sm:h-6" />
                    <span className="text-[10px] sm:text-xs font-medium">{t('exchange')}</span>
                  </Button>
                  <Button
                    className="h-16 sm:h-20 flex-col space-y-1 bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 border-pink-400/30 backdrop-blur-sm"
                    onClick={() => setActiveTab('invest')}
                  >
                    <PiggyBank className="w-4 h-4 sm:w-6 sm:h-6" />
                    <span className="text-[10px] sm:text-xs font-medium">{t('invest')}</span>
                  </Button>
                  <Button
                    className="h-16 sm:h-20 flex-col space-y-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border-cyan-400/30 backdrop-blur-sm"
                    onClick={() => setActiveTab('invite')}
                  >
                    <UserPlus className="w-4 h-4 sm:w-6 sm:h-6" />
                    <span className="text-[10px] sm:text-xs font-medium">Invite</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Wallets Grid - Clickable */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {wallets.map((wallet, index) => (
                <div key={index} onClick={() => handleWalletClick(wallet)} className="cursor-pointer">
                  <WalletCard
                    wallet={wallet}
                    balanceVisible={balanceVisible}
                  />
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm sm:text-base text-white font-bold">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentTransactions.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors border border-gray-600/30">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-xs sm:text-sm truncate text-white">{activity.type}</p>
                        <p className="text-[10px] sm:text-xs text-gray-300 truncate">{activity.description}</p>
                      </div>
                      <div className="text-right ml-2">
                        <p className="font-medium text-[10px] sm:text-xs text-white">{activity.amount}</p>
                        <p className="text-[8px] sm:text-[10px] text-gray-300">{activity.time}</p>
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
    <ProtectedRoute>
      <div className="min-h-screen">
        {/* Header */}
        <header className="bg-white/10 backdrop-blur-2xl border-b border-white/20 sticky top-0 z-40">
          <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 sm:w-10 sm:h-10 gradient-primary rounded-xl flex items-center justify-center">
                  <Wallet className="w-3 h-3 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-sm sm:text-2xl font-bold text-premium font-wealth">
                    NeoVault
                  </h1>
                  <p className="text-[8px] sm:text-xs text-white/60">All Things Money. One App</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setBalanceVisible(!balanceVisible)}
                  className="text-white/70 hover:text-white hover:bg-white/10 rounded-full"
                >
                  {balanceVisible ? <Eye className="w-3 h-3 sm:w-4 sm:h-4" /> : <EyeOff className="w-3 h-3 sm:w-4 sm:h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={signOut}
                  className="text-white/70 hover:text-white hover:bg-white/10 rounded-full"
                  title="Sign Out"
                >
                  <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab('profile')}
                  className="w-6 h-6 sm:w-8 sm:h-8 gradient-secondary rounded-full flex items-center justify-center p-0"
                >
                  <UserIcon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-6 pb-32 sm:pb-24">
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
          notificationCount={0}
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
    </ProtectedRoute>
  );
};

export default Index;
