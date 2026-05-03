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
      <main className="bg-gray-50/30 min-h-screen py-24 mt-10">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto px-6"
        >
          <Link
            href="/login-page"
            className="group inline-flex items-center gap-2 text-gray-400 hover:text-[#ff5528] font-black text-[10px] uppercase tracking-widest mb-8 transition-colors"
          >
            <ArrowLeft size={26} className="group-hover:-translate-x-1 transition-transform" />
            Back to Login
          </Link>

          <ForgotPasswordForm
            onSuccess={(message) => {
              // Bạn có thể xử lý thêm logic ở đây nếu cần
              console.log('Reset Flow Success:', message)
            }}
          />

          <div className="text-center mt-10">
            <p className="text-gray-400 text-[11px] font-bold uppercase tracking-tight">
              Chưa có tài khoản?{' '}
              <Link href="/register" className="text-[#ff5528] hover:underline ml-1">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </motion.div>
      </main>
      <Footer />
    </>
  )
}