
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, CreditCard, PiggyBank, Users, User, ArrowUp, ArrowDown, Send } from 'lucide-react';
import { WalletManagement } from '@/components/WalletManagement';
import { InvestmentSection } from '@/components/InvestmentSection';
import { VirtualCardsSection } from '@/components/VirtualCardsSection';
import { UserProfile } from '@/components/UserProfile';
import { DepositSection } from '@/components/DepositSection';
import { SendSection } from '@/components/SendSection';
import { WithdrawSection } from '@/components/WithdrawSection';
import { TransactionConfirmation } from '@/components/TransactionConfirmation';
import { MobileNavigation } from '@/components/MobileNavigation';
import { useLanguage } from '@/components/LanguageProvider';

const Index = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('home');
  const [currentSection, setCurrentSection] = useState('home');
  const [selectedWallet, setSelectedWallet] = useState('MWK');
  const [purchasedCards, setPurchasedCards] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState(null);

  const [wallets, setWallets] = useState([
    { 
      currency: 'MWK', 
      balance: 125000, 
      isDefault: true, 
      transactions: [
        { type: 'Received', amount: '+MWK 50,000', description: 'From John Doe', time: '2 hours ago', status: 'completed' },
        { type: 'Sent', amount: '-MWK 15,000', description: 'To Village Bank', time: '1 day ago', status: 'completed' }
      ]
    },
    { 
      currency: 'USD', 
      balance: 250, 
      isDefault: false, 
      transactions: [
        { type: 'Deposit', amount: '+$100', description: 'Bank transfer', time: '3 days ago', status: 'completed' }
      ]
    },
    { 
      currency: 'EUR', 
      balance: 180, 
      isDefault: false, 
      transactions: []
    }
  ]);

  const currentWallet = wallets.find(w => w.currency === selectedWallet) || wallets[0];

  const handleCardPurchase = (cardType: string) => {
    const newCard = {
      id: `card-${Date.now()}`,
      type: cardType,
      number: `**** **** **** ${Math.floor(1000 + Math.random() * 9000)}`,
      balance: 0,
      status: 'Active'
    };
    setPurchasedCards(prev => [...prev, newCard]);
  };

  const handleBalanceUpdate = (newBalance: number) => {
    setWallets(prev => prev.map(wallet => 
      wallet.currency === selectedWallet 
        ? { ...wallet, balance: newBalance }
        : wallet
    ));
  };

  const handleTransactionUpdate = (transaction: any) => {
    setWallets(prev => prev.map(wallet => 
      wallet.currency === selectedWallet 
        ? { ...wallet, transactions: [transaction, ...wallet.transactions] }
        : wallet
    ));
  };

  const handleTransaction = (details: any) => {
    setTransactionDetails(details);
    setShowConfirmation(true);
  };

  const confirmTransaction = () => {
    setShowConfirmation(false);
    setShowSuccess(true);
    // Process transaction here
    setTimeout(() => {
      setShowSuccess(false);
      setTransactionDetails(null);
    }, 3000);
  };

  const renderMainContent = () => {
    switch (currentSection) {
      case 'deposit':
        return (
          <DepositSection 
            onBack={() => setCurrentSection('home')}
            onBalanceUpdate={handleBalanceUpdate}
            onTransactionUpdate={handleTransactionUpdate}
            walletCurrency={currentWallet.currency}
            walletBalance={currentWallet.balance}
          />
        );
      case 'withdraw':
        return (
          <WithdrawSection 
            onBack={() => setCurrentSection('home')}
            onBalanceUpdate={handleBalanceUpdate}
            onTransactionUpdate={handleTransactionUpdate}
            walletCurrency={currentWallet.currency}
            walletBalance={currentWallet.balance}
          />
        );
      case 'send':
        return (
          <SendSection 
            onBack={() => setCurrentSection('home')}
            onTransaction={handleTransaction}
            walletBalance={currentWallet.balance}
            walletCurrency={currentWallet.currency}
          />
        );
      default:
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
                NeoVault
              </h1>
              <p className="text-gray-400 text-sm">Malawi's Banking Revolution</p>
            </div>

            {/* Balance Card */}
            <Card className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 border-none shadow-2xl">
              <CardContent className="p-4 sm:p-6">
                <div className="text-center space-y-2">
                  <p className="text-blue-100 text-sm">Total Balance ({currentWallet.currency})</p>
                  <p className="text-2xl sm:text-4xl font-bold text-white">
                    {currentWallet.currency} {currentWallet.balance.toLocaleString()}
                  </p>
                  <p className="text-blue-200 text-xs">≈ USD {(currentWallet.balance * 0.00059).toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-4 gap-3">
              <Button
                onClick={() => setCurrentSection('deposit')}
                className="flex flex-col items-center space-y-2 h-auto p-3 bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 text-green-300"
              >
                <ArrowDown className="w-5 h-5" />
                <span className="text-xs">{t('deposit')}</span>
              </Button>
              
              <Button
                onClick={() => setCurrentSection('withdraw')}
                className="flex flex-col items-center space-y-2 h-auto p-3 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-red-300"
              >
                <ArrowUp className="w-5 h-5" />
                <span className="text-xs">{t('withdraw')}</span>
              </Button>
              
              <Button
                onClick={() => setCurrentSection('send')}
                className="flex flex-col items-center space-y-2 h-auto p-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 text-blue-300"
              >
                <Send className="w-5 h-5" />
                <span className="text-xs">{t('send')}</span>
              </Button>
              
              <Button
                onClick={() => setActiveTab('wallets')}
                className="flex flex-col items-center space-y-2 h-auto p-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/30 text-purple-300"
              >
                <ArrowUpDown className="w-5 h-5" />
                <span className="text-xs">Exchange</span>
              </Button>
            </div>

            {/* Recent Transactions */}
            <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-2xl">
              <CardContent className="p-4">
                <h3 className="text-white font-semibold mb-3">Recent Transactions</h3>
                <div className="space-y-3">
                  {currentWallet.transactions.slice(0, 3).map((transaction, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <p className="text-white text-sm font-medium">{transaction.type}</p>
                        <p className="text-gray-400 text-xs">{transaction.description}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-semibold ${
                          transaction.amount.startsWith('+') ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {transaction.amount}
                        </p>
                        <p className="text-gray-500 text-xs">{transaction.time}</p>
                      </div>
                    </div>
                  ))}
                  {currentWallet.transactions.length === 0 && (
                    <p className="text-gray-400 text-center py-4">No transactions yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'wallets':
        return (
          <WalletManagement
            wallets={wallets}
            selectedWallet={selectedWallet}
            onWalletSelect={setSelectedWallet}
            onBalanceUpdate={handleBalanceUpdate}
            onTransactionUpdate={handleTransactionUpdate}
          />
        );
      case 'savings':
        return (
          <InvestmentSection
            onBalanceUpdate={handleBalanceUpdate}
            onTransactionUpdate={handleTransactionUpdate}
          />
        );
      case 'cards':
        return (
          <VirtualCardsSection
            onCardPurchase={handleCardPurchase}
            purchasedCards={purchasedCards}
            wallets={wallets}
          />
        );
      case 'profile':
        return <UserProfile />;
      default:
        return renderMainContent();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-md mx-auto bg-gray-900/50 backdrop-blur-xl min-h-screen">
        <div className="p-4 pb-20">
          {renderTabContent()}
        </div>
        
        <MobileNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        <TransactionConfirmation
          isOpen={showConfirmation || showSuccess}
          onClose={() => {
            setShowConfirmation(false);
            setShowSuccess(false);
            setTransactionDetails(null);
          }}
          onConfirm={confirmTransaction}
          onSuccess={() => setShowSuccess(false)}
          transaction={transactionDetails}
          showSuccess={showSuccess}
        />
      </div>
    </div>
  );
};

export default Index;
