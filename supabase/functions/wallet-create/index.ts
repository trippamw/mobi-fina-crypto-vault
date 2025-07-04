import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    const { currency_code, wallet_type } = await req.json()

    // Validate currency and wallet type
    const supportedFiatCurrencies = ['MWK', 'USD', 'GBP', 'EUR', 'ZAR']
    const supportedCryptoCurrencies = ['BTC', 'ETH', 'USDC', 'USDT']
    const supportedWalletTypes = ['fiat', 'crypto']

    if (!supportedWalletTypes.includes(wallet_type)) {
      throw new Error('Invalid wallet type. Must be fiat or crypto')
    }

    if (wallet_type === 'fiat' && !supportedFiatCurrencies.includes(currency_code)) {
      throw new Error(`Unsupported fiat currency: ${currency_code}. Supported: ${supportedFiatCurrencies.join(', ')}`)
    }

    if (wallet_type === 'crypto' && !supportedCryptoCurrencies.includes(currency_code)) {
      throw new Error(`Unsupported crypto currency: ${currency_code}. Supported: ${supportedCryptoCurrencies.join(', ')}`)
    }

    // Check if user already has a wallet for this currency
    const { data: existingWallet } = await supabaseAdmin
      .from('wallets')
      .select('id')
      .eq('user_id', user.id)
      .eq('currency_code', currency_code)
      .single()

    if (existingWallet) {
      throw new Error(`You already have a ${currency_code} wallet`)
    }

    // Create the new wallet
    const { data: newWallet, error: walletError } = await supabaseAdmin
      .from('wallets')
      .insert({
        user_id: user.id,
        currency_code,
        wallet_type,
        balance: 0,
        is_primary: false // Only MWK should be primary (set during user creation)
      })
      .select()
      .single()

    if (walletError) {
      throw new Error(`Failed to create wallet: ${walletError.message}`)
    }

    // Log the wallet creation
    await supabaseAdmin
      .from('activity_logs')
      .insert({
        user_id: user.id,
        action: 'wallet_created',
        resource_type: 'wallet',
        resource_id: newWallet.id,
        metadata: {
          currency_code,
          wallet_type
        }
      })

    console.log(`Wallet created successfully for user ${user.id}: ${currency_code} (${wallet_type})`)

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          wallet: newWallet,
          message: `${currency_code} wallet created successfully`
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in wallet-create function:', error)
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