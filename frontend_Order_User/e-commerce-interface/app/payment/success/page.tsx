'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { usePayment } from '@/hooks/usePayment'
import { CheckCircle, AlertCircle, ArrowRight, ShoppingBag, Loader2 } from 'lucide-react'

/**
 * 1. Component hiển thị trạng thái chờ (Loading)
 * Tách riêng để dùng làm Fallback cho Suspense
 */
function LoadingPayment() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md text-center border border-gray-100">
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-blue-50 border-t-blue-600 animate-spin" />
          <Loader2 className="w-8 h-8 text-blue-600 absolute inset-0 m-auto animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Đang xác thực thanh toán</h2>
        <p className="text-gray-500">Vui lòng không tắt trình duyệt hoặc tải lại trang...</p>
      </div>
    </div>
  )
}

/**
 * 2. Nội dung chính của trang xử lý thanh toán
 */
function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  // Lấy token từ URL (hỗ trợ cả PayPal token và mã đơn hàng nội bộ)
  const paypalOrderId = searchParams.get('token') || searchParams.get('paypalOrderId')

  const [countdown, setCountdown] = useState(7) // Đếm ngược 7 giây
  const capturedRef = useRef(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const { 
    capturePayment, 
    capturePaymentLoading, 
    error, 
    success, 
    setError, 
    setSuccess 
  } = usePayment()

  // --- Logic 1: Tự động Capture khi vừa vào trang ---
  useEffect(() => {
    if (!paypalOrderId || capturedRef.current) return

    const handleCapture = async () => {
      capturedRef.current = true
      try {
        setError(null)
        await capturePayment(paypalOrderId)
        setSuccess(true)
        console.log('✅ Payment captured successfully')
      } catch (err: unknown) {
        console.error('❌ Capture failed:', err)
        setError((err as Error).message || 'Không thể hoàn tất thanh toán. Vui lòng liên hệ hỗ trợ.')
        capturedRef.current = false // Cho phép thử lại nếu có lỗi mạng
      }
    }

    handleCapture()
  }, [paypalOrderId, capturePayment, setError, setSuccess])

  // --- Logic 2: Tự động đếm ngược và chuyển hướng khi thành công ---
  useEffect(() => {
    if (!success) return

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          router.push('/account') // Chuyển hướng về trang lịch sử đơn hàng
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [success, router])

  // --- UI: TRẠNG THÁI ĐANG XỬ LÝ ---
  if (capturePaymentLoading) {
    return <LoadingPayment />
  }

  // --- UI: TRẠNG THÁI THẤT BẠI ---
  if (error && !success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md text-center border border-red-50">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thanh toán thất bại</h2>
          <p className="text-gray-600 mb-8">{error}</p>

          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={() => router.push('/payment/checkout')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold transition-all active:scale-[0.98]"
            >
              Thử lại thanh toán
            </button>
            <button
              onClick={() => router.push('/cart')}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-4 rounded-2xl font-bold transition-all"
            >
              Quay lại giỏ hàng
            </button>
          </div>
        </div>
      </div>
    )
  }

  // --- UI: TRẠNG THÁI THÀNH CÔNG ---
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-[2rem] shadow-2xl p-10 max-w-md text-center border border-green-50">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          <h1 className="text-3xl font-black text-gray-900 mb-2">Tuyệt vời!</h1>
          <p className="text-gray-500 mb-8 font-medium">Đơn hàng của bạn đã được thanh toán thành công.</p>

          <div className="bg-blue-50/50 rounded-2xl p-5 mb-8 text-left border border-blue-100">
            <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest mb-1">PayPal Order ID</p>
            <p className="text-sm font-mono font-bold text-blue-900 break-all">{paypalOrderId}</p>
          </div>

          <div className="space-y-3 mb-6">
            <button
              onClick={() => router.push('/account')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200 active:scale-[0.97]"
            >
              <ShoppingBag size={20} /> Theo dõi đơn hàng
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full bg-white border-2 border-gray-100 text-gray-700 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
            >
              Tiếp tục mua sắm <ArrowRight size={20} />
            </button>
          </div>

          <div className="py-3 px-4 bg-gray-50 rounded-xl inline-block">
            <p className="text-xs text-gray-400 font-semibold">
              Tự động chuyển hướng sau <span className="text-blue-600">{countdown} giây</span>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return null
}


export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<LoadingPayment />}>
      <PaymentSuccessContent />
    </Suspense>
  )
}