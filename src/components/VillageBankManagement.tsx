
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users, Plus, UserPlus, Mail, Target, ArrowLeft, Crown, User } from 'lucide-react';

interface VillageBankManagementProps {
  onBack?: () => void;
}

export const VillageBankManagement = ({ onBack }: VillageBankManagementProps) => {
  const [groups, setGroups] = useState([
    { 
      id: 1, 
      name: 'Farmers Cooperative', 
      members: 12, 
      balance: 450000, 
      goal: 1000000,
      role: 'admin',
      description: 'Supporting local farmers with microfinance'
    },
    { 
      id: 2, 
      name: 'Women Empowerment', 
      members: 8, 
      balance: 280000, 
      goal: 500000,
      role: 'member',
      description: 'Empowering women through savings and loans'
    }
  ]);

  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [newGroupGoal, setNewGroupGoal] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');

  const createGroup = () => {
    if (!newGroupName || !newGroupDescription || !newGroupGoal) {
      alert('Please fill in all fields');
      return;
    }

    const newGroup = {
      id: Date.now(),
      name: newGroupName,
      members: 1,
      balance: 0,
      goal: parseFloat(newGroupGoal),
      role: 'admin',
      description: newGroupDescription
    };

    setGroups(prev => [newGroup, ...prev]);
    setNewGroupName('');
    setNewGroupDescription('');
    setNewGroupGoal('');
    setShowCreateGroup(false);
    alert('Village Bank group created successfully!');
  };

  const inviteMember = () => {
    if (!inviteEmail || !selectedGroup) {
      alert('Please enter an email address');
      return;
    }

    // Simulate sending invitation
    alert(`Invitation sent to ${inviteEmail} for group "${selectedGroup.name}"`);
    setInviteEmail('');
    setShowInviteModal(false);
    setSelectedGroup(null);
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-24">
      {/* Header */}
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
          <h2 className="text-xl sm:text-2xl font-bold text-white">Village Banks</h2>
        </div>
      )}

      {/* Create Group Button */}
      <div className="flex justify-end">
        <Dialog open={showCreateGroup} onOpenChange={setShowCreateGroup}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Group
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Create New Village Bank</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-white text-sm">Group Name</Label>
                <Input
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Enter group name"
                  className="bg-gray-800/60 border-gray-600/50 text-white placeholder-gray-400"
                />
              </div>
              <div>
                <Label className="text-white text-sm">Description</Label>
                <Input
                  value={newGroupDescription}
                  onChange={(e) => setNewGroupDescription(e.target.value)}
                  placeholder="Describe your group's purpose"
                  className="bg-gray-800/60 border-gray-600/50 text-white placeholder-gray-400"
                />
              </div>
              <div>
                <Label className="text-white text-sm">Savings Goal (MWK)</Label>
                <Input
                  type="number"
                  value={newGroupGoal}
                  onChange={(e) => setNewGroupGoal(e.target.value)}
                  placeholder="Enter target amount"
                  className="bg-gray-800/60 border-gray-600/50 text-white placeholder-gray-400"
                />
              </div>
              <Button onClick={createGroup} className="w-full bg-green-600 hover:bg-green-700">
                Create Group
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Groups List */}
      <div className="grid gap-4">
        {groups.map((group) => (
          <Card key={group.id} className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-2xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2 text-base sm:text-lg text-white">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <span>{group.name}</span>
                  {group.role === 'admin' && (
                    <Crown className="w-4 h-4 text-yellow-400" />
                  )}
                </CardTitle>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30 text-xs">
                  {group.role}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-300">{group.description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400">Members</p>
                  <p className="text-sm font-semibold text-white">{group.members}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Current Balance</p>
                  <p className="text-sm font-semibold text-white">MWK {group.balance.toLocaleString()}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-400">Progress to Goal</span>
                  <span className="text-xs text-white">MWK {group.goal.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full"
                    style={{ width: `${Math.min((group.balance / group.goal) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {((group.balance / group.goal) * 100).toFixed(1)}% complete
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-xs"
                >
                  <Target className="w-3 h-3 mr-1" />
                  Contribute
                </Button>
                {group.role === 'admin' && (
                  <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
                    <DialogTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-gray-600/50 text-white hover:bg-gray-700/50 text-xs"
                        onClick={() => setSelectedGroup(group)}
                      >
                        <UserPlus className="w-3 h-3 mr-1" />
                        Invite
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-900 border-gray-700">
                      <DialogHeader>
                        <DialogTitle className="text-white">Invite Member</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-white text-sm">Email Address</Label>
                          <Input
                            type="email"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            placeholder="Enter member's email"
                            className="bg-gray-800/60 border-gray-600/50 text-white placeholder-gray-400"
                          />
                        </div>
                        <Button onClick={inviteMember} className="w-full bg-green-600 hover:bg-green-700">
                          <Mail className="w-4 h-4 mr-2" />
                          Send Invitation
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {groups.length === 0 && (
        <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-2xl">
          <CardContent className="text-center py-12">
            <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No Village Banks Yet</h3>
            <p className="text-sm text-gray-400 mb-6">Create or join a village bank to start saving together</p>
            <Button 
              onClick={() => setShowCreateGroup(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Group
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
