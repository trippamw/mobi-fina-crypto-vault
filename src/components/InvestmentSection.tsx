
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Plus, TrendingUp, Banknote, UserPlus, Settings, ArrowUpRight, ArrowDownLeft, MessageCircle, DollarSign, PiggyBank, Target } from 'lucide-react';
import { VillageBankChat } from '@/components/VillageBankChat';
import { TransactionConfirmation } from '@/components/TransactionConfirmation';

export const InvestmentSection = () => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [chatGroupId, setChatGroupId] = useState('');
  const [chatGroupName, setChatGroupName] = useState('');
  const [investments, setInvestments] = useState([
    {
      id: '1',
      name: 'Tech Stocks Portfolio',
      amount: 150000,
      returns: 12500,
      percentage: 8.33,
      duration: '6 months',
      status: 'Active'
    }
  ]);

  const [savingsGoals, setSavingsGoals] = useState([
    {
      id: '1',
      name: 'Emergency Fund',
      target: 500000,
      current: 275000,
      percentage: 55,
      deadline: '2024-12-31'
    }
  ]);

  const [villageBankGroups, setVillageBankGroups] = useState([
    {
      id: '1',
      name: 'Chilomoni Savings Group',
      members: 12,
      totalSavings: 850000,
      myContribution: 75000,
      interestRate: 15,
      status: 'Active',
      role: 'Member',
      duration: '12 months minimum'
    },
    {
      id: '2',
      name: 'Traders Union Fund',
      members: 25,
      totalSavings: 2100000,
      myContribution: 120000,
      interestRate: 18,
      status: 'Active',
      role: 'Admin',
      duration: '6 months minimum'
    }
  ]);

  const [transactionModal, setTransactionModal] = useState({
    isOpen: false,
    showSuccess: false,
    transaction: null as any
  });

  const [showNewInvestmentForm, setShowNewInvestmentForm] = useState(false);
  const [showNewGoalForm, setShowNewGoalForm] = useState(false);
  const [showNewGroupForm, setShowNewGroupForm] = useState(false);

  const handleStartInvestment = () => {
    setShowNewInvestmentForm(true);
  };

  const handleCreateInvestment = (formData: any) => {
    const newInvestment = {
      id: Date.now().toString(),
      name: formData.name,
      amount: parseInt(formData.amount),
      returns: 0,
      percentage: 0,
      duration: formData.duration,
      status: 'Active'
    };
    setInvestments([...investments, newInvestment]);
    setShowNewInvestmentForm(false);
    
    setTransactionModal({
      isOpen: true,
      showSuccess: false,
      transaction: {
        type: 'Investment Creation',
        amount: `MWK ${parseInt(formData.amount).toLocaleString()}`,
        recipient: formData.name,
        fee: 'MWK 500',
        total: `MWK ${(parseInt(formData.amount) + 500).toLocaleString()}`
      }
    });
  };

  const handleCreateSavingsGoal = (formData: any) => {
    const newGoal = {
      id: Date.now().toString(),
      name: formData.name,
      target: parseInt(formData.target),
      current: 0,
      percentage: 0,
      deadline: formData.deadline
    };
    setSavingsGoals([...savingsGoals, newGoal]);
    setShowNewGoalForm(false);
  };

  const handleCreateVillageBank = (formData: any) => {
    const newGroup = {
      id: Date.now().toString(),
      name: formData.name,
      members: 1,
      totalSavings: 0,
      myContribution: 0,
      interestRate: parseInt(formData.interestRate),
      status: 'Active',
      role: 'Admin',
      duration: formData.duration
    };
    setVillageBankGroups([...villageBankGroups, newGroup]);
    setShowNewGroupForm(false);
  };

  const handleRequestLoan = (groupId: string) => {
    setTransactionModal({
      isOpen: true,
      showSuccess: false,
      transaction: {
        type: 'Loan Request',
        amount: 'MWK 50,000',
        recipient: 'Village Bank Group',
        fee: 'MWK 500',
        total: 'MWK 50,500'
      }
    });
  };

  const handleContribute = (groupId: string) => {
    setTransactionModal({
      isOpen: true,
      showSuccess: false,
      transaction: {
        type: 'Group Contribution',
        amount: 'MWK 25,000',
        recipient: 'Village Bank Group',
        fee: 'FREE',
        total: 'MWK 25,000'
      }
    });
  };

  const confirmTransaction = () => {
    setTimeout(() => {
      setTransactionModal(prev => ({ ...prev, showSuccess: true }));
    }, 1000);
  };

  const closeTransactionModal = () => {
    setTransactionModal({
      isOpen: false,
      showSuccess: false,
      transaction: null
    });
  };

  const openChat = (groupId: string, groupName: string) => {
    setChatGroupId(groupId);
    setChatGroupName(groupName);
    setShowChat(true);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="investments" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="investments">Investments</TabsTrigger>
          <TabsTrigger value="savings">Savings Goals</TabsTrigger>
          <TabsTrigger value="village-bank">Village Bank</TabsTrigger>
        </TabsList>

        <TabsContent value="investments" className="space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <span>Investment Portfolio</span>
                </div>
                <Button onClick={handleStartInvestment} className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Start New Investment
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {investments.map((investment) => (
                  <div key={investment.id} className="p-4 rounded-lg bg-gray-700/50 border border-gray-600">
                    <h4 className="font-semibold text-white mb-2">{investment.name}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-gray-300">
                        <span>Invested:</span>
                        <span className="text-white">MWK {investment.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Returns:</span>
                        <span className="text-green-400">+MWK {investment.returns.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Duration:</span>
                        <span className="text-white">{investment.duration}</span>
                      </div>
                      <Badge className="bg-green-500/20 text-green-300">{investment.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>

              {showNewInvestmentForm && (
                <div className="mt-6 p-4 rounded-lg bg-gray-700/50 border border-gray-600">
                  <h4 className="font-semibold text-white mb-4">Create New Investment</h4>
                  <div className="space-y-4">
                    <Input placeholder="Investment Name" className="bg-gray-800 border-gray-600 text-white" id="inv-name" />
                    <Input placeholder="Amount (MWK)" type="number" className="bg-gray-800 border-gray-600 text-white" id="inv-amount" />
                    <Input placeholder="Duration (e.g., 12 months)" className="bg-gray-800 border-gray-600 text-white" id="inv-duration" />
                    <div className="flex space-x-2">
                      <Button onClick={() => {
                        const name = (document.getElementById('inv-name') as HTMLInputElement)?.value;
                        const amount = (document.getElementById('inv-amount') as HTMLInputElement)?.value;
                        const duration = (document.getElementById('inv-duration') as HTMLInputElement)?.value;
                        if (name && amount && duration) {
                          handleCreateInvestment({ name, amount, duration });
                        }
                      }} className="flex-1 bg-green-600 hover:bg-green-700">
                        Create Investment
                      </Button>
                      <Button onClick={() => setShowNewInvestmentForm(false)} variant="outline" className="flex-1">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="savings" className="space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-blue-400" />
                  <span>Savings Goals</span>
                </div>
                <Button onClick={() => setShowNewGoalForm(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  New Savings Goal
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savingsGoals.map((goal) => (
                  <div key={goal.id} className="p-4 rounded-lg bg-gray-700/50 border border-gray-600">
                    <h4 className="font-semibold text-white mb-2">{goal.name}</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm text-gray-300">
                        <span>Target:</span>
                        <span className="text-white">MWK {goal.target.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-300">
                        <span>Current:</span>
                        <span className="text-blue-400">MWK {goal.current.toLocaleString()}</span>
                      </div>
                      <Progress value={goal.percentage} className="h-2" />
                      <p className="text-xs text-gray-400">Deadline: {goal.deadline}</p>
                      <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                        Add Money
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {showNewGoalForm && (
                <div className="mt-6 p-4 rounded-lg bg-gray-700/50 border border-gray-600">
                  <h4 className="font-semibold text-white mb-4">Create New Savings Goal</h4>
                  <div className="space-y-4">
                    <Input placeholder="Goal Name" className="bg-gray-800 border-gray-600 text-white" id="goal-name" />
                    <Input placeholder="Target Amount (MWK)" type="number" className="bg-gray-800 border-gray-600 text-white" id="goal-target" />
                    <Input placeholder="Deadline (YYYY-MM-DD)" type="date" className="bg-gray-800 border-gray-600 text-white" id="goal-deadline" />
                    <div className="flex space-x-2">
                      <Button onClick={() => {
                        const name = (document.getElementById('goal-name') as HTMLInputElement)?.value;
                        const target = (document.getElementById('goal-target') as HTMLInputElement)?.value;
                        const deadline = (document.getElementById('goal-deadline') as HTMLInputElement)?.value;
                        if (name && target && deadline) {
                          handleCreateSavingsGoal({ name, target, deadline });
                        }
                      }} className="flex-1 bg-blue-600 hover:bg-blue-700">
                        Create Goal
                      </Button>
                      <Button onClick={() => setShowNewGoalForm(false)} variant="outline" className="flex-1">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="village-bank" className="space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-cyan-400" />
                  <span>My Village Bank Groups</span>
                </div>
                <Button onClick={() => setShowNewGroupForm(true)} className="bg-cyan-600 hover:bg-cyan-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Group
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {villageBankGroups.map((group) => (
                  <div key={group.id} className="p-4 rounded-lg bg-gray-700/50 border border-gray-600">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-white">{group.name}</h4>
                      <Badge 
                        className={group.role === 'Admin' ? 'bg-orange-500/20 text-orange-300' : 'bg-cyan-500/20 text-cyan-300'}
                      >
                        {group.role}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm text-gray-300">
                        <span>Members</span>
                        <span className="text-white">{group.members}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm text-gray-300">
                        <span>Total Savings</span>
                        <span className="font-semibold text-white">MWK {group.totalSavings.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm text-gray-300">
                        <span>My Contribution</span>
                        <span className="font-semibold text-cyan-400">MWK {group.myContribution.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm text-gray-300">
                        <span>Interest Rate</span>
                        <span className="text-green-400">{group.interestRate}% p.a.</span>
                      </div>

                      <Progress 
                        value={(group.myContribution / Math.max(group.totalSavings, 1)) * 100} 
                        className="h-2"
                      />
                      
                      <div className="flex space-x-2 mt-3">
                        <Button size="sm" onClick={() => handleContribute(group.id)} className="flex-1 bg-green-600 hover:bg-green-700">
                          Contribute
                        </Button>
                        <Button size="sm" onClick={() => handleRequestLoan(group.id)} className="flex-1 bg-yellow-600 hover:bg-yellow-700">
                          Request Loan
                        </Button>
                      </div>
                      
                      <Button 
                        size="sm" 
                        onClick={() => openChat(group.id, group.name)}
                        className="w-full bg-blue-600 hover:bg-blue-700 mt-2"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Chat
                      </Button>
                      
                      {group.role === 'Admin' && (
                        <Button size="sm" variant="outline" className="w-full mt-2 border-gray-600 text-gray-300">
                          <Settings className="w-4 h-4 mr-2" />
                          Admin Dashboard
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {showNewGroupForm && (
                <div className="mt-6 p-4 rounded-lg bg-gray-700/50 border border-gray-600">
                  <h4 className="font-semibold text-white mb-4">Create New Village Bank Group</h4>
                  <div className="space-y-4">
                    <Input placeholder="Group Name" className="bg-gray-800 border-gray-600 text-white" id="group-name" />
                    <Input placeholder="Interest Rate (%)" type="number" className="bg-gray-800 border-gray-600 text-white" id="group-rate" />
                    <Input placeholder="Minimum Duration" className="bg-gray-800 border-gray-600 text-white" id="group-duration" />
                    <div className="flex space-x-2">
                      <Button onClick={() => {
                        const name = (document.getElementById('group-name') as HTMLInputElement)?.value;
                        const interestRate = (document.getElementById('group-rate') as HTMLInputElement)?.value;
                        const duration = (document.getElementById('group-duration') as HTMLInputElement)?.value;
                        if (name && interestRate && duration) {
                          handleCreateVillageBank({ name, interestRate, duration });
                        }
                      }} className="flex-1 bg-cyan-600 hover:bg-cyan-700">
                        Create Group
                      </Button>
                      <Button onClick={() => setShowNewGroupForm(false)} variant="outline" className="flex-1">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {showChat && (
        <VillageBankChat
          groupId={chatGroupId}
          groupName={chatGroupName}
          onClose={() => setShowChat(false)}
        />
      )}

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
