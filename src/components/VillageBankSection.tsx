
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Users, PiggyBank, TrendingUp, Calendar, Plus, UserPlus, Coins } from 'lucide-react';
import { VillageBankGroupCreation } from '@/components/VillageBankGroupCreation';

interface VillageBankSectionProps {
  onBack: () => void;
  onBalanceUpdate?: (currency: string, amount: number) => void;
  onTransactionUpdate?: (transaction: any) => void;
}

export const VillageBankSection = ({ onBack, onBalanceUpdate, onTransactionUpdate }: VillageBankSectionProps) => {
  const [activeView, setActiveView] = useState<'main' | 'create'>('main');
  const [groups, setGroups] = useState([
    {
      id: '1',
      name: 'Women Empowerment Group',
      description: 'Supporting women entrepreneurs in our community',
      members: 12,
      targetAmount: 500000,
      currentAmount: 285000,
      contributionAmount: 5000,
      frequency: 'weekly',
      nextContribution: '2024-01-15',
      status: 'active'
    },
    {
      id: '2',
      name: 'Farmers Cooperative',
      description: 'Agricultural investment and support group',
      members: 8,
      targetAmount: 800000,
      currentAmount: 120000,
      contributionAmount: 10000,
      frequency: 'monthly',
      nextContribution: '2024-01-20',
      status: 'active'
    }
  ]);

  const handleGroupCreated = (newGroup: any) => {
    setGroups([...groups, newGroup]);
    setActiveView('main');
  };

  if (activeView === 'create') {
    return (
      <VillageBankGroupCreation 
        onBack={() => setActiveView('main')}
        onGroupCreated={handleGroupCreated}
      />
    );
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
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
          <div>
            <h2 className="text-xl font-bold text-white">Village Banking</h2>
            <p className="text-sm text-white/70">Community savings and support groups</p>
          </div>
        </div>
        <Button
          onClick={() => setActiveView('create')}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Group
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-green-900/50 to-emerald-800/30 backdrop-blur-xl border-green-700/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 text-sm">Total Groups</p>
                <p className="text-2xl font-bold text-white">{groups.length}</p>
              </div>
              <Users className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-900/50 to-cyan-800/30 backdrop-blur-xl border-blue-700/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Total Saved</p>
                <p className="text-2xl font-bold text-white">MWK {groups.reduce((sum, group) => sum + group.currentAmount, 0).toLocaleString()}</p>
              </div>
              <PiggyBank className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900/50 to-pink-800/30 backdrop-blur-xl border-purple-700/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm">Total Members</p>
                <p className="text-2xl font-bold text-white">{groups.reduce((sum, group) => sum + group.members, 0)}</p>
              </div>
              <UserPlus className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Groups List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Your Groups</h3>
        
        {groups.length === 0 ? (
          <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50">
            <CardContent className="p-8 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No Groups Yet</h3>
              <p className="text-gray-400 mb-4">Create your first village banking group to start saving together</p>
              <Button
                onClick={() => setActiveView('create')}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Group
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {groups.map((group) => (
              <Card key={group.id} className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50 hover:border-gray-600/50 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-base">{group.name}</CardTitle>
                    <Badge className="bg-green-500/20 text-green-300 border-green-400/30">
                      {group.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400">{group.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-white">
                        MWK {group.currentAmount.toLocaleString()} / {group.targetAmount.toLocaleString()}
                      </span>
                    </div>
                    <Progress 
                      value={(group.currentAmount / group.targetAmount) * 100} 
                      className="h-2"
                    />
                  </div>

                  {/* Group Details */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-300">{group.members} members</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Coins className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300">MWK {group.contributionAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-purple-400" />
                      <span className="text-gray-300">{group.frequency}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-yellow-400" />
                      <span className="text-gray-300">
                        {Math.round((group.currentAmount / group.targetAmount) * 100)}% complete
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-2">
                    <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                      Contribute
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 border-gray-600 text-white hover:bg-gray-700">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
