'use client'

import Link from 'next/link'
import { ForgotPasswordForm } from '@/app/(auth)/forgot-password/ForgotPasswordForm'
import { Header } from '@/app/components/layout/header'
import { Footer } from '@/app/components/layout/footer'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ForgotPasswordPage() {
  return (
    <>
      <Header />
      {/* Thêm phần nền xám nhạt để làm nổi bật cái Form trắng */}
      <main className="bg-gray-50/50 min-h-screen py-24 mt-10 flex flex-col items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-md w-full px-6"
        >
          {/* Nút Back - Tinh chỉnh hover cho điệu nghệ */}
          <Link
            href="/login-page"
            className="group inline-flex items-center gap-3 text-gray-400 hover:text-[#ff5528] font-black text-[10px] uppercase tracking-[0.2em] mb-10 transition-all"
          >
            <div className="w-8 h-8 rounded-full border-2 border-gray-100 flex items-center justify-center group-hover:border-[#ff5528] transition-colors">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            </div>
            Quay lại đăng nhập
          </Link>

          {/* Gọi Component Form mi vừa sửa */}
          <ForgotPasswordForm
            onSuccess={(message) => {
              // Flow: Form gửi xong -> Hiện Toast Success (đã có trong Form) 
              // -> Chạy logic ở đây nếu muốn (ví dụ: track analytics)
              console.log('Hệ thống xác nhận:', message)
            }}
          />

          {/* Footer của Form - Đăng ký */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <p className="text-gray-400 text-[11px] font-black uppercase tracking-widest">
              Bạn mới biết đến FoodKing?{' '}
              <Link 
                href="/register-page" 
                className="text-[#ff5528] hover:text-[#0d0d0d] transition-colors underline underline-offset-4 decoration-2"
              >
                Tạo tài khoản mới
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </main>
      <Footer />
    </>
  )
}