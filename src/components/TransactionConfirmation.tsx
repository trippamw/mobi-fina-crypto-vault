
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
  hasFee?: boolean;
  returnTo?: string;
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
    const receiptData = `
NeoVault Digital Banking
========================
Malawi's Banking Revolution
========================

TRANSACTION RECEIPT

Date: ${new Date().toLocaleString()}
Reference: NV${Date.now()}

Transaction Details:
-------------------
Type: ${transaction?.type}
Amount: ${transaction?.amount}
${transaction?.recipient ? `To: ${transaction.recipient}` : ''}
${transaction?.reference ? `Reference: ${transaction.reference}` : ''}
${transaction?.fee && transaction?.fee !== 'FREE' ? `Fee: ${transaction.fee}` : ''}
${transaction?.total ? `Total: ${transaction.total}` : ''}

Status: COMPLETED ✓

========================
Thank you for choosing NeoVault
Customer Support: AI Chat Available 24/7
========================

This receipt serves as proof of your transaction.
Keep it for your records.
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
    const shareData = {
      title: 'NeoVault Transaction Receipt',
      text: `Transaction completed on NeoVault: ${transaction?.type} - ${transaction?.amount}`,
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      // Fallback sharing options
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareData.text)}`;
      const emailUrl = `mailto:?subject=${encodeURIComponent(shareData.title)}&body=${encodeURIComponent(shareData.text)}`;
      
      // Create share menu
      const shareOptions = [
        { name: 'WhatsApp', url: whatsappUrl },
        { name: 'Email', url: emailUrl },
        { name: 'SMS', url: `sms:?body=${encodeURIComponent(shareData.text)}` }
      ];

      // Simple share selection
      const choice = prompt('Share via: 1-WhatsApp, 2-Email, 3-SMS (enter number)');
      if (choice && shareOptions[parseInt(choice) - 1]) {
        window.open(shareOptions[parseInt(choice) - 1].url, '_blank');
      }
    }
  };

  const handleClose = () => {
    onClose();
    // Navigate back to appropriate section based on transaction type
    if (transaction?.returnTo) {
      // This would be handled by the parent component to change tabs
      console.log(`Navigate to: ${transaction.returnTo}`);
    }
  };

  // Check if transaction has fees (should show receipt options)
  const shouldShowReceiptOptions = transaction?.fee && transaction.fee !== 'FREE' && transaction.fee !== 'No charge';

  if (showSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white sm:max-w-md">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-400">Transaction Successful!</h3>
              <p className="text-gray-300">Your transaction has been completed successfully.</p>
            </div>
            
            <Card className="bg-gray-700/50 border-gray-600">
              <CardContent className="pt-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Type:</span>
                    <span className="font-medium text-white">{transaction?.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Amount:</span>
                    <span className="font-medium text-white">{transaction?.amount}</span>
                  </div>
                  {transaction?.recipient && (
                    <div className="flex justify-between">
                      <span className="text-gray-300">Recipient:</span>
                      <span className="font-medium text-white">{transaction.recipient}</span>
                    </div>
                  )}
                  {transaction?.fee && transaction.fee !== 'No charge' && (
                    <div className="flex justify-between">
                      <span className="text-gray-300">Fee:</span>
                      <span className="font-medium text-white">{transaction.fee}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-600 pt-2 mt-2">
                    <div className="flex justify-between font-semibold">
                      <span className="text-gray-300">Status:</span>
                      <Badge className="bg-green-500/20 text-green-300">Completed</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {shouldShowReceiptOptions && (
              <div className="flex space-x-2">
                <Button onClick={downloadReceipt} className="flex-1 bg-green-600 hover:bg-green-700">
                  <Download className="w-4 h-4 mr-2" />
                  Download Receipt
                </Button>
                <Button onClick={shareReceipt} variant="outline" className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            )}
            
            <Button onClick={handleClose} variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
              {transaction?.returnTo ? `Back to ${transaction.returnTo}` : 'Close'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-white">
            Confirm Transaction
            <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        {transaction && (
          <div className="space-y-4">
            <Card className="bg-gray-700/50 border-gray-600">
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-white">{transaction.type}</h3>
                    <p className="text-2xl font-bold text-green-400">{transaction.amount}</p>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    {transaction.recipient && (
                      <div className="flex justify-between">
                        <span className="text-gray-300">To:</span>
                        <span className="font-medium text-white">{transaction.recipient}</span>
                      </div>
                    )}
                    {transaction.reference && (
                      <div className="flex justify-between">
                        <span className="text-gray-300">Reference:</span>
                        <span className="font-medium text-white">{transaction.reference}</span>
                      </div>
                    )}
                    {transaction.fee && (
                      <div className="flex justify-between">
                        <span className="text-gray-300">Fee:</span>
                        <span className="font-medium text-white">{transaction.fee}</span>
                      </div>
                    )}
                    {transaction.total && (
                      <div className="border-t border-gray-600 pt-2 mt-2">
                        <div className="flex justify-between font-semibold">
                          <span className="text-gray-300">Total:</span>
                          <span className="text-white">{transaction.total}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-xs text-gray-400 text-center">
              Please review the details above before confirming your transaction.
            </div>

            <div className="flex space-x-2">
              <Button onClick={onClose} variant="outline" className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700">
                Cancel
              </Button>
              <Button onClick={onConfirm} className="flex-1 bg-green-600 hover:bg-green-700">
                Confirm Transaction
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
