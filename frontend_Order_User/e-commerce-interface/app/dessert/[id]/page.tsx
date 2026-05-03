"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Star, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { Dessert } from "@/types/dessert";
import { dessertService } from "@/service/DessertService";
import { CartService } from "@/service/CartService";
import { Header } from "@/app/components/layout/header";
import { Footer } from "@/app/components/layout/footer";
import { CART_QUERY_KEY } from "@/hooks/useCartQuery";
import { PRODUCT_TYPES } from "@/types/cart";

export default function DessertDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  // 1. Validate ID sản phẩm
  const dessertId = Number(params.id);
  const isValidId = !isNaN(dessertId) && dessertId > 0;

  // 2. Local State
  const [quantity, setQuantity] = useState(1);
  const [isFavorited, setIsFavorited] = useState(false);

  // 3. Fetch dữ liệu Dessert với useQuery
  const {
    data: dessert,
    isLoading,
    error,
  } = useQuery<Dessert, Error>({
    queryKey: ["dessert", dessertId],
    queryFn: () => dessertService.getDessertById(dessertId),
    enabled: isValidId,
  });

  // 4. Mutation xử lý thêm vào giỏ hàng
  const addToCartMutation = useMutation({
    mutationFn: ({ productId, selectedQuantity }: { productId: number; selectedQuantity: number }) =>
      CartService.addProductToCart(PRODUCT_TYPES.DESSERT || "DESSERT", productId, selectedQuantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      
      toast.success("Đã thêm món tráng miệng vào giỏ hàng", {
        description: dessert?.name,
        actionButtonStyle: {
          backgroundColor: "#ff5528",
          color: "#fff",
        },
        action: {
          label: "Xem Giỏ Hàng",
          onClick: () => router.push("/cart"),
        },
      });
      setQuantity(1);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Lỗi khi thêm vào giỏ hàng");
    },
  });

  // 5. Tính toán tổng tiền
  const totalPrice = useMemo(() => {
    return (dessert?.price || 0) * quantity;
  }, [dessert?.price, quantity]);

  const isAddingToCart = addToCartMutation.isPending;

  const handleAddToCart = () => {
    if (!dessert) return;
    addToCartMutation.mutate({
      productId: dessert.id,
      selectedQuantity: quantity,
    });
  };

  // 6. Hàm Render theo trạng thái
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#ff5528]" />
        </div>
      );
    }

    if (!isValidId || error || !dessert) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-red-600 font-semibold text-lg mb-4">
              ❌ {!isValidId ? "ID không hợp lệ" : error?.message || "Không tìm thấy món tráng miệng này"}
            </p>
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-[#ff5528] font-bold mx-auto hover:underline"
            >
              <ArrowLeft size={18} /> Quay lại
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100">
        {/* Cột trái: Hình ảnh */}
        <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden bg-gray-50 group">
          <Image
            src={dessert.imageUrl}
            alt={dessert.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            priority
          />
          <button
            onClick={() => setIsFavorited(!isFavorited)}
            className="absolute top-5 right-5 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg active:scale-90 transition-all"
          >
            <Heart
              size={24}
              className={isFavorited ? "fill-red-500 text-red-500" : "text-gray-400"}
            />
          </button>
        </div>

        {/* Cột phải: Chi tiết */}
        <div className="flex flex-col">
          <div className="mb-6">
            <h1 className="text-4xl font-extrabold text-[#0d0d0d] mb-3 tracking-tight">
              {dessert.name}
            </h1>
            <div className="flex items-center gap-3">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-400 font-medium">(128 reviews)</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            <span className="px-4 py-1.5 bg-[#ff5528]/10 text-[#ff5528] rounded-full text-xs font-bold uppercase tracking-wider">
              {dessert.category}
            </span>
            {dessert.region && (
              <span className="px-4 py-1.5 bg-gray-100 text-gray-600 rounded-full text-xs font-bold uppercase tracking-wider">
                {dessert.region}
              </span>
            )}
          </div>

          <p className="text-gray-500 leading-relaxed mb-8 text-lg">
            {dessert.description}
          </p>

          <div className="mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
            <p className="text-gray-400 text-sm font-bold uppercase mb-1">Price per {dessert.unit}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-[#ff5528]">${dessert.price}</span>
              <span className="text-sm text-gray-400 font-bold">/ {dessert.unit}</span>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${dessert.quantity > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm font-bold text-gray-500">
                Stock: {dessert.quantity} items available
              </span>
            </div>
          </div>

          {/* Selector số lượng */}
          <div className="flex items-center gap-6 mb-8">
            <span className="text-[#0d0d0d] font-bold">Quantity:</span>
            <div className="flex items-center border-2 border-gray-100 rounded-xl bg-white overflow-hidden shadow-sm">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-5 py-3 text-gray-400 hover:bg-gray-50 hover:text-[#ff5528] transition-colors font-bold text-xl"
              >
                −
              </button>
              <span className="px-8 py-3 font-black text-lg min-w-[70px] text-center border-x-2 border-gray-100">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(dessert.quantity, quantity + 1))}
                className="px-5 py-3 text-gray-400 hover:bg-gray-50 hover:text-[#ff5528] transition-colors font-bold text-xl"
                disabled={quantity >= dessert.quantity}
              >
                +
              </button>
            </div>
          </div>

          {/* Nút hành động */}
          <div className="flex gap-4 mt-auto">
            <button
              onClick={handleAddToCart}
              disabled={dessert.quantity === 0 || isAddingToCart}
              className={`flex-[3] px-8 py-4 font-bold rounded-2xl transition-all flex items-center justify-center gap-3 text-lg shadow-lg active:scale-[0.98] ${
                dessert.quantity === 0 || isAddingToCart
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                  : "bg-[#ff5528] text-white hover:bg-[#e64a23] shadow-orange-200"
              }`}
            >
              {isAddingToCart ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <ShoppingCart size={24} />
              )}
              {isAddingToCart ? "Processing..." : `Order Now ($${totalPrice.toFixed(2)})`}
            </button>
          </div>

          {/* SKU Info */}
          <div className="mt-10 pt-8 border-t border-gray-100 flex flex-col gap-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400 font-bold uppercase tracking-tighter">SKU</span>
              <span className="text-[#0d0d0d] font-bold">DESSERT-{dessert.id.toString().padStart(4, '0')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400 font-bold uppercase tracking-tighter">Category</span>
              <span className="text-[#0d0d0d] font-bold">{dessert.category}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-[#fafafa] py-12 md:py-20 mt-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* Breadcrumb hiện đại hơn */}
          <nav className="flex items-center gap-3 mb-10 text-sm font-bold uppercase tracking-widest">
            <Link href="/" className="text-gray-400 hover:text-[#ff5528] transition-colors">Home</Link>
            <span className="text-gray-300">/</span>
            <Link href="/dessert" className="text-gray-400 hover:text-[#ff5528] transition-colors">Desserts</Link>
            <span className="text-gray-300">/</span>
            <span className="text-[#ff5528]">{dessert?.name || "Loading..."}</span>
          </nav>

          {renderContent()}
        </div>
      </main>
      <Footer />
    </div>
  );
}