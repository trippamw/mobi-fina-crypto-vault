
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Zap, Wifi, Car, Home, Droplets, Phone, Tv, GraduationCap, Heart, ShoppingCart } from 'lucide-react';
import { TransactionConfirmation } from '@/components/TransactionConfirmation';

interface BillProvider {
  name: string;
  category: string;
  icon: any;
  accountFormat: string;
  accountPlaceholder: string;
  fee: string;
}

export const BillsSection = () => {
  const [selectedProvider, setSelectedProvider] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [transactionModal, setTransactionModal] = useState({
    isOpen: false,
    showSuccess: false,
    transaction: null as any
  });

  const billProviders: BillProvider[] = [
    // Electricity
    { name: 'ESCOM', category: 'Electricity', icon: Zap, accountFormat: 'Customer Number', accountPlaceholder: 'Enter ESCOM customer number', fee: 'MWK 150' },
    
    // Water
    { name: 'Lilongwe Water Board', category: 'Water', icon: Droplets, accountFormat: 'Account Number', accountPlaceholder: 'Enter LWB account number', fee: 'MWK 100' },
    { name: 'Blantyre Water Board', category: 'Water', icon: Droplets, accountFormat: 'Account Number', accountPlaceholder: 'Enter BWB account number', fee: 'MWK 100' },
    { name: 'Northern Region Water Board', category: 'Water', icon: Droplets, accountFormat: 'Account Number', accountPlaceholder: 'Enter NRWB account number', fee: 'MWK 100' },
    
    // Mobile Networks
    { name: 'TNM Postpaid', category: 'Mobile', icon: Phone, accountFormat: 'Phone Number', accountPlaceholder: '088xxxxxxx', fee: 'MWK 50' },
    { name: 'Airtel Postpaid', category: 'Mobile', icon: Phone, accountFormat: 'Phone Number', accountPlaceholder: '099xxxxxxx', fee: 'MWK 50' },
    
    // Internet
    { name: 'Skyband', category: 'Internet', icon: Wifi, accountFormat: 'Account Number', accountPlaceholder: 'Enter Skyband account', fee: 'MWK 200' },
    { name: 'Access Communications', category: 'Internet', icon: Wifi, accountFormat: 'Account Number', accountPlaceholder: 'Enter Access account', fee: 'MWK 200' },
    
    // Television
    { name: 'DSTV', category: 'TV', icon: Tv, accountFormat: 'Smartcard Number', accountPlaceholder: 'Enter DSTV smartcard number', fee: 'MWK 300' },
    { name: 'GOtv', category: 'TV', icon: Tv, accountFormat: 'IUC Number', accountPlaceholder: 'Enter GOtv IUC number', fee: 'MWK 200' },
    
    // Insurance
    { name: 'NICO General Insurance', category: 'Insurance', icon: Heart, accountFormat: 'Policy Number', accountPlaceholder: 'Enter policy number', fee: 'MWK 250' },
    { name: 'NICO Life Insurance', category: 'Insurance', icon: Heart, accountFormat: 'Policy Number', accountPlaceholder: 'Enter policy number', fee: 'MWK 250' },
    
    // Education
    { name: 'University of Malawi', category: 'Education', icon: GraduationCap, accountFormat: 'Student ID', accountPlaceholder: 'Enter student ID', fee: 'MWK 500' },
    { name: 'Malawi University of Business', category: 'Education', icon: GraduationCap, accountFormat: 'Student ID', accountPlaceholder: 'Enter student ID', fee: 'MWK 500' },
    
    // Vehicle
    { name: 'Road Traffic Directorate', category: 'Vehicle', icon: Car, accountFormat: 'Registration Number', accountPlaceholder: 'Enter vehicle reg number', fee: 'MWK 300' },
    
    // Retail
    { name: 'Shoprite', category: 'Retail', icon: ShoppingCart, accountFormat: 'Customer Number', accountPlaceholder: 'Enter customer number', fee: 'MWK 100' },
    { name: 'Game Stores', category: 'Retail', icon: ShoppingCart, accountFormat: 'Account Number', accountPlaceholder: 'Enter account number', fee: 'MWK 100' }
  ];

  const filteredProviders = billProviders.filter(provider =>
    provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedProviderData = billProviders.find(p => p.name === selectedProvider);

  const handlePayBill = () => {
    if (!selectedProvider || !accountNumber || !amount) return;

    const fee = selectedProviderData?.fee || 'MWK 100';
    const feeAmount = parseInt(fee.replace('MWK ', ''));
    const totalAmount = parseInt(amount) + feeAmount;

    setTransactionModal({
      isOpen: true,
      showSuccess: false,
      transaction: {
        type: 'Bill Payment',
        amount: `MWK ${parseInt(amount).toLocaleString()}`,
        recipient: selectedProvider,
        accountNumber: accountNumber,
        fee: fee,
        total: `MWK ${totalAmount.toLocaleString()}`
      }
    });
  };

  const categories = [...new Set(billProviders.map(p => p.category))];

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Zap className="w-5 h-5 text-green-400" />
            <span>Pay Bills</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search Bill Providers */}
          <div>
            <Label className="text-gray-300">Search Bill Provider</Label>
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for bill provider..."
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          {/* Quick Payments Grid */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Payments</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {categories.map((category) => {
                const provider = billProviders.find(p => p.category === category);
                if (!provider) return null;
                
                return (
                  <Button
                    key={category}
                    variant="outline"
                    className="h-20 flex-col space-y-2 bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-600"
                    onClick={() => setSelectedProvider(billProviders.find(p => p.category === category)?.name || '')}
                  >
                    <provider.icon className="w-6 h-6" />
                    <span className="text-xs">{category}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Bill Provider Selection */}
          <div>
            <Label className="text-gray-300">Select Bill Provider</Label>
            <Select value={selectedProvider} onValueChange={setSelectedProvider}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Choose a bill provider" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {filteredProviders.map((provider) => (
                  <SelectItem key={provider.name} value={provider.name} className="text-white">
                    <div className="flex items-center space-x-2">
                      <provider.icon className="w-4 h-4" />
                      <span>{provider.name}</span>
                      <span className="text-xs text-gray-400">({provider.category})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Account/Reference Number */}
          {selectedProviderData && (
            <div>
              <Label className="text-gray-300">{selectedProviderData.accountFormat}</Label>
              <Input
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder={selectedProviderData.accountPlaceholder}
                className="bg-gray-700 border-gray-600 text-white"
              />
              <p className="text-xs text-gray-400 mt-1">Fee: {selectedProviderData.fee}</p>
            </div>
          )}

          {/* Amount */}
          <div>
            <Label className="text-gray-300">Amount (MWK)</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount to pay"
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <Button 
            onClick={handlePayBill}
            disabled={!selectedProvider || !accountNumber || !amount}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
          >
            Pay Bill
          </Button>
        </CardContent>
      </Card>

      {/* Recent Bill Payments */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Bill Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { provider: 'ESCOM', amount: 'MWK 45,000', account: '****3456', time: '2 hours ago', status: 'Success' },
              { provider: 'Lilongwe Water Board', amount: 'MWK 12,500', account: '****7890', time: '1 day ago', status: 'Success' },
              { provider: 'DSTV', amount: 'MWK 28,000', account: '****1234', time: '3 days ago', status: 'Success' }
            ].map((payment, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-700/50">
                <div>
                  <p className="font-medium text-white">{payment.provider}</p>
                  <p className="text-sm text-gray-400">{payment.account} • {payment.time}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-white">{payment.amount}</p>
                  <p className="text-xs text-green-400">{payment.status}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transaction Confirmation Modal */}
      <TransactionConfirmation
        isOpen={transactionModal.isOpen}
        onClose={() => setTransactionModal({ isOpen: false, showSuccess: false, transaction: null })}
        onConfirm={() => {
          setTimeout(() => {
            setTransactionModal(prev => ({ ...prev, showSuccess: true }));
          }, 1000);
        }}
        onSuccess={() => setTransactionModal({ isOpen: false, showSuccess: false, transaction: null })}
        transaction={transactionModal.transaction}
        showSuccess={transactionModal.showSuccess}
      />
    </div>
  );
};
