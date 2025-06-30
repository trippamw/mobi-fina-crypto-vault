
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Zap, Droplets, Smartphone, Building, Shield, Tv, Car, Heart } from 'lucide-react';

export const BillsSection = () => {
  const [selectedBill, setSelectedBill] = useState('');

  const billCategories = [
    {
      category: 'Utilities',
      icon: Zap,
      color: 'text-yellow-400',
      bills: [
        { name: 'ESCOM', type: 'Electricity', fee: 'MWK 50', icon: '⚡' },
        { name: 'Lilongwe Water Board', type: 'Water', fee: 'MWK 30', icon: '💧' },
        { name: 'Blantyre Water Board', type: 'Water', fee: 'MWK 30', icon: '💧' }
      ]
    },
    {
      category: 'Telecommunications',
      icon: Smartphone,
      color: 'text-blue-400',
      bills: [
        { name: 'TNM', type: 'Airtime & Data', fee: 'Free', icon: '📱' },
        { name: 'Airtel', type: 'Airtime & Data', fee: 'Free', icon: '📱' },
        { name: 'Access', type: 'Internet', fee: 'MWK 25', icon: '🌐' }
      ]
    },
    {
      category: 'Government',
      icon: Building,
      color: 'text-green-400',
      bills: [
        { name: 'MRA', type: 'Tax Payments', fee: 'MWK 100', icon: '🏛️' },
        { name: 'Road Traffic', type: 'Vehicle Registration', fee: 'MWK 75', icon: '🚗' },
        { name: 'Passport Office', type: 'Passport Fees', fee: 'MWK 50', icon: '📖' }
      ]
    },
    {
      category: 'Entertainment',
      icon: Tv,
      color: 'text-purple-400',
      bills: [
        { name: 'DSTV', type: 'Satellite TV', fee: 'MWK 40', icon: '📺' },
        { name: 'GOtv', type: 'Digital TV', fee: 'MWK 30', icon: '📺' },
        { name: 'Netflix', type: 'Streaming', fee: 'MWK 25', icon: '🎬' }
      ]
    },
    {
      category: 'Insurance',
      icon: Shield,
      color: 'text-orange-400',
      bills: [
        { name: 'NICO', type: 'Life Insurance', fee: 'MWK 60', icon: '🛡️' },
        { name: 'Prime Insurance', type: 'Vehicle Insurance', fee: 'MWK 80', icon: '🚗' },
        { name: 'Old Mutual', type: 'Health Insurance', fee: 'MWK 70', icon: '❤️' }
      ]
    }
  ];

  const recentPayments = [
    { name: 'ESCOM', amount: 'MWK 45,000', date: '2 days ago', status: 'Paid' },
    { name: 'TNM Airtime', amount: 'MWK 5,000', date: '1 week ago', status: 'Paid' },
    { name: 'DSTV Premium', amount: 'MWK 15,800', date: '2 weeks ago', status: 'Paid' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span>Bills & Utilities</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Pay your bills quickly and securely. No queues, no hassle.
          </p>
        </CardContent>
      </Card>

      {/* Bill Categories */}
      <div className="grid gap-6">
        {billCategories.map((category, categoryIndex) => (
          <Card key={categoryIndex} className="gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <category.icon className={`w-5 h-5 ${category.color}`} />
                <span>{category.category}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.bills.map((bill, billIndex) => (
                  <div
                    key={billIndex}
                    className="p-4 rounded-lg border border-border/50 hover:bg-white/5 cursor-pointer transition-all hover:scale-105"
                    onClick={() => setSelectedBill(`${category.category}-${bill.name}`)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl">{bill.icon}</span>
                      <Badge variant="secondary" className="text-xs">
                        Fee: {bill.fee}
                      </Badge>
                    </div>
                    <h3 className="font-medium">{bill.name}</h3>
                    <p className="text-sm text-muted-foreground">{bill.type}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Payment Form */}
      <Card className="gradient-card border-border/50">
        <CardHeader>
          <CardTitle>Quick Payment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="billProvider">Bill Provider</Label>
              <Input 
                id="billProvider" 
                placeholder="e.g., ESCOM, TNM, DSTV" 
                value={selectedBill.split('-')[1] || ''}
                onChange={(e) => setSelectedBill(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="accountNumber">Account/Reference Number</Label>
              <Input id="accountNumber" placeholder="Enter your account number" />
            </div>
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" type="number" placeholder="Enter amount in MWK" />
            </div>
            <div className="flex items-end">
              <Button className="w-full gradient-primary">Pay Bill</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Payments */}
      <Card className="gradient-card border-border/50">
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentPayments.map((payment, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <div>
                  <p className="font-medium">{payment.name}</p>
                  <p className="text-sm text-muted-foreground">{payment.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{payment.amount}</p>
                  <Badge className="bg-green-500/20 text-green-300">{payment.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
