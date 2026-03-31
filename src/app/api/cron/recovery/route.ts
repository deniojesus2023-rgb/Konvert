import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// ── Types ────────────────────────────────────────────────────────────────────

interface AbandonedCart {
  id: string
  store_id: string
  customer_name: string | null
  phone: string | null
  items: Array<{ product_name: string; quantity: number; price: number }>
  cart_total: number
  abandonment_stage: string
  abandoned_at: string
  recovery_attempts: number
  last_recovery_at: string | null
  coupon_sent: string | null
}

interface RecoveryRule {
  id: string
  store_id: string
  name: string
  trigger_type: string
  delay_minutes: number
  message_template: string
  coupon_type: 'percentage' | 'fixed' | 'free_delivery' | null
  coupon_value: number | null
  is_active: boolean
}

interface Store {
  id: string
  name: string
  slug: string
  settings: {
    whatsapp?: {
      api_url?: string
      instance?: string
      api_key?: string
    }
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function buildMessage(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => vars[key] ?? '')
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function generateCouponCode(storeSlug: string): string {
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase()
  return `VOLTA-${storeSlug.slice(0, 4).toUpperCase()}-${rand}`
}

function formatPhone(phone: string): string {
  // Normalise to E.164 for Brazil: strip everything except digits, add 55 prefix
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('55') && digits.length >= 12) return digits
  return `55${digits}`
}

async function sendWhatsApp(
  apiUrl: string,
  instance: string,
  apiKey: string,
  phone: string,
  message: string
): Promise<boolean> {
  try {
    const res = await fetch(`${apiUrl}/message/sendText/${instance}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: apiKey,
      },
      body: JSON.stringify({
        number: formatPhone(phone),
        textMessage: { text: message },
      }),
    })
    return res.ok
  } catch {
    return false
  }
}

// ── Main handler ─────────────────────────────────────────────────────────────

export async function POST(request: Request): Promise<NextResponse> {
  // 1. Auth check
  const authHeader = request.headers.get('authorization') ?? ''
  const token = authHeader.replace('Bearer ', '')
  if (!process.env.CRON_SECRET || token !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Service-role Supabase client (bypasses RLS)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const results = {
    processed: 0,
    sent: 0,
    skipped: 0,
    errors: [] as string[],
  }

  try {
    // 3. Load all stores that have WhatsApp configured
    const { data: stores, error: storesErr } = await supabase
      .from('stores')
      .select('id, name, slug, settings')
      .eq('is_active', true)

    if (storesErr) throw new Error(`Stores query failed: ${storesErr.message}`)
    if (!stores?.length) return NextResponse.json({ ...results, message: 'No active stores' })

    for (const store of stores as Store[]) {
      const whatsapp = store.settings?.whatsapp
      if (!whatsapp?.api_url || !whatsapp?.instance || !whatsapp?.api_key) {
        results.skipped++
        continue
      }

      // 4. Load active recovery rules for this store, sorted by delay ascending
      const { data: rules, error: rulesErr } = await supabase
        .from('recovery_rules')
        .select('*')
        .eq('store_id', store.id)
        .eq('is_active', true)
        .eq('trigger_type', 'cart_abandoned')
        .order('delay_minutes', { ascending: true })

      if (rulesErr) {
        results.errors.push(`Rules for store ${store.id}: ${rulesErr.message}`)
        continue
      }
      if (!rules?.length) continue

      // 5. For each rule slot, find matching carts
      for (let attempt = 0; attempt < rules.length; attempt++) {
        const rule = rules[attempt] as RecoveryRule
        const cutoff = new Date(Date.now() - rule.delay_minutes * 60 * 1000).toISOString()

        const { data: carts, error: cartsErr } = await supabase
          .from('abandoned_carts')
          .select('*')
          .eq('store_id', store.id)
          .eq('recovered', false)
          .eq('recovery_attempts', attempt)
          .not('phone', 'is', null)
          .lte('abandoned_at', cutoff)
          .limit(50) // safety cap per run

        if (cartsErr) {
          results.errors.push(`Carts for store ${store.id} attempt ${attempt}: ${cartsErr.message}`)
          continue
        }
        if (!carts?.length) continue

        for (const cart of carts as AbandonedCart[]) {
          results.processed++

          // 6. Build coupon if rule has one
          let couponCode: string | null = null
          if (rule.coupon_type && rule.coupon_value) {
            couponCode = generateCouponCode(store.slug)

            // Persist coupon to DB so checkout can validate it
            await supabase.from('coupons').insert({
              store_id: store.id,
              code: couponCode,
              type: rule.coupon_type,
              value: rule.coupon_value,
              max_uses: 1,
              is_active: true,
              expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            })
          }

          // 7. Build message from template
          const itemsList = Array.isArray(cart.items)
            ? cart.items.map((i) => `• ${i.quantity}x ${i.product_name}`).join('\n')
            : ''

          const couponLine =
            couponCode && rule.coupon_value
              ? rule.coupon_type === 'percentage'
                ? `${rule.coupon_value}% OFF — use o cupom *${couponCode}*`
                : `R$${rule.coupon_value} OFF — use o cupom *${couponCode}*`
              : ''

          const message = buildMessage(rule.message_template, {
            nome: cart.customer_name ?? 'cliente',
            customer_name: cart.customer_name ?? 'cliente',
            loja: store.name,
            store_name: store.name,
            itens: itemsList,
            items: itemsList,
            valor: formatCurrency(cart.cart_total),
            cart_total: formatCurrency(cart.cart_total),
            cupom: couponLine,
            coupon: couponLine,
          })

          // 8. Send WhatsApp message
          const sent = await sendWhatsApp(
            whatsapp.api_url,
            whatsapp.instance,
            whatsapp.api_key,
            cart.phone!,
            message
          )

          // 9. Log to whatsapp_messages
          await supabase.from('whatsapp_messages').insert({
            store_id: store.id,
            phone: cart.phone,
            message_type: 'recovery_cart',
            template_used: rule.name,
            message_body: message,
            status: sent ? 'sent' : 'failed',
            related_cart_id: cart.id,
            sent_at: sent ? new Date().toISOString() : null,
          })

          // 10. Update cart record
          await supabase
            .from('abandoned_carts')
            .update({
              recovery_attempts: cart.recovery_attempts + 1,
              last_recovery_at: new Date().toISOString(),
              ...(couponCode ? { coupon_sent: couponCode } : {}),
            })
            .eq('id', cart.id)

          if (sent) results.sent++
          else results.errors.push(`WhatsApp failed for cart ${cart.id}`)
        }
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ ...results, error: message }, { status: 500 })
  }

  return NextResponse.json({
    ok: true,
    ...results,
    timestamp: new Date().toISOString(),
  })
}
