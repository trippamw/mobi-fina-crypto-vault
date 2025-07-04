import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface VillageBankContributionRequest {
  villageBankId: string
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

    const body: VillageBankContributionRequest = await req.json()
    const { villageBankId, walletId, amount, currency } = body

    if (!villageBankId || !walletId || !amount || !currency) {
      throw new Error('Missing required fields')
    }

    if (amount <= 0) {
      throw new Error('Amount must be greater than 0')
    }

    // Get village bank
    const { data: villageBank, error: villageBankError } = await supabaseAdmin
      .from('village_banks')
      .select('*')
      .eq('id', villageBankId)
      .eq('is_active', true)
      .single()

    if (villageBankError || !villageBank) {
      throw new Error('Village bank not found')
    }

    // Check if user is a member
    const { data: membership, error: membershipError } = await supabaseAdmin
      .from('village_bank_members')
      .select('*')
      .eq('village_bank_id', villageBankId)
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single()

    if (membershipError || !membership) {
      throw new Error('You are not a member of this village bank')
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

    const reference = `VB-${Date.now()}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`

    // Create transaction record
    const { data: transaction, error: transactionError } = await supabaseAdmin
      .from('transactions')
      .insert({
        user_id: user.id,
        from_wallet_id: walletId,
        transaction_type: 'village_bank_contribution',
        amount: amount,
        currency_code: currency,
        status: 'completed',
        reference_number: reference,
        description: `Contribution to village bank: ${villageBank.name}`,
        completed_at: new Date().toISOString(),
        metadata: {
          village_bank_id: villageBankId,
          village_bank_name: villageBank.name
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

    // Update village bank total
    const newVillageBankAmount = parseFloat(villageBank.current_amount) + amount
    const { error: updateVillageBankError } = await supabaseAdmin
      .from('village_banks')
      .update({ current_amount: newVillageBankAmount })
      .eq('id', villageBankId)

    if (updateVillageBankError) {
      // Rollback wallet balance
      await supabaseAdmin
        .from('wallets')
        .update({ balance: wallet.balance })
        .eq('id', walletId)
      
      throw new Error('Failed to update village bank')
    }

    // Update member's total contribution
    const newMemberTotal = parseFloat(membership.total_contributed) + amount
    const { error: updateMemberError } = await supabaseAdmin
      .from('village_bank_members')
      .update({ total_contributed: newMemberTotal })
      .eq('id', membership.id)

    if (updateMemberError) {
      console.error('Failed to update member contribution total:', updateMemberError)
    }

    // Record the contribution
    const { error: contributionError } = await supabaseAdmin
      .from('village_bank_contributions')
      .insert({
        village_bank_id: villageBankId,
        user_id: user.id,
        amount: amount,
        transaction_id: transaction.id
      })

    if (contributionError) {
      console.error('Failed to record contribution:', contributionError)
    }

    // Log activity
    await supabaseAdmin
      .from('activity_logs')
      .insert({
        user_id: user.id,
        action: 'village_bank_contribution',
        resource_type: 'village_bank',
        resource_id: villageBankId,
        metadata: {
          amount,
          currency,
          village_bank_name: villageBank.name,
          new_village_bank_amount: newVillageBankAmount,
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
          village_bank: {
            id: villageBankId,
            name: villageBank.name,
            previous_amount: villageBank.current_amount,
            new_amount: newVillageBankAmount,
            target_amount: villageBank.target_amount
          },
          member_contribution: {
            previous_total: membership.total_contributed,
            new_total: newMemberTotal
          }
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in village-bank-contribute function:', error)
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