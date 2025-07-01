
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { User, Shield, Settings, HelpCircle, FileText, Fingerprint, Camera, CheckCircle, AlertTriangle } from 'lucide-react';

export const UserProfile = () => {
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [kycStatus, setKycStatus] = useState('pending');

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* Profile Header - Mobile Optimized */}
      <Card className="gradient-card border-border/50">
        <CardContent className="pt-4 sm:pt-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="text-center sm:text-left min-w-0 flex-1">
              <h2 className="text-lg sm:text-xl font-bold truncate">Chisomo Banda</h2>
              <p className="text-sm text-muted-foreground truncate">chisomo.banda@email.com</p>
              <div className="flex items-center justify-center sm:justify-start space-x-2 mt-2">
                <Badge variant={kycStatus === 'verified' ? 'default' : 'secondary'} className="bg-accent/20 text-accent text-xs">
                  {kycStatus === 'verified' ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertTriangle className="w-3 h-3 mr-1" />}
                  {kycStatus === 'verified' ? 'KYC Verified' : 'KYC Pending'}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="w-full h-auto flex-wrap gap-1 p-1 bg-card/50">
          <TabsTrigger value="personal" className="flex-1 min-w-[80px] text-xs sm:text-sm px-2 py-2">Personal</TabsTrigger>
          <TabsTrigger value="security" className="flex-1 min-w-[80px] text-xs sm:text-sm px-2 py-2">Security</TabsTrigger>
          <TabsTrigger value="kyc" className="flex-1 min-w-[80px] text-xs sm:text-sm px-2 py-2">e-KYC</TabsTrigger>
          <TabsTrigger value="settings" className="flex-1 min-w-[80px] text-xs sm:text-sm px-2 py-2">Settings</TabsTrigger>
          <TabsTrigger value="compliance" className="flex-1 min-w-[80px] text-xs sm:text-sm px-2 py-2">Compliance</TabsTrigger>
          <TabsTrigger value="help" className="flex-1 min-w-[80px] text-xs sm:text-sm px-2 py-2">Help</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4 mt-4">
          <Card className="gradient-card border-border/50">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-base sm:text-lg">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-sm">First Name</Label>
                  <Input id="firstName" defaultValue="Chisomo" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-sm">Last Name</Label>
                  <Input id="lastName" defaultValue="Banda" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-sm">Phone Number</Label>
                  <Input id="phone" defaultValue="+265 999 123 456" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm">Email</Label>
                  <Input id="email" defaultValue="chisomo.banda@email.com" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="district" className="text-sm">District</Label>
                  <Input id="district" defaultValue="Lilongwe" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="traditional" className="text-sm">Traditional Authority</Label>
                  <Input id="traditional" defaultValue="Kawale" className="mt-1" />
                </div>
              </div>
              <Button className="w-full gradient-primary mt-4">Update Information</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4 mt-4">
          <Card className="gradient-card border-border/50">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Security Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1 pr-3">
                  <h3 className="font-medium text-sm sm:text-base">Biometric Authentication</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Use fingerprint or face ID</p>
                </div>
                <Switch 
                  checked={biometricsEnabled}
                  onCheckedChange={setBiometricsEnabled}
                />
              </div>
              
              <div className="space-y-3">
                <h3 className="font-medium text-sm sm:text-base">Change PIN</h3>
                <div className="space-y-3">
                  <Input type="password" placeholder="Current PIN" />
                  <Input type="password" placeholder="New PIN" />
                </div>
                <Button variant="outline" className="w-full">Update PIN</Button>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium text-sm sm:text-base">Two-Factor Authentication</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Secure your account with SMS verification</p>
                <Button variant="outline" className="w-full">Enable 2FA</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kyc" className="space-y-4 mt-4">
          <Card className="gradient-card border-border/50">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>e-KYC Verification</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 sm:p-4 rounded-lg border border-border/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-accent flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm sm:text-base">National ID Verification</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">Upload clear photo of your National ID</p>
                      </div>
                    </div>
                    <Badge className="bg-accent/20 text-accent text-xs ml-2">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                </div>

                <div className="p-3 sm:p-4 rounded-lg border border-border/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <Fingerprint className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm sm:text-base">Biometric Verification</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">Complete biometric verification</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs ml-2">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Pending
                    </Badge>
                  </div>
                </div>

                <div className="p-3 sm:p-4 rounded-lg border border-border/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm sm:text-base">Address Verification</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">Utility bill or bank statement</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="text-xs ml-2">Upload</Button>
                  </div>
                </div>
              </div>

              <div className="bg-accent/10 p-3 sm:p-4 rounded-lg">
                <p className="text-xs sm:text-sm text-accent">
                  Complete KYC verification to unlock higher transaction limits and additional features.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4 mt-4">
          <Card className="gradient-card border-border/50">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>App Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1 pr-3">
                  <h3 className="font-medium text-sm sm:text-base">Notifications</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Transaction alerts and updates</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1 pr-3">
                  <h3 className="font-medium text-sm sm:text-base">Dark Mode</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Switch to dark theme</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1 pr-3">
                  <h3 className="font-medium text-sm sm:text-base">Language</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Chichewa • English</p>
                </div>
                <Button size="sm" variant="outline" className="text-xs">Change</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4 mt-4">
          <Card className="gradient-card border-border/50">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-base sm:text-lg">Regulatory Compliance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium text-sm sm:text-base">Reserve Bank of Malawi (RBM) Compliance</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  NeoVault is fully compliant with RBM regulations and guidelines for digital financial services.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium text-sm sm:text-base">Anti-Money Laundering (AML)</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  We monitor transactions for suspicious activity and comply with AML requirements.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-sm sm:text-base">Data Protection</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Your personal data is protected according to Malawi's data protection laws.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="help" className="space-y-4 mt-4">
          <Card className="gradient-card border-border/50">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Help & Support</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start text-sm">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Frequently Asked Questions
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm">
                  <FileText className="w-4 h-4 mr-2" />
                  Terms & Conditions
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm">
                  <Shield className="w-4 h-4 mr-2" />
                  Privacy Policy
                </Button>
              </div>
              
              <div className="space-y-3 pt-4 border-t border-border/50">
                <h3 className="font-medium text-sm sm:text-base">Contact Support</h3>
                <div className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                  <p>📞 WhatsApp: +265 999 123 456</p>
                  <p>📧 Email: support@neovault.mw</p>
                  <p>💬 Live Chat: Available 24/7</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
