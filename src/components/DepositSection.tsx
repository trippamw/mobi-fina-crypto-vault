
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, Smartphone, Building, User, CheckCircle } from 'lucide-react';

export const DepositSection = () => {
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');

  const mobileMoneyProviders = [
    { name: 'TNM Mpamba', fee: '1%', logo: '📱' },
    { name: 'Airtel Money', fee: '1.2%', logo: '📱' },
    { name: 'National Bank Mobile', fee: '0.8%', logo: '🏦' }
  ];

  const banks = [
    'National Bank of Malawi', 'Standard Bank', 'FDH Bank', 'NBS Bank',
    'MyBucks Bank', 'Opportunity Bank', 'CDH Investment Bank'
  ];

  const agents = [
    { name: 'NeoVault Agent - Lilongwe City', location: 'Area 3, Lilongwe', distance: '0.5km' },
    { name: 'NeoVault Agent - Blantyre', location: 'Chichiri, Blantyre', distance: '1.2km' },
    { name: 'NeoVault Agent - Mzuzu', location: 'Mzuzu City Center', distance: '0.8km' }
  ];

  return (
    <div className="space-y-6">
      <Card className="gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <span>Deposit Money</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-6">
            <div>
              <Label htmlFor="amount">Amount to Deposit</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount in MWK"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-lg font-semibold"
              />
            </div>
          </div>

          <Tabs defaultValue="mobile" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="mobile">Mobile Money</TabsTrigger>
              <TabsTrigger value="bank">Bank Transfer</TabsTrigger>
              <TabsTrigger value="agent">Agent</TabsTrigger>
              <TabsTrigger value="card">Card</TabsTrigger>
            </TabsList>

            <TabsContent value="mobile" className="space-y-4">
              <div className="grid gap-3">
                {mobileMoneyProviders.map((provider, index) => (
                  <div 
                    key={index}
                    className="p-4 rounded-lg border border-border/50 hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{provider.logo}</span>
                        <div>
                          <p className="font-medium">{provider.name}</p>
                          <p className="text-sm text-muted-foreground">Fee: {provider.fee}</p>
                        </div>
                      </div>
                      <CheckCircle className="w-5 h-5 text-accent" />
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full gradient-primary">Continue with Mobile Money</Button>
            </TabsContent>

            <TabsContent value="bank" className="space-y-4">
              <div>
                <Label>Select Bank</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose your bank" />
                  </SelectTrigger>
                  <SelectContent>
                    {banks.map((bank) => (
                      <SelectItem key={bank} value={bank.toLowerCase()}>{bank}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="account">Account Number</Label>
                <Input id="account" placeholder="Enter your account number" />
              </div>
              <Button className="w-full gradient-secondary">Initiate Bank Transfer</Button>
            </TabsContent>

            <TabsContent value="agent" className="space-y-4">
              <div className="space-y-3">
                {agents.map((agent, index) => (
                  <div key={index} className="p-4 rounded-lg border border-border/50">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <User className="w-5 h-5 text-accent mt-1" />
                        <div>
                          <p className="font-medium">{agent.name}</p>
                          <p className="text-sm text-muted-foreground">{agent.location}</p>
                          <p className="text-xs text-accent">{agent.distance} away</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">Select</Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="card" className="space-y-4">
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input id="expiry" placeholder="MM/YY" />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input id="cvv" placeholder="123" />
                </div>
              </div>
              <Button className="w-full gradient-tertiary">Add Card & Deposit</Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
