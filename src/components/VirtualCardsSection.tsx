import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, Plus, Eye, EyeOff, Settings, Trash2, Lock, Unlock, ArrowLeft, PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AddMoneyToCard } from './AddMoneyToCard';
import { useLanguage } from '@/utils/languageApi';

interface VirtualCardsSectionProps {
  onBack?: () => void;
  onTransactionUpdate?: (transaction: any) => void;
  onBalanceUpdate?: (currency: string, amount: number) => void;
}

export const VirtualCardsSection = ({ onBack, onTransactionUpdate, onBalanceUpdate }: VirtualCardsSectionProps) => {
  const { t } = useLanguage();
  const [showCreateCard, setShowCreateCard] = useState(false);
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [cardName, setCardName] = useState('');
  const [cardCurrency, setCardCurrency] = useState('MWK');
  const [cardLimit, setCardLimit] = useState('');

  // Mock data with increased platform fees (70% increase)
  const [cards, setCards] = useState([
    {
      id: '1',
      name: 'Shopping Card',
      currency: 'MWK',
      balance: 25000,
      limit: 100000,
      number: '5412 **** **** 3456',
      expiry: '12/28',
      cvv: '***',
      status: 'active',
      showDetails: false,
      isLocked: false
    },
    {
      id: '2',
      name: 'Travel Card',
      currency: 'USD',
      balance: 150.75,
      limit: 2000,
      number: '4532 **** **** 7890',
      expiry: '09/27',
      cvv: '***',
      status: 'active',
      showDetails: false,
      isLocked: false
    }
  ]);

  const currencies = [
    { code: 'MWK', name: 'Malawian Kwacha', flag: '🇲🇼' },
    { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', flag: '🇬🇧' }
  ];

  const toggleCardDetails = (cardId: string) => {
    setCards(cards.map(card => 
      card.id === cardId 
        ? { ...card, showDetails: !card.showDetails }
        : card
    ));
  };

  const toggleCardLock = (cardId: string) => {
    setCards(cards.map(card => 
      card.id === cardId 
        ? { ...card, isLocked: !card.isLocked, status: card.isLocked ? 'active' : 'locked' }
        : card
    ));
  };

  const createCard = () => {
    if (!cardName || !cardLimit) {
      alert('Please fill in all fields');
      return;
    }

    const newCard = {
      id: Date.now().toString(),
      name: cardName,
      currency: cardCurrency,
      balance: 0,
      limit: parseFloat(cardLimit),
      number: `${Math.floor(1000 + Math.random() * 9000)} **** **** ${Math.floor(1000 + Math.random() * 9000)}`,
      expiry: '12/29',
      cvv: '***',
      status: 'active',
      showDetails: false,
      isLocked: false
    };

    setCards([...cards, newCard]);
    setShowCreateCard(false);
    setCardName('');
    setCardLimit('');
    setCardCurrency('MWK');

    // Add transaction record
    if (onTransactionUpdate) {
      onTransactionUpdate({
        type: 'Card Created',
        amount: `${newCard.currency} Card`,
        description: `Created virtual card: ${newCard.name}`,
        time: 'Just now',
        status: 'completed'
      });
    }
  };

  const deleteCard = (cardId: string) => {
    if (confirm('Are you sure you want to delete this card?')) {
      const cardToDelete = cards.find(c => c.id === cardId);
      setCards(cards.filter(card => card.id !== cardId));
      
      if (onTransactionUpdate && cardToDelete) {
        onTransactionUpdate({
          type: 'Card Deleted',
          amount: `${cardToDelete.currency} Card`,
          description: `Deleted virtual card: ${cardToDelete.name}`,
          time: 'Just now',
          status: 'completed'
        });
      }
    }
  };

  const handleAddMoneySuccess = (transaction: any) => {
    if (onTransactionUpdate) {
      onTransactionUpdate(transaction);
    }
    setShowAddMoney(false);
    setSelectedCard(null);
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header with Back Button */}
      {onBack && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              onClick={onBack}
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h2 className="text-2xl font-bold text-white">{t('cards')}</h2>
          </div>
          <Button
            onClick={() => setShowCreateCard(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Card
          </Button>
        </div>
      )}

      {/* Cards List */}
      <div className="grid gap-4">
        {cards.map((card) => (
          <Card key={card.id} className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-3">
                  <CreditCard className="w-6 h-6 text-blue-400" />
                  <div>
                    <h3 className="text-white text-lg">{card.name}</h3>
                    <p className="text-gray-400 text-sm">{card.number}</p>
                  </div>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant={card.status === 'active' ? 'default' : 'secondary'}>
                    {card.isLocked ? 'Locked' : 'Active'}
                  </Badge>
                  <Button
                    onClick={() => {
                      setSelectedCard(card);
                      setShowAddMoney(true);
                    }}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <PlusCircle className="w-4 h-4 mr-1" />
                    {t('addMoney')}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Available Balance</p>
                  <p className="text-white text-xl font-semibold">
                    {card.balance.toLocaleString()} {card.currency}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Credit Limit</p>
                  <p className="text-white text-xl font-semibold">
                    {card.limit.toLocaleString()} {card.currency}
                  </p>
                </div>
              </div>

              {card.showDetails && (
                <div className="bg-gray-800/60 p-4 rounded-lg border border-gray-600/50">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Card Number</p>
                      <p className="text-white font-mono">{card.number.replace(/\*/g, Math.floor(Math.random() * 10).toString())}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Expiry Date</p>
                      <p className="text-white">{card.expiry}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">CVV</p>
                      <p className="text-white">{card.cvv === '***' ? Math.floor(100 + Math.random() * 900) : card.cvv}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Status</p>
                      <p className="text-white capitalize">{card.status}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex space-x-2">
                <Button
                  onClick={() => toggleCardDetails(card.id)}
                  variant="outline"
                  size="sm"
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700/50"
                >
                  {card.showDetails ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                  {card.showDetails ? 'Hide' : 'Show'} Details
                </Button>
                <Button
                  onClick={() => toggleCardLock(card.id)}
                  variant="outline"
                  size="sm"
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700/50"
                >
                  {card.isLocked ? <Unlock className="w-4 h-4 mr-2" /> : <Lock className="w-4 h-4 mr-2" />}
                  {card.isLocked ? 'Unlock' : 'Lock'}
                </Button>
                <Button
                  onClick={() => deleteCard(card.id)}
                  variant="outline"
                  size="sm"
                  className="border-red-600 text-red-400 hover:bg-red-600/20"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create New Card Modal */}
      {showCreateCard && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-gray-800 border-gray-700 w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="text-white">Create New Virtual Card</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-white">Card Name</Label>
                <Input
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="e.g., Shopping Card"
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
              <div>
                <Label className="text-white">Currency</Label>
                <Select value={cardCurrency} onValueChange={setCardCurrency}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code} className="text-white">
                        {currency.flag} {currency.code} - {currency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-white">Credit Limit</Label>
                <Input
                  type="number"
                  value={cardLimit}
                  onChange={(e) => setCardLimit(e.target.value)}
                  placeholder="Enter credit limit"
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => setShowCreateCard(false)}
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300"
                >
                  {t('cancel')}
                </Button>
                <Button
                  onClick={createCard}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Create Card
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Money to Card Modal */}
      <AddMoneyToCard
        isOpen={showAddMoney}
        onClose={() => {
          setShowAddMoney(false);
          setSelectedCard(null);
        }}
        onSuccess={handleAddMoneySuccess}
        card={selectedCard}
      />
    </div>
  );
};
