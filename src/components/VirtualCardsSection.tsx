
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Plus, Eye, EyeOff, ShoppingCart, Star, Crown } from 'lucide-react';

export const VirtualCardsSection = () => {
  const [cardVisible, setCardVisible] = useState(true);

  const cardTiers = [
    {
      name: 'Standard',
      price: 'Free',
      icon: CreditCard,
      gradient: 'gradient-standard',
      features: ['Free ATM withdrawals (5/month)', 'Basic fraud protection', 'Mobile payments', '24/7 support'],
      color: 'text-gray-400'
    },
    {
      name: 'Gold',
      price: 'MWK 5,000/month',
      icon: Star,
      gradient: 'gradient-gold',
      features: ['Unlimited ATM withdrawals', 'Advanced fraud protection', 'Priority support', 'Cashback rewards', 'Travel insurance'],
      color: 'text-yellow-400'
    },
    {
      name: 'Platinum',
      price: 'MWK 12,000/month',
      icon: Crown,
      gradient: 'gradient-platinum',
      features: ['All Gold features', 'Concierge service', 'Airport lounge access', 'Higher spending limits', 'Premium rewards'],
      color: 'text-purple-400'
    }
  ];

  const myCards = [
    {
      id: '1',
      name: 'Primary Card',
      tier: 'Standard',
      number: '**** **** **** 1234',
      balance: 125000,
      status: 'Active',
      gradient: 'gradient-standard'
    },
    {
      id: '2',
      name: 'Shopping Card',
      tier: 'Gold',
      number: '**** **** **** 5678',
      balance: 50000,
      status: 'Active',
      gradient: 'gradient-gold'
    }
  ];

  return (
    <div className="space-y-6">
      {/* My Cards */}
      <Card className="gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-primary" />
              <span>My Cards</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCardVisible(!cardVisible)}
              className="text-muted-foreground hover:text-foreground"
            >
              {cardVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {myCards.map((card) => (
              <div key={card.id} className={`${card.gradient} p-6 rounded-xl relative overflow-hidden`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-semibold text-white">{card.name}</h4>
                    <Badge className="bg-white/20 text-white border-white/30 mt-1">
                      {card.tier}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white/70">Balance</p>
                    <p className="font-bold text-white">
                      {cardVisible ? `MWK ${card.balance.toLocaleString()}` : '••••••'}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-mono text-white">
                    {cardVisible ? card.number : '**** **** **** ****'}
                  </p>
                  <div className="flex justify-between">
                    <span className="text-sm text-white/70">Status: {card.status}</span>
                    <div className="flex space-x-1">
                      <div className="w-8 h-6 bg-white/20 rounded"></div>
                      <div className="w-8 h-6 bg-white/30 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <Button className="w-full gradient-primary text-white">
            <Plus className="w-4 h-4 mr-2" />
            Create New Virtual Card
          </Button>
        </CardContent>
      </Card>

      {/* Card Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cardTiers.map((tier, index) => (
          <Card key={index} className="gradient-card border-border/50 card-hover">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <tier.icon className={`w-6 h-6 ${tier.color}`} />
                <span>{tier.name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-2xl font-bold text-primary">{tier.price}</p>
                  {tier.price !== 'Free' && (
                    <p className="text-sm text-muted-foreground">Billed monthly</p>
                  )}
                </div>
                
                <ul className="space-y-2">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-sm">
                      <div className="w-1 h-1 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full" 
                  variant={index === 0 ? "outline" : "default"}
                >
                  {index === 0 ? "Get Started" : "Upgrade"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Physical Card Option */}
      <Card className="gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ShoppingCart className="w-5 h-5 text-accent" />
            <span>Physical Card</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold mb-2">Order Physical Card</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Get a physical card delivered to your address for in-store purchases and ATM withdrawals.
              </p>
              <ul className="text-sm space-y-1">
                <li>• Delivery within 5-7 business days</li>
                <li>• Works at all Mastercard locations</li>
                <li>• Contactless payments supported</li>
              </ul>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-accent mb-2">MWK 2,500</p>
              <Button className="gradient-secondary text-white">
                Order Now
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
