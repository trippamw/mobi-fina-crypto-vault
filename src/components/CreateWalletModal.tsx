
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Wallet, Bitcoin } from 'lucide-react';

interface CreateWalletModalProps {
  onCreateWallet: (wallet: any) => void;
}

export const CreateWalletModal = ({ onCreateWallet }: CreateWalletModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [walletType, setWalletType] = useState('');
  const [currency, setCurrency] = useState('');

  const currencies = {
    fiat: [
      { code: 'MWK', name: 'Malawian Kwacha', icon: 'wallet' },
      { code: 'USD', name: 'US Dollar', icon: 'dollar' },
      { code: 'GBP', name: 'British Pound', icon: 'pound' },
      { code: 'EUR', name: 'Euro', icon: 'euro' },
      { code: 'ZAR', name: 'South African Rand', icon: 'rand' }
    ],
    crypto: [
      { code: 'BTC', name: 'Bitcoin', icon: 'bitcoin' },
      { code: 'ETH', name: 'Ethereum', icon: 'ethereum' },
      { code: 'USDT', name: 'Tether USD', icon: 'usdt' },
      { code: 'USDC', name: 'USD Coin', icon: 'usdc' }
    ]
  };

  const handleCreate = () => {
    if (!walletType || !currency) return;

    const selectedCurrency = [...currencies.fiat, ...currencies.crypto].find(c => c.code === currency);
    if (!selectedCurrency) return;

    const newWallet = {
      currency: selectedCurrency.code,
      balance: 0,
      icon: selectedCurrency.icon,
      gradient: `gradient-${selectedCurrency.icon}`,
      change: '+0.0%',
      isDefault: false
    };

    onCreateWallet(newWallet);
    setIsOpen(false);
    setCurrency('');
    setWalletType('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gradient-primary">
          <Plus className="w-4 h-4 mr-2" />
          Create Wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Wallet</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Wallet Type</Label>
            <Select value={walletType} onValueChange={setWalletType}>
              <SelectTrigger>
                <SelectValue placeholder="Select wallet type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fiat">
                  <div className="flex items-center">
                    <Wallet className="w-4 h-4 mr-2" />
                    Fiat Currency
                  </div>
                </SelectItem>
                <SelectItem value="crypto">
                  <div className="flex items-center">
                    <Bitcoin className="w-4 h-4 mr-2" />
                    Cryptocurrency
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {walletType && (
            <div>
              <Label>Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies[walletType as keyof typeof currencies]?.map((curr) => (
                    <SelectItem key={curr.code} value={curr.code}>
                      {curr.code} - {curr.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button 
            onClick={handleCreate} 
            className="w-full gradient-primary"
            disabled={!walletType || !currency}
          >
            Create Wallet
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
