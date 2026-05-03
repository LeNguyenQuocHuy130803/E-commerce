"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Clock, User, MessageCircle, ArrowRight, Phone, MapPin, 
  Facebook, Twitter, Instagram, Youtube, Menu, X, 
  ShoppingCart, Search, Calendar 
} from "lucide-react";
import { motion, Variants } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useCartQuery } from "@/hooks/useCartQuery";

// --- CẤU HÌNH DỮ LIỆU (LOẠI BỎ HARD-CODE) ---
const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Food", href: "/food" },
  { name: "Fresh", href: "/fresh" },
  { name: "Drink", href: "/drink" },
  { name: "Dessert", href: "/dessert" },
  { name: "About Us", href: "/about_us" },
  { name: "Contact", href: "/contact" },
];

const BLOG_POSTS = [
  {
    id: 1,
    title: "Bí quyết cho món gà rán hoàn hảo",
    excerpt: "Khám phá kỹ thuật mà các đầu bếp của chúng tôi sử dụng để tạo nên lớp vỏ giòn tan và thịt gà mọng nước.",
    image: "/image/blog/blog1.jpg",
    author: "Chef Thomas",
    date: "05/03/2024",
    comments: 24,
    category: "Công thức"
  },
  {
    id: 2,
    title: "5 Loại Topping Burger Bạn Phải Thử",
    excerpt: "Nâng tầm món Burger của bạn với những sự kết hợp nguyên liệu độc đáo và đầy hương vị.",
    image: "/image/blog/blog2.jpg",
    author: "Maria Garcia",
    date: "03/03/2024",
    comments: 18,
    category: "Mẹo nhỏ"
  },
  {
    id: 3,
    title: "Khai trương chi nhánh mới tại trung tâm",
    excerpt: "Chúng tôi vô cùng hào hứng thông báo về địa điểm mới sẽ mở cửa vào tháng tới ngay tại trung tâm thành phố.",
    image: "/image/blog/blog3.jpg",
    author: "FoodKing Team",
    date: "01/03/2024",
    comments: 45,
    category: "Tin tức"
  },
  {
    id: 4,
    title: "Nghệ thuật nhào bột Pizza chuẩn vị",
    excerpt: "Làm chủ các bước cơ bản để tạo nên lớp đế Pizza hoàn hảo, giòn ngoài mềm trong.",
    image: "/image/blog/blog4.jpg",
    author: "David Chen",
    date: "28/02/2024",
    comments: 32,
    category: "Công thức"
  },
  {
    id: 5,
    title: "Fast Food lành mạnh: Liệu có thể?",
    excerpt: "Tìm hiểu cách chúng tôi tạo ra những món ăn nhanh tốt cho sức khỏe mà không làm mất đi hương vị.",
    image: "/image/blog/blog5.jpg",
    author: "Sarah Wilson",
    date: "25/02/2024",
    comments: 29,
    category: "Sức khỏe"
  },
  {
    id: 6,
    title: "Phía sau căn bếp: Một ngày làm việc",
    excerpt: "Cùng nhìn lại quá trình chuẩn bị tỉ mỉ cho mỗi món ăn yêu thích của bạn hàng ngày.",
    image: "/image/blog/blog6.jpg",
    author: "FoodKing Team",
    date: "22/02/2024",
    comments: 15,
    category: "Khám phá"
  },
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

export default function BlogPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // ✅ FIX: Gọi Hook bên trong Component
  const { isAuthenticated } = useAuth();
  const { itemCount } = useCartQuery(isAuthenticated);

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      
      {/* 1. TOP BAR & HEADER (Đồng bộ với các trang khác) */}
      <div className="bg-[#0d0d0d] text-white py-2 hidden lg:block text-[11px] font-black uppercase tracking-[0.2em]">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2"><MapPin size={12} className="text-[#ff5528]" /> 789 Pastry Lane, City</div>
            <div className="flex items-center gap-2"><Clock size={12} className="text-[#ff5528]" /> Open: 9:00 AM - 10:00 PM</div>
          </div>
          <div className="flex items-center gap-4">
            {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
              <a key={i} href="#" className="hover:text-[#ff5528] transition-colors"><Icon size={14} /></a>
            ))}
          </div>
        </div>
      </div>

      <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-11 h-11 bg-[#ff5528] rounded-full flex items-center justify-center font-black text-white text-xl group-hover:rotate-12 transition-transform">FK</div>
            <span className="text-2xl font-black tracking-tighter uppercase">Food<span className="text-[#ff5528]">King</span></span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link key={link.name} href={link.href} className={`text-[11px] font-black uppercase tracking-widest transition-colors ${link.name === "Blog" ? "text-[#ff5528]" : "text-gray-500 hover:text-[#ff5528]"}`}>
                {link.name}
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
            <Link href="/food" className="hidden lg:flex bg-[#ff5528] text-white px-7 py-3 rounded-full font-black text-[11px] uppercase tracking-widest shadow-lg shadow-orange-100 active:scale-95 transition-all">Order Now</Link>
          </div>
        </div>
      </header>

      {/* 2. PAGE BANNER */}
      <section className="relative bg-[#0d0d0d] py-32 overflow-hidden">
        <motion.div initial={{ scale: 1.1, opacity: 0 }} animate={{ scale: 1, opacity: 0.3 }} transition={{ duration: 1.5 }} className="absolute inset-0">
          <Image src="/image/blog/bannerblog.jpg" alt="Blog" fill className="object-cover" />
        </motion.div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter">Tin Tức</motion.h1>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex items-center justify-center gap-3 text-white/70 font-bold uppercase text-[10px] tracking-widest">
            <Link href="/" className="hover:text-[#ff5528]">Home</Link>
            <span className="text-[#ff5528] font-black">/</span>
            <span className="text-white">Blog</span>
          </motion.div>
        </div>
      </section>

      {/* 3. BLOG POSTS GRID */}
      <section id="latest" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16">
            <span className="text-[#ff5528] font-black text-xs uppercase tracking-[0.3em]">Cập nhật mới nhất</span>
            <h2 className="text-4xl font-black text-[#0d0d0d] mt-4 uppercase tracking-tighter">From Our Blog</h2>
          </motion.div>

          <motion.div 
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {BLOG_POSTS.map((post) => (
              <motion.article 
                key={post.id} variants={fadeInUp}
                className="bg-white rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 group flex flex-col"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-6 left-6 bg-[#ff5528] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                    {post.category}
                  </div>
                </div>
                
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center gap-5 text-[11px] font-bold text-gray-400 uppercase tracking-tight mb-5">
                    <span className="flex items-center gap-1.5"><Calendar size={14} className="text-[#ff5528]" /> {post.date}</span>
                    <span className="flex items-center gap-1.5"><MessageCircle size={14} className="text-[#ff5528]" /> {post.comments} Bình luận</span>
                  </div>
                  
                  <h3 className="text-xl font-black text-[#0d0d0d] mb-4 group-hover:text-[#ff5528] transition-colors leading-tight uppercase tracking-tight">
                    <Link href={`/blog/${post.id}`}>{post.title}</Link>
                  </h3>
                  
                  <p className="text-gray-500 text-sm font-medium leading-relaxed mb-8 flex-1">
                    {post.excerpt}
                  </p>
                  
                  <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"><User size={14} className="text-[#ff5528]" /></div>
                      <span className="text-[11px] font-black uppercase text-gray-600">{post.author}</span>
                    </div>
                    <Link href={`/blog/${post.id}`} className="flex items-center gap-2 text-[#ff5528] font-black text-[11px] uppercase tracking-widest hover:gap-3 transition-all">
                      Xem thêm <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>

          {/* Pagination */}
          <div className="flex justify-center gap-3 mt-16 font-black text-xs">
            <button className="w-12 h-12 bg-[#ff5528] text-white rounded-2xl shadow-lg shadow-orange-100">01</button>
            <button className="w-12 h-12 bg-white text-gray-400 rounded-2xl border border-gray-100 hover:border-[#ff5528] hover:text-[#ff5528] transition-all">02</button>
            <button className="w-12 h-12 bg-white text-gray-400 rounded-2xl border border-gray-100 hover:border-[#ff5528] hover:text-[#ff5528] transition-all">
              <ArrowRight size={16} className="mx-auto" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. NEWSLETTER (CTA) */}
      <section className="py-24 bg-[#ff5528] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-tighter">Đăng ký nhận tin</h2>
            <p className="text-white/80 font-bold text-sm uppercase tracking-widest mb-10">Nhận công thức mới nhất và các ưu đãi đặc biệt.</p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <input 
                type="email" placeholder="Địa chỉ email của bạn" 
                className="flex-1 px-8 py-5 rounded-2xl focus:outline-none font-bold text-sm shadow-xl"
              />
              <button type="submit" className="bg-[#0d0d0d] text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#ffb936] hover:text-[#0d0d0d] transition-all shadow-xl active:scale-95">
                Đăng ký ngay
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="bg-[#0d0d0d] text-white pt-24 pb-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-[#ff5528] rounded-full flex items-center justify-center font-black">FK</div>
                <span className="text-2xl font-black uppercase tracking-tighter">FoodKing</span>
              </div>
              <p className="text-gray-500 text-sm font-medium leading-relaxed">Phục vụ những món ăn ngon nhất bằng tình yêu từ năm 1998.</p>
              <div className="flex gap-3">
                {[Facebook, Twitter, Instagram].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-[#ff5528] transition-all"><Icon size={16} /></a>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-sm font-black uppercase tracking-widest">Quick Links</h4>
              <ul className="space-y-3 text-gray-500 text-sm font-bold">
                {NAV_LINKS.slice(0, 4).map(l => <li key={l.name}><Link href={l.href} className="hover:text-[#ff5528]">/ {l.name}</Link></li>)}
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-sm font-black uppercase tracking-widest">Giờ mở cửa</h4>
              <ul className="space-y-3 text-gray-400 text-xs font-bold uppercase">
                <li className="flex justify-between border-b border-white/5 pb-2"><span>T2 - T6</span><span className="text-white">9:00 - 22:00</span></li>
                <li className="flex justify-between"><span>T7 - CN</span><span className="text-white">10:00 - 23:00</span></li>
              </ul>
            </div>

            <div className="space-y-6 text-sm font-medium text-gray-400">
              <h4 className="text-sm font-black uppercase tracking-widest text-white">Liên hệ</h4>
              <div className="flex gap-3"><MapPin size={18} className="text-[#ff5528]" /> 789 Pastry Lane, City</div>
              <div className="flex gap-3"><Phone size={18} className="text-[#ff5528]" /> +1 234 567 890</div>
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