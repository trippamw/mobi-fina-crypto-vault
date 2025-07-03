
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, Plus, Settings, Eye, EyeOff, Copy, Check, Lock, Trash2, DollarSign } from 'lucide-react';
import { useTranslation } from '@/utils/languageApi';

interface VirtualCardsSectionProps {
  onCardPurchase?: (cardType: string) => void;
  purchasedCards?: any[];
  walletBalances?: { [key: string]: number };
}

export const VirtualCardsSection = ({ onCardPurchase, purchasedCards = [], walletBalances = {} }: VirtualCardsSectionProps) => {
  const { t } = useTranslation();
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showPhysicalCardModal, setShowPhysicalCardModal] = useState(false);
  const [showVirtualCardModal, setShowVirtualCardModal] = useState(false);
  const [showCardSettings, setShowCardSettings] = useState(false);
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [selectedCardType, setSelectedCardType] = useState<any>(null);
  const [copiedField, setCopiedField] = useState('');
  const [addMoneyAmount, setAddMoneyAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('MWK');
  const [customerDetails, setCustomerDetails] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    idNumber: '',
    city: '',
    postalCode: ''
  });

  const availableCurrencies = ['MWK', 'USD', 'EUR', 'GBP', 'ZAR'];

  const availableCards = [
    {
      type: 'Standard',
      price: 0,
      features: ['Basic transactions', 'Online payments', 'ATM withdrawals'],
      gradient: 'bg-gradient-to-br from-slate-800 to-slate-900',
      textColor: 'text-white',
      brand: 'NEOVAULT',
      isDefault: true
    },
    {
      type: 'Gold',
      price: 15000,
      features: ['All Standard features', 'Higher limits', 'Priority support', 'Cashback rewards'],
      gradient: 'bg-gradient-to-br from-yellow-600 to-yellow-800',
      textColor: 'text-white',
      brand: 'NEOVAULT'
    },
    {
      type: 'Platinum',
      price: 35000,
      features: ['All Gold features', 'Premium support', 'Travel insurance', 'Airport lounge access'],
      gradient: 'bg-gradient-to-br from-gray-400 to-gray-600',
      textColor: 'text-white',
      brand: 'NEOVAULT'
    },
    {
      type: 'Physical',
      price: 50000,
      features: ['All Platinum features', 'Physical card for ATM', 'Worldwide acceptance', 'Express delivery'],
      gradient: 'bg-gradient-to-br from-purple-600 to-indigo-800',
      textColor: 'text-white',
      brand: 'NEOVAULT',
      isPhysical: true
    }
  ];

  const [myCards, setMyCards] = useState([
    {
      id: 'standard',
      type: 'Standard',
      number: '4532 1234 5678 9012',
      balance: 0,
      status: 'Active',
      gradient: 'bg-gradient-to-br from-slate-800 to-slate-900',
      textColor: 'text-white',
      cvv: '123',
      expiry: '12/26',
      holderName: (customerDetails.fullName || 'JOHN DOE').toUpperCase(),
      brand: 'NEOVAULT',
      isBlocked: false,
      spendingLimit: 500000,
      currency: 'MWK'
    }
  ]);

  const handlePurchaseStep1 = (cardType: any) => {
    if (myCards.length >= 4) {
      alert('You can only have a maximum of 4 cards');
      return;
    }

    const cardExists = myCards.some(card => card.type === cardType.type);
    if (cardExists) {
      alert('You already own this card type!');
      return;
    }

    setSelectedCardType(cardType);
    if (cardType.isPhysical) {
      setShowPhysicalCardModal(true);
    } else {
      setShowVirtualCardModal(true);
    }
  };

  const handleVirtualCardSubmit = () => {
    if (!customerDetails.fullName) {
      alert('Please enter your full name');
      return;
    }

    setShowVirtualCardModal(false);
    setShowPurchaseModal(true);
  };

  const handlePhysicalCardSubmit = () => {
    if (!customerDetails.fullName || !customerDetails.email || !customerDetails.phone || !customerDetails.address || !customerDetails.city) {
      alert('Please fill in all required fields for physical card delivery');
      return;
    }

    setShowPhysicalCardModal(false);
    setShowPurchaseModal(true);
  };

  const handleCardPurchase = () => {
    if (selectedCardType && onCardPurchase) {
      const newCard = {
        id: `card-${Date.now()}`,
        type: selectedCardType.type,
        number: `4532 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`,
        balance: 0,
        status: 'Active',
        gradient: selectedCardType.gradient,
        textColor: selectedCardType.textColor,
        cvv: Math.floor(100 + Math.random() * 900).toString(),
        expiry: '12/26',
        holderName: (customerDetails.fullName || 'JOHN DOE').toUpperCase(),
        brand: 'NEOVAULT',
        isBlocked: false,
        spendingLimit: selectedCardType.type === 'Gold' ? 1000000 : selectedCardType.type === 'Platinum' ? 2000000 : 3000000,
        currency: selectedCurrency
      };

      setMyCards(prev => [...prev, newCard]);
      
      const cardData = {
        ...selectedCardType,
        currency: selectedCurrency,
        customerDetails
      };
      onCardPurchase(cardData);
      alert(`${selectedCardType.type} card purchased successfully for MWK ${selectedCardType.price.toLocaleString()}!`);
    }
    setShowPurchaseModal(false);
    setSelectedCardType(null);
    setSelectedCurrency('MWK');
    setCustomerDetails({ fullName: '', email: '', phone: '', address: '', idNumber: '', city: '', postalCode: '' });
  };

  const handleAddMoney = () => {
    if (!addMoneyAmount || parseFloat(addMoneyAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const amount = parseFloat(addMoneyAmount);
    const currency = selectedCard?.currency || 'MWK';
    
    if (walletBalances[currency] < amount) {
      alert(`Insufficient balance in ${currency} wallet`);
      return;
    }

    // Update card balance
    setMyCards(prev => prev.map(card => 
      card.id === selectedCard.id 
        ? { ...card, balance: card.balance + amount }
        : card
    ));

    alert(`${currency} ${amount.toLocaleString()} added to card successfully!`);
    setShowAddMoneyModal(false);
    setAddMoneyAmount('');
  };

  const handleCardAction = (cardId: string, action: string) => {
    const cardIndex = myCards.findIndex(card => card.id === cardId);
    if (cardIndex === -1) return;

    const updatedCards = [...myCards];

    switch (action) {
      case 'freeze':
        updatedCards[cardIndex].isBlocked = !updatedCards[cardIndex].isBlocked;
        setMyCards(updatedCards);
        alert(`Card ${updatedCards[cardIndex].isBlocked ? 'frozen' : 'unfrozen'} successfully`);
        break;
      case 'delete':
        if (cardId === 'standard') {
          alert('Cannot delete the standard card');
          return;
        }
        if (confirm('Are you sure you want to delete this card?')) {
          setMyCards(prev => prev.filter(card => card.id !== cardId));
          alert('Card deleted successfully');
        }
        break;
      case 'limit':
        const newLimit = prompt('Enter new spending limit (MWK):', updatedCards[cardIndex].spendingLimit.toString());
        if (newLimit && !isNaN(Number(newLimit))) {
          updatedCards[cardIndex].spendingLimit = Number(newLimit);
          setMyCards(updatedCards);
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
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-4">
      {/* My Virtual Cards */}
      <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-2xl">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-white text-lg sm:text-xl">My Cards ({myCards.length}/4)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {myCards.map((card) => (
              <div
                key={card.id}
                className={`relative p-4 sm:p-6 rounded-xl ${card.gradient} cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
                onClick={() => {
                  setSelectedCard(card);
                  setShowCardDetails(true);
                }}
              >
                {/* Top Row: NEOVAULT and VISA */}
                <div className="flex justify-between items-start mb-6 sm:mb-8">
                  <div className="text-xs sm:text-sm font-bold text-white/90">
                    NEOVAULT
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-white bg-white/20 px-2 py-1 rounded">
                    VISA
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap gap-1 sm:gap-2 mb-4 sm:mb-6">
                  <Badge className="bg-white/20 text-white border-white/30 text-xs">
                    {card.type}
                  </Badge>
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30 text-xs">
                    {card.currency}
                  </Badge>
                  <Badge className={`text-xs ${
                    card.isBlocked 
                      ? 'bg-red-500/20 text-red-300 border-red-400/30'
                      : card.status === 'Active' 
                      ? 'bg-green-500/20 text-green-300 border-green-400/30'
                      : 'bg-gray-500/20 text-gray-300 border-gray-400/30'
                  }`}>
                    {card.isBlocked ? 'Frozen' : card.status}
                  </Badge>
                </div>
                
                {/* Card Number - Center */}
                <div className="text-center mb-4 sm:mb-6">
                  <p className="text-base sm:text-lg font-mono text-white tracking-wider">
                    {card.number}
                  </p>
                </div>
                
                {/* Bottom Row */}
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs text-white/70">Card Holder</p>
                    <p className="text-xs sm:text-sm text-white font-medium">
                      {card.holderName}
                    </p>
                    <p className="text-xs text-white/70 mt-1">Balance</p>
                    <p className="text-sm sm:text-base font-semibold text-white">
                      {card.currency} {card.balance.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/70">Valid Thru</p>
                    <p className="text-sm text-white">{card.expiry}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Available Cards */}
      <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-2xl">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-white text-lg sm:text-xl">Available Cards</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {availableCards.map((card) => {
              const alreadyOwned = myCards.some(owned => owned.type === card.type);
              const canPurchase = myCards.length < 4 && !alreadyOwned;
              
              return (
                <div key={card.type} className="p-4 sm:p-6 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors border border-gray-600/30">
                  <div className="text-center mb-4">
                    <div className={`w-12 h-8 sm:w-16 sm:h-10 ${card.gradient} rounded-lg mx-auto mb-3 flex items-center justify-center relative overflow-hidden`}>
                      <div className="absolute top-1 left-1 text-xs font-bold text-white/90">
                        NEO
                      </div>
                      <CreditCard className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                      <div className="absolute bottom-1 right-1 text-xs font-bold text-white bg-white/20 px-1 rounded">
                        VISA
                      </div>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-white">{card.type}</h3>
                    <p className="text-xl sm:text-2xl font-bold text-white">
                      {card.price === 0 ? 'FREE' : `MWK ${card.price.toLocaleString()}`}
                    </p>
                    {card.isPhysical && (
                      <Badge className="mt-2 bg-purple-500/20 text-purple-300 border-purple-400/30 text-xs">
                        Physical Card
                      </Badge>
                    )}
                  </div>
                  
                  <ul className="space-y-2 mb-4 sm:mb-6">
                    {card.features.map((feature, index) => (
                      <li key={index} className="text-xs sm:text-sm text-gray-300 flex items-center">
                        <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    onClick={() => {
                      if (!canPurchase) {
                        alert(alreadyOwned ? 'You already own this card type!' : 'Maximum 4 cards allowed');
                        return;
                      }
                      handlePurchaseStep1(card);
                    }}
                    disabled={!canPurchase}
                    className={`w-full text-sm ${
                      !canPurchase 
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
                    }`}
                  >
                    {alreadyOwned ? 'Owned' : myCards.length >= 4 ? 'Limit Reached' : (card.price === 0 ? 'Get Card' : t('purchaseCard'))}
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Virtual Card Purchase Modal */}
      <Dialog open={showVirtualCardModal} onOpenChange={setShowVirtualCardModal}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md mx-4">
          <DialogHeader>
            <DialogTitle>Virtual Card Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-gray-300">Card Currency</Label>
              <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                <SelectTrigger className="bg-gray-700/50 border-gray-600/50 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  {availableCurrencies.map((currency) => (
                    <SelectItem key={currency} value={currency} className="text-white">
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-gray-300">Full Name *</Label>
              <Input
                value={customerDetails.fullName}
                onChange={(e) => setCustomerDetails({ ...customerDetails, fullName: e.target.value })}
                className="bg-gray-700/50 border-gray-600/50 text-white"
                placeholder="John Doe"
              />
            </div>
            
            <div className="flex space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowVirtualCardModal(false)}
                className="flex-1 border-gray-600 text-gray-300 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={handleVirtualCardSubmit}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
              >
                Continue
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Physical Card Purchase Modal */}
      <Dialog open={showPhysicalCardModal} onOpenChange={setShowPhysicalCardModal}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md mx-4">
          <DialogHeader>
            <DialogTitle>Physical Card Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-gray-300">Card Currency</Label>
              <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                <SelectTrigger className="bg-gray-700/50 border-gray-600/50 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  {availableCurrencies.map((currency) => (
                    <SelectItem key={currency} value={currency} className="text-white">
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
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
              <Label className="text-gray-300">Delivery Address *</Label>
              <Input
                value={customerDetails.address}
                onChange={(e) => setCustomerDetails({ ...customerDetails, address: e.target.value })}
                className="bg-gray-700/50 border-gray-600/50 text-white"
                placeholder="123 Main Street"
              />
            </div>
            
            <div>
              <Label className="text-gray-300">City *</Label>
              <Input
                value={customerDetails.city}
                onChange={(e) => setCustomerDetails({ ...customerDetails, city: e.target.value })}
                className="bg-gray-700/50 border-gray-600/50 text-white"
                placeholder="Lilongwe"
              />
            </div>
            
            <div>
              <Label className="text-gray-300">Postal Code</Label>
              <Input
                value={customerDetails.postalCode}
                onChange={(e) => setCustomerDetails({ ...customerDetails, postalCode: e.target.value })}
                className="bg-gray-700/50 border-gray-600/50 text-white"
                placeholder="Area 10"
              />
            </div>
            
            <div className="flex space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowPhysicalCardModal(false)}
                className="flex-1 border-gray-600 text-gray-300 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={handlePhysicalCardSubmit}
                className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
              >
                Continue
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Money Modal */}
      <Dialog open={showAddMoneyModal} onOpenChange={setShowAddMoneyModal}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md mx-4">
          <DialogHeader>
            <DialogTitle>{t('addMoney')} to Card</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-gray-300">Amount</Label>
              <Input
                type="number"
                value={addMoneyAmount}
                onChange={(e) => setAddMoneyAmount(e.target.value)}
                className="bg-gray-700/50 border-gray-600/50 text-white"
                placeholder="Enter amount"
              />
            </div>
            
            <div className="bg-gray-700/50 p-3 rounded-lg">
              <p className="text-sm text-gray-300">
                Available in {selectedCard?.currency} wallet: {selectedCard?.currency} {walletBalances[selectedCard?.currency]?.toLocaleString() || '0'}
              </p>
            </div>
            
            <div className="flex space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowAddMoneyModal(false)}
                className="flex-1 border-gray-600 text-gray-300 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddMoney}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
              >
                Add Money
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Card Details Modal */}
      <Dialog open={showCardDetails} onOpenChange={setShowCardDetails}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md mx-4">
          <DialogHeader>
            <DialogTitle>Card Details</DialogTitle>
          </DialogHeader>
          {selectedCard && (
            <div className="space-y-4">
              <div className={`p-4 sm:p-6 rounded-xl ${selectedCard.gradient} relative`}>
                {/* Top Row: NEOVAULT and VISA */}
                <div className="flex justify-between items-start mb-6">
                  <div className="text-sm font-bold text-white/90">
                    NEOVAULT
                  </div>
                  <div className="text-sm font-bold text-white bg-white/20 px-2 py-1 rounded">
                    VISA
                  </div>
                </div>

                <div className="flex justify-between items-start mb-6">
                  <div className="space-x-2">
                    <Badge className="bg-white/20 text-white border-white/30 text-xs">
                      {selectedCard.type}
                    </Badge>
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30 text-xs">
                      {selectedCard.currency}
                    </Badge>
                  </div>
                </div>
                
                {/* Card Number - Center */}
                <div className="text-center mb-6">
                  <p className="text-lg font-mono text-white tracking-wider">
                    {selectedCard.number}
                  </p>
                </div>
                
                {/* Bottom Row */}
                <div className="flex justify-between">
                  <div>
                    <p className="text-xs text-white/70">Card Holder</p>
                    <p className="text-sm text-white font-medium">{selectedCard.holderName}</p>
                    <p className="text-xs text-white/70 mt-2">Balance</p>
                    <p className="text-base font-semibold text-white">
                      {selectedCard.currency} {selectedCard.balance.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/70">Valid Thru</p>
                    <p className="text-sm text-white">{selectedCard.expiry}</p>
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
                    setShowCardDetails(false);
                    setShowAddMoneyModal(true);
                  }}
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  {t('addMoney')}
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
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md mx-4">
          <DialogHeader>
            <DialogTitle>{t('cardSettings')}</DialogTitle>
          </DialogHeader>
          {selectedCard && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-700/50 rounded-lg">
                <h4 className="font-medium text-white mb-2">{selectedCard.type} Card</h4>
                <p className="text-sm text-gray-300">Current Status: {selectedCard.isBlocked ? 'Frozen' : 'Active'}</p>
                <p className="text-sm text-gray-300">Currency: {selectedCard.currency}</p>
                <p className="text-sm text-gray-300">Spending Limit: {selectedCard.currency} {selectedCard.spendingLimit.toLocaleString()}</p>
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

                <Button
                  onClick={() => handleCardAction(selectedCard.id, 'delete')}
                  variant="outline"
                  className="w-full border-red-600 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {t('deleteCard')}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Purchase Confirmation Modal */}
      <Dialog open={showPurchaseModal} onOpenChange={setShowPurchaseModal}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md mx-4">
          <DialogHeader>
            <DialogTitle>Confirm Card Purchase</DialogTitle>
          </DialogHeader>
          {selectedCardType && (
            <div className="space-y-4">
              <div className="text-center">
                <div className={`w-20 h-12 ${selectedCardType.gradient} rounded-lg mx-auto mb-4 flex items-center justify-center relative`}>
                  <div className="absolute top-1 left-1 text-xs font-bold text-white/90">
                    NEO
                  </div>
                  <CreditCard className="w-8 h-8 text-white" />
                  <div className="absolute bottom-1 right-1 text-xs font-bold text-white bg-white/20 px-1 rounded">
                    VISA
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
                  <p>Currency: {selectedCurrency}</p>
                  {customerDetails.email && <p>Email: {customerDetails.email}</p>}
                  {customerDetails.phone && <p>Phone: {customerDetails.phone}</p>}
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
    </div>
  );
};
