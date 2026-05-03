"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Heart, ArrowLeft, ShoppingCart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { Fresh } from "@/types/fresh";
import { FreshService } from "@/service/FreshService";
import { CartService } from "@/service/CartService";
import { ProductHeader } from "@/app/components/layout/product-header";
import { Footer } from "@/app/components/layout/footer";
import { CART_QUERY_KEY } from "@/hooks/useCartQuery";
import { PRODUCT_TYPES } from "@/types/cart";

export default function FreshDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  
  // 1. Validate ID sản phẩm
  const freshId = Number(params.id);
  const isValidFreshId = !isNaN(freshId) && freshId > 0;

  // 2. Local State
  const [quantity, setQuantity] = useState(1);
  const [isFavorited, setIsFavorited] = useState(false);

  // 3. Fetch dữ liệu Fresh Food với useQuery
  const { 
    data: fresh, 
    isLoading, 
    error 
  } = useQuery<Fresh, Error>({
    queryKey: ["fresh", freshId],
    queryFn: () => FreshService.getFreshById(freshId),
    enabled: isValidFreshId,
  });

  // 4. Mutation xử lý thêm vào giỏ hàng
  const addToCartMutation = useMutation({
    mutationFn: ({ productId, selectedQuantity }: { productId: number; selectedQuantity: number }) => 
      CartService.addProductToCart(PRODUCT_TYPES.FRESH, productId, selectedQuantity),
    onSuccess: (_, variables) => {
      // Cập nhật lại số lượng giỏ hàng trên Header
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      
      toast.success(`Đã thêm ${fresh?.name} vào Giỏ hàng thành công`, {
        // Nút màu cam chuẩn hệ thống
        actionButtonStyle: {
          backgroundColor: 'var(--primary)',
          color: 'var(--primary-foreground)',
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
    return (fresh?.price || 0) * quantity;
  }, [fresh?.price, quantity]);

  const isAddingToCart = addToCartMutation.isPending;

  const handleAddToCart = () => {
    if (!fresh) return;
    addToCartMutation.mutate({ 
      productId: fresh.id, 
      selectedQuantity: quantity 
    });
  };

  // 6. Hàm Render theo trạng thái
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-32">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      );
    }

    if (!isValidFreshId || error || !fresh) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <p className="text-red-700 font-semibold text-lg mb-4">
            ❌ {!isValidFreshId ? "ID sản phẩm không hợp lệ" : error?.message || "Không tìm thấy thực phẩm này"}
          </p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Quay lại
          </button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hình ảnh */}
        <div className="flex flex-col gap-4">
          <div className="relative w-full h-96 rounded-3xl overflow-hidden bg-gray-100 group shadow-sm">
            <Image
              src={fresh.imageUrl}
              alt={fresh.name}
              fill
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              priority
            />
            {fresh.featured && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-md">
                Best Seller
              </div>
            )}
            <button
              onClick={() => setIsFavorited(!isFavorited)}
              className="absolute top-4 right-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all active:scale-90"
            >
              <Heart
                size={24}
                className={isFavorited ? "fill-red-500 text-red-500" : "text-gray-400"}
              />
            </button>
          </div>
        </div>

        {/* Thông tin chi tiết */}
        <div className="flex flex-col gap-2">
          <div>
            <p className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-widest">
              {fresh.category}
            </p>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
              {fresh.name}
            </h1>
          </div>

          <div className="flex gap-8 items-start py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-foreground min-w-max">Description</h2>
            <p className="text-gray-600 leading-relaxed text-base">{fresh.description}</p>
          </div>

          <div className="flex items-center gap-4 py-4 bg-gray-50 rounded-xl px-4 border border-gray-100">
            <span className="font-semibold text-gray-600">Stock:</span>
            <span className="text-xl font-bold text-primary">{fresh.quantity} units</span>
            <span className={`ml-auto px-3 py-1 rounded-full text-xs font-bold uppercase ${
              fresh.quantity > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}>
              {fresh.quantity > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          <div className="py-6 border-t border-b border-gray-200">
            <p className="text-gray-500 text-sm mb-2 font-medium">Price per unit</p>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-black text-red-500">
                ${(fresh.price / 1000).toFixed(1)}
              </span>
              <span className="text-xl font-bold text-red-500">/{fresh.unit}</span>
            </div>
          </div>

          {/* Selector số lượng */}
          <div className="flex items-center gap-6 py-4">
            <span className="font-bold text-gray-700">Quantity:</span>
            <div className="flex items-center border-2 border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-5 py-2 hover:bg-gray-50 font-bold text-xl transition-colors"
              >
                −
              </button>
              <span className="px-8 py-2 font-black text-lg border-l border-r border-gray-100 min-w-[70px] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(fresh.quantity, quantity + 1))}
                className="px-5 py-2 hover:bg-gray-50 font-bold text-xl transition-colors"
                disabled={quantity >= fresh.quantity}
              >
                +
              </button>
            </div>
          </div>

          {/* Box Tổng tiền */}
          <div className="bg-primary/5 px-6 py-5 rounded-2xl mb-4 border-2 border-primary/10">
            <p className="text-gray-500 text-sm mb-1 font-semibold">Order Total</p>
            <p className="text-4xl font-black text-primary">
              ${(totalPrice / 1000).toFixed(1)}
            </p>
          </div>

          {/* Nút Order */}
          <button
            onClick={handleAddToCart}
            disabled={fresh.quantity === 0 || isAddingToCart}
            className={`w-full py-5 px-6 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 transition-all duration-300 shadow-lg active:scale-[0.97] ${
              fresh.quantity === 0 || isAddingToCart
                ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                : "bg-red-500 hover:bg-red-600 text-white shadow-red-200"
            }`}
          >
            {isAddingToCart ? (
              <Loader2 className="animate-spin" size={26} />
            ) : (
              <ShoppingCart size={26} />
            )}
            <span>{isAddingToCart ? "Adding to cart..." : `Order Now (${quantity} items)`}</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <main className="bg-background min-h-screen">
      <ProductHeader />
      
      <div className="max-w-7xl mx-auto px-4 py-12 pt-22">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-all mb-8 group"
        >
          <ArrowLeft size={22} className="group-hover:-translate-x-1.5 transition-transform" />
          <span className="font-bold text-lg">Back to Fresh Market</span>
        </button>

        {renderContent()}
      </div>

      <Footer />
    </main>
  );
}