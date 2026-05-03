/**
 * 🔗 useAddresses Hook
 * Quản lý địa chỉ giao hàng với React Query
 */

"use client"

import { useQuery } from "@tanstack/react-query"
import { AddressService } from "@/service/AddressService"
import { Address } from "@/types/address"


/**
 * Hook lấy tất cả địa chỉ
 */
export function useAddresses() {
  const { 
    data, 
    isLoading, 
    error, 
    refetch 
  } = useQuery<Address[]>({
    queryKey: ["addresses"],
    queryFn: async () => {
      const addresses = await AddressService.getAllAddresses()
      return addresses
    },
    staleTime: 1000 * 60 * 5, // Cache 5 phút
    refetchOnWindowFocus: false,
    retry: 2,
  })

  return {
    addresses: data || [],
    loading: isLoading,
    error: error?.message || null,
    refetch,
  }
}


