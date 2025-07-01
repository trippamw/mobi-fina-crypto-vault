
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Plus, Eye, EyeOff, Truck } from 'lucide-react';
import { CardSettings } from '@/components/CardSettings';
import { TransactionConfirmation } from '@/components/TransactionConfirmation';

interface CardTier {
  name: string;
  price: string;
  priceValue: number;
  color: string;
  features: string[];
  monthlyLimit: string;
  dailyLimit: string;
}

interface MyCard {
  id: string;
  type: string;
  number: string;
  expiry: string;
  holderName: string;
  status: string;
  balance: number;
}

export const VirtualCardsSection = () => {
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [myCards, setMyCards] = useState<MyCard[]>([
    {
      id: '1',
      type: 'Standard',
      number: '1234 5678 9012 3456',
      expiry: '12/26',
      holderName: 'NEOVAULT USER',
      status: 'Active',
      balance: 125000
    }
  ]);

  const [showOrderCard, setShowOrderCard] = useState(false);
  const [showPhysicalCard, setShowPhysicalCard] = useState(false);
  const [selectedTier, setSelectedTier] = useState<CardTier | null>(null);
  const [orderForm, setOrderForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  });
  const [transactionModal, setTransactionModal] = useState({
    isOpen: false,
    showSuccess: false,
    transaction: null as any
  });

  const cardTiers: CardTier[] = [
    {
      name: 'Standard',
      price: 'Free',
      priceValue: 0,
      color: 'from-gray-600 to-gray-800',
      features: ['Basic transactions', 'Online payments', 'ATM withdrawals'],
      monthlyLimit: 'MWK 500,000',
      dailyLimit: 'MWK 50,000'
    },
    {
      name: 'Gold',
      price: 'MWK 5,000',
      priceValue: 5000,
      color: 'from-yellow-600 to-yellow-800',
      features: ['Higher limits', 'Priority support', 'Cashback rewards', 'Travel insurance'],
      monthlyLimit: 'MWK 2,000,000',
      dailyLimit: 'MWK 200,000'
    },
    {
      name: 'Platinum',
      price: 'MWK 12,000',
      priceValue: 12000,
      color: 'from-purple-600 to-purple-800',
      features: ['Unlimited transactions', 'Concierge service', 'Premium rewards', 'Global coverage'],
      monthlyLimit: 'Unlimited',
      dailyLimit: 'MWK 500,000'
    }
  ];

  const handleOrderCard = (tier: CardTier) => {
    setSelectedTier(tier);
    setShowOrderCard(true);
  };

  const handleOrderPhysicalCard = () => {
    setShowPhysicalCard(true);
  };

  const processCardOrder = (isPhysical: boolean = false) => {
    if (!selectedTier && !isPhysical) return;

    const price = isPhysical ? 10000 : selectedTier?.priceValue || 0;
    const cardType = isPhysical ? 'Physical Card' : selectedTier?.name || '';

    setTransactionModal({
      isOpen: true,
      showSuccess: false,
      transaction: {
        type: isPhysical ? 'Physical Card Order' : 'Virtual Card Order',
        amount: `MWK ${price.toLocaleString()}`,
        recipient: cardType,
        fee: 'FREE',
        total: `MWK ${price.toLocaleString()}`
      }
    });
  };

  const handleCardOrderSuccess = () => {
    if (selectedTier) {
      const newCard: MyCard = {
        id: Date.now().toString(),
        type: selectedTier.name,
        number: generateCardNumber(),
        expiry: generateExpiry(),
        holderName: orderForm.fullName.toUpperCase() || 'NEOVAULT USER',
        status: 'Active',
        balance: 0
      };
      setMyCards([...myCards, newCard]);
    }
    
    setShowOrderCard(false);
    setShowPhysicalCard(false);
    setSelectedTier(null);
    setOrderForm({
      fullName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      postalCode: ''
    });
  };

  const generateCardNumber = () => {
    const first = Math.floor(1000 + Math.random() * 9000);
    const second = Math.floor(1000 + Math.random() * 9000);
    const third = Math.floor(1000 + Math.random() * 9000);
    const fourth = Math.floor(1000 + Math.random() * 9000);
    return `${first} ${second} ${third} ${fourth}`;
  };

  const generateExpiry = () => {
    const currentYear = new Date().getFullYear();
    const expiryYear = currentYear + 4;
    const month = Math.floor(1 + Math.random() * 12).toString().padStart(2, '0');
    return `${month}/${expiryYear.toString().substr(-2)}`;
  };

  return (
    <div className="space-y-6">
      {/* My Cards */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <CreditCard className="w-5 h-5 text-green-400" />
            <span>My Virtual Cards</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {myCards.length > 0 ? (
            <div className="space-y-4">
              {myCards.map((card, index) => (
                <div key={index} className="relative">
                  <div className="w-full h-48 bg-gradient-to-r from-green-600 to-green-800 rounded-xl p-6 text-white relative overflow-hidden">
                    {/* NeoVault Branding */}
                    <div className="absolute top-4 left-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-bold text-sm">N</span>
                        </div>
                        <span className="text-lg font-bold">NeoVault</span>
                      </div>
                    </div>

                    {/* Mastercard Logo */}
                    <div className="absolute top-4 right-4 flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <div className="w-6 h-6 bg-red-500 rounded-full opacity-90"></div>
                        <div className="w-6 h-6 bg-yellow-500 rounded-full opacity-90 -ml-3"></div>
                      </div>
                      <span className="text-sm font-medium ml-2">Mastercard</span>
                    </div>

                    {/* Card Details */}
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="mb-4">
                        <p className="text-2xl font-mono tracking-wider">
                          {showCardDetails ? card.number : '•••• •••• •••• ••••'}
                        </p>
                      </div>
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-xs opacity-80">EXPIRES</p>
                          <p className="font-mono">{showCardDetails ? card.expiry : '••/••'}</p>
                        </div>
                        <div>
                          <p className="text-xs opacity-80">CARDHOLDER</p>
                          <p className="font-mono text-xs">{card.holderName}</p>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="absolute bottom-4 right-4">
                      <Badge className="bg-green-500/20 text-green-300 border-green-400/30">{card.status}</Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div>
                      <p className="font-semibold text-white">Balance: MWK {card.balance.toLocaleString()}</p>
                      <p className="text-sm text-gray-400">{card.type} Card</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowCardDetails(!showCardDetails)}
                        className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                      >
                        {showCardDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <CardSettings 
                        cardId={card.id}
                        cardType={card.type}
                        onSettingsChange={(settings) => console.log('Settings updated:', settings)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <CreditCard className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No cards yet. Create your first virtual card below.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Card Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cardTiers.map((tier, index) => (
          <Card key={index} className="bg-gray-800/50 border-gray-700 hover:scale-105 transition-transform">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-white">
                <span>{tier.name}</span>
                <Badge variant="secondary" className="bg-gray-700 text-gray-300">{tier.price}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={`w-full h-32 bg-gradient-to-r ${tier.color} rounded-lg p-4 text-white relative`}>
                {/* NeoVault Logo */}
                <div className="absolute top-2 left-2">
                  <div className="flex items-center space-x-1">
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-bold text-xs">N</span>
                    </div>
                    <span className="text-xs font-bold">NeoVault</span>
                  </div>
                </div>
                
                {/* Mastercard Logo */}
                <div className="absolute top-2 right-2 flex items-center space-x-1">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-500 rounded-full opacity-90"></div>
                    <div className="w-4 h-4 bg-yellow-500 rounded-full opacity-90 -ml-2"></div>
                  </div>
                </div>
                
                <div className="absolute bottom-2 left-4">
                  <p className="text-sm font-mono">•••• •••• •••• ••••</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Monthly Limit:</span>
                  <span className="font-semibold text-white">{tier.monthlyLimit}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Daily Limit:</span>
                  <span className="font-semibold text-white">{tier.dailyLimit}</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-white">Features:</p>
                <ul className="text-xs space-y-1">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-2 text-gray-300">
                      <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button 
                onClick={() => handleOrderCard(tier)}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Get {tier.name} Card
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Physical Card Option */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Truck className="w-5 h-5 text-green-400" />
            <span>Physical Card</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-lg bg-gray-700/50">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-10 bg-gradient-to-r from-green-600 to-green-800 rounded flex items-center justify-center relative">
                <div className="absolute top-1 left-1">
                  <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold text-xs">N</span>
                  </div>
                </div>
                <div className="absolute bottom-1 right-1 flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full opacity-90"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full opacity-90 -ml-1"></div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-white">NeoVault Physical Mastercard</h4>
                <p className="text-sm text-gray-400">Get a physical card delivered to your address</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-lg text-white">MWK 10,000</p>
              <p className="text-xs text-gray-400">One-time fee</p>
            </div>
          </div>
          <Button 
            onClick={handleOrderPhysicalCard}
            className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white"
          >
            <Truck className="w-4 h-4 mr-2" />
            Order Physical Card
          </Button>
        </CardContent>
      </Card>

      {/* Card Order Modal */}
      <Dialog open={showOrderCard} onOpenChange={setShowOrderCard}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Order {selectedTier?.name} Card</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Order Summary</h4>
              <div className="flex justify-between">
                <span>Card Type:</span>
                <span>{selectedTier?.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Price:</span>
                <span>{selectedTier?.price}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Full Name</Label>
                <Input
                  value={orderForm.fullName}
                  onChange={(e) => setOrderForm({...orderForm, fullName: e.target.value})}
                  placeholder="Enter your full name"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Email</Label>
                <Input
                  type="email"
                  value={orderForm.email}
                  onChange={(e) => setOrderForm({...orderForm, email: e.target.value})}
                  placeholder="your@email.com"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>

            <div>
              <Label className="text-gray-300">Phone Number</Label>
              <Input
                value={orderForm.phone}
                onChange={(e) => setOrderForm({...orderForm, phone: e.target.value})}
                placeholder="088xxxxxxx"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <Button 
              onClick={() => processCardOrder(false)}
              disabled={!orderForm.fullName || !orderForm.email || !orderForm.phone}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Order Card - {selectedTier?.price}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Physical Card Order Modal */}
      <Dialog open={showPhysicalCard} onOpenChange={setShowPhysicalCard}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Order Physical Card</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Delivery Information</h4>
              <p className="text-sm text-gray-400">Your physical card will be delivered within 7-10 business days.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Full Name</Label>
                <Input
                  value={orderForm.fullName}
                  onChange={(e) => setOrderForm({...orderForm, fullName: e.target.value})}
                  placeholder="Enter your full name"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Phone Number</Label>
                <Input
                  value={orderForm.phone}
                  onChange={(e) => setOrderForm({...orderForm, phone: e.target.value})}
                  placeholder="088xxxxxxx"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>

            <div>
              <Label className="text-gray-300">Delivery Address</Label>
              <Input
                value={orderForm.address}
                onChange={(e) => setOrderForm({...orderForm, address: e.target.value})}
                placeholder="Enter your full address"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">City</Label>
                <Input
                  value={orderForm.city}
                  onChange={(e) => setOrderForm({...orderForm, city: e.target.value})}
                  placeholder="Enter city"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Postal Code</Label>
                <Input
                  value={orderForm.postalCode}
                  onChange={(e) => setOrderForm({...orderForm, postalCode: e.target.value})}
                  placeholder="Enter postal code"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>

            <Button 
              onClick={() => processCardOrder(true)}
              disabled={!orderForm.fullName || !orderForm.phone || !orderForm.address || !orderForm.city}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Order Physical Card - MWK 10,000
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Transaction Confirmation Modal */}
      <TransactionConfirmation
        isOpen={transactionModal.isOpen}
        onClose={() => setTransactionModal({ isOpen: false, showSuccess: false, transaction: null })}
        onConfirm={() => {
          setTimeout(() => {
            setTransactionModal(prev => ({ ...prev, showSuccess: true }));
          }, 1000);
        }}
        onSuccess={() => {
          handleCardOrderSuccess();
          setTransactionModal({ isOpen: false, showSuccess: false, transaction: null });
        }}
        transaction={transactionModal.transaction}
        showSuccess={transactionModal.showSuccess}
      />
    </div>
  );
};
