/**
 * 🛒 Order Service
 * Xử lý tạo đơn hàng, thanh toán
 */

import { apiFetch } from '@/lib/api/api-client-refresh'
import { CreateOrderRequest, CreateOrderResponse, CreatePaymentResponse, Order, GetOrdersResponse } from '@/types/order'

/**
 * 📦 Tạo đơn hàng
 * POST /api/orders/checkout
 */
async function createOrder(request: CreateOrderRequest): Promise<CreateOrderResponse> {
  try {
    console.log(`📦 [OrderService] Creating order...`, request)

    const res = await apiFetch('/api/orders/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.message || 'Failed to create order')
    }

    const order = (await res.json()) as CreateOrderResponse

    console.log(`✅ [OrderService] Order created:`, {
      orderId: order.id,
      status: order.status,
      totalPrice: order.totalPrice,
    })

    return order
  } catch (error: unknown) {
    const errorMsg = (error as Error).message || 'Failed to create order'
    console.error(`❌ [OrderService] Create order failed:`, errorMsg)
    throw new Error(errorMsg)
  }
}

/**
 * 💳 Tạo payment PayPal
 * POST /api/payments/paypal/create-payment
 */
async function createPayPalPayment(orderId: number): Promise<CreatePaymentResponse> {
  try {
    console.log(`💳 [OrderService] Creating PayPal payment for order:`, orderId)

    const res = await apiFetch(`/api/payments/paypal/create-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderId }),
    })

    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.message || 'Failed to create payment')
    }

    const payment = (await res.json()) as CreatePaymentResponse

    console.log(`✅ [OrderService] PayPal payment created:`, {
      orderId: payment.orderId,
      approveUrl: payment.approveUrl?.substring(0, 50) + '...',
    })

    return payment
  } catch (error: unknown) {
    const errorMsg = (error as Error).message || 'Failed to create payment'
    console.error(`❌ [OrderService] Create payment failed:`, errorMsg)
    throw new Error(errorMsg)
  }
}

/**
 * 📋 Lấy danh sách đơn hàng của người dùng
 * GET /api/orders
 */
async function getOrders(status?: string): Promise<Order[]> {
  try {
    console.log(`📋 [OrderService] Fetching orders...`, { status })

    const url = status ? `/api/orders?status=${status}` : '/api/orders'

    const res = await apiFetch(url, {
      method: 'GET',
    })

    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.message || 'Failed to fetch orders')
    }

    const response = (await res.json()) as GetOrdersResponse

    console.log(`✅ [OrderService] Orders fetched:`, {
      total: response.total,
      count: response.data.length,
    })

    return response.data
  } catch (error: unknown) {
    const errorMsg = (error as Error).message || 'Failed to fetch orders'
    console.error(`❌ [OrderService] Fetch orders failed:`, errorMsg)
    throw new Error(errorMsg)
  }
}

/**
 * 📄 Lấy chi tiết một đơn hàng
 * GET /api/orders/:id
 */
async function getOrderDetail(orderId: number): Promise<Order> {
  try {
    console.log(`📄 [OrderService] Fetching order detail:`, orderId)

    const res = await apiFetch(`/api/orders/${orderId}`, {
      method: 'GET',
    })

    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.message || 'Failed to fetch order')
    }

    const order = (await res.json()) as Order

    console.log(`✅ [OrderService] Order detail fetched:`, {
      orderId: order.id,
      status: order.status,
    })

    return order
  } catch (error: unknown) {
    const errorMsg = (error as Error).message || 'Failed to fetch order'
    console.error(`❌ [OrderService] Fetch order detail failed:`, errorMsg)
    throw new Error(errorMsg)
  }
}

export const OrderService = {
  createOrder,
  createPayPalPayment,
  getOrders,
  getOrderDetail,
}
