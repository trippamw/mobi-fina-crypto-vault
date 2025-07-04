import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WithdrawRequest {
  walletId: string
  amount: number
  currency: string
  withdrawalMethod: string // mobile_money, bank_transfer
  accountDetails: {
    accountNumber?: string
    bankName?: string
    phoneNumber?: string
  }
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
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
    const supabase = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } }
    })

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    const body: WithdrawRequest = await req.json()
    const { walletId, amount, currency, withdrawalMethod, accountDetails, description } = body

    if (!walletId || !amount || !currency || !withdrawalMethod) {
      throw new Error('Missing required fields')
    }

    if (amount <= 0) {
      throw new Error('Amount must be greater than 0')
    }

    // Get user's wallet
    const { data: wallet, error: walletError } = await supabaseAdmin
      .from('wallets')
      .select('*')
      .eq('id', walletId)
      .eq('user_id', user.id)
      .eq('currency_code', currency)
      .single()

    if (walletError || !wallet) {
      throw new Error('Wallet not found')
    }

    // Check sufficient balance
    if (parseFloat(wallet.balance) < amount) {
      throw new Error('Insufficient balance')
    }

    const reference = `WTH-${Date.now()}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`

    // Create transaction record
    const { data: transaction, error: transactionError } = await supabaseAdmin
      .from('transactions')
      .insert({
        user_id: user.id,
        from_wallet_id: walletId,
        transaction_type: 'withdraw',
        amount: amount,
        currency_code: currency,
        status: 'completed', // Simulate instant withdrawal
        reference_number: reference,
        description: description || `Withdrawal via ${withdrawalMethod}`,
        completed_at: new Date().toISOString(),
        metadata: {
          withdrawal_method: withdrawalMethod,
          account_details: accountDetails
        }
      })
      .select()
      .single()

    if (transactionError) {
      throw new Error('Failed to create transaction')
    }

    // Update wallet balance
    const newBalance = parseFloat(wallet.balance) - amount
    const { error: updateError } = await supabaseAdmin
      .from('wallets')
      .update({ balance: newBalance })
      .eq('id', walletId)

    if (updateError) {
      throw new Error('Failed to update wallet balance')
    }

    // Log activity
    await supabaseAdmin
      .from('activity_logs')
      .insert({
        user_id: user.id,
        action: 'money_withdrawn',
        resource_type: 'transaction',
        resource_id: transaction.id,
        metadata: {
          amount,
          currency,
          withdrawal_method: withdrawalMethod,
          reference_number: reference
        }
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
          wallet_id: walletId,
          withdrawal_method: withdrawalMethod
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in wallet-withdraw function:', error)
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