
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Target, PiggyBank, TrendingUp, Plus, Minus } from 'lucide-react';
import { TransactionConfirmation } from './TransactionConfirmation';
import { useLanguage } from '@/utils/languageApi';

interface InvestmentSectionProps {
  onBalanceUpdate?: (currency: string, amount: number) => void;
  onTransactionUpdate?: (transaction: any) => void;
  onBack?: () => void;
}

export const InvestmentSection: React.FC<InvestmentSectionProps> = ({ onBalanceUpdate, onTransactionUpdate, onBack }) => {
  const { t } = useLanguage();
  const [selectedGoal, setSelectedGoal] = useState<any>(null);
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');
  const [actionAmount, setActionAmount] = useState('');
  const [showCreateGoal, setShowCreateGoal] = useState(false);
  const [transactionModal, setTransactionModal] = useState({
    isOpen: false,
    showSuccess: false,
    transaction: null as any
  });

  const [savingsGoals, setSavingsGoals] = useState([
    {
      id: 1,
      name: 'Emergency Fund',
      target: 50000,
      current: 32000,
      currency: 'MWK',
      progress: 64
    },
    {
      id: 2,
      name: 'House Down Payment',
      target: 200000,
      current: 85000,
      currency: 'MWK',
      progress: 42.5
    },
    {
      id: 3,
      name: 'Vacation Fund',
      target: 25000,
      current: 18500,
      currency: 'MWK',
      progress: 74
    }
  ]);

  const handleCreateGoal = () => {
    if (!newGoalName || !newGoalTarget) {
      alert('Please fill in all fields');
      return;
    }

    setTransactionModal({
      isOpen: true,
      showSuccess: false,
      transaction: {
        type: 'Create Savings Goal',
        amount: `Target: ${newGoalTarget} MWK`,
        recipient: newGoalName,
        reference: `GOAL${Date.now()}`,
        fee: '0.00 MWK',
        total: `Target: ${newGoalTarget} MWK`
      }
    });
  };

  const handleDepositToGoal = () => {
    if (!selectedGoal || !actionAmount) {
      alert('Please enter an amount');
      return;
    }

    const amount = parseFloat(actionAmount);
    const fee = amount * 0.005; // 0.5% fee
    const total = amount + fee;

    setTransactionModal({
      isOpen: true,
      showSuccess: false,
      transaction: {
        type: 'Savings Deposit',
        amount: `${amount} ${selectedGoal.currency}`,
        recipient: selectedGoal.name,
        reference: `SAV${Date.now()}`,
        fee: `${fee.toFixed(2)} ${selectedGoal.currency}`,
        total: `${total.toFixed(2)} ${selectedGoal.currency}`
      }
    });
  };

  const handleWithdrawFromGoal = () => {
    if (!selectedGoal || !actionAmount) {
      alert('Please enter an amount');
      return;
    }

    const amount = parseFloat(actionAmount);
    const fee = amount * 0.01; // 1% withdrawal fee
    const netAmount = amount - fee;

    setTransactionModal({
      isOpen: true,
      showSuccess: false,
      transaction: {
        type: 'Savings Withdrawal',
        amount: `${amount} ${selectedGoal.currency}`,
        recipient: selectedGoal.name,
        reference: `WTH${Date.now()}`,
        fee: `${fee.toFixed(2)} ${selectedGoal.currency}`,
        total: `${netAmount.toFixed(2)} ${selectedGoal.currency}`
      }
    });
  };

  const confirmTransaction = () => {
    if (transactionModal.transaction?.type === 'Create Savings Goal') {
      const newGoal = {
        id: Date.now(),
        name: newGoalName,
        target: parseFloat(newGoalTarget),
        current: 0,
        currency: 'MWK',
        progress: 0
      };
      setSavingsGoals(prev => [...prev, newGoal]);
      
      if (onTransactionUpdate) {
        onTransactionUpdate({
          type: 'Savings Goal Created',
          amount: `Target: ${newGoalTarget} MWK`,
          description: `Created savings goal: ${newGoalName}`,
          time: 'Just now',
          status: 'completed'
        });
      }

      setNewGoalName('');
      setNewGoalTarget('');
      setShowCreateGoal(false);
    } else if (transactionModal.transaction?.type === 'Savings Deposit') {
      const amount = parseFloat(actionAmount);
      const fee = amount * 0.005;
      const total = amount + fee;

      if (onBalanceUpdate) {
        onBalanceUpdate(selectedGoal.currency, -total);
      }

      setSavingsGoals(prev => prev.map(goal => {
        if (goal.id === selectedGoal.id) {
          const newCurrent = goal.current + amount;
          return {
            ...goal,
            current: newCurrent,
            progress: (newCurrent / goal.target) * 100
          };
        }
        return goal;
      }));

      if (onTransactionUpdate) {
        onTransactionUpdate({
          type: 'Savings Deposit',
          amount: `-${total.toFixed(2)} ${selectedGoal.currency}`,
          description: `Deposit to ${selectedGoal.name}`,
          time: 'Just now',
          status: 'completed'
        });
      }

      setActionAmount('');
    } else if (transactionModal.transaction?.type === 'Savings Withdrawal') {
      const amount = parseFloat(actionAmount);
      const fee = amount * 0.01;
      const netAmount = amount - fee;

      if (onBalanceUpdate) {
        onBalanceUpdate(selectedGoal.currency, netAmount);
      }

      setSavingsGoals(prev => prev.map(goal => {
        if (goal.id === selectedGoal.id) {
          const newCurrent = Math.max(0, goal.current - amount);
          return {
            ...goal,
            current: newCurrent,
            progress: (newCurrent / goal.target) * 100
          };
        }
        return goal;
      }));

      if (onTransactionUpdate) {
        onTransactionUpdate({
          type: 'Savings Withdrawal',
          amount: `+${netAmount.toFixed(2)} ${selectedGoal.currency}`,
          description: `Withdrawal from ${selectedGoal.name}`,
          time: 'Just now',
          status: 'completed'
        });
      }

      setActionAmount('');
    }

    setTransactionModal(prev => ({ ...prev, showSuccess: true }));
  };

  const closeTransactionModal = () => {
    setTransactionModal({
      isOpen: false,
      showSuccess: false,
      transaction: null
    });
  };

  return (
    <div className="space-y-6 pb-24">
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
          <h2 className="text-2xl font-bold text-white">{t('savings')} & {t('investment')}</h2>
        </div>
      )}

      {/* Create New Goal */}
      <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>{t('savingsGoals')}</span>
            </CardTitle>
            <Button
              onClick={() => setShowCreateGoal(!showCreateGoal)}
              size="sm"
              className="bg-blue-500 hover:bg-blue-600"
            >
              <Plus className="w-4 h-4 mr-1" />
              {t('createGoal')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showCreateGoal && (
            <div className="space-y-4 mb-6 p-4 bg-gray-800/60 rounded-lg border border-gray-600/50">
              <div>
                <label className="block text-sm font-medium text-white mb-2">{t('goalName')}</label>
                <Input
                  value={newGoalName}
                  onChange={(e) => setNewGoalName(e.target.value)}
                  placeholder="Enter goal name"
                  className="bg-gray-700/60 border-gray-600/50 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">{t('targetAmount')} (MWK)</label>
                <Input
                  type="number"
                  value={newGoalTarget}
                  onChange={(e) => setNewGoalTarget(e.target.value)}
                  placeholder="Enter target amount"
                  className="bg-gray-700/60 border-gray-600/50 text-white"
                />
              </div>
              <Button 
                onClick={handleCreateGoal}
                className="w-full bg-green-500 hover:bg-green-600"
                disabled={!newGoalName || !newGoalTarget}
              >
                {t('createGoal')}
              </Button>
            </div>
          )}

          <div className="grid gap-4">
            {savingsGoals.map((goal) => (
              <div
                key={goal.id}
                onClick={() => setSelectedGoal(goal)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedGoal?.id === goal.id
                    ? 'border-blue-500 bg-blue-500/20'
                    : 'border-gray-600/50 bg-gray-800/60 hover:bg-gray-700/60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-medium flex items-center space-x-2">
                    <PiggyBank className="w-4 h-4" />
                    <span>{goal.name}</span>
                  </h3>
                  <span className="text-green-400 font-semibold">
                    {goal.progress.toFixed(1)}%
                  </span>
                </div>
                <div className="space-y-2">
                  <Progress value={goal.progress} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">
                      {goal.current.toLocaleString()} {goal.currency}
                    </span>
                    <span className="text-gray-400">
                      Goal: {goal.target.toLocaleString()} {goal.currency}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedGoal && (
            <div className="mt-6 p-4 bg-gray-800/60 rounded-lg border border-gray-600/50">
              <h4 className="text-white font-medium mb-4">Manage "{selectedGoal.name}"</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">{t('amount')} ({selectedGoal.currency})</label>
                  <Input
                    type="number"
                    value={actionAmount}
                    onChange={(e) => setActionAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="bg-gray-700/60 border-gray-600/50 text-white"
                  />
                </div>
                <div className="flex space-x-4">
                  <Button
                    onClick={handleDepositToGoal}
                    className="flex-1 bg-green-500 hover:bg-green-600"
                    disabled={!actionAmount}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    {t('deposit')}
                  </Button>
                  <Button
                    onClick={handleWithdrawFromGoal}
                    className="flex-1 bg-red-500 hover:bg-red-600"
                    disabled={!actionAmount || parseFloat(actionAmount) > selectedGoal.current}
                  >
                    <Minus className="w-4 h-4 mr-1" />
                    {t('withdraw')}
                  </Button>
                </div>
                {actionAmount && (
                  <div className="bg-gray-700/60 p-3 rounded-lg text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-300">{t('amount')}:</span>
                      <span className="text-white">{actionAmount} {selectedGoal.currency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">{t('fee')}:</span>
                      <span className="text-white">
                        {(parseFloat(actionAmount) * 0.005).toFixed(2)} {selectedGoal.currency}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <TransactionConfirmation
        isOpen={transactionModal.isOpen}
        onClose={closeTransactionModal}
        onConfirm={confirmTransaction}
        onSuccess={closeTransactionModal}
        transaction={transactionModal.transaction}
        showSuccess={transactionModal.showSuccess}
      />
    </div>
  );
};
