import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User, Settings, Bell, Shield, CreditCard, HelpCircle, LogOut, ArrowLeft, FileText, MessageCircle, Eye, Upload, Download, Globe, Fingerprint, Camera, Lock } from 'lucide-react';
import { useLanguage } from './LanguageProvider';
import { PasswordChangeModal } from './PasswordChangeModal';

interface UserProfileProps {
  onBack?: () => void;
}

export const UserProfile = ({ onBack }: UserProfileProps) => {
  const { language, setLanguage, t } = useLanguage();
  const [activeTab, setActiveTab] = useState('personal');
  const [showChatBot, setShowChatBot] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showBiometric, setShowBiometric] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
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
    dciCompliant: true,
    pcssCompliant: true,
    documents: {
      idDocument: { uploaded: true, verified: true, type: 'National ID' },
      proofOfAddress: { uploaded: true, verified: true, type: 'Utility Bill' },
      biometricData: { uploaded: false, verified: false, type: 'Fingerprint & Face' },
      signature: { uploaded: true, verified: true, type: 'Digital Signature' }
    }
  });

  const languages = [
    { code: 'English', name: 'English' },
    { code: 'Chichewa', name: 'Chichewa' },
    { code: 'Tumbuka', name: 'Tumbuka' },
    { code: 'Swahili', name: 'Swahili' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSecurityChange = (field: string, value: boolean) => {
    setSecuritySettings(prev => ({ ...prev, [field]: value }));
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    alert(`Language changed to ${newLanguage}. App interface updated.`);
  };

  const handleSaveProfile = () => {
    alert('Profile information saved successfully!');
  };

  const handleDocumentUpload = async (documentType: string) => {
    setIsUploading(true);
    
    // Simulate file upload with real APIs
    try {
      // This would integrate with real KYC APIs
      setTimeout(() => {
        setComplianceData(prev => ({
          ...prev,
          documents: {
            ...prev.documents,
            [documentType]: { uploaded: true, verified: false, type: prev.documents[documentType as keyof typeof prev.documents].type }
          }
        }));
        setIsUploading(false);
        alert(`${complianceData.documents[documentType as keyof typeof complianceData.documents].type} uploaded successfully! Verification in progress.`);
      }, 2000);
    } catch (error) {
      setIsUploading(false);
      alert('Upload failed. Please try again.');
    }
  };

  const handleBiometricCapture = async (type: 'fingerprint' | 'face') => {
    setIsUploading(true);
    
    try {
      // This would integrate with real biometric APIs
      if (type === 'fingerprint') {
        // Simulate fingerprint capture API
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
          setIsUploading(false);
          alert('Fingerprint captured and verified successfully!');
        }, 3000);
      } else {
        // Simulate face capture API
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
          setIsUploading(false);
          alert('Face biometric captured and verified successfully!');
        }, 3000);
      }
    } catch (error) {
      setIsUploading(false);
      alert('Biometric capture failed. Please try again.');
    }
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
                <Label className="text-gray-300 text-xs">{t('firstName')}</Label>
                <Input
                  value={profile.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="bg-gray-800/60 border-gray-600/50 text-white text-sm"
                />
              </div>
              <div>
                <Label className="text-gray-300 text-xs">{t('lastName')}</Label>
                <Input
                  value={profile.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="bg-gray-800/60 border-gray-600/50 text-white text-sm"
                />
              </div>
            </div>
            
            <div>
              <Label className="text-gray-300 text-xs">{t('email')}</Label>
              <Input
                type="email"
                value={profile.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="bg-gray-800/60 border-gray-600/50 text-white text-sm"
              />
            </div>
            
            <div>
              <Label className="text-gray-300 text-xs">{t('phone')}</Label>
              <Input
                value={profile.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="bg-gray-800/60 border-gray-600/50 text-white text-sm"
              />
            </div>
            
            <div>
              <Label className="text-gray-300 text-xs">{t('address')}</Label>
              <Input
                value={profile.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="bg-gray-800/60 border-gray-600/50 text-white text-sm"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-gray-300 text-xs">Date of Birth</Label>
                <Input
                  type="date"
                  value={profile.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className="bg-gray-800/60 border-gray-600/50 text-white text-sm"
                />
              </div>
              <div>
                <Label className="text-gray-300 text-xs">Nationality</Label>
                <Input
                  value={profile.nationality}
                  onChange={(e) => handleInputChange('nationality', e.target.value)}
                  className="bg-gray-800/60 border-gray-600/50 text-white text-sm"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-gray-300 text-xs">Occupation</Label>
                <Input
                  value={profile.occupation}
                  onChange={(e) => handleInputChange('occupation', e.target.value)}
                  className="bg-gray-800/60 border-gray-600/50 text-white text-sm"
                />
              </div>
              <div>
                <Label className="text-gray-300 text-xs">ID Number</Label>
                <Input
                  value={profile.idNumber}
                  onChange={(e) => handleInputChange('idNumber', e.target.value)}
                  className="bg-gray-800/60 border-gray-600/50 text-white text-sm"
                />
              </div>
            </div>
            
            <Button onClick={handleSaveProfile} className="w-full bg-green-600 hover:bg-green-700 text-white text-sm">
              {t('save')}
            </Button>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-white text-sm">Two-Factor Authentication</Label>
              <Switch 
                checked={securitySettings.twoFactorEnabled} 
                onCheckedChange={(value) => handleSecurityChange('twoFactorEnabled', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-white text-sm">Push Notifications</Label>
              <Switch 
                checked={securitySettings.notificationsEnabled} 
                onCheckedChange={(value) => handleSecurityChange('notificationsEnabled', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-white text-sm">Biometric Login</Label>
              <Switch 
                checked={securitySettings.biometricEnabled} 
                onCheckedChange={(value) => {
                  if (value && !complianceData.documents.biometricData.uploaded) {
                    setShowBiometric(true);
                  } else {
                    handleSecurityChange('biometricEnabled', value);
                  }
                }}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-white text-sm">Login Alerts</Label>
              <Switch 
                checked={securitySettings.loginAlerts} 
                onCheckedChange={(value) => handleSecurityChange('loginAlerts', value)}
              />
            </div>
            <Button 
              onClick={() => setShowPasswordChange(true)}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white text-sm"
            >
              <Lock className="w-4 h-4 mr-2" />
              {t('changePassword')}
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
                      {doc.verified ? 'Verified ✓' : doc.uploaded ? 'Pending verification...' : 'Not uploaded'}
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
                        onClick={() => {
                          if (key === 'biometricData') {
                            setShowBiometric(true);
                          } else {
                            handleDocumentUpload(key);
                          }
                        }}
                        disabled={isUploading}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                      >
                        <Upload className="w-3 h-3 mr-1" />
                        {isUploading ? 'Uploading...' : 'Upload'}
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
              <Label className="text-white text-sm">{t('language')}</Label>
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="bg-gray-800/60 border-gray-600/50 text-white text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code} className="text-white text-sm">
                      <div className="flex items-center space-x-2">
                        <Globe className="w-3 h-3" />
                        <span>{t(lang.name.toLowerCase())}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm">
              <Download className="w-3 h-3 mr-2" />
              Download Statement
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
              <h4 className="text-white font-medium mb-2 text-sm">Compliance Status</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">DCI Compliance:</span>
                  <span className={`text-sm font-bold ${complianceData.dciCompliant ? 'text-green-400' : 'text-red-400'}`}>
                    {complianceData.dciCompliant ? 'Compliant ✓' : 'Non-Compliant ✗'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">PCSS Compliance:</span>
                  <span className={`text-sm font-bold ${complianceData.pcssCompliant ? 'text-green-400' : 'text-red-400'}`}>
                    {complianceData.pcssCompliant ? 'Compliant ✓' : 'Non-Compliant ✗'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300 text-sm">Risk Rating:</span>
                  <span className="text-green-400 font-bold text-sm">{complianceData.riskRating}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300 text-sm">Last Review:</span>
                  <span className="text-white text-sm">{complianceData.lastReview}</span>
                </div>
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
          <h2 className="text-lg sm:text-2xl font-bold text-white">{t('profile')}</h2>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="grid grid-cols-3 gap-1 bg-gray-800/50 p-1 rounded-lg">
        {[
          { key: 'personal', label: t('personalInfo'), icon: User },
          { key: 'security', label: t('security'), icon: Shield },
          { key: 'ekyc', label: t('ekyc'), icon: FileText },
          { key: 'settings', label: t('settings'), icon: Settings },
          { key: 'compliance', label: t('compliance'), icon: CreditCard },
          { key: 'help', label: t('help'), icon: HelpCircle }
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
            Logout
          </Button>
        </CardContent>
      </Card>

      {/* Password Change Modal */}
      <PasswordChangeModal 
        isOpen={showPasswordChange}
        onClose={() => setShowPasswordChange(false)}
      />

      {/* Biometric Setup Modal */}
      <Dialog open={showBiometric} onOpenChange={setShowBiometric}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-sm">Add Biometric Data</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-gray-300 text-sm mb-4">Choose biometric authentication method:</p>
              <div className="space-y-3">
                <Button
                  onClick={() => handleBiometricCapture('fingerprint')}
                  disabled={isUploading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm"
                >
                  <Fingerprint className="w-4 h-4 mr-2" />
                  {isUploading ? 'Capturing...' : 'Capture Fingerprint'}
                </Button>
                <Button
                  onClick={() => handleBiometricCapture('face')}
                  disabled={isUploading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white text-sm"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  {isUploading ? 'Capturing...' : 'Capture Face'}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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

      {/* Terms Modal */}
      <Dialog open={showTerms} onOpenChange={setShowTerms}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-sm">Terms and Conditions</DialogTitle>
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
            <DialogTitle className="text-sm">Privacy Policy</DialogTitle>
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
