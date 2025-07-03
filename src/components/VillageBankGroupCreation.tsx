
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, Plus, X, UserPlus, Phone, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Member {
  id: string;
  name: string;
  phone: string;
  status: 'invited' | 'joined';
}

interface VillageBankGroupCreationProps {
  onBack: () => void;
  onGroupCreated?: (group: any) => void;
}

export const VillageBankGroupCreation = ({ onBack, onGroupCreated }: VillageBankGroupCreationProps) => {
  const { toast } = useToast();
  const [groupForm, setGroupForm] = useState({
    name: '',
    description: '',
    targetAmount: '',
    contributionAmount: '',
    frequency: 'weekly'
  });
  const [members, setMembers] = useState<Member[]>([]);
  const [memberForm, setMemberForm] = useState({
    name: '',
    phone: ''
  });

  const addMember = () => {
    if (!memberForm.name || !memberForm.phone) {
      toast({
        title: 'Error',
        description: 'Please enter both name and phone number',
        variant: 'destructive'
      });
      return;
    }

    if (members.find(m => m.phone === memberForm.phone)) {
      toast({
        title: 'Error',
        description: 'Member with this phone number already added',
        variant: 'destructive'
      });
      return;
    }

    const newMember: Member = {
      id: Date.now().toString(),
      name: memberForm.name,
      phone: memberForm.phone,
      status: 'invited'
    };

    setMembers([...members, newMember]);
    setMemberForm({ name: '', phone: '' });
    
    toast({
      title: 'Member Added',
      description: `${memberForm.name} has been added to the group`,
    });
  };

  const removeMember = (memberId: string) => {
    setMembers(members.filter(m => m.id !== memberId));
  };

  const createGroup = () => {
    if (!groupForm.name || !groupForm.targetAmount || !groupForm.contributionAmount) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    if (members.length === 0) {
      toast({
        title: 'Error',
        description: 'Please add at least one member to the group',
        variant: 'destructive'
      });
      return;
    }

    const newGroup = {
      id: Date.now().toString(),
      name: groupForm.name,
      description: groupForm.description,
      targetAmount: parseFloat(groupForm.targetAmount),
      contributionAmount: parseFloat(groupForm.contributionAmount),
      frequency: groupForm.frequency,
      members: members,
      currentAmount: 0,
      createdAt: new Date().toISOString(),
      status: 'active',
      adminId: 'current-user' // In real app, this would be the current user's ID
    };

    if (onGroupCreated) {
      onGroupCreated(newGroup);
    }

    toast({
      title: 'Group Created Successfully!',
      description: `${groupForm.name} has been created with ${members.length} members. Invitations will be sent via SMS.`,
    });

    // Reset form
    setGroupForm({
      name: '',
      description: '',
      targetAmount: '',
      contributionAmount: '',
      frequency: 'weekly'
    });
    setMembers([]);
    
    // Go back to village bank section
    onBack();
  };

  return (
    <div className="space-y-6 pb-24">
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
        <div>
          <h2 className="text-xl font-bold text-white">Create Village Bank Group</h2>
          <p className="text-sm text-white/70">Set up your savings group and invite members</p>
        </div>
      </div>

      {/* Group Details Form */}
      <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Group Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
            <Label className="text-white text-sm">Description</Label>
            <Textarea
              value={groupForm.description}
              onChange={(e) => setGroupForm({...groupForm, description: e.target.value})}
              className="bg-gray-800 border-gray-600 text-white mt-1"
              placeholder="Describe the purpose of your savings group"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-white text-sm">Target Amount (MWK) *</Label>
              <Input
                type="number"
                value={groupForm.targetAmount}
                onChange={(e) => setGroupForm({...groupForm, targetAmount: e.target.value})}
                className="bg-gray-800 border-gray-600 text-white mt-1"
                placeholder="100000"
              />
            </div>
            <div>
              <Label className="text-white text-sm">Contribution Amount (MWK) *</Label>
              <Input
                type="number"
                value={groupForm.contributionAmount}
                onChange={(e) => setGroupForm({...groupForm, contributionAmount: e.target.value})}
                className="bg-gray-800 border-gray-600 text-white mt-1"
                placeholder="5000"
              />
            </div>
          </div>

          <div>
            <Label className="text-white text-sm">Frequency</Label>
            <select
              value={groupForm.frequency}
              onChange={(e) => setGroupForm({...groupForm, frequency: e.target.value})}
              className="w-full bg-gray-800 border border-gray-600 text-white rounded-md px-3 py-2 mt-1"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="bi-weekly">Bi-weekly</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Add Members */}
      <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center">
            <UserPlus className="w-5 h-5 mr-2" />
            Add Members
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-white text-sm">Full Name</Label>
              <Input
                value={memberForm.name}
                onChange={(e) => setMemberForm({...memberForm, name: e.target.value})}
                className="bg-gray-800 border-gray-600 text-white mt-1"
                placeholder="Enter member name"
              />
            </div>
            <div>
              <Label className="text-white text-sm">Phone Number</Label>
              <Input
                value={memberForm.phone}
                onChange={(e) => setMemberForm({...memberForm, phone: e.target.value})}
                className="bg-gray-800 border-gray-600 text-white mt-1"
                placeholder="+265..."
              />
            </div>
          </div>
          
          <Button
            onClick={addMember}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Member
          </Button>
        </CardContent>
      </Card>

      {/* Members List */}
      {members.length > 0 && (
        <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center justify-between">
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Group Members ({members.length})
              </div>
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30">
                {members.length} invited
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {members.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-300" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{member.name}</p>
                      <p className="text-gray-400 text-xs flex items-center">
                        <Phone className="w-3 h-3 mr-1" />
                        {member.phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-400/30 text-xs">
                      {member.status}
                    </Badge>
                    <Button
                      onClick={() => removeMember(member.id)}
                      size="sm"
                      variant="ghost"
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-1"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Group Button */}
      <div className="flex space-x-3">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex-1 border-gray-600 text-white hover:bg-gray-700 hover:text-white"
        >
          Cancel
        </Button>
        <Button
          onClick={createGroup}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
        >
          <Users className="w-4 h-4 mr-2" />
          Create Group
        </Button>
      </div>
    </div>
  );
};
