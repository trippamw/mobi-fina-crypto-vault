
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
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="gradient-card border-border/50">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Chisomo Banda</h2>
              <p className="text-muted-foreground">chisomo.banda@email.com</p>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant={kycStatus === 'verified' ? 'default' : 'secondary'} className="bg-accent/20 text-accent">
                  {kycStatus === 'verified' ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertTriangle className="w-3 h-3 mr-1" />}
                  {kycStatus === 'verified' ? 'KYC Verified' : 'KYC Pending'}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="kyc">e-KYC</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="help">Help</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <Card className="gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="Chisomo" />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Banda" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue="+265 999 123 456" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" defaultValue="chisomo.banda@email.com" />
                </div>
                <div>
                  <Label htmlFor="district">District</Label>
                  <Input id="district" defaultValue="Lilongwe" />
                </div>
                <div>
                  <Label htmlFor="traditional">Traditional Authority</Label>
                  <Input id="traditional" defaultValue="Kawale" />
                </div>
              </div>
              <Button className="gradient-primary">Update Information</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card className="gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Security Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Biometric Authentication</h3>
                  <p className="text-sm text-muted-foreground">Use fingerprint or face ID</p>
                </div>
                <Switch 
                  checked={biometricsEnabled}
                  onCheckedChange={setBiometricsEnabled}
                />
              </div>
              
              <div className="space-y-3">
                <h3 className="font-medium">Change PIN</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input type="password" placeholder="Current PIN" />
                  <Input type="password" placeholder="New PIN" />
                </div>
                <Button variant="outline">Update PIN</Button>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium">Two-Factor Authentication</h3>
                <p className="text-sm text-muted-foreground">Secure your account with SMS verification</p>
                <Button variant="outline">Enable 2FA</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kyc" className="space-y-4">
          <Card className="gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>e-KYC Verification</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="p-4 rounded-lg border border-border/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Camera className="w-5 h-5 text-accent" />
                      <div>
                        <p className="font-medium">National ID Verification</p>
                        <p className="text-sm text-muted-foreground">Upload clear photo of your National ID</p>
                      </div>
                    </div>
                    <Badge className="bg-accent/20 text-accent">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Fingerprint className="w-5 h-5 text-yellow-400" />
                      <div>
                        <p className="font-medium">Biometric Verification</p>
                        <p className="text-sm text-muted-foreground">Complete biometric verification</p>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Pending
                    </Badge>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="font-medium">Address Verification</p>
                        <p className="text-sm text-muted-foreground">Utility bill or bank statement</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">Upload</Button>
                  </div>
                </div>
              </div>

              <div className="bg-accent/10 p-4 rounded-lg">
                <p className="text-sm text-accent">
                  Complete KYC verification to unlock higher transaction limits and additional features.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card className="gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>App Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Notifications</h3>
                  <p className="text-sm text-muted-foreground">Transaction alerts and updates</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Dark Mode</h3>
                  <p className="text-sm text-muted-foreground">Switch to dark theme</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Language</h3>
                  <p className="text-sm text-muted-foreground">Chichewa • English</p>
                </div>
                <Button size="sm" variant="outline">Change</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card className="gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Regulatory Compliance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h3 className="font-medium">Reserve Bank of Malawi (RBM) Compliance</h3>
                <p className="text-sm text-muted-foreground">
                  NeoVault is fully compliant with RBM regulations and guidelines for digital financial services.
                </p>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-medium">Anti-Money Laundering (AML)</h3>
                <p className="text-sm text-muted-foreground">
                  We monitor transactions for suspicious activity and comply with AML requirements.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium">Data Protection</h3>
                <p className="text-sm text-muted-foreground">
                  Your personal data is protected according to Malawi's data protection laws.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="help" className="space-y-4">
          <Card className="gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <HelpCircle className="w-5 h-5" />
                <span>Help & Support</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                <Button variant="outline" className="justify-start">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Frequently Asked Questions
                </Button>
                <Button variant="outline" className="justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Terms & Conditions
                </Button>
                <Button variant="outline" className="justify-start">
                  <Shield className="w-4 h-4 mr-2" />
                  Privacy Policy
                </Button>
              </div>
              
              <div className="space-y-3 pt-4 border-t border-border/50">
                <h3 className="font-medium">Contact Support</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
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
