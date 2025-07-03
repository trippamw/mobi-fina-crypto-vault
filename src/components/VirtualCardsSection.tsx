
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, Lock, Eye, EyeOff, Plus, Settings, Trash2, ArrowLeft, Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VirtualCardsSectionProps {
  onBack: () => void;
  onBalanceUpdate?: (currency: string, amount: number) => void;
  onTransactionUpdate?: (transaction: any) => void;
}

export const VirtualCardsSection = ({ onBack, onBalanceUpdate, onTransactionUpdate }: VirtualCardsSectionProps) => {
  const { toast } = useToast();
  const [showCreateCard, setShowCreateCard] = useState(false);
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [cardForm, setCardForm] = useState({
    type: 'standard',
    currency: 'USD',
    name: 'John Doe'
  });
  const [addMoneyForm, setAddMoneyForm] = useState({
    amount: '',
    sourceWallet: ''
  });
  const [balanceVisible, setBalanceVisible] = useState<{[key: string]: boolean}>({});

  const mockWallets = [
    { currency: 'MWK', balance: 150000 },
    { currency: 'USD', balance: 2500 },
    { currency: 'EUR', balance: 1800 },
    { currency: 'GBP', balance: 900 }
  ];

  const [cards, setCards] = useState([
    {
      id: '1',
      type: 'standard',
      currency: 'USD',
      balance: 250,
      cardNumber: '4532 •••• •••• 1234',
      expiryDate: '12/28',
      cvv: '123',
      holderName: 'John Doe',
      status: 'active',
      isPhysical: false,
      isBlocked: false,
      dailyLimit: 1000,
      monthlyLimit: 5000
    },
    {
      id: '2',
      type: 'gold',
      currency: 'EUR',
      balance: 580,
      cardNumber: '5555 •••• •••• 8888',
      expiryDate: '09/27',
      cvv: '456',
      holderName: 'John Doe',
      status: 'active',
      isPhysical: true,
      isBlocked: false,
      dailyLimit: 2500,
      monthlyLimit: 15000
    },
    {
      id: '3',
      type: 'platinum',
      currency: 'GBP',
      balance: 1200,
      cardNumber: '4111 •••• •••• 9999',
      expiryDate: '03/29',
      cvv: '789',
      holderName: 'John Doe',
      status: 'active',
      isPhysical: true,
      isBlocked: false,
      dailyLimit: 5000,
      monthlyLimit: 25000
    }
  ]);

  const cardTypes = [
    { value: 'standard', label: 'Standard Card', fee: 'FREE', color: 'from-blue-600 to-blue-800' },
    { value: 'gold', label: 'Gold Card', fee: '$5', color: 'from-yellow-400 to-yellow-600' },
    { value: 'platinum', label: 'Platinum Card', fee: '$15', color: 'from-gray-400 to-gray-600' }
  ];

  const currencies = ['USD', 'EUR', 'GBP', 'MWK'];

  const getCardGradient = (type: string) => {
    switch (type) {
      case 'gold':
        return 'bg-gradient-to-br from-yellow-400 to-yellow-600';
      case 'platinum':
        return 'bg-gradient-to-br from-gray-400 to-gray-600';
      default:
        return 'bg-gradient-to-br from-blue-600 to-blue-800';
    }
  };

  const handleCreateCard = () => {
    if (!cardForm.type || !cardForm.currency || !cardForm.name) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    const newCard = {
      id: Date.now().toString(),
      type: cardForm.type,
      currency: cardForm.currency,
      balance: 0,
      cardNumber: `${Math.floor(1000 + Math.random() * 9000)} •••• •••• ${Math.floor(1000 + Math.random() * 9000)}`,
      expiryDate: `${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}/${String(new Date().getFullYear() + 3).slice(-2)}`,
      cvv: String(Math.floor(100 + Math.random() * 900)),
      holderName: cardForm.name,
      status: 'active',
      isPhysical: false,
      isBlocked: false,
      dailyLimit: cardForm.type === 'platinum' ? 5000 : cardForm.type === 'gold' ? 2500 : 1000,
      monthlyLimit: cardForm.type === 'platinum' ? 25000 : cardForm.type === 'gold' ? 15000 : 5000
    };

    setCards([...cards, newCard]);
    
    toast({
      title: 'Success',
      description: `${cardForm.type.charAt(0).toUpperCase() + cardForm.type.slice(1)} card created successfully!`,
    });

    setShowCreateCard(false);
    setCardForm({ type: 'standard', currency: 'USD', name: 'John Doe' });
  };

  const handleAddMoney = () => {
    const amount = parseFloat(addMoneyForm.amount);
    if (!amount || amount <= 0) {
      toast({
        title: 'Error',
        description: 'Please enter a valid amount',
        variant: 'destructive'
      });
      return;
    }

    if (!addMoneyForm.sourceWallet) {
      toast({
        title: 'Error',
        description: 'Please select a source wallet',
        variant: 'destructive'
      });
      return;
    }

    const sourceWallet = mockWallets.find(w => w.currency === addMoneyForm.sourceWallet);
    if (!sourceWallet || sourceWallet.balance < amount) {
      toast({
        title: 'Error',
        description: 'Insufficient balance in source wallet',
        variant: 'destructive'
      });
      return;
    }

    // Update card balance
    setCards(cards.map(card => 
      card.id === selectedCard.id 
        ? { ...card, balance: card.balance + amount }
        : card
    ));

    // Update wallet balance
    if (onBalanceUpdate) {
      onBalanceUpdate(addMoneyForm.sourceWallet, -amount);
    }

    // Add transaction
    if (onTransactionUpdate) {
      onTransactionUpdate({
        type: 'Card Top-up',
        amount: `-${addMoneyForm.sourceWallet} ${amount.toLocaleString()}`,
        description: `Added money to ${selectedCard.type} card`,
        time: 'Just now',
        status: 'completed'
      });
    }

    toast({
      title: 'Success',
      description: `${selectedCard.currency} ${amount.toLocaleString()} added to your card successfully!`,
    });

    setShowAddMoney(false);
    setAddMoneyForm({ amount: '', sourceWallet: '' });
  };

  const toggleCardVisibility = (cardId: string) => {
    setBalanceVisible(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  const formatBalance = (balance: number, currency: string) => {
    if (currency === 'MWK') {
      return `MWK ${balance.toLocaleString()}`;
    } else if (currency === 'USD') {
      return `$${balance.toLocaleString()}`;
    } else if (currency === 'EUR') {
      return `€${balance.toLocaleString()}`;
    } else if (currency === 'GBP') {
      return `£${balance.toLocaleString()}`;
    }
    return `${balance.toLocaleString()} ${currency}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-3 pb-24">
      <div className="container mx-auto max-w-lg space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-lg font-bold text-white text-center flex-1">
            Virtual Cards
          </h1>
          <Button
            onClick={() => setShowCreateCard(true)}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
          >
            <Plus className="w-3 h-3 mr-1" />
            Create
          </Button>
        </div>

        {/* Cards */}
        <div className="space-y-4">
          {cards.map((card) => (
            <Card key={card.id} className={`${getCardGradient(card.type)} border-0 shadow-xl text-white overflow-hidden`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-5 h-5" />
                    <div>
                      <p className="font-semibold text-sm">
                        {card.type.charAt(0).toUpperCase() + card.type.slice(1)} Card
                      </p>
                      <p className="text-xs opacity-90">{card.currency}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-white/20 text-white border-0 text-xs">
                      {card.isPhysical ? 'Physical' : 'Virtual'}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleCardVisibility(card.id)}
                      className="text-white/80 hover:text-white p-1"
                    >
                      {balanceVisible[card.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-xl font-mono font-bold tracking-wider">
                    {card.cardNumber}
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs opacity-75 mb-1">Card Holder</p>
                      <p className="font-semibold text-sm">{card.holderName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs opacity-75 mb-1">Balance</p>
                      <p className="text-lg font-bold">
                        {balanceVisible[card.id] ? formatBalance(card.balance, card.currency) : '••••••'}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <div>
                      <span className="opacity-75">EXP </span>
                      <span className="font-mono">{card.expiryDate}</span>
                    </div>
                    <div>
                      <span className="opacity-75">CVV </span>
                      <span className="font-mono">•••</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4">
                  <Button
                    onClick={() => {
                      setSelectedCard(card);
                      setShowAddMoney(true);
                    }}
                    size="sm"
                    className="bg-white/20 hover:bg-white/30 text-white border-0 text-xs"
                  >
                    <Wallet className="w-3 h-3 mr-1" />
                    Add Money
                  </Button>
                  <Button
                    size="sm"
                    className="bg-white/20 hover:bg-white/30 text-white border-0 text-xs"
                  >
                    <Settings className="w-3 h-3 mr-1" />
                    Settings
                  </Button>
                  <Button
                    size="sm"
                    className="bg-white/20 hover:bg-white/30 text-white border-0 text-xs"
                  >
                    <Lock className="w-3 h-3 mr-1" />
                    {card.isBlocked ? 'Unblock' : 'Block'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Create Card Modal */}
        <Dialog open={showCreateCard} onOpenChange={setShowCreateCard}>
          <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-sm mx-auto">
            <DialogHeader>
              <DialogTitle className="text-base">Create New Card</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-white text-sm">Card Holder Name</Label>
                <Input
                  value={cardForm.name}
                  onChange={(e) => setCardForm({...cardForm, name: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white mt-1"
                  placeholder="Enter cardholder name"
                />
              </div>

              <div>
                <Label className="text-white text-sm">Card Type</Label>
                <Select value={cardForm.type} onValueChange={(value) => setCardForm({...cardForm, type: value})}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700 z-50">
                    {cardTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value} className="text-white">
                        <div className="flex justify-between items-center w-full">
                          <span>{type.label}</span>
                          <span className="text-sm text-gray-400">{type.fee}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white text-sm">Currency</Label>
                <Select value={cardForm.currency} onValueChange={(value) => setCardForm({...cardForm, currency: value})}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700 z-50">
                    {currencies.map((currency) => (
                      <SelectItem key={currency} value={currency} className="text-white">
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateCard(false)}
                  className="flex-1 border-gray-600 text-white hover:bg-gray-700 hover:text-white text-sm"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateCard}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm"
                >
                  Create Card
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Money Modal */}
        <Dialog open={showAddMoney} onOpenChange={setShowAddMoney}>
          <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-sm mx-auto">
            <DialogHeader>
              <DialogTitle className="text-base">Add Money to Card</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-white text-sm">Amount ({selectedCard?.currency})</Label>
                <Input
                  type="number"
                  value={addMoneyForm.amount}
                  onChange={(e) => setAddMoneyForm({...addMoneyForm, amount: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white mt-1"
                  placeholder="Enter amount"
                />
              </div>

              <div>
                <Label className="text-white text-sm">Source Wallet</Label>
                <Select value={addMoneyForm.sourceWallet} onValueChange={(value) => setAddMoneyForm({...addMoneyForm, sourceWallet: value})}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white mt-1">
                    <SelectValue placeholder="Select wallet" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700 z-50">
                    {mockWallets.filter(w => w.currency === selectedCard?.currency).map((wallet) => (
                      <SelectItem key={wallet.currency} value={wallet.currency} className="text-white">
                        {wallet.currency} (Balance: {formatBalance(wallet.balance, wallet.currency)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowAddMoney(false)}
                  className="flex-1 border-gray-600 text-white hover:bg-gray-700 hover:text-white text-sm"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddMoney}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm"
                >
                  Add Money
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
