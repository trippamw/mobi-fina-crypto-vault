import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CreateCardRequest {
  walletId: string
  cardType: 'virtual' | 'physical'
  spendingLimit?: number
}

function generateMaskedCardNumber(): string {
  const lastFour = Math.floor(1000 + Math.random() * 9000).toString()
  return `**** **** **** ${lastFour}`
}

function generateExpiryDate(): { month: number, year: number } {
  const currentDate = new Date()
  const expiryYear = currentDate.getFullYear() + 4 // Card expires in 4 years
  const expiryMonth = Math.floor(Math.random() * 12) + 1 // Random month
  return { month: expiryMonth, year: expiryYear }
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

    const body: CreateCardRequest = await req.json()
    const { walletId, cardType, spendingLimit } = body

    if (!walletId || !cardType) {
      throw new Error('Missing required fields')
    }

    // Get user's wallet
    const { data: wallet, error: walletError } = await supabaseAdmin
      .from('wallets')
      .select('*')
      .eq('id', walletId)
      .eq('user_id', user.id)
      .single()

    if (walletError || !wallet) {
      throw new Error('Wallet not found')
    }

    // Get user profile for cardholder name
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      throw new Error('User profile not found')
    }

    const maskedNumber = generateMaskedCardNumber()
    const expiry = generateExpiryDate()

    // Create card
    const { data: card, error: cardError } = await supabaseAdmin
      .from('cards')
      .insert({
        user_id: user.id,
        wallet_id: walletId,
        card_type: cardType,
        masked_number: maskedNumber,
        expiry_month: expiry.month,
        expiry_year: expiry.year,
        cardholder_name: profile.full_name.toUpperCase(),
        status: cardType === 'virtual' ? 'active' : 'inactive', // Physical cards need activation
        spending_limit: spendingLimit
      })
      .select()
      .single()

    if (cardError) {
      throw new Error('Failed to create card')
    }

    // Log activity
    await supabaseAdmin
      .from('activity_logs')
      .insert({
        user_id: user.id,
        action: 'card_created',
        resource_type: 'card',
        resource_id: card.id,
        metadata: {
          card_type: cardType,
          wallet_id: walletId,
          currency: wallet.currency_code,
          spending_limit: spendingLimit
        }
      })

    return new Response(
      JSON.stringify({
        success: true,
        card: {
          id: card.id,
          masked_number: maskedNumber,
          card_type: cardType,
          expiry_month: expiry.month,
          expiry_year: expiry.year,
          cardholder_name: profile.full_name.toUpperCase(),
          status: card.status,
          spending_limit: spendingLimit,
          wallet: {
            id: walletId,
            currency: wallet.currency_code,
            balance: wallet.balance
          },
          created_at: card.created_at
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in cards-create function:', error)
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