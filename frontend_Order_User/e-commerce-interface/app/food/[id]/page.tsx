"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Heart, ArrowLeft, ShoppingCart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { Food } from "@/types/food";
import { FoodService } from "@/service/FoodService";
import { CartService } from "@/service/CartService";
import { ProductHeader } from "@/app/components/layout/product-header";
import { Footer } from "@/app/components/layout/footer";
import { CART_QUERY_KEY } from "@/hooks/useCartQuery";
import { PRODUCT_TYPES } from "@/types/cart";

export default function FoodDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  
  // 1. Khởi tạo & Validate ID từ URL
  const foodId = Number(params.id);
  const isValidFoodId = !isNaN(foodId) && foodId > 0;

  // 2. Local State cho UI tương tác
  const [quantity, setQuantity] = useState(1);
  const [isFavorited, setIsFavorited] = useState(false);

  // 3. Fetch dữ liệu sản phẩm với useQuery
  const { 
    data: food, 
    isLoading, 
    error 
  } = useQuery<Food, Error>({
    queryKey: ["food", foodId],
    queryFn: () => FoodService.getFoodById(foodId),
    enabled: isValidFoodId, // Chỉ chạy khi ID hợp lệ
  });

  // 4. Mutation xử lý thêm vào giỏ hàng
  const addToCartMutation = useMutation({
    mutationFn: ({ productId, selectedQuantity }: { productId: number; selectedQuantity: number }) => 
      CartService.addProductToCart(PRODUCT_TYPES.FOOD, productId, selectedQuantity),
    onSuccess: (_, variables) => {
      // Làm mới dữ liệu giỏ hàng trên Header/Cart page
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      
      toast.success(`Sản phẩm ${food?.name} đã được thêm vào Giỏ hàng`, {
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

  // 5. Tối ưu tính toán giá tiền bằng useMemo
  const totalPrice = useMemo(() => {
    return (food?.price || 0) * quantity;
  }, [food?.price, quantity]);

  const isAddingToCart = addToCartMutation.isPending;

  // 6. Hàm xử lý khi nhấn đặt hàng
  const handleAddToCart = () => {
    if (!food) return;
    addToCartMutation.mutate({ 
      productId: food.id, 
      selectedQuantity: quantity 
    });
  };

  // 7. Hàm render nội dung theo từng trạng thái (Loading, Error, Success)
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-32">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      );
    }

    if (!isValidFoodId || error || !food) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <p className="text-red-700 font-semibold text-lg mb-4">
            ❌ {!isValidFoodId ? "ID sản phẩm không hợp lệ" : error?.message || "Không tìm thấy sản phẩm"}
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
        {/* Phần Hình ảnh */}
        <div className="flex flex-col gap-4">
          <div className="relative w-full h-96 rounded-3xl overflow-hidden bg-gray-100 group">
            <Image
              src={food.imageUrl}
              alt={food.name}
              fill
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              priority
            />
            {food.featured && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm">
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

        {/* Phần Thông tin chi tiết */}
        <div className="flex flex-col gap-2">
          <div>
            <p className="text-sm font-semibold text-gray-500 mb-2 uppercase">{food.category}</p>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground">{food.name}</h1>
          </div>

          <div className="flex gap-8 items-start py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-foreground min-w-max">Description</h2>
            <p className="text-gray-600 leading-relaxed text-base">{food.description}</p>
          </div>

          <div className="flex items-center gap-4 py-4 bg-gray-50 rounded-lg">
            <span className="font-semibold text-gray-700 ml-4">Stock:</span>
            <span className="text-xl font-bold text-primary">{food.quantity} cái</span>
            <span className={`ml-auto mr-4 px-3 py-1 rounded-full text-sm font-semibold ${
              food.quantity > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}>
              {food.quantity > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          <div className="py-6 border-t border-b border-gray-200">
            <p className="text-gray-600 text-sm mb-2">Price</p>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-black text-red-500">${(food.price / 1000).toFixed(1)}</span>
              <span className="text-xl font-bold text-red-500">/{food.unit}</span>
            </div>
          </div>

          {/* Chọn số lượng */}
          <div className="flex items-center gap-4 py-4">
            <span className="font-semibold text-gray-700">Quantity:</span>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 hover:bg-gray-100 font-bold"
              >
                −
              </button>
              <span className="px-6 py-2 font-bold text-lg border-l border-r border-gray-300">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(food.quantity, quantity + 1))}
                className="px-4 py-2 hover:bg-gray-100 font-bold"
                disabled={quantity >= food.quantity}
              >
                +
              </button>
            </div>
          </div>

          {/* Tổng tiền & Nút đặt hàng */}
          <div className="bg-primary/10 px-6 py-4 rounded-lg mb-4">
            <p className="text-gray-600 text-sm mb-1">Total</p>
            <p className="text-3xl font-black text-primary">${(totalPrice / 1000).toFixed(1)}</p>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={food.quantity === 0 || isAddingToCart}
            className={`w-full py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-200 ${
              food.quantity === 0 || isAddingToCart
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600 text-white shadow-lg active:scale-95"
            }`}
          >
            <ShoppingCart size={24} />
            <span>{isAddingToCart ? "Adding..." : `Order Now (${quantity} items)`}</span>
          </button>
        </div>
      </div>
    );
  };

  // --- JSX Chính ---
  return (
    <main className="bg-background min-h-screen">
      <ProductHeader />
      <div className="max-w-7xl mx-auto px-4 py-12 pt-22">
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