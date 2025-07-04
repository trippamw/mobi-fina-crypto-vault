import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface GoalContributionRequest {
  goalId: string
  walletId: string
  amount: number
  currency: string
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

    const body: GoalContributionRequest = await req.json()
    const { goalId, walletId, amount, currency } = body

    if (!goalId || !walletId || !amount || !currency) {
      throw new Error('Missing required fields')
    }

    if (amount <= 0) {
      throw new Error('Amount must be greater than 0')
    }

    // Get savings goal
    const { data: goal, error: goalError } = await supabaseAdmin
      .from('savings_goals')
      .select('*')
      .eq('id', goalId)
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single()

    if (goalError || !goal) {
      throw new Error('Savings goal not found')
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

    const reference = `GOAL-${Date.now()}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`

    // Create transaction record
    const { data: transaction, error: transactionError } = await supabaseAdmin
      .from('transactions')
      .insert({
        user_id: user.id,
        from_wallet_id: walletId,
        transaction_type: 'goal_contribution',
        amount: amount,
        currency_code: currency,
        status: 'completed',
        reference_number: reference,
        description: `Contribution to savings goal: ${goal.title}`,
        completed_at: new Date().toISOString(),
        metadata: {
          goal_id: goalId,
          goal_title: goal.title
        }
      })
      .select()
      .single()

    if (transactionError) {
      throw new Error('Failed to create transaction')
    }

    // Update wallet balance
    const newWalletBalance = parseFloat(wallet.balance) - amount
    const { error: updateWalletError } = await supabaseAdmin
      .from('wallets')
      .update({ balance: newWalletBalance })
      .eq('id', walletId)

    if (updateWalletError) {
      throw new Error('Failed to update wallet balance')
    }

    // Update savings goal
    const newGoalAmount = parseFloat(goal.current_amount) + amount
    const { error: updateGoalError } = await supabaseAdmin
      .from('savings_goals')
      .update({ current_amount: newGoalAmount })
      .eq('id', goalId)

    if (updateGoalError) {
      // Rollback wallet balance
      await supabaseAdmin
        .from('wallets')
        .update({ balance: wallet.balance })
        .eq('id', walletId)
      
      throw new Error('Failed to update savings goal')
    }

    // Log activity
    await supabaseAdmin
      .from('activity_logs')
      .insert({
        user_id: user.id,
        action: 'goal_contribution',
        resource_type: 'savings_goal',
        resource_id: goalId,
        metadata: {
          amount,
          currency,
          goal_title: goal.title,
          new_goal_amount: newGoalAmount,
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
          goal: {
            id: goalId,
            title: goal.title,
            previous_amount: goal.current_amount,
            new_amount: newGoalAmount,
            target_amount: goal.target_amount,
            progress_percentage: (newGoalAmount / parseFloat(goal.target_amount)) * 100
          }
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in goals-contribute function:', error)
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