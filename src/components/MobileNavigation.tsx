import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, Wallet, ArrowUpDown, PiggyBank, User, Plus, Send, ArrowDownLeft, CreditCard, Zap } from 'lucide-react';
import { useLanguage } from '@/utils/languageApi';

interface MobileNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  notificationCount?: number;
}

export const MobileNavigation = ({ activeTab, onTabChange, notificationCount = 0 }: MobileNavigationProps) => {
  const { t } = useLanguage();

  const navItems = [
    {
      id: 'home',
      label: t('home'),
      icon: Home,
      subItems: [
        { id: 'deposit', label: t('deposit'), icon: Plus },
        { id: 'send', label: t('send'), icon: Send },
        { id: 'receive', label: t('receive'), icon: ArrowDownLeft },
        { id: 'bills', label: t('bills'), icon: Zap }
      ]
    },
    {
      id: 'wallet',
      label: t('wallet'),
      icon: Wallet,
      subItems: [
        { id: 'cards', label: t('cards'), icon: CreditCard }
      ]
    },
    {
      id: 'exchange',
      label: t('exchange'),
      icon: ArrowUpDown
    },
    {
      id: 'save',
      label: t('invest'),
      icon: PiggyBank,
      subItems: [
        { id: 'invest', label: t('invest'), icon: PiggyBank },
        { id: 'village', label: t('villageBank'), icon: PiggyBank }
      ]
    },
    {
      id: 'profile',
      label: t('profile'),
      icon: User
    }
  ];

  const getActiveMainTab = () => {
    const subTabMappings: { [key: string]: string } = {
      'deposit': 'home',
      'send': 'home',
      'receive': 'home',
      'bills': 'home',
      'cards': 'wallet',
      'invest': 'save',
      'village': 'save'
    };
    return subTabMappings[activeTab] || activeTab;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pb-safe-area-inset-bottom">
      <div className="bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-indigo-600/30 backdrop-blur-3xl border-t border-white/20 mx-3 mb-3 rounded-3xl shadow-2xl">
        <div className="flex items-center justify-around py-4 px-2">
          {navItems.map((item) => {
            const isActive = getActiveMainTab() === item.id;
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                onClick={() => onTabChange(item.id)}
                className={`flex-1 flex-col h-16 space-y-1 relative rounded-2xl transition-all duration-300 font-premium ${
                  isActive 
                    ? 'text-white bg-gradient-to-r from-blue-500/40 to-purple-500/40 shadow-lg border border-white/20' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
                {item.id === 'profile' && notificationCount > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notificationCount > 99 ? '99+' : notificationCount}
                  </div>
                )}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );

  function getActiveMainTab() {
    const subTabMappings: { [key: string]: string } = {
      'deposit': 'home',
      'send': 'home',
      'receive': 'home',
      'bills': 'home',
      'cards': 'wallet',
      'invest': 'save',
      'village': 'save'
    };
    return subTabMappings[activeTab] || activeTab;
  }
};
