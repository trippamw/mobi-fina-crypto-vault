
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, Smartphone, Building, User, CheckCircle, QrCode, Link, Share2, Copy } from 'lucide-react';

export const DepositSection = () => {
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [paymentLink, setPaymentLink] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);

  const mobileMoneyProviders = [
    { name: 'TNM Mpamba', fee: '1%', logo: '📱' },
    { name: 'Airtel Money', fee: '1.2%', logo: '📱' },
    { name: 'MO626', fee: '0.8%', logo: '🏦' }
  ];

  const banks = [
    'Standard Bank', 'FDH Bank', 'NBS Bank', 'National Bank',
    'CDH Investment Bank', 'Centenary Bank', 'FCB'
  ];

  const agents = [
    { name: 'NeoVault Agent - Lilongwe City', location: 'Area 3, Lilongwe', distance: '0.5km' },
    { name: 'NeoVault Agent - Blantyre', location: 'Chichiri, Blantyre', distance: '1.2km' },
    { name: 'NeoVault Agent - Mzuzu', location: 'Mzuzu City Center', distance: '0.8km' }
  ];

  const generatePaymentLink = () => {
    const link = `https://neovault.app/pay?amount=${amount}&id=${Math.random().toString(36).substring(7)}`;
    setPaymentLink(link);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

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
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="mobile">Mobile Money</TabsTrigger>
              <TabsTrigger value="bank">Bank Transfer</TabsTrigger>
              <TabsTrigger value="agent">Agent</TabsTrigger>
              <TabsTrigger value="card">Card</TabsTrigger>
              <TabsTrigger value="request">Request</TabsTrigger>
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
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xs">MC</span>
                </div>
                <span className="text-sm font-medium">Mastercard</span>
              </div>
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

            <TabsContent value="request" className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold mb-2">Request Money</h3>
                <p className="text-sm text-muted-foreground">Generate QR code or payment link to receive money</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4 bg-white/5">
                  <div className="text-center space-y-4">
                    <QrCode className="w-16 h-16 mx-auto text-primary" />
                    <h4 className="font-semibold">QR Code</h4>
                    <p className="text-xs text-muted-foreground">Let others scan to pay you</p>
                    <Button 
                      onClick={() => setShowQRCode(true)}
                      className="w-full"
                      disabled={!amount}
                    >
                      Generate QR Code
                    </Button>
                  </div>
                </Card>

                <Card className="p-4 bg-white/5">
                  <div className="text-center space-y-4">
                    <Link className="w-16 h-16 mx-auto text-accent" />
                    <h4 className="font-semibold">Payment Link</h4>
                    <p className="text-xs text-muted-foreground">Share a link to receive payment</p>
                    <Button 
                      onClick={generatePaymentLink}
                      className="w-full"
                      disabled={!amount}
                    >
                      Generate Link
                    </Button>
                  </div>
                </Card>
              </div>

              {paymentLink && (
                <Card className="p-4 bg-accent/10 border-accent/30">
                  <div className="space-y-3">
                    <Label>Your Payment Link</Label>
                    <div className="flex items-center space-x-2">
                      <Input value={paymentLink} readOnly className="flex-1" />
                      <Button size="sm" onClick={() => copyToClipboard(paymentLink)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button size="sm">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              {showQRCode && amount && (
                <Card className="p-6 bg-white text-center">
                  <div className="w-48 h-48 mx-auto bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center mb-4">
                    <QrCode className="w-24 h-24 text-white" />
                  </div>
                  <p className="text-lg font-semibold text-gray-800">MWK {amount}</p>
                  <p className="text-sm text-gray-600">Scan to pay via NeoVault</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setShowQRCode(false)}
                  >
                    Close
                  </Button>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
