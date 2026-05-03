"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Shield, Truck } from "lucide-react";
import { motion, Variants } from "framer-motion"; // ✅ Import thêm Variants

// ✅ Thêm kiểu dữ liệu Variants vào đây
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

// ✅ Thêm kiểu dữ liệu Variants vào đây tạo biến vào thêm các thuộc tính ở đây sau đó truyền vào motion.div của phần text để tạo hiệu ứng lần lượt cho từng phần text
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 }, // Bắt đầu ở vị trí thấp hơn và mờ
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }  // mó dùng để tạo hiệu ứng "bouncy" hơn cho phần text 
  },
};

export default function MainSection() {
  return (
    <section className="relative bg-[#0d0d0d] overflow-hidden min-h-[80vh] lg:min-h-[720px] flex items-center pt-20 lg:pt-0">
      
      {/* Background Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-[#ff5528]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-[#ffb936]/10 blur-[100px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 py-12 relative z-10 lg:pl-32">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          
          {/* LEFT CONTENT */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center lg:text-left order-2 lg:order-1"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-[#ff5528]/15 border border-[#ff5528]/30 rounded-full px-4 py-1.5 mb-6">
              <span className="text-[#ff5528] font-black text-[10px] uppercase tracking-[0.2em]">Fast Food Service</span>
            </motion.div>

            <motion.p variants={itemVariants} className="text-[#ffb936] text-base lg:text-lg mb-3 font-bold italic tracking-wide">
              Crispy, Every Bite Taste
            </motion.p>

            <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl lg:text-[5.5rem] font-black text-white mb-6 leading-[1] tracking-tighter">
              Delicious<br />
              <span className="text-[#ff5528] drop-shadow-[0_10px_20px_rgba(255,85,40,0.4)]">Fried Chicken</span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-gray-400 text-sm lg:text-base mb-10 max-w-md mx-auto lg:mx-0 leading-relaxed font-medium">
              Trải nghiệm hương vị gà rán đỉnh cao chuẩn vị FoodKing. Giòn rụm bên ngoài, mọng nước bên trong với công thức bí truyền.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-5 justify-center lg:justify-start">
              <Link href="/food" className="group relative inline-flex items-center gap-3 bg-[#ff5528] hover:bg-orange-600 text-white font-black px-10 py-4 text-sm rounded-2xl transition-all shadow-lg shadow-orange-900/20 active:scale-95">
                KHÁM PHÁ THỰC ĐƠN
                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </Link>
              
              <Link href="/about" className="inline-flex items-center gap-2 bg-transparent hover:bg-white/5 text-white font-bold px-10 py-4 text-sm rounded-2xl border-2 border-white/10 transition-all active:scale-95">
                Tìm hiểu thêm
              </Link>
            </motion.div>

            {/* INFO ICONS */}
            <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4 mt-12 pt-10 border-t border-white/5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ff5528]/10 text-[#ff5528]">
                  <Truck size={20} />
                </div>
                <div>
                  <p className="text-[11px] lg:text-[13px] font-black text-white uppercase leading-none mb-1">Giao nhanh</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase">30 Phút</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ffb936]/10 text-[#ffb936]">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-[11px] lg:text-[13px] font-black text-white uppercase leading-none mb-1">Phục vụ</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">24/7</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ff5528]/10 text-[#ff5528]">
                  <Shield size={20} />
                </div>
                <div>
                  <p className="text-[11px] lg:text-[13px] font-black text-white uppercase leading-none mb-1">An toàn</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Tuyệt đối</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT IMAGE SECTION */}
          <div className="relative order-1 lg:order-2 flex items-center justify-center lg:justify-end pr-0 lg:pr-10">
            <motion.div 
              animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 6, repeat: Infinity }}
              className="absolute w-[300px] h-[300px] md:w-[450px] md:h-[450px] bg-[#ff5528] rounded-full blur-[80px] z-0" 
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="relative w-[280px] h-[280px] md:w-[400px] md:h-[400px] lg:w-[460px] lg:h-[460px] z-10"
            >
              <div className="absolute inset-0 border-[12px] border-[#ff5528]/20 rounded-full" />
              
              <div className="absolute inset-4 bg-[#0d0d0d] rounded-full overflow-hidden shadow-2xl border-4 border-white/5">
                <Image
                  src="/image/banner_main_sections.jpg"
                  alt="FoodKing Delicious Fried Chicken"
                  fill
                  priority
                  className="object-cover scale-110 group-hover:scale-125 transition-transform duration-1000"
                />
              </div>

              {/* ✅ Sửa lỗi animate bằng cách viết trực tiếp thuộc tính để TS hiểu */}
              <motion.div 
                animate={{ y: [0, -12, 0] }}  // Tạo hiệu ứng nhẹ nhàng lên xuống cho badge giá 
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} // nếu giảm 4 xuống 3 sẽ nhanh hơn, tăng lên 5 sẽ chậm hơn
                className="absolute -right-4 top-10 bg-[#ffb936] rounded-full w-24 h-24 lg:w-28 lg:h-28 flex flex-col items-center justify-center shadow-xl border-4 border-[#0d0d0d] z-20"
              >
                <span className="text-[#0d0d0d] text-[10px] font-black uppercase tracking-tighter">Chỉ từ</span>
                <span className="text-[#0d0d0d] text-2xl lg:text-3xl font-black tracking-tighter">$9.99</span>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -left-6 bottom-12 bg-white rounded-2xl px-5 py-3 shadow-2xl z-20 border-b-4 border-gray-200"
              >
                <div className="text-[#ff5528] text-[10px] font-black italic tracking-tighter uppercase mb-0.5">Giảm ngay 20%</div>
                <div className="text-[#0d0d0d] text-[13px] font-black tracking-tight leading-none">Duy nhất hôm nay!</div>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>

      <div className="absolute bottom-[-2px] left-0 right-0 leading-[0] z-20">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}