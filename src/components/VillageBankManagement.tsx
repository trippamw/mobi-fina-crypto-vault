
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Plus, Users, Send, Settings, UserPlus, Crown, Shield, User, Copy, Share2, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/utils/languageApi';
import { useToast } from '@/hooks/use-toast';

interface VillageBankManagementProps {
  villageBank?: any;
  onBack: () => void;
  onCreateGroup?: (groupData: any) => void;
  onInviteMember?: (groupId: string, memberData: any) => void;
}

export const VillageBankManagement = ({ villageBank, onBack, onCreateGroup, onInviteMember }: VillageBankManagementProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showInviteMember, setShowInviteMember] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const [groupForm, setGroupForm] = useState({
    name: '',
    description: '',
    type: 'savings',
    targetAmount: '',
    duration: '',
    contributionAmount: '',
    contributionFrequency: 'weekly',
    isPrivate: false
  });

  const [inviteForm, setInviteForm] = useState({
    name: '',
    phone: '',
    email: '',
    role: 'member',
    message: ''
  });

  // Mock data for existing groups
  const [userGroups, setUserGroups] = useState([
    {
      id: '1',
      name: 'Family Savings Circle',
      description: 'Monthly savings for family emergencies',
      type: 'savings',
      memberCount: 8,
      totalSavings: 125000,
      targetAmount: 500000,
      role: 'admin',
      status: 'active',
      nextContribution: '2025-01-15',
      contributionAmount: 5000,
      frequency: 'monthly',
      inviteCode: 'FAM123',
      members: [
        {
          id: 'current-user',
          name: 'You',
          role: 'admin',
          joinedDate: new Date().toISOString(),
          totalContributions: 0
        }
      ]
    },
    {
      id: '2',
      name: 'Business Investment Group',
      description: 'Pooling funds for small business ventures',
      type: 'investment',
      memberCount: 12,
      totalSavings: 280000,
      targetAmount: 1000000,
      role: 'member',
      status: 'active',
      nextContribution: '2025-01-10',
      contributionAmount: 10000,
      frequency: 'weekly',
      inviteCode: 'BIZ456',
      members: [
        {
          id: 'current-user',
          name: 'You',
          role: 'member',
          joinedDate: new Date().toISOString(),
          totalContributions: 0
        }
      ]
    }
  ]);

  const groupTypes = [
    { value: 'savings', label: 'Savings Circle', description: 'Regular contributions for collective savings' },
    { value: 'investment', label: 'Investment Pool', description: 'Pool funds for investment opportunities' },
    { value: 'emergency', label: 'Emergency Fund', description: 'Emergency assistance for members' },
    { value: 'project', label: 'Project Funding', description: 'Funding specific community projects' }
  ];

  const frequencies = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'biweekly', label: 'Bi-weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' }
  ];

  const handleCreateGroup = () => {
    if (!groupForm.name || !groupForm.description || !groupForm.contributionAmount) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    const newGroup = {
      id: Date.now().toString(),
      name: groupForm.name,
      description: groupForm.description,
      type: groupForm.type,
      memberCount: 1,
      totalSavings: 0,
      targetAmount: parseInt(groupForm.targetAmount) || 0,
      role: 'admin',
      status: 'active',
      nextContribution: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      contributionAmount: parseInt(groupForm.contributionAmount),
      frequency: groupForm.contributionFrequency,
      inviteCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
      created: new Date().toISOString(),
      members: [
        {
          id: 'current-user',
          name: 'You',
          role: 'admin',
          joinedDate: new Date().toISOString(),
          totalContributions: 0
        }
      ]
    };

    setUserGroups([...userGroups, newGroup]);

    if (onCreateGroup) {
      onCreateGroup(newGroup);
    }

    toast({
      title: 'Success',
      description: 'Village Bank group created successfully!',
    });

    setShowCreateGroup(false);
    setGroupForm({
      name: '',
      description: '',
      type: 'savings',
      targetAmount: '',
      duration: '',
      contributionAmount: '',
      contributionFrequency: 'weekly',
      isPrivate: false
    });
  };

  const handleInviteMember = () => {
    if (!inviteForm.name || (!inviteForm.phone && !inviteForm.email)) {
      toast({
        title: 'Error',
        description: 'Please provide member name and either phone or email',
        variant: 'destructive'
      });
      return;
    }

    const inviteData = {
      id: Date.now().toString(),
      name: inviteForm.name,
      email: inviteForm.email,
      phone: inviteForm.phone,
      role: inviteForm.role,
      message: inviteForm.message,
      invitedAt: new Date().toISOString(),
      status: 'pending'
    };

    // Update the selected group's members
    const updatedGroups = userGroups.map(group => {
      if (group.id === selectedGroup?.id) {
        return {
          ...group,
          memberCount: group.memberCount + 1,
          members: [...(group.members || []), {
            ...inviteData,
            joinedDate: new Date().toISOString(),
            totalContributions: 0,
            status: 'pending'
          }]
        };
      }
      return group;
    });

    setUserGroups(updatedGroups);

    if (onInviteMember && selectedGroup) {
      onInviteMember(selectedGroup.id, inviteData);
    }

    toast({
      title: 'Invitation Sent',
      description: `Invitation sent to ${inviteForm.name} successfully!`,
    });

    setShowInviteMember(false);
    setInviteForm({
      name: '',
      phone: '',
      email: '',
      role: 'member',
      message: ''
    });
  };

  const copyInviteCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: 'Copied',
      description: 'Invite code copied to clipboard',
    });
  };

  const shareGroup = (group: any) => {
    const shareText = `Join our Village Bank group "${group.name}" using invite code: ${group.inviteCode}`;
    if (navigator.share) {
      navigator.share({
        title: group.name,
        text: shareText,
        url: `https://neovault.app/village-bank/join/${group.inviteCode}`
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast({
        title: 'Copied',
        description: 'Group invitation copied to clipboard',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-3 pb-24">
      <div className="container mx-auto max-w-lg space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-lg font-bold text-white text-center flex-1">
            Village Bank
          </h1>
          <Button
            onClick={() => setShowCreateGroup(true)}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-xs"
          >
            <Plus className="w-3 h-3 mr-1" />
            Create
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-2">
          <Card className="bg-gradient-to-br from-blue-600 to-blue-800 border-0 shadow-xl">
            <CardContent className="p-3">
              <div className="text-center">
                <Users className="w-5 h-5 text-blue-200 mx-auto mb-1" />
                <p className="text-blue-100 text-xs">Groups</p>
                <p className="text-white text-lg font-bold">{userGroups.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-600 to-green-800 border-0 shadow-xl">
            <CardContent className="p-3">
              <div className="text-center">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-1">
                  <span className="text-white font-bold text-xs">K</span>
                </div>
                <p className="text-green-100 text-xs">Savings</p>
                <p className="text-white text-sm font-bold">
                  {(userGroups.reduce((sum, group) => sum + group.totalSavings, 0) / 1000).toFixed(0)}K
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600 to-purple-800 border-0 shadow-xl">
            <CardContent className="p-3">
              <div className="text-center">
                <Crown className="w-5 h-5 text-purple-200 mx-auto mb-1" />
                <p className="text-purple-100 text-xs">Members</p>
                <p className="text-white text-lg font-bold">
                  {userGroups.reduce((sum, group) => sum + group.memberCount, 0)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* My Groups */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">My Groups</h2>
          </div>

          <div className="space-y-3">
            {userGroups.map((group) => (
              <Card key={group.id} className="bg-gray-900/90 border-gray-700/50 hover:border-gray-600/50 transition-all shadow-xl">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-white text-base font-semibold mb-1">{group.name}</h3>
                        <p className="text-gray-300 text-sm">{group.description}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={`${group.role === 'admin' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-blue-500/20 text-blue-300'} text-xs border-0`}>
                          {group.role === 'admin' ? <Crown className="w-3 h-3 mr-1" /> : <User className="w-3 h-3 mr-1" />}
                          {group.role}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-gray-800/50 p-2 rounded-lg">
                        <p className="text-gray-400 text-xs">Members</p>
                        <p className="text-white font-semibold">{group.memberCount}</p>
                      </div>
                      <div className="bg-gray-800/50 p-2 rounded-lg">
                        <p className="text-gray-400 text-xs">Total Savings</p>
                        <p className="text-white font-semibold text-sm">MWK {group.totalSavings.toLocaleString()}</p>
                      </div>
                      <div className="bg-gray-800/50 p-2 rounded-lg">
                        <p className="text-gray-400 text-xs">Contribution</p>
                        <p className="text-white font-semibold text-sm">MWK {group.contributionAmount.toLocaleString()}</p>
                      </div>
                      <div className="bg-gray-800/50 p-2 rounded-lg">
                        <p className="text-gray-400 text-xs">Frequency</p>
                        <p className="text-white font-semibold capitalize text-sm">{group.frequency}</p>
                      </div>
                    </div>

                    {group.targetAmount > 0 && (
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">Progress</span>
                          <span className="text-white">{Math.round((group.totalSavings / group.targetAmount) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all"
                            style={{ width: `${Math.min((group.totalSavings / group.targetAmount) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      {group.role === 'admin' && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedGroup(group);
                            setShowInviteMember(true);
                          }}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-xs"
                        >
                          <UserPlus className="w-3 h-3 mr-1" />
                          Invite
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => shareGroup(group)}
                        className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700/50 text-xs"
                      >
                        <Share2 className="w-3 h-3 mr-1" />
                        Share
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:bg-gray-700/50 text-xs px-2"
                      >
                        <MessageCircle className="w-3 h-3" />
                      </Button>
                    </div>

                    {group.inviteCode && (
                      <div className="flex items-center space-x-2 p-2 bg-gray-800/50 rounded-lg">
                        <span className="text-xs text-gray-400">Code:</span>
                        <code className="text-sm text-white font-mono">{group.inviteCode}</code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyInviteCode(group.inviteCode)}
                          className="ml-auto p-1 h-auto"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Create Group Modal */}
        <Dialog open={showCreateGroup} onOpenChange={setShowCreateGroup}>
          <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-sm mx-auto max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-base">Create Village Bank Group</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label className="text-white text-sm">Group Name *</Label>
                <Input
                  value={groupForm.name}
                  onChange={(e) => setGroupForm({...groupForm, name: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white mt-1"
                  placeholder="Enter group name"
                />
              </div>

              <div>
                <Label className="text-white text-sm">Description *</Label>
                <Textarea
                  value={groupForm.description}
                  onChange={(e) => setGroupForm({...groupForm, description: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white mt-1"
                  placeholder="Describe the purpose of your group"
                  rows={2}
                />
              </div>

              <div>
                <Label className="text-white text-sm">Group Type</Label>
                <Select value={groupForm.type} onValueChange={(value) => setGroupForm({...groupForm, type: value})}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700 z-50">
                    {groupTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value} className="text-white">
                        <div>
                          <div className="font-medium text-sm">{type.label}</div>
                          <div className="text-xs text-gray-400">{type.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-white text-sm">Contribution (MWK) *</Label>
                  <Input
                    type="number"
                    value={groupForm.contributionAmount}
                    onChange={(e) => setGroupForm({...groupForm, contributionAmount: e.target.value})}
                    className="bg-gray-800 border-gray-600 text-white mt-1"
                    placeholder="5000"
                  />
                </div>
                <div>
                  <Label className="text-white text-sm">Frequency</Label>
                  <Select value={groupForm.contributionFrequency} onValueChange={(value) => setGroupForm({...groupForm, contributionFrequency: value})}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700 z-50">
                      {frequencies.map((freq) => (
                        <SelectItem key={freq.value} value={freq.value} className="text-white">
                          {freq.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-white text-sm">Target Amount (MWK)</Label>
                <Input
                  type="number"
                  value={groupForm.targetAmount}
                  onChange={(e) => setGroupForm({...groupForm, targetAmount: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white mt-1"
                  placeholder="Optional target amount"
                />
              </div>

              <div className="flex space-x-2 pt-3">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateGroup(false)}
                  className="flex-1 border-gray-600 text-white hover:bg-gray-700 text-sm"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateGroup}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-sm"
                >
                  Create Group
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Invite Member Modal */}
        <Dialog open={showInviteMember} onOpenChange={setShowInviteMember}>
          <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-sm mx-auto">
            <DialogHeader>
              <DialogTitle className="text-base">Invite Member to {selectedGroup?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label className="text-white text-sm">Member Name *</Label>
                <Input
                  value={inviteForm.name}
                  onChange={(e) => setInviteForm({...inviteForm, name: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white mt-1"
                  placeholder="Full name"
                />
              </div>

              <div>
                <Label className="text-white text-sm">Phone Number</Label>
                <Input
                  value={inviteForm.phone}
                  onChange={(e) => setInviteForm({...inviteForm, phone: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white mt-1"
                  placeholder="+265 xxx xxx xxx"
                />
              </div>

              <div>
                <Label className="text-white text-sm">Email</Label>
                <Input
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({...inviteForm, email: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white mt-1"
                  placeholder="member@email.com"
                />
              </div>

              <div>
                <Label className="text-white text-sm">Role</Label>
                <Select value={inviteForm.role} onValueChange={(value) => setInviteForm({...inviteForm, role: value})}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700 z-50">
                    <SelectItem value="member" className="text-white">Member</SelectItem>
                    <SelectItem value="moderator" className="text-white">Moderator</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white text-sm">Personal Message (Optional)</Label>
                <Textarea
                  value={inviteForm.message}
                  onChange={(e) => setInviteForm({...inviteForm, message: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white mt-1"
                  placeholder="Add a personal message..."
                  rows={2}
                />
              </div>

              <div className="flex space-x-2 pt-3">
                <Button
                  variant="outline"
                  onClick={() => setShowInviteMember(false)}
                  className="flex-1 border-gray-600 text-white hover:bg-gray-700 text-sm"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleInviteMember}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-sm"
                >
                  Send Invitation
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
