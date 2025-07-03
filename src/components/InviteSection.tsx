
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Share2, Copy, Gift, Users, Smartphone, Mail, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/utils/languageApi';

interface InviteSectionProps {
  onBack?: () => void;
}

export const InviteSection = ({ onBack }: InviteSectionProps) => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [inviteLink, setInviteLink] = useState('');

  const generateInviteLink = () => {
    const link = `https://neovault.app/join?ref=${Math.random().toString(36).substring(7)}`;
    setInviteLink(link);
  };

  const sendInvite = (method: 'email' | 'sms') => {
    const inviteMessage = `Join me on NeoVault - Malawi's revolutionary digital banking platform! Send and receive money for FREE within our network. Download: ${inviteLink || 'https://neovault.app'}`;
    
    if (method === 'email' && email) {
      // Simulate email invite
      window.location.href = `mailto:${email}?subject=Join NeoVault&body=${encodeURIComponent(inviteMessage)}`;
    } else if (method === 'sms' && phone) {
      // Simulate SMS invite
      window.location.href = `sms:${phone}?body=${encodeURIComponent(inviteMessage)}`;
    }
    
    setEmail('');
    setPhone('');
  };

  const shareInvite = () => {
    const inviteMessage = `Join me on NeoVault - Malawi's revolutionary digital banking platform! Send and receive money for FREE within our network.`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Join NeoVault',
        text: inviteMessage,
        url: inviteLink || 'https://neovault.app'
      });
    } else {
      navigator.clipboard.writeText(inviteMessage + ' ' + (inviteLink || 'https://neovault.app'));
    }
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink || 'https://neovault.app');
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
          <h2 className="text-2xl font-bold text-white">Invite Friends</h2>
        </div>
      )}

      <Card className="gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <span>Invite Friends</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mb-4">
              <Gift className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Invite Friends to NeoVault</h3>
            <p className="text-muted-foreground">
              Invite your friends and family to join NeoVault. Send money to each other for FREE within our network!
            </p>
          </div>

          <div className="space-y-4">
            <Card className="p-4 bg-white/5 border-border/50">
              <h4 className="font-semibold mb-3 flex items-center">
                <Smartphone className="w-4 h-4 mr-2" />
                Invite by {t('phone')}/{t('email')}
              </h4>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="email">{t('email')}</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="email"
                      type="email"
                      placeholder="friend@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={() => sendInvite('email')}
                      disabled={!email}
                      className="gradient-primary"
                    >
                      {t('send')}
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="phone">{t('phone')}</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+265 123 456 789"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={() => sendInvite('sms')}
                      disabled={!phone}
                      className="gradient-secondary"
                    >
                      {t('send')}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-white/5 border-border/50">
              <h4 className="font-semibold mb-3 flex items-center">
                <Share2 className="w-4 h-4 mr-2" />
                Share Invite Link
              </h4>
              <div className="space-y-3">
                <Button 
                  onClick={generateInviteLink}
                  className="w-full gradient-tertiary"
                >
                  Generate Invite Link
                </Button>
                
                {inviteLink && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Input value={inviteLink} readOnly className="flex-1" />
                      <Button size="sm" onClick={copyInviteLink}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button 
                      onClick={shareInvite}
                      className="w-full gradient-primary"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Invite
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-4 bg-accent/10 border-accent/30">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-accent">Referral Benefits</h4>
                  <p className="text-xs text-muted-foreground">You and your friend both get benefits when they join!</p>
                </div>
                <Badge className="bg-accent/20 text-accent">
                  FREE Transfers
                </Badge>
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
