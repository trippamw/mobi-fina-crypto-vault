import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { PiggyBank, Target, TrendingUp, Calendar, DollarSign, Plus, ArrowLeft } from 'lucide-react';

interface InvestmentSectionProps {
  onBalanceUpdate?: (currency: string, amount: number) => void;
  onTransactionUpdate?: (transaction: any) => void;
  onBack?: () => void;
}

export const InvestmentSection = ({ onBalanceUpdate, onTransactionUpdate, onBack }: InvestmentSectionProps) => {
  const [savingsGoals, setSavingsGoals] = useState([
    { id: 1, name: 'New Laptop', target: 500000, saved: 275000, deadline: '2024-12-31' },
    { id: 2, name: 'Vacation Fund', target: 1200000, saved: 600000, deadline: '2025-06-30' },
    { id: 3, name: 'Emergency Fund', target: 300000, saved: 300000, deadline: '2024-10-31' }
  ]);

  const investmentOptions = [
    { id: 'stocks', name: 'Stocks', description: 'Invest in leading companies', returns: '8-12%' },
    { id: 'bonds', name: 'Bonds', description: 'Low-risk government bonds', returns: '3-5%' },
    { id: 'crypto', name: 'Cryptocurrency', description: 'High-risk crypto investments', returns: 'Varies' },
    { id: 'realEstate', name: 'Real Estate', description: 'Invest in property', returns: '6-10%' }
  ];

  const handleDeposit = (goalId: number, amount: number) => {
    setSavingsGoals(prevGoals =>
      prevGoals.map(goal =>
        goal.id === goalId ? { ...goal, saved: Math.min(goal.target, goal.saved + amount) } : goal
      )
    );

    // Update balance
    if (onBalanceUpdate) {
      onBalanceUpdate('MWK', -amount);
    }

    // Add to transaction history
    if (onTransactionUpdate) {
      onTransactionUpdate({
        type: 'Investment',
        amount: `+MWK ${amount.toLocaleString()}`,
        description: `Deposit to savings goal`,
        time: 'Just now',
        status: 'completed'
      });
    }
  };

  return (
    <div className="space-y-6 pb-24">
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
          <h2 className="text-2xl font-bold text-white">Savings & Investment</h2>
        </div>
      )}

      {/* Savings Goals */}
      <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white">My Savings Goals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {savingsGoals.map((goal) => (
            <div key={goal.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-white">{goal.name}</h3>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30">
                  {((goal.saved / goal.target) * 100).toFixed(1)}%
                </Badge>
              </div>
              <Progress value={(goal.saved / goal.target) * 100} className="h-2" />
              <div className="flex items-center justify-between text-sm text-gray-300">
                <span>
                  <DollarSign className="w-4 h-4 inline-block mr-1" />
                  {goal.saved.toLocaleString()} / {goal.target.toLocaleString()} MWK
                </span>
                <span>
                  <Calendar className="w-4 h-4 inline-block mr-1" />
                  {goal.deadline}
                </span>
              </div>
              <Button 
                onClick={() => {
                  const depositAmount = parseInt(prompt('Enter amount to deposit:') || '0');
                  if (!isNaN(depositAmount) && depositAmount > 0) {
                    handleDeposit(goal.id, depositAmount);
                  }
                }}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold"
              >
                <Plus className="w-4 h-4 mr-2" />
                Deposit
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Investment Options */}
      <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white">Explore Investment Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {investmentOptions.map((option) => (
            <div key={option.id} className="p-4 rounded-lg border border-gray-600/50 bg-gray-800/40 hover:bg-gray-700/40 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-white">{option.name}</h3>
                  <p className="text-sm text-gray-300">{option.description}</p>
                </div>
                <div className="text-right">
                  <TrendingUp className="w-5 h-5 text-green-400 mx-auto" />
                  <p className="text-sm font-medium text-green-400">{option.returns}</p>
                </div>
              </div>
              <Button className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold">
                Invest Now
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
