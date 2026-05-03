/**
 * 📍 Address Types
 * Định nghĩa cấu trúc dữ liệu cho địa chỉ giao hàng
 */

export interface Address {
  id: number
  type: string // "HOME", "WORK", etc.
  address: string // Full address string (e.g., "thôn bà nà , xã hòa ninh , huyện hòa vang , TP đà nẵng")
  isDefault: boolean
  phoneNumber?: string
  createdAt?: string
  updatedAt?: string
}

export type AddressResponse = Address

export interface GetAddressesResponse {
  data: Address[]
  message: string
}

export type GetDefaultAddressResponse = Address
