import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QrCode, Copy, Share2, Link, Smartphone, ArrowLeft } from 'lucide-react';

interface ReceiveSectionProps {
  onBack?: () => void;
}

export const ReceiveSection = ({ onBack }: ReceiveSectionProps) => {
  const [paymentLink, setPaymentLink] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);
  const [amount, setAmount] = useState('');

  const generatePaymentLink = () => {
    const link = `https://neovault.app/pay?amount=${amount}&id=${Math.random().toString(36).substring(7)}`;
    setPaymentLink(link);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-24">
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
          <h2 className="text-2xl font-bold text-white">Receive Money</h2>
        </div>
      )}

      {/* Request Money */}
      <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-2xl">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2 text-base sm:text-lg text-white">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
              <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span>Request Money</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold mb-2 text-white">Get Paid Easily</h3>
            <p className="text-sm text-gray-300">Generate QR code or payment link to receive money</p>
          </div>

          <div>
            <Label htmlFor="amount" className="text-sm text-white">Amount to Receive</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount in MWK"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-base sm:text-lg font-semibold bg-gray-800/60 border-gray-600/50 text-white placeholder-gray-400 mt-1"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4 bg-gray-800/60 border-gray-600/50">
              <div className="text-center space-y-4">
                <QrCode className="w-16 h-16 mx-auto text-blue-400" />
                <h4 className="font-semibold text-white">QR Code</h4>
                <p className="text-xs text-gray-300">Let others scan to pay you</p>
                <Button
                  onClick={() => setShowQRCode(true)}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600"
                  disabled={!amount}
                >
                  Generate QR Code
                </Button>
              </div>
            </Card>

            <Card className="p-4 bg-gray-800/60 border-gray-600/50">
              <div className="text-center space-y-4">
                <Link className="w-16 h-16 mx-auto text-cyan-400" />
                <h4 className="font-semibold text-white">Payment Link</h4>
                <p className="text-xs text-gray-300">Share a link to receive payment</p>
                <Button
                  onClick={generatePaymentLink}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600"
                  disabled={!amount}
                >
                  Generate Link
                </Button>
              </div>
            </Card>
          </div>

          {paymentLink && (
            <Card className="p-4 bg-cyan-500/10 border-cyan-400/30">
              <div className="space-y-3">
                <Label className="text-white">Your Payment Link</Label>
                <div className="flex items-center space-x-2">
                  <Input value={paymentLink} readOnly className="flex-1 bg-gray-800/60 border-gray-600/50 text-white" />
                  <Button size="sm" onClick={() => copyToClipboard(paymentLink)} className="bg-cyan-500 hover:bg-cyan-600">
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {showQRCode && amount && (
            <Card className="p-6 bg-white text-center border-gray-600/50">
              <div className="w-48 h-48 mx-auto bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
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
        </CardContent>
      </Card>
    </div>
  );
};
