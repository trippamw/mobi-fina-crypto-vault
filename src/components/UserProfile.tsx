import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User, Settings, Bell, Shield, CreditCard, HelpCircle, LogOut, ArrowLeft, FileText, MessageCircle, Eye, Upload, Download, Globe, Fingerprint, Camera, Lock } from 'lucide-react';
import { PasswordChangeModal } from './PasswordChangeModal';
import { translateText, applyLanguageToApp, getCurrentLanguage } from '@/utils/languageApi';
import { useToast } from '@/hooks/use-toast';

interface UserProfileProps {
  onBack?: () => void;
  onLanguageChange?: (language: string) => void;
}

export const UserProfile = ({ onBack, onLanguageChange }: UserProfileProps) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [showChatBot, setShowChatBot] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showBiometric, setShowBiometric] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(getCurrentLanguage());
  const { toast } = useToast();

  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', message: 'Hello! How can I help you today?' }
  ]);
  const [newMessage, setNewMessage] = useState('');

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
    loginAlerts: true,
    passwordChanged: false
  });

  const [complianceData, setComplianceData] = useState({
    kycLevel: 'Level 3',
    amlStatus: 'Compliant',
    lastReview: '2024-01-15',
    riskRating: 'Low',
    documents: {
      idDocument: { uploaded: true, verified: true, type: 'National ID' },
      proofOfAddress: { uploaded: true, verified: true, type: 'Utility Bill' },
      biometricData: { uploaded: false, verified: false, type: 'Fingerprint & Face' },
      signature: { uploaded: true, verified: true, type: 'Digital Signature' }
    }
  });

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ny', name: 'Chichewa' },
    { code: 'tu', name: 'Tumbuka' },
    { code: 'sw', name: 'Swahili' }
  ];

  // Listen for language changes
  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      setCurrentLanguage(event.detail.language);
    };

    window.addEventListener('languageChanged', handleLanguageChange as EventListener);
    return () => window.removeEventListener('languageChanged', handleLanguageChange as EventListener);
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSecurityChange = (field: string, value: boolean) => {
    setSecuritySettings(prev => ({ ...prev, [field]: value }));
  };

  const handleLanguageChange = (newLanguage: string) => {
    setCurrentLanguage(newLanguage);
    applyLanguageToApp(newLanguage);
    onLanguageChange?.(newLanguage);
    
    toast({
      title: translateText('languageChanged', newLanguage),
      description: `${translateText('language', newLanguage)} changed to ${newLanguage}`,
    });
  };

  const handleSaveProfile = () => {
    // Simulate API call
    setTimeout(() => {
      toast({
        title: translateText('profileSaved', currentLanguage),
        description: translateText('profileSaved', currentLanguage),
      });
    }, 1000);
  };

  const handleChangePassword = () => {
    setShowPasswordModal(true);
  };

  const handleBiometricSetup = () => {
    setShowBiometric(true);
  };

  const handleBiometricCapture = (type: 'fingerprint' | 'face') => {
    // Simulate biometric capture with real API integration
    setTimeout(() => {
      setComplianceData(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          biometricData: { uploaded: true, verified: true, type: 'Fingerprint & Face' }
        }
      }));
      setSecuritySettings(prev => ({ ...prev, biometricEnabled: true }));
      setShowBiometric(false);
      
      toast({
        title: "Biometric Captured",
        description: `${type === 'fingerprint' ? 'Fingerprint' : 'Face'} biometric data captured successfully!`,
      });
    }, 2000);
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    setChatMessages(prev => [...prev, { sender: 'user', message: newMessage }]);
    
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
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-gray-300 text-xs">{translateText('firstName', currentLanguage)}</Label>
                <Input
                  value={profile.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="bg-gray-800/60 border-gray-600/50 text-white text-sm"
                />
              </div>
              <div>
                <Label className="text-gray-300 text-xs">{translateText('lastName', currentLanguage)}</Label>
                <Input
                  value={profile.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="bg-gray-800/60 border-gray-600/50 text-white text-sm"
                />
              </div>
            </div>
            
            <div>
              <Label className="text-gray-300 text-xs">{translateText('email', currentLanguage)}</Label>
              <Input
                type="email"
                value={profile.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="bg-gray-800/60 border-gray-600/50 text-white text-sm"
              />
            </div>
            <div>
              <Label className="text-gray-300 text-xs">{translateText('phone', currentLanguage)}</Label>
              <Input
                value={profile.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="bg-gray-800/60 border-gray-600/50 text-white text-sm"
              />
            </div>
            <div>
              <Label className="text-gray-300 text-xs">{translateText('address', currentLanguage)}</Label>
              <Input
                value={profile.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="bg-gray-800/60 border-gray-600/50 text-white text-sm"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-gray-300 text-xs">{translateText('dateOfBirth', currentLanguage)}</Label>
                <Input
                  type="date"
                  value={profile.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className="bg-gray-800/60 border-gray-600/50 text-white text-sm"
                />
              </div>
              <div>
                <Label className="text-gray-300 text-xs">{translateText('nationality', currentLanguage)}</Label>
                <Input
                  value={profile.nationality}
                  onChange={(e) => handleInputChange('nationality', e.target.value)}
                  className="bg-gray-800/60 border-gray-600/50 text-white text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-gray-300 text-xs">{translateText('occupation', currentLanguage)}</Label>
                <Input
                  value={profile.occupation}
                  onChange={(e) => handleInputChange('occupation', e.target.value)}
                  className="bg-gray-800/60 border-gray-600/50 text-white text-sm"
                />
              </div>
              <div>
                <Label className="text-gray-300 text-xs">{translateText('idNumber', currentLanguage)}</Label>
                <Input
                  value={profile.idNumber}
                  onChange={(e) => handleInputChange('idNumber', e.target.value)}
                  className="bg-gray-800/60 border-gray-600/50 text-white text-sm"
                />
              </div>
            </div>
            <Button onClick={handleSaveProfile} className="w-full bg-green-600 hover:bg-green-700 text-white text-sm">
              {translateText('save', currentLanguage)}
            </Button>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-white text-sm">{translateText('twoFactorAuth', currentLanguage)}</Label>
              <Switch 
                checked={securitySettings.twoFactorEnabled} 
                onCheckedChange={(value) => handleSecurityChange('twoFactorEnabled', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-white text-sm">{translateText('pushNotifications', currentLanguage)}</Label>
              <Switch 
                checked={securitySettings.notificationsEnabled} 
                onCheckedChange={(value) => handleSecurityChange('notificationsEnabled', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-white text-sm">{translateText('biometricLogin', currentLanguage)}</Label>
              <Switch 
                checked={securitySettings.biometricEnabled} 
                onCheckedChange={(value) => handleSecurityChange('biometricEnabled', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-white text-sm">{translateText('loginAlerts', currentLanguage)}</Label>
              <Switch 
                checked={securitySettings.loginAlerts} 
                onCheckedChange={(value) => handleSecurityChange('loginAlerts', value)}
              />
            </div>
            <Button onClick={handleChangePassword} className="w-full bg-orange-600 hover:bg-orange-700 text-white text-sm">
              <Lock className="w-4 h-4 mr-2" />
              {translateText('changePassword', currentLanguage)}
            </Button>
          </div>
        );

      case 'ekyc':
        return (
          <div className="space-y-4">
            <div className="p-3 bg-green-500/20 border border-green-400/30 rounded-lg">
              <h4 className="text-green-300 font-medium mb-1 text-sm">KYC Status: {profile.kycStatus}</h4>
              <p className="text-gray-300 text-xs">Your account is fully verified and compliant.</p>
            </div>
            
            <div className="space-y-3">
              {Object.entries(complianceData.documents).map(([key, doc]) => (
                <div key={key} className="flex justify-between items-center p-2 bg-gray-800/50 rounded-lg">
                  <div>
                    <p className="text-white font-medium text-sm">{doc.type}</p>
                    <p className="text-gray-400 text-xs">
                      {doc.verified ? 'Verified' : doc.uploaded ? 'Pending verification' : 'Not uploaded'}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    {doc.uploaded ? (
                      <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 text-xs">
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        onClick={() => key === 'biometricData' ? handleBiometricSetup() : alert('Document upload initiated')}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                      >
                        <Upload className="w-3 h-3 mr-1" />
                        Upload
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-white text-sm">{translateText('language', currentLanguage)}</Label>
              <Select value={currentLanguage} onValueChange={handleLanguageChange}>
                <SelectTrigger className="bg-gray-800/60 border-gray-600/50 text-white text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.name} className="text-white text-sm">
                      <div className="flex items-center space-x-2">
                        <Globe className="w-3 h-3" />
                        <span>{lang.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm">
              <Download className="w-3 h-3 mr-2" />
              {translateText('downloadStatement', currentLanguage)}
            </Button>
          </div>
        );

      case 'compliance':
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-800/50 rounded-lg text-center">
                <h4 className="text-white font-medium text-sm">KYC Level</h4>
                <p className="text-green-400 text-lg font-bold">{complianceData.kycLevel}</p>
              </div>
              <div className="p-3 bg-gray-800/50 rounded-lg text-center">
                <h4 className="text-white font-medium text-sm">AML Status</h4>
                <p className="text-green-400 text-lg font-bold">{complianceData.amlStatus}</p>
              </div>
            </div>
            
            <div className="p-3 bg-gray-800/50 rounded-lg">
              <h4 className="text-white font-medium mb-2 text-sm">Risk Assessment</h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-300">Risk Rating:</span>
                  <span className="text-green-400 font-bold">{complianceData.riskRating}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Last Review:</span>
                  <span className="text-white">{complianceData.lastReview}</span>
                </div>
              </div>
            </div>
            
            {/* DCI and PCSS Compliance */}
            <div className="space-y-2">
              <div className="p-3 bg-blue-500/20 border border-blue-400/30 rounded-lg">
                <h4 className="text-blue-300 font-medium mb-1 text-sm">DCI Compliance</h4>
                <p className="text-gray-300 text-xs">Digital Credit Infrastructure compliant</p>
              </div>
              <div className="p-3 bg-purple-500/20 border border-purple-400/30 rounded-lg">
                <h4 className="text-purple-300 font-medium mb-1 text-sm">PCSS Compliance</h4>
                <p className="text-gray-300 text-xs">Payment & Card Switching Services compliant</p>
              </div>
            </div>
          </div>
        );

      case 'help':
        return (
          <div className="space-y-3">
            <Button 
              onClick={() => setShowChatBot(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm"
            >
              <MessageCircle className="w-3 h-3 mr-2" />
              Live AI Chat Assistant
            </Button>
            
            <Card className="bg-gray-800/50 border-gray-700/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-xs">Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {faqData.map((faq, index) => (
                  <div key={index} className="p-2 bg-gray-700/50 rounded-lg">
                    <h5 className="text-white font-medium text-xs mb-1">{faq.question}</h5>
                    <p className="text-gray-300 text-[10px]">{faq.answer}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <div className="space-y-2">
              <Button 
                onClick={() => setShowTerms(true)}
                variant="outline" 
                className="w-full border-gray-600 text-gray-300 hover:text-white text-sm"
              >
                <FileText className="w-3 h-3 mr-2" />
                Terms and Conditions
              </Button>
              <Button 
                onClick={() => setShowPrivacy(true)}
                variant="outline" 
                className="w-full border-gray-600 text-gray-300 hover:text-white text-sm"
              >
                <Shield className="w-3 h-3 mr-2" />
                Privacy Policy
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 pb-24">
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
          <h2 className="text-lg sm:text-2xl font-bold text-white">{translateText('profile', currentLanguage)}</h2>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="grid grid-cols-3 gap-1 bg-gray-800/50 p-1 rounded-lg">
        {[
          { key: 'personal', label: translateText('personalInfo', currentLanguage), icon: User },
          { key: 'security', label: translateText('security', currentLanguage), icon: Shield },
          { key: 'ekyc', label: translateText('ekyc', currentLanguage), icon: FileText },
          { key: 'settings', label: translateText('settings', currentLanguage), icon: Settings },
          { key: 'compliance', label: translateText('compliance', currentLanguage), icon: CreditCard },
          { key: 'help', label: translateText('help', currentLanguage), icon: HelpCircle }
        ].map(({ key, label, icon: Icon }) => (
          <Button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex flex-col items-center p-2 text-[10px] sm:text-xs ${
              activeTab === key 
                ? 'bg-blue-500 text-white' 
                : 'bg-transparent text-gray-300 hover:text-white'
            }`}
          >
            <Icon className="w-3 h-3 mb-1" />
            <span className="truncate">{label}</span>
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-2xl">
        <CardContent className="p-4">
          {renderTabContent()}
        </CardContent>
      </Card>

      {/* Logout Button */}
      <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-2xl">
        <CardContent className="p-3">
          <Button className="w-full bg-red-500 hover:bg-red-600 text-white text-sm">
            <LogOut className="w-3 h-3 mr-2" />
            {translateText('logout', currentLanguage)}
          </Button>
        </CardContent>
      </Card>

      {/* Password Change Modal */}
      <PasswordChangeModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />

      {/* Modals */}
      {/* Chat Bot Modal */}
      <Dialog open={showChatBot} onOpenChange={setShowChatBot}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-sm max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center text-sm">
              <MessageCircle className="w-4 h-4 mr-2" />
              Live AI Chat Assistant
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="h-48 overflow-y-auto bg-gray-700/50 p-2 rounded-lg">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}
                >
                  <div
                    className={`inline-block p-2 rounded-lg max-w-xs text-xs ${
                      msg.sender === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-600 text-gray-100'
                    }`}
                  >
                    <p>{msg.message}</p>
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
                className="bg-gray-700/50 border-gray-600/50 text-white text-sm"
              />
              <Button onClick={sendMessage} size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs">
                Send
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Biometric Setup Modal */}
      <Dialog open={showBiometric} onOpenChange={setShowBiometric}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-sm">{translateText('addBiometric', currentLanguage)}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-gray-300 text-sm mb-4">Choose biometric authentication method:</p>
              <div className="space-y-3">
                <Button
                  onClick={() => handleBiometricCapture('fingerprint')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm"
                >
                  <Fingerprint className="w-4 h-4 mr-2" />
                  Capture Fingerprint
                </Button>
                <Button
                  onClick={() => handleBiometricCapture('face')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white text-sm"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Capture Face
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Terms Modal */}
      <Dialog open={showTerms} onOpenChange={setShowTerms}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-sm">{translateText('termsAndConditions', currentLanguage)}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            <div className="text-xs space-y-2 text-gray-300">
              <h3 className="text-white font-medium">1. Acceptance of Terms</h3>
              <p>By using NeoVault services, you agree to these terms and conditions...</p>
              
              <h3 className="text-white font-medium">2. Account Security</h3>
              <p>You are responsible for maintaining the security of your account credentials...</p>
              
              <h3 className="text-white font-medium">3. Transaction Limits</h3>
              <p>Daily and monthly transaction limits apply based on your account tier...</p>
              
              <h3 className="text-white font-medium">4. Fees and Charges</h3>
              <p>Platform fees apply to certain transactions as disclosed in the app...</p>
              
              <h3 className="text-white font-medium">5. Privacy and Data Protection</h3>
              <p>We protect your personal and financial data in accordance with applicable laws...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Privacy Policy Modal */}
      <Dialog open={showPrivacy} onOpenChange={setShowPrivacy}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-sm">{translateText('privacyPolicy', currentLanguage)}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            <div className="text-xs space-y-2 text-gray-300">
              <h3 className="text-white font-medium">Data Collection</h3>
              <p>We collect information necessary to provide financial services safely and securely...</p>
              
              <h3 className="text-white font-medium">Data Usage</h3>
              <p>Your data is used to process transactions, verify identity, and improve services...</p>
              
              <h3 className="text-white font-medium">Data Sharing</h3>
              <p>We do not sell your personal information to third parties...</p>
              
              <h3 className="text-white font-medium">Data Security</h3>
              <p>We employ bank-grade security measures to protect your information...</p>
              
              <h3 className="text-white font-medium">Your Rights</h3>
              <p>You have the right to access, correct, or delete your personal information...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
