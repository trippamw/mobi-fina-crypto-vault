
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CreditCard, Plus, Settings, Eye, EyeOff, Copy, Check } from 'lucide-react';

interface VirtualCardsSectionProps {
  onCardPurchase?: (cardType: string) => void;
  purchasedCards?: any[];
}

export const VirtualCardsSection = ({ onCardPurchase, purchasedCards = [] }: VirtualCardsSectionProps) => {
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedCardType, setSelectedCardType] = useState<any>(null);
  const [copiedField, setCopiedField] = useState('');

  const availableCards = [
    {
      type: 'Standard',
      price: 0,
      features: ['Basic transactions', 'Online payments', 'ATM withdrawals'],
      gradient: 'bg-gradient-to-br from-slate-800 to-slate-900',
      textColor: 'text-white',
      isDefault: true
    },
    {
      type: 'Gold',
      price: 15000,
      features: ['All Standard features', 'Higher limits', 'Priority support', 'Cashback rewards'],
      gradient: 'bg-gradient-to-br from-yellow-600 to-yellow-800',
      textColor: 'text-white'
    },
    {
      type: 'Platinum',
      price: 35000,
      features: ['All Gold features', 'Premium support', 'Travel insurance', 'Airport lounge access'],
      gradient: 'bg-gradient-to-br from-gray-400 to-gray-600',
      textColor: 'text-white'
    }
  ];

  // Include standard card by default and purchased cards
  const myCards = [
    {
      id: 'standard',
      type: 'Standard',
      number: '**** **** **** 1234',
      balance: 0,
      status: 'Active',
      gradient: 'bg-gradient-to-br from-slate-800 to-slate-900',
      textColor: 'text-white',
      cvv: '123',
      expiry: '12/26',
      holderName: 'John Doe'
    },
    ...purchasedCards.map(card => ({
      ...card,
      gradient: availableCards.find(ac => ac.type === card.type)?.gradient || 'bg-gradient-to-br from-slate-800 to-slate-900',
      textColor: availableCards.find(ac => ac.type === card.type)?.textColor || 'text-white',
      cvv: '123',
      expiry: '12/26',
      holderName: 'John Doe'
    }))
  ];

  const handleCardPurchase = () => {
    if (selectedCardType && onCardPurchase) {
      // Check if card type already exists
      const cardExists = myCards.some(card => card.type === selectedCardType.type);
      if (cardExists) {
        alert('You already own this card type!');
        return;
      }

      onCardPurchase(selectedCardType.type);
      alert(`${selectedCardType.type} card purchased successfully for MWK ${selectedCardType.price.toLocaleString()}!`);
    }
    setShowPurchaseModal(false);
    setSelectedCardType(null);
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(''), 2000);
  };

  return (
    <div className="space-y-6">
      {/* My Virtual Cards */}
      <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white">My Virtual Cards</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myCards.map((card) => (
              <div
                key={card.id}
                className={`relative p-6 rounded-xl ${card.gradient} cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
                onClick={() => {
                  setSelectedCard(card);
                  setShowCardDetails(true);
                }}
              >
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <Badge className="bg-white/20 text-white border-white/30 text-xs">
                      {card.type}
                    </Badge>
                    <Badge className={`ml-2 text-xs ${
                      card.status === 'Active' 
                        ? 'bg-green-500/20 text-green-300 border-green-400/30'
                        : 'bg-gray-500/20 text-gray-300 border-gray-400/30'
                    }`}>
                      {card.status}
                    </Badge>
                  </div>
                  <CreditCard className={`w-8 h-8 ${card.textColor}`} />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className={`text-lg font-mono ${card.textColor}`}>
                      {card.number}
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div>
                      <p className={`text-xs ${card.textColor} opacity-70`}>Balance</p>
                      <p className={`text-lg font-semibold ${card.textColor}`}>
                        MWK {card.balance.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs ${card.textColor} opacity-70`}>Valid Thru</p>
                      <p className={`text-sm ${card.textColor}`}>{card.expiry}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Available Cards */}
      <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white">Available Cards</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {availableCards.map((card) => {
              const alreadyOwned = myCards.some(owned => owned.type === card.type);
              
              return (
                <div key={card.type} className="p-6 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors border border-gray-600/30">
                  <div className="text-center mb-4">
                    <div className={`w-16 h-10 ${card.gradient} rounded-lg mx-auto mb-3 flex items-center justify-center`}>
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">{card.type}</h3>
                    <p className="text-2xl font-bold text-white">
                      {card.price === 0 ? 'FREE' : `MWK ${card.price.toLocaleString()}`}
                    </p>
                  </div>
                  
                  <ul className="space-y-2 mb-6">
                    {card.features.map((feature, index) => (
                      <li key={index} className="text-sm text-gray-300 flex items-center">
                        <Check className="w-4 h-4 text-green-400 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    onClick={() => {
                      if (alreadyOwned) {
                        alert('You already own this card type!');
                        return;
                      }
                      setSelectedCardType(card);
                      setShowPurchaseModal(true);
                    }}
                    disabled={alreadyOwned}
                    className={`w-full ${
                      alreadyOwned 
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
                    }`}
                  >
                    {alreadyOwned ? 'Owned' : (card.price === 0 ? 'Get Card' : 'Purchase')}
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Card Details Modal */}
      <Dialog open={showCardDetails} onOpenChange={setShowCardDetails}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Card Details</DialogTitle>
          </DialogHeader>
          {selectedCard && (
            <div className="space-y-4">
              <div className={`p-6 rounded-xl ${selectedCard.gradient}`}>
                <div className="flex justify-between items-start mb-8">
                  <Badge className="bg-white/20 text-white border-white/30">
                    {selectedCard.type}
                  </Badge>
                  <CreditCard className="w-8 h-8 text-white" />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-lg font-mono text-white">
                      {selectedCard.number}
                    </p>
                  </div>
                  
                  <div className="flex justify-between">
                    <div>
                      <p className="text-xs text-white opacity-70">Card Holder</p>
                      <p className="text-sm text-white">{selectedCard.holderName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white opacity-70">Valid Thru</p>
                      <p className="text-sm text-white">{selectedCard.expiry}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-300">Card Number</p>
                    <p className="font-mono text-white">{selectedCard.number}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(selectedCard.number.replace(/\s/g, ''), 'number')}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    {copiedField === 'number' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-300">CVV</p>
                    <p className="font-mono text-white">{selectedCard.cvv}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(selectedCard.cvv, 'cvv')}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    {copiedField === 'cvv' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-300">Expiry Date</p>
                    <p className="font-mono text-white">{selectedCard.expiry}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(selectedCard.expiry, 'expiry')}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    {copiedField === 'expiry' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  onClick={() => {
                    const amount = prompt('Enter amount to add to card:');
                    if (amount && parseFloat(amount) > 0) {
                      alert(`MWK ${parseFloat(amount).toLocaleString()} added to card successfully!`);
                      setShowCardDetails(false);
                    }
                  }}
                >
                  Add Money
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300 hover:text-white"
                  onClick={() => alert('Card settings coming soon!')}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Purchase Confirmation Modal */}
      <Dialog open={showPurchaseModal} onOpenChange={setShowPurchaseModal}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Confirm Card Purchase</DialogTitle>
          </DialogHeader>
          {selectedCardType && (
            <div className="space-y-4">
              <div className="text-center">
                <div className={`w-20 h-12 ${selectedCardType.gradient} rounded-lg mx-auto mb-4 flex items-center justify-center`}>
                  <CreditCard className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">{selectedCardType.type} Card</h3>
                <p className="text-2xl font-bold text-white mt-2">
                  MWK {selectedCardType.price.toLocaleString()}
                </p>
              </div>
              
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h4 className="font-medium text-white mb-2">Features included:</h4>
                <ul className="space-y-1">
                  {selectedCardType.features.map((feature, index) => (
                    <li key={index} className="text-sm text-gray-300 flex items-center">
                      <Check className="w-4 h-4 text-green-400 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowPurchaseModal(false)}
                  className="flex-1 border-gray-600 text-gray-300 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCardPurchase}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                >
                  Purchase Card
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
