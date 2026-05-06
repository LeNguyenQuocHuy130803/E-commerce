'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Lock, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { changePassword } from '@/service/userService'
import { toast } from 'sonner'

const changePasswordSchema = z
  .object({
    oldPassword: z
      .string()
      .min(1, 'Mật khẩu hiện tại là bắt buộc')
      .min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
    newPassword: z
      .string()
      .min(8, 'Mật khẩu mới phải có ít nhất 8 ký tự')
      .regex(/[a-z]/, 'Mật khẩu phải chứa ít nhất một chữ cái thường')
      .regex(/[A-Z]/, 'Mật khẩu phải chứa ít nhất một chữ cái hoa')
      .regex(/[0-9]/, 'Mật khẩu phải chứa ít nhất một số'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu mới'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  })

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>

export function ChangePasswordForm({ onSuccess }: { onSuccess?: () => void }) {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: ChangePasswordFormData) => {
    setIsLoading(true)

    try {
      const response = await changePassword(data.oldPassword, data.newPassword)
      
      // Show success toast with message from API
      toast.success(response.message || 'Đổi mật khẩu thành công')
      
      // Reset form and trigger callback
      reset()
      onSuccess?.()
      
      // Navigate after 2 seconds
      setTimeout(() => {
        window.location.href = '/account'
      }, 2000)
    } catch (error: unknown) {
      let message = 'Đổi mật khẩu thất bại, vui lòng thử lại'

      // Extract message from error object
      if (error instanceof Error) {
        message = error.message || message
      } else if (error && typeof error === 'object' && 'message' in error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        message = (error as any).message || message
      }

      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-2xl shadow-gray-200/50">      <div className="mb-8 text-center">
        <h2 className="text-3xl font-black italic tracking-tighter text-[#0d0d0d] uppercase">
          Security
        </h2>
        <p className="mt-2 text-xs font-bold uppercase tracking-widest text-gray-400">
          {user?.email ? `Signed in as ${user.email}` : 'Đổi mật khẩu tài khoản'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <label className="ml-1 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <Lock size={12} /> Mật khẩu hiện tại
          </label>
          <div className="relative">
            <input
              {...register('oldPassword')}
              type={showOldPassword ? 'text' : 'password'}
              placeholder="Nhập mật khẩu hiện tại"
              className="w-full rounded-2xl border-2 border-black bg-gray-50/50 px-5 py-4 font-bold outline-none transition-all focus:border-[#ff5528] focus:bg-white"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowOldPassword((value) => !value)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-black"
              aria-label={showOldPassword ? 'Ẩn mật khẩu hiện tại' : 'Hiện mật khẩu hiện tại'}
            >
              {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.oldPassword && (
            <p className="ml-1 text-[10px] font-bold uppercase text-red-500">
              {errors.oldPassword.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="ml-1 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <Lock size={12} /> Mật khẩu mới
          </label>
          <div className="relative">
            <input
              {...register('newPassword')}
              type={showNewPassword ? 'text' : 'password'}
              placeholder="Nhập mật khẩu mới"
              className="w-full rounded-2xl border-2 border-black bg-gray-50/50 px-5 py-4 font-bold outline-none transition-all focus:border-[#ff5528] focus:bg-white"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword((value) => !value)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-black"
              aria-label={showNewPassword ? 'Ẩn mật khẩu mới' : 'Hiện mật khẩu mới'}
            >
              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="ml-1 text-[10px] font-bold uppercase text-red-500">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="ml-1 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <Lock size={12} /> Xác nhận mật khẩu mới
          </label>
          <div className="relative">
            <input
              {...register('confirmPassword')}
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Nhập lại mật khẩu mới"
              className="w-full rounded-2xl border-2 border-black bg-gray-50/50 px-5 py-4 font-bold outline-none transition-all focus:border-[#ff5528] focus:bg-white"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((value) => !value)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-black"
              aria-label={showConfirmPassword ? 'Ẩn xác nhận mật khẩu' : 'Hiện xác nhận mật khẩu'}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="ml-1 text-[10px] font-bold uppercase text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#ff5528] py-5 font-black uppercase tracking-widest text-white shadow-lg shadow-orange-200 transition-all hover:bg-black active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Cập nhật mật khẩu'}
        </button>
      </form>
    </div>
  )
}