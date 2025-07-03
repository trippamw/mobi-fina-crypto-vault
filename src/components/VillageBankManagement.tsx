
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Users, Plus, Send, Settings, Target, DollarSign, Calendar, UserPlus } from 'lucide-react';

interface VillageBankManagementProps {
  onBack: () => void;
}

export const VillageBankManagement = ({ onBack }: VillageBankManagementProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [savingGoal, setSavingGoal] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [contributionAmount, setContributionAmount] = useState('');
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  
  const [groups, setGroups] = useState([
    {
      id: 1,
      name: 'Mpingo Village Group',
      members: 12,
      totalSavings: 1250000,
      goal: 2000000,
      nextMeeting: '2025-01-10',
      status: 'active'
    },
    {
      id: 2,
      name: 'Mzuzu Farmers Cooperative',
      members: 8,
      totalSavings: 800000,
      goal: 1500000,
      nextMeeting: '2025-01-08',
      status: 'active'
    }
  ]);

  const [savingGoals, setSavingGoals] = useState([
    {
      id: 1,
      title: 'Community Well Project',
      target: 500000,
      current: 320000,
      deadline: '2025-03-15',
      contributors: 8
    },
    {
      id: 2,
      title: 'School Equipment Fund',
      target: 800000,
      current: 450000,
      deadline: '2025-04-30',
      contributors: 12
    }
  ]);

  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      alert('Please enter a group name');
      return;
    }

    setIsCreatingGroup(true);
    
    // Simulate group creation
    setTimeout(() => {
      const newGroup = {
        id: groups.length + 1,
        name: groupName,
        members: 1,
        totalSavings: 0,
        goal: parseInt(targetAmount) || 1000000,
        nextMeeting: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'active'
      };
      
      setGroups([...groups, newGroup]);
      setGroupName('');
      setGroupDescription('');
      setTargetAmount('');
      setIsCreatingGroup(false);
      setActiveTab('overview');
      
      alert(`Group "${newGroup.name}" created successfully!`);
    }, 1000);
  };

  const handleInviteMember = () => {
    if (!inviteEmail.trim()) {
      alert('Please enter an email address');
      return;
    }

    // Simulate invitation
    alert(`Invitation sent to ${inviteEmail}`);
    setInviteEmail('');
  };

  const handleContributeToGoal = (goalId: number) => {
    if (!contributionAmount || parseFloat(contributionAmount) <= 0) {
      alert('Please enter a valid contribution amount');
      return;
    }

    const amount = parseFloat(contributionAmount);
    setSavingGoals(prevGoals => 
      prevGoals.map(goal => 
        goal.id === goalId 
          ? { ...goal, current: goal.current + amount }
          : goal
      )
    );
    
    setContributionAmount('');
    alert(`MWK ${amount.toLocaleString()} contributed successfully!`);
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button
          onClick={onBack}
          variant="ghost"
          size="sm"
          className="text-white/70 hover:text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-xl font-bold text-white">Village Bank Management</h2>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2 overflow-x-auto">
        <Button
          variant={activeTab === 'overview' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('overview')}
          className={activeTab === 'overview' ? 'bg-blue-600' : 'text-gray-300'}
        >
          Overview
        </Button>
        <Button
          variant={activeTab === 'create' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('create')}
          className={activeTab === 'create' ? 'bg-green-600' : 'text-gray-300'}
        >
          Create Group
        </Button>
        <Button
          variant={activeTab === 'invite' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('invite')}
          className={activeTab === 'invite' ? 'bg-purple-600' : 'text-gray-300'}
        >
          Invite Members
        </Button>
        <Button
          variant={activeTab === 'goals' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('goals')}
          className={activeTab === 'goals' ? 'bg-orange-600' : 'text-gray-300'}
        >
          Saving Goals
        </Button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">My Village Bank Groups</h3>
          {groups.map((group) => (
            <Card key={group.id} className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-2xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-white text-base">{group.name}</h4>
                    <p className="text-sm text-gray-300">{group.members} members</p>
                  </div>
                  <Badge className="bg-green-500/20 text-green-300 border-green-400/30 text-xs">
                    {group.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-400">Total Savings</p>
                    <p className="font-semibold text-white text-sm">MWK {group.totalSavings.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Next Meeting</p>
                    <p className="font-semibold text-white text-sm">{group.nextMeeting}</p>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Progress to Goal</span>
                    <span className="text-white">{Math.round((group.totalSavings / group.goal) * 100)}%</span>
                  </div>
                  <Progress value={(group.totalSavings / group.goal) * 100} className="h-2" />
                </div>
                
                <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-xs">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Group Tab */}
      {activeTab === 'create' && (
        <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white text-lg">Create New Village Bank Group</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="groupName" className="text-white text-sm">Group Name</Label>
              <Input
                id="groupName"
                placeholder="Enter group name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="bg-gray-800/60 border-gray-600/50 text-white placeholder-gray-400"
              />
            </div>
            
            <div>
              <Label htmlFor="groupDescription" className="text-white text-sm">Group Description</Label>
              <Input
                id="groupDescription"
                placeholder="Describe your group's purpose"
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
                className="bg-gray-800/60 border-gray-600/50 text-white placeholder-gray-400"
              />
            </div>
            
            <div>
              <Label htmlFor="targetAmount" className="text-white text-sm">Initial Savings Goal (MWK)</Label>
              <Input
                id="targetAmount"
                type="number"
                placeholder="Enter target amount"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="bg-gray-800/60 border-gray-600/50 text-white placeholder-gray-400"
              />
            </div>
            
            <Button 
              onClick={handleCreateGroup}
              disabled={isCreatingGroup || !groupName.trim()}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <Users className="w-4 h-4 mr-2" />
              {isCreatingGroup ? 'Creating Group...' : 'Create Group'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Invite Members Tab */}
      {activeTab === 'invite' && (
        <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white text-lg">Invite Members to Group</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="inviteEmail" className="text-white text-sm">Email Address</Label>
              <Input
                id="inviteEmail"
                type="email"
                placeholder="Enter member's email address"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="bg-gray-800/60 border-gray-600/50 text-white placeholder-gray-400"
              />
            </div>
            
            <Button 
              onClick={handleInviteMember}
              disabled={!inviteEmail.trim()}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Send Invitation
            </Button>
            
            <div className="mt-6">
              <h4 className="text-white text-sm font-medium mb-3">Recent Invitations</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-gray-800/40 rounded-lg">
                  <span className="text-white text-sm">john@example.com</span>
                  <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-400/30 text-xs">Pending</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/40 rounded-lg">
                  <span className="text-white text-sm">mary@example.com</span>
                  <Badge className="bg-green-500/20 text-green-300 border-green-400/30 text-xs">Accepted</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Saving Goals Tab */}
      {activeTab === 'goals' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Saving Goals</h3>
          {savingGoals.map((goal) => (
            <Card key={goal.id} className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-2xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-white text-base">{goal.title}</h4>
                    <p className="text-sm text-gray-300">{goal.contributors} contributors</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Deadline</p>
                    <p className="text-sm text-white">{goal.deadline}</p>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white">
                      MWK {goal.current.toLocaleString()} / {goal.target.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                  <p className="text-xs text-gray-400 mt-1">
                    {Math.round((goal.current / goal.target) * 100)}% completed
                  </p>
                </div>
                
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    placeholder="Contribution amount"
                    value={contributionAmount}
                    onChange={(e) => setContributionAmount(e.target.value)}
                    className="flex-1 bg-gray-800/60 border-gray-600/50 text-white placeholder-gray-400 text-sm"
                  />
                  <Button 
                    size="sm" 
                    onClick={() => handleContributeToGoal(goal.id)}
                    className="bg-orange-600 hover:bg-orange-700 text-xs"
                  >
                    <DollarSign className="w-3 h-3 mr-1" />
                    Contribute
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
