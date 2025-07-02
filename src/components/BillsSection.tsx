
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Zap, GraduationCap, Droplets, Fuel, Wifi, Phone, Car, Home, CreditCard, Building } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface BillsSectionProps {
  onBalanceUpdate?: (currency: string, amount: number) => void;
}

export const BillsSection = ({ onBalanceUpdate }: BillsSectionProps) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [recentPayments, setRecentPayments] = useState([
    { id: 1, type: 'Electricity', provider: 'ESCOM', amount: 'MWK 15,000', date: '2024-01-15', status: 'Paid' },
    { id: 2, type: 'Water', provider: 'BWB', amount: 'MWK 8,500', date: '2024-01-14', status: 'Paid' },
    { id: 3, type: 'Internet', provider: 'Skyband', amount: 'MWK 25,000', date: '2024-01-13', status: 'Paid' }
  ]);

  const billCategories = [
    { id: 'electricity', name: 'Electricity', icon: Zap, color: 'text-yellow-400', bgColor: 'bg-yellow-500/20 hover:bg-yellow-500/30 border-yellow-400/30' },
    { id: 'education', name: 'Education', icon: GraduationCap, color: 'text-blue-400', bgColor: 'bg-blue-500/20 hover:bg-blue-500/30 border-blue-400/30' },
    { id: 'water', name: 'Water', icon: Droplets, color: 'text-cyan-400', bgColor: 'bg-cyan-500/20 hover:bg-cyan-500/30 border-cyan-400/30' },
    { id: 'fuel', name: 'Fuel', icon: Fuel, color: 'text-red-400', bgColor: 'bg-red-500/20 hover:bg-red-500/30 border-red-400/30' },
    { id: 'internet', name: 'Internet', icon: Wifi, color: 'text-green-400', bgColor: 'bg-green-500/20 hover:bg-green-500/30 border-green-400/30' },
    { id: 'mobile', name: 'Mobile', icon: Phone, color: 'text-purple-400', bgColor: 'bg-purple-500/20 hover:bg-purple-500/30 border-purple-400/30' },
    { id: 'transport', name: 'Transport', icon: Car, color: 'text-orange-400', bgColor: 'bg-orange-500/20 hover:bg-orange-500/30 border-orange-400/30' },
    { id: 'rent', name: 'Rent', icon: Home, color: 'text-indigo-400', bgColor: 'bg-indigo-500/20 hover:bg-indigo-500/30 border-indigo-400/30' }
  ];

  const getProvidersForCategory = (categoryId: string) => {
    const providers = {
      electricity: ['ESCOM - Electricity Supply Corporation of Malawi'],
      education: [
        'University of Malawi',
        'Mzuzu University', 
        'Lilongwe University of Agriculture',
        'Malawi University of Science and Technology',
        'Catholic University of Malawi',
        'Adventist University of Africa'
      ],
      water: [
        'Blantyre Water Board',
        'Lilongwe Water Board', 
        'Northern Region Water Board',
        'Central Region Water Board',
        'Southern Region Water Board'
      ],
      fuel: ['Total Malawi', 'Puma Energy', 'Petroda'],
      internet: ['Skyband', 'Access Communications', 'Malawi Telecommunications'],
      mobile: ['TNM', 'Airtel Malawi'],
      transport: ['Malawi Railways', 'AXA Bus Services'],
      rent: ['Property Management Services']
    };
    return providers[categoryId as keyof typeof providers] || [];
  };

  const handlePayBill = () => {
    if (!selectedCategory || !selectedProvider || !amount || !accountNumber) {
      alert('Please fill in all fields');
      return;
    }

    const billAmount = parseFloat(amount);
    const fee = billAmount * 0.01; // 1% processing fee
    const total = billAmount + fee;

    // Add to recent payments
    const newPayment = {
      id: Date.now(),
      type: billCategories.find(cat => cat.id === selectedCategory)?.name || selectedCategory,
      provider: selectedProvider.split('-')[0].trim(),
      amount: `MWK ${billAmount.toLocaleString()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Paid'
    };

    setRecentPayments(prev => [newPayment, ...prev.slice(0, 4)]);

    // Update balance
    if (onBalanceUpdate) {
      onBalanceUpdate('MWK', -total);
    }

    // Reset form
    setSelectedCategory('');
    setSelectedProvider('');
    setAmount('');
    setAccountNumber('');

    alert(`Bill payment successful! MWK ${total.toLocaleString()} deducted from your wallet.`);
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Bill Categories */}
      <Card className="gradient-card border-white/20">
        <CardHeader>
          <CardTitle className="text-glass">Quick Bill Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {billCategories.map((category) => (
              <Button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`h-20 flex-col space-y-2 transition-all duration-300 ${
                  selectedCategory === category.id 
                    ? category.bgColor + ' ring-2 ring-white/30' 
                    : 'bg-white/10 hover:bg-white/20 border-white/20'
                }`}
              >
                <category.icon className={`w-6 h-6 ${category.color}`} />
                <span className="text-xs font-medium text-white">{category.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Form */}
      {selectedCategory && (
        <Card className="gradient-card border-white/20">
          <CardHeader>
            <CardTitle className="text-glass">
              Pay {billCategories.find(cat => cat.id === selectedCategory)?.name} Bill
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-glass mb-2">Service Provider</label>
              <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                <SelectTrigger className="bg-white/10 border-white/20 text-glass">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  {getProvidersForCategory(selectedCategory).map((provider) => (
                    <SelectItem key={provider} value={provider} className="text-white">
                      {provider}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-glass mb-2">Account Number</label>
              <Input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Enter account number"
                className="bg-white/10 border-white/20 text-glass placeholder-white/60"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-glass mb-2">Amount (MWK)</label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="bg-white/10 border-white/20 text-glass placeholder-white/60"
              />
            </div>

            {amount && (
              <div className="bg-white/5 p-3 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Bill Amount:</span>
                  <span className="text-glass">MWK {parseFloat(amount || '0').toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Processing Fee (1%):</span>
                  <span className="text-glass">MWK {(parseFloat(amount || '0') * 0.01).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-base font-semibold border-t border-white/20 pt-2 mt-2">
                  <span className="text-glass">Total:</span>
                  <span className="text-glass">MWK {(parseFloat(amount || '0') * 1.01).toLocaleString()}</span>
                </div>
              </div>
            )}

            <Button 
              onClick={handlePayBill}
              className="w-full gradient-success text-white font-semibold"
              disabled={!selectedCategory || !selectedProvider || !amount || !accountNumber}
            >
              Pay Bill
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Recent Bill Payments */}
      <Card className="gradient-card border-white/20">
        <CardHeader>
          <CardTitle className="text-glass">Recent Bill Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm text-white truncate">{payment.type}</p>
                  <p className="text-xs text-white/60 truncate">{payment.provider}</p>
                </div>
                <div className="text-right ml-2">
                  <p className="font-medium text-sm text-white">{payment.amount}</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-xs text-white/60">{payment.date}</p>
                    <Badge className="bg-green-500/20 text-green-300 border-green-400/30 text-xs">
                      {payment.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
