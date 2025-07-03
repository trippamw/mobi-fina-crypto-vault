
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, Users, Plus, UserPlus, Send, Crown, User, Mail, Phone } from 'lucide-react';
import { useLanguage } from '@/utils/languageApi';
import { useToast } from '@/hooks/use-toast';

interface VillageBankManagementProps {
  group: any;
  onBack: () => void;
  onBalanceUpdate: (currency: string, amount: number) => void;
  onTransactionUpdate: (transaction: any) => void;
}

export const VillageBankManagement = ({ group, onBack, onBalanceUpdate, onTransactionUpdate }: VillageBankManagementProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [contributionAmount, setContributionAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [createGroupDialogOpen, setCreateGroupDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePhone, setInvitePhone] = useState('');
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [newGroupGoal, setNewGroupGoal] = useState('');
  const [members, setMembers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+265888123456', role: 'Admin', contribution: 50000, status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+265999654321', role: 'Member', contribution: 35000, status: 'Active' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', phone: '+265777987654', role: 'Member', contribution: 42000, status: 'Pending' }
  ]);

  const handleContribute = () => {
    const amount = parseFloat(contributionAmount);
    if (amount > 0) {
      onBalanceUpdate('MWK', -amount);
      onTransactionUpdate({
        type: 'Village Bank Contribution',
        amount: `-MWK ${amount.toLocaleString()}`,
        description: `Contribution to ${group.name}`,
        time: 'Just now',
        status: 'completed'
      });
      setContributionAmount('');
      toast({
        title: t('success'),
        description: 'Contribution successful!',
      });
    }
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (amount > 0 && amount <= group.balance) {
      onBalanceUpdate('MWK', amount);
      onTransactionUpdate({
        type: 'Village Bank Withdrawal',
        amount: `+MWK ${amount.toLocaleString()}`,
        description: `Withdrawal from ${group.name}`,
        time: 'Just now',
        status: 'completed'
      });
      setWithdrawAmount('');
      toast({
        title: t('success'),
        description: 'Withdrawal successful!',
      });
    }
  };

  const handleInviteMember = () => {
    if (inviteEmail || invitePhone) {
      const newMember = {
        id: Date.now(),
        name: 'New Member',
        email: inviteEmail,
        phone: invitePhone,
        role: 'Member',
        contribution: 0,
        status: 'Invited'
      };
      setMembers(prev => [...prev, newMember]);
      setInviteDialogOpen(false);
      setInviteEmail('');
      setInvitePhone('');
      toast({
        title: t('success'),
        description: 'Invitation sent successfully!',
      });
    }
  };

  const handleCreateGroup = () => {
    if (newGroupName && newGroupDescription && newGroupGoal) {
      // In a real app, this would create a new group
      toast({
        title: t('success'),
        description: `Group "${newGroupName}" created successfully!`,
      });
      setCreateGroupDialogOpen(false);
      setNewGroupName('');
      setNewGroupDescription('');
      setNewGroupGoal('');
    }
  };

  const removeMember = (memberId: number) => {
    setMembers(prev => prev.filter(member => member.id !== memberId));
    toast({
      title: t('success'),
      description: 'Member removed successfully!',
    });
  };

  return (
    <div className="space-y-4 pb-24">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-xl font-bold text-white">{group.name}</h2>
        </div>
        <div className="flex space-x-2">
          <Dialog open={createGroupDialogOpen} onOpenChange={setCreateGroupDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-1" />
                Create Group
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-700 text-white">
              <DialogHeader>
                <DialogTitle>Create New Village Bank Group</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-white">Group Name</Label>
                  <Input
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="Enter group name"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">Description</Label>
                  <Input
                    value={newGroupDescription}
                    onChange={(e) => setNewGroupDescription(e.target.value)}
                    placeholder="Enter group description"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">Savings Goal (MWK)</Label>
                  <Input
                    type="number"
                    value={newGroupGoal}
                    onChange={(e) => setNewGroupGoal(e.target.value)}
                    placeholder="Enter savings goal"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <Button onClick={handleCreateGroup} className="w-full bg-green-600 hover:bg-green-700">
                  Create Group
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <UserPlus className="w-4 h-4 mr-1" />
                Invite
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-700 text-white">
              <DialogHeader>
                <DialogTitle>Invite Member</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-white">Email</Label>
                  <Input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">Phone Number</Label>
                  <Input
                    type="tel"
                    value={invitePhone}
                    onChange={(e) => setInvitePhone(e.target.value)}
                    placeholder="Enter phone number"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <Button onClick={handleInviteMember} className="w-full bg-blue-600 hover:bg-blue-700">
                  Send Invitation
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Group Overview */}
      <Card className="bg-gradient-to-br from-green-800 to-emerald-900 border-green-600/30">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-green-300" />
              <div>
                <h3 className="text-lg font-bold text-white">{group.name}</h3>
                <p className="text-sm text-green-200">{members.length} Members</p>
              </div>
            </div>
            <Badge className="bg-green-500/20 text-green-300 border-green-400/30">
              Active
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-white">MWK {group.balance.toLocaleString()}</p>
              <p className="text-sm text-green-200">Total Balance</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">MWK {group.target.toLocaleString()}</p>
              <p className="text-sm text-green-200">Target Goal</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <div className="flex space-x-2">
        <Button
          variant={activeTab === 'overview' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('overview')}
          className={activeTab === 'overview' ? 'bg-blue-600' : 'text-gray-300'}
        >
          Overview
        </Button>
        <Button
          variant={activeTab === 'members' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('members')}
          className={activeTab === 'members' ? 'bg-blue-600' : 'text-gray-300'}
        >
          Members
        </Button>
        <Button
          variant={activeTab === 'contribute' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('contribute')}
          className={activeTab === 'contribute' ? 'bg-green-600' : 'text-gray-300'}
        >
          Contribute
        </Button>
        <Button
          variant={activeTab === 'withdraw' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('withdraw')}
          className={activeTab === 'withdraw' ? 'bg-orange-600' : 'text-gray-300'}
        >
          Withdraw
        </Button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50">
            <CardHeader>
              <CardTitle className="text-white">Group Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Created</Label>
                  <p className="text-white font-semibold">{group.created}</p>
                </div>
                <div>
                  <Label className="text-gray-300">Progress</Label>
                  <p className="text-white font-semibold">{Math.round((group.balance / group.target) * 100)}%</p>
                </div>
                <div>
                  <Label className="text-gray-300">Monthly Contribution</Label>
                  <p className="text-white font-semibold">MWK {group.monthlyContribution?.toLocaleString() || '10,000'}</p>
                </div>
                <div>
                  <Label className="text-gray-300">Next Meeting</Label>
                  <p className="text-white font-semibold">Next Week</p>
                </div>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${Math.min((group.balance / group.target) * 100, 100)}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'members' && (
        <div className="space-y-4">
          <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50">
            <CardHeader>
              <CardTitle className="text-white">Group Members ({members.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                        {member.role === 'Admin' ? (
                          <Crown className="w-5 h-5 text-yellow-400" />
                        ) : (
                          <User className="w-5 h-5 text-gray-300" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-white">{member.name}</p>
                        <div className="flex items-center space-x-2 text-xs text-gray-400">
                          <Mail className="w-3 h-3" />
                          <span>{member.email}</span>
                          <Phone className="w-3 h-3 ml-2" />
                          <span>{member.phone}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-white">MWK {member.contribution.toLocaleString()}</p>
                      <div className="flex items-center space-x-2">
                        <Badge className={`text-xs ${member.status === 'Active' ? 'bg-green-500/20 text-green-300' : 
                          member.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-300' : 
                          'bg-blue-500/20 text-blue-300'}`}>
                          {member.status}
                        </Badge>
                        <Badge className="bg-purple-500/20 text-purple-300 text-xs">
                          {member.role}
                        </Badge>
                      </div>
                    </div>
                    {member.role !== 'Admin' && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeMember(member.id)}
                        className="ml-2"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'contribute' && (
        <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white">Make Contribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-white">Amount (MWK)</Label>
              <Input
                type="number"
                value={contributionAmount}
                onChange={(e) => setContributionAmount(e.target.value)}
                placeholder="Enter contribution amount"
                className="bg-gray-800/60 border-gray-600/50 text-white"
              />
            </div>
            <Button
              onClick={handleContribute}
              disabled={!contributionAmount || parseFloat(contributionAmount) <= 0}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <Send className="w-4 h-4 mr-2" />
              Contribute
            </Button>
          </CardContent>
        </Card>
      )}

      {activeTab === 'withdraw' && (
        <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white">Withdraw Funds</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-white">Amount (MWK)</Label>
              <Input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="Enter withdrawal amount"
                className="bg-gray-800/60 border-gray-600/50 text-white"
              />
            </div>
            <p className="text-sm text-gray-400">
              Available balance: MWK {group.balance.toLocaleString()}
            </p>
            <Button
              onClick={handleWithdraw}
              disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > group.balance}
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              <Send className="w-4 h-4 mr-2" />
              Withdraw
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
