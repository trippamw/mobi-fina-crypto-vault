import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CreditCard, Plus, Settings, Eye, EyeOff, Copy, Check, Lock, Trash2, DollarSign } from 'lucide-react';

interface VirtualCardsSectionProps {
  onCardPurchase?: (cardType: string) => void;
  purchasedCards?: any[];
}

export const VirtualCardsSection = ({ onCardPurchase, purchasedCards = [] }: VirtualCardsSectionProps) => {
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);
  const [showCardSettings, setShowCardSettings] = useState(false);
  const [selectedCardType, setSelectedCardType] = useState<any>(null);
  const [copiedField, setCopiedField] = useState('');
  const [customerDetails, setCustomerDetails] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    idNumber: ''
  });

  const availableCards = [
    {
      type: 'Standard',
      price: 0,
      features: ['Basic transactions', 'Online payments', 'ATM withdrawals'],
      gradient: 'bg-gradient-to-br from-slate-800 to-slate-900',
      textColor: 'text-white',
      brand: 'VISA',
      isDefault: true
    },
    {
      type: 'Gold',
      price: 15000,
      features: ['All Standard features', 'Higher limits', 'Priority support', 'Cashback rewards'],
      gradient: 'bg-gradient-to-br from-yellow-600 to-yellow-800',
      textColor: 'text-white',
      brand: 'MASTERCARD'
    },
    {
      type: 'Platinum',
      price: 35000,
      features: ['All Gold features', 'Premium support', 'Travel insurance', 'Airport lounge access'],
      gradient: 'bg-gradient-to-br from-gray-400 to-gray-600',
      textColor: 'text-white',
      brand: 'VISA'
    }
  ];

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
      holderName: 'John Doe',
      brand: 'VISA',
      isBlocked: false,
      spendingLimit: 500000
    },
    ...purchasedCards.slice(0, 2).map(card => ({
      ...card,
      gradient: availableCards.find(ac => ac.type === card.type)?.gradient || 'bg-gradient-to-br from-slate-800 to-slate-900',
      textColor: availableCards.find(ac => ac.type === card.type)?.textColor || 'text-white',
      brand: availableCards.find(ac => ac.type === card.type)?.brand || 'VISA',
      cvv: '123',
      expiry: '12/26',
      holderName: customerDetails.fullName || 'John Doe',
      isBlocked: false,
      spendingLimit: card.type === 'Gold' ? 1000000 : 2000000
    }))
  ];

  const handlePurchaseStep1 = (cardType: any) => {
    if (myCards.length >= 3) {
      alert('You can only have a maximum of 3 cards');
      return;
    }

    const cardExists = myCards.some(card => card.type === cardType.type);
    if (cardExists) {
      alert('You already own this card type!');
      return;
    }

    setSelectedCardType(cardType);
    setShowCustomerDetails(true);
  };

  const handleCustomerDetailsSubmit = () => {
    if (!customerDetails.fullName || !customerDetails.email || !customerDetails.phone) {
      alert('Please fill in all required fields');
      return;
    }

    setShowCustomerDetails(false);
    setShowPurchaseModal(true);
  };

  const handleCardPurchase = () => {
    if (selectedCardType && onCardPurchase) {
      onCardPurchase(selectedCardType.type);
      alert(`${selectedCardType.type} card purchased successfully for MWK ${selectedCardType.price.toLocaleString()}!`);
    }
    setShowPurchaseModal(false);
    setSelectedCardType(null);
    setCustomerDetails({ fullName: '', email: '', phone: '', address: '', idNumber: '' });
  };

  const handleCardAction = (cardId: string, action: string) => {
    const cardIndex = myCards.findIndex(card => card.id === cardId);
    if (cardIndex === -1) return;

    switch (action) {
      case 'freeze':
        // Toggle card status
        myCards[cardIndex].isBlocked = !myCards[cardIndex].isBlocked;
        alert(`Card ${myCards[cardIndex].isBlocked ? 'frozen' : 'unfrozen'} successfully`);
        break;
      case 'delete':
        if (cardId === 'standard') {
          alert('Cannot delete the standard card');
          return;
        }
        if (confirm('Are you sure you want to delete this card?')) {
          // Remove from purchased cards array
          alert('Card deleted successfully');
        }
        break;
      case 'limit':
        const newLimit = prompt('Enter new spending limit (MWK):', myCards[cardIndex].spendingLimit.toString());
        if (newLimit && !isNaN(Number(newLimit))) {
          myCards[cardIndex].spendingLimit = Number(newLimit);
          alert('Spending limit updated successfully');
        }
        break;
    }
    setShowCardSettings(false);
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
          <CardTitle className="text-white">My Virtual Cards ({myCards.length}/3)</CardTitle>
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
                {/* Brand Logo */}
                <div className="absolute top-4 right-4">
                  <div className="bg-white/20 px-2 py-1 rounded text-xs font-bold text-white">
                    {card.brand}
                  </div>
                </div>

                <div className="flex justify-between items-start mb-8">
                  <div>
                    <Badge className="bg-white/20 text-white border-white/30 text-xs">
                      {card.type}
                    </Badge>
                    <Badge className={`ml-2 text-xs ${
                      card.isBlocked 
                        ? 'bg-red-500/20 text-red-300 border-red-400/30'
                        : card.status === 'Active' 
                        ? 'bg-green-500/20 text-green-300 border-green-400/30'
                        : 'bg-gray-500/20 text-gray-300 border-gray-400/30'
                    }`}>
                      {card.isBlocked ? 'Frozen' : card.status}
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

                  <div className="pt-2">
                    <p className={`text-sm ${card.textColor} opacity-90 font-medium`}>
                      {card.holderName.toUpperCase()}
                    </p>
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
              const canPurchase = myCards.length < 3 && !alreadyOwned;
              
              return (
                <div key={card.type} className="p-6 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors border border-gray-600/30">
                  <div className="text-center mb-4">
                    <div className={`w-16 h-10 ${card.gradient} rounded-lg mx-auto mb-3 flex items-center justify-center relative`}>
                      <CreditCard className="w-6 h-6 text-white" />
                      <div className="absolute top-1 right-1 bg-white/20 px-1 rounded text-xs font-bold text-white">
                        {card.brand}
                      </div>
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
                      if (!canPurchase) {
                        alert(alreadyOwned ? 'You already own this card type!' : 'Maximum 3 cards allowed');
                        return;
                      }
                      handlePurchaseStep1(card);
                    }}
                    disabled={!canPurchase}
                    className={`w-full ${
                      !canPurchase 
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
                    }`}
                  >
                    {alreadyOwned ? 'Owned' : myCards.length >= 3 ? 'Limit Reached' : (card.price === 0 ? 'Get Card' : 'Purchase')}
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Customer Details Modal */}
      <Dialog open={showCustomerDetails} onOpenChange={setShowCustomerDetails}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-gray-300">Full Name *</Label>
              <Input
                value={customerDetails.fullName}
                onChange={(e) => setCustomerDetails({ ...customerDetails, fullName: e.target.value })}
                className="bg-gray-700/50 border-gray-600/50 text-white"
                placeholder="John Doe"
              />
            </div>
            <div>
              <Label className="text-gray-300">Email Address *</Label>
              <Input
                type="email"
                value={customerDetails.email}
                onChange={(e) => setCustomerDetails({ ...customerDetails, email: e.target.value })}
                className="bg-gray-700/50 border-gray-600/50 text-white"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <Label className="text-gray-300">Phone Number *</Label>
              <Input
                value={customerDetails.phone}
                onChange={(e) => setCustomerDetails({ ...customerDetails, phone: e.target.value })}
                className="bg-gray-700/50 border-gray-600/50 text-white"
                placeholder="+265 123 456 789"
              />
            </div>
            <div>
              <Label className="text-gray-300">Address</Label>
              <Input
                value={customerDetails.address}
                onChange={(e) => setCustomerDetails({ ...customerDetails, address: e.target.value })}
                className="bg-gray-700/50 border-gray-600/50 text-white"
                placeholder="123 Main Street, Lilongwe"
              />
            </div>
            <div>
              <Label className="text-gray-300">ID Number</Label>
              <Input
                value={customerDetails.idNumber}
                onChange={(e) => setCustomerDetails({ ...customerDetails, idNumber: e.target.value })}
                className="bg-gray-700/50 border-gray-600/50 text-white"
                placeholder="National ID or Passport"
              />
            </div>
            <div className="flex space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowCustomerDetails(false)}
                className="flex-1 border-gray-600 text-gray-300 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCustomerDetailsSubmit}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
              >
                Continue
              </Button>
            </div>
          </div>
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
                <div className={`w-20 h-12 ${selectedCardType.gradient} rounded-lg mx-auto mb-4 flex items-center justify-center relative`}>
                  <CreditCard className="w-8 h-8 text-white" />
                  <div className="absolute top-1 right-1 bg-white/20 px-1 rounded text-xs font-bold text-white">
                    {selectedCardType.brand}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white">{selectedCardType.type} Card</h3>
                <p className="text-2xl font-bold text-white mt-2">
                  MWK {selectedCardType.price.toLocaleString()}
                </p>
              </div>
              
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h4 className="font-medium text-white mb-2">Customer Details:</h4>
                <div className="space-y-1 text-sm text-gray-300">
                  <p>Name: {customerDetails.fullName}</p>
                  <p>Email: {customerDetails.email}</p>
                  <p>Phone: {customerDetails.phone}</p>
                </div>
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
                  Confirm Purchase
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Card Details Modal */}
      <Dialog open={showCardDetails} onOpenChange={setShowCardDetails}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Card Details</DialogTitle>
          </DialogHeader>
          {selectedCard && (
            <div className="space-y-4">
              <div className={`p-6 rounded-xl ${selectedCard.gradient} relative`}>
                <div className="absolute top-4 right-4 bg-white/20 px-2 py-1 rounded text-xs font-bold text-white">
                  {selectedCard.brand}
                </div>
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
                      <p className="text-sm text-white font-medium">{selectedCard.holderName.toUpperCase()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white opacity-70">Valid Thru</p>
                      <p className="text-sm text-white">{selectedCard.expiry}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Copy Fields */}
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
              
              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  onClick={() => {
                    const amount = prompt('Enter amount to add to card:');
                    if (amount && parseFloat(amount) > 0) {
                      alert(`MWK ${parseFloat(amount).toLocaleString()} added to card successfully!`);
                      setShowCardDetails(false);
                    }
                  }}
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Add Money
                </Button>
                <Button
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:text-white"
                  onClick={() => {
                    setShowCardDetails(false);
                    setShowCardSettings(true);
                  }}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Card Settings Modal */}
      <Dialog open={showCardSettings} onOpenChange={setShowCardSettings}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Card Settings</DialogTitle>
          </DialogHeader>
          {selectedCard && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-700/50 rounded-lg">
                <h4 className="font-medium text-white mb-2">{selectedCard.type} Card</h4>
                <p className="text-sm text-gray-300">Current Status: {selectedCard.isBlocked ? 'Frozen' : 'Active'}</p>
                <p className="text-sm text-gray-300">Spending Limit: MWK {selectedCard.spendingLimit.toLocaleString()}</p>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => handleCardAction(selectedCard.id, 'freeze')}
                  className={`w-full ${selectedCard.isBlocked ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-600 hover:bg-orange-700'}`}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  {selectedCard.isBlocked ? 'Unfreeze Card' : 'Freeze Card'}
                </Button>

                <Button
                  onClick={() => handleCardAction(selectedCard.id, 'limit')}
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:text-white"
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Set Spending Limit
                </Button>

                {selectedCard.id !== 'standard' && (
                  <Button
                    onClick={() => handleCardAction(selectedCard.id, 'delete')}
                    variant="outline"
                    className="w-full border-red-600 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Card
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
