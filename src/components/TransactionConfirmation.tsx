
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Download, Share2, X } from 'lucide-react';

interface TransactionDetails {
  type: string;
  amount: string;
  recipient?: string;
  reference?: string;
  fee?: string;
  total?: string;
}

interface TransactionConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onSuccess: () => void;
  transaction: TransactionDetails | null;
  showSuccess: boolean;
}

export const TransactionConfirmation = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  onSuccess, 
  transaction, 
  showSuccess 
}: TransactionConfirmationProps) => {
  const downloadReceipt = () => {
    // Simulate receipt download
    const receiptData = `
NeoVault Transaction Receipt
============================
Transaction Type: ${transaction?.type}
Amount: ${transaction?.amount}
${transaction?.recipient ? `Recipient: ${transaction.recipient}` : ''}
${transaction?.reference ? `Reference: ${transaction.reference}` : ''}
${transaction?.fee ? `Fee: ${transaction.fee}` : ''}
${transaction?.total ? `Total: ${transaction.total}` : ''}
Date: ${new Date().toLocaleString()}
Status: Completed
============================
Thank you for using NeoVault
Malawi's Digital Banking Revolution
    `;
    
    const blob = new Blob([receiptData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `neovault-receipt-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareReceipt = () => {
    if (navigator.share) {
      navigator.share({
        title: 'NeoVault Transaction Receipt',
        text: `Transaction completed on NeoVault: ${transaction?.type} - ${transaction?.amount}`,
      });
    }
  };

  if (showSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-400">Transaction Successful!</h3>
              <p className="text-muted-foreground">Your transaction has been completed successfully.</p>
            </div>
            
            <Card className="bg-white/5 border-border/50">
              <CardContent className="pt-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span className="font-medium">{transaction?.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span className="font-medium">{transaction?.amount}</span>
                  </div>
                  {transaction?.recipient && (
                    <div className="flex justify-between">
                      <span>Recipient:</span>
                      <span className="font-medium">{transaction.recipient}</span>
                    </div>
                  )}
                  {transaction?.fee && (
                    <div className="flex justify-between">
                      <span>Fee:</span>
                      <span className="font-medium">{transaction.fee}</span>
                    </div>
                  )}
                  <div className="border-t border-border/50 pt-2 mt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Status:</span>
                      <Badge className="bg-green-500/20 text-green-300">Completed</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex space-x-2">
              <Button onClick={downloadReceipt} className="flex-1 gradient-primary">
                <Download className="w-4 h-4 mr-2" />
                Download Receipt
              </Button>
              <Button onClick={shareReceipt} variant="outline" className="flex-1">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
            
            <Button onClick={onClose} variant="outline" className="w-full">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Confirm Transaction
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        {transaction && (
          <div className="space-y-4">
            <Card className="bg-white/5 border-border/50">
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold">{transaction.type}</h3>
                    <p className="text-2xl font-bold text-primary">{transaction.amount}</p>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    {transaction.recipient && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">To:</span>
                        <span className="font-medium">{transaction.recipient}</span>
                      </div>
                    )}
                    {transaction.reference && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Reference:</span>
                        <span className="font-medium">{transaction.reference}</span>
                      </div>
                    )}
                    {transaction.fee && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fee:</span>
                        <span className="font-medium">{transaction.fee}</span>
                      </div>
                    )}
                    {transaction.total && (
                      <div className="border-t border-border/50 pt-2 mt-2">
                        <div className="flex justify-between font-semibold">
                          <span>Total:</span>
                          <span>{transaction.total}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-xs text-muted-foreground text-center">
              Please review the details above before confirming your transaction.
            </div>

            <div className="flex space-x-2">
              <Button onClick={onClose} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button onClick={onConfirm} className="flex-1 gradient-primary">
                Confirm Transaction
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
