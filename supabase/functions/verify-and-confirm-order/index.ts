// Supabase Edge Function: verify-and-confirm-order
// Purpose: Server-side payment verification via Paystack API + order creation + email notification
// Runtime: Deno (Supabase Edge Functions)
// Deploy: supabase functions deploy verify-and-confirm-order
//
// Required Supabase Secrets:
//   PAYSTACK_SECRET_KEY     — from Paystack Dashboard → Settings → API Keys (sk_test_... or sk_live_...)
//   RESEND_API_KEY          — from resend.com dashboard
//   NOTIFICATION_FROM_EMAIL — e.g. onboarding@resend.dev (for testing) or orders@yourdomain.com

// @ts-ignore: Deno URL imports resolve at runtime
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
// @ts-ignore: Deno URL imports resolve at runtime
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// deno-lint-ignore no-explicit-any
serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { reference, orderData, userEmail, userName } = await req.json();

    if (!reference) {
      return new Response(JSON.stringify({ error: 'Payment reference is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ─── Step 1: Verify payment with Paystack ───────────────────────────────
    // @ts-ignore: Deno global available at runtime
    const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY');
    if (!paystackSecretKey) throw new Error('PAYSTACK_SECRET_KEY secret is not set');

    const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${paystackSecretKey}` },
    });

    const verifyJson = await verifyRes.json();

    if (!verifyRes.ok || verifyJson.data?.status !== 'success') {
      return new Response(
        JSON.stringify({ error: 'Payment verification failed', details: verifyJson.message }),
        { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Amount check: Paystack returns amount in kobo — must match what client sent
    const verifiedAmount: number = verifyJson.data.amount;
    if (verifiedAmount !== orderData.total_amount) {
      return new Response(
        JSON.stringify({ error: 'Amount mismatch — possible tampering detected' }),
        { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ─── Step 2: Create order in Supabase (using service role key) ──────────
    // @ts-ignore: Deno global available at runtime
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    // @ts-ignore: Deno global available at runtime
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    let createdOrder = null;
    if (orderData.user_id) {
      const { data: order, error: orderError } = await supabaseAdmin
        .from('orders')
        .insert([{ ...orderData, payment_intent_id: reference }])
        .select()
        .single();

      if (orderError) throw orderError;
      createdOrder = order;
    }

    // ─── Step 3: Send confirmation email via Resend ─────────────────────────
    // @ts-ignore: Deno global available at runtime
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    // @ts-ignore: Deno global available at runtime
    const fromEmail = Deno.env.get('NOTIFICATION_FROM_EMAIL') ?? 'onboarding@resend.dev';

    if (resendApiKey && userEmail) {
      // deno-lint-ignore no-explicit-any
      const itemRows = orderData.items.map((item: any) => `
        <tr>
          <td style="padding:12px 8px;border-bottom:1px solid #f0ede8;font-family:Georgia,serif;">${item.title}</td>
          <td style="padding:12px 8px;border-bottom:1px solid #f0ede8;text-align:center;color:#555;">${item.quantity}</td>
          <td style="padding:12px 8px;border-bottom:1px solid #f0ede8;text-align:right;font-weight:600;">&#8358;${(parseFloat(item.price) * item.quantity).toLocaleString('en-NG', { minimumFractionDigits: 2 })}</td>
        </tr>`).join('');

      const totalFormatted = `&#8358;${(orderData.total_amount / 100).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;
      const shippingAddr = orderData.shipping_address;

      const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation — Elilian Signature</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap');
    body {
      margin: 0;
      padding: 0;
      background: #f5f1eb;
      font-family: 'Jost', Arial, sans-serif;
    }
  </style>
</head>
<body>
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f1eb;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr><td style="background:#1B1F3B;padding:36px 40px;text-align:center;">
          <!-- Since email clients block base64, please replace VERCELLINK.COM with your actual live domain -->
          <img src="https://elilian.shop/logo.png" alt="Elilian Signature Logo" style="height:60px;width:auto;margin-bottom:16px;object-fit:contain;" onerror="this.style.display='none'" />
          <p style="margin:0;font-family:'Cormorant Garamond', Georgia, serif;font-size:32px;font-weight:600;color:#ffffff;letter-spacing:2px;text-transform:uppercase;">Elilian Signature</p>
          <p style="margin:8px 0 0;font-size:13px;color:#a0a8c8;letter-spacing:1px;font-family:'Jost', Arial, sans-serif;">Handmade Luxury, crafted for you.</p>
        </td></tr>
        <!-- Confirmed Banner -->
        <tr><td style="background:#C0522C;padding:20px 40px;text-align:center;">
          <p style="margin:0;font-size:16px;font-weight:500;color:#ffffff;font-family:'Jost', Arial, sans-serif;">&#10003; &nbsp; Order Confirmed</p>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:40px 40px 32px;">
          <p style="margin:0 0 8px;font-size:24px;font-family:'Cormorant Garamond', Georgia, serif;color:#1A1A1A;font-weight:600;">Thank you, ${userName || 'valued customer'}!</p>
          <p style="margin:0 0 32px;font-size:15px;color:#666;line-height:1.6;font-family:'Jost', Arial, sans-serif;">Your payment was successful and your order has been placed. We'll begin processing it right away.</p>
          <!-- Order Ref -->
          <div style="background:#faf8f5;border:1px solid #e8e0d6;border-radius:8px;padding:16px 20px;margin-bottom:32px;">
            <p style="margin:0;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:1px;font-family:'Jost', Arial, sans-serif;">Order Reference</p>
            <p style="margin:4px 0 0;font-size:19px;font-weight:600;color:#1B1F3B;font-family:'Cormorant Garamond', Georgia, serif;">${reference}</p>
          </div>
          <!-- Items -->
          <p style="margin:0 0 12px;font-size:14px;font-weight:600;color:#1A1A1A;text-transform:uppercase;letter-spacing:1px;font-family:'Jost', Arial, sans-serif;">Items Ordered</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:24px;font-family:'Jost', Arial, sans-serif;">
            <thead>
              <tr style="border-bottom:2px solid #1B1F3B;">
                <th style="padding:8px 8px 12px;text-align:left;font-size:12px;color:#888;text-transform:uppercase;font-weight:500;">Item</th>
                <th style="padding:8px 8px 12px;text-align:center;font-size:12px;color:#888;text-transform:uppercase;font-weight:500;">Qty</th>
                <th style="padding:8px 8px 12px;text-align:right;font-size:12px;color:#888;text-transform:uppercase;font-weight:500;">Price</th>
              </tr>
            </thead>
            <tbody>${itemRows}</tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding:16px 8px 0;font-size:16px;font-weight:600;color:#1A1A1A;font-family:'Cormorant Garamond', Georgia, serif;">Total Paid</td>
                <td style="padding:16px 8px 0;text-align:right;font-size:18px;font-weight:600;color:#C0522C;">${totalFormatted}</td>
              </tr>
            </tfoot>
          </table>
          <!-- Shipping -->
          <p style="margin:0 0 12px;font-size:14px;font-weight:600;color:#1A1A1A;text-transform:uppercase;letter-spacing:1px;font-family:'Jost', Arial, sans-serif;">Shipping To</p>
          <div style="background:#faf8f5;border:1px solid #e8e0d6;border-radius:8px;padding:16px 20px;margin-bottom:40px;font-size:15px;color:#555;line-height:1.7;font-family:'Jost', Arial, sans-serif;">
            <strong style="color:#1A1A1A;font-weight:600;">${shippingAddr.fullName}</strong><br>
            ${shippingAddr.address}<br>
            ${shippingAddr.city}, ${shippingAddr.country}<br>
            ${shippingAddr.phone}
          </div>
          <!-- CTA -->
          <div style="text-align:center;margin-bottom:16px;">
            <p style="margin:0 0 20px;font-size:15px;color:#666;font-family:'Jost', Arial, sans-serif;">Questions about your order? We're here to help.</p>
            <a href="https://wa.me/2347014759933" style="display:inline-block;background:#25D366;color:#ffffff;text-decoration:none;padding:16px 36px;border-radius:8px;font-size:16px;font-weight:600;font-family:'Jost', Arial, sans-serif;box-shadow:0 4px 12px rgba(37,211,102,0.2);">Chat on WhatsApp</a>
          </div>
        </td></tr>
        <!-- Footer -->
        <tr><td style="background:#1B1F3B;padding:32px 40px;text-align:center;">
          <p style="margin:0;font-size:13px;color:#a0a8c8;font-family:'Jost', Arial, sans-serif;">&#169; 2026 Elilian Signature. All rights reserved.</p>
          <p style="margin:8px 0 0;font-size:12px;color:#6b7280;font-family:'Jost', Arial, sans-serif;">You received this email because you made a purchase at our store.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`.trim();

      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [userEmail],
          subject: `Order Confirmed — Ref: ${reference} | Elilian Signature`,
          html: emailHtml,
        }),
      });
    }

    // ─── Step 4: Return success ─────────────────────────────────────────────
    return new Response(
      JSON.stringify({ success: true, order: createdOrder, reference }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    console.error('[verify-and-confirm-order]', err);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
