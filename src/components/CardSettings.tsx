
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Settings, Snowflake, Banknote, Trash2, AlertTriangle } from 'lucide-react';
import { TransactionConfirmation } from '@/components/TransactionConfirmation';

interface CardSettingsProps {
  cardId: string;
  cardType: string;
  onSettingsChange: (settings: any) => void;
}

export const CardSettings = ({ cardId, cardType, onSettingsChange }: CardSettingsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('freeze');
  const [isFrozen, setIsFrozen] = useState(false);
  const [dailyLimit, setDailyLimit] = useState('50000');
  const [monthlyLimit, setMonthlyLimit] = useState('500000');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [transactionModal, setTransactionModal] = useState({
    isOpen: false,
    showSuccess: false,
    transaction: null as any
  });

  const handleFreezeCard = () => {
    setIsFrozen(!isFrozen);
    setTransactionModal({
      isOpen: true,
      showSuccess: false,
      transaction: {
        type: isFrozen ? 'Card Unfreeze' : 'Card Freeze',
        amount: 'No charge',
        recipient: `${cardType} Card`,
        fee: 'FREE',
        total: 'No charge'
      }
    });
  };

  const handleUpdateLimits = () => {
    setTransactionModal({
      isOpen: true,
      showSuccess: false,
      transaction: {
        type: 'Update Card Limits',
        amount: `Daily: MWK ${parseInt(dailyLimit).toLocaleString()}`,
        recipient: `Monthly: MWK ${parseInt(monthlyLimit).toLocaleString()}`,
        fee: 'FREE',
        total: 'No charge'
      }
    });
  };

  const handleDeleteCard = () => {
    setTransactionModal({
      isOpen: true,
      showSuccess: false,
      transaction: {
        type: 'Delete Card',
        amount: 'Permanent deletion',
        recipient: `${cardType} Card`,
        fee: 'FREE',
        total: 'No charge'
      }
    });
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
            <Settings className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Card Settings - {cardType}</DialogTitle>
          </DialogHeader>
          
          {/* Tab Navigation */}
          <div className="flex space-x-2 mb-6">
            <Button
              variant={activeTab === 'freeze' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('freeze')}
              className={activeTab === 'freeze' ? 'bg-green-600' : 'text-gray-300'}
            >
              <Snowflake className="w-4 h-4 mr-1" />
              Freeze
            </Button>
            <Button
              variant={activeTab === 'limits' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('limits')}
              className={activeTab === 'limits' ? 'bg-green-600' : 'text-gray-300'}
            >
              <Banknote className="w-4 h-4 mr-1" />
              Limits
            </Button>
            <Button
              variant={activeTab === 'delete' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('delete')}
              className={activeTab === 'delete' ? 'bg-red-600' : 'text-gray-300'}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>

          {/* Freeze Card Tab */}
          {activeTab === 'freeze' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                <div>
                  <h4 className="font-medium">Card Status</h4>
                  <p className="text-sm text-gray-400">
                    {isFrozen ? 'Your card is currently frozen' : 'Your card is active'}
                  </p>
                </div>
                <Switch
                  checked={isFrozen}
                  onCheckedChange={setIsFrozen}
                />
              </div>
              <p className="text-sm text-gray-400">
                Freezing your card will temporarily block all transactions. You can unfreeze it anytime.
              </p>
              <Button 
                onClick={handleFreezeCard}
                className={`w-full ${isFrozen ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                <Snowflake className="w-4 h-4 mr-2" />
                {isFrozen ? 'Unfreeze Card' : 'Freeze Card'}
              </Button>
            </div>
          )}

          {/* Card Limits Tab */}
          {activeTab === 'limits' && (
            <div className="space-y-4">
              <div>
                <Label className="text-gray-300">Daily Spending Limit (MWK)</Label>
                <Input
                  type="number"
                  value={dailyLimit}
                  onChange={(e) => setDailyLimit(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Monthly Spending Limit (MWK)</Label>
                <Input
                  type="number"
                  value={monthlyLimit}
                  onChange={(e) => setMonthlyLimit(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <p className="text-sm text-gray-400">
                Set spending limits to help manage your expenses. You can update these anytime.
              </p>
              <Button onClick={handleUpdateLimits} className="w-full bg-green-600 hover:bg-green-700">
                <Banknote className="w-4 h-4 mr-2" />
                Update Limits
              </Button>
            </div>
          )}

          {/* Delete Card Tab */}
          {activeTab === 'delete' && (
            <div className="space-y-4">
              <div className="bg-red-900/20 border border-red-500/20 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <h4 className="font-medium text-red-400">Danger Zone</h4>
                </div>
                <p className="text-sm text-gray-300">
                  Deleting your card is permanent and cannot be undone. Any remaining balance will be transferred to your main wallet.
                </p>
              </div>
              
              <div className="space-y-2">
                <h5 className="font-medium">Before you delete:</h5>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Ensure all pending transactions are complete</li>
                  <li>• Cancel any recurring payments linked to this card</li>
                  <li>• Download your transaction history if needed</li>
                </ul>
              </div>

              <Button 
                onClick={handleDeleteCard}
                variant="destructive" 
                className="w-full bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Card Permanently
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Transaction Confirmation Modal */}
      <TransactionConfirmation
        isOpen={transactionModal.isOpen}
        onClose={() => setTransactionModal({ isOpen: false, showSuccess: false, transaction: null })}
        onConfirm={() => {
          setTimeout(() => {
            setTransactionModal(prev => ({ ...prev, showSuccess: true }));
          }, 1000);
        }}
        onSuccess={() => setTransactionModal({ isOpen: false, showSuccess: false, transaction: null })}
        transaction={transactionModal.transaction}
        showSuccess={transactionModal.showSuccess}
      />
    </>
  );
};
