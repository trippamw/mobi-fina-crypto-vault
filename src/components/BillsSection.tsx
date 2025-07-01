
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Zap, Wifi, Car, Home, Droplets, Phone, Tv, GraduationCap, Heart, ShoppingCart } from 'lucide-react';

interface BillProvider {
  name: string;
  category: string;
  icon: any;
  accountFormat: string;
  accountPlaceholder: string;
  fee: string;
}

export const BillsSection = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [paidBills, setPaidBills] = useState<any[]>([]);

  const categories = [
    { name: 'Electricity', icon: Zap, color: 'from-yellow-400 to-orange-500' },
    { name: 'Water', icon: Droplets, color: 'from-blue-400 to-cyan-500' },
    { name: 'Mobile', icon: Phone, color: 'from-green-400 to-emerald-500' },
    { name: 'Internet', icon: Wifi, color: 'from-purple-400 to-indigo-500' },
    { name: 'TV', icon: Tv, color: 'from-red-400 to-pink-500' },
    { name: 'Education', icon: GraduationCap, color: 'from-indigo-400 to-purple-500' },
    { name: 'Insurance', icon: Heart, color: 'from-pink-400 to-rose-500' },
    { name: 'Vehicle', icon: Car, color: 'from-gray-400 to-gray-600' }
  ];

  const billProviders: { [key: string]: BillProvider[] } = {
    'Electricity': [
      { name: 'ESCOM', category: 'Electricity', icon: Zap, accountFormat: 'Customer Number', accountPlaceholder: 'Enter ESCOM customer number', fee: 'MWK 150' }
    ],
    'Water': [
      { name: 'Lilongwe Water Board', category: 'Water', icon: Droplets, accountFormat: 'Account Number', accountPlaceholder: 'Enter LWB account number', fee: 'MWK 100' },
      { name: 'Blantyre Water Board', category: 'Water', icon: Droplets, accountFormat: 'Account Number', accountPlaceholder: 'Enter BWB account number', fee: 'MWK 100' },
      { name: 'Northern Region Water Board', category: 'Water', icon: Droplets, accountFormat: 'Account Number', accountPlaceholder: 'Enter NRWB account number', fee: 'MWK 100' },
      { name: 'Central Region Water Board', category: 'Water', icon: Droplets, accountFormat: 'Account Number', accountPlaceholder: 'Enter CRWB account number', fee: 'MWK 100' },
      { name: 'Southern Region Water Board', category: 'Water', icon: Droplets, accountFormat: 'Account Number', accountPlaceholder: 'Enter SRWB account number', fee: 'MWK 100' }
    ],
    'Mobile': [
      { name: 'TNM Postpaid', category: 'Mobile', icon: Phone, accountFormat: 'Phone Number', accountPlaceholder: '088xxxxxxx', fee: 'MWK 50' },
      { name: 'Airtel Postpaid', category: 'Mobile', icon: Phone, accountFormat: 'Phone Number', accountPlaceholder: '099xxxxxxx', fee: 'MWK 50' }
    ],
    'Internet': [
      { name: 'Skyband', category: 'Internet', icon: Wifi, accountFormat: 'Account Number', accountPlaceholder: 'Enter Skyband account', fee: 'MWK 200' },
      { name: 'Access Communications', category: 'Internet', icon: Wifi, accountFormat: 'Account Number', accountPlaceholder: 'Enter Access account', fee: 'MWK 200' }
    ],
    'TV': [
      { name: 'DSTV', category: 'TV', icon: Tv, accountFormat: 'Smartcard Number', accountPlaceholder: 'Enter DSTV smartcard number', fee: 'MWK 300' },
      { name: 'GOtv', category: 'TV', icon: Tv, accountFormat: 'IUC Number', accountPlaceholder: 'Enter GOtv IUC number', fee: 'MWK 200' }
    ],
    'Education': [
      { name: 'University of Malawi', category: 'Education', icon: GraduationCap, accountFormat: 'Student ID', accountPlaceholder: 'Enter student ID', fee: 'MWK 500' },
      { name: 'Malawi University of Business', category: 'Education', icon: GraduationCap, accountFormat: 'Student ID', accountPlaceholder: 'Enter student ID', fee: 'MWK 500' },
      { name: 'Mzuzu University', category: 'Education', icon: GraduationCap, accountFormat: 'Student ID', accountPlaceholder: 'Enter student ID', fee: 'MWK 500' },
      { name: 'Lilongwe University of Agriculture', category: 'Education', icon: GraduationCap, accountFormat: 'Student ID', accountPlaceholder: 'Enter student ID', fee: 'MWK 500' }
    ],
    'Insurance': [
      { name: 'NICO General Insurance', category: 'Insurance', icon: Heart, accountFormat: 'Policy Number', accountPlaceholder: 'Enter policy number', fee: 'MWK 250' },
      { name: 'NICO Life Insurance', category: 'Insurance', icon: Heart, accountFormat: 'Policy Number', accountPlaceholder: 'Enter policy number', fee: 'MWK 250' }
    ],
    'Vehicle': [
      { name: 'Road Traffic Directorate', category: 'Vehicle', icon: Car, accountFormat: 'Registration Number', accountPlaceholder: 'Enter vehicle reg number', fee: 'MWK 300' }
    ]
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSelectedProvider('');
    setAccountNumber('');
  };

  const handlePayBill = async () => {
    if (!selectedProvider || !accountNumber || !amount) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);

    // Simulate processing delay
    setTimeout(() => {
      const billAmount = parseFloat(amount);
      const newBill = {
        provider: selectedProvider,
        amount: `MWK ${billAmount.toLocaleString()}`,
        account: `****${accountNumber.slice(-4)}`,
        time: 'Just now',
        status: 'Success'
      };

      setPaidBills(prev => [newBill, ...prev.slice(0, 4)]); // Keep only 5 recent bills
      setLoading(false);
      
      alert(`Successfully paid MWK ${billAmount.toLocaleString()} to ${selectedProvider}`);
      
      // Reset form
      setAmount('');
      setAccountNumber('');
    }, 2000);
  };

  const availableProviders = selectedCategory ? billProviders[selectedCategory] || [] : [];

  return (
    <div className="space-y-6">
      <Card className="gradient-card border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-glass">
            <Zap className="w-5 h-5 text-yellow-400" />
            <span>Pay Bills</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Quick Payments Grid */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-glass">Quick Payments</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {categories.map((category) => (
                <Button
                  key={category.name}
                  variant="outline"
                  className={`h-20 flex-col space-y-2 border-white/20 text-glass hover:bg-white/10 transition-all duration-300 ${
                    selectedCategory === category.name 
                      ? `bg-gradient-to-r ${category.color} text-white border-transparent` 
                      : 'bg-white/5'
                  }`}
                  onClick={() => handleCategorySelect(category.name)}
                >
                  <category.icon className="w-6 h-6" />
                  <span className="text-xs">{category.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Bill Provider Selection */}
          {selectedCategory && (
            <div>
              <Label className="text-glass">Select {selectedCategory} Provider</Label>
              <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                <SelectTrigger className="bg-white/10 border-white/20 text-glass">
                  <SelectValue placeholder={`Choose a ${selectedCategory.toLowerCase()} provider`} />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  {availableProviders.map((provider) => (
                    <SelectItem key={provider.name} value={provider.name} className="text-white">
                      <div className="flex items-center space-x-2">
                        <provider.icon className="w-4 h-4" />
                        <span>{provider.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Account/Reference Number */}
          {selectedProvider && (
            <div>
              <Label className="text-glass">
                {availableProviders.find(p => p.name === selectedProvider)?.accountFormat}
              </Label>
              <Input
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder={availableProviders.find(p => p.name === selectedProvider)?.accountPlaceholder}
                className="bg-white/10 border-white/20 text-glass placeholder-white/60"
              />
              <p className="text-xs text-white/60 mt-1">
                Fee: {availableProviders.find(p => p.name === selectedProvider)?.fee}
              </p>
            </div>
          )}

          {/* Amount */}
          <div>
            <Label className="text-glass">Amount (MWK)</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount to pay"
              className="bg-white/10 border-white/20 text-glass placeholder-white/60"
            />
          </div>

          <Button 
            onClick={handlePayBill}
            disabled={!selectedProvider || !accountNumber || !amount || loading}
            className="w-full gradient-success text-white font-semibold"
          >
            {loading ? 'Processing Payment...' : 'Pay Bill'}
          </Button>
        </CardContent>
      </Card>

      {/* Recent Bill Payments */}
      {paidBills.length > 0 && (
        <Card className="gradient-card border-white/20">
          <CardHeader>
            <CardTitle className="text-glass">Recent Bill Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {paidBills.map((payment, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <div>
                    <p className="font-medium text-glass">{payment.provider}</p>
                    <p className="text-sm text-white/60">{payment.account} • {payment.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-glass">{payment.amount}</p>
                    <p className="text-xs text-green-400">{payment.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
