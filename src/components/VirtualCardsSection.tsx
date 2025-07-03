import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent as DialogContentPrimitive, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from '@/hooks/use-toast';

interface VirtualCardProps {
  id: string;
  type: string;
  number: string;
  balance: number;
  status: string;
  purchasedAt: string;
  onAddMoney: (cardId: string, amount: number, fromCurrency: string, toCurrency: string, conversionFee?: number) => void;
  onSettings: (cardId: string) => void;
  wallets: Array<{
    currency: string;
    balance: number;
  }>;
}

const VirtualCard: React.FC<VirtualCardProps> = ({
  id,
  type,
  number,
  balance,
  status,
  purchasedAt,
  onAddMoney,
  onSettings,
  wallets
}) => {
  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);
  const [addMoneyAmount, setAddMoneyAmount] = useState('');
  const [selectedWallet, setSelectedWallet] = useState('');
  const { toast } = useToast();

  const handleAddMoneySubmit = () => {
    if (!selectedWallet || !addMoneyAmount) {
      toast({
        title: "Error",
        description: "Please select a wallet and enter an amount.",
        variant: "destructive"
      });
      return;
    }

    const amount = parseFloat(addMoneyAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount.",
        variant: "destructive"
      });
      return;
    }

    onAddMoney(id, amount, selectedWallet, 'MWK');
    setIsAddMoneyOpen(false);
    setAddMoneyAmount('');
    setSelectedWallet('');
  };

  return (
    <Card className="bg-gray-800 border-gray-700 text-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{type} Card</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p>
          <strong>Number:</strong> {number}
        </p>
        <p>
          <strong>Balance:</strong> MWK {balance.toFixed(2)}
        </p>
        <p>
          <strong>Status:</strong> {status}
        </p>
        <div className="flex justify-between">
          <Button size="sm" onClick={() => setIsAddMoneyOpen(true)}>
            Add Money
          </Button>
          <Button size="sm" variant="secondary" onClick={() => onSettings(id)}>
            Settings
          </Button>
        </div>
      </CardContent>

      <Dialog open={isAddMoneyOpen} onOpenChange={setIsAddMoneyOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Add Money to Card</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="wallet" className="text-right">
                Wallet
              </Label>
              <Select onValueChange={setSelectedWallet} defaultValue={selectedWallet} className="col-span-3">
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select a wallet" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 text-white">
                  {wallets.map((wallet) => (
                    <SelectItem key={wallet.currency} value={wallet.currency}>
                      {wallet.currency} - {wallet.balance.toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <Input
                type="number"
                id="amount"
                value={addMoneyAmount}
                onChange={(e) => setAddMoneyAmount(e.target.value)}
                className="col-span-3 bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="secondary" onClick={() => setIsAddMoneyOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMoneySubmit}>Add Money</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

interface VirtualCardsSectionProps {
  onBalanceUpdate: (currency: string, amount: number) => void;
  onTransactionUpdate: (transaction: any) => void;
  onBack: () => void;
  wallets: Array<{
    currency: string;
    balance: number;
  }>;
  onAddMoneyToCard?: (cardId: string, amount: number, fromCurrency: string, toCurrency: string, conversionFee?: number) => void;
}

export const VirtualCardsSection: React.FC<VirtualCardsSectionProps> = ({
  onBalanceUpdate,
  onTransactionUpdate,
  onBack,
  wallets,
  onAddMoneyToCard
}) => {
  const [purchasedCards, setPurchasedCards] = useState([]);
  const [isPurchaseCardOpen, setIsPurchaseCardOpen] = useState(false);
  const [selectedCardType, setSelectedCardType] = useState('Standard');

  const handleCardPurchase = (cardType: string) => {
    const cardDetails = {
      Standard: { price: 0 },
      Gold: { price: 15000 },
      Platinum: { price: 35000 }
    };

    const cardInfo = cardDetails[cardType as keyof typeof cardDetails];
    if (!cardInfo) return;

    const newCard = {
      id: Date.now(),
      type: cardType,
      number: `**** **** **** ${Math.floor(1000 + Math.random() * 9000)}`,
      balance: 0,
      status: 'Active',
      purchasedAt: new Date().toISOString()
    };
    setPurchasedCards(prev => [...prev, newCard]);
    setIsPurchaseCardOpen(false);
  };

  const handleAddMoney = (cardId: string, amount: number, fromCurrency: string, toCurrency: string, conversionFee?: number) => {
    if (onAddMoneyToCard) {
      onAddMoneyToCard(cardId, amount, fromCurrency, toCurrency, conversionFee);
    }
    
    // Update the local card state as well
    setPurchasedCards(prevCards => 
      prevCards.map(card => 
        card.id === cardId 
          ? { ...card, balance: card.balance + amount }
          : card
      )
    );
  };

  const handleCardSettings = (cardId: string) => {
    alert(`Settings for card ${cardId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header and Purchase Cards Section */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-white">Virtual Cards</h2>
        <Button onClick={() => setIsPurchaseCardOpen(true)}>Purchase Card</Button>
      </div>

      {/* Purchase Card Dialog */}
      <Dialog open={isPurchaseCardOpen} onOpenChange={setIsPurchaseCardOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Purchase a Virtual Card</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cardType" className="text-right">
                Card Type
              </Label>
              <Select onValueChange={setSelectedCardType} defaultValue={selectedCardType} className="col-span-3">
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select a card type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 text-white">
                  <SelectItem value="Standard">Standard (Free)</SelectItem>
                  <SelectItem value="Gold">Gold (MWK 15,000)</SelectItem>
                  <SelectItem value="Platinum">Platinum (MWK 35,000)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="secondary" onClick={() => setIsPurchaseCardOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => handleCardPurchase(selectedCardType)}>Purchase</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Purchased Cards Section */}
      {purchasedCards.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-white mb-4">My Cards</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {purchasedCards.map((card) => (
              <VirtualCard 
                key={card.id}
                {...card} 
                onAddMoney={handleAddMoney}
                onSettings={handleCardSettings}
                wallets={wallets}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
