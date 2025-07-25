
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, ArrowRight, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { TransactionConfirmation } from './TransactionConfirmation';
// Currency service removed - using simplified rates

interface AddMoneyToCardProps {
  card: {
    id: string;
    currency: string;
    balance: number;
    number: string;
  };
  wallets: Array<{
    currency: string;
    balance: number;
  }>;
  onAddMoney: (cardId: string, amount: number, fromCurrency: string, toCurrency: string, conversionFee?: number) => void;
  onClose: () => void;
  isOpen: boolean;
}

export const AddMoneyToCard: React.FC<AddMoneyToCardProps> = ({
  card,
  wallets,
  onAddMoney,
  onClose,
  isOpen
}) => {
  const { toast } = useToast();
  const [selectedWallet, setSelectedWallet] = useState('');
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [transactionData, setTransactionData] = useState(null);
  const [exchangeRate, setExchangeRate] = useState<number>(1);
  const [isLoadingRate, setIsLoadingRate] = useState(false);

  const calculateConversion = async () => {
    if (!selectedWallet || !amount) return null;
    
    const wallet = wallets.find(w => w.currency === selectedWallet);
    if (!wallet) return null;
    
    const inputAmount = parseFloat(amount);
    if (isNaN(inputAmount) || inputAmount <= 0) return null;
    
    setIsLoadingRate(true);
    
    try {
      // Use static exchange rates
      const exchangeRates: { [key: string]: number } = {
        USD: 1.0, EUR: 0.85, GBP: 0.73, MWK: 1635.50, ZAR: 18.45
      };
      const fromRate = exchangeRates[selectedWallet] || 1;
      const toRate = exchangeRates[card.currency] || 1;
      const liveExchangeRate = toRate / fromRate;
      
      setExchangeRate(liveExchangeRate);
      
      const convertedAmount = inputAmount * liveExchangeRate;
      // Increased conversion fee from 2.5% to 4.75% (90% increase)
      const conversionFee = selectedWallet !== card.currency ? inputAmount * 0.0475 : 0;
      const totalDeducted = inputAmount + conversionFee;
      
      setIsLoadingRate(false);
      
      return {
        inputAmount,
        convertedAmount,
        conversionFee,
        totalDeducted,
        exchangeRate: liveExchangeRate,
        hasSufficientFunds: wallet.balance >= totalDeducted
      };
    } catch (error) {
      console.error('Error calculating conversion:', error);
      setIsLoadingRate(false);
      return null;
    }
  };

  const [conversion, setConversion] = useState<any>(null);

  React.useEffect(() => {
    if (selectedWallet && amount) {
      calculateConversion().then(setConversion);
    } else {
      setConversion(null);
    }
  }, [selectedWallet, amount, card.currency]);

  const handleShowConfirmation = () => {
    if (!conversion || !conversion.hasSufficientFunds) {
      toast({
        title: "Error",
        description: "Insufficient funds or invalid amount",
        variant: "destructive"
      });
      return;
    }

    const transaction = {
      type: "Add Money to Card",
      amount: `${card.currency} ${conversion.convertedAmount.toFixed(2)}`,
      recipient: `Card ending in ${card.number.slice(-4)}`,
      reference: `From ${selectedWallet} wallet`,
      fee: selectedWallet !== card.currency ? `${selectedWallet} ${conversion.conversionFee.toFixed(2)}` : "No charge",
      total: `${selectedWallet} ${conversion.totalDeducted.toFixed(2)}`,
      hasFee: selectedWallet !== card.currency,
      returnTo: "Cards"
    };
    
    setTransactionData(transaction);
    setShowConfirmation(true);
  };

  const handleConfirmTransaction = async () => {
    if (!conversion) return;

    setIsProcessing(true);
    setShowConfirmation(false);
    
    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onAddMoney(
        card.id, 
        conversion.convertedAmount, 
        selectedWallet, 
        card.currency, 
        conversion.conversionFee
      );
      
      setShowSuccess(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add money to card. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    setAmount('');
    setSelectedWallet('');
    setConversion(null);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5" />
              <span>Add Money to Card</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Card Info */}
            <Card className="bg-gray-700/50 border-gray-600">
              <CardContent className="p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-300">Card</p>
                    <p className="font-medium">**** {card.number.slice(-4)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-300">Current Balance</p>
                    <p className="font-medium">{card.currency} {card.balance.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Select Wallet */}
            <div>
              <Label className="text-white mb-2 block">Select Wallet</Label>
              <Select value={selectedWallet} onValueChange={setSelectedWallet}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Choose wallet to transfer from" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {wallets.map((wallet) => (
                    <SelectItem key={wallet.currency} value={wallet.currency} className="text-white">
                      {wallet.currency} - Balance: {wallet.currency} {wallet.balance.toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Amount Input */}
            <div>
              <Label className="text-white mb-2 block">Amount</Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>

            {/* Conversion Details */}
            {(conversion || isLoadingRate) && (
              <Card className="bg-gray-700/30 border-gray-600/50">
                <CardContent className="p-3 space-y-2">
                  {isLoadingRate ? (
                    <div className="flex justify-center items-center py-4">
                      <div className="text-white">Loading live exchange rates...</div>
                    </div>
                  ) : conversion && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Amount to deduct:</span>
                        <span className="text-white">{selectedWallet} {conversion.inputAmount.toFixed(2)}</span>
                      </div>
                      
                      {selectedWallet !== card.currency && (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-300">Live exchange rate:</span>
                            <span className="text-white">1 {selectedWallet} = {conversion.exchangeRate.toFixed(6)} {card.currency}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-300">Conversion fee (4.75%):</span>
                            <span className="text-orange-400">{selectedWallet} {conversion.conversionFee.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm border-t border-gray-600 pt-2">
                            <span className="text-gray-300">Total deducted:</span>
                            <span className="text-white font-medium">{selectedWallet} {conversion.totalDeducted.toFixed(2)}</span>
                          </div>
                        </>
                      )}
                      
                      <div className="flex items-center justify-center py-2">
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Amount to receive:</span>
                        <span className="text-green-400 font-medium">{card.currency} {conversion.convertedAmount.toFixed(2)}</span>
                      </div>

                      {!conversion.hasSufficientFunds && (
                        <div className="flex items-center space-x-2 text-red-400 text-sm mt-2">
                          <AlertCircle className="w-4 h-4" />
                          <span>Insufficient funds in selected wallet</span>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-2">
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 bg-white text-gray-900 border-white hover:bg-gray-100"
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                onClick={handleShowConfirmation}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                disabled={!conversion || !conversion.hasSufficientFunds || isProcessing || isLoadingRate}
              >
                {isProcessing ? 'Processing...' : 'Add Money'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <TransactionConfirmation
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmTransaction}
        onSuccess={handleSuccessClose}
        transaction={transactionData}
        showSuccess={showSuccess}
      />
    </>
  );
};
