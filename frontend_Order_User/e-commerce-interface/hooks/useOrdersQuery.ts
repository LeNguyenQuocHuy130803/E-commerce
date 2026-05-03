import { useQuery } from '@tanstack/react-query'
import { OrderService } from '@/service/OrderService'
import type { Order } from '@/types/order'

/**
 * 📋 Hook để fetch danh sách đơn hàng
 * Sử dụng React Query để cache và auto-refetch
 */
export function useOrdersQuery(status?: string) {
  return useQuery<Order[], Error>({
    queryKey: ['orders', status || 'all'],
    queryFn: async () => {
      const orders = await OrderService.getOrders(status)
      return orders
    },
    staleTime: 1000 * 60 * 5, // 5 phút
    gcTime: 1000 * 60 * 10, // 10 phút (cũ là cacheTime)
    retry: 2,
  })
}

/**
 * 📄 Hook để fetch chi tiết một đơn hàng
 */
export function useOrderDetailQuery(orderId: number | null) {
  return useQuery<Order, Error>({
    queryKey: ['order', orderId],
    queryFn: async () => {
      if (!orderId) throw new Error('Order ID is required')
      return OrderService.getOrderDetail(orderId)
    },
    enabled: !!orderId, // Chỉ fetch khi orderId có giá trị
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 2,
  })
}
