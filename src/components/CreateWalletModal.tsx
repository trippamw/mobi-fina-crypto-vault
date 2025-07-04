
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Wallet, Bitcoin } from 'lucide-react';
import { useLanguage } from '@/utils/languageApi';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/lib/api';

interface CreateWalletModalProps {
  onCreateWallet: (wallet: any) => void;
}

export const CreateWalletModal = ({ onCreateWallet }: CreateWalletModalProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [walletType, setWalletType] = useState('');
  const [currency, setCurrency] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  const handleCreate = async () => {
    if (!walletType || !currency) return;

    try {
      setIsLoading(true);
      
      // Call the backend API to create the wallet
      const result = await apiService.createWallet(currency, walletType);
      
      if (result.success) {
        // Notify parent component to refresh data
        onCreateWallet(result.data.wallet);
        
        toast({
          title: "Wallet Created",
          description: `${currency} wallet created successfully`,
        });
        
        setIsOpen(false);
        setCurrency('');
        setWalletType('');
      }
    } catch (error) {
      console.error('Wallet creation error:', error);
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create wallet",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gradient-primary">
          <Plus className="w-4 h-4 mr-2" />
          {t('wallet')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('wallet')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>{t('wallet')}</Label>
            <Select value={walletType} onValueChange={setWalletType}>
              <SelectTrigger>
                <SelectValue placeholder={t('wallet')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fiat">
                  <div className="flex items-center">
                    <Wallet className="w-4 h-4 mr-2" />
                    Fiat {t('currency')}
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
              <Label>{t('currency')}</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
                  <SelectValue placeholder={t('currency')} />
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
            disabled={!walletType || !currency || isLoading}
          >
            {isLoading ? 'Creating...' : `Create ${t('wallet')}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
