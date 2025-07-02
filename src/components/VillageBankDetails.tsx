
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Users, Plus, UserCheck, UserX, ArrowLeft, MessageCircle, DollarSign, Calendar } from 'lucide-react';

interface VillageBankDetailsProps {
  group: any;
  onBack: () => void;
  onUpdateGroup: (updatedGroup: any) => void;
}

export const VillageBankDetails = ({ group, onBack, onUpdateGroup }: VillageBankDetailsProps) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [showAddMember, setShowAddMember] = useState(false);
  const [showContribution, setShowContribution] = useState(false);
  const [showLoanRequest, setShowLoanRequest] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');
  const [contributionAmount, setContributionAmount] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [chatMessage, setChatMessage] = useState('');

  const [members] = useState([
    { id: 1, name: 'John Banda', phone: '+265999123456', contribution: 50000, hasLoan: false, status: 'Active' },
    { id: 2, name: 'Mary Phiri', phone: '+265888234567', contribution: 45000, hasLoan: true, loanAmount: 75000, status: 'Active' },
    { id: 3, name: 'Peter Tembo', phone: '+265777345678', contribution: 60000, hasLoan: false, status: 'Active' },
  ]);

  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'John Banda', message: 'Good morning everyone! Ready for today\'s meeting?', time: '09:00 AM' },
    { id: 2, sender: 'Mary Phiri', message: 'Yes, I have my contribution ready', time: '09:05 AM' },
    { id: 3, sender: 'Admin', message: 'Meeting starts in 10 minutes. Please be ready.', time: '09:20 AM' },
  ]);

  const handleAddMember = () => {
    if (!newMemberName || !newMemberPhone) {
      alert('Please fill in all fields');
      return;
    }
    
    // Simulate checking if member is registered
    const isRegistered = Math.random() > 0.5; // Random for demo
    
    if (!isRegistered) {
      alert('This member is not registered on the platform. Please invite them via the Invite tab first.');
      return;
    }

    alert(`Member ${newMemberName} added successfully!`);
    setNewMemberName('');
    setNewMemberPhone('');
    setShowAddMember(false);
  };

  const handleContribution = () => {
    if (!contributionAmount) {
      alert('Please enter contribution amount');
      return;
    }
    
    const amount = parseFloat(contributionAmount);
    const updatedGroup = {
      ...group,
      myContribution: group.myContribution + amount,
      totalPool: group.totalPool + amount
    };
    
    onUpdateGroup(updatedGroup);
    alert(`Contribution of MWK ${amount.toLocaleString()} recorded successfully!`);
    setContributionAmount('');
    setShowContribution(false);
  };

  const handleLoanRequest = () => {
    if (!loanAmount) {
      alert('Please enter loan amount');
      return;
    }
    
    const amount = parseFloat(loanAmount);
    const maxLoan = group.myContribution * 3;
    
    if (amount > maxLoan) {
      alert(`Maximum loan amount is MWK ${maxLoan.toLocaleString()} (3x your contribution)`);
      return;
    }
    
    alert(`Loan request of MWK ${amount.toLocaleString()} submitted for approval!`);
    setLoanAmount('');
    setShowLoanRequest(false);
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    
    const newMessage = {
      id: chatMessages.length + 1,
      sender: 'You',
      message: chatMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatMessages([...chatMessages, newMessage]);
    setChatMessage('');
  };

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
            <h2 className="text-2xl font-bold text-white">{group.name}</h2>
            <p className="text-gray-400">Group Management</p>
          </div>
        </div>
        <Badge className="bg-green-500/20 text-green-300 border-green-400/30">
          {group.status}
        </Badge>
      </div>

      {/* Navigation */}
      <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50">
        <CardContent className="p-4">
          <div className="flex space-x-2 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: Users },
              { id: 'members', label: 'Members', icon: UserCheck },
              { id: 'contributions', label: 'Contributions', icon: DollarSign },
              { id: 'chat', label: 'Group Chat', icon: MessageCircle }
            ].map((tab) => (
              <Button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`flex items-center space-x-2 whitespace-nowrap ${
                  activeSection === tab.id
                    ? 'bg-blue-600/60 border-blue-400/50 text-white'
                    : 'bg-gray-800/60 text-gray-300 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Content based on active section */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50">
            <CardHeader>
              <CardTitle className="text-white">Group Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{group.members}</p>
                  <p className="text-gray-400">Total Members</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">MWK {group.totalPool.toLocaleString()}</p>
                  <p className="text-gray-400">Total Pool</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">MWK {group.myContribution.toLocaleString()}</p>
                  <p className="text-gray-400">My Contribution</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{group.nextMeeting}</p>
                  <p className="text-gray-400">Next Meeting</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={() => setShowContribution(true)}
              className="h-20 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
            >
              <Plus className="w-6 h-6 mr-2" />
              Make Contribution
            </Button>
            <Button
              onClick={() => setShowLoanRequest(true)}
              className="h-20 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
            >
              <DollarSign className="w-6 h-6 mr-2" />
              Request Loan
            </Button>
          </div>
        </div>
      )}

      {activeSection === 'members' && (
        <div className="space-y-4">
          {group.isAdmin && (
            <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Member Management</h3>
                  <Button
                    onClick={() => setShowAddMember(true)}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Member
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {members.map((member) => (
            <Card key={member.id} className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-white">{member.name}</h4>
                    <p className="text-gray-400 text-sm">{member.phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white">MWK {member.contribution.toLocaleString()}</p>
                    <div className="flex items-center space-x-2">
                      <Badge className={`text-xs ${
                        member.status === 'Active' 
                          ? 'bg-green-500/20 text-green-300 border-green-400/30'
                          : 'bg-gray-500/20 text-gray-300 border-gray-400/30'
                      }`}>
                        {member.status}
                      </Badge>
                      {member.hasLoan && (
                        <Badge className="bg-orange-500/20 text-orange-300 border-orange-400/30 text-xs">
                          Loan: MWK {member.loanAmount?.toLocaleString()}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeSection === 'contributions' && (
        <div className="space-y-4">
          <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50">
            <CardHeader>
              <CardTitle className="text-white">Contribution History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
                    <div>
                      <p className="font-medium text-white">{member.name}</p>
                      <p className="text-gray-400 text-sm">Total Contribution</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white">MWK {member.contribution.toLocaleString()}</p>
                      <p className="text-gray-400 text-xs">Up to date</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeSection === 'chat' && (
        <div className="space-y-4">
          <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <MessageCircle className="w-5 h-5" />
                <span>Group Chat</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto mb-4">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`p-3 rounded-lg ${
                    msg.sender === 'You' 
                      ? 'bg-blue-600/20 ml-8' 
                      : 'bg-gray-800/50 mr-8'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-white text-sm">{msg.sender}</p>
                      <p className="text-gray-400 text-xs">{msg.time}</p>
                    </div>
                    <p className="text-gray-300 text-sm">{msg.message}</p>
                  </div>
                ))}
              </div>
              
              <div className="flex space-x-2">
                <Input
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="bg-gray-800/60 border-gray-600/50 text-white"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button
                  onClick={handleSendMessage}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                >
                  Send
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Member Modal */}
      <Dialog open={showAddMember} onOpenChange={setShowAddMember}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Add New Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Member Name</label>
              <Input
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                placeholder="Enter member name"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Phone Number</label>
              <Input
                value={newMemberPhone}
                onChange={(e) => setNewMemberPhone(e.target.value)}
                placeholder="+265999123456"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div className="bg-gray-700/50 p-3 rounded-lg">
              <p className="text-sm text-gray-300">
                Note: Member must be registered on the platform. If not registered, please use the 
                <Button variant="link" className="text-blue-400 p-0 h-auto ml-1">
                  Invite tab
                </Button> to invite them first.
              </p>
            </div>
            <Button 
              onClick={handleAddMember}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              Add Member
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contribution Modal */}
      <Dialog open={showContribution} onOpenChange={setShowContribution}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Make Contribution</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Contribution Amount (MWK)</label>
              <Input
                type="number"
                value={contributionAmount}
                onChange={(e) => setContributionAmount(e.target.value)}
                placeholder="Enter amount"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <Button 
              onClick={handleContribution}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            >
              Contribute MWK {contributionAmount ? parseFloat(contributionAmount).toLocaleString() : '0'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Loan Request Modal */}
      <Dialog open={showLoanRequest} onOpenChange={setShowLoanRequest}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Request Loan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gray-700/50 p-3 rounded-lg">
              <p className="text-sm text-gray-300">
                Maximum loan amount: MWK {(group.myContribution * 3).toLocaleString()} 
                <span className="text-gray-400"> (3x your contribution)</span>
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Loan Amount (MWK)</label>
              <Input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                placeholder="Enter loan amount"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <Button 
              onClick={handleLoanRequest}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
            >
              Request Loan MWK {loanAmount ? parseFloat(loanAmount).toLocaleString() : '0'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
