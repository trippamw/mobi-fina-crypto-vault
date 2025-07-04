-- Enable realtime for transactions and wallets tables
ALTER TABLE public.transactions REPLICA IDENTITY FULL;
ALTER TABLE public.wallets REPLICA IDENTITY FULL;

-- Add tables to realtime publication
SELECT supabase_realtime.publisher_publish('supabase_realtime', 'transactions');
SELECT supabase_realtime.publisher_publish('supabase_realtime', 'wallets');