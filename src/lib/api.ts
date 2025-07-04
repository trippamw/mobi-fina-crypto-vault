import { supabase } from '@/integrations/supabase/client';

export interface UserData {
  profile: any;
  wallets: any[];
  transactions: any[];
  cards: any[];
  savingsGoals: any[];
  villageBanks: any[];
}

export const apiService = {
  // Get user data
  getUserData: async (): Promise<UserData | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Get user wallets
      const { data: wallets } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id);

      // Get recent transactions
      const { data: transactions } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      // Get user cards
      const { data: cards } = await supabase
        .from('cards')
        .select('*')
        .eq('user_id', user.id);

      // Get savings goals
      const { data: savingsGoals } = await supabase
        .from('savings_goals')
        .select('*')
        .eq('user_id', user.id);

      // Get village banks
      const { data: villageBanks } = await supabase
        .from('village_banks')
        .select('*')
        .eq('creator_id', user.id);

      return {
        profile: profile || null,
        wallets: wallets || [],
        transactions: transactions || [],
        cards: cards || [],
        savingsGoals: savingsGoals || [],
        villageBanks: villageBanks || []
      };
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  },

  // Deposit money to wallet
  deposit: async (walletId: string, amount: number, currency: string, paymentMethod: string) => {
    try {
      const result = await supabase.functions.invoke('wallet-deposit', {
        body: { walletId, amount, currency, paymentMethod }
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      return result.data;
    } catch (error) {
      console.error('Deposit error:', error);
      throw error;
    }
  },

  // Send money
  send: async (fromWalletId: string, toUserId: string, amount: number, currency: string, description?: string) => {
    try {
      const result = await supabase.functions.invoke('wallet-send', {
        body: { fromWalletId, toUserId, amount, currency, description }
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      return result.data;
    } catch (error) {
      console.error('Send error:', error);
      throw error;
    }
  },

  // Withdraw money
  withdraw: async (walletId: string, amount: number, currency: string, withdrawalMethod: string, accountDetails: any) => {
    try {
      const result = await supabase.functions.invoke('wallet-withdraw', {
        body: { walletId, amount, currency, withdrawalMethod, accountDetails }
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      return result.data;
    } catch (error) {
      console.error('Withdraw error:', error);
      throw error;
    }
  },

  // Exchange currency
  exchange: async (fromWalletId: string, toWalletId: string, fromAmount: number) => {
    try {
      const result = await supabase.functions.invoke('currency-exchange', {
        body: { fromWalletId, toWalletId, fromAmount }
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      return result.data;
    } catch (error) {
      console.error('Exchange error:', error);
      throw error;
    }
  },

  // Create virtual card
  createCard: async (walletId: string, cardType: string, cardholderName: string) => {
    try {
      const result = await supabase.functions.invoke('cards-create', {
        body: { walletId, cardType, cardholderName }
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      return result.data;
    } catch (error) {
      console.error('Card creation error:', error);
      throw error;
    }
  },

  // Create wallet
  createWallet: async (currency_code: string, wallet_type: string) => {
    try {
      const result = await supabase.functions.invoke('wallet-create', {
        body: { currency_code, wallet_type }
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      return result.data;
    } catch (error) {
      console.error('Wallet creation error:', error);
      throw error;
    }
  }
};