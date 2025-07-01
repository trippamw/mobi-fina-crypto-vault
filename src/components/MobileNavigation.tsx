
import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, Wallet, ArrowUpDown, PiggyBank, User, Plus, Send, ArrowDownLeft, CreditCard, Zap } from 'lucide-react';

interface MobileNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const MobileNavigation = ({ activeTab, onTabChange }: MobileNavigationProps) => {
  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      subItems: [
        { id: 'deposit', label: 'Deposit', icon: Plus },
        { id: 'send', label: 'Send', icon: Send },
        { id: 'receive', label: 'Receive', icon: ArrowDownLeft },
        { id: 'bills', label: 'Bills', icon: Zap }
      ]
    },
    {
      id: 'wallet',
      label: 'Wallet',
      icon: Wallet,
      subItems: [
        { id: 'cards', label: 'Cards', icon: CreditCard }
      ]
    },
    {
      id: 'exchange',
      label: 'Exchange',
      icon: ArrowUpDown
    },
    {
      id: 'save',
      label: 'Save',
      icon: PiggyBank,
      subItems: [
        { id: 'invest', label: 'Invest', icon: PiggyBank },
        { id: 'village', label: 'Village Bank', icon: PiggyBank }
      ]
    },
    {
      id: 'profile',
      label: 'Profile',
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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border/50 md:hidden mobile-safe-area">
      <div className="flex items-center justify-around py-2 px-1">
        {navItems.map((item) => {
          const isActive = getActiveMainTab() === item.id;
          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={() => onTabChange(item.id)}
              className={`flex-1 flex-col h-16 space-y-1 ${
                isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};
