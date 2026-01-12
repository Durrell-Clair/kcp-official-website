// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// @ts-ignore - Deno runtime imports
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
// @ts-ignore - Deno runtime imports
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TranzakWebhookPayload {
  event: 'SUCCESSFUL' | 'FAILED';
  requestId: string;
  transactionId?: string;
  status: string;
  amount?: number;
  currency?: string;
  paymentMethod?: string;
  metadata?: Record<string, any>;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get Supabase client
    // @ts-ignore - Deno global
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    // @ts-ignore - Deno global
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get webhook payload
    const payload: TranzakWebhookPayload = await req.json();
    const { event, requestId, transactionId, status, amount, currency, paymentMethod, metadata } = payload;

    console.log('Tranzak webhook received:', { event, requestId, transactionId, status });

    // Find payment by tranzak_request_id
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('tranzak_request_id', requestId)
      .maybeSingle();

    if (paymentError) {
      console.error('Error fetching payment:', paymentError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch payment' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!payment) {
      console.error('Payment not found for requestId:', requestId);
      return new Response(
        JSON.stringify({ error: 'Payment not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update payment status
    const paymentStatus = event === 'SUCCESSFUL' ? 'completed' : 'failed';
    const updateData: any = {
      status: paymentStatus,
      webhook_data: payload,
    };

    if (transactionId) {
      updateData.tranzak_transaction_id = transactionId;
    }

    if (paymentMethod) {
      updateData.payment_method = paymentMethod.toLowerCase().includes('mtn') 
        ? 'mobile_money_mtn' 
        : paymentMethod.toLowerCase().includes('orange')
        ? 'mobile_money_orange'
        : paymentMethod;
    }

    if (event === 'SUCCESSFUL') {
      updateData.completed_at = new Date().toISOString();
    }

    const { error: updateError } = await supabase
      .from('payments')
      .update(updateData)
      .eq('id', payment.id);

    if (updateError) {
      console.error('Error updating payment:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update payment' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If payment successful, create subscription and license
    if (event === 'SUCCESSFUL' && payment.plan_id) {
      // Get plan details
      const { data: plan, error: planError } = await supabase
        .from('plans')
        .select('*')
        .eq('id', payment.plan_id)
        .single();

      if (planError) {
        console.error('Error fetching plan:', planError);
      } else {
        // Calculate subscription dates (1 month from now)
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);

        // Create or update subscription
        const { data: existingSubscription } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', payment.user_id)
          .eq('status', 'active')
          .maybeSingle();

        if (existingSubscription) {
          // Extend existing subscription
          const { error: extendError } = await supabase
            .from('subscriptions')
            .update({
              end_date: endDate.toISOString(),
              plan_id: payment.plan_id,
              plan_name: plan.name,
              max_users: plan.max_users,
              amount: payment.amount,
              status: 'active',
            })
            .eq('id', existingSubscription.id);

          if (extendError) {
            console.error('Error extending subscription:', extendError);
          }
        } else {
          // Create new subscription
          const { error: subscriptionError } = await supabase
            .from('subscriptions')
            .insert({
              user_id: payment.user_id,
              plan_id: payment.plan_id,
              plan_name: plan.name,
              max_users: plan.max_users,
              status: 'active',
              start_date: startDate.toISOString(),
              end_date: endDate.toISOString(),
              amount: payment.amount,
              currency: payment.currency || 'XAF',
              payment_method: updateData.payment_method,
            });

          if (subscriptionError) {
            console.error('Error creating subscription:', subscriptionError);
          }
        }

        // Link payment to subscription
        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('id')
          .eq('user_id', payment.user_id)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (subscription) {
          await supabase
            .from('payments')
            .update({ subscription_id: subscription.id })
            .eq('id', payment.id);
        }

        // Generate license if not exists
        const { data: existingLicense } = await supabase
          .from('licenses')
          .select('*')
          .eq('user_id', payment.user_id)
          .eq('is_active', true)
          .maybeSingle();

        if (!existingLicense) {
          // Call the generate_license_key function
          const { data: licenseKey, error: licenseKeyError } = await supabase
            .rpc('generate_license_key');

          if (licenseKeyError) {
            console.error('Error generating license key:', licenseKeyError);
          } else {
            const licenseExpiresAt = new Date();
            licenseExpiresAt.setMonth(licenseExpiresAt.getMonth() + 1);

            const { error: licenseError } = await supabase
              .from('licenses')
              .insert({
                user_id: payment.user_id,
                license_key: licenseKey,
                expires_at: licenseExpiresAt.toISOString(),
                is_active: true,
              });

            if (licenseError) {
              console.error('Error creating license:', licenseError);
            }
          }
        } else {
          // Update existing license expiration
          const licenseExpiresAt = new Date();
          licenseExpiresAt.setMonth(licenseExpiresAt.getMonth() + 1);

          await supabase
            .from('licenses')
            .update({
              expires_at: licenseExpiresAt.toISOString(),
              is_active: true,
            })
            .eq('id', existingLicense.id);
        }
      }
    }

    // Return success response
    return new Response(
      JSON.stringify({ success: true, message: 'Webhook processed successfully' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', message: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
