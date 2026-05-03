import { apiFetch } from '@/lib/api/api-client-refresh'
import {
  PaymentRequestDto,
  CreatePaymentResponse,
  CapturePaymentResponse,
  PaymentHistoryDto,
  OrderCheckoutResponse,
} from '@/types/payment'

const BASE_URL = '/api/payments'
const ORDER_URL = '/api/orders'

/**
 * Create PayPal order from cart (selected items)
 */
export async function checkoutOrder(shippingAddressId: number = 1, selectedItemIds?: number[]): Promise<OrderCheckoutResponse> {
  try {
    const payload = { 
      shippingAddressId,
      ...(selectedItemIds && selectedItemIds.length > 0 && { selectedItemIds })
    }
    
    console.log('📡 PaymentService.checkoutOrder() called with:', payload)

    const res = await apiFetch(`${ORDER_URL}/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    console.log('📡 Response status:', res.status)
    
    if (!res.ok) {
      throw new Error('Failed to create order from cart')
    }

    const data = await res.json()
    console.log('📡 Order data received:', data)
    
    return data
  } catch (error) {
    console.error('❌ checkoutOrder error:', error)
    throw error
  }
}

/**
 * Create PayPal order for payment
 */
export async function createPaypalOrder(orderId: number): Promise<CreatePaymentResponse> {
  try {
    const payload: PaymentRequestDto = {
      orderId,
      returnUrl: `${typeof window !== 'undefined' ? window.location.origin : ''}/payment/success`,
      cancelUrl: `${typeof window !== 'undefined' ? window.location.origin : ''}/payment/cancel`,
    }

    const res = await apiFetch(`${BASE_URL}/paypal/create-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      throw new Error(errorData.message || 'Failed to create PayPal order')
    }

    const data = await res.json()
    console.log('✅ PayPal order created:', data)
    return data
  } catch (error) {
    console.error('❌ createPaypalOrder error:', error)
    throw error
  }
}

/**
 * Capture PayPal payment (called from success page)
 */
export async function capturePaypalOrder(paypalOrderId: string): Promise<CapturePaymentResponse> {
  try {
    const res = await apiFetch(`${BASE_URL}/paypal/confirm?paypalOrderId=${paypalOrderId}`, {
      method: 'GET',
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      throw new Error(errorData.message || 'Failed to capture PayPal payment')
    }

    const data = await res.json()
    console.log('✅ PayPal payment captured:', data)
    return data
  } catch (error) {
    console.error('❌ capturePaypalOrder error:', error)
    throw error
  }
}

/**
 * Get payment history
 */
export async function getPaymentHistory(): Promise<PaymentHistoryDto[]> {
  try {
    const res = await apiFetch(`${BASE_URL}/history`, { method: 'GET' })

    if (!res.ok) {
      throw new Error('Failed to get payment history')
    }

    const data = await res.json()
    console.log('✅ Payment history fetched:', data)
    return data
  } catch (error) {
    console.error('❌ getPaymentHistory error:', error)
    throw error
  }
}

/**
 * Get payment detail by transaction reference
 */
export async function getPaymentDetail(txnRef: string): Promise<PaymentHistoryDto | null> {
  try {
    const res = await apiFetch(`${BASE_URL}/history/${txnRef}`, { method: 'GET' })

    if (!res.ok) {
      return null
    }

    const data = await res.json()
    console.log('✅ Payment detail fetched:', data)
    return data
  } catch (error) {
    console.error('❌ getPaymentDetail error:', error)
    return null
  }
}
