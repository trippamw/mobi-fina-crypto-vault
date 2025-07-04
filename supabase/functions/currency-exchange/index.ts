import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ExchangeRequest {
  fromWalletId: string
  toWalletId: string
  amount: number
  fromCurrency: string
  toCurrency: string
  exchangeRate: number
}

// Mock exchange rates - in production, fetch from real API
const exchangeRates: { [key: string]: number } = {
  'USD': 1,
  'MWK': 1751,
  'GBP': 0.79,
  'EUR': 0.92,
  'ZAR': 18.2,
  'BTC': 0.000015,
  'ETH': 0.00026,
  'USDT': 1,
  'USDC': 1
}

function getExchangeRate(from: string, to: string): number {
  if (from === to) return 1
  const fromRate = exchangeRates[from] || 1
  const toRate = exchangeRates[to] || 1
  return toRate / fromRate
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

    const body: ExchangeRequest = await req.json()
    const { fromWalletId, toWalletId, amount, fromCurrency, toCurrency, exchangeRate } = body

    if (!fromWalletId || !toWalletId || !amount || !fromCurrency || !toCurrency) {
      throw new Error('Missing required fields')
    }

    if (amount <= 0) {
      throw new Error('Amount must be greater than 0')
    }

    // Get both wallets
    const { data: fromWallet, error: fromWalletError } = await supabaseAdmin
      .from('wallets')
      .select('*')
      .eq('id', fromWalletId)
      .eq('user_id', user.id)
      .eq('currency_code', fromCurrency)
      .single()

    if (fromWalletError || !fromWallet) {
      throw new Error('Source wallet not found')
    }

    // Check sufficient balance
    if (parseFloat(fromWallet.balance) < amount) {
      throw new Error('Insufficient balance')
    }

    let { data: toWallet, error: toWalletError } = await supabaseAdmin
      .from('wallets')
      .select('*')
      .eq('id', toWalletId)
      .eq('user_id', user.id)
      .eq('currency_code', toCurrency)
      .single()

    if (toWalletError) {
      throw new Error('Destination wallet not found')
    }

    // Calculate exchange
    const currentRate = getExchangeRate(fromCurrency, toCurrency)
    const convertedAmount = amount * currentRate
    const reference = `EXC-${Date.now()}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`

    // Create transaction record
    const { data: transaction, error: transactionError } = await supabaseAdmin
      .from('transactions')
      .insert({
        user_id: user.id,
        from_wallet_id: fromWalletId,
        to_wallet_id: toWalletId,
        transaction_type: 'exchange',
        amount: amount,
        currency_code: fromCurrency,
        status: 'completed',
        reference_number: reference,
        description: `Exchange ${amount} ${fromCurrency} to ${convertedAmount.toFixed(8)} ${toCurrency}`,
        exchange_rate: currentRate,
        completed_at: new Date().toISOString(),
        metadata: {
          from_currency: fromCurrency,
          to_currency: toCurrency,
          converted_amount: convertedAmount,
          exchange_rate: currentRate
        }
      })
      .select()
      .single()

    if (transactionError) {
      throw new Error('Failed to create transaction')
    }

    // Update wallet balances
    const newFromBalance = parseFloat(fromWallet.balance) - amount
    const newToBalance = parseFloat(toWallet.balance) + convertedAmount

    // Update source wallet
    const { error: updateFromError } = await supabaseAdmin
      .from('wallets')
      .update({ balance: newFromBalance })
      .eq('id', fromWalletId)

    if (updateFromError) {
      throw new Error('Failed to update source wallet')
    }

    // Update destination wallet
    const { error: updateToError } = await supabaseAdmin
      .from('wallets')
      .update({ balance: newToBalance })
      .eq('id', toWalletId)

    if (updateToError) {
      // Rollback source wallet
      await supabaseAdmin
        .from('wallets')
        .update({ balance: fromWallet.balance })
        .eq('id', fromWalletId)
      
      throw new Error('Failed to update destination wallet')
    }

    // Log activity
    await supabaseAdmin
      .from('activity_logs')
      .insert({
        user_id: user.id,
        action: 'currency_exchanged',
        resource_type: 'transaction',
        resource_id: transaction.id,
        metadata: {
          from_amount: amount,
          from_currency: fromCurrency,
          to_amount: convertedAmount,
          to_currency: toCurrency,
          exchange_rate: currentRate,
          reference_number: reference
        }
      })

    return new Response(
      JSON.stringify({
        success: true,
        transaction: {
          id: transaction.id,
          reference_number: reference,
          from_amount: amount,
          from_currency: fromCurrency,
          to_amount: convertedAmount,
          to_currency: toCurrency,
          exchange_rate: currentRate,
          status: 'completed',
          timestamp: new Date().toISOString()
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in currency-exchange function:', error)
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