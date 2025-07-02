import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Zap, GraduationCap, Droplets, Wifi, Phone, Car, Home, CreditCard, Building, Smartphone } from 'lucide-react';

interface BillsSectionProps {
  onBalanceUpdate: (currency: string, amount: number) => void;
}

export const BillsSection = ({ onBalanceUpdate }: BillsSectionProps) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [amount, setAmount] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [recentPayments, setRecentPayments] = useState([
    { provider: 'ESCOM', amount: 15000, date: '2024-01-10', status: 'Paid' },
    { provider: 'TNM', amount: 5000, date: '2024-01-09', status: 'Paid' }
  ]);

  const billCategories = [
    { 
      id: 'electricity', 
      name: 'Electricity', 
      icon: Zap, 
      color: 'text-yellow-400',
      providers: ['ESCOM (Electricity Supply Corporation of Malawi)']
    },
    { 
      id: 'education', 
      name: 'Education', 
      icon: GraduationCap, 
      color: 'text-blue-400',
      providers: [
        'University of Malawi',
        'Mzuzu University', 
        'Lilongwe University of Agriculture',
        'Malawi University of Science and Technology',
        'Catholic University of Malawi',
        'Daeyang University',
        'Kamuzu University of Health Sciences'
      ]
    },
    { 
      id: 'water', 
      name: 'Water', 
      icon: Droplets, 
      color: 'text-cyan-400',
      providers: [
        'Blantyre Water Board',
        'Lilongwe Water Board', 
        'Northern Region Water Board',
        'Central Region Water Board',
        'Southern Region Water Board'
      ]
    },
    { 
      id: 'internet', 
      name: 'Internet', 
      icon: Wifi, 
      color: 'text-purple-400',
      providers: ['TNM', 'Airtel Malawi', 'Access Communications']
    },
    { 
      id: 'mobile', 
      name: 'Mobile', 
      icon: Smartphone, 
      color: 'text-green-400',
      providers: ['TNM', 'Airtel Malawi']
    },
    { 
      id: 'transport', 
      name: 'Transport', 
      icon: Car, 
      color: 'text-orange-400',
      providers: ['Road Fund Administration', 'Traffic Police Fines']
    },
    { 
      id: 'insurance', 
      name: 'Insurance', 
      icon: Home, 
      color: 'text-red-400',
      providers: ['NICO General Insurance', 'Prime Insurance', 'United General Insurance']
    },
    { 
      id: 'loan', 
      name: 'Loan Payments', 
      icon: CreditCard, 
      color: 'text-pink-400',
      providers: ['Standard Bank', 'National Bank of Malawi', 'NBS Bank', 'FDH Bank']
    }
  ];

  const handlePayment = async () => {
    if (!selectedCategory || !selectedProvider || !amount || !accountNumber) {
      alert('Please fill in all required fields');
      return;
    }

    const paymentAmount = parseFloat(amount);
    if (paymentAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      // Deduct from wallet balance
      onBalanceUpdate('MWK', -paymentAmount);
      
      // Add to recent payments
      const newPayment = {
        provider: selectedProvider,
        amount: paymentAmount,
        date: new Date().toISOString().split('T')[0],
        status: 'Paid'
      };
      setRecentPayments(prev => [newPayment, ...prev]);
      
      setLoading(false);
      
      // Show success message
      alert(`Successfully paid MWK ${paymentAmount.toLocaleString()} to ${selectedProvider}`);
      
      // Reset form
      setSelectedCategory('');
      setSelectedProvider('');
      setAmount('');
      setAccountNumber('');
    }, 2000);
  };

  const selectedCategoryData = billCategories.find(cat => cat.id === selectedCategory);

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-indigo-600/20 backdrop-blur-xl border-white/10 shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white/90 font-semibold">
            <Zap className="w-5 h-5 text-yellow-400" />
            <span>Pay Bills</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Bill Categories */}
          <div>
            <Label className="text-white/80 mb-3 block font-medium">Select Bill Category</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {billCategories.map((category) => (
                <Button
                  key={category.id}
                  variant="ghost"
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setSelectedProvider('');
                  }}
                  className={`h-20 flex-col space-y-2 transition-all duration-300 rounded-2xl ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105'
                      : 'bg-white/10 hover:bg-white/20 text-white/80 border border-white/20 hover:scale-102'
                  }`}
                >
                  <category.icon className={`w-6 h-6 ${category.color}`} />
                  <span className="text-xs font-medium">{category.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Service Provider Selection */}
          {selectedCategory && selectedCategoryData && (
            <div>
              <Label className="text-white/80 font-medium">Service Provider</Label>
              <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white/90 rounded-2xl">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900/95 border-gray-700 backdrop-blur-xl">
                  {selectedCategoryData.providers.map((provider) => (
                    <SelectItem key={provider} value={provider} className="text-white hover:bg-white/10">
                      {provider}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Account/Reference Number */}
          {selectedProvider && (
            <div>
              <Label className="text-white/80 font-medium">Account/Reference Number</Label>
              <Input
                placeholder="Enter your account or reference number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="bg-white/10 border-white/20 text-white/90 placeholder-white/50 rounded-2xl"
              />
            </div>
          )}

          {/* Amount */}
          {selectedProvider && (
            <div>
              <Label className="text-white/80 font-medium">Amount (MWK)</Label>
              <Input
                type="number"
                placeholder="Enter amount to pay"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-white/10 border-white/20 text-white/90 placeholder-white/50 text-lg font-semibold rounded-2xl"
              />
            </div>
          )}

          {/* Pay Button */}
          {selectedProvider && amount && accountNumber && (
            <Button 
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-2xl h-12 shadow-lg"
            >
              {loading ? 'Processing Payment...' : `Pay MWK ${amount || '0'}`}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Recent Bill Payments */}
      <Card className="bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-indigo-600/20 backdrop-blur-xl border-white/10 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white/90 font-semibold">Recent Bill Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentPayments.map((payment, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
                <div>
                  <p className="font-medium text-white/90">{payment.provider}</p>
                  <p className="text-sm text-white/60">{payment.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-white/90">MWK {payment.amount.toLocaleString()}</p>
                  <p className="text-xs text-green-400">{payment.status}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
