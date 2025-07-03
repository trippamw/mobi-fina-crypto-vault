import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Settings, Bell, Shield, CreditCard, HelpCircle, LogOut, ArrowLeft } from 'lucide-react';

interface UserProfileProps {
  onBack?: () => void;
}

export const UserProfile = ({ onBack }: UserProfileProps) => {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 555-123-4567',
    address: '123 Main St, Anytown',
    country: 'USA'
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [securityQuestionsEnabled, setSecurityQuestionsEnabled] = useState(false);
  const [language, setLanguage] = useState('English');

  const languages = ['English', 'Spanish', 'French', 'German'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-24">
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
          <h2 className="text-2xl font-bold text-white">Profile</h2>
        </div>
      )}

      {/* Profile Information */}
      <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-white">Name</Label>
            <Input
              id="name"
              name="name"
              value={profile.name}
              onChange={handleInputChange}
              className="bg-gray-800/60 border-gray-600/50 text-white placeholder-gray-400"
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-white">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={profile.email}
              onChange={handleInputChange}
              className="bg-gray-800/60 border-gray-600/50 text-white placeholder-gray-400"
            />
          </div>
          <div>
            <Label htmlFor="phone" className="text-white">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={profile.phone}
              onChange={handleInputChange}
              className="bg-gray-800/60 border-gray-600/50 text-white placeholder-gray-400"
            />
          </div>
          <div>
            <Label htmlFor="address" className="text-white">Address</Label>
            <Input
              id="address"
              name="address"
              value={profile.address}
              onChange={handleInputChange}
              className="bg-gray-800/60 border-gray-600/50 text-white placeholder-gray-400"
            />
          </div>
          <div>
            <Label htmlFor="country" className="text-white">Country</Label>
            <Input
              id="country"
              name="country"
              value={profile.country}
              onChange={handleInputChange}
              className="bg-gray-800/60 border-gray-600/50 text-white placeholder-gray-400"
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white">Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications" className="text-white">Enable Notifications</Label>
            <Switch id="notifications" checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="securityQuestions" className="text-white">Enable Security Questions</Label>
            <Switch id="securityQuestions" checked={securityQuestionsEnabled} onCheckedChange={setSecurityQuestionsEnabled} />
          </div>
        </CardContent>
      </Card>

      {/* App Settings */}
      <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white">App Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-white">Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="bg-gray-800/60 border-gray-600/50 text-white">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                {languages.map((lang) => (
                  <SelectItem key={lang} value={lang} className="text-white">{lang}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Logout */}
      <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-2xl">
        <CardContent>
          <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
