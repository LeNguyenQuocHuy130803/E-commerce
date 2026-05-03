"use client";

import { Clock, Star, ShoppingCart, Quote } from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";
import { motion, Variants } from "framer-motion";

// --- Interfaces ---
interface Category {
  name: string;
  icon: string;
  count: string;
}

interface FoodItem {
  name: string;
  price: string;
  desc: string;
  rating: number;
  image: string;
}

interface Testimonial {
  name: string;
  role: string;
  text: string;
  avatar: string;
}

// --- Animation Variants ---
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } 
  },
};

const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
};

const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
};

export default function FoodCategory() {
  const categories: Category[] = [
    { name: "Burger", icon: "/image/category1.jpg", count: "25 Items" },
    { name: "Pizza", icon: "/image/category2.jpg", count: "18 Items" },
    { name: "Chicken", icon: "/image/category3.jpg", count: "32 Items" },
    { name: "French Fry", icon: "/image/category4.jpg", count: "15 Items" },
    { name: "Hot Dog", icon: "/image/category5.jpg", count: "12 Items" },
  ];

  const foodpopular: FoodItem[] = [
    { name: "Crispy Chicken Wings", price: "$12.99", desc: "8 pcs crispy wings with special sauce", rating: 4.8, image: "/image/foodpopular1.jpg" },
    { name: "Classic Cheeseburger", price: "$9.99", desc: "Beef patty with cheddar cheese", rating: 4.9, image: "/image/foodpopular2.jpg" },
    { name: "Pepperoni Pizza", price: "$14.99", desc: "12 inch with extra cheese", rating: 4.7, image: "/image/category2.jpg" },
    { name: "Loaded Fries", price: "$7.99", desc: "Fries with cheese and bacon", rating: 4.6, image: "/image/category4.jpg" },
    { name: "BBQ Ribs", price: "$18.99", desc: "Half rack with BBQ glaze", rating: 4.9, image: "/image/category1.jpg" },
    { name: "Fish & Chips", price: "$11.99", desc: "Crispy battered fish fillets", rating: 4.5, image: "/image/category5.jpg" },
  ];

  const evaluation: Testimonial[] = [
    { name: "Sarah Johnson", role: "Food Blogger", text: "The best fried chicken I've ever had! Absolutely perfect.", avatar: "/image/evaluation1.jpg" },
    { name: "Michael Chen", role: "Regular Customer", text: "Been coming here for 5 years. The quality never drops.", avatar: "/image/evaluation2.jpg" },
    { name: "Emily Davis", role: "Food Critic", text: "FoodKing delivers on taste and quality. Friendly staff.", avatar: "/image/evaluation3.jpg" },
  ];

  return (
    <main className="overflow-hidden">
      {/* 1. SECTION CATEGORIES */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <span className="text-[#ff5528] font-black text-xs uppercase tracking-[0.2em]">Danh mục món ăn</span>
            <h2 className="text-3xl lg:text-4xl font-black text-[#0d0d0d] mt-2 tracking-tighter">MÓN NGON PHỔ BIẾN</h2>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
          >
            {categories.map((category, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
                className="group bg-white border border-gray-100 rounded-3xl p-8 text-center hover:border-[#ff5528] transition-all cursor-pointer shadow-sm"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full overflow-hidden bg-gray-50 group-hover:scale-110 transition-transform duration-500">
                  <Image src={category.icon} alt={category.name} width={80} height={80} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-[#0d0d0d] text-base mb-1 group-hover:text-[#ff5528] transition-colors tracking-tight">{category.name}</h3>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{category.count}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 2. SECTION OFFERS (ON SALES) */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Card 1 */}
            <motion.div 
              initial="hidden" whileInView="visible" variants={fadeInLeft} viewport={{ once: true }}
              className="relative bg-[#ff5528] rounded-[2.5rem] overflow-hidden p-10 min-h-[320px] flex items-center group shadow-xl shadow-orange-100"
            >
              <div className="relative z-10 max-w-[240px]">
                <span className="text-white/80 font-black text-[10px] uppercase tracking-widest">Duy nhất hôm nay</span>
                <h3 className="text-3xl font-black text-white mt-2 mb-4 italic leading-none">Chicken Combo</h3>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-4xl font-black text-white">$8.99</span>
                  <span className="text-lg text-white/50 line-through font-bold">$12.99</span>
                </div>
                <Button className="bg-white text-[#ff5528] hover:bg-gray-100 font-black px-8 py-6 rounded-2xl text-xs uppercase tracking-widest active:scale-95 transition-all">
                  Đặt ngay
                </Button>
              </div>
              <div className="absolute right-[-10px] bottom-[-10px] w-64 h-64 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-700">
                <Image src="/image/category3.jpg" alt="Chicken" width={300} height={300} className="object-contain" />
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div 
              initial="hidden" whileInView="visible" variants={fadeInRight} viewport={{ once: true }}
              className="relative bg-[#ffb936] rounded-[2.5rem] overflow-hidden p-10 min-h-[320px] flex items-center group shadow-xl shadow-yellow-50"
            >
              <div className="relative z-10 max-w-[240px]">
                <span className="text-black/50 font-black text-[10px] uppercase tracking-widest">Cuối tuần đặc biệt</span>
                <h3 className="text-3xl font-black text-black mt-2 mb-4 italic leading-none">Burger Combo</h3>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-4xl font-black text-black">$10.99</span>
                  <span className="text-lg text-black/30 line-through font-bold">$15.99</span>
                </div>
                <Button className="bg-black text-white hover:bg-gray-800 font-black px-8 py-6 rounded-2xl text-xs uppercase tracking-widest active:scale-95 transition-all">
                  Đặt ngay
                </Button>
              </div>
              <div className="absolute right-[-10px] bottom-[-10px] w-64 h-64 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-700">
                <Image src="/image/category1.jpg" alt="Burger" width={300} height={300} className="object-contain" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. SECTION POPULAR MENU */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="text-center mb-16"
          >
            <span className="text-[#ff5528] font-black text-xs uppercase tracking-[0.2em]">Thực đơn của chúng tôi</span>
            <h2 className="text-3xl lg:text-4xl font-black text-[#0d0d0d] mt-2 tracking-tighter">MÓN NGON ĐƯỢC YÊU THÍCH NHẤT</h2>
          </motion.div>

          <motion.div 
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {foodpopular.map((item, index) => (
              <motion.div key={index} variants={fadeInUp} className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-500">
                <div className="relative h-56 overflow-hidden bg-gray-50">
                  <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                    <Star className="w-3 h-3 text-[#ffb936] fill-[#ffb936]" />
                    <span className="font-black text-xs">{item.rating}</span>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-bold text-[#0d0d0d] group-hover:text-[#ff5528] transition-colors">{item.name}</h3>
                  <p className="text-gray-400 text-sm mt-3 font-medium line-clamp-2">{item.desc}</p>
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-50">
                    <span className="text-2xl font-black text-[#ff5528]">{item.price}</span>
                    <button className="bg-[#ff5528] hover:bg-orange-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2">
                      <ShoppingCart size={14} /> Thêm vào giỏ
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. SECTION ABOUT US */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" variants={fadeInLeft} viewport={{ once: true }} className="relative">
              <div className="relative w-full aspect-square max-w-md mx-auto lg:mx-0 border-[12px] border-white shadow-2xl rounded-[3rem] overflow-hidden">
                <Image src="/image/aboutimage.jpg" alt="About" fill className="object-cover" />
              </div>
              <div className="absolute -bottom-8 -right-4 bg-[#ff5528] text-white p-8 rounded-[2rem] shadow-xl">
                <p className="text-5xl font-black italic">25+</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] mt-2 text-white/80">Năm kinh nghiệm</p>
              </div>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" variants={fadeInRight} viewport={{ once: true }} className="space-y-8">
              <div>
                <span className="text-[#ff5528] font-black text-xs uppercase tracking-widest">Về chúng tôi</span>
                <h2 className="text-4xl lg:text-5xl font-black text-[#0d0d0d] mt-4 uppercase tracking-tighter leading-[1.1]">
                  Chất Lượng Thực Phẩm <br /> Tốt Nhất Cho Gia Đình
                </h2>
              </div>
              <p className="text-gray-500 font-medium leading-relaxed">
                FoodKing đã trở thành biểu tượng của sự tinh hoa ẩm thực từ năm 1998. Cam kết sử dụng nguyên liệu 100% tự nhiên, tươi ngon từ trang trại mỗi ngày.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-[#ff5528] text-white flex items-center justify-center rounded-2xl shadow-lg shadow-orange-100"><Star size={24} /></div>
                  <h4 className="font-bold text-[#0d0d0d] text-sm">Thực phẩm sạch</h4>
                  <p className="text-gray-400 text-[10px] font-bold uppercase">NGUYÊN LIỆU TƯƠI MỚI</p>
                </div>
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-[#ffb936] text-white flex items-center justify-center rounded-2xl shadow-lg shadow-yellow-100"><Clock size={24} /></div>
                  <h4 className="font-bold text-[#0d0d0d] text-sm">Giao hàng nhanh</h4>
                  <p className="text-gray-400 text-[10px] font-bold uppercase">30 PHÚT HOẶC MIỄN PHÍ</p>
                </div>
              </div>
              <Button className="bg-[#0d0d0d] hover:bg-[#ff5528] text-white px-10 py-7 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
                Khám phá thêm về chúng tôi
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. SECTION TESTIMONIALS */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <motion.div initial="hidden" whileInView="visible" variants={fadeInUp} viewport={{ once: true }}>
            <span className="text-[#ff5528] font-black text-xs uppercase tracking-widest">Đánh giá</span>
            <h2 className="text-4xl font-black text-[#0d0d0d] mt-4 mb-16 uppercase tracking-tighter">KHÁCH HÀNG NÓI GÌ</h2>
          </motion.div>
          
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-3 gap-8">
            {evaluation.map((item, index) => (
              <motion.div key={index} variants={fadeInUp} className="bg-gray-50 p-10 rounded-[2.5rem] border border-transparent hover:border-[#ff5528]/20 hover:bg-white transition-all group text-left relative shadow-sm hover:shadow-xl">
                <Quote className="absolute top-6 right-8 text-gray-200 group-hover:text-[#ff5528]/10 transition-colors" size={50} />
                <div className="flex gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={14} className="text-[#ffb936] fill-[#ffb936]" />)}
                </div>
                <p className="text-gray-600 italic font-medium mb-8 leading-relaxed">"{item.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 border-2 border-white shadow-lg rounded-full overflow-hidden">
                    <Image src={item.avatar} alt={item.name} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="font-bold text-[#0d0d0d] text-sm uppercase tracking-tight">{item.name}</p>
                    <p className="text-[#ff5528] text-[10px] font-black uppercase tracking-widest">{item.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </main>
  );
}