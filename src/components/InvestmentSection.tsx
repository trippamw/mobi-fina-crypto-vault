import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { PiggyBank, Users, Plus, Target, Calendar, TrendingUp, ArrowRight } from 'lucide-react';

interface InvestmentSectionProps {
  onBalanceUpdate?: (currency: string, amount: number) => void;
  onTransactionUpdate?: (transaction: any) => void;
}

export const InvestmentSection: React.FC<InvestmentSectionProps> = ({ onBalanceUpdate, onTransactionUpdate }) => {
  const [activeTab, setActiveTab] = useState('goals');
  const [showCreateGoal, setShowCreateGoal] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<any>(null);
  const [addMoneyAmount, setAddMoneyAmount] = useState('');

  const [savingsGoals, setSavingsGoals] = useState([
    {
      id: 1,
      name: 'Emergency Fund',
      targetAmount: 500000,
      currentAmount: 125000,
      deadline: '2024-12-31',
      category: 'Emergency',
      description: 'Build emergency fund for unexpected expenses'
    },
    {
      id: 2,
      name: 'New Car',
      targetAmount: 2000000,
      currentAmount: 400000,
      deadline: '2025-06-30',
      category: 'Vehicle',
      description: 'Save for a reliable vehicle'
    }
  ]);

  const [villageGroups, setVillageGroups] = useState([
    {
      id: 1,
      name: 'Blantyre Business Group',
      members: 12,
      totalPool: 850000,
      myContribution: 50000,
      nextMeeting: '2024-02-15',
      status: 'Active',
      description: 'Local business owners saving together',
      isAdmin: true
    },
    {
      id: 2,
      name: 'Lilongwe Teachers',
      members: 8,
      totalPool: 320000,
      myContribution: 25000,
      nextMeeting: '2024-02-20',
      status: 'Active',
      description: 'Teachers collaborative savings group',
      isAdmin: false
    }
  ]);

  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    deadline: '',
    category: '',
    description: ''
  });

  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    contributionAmount: '',
    meetingSchedule: '',
    maxMembers: ''
  });

  const handleCreateGoal = () => {
    if (!newGoal.name || !newGoal.targetAmount || !newGoal.deadline) {
      alert('Please fill in all required fields');
      return;
    }

    const goal = {
      id: Date.now(),
      name: newGoal.name,
      targetAmount: parseFloat(newGoal.targetAmount),
      currentAmount: 0,
      deadline: newGoal.deadline,
      category: newGoal.category || 'General',
      description: newGoal.description
    };

    setSavingsGoals([...savingsGoals, goal]);
    
    if (onTransactionUpdate) {
      onTransactionUpdate({
        type: 'Savings Goal Created',
        amount: `Target: MWK ${parseFloat(newGoal.targetAmount).toLocaleString()}`,
        description: `Created savings goal: ${newGoal.name}`,
        time: 'Just now',
        status: 'completed'
      });
    }

    setNewGoal({ name: '', targetAmount: '', deadline: '', category: '', description: '' });
    setShowCreateGoal(false);
    alert('Savings goal created successfully!');
  };

  const handleCreateGroup = () => {
    if (!newGroup.name || !newGroup.contributionAmount || !newGroup.maxMembers) {
      alert('Please fill in all required fields');
      return;
    }

    const group = {
      id: Date.now(),
      name: newGroup.name,
      members: 1,
      totalPool: 0,
      myContribution: 0,
      nextMeeting: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Active',
      description: newGroup.description,
      isAdmin: true,
      contributionAmount: parseFloat(newGroup.contributionAmount),
      maxMembers: parseInt(newGroup.maxMembers)
    };

    setVillageGroups([...villageGroups, group]);
    
    if (onTransactionUpdate) {
      onTransactionUpdate({
        type: 'Village Bank Created',
        amount: `Contribution: MWK ${parseFloat(newGroup.contributionAmount).toLocaleString()}`,
        description: `Created village bank group: ${newGroup.name}`,
        time: 'Just now',
        status: 'completed'
      });
    }

    setNewGroup({ name: '', description: '', contributionAmount: '', meetingSchedule: '', maxMembers: '' });
    setShowCreateGroup(false);
    alert('Village bank group created successfully!');
  };

  const handleAddMoney = () => {
    if (!addMoneyAmount || !selectedGoal) {
      alert('Please enter an amount');
      return;
    }

    const amount = parseFloat(addMoneyAmount);
    if (amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    // Update the savings goal
    setSavingsGoals(goals => 
      goals.map(goal => 
        goal.id === selectedGoal.id 
          ? { ...goal, currentAmount: Math.min(goal.currentAmount + amount, goal.targetAmount) }
          : goal
      )
    );

    // Deduct from wallet
    if (onBalanceUpdate) {
      onBalanceUpdate('MWK', -amount);
    }

    // Add to transaction history
    if (onTransactionUpdate) {
      onTransactionUpdate({
        type: 'Money Added to Savings',
        amount: `+MWK ${amount.toLocaleString()}`,
        description: `Added to ${selectedGoal.name} savings goal`,
        time: 'Just now',
        status: 'completed'
      });
    }

    setAddMoneyAmount('');
    setSelectedGoal(null);
    setShowAddMoney(false);
    alert(`Successfully added MWK ${amount.toLocaleString()} to ${selectedGoal.name}`);
  };

  const openAddMoney = (goal: any) => {
    setSelectedGoal(goal);
    setShowAddMoney(true);
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Save & Invest</h2>
        <div className="flex space-x-2">
          <Button
            onClick={() => setActiveTab('goals')}
            className={`${activeTab === 'goals' 
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
              : 'bg-gray-800/60 text-gray-300 hover:text-white'
            }`}
          >
            <Target className="w-4 h-4 mr-2" />
            Savings Goals
          </Button>
          <Button
            onClick={() => setActiveTab('village')}
            className={`${activeTab === 'village' 
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
              : 'bg-gray-800/60 text-gray-300 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4 mr-2" />
            Village Bank
          </Button>
        </div>
      </div>

      {/* Create New Section */}
      {activeTab === 'goals' && (
        <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Create New Savings Goal</h3>
                <p className="text-gray-400">Set a target and start saving towards your dreams</p>
              </div>
              <Button
                onClick={() => setShowCreateGoal(true)}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Goal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'village' && (
        <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Create Village Bank Group</h3>
                <p className="text-gray-400">Start or join a community savings group</p>
              </div>
              <Button
                onClick={() => setShowCreateGroup(true)}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Group
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content based on active tab */}
      {activeTab === 'goals' && (
        <div className="space-y-4">
          {savingsGoals.map((goal) => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            const remainingDays = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            
            return (
              <Card key={goal.id} className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <PiggyBank className="w-5 h-5 text-green-400" />
                        <h3 className="text-lg font-semibold text-white">{goal.name}</h3>
                        <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30">
                          {goal.category}
                        </Badge>
                      </div>
                      <p className="text-gray-400 text-sm mb-3">{goal.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">Progress</span>
                          <span className="text-white font-medium">{progress.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">
                            MWK {goal.currentAmount.toLocaleString()} / MWK {goal.targetAmount.toLocaleString()}
                          </span>
                          <span className="text-gray-300">
                            {remainingDays > 0 ? `${remainingDays} days left` : 'Deadline passed'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => openAddMoney(goal)}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white flex-1"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Money
                    </Button>
                    {remainingDays <= 0 && (
                      <Button
                        onClick={() => {
                          if (onBalanceUpdate) {
                            onBalanceUpdate('MWK', goal.currentAmount);
                          }
                          if (onTransactionUpdate) {
                            onTransactionUpdate({
                              type: 'Savings Withdrawal',
                              amount: `+MWK ${goal.currentAmount.toLocaleString()}`,
                              description: `Withdrew from ${goal.name} savings goal`,
                              time: 'Just now',
                              status: 'completed'
                            });
                          }
                          setSavingsGoals(goals => goals.filter(g => g.id !== goal.id));
                          alert(`Successfully withdrew MWK ${goal.currentAmount.toLocaleString()} from ${goal.name}`);
                        }}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                      >
                        Withdraw
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {activeTab === 'village' && (
        <div className="space-y-4">
          {villageGroups.map((group) => (
            <Card key={group.id} className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-2xl">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="w-5 h-5 text-purple-400" />
                      <h3 className="text-lg font-semibold text-white">{group.name}</h3>
                      <Badge className={`${
                        group.status === 'Active' 
                          ? 'bg-green-500/20 text-green-300 border-green-400/30' 
                          : 'bg-gray-500/20 text-gray-300 border-gray-400/30'
                      }`}>
                        {group.status}
                      </Badge>
                      {group.isAdmin && (
                        <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-400/30">
                          Admin
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm mb-3">{group.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-300">Members</p>
                        <p className="font-semibold text-white">{group.members}</p>
                      </div>
                      <div>
                        <p className="text-gray-300">Total Pool</p>
                        <p className="font-semibold text-white">MWK {group.totalPool.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-300">My Contribution</p>
                        <p className="font-semibold text-white">MWK {group.myContribution.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-300">Next Meeting</p>
                        <p className="font-semibold text-white">{group.nextMeeting}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    onClick={() => {
                      const amount = prompt('Enter contribution amount:');
                      if (amount && parseFloat(amount) > 0) {
                        const contributionAmount = parseFloat(amount);
                        setVillageGroups(groups => 
                          groups.map(g => 
                            g.id === group.id 
                              ? { 
                                  ...g, 
                                  myContribution: g.myContribution + contributionAmount,
                                  totalPool: g.totalPool + contributionAmount
                                }
                              : g
                          )
                        );
                        if (onBalanceUpdate) {
                          onBalanceUpdate('MWK', -contributionAmount);
                        }
                        if (onTransactionUpdate) {
                          onTransactionUpdate({
                            type: 'Village Bank Contribution',
                            amount: `-MWK ${contributionAmount.toLocaleString()}`,
                            description: `Contributed to ${group.name}`,
                            time: 'Just now',
                            status: 'completed'
                          });
                        }
                        alert(`Successfully contributed MWK ${contributionAmount.toLocaleString()} to ${group.name}`);
                      }
                    }}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Contribute
                  </Button>
                  
                  <Button
                    onClick={() => {
                      const maxLoan = group.myContribution * 3; // Can borrow 3x contribution
                      const amount = prompt(`Enter loan amount (Max: MWK ${maxLoan.toLocaleString()}):`);
                      if (amount && parseFloat(amount) > 0 && parseFloat(amount) <= maxLoan) {
                        const loanAmount = parseFloat(amount);
                        if (onBalanceUpdate) {
                          onBalanceUpdate('MWK', loanAmount);
                        }
                        if (onTransactionUpdate) {
                          onTransactionUpdate({
                            type: 'Village Bank Loan',
                            amount: `+MWK ${loanAmount.toLocaleString()}`,
                            description: `Loan from ${group.name} (5% interest)`,
                            time: 'Just now',
                            status: 'completed'
                          });
                        }
                        alert(`Loan of MWK ${loanAmount.toLocaleString()} approved with 5% interest`);
                      } else if (amount) {
                        alert(`Invalid amount. Maximum loan: MWK ${maxLoan.toLocaleString()}`);
                      }
                    }}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                  >
                    Request Loan
                  </Button>
                  
                  <Button
                    onClick={() => alert('Group details and member management coming soon!')}
                    className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Goal Modal */}
      <Dialog open={showCreateGoal} onOpenChange={setShowCreateGoal}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Create New Savings Goal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-gray-300">Goal Name</Label>
              <Input
                value={newGoal.name}
                onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                placeholder="e.g., New Car, Vacation"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            
            <div>
              <Label className="text-gray-300">Target Amount (MWK)</Label>
              <Input
                type="number"
                value={newGoal.targetAmount}
                onChange={(e) => setNewGoal({...newGoal, targetAmount: e.target.value})}
                placeholder="500000"
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
            
            <div>
              <Label className="text-gray-300">Category</Label>
              <Select value={newGoal.category} onValueChange={(value) => setNewGoal({...newGoal, category: value})}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="Emergency" className="text-white">Emergency</SelectItem>
                  <SelectItem value="Vehicle" className="text-white">Vehicle</SelectItem>
                  <SelectItem value="Education" className="text-white">Education</SelectItem>
                  <SelectItem value="Travel" className="text-white">Travel</SelectItem>
                  <SelectItem value="Business" className="text-white">Business</SelectItem>
                  <SelectItem value="General" className="text-white">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-gray-300">Description</Label>
              <Input
                value={newGoal.description}
                onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                placeholder="Brief description of your goal"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            
            <Button 
              onClick={handleCreateGoal}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            >
              Create Savings Goal
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Group Modal */}
      <Dialog open={showCreateGroup} onOpenChange={setShowCreateGroup}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Create Village Bank Group</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-gray-300">Group Name</Label>
              <Input
                value={newGroup.name}
                onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                placeholder="e.g., Business Owners Group"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            
            <div>
              <Label className="text-gray-300">Monthly Contribution (MWK)</Label>
              <Input
                type="number"
                value={newGroup.contributionAmount}
                onChange={(e) => setNewGroup({...newGroup, contributionAmount: e.target.value})}
                placeholder="10000"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            
            <div>
              <Label className="text-gray-300">Maximum Members</Label>
              <Input
                type="number"
                value={newGroup.maxMembers}
                onChange={(e) => setNewGroup({...newGroup, maxMembers: e.target.value})}
                placeholder="10"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            
            <div>
              <Label className="text-gray-300">Description</Label>
              <Input
                value={newGroup.description}
                onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                placeholder="Brief description of your group"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            
            <Button 
              onClick={handleCreateGroup}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
            >
              Create Group
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Money Modal */}
      <Dialog open={showAddMoney} onOpenChange={setShowAddMoney}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Add Money to {selectedGoal?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-300">Current Amount:</span>
                <span className="text-white">MWK {selectedGoal?.currentAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Target Amount:</span>
                <span className="text-white">MWK {selectedGoal?.targetAmount.toLocaleString()}</span>
              </div>
            </div>
            
            <div>
              <Label className="text-gray-300">Amount to Add (MWK)</Label>
              <Input
                type="number"
                value={addMoneyAmount}
                onChange={(e) => setAddMoneyAmount(e.target.value)}
                placeholder="Enter amount"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            
            <Button 
              onClick={handleAddMoney}
              disabled={!addMoneyAmount}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              Add MWK {addMoneyAmount ? parseFloat(addMoneyAmount).toLocaleString() : '0'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
