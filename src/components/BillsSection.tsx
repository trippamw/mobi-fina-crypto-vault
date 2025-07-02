
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Zap, GraduationCap, Droplets, Fuel, Wifi, Phone, Home, CreditCard, Building, FileText, Shield, Car, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface BillsSectionProps {
  onBalanceUpdate?: (currency: string, amount: number) => void;
  onTransactionUpdate?: (transaction: any) => void;
  onBack?: () => void;
}

export const BillsSection = ({ onBalanceUpdate, onTransactionUpdate, onBack }: BillsSectionProps) => {
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
    { id: 'electricity', name: 'Electricity', icon: Zap, color: 'text-yellow-400', bgColor: 'bg-gray-800/60 hover:bg-gray-700/60 border-gray-600/50' },
    { id: 'education', name: 'Education', icon: GraduationCap, color: 'text-blue-400', bgColor: 'bg-gray-800/60 hover:bg-gray-700/60 border-gray-600/50' },
    { id: 'water', name: 'Water', icon: Droplets, color: 'text-cyan-400', bgColor: 'bg-gray-800/60 hover:bg-gray-700/60 border-gray-600/50' },
    { id: 'fuel', name: 'Fuel', icon: Fuel, color: 'text-red-400', bgColor: 'bg-gray-800/60 hover:bg-gray-700/60 border-gray-600/50' },
    { id: 'internet', name: 'Internet', icon: Wifi, color: 'text-green-400', bgColor: 'bg-gray-800/60 hover:bg-gray-700/60 border-gray-600/50' },
    { id: 'mobile', name: 'Mobile', icon: Phone, color: 'text-purple-400', bgColor: 'bg-gray-800/60 hover:bg-gray-700/60 border-gray-600/50' },
    { id: 'passport', name: 'Passport', icon: FileText, color: 'text-orange-400', bgColor: 'bg-gray-800/60 hover:bg-gray-700/60 border-gray-600/50' },
    { id: 'mra', name: 'MRA', icon: Shield, color: 'text-indigo-400', bgColor: 'bg-gray-800/60 hover:bg-gray-700/60 border-gray-600/50' },
    { id: 'rta', name: 'Road Traffic', icon: Car, color: 'text-pink-400', bgColor: 'bg-gray-800/60 hover:bg-gray-700/60 border-gray-600/50' },
    { id: 'rent', name: 'Rent', icon: Home, color: 'text-teal-400', bgColor: 'bg-gray-800/60 hover:bg-gray-700/60 border-gray-600/50' }
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
      passport: ['Ministry of Internal Affairs - Passport Office'],
      mra: ['Malawi Revenue Authority'],
      rta: ['Road Traffic Authority'],
      rent: ['Property Management Services']
    };
    return providers[categoryId as keyof typeof providers] || [];
  };

  const getAccountPlaceholder = (categoryId: string) => {
    const placeholders = {
      electricity: 'Enter meter number',
      education: 'Enter student ID',
      water: 'Enter account number',
      fuel: 'Enter card number',
      internet: 'Enter account number',
      mobile: 'Enter phone number',
      passport: 'Enter passport application number',
      mra: 'Enter tax identification number',
      rta: 'Enter vehicle registration number',
      rent: 'Enter property reference'
    };
    return placeholders[categoryId as keyof typeof placeholders] || 'Enter account number';
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

    // Add to transaction history
    if (onTransactionUpdate) {
      onTransactionUpdate({
        type: 'Bill Payment',
        amount: `-MWK ${total.toLocaleString()}`,
        description: `${newPayment.type} - ${newPayment.provider}`,
        time: 'Just now',
        status: 'completed'
      });
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
      {/* Header with Back Button */}
      {onBack && (
        <div className="flex items-center space-x-3">
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-2xl font-bold text-white">Bill Payments</h2>
        </div>
      )}

      {/* Bill Categories */}
      <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white">Quick Bill Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {billCategories.map((category) => (
              <Button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`h-20 flex-col space-y-2 transition-all duration-300 ${
                  selectedCategory === category.id 
                    ? 'bg-blue-600/60 border-blue-400/50 ring-2 ring-blue-400/30' 
                    : category.bgColor
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
        <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white">
              Pay {billCategories.find(cat => cat.id === selectedCategory)?.name} Bill
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Service Provider</label>
              <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                <SelectTrigger className="bg-gray-800/60 border-gray-600/50 text-white">
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
              <label className="block text-sm font-medium text-white mb-2">
                {selectedCategory === 'rta' ? 'Vehicle Registration Number' :
                 selectedCategory === 'passport' ? 'Passport Application Number' :
                 selectedCategory === 'mra' ? 'Tax Identification Number' :
                 'Account Number'}
              </label>
              <Input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder={getAccountPlaceholder(selectedCategory)}
                className="bg-gray-800/60 border-gray-600/50 text-white placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Amount (MWK)</label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="bg-gray-800/60 border-gray-600/50 text-white placeholder-gray-400"
              />
            </div>

            {amount && (
              <div className="bg-gray-800/40 p-3 rounded-lg border border-gray-600/30">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Bill Amount:</span>
                  <span className="text-white">MWK {parseFloat(amount || '0').toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Processing Fee (1%):</span>
                  <span className="text-white">MWK {(parseFloat(amount || '0') * 0.01).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-base font-semibold border-t border-gray-600/30 pt-2 mt-2">
                  <span className="text-white">Total:</span>
                  <span className="text-white">MWK {(parseFloat(amount || '0') * 1.01).toLocaleString()}</span>
                </div>
              </div>
            )}

            <Button 
              onClick={handlePayBill}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold"
              disabled={!selectedCategory || !selectedProvider || !amount || !accountNumber}
            >
              Pay Bill
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Recent Bill Payments */}
      <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white">Recent Bill Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors border border-gray-600/30">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm text-white truncate">{payment.type}</p>
                  <p className="text-xs text-gray-300 truncate">{payment.provider}</p>
                </div>
                <div className="text-right ml-2">
                  <p className="font-medium text-sm text-white">{payment.amount}</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-xs text-gray-300">{payment.date}</p>
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
