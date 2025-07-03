
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Check, Star, Crown, Wallet } from 'lucide-react';
import { useLanguage } from '@/utils/languageApi';

interface VirtualCardsSectionProps {
  onCardPurchase: (cardType: string) => void;
  purchasedCards: any[];
}

export const VirtualCardsSection = ({ onCardPurchase, purchasedCards }: VirtualCardsSectionProps) => {
  const { t } = useLanguage();
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

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

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">{t('cards')}</h2>
        <p className="text-gray-300">Choose the perfect card for your needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cardTypes.map((card, index) => (
          <Card key={index} className={`relative bg-gradient-to-br ${card.gradient} border-gray-600/50 hover:border-gray-500/50 transition-all duration-300 cursor-pointer ${selectedCard === card.name ? 'ring-2 ring-blue-500' : ''}`} onClick={() => setSelectedCard(card.name)}>
            {card.popular && (
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black">
                Most Popular
              </Badge>
            )}
            <CardHeader className="text-center pb-2">
              <div className="flex flex-col items-center space-y-2">
                {card.icon}
                <div className="text-xs font-medium text-white">VISA</div>
                <CardTitle className="text-white">{card.name} Card</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{card.price}</div>
                <div className="text-sm text-gray-200">Setup fee</div>
                <div className="text-sm text-gray-300 mt-1">{card.monthlyFee}</div>
                <div className="text-xs text-gray-400">Monthly fee</div>
              </div>
              
              <ul className="space-y-2">
                {card.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-sm text-gray-200">
                    <Check className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Button 
                onClick={(e) => {
                  e.stopPropagation();
                  onCardPurchase(card.name);
                }}
                className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                {t('purchaseCard')}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Purchased Cards */}
      {purchasedCards.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white">Your Cards</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {purchasedCards.map((card: any) => (
              <Card key={card.id} className="bg-gray-800/50 border-gray-600/50">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold text-white">{card.type} Card</h4>
                      <Badge className="bg-green-500/20 text-green-300">
                        {card.status}
                      </Badge>
                    </div>
                    <div className="text-gray-300">
                      <p className="text-sm">Card Number</p>
                      <p className="font-mono text-lg">{card.number}</p>
                    </div>
                    <div className="text-gray-300">
                      <p className="text-sm">Balance</p>
                      <p className="text-xl font-bold">MWK {card.balance.toLocaleString()}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                        {t('addMoney')}
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 border-gray-600 text-gray-300">
                        {t('cardSettings')}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
