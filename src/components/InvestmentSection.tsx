
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PiggyBank, Target, Calendar, DollarSign, Plus, ArrowLeft, Users, Trash2, AlertCircle } from 'lucide-react';
import { VillageBankSection } from './VillageBankSection';

interface InvestmentSectionProps {
  onBalanceUpdate?: (currency: string, amount: number) => void;
  onTransactionUpdate?: (transaction: any) => void;
  onBack?: () => void;
}

export const InvestmentSection = ({ onBalanceUpdate, onTransactionUpdate, onBack }: InvestmentSectionProps) => {
  const [activeTab, setActiveTab] = useState('savings');
  const [showCreateGoal, setShowCreateGoal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<number | null>(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [newGoal, setNewGoal] = useState({
    name: '',
    target: '',
    deadline: '',
    initialDeposit: ''
  });

  const [savingsGoals, setSavingsGoals] = useState([
    { 
      id: 1, 
      name: 'New Laptop', 
      target: 500000, 
      saved: 275000, 
      deadline: '2024-12-31',
      createdAt: '2024-01-15',
      isMatured: false
    },
    { 
      id: 2, 
      name: 'Vacation Fund', 
      target: 1200000, 
      saved: 600000, 
      deadline: '2025-06-30',
      createdAt: '2024-02-01',
      isMatured: false
    },
    { 
      id: 3, 
      name: 'Emergency Fund', 
      target: 300000, 
      saved: 300000, 
      deadline: '2024-10-31',
      createdAt: '2024-01-01',
      isMatured: true
    }
  ]);

  const handleCreateGoal = () => {
    const target = parseFloat(newGoal.target);
    const initialDeposit = parseFloat(newGoal.initialDeposit) || 0;
    const deadlineDate = new Date(newGoal.deadline);
    const today = new Date();
    const daysDifference = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 3600 * 24));

    if (daysDifference < 30) {
      alert('Savings goal duration must be at least 30 days');
      return;
    }

    if (target <= 0) {
      alert('Please enter a valid target amount');
      return;
    }

    const goal = {
      id: Date.now(),
      name: newGoal.name,
      target: target,
      saved: initialDeposit,
      deadline: newGoal.deadline,
      createdAt: new Date().toISOString().split('T')[0],
      isMatured: false
    };

    setSavingsGoals(prev => [...prev, goal]);

    if (initialDeposit > 0 && onBalanceUpdate) {
      onBalanceUpdate('MWK', -initialDeposit);
      if (onTransactionUpdate) {
        onTransactionUpdate({
          type: 'Savings Goal',
          amount: `-MWK ${initialDeposit.toLocaleString()}`,
          description: `Initial deposit to ${newGoal.name}`,
          time: 'Just now',
          status: 'completed'
        });
      }
    }

    setNewGoal({ name: '', target: '', deadline: '', initialDeposit: '' });
    setShowCreateGoal(false);
  };

  const handleDepositClick = (goalId: number) => {
    setSelectedGoalId(goalId);
    setShowDepositModal(true);
  };

  const confirmDeposit = () => {
    if (!selectedGoalId || !depositAmount) return;
    
    const amount = parseFloat(depositAmount);
    if (amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    // Platform fee (2% on deposits)
    const platformFee = amount * 0.02;
    const netAmount = amount - platformFee;

    setSavingsGoals(prevGoals =>
      prevGoals.map(goal =>
        goal.id === selectedGoalId ? { ...goal, saved: Math.min(goal.target, goal.saved + netAmount) } : goal
      )
    );

    if (onBalanceUpdate) {
      onBalanceUpdate('MWK', -amount);
    }

    if (onTransactionUpdate) {
      onTransactionUpdate({
        type: 'Savings Deposit',
        amount: `-MWK ${amount.toLocaleString()}`,
        description: `Deposit to savings goal (Fee: MWK ${platformFee.toLocaleString()})`,
        time: 'Just now',
        status: 'completed'
      });
    }

    setDepositAmount('');
    setShowDepositModal(false);
    setSelectedGoalId(null);
  };

  const handleWithdraw = (goalId: number) => {
    const goal = savingsGoals.find(g => g.id === goalId);
    if (!goal) return;

    const today = new Date();
    const deadline = new Date(goal.deadline);

    if (today < deadline && !goal.isMatured) {
      alert('You can only withdraw after the goal maturity date');
      return;
    }

    // Platform fee (1% on withdrawals)
    const platformFee = goal.saved * 0.01;
    const withdrawAmount = goal.saved - platformFee;
    
    setSavingsGoals(prev => prev.filter(g => g.id !== goalId));

    if (onBalanceUpdate) {
      onBalanceUpdate('MWK', withdrawAmount);
    }

    if (onTransactionUpdate) {
      onTransactionUpdate({
        type: 'Savings Withdrawal',
        amount: `+MWK ${withdrawAmount.toLocaleString()}`,
        description: `Withdrawal from ${goal.name} (Fee: MWK ${platformFee.toLocaleString()})`,
        time: 'Just now',
        status: 'completed'
      });
    }
  };

  const deleteGoal = (goalId: number) => {
    const goal = savingsGoals.find(g => g.id === goalId);
    if (!goal) return;

    const today = new Date();
    const deadline = new Date(goal.deadline);

    // Prevent deletion of active goals (not matured)
    if (today < deadline && !goal.isMatured) {
      alert('Cannot delete active savings goal. This is a commitment until maturity date.');
      return;
    }

    if (goal.saved > 0) {
      const platformFee = goal.saved * 0.005; // 0.5% deletion fee
      const refund = goal.saved - platformFee;
      if (onBalanceUpdate) {
        onBalanceUpdate('MWK', refund);
      }
      if (onTransactionUpdate) {
        onTransactionUpdate({
          type: 'Goal Deletion Refund',
          amount: `+MWK ${refund.toLocaleString()}`,
          description: `Refund from deleted goal: ${goal.name} (Fee: MWK ${platformFee.toLocaleString()})`,
          time: 'Just now',
          status: 'completed'
        });
      }
    }

    setSavingsGoals(prev => prev.filter(g => g.id !== goalId));
  };

  if (activeTab === 'village-bank') {
    return <VillageBankSection onBack={() => setActiveTab('savings')} onBalanceUpdate={onBalanceUpdate} onTransactionUpdate={onTransactionUpdate} />;
  }

  return (
    <div className="space-y-4 pb-24">
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
          <h2 className="text-lg sm:text-2xl font-bold text-white">Save & Invest</h2>
        </div>
      )}

      {/* Tab Navigation - Mobile Optimized */}
      <div className="flex space-x-1 bg-gray-800/50 p-1 rounded-lg">
        <Button
          onClick={() => setActiveTab('savings')}
          className={`flex-1 text-xs sm:text-sm ${activeTab === 'savings' 
            ? 'bg-blue-500 text-white' 
            : 'bg-transparent text-gray-300 hover:text-white'
          }`}
        >
          <PiggyBank className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          Savings Goals
        </Button>
        <Button
          onClick={() => setActiveTab('village-bank')}
          className={`flex-1 text-xs sm:text-sm ${activeTab === 'village-bank' 
            ? 'bg-blue-500 text-white' 
            : 'bg-transparent text-gray-300 hover:text-white'
          }`}
        >
          <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          Village Bank
        </Button>
      </div>

      {/* Savings Goals */}
      <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-sm sm:text-base">
            <span className="text-white">My Savings Goals</span>
            <Button 
              onClick={() => setShowCreateGoal(true)}
              size="sm"
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-xs"
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Create
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {savingsGoals.map((goal) => {
            const today = new Date();
            const deadline = new Date(goal.deadline);
            const isMatured = today >= deadline || goal.saved >= goal.target;
            const progress = (goal.saved / goal.target) * 100;
            const canDelete = isMatured;

            return (
              <div key={goal.id} className="p-3 sm:p-4 rounded-lg bg-gray-800/50 border border-gray-600/30">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm sm:text-lg font-medium text-white truncate">{goal.name}</h3>
                  <div className="flex items-center space-x-2">
                    <Badge className={`text-xs ${isMatured ? 'bg-green-500/20 text-green-300' : 'bg-blue-500/20 text-blue-300'} border-current/30`}>
                      {progress.toFixed(1)}%
                    </Badge>
                    {canDelete && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteGoal(goal.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                    {!canDelete && (
                      <AlertCircle className="w-3 h-3 text-yellow-400" aria-label="Cannot delete active goal" />
                    )}
                  </div>
                </div>
                
                <Progress value={progress} className="h-2 mb-2" />
                
                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div>
                    <p className="text-gray-300">Saved</p>
                    <p className="text-white font-semibold">MWK {goal.saved.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-300">Target</p>
                    <p className="text-white font-semibold">MWK {goal.target.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-300">Deadline</p>
                    <p className="text-white text-xs">{goal.deadline}</p>
                  </div>
                  <div>
                    <p className="text-gray-300">Status</p>
                    <p className={`font-medium text-xs ${isMatured ? 'text-green-400' : 'text-yellow-400'}`}>
                      {isMatured ? 'Matured' : 'Active'}
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  {!isMatured && (
                    <Button 
                      onClick={() => handleDepositClick(goal.id)}
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-xs"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Deposit
                    </Button>
                  )}
                  {isMatured && (
                    <Button 
                      onClick={() => handleWithdraw(goal.id)}
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-xs"
                    >
                      <DollarSign className="w-3 h-3 mr-1" />
                      Withdraw
                    </Button>
                  )}
                </div>
              </div>
            );
          })}

          {savingsGoals.length === 0 && (
            <div className="text-center py-6">
              <PiggyBank className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No savings goals yet. Create your first goal!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Goal Modal */}
      <Dialog open={showCreateGoal} onOpenChange={setShowCreateGoal}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-sm sm:text-base">Create Savings Goal</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium mb-1 block text-gray-300">Goal Name</label>
              <Input
                value={newGoal.name}
                onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                placeholder="e.g. Emergency Fund"
                className="bg-gray-700/50 border-gray-600/50 text-white text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block text-gray-300">Target Amount (MWK)</label>
              <Input
                type="number"
                value={newGoal.target}
                onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                placeholder="500000"
                className="bg-gray-700/50 border-gray-600/50 text-white text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block text-gray-300">Deadline (Minimum 30 days)</label>
              <Input
                type="date"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                min={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                className="bg-gray-700/50 border-gray-600/50 text-white text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block text-gray-300">Initial Deposit (Optional)</label>
              <Input
                type="number"
                value={newGoal.initialDeposit}
                onChange={(e) => setNewGoal({ ...newGoal, initialDeposit: e.target.value })}
                placeholder="0"
                className="bg-gray-700/50 border-gray-600/50 text-white text-sm"
              />
            </div>
            <div className="bg-yellow-500/10 p-2 rounded border border-yellow-500/20">
              <p className="text-yellow-300 text-xs">Platform fee: 2% on deposits, 1% on withdrawals</p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowCreateGoal(false)}
                className="flex-1 border-gray-600 text-gray-300 hover:text-white text-xs"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateGoal}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-xs"
              >
                Create Goal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Deposit Modal */}
      <Dialog open={showDepositModal} onOpenChange={setShowDepositModal}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-sm sm:text-base">Deposit to Savings Goal</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium mb-1 block text-gray-300">Deposit Amount (MWK)</label>
              <Input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="Enter amount"
                className="bg-gray-700/50 border-gray-600/50 text-white text-sm"
              />
            </div>
            {depositAmount && (
              <div className="bg-blue-500/10 p-2 rounded border border-blue-500/20">
                <p className="text-blue-300 text-xs">
                  Platform fee: MWK {(parseFloat(depositAmount) * 0.02).toLocaleString()}<br/>
                  Net deposit: MWK {(parseFloat(depositAmount) * 0.98).toLocaleString()}
                </p>
              </div>
            )}
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowDepositModal(false)}
                className="flex-1 border-gray-600 text-gray-300 hover:text-white text-xs"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDeposit}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-xs"
              >
                Confirm Deposit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
