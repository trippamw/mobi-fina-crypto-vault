
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Plus, UserPlus, Settings, MessageCircle, Target, ArrowLeft } from 'lucide-react';
import { VillageBankChat } from '@/components/VillageBankChat';
import { TransactionConfirmation } from '@/components/TransactionConfirmation';

interface InvestmentSectionProps {
  onBalanceUpdate?: (currency: string, amount: number) => void;
}

export const InvestmentSection: React.FC<InvestmentSectionProps> = ({ onBalanceUpdate }) => {
  const [showChat, setShowChat] = useState(false);
  const [chatGroupId, setChatGroupId] = useState('');
  const [chatGroupName, setChatGroupName] = useState('');
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);

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
      duration: '12 months minimum',
      membersList: [
        { name: 'John Banda', contribution: 85000, loans: 0 },
        { name: 'Mary Phiri', contribution: 65000, loans: 25000 },
        { name: 'Peter Mwale', contribution: 75000, loans: 0 },
        { name: 'Grace Tembo', contribution: 95000, loans: 15000 }
      ],
      pendingLoans: [
        { member: 'David Chirwa', amount: 30000, purpose: 'Business expansion' }
      ]
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
      duration: '6 months minimum',
      membersList: [
        { name: 'James Kadzuwa', contribution: 150000, loans: 45000 },
        { name: 'Ruth Mvula', contribution: 130000, loans: 0 },
        { name: 'Samuel Nyirenda', contribution: 120000, loans: 20000 }
      ],
      pendingLoans: [
        { member: 'Alice Mbewe', amount: 50000, purpose: 'School fees' },
        { member: 'Joseph Zulu', amount: 25000, purpose: 'Medical bills' }
      ]
    }
  ]);

  const [transactionModal, setTransactionModal] = useState({
    isOpen: false,
    showSuccess: false,
    transaction: null as any
  });

  const [showNewGoalForm, setShowNewGoalForm] = useState(false);
  const [showNewGroupForm, setShowNewGroupForm] = useState(false);
  const [showAddMoneyForm, setShowAddMoneyForm] = useState<string | null>(null);
  const [showContributeForm, setShowContributeForm] = useState<string | null>(null);
  const [showLoanForm, setShowLoanForm] = useState<string | null>(null);

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

  const handleAddMoney = (goalId: string, amount: number) => {
    setSavingsGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        const newCurrent = goal.current + amount;
        return {
          ...goal,
          current: newCurrent,
          percentage: Math.round((newCurrent / goal.target) * 100)
        };
      }
      return goal;
    }));

    if (onBalanceUpdate) {
      onBalanceUpdate('MWK', -amount);
    }

    setShowAddMoneyForm(null);
    alert(`Successfully added MWK ${amount.toLocaleString()} to your savings goal!`);
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
      duration: formData.duration,
      membersList: [],
      pendingLoans: []
    };
    setVillageBankGroups([...villageBankGroups, newGroup]);
    setShowNewGroupForm(false);
  };

  const handleContribute = (groupId: string, amount: number) => {
    setVillageBankGroups(prev => prev.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          myContribution: group.myContribution + amount,
          totalSavings: group.totalSavings + amount
        };
      }
      return group;
    }));

    if (onBalanceUpdate) {
      onBalanceUpdate('MWK', -amount);
    }

    setShowContributeForm(null);
    alert(`Successfully contributed MWK ${amount.toLocaleString()} to the group!`);
  };

  const handleRequestLoan = (groupId: string, amount: number) => {
    setTransactionModal({
      isOpen: true,
      showSuccess: false,
      transaction: {
        type: 'Loan Request',
        amount: `MWK ${amount.toLocaleString()}`,
        recipient: 'Village Bank Group',
        fee: 'MWK 500',
        total: `MWK ${(amount + 500).toLocaleString()}`
      }
    });
    setShowLoanForm(null);
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

  const openAdminDashboard = (group: any) => {
    setSelectedGroup(group);
    setShowAdminDashboard(true);
  };

  const approveLoan = (groupId: string, memberName: string) => {
    alert(`Loan approved for ${memberName}`);
  };

  const addMember = (groupId: string) => {
    alert('Member invitation sent');
  };

  if (showAdminDashboard && selectedGroup) {
    return (
      <div className="space-y-6 pb-24">
        <div className="flex items-center space-x-4 mb-6">
          <Button
            onClick={() => setShowAdminDashboard(false)}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h2 className="text-2xl font-bold text-white">{selectedGroup.name} - Admin Dashboard</h2>
        </div>

        {/* Group Overview */}
        <Card className="bg-gray-900/50 backdrop-blur-md border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Group Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{selectedGroup.members}</p>
                <p className="text-sm text-white/60">Members</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">MWK {selectedGroup.totalSavings.toLocaleString()}</p>
                <p className="text-sm text-white/60">Total Savings</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-400">{selectedGroup.interestRate}%</p>
                <p className="text-sm text-white/60">Interest Rate</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-400">{selectedGroup.pendingLoans.length}</p>
                <p className="text-sm text-white/60">Pending Loans</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Members List */}
        <Card className="bg-gray-900/50 backdrop-blur-md border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-white">
              <span>Members & Contributions</span>
              <Button onClick={() => addMember(selectedGroup.id)} className="bg-blue-600 hover:bg-blue-700">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Member
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedGroup.membersList.map((member: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
                  <div>
                    <p className="font-medium text-white">{member.name}</p>
                    <p className="text-sm text-white/60">Contribution: MWK {member.contribution.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white">Loans: MWK {member.loans.toLocaleString()}</p>
                    <Badge className={member.loans > 0 ? 'bg-yellow-500/20 text-yellow-300' : 'bg-green-500/20 text-green-300'}>
                      {member.loans > 0 ? 'Has Loan' : 'No Loan'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Loans */}
        <Card className="bg-gray-900/50 backdrop-blur-md border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Pending Loan Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedGroup.pendingLoans.map((loan: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
                  <div>
                    <p className="font-medium text-white">{loan.member}</p>
                    <p className="text-sm text-white/60">{loan.purpose}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <p className="text-white font-medium">MWK {loan.amount.toLocaleString()}</p>
                    <Button
                      onClick={() => approveLoan(selectedGroup.id, loan.member)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Approve
                    </Button>
                    <Button size="sm" variant="outline" className="border-red-500 text-red-400 hover:bg-red-500/20">
                      Decline
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      <Tabs defaultValue="savings" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-900/50 border-white/10">
          <TabsTrigger value="savings" className="text-white data-[state=active]:bg-white/20">Savings Goals</TabsTrigger>
          <TabsTrigger value="village-bank" className="text-blue-400 data-[state=active]:bg-blue-500/20">Village Bank</TabsTrigger>
        </TabsList>

        <TabsContent value="savings" className="space-y-4">
          {showNewGoalForm && (
            <Card className="bg-gray-900/50 backdrop-blur-md border-white/10 mb-6">
              <CardHeader>
                <CardTitle className="text-white">Create New Savings Goal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Goal Name (e.g., New Car)" className="bg-gray-800/50 border-white/20 text-white placeholder-white/60" id="goal-name" />
                <Input placeholder="Target Amount (MWK)" type="number" className="bg-gray-800/50 border-white/20 text-white placeholder-white/60" id="goal-target" />
                <Input placeholder="Deadline" type="date" className="bg-gray-800/50 border-white/20 text-white placeholder-white/60" id="goal-deadline" />
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
                  <Button onClick={() => setShowNewGoalForm(false)} variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10">
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="bg-gray-900/50 backdrop-blur-md border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-blue-400" />
                  <span>Savings Goals</span>
                </div>
                <Button onClick={() => setShowNewGoalForm(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  New Goal
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savingsGoals.map((goal) => (
                  <div key={goal.id} className="p-4 rounded-lg bg-gray-800/50 border border-gray-600">
                    <h4 className="font-semibold text-white mb-2">{goal.name}</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm text-gray-300">
                        <span>Target:</span>
                        <span className="text-white font-bold">MWK {goal.target.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-300">
                        <span>Current:</span>
                        <span className="text-blue-400 font-bold">MWK {goal.current.toLocaleString()}</span>
                      </div>
                      <Progress value={goal.percentage} className="h-3" />
                      <p className="text-xs text-gray-400">Deadline: {goal.deadline}</p>
                      
                      {showAddMoneyForm === goal.id ? (
                        <div className="space-y-2">
                          <Input
                            placeholder="Amount to add (MWK)"
                            type="number"
                            className="bg-gray-700 border-gray-600 text-white"
                            id={`add-amount-${goal.id}`}
                          />
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => {
                                const amount = parseInt((document.getElementById(`add-amount-${goal.id}`) as HTMLInputElement)?.value || '0');
                                if (amount > 0) {
                                  handleAddMoney(goal.id, amount);
                                }
                              }}
                              size="sm"
                              className="flex-1 bg-green-600 hover:bg-green-700"
                            >
                              Add Money
                            </Button>
                            <Button
                              onClick={() => setShowAddMoneyForm(null)}
                              size="sm"
                              variant="outline"
                              className="flex-1 border-gray-600 text-gray-300"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          onClick={() => setShowAddMoneyForm(goal.id)}
                          size="sm"
                          className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                          Add Money
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="village-bank" className="space-y-4">
          {showNewGroupForm && (
            <Card className="bg-gray-900/50 backdrop-blur-md border-white/10 mb-6">
              <CardHeader>
                <CardTitle className="text-white">Create New Village Bank Group</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Group Name" className="bg-gray-800/50 border-white/20 text-white placeholder-white/60" id="group-name" />
                <Input placeholder="Interest Rate (%)" type="number" className="bg-gray-800/50 border-white/20 text-white placeholder-white/60" id="group-rate" />
                <Input placeholder="Minimum Duration" className="bg-gray-800/50 border-white/20 text-white placeholder-white/60" id="group-duration" />
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
                  <Button onClick={() => setShowNewGroupForm(false)} variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10">
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="bg-gray-900/50 backdrop-blur-md border-white/10">
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
                  <div key={group.id} className="p-4 rounded-lg bg-gray-800/50 border border-gray-600">
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
                        {showContributeForm === group.id ? (
                          <div className="w-full space-y-2">
                            <Input
                              placeholder="Amount to contribute (MWK)"
                              type="number"
                              className="bg-gray-700 border-gray-600 text-white"
                              id={`contribute-amount-${group.id}`}
                            />
                            <div className="flex space-x-2">
                              <Button
                                onClick={() => {
                                  const amount = parseInt((document.getElementById(`contribute-amount-${group.id}`) as HTMLInputElement)?.value || '0');
                                  if (amount > 0) {
                                    handleContribute(group.id, amount);
                                  }
                                }}
                                size="sm"
                                className="flex-1 bg-green-600 hover:bg-green-700"
                              >
                                Contribute
                              </Button>
                              <Button
                                onClick={() => setShowContributeForm(null)}
                                size="sm"
                                variant="outline"
                                className="flex-1 border-gray-600 text-gray-300"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : showLoanForm === group.id ? (
                          <div className="w-full space-y-2">
                            <Input
                              placeholder="Loan amount (MWK)"
                              type="number"
                              className="bg-gray-700 border-gray-600 text-white"
                              id={`loan-amount-${group.id}`}
                            />
                            <div className="flex space-x-2">
                              <Button
                                onClick={() => {
                                  const amount = parseInt((document.getElementById(`loan-amount-${group.id}`) as HTMLInputElement)?.value || '0');
                                  if (amount > 0) {
                                    handleRequestLoan(group.id, amount);
                                  }
                                }}
                                size="sm"
                                className="flex-1 bg-yellow-600 hover:bg-yellow-700"
                              >
                                Request
                              </Button>
                              <Button
                                onClick={() => setShowLoanForm(null)}
                                size="sm"
                                variant="outline"
                                className="flex-1 border-gray-600 text-gray-300"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              onClick={() => setShowContributeForm(group.id)}
                              className="flex-1 bg-green-600 hover:bg-green-700"
                            >
                              Contribute
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => setShowLoanForm(group.id)}
                              className="flex-1 bg-yellow-600 hover:bg-yellow-700"
                            >
                              Request Loan
                            </Button>
                          </>
                        )}
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
                        <Button
                          size="sm"
                          onClick={() => openAdminDashboard(group)}
                          className="w-full bg-purple-600 hover:bg-purple-700 mt-2"
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Admin Dashboard
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
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
