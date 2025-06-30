
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Wallet, Bitcoin, CreditCard, ArrowUpRight, ArrowDownLeft, TrendingUp, PiggyBank, Eye, EyeOff, Users, Zap, User as UserIcon, Plus } from 'lucide-react';
import { WalletCard } from '@/components/WalletCard';
import { ExchangeSection } from '@/components/ExchangeSection';
import { InvestmentSection } from '@/components/InvestmentSection';
import { TransactionHistory } from '@/components/TransactionHistory';
import { VirtualCardsSection } from '@/components/VirtualCardsSection';
import { VillageBankSection } from '@/components/VillageBankSection';
import { DepositSection } from '@/components/DepositSection';
import { UserProfile } from '@/components/UserProfile';
import { BillsSection } from '@/components/BillsSection';

const Index = () => {
  const [balanceVisible, setBalanceVisible] = useState(true);

  const wallets = [
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
  ];

  const quickActions = [
    { icon: Plus, label: 'Deposit', color: 'text-green-400' },
    { icon: ArrowUpRight, label: 'Send', color: 'text-blue-400' },
    { icon: ArrowDownLeft, label: 'Receive', color: 'text-emerald-400' },
    { icon: Bitcoin, label: 'Exchange', color: 'text-yellow-400' },
    { icon: PiggyBank, label: 'Save', color: 'text-purple-400' },
    { icon: CreditCard, label: 'Cards', color: 'text-pink-400' },
    { icon: Zap, label: 'Bills', color: 'text-orange-400' },
    { icon: Users, label: 'Village Bank', color: 'text-cyan-400' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
      {/* Header - Mobile Optimized */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-xl sticky top-0 z-50">
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
                <p className="text-[10px] sm:text-xs text-muted-foreground">Digital Banking</p>
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
              <div className="w-8 h-8 gradient-secondary rounded-full flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <Tabs defaultValue="dashboard" className="w-full">
          {/* Mobile-optimized tabs */}
          <div className="overflow-x-auto scrollbar-hide mb-6 sm:mb-8">
            <TabsList className="flex w-max min-w-full sm:grid sm:grid-cols-8 bg-card/50 p-1">
              <TabsTrigger value="dashboard" className="whitespace-nowrap text-xs sm:text-sm">Dashboard</TabsTrigger>
              <TabsTrigger value="deposit" className="whitespace-nowrap text-xs sm:text-sm">Deposit</TabsTrigger>
              <TabsTrigger value="exchange" className="whitespace-nowrap text-xs sm:text-sm">Exchange</TabsTrigger>
              <TabsTrigger value="cards" className="whitespace-nowrap text-xs sm:text-sm">Cards</TabsTrigger>
              <TabsTrigger value="invest" className="whitespace-nowrap text-xs sm:text-sm">Invest</TabsTrigger>
              <TabsTrigger value="village" className="whitespace-nowrap text-xs sm:text-sm">Village Bank</TabsTrigger>
              <TabsTrigger value="bills" className="whitespace-nowrap text-xs sm:text-sm">Bills</TabsTrigger>
              <TabsTrigger value="profile" className="whitespace-nowrap text-xs sm:text-sm">Profile</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="dashboard" className="space-y-4 sm:space-y-6">
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
                  ≈ $2,850 USD • Updated now
                </p>
              </CardContent>
            </Card>

            {/* Quick Actions - Mobile Optimized Grid */}
            <Card className="gradient-card border-border/50">
              <CardContent className="pt-4 sm:pt-6">
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-4">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="h-16 sm:h-16 flex-col space-y-1 sm:space-y-2 hover:bg-white/5 transition-all duration-300"
                    >
                      <action.icon className={`w-4 h-4 sm:w-6 sm:h-6 ${action.color}`} />
                      <span className="text-[10px] sm:text-xs">{action.label}</span>
                    </Button>
                  ))}
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
                    { type: 'Exchange', amount: '0.001 BTC → MWK 65,000', from: 'Crypto Exchange', time: '1 hour ago', status: 'completed' },
                    { type: 'Investment', amount: '+MWK 25,000', from: 'Savings Goal', time: '3 hours ago', status: 'pending' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm sm:text-base truncate">{activity.type}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">{activity.from}</p>
                      </div>
                      <div className="text-right ml-2">
                        <p className="font-medium text-xs sm:text-sm">{activity.amount}</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deposit">
            <DepositSection />
          </TabsContent>

          <TabsContent value="exchange">
            <ExchangeSection />
          </TabsContent>

          <TabsContent value="cards">
            <VirtualCardsSection />
          </TabsContent>

          <TabsContent value="invest">
            <InvestmentSection />
          </TabsContent>

          <TabsContent value="village">
            <VillageBankSection />
          </TabsContent>

          <TabsContent value="bills">
            <BillsSection />
          </TabsContent>

          <TabsContent value="profile">
            <UserProfile />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
