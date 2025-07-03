
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CreditCard, Check, Star, Crown, Wallet, Plus, Settings, Lock, Trash2, DollarSign, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/utils/languageApi';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';

interface VirtualCardsSectionProps {
  onCardPurchase?: (cardType: string, cardData: any) => void;
  purchasedCards?: any[];
  onBack?: () => void;
  wallets?: any[];
}

export const VirtualCardsSection = ({ onCardPurchase, purchasedCards = [], onBack, wallets = [] }: VirtualCardsSectionProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showCardManagement, setShowCardManagement] = useState<any>(null);
  const [showAddMoney, setShowAddMoney] = useState<any>(null);
  const [addMoneyAmount, setAddMoneyAmount] = useState('');
  
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
      icon: <CreditCard className="w-6 h-6 text-blue-400" />,
      price: 'FREE',
      monthlyFee: 'MWK 2,500',
      features: ['Online purchases', 'Basic security', 'Transaction history'],
      gradient: 'from-blue-500 to-blue-700',
      bgColor: 'bg-gradient-to-br from-blue-500 to-blue-700',
      popular: false
    },
    {
      name: 'Gold',
      icon: <Star className="w-6 h-6 text-yellow-400" />,
      price: 'MWK 10,000',
      monthlyFee: 'MWK 1,000',
      features: ['All Standard features', 'Higher limits', 'Priority support', 'Cashback rewards'],
      gradient: 'from-yellow-500 to-yellow-700',
      bgColor: 'bg-gradient-to-br from-yellow-500 to-yellow-700',
      popular: true
    },
    {
      name: 'Platinum',
      icon: <Crown className="w-6 h-6 text-gray-300" />,
      price: 'MWK 15,000',
      monthlyFee: 'MWK 500',
      features: ['All Gold features', 'Premium benefits', 'Concierge service', 'Travel insurance'],
      gradient: 'from-gray-400 to-gray-600',
      bgColor: 'bg-gradient-to-br from-gray-400 to-gray-600',
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

  const mockWallets = [
    { currency: 'MWK', balance: 50000 },
    { currency: 'USD', balance: 1000 },
    { currency: 'GBP', balance: 800 },
    { currency: 'EUR', balance: 900 },
    { currency: 'ZAR', balance: 15000 }
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

    const selectedCardType = cardTypes.find(ct => ct.name === cardForm.cardType);
    
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
      monthlyLimit: 1000000,
      gradient: selectedCardType?.bgColor || 'bg-gradient-to-br from-blue-500 to-blue-700'
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

  const handleAddMoney = () => {
    const amount = parseFloat(addMoneyAmount);
    if (amount <= 0) {
      toast({
        title: 'Error',
        description: 'Please enter a valid amount',
        variant: 'destructive'
      });
      return;
    }

    const sourceWallet = mockWallets.find(w => w.currency === showAddMoney.currency);
    if (!sourceWallet || sourceWallet.balance < amount) {
      toast({
        title: 'Error',
        description: 'Insufficient balance in source wallet',
        variant: 'destructive'
      });
      return;
    }

    // Update card balance and deduct from wallet
    toast({
      title: 'Success',
      description: `Added ${showAddMoney.currency} ${amount.toLocaleString()} to your card`,
    });

    setShowAddMoney(null);
    setAddMoneyAmount('');
  };

  const getCardGradient = (cardType: string) => {
    const card = cardTypes.find(ct => ct.name === cardType);
    return card?.bgColor || 'bg-gradient-to-br from-blue-500 to-blue-700';
  };

  if (showCardManagement) {
    return <CardManagement card={showCardManagement} onBack={() => setShowCardManagement(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-3 pb-24">
      <div className="container mx-auto max-w-lg space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
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
            <h2 className="text-lg font-bold text-white">{t('cards')}</h2>
            <p className="text-gray-300 text-sm">Choose the perfect card for your needs</p>
          </div>
          <div className="w-16"></div>
        </div>

        {/* My Virtual Cards Section */}
        {purchasedCards.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white">My Virtual Cards</h3>
            <div className="space-y-3">
              {purchasedCards.map((card: any) => (
                <Card 
                  key={card.id} 
                  className={`${getCardGradient(card.type)} border-0 shadow-xl cursor-pointer transform transition-all hover:scale-[1.02]`}
                  onClick={() => setShowCardManagement(card)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-xs font-bold text-white/90 mb-1">VISA</div>
                          <h4 className="font-bold text-white text-sm">{card.type} Card</h4>
                          <p className="text-xs text-white/80">{card.holderName}</p>
                        </div>
                        <Badge className={`${card.isFrozen ? 'bg-red-500/30 text-red-200' : 'bg-green-500/30 text-green-200'} text-xs border-0`}>
                          {card.isFrozen ? 'Frozen' : card.status}
                        </Badge>
                      </div>
                      
                      <div className="text-white/90">
                        <p className="text-xs text-white/70">Card Number</p>
                        <p className="font-mono text-sm">{card.number}</p>
                      </div>
                      
                      <div className="text-white/90">
                        <p className="text-xs text-white/70">Balance</p>
                        <p className="text-lg font-bold text-white">
                          {card.currency} {card.balance.toLocaleString()}
                        </p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          className="flex-1 bg-white/20 hover:bg-white/30 text-white border-0 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowAddMoney(card);
                          }}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add Money
                        </Button>
                        <Button 
                          size="sm" 
                          className="flex-1 bg-white/10 hover:bg-white/20 text-white border-0 text-xs"
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
          <h3 className="text-base font-bold text-white">Available Cards</h3>
          <div className="space-y-3">
            {cardTypes.map((card, index) => (
              <Card 
                key={index} 
                className={`relative bg-gradient-to-br ${card.gradient} border-0 shadow-xl cursor-pointer transform transition-all hover:scale-[1.02] ${
                  selectedCard === card.name ? 'ring-2 ring-blue-400' : ''
                }`} 
                onClick={() => setSelectedCard(card.name)}
              >
                {card.popular && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black text-xs border-0">
                    Most Popular
                  </Badge>
                )}
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {card.icon}
                      <div>
                        <div className="text-xs font-bold text-white/90 mb-1">VISA</div>
                        <CardTitle className="text-white text-sm">{card.name} Card</CardTitle>
                        <div className="text-xs text-white/80 mt-1">
                          <div className="text-sm font-bold text-white">{card.price}</div>
                          <div className="text-xs text-white/70">{card.monthlyFee}/month</div>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePurchaseCard(card.name);
                      }}
                      size="sm"
                      className="bg-white/20 hover:bg-white/30 text-white border-0 text-xs"
                    >
                      Purchase
                    </Button>
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex flex-wrap gap-1">
                      {card.features.slice(0, 2).map((feature, idx) => (
                        <div key={idx} className="flex items-center text-xs text-white/80">
                          <Check className="w-3 h-3 text-green-300 mr-1 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Physical Cards Section */}
          <Card className="bg-gradient-to-br from-green-600 to-green-800 border-0 shadow-xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Wallet className="w-6 h-6 text-green-300" />
                  <div>
                    <div className="text-xs font-bold text-white/90 mb-1">VISA</div>
                    <CardTitle className="text-white text-sm">Physical Card</CardTitle>
                    <div className="text-xs text-white/80 mt-1">
                      <div className="text-sm font-bold text-white">MWK 25,000</div>
                      <div className="text-xs text-white/70">No monthly fees</div>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={() => {
                    setCardForm({ ...cardForm, cardType: 'Physical' });
                    setShowPurchaseModal(true);
                  }}
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 text-white border-0 text-xs"
                >
                  Purchase
                </Button>
              </div>
              
              <div className="mt-3">
                <div className="flex flex-wrap gap-1">
                  <div className="flex items-center text-xs text-white/80">
                    <Check className="w-3 h-3 text-green-300 mr-1 flex-shrink-0" />
                    Physical delivery
                  </div>
                  <div className="flex items-center text-xs text-white/80">
                    <Check className="w-3 h-3 text-green-300 mr-1 flex-shrink-0" />
                    ATM withdrawals
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Purchase Modal */}
        <Dialog open={showPurchaseModal} onOpenChange={setShowPurchaseModal}>
          <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-sm mx-auto max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-base">Purchase {cardForm.cardType} Card</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              {cardForm.cardType === 'Physical' && (
                <div>
                  <Label className="text-white text-sm">Card Type</Label>
                  <Select value={cardForm.cardType} onValueChange={(value) => setCardForm({...cardForm, cardType: value})}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700 z-50">
                      <SelectItem value="Standard" className="text-white">Standard Physical</SelectItem>
                      <SelectItem value="Gold" className="text-white">Gold Physical</SelectItem>
                      <SelectItem value="Platinum" className="text-white">Platinum Physical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

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

              <div className="flex space-x-2 pt-3">
                <Button
                  variant="outline"
                  onClick={() => setShowPurchaseModal(false)}
                  className="flex-1 border-gray-600 text-white hover:bg-gray-700 text-sm"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleFormSubmit}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-sm"
                >
                  Purchase Card
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Money Modal */}
        <Dialog open={!!showAddMoney} onOpenChange={() => setShowAddMoney(null)}>
          <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-sm mx-auto">
            <DialogHeader>
              <DialogTitle className="text-base">Add Money to Card</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-white text-sm">Amount ({showAddMoney?.currency})</Label>
                <Input
                  type="number"
                  value={addMoneyAmount}
                  onChange={(e) => setAddMoneyAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="bg-gray-800 border-gray-600 text-white mt-1"
                />
              </div>
              <div className="p-3 bg-blue-500/10 border border-blue-400/30 rounded-lg">
                <p className="text-blue-300 text-sm">
                  Money will be deducted from your {showAddMoney?.currency} wallet
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowAddMoney(null)}
                  className="flex-1 border-gray-600 text-white hover:bg-gray-700 text-sm"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddMoney}
                  disabled={!addMoneyAmount || parseFloat(addMoneyAmount) <= 0}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-sm"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-3 pb-24">
      <div className="container mx-auto max-w-lg space-y-4">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-4">
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-lg font-bold text-white">{card.type} Card Management</h2>
        </div>

        {/* Card Details */}
        <Card className={`${card.gradient || 'bg-gradient-to-br from-blue-500 to-blue-700'} border-0 shadow-xl`}>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xs font-bold text-white/90 mb-1">VISA</div>
                  <h3 className="text-lg font-bold text-white">{card.type} Card</h3>
                  <p className="text-white/80 text-sm">{card.holderName}</p>
                </div>
                <Badge className={`${isFrozen ? 'bg-red-500/30 text-red-200' : 'bg-green-500/30 text-green-200'} border-0`}>
                  {isFrozen ? 'Frozen' : 'Active'}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-white/70">Card Number</p>
                  <p className="font-mono text-base text-white">{card.number}</p>
                </div>
                <div>
                  <p className="text-sm text-white/70">Balance</p>
                  <p className="text-xl font-bold text-white">{card.currency} {card.balance.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Money */}
        <Card className="bg-gray-900/90 border-gray-700/50">
          <CardHeader className="p-4">
            <CardTitle className="text-white flex items-center text-base">
              <DollarSign className="w-5 h-5 mr-2" />
              Add Money
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-3">
            <div>
              <Label className="text-white text-sm">Amount ({card.currency})</Label>
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
        <Card className="bg-gray-900/90 border-gray-700/50">
          <CardHeader className="p-4">
            <CardTitle className="text-white flex items-center text-base">
              <Settings className="w-5 h-5 mr-2" />
              Card Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-4">
            <div className="flex items-center justify-between bg-gray-800/50 p-3 rounded-lg">
              <Label className="text-white text-sm">Freeze Card</Label>
              <Switch checked={isFrozen} onCheckedChange={setIsFrozen} />
            </div>
            
            <div>
              <Label className="text-white text-sm">Daily Limit ({card.currency})</Label>
              <Input
                type="number"
                value={dailyLimit}
                onChange={(e) => setDailyLimit(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white mt-1"
              />
            </div>
            
            <div>
              <Label className="text-white text-sm">Monthly Limit ({card.currency})</Label>
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
          <CardHeader className="p-4">
            <CardTitle className="text-red-400 flex items-center text-base">
              <Trash2 className="w-5 h-5 mr-2" />
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-3">
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
