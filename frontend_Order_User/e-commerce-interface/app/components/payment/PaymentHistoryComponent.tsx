'use client'

import { useEffect } from 'react'
import { usePaymentHistory } from '@/hooks/usePayment'
import { PaymentHistoryDto } from '@/types/payment'
import { CheckCircle, Clock, AlertCircle } from 'lucide-react'

const STATUS_CONFIG = {
  SUCCESS: {
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    label: 'THÀNH CÔNG',
  },
  PENDING: {
    icon: Clock,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    label: 'CHỜ XỬ LÝ',
  },
  FAILED: {
    icon: AlertCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    label: 'THẤT BẠI',
  },
}

export default function PaymentHistoryComponent() {
  const { payments, loading, error, refetch } = usePaymentHistory()

  useEffect(() => {
    refetch()
  }, [refetch])

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-red-900">Failed to load payment history</p>
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  if (!payments || payments.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No payment transactions yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment History</h2>

      {payments.map((payment: PaymentHistoryDto) => {
        const status = payment.status as keyof typeof STATUS_CONFIG
        const config = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING
        const Icon = config.icon

        return (
          <div
            key={payment.id}
            className={`border-l-4 ${config.borderColor} ${config.bgColor} p-4 rounded-lg`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <Icon className={`w-6 h-6 ${config.color} mt-0.5`} />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-gray-900">{payment.orderInfo}</p>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${config.bgColor} ${config.color}`}>
                      {config.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Transaction ID: {payment.txnRef}</p>

                  {/* Payment Details */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Provider</p>
                      <p className="font-semibold text-gray-900">{payment.provider}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Date</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(payment.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>

                  {/* PayPal Order ID if available */}
                  {payment.paypalOrderId && (
                    <div className="mt-3 p-2 bg-white/50 rounded">
                      <p className="text-xs text-gray-600">PayPal Order ID</p>
                      <p className="text-xs font-mono text-gray-900 break-all">{payment.paypalOrderId}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Amount */}
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{payment.amountFormatted}</p>
                <p className="text-xs text-gray-600">{payment.responseCode}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
