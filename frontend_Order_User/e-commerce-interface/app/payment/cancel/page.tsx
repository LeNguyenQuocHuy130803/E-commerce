'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, ArrowLeft } from 'lucide-react'

export default function PaymentCancelPage() {
  const router = useRouter()
  const [autoRedirectCountdown, setAutoRedirectCountdown] = useState(10)

  // Auto-redirect countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setAutoRedirectCountdown((prev) => {
        if (prev <= 1) {
          router.push('/cart')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md text-center">
        {/* Warning Icon */}
        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-amber-600" />
        </div>

        {/* Cancel Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
        <p className="text-gray-600 mb-8">You have cancelled the payment process.</p>

        {/* Reasons */}
        <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200 text-left">
          <p className="font-semibold text-gray-900 mb-3">Your order remains available</p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold">•</span>
              <span>Your order will be kept for 30 minutes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold">•</span>
              <span>Your cart items are still available</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold">•</span>
              <span>You can try payment again anytime</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mb-6">
          <button
            onClick={() => router.push('/cart')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Cart
          </button>
          <button
            onClick={() => router.push('/')}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold transition"
          >
            Continue Shopping
          </button>
        </div>

        {/* Auto-redirect Message */}
        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-sm text-amber-800">
            Redirecting to cart in {autoRedirectCountdown} seconds...
          </p>
        </div>

        {/* Support Info */}
        <p className="text-xs text-gray-500 mt-6">
          If you need help, please contact our support team or try another payment method.
        </p>
      </div>
    </div>
  )
}
