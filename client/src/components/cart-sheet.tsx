import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { X, Trash2, ShoppingCart } from "lucide-react";
import type { CartItem, Product } from "@shared/schema";

interface CartSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CartItemWithProduct extends CartItem {
  product: Product;
}

export default function CartSheet({ isOpen, onClose }: CartSheetProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const { data: cartItems = [] } = useQuery<CartItemWithProduct[]>({
    queryKey: ["/api/cart"],
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (cartItemId: string) => {
      await apiRequest("DELETE", `/api/cart/${cartItemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const res = await apiRequest("POST", "/api/orders", orderData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({
        title: t('orderSuccessful'),
        description: t('orderSuccessfulDescription'),
      });
      onClose();
      setIsCheckingOut(false);
    },
    onError: () => {
      toast({
        title: t('orderFailed'),
        description: t('orderFailedDescription'),
        variant: "destructive",
      });
      setIsCheckingOut(false);
    },
  });

  const handleRemoveItem = (cartItemId: string) => {
    removeFromCartMutation.mutate(cartItemId);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    setIsCheckingOut(true);
    
    // Group items by wholesaler
    const itemsByWholesaler = cartItems.reduce((groups, item) => {
      const wholesalerId = item.product.wholesalerId!;
      if (!groups[wholesalerId]) {
        groups[wholesalerId] = [];
      }
      groups[wholesalerId].push(item);
      return groups;
    }, {} as Record<string, CartItemWithProduct[]>);

    // Create orders for each wholesaler
    const orders = Object.entries(itemsByWholesaler).map(([wholesalerId, items]) => {
      const orderItems = items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price,
      }));

      const totalAmount = items.reduce((sum, item) => {
        return sum + (parseFloat(item.product.price) * item.quantity);
      }, 0);

      return {
        wholesalerId,
        items: orderItems,
        totalAmount: totalAmount.toString(),
        orderMethod: "manual",
      };
    });

    // Create first order (for simplicity, we'll create one order for all items)
    if (orders.length > 0) {
      createOrderMutation.mutate(orders[0]);
    }
  };

  const totalAmount = cartItems.reduce((sum, item) => {
    return sum + (parseFloat(item.product.price) * item.quantity);
  }, 0);

  const getProductImage = (product: Product) => {
    const name = product.name.toLowerCase();
    if (name.includes('tomato') || name.includes('टमाटर')) return "🍅";
    if (name.includes('onion') || name.includes('प्याज')) return "🧅";
    if (name.includes('potato') || name.includes('आलू')) return "🥔";
    if (name.includes('coriander') || name.includes('धनिया')) return "🌿";
    return "🥬";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-96 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">{t('yourCart')}</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">{t('cartEmpty')}</p>
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-6 max-h-48 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl">
                        {getProductImage(item.product)}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">{item.product.name}</h3>
                        <p className="text-sm text-gray-600">
                          {item.quantity} {item.product.unit} × ₹{item.product.price}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-gray-800">
                        ₹{(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold text-gray-800">{t('total')}:</span>
                  <span className="text-2xl font-bold text-primary">₹{totalAmount.toFixed(2)}</span>
                </div>
                
                <Button
                  onClick={handleCheckout}
                  disabled={isCheckingOut || createOrderMutation.isPending}
                  className="w-full py-4 text-lg font-semibold"
                >
                  {isCheckingOut || createOrderMutation.isPending ? t('placingOrder') : t('placeOrder')}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
