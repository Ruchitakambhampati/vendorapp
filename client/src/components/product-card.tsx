import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useTranslation } from "react-i18next";
import { useLanguage } from "./language-provider";
import { Minus, Plus, Star } from "lucide-react";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [quantity, setQuantity] = useState(1);
  const queryClient = useQueryClient();

  const addToCartMutation = useMutation({
    mutationFn: async (data: { productId: string; quantity: number }) => {
      const res = await apiRequest("POST", "/api/cart", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });

  const getProductName = () => {
    if (language === 'hi' && product.nameHi) return product.nameHi;
    if (language === 'te' && product.nameTe) return product.nameTe;
    return product.name;
  };

  const handleAddToCart = () => {
    addToCartMutation.mutate({
      productId: product.id,
      quantity: quantity,
    });
  };

  const getProductImage = () => {
    // Return placeholder image based on product category and name
    const category = product.category;
    const name = product.name.toLowerCase();
    
    if (name.includes('tomato') || name.includes('टमाटर')) {
      return "🍅";
    } else if (name.includes('onion') || name.includes('प्याज')) {
      return "🧅";
    } else if (name.includes('potato') || name.includes('आलू')) {
      return "🥔";
    } else if (name.includes('coriander') || name.includes('धनिया')) {
      return "🌿";
    } else if (name.includes('chilli') || name.includes('मिर्च')) {
      return "🌶️";
    } else if (name.includes('ginger') || name.includes('अदरक')) {
      return "🫚";
    } else if (category === 'vegetables') {
      return "🥬";
    } else if (category === 'fruits') {
      return "🍎";
    } else if (category === 'grains') {
      return "🌾";
    } else if (category === 'spices') {
      return "🌿";
    }
    return "🥕";
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="w-full h-32 bg-gray-100 rounded-xl mb-3 flex items-center justify-center text-4xl">
        {getProductImage()}
      </div>
      
      <h3 className="font-semibold text-gray-800 mb-1">{getProductName()}</h3>
      <p className="text-sm text-gray-600 mb-2">{product.wholesaler?.name || t('localMarket')}</p>
      
      <div className="flex items-center justify-between mb-3">
        <span className="text-lg font-bold text-primary">
          ₹{product.price}/{product.unit}
        </span>
        <div className="flex items-center text-yellow-500">
          <Star className="w-3 h-3 fill-current" />
          <span className="text-xs ml-1">{product.rating || "4.0"}</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="w-8 h-8 p-0"
        >
          <Minus className="w-3 h-3" />
        </Button>
        
        <span className="text-gray-800 font-medium min-w-12 text-center">
          {quantity}{product.unit}
        </span>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setQuantity(quantity + 1)}
          className="w-8 h-8 p-0"
        >
          <Plus className="w-3 h-3" />
        </Button>
        
        <Button
          onClick={handleAddToCart}
          disabled={addToCartMutation.isPending}
          className="flex-1 text-sm font-medium ml-2"
        >
          {addToCartMutation.isPending ? t('adding') : t('add')}
        </Button>
      </div>
    </Card>
  );
}
