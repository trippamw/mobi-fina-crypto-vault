
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, DollarSign, Calendar, Target } from 'lucide-react';

interface VillageBankDetailsProps {
  group: any;
  onBack: () => void;
  onJoin?: (groupId: string) => void;
}

export const VillageBankDetails = ({ group, onBack, onJoin }: VillageBankDetailsProps) => {
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
        <h2 className="text-2xl font-bold text-white">Group Details</h2>
      </div>

      {/* Group Information */}
      <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white text-xl">{group.name}</CardTitle>
          <Badge 
            className={`w-fit ${
              group.status === 'Active' 
                ? 'bg-green-500/20 text-green-300' 
                : 'bg-yellow-500/20 text-yellow-300'
            }`}
          >
            {group.status}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-300">{group.description}</p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-blue-400" />
              <div>
                <p className="text-gray-300 text-sm">Members</p>
                <p className="text-white font-semibold">{group.members}/{group.maxMembers}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-green-400" />
              <div>
                <p className="text-gray-300 text-sm">Pool Amount</p>
                <p className="text-white font-semibold">MWK {group.poolAmount?.toLocaleString() || '0'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-purple-400" />
              <div>
                <p className="text-gray-300 text-sm">Meeting Schedule</p>
                <p className="text-white font-semibold">{group.meetingSchedule}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-orange-400" />
              <div>
                <p className="text-gray-300 text-sm">Contribution</p>
                <p className="text-white font-semibold">MWK {group.contributionAmount?.toLocaleString() || '0'}</p>
              </div>
            </div>
          </div>

          {group.requirements && (
            <div>
              <h3 className="text-white font-semibold mb-2">Requirements</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                {group.requirements.map((requirement: string, index: number) => (
                  <li key={index}>• {requirement}</li>
                ))}
              </ul>
            </div>
          )}

          {onJoin && group.status === 'Open' && (
            <Button
              onClick={() => onJoin(group.id)}
              className="w-full bg-white hover:bg-gray-100 text-gray-900 font-semibold"
            >
              Join Group
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
