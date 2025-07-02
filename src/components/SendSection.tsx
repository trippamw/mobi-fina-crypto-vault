
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, UserPlus, Smartphone, Building, User } from 'lucide-react';

interface SendSectionProps {
  onBalanceUpdate?: (currency: string, amount: number) => void;
  onTransactionUpdate?: (transaction: any) => void;
}

export const SendSection = ({ onBalanceUpdate, onTransactionUpdate }: SendSectionProps) => {
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
      // Calculate fee
      let fee = 0;
      const feeRate = selectedMethod === 'NeoVault User' ? 0 : 
                    selectedMethod === 'Bank Transfer' ? 0.005 :
                    selectedMethod === 'Mobile Money' ? 0.015 : 0.02;
      fee = sendAmount * feeRate;
      const totalDeduction = sendAmount + fee;

      // Deduct from wallet balance
      if (onBalanceUpdate) {
        onBalanceUpdate('MWK', -totalDeduction);
      }

      // Add to transaction history
      if (onTransactionUpdate) {
        onTransactionUpdate({
          type: 'Send',
          amount: `-MWK ${sendAmount.toLocaleString()}`,
          description: `Sent to ${recipient} via ${selectedMethod}`,
          time: 'Just now',
          status: 'completed'
        });
      }
      
      setLoading(false);
      
      // Show success message
      alert(`Successfully sent MWK ${sendAmount.toLocaleString()} to ${recipient} via ${selectedMethod}${fee > 0 ? ` (Fee: MWK ${fee.toLocaleString()})` : ''}`);
      
      // Reset form
      setAmount('');
      setRecipient('');
      setSelectedMethod('');
      setAccountNumber('');
    }, 2000);
  };

  return (
    <div className="space-y-6 pb-24">
      <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Send className="w-5 h-5 text-blue-400" />
            <span>Send Money</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-white">Amount (MWK)</Label>
            <Input
              type="number"
              placeholder="Enter amount to send"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-gray-800/60 border-gray-600/50 text-white placeholder-gray-400 text-lg font-semibold"
            />
          </div>

          <div>
            <Label className="text-white">Recipient Name/Phone</Label>
            <Input
              placeholder="Enter recipient details"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="bg-gray-800/60 border-gray-600/50 text-white placeholder-gray-400"
            />
          </div>

          <div>
            <Label className="text-white">Send Method</Label>
            <div className="grid gap-3 mt-2">
              {sendMethods.map((method, index) => (
                <div 
                  key={index}
                  onClick={() => setSelectedMethod(method.name)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                    selectedMethod === method.name 
                      ? 'border-blue-400/50 bg-blue-500/20' 
                      : 'border-gray-600/50 bg-gray-800/40 hover:bg-gray-700/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <method.icon className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="font-medium text-white">{method.name}</p>
                        <p className="text-sm text-gray-300">{method.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-white">Fee: {method.fee}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedMethod && selectedMethod !== 'NeoVault User' && (
            <div>
              <Label className="text-white">Account/Phone Number</Label>
              <Input
                placeholder="Enter account or phone number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="bg-gray-800/60 border-gray-600/50 text-white placeholder-gray-400"
              />
            </div>
          )}

          {amount && selectedMethod && (
            <div className="bg-gray-800/40 p-3 rounded-lg border border-gray-600/30">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Send Amount:</span>
                <span className="text-white">MWK {parseFloat(amount || '0').toLocaleString()}</span>
              </div>
              {selectedMethod !== 'NeoVault User' && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Transaction Fee:</span>
                  <span className="text-white">
                    MWK {(parseFloat(amount || '0') * (
                      selectedMethod === 'Bank Transfer' ? 0.005 :
                      selectedMethod === 'Mobile Money' ? 0.015 : 0.02
                    )).toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-base font-semibold border-t border-gray-600/30 pt-2 mt-2">
                <span className="text-white">Total Deduction:</span>
                <span className="text-white">
                  MWK {(parseFloat(amount || '0') * (1 + (
                    selectedMethod === 'NeoVault User' ? 0 :
                    selectedMethod === 'Bank Transfer' ? 0.005 :
                    selectedMethod === 'Mobile Money' ? 0.015 : 0.02
                  ))).toLocaleString()}
                </span>
              </div>
            </div>
          )}

          <Button 
            onClick={processSend}
            disabled={!amount || !recipient || !selectedMethod || loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold"
          >
            {loading ? 'Sending...' : `Send MWK ${amount || '0'}`}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
