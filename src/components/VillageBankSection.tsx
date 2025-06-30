
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, Plus, TrendingUp, Banknote, UserPlus, Settings, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export const VillageBankSection = () => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  const myGroups = [
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
  ];

  const withdrawalMethods = [
    { name: 'Mobile Money (TNM)', fee: '1%', icon: '📱' },
    { name: 'Mobile Money (Airtel)', fee: '1%', icon: '📱' },
    { name: 'Mobile Money (MO626)', fee: '1%', icon: '📱' },
    { name: 'Bank Transfer', fee: '0.5%', icon: '🏦', description: 'All available banks in Malawi' },
    { name: 'Agent Withdrawal', fee: '2%', icon: '👤' },
    { name: 'Card Withdrawal', fee: 'Free', icon: '💳' }
  ];

  const recentTransactions = [
    { type: 'Contribution', amount: '+MWK 25,000', group: 'Chilomoni Savings', time: '2 hours ago' },
    { type: 'Loan Request', amount: 'MWK 50,000', group: 'Traders Union', time: '1 day ago' },
    { type: 'Interest Earned', amount: '+MWK 3,500', group: 'Chilomoni Savings', time: '3 days ago' }
  ];

  return (
    <div className="space-y-6">
      {/* My Groups Overview */}
      <Card className="gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-primary" />
              <span>My Village Bank Groups</span>
            </div>
            <Button className="gradient-primary text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Group
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myGroups.map((group) => (
              <div key={group.id} className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">{group.name}</h4>
                  <Badge 
                    className={group.role === 'Admin' ? 'bg-accent/20 text-accent' : 'bg-primary/20 text-primary'}
                  >
                    {group.role}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Members</span>
                    <span>{group.members}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Total Savings</span>
                    <span className="font-semibold">MWK {group.totalSavings.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>My Contribution</span>
                    <span className="font-semibold text-accent">MWK {group.myContribution.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Interest Rate</span>
                    <span className="text-green-400">{group.interestRate}% p.a.</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>Minimum Duration</span>
                    <span className="text-orange-400">{group.duration}</span>
                  </div>
                  
                  <Progress 
                    value={(group.myContribution / group.totalSavings) * 100} 
                    className="h-2"
                  />
                  
                  <div className="flex space-x-2 mt-3">
                    <Button size="sm" variant="outline" className="flex-1">
                      Contribute
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      Request Loan
                    </Button>
                    {group.role === 'Admin' && (
                      <Button size="sm" variant="outline">
                        <Settings className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create New Group */}
      <Card className="gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserPlus className="w-5 h-5 text-accent" />
            <span>Create New Village Bank Group</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Group Name</label>
                <Input placeholder="Enter group name" className="bg-white/5 border-white/10" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Interest Rate (%)</label>
                <Input placeholder="e.g. 15" type="number" className="bg-white/5 border-white/10" />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Input placeholder="Describe the purpose of your group" className="bg-white/5 border-white/10" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Minimum Contribution</label>
                <Input placeholder="MWK 10,000" className="bg-white/5 border-white/10" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Maximum Members</label>
                <Input placeholder="e.g. 50" type="number" className="bg-white/5 border-white/10" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Minimum Duration</label>
              <Input placeholder="e.g. 30 days" className="bg-white/5 border-white/10" />
            </div>
            
            <Button className="w-full gradient-secondary text-white">
              Create Group
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Withdrawal Methods */}
      <Card className="gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Banknote className="w-5 h-5 text-green-400" />
            <span>Withdrawal Methods</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {withdrawalMethods.map((method, index) => (
              <div key={index} className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-2xl">{method.icon}</span>
                  <div>
                    <h5 className="font-medium">{method.name}</h5>
                    {method.description && (
                      <p className="text-xs text-muted-foreground">{method.description}</p>
                    )}
                    <p className="text-sm text-accent">Fee: {method.fee}</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="w-full">
                  Select
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Village Bank Activity */}
      <Card className="gradient-card border-border/50">
        <CardHeader>
          <CardTitle>Recent Village Bank Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.map((transaction, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {transaction.type === 'Contribution' ? (
                      <ArrowUpRight className="w-4 h-4 text-green-400" />
                    ) : transaction.type === 'Interest Earned' ? (
                      <TrendingUp className="w-4 h-4 text-accent" />
                    ) : (
                      <ArrowDownLeft className="w-4 h-4 text-yellow-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.type}</p>
                    <p className="text-sm text-muted-foreground">{transaction.group}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.amount.startsWith('+') ? 'text-green-400' : 'text-foreground'
                  }`}>
                    {transaction.amount}
                  </p>
                  <p className="text-xs text-muted-foreground">{transaction.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
