/**
 * 🧾 OrderSummary Component
 * Hiển thị danh sách sản phẩm đã chọn + tính toán tổng tiền
 */

"use client"

import Image from "next/image"
import { ShoppingBag } from "lucide-react"
import { CartItem } from "@/types/cart"

interface OrderSummaryProps {
  items: CartItem[]
  selectedItemIds: Set<number>
}

export function OrderSummary({ items, selectedItemIds }: OrderSummaryProps) {
  // Lọc ra chỉ những sản phẩm được chọn
  const selectedItems = items.filter(item => selectedItemIds.has(item.id))

  // Tính tổng tiền
  const totalPrice = selectedItems.reduce((sum, item) => {
    return sum + (item.priceAtTime * item.quantity)
  }, 0)

  if (selectedItems.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 text-center">
        <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-600">Không có sản phẩm nào được chọn</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b border-gray-100">
        <ShoppingBag className="w-5 h-5 text-red-500" />
        <h3 className="font-bold text-gray-900">Danh Sách Sản Phẩm</h3>
        <span className="ml-auto text-sm text-gray-600">
          {selectedItems.length} sản phẩm
        </span>
      </div>

      {/* Product List */}
      <div className="divide-y divide-gray-100">
        {selectedItems.map(item => (
          <div
            key={item.id}
            className="flex gap-3 p-4 hover:bg-gray-50 transition-colors"
          >
            {/* Image */}
            <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={item.imageUrl || "/image/avatarNull/avatarNull.jpg"}
                alt={item.productName}
                fill
                className="object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm line-clamp-2">
                {item.productName}
              </p>
              <p className="text-xs text-gray-600">
                ${(item.priceAtTime / 1000).toFixed(1)} × {item.quantity}
              </p>
            </div>

            {/* Price */}
            <div className="text-right">
              <p className="font-bold text-red-600">
                ${((item.priceAtTime / 1000) * item.quantity).toFixed(1)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Subtotal */}
      <div className="p-4 bg-gray-50 border-t border-gray-100">
        <div className="flex justify-between items-center mb-3">
          <span className="text-gray-600">Tổng tiền hàng:</span>
          <span className="font-semibold text-gray-900">
            ${(totalPrice / 1000).toFixed(1)}
          </span>
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
          <span className="font-bold text-gray-900">Tổng cộng:</span>
          <span className="text-2xl font-bold text-red-600">
            ${(totalPrice / 1000).toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  )
}
