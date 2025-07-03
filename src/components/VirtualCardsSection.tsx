import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Lock, Eye, EyeOff, Plus, Settings, Trash2, Wallet, Shield, Snowflake, MapPin, Phone, Mail } from 'lucide-react';
import { CardSettings } from '@/components/CardSettings';
import { useToast } from '@/hooks/use-toast';

interface VirtualCardsSectionProps {
  wallets: any[];
  onBalanceUpdate?: (currency: string, amount: number) => void;
  onTransactionUpdate?: (transaction: any) => void;
}

export const VirtualCardsSection = ({ wallets, onBalanceUpdate, onTransactionUpdate }: VirtualCardsSectionProps) => {
  const { toast } = useToast();
  const [showCreateCard, setShowCreateCard] = useState(false);
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [cardForm, setCardForm] = useState({
    type: 'standard',
    currency: 'USD',
    name: 'John Doe',
    isPhysical: false,
    // Physical card details
    address: '',
    phone: '',
    email: '',
    location: '',
    postBox: ''
  });
  const [addMoneyForm, setAddMoneyForm] = useState({
    amount: '',
    sourceWallet: ''
  });
  const [balanceVisible, setBalanceVisible] = useState<{[key: string]: boolean}>({});

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
    { 
      value: 'standard', 
      label: 'Standard Card', 
      virtualFee: 'FREE',
      physicalFee: 'MWK 5,000', 
      color: 'from-blue-600 to-blue-800',
      benefits: ['Online payments', 'Mobile money deposits', 'Basic security features']
    },
    { 
      value: 'gold', 
      label: 'Gold Card', 
      virtualFee: 'MWK 3,000',
      physicalFee: 'MWK 15,000', 
      color: 'from-yellow-400 to-yellow-600',
      benefits: ['Priority support', 'Higher limits', 'Cashback rewards', 'Airport lounge access']
    },
    { 
      value: 'platinum', 
      label: 'Platinum Card', 
      virtualFee: 'MWK 8,000',
      physicalFee: 'MWK 35,000', 
      color: 'from-gray-400 to-gray-600',
      benefits: ['Premium support', 'Highest limits', 'Travel insurance', 'Concierge service', 'Global acceptance']
    }
  ];

  const currencies = ['USD', 'EUR', 'GBP', 'MWK'];

  const getCardGradient = (type: string) => {
    switch (type) {
      case 'gold':
        return 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600';
      case 'platinum':
        return 'bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600';
      default:
        return 'bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800';
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

    if (cardForm.isPhysical) {
      if (!cardForm.address || !cardForm.phone || !cardForm.email || !cardForm.location) {
        toast({
          title: 'Error',
          description: 'Please fill in all physical card delivery details',
          variant: 'destructive'
        });
        return;
      }
    }

    const selectedCardType = cardTypes.find(ct => ct.value === cardForm.type);
    const fee = cardForm.isPhysical ? selectedCardType?.physicalFee : selectedCardType?.virtualFee;
    const feeAmount = fee === 'FREE' ? 0 : parseInt(fee?.replace(/[^\d]/g, '') || '0');

    // Check if user has enough MWK for the fee
    const mwkWallet = wallets.find(w => w.currency === 'MWK');
    if (feeAmount > 0 && (!mwkWallet || mwkWallet.balance < feeAmount)) {
      toast({
        title: 'Insufficient Balance',
        description: `You need MWK ${feeAmount.toLocaleString()} to create this card`,
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
      isPhysical: cardForm.isPhysical,
      isBlocked: false,
      dailyLimit: cardForm.type === 'platinum' ? 5000 : cardForm.type === 'gold' ? 2500 : 1000,
      monthlyLimit: cardForm.type === 'platinum' ? 25000 : cardForm.type === 'gold' ? 15000 : 5000,
      deliveryDetails: cardForm.isPhysical ? {
        address: cardForm.address,
        phone: cardForm.phone,
        email: cardForm.email,
        location: cardForm.location,
        postBox: cardForm.postBox
      } : null
    };

    setCards([...cards, newCard]);
    
    // Deduct fee if applicable
    if (feeAmount > 0 && onBalanceUpdate) {
      onBalanceUpdate('MWK', -feeAmount);
    }

    // Add transaction
    if (onTransactionUpdate) {
      onTransactionUpdate({
        type: 'Card Purchase',
        amount: feeAmount > 0 ? `-MWK ${feeAmount.toLocaleString()}` : 'FREE',
        description: `${cardForm.type.charAt(0).toUpperCase() + cardForm.type.slice(1)} ${cardForm.isPhysical ? 'Physical' : 'Virtual'} card created`,
        time: 'Just now',
        status: 'completed'
      });
    }
    
    toast({
      title: 'Success',
      description: `${cardForm.type.charAt(0).toUpperCase() + cardForm.type.slice(1)} ${cardForm.isPhysical ? 'physical' : 'virtual'} card created successfully!${cardForm.isPhysical ? ' Physical card will be delivered in 5-7 business days.' : ''}`,
    });

    setShowCreateCard(false);
    setCardForm({ 
      type: 'standard', 
      currency: 'USD', 
      name: 'John Doe', 
      isPhysical: false,
      address: '',
      phone: '',
      email: '',
      location: '',
      postBox: ''
    });
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

    const sourceWallet = wallets.find(w => w.currency === addMoneyForm.sourceWallet);
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

  const handleBlockCard = (cardId: string) => {
    setCards(cards.map(card => 
      card.id === cardId 
        ? { ...card, isBlocked: !card.isBlocked }
        : card
    ));
    
    const card = cards.find(c => c.id === cardId);
    toast({
      title: 'Success',
      description: `Card ${card?.isBlocked ? 'unblocked' : 'blocked'} successfully!`,
    });
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
    <div className="space-y-4">
      {/* Create Card Button */}
      <div className="flex justify-end">
        <Button
          onClick={() => setShowCreateCard(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Card
        </Button>
      </div>

      {/* Cards Grid - Better Rectangular Design */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div key={card.id} className="group">
            {/* Card Design - More Rectangular Credit Card Style */}
            <div className={`${getCardGradient(card.type)} rounded-2xl p-6 text-white shadow-2xl transform transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-3xl relative overflow-hidden`} style={{ aspectRatio: '1.6/1', minHeight: '200px' }}>
              {/* Card Type Badge */}
              <div className="absolute top-4 right-4">
                <Badge className="bg-white/20 text-white border-0 text-xs backdrop-blur-sm">
                  {card.type.charAt(0).toUpperCase() + card.type.slice(1)}
                </Badge>
              </div>

              {/* Physical Card Indicator */}
              {card.isPhysical && (
                <div className="absolute top-4 left-4">
                  <Badge className="bg-green-500/20 text-green-300 border-green-400/30 text-xs backdrop-blur-sm">
                    Physical
                  </Badge>
                </div>
              )}

              {/* Card Brand Logo Area */}
              <div className="flex justify-between items-start mb-6 mt-8">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs opacity-75">NeoVault</p>
                    <p className="text-xs font-semibold">{card.currency}</p>
                  </div>
                </div>
                {card.isBlocked && (
                  <Lock className="w-5 h-5 text-red-300" />
                )}
              </div>

              {/* Card Number */}
              <div className="mb-6">
                <p className="text-lg font-mono font-bold tracking-wider">
                  {card.cardNumber}
                </p>
              </div>

              {/* Card Details Bottom Section - Better Aligned */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex justify-between items-end mb-3">
                  <div>
                    <p className="text-xs opacity-75 mb-1">Card Holder</p>
                    <p className="font-semibold text-sm">{card.holderName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs opacity-75 mb-1">Balance</p>
                    <p className="text-base font-bold">
                      {balanceVisible[card.id] ? formatBalance(card.balance, card.currency) : '••••••'}
                    </p>
                  </div>
                </div>

                {/* Expiry and CVV - Properly Aligned */}
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

              {/* Decorative Elements */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/5 rounded-full"></div>
              <div className="absolute -top-8 -left-8 w-32 h-32 bg-white/5 rounded-full"></div>
            </div>

            {/* Card Action Buttons */}
            <div className="mt-4 grid grid-cols-4 gap-2">
              <Button
                onClick={() => {
                  setSelectedCard(card);
                  setShowAddMoney(true);
                }}
                size="sm"
                className="bg-gray-800 hover:bg-gray-700 text-white text-xs"
              >
                <Wallet className="w-3 h-3 mr-1" />
                Add
              </Button>
              <Button
                onClick={() => toggleCardVisibility(card.id)}
                size="sm"
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white text-xs"
              >
                {balanceVisible[card.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              </Button>
              <Button
                onClick={() => handleBlockCard(card.id)}
                size="sm"
                className={`text-xs ${card.isBlocked ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white`}
              >
                {card.isBlocked ? <Shield className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
              </Button>
              <CardSettings
                cardId={card.id}
                cardType={card.type}
                onSettingsChange={() => {}}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Create Card Modal - Enhanced with Physical Card Options */}
      <Dialog open={showCreateCard} onOpenChange={setShowCreateCard}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md mx-auto max-h-[90vh] overflow-y-auto">
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
                      <div className="flex flex-col">
                        <div className="flex justify-between items-center w-full">
                          <span>{type.label}</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Virtual: {type.virtualFee} | Physical: {type.physicalFee}
                        </div>
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

            <div>
              <Label className="text-white text-sm">Card Format</Label>
              <Select value={cardForm.isPhysical ? 'physical' : 'virtual'} onValueChange={(value) => setCardForm({...cardForm, isPhysical: value === 'physical'})}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700 z-50">
                  <SelectItem value="virtual" className="text-white">Virtual Card</SelectItem>
                  <SelectItem value="physical" className="text-white">Physical Card</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Show benefits and pricing */}
            {cardForm.type && (
              <div className="bg-gray-800/50 p-3 rounded-lg">
                <h4 className="text-sm font-semibold mb-2">
                  {cardTypes.find(ct => ct.value === cardForm.type)?.label} Benefits
                </h4>
                <ul className="text-xs text-gray-300 space-y-1 mb-3">
                  {cardTypes.find(ct => ct.value === cardForm.type)?.benefits.map((benefit, index) => (
                    <li key={index}>• {benefit}</li>
                  ))}
                </ul>
                <div className="text-xs">
                  <p className="text-green-400">
                    Cost: {cardForm.isPhysical 
                      ? cardTypes.find(ct => ct.value === cardForm.type)?.physicalFee 
                      : cardTypes.find(ct => ct.value === cardForm.type)?.virtualFee}
                  </p>
                </div>
              </div>
            )}

            {/* Physical Card Details */}
            {cardForm.isPhysical && (
              <>
                <Separator className="bg-gray-700" />
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-white">Delivery Details</h4>
                  
                  <div>
                    <Label className="text-white text-sm">Address</Label>
                    <Textarea
                      value={cardForm.address}
                      onChange={(e) => setCardForm({...cardForm, address: e.target.value})}
                      className="bg-gray-800 border-gray-600 text-white mt-1"
                      placeholder="Enter your full address"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-white text-sm">Phone</Label>
                      <Input
                        value={cardForm.phone}
                        onChange={(e) => setCardForm({...cardForm, phone: e.target.value})}
                        className="bg-gray-800 border-gray-600 text-white mt-1"
                        placeholder="+265..."
                      />
                    </div>
                    <div>
                      <Label className="text-white text-sm">Email</Label>
                      <Input
                        type="email"
                        value={cardForm.email}
                        onChange={(e) => setCardForm({...cardForm, email: e.target.value})}
                        className="bg-gray-800 border-gray-600 text-white mt-1"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-white text-sm">Location/City</Label>
                      <Input
                        value={cardForm.location}
                        onChange={(e) => setCardForm({...cardForm, location: e.target.value})}
                        className="bg-gray-800 border-gray-600 text-white mt-1"
                        placeholder="Lilongwe"
                      />
                    </div>
                    <div>
                      <Label className="text-white text-sm">Post Box (Optional)</Label>
                      <Input
                        value={cardForm.postBox}
                        onChange={(e) => setCardForm({...cardForm, postBox: e.target.value})}
                        className="bg-gray-800 border-gray-600 text-white mt-1"
                        placeholder="P.O. Box..."
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

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
                  {wallets.filter(w => w.currency === selectedCard?.currency).map((wallet) => (
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
  );
};
