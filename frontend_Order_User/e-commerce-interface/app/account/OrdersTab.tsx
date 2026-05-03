'use client'

import React, { useState, useMemo } from 'react'
import { ShoppingBag, Package, Truck, Home, CheckCircle, XCircle, RotateCcw, Eye } from 'lucide-react'
import { useOrdersQuery } from '@/hooks/useOrdersQuery'


type OrderStatus = 'all' | 'pending' | 'processing' | 'shipping' | 'delivering' | 'completed' | 'cancelled' | 'returning'

interface OrderStatusConfig {
  id: OrderStatus
  label: string
  icon: React.ReactNode
  color: string
  bgColor: string
  borderColor: string
  backendStatus?: string // Trạng thái từ backend tương ứng
}

const ORDER_STATUSES: OrderStatusConfig[] = [
  {
    id: 'all',
    label: 'Tất Cả',
    icon: <ShoppingBag size={20} />,
    color: 'text-gray-700',
    bgColor: 'bg-white hover:bg-gray-50',
    borderColor: 'border-gray-200',
  },
  {
    id: 'pending',
    label: 'Chờ Thanh Toán',
    icon: <Package size={20} />,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50 hover:bg-yellow-100',
    borderColor: 'border-yellow-200',
    backendStatus: 'PENDING',
  },
  {
    id: 'processing',
    label: 'Vận Chuyển',
    icon: <Truck size={20} />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 hover:bg-blue-100',
    borderColor: 'border-blue-200',
    backendStatus: 'PROCESSING',
  },
  {
    id: 'shipping',
    label: 'Chờ Giao Hàng',
    icon: <Home size={20} />,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 hover:bg-purple-100',
    borderColor: 'border-purple-200',
    backendStatus: 'SHIPPING',
  },
  {
    id: 'completed',
    label: 'Hoàn Thành',
    icon: <CheckCircle size={20} />,
    color: 'text-green-600',
    bgColor: 'bg-green-50 hover:bg-green-100',
    borderColor: 'border-green-200',
    backendStatus: 'COMPLETED',
  },
  {
    id: 'cancelled',
    label: 'Đã Hủy',
    icon: <XCircle size={20} />,
    color: 'text-red-600',
    bgColor: 'bg-red-50 hover:bg-red-100',
    borderColor: 'border-red-200',
    backendStatus: 'CANCELLED',
  },
  {
    id: 'returning',
    label: 'Trả Hàng/Hoàn Tiền',
    icon: <RotateCcw size={20} />,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 hover:bg-orange-100',
    borderColor: 'border-orange-200',
    backendStatus: 'RETURNING',
  },
]

const getStatusConfig = (status: OrderStatus) =>
  ORDER_STATUSES.find((s) => s.id === status)

const getBackendStatusLabel = (backendStatus: string): OrderStatus => {
  const status = backendStatus.toLowerCase()
  const config = ORDER_STATUSES.find((s) => s.backendStatus?.toLowerCase() === status)
  return (config?.id as OrderStatus) || 'pending'
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)
}

export function OrdersTab() {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>('all')
  const { data: orders = [], isLoading, error } = useOrdersQuery()

  // Filter orders by selected status
  const filteredOrders = useMemo(() => {
    if (selectedStatus === 'all') return orders
    const backendStatus = getStatusConfig(selectedStatus)?.backendStatus
    if (!backendStatus) return orders
    return orders.filter(
      (order) => order.status.toUpperCase() === backendStatus.toUpperCase()
    )
  }, [orders, selectedStatus])

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6 pb-4">
        <div className="flex flex-wrap gap-2">
          {ORDER_STATUSES.map((status) => (
            <button
              key={status.id}
              onClick={() => setSelectedStatus(status.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all font-semibold ${
                selectedStatus === status.id
                  ? `${status.bgColor} ${status.borderColor} border-2 ${status.color}`
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <span className={selectedStatus === status.id ? status.color : 'text-gray-500'}>
                {status.icon}
              </span>
              <span>{status.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin">
            <div className="w-8 h-8 border-4 border-[#ff5528] border-t-transparent rounded-full"></div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">❌ {error.message || 'Lỗi khi tải đơn hàng'}</p>
        </div>
      )}

      {/* Orders List */}
      <div className="space-y-4">
        {!isLoading && !error && filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">Không có đơn hàng nào</p>
            <p className="text-gray-400 text-sm mt-2">Hãy bắt đầu mua sắm ngay hôm nay!</p>
          </div>
        )}

        {/* Order Cards */}
        {!isLoading &&
          filteredOrders.map((order) => {
            const orderStatusLabel = getBackendStatusLabel(order.status)
            const statusConfig = getStatusConfig(orderStatusLabel)

            return (
              <div
                key={order.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-600">
                      Đơn hàng #{order.id}
                    </span>
                    <span
                      className={`px-2 py-1 ${statusConfig?.bgColor} ${statusConfig?.color} text-xs font-semibold rounded flex items-center gap-1`}
                    >
                      {statusConfig?.icon}
                      {statusConfig?.label}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">{formatDate(order.createdAt)}</span>
                </div>

                {/* Items List */}
                <div className="space-y-2 mb-3 pb-3 border-b border-gray-100">
                  {order.items.slice(0, 2).map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-sm">{item.productName}</p>
                        <p className="text-xs text-gray-500">Số lượng: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-[#ff5528] text-sm">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                  {order.items.length > 2 && (
                    <p className="text-xs text-gray-500 pt-1">
                      +{order.items.length - 2} sản phẩm khác
                    </p>
                  )}
                </div>

                {/* Total & Actions */}
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-gray-600 text-sm">Tổng cộng:</span>
                    <p className="text-lg font-bold text-[#ff5528]">{formatPrice(order.totalPrice)}</p>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#ff5528] text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors">
                    <Eye size={18} />
                    Xem Chi Tiết
                  </button>
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}
