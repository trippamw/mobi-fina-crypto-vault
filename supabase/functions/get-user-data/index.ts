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

    // Get user profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      throw new Error('Profile not found')
    }

    // Get user wallets
    const { data: wallets, error: walletsError } = await supabaseAdmin
      .from('wallets')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    if (walletsError) {
      throw new Error('Failed to fetch wallets')
    }

    // Get recent transactions
    const { data: transactions, error: transactionsError } = await supabaseAdmin
      .from('transactions')
      .select('*')
      .or(`user_id.eq.${user.id},recipient_user_id.eq.${user.id}`)
      .order('created_at', { ascending: false })
      .limit(20)

    if (transactionsError) {
      throw new Error('Failed to fetch transactions')
    }

    // Get savings goals
    const { data: savingsGoals, error: goalsError } = await supabaseAdmin
      .from('savings_goals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (goalsError) {
      throw new Error('Failed to fetch savings goals')
    }

    // Get village bank memberships
    const { data: villageBankMemberships, error: membershipsError } = await supabaseAdmin
      .from('village_bank_members')
      .select(`
        *,
        village_banks (
          id,
          name,
          description,
          target_amount,
          current_amount,
          currency_code,
          contribution_amount,
          contribution_frequency,
          creator_id,
          is_active
        )
      `)
      .eq('user_id', user.id)
      .eq('is_active', true)

    if (membershipsError) {
      throw new Error('Failed to fetch village bank memberships')
    }

    // Get cards
    const { data: cards, error: cardsError } = await supabaseAdmin
      .from('cards')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (cardsError) {
      throw new Error('Failed to fetch cards')
    }

    // Get user roles
    const { data: roles, error: rolesError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)

    const userRoles = roles?.map(r => r.role) || ['user']

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            phone: user.phone
          },
          profile,
          wallets,
          transactions,
          savings_goals: savingsGoals,
          village_banks: villageBankMemberships,
          cards,
          roles: userRoles
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in get-user-data function:', error)
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