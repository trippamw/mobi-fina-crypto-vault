
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { PiggyBank, TrendingUp, Target, Plus, Sprout } from 'lucide-react';

export const InvestmentSection = () => {
  const investments = [
    {
      name: 'High Yield Savings',
      balance: 250000,
      target: 500000,
      apy: '12.5%',
      risk: 'Low',
      color: 'bg-green-500',
      minDuration: '30 days'
    },
    {
      name: 'Crypto Portfolio',
      balance: 150000,
      target: 300000,
      apy: '45.2%',
      risk: 'High',
      color: 'bg-yellow-500',
      minDuration: '30 days'
    },
    {
      name: 'Emergency Fund',
      balance: 75000,
      target: 200000,
      apy: '8.0%',
      risk: 'Low',
      color: 'bg-blue-500',
      minDuration: '30 days'
    },
    {
      name: 'Farmers Fund',
      balance: 180000,
      target: 400000,
      apy: '18.5%',
      risk: 'Medium',
      color: 'bg-green-600',
      minDuration: '90 days',
      description: 'Supporting local agriculture development'
    }
  ];

  const savingsGoals = [
    { 
      name: 'House Down Payment', 
      current: 1200000, 
      target: 5000000, 
      deadline: '2025-12-31',
      minDuration: '30 days'
    },
    { 
      name: 'New Car', 
      current: 800000, 
      target: 2500000, 
      deadline: '2024-06-30',
      minDuration: '30 days'
    },
    { 
      name: 'Vacation Fund', 
      current: 150000, 
      target: 500000, 
      deadline: '2024-03-15',
      minDuration: '30 days'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <Card className="gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-accent" />
            <span>Investment Portfolio</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-accent">MWK 655,000</p>
              <p className="text-sm text-muted-foreground">Total Invested</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">+MWK 155,000</p>
              <p className="text-sm text-muted-foreground">Total Returns</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">+28.9%</p>
              <p className="text-sm text-muted-foreground">Overall Growth</p>
            </div>
          </div>

          <div className="space-y-4">
            {investments.map((investment, index) => (
              <div key={index} className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {investment.name === 'Farmers Fund' && (
                      <Sprout className="w-5 h-5 text-green-400" />
                    )}
                    <div>
                      <h4 className="font-semibold">{investment.name}</h4>
                      {investment.description && (
                        <p className="text-xs text-muted-foreground">{investment.description}</p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        MWK {investment.balance.toLocaleString()} / MWK {investment.target.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="bg-green-500/20 text-green-300 mb-1">
                      {investment.apy}
                    </Badge>
                    <p className="text-xs text-muted-foreground">{investment.risk} Risk</p>
                    <p className="text-xs text-orange-400">Min: {investment.minDuration}</p>
                  </div>
                </div>
                <Progress 
                  value={(investment.balance / investment.target) * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </div>

          <Button className="w-full mt-4 gradient-secondary text-white">
            <Plus className="w-4 h-4 mr-2" />
            Start New Investment
          </Button>
        </CardContent>
      </Card>

      {/* Savings Goals */}
      <Card className="gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-primary" />
            <span>Savings Goals</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {savingsGoals.map((goal, index) => {
              const progress = (goal.current / goal.target) * 100;
              const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              
              return (
                <div key={index} className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{goal.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        MWK {goal.current.toLocaleString()} / MWK {goal.target.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">{progress.toFixed(1)}%</p>
                      <p className="text-xs text-muted-foreground">{daysLeft} days left</p>
                      <p className="text-xs text-orange-400">Min: {goal.minDuration}</p>
                    </div>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <div className="flex justify-between mt-2">
                    <Button variant="ghost" size="sm" className="text-xs">
                      Auto-Save
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs">
                      Add Funds
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <Button className="w-full mt-4 gradient-primary text-white">
            <PiggyBank className="w-4 h-4 mr-2" />
            Create New Goal
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
