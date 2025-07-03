
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User, Settings, Bell, Shield, CreditCard, HelpCircle, LogOut, ArrowLeft, FileText, MessageCircle, Eye, Upload, Download, Globe } from 'lucide-react';

interface UserProfileProps {
  onBack?: () => void;
}

export const UserProfile = ({ onBack }: UserProfileProps) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [showChatBot, setShowChatBot] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', message: 'Hello! How can I help you today?' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [language, setLanguage] = useState('English');

  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+265 123 456 789',
    address: '123 Main St, Lilongwe',
    dateOfBirth: '1990-01-01',
    nationality: 'Malawian',
    occupation: 'Software Engineer',
    idNumber: 'ID123456789',
    kycStatus: 'Verified'
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: true,
    notificationsEnabled: true,
    biometricEnabled: false,
    loginAlerts: true
  });

  const [complianceData, setComplianceData] = useState({
    kycLevel: 'Level 3',
    amlStatus: 'Compliant',
    lastReview: '2024-01-15',
    riskRating: 'Low'
  });

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ny', name: 'Chichewa' },
    { code: 'sw', name: 'Swahili' }
  ];

  const translations = {
    en: {
      profile: 'Profile',
      personalInfo: 'Personal Information',
      security: 'Security',
      ekyc: 'e-KYC',
      settings: 'Settings',
      compliance: 'Compliance',
      help: 'Help',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      dateOfBirth: 'Date of Birth',
      nationality: 'Nationality',
      occupation: 'Occupation',
      idNumber: 'ID Number',
      language: 'Language',
      logout: 'Logout',
      save: 'Save Changes',
      uploadDocument: 'Upload Document',
      downloadStatement: 'Download Statement',
      liveChatAssistant: 'Live AI Chat Assistant',
      frequentlyAskedQuestions: 'Frequently Asked Questions',
      termsAndConditions: 'Terms and Conditions',
      privacyPolicy: 'Privacy Policy'
    },
    ny: {
      profile: 'Mbiri',
      personalInfo: 'Zambiri Za Munthu',
      security: 'Chitetezo',
      ekyc: 'e-KYC',
      settings: 'Makonzedwe',
      compliance: 'Kutsatira Malamulo',
      help: 'Thandizo',
      firstName: 'Dzina Loyamba',
      lastName: 'Dzina Lomaliza',
      email: 'Imelo',
      phone: 'Nambala Ya Foni',
      address: 'Adilesi',
      dateOfBirth: 'Tsiku Lobadwa',
      nationality: 'Dziko',
      occupation: 'Ntchito',
      idNumber: 'Nambala Ya ID',
      language: 'Chilankhulo',
      logout: 'Tuluka',
      save: 'Sunga Zosintha',
      uploadDocument: 'Kweza Chikalata',
      downloadStatement: 'Tsitsa Statement',
      liveChatAssistant: 'Wothandizira AI',
      frequentlyAskedQuestions: 'Mafunso Ofunsidwa Kawirikawiri',
      termsAndConditions: 'Malamulo ndi Zikondwerero',
      privacyPolicy: 'Ndondomeko Ya Chinsinsi'
    },
    sw: {
      profile: 'Wasifu',
      personalInfo: 'Maelezo ya Kibinafsi',
      security: 'Usalama',
      ekyc: 'e-KYC',
      settings: 'Mipangilio',
      compliance: 'Utii',
      help: 'Msaada',
      firstName: 'Jina la Kwanza',
      lastName: 'Jina la Mwisho',
      email: 'Barua Pepe',
      phone: 'Nambari ya Simu',
      address: 'Anwani',
      dateOfBirth: 'Tarehe ya Kuzaliwa',
      nationality: 'Uraia',
      occupation: 'Kazi',
      idNumber: 'Nambari ya Kitambulisho',
      language: 'Lugha',
      logout: 'Ondoka',
      save: 'Hifadhi Mabadiliko',
      uploadDocument: 'Pakia Hati',
      downloadStatement: 'Pakua Taarifa',
      liveChatAssistant: 'Msaidizi wa AI',
      frequentlyAskedQuestions: 'Maswali Yanayoulizwa Mara Kwa Mara',
      termsAndConditions: 'Sheria na Masharti',
      privacyPolicy: 'Sera ya Faragha'
    }
  };

  const t = translations[language.toLowerCase() === 'chichewa' ? 'ny' : language.toLowerCase() === 'swahili' ? 'sw' : 'en'];

  const handleInputChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSecurityChange = (field: string, value: boolean) => {
    setSecuritySettings(prev => ({ ...prev, [field]: value }));
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    // In a real app, this would trigger a full UI translation
    alert(`Language changed to ${newLanguage}. App interface updated.`);
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    setChatMessages(prev => [...prev, { sender: 'user', message: newMessage }]);
    
    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I understand your concern. Let me help you with that.",
        "Thank you for your question. Here's what I recommend:",
        "I can assist you with this issue. Please provide more details.",
        "Based on your query, I suggest the following steps:",
        "I'm here to help! Can you be more specific about your needs?"
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setChatMessages(prev => [...prev, { sender: 'bot', message: randomResponse }]);
    }, 1000);

    setNewMessage('');
  };

  const faqData = [
    { 
      question: "How do I reset my password?", 
      answer: "Go to Security settings and click 'Change Password'. You'll need to verify your identity first." 
    },
    { 
      question: "What are the transaction limits?", 
      answer: "Daily limits vary by account type: Standard (MWK 500,000), Gold (MWK 2,000,000), Platinum (MWK 5,000,000)." 
    },
    { 
      question: "How do I upgrade my account?", 
      answer: "Complete your e-KYC verification and contact support to upgrade your account tier." 
    },
    { 
      question: "Is my money safe?", 
      answer: "Yes, NeoVault uses bank-grade security and is regulated by the Reserve Bank of Malawi." 
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">{t.firstName}</Label>
                <Input
                  value={profile.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="bg-gray-800/60 border-gray-600/50 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">{t.lastName}</Label>
                <Input
                  value={profile.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="bg-gray-800/60 border-gray-600/50 text-white"
                />
              </div>
            </div>
            <div>
              <Label className="text-gray-300">{t.email}</Label>
              <Input
                type="email"
                value={profile.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="bg-gray-800/60 border-gray-600/50 text-white"
              />
            </div>
            <div>
              <Label className="text-gray-300">{t.phone}</Label>
              <Input
                value={profile.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="bg-gray-800/60 border-gray-600/50 text-white"
              />
            </div>
            <div>
              <Label className="text-gray-300">{t.address}</Label>
              <Input
                value={profile.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="bg-gray-800/60 border-gray-600/50 text-white"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">{t.dateOfBirth}</Label>
                <Input
                  type="date"
                  value={profile.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className="bg-gray-800/60 border-gray-600/50 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">{t.nationality}</Label>
                <Input
                  value={profile.nationality}
                  onChange={(e) => handleInputChange('nationality', e.target.value)}
                  className="bg-gray-800/60 border-gray-600/50 text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">{t.occupation}</Label>
                <Input
                  value={profile.occupation}
                  onChange={(e) => handleInputChange('occupation', e.target.value)}
                  className="bg-gray-800/60 border-gray-600/50 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">{t.idNumber}</Label>
                <Input
                  value={profile.idNumber}
                  onChange={(e) => handleInputChange('idNumber', e.target.value)}
                  className="bg-gray-800/60 border-gray-600/50 text-white"
                />
              </div>
            </div>
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
              {t.save}
            </Button>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label className="text-white">Two-Factor Authentication</Label>
              <Switch 
                checked={securitySettings.twoFactorEnabled} 
                onCheckedChange={(value) => handleSecurityChange('twoFactorEnabled', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-white">Push Notifications</Label>
              <Switch 
                checked={securitySettings.notificationsEnabled} 
                onCheckedChange={(value) => handleSecurityChange('notificationsEnabled', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-white">Biometric Login</Label>
              <Switch 
                checked={securitySettings.biometricEnabled} 
                onCheckedChange={(value) => handleSecurityChange('biometricEnabled', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-white">Login Alerts</Label>
              <Switch 
                checked={securitySettings.loginAlerts} 
                onCheckedChange={(value) => handleSecurityChange('loginAlerts', value)}
              />
            </div>
            <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
              Change Password
            </Button>
          </div>
        );

      case 'ekyc':
        return (
          <div className="space-y-6">
            <div className="p-4 bg-green-500/20 border border-green-400/30 rounded-lg">
              <h4 className="text-green-300 font-medium mb-2">KYC Status: {profile.kycStatus}</h4>
              <p className="text-gray-300 text-sm">Your account is fully verified and compliant.</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                <div>
                  <p className="text-white font-medium">Identity Document</p>
                  <p className="text-gray-400 text-sm">National ID verified</p>
                </div>
                <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                <div>
                  <p className="text-white font-medium">Proof of Address</p>
                  <p className="text-gray-400 text-sm">Utility bill verified</p>
                </div>
                <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
              </div>
            </div>
            
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <Upload className="w-4 h-4 mr-2" />
              {t.uploadDocument}
            </Button>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-white">{t.language}</Label>
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="bg-gray-800/60 border-gray-600/50 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.name} className="text-white">
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4" />
                        <span>{lang.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <Download className="w-4 h-4 mr-2" />
              {t.downloadStatement}
            </Button>
          </div>
        );

      case 'compliance':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-800/50 rounded-lg text-center">
                <h4 className="text-white font-medium">KYC Level</h4>
                <p className="text-green-400 text-lg font-bold">{complianceData.kycLevel}</p>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg text-center">
                <h4 className="text-white font-medium">AML Status</h4>
                <p className="text-green-400 text-lg font-bold">{complianceData.amlStatus}</p>
              </div>
            </div>
            
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <h4 className="text-white font-medium mb-2">Risk Assessment</h4>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Risk Rating:</span>
                <span className="text-green-400 font-bold">{complianceData.riskRating}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-300">Last Review:</span>
                <span className="text-white">{complianceData.lastReview}</span>
              </div>
            </div>
          </div>
        );

      case 'help':
        return (
          <div className="space-y-4">
            <Button 
              onClick={() => setShowChatBot(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              {t.liveChatAssistant}
            </Button>
            
            <Card className="bg-gray-800/50 border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-white text-sm">{t.frequentlyAskedQuestions}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {faqData.map((faq, index) => (
                  <div key={index} className="p-3 bg-gray-700/50 rounded-lg">
                    <h5 className="text-white font-medium text-sm mb-1">{faq.question}</h5>
                    <p className="text-gray-300 text-xs">{faq.answer}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <div className="space-y-2">
              <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:text-white">
                <FileText className="w-4 h-4 mr-2" />
                {t.termsAndConditions}
              </Button>
              <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:text-white">
                <Shield className="w-4 h-4 mr-2" />
                {t.privacyPolicy}
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 pb-24">
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
          <h2 className="text-2xl font-bold text-white">{t.profile}</h2>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="grid grid-cols-3 gap-1 bg-gray-800/50 p-1 rounded-lg">
        {[
          { key: 'personal', label: t.personalInfo, icon: User },
          { key: 'security', label: t.security, icon: Shield },
          { key: 'ekyc', label: t.ekyc, icon: FileText },
          { key: 'settings', label: t.settings, icon: Settings },
          { key: 'compliance', label: t.compliance, icon: CreditCard },
          { key: 'help', label: t.help, icon: HelpCircle }
        ].map(({ key, label, icon: Icon }) => (
          <Button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex flex-col items-center p-2 text-xs ${
              activeTab === key 
                ? 'bg-blue-500 text-white' 
                : 'bg-transparent text-gray-300 hover:text-white'
            }`}
          >
            <Icon className="w-4 h-4 mb-1" />
            <span className="truncate">{label}</span>
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-2xl">
        <CardContent className="p-6">
          {renderTabContent()}
        </CardContent>
      </Card>

      {/* Logout Button */}
      <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-2xl">
        <CardContent className="p-4">
          <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
            <LogOut className="w-4 h-4 mr-2" />
            {t.logout}
          </Button>
        </CardContent>
      </Card>

      {/* Chat Bot Modal */}
      <Dialog open={showChatBot} onOpenChange={setShowChatBot}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              {t.liveChatAssistant}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="h-64 overflow-y-auto bg-gray-700/50 p-3 rounded-lg">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-3 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}
                >
                  <div
                    className={`inline-block p-2 rounded-lg max-w-xs ${
                      msg.sender === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-600 text-gray-100'
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your message..."
                className="bg-gray-700/50 border-gray-600/50 text-white"
              />
              <Button onClick={sendMessage} className="bg-blue-600 hover:bg-blue-700">
                Send
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
