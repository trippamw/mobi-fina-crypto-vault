import { useState, useEffect } from 'react';
import { apiService, UserData } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

export const useUserData = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = async () => {
    if (!user) {
      setUserData(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getUserData();
      setUserData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user data');
      console.error('Error fetching user data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user]);

  const refreshData = () => {
    fetchUserData();
  };

  return {
    userData,
    loading,
    error,
    refreshData,
    // Individual data arrays for easier access
    wallets: userData?.wallets || [],
    transactions: userData?.transactions || [],
    cards: userData?.cards || [],
    savingsGoals: userData?.savingsGoals || [],
    villageBanks: userData?.villageBanks || [],
    profile: userData?.profile
  };
};