import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Plus, CreditCard, Eye, EyeOff, Settings, DollarSign } from 'lucide-react';
import { CardSettings } from '@/components/CardSettings';

interface Card {
  id: string;
  type: 'visa' | 'mastercard';
  number: string;
  holderName: string;
  expiryDate: string;
  cvv: string;
  currency: string;
  balance: number;
  isBlocked: boolean;
  isPhysical?: boolean;
  status: 'active' | 'frozen' | 'blocked';
}

interface CardBenefit {
  feature: string;
  description: string;
}

interface CardType {
  id: string;
  name: string;
  type: 'visa' | 'mastercard';
  annualFee: number;
  benefits: CardBenefit[];
  color: string;
  isPhysical?: boolean;
}

interface VirtualCardsSectionProps {
  onBack: () => void;
  onBalanceUpdate?: (currency: string, amount: number) => void;
  onTransactionUpdate?: (transaction: any) => void;
  wallets?: any[];
}

export const VirtualCardsSection = ({ onBack, onBalanceUpdate, onTransactionUpdate, wallets }: VirtualCardsSectionProps) => {
  const [cards, setCards] = useState<Card[]>([
    {
      id: '1',
      type: 'visa',
      number: '4532 1234 5678 9012',
      holderName: 'JOHN BANDA',
      expiryDate: '12/27',
      cvv: '123',
      currency: 'USD',
      balance: 250.75,
      isBlocked: false,
      status: 'active'
    },
    {
      id: '2',
      type: 'visa',
      number: '4555 4444 3333 2222',
      holderName: 'JOHN BANDA',
      expiryDate: '03/26',
      cvv: '456',
      currency: 'EUR',
      balance: 180.50,
      isBlocked: false,
      status: 'active'
    }
  ]);

  const [showCardNumbers, setShowCardNumbers] = useState<{[key: string]: boolean}>({});
  const [showCreateCard, setShowCreateCard] = useState(false);
  const [selectedCardType, setSelectedCardType] = useState<string>('');
  const [isPhysicalCard, setIsPhysicalCard] = useState(false);
  const [showCardSettings, setShowCardSettings] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const [cardForm, setCardForm] = useState({
    holderName: '',
    address: '',
    phone: '',
    email: '',
    location: '',
    postBox: ''
  });

  const cardTypes: CardType[] = [
    {
      id: 'visa-standard',
      name: 'Visa Classic',
      type: 'visa',
      annualFee: 25000,
      color: 'from-blue-600 to-blue-800',
      benefits: [
        { feature: 'Global Acceptance', description: 'Use worldwide at millions of locations' },
        { feature: 'Online Shopping', description: 'Secure online transactions' },
        { feature: 'ATM Access', description: 'Withdraw cash from ATMs globally' },
        { feature: '24/7 Support', description: 'Round the clock customer service' }
      ]
    },
    {
      id: 'visa-gold',
      name: 'Visa Gold',
      type: 'visa',
      annualFee: 75000,
      color: 'from-yellow-500 to-yellow-700',
      benefits: [
        { feature: 'Premium Support', description: 'Priority customer service' },
        { feature: 'Travel Insurance', description: 'Comprehensive travel coverage' },
        { feature: 'Airport Lounge', description: 'Access to premium lounges' },
        { feature: 'Concierge Service', description: '24/7 lifestyle assistance' }
      ]
    },
    {
      id: 'visa-platinum',
      name: 'Visa Platinum',
      type: 'visa',
      annualFee: 150000,
      color: 'from-gray-400 to-gray-600',
      benefits: [
        { feature: 'Premium Support', description: 'Priority customer service' },
        { feature: 'Travel Insurance', description: 'Comprehensive travel coverage' },
        { feature: 'Airport Lounge', description: 'Access to premium lounges' },
        { feature: 'Concierge Service', description: '24/7 lifestyle assistance' },
        { feature: 'Cash Back', description: 'Up to 2% cash back on purchases' },
        { feature: 'Extended Warranty', description: 'Extended warranty on purchases' }
      ]
    }
  ];

  const toggleCardVisibility = (cardId: string) => {
    setShowCardNumbers(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  const handleCreateCard = () => {
    if (!selectedCardType) {
      alert('Please select a card type');
      return;
    }

    if (isPhysicalCard && (!cardForm.holderName || !cardForm.address || !cardForm.phone)) {
      alert('Please fill in all required fields for physical card');
      return;
    }

    const selectedType = cardTypes.find(t => t.id === selectedCardType);
    if (!selectedType) return;

    const newCard: Card = {
      id: Date.now().toString(),
      type: 'visa',
      number: generateCardNumber('visa'),
      holderName: cardForm.holderName || 'JOHN BANDA',
      expiryDate: generateExpiryDate(),
      cvv: generateCVV(),
      currency: 'USD',
      balance: 0,
      isBlocked: false,
      isPhysical: isPhysicalCard,
      status: 'active'
    };

    setCards([...cards, newCard]);
    
    // Reset form
    setCardForm({
      holderName: '',
      address: '',
      phone: '',
      email: '',
      location: '',
      postBox: ''
    });
    setSelectedCardType('');
    setIsPhysicalCard(false);
    setShowCreateCard(false);

    alert(`${isPhysicalCard ? 'Physical' : 'Virtual'} ${selectedType.name} created successfully! Annual fee: MWK ${selectedType.annualFee.toLocaleString()}`);
  };

  const generateCardNumber = (type: 'visa' | 'mastercard') => {
    const prefix = '4';
    const remaining = Array.from({length: 15}, () => Math.floor(Math.random() * 10)).join('');
    const fullNumber = prefix + remaining.substring(0, 14);
    return fullNumber.replace(/(.{4})/g, '$1 ').trim();
  };

  const generateExpiryDate = () => {
    const currentYear = new Date().getFullYear() % 100;
    const expiryYear = currentYear + 3 + Math.floor(Math.random() * 3);
    const month = Math.floor(Math.random() * 12) + 1;
    return `${month.toString().padStart(2, '0')}/${expiryYear}`;
  };

  const generateCVV = () => {
    return Math.floor(Math.random() * 900 + 100).toString();
  };

  const handleCardAction = (cardId: string, action: 'freeze' | 'unfreeze' | 'block' | 'unblock' | 'delete') => {
    setCards(prevCards => {
      return prevCards.map(card => {
        if (card.id === cardId) {
          switch (action) {
            case 'freeze':
              return { ...card, status: 'frozen' as const };
            case 'unfreeze':
              return { ...card, status: 'active' as const };
            case 'block':
              return { ...card, status: 'blocked' as const, isBlocked: true };
            case 'unblock':
              return { ...card, status: 'active' as const, isBlocked: false };
            case 'delete':
              return card;
            default:
              return card;
          }
        }
        return card;
      }).filter(card => !(card.id === cardId && action === 'delete'));
    });

    if (action === 'delete') {
      alert('Card deleted successfully');
    } else {
      alert(`Card ${action}d successfully`);
    }
  };

  const openCardSettings = (card: Card) => {
    setSelectedCard(card);
    setShowCardSettings(true);
  };

  const handleAddMoney = (card: Card) => {
    const amount = prompt(`Enter amount to add to your ${card.currency} card:`);
    if (amount && !isNaN(Number(amount))) {
      const numAmount = Number(amount);
      setCards(prevCards => 
        prevCards.map(c => 
          c.id === card.id 
            ? { ...c, balance: c.balance + numAmount }
            : c
        )
      );
      
      if (onBalanceUpdate) {
        onBalanceUpdate(card.currency, numAmount);
      }
      
      if (onTransactionUpdate) {
        onTransactionUpdate({
          type: 'Card Top-up',
          amount: `+${card.currency} ${numAmount.toFixed(2)}`,
          description: `Added money to ${card.type} card`,
          time: 'Just now',
          status: 'completed'
        });
      }
      
      alert(`Successfully added ${card.currency} ${numAmount.toFixed(2)} to your card`);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h2 className="text-xl font-bold text-white">Virtual Cards</h2>
            <p className="text-sm text-white/70">Manage your payment cards</p>
          </div>
        </div>
        <Button
          onClick={() => setShowCreateCard(true)}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Card
        </Button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div key={card.id} className="space-y-3">
            {/* Card Visual */}
            <div className="relative w-full h-48 rounded-2xl p-6 text-white shadow-2xl bg-gradient-to-br from-blue-600 to-blue-800">
              {/* VISA Logo and Status at Top */}
              <div className="flex justify-between items-start mb-2">
                <div className="text-lg font-bold italic text-white/90">
                  VISA
                </div>
                <div className="flex items-center space-x-1">
                  {card.isPhysical && (
                    <Badge className="bg-white/20 text-white text-xs px-2 py-1">
                      Physical
                    </Badge>
                  )}
                  <Badge className={`text-xs px-2 py-1 ${
                    card.status === 'active' 
                      ? 'bg-green-500/20 text-green-300' 
                      : card.status === 'frozen'
                      ? 'bg-blue-500/20 text-blue-300'
                      : 'bg-red-500/20 text-red-300'
                  }`}>
                    {card.status}
                  </Badge>
                </div>
              </div>

              {/* NEOVAULT Brand Name */}
              <div className="text-lg font-bold text-white mb-4">
                NEOVAULT
              </div>

              {/* Card Number */}
              <div className="mb-4">
                <div className="text-lg font-mono tracking-wider">
                  {showCardNumbers[card.id] ? card.number : '**** **** **** ' + card.number.slice(-4)}
                </div>
              </div>

              {/* Card Details at Bottom */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-xs text-white/70 mb-1">CARD HOLDER</div>
                    <div className="text-sm font-semibold">{card.holderName}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-white/70 mb-1">EXPIRES</div>
                    <div className="text-sm font-semibold">{card.expiryDate}</div>
                  </div>
                </div>
              </div>

              {/* CVV positioned separately when card is flipped */}
              {showCardNumbers[card.id] && (
                <div className="absolute top-6 right-6">
                  <div className="text-xs text-white/70 mb-1">CVV</div>
                  <div className="text-sm font-semibold">{card.cvv}</div>
                </div>
              )}
            </div>

            {/* Card Info */}
            <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <p className="text-sm text-gray-400">{card.currency} Balance</p>
                    <p className="text-xl font-bold text-white">{card.currency} {card.balance.toFixed(2)}</p>
                  </div>
                  <Button
                    onClick={() => toggleCardVisibility(card.id)}
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white"
                  >
                    {showCardNumbers[card.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => handleAddMoney(card)}
                  >
                    <DollarSign className="w-3 h-3 mr-1" />
                    Add Money
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-600 text-white hover:bg-gray-700"
                    onClick={() => openCardSettings(card)}
                  >
                    <Settings className="w-3 h-3 mr-1" />
                    Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Create Card Modal */}
      <Dialog open={showCreateCard} onOpenChange={setShowCreateCard}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Card</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Card Type Selection */}
            <div>
              <Label className="text-white mb-3 block">Select Card Type</Label>
              <div className="space-y-3">
                {cardTypes.map((cardType) => (
                  <div
                    key={cardType.id}
                    onClick={() => setSelectedCardType(cardType.id)}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedCardType === cardType.id
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-white">{cardType.name}</h3>
                      <Badge className="bg-green-500/20 text-green-300">
                        MWK {cardType.annualFee.toLocaleString()}/year
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      {cardType.benefits.slice(0, 2).map((benefit, index) => (
                        <p key={index} className="text-xs text-gray-400">• {benefit.feature}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Physical/Virtual Toggle */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="physical-card"
                checked={isPhysicalCard}
                onChange={(e) => setIsPhysicalCard(e.target.checked)}
                className="w-4 h-4"
              />
              <Label htmlFor="physical-card" className="text-white">
                Request Physical Card (+MWK 15,000 delivery fee)
              </Label>
            </div>

            {/* Physical Card Details */}
            {isPhysicalCard && (
              <div className="space-y-3 p-4 bg-gray-700/50 rounded-lg">
                <h4 className="font-semibold text-white mb-3">Delivery Details</h4>
                
                <div>
                  <Label className="text-white text-sm">Full Name *</Label>
                  <Input
                    value={cardForm.holderName}
                    onChange={(e) => setCardForm({...cardForm, holderName: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white mt-1"
                    placeholder="Enter full name as it should appear on card"
                  />
                </div>

                <div>
                  <Label className="text-white text-sm">Address *</Label>
                  <Input
                    value={cardForm.address}
                    onChange={(e) => setCardForm({...cardForm, address: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white mt-1"
                    placeholder="Enter your full address"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-white text-sm">Phone *</Label>
                    <Input
                      value={cardForm.phone}
                      onChange={(e) => setCardForm({...cardForm, phone: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white mt-1"
                      placeholder="+265..."
                    />
                  </div>
                  <div>
                    <Label className="text-white text-sm">Post Box</Label>
                    <Input
                      value={cardForm.postBox}
                      onChange={(e) => setCardForm({...cardForm, postBox: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white mt-1"
                      placeholder="P.O. Box"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-white text-sm">Email</Label>
                  <Input
                    value={cardForm.email}
                    onChange={(e) => setCardForm({...cardForm, email: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white mt-1"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <Label className="text-white text-sm">Location/City</Label>
                  <Input
                    value={cardForm.location}
                    onChange={(e) => setCardForm({...cardForm, location: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white mt-1"
                    placeholder="City/District"
                  />
                </div>
              </div>
            )}

            <Button
              onClick={handleCreateCard}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Create {isPhysicalCard ? 'Physical' : 'Virtual'} Card
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Card Settings Modal */}
      {showCardSettings && selectedCard && (
        <CardSettings
          card={selectedCard}
          onClose={() => setShowCardSettings(false)}
          onCardAction={handleCardAction}
        />
      )}
    </div>
  );
};
