"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Heart, ArrowLeft, ShoppingCart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { Drink } from "@/types/drink";
import { DrinkService } from "@/service/DrinkService";
import { CartService } from "@/service/CartService";
import { ProductHeader } from "@/app/components/layout/product-header";
import { Footer } from "@/app/components/layout/footer";
import { CART_QUERY_KEY } from "@/hooks/useCartQuery";
import { PRODUCT_TYPES } from "@/types/cart";

export default function DrinkDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  
  // 1. Khởi tạo & Validate ID từ URL
  const drinkId = Number(params.id);
  const isValidDrinkId = !isNaN(drinkId) && drinkId > 0;

  // 2. Local State cho UI tương tác
  const [quantity, setQuantity] = useState(1);
  const [isFavorited, setIsFavorited] = useState(false);

  // 3. Fetch dữ liệu nước uống với useQuery
  const { 
    data: drink, 
    isLoading, 
    error 
  } = useQuery<Drink, Error>({
    queryKey: ["drink", drinkId],
    queryFn: () => DrinkService.getDrinkById(drinkId),
    enabled: isValidDrinkId, // Chỉ chạy khi ID hợp lệ
  });

  // 4. Mutation xử lý thêm vào giỏ hàng
  const addToCartMutation = useMutation({
    mutationFn: ({ productId, selectedQuantity }: { productId: number; selectedQuantity: number }) => 
      CartService.addProductToCart(PRODUCT_TYPES.DRINK, productId, selectedQuantity),
    onSuccess: (_, variables) => {
      // Làm mới dữ liệu giỏ hàng để cập nhật số lượng trên Header
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      
      toast.success(`Sản phẩm ${drink?.name} đã được thêm vào Giỏ hàng`, {
        // Style màu cam (Primary) cho nút hành động
        actionButtonStyle: {
          backgroundColor: 'var(--primary)',
          color: 'var(--primary-foreground)',
        },
        action: {
          label: "Xem Giỏ Hàng",
          onClick: () => router.push("/cart"),
        },
      });
      setQuantity(1); // Reset số lượng về 1
    },
    onError: (err: Error) => {
      toast.error(err.message || "Không thể thêm vào giỏ hàng");
    },
  });

  // 5. Tối ưu tính toán tổng giá tiền bằng useMemo
  const totalPrice = useMemo(() => {
    return (drink?.price || 0) * quantity;
  }, [drink?.price, quantity]);

  const isAddingToCart = addToCartMutation.isPending;

  // 6. Hàm xử lý khi nhấn nút đặt hàng
  const handleAddToCart = () => {
    if (!drink) return;
    addToCartMutation.mutate({ 
      productId: drink.id, 
      selectedQuantity: quantity 
    });
  };

  // 7. Hàm render nội dung theo từng trạng thái
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-32">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      );
    }

    if (!isValidDrinkId || error || !drink) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <p className="text-red-700 font-semibold text-lg mb-4">
            ❌ {!isValidDrinkId ? "ID không hợp lệ" : error?.message || "Không tìm thấy đồ uống này"}
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
        {/* Cột trái: Hình ảnh */}
        <div className="flex flex-col gap-4">
          <div className="relative w-full h-96 rounded-3xl overflow-hidden bg-gray-100 group">
            <Image
              src={drink.imageUrl}
              alt={drink.name}
              fill
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              priority
            />
            {drink.featured && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-md">
                Best Seller
              </div>
            )}
            <button
              onClick={() => setIsFavorited(!isFavorited)}
              className="absolute top-4 right-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow"
            >
              <Heart
                size={24}
                className={isFavorited ? "fill-red-500 text-red-500" : "text-gray-400"}
              />
            </button>
          </div>
        </div>

        {/* Cột phải: Thông tin chi tiết */}
        <div className="flex flex-col gap-2">
          <div>
            <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">
              {drink.category}
            </p>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
              {drink.name}
            </h1>
          </div>

          <div className="flex gap-8 items-start py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-foreground min-w-max">Description</h2>
            <p className="text-gray-600 leading-relaxed text-base">{drink.description}</p>
          </div>

          <div className="flex items-center gap-4 py-4 bg-gray-50 rounded-lg">
            <span className="font-semibold text-gray-700 ml-4">Stock:</span>
            <span className="text-xl font-bold text-primary">{drink.quantity} items</span>
            <span className={`ml-auto mr-4 px-3 py-1 rounded-full text-sm font-semibold ${
              drink.quantity > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}>
              {drink.quantity > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          <div className="py-6 border-t border-b border-gray-200">
            <p className="text-gray-600 text-sm mb-2 font-medium">Price</p>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-black text-red-500">
                ${(drink.price / 1000).toFixed(1)}
              </span>
              <span className="text-xl font-bold text-red-500">/{drink.unit}</span>
            </div>
          </div>

          {/* Chọn số lượng */}
          <div className="flex items-center gap-4 py-4">
            <span className="font-semibold text-gray-700">Quantity:</span>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 hover:bg-gray-100 font-bold transition-colors"
              >
                −
              </button>
              <span className="px-6 py-2 font-bold text-lg border-l border-r border-gray-300 min-w-[60px] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(drink.quantity, quantity + 1))}
                className="px-4 py-2 hover:bg-gray-100 font-bold transition-colors disabled:opacity-30"
                disabled={quantity >= drink.quantity}
              >
                +
              </button>
            </div>
          </div>

          {/* Tổng tiền tạm tính */}
          <div className="bg-primary/10 px-6 py-4 rounded-lg mb-4 border border-primary/20">
            <p className="text-gray-600 text-sm mb-1">Total</p>
            <p className="text-3xl font-black text-primary">
              ${(totalPrice / 1000).toFixed(1)}
            </p>
          </div>

          {/* Nút đặt hàng */}
          <button
            onClick={handleAddToCart}
            disabled={drink.quantity === 0 || isAddingToCart}
            className={`w-full py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-200 ${
              drink.quantity === 0 || isAddingToCart
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600 text-white shadow-lg active:scale-[0.98]"
            }`}
          >
            {isAddingToCart ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <ShoppingCart size={24} />
            )}
            <span>{isAddingToCart ? "Processing..." : `Order Now (${quantity} items)`}</span>
          </button>
        </div>
      </div>
    );
  };

  // --- Render Frame ---
  return (
    <main className="bg-background min-h-screen">
      <ProductHeader />
      
      <div className="max-w-7xl mx-auto px-4 py-12 pt-22">
        {/* Nút Back quay lại trang trước */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold">Back</span>
        </button>

        {renderContent()}
      </div>

      <Footer />
    </main>
  );
}