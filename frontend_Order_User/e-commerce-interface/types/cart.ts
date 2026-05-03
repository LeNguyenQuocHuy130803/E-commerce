/**
 * Cart Types and Interfaces
 */

export const PRODUCT_TYPES = {
  FOOD: 'FOOD',
  DRINK: 'DRINK',
  FRESH: 'FRESH',
  DESSERT: 'DESSERT',
} as const

export type ProductType = typeof PRODUCT_TYPES[keyof typeof PRODUCT_TYPES]

export interface AddToCartRequest {
  productType: ProductType
  productId: number
  quantity: number
}

export interface CartItem {
  id: number
  productType: ProductType
  productId: number
  productName: string
  imageUrl: string
  priceAtTime: number
  quantity: number
  availableQuantity?: number  // 🔒 Max có sẵn từ backend
  createdAt: string
  updatedAt: string
}

export interface CartResponse {
  id: number
  userId: number
  totalPrice: number
  items: CartItem[]
  createdAt: string
  updatedAt: string
}

// CartData is an alias for CartResponse
export type CartData = CartResponse
