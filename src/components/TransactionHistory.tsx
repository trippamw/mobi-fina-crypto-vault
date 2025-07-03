
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Download, ArrowUpRight, ArrowDownLeft, Bitcoin, PiggyBank } from 'lucide-react';
import { useLanguage } from '@/utils/languageApi';

export const TransactionHistory = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const transactions = [
    {
      id: '001',
      type: 'received',
      description: 'TNM Mobile Money Transfer',
      amount: '+MWK 50,000',
      status: 'completed',
      date: '2024-01-15',
      time: '14:32',
      category: 'mobile-money'
    },
    {
      id: '002',
      type: 'exchange',
      description: 'BTC to MWK Exchange',
      amount: 'MWK 65,000',
      status: 'completed',
      date: '2024-01-15',
      time: '13:45',
      category: 'crypto'
    },
    {
      id: '003',
      type: 'investment',
      description: 'High Yield Savings Deposit',
      amount: '-MWK 25,000',
      status: 'completed',
      date: '2024-01-15',
      time: '12:20',
      category: 'investment'
    },
    {
      id: '004',
      type: 'sent',
      description: 'Payment to John Doe',
      amount: '-MWK 15,000',
      status: 'pending',
      date: '2024-01-14',
      time: '18:45',
      category: 'transfer'
    },
    {
      id: '005',
      type: 'received',
      description: 'Airtel Money Deposit',
      amount: '+MWK 30,000',
      status: 'completed',
      date: '2024-01-14',
      time: '16:30',
      category: 'mobile-money'
    },
    {
      id: '006',
      type: 'exchange',
      description: 'USD to MWK Exchange',
      amount: 'MWK 12,500',
      status: 'completed',
      date: '2024-01-14',
      time: '11:15',
      category: 'exchange'
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'received':
        return <ArrowDownLeft className="w-4 h-4 text-green-400" />;
      case 'sent':
        return <ArrowUpRight className="w-4 h-4 text-red-400" />;
      case 'exchange':
        return <Bitcoin className="w-4 h-4 text-yellow-400" />;
      case 'investment':
        return <PiggyBank className="w-4 h-4 text-purple-400" />;
      default:
        return <ArrowUpRight className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500/20 text-green-300 border-green-500/30">{t('success')}</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-500/20 text-red-300 border-red-500/30">{t('error')}</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.amount.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || transaction.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="gradient-card border-border/50">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40 bg-white/5 border-white/10">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="received">{t('receive')}</SelectItem>
                  <SelectItem value="sent">{t('send')}</SelectItem>
                  <SelectItem value="exchange">{t('exchange')}</SelectItem>
                  <SelectItem value="investment">{t('invest')}</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" className="border-white/10 hover:bg-white/10">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction List */}
      <Card className="gradient-card border-border/50">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {getIcon(transaction.type)}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <p className="text-sm text-muted-foreground">
                        {transaction.date} • {transaction.time}
                      </p>
                      {getStatusBadge(transaction.status)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.amount.startsWith('+') ? 'text-green-400' : 
                    transaction.amount.startsWith('-') ? 'text-red-400' : 'text-foreground'
                  }`}>
                    {transaction.amount}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {transaction.category.replace('-', ' ')}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No transactions found</p>
              <p className="text-sm text-muted-foreground mt-1">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
