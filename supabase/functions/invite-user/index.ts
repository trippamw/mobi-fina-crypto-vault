import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface InviteRequest {
  email: string
  phone?: string
  invitationType: 'app' | 'village_bank'
  villageBankId?: string
  message?: string
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

    const body: InviteRequest = await req.json()
    const { email, phone, invitationType, villageBankId, message } = body

    if (!email || !invitationType) {
      throw new Error('Missing required fields')
    }

    // Validate village bank invitation
    if (invitationType === 'village_bank') {
      if (!villageBankId) {
        throw new Error('Village bank ID required for village bank invitations')
      }

      // Check if village bank exists and user has permission
      const { data: villageBank, error: villageBankError } = await supabaseAdmin
        .from('village_banks')
        .select('*')
        .eq('id', villageBankId)
        .single()

      if (villageBankError || !villageBank) {
        throw new Error('Village bank not found')
      }

      // Check if user is creator or member
      const { data: membership } = await supabaseAdmin
        .from('village_bank_members')
        .select('*')
        .eq('village_bank_id', villageBankId)
        .eq('user_id', user.id)
        .single()

      if (villageBank.creator_id !== user.id && !membership) {
        throw new Error('You do not have permission to invite to this village bank')
      }
    }

    // Check if invitation already exists
    const { data: existingInvite } = await supabaseAdmin
      .from('invitations')
      .select('*')
      .eq('invitee_email', email)
      .eq('invitation_type', invitationType)
      .eq('status', 'pending')
      .maybeSingle()

    if (existingInvite) {
      throw new Error('An active invitation already exists for this email')
    }

    // Create invitation
    const { data: invitation, error: invitationError } = await supabaseAdmin
      .from('invitations')
      .insert({
        inviter_id: user.id,
        invitee_email: email,
        invitee_phone: phone,
        invitation_type: invitationType,
        village_bank_id: villageBankId,
        status: 'pending'
      })
      .select()
      .single()

    if (invitationError) {
      throw new Error('Failed to create invitation')
    }

    // Get inviter profile
    const { data: inviterProfile } = await supabaseAdmin
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single()

    // In a real app, you would send an email/SMS here
    // For now, we'll just log the invitation details
    console.log('Invitation created:', {
      id: invitation.id,
      from: inviterProfile?.full_name || 'Someone',
      to: email,
      type: invitationType,
      message: message || 'You have been invited!'
    })

    // Log activity
    await supabaseAdmin
      .from('activity_logs')
      .insert({
        user_id: user.id,
        action: 'invitation_sent',
        resource_type: 'invitation',
        resource_id: invitation.id,
        metadata: {
          invitee_email: email,
          invitation_type: invitationType,
          village_bank_id: villageBankId
        }
      })

    return new Response(
      JSON.stringify({
        success: true,
        invitation: {
          id: invitation.id,
          email: email,
          phone: phone,
          type: invitationType,
          village_bank_id: villageBankId,
          status: 'pending',
          invited_at: invitation.invited_at,
          expires_at: invitation.expires_at
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in invite-user function:', error)
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