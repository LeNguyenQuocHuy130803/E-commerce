"use client";

import Image from "next/image";
import Link from "next/link";
import { 
  Clock, Phone, MapPin, Mail, Facebook, Twitter, 
  Instagram, Youtube, Menu, X, ShoppingCart, Search, Send, Calendar 
} from "lucide-react";
import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useCartQuery } from "@/hooks/useCartQuery";

// --- CẤU HÌNH DỮ LIỆU (QUẢN LÝ TẬP TRUNG) ---
const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Food", href: "/food" },
  { name: "Fresh", href: "/fresh" },
  { name: "Drink", href: "/drink" },
  { name: "Dessert", href: "/dessert" },
  { name: "Blog", href: "/blog" },
  { name: "About us", href: "/about_us" },
];

const SOCIAL_LINKS = [
  { icon: Facebook, href: "#" },
  { icon: Twitter, href: "#" },
  { icon: Instagram, href: "#" },
  { icon: Youtube, href: "#" },
];

const CONTACT_INFO = [
  { icon: MapPin, title: "Địa chỉ", info: "789 Pastry Lane, Foodking City, FC 12345", color: "bg-[#ff5528]" },
  { icon: Phone, title: "Điện thoại", info: "+1 234 567 890\n+1 234 567 891", color: "bg-[#ffb936]" },
  { icon: Mail, title: "Email", info: "info@foodking.com\nsupport@foodking.com", color: "bg-[#ff5528]" },
  { icon: Clock, title: "Giờ làm việc", info: "T2-T6: 9AM - 10PM\nT7-CN: 10AM - 11PM", color: "bg-[#ffb936]" },
];

// --- ANIMATION VARIANTS ---
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8 } }
};

const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8 } }
};

export default function ContactPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { itemCount } = useCartQuery(isAuthenticated);

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      
      {/* 1. TOP BAR & HEADER (Đồng bộ giao diện) */}
      <div className="bg-[#0d0d0d] text-white py-2 hidden lg:block font-black text-[10px] uppercase tracking-[0.2em]">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <MapPin size={12} className="text-[#ff5528]" />
              <span>789 Pastry Lane, Foodking City</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={12} className="text-[#ff5528]" />
              <span>Open: 9:00 AM - 10:00 PM</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {SOCIAL_LINKS.map((s, i) => (
              <a key={i} href={s.href} className="hover:text-[#ff5528] transition-colors"><s.icon size={14} /></a>
            ))}
          </div>
        </div>
      </div>

      <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-11 h-11 bg-[#ff5528] rounded-full flex items-center justify-center transition-transform group-hover:rotate-12">
              <span className="text-white font-black text-xl">FK</span>
            </div>
            <span className="text-2xl font-black text-[#0d0d0d] tracking-tighter uppercase">Food<span className="text-[#ff5528]">King</span></span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((item) => (
              <Link key={item.name} href={item.href} className={`text-[11px] font-black uppercase tracking-widest transition-colors ${item.name === "Contact" ? "text-[#ff5528]" : "text-gray-500 hover:text-[#ff5528]"}`}>
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors"><Search size={20} /></button>
            <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#ff5528] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">{itemCount}</span>
              )}
            </Link>
            <button className="lg:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link href="/food" className="hidden lg:flex items-center gap-2 bg-[#ff5528] text-white px-7 py-3.5 rounded-full font-black text-[11px] uppercase tracking-widest hover:bg-[#e04420] transition-all active:scale-95 shadow-lg shadow-orange-100">
              <Phone size={14} /> Order Now
            </Link>
          </div>
        </div>
      </header>

      {/* 2. HERO BANNER */}
      <section className="relative bg-[#0d0d0d] py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <Image src="/image/imagecontact.jpg" alt="Contact" fill className="object-cover" />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter">Liên Hệ</motion.h1>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex items-center justify-center gap-3 text-white/70 font-bold uppercase text-[10px] tracking-widest">
            <Link href="/" className="hover:text-[#ff5528]">Home</Link>
            <span className="text-[#ff5528] font-black">/</span>
            <span className="text-white">Contact</span>
          </motion.div>
        </div>
      </section>

      {/* 3. CONTACT CARDS (Overlapping) */}
      <section className="relative z-20 -mt-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {CONTACT_INFO.map((item, index) => (
              <motion.div 
                key={index} variants={fadeInUp}
                className="bg-white p-10 rounded-[2.5rem] shadow-xl text-center group hover:shadow-2xl transition-all border border-gray-50"
              >
                <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:rotate-[10deg] transition-transform duration-500 shadow-lg`}>
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-black text-[#0d0d0d] mb-4 uppercase tracking-tight">{item.title}</h3>
                <p className="text-gray-500 text-sm font-medium whitespace-pre-line leading-relaxed">{item.info}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. FORM & MAP */}
      <section className="py-24 bg-[#fffcf9]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-stretch">
            {/* Form */}
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInLeft}
              className="bg-white p-10 md:p-14 rounded-[3rem] shadow-xl shadow-gray-100 border border-gray-50"
            >
              <div className="mb-10">
                <span className="text-[#ff5528] font-black text-xs uppercase tracking-[0.3em]">Kết nối với chúng tôi</span>
                <h2 className="text-4xl font-black text-[#0d0d0d] mt-4 uppercase tracking-tighter">Gửi lời nhắn</h2>
              </div>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Họ và tên</label>
                    <input type="text" placeholder="John Doe" className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-[#ff5528] focus:bg-white transition-all outline-none font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Địa chỉ Email</label>
                    <input type="email" placeholder="john@example.com" className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-[#ff5528] focus:bg-white transition-all outline-none font-bold" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Lời nhắn của bạn</label>
                  <textarea rows={4} placeholder="Chúng tôi có thể giúp gì cho bạn?" className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-[#ff5528] focus:bg-white transition-all outline-none font-bold resize-none"></textarea>
                </div>
                <button type="submit" className="w-full bg-[#0d0d0d] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-[#ff5528] transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-3">
                  <Send size={16} /> Gửi lời nhắn ngay
                </button>
              </form>
            </motion.div>

            {/* Map */}
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInRight}
              className="rounded-[3rem] overflow-hidden shadow-2xl border-[10px] border-white relative min-h-[450px]"
            >
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.096949687927!2d105.84315831540235!3d21.028511293115547!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab9bd9861ca1%3A0xe7887f7b72ca17a9!2sHoan%20Kiem%20Lake!5e0!3m2!1sen!2s!4v1621234567890!5m2!1sen!2s"
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. RESERVATION SECTION */}
      <section className="py-24 bg-[#0d0d0d] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff5528]/10 blur-[120px] rounded-full"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInLeft} className="space-y-10">
              <div>
                <span className="text-[#ff5528] font-black text-xs uppercase tracking-[0.3em]">Đặt bàn ngay</span>
                <h2 className="text-4xl md:text-6xl font-black text-white mt-4 uppercase tracking-tighter leading-none">Make a <br /> Reservation</h2>
              </div>
              <p className="text-gray-400 font-medium text-lg">Trải nghiệm bữa tối tuyệt vời cùng gia đình và bạn bè tại không gian ấm cúng của FoodKing.</p>
              
              <form className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <input type="text" placeholder="Tên của bạn" className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold focus:border-[#ff5528] outline-none" />
                  <input type="email" placeholder="Email" className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold focus:border-[#ff5528] outline-none" />
                </div>
                <div className="grid grid-cols-3 gap-5">
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#ff5528]" size={18} />
                    <input type="date" className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold focus:border-[#ff5528] outline-none" />
                  </div>
                  <input type="time" className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold focus:border-[#ff5528] outline-none" />
                  <select className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold focus:border-[#ff5528] outline-none appearance-none">
                    <option className="text-black">Số khách</option>
                    {[1,2,3,4,5].map(n => <option key={n} value={n} className="text-black">{n} Người</option>)}
                  </select>
                </div>
                <button className="bg-[#ff5528] text-white px-12 py-5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-orange-900/20 active:scale-95">
                  Xác nhận đặt bàn
                </button>
              </form>
            </motion.div>
            
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInRight}
              className="relative hidden lg:block"
            >
              <div className="relative w-full aspect-square rounded-[4rem] overflow-hidden border-[15px] border-white/5 shadow-2xl">
                <Image src="/image/imagecontact2.jpg" alt="Interior" fill className="object-cover" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6. FOOTER (Tối ưu đồng bộ) */}
      <footer className="bg-[#0d0d0d] text-white pt-24 pb-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 text-center lg:text-left">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <Link href="/" className="flex items-center gap-2 justify-center lg:justify-start">
                <div className="w-10 h-10 bg-[#ff5528] rounded-full flex items-center justify-center font-black">FK</div>
                <span className="text-2xl font-black uppercase tracking-tighter">FoodKing</span>
              </Link>
              <p className="text-gray-500 text-sm leading-relaxed">Serving delicious food with love since 1998.</p>
              <div className="flex gap-3 justify-center lg:justify-start">
                {SOCIAL_LINKS.map((s, i) => (
                  <a key={i} href={s.href} className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-[#ff5528] transition-all"><s.icon size={16} /></a>
                ))}
              </div>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-sm font-black uppercase tracking-[0.2em]">Quick Links</h4>
              <ul className="space-y-3 text-gray-500 text-sm font-bold">
                {NAV_LINKS.slice(0, 4).map(l => <li key={l.name}><Link href={l.href} className="hover:text-[#ff5528]">/ {l.name}</Link></li>)}
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-sm font-black uppercase tracking-[0.2em]">Giờ làm việc</h4>
              <ul className="space-y-3 text-gray-500 text-xs font-bold uppercase">
                <li className="flex justify-between border-b border-white/5 pb-2"><span>Thứ 2 - Thứ 6</span><span className="text-white">9:00 - 22:00</span></li>
                <li className="flex justify-between border-b border-white/5 pb-2"><span>Thứ 7</span><span className="text-white">10:00 - 23:00</span></li>
                <li className="flex justify-between"><span>Chủ Nhật</span><span className="text-white">11:00 - 21:00</span></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-sm font-black uppercase tracking-[0.2em]">Liên hệ</h4>
              <ul className="space-y-4 text-gray-500 text-sm font-medium">
                <li className="flex gap-3 justify-center lg:justify-start"><MapPin size={18} className="text-[#ff5528]" /> 789 Pastry Lane, City</li>
                <li className="flex gap-3 justify-center lg:justify-start"><Phone size={18} className="text-[#ff5528]" /> +1 234 567 890</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 text-center text-[10px] font-black text-gray-600 uppercase tracking-widest">
            &copy; 2024 FoodKing. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}