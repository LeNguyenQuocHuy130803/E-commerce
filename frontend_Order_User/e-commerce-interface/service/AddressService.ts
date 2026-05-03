/**
 * 📍 Address Service
 * Lấy dữ liệu địa chỉ giao hàng từ backend
 * ✅ Auto-refresh token khi hết hạn
 */

import { apiFetch } from '@/lib/api/api-client-refresh'
import { Address } from '@/types/address'



/**
 * Lấy tất cả địa chỉ của user
 * @returns List of addresses
 */
async function getAllAddresses(): Promise<Address[]> {
  try {
    console.log(`📍 [AddressService] Fetching all addresses...`)

    const res = await apiFetch('/api/users/addresses', {
      method: 'GET',
    })

    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.message || 'Failed to get addresses')
    }

    // ✅ Response có thể là array trực tiếp hoặc {data: [...]}
    const responseData = await res.json()
    const addresses = Array.isArray(responseData) ? responseData : (responseData.data || [])

    console.log(`✅ [AddressService] Get all addresses success:`, {
      count: addresses.length,
    })

    return addresses
  } catch (error: unknown) {
    const errorMsg = (error as Error).message || 'Failed to get addresses'
    console.log(`⚠️ [AddressService] Get all addresses failed:`, errorMsg)
    throw new Error(errorMsg)
  }
}



// ✅ Export as object
export const AddressService = {
  getAllAddresses
}
