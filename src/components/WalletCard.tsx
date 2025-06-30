
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, Bitcoin, CreditCard, Euro } from 'lucide-react';

interface WalletCardProps {
  wallet: {
    currency: string;
    balance: number;
    icon: string;
    gradient: string;
    change: string;
    isDefault?: boolean;
    usdValue?: number;
  };
  balanceVisible: boolean;
}

export const WalletCard: React.FC<WalletCardProps> = ({ wallet, balanceVisible }) => {
  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'bitcoin':
        return <Bitcoin className="w-6 h-6 crypto-bitcoin" />;
      case 'ethereum':
        return <div className="w-6 h-6 crypto-ethereum flex items-center justify-center font-bold">Ξ</div>;
      case 'usdt':
        return <div className="w-6 h-6 crypto-usdt flex items-center justify-center font-bold text-sm">₮</div>;
      case 'usdc':
        return <div className="w-6 h-6 crypto-usdc flex items-center justify-center font-bold text-sm">$</div>;
      case 'dollar':
        return <div className="w-6 h-6 text-green-400 flex items-center justify-center font-bold">$</div>;
      case 'pound':
        return <div className="w-6 h-6 text-purple-400 flex items-center justify-center font-bold">£</div>;
      case 'euro':
        return <Euro className="w-6 h-6 text-yellow-400" />;
      case 'rand':
        return <div className="w-6 h-6 text-orange-400 flex items-center justify-center font-bold">R</div>;
      default:
        return <Wallet className="w-6 h-6 text-primary" />;
    }
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

  const getCurrencyName = (currency: string) => {
    const names: { [key: string]: string } = {
      'MWK': 'Malawian Kwacha',
      'USD': 'US Dollar',
      'GBP': 'British Pound',
      'EUR': 'Euro',
      'ZAR': 'South African Rand',
      'BTC': 'Bitcoin',
      'ETH': 'Ethereum',
      'USDT': 'Tether USD',
      'USDC': 'USD Coin'
    };
    return names[currency] || currency;
  };

  return (
    <Card className={`${wallet.gradient} border-border/50 card-hover relative overflow-hidden`}>
      {wallet.isDefault && (
        <Badge className="absolute top-3 right-3 bg-accent/20 text-accent border-accent/30">
          Default
        </Badge>
      )}
      
      <CardContent className="pt-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {getIcon(wallet.icon)}
            <div>
              <h3 className="font-semibold text-white">{wallet.currency}</h3>
              <p className="text-xs text-white/70">
                {getCurrencyName(wallet.currency)}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-xl font-bold text-white">
            {balanceVisible ? formatBalance(wallet.balance, wallet.currency) : '••••••'}
          </div>
          
          {wallet.usdValue && balanceVisible && (
            <div className="text-sm text-white/70">
              ≈ ${wallet.usdValue.toLocaleString()}
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <Badge 
              variant="secondary" 
              className={`${wallet.change.startsWith('+') ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'} border-0`}
            >
              {wallet.change}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
