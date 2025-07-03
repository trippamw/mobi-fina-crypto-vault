
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CreditCard, Check, Star, Crown, Wallet, Plus, Settings, Freeze, Trash2, DollarSign, Lock, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/utils/languageApi';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';

interface VirtualCardsSectionProps {
  onCardPurchase?: (cardType: string, cardData: any) => void;
  purchasedCards?: any[];
  onBack?: () => void;
}

export const VirtualCardsSection = ({ onCardPurchase, purchasedCards = [], onBack }: VirtualCardsSectionProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showCardManagement, setShowCardManagement] = useState<any>(null);
  const [cardForm, setCardForm] = useState({
    cardType: '',
    currency: 'MWK',
    holderName: '',
    email: '',
    phone: '',
    address: '',
    district: '',
    village: ''
  });

  const cardTypes = [
    {
      name: 'Standard',
      icon: <CreditCard className="w-8 h-8 text-blue-400" />,
      price: 'FREE',
      monthlyFee: 'MWK 2,500',
      features: ['Online purchases', 'Basic security', 'Transaction history'],
      gradient: 'from-blue-600 to-blue-800',
      popular: false
    },
    {
      name: 'Gold',
      icon: <Star className="w-8 h-8 text-yellow-400" />,
      price: 'MWK 10,000',
      monthlyFee: 'MWK 1,000',
      features: ['All Standard features', 'Higher limits', 'Priority support', 'Cashback rewards'],
      gradient: 'from-yellow-600 to-yellow-800',
      popular: true
    },
    {
      name: 'Platinum',
      icon: <Crown className="w-8 h-8 text-purple-400" />,
      price: 'MWK 15,000',
      monthlyFee: 'MWK 500',
      features: ['All Gold features', 'Premium benefits', 'Concierge service', 'Travel insurance'],
      gradient: 'from-purple-600 to-purple-800',
      popular: false
    },
    {
      name: 'Physical',
      icon: <Wallet className="w-8 h-8 text-green-400" />,
      price: 'MWK 25,000',
      monthlyFee: 'No monthly fees',
      features: ['Physical card delivery', 'ATM withdrawals', 'All digital features', 'Global acceptance'],
      gradient: 'from-green-600 to-green-800',
      popular: false
    }
  ];

  const currencies = [
    { code: 'MWK', name: 'Malawian Kwacha', symbol: 'MWK' },
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
  ];

  const handlePurchaseCard = (cardType: string) => {
    setCardForm({ ...cardForm, cardType });
    setShowPurchaseModal(true);
  };

  const handleFormSubmit = () => {
    if (!cardForm.holderName || !cardForm.email || !cardForm.phone) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    if (cardForm.cardType === 'Physical' && (!cardForm.address || !cardForm.district || !cardForm.village)) {
      toast({
        title: 'Error',
        description: 'Please fill in address information for physical card',
        variant: 'destructive'
      });
      return;
    }

    const cardData = {
      id: Math.random().toString(36).substring(7),
      type: cardForm.cardType,
      currency: cardForm.currency,
      holderName: cardForm.holderName,
      email: cardForm.email,
      phone: cardForm.phone,
      address: cardForm.address,
      district: cardForm.district,
      village: cardForm.village,
      number: `**** **** **** ${Math.floor(1000 + Math.random() * 9000)}`,
      balance: 0,
      status: 'Active',
      issuedDate: new Date().toLocaleDateString(),
      isFrozen: false,
      dailyLimit: 100000,
      monthlyLimit: 1000000
    };

    if (onCardPurchase) {
      onCardPurchase(cardForm.cardType, cardData);
    }

    toast({
      title: 'Success',
      description: `${cardForm.cardType} card purchased successfully!`,
    });

    setShowPurchaseModal(false);
    setCardForm({
      cardType: '',
      currency: 'MWK',
      holderName: '',
      email: '',
      phone: '',
      address: '',
      district: '',
      village: ''
    });
  };

  const handleAddMoney = (cardId: string, amount: number) => {
    toast({
      title: 'Success',
      description: `Added ${amount} to your card`,
    });
  };

  const handleFreezeCard = (cardId: string) => {
    toast({
      title: 'Card Frozen',
      description: 'Your card has been frozen successfully',
    });
  };

  const handleDeleteCard = (cardId: string) => {
    toast({
      title: 'Card Deleted',
      description: 'Your card has been deleted successfully',
      variant: 'destructive'
    });
  };

  if (showCardManagement) {
    return <CardManagement card={showCardManagement} onBack={() => setShowCardManagement(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 pb-24">
      <div className="container mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          {onBack && (
            <Button
              onClick={onBack}
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          <div className="text-center flex-1">
            <h2 className="text-xl md:text-2xl font-bold text-white">{t('cards')}</h2>
            <p className="text-gray-300 text-sm md:text-base">Choose the perfect card for your needs</p>
          </div>
          <div className="w-16"></div>
        </div>

        {/* My Virtual Cards Section */}
        {purchasedCards.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg md:text-xl font-bold text-white">My Virtual Cards</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {purchasedCards.map((card: any) => (
                <Card 
                  key={card.id} 
                  className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-600/50 hover:border-gray-500/50 transition-all duration-300 cursor-pointer"
                  onClick={() => setShowCardManagement(card)}
                >
                  <CardContent className="p-4 md:p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-xs font-medium text-gray-400 mb-1">VISA</div>
                          <h4 className="font-semibold text-white text-sm md:text-base">{card.type} Card</h4>
                          <p className="text-xs text-gray-300">{card.holderName}</p>
                        </div>
                        <Badge className={`${card.isFrozen ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'} text-xs`}>
                          {card.isFrozen ? 'Frozen' : card.status}
                        </Badge>
                      </div>
                      
                      <div className="text-gray-300">
                        <p className="text-xs">Card Number</p>
                        <p className="font-mono text-sm md:text-base">{card.number}</p>
                      </div>
                      
                      <div className="text-gray-300">
                        <p className="text-xs">Balance</p>
                        <p className="text-lg md:text-xl font-bold text-white">
                          {card.currency} {card.balance.toLocaleString()}
                        </p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddMoney(card.id, 1000);
                          }}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add Money
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700/50 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowCardManagement(card);
                          }}
                        >
                          <Settings className="w-3 h-3 mr-1" />
                          Settings
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Available Cards */}
        <div className="space-y-4">
          <h3 className="text-lg md:text-xl font-bold text-white">Available Cards</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cardTypes.map((card, index) => (
              <Card 
                key={index} 
                className={`relative bg-gradient-to-br ${card.gradient} border-gray-600/50 hover:border-gray-500/50 transition-all duration-300 cursor-pointer ${
                  selectedCard === card.name ? 'ring-2 ring-blue-500' : ''
                }`} 
                onClick={() => setSelectedCard(card.name)}
              >
                {card.popular && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black text-xs">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center pb-2 p-4">
                  <div className="flex flex-col items-center space-y-2">
                    {card.icon}
                    <div className="text-xs font-medium text-white">VISA</div>
                    <CardTitle className="text-white text-sm md:text-base">{card.name} Card</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 p-4 pt-0">
                  <div className="text-center">
                    <div className="text-lg md:text-2xl font-bold text-white">{card.price}</div>
                    <div className="text-xs text-gray-200">Setup fee</div>
                    <div className="text-xs md:text-sm text-gray-300 mt-1">{card.monthlyFee}</div>
                    <div className="text-xs text-gray-400">Monthly fee</div>
                  </div>
                  
                  <ul className="space-y-2">
                    {card.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-xs text-gray-200">
                        <Check className="w-3 h-3 text-green-400 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePurchaseCard(card.name);
                    }}
                    className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 text-xs md:text-sm"
                  >
                    Purchase Card
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Purchase Modal */}
        <Dialog open={showPurchaseModal} onOpenChange={setShowPurchaseModal}>
          <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle>Purchase {cardForm.cardType} Card</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div>
                <Label className="text-white text-sm">Card Currency</Label>
                <Select value={cardForm.currency} onValueChange={(value) => setCardForm({...cardForm, currency: value})}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700 z-50">
                    {currencies.map((curr) => (
                      <SelectItem key={curr.code} value={curr.code} className="text-white">
                        {curr.symbol} {curr.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white text-sm">Cardholder Name *</Label>
                <Input
                  value={cardForm.holderName}
                  onChange={(e) => setCardForm({...cardForm, holderName: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white mt-1"
                  placeholder="Full name as on ID"
                />
              </div>

              <div>
                <Label className="text-white text-sm">Email *</Label>
                <Input
                  type="email"
                  value={cardForm.email}
                  onChange={(e) => setCardForm({...cardForm, email: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white mt-1"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <Label className="text-white text-sm">Phone Number *</Label>
                <Input
                  value={cardForm.phone}
                  onChange={(e) => setCardForm({...cardForm, phone: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white mt-1"
                  placeholder="+265 xxx xxx xxx"
                />
              </div>

              {cardForm.cardType === 'Physical' && (
                <>
                  <div>
                    <Label className="text-white text-sm">Address *</Label>
                    <Input
                      value={cardForm.address}
                      onChange={(e) => setCardForm({...cardForm, address: e.target.value})}
                      className="bg-gray-800 border-gray-600 text-white mt-1"
                      placeholder="Street address"
                    />
                  </div>

                  <div>
                    <Label className="text-white text-sm">District *</Label>
                    <Input
                      value={cardForm.district}
                      onChange={(e) => setCardForm({...cardForm, district: e.target.value})}
                      className="bg-gray-800 border-gray-600 text-white mt-1"
                      placeholder="District"
                    />
                  </div>

                  <div>
                    <Label className="text-white text-sm">Village/Area *</Label>
                    <Input
                      value={cardForm.village}
                      onChange={(e) => setCardForm({...cardForm, village: e.target.value})}
                      className="bg-gray-800 border-gray-600 text-white mt-1"
                      placeholder="Village or area"
                    />
                  </div>
                </>
              )}

              <div className="flex space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowPurchaseModal(false)}
                  className="flex-1 border-gray-600 text-white hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleFormSubmit}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Purchase Card
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

// Card Management Component
const CardManagement = ({ card, onBack }: { card: any; onBack: () => void }) => {
  const [addMoneyAmount, setAddMoneyAmount] = useState('');
  const [isFrozen, setIsFrozen] = useState(card.isFrozen || false);
  const [dailyLimit, setDailyLimit] = useState(card.dailyLimit?.toString() || '100000');
  const [monthlyLimit, setMonthlyLimit] = useState(card.monthlyLimit?.toString() || '1000000');
  const { toast } = useToast();

  const handleAddMoney = () => {
    const amount = parseFloat(addMoneyAmount);
    if (amount > 0) {
      toast({
        title: 'Success',
        description: `Added ${card.currency} ${amount.toLocaleString()} to your card`,
      });
      setAddMoneyAmount('');
    }
  };

  const handleUpdateSettings = () => {
    toast({
      title: 'Settings Updated',
      description: 'Card settings have been updated successfully',
    });
  };

  const handleDeleteCard = () => {
    if (confirm('Are you sure you want to delete this card? This action cannot be undone.')) {
      toast({
        title: 'Card Deleted',
        description: 'Your card has been deleted successfully',
        variant: 'destructive'
      });
      onBack();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="container mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-xl md:text-2xl font-bold text-white">{card.type} Card Management</h2>
        </div>

        {/* Card Details */}
        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-600/50">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xs font-medium text-gray-400 mb-1">VISA</div>
                  <h3 className="text-xl font-bold text-white">{card.type} Card</h3>
                  <p className="text-gray-300">{card.holderName}</p>
                </div>
                <Badge className={`${isFrozen ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
                  {isFrozen ? 'Frozen' : 'Active'}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Card Number</p>
                  <p className="font-mono text-lg text-white">{card.number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Balance</p>
                  <p className="text-2xl font-bold text-white">{card.currency} {card.balance.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Money */}
        <Card className="bg-gray-900/80 border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Add Money
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-white">Amount</Label>
              <Input
                type="number"
                value={addMoneyAmount}
                onChange={(e) => setAddMoneyAmount(e.target.value)}
                placeholder="Enter amount"
                className="bg-gray-800 border-gray-600 text-white mt-1"
              />
            </div>
            <Button 
              onClick={handleAddMoney}
              disabled={!addMoneyAmount || parseFloat(addMoneyAmount) <= 0}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Add Money
            </Button>
          </CardContent>
        </Card>

        {/* Card Settings */}
        <Card className="bg-gray-900/80 border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Card Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-white">Freeze Card</Label>
              <Switch checked={isFrozen} onCheckedChange={setIsFrozen} />
            </div>
            
            <div>
              <Label className="text-white">Daily Limit ({card.currency})</Label>
              <Input
                type="number"
                value={dailyLimit}
                onChange={(e) => setDailyLimit(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white mt-1"
              />
            </div>
            
            <div>
              <Label className="text-white">Monthly Limit ({card.currency})</Label>
              <Input
                type="number"
                value={monthlyLimit}
                onChange={(e) => setMonthlyLimit(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white mt-1"
              />
            </div>
            
            <Button onClick={handleUpdateSettings} className="w-full bg-blue-600 hover:bg-blue-700">
              Update Settings
            </Button>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="bg-red-900/20 border-red-500/20">
          <CardHeader>
            <CardTitle className="text-red-400 flex items-center">
              <Trash2 className="w-5 h-5 mr-2" />
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300 text-sm">
              Deleting your card is permanent and cannot be undone. Make sure to spend or transfer your remaining balance first.
            </p>
            <Button onClick={handleDeleteCard} variant="destructive" className="w-full">
              Delete Card
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
