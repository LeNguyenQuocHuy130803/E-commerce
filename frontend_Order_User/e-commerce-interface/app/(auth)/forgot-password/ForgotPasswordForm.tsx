'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, ArrowLeft, Mail, Lock, Key, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { requestPasswordReset, resetPassword } from '@/service/userService'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner' // ✅ Dùng sonner ở đây

// --- Schemas & Types ---
const step1Schema = z.object({
  email: z.string().min(1, 'Email là bắt buộc').email('Email không đúng định dạng'),
})

const step2Schema = z.object({
  otp: z.string().min(1, 'OTP là bắt buộc').length(6, 'OTP phải đủ 6 ký tự'),
  newPassword: z.string()
    .min(8, 'Mật khẩu từ 8 ký tự')
    .regex(/[A-Z]/, 'Cần ít nhất 1 chữ hoa')
    .regex(/[0-9]/, 'Cần ít nhất 1 con số'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword'],
})

type Step1Data = z.infer<typeof step1Schema>
type Step2Data = z.infer<typeof step2Schema>

// ✅ Thêm Interface để fix lỗi gạch đỏ ở trang page.tsx
interface ForgotPasswordFormProps {
  onSuccess?: (message: string) => void
}

export function ForgotPasswordForm({ onSuccess }: ForgotPasswordFormProps) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1)
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [resendCountdown, setResendCountdown] = useState(0)

  const { register: register1, handleSubmit: handleSubmit1, formState: { errors: errors1 } } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
  })

  const { register: register2, handleSubmit: handleSubmit2, formState: { errors: errors2 } } = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
  })

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCountdown])

  const handleStep1Submit = async (data: Step1Data) => {
    setIsLoading(true)
    try {
      await requestPasswordReset(data.email)
      setEmail(data.email)
      toast.success(`Mã OTP đã được gửi đến ${data.email}`)
      setResendCountdown(60)
      setStep(2)
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Không thể gửi mã OTP')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStep2Submit = async (data: Step2Data) => {
    setIsLoading(true)
    try {
      await resetPassword(email, data.otp, data.newPassword)
      toast.success('Đổi mật khẩu thành công!')
      onSuccess?.('Password reset successfully!') // ✅ Gọi callback onSuccess
      setTimeout(() => router.push('/login'), 2000)
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Mã OTP không chính xác hoặc đã hết hạn')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (resendCountdown > 0 || isLoading) return
    setIsLoading(true)
    try {
      await requestPasswordReset(email)
      toast.success('Đã gửi lại mã OTP mới!')
      setResendCountdown(60)
    } catch (err: any) {
      toast.error('Gửi lại mã thất bại')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-100 border border-gray-50">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-black text-[#0d0d0d] mb-2 uppercase tracking-tighter">Reset Password</h2>
        <p className="text-gray-500 font-medium">
          {step === 1 ? 'Nhập email để nhận mã xác thực' : 'Nhập mã xác thực và mật khẩu mới'}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.form key="step1" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
            onSubmit={handleSubmit1(handleStep1Submit)} className="space-y-6"
          >
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="email" placeholder="name@example.com"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-[#ff5528] focus:bg-white outline-none transition-all font-bold"
                  {...register1('email')} disabled={isLoading}
                />
              </div>
              {errors1.email && <p className="text-red-500 text-xs font-bold ml-1">{errors1.email.message}</p>}
            </div>
            <button type="submit" disabled={isLoading} className="w-full py-4 bg-[#ff5528] text-white rounded-2xl font-black uppercase tracking-widest shadow-lg hover:bg-orange-600 active:scale-[0.98] transition-all">
              {isLoading ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Tiếp tục'}
            </button>
          </motion.form>
        ) : (
          <motion.form key="step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
            onSubmit={handleSubmit2(handleStep2Submit)} className="space-y-5"
          >
            <button type="button" onClick={() => setStep(1)} className="flex items-center gap-2 text-gray-400 hover:text-[#ff5528] font-black text-[10px] uppercase transition-colors mb-2">
              <ArrowLeft size={14} /> Thay đổi email
            </button>

            <div className="space-y-2 text-center">
              <input type="text" maxLength={6} placeholder="000000"
                className="w-full py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-[#ff5528] focus:bg-white outline-none font-black text-3xl text-center tracking-[0.5em] pl-[0.5em]"
                {...register2('otp')} disabled={isLoading}
              />
              {errors2.otp && <p className="text-red-500 text-xs font-bold">{errors2.otp.message}</p>}
              <div className="mt-2">
                {resendCountdown > 0 ? (
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Gửi lại sau {resendCountdown}s</span>
                ) : (
                  <button type="button" onClick={handleResendOTP} className="text-[#ff5528] font-black text-[10px] uppercase hover:underline">Gửi lại mã</button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type={showPassword ? 'text' : 'password'} placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-[#ff5528] focus:bg-white outline-none font-bold"
                  {...register2('newPassword')} disabled={isLoading}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors2.newPassword && <p className="text-red-500 text-xs font-bold ml-1">{errors2.newPassword.message}</p>}
            </div>

            <div className="space-y-2">
              <input type="password" placeholder="Xác nhận mật khẩu"
                className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-[#ff5528] focus:bg-white outline-none font-bold"
                {...register2('confirmPassword')} disabled={isLoading}
              />
              {errors2.confirmPassword && <p className="text-red-500 text-xs font-bold ml-1">{errors2.confirmPassword.message}</p>}
            </div>

            <button type="submit" disabled={isLoading} className="w-full py-4 bg-[#ff5528] text-white rounded-2xl font-black uppercase tracking-widest shadow-lg active:scale-[0.98] transition-all">
              {isLoading ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Cập nhật mật khẩu'}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}