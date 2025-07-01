
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { QrCode, Link, Share2, Copy, ArrowDownLeft } from 'lucide-react';

export const ReceiveSection = () => {
  const [amount, setAmount] = useState('');
  const [paymentLink, setPaymentLink] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);

  const generatePaymentLink = () => {
    const link = `https://neovault.app/pay?amount=${amount}&id=${Math.random().toString(36).substring(7)}`;
    setPaymentLink(link);
  };

  const generateQRCode = () => {
    setShowQRCode(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const sharePaymentLink = () => {
    if (navigator.share) {
      navigator.share({
        title: 'NeoVault Payment Request',
        text: `Send me MWK ${amount} via NeoVault`,
        url: paymentLink
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <ArrowDownLeft className="w-5 h-5 text-white" />
            </div>
            <span>Receive Money</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Generate QR code or payment link to receive money from anyone
          </p>

          <div className="space-y-4 mb-6">
            <div>
              <Label htmlFor="amount">Amount to Request (Optional)</Label>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card className="p-6 bg-white/5 border-border/50">
              <div className="text-center space-y-4">
                <QrCode className="w-16 h-16 mx-auto text-primary" />
                <h4 className="font-semibold">QR Code</h4>
                <p className="text-xs text-muted-foreground">
                  Let others scan to pay you instantly
                </p>
                <Button 
                  onClick={generateQRCode}
                  className="w-full gradient-primary"
                >
                  Generate QR Code
                </Button>
              </div>
            </Card>

            <Card className="p-6 bg-white/5 border-border/50">
              <div className="text-center space-y-4">
                <Link className="w-16 h-16 mx-auto text-accent" />
                <h4 className="font-semibold">Payment Link</h4>
                <p className="text-xs text-muted-foreground">
                  Share a link to receive payment
                </p>
                <Button 
                  onClick={generatePaymentLink}
                  className="w-full gradient-secondary"
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
                  <Button size="sm" onClick={sharePaymentLink}>
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Share this link with anyone to receive payments
                </p>
              </div>
            </Card>
          )}

          {showQRCode && (
            <Card className="p-6 bg-card text-center border-border/50">
              <div className="w-48 h-48 mx-auto bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center mb-4">
                <QrCode className="w-24 h-24 text-white" />
              </div>
              {amount && (
                <p className="text-lg font-semibold mb-2">MWK {amount}</p>
              )}
              <p className="text-sm text-muted-foreground mb-4">
                Scan to pay via NeoVault
              </p>
              <div className="flex space-x-2 justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => setShowQRCode(false)}
                >
                  Close
                </Button>
                <Button className="gradient-primary">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share QR
                </Button>
              </div>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
