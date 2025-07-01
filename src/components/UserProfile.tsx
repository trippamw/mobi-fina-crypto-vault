import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { User, Shield, Settings, HelpCircle, FileText, Fingerprint, Camera, CheckCircle, AlertTriangle, Upload, MessageCircle, Globe, Phone, Mail, Send } from 'lucide-react';

export const UserProfile = () => {
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [kycStatus, setKycStatus] = useState('pending');
  const [language, setLanguage] = useState('english');
  const [showAiChat, setShowAiChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'ai', message: 'Hello! I\'m your AI assistant. How can I help you today?' }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    // Here you would implement actual language switching
    console.log(`Language changed to: ${value}`);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('File uploaded:', file.name);
      // Handle file upload logic here
    }
  };

  const handleBiometricCapture = () => {
    console.log('Capturing biometric data...');
    // Implement biometric capture
  };

  const sendAiMessage = () => {
    if (!newMessage.trim()) return;
    
    setChatMessages([...chatMessages, 
      { id: Date.now(), sender: 'user', message: newMessage },
      { id: Date.now() + 1, sender: 'ai', message: 'Thank you for your message. I\'m processing your request and will respond shortly.' }
    ]);
    setNewMessage('');
  };

  const termsAndConditions = `
NEOVAULT TERMS AND CONDITIONS

1. INTRODUCTION
Welcome to NeoVault, Malawi's premier digital banking platform. These Terms and Conditions govern your use of our services in accordance with the laws of the Republic of Malawi and regulations of the Reserve Bank of Malawi.

2. REGULATORY COMPLIANCE
NeoVault operates under the supervision of the Reserve Bank of Malawi and complies with all applicable financial regulations including the Banking Act, National Payment Systems Act, and Anti-Money Laundering laws of Malawi.

3. ACCOUNT OPENING AND KYC
All customers must complete Know Your Customer (KYC) verification in accordance with Malawian law. Required documents include valid National ID, proof of residence, and biometric verification.

4. TRANSACTION LIMITS
Daily transaction limits are set in accordance with RBM guidelines. Limits may vary based on your verification level and account type.

5. FEES AND CHARGES
All fees are clearly disclosed before transactions. We maintain competitive rates while ensuring service sustainability and regulatory compliance.

6. DATA PROTECTION
Your personal data is protected in accordance with Malawi's data protection laws and international standards. We do not share your information without consent except as required by law.

7. DISPUTE RESOLUTION
Disputes will be resolved through our internal procedures first, then through Malawian courts if necessary. We are committed to fair and timely resolution of all customer concerns.

8. TERMINATION
Either party may terminate this agreement with appropriate notice. Upon termination, all obligations must be settled according to Malawian banking regulations.

By using NeoVault services, you agree to these terms and acknowledge that you have read and understood them.
  `;

  const privacyPolicy = `
NEOVAULT PRIVACY POLICY

1. INFORMATION WE COLLECT
We collect personal information necessary for providing banking services including:
- Identity information (National ID, biometrics)
- Contact information (phone, address, email)
- Transaction data and account activity
- Device and location information for security

2. HOW WE USE YOUR INFORMATION
Your information is used to:
- Provide banking and financial services
- Comply with regulatory requirements
- Prevent fraud and ensure security
- Improve our services and customer experience

3. INFORMATION SHARING
We may share your information with:
- Reserve Bank of Malawi and other regulators
- Law enforcement when legally required
- Service providers who assist our operations
- With your explicit consent for specific purposes

4. DATA SECURITY
We implement robust security measures including:
- End-to-end encryption for all transactions
- Multi-factor authentication
- Regular security audits and monitoring
- Compliance with international security standards

5. YOUR RIGHTS
You have the right to:
- Access your personal information
- Request corrections to inaccurate data
- Withdraw consent where applicable
- File complaints with data protection authorities

6. RETENTION
We retain your information as required by Malawian banking laws and for legitimate business purposes.

7. CONTACT US
For privacy-related inquiries, contact our Data Protection Officer through the in-app support system.

This policy is governed by the laws of Malawi and international privacy standards.
  `;

  const faqs = [
    {
      question: "How do I create a NeoVault account?",
      answer: "To create an account, download the app, provide your National ID, complete biometric verification, and submit proof of residence. The process takes 24-48 hours for approval."
    },
    {
      question: "What are the transaction limits?",
      answer: "Basic accounts have daily limits of MWK 100,000. Premium accounts can transact up to MWK 500,000 daily. Limits increase with KYC verification level."
    },
    {
      question: "How do I contact customer support?",
      answer: "Use the AI chat feature in the app for instant help, or request human assistance for complex issues. Support is available 24/7."
    },
    {
      question: "Is NeoVault regulated?",
      answer: "Yes, NeoVault is fully regulated by the Reserve Bank of Malawi and complies with all Malawian banking laws and international standards."
    },
    {
      question: "How secure is my money?",
      answer: "Your funds are protected by bank-level security, deposit insurance, and are held in segregated accounts with licensed banks in Malawi."
    },
    {
      question: "Can I use NeoVault internationally?",
      answer: "Yes, NeoVault supports international transfers and multi-currency wallets for seamless global transactions."
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* Profile Header */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="pt-4 sm:pt-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="text-center sm:text-left min-w-0 flex-1">
              <h2 className="text-lg sm:text-xl font-bold truncate text-white">Chisomo Banda</h2>
              <p className="text-sm text-gray-400 truncate">chisomo.banda@email.com</p>
              <div className="flex items-center justify-center sm:justify-start space-x-2 mt-2">
                <Badge variant={kycStatus === 'verified' ? 'default' : 'secondary'} className="bg-cyan-500/20 text-cyan-300 text-xs">
                  {kycStatus === 'verified' ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertTriangle className="w-3 h-3 mr-1" />}
                  {kycStatus === 'verified' ? 'KYC Verified' : 'KYC Pending'}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="w-full h-auto flex-wrap gap-1 p-1 bg-gray-800">
          <TabsTrigger value="personal" className="flex-1 min-w-[80px] text-xs sm:text-sm px-2 py-2 data-[state=active]:bg-green-600">Personal</TabsTrigger>
          <TabsTrigger value="security" className="flex-1 min-w-[80px] text-xs sm:text-sm px-2 py-2 data-[state=active]:bg-green-600">Security</TabsTrigger>
          <TabsTrigger value="kyc" className="flex-1 min-w-[80px] text-xs sm:text-sm px-2 py-2 data-[state=active]:bg-green-600">e-KYC</TabsTrigger>
          <TabsTrigger value="settings" className="flex-1 min-w-[80px] text-xs sm:text-sm px-2 py-2 data-[state=active]:bg-green-600">Settings</TabsTrigger>
          <TabsTrigger value="compliance" className="flex-1 min-w-[80px] text-xs sm:text-sm px-2 py-2 data-[state=active]:bg-green-600">Compliance</TabsTrigger>
          <TabsTrigger value="help" className="flex-1 min-w-[80px] text-xs sm:text-sm px-2 py-2 data-[state=active]:bg-green-600">Help</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4 mt-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-base sm:text-lg text-white">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-sm text-gray-300">First Name</Label>
                  <Input id="firstName" defaultValue="Chisomo" className="mt-1 bg-gray-700 border-gray-600 text-white" />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-sm text-gray-300">Last Name</Label>
                  <Input id="lastName" defaultValue="Banda" className="mt-1 bg-gray-700 border-gray-600 text-white" />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-sm text-gray-300">Phone Number</Label>
                  <Input id="phone" defaultValue="+265 999 123 456" className="mt-1 bg-gray-700 border-gray-600 text-white" />
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm text-gray-300">Email</Label>
                  <Input id="email" defaultValue="chisomo.banda@email.com" className="mt-1 bg-gray-700 border-gray-600 text-white" />
                </div>
                <div>
                  <Label htmlFor="district" className="text-sm text-gray-300">District</Label>
                  <Input id="district" defaultValue="Lilongwe" className="mt-1 bg-gray-700 border-gray-600 text-white" />
                </div>
                <div>
                  <Label htmlFor="traditional" className="text-sm text-gray-300">Traditional Authority</Label>
                  <Input id="traditional" defaultValue="Kawale" className="mt-1 bg-gray-700 border-gray-600 text-white" />
                </div>
                <div>
                  <Label htmlFor="village" className="text-sm text-gray-300">Village</Label>
                  <Input id="village" defaultValue="Chilomoni" className="mt-1 bg-gray-700 border-gray-600 text-white" />
                </div>
              </div>
              <Button className="w-full bg-green-600 hover:bg-green-700 mt-4">Update Information</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4 mt-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg text-white">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Security Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1 pr-3">
                  <h3 className="font-medium text-sm sm:text-base text-white">Biometric Authentication</h3>
                  <p className="text-xs sm:text-sm text-gray-400">Use fingerprint or face ID</p>
                </div>
                <Switch 
                  checked={biometricsEnabled}
                  onCheckedChange={setBiometricsEnabled}
                />
              </div>
              
              <div className="space-y-3">
                <h3 className="font-medium text-sm sm:text-base text-white">Change PIN</h3>
                <div className="space-y-3">
                  <Input type="password" placeholder="Current PIN" className="bg-gray-700 border-gray-600 text-white" />
                  <Input type="password" placeholder="New PIN" className="bg-gray-700 border-gray-600 text-white" />
                </div>
                <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">Update PIN</Button>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium text-sm sm:text-base text-white">Two-Factor Authentication</h3>
                <p className="text-xs sm:text-sm text-gray-400">Secure your account with SMS verification</p>
                <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">Enable 2FA</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kyc" className="space-y-4 mt-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg text-white">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>e-KYC Verification</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 sm:p-4 rounded-lg border border-gray-600 bg-gray-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm sm:text-base text-white">National ID Verification</p>
                        <p className="text-xs sm:text-sm text-gray-400">Upload clear photo of your National ID</p>
                      </div>
                    </div>
                    <Badge className="bg-cyan-500/20 text-cyan-300 text-xs ml-2">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                </div>

                <div className="p-3 sm:p-4 rounded-lg border border-gray-600 bg-gray-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <Fingerprint className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm sm:text-base text-white">Biometric Verification</p>
                        <p className="text-xs sm:text-sm text-gray-400">Complete biometric verification</p>
                      </div>
                    </div>
                    <Button size="sm" onClick={handleBiometricCapture} className="text-xs ml-2 bg-yellow-600 hover:bg-yellow-700">
                      Capture
                    </Button>
                  </div>
                </div>

                <div className="p-3 sm:p-4 rounded-lg border border-gray-600 bg-gray-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm sm:text-base text-white">Address Verification</p>
                        <p className="text-xs sm:text-sm text-gray-400">Utility bill or bank statement</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-2">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="address-upload"
                      />
                      <Button size="sm" onClick={() => document.getElementById('address-upload')?.click()} className="text-xs bg-blue-600 hover:bg-blue-700">
                        <Upload className="w-3 h-3 mr-1" />
                        Upload
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-cyan-500/10 p-3 sm:p-4 rounded-lg border border-cyan-500/20">
                <p className="text-xs sm:text-sm text-cyan-300">
                  Complete KYC verification to unlock higher transaction limits and additional features.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4 mt-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg text-white">
                <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>App Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1 pr-3">
                  <h3 className="font-medium text-sm sm:text-base text-white">Notifications</h3>
                  <p className="text-xs sm:text-sm text-gray-400">Transaction alerts and updates</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1 pr-3">
                  <h3 className="font-medium text-sm sm:text-base text-white">Dark Mode</h3>
                  <p className="text-xs sm:text-sm text-gray-400">Switch to dark theme</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-green-400" />
                  <h3 className="font-medium text-sm sm:text-base text-white">Language</h3>
                </div>
                <Select value={language} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="english" className="text-white hover:bg-gray-600">English</SelectItem>
                    <SelectItem value="chichewa" className="text-white hover:bg-gray-600">Nyanja/Chichewa</SelectItem>
                    <SelectItem value="swahili" className="text-white hover:bg-gray-600">Swahili</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4 mt-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-base sm:text-lg text-white">Regulatory Compliance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium text-sm sm:text-base text-white">Reserve Bank of Malawi (RBM) Compliance</h3>
                <p className="text-xs sm:text-sm text-gray-400">
                  NeoVault is fully compliant with RBM regulations and guidelines for digital financial services.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium text-sm sm:text-base text-white">Anti-Money Laundering (AML)</h3>
                <p className="text-xs sm:text-sm text-gray-400">
                  We monitor transactions for suspicious activity and comply with AML requirements.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-sm sm:text-base text-white">Data Protection</h3>
                <p className="text-xs sm:text-sm text-gray-400">
                  Your personal data is protected according to Malawi's data protection laws.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="help" className="space-y-4 mt-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg text-white">
                <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Help & Support</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* AI Chat Support */}
              <div className="space-y-2">
                <Button 
                  onClick={() => setShowAiChat(true)}
                  className="w-full justify-start text-sm bg-green-600 hover:bg-green-700"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Live AI Support Chat
                </Button>
              </div>

              {/* FAQ Section */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-sm border-gray-600 text-gray-300 hover:bg-gray-700">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Frequently Asked Questions
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl max-h-[80vh]">
                  <DialogHeader>
                    <DialogTitle className="text-white">Frequently Asked Questions</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                      {faqs.map((faq, index) => (
                        <div key={index} className="border-b border-gray-700 pb-4">
                          <h4 className="font-medium text-white mb-2">{faq.question}</h4>
                          <p className="text-sm text-gray-400">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>

              {/* Terms and Conditions */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-sm border-gray-600 text-gray-300 hover:bg-gray-700">
                    <FileText className="w-4 h-4 mr-2" />
                    Terms & Conditions
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl max-h-[80vh]">
                  <DialogHeader>
                    <DialogTitle className="text-white">NeoVault Terms & Conditions</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="text-sm text-gray-300 whitespace-pre-line">
                      {termsAndConditions}
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>

              {/* Privacy Policy */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-sm border-gray-600 text-gray-300 hover:bg-gray-700">
                    <Shield className="w-4 h-4 mr-2" />
                    Privacy Policy
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl max-h-[80vh]">
                  <DialogHeader>
                    <DialogTitle className="text-white">NeoVault Privacy Policy</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="text-sm text-gray-300 whitespace-pre-line">
                      {privacyPolicy}
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* AI Chat Modal */}
      {showAiChat && (
        <Dialog open={showAiChat} onOpenChange={setShowAiChat}>
          <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md h-[500px] flex flex-col">
            <DialogHeader>
              <DialogTitle className="text-white">AI Support Assistant</DialogTitle>
            </DialogHeader>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-lg ${
                      msg.sender === 'user' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-700 text-white'
                    }`}>
                      {msg.message}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="p-4 border-t border-gray-700">
              <div className="flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendAiMessage()}
                  placeholder="Type your message..."
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <Button onClick={sendAiMessage} className="bg-green-600 hover:bg-green-700">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
