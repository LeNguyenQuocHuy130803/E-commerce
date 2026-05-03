/**
 * 💳 PaymentMethodSelector Component - Shopee Style
 * Chọn phương thức thanh toán: PayPal, Momo, VNPay
 * Hiển thị current method + Modal để chọn khác
 */

"use client"

import { useState } from "react"
import { X } from "lucide-react"

export type PaymentMethod = "cash" | "paypal" | "momo" | "vnpay"

interface PaymentMethodSelectorProps {
  selected: PaymentMethod
  onChange: (method: PaymentMethod) => void
}

const paymentMethods: Array<{
  id: PaymentMethod
  name: string
  label: string
  icon: string
  bgColor: string
  textColor: string
}> = [
  { id: "cash", name: "Thanh toán khi nhận hàng", label: "Trực tiếp", icon: "💳", bgColor: "bg-gray-100", textColor: "text-gray-600" },
  { id: "paypal", name: "PayPal", label: "Thanh toán qua PayPal", icon: "P", bgColor: "bg-blue-100", textColor: "text-blue-600" },
  { id: "momo", name: "Momo", label: "Ví Momo", icon: "M", bgColor: "bg-purple-100", textColor: "text-purple-600" },
  { id: "vnpay", name: "VNPay", label: "VNPay", icon: "V", bgColor: "bg-blue-500", textColor: "text-white" },
]

export function PaymentMethodSelector({ selected, onChange }: PaymentMethodSelectorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const currentMethod = paymentMethods.find(m => m.id === selected)

  return (
    <>
      {/* 💳 Current Payment Method Display */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm mb-1">Phương thức thanh toán</p>
            <p className="font-semibold text-gray-900 text-base">
              {currentMethod?.name || "Chưa chọn"}
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-blue-600 font-semibold text-base hover:text-blue-700 whitespace-nowrap"
          >
            THAY ĐỔI
          </button>
        </div>
      </div>

      {/* Modal: Select Payment Method */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-lg max-h-96 flex flex-col shadow-lg">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="font-bold text-gray-900 text-lg">Phương Thức Thanh Toán</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Payment Methods List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {paymentMethods.map(method => (
                <label
                  key={method.id}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selected === method.id
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment-method"
                    value={method.id}
                    checked={selected === method.id}
                    onChange={() => {
                      onChange(method.id)
                      setIsModalOpen(false)
                    }}
                    className="w-4 h-4 cursor-pointer accent-red-500"
                  />
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-12 h-12 rounded flex items-center justify-center font-bold text-lg ${method.bgColor} ${method.textColor}`}>
                      {method.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-base">{method.name}</p>
                      <p className="text-sm text-gray-600">{method.label}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
