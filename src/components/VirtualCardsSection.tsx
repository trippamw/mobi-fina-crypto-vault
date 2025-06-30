
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Plus, Eye, EyeOff, Settings, Truck } from 'lucide-react';

export const VirtualCardsSection = () => {
  const [showCardDetails, setShowCardDetails] = useState(false);

  const cardTiers = [
    {
      name: 'Standard',
      price: 'Free',
      color: 'gradient-standard',
      features: ['Basic transactions', 'Online payments', 'ATM withdrawals'],
      monthlyLimit: 'MWK 500,000',
      dailyLimit: 'MWK 50,000'
    },
    {
      name: 'Gold',
      price: 'MWK 5,000',
      color: 'gradient-gold',
      features: ['Higher limits', 'Priority support', 'Cashback rewards', 'Travel insurance'],
      monthlyLimit: 'MWK 2,000,000',
      dailyLimit: 'MWK 200,000'
    },
    {
      name: 'Platinum',
      price: 'MWK 12,000',
      color: 'gradient-platinum',
      features: ['Unlimited transactions', 'Concierge service', 'Premium rewards', 'Global coverage'],
      monthlyLimit: 'Unlimited',
      dailyLimit: 'MWK 500,000'
    }
  ];

  const myCards = [
    {
      type: 'Standard',
      number: '1234 5678 9012 3456',
      expiry: '12/26',
      status: 'Active',
      balance: 125000
    }
  ];

  return (
    <div className="space-y-6">
      {/* My Cards */}
      <Card className="gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-primary" />
            <span>My Virtual Cards</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {myCards.length > 0 ? (
            <div className="space-y-4">
              {myCards.map((card, index) => (
                <div key={index} className="relative">
                  <div className="w-full h-48 gradient-standard rounded-xl p-6 text-white relative overflow-hidden">
                    <div className="absolute top-4 right-4 flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded flex items-center justify-center">
                        <span className="text-white font-bold text-xs">MC</span>
                      </div>
                      <span className="text-sm font-medium">Mastercard</span>
                    </div>
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
                          <Badge className="bg-green-500/20 text-green-300">{card.status}</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div>
                      <p className="font-semibold">Balance: MWK {card.balance.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">{card.type} Card</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowCardDetails(!showCardDetails)}
                      >
                        {showCardDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <CreditCard className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No cards yet. Create your first virtual card below.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Card Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cardTiers.map((tier, index) => (
          <Card key={index} className="gradient-card border-border/50 hover:scale-105 transition-transform">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{tier.name}</span>
                <Badge variant="secondary">{tier.price}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={`w-full h-32 ${tier.color} rounded-lg p-4 text-white relative`}>
                <div className="absolute top-2 right-2 flex items-center space-x-1">
                  <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-orange-500 rounded flex items-center justify-center">
                    <span className="text-white font-bold text-xs">MC</span>
                  </div>
                </div>
                <div className="absolute bottom-2 left-4">
                  <p className="text-sm font-mono">•••• •••• •••• ••••</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Monthly Limit:</span>
                  <span className="font-semibold">{tier.monthlyLimit}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Daily Limit:</span>
                  <span className="font-semibold">{tier.dailyLimit}</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Features:</p>
                <ul className="text-xs space-y-1">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <div className="w-1 h-1 bg-accent rounded-full"></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button className="w-full gradient-primary">
                <Plus className="w-4 h-4 mr-2" />
                Get {tier.name} Card
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Physical Card Option */}
      <Card className="gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Truck className="w-5 h-5 text-accent" />
            <span>Physical Card</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-10 gradient-primary rounded flex items-center justify-center">
                <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-orange-500 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xs">MC</span>
                </div>
              </div>
              <div>
                <h4 className="font-semibold">Physical Mastercard</h4>
                <p className="text-sm text-muted-foreground">Get a physical card delivered to your address</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-lg">MWK 10,000</p>
              <p className="text-xs text-muted-foreground">One-time fee</p>
            </div>
          </div>
          <Button className="w-full mt-4 gradient-secondary">
            <Truck className="w-4 h-4 mr-2" />
            Order Physical Card
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
