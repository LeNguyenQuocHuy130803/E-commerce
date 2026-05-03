/**
 * 🛒 POST /api/checkout/finalize
 * Server-side order creation + payment setup
 * 
 * Flow:
 * 1. Create order via backend /api/orders/checkout
 * 2. If PayPal: Create payment via /api/payments/paypal/create-payment
 * 3. Return approveUrl for redirect
 */

import { NextRequest, NextResponse } from 'next/server'
import { apiFetch } from '@/lib/api/api-client-refresh'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { addressType, address, paymentMethod, notes } = body

    console.log('🛒 [POST /api/checkout/finalize] Request:', {
      addressType,
      address: address?.substring(0, 50) + '...',
      paymentMethod,
    })

    // 1️⃣ Create order via backend
    const orderRes = await apiFetch('/api/orders/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ addressType, address, notes }),
    })

    if (!orderRes.ok) {
      const errorData = await orderRes.json()
      throw new Error(errorData.message || 'Failed to create order')
    }

    const order = await orderRes.json()
    const orderId = order.id

    console.log('✅ [OrderService] Order created:', { orderId })

    // 2️⃣ If PayPal: Create payment
    if (paymentMethod === 'paypal') {
      const paymentRes = await apiFetch('/api/payments/paypal/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      })

      if (!paymentRes.ok) {
        const errorData = await paymentRes.json()
        throw new Error(errorData.message || 'Failed to create payment')
      }

      const payment = await paymentRes.json()
      const approveUrl = payment.approveUrl

      console.log('✅ [PaymentService] Payment created:', {
        orderId,
        approveUrl: approveUrl?.substring(0, 50) + '...',
      })

      // 3️⃣ Return approveUrl for redirect
      return NextResponse.json(
        {
          success: true,
          orderId,
          paymentMethod: 'paypal',
          approveUrl,
          message: 'Redirecting to PayPal...',
        },
        { status: 200 }
      )
    }

    // For other payment methods (cash, momo, vnpay)
    return NextResponse.json(
      {
        success: true,
        orderId,
        paymentMethod,
        message: `Order created successfully. Payment method: ${paymentMethod}`,
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    console.error('❌ [POST /api/checkout/finalize] Error:', (error as Error).message)

    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message || 'Failed to finalize checkout',
      },
      { status: 500 }
    )
  }
}
