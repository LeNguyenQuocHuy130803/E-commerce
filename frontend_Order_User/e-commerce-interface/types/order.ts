/**
 * 🛒 Order Types
 */

export interface CreateOrderRequest {
  addressType?: string // "HOME", "WORK", etc. (optional)
  address?: string // Full address string (optional)
  notes?: string
}

export interface Order {
  id: number
  userId: number
  status: string // "PENDING", "CONFIRMED", "SHIPPING", "DELIVERED", "CANCELLED", etc.
  totalPrice: number
  address: string
  notes?: string
  items: Array<{
    id: number
    productId: number
    productName: string
    quantity: number
    price: number
    image?: string
  }>
  createdAt: string
  updatedAt: string
}

export type CreateOrderResponse = Order

export interface GetOrdersResponse {
  data: Order[]
  total: number
  page: number
  limit: number
}

export interface CreatePaymentResponse {
  orderId: number
  approveUrl: string
  cancelUrl: string
  returnUrl: string
}
