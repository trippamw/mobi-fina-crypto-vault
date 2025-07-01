
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, UserPlus, Smartphone, Building, User } from 'lucide-react';

interface SendSectionProps {
  onBalanceUpdate?: (currency: string, amount: number) => void;
}

export const SendSection = ({ onBalanceUpdate }: SendSectionProps) => {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMethods = [
    { name: 'NeoVault User', fee: 'FREE', icon: UserPlus, description: 'Send to another NeoVault user' },
    { name: 'Mobile Money', fee: '1.5%', icon: Smartphone, description: 'Send to mobile money wallet' },
    { name: 'Bank Transfer', fee: '0.5%', icon: Building, description: 'Send to bank account' },
    { name: 'Agent Network', fee: '2%', icon: User, description: 'Send via agent network' }
  ];

  const processSend = async () => {
    if (!amount || !recipient || !selectedMethod) {
      alert('Please fill in all required fields');
      return;
    }

    const sendAmount = parseFloat(amount);
    if (sendAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setLoading(true);
    
    // Simulate processing delay
    setTimeout(() => {
      // Deduct from wallet balance
      if (onBalanceUpdate) {
        onBalanceUpdate('MWK', -sendAmount);
      }
      
      setLoading(false);
      
      // Show success message
      alert(`Successfully sent MWK ${sendAmount.toLocaleString()} to ${recipient} via ${selectedMethod}`);
      
      // Reset form
      setAmount('');
      setRecipient('');
      setSelectedMethod('');
      setAccountNumber('');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <Card className="gradient-card border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-glass">
            <Send className="w-5 h-5 text-blue-400" />
            <span>Send Money</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-glass">Amount (MWK)</Label>
            <Input
              type="number"
              placeholder="Enter amount to send"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-white/10 border-white/20 text-glass placeholder-white/60 text-lg font-semibold"
            />
          </div>

          <div>
            <Label className="text-glass">Recipient Name/Phone</Label>
            <Input
              placeholder="Enter recipient details"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="bg-white/10 border-white/20 text-glass placeholder-white/60"
            />
          </div>

          <div>
            <Label className="text-glass">Send Method</Label>
            <div className="grid gap-3 mt-2">
              {sendMethods.map((method, index) => (
                <div 
                  key={index}
                  onClick={() => setSelectedMethod(method.name)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                    selectedMethod === method.name 
                      ? 'border-blue-400/50 bg-blue-500/20' 
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <method.icon className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="font-medium text-glass">{method.name}</p>
                        <p className="text-sm text-white/60">{method.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-glass">Fee: {method.fee}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedMethod && selectedMethod !== 'NeoVault User' && (
            <div>
              <Label className="text-glass">Account/Phone Number</Label>
              <Input
                placeholder="Enter account or phone number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="bg-white/10 border-white/20 text-glass placeholder-white/60"
              />
            </div>
          )}

          <Button 
            onClick={processSend}
            disabled={!amount || !recipient || !selectedMethod || loading}
            className="w-full gradient-primary text-white font-semibold"
          >
            {loading ? 'Sending...' : `Send MWK ${amount || '0'}`}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
