import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, Plus, TrendingUp, UserPlus, Settings, ArrowUpRight, ArrowDownLeft, ArrowLeft, CheckCircle, XCircle, Clock, DollarSign } from 'lucide-react';
import { VillageBankDetails } from './VillageBankDetails';

interface VillageBankSectionProps {
  onBack?: () => void;
  onBalanceUpdate?: (currency: string, amount: number) => void;
  onTransactionUpdate?: (transaction: any) => void;
}

export const VillageBankSection = ({ onBack, onBalanceUpdate, onTransactionUpdate }: VillageBankSectionProps) => {
  const [selectedGroup, setSelectedGroup] = useState<any | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [activeSection, setActiveSection] = useState('groups');

  const [myGroups, setMyGroups] = useState([
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
      totalPool: 850000,
      nextMeeting: '2024-02-15',
      description: 'Local community savings group',
      isAdmin: false,
      maturityDate: '2024-12-15',
      isMatured: false
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
      totalPool: 2100000,
      nextMeeting: '2024-02-20',
      description: 'Business traders collaborative fund',
      isAdmin: true,
      maturityDate: '2024-08-20',
      isMatured: true
    }
  ]);

  const [loanRequests, setLoanRequests] = useState([
    {
      id: '1',
      groupId: '2',
      memberName: 'John Banda',
      amount: 50000,
      interestRate: 18,
      duration: 30, // days
      reason: 'Business expansion',
      status: 'pending',
      requestDate: '2024-02-10',
      paybackDate: '2024-03-12'
    },
    {
      id: '2',
      groupId: '2',
      memberName: 'Mary Phiri',
      amount: 75000,
      interestRate: 18,
      duration: 45,
      reason: 'School fees',
      status: 'approved',
      requestDate: '2024-02-08',
      paybackDate: '2024-03-25'
    }
  ]);

  const [activeLoans, setActiveLoans] = useState([
    {
      id: '1',
      groupId: '2',
      memberName: 'Mary Phiri',
      principalAmount: 75000,
      interestAmount: 13500,
      totalAmount: 88500,
      paidAmount: 0,
      dueDate: '2024-03-25',
      status: 'active'
    }
  ]);

  const recentTransactions = [
    { type: 'Contribution', amount: '+MWK 25,000', group: 'Chilomoni Savings', time: '2 hours ago' },
    { type: 'Loan Approved', amount: 'MWK 75,000', group: 'Traders Union', time: '1 day ago' },
    { type: 'Interest Earned', amount: '+MWK 3,500', group: 'Chilomoni Savings', time: '3 days ago' }
  ];

  const handleGroupClick = (group: any) => {
    setSelectedGroup(group);
    setShowDetails(true);
  };

  const handleCreateGroup = () => {
    // Navigate to village bank management/creation page
    window.location.hash = '#village-create';
    // You can also use React Router navigation here if using React Router
  };

  const handleUpdateGroup = (updatedGroup: any) => {
    setMyGroups(groups => 
      groups.map(g => g.id === updatedGroup.id ? updatedGroup : g)
    );
  };

  const handleLoanRequest = (requestId: string, action: 'approve' | 'decline') => {
    const request = loanRequests.find(r => r.id === requestId);
    if (!request) return;

    if (action === 'approve') {
      // Calculate loan details
      const interestAmount = (request.amount * request.interestRate / 100) * (request.duration / 365);
      const totalAmount = request.amount + interestAmount;
      const platformFee = request.amount * 0.03; // 3% platform fee on loans
      const netAmount = request.amount - platformFee;

      // Create active loan
      const newLoan = {
        id: Date.now().toString(),
        groupId: request.groupId,
        memberName: request.memberName,
        principalAmount: request.amount,
        interestAmount: interestAmount,
        totalAmount: totalAmount,
        paidAmount: 0,
        dueDate: request.paybackDate,
        status: 'active' as const
      };

      setActiveLoans(prev => [...prev, newLoan]);

      // Credit member's wallet (simulation)
      if (onBalanceUpdate) {
        onBalanceUpdate('MWK', netAmount);
      }

      if (onTransactionUpdate) {
        onTransactionUpdate({
          type: 'Loan Approved',
          amount: `+MWK ${netAmount.toLocaleString()}`,
          description: `Loan approved from group (Fee: MWK ${platformFee.toLocaleString()})`,
          time: 'Just now',
          status: 'completed'
        });
      }
    }

    // Update request status
    setLoanRequests(prev => 
      prev.map(r => r.id === requestId ? { ...r, status: action === 'approve' ? 'approved' : 'declined' } : r)
    );
  };

  const processLoanRepayment = (loanId: string) => {
    const loan = activeLoans.find(l => l.id === loanId);
    if (!loan) return;

    // Mark loan as paid
    setActiveLoans(prev => 
      prev.map(l => l.id === loanId ? { ...l, status: 'completed', paidAmount: l.totalAmount } : l)
    );

    // Distribute interest to group members (simulation)
    const group = myGroups.find(g => g.id === loan.groupId);
    if (group) {
      const interestPerMember = loan.interestAmount / group.members;
      
      if (onTransactionUpdate) {
        onTransactionUpdate({
          type: 'Interest Earned',
          amount: `+MWK ${interestPerMember.toLocaleString()}`,
          description: `Interest from ${loan.memberName}'s loan repayment`,
          time: 'Just now',
          status: 'completed'
        });
      }
    }
  };

  const handleGroupMaturity = (groupId: string) => {
    const group = myGroups.find(g => g.id === groupId);
    if (!group || !group.isMatured) return;

    // Auto-distribute savings to members based on contributions
    const memberShare = group.myContribution + (group.myContribution * group.interestRate / 100);
    
    if (onBalanceUpdate) {
      onBalanceUpdate('MWK', memberShare);
    }

    if (onTransactionUpdate) {
      onTransactionUpdate({
        type: 'Group Maturity Payout',
        amount: `+MWK ${memberShare.toLocaleString()}`,
        description: `Automatic payout from ${group.name} maturity`,
        time: 'Just now',
        status: 'completed'
      });
    }

    // Remove group after payout
    setMyGroups(prev => prev.filter(g => g.id !== groupId));
  };

  if (showDetails && selectedGroup) {
    return (
      <VillageBankDetails
        group={selectedGroup}
        onBack={() => {
          setShowDetails(false);
          setSelectedGroup(null);
        }}
        onUpdateGroup={handleUpdateGroup}
        loanRequests={loanRequests.filter(r => r.groupId === selectedGroup.id)}
        onLoanAction={handleLoanRequest}
      />
    );
  }

  return (
    <div className="space-y-4 pb-24">
      {/* Header with Back Button */}
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
          <h2 className="text-lg sm:text-2xl font-bold text-white">Village Bank</h2>
        </div>
      )}

      {/* Section Navigation */}
      <div className="flex space-x-1 bg-gray-800/50 p-1 rounded-lg">
        <Button
          onClick={() => setActiveSection('groups')}
          className={`flex-1 text-xs sm:text-sm ${activeSection === 'groups' 
            ? 'bg-blue-500 text-white' 
            : 'bg-transparent text-gray-300 hover:text-white'
          }`}
        >
          <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
          My Groups
        </Button>
        <Button
          onClick={() => setActiveSection('loans')}
          className={`flex-1 text-xs sm:text-sm ${activeSection === 'loans' 
            ? 'bg-blue-500 text-white' 
            : 'bg-transparent text-gray-300 hover:text-white'
          }`}
        >
          <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
          Loan Management
        </Button>
      </div>

      {activeSection === 'groups' && (
        <>
          {/* My Groups Overview */}
          <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-sm sm:text-base">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  <span className="text-white">My Village Bank Groups</span>
                </div>
                <Button 
                  onClick={handleCreateGroup}
                  size="sm" 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-xs"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Create
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                {myGroups.map((group) => (
                  <div 
                    key={group.id} 
                    className="p-3 sm:p-4 rounded-lg bg-gray-800/60 hover:bg-gray-700/60 transition-colors border border-gray-600/50 cursor-pointer"
                    onClick={() => handleGroupClick(group)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white text-sm sm:text-base truncate">{group.name}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          className={group.role === 'Admin' ? 'bg-accent/20 text-accent text-xs' : 'bg-primary/20 text-primary text-xs'}
                        >
                          {group.role}
                        </Badge>
                        {group.isMatured && (
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleGroupMaturity(group.id);
                            }}
                            className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1"
                          >
                            Collect
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Members</span>
                        <span className="text-white">{group.members}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-300">Total Pool</span>
                        <span className="font-semibold text-white">MWK {group.totalSavings.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-300">My Share</span>
                        <span className="font-semibold text-accent">MWK {group.myContribution.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-300">Interest</span>
                        <span className="text-green-400">{group.interestRate}% p.a.</span>
                      </div>

                      <div className="flex justify-between col-span-2">
                        <span className="text-gray-300">Status</span>
                        <span className={group.isMatured ? 'text-green-400' : 'text-orange-400'}>
                          {group.isMatured ? 'Matured - Ready for payout' : 'Active'}
                        </span>
                      </div>
                    </div>
                    
                    <Progress 
                      value={(group.myContribution / group.totalSavings) * 100} 
                      className="h-1 mt-2"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {activeSection === 'loans' && (
        <>
          {/* Admin Loan Management */}
          <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-sm sm:text-base">Loan Requests (Admin Dashboard)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {loanRequests.filter(r => r.status === 'pending').map((request) => (
                  <div key={request.id} className="p-3 rounded-lg bg-gray-800/50 border border-gray-600/30">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h5 className="font-medium text-white text-sm">{request.memberName}</h5>
                        <p className="text-xs text-gray-400">{request.reason}</p>
                      </div>
                      <Badge className="bg-yellow-500/20 text-yellow-300 text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                      <div>
                        <span className="text-gray-300">Amount: </span>
                        <span className="text-white font-medium">MWK {request.amount.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-300">Interest: </span>
                        <span className="text-white">{request.interestRate}%</span>
                      </div>
                      <div>
                        <span className="text-gray-300">Duration: </span>
                        <span className="text-white">{request.duration} days</span>
                      </div>
                      <div>
                        <span className="text-gray-300">Due: </span>
                        <span className="text-white">{request.paybackDate}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleLoanRequest(request.id, 'approve')}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleLoanRequest(request.id, 'decline')}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs"
                      >
                        <XCircle className="w-3 h-3 mr-1" />
                        Decline
                      </Button>
                    </div>
                  </div>
                ))}
                
                {loanRequests.filter(r => r.status === 'pending').length === 0 && (
                  <div className="text-center py-4">
                    <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">No pending loan requests</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Active Loans */}
          <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-sm sm:text-base">Active Loans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activeLoans.filter(l => l.status === 'active').map((loan) => (
                  <div key={loan.id} className="p-3 rounded-lg bg-gray-800/50 border border-gray-600/30">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-white text-sm">{loan.memberName}</h5>
                      <Badge className="bg-orange-500/20 text-orange-300 text-xs">Active</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                      <div>
                        <span className="text-gray-300">Principal: </span>
                        <span className="text-white">MWK {loan.principalAmount.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-300">Interest: </span>
                        <span className="text-white">MWK {loan.interestAmount.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-300">Total Due: </span>
                        <span className="text-white font-semibold">MWK {loan.totalAmount.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-300">Due Date: </span>
                        <span className="text-white">{loan.dueDate}</span>
                      </div>
                    </div>
                    
                    <Button
                      size="sm"
                      onClick={() => processLoanRepayment(loan.id)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs"
                    >
                      Mark as Paid
                    </Button>
                  </div>
                ))}
                
                {activeLoans.filter(l => l.status === 'active').length === 0 && (
                  <div className="text-center py-4">
                    <DollarSign className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">No active loans</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Recent Village Bank Activity */}
      <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-sm sm:text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTransactions.map((transaction, index) => (
              <div key={index} className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-gray-800/60 hover:bg-gray-700/60 transition-colors">
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                  <div className="flex-shrink-0">
                    {transaction.type === 'Contribution' ? (
                      <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                    ) : transaction.type.includes('Interest') ? (
                      <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-accent" />
                    ) : (
                      <ArrowDownLeft className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-white text-xs sm:text-sm truncate">{transaction.type}</p>
                    <p className="text-xs text-gray-400 truncate">{transaction.group}</p>
                  </div>
                </div>
                <div className="text-right ml-2">
                  <p className={`font-semibold text-xs sm:text-sm ${
                    transaction.amount.startsWith('+') ? 'text-green-400' : 'text-white'
                  }`}>
                    {transaction.amount}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-400">{transaction.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
