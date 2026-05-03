"use client"

import { useState, useEffect, useCallback, useRef, RefObject } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, ShoppingCart, Search, User, LogOut, LayoutDashboard, Settings } from "lucide-react"
import { SearchFilter } from "../search_filter"
import { useAuth } from "@/hooks/useAuth"
import { useUserDetail } from "@/lib/api/queries"
import { useCartQuery } from "@/hooks/useCartQuery"

// --- Constants ---
const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Food", href: "/food" },
  { name: "Fresh", href: "/fresh" },
  { name: "Drink", href: "/drink" },
  { name: "Dessert", href: "/dessert" },
  { name: "Blog", href: "/blog" },
  { name: "About us", href: "/about_us" },
  { name: "Contact", href: "/contact" },
];

const DEFAULT_AVATAR = '/image/avatarNull/avatarNull.jpg';

/**
 * ✅ FIX: Cập nhật kiểu RefObject<any> để TypeScript không báo lỗi 
 * khi truyền các loại Element khác nhau (div, section,...)
 */
function useOutsideClick(ref: RefObject<any>, callback: () => void) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, callback]);
}

// --- Sub-component: UserMenuDropdown ---
interface UserMenuDropdownProps {
  profile: any;
  user: any;
  avatarRefresh: number;
  onLogout: () => Promise<void>;
  onClose: () => void;
}

function UserMenuDropdown({ profile, user, avatarRefresh, onLogout, onClose }: UserMenuDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ✅ Gọi hook đã fix
  useOutsideClick(dropdownRef, onClose);

  const userName = profile?.userName || user.userName;
  const email = profile?.email || user.email;
  const isCustomer = user.roles?.includes('Customers');

  return (
    <div ref={dropdownRef} className="absolute right-0 top-14 w-64 bg-white shadow-2xl rounded-xl z-50 border border-gray-100 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
        <p className="font-bold text-[#0d0d0d] truncate">{userName}</p>
        <p className="text-xs text-gray-500 truncate mt-0.5">{email}</p>
      </div>

      <div className="py-2">
        {isCustomer && (
          <>
            <Link
              href="/account"
              className="flex items-center gap-3 px-5 py-3 hover:bg-[#f5f5f5] hover:text-[#ff5528] transition-colors text-sm font-medium text-gray-700"
              onClick={onClose}
            >
              <Settings size={18} className="text-gray-400" />
              Management Account
            </Link>
            <Link
              href="/dashboard-employers"
              className="flex items-center gap-3 px-5 py-3 hover:bg-[#f5f5f5] hover:text-[#ff5528] transition-colors text-sm font-medium text-gray-700"
              onClick={onClose}
            >
              <LayoutDashboard size={18} className="text-gray-400" />
              Dashboard
            </Link>
          </>
        )}
      </div>

      <button
        onClick={onLogout}
        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-red-50 text-red-600 transition-colors border-t border-gray-100 text-sm font-bold"
      >
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [scrollOpacity, setScrollOpacity] = useState(1)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [avatarRefresh, setAvatarRefresh] = useState(0)

  const { user, loading, isAuthenticated, logout } = useAuth()
  const { data: profile } = useUserDetail(user?.id ?? 0, isAuthenticated)
  const { itemCount } = useCartQuery(isAuthenticated)

  useEffect(() => {
    const handleScroll = () => {
      const opacity = Math.max(0.7, 1 - window.scrollY / 300)
      setScrollOpacity(opacity)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = useCallback(async () => {
    setShowUserMenu(false);
    await logout();
  }, [logout]);

  const avatarSrc = profile?.avatar || user?.avatar || DEFAULT_AVATAR;

  return (
    <header className="w-full relative">
      <SearchFilter showSearch={showSearch} setShowSearch={setShowSearch} />

      <div
        className="bg-white/95 backdrop-blur-sm shadow-sm fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-gray-100"
        style={{ opacity: scrollOpacity }}
      >
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-[#ff5528] rounded-full flex items-center justify-center">
              <span className="text-white font-black text-2xl">F</span>
            </div>
            <span className="text-2xl font-black text-[#0d0d0d]">
              FOOD<span className="text-[#ff5528]">KING</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="font-semibold text-sm hover:text-[#ff5528] transition-colors uppercase tracking-wider">
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button onClick={() => setShowSearch(!showSearch)} className="p-2.5 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
              <Search className="w-5 h-5" />
            </button>

            {!loading && isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(prev => !prev)}
                  className="relative w-11 h-11 rounded-full border-2 border-[#ff5528] overflow-hidden hover:border-[#e64a22] transition-all bg-gray-100 shadow-inner active:scale-95"
                >
                  <Image
                    src={`${avatarSrc}?v=${avatarRefresh}`}
                    alt="User"
                    fill
                    className="object-cover rounded-full" // Thêm cả ở đây cho chắc
                    priority
                  />
                </button>

                {showUserMenu && (
                  <UserMenuDropdown
                    profile={profile}
                    user={user}
                    avatarRefresh={avatarRefresh}
                    onLogout={handleLogout}
                    onClose={() => setShowUserMenu(false)}
                  />
                )}
              </div>
            ) : (
              <Link href="/login-page" className="hidden md:flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#f5f5f5] font-bold text-sm hover:bg-[#ff5528] hover:text-white transition-all">
                <User className="w-5 h-5" />
                Login
              </Link>
            )}

            <Link href="/cart" className="relative">
              <div className="w-11 h-11 rounded-full bg-[#ff5528] text-white flex items-center justify-center shadow-lg">
                <ShoppingCart className="w-5 h-5" />
              </div>
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-[#ffb936] text-[#0d0d0d] text-xs font-black rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden text-gray-900">
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 p-6 flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="font-semibold py-3 border-b border-gray-50 last:border-none uppercase text-sm" onClick={() => setIsMenuOpen(false)}>
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}