import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { PiggyBank, TrendingUp, Target, Plus, Sprout, Users, MessageCircle, UserPlus, Coins, CreditCard } from 'lucide-react';
import { VillageBankChat } from '@/components/VillageBankChat';
import { TransactionConfirmation } from '@/components/TransactionConfirmation';

interface Investment {
  id: string;
  name: string;
  balance: number;
  target: number;
  apy: string;
  risk: string;
  color: string;
  minDuration: string;
  description?: string;
}

interface SavingsGoal {
  id: string;
  name: string;
  current: number;
  target: number;
  deadline: string;
  minDuration: string;
}

interface VillageGroup {
  id: string;
  name: string;
  members: Member[];
  totalSavings: number;
  myContribution: number;
  interestRate: number;
  status: string;
  role: string;
  duration: string;
  loans: Loan[];
  createdAt: string;
}

interface Member {
  id: string;
  name: string;
  contribution: number;
  loansReceived: number;
  interestEarned: number;
  joinDate: string;
}

interface Loan {
  id: string;
  borrowerId: string;
  borrowerName: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'repaid';
  requestDate: string;
  approvalDate?: string;
  dueDate?: string;
  interestRate: number;
}

export const InvestmentSection = () => {
  const [investments, setInvestments] = useState<Investment[]>([
    {
      id: '1',
      name: 'High Yield Savings',
      balance: 250000,
      target: 500000,
      apy: '12.5%',
      risk: 'Low',
      color: 'bg-green-500',
      minDuration: '30 days'
    },
    {
      id: '2',
      name: 'Crypto Portfolio',
      balance: 150000,
      target: 300000,
      apy: '45.2%',
      risk: 'High',
      color: 'bg-yellow-500',
      minDuration: '30 days'
    }
  ]);

  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([
    { 
      id: '1',
      name: 'House Down Payment', 
      current: 1200000, 
      target: 5000000, 
      deadline: '2025-12-31',
      minDuration: '30 days'
    },
    { 
      id: '2',
      name: 'New Car', 
      current: 800000, 
      target: 2500000, 
      deadline: '2024-06-30',
      minDuration: '30 days'
    }
  ]);

  const [villageGroups, setVillageGroups] = useState<VillageGroup[]>([
    {
      id: '1',
      name: 'Chilomoni Investment Group',
      members: [
        { id: '1', name: 'John Banda', contribution: 75000, loansReceived: 0, interestEarned: 5200, joinDate: '2024-01-15' },
        { id: '2', name: 'Mary Phiri', contribution: 85000, loansReceived: 25000, interestEarned: 4800, joinDate: '2024-01-20' }
      ],
      totalSavings: 850000,
      myContribution: 75000,
      interestRate: 15,
      status: 'Active',
      role: 'Admin',
      duration: '12 months minimum',
      loans: [
        {
          id: '1',
          borrowerId: '2',
          borrowerName: 'Mary Phiri',
          amount: 25000,
          status: 'approved',
          requestDate: '2024-06-01',
          approvalDate: '2024-06-02',
          dueDate: '2024-09-02',
          interestRate: 15
        }
      ],
      createdAt: '2024-01-15'
    }
  ]);

  const [showNewInvestment, setShowNewInvestment] = useState(false);
  const [showNewGoal, setShowNewGoal] = useState(false);
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [showChat, setShowChat] = useState<string | null>(null);
  const [transactionModal, setTransactionModal] = useState({
    isOpen: false,
    showSuccess: false,
    transaction: null as any
  });

  const [newInvestment, setNewInvestment] = useState({
    name: '',
    target: '',
    apy: '',
    risk: 'Low',
    duration: '30 days'
  });

  const [newGoal, setNewGoal] = useState({
    name: '',
    target: '',
    deadline: '',
    duration: '30 days'
  });

  const [newGroup, setNewGroup] = useState({
    name: '',
    interestRate: '',
    description: '',
    minContribution: '',
    maxMembers: '',
    duration: '30 days'
  });

  const handleCreateInvestment = () => {
    if (!newInvestment.name || !newInvestment.target || !newInvestment.apy) return;

    const investment: Investment = {
      id: Date.now().toString(),
      name: newInvestment.name,
      balance: 0,
      target: parseFloat(newInvestment.target),
      apy: newInvestment.apy + '%',
      risk: newInvestment.risk,
      color: 'bg-blue-500',
      minDuration: newInvestment.duration
    };

    setInvestments([...investments, investment]);
    setNewInvestment({ name: '', target: '', apy: '', risk: 'Low', duration: '30 days' });
    setShowNewInvestment(false);
  };

  const handleCreateGoal = () => {
    if (!newGoal.name || !newGoal.target || !newGoal.deadline) return;

    const goal: SavingsGoal = {
      id: Date.now().toString(),
      name: newGoal.name,
      current: 0,
      target: parseFloat(newGoal.target),
      deadline: newGoal.deadline,
      minDuration: newGoal.duration
    };

    setSavingsGoals([...savingsGoals, goal]);
    setNewGoal({ name: '', target: '', deadline: '', duration: '30 days' });
    setShowNewGoal(false);
  };

  const handleCreateGroup = () => {
    if (!newGroup.name || !newGroup.interestRate) return;

    const group: VillageGroup = {
      id: Date.now().toString(),
      name: newGroup.name,
      members: [],
      totalSavings: 0,
      myContribution: 0,
      interestRate: parseFloat(newGroup.interestRate),
      status: 'Active',
      role: 'Admin',
      duration: newGroup.duration,
      loans: [],
      createdAt: new Date().toISOString()
    };

    setVillageGroups([...villageGroups, group]);
    setNewGroup({ name: '', interestRate: '', description: '', minContribution: '', maxMembers: '', duration: '30 days' });
    setShowNewGroup(false);
  };

  const handleContribution = (groupId: string, amount: number) => {
    setTransactionModal({
      isOpen: true,
      showSuccess: false,
      transaction: {
        type: 'Village Bank Contribution',
        amount: `MWK ${amount.toLocaleString()}`,
        recipient: villageGroups.find(g => g.id === groupId)?.name,
        fee: 'MWK 100',
        total: `MWK ${(amount + 100).toLocaleString()}`
      }
    });
  };

  const handleLoanRequest = (groupId: string, amount: number) => {
    setTransactionModal({
      isOpen: true,
      showSuccess: false,
      transaction: {
        type: 'Loan Request',
        amount: `MWK ${amount.toLocaleString()}`,
        recipient: villageGroups.find(g => g.id === groupId)?.name,
        fee: 'FREE',
        total: `MWK ${amount.toLocaleString()}`
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span>Investment Portfolio</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">MWK 655,000</p>
              <p className="text-sm text-gray-400">Total Invested</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">+MWK 155,000</p>
              <p className="text-sm text-gray-400">Total Returns</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">+28.9%</p>
              <p className="text-sm text-gray-400">Overall Growth</p>
            </div>
          </div>

          <div className="space-y-4">
            {investments.map((investment, index) => (
              <div key={index} className="p-4 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors">
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div>
                      <h4 className="font-semibold text-white">{investment.name}</h4>
                      <p className="text-sm text-gray-400">
                        MWK {investment.balance.toLocaleString()} / MWK {investment.target.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-500/20 text-green-300 mb-1">
                      {investment.apy}
                    </Badge>
                    <p className="text-xs text-gray-400">{investment.risk} Risk</p>
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

          <Dialog open={showNewInvestment} onOpenChange={setShowNewInvestment}>
            <DialogTrigger asChild>
              <Button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Start New Investment
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700 text-white">
              <DialogHeader>
                <DialogTitle>Create New Investment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-300">Investment Name</Label>
                  <Input
                    value={newInvestment.name}
                    onChange={(e) => setNewInvestment({...newInvestment, name: e.target.value})}
                    placeholder="e.g. Tech Stocks"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Target Amount (MWK)</Label>
                  <Input
                    type="number"
                    value={newInvestment.target}
                    onChange={(e) => setNewInvestment({...newInvestment, target: e.target.value})}
                    placeholder="500000"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Expected APY (%)</Label>
                  <Input
                    type="number"
                    value={newInvestment.apy}
                    onChange={(e) => setNewInvestment({...newInvestment, apy: e.target.value})}
                    placeholder="12.5"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Risk Level</Label>
                  <Select value={newInvestment.risk} onValueChange={(value) => setNewInvestment({...newInvestment, risk: value})}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleCreateInvestment} className="w-full bg-green-600 hover:bg-green-700">
                  Create Investment
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Savings Goals */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Target className="w-5 h-5 text-green-400" />
            <span>Savings Goals</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {savingsGoals.map((goal, index) => {
              const progress = (goal.current / goal.target) * 100;
              const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              
              return (
                <div key={index} className="p-4 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-white">{goal.name}</h4>
                      <p className="text-sm text-gray-400">
                        MWK {goal.current.toLocaleString()} / MWK {goal.target.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-400">{progress.toFixed(1)}%</p>
                      <p className="text-xs text-gray-400">{daysLeft} days left</p>
                    </div>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <div className="flex justify-between mt-2">
                    <Button variant="ghost" size="sm" className="text-xs text-gray-300">
                      Auto-Save
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs text-gray-300">
                      Add Funds
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <Dialog open={showNewGoal} onOpenChange={setShowNewGoal}>
            <DialogTrigger asChild>
              <Button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white">
                <PiggyBank className="w-4 h-4 mr-2" />
                Create New Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700 text-white">
              <DialogHeader>
                <DialogTitle>Create Savings Goal</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-300">Goal Name</Label>
                  <Input
                    value={newGoal.name}
                    onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                    placeholder="e.g. Emergency Fund"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Target Amount (MWK)</Label>
                  <Input
                    type="number"
                    value={newGoal.target}
                    onChange={(e) => setNewGoal({...newGoal, target: e.target.value})}
                    placeholder="1000000"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Target Date</Label>
                  <Input
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <Button onClick={handleCreateGoal} className="w-full bg-green-600 hover:bg-green-700">
                  Create Goal
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Village Bank Groups */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-white">
              <Users className="w-5 h-5 text-green-400" />
              <span>Investment Groups</span>
            </div>
            <Dialog open={showNewGroup} onOpenChange={setShowNewGroup}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Group
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 border-gray-700 text-white">
                <DialogHeader>
                  <DialogTitle>Create Investment Group</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-300">Group Name</Label>
                    <Input
                      value={newGroup.name}
                      onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                      placeholder="Enter group name"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Interest Rate (%)</Label>
                    <Input
                      type="number"
                      value={newGroup.interestRate}
                      onChange={(e) => setNewGroup({...newGroup, interestRate: e.target.value})}
                      placeholder="15"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Minimum Duration</Label>
                    <Select value={newGroup.duration} onValueChange={(value) => setNewGroup({...newGroup, duration: value})}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="30 days">30 days</SelectItem>
                        <SelectItem value="90 days">90 days</SelectItem>
                        <SelectItem value="180 days">6 months</SelectItem>
                        <SelectItem value="365 days">12 months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleCreateGroup} className="w-full bg-green-600 hover:bg-green-700">
                    Create Group
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {villageGroups.map((group) => (
              <div key={group.id} className="p-4 rounded-lg bg-gray-700/50 border border-gray-600">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-white">{group.name}</h4>
                  <Badge className={group.role === 'Admin' ? 'bg-green-500/20 text-green-300' : 'bg-blue-500/20 text-blue-300'}>
                    {group.role}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-300">
                    <span>Members</span>
                    <span>{group.members.length}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Total Savings</span>
                    <span className="font-semibold">MWK {group.totalSavings.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>My Contribution</span>
                    <span className="font-semibold text-green-400">MWK {group.myContribution.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Interest Rate</span>
                    <span className="text-green-400">{group.interestRate}% p.a.</span>
                  </div>
                </div>
                
                <div className="flex space-x-2 mt-4">
                  <Button 
                    size="sm" 
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleContribution(group.id, 50000)}
                  >
                    <Coins className="w-4 h-4 mr-1" />
                    Contribute
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => handleLoanRequest(group.id, 100000)}
                  >
                    <CreditCard className="w-4 h-4 mr-1" />
                    Request Loan
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    onClick={() => setShowChat(group.id)}
                  >
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                </div>

                {/* Member Details */}
                <div className="mt-4 space-y-2">
                  <h5 className="text-sm font-medium text-white">Members</h5>
                  {group.members.map((member) => (
                    <div key={member.id} className="flex justify-between items-center text-xs bg-gray-600/30 p-2 rounded">
                      <span className="text-gray-300">{member.name}</span>
                      <div className="text-right">
                        <div className="text-green-400">MWK {member.contribution.toLocaleString()}</div>
                        {member.loansReceived > 0 && (
                          <div className="text-red-400">Loan: MWK {member.loansReceived.toLocaleString()}</div>
                        )}
                        <div className="text-blue-400">Interest: MWK {member.interestEarned.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Modal */}
      {showChat && (
        <VillageBankChat
          groupId={showChat}
          groupName={villageGroups.find(g => g.id === showChat)?.name || ''}
          onClose={() => setShowChat(null)}
        />
      )}

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
    </div>
  );
};
