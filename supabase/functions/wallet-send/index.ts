import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SendMoneyRequest {
  fromWalletId: string
  toUserId: string
  amount: number
  currency: string
  description?: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const authHeader = req.headers.get('Authorization')!
    
    // Create Supabase clients
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
    const supabase = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } }
    })

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    const body: SendMoneyRequest = await req.json()
    const { fromWalletId, toUserId, amount, currency, description } = body

    // Validate input
    if (!fromWalletId || !toUserId || !amount || !currency) {
      throw new Error('Missing required fields')
    }

    if (amount <= 0) {
      throw new Error('Amount must be greater than 0')
    }

    // Get sender's wallet
    const { data: fromWallet, error: fromWalletError } = await supabaseAdmin
      .from('wallets')
      .select('*')
      .eq('id', fromWalletId)
      .eq('user_id', user.id)
      .eq('currency_code', currency)
      .single()

    if (fromWalletError || !fromWallet) {
      throw new Error('Sender wallet not found')
    }

    // Check sufficient balance
    if (parseFloat(fromWallet.balance) < amount) {
      throw new Error('Insufficient balance')
    }

    // Get recipient's wallet (create if doesn't exist)
    let { data: toWallet, error: toWalletError } = await supabaseAdmin
      .from('wallets')
      .select('*')
      .eq('user_id', toUserId)
      .eq('currency_code', currency)
      .single()

    if (toWalletError) {
      // Create recipient wallet if it doesn't exist
      const walletType = ['BTC', 'ETH', 'USDT', 'USDC'].includes(currency) ? 'crypto' : 'fiat'
      const { data: newWallet, error: createWalletError } = await supabaseAdmin
        .from('wallets')
        .insert({
          user_id: toUserId,
          currency_code: currency,
          wallet_type: walletType,
          balance: 0
        })
        .select()
        .single()

      if (createWalletError) {
        throw new Error('Failed to create recipient wallet')
      }
      toWallet = newWallet
    }

    // Generate transaction reference
    const reference = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`

    // Create transaction record
    const { data: transaction, error: transactionError } = await supabaseAdmin
      .from('transactions')
      .insert({
        user_id: user.id,
        from_wallet_id: fromWalletId,
        to_wallet_id: toWallet.id,
        recipient_user_id: toUserId,
        transaction_type: 'send',
        amount: amount,
        currency_code: currency,
        status: 'pending',
        reference_number: reference,
        description: description || `Money transfer to user ${toUserId}`
      })
      .select()
      .single()

    if (transactionError) {
      throw new Error('Failed to create transaction')
    }

    // Update wallet balances
    const newFromBalance = parseFloat(fromWallet.balance) - amount
    const newToBalance = parseFloat(toWallet.balance) + amount

    // Update sender's wallet
    const { error: updateFromError } = await supabaseAdmin
      .from('wallets')
      .update({ balance: newFromBalance })
      .eq('id', fromWalletId)

    if (updateFromError) {
      throw new Error('Failed to update sender wallet')
    }

    // Update recipient's wallet
    const { error: updateToError } = await supabaseAdmin
      .from('wallets')
      .update({ balance: newToBalance })
      .eq('id', toWallet.id)

    if (updateToError) {
      // Rollback sender's wallet
      await supabaseAdmin
        .from('wallets')
        .update({ balance: fromWallet.balance })
        .eq('id', fromWalletId)
      
      throw new Error('Failed to update recipient wallet')
    }

    // Mark transaction as completed
    const { error: completeTransactionError } = await supabaseAdmin
      .from('transactions')
      .update({ 
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', transaction.id)

    if (completeTransactionError) {
      console.error('Failed to mark transaction as completed:', completeTransactionError)
    }

    // Log activity
    await supabaseAdmin
      .from('activity_logs')
      .insert({
        user_id: user.id,
        action: 'money_sent',
        resource_type: 'transaction',
        resource_id: transaction.id,
        metadata: {
          amount,
          currency,
          recipient_user_id: toUserId,
          reference_number: reference
        }
      })

    // Create corresponding receive transaction for recipient
    await supabaseAdmin
      .from('transactions')
      .insert({
        user_id: toUserId,
        from_wallet_id: fromWalletId,
        to_wallet_id: toWallet.id,
        recipient_user_id: toUserId,
        transaction_type: 'receive',
        amount: amount,
        currency_code: currency,
        status: 'completed',
        reference_number: reference,
        description: `Money received from user ${user.id}`,
        completed_at: new Date().toISOString()
      })

    return new Response(
      JSON.stringify({
        success: true,
        transaction: {
          id: transaction.id,
          reference_number: reference,
          amount,
          currency,
          status: 'completed',
          timestamp: new Date().toISOString(),
          from_wallet_id: fromWalletId,
          to_wallet_id: toWallet.id,
          recipient_user_id: toUserId
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in wallet-send function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        success: false 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})