
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
                  <div className="w-full h-48 gradient-primary rounded-xl p-6 text-white relative overflow-hidden">
                    {/* NeoVault Branding */}
                    <div className="absolute top-4 left-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                          <span className="text-primary font-bold text-sm">N</span>
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
                          <p className="font-mono text-xs">NEOVAULT USER</p>
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
                {/* NeoVault Logo */}
                <div className="absolute top-2 left-2">
                  <div className="flex items-center space-x-1">
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold text-xs">N</span>
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
              <div className="w-16 h-10 gradient-primary rounded flex items-center justify-center relative">
                <div className="absolute top-1 left-1">
                  <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold text-xs">N</span>
                  </div>
                </div>
                <div className="absolute bottom-1 right-1 flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full opacity-90"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full opacity-90 -ml-1"></div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold">NeoVault Physical Mastercard</h4>
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
