import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import ProductCard from "@/components/product-card";
import VoicePanel from "@/components/voice-panel";
import CartSheet from "@/components/cart-sheet";
import { Search, Mic, ShoppingCart, User, Languages, Store, Warehouse } from "lucide-react";
import type { Product, User as UserType } from "@shared/schema";

export default function HomePage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState("vegetables");
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", { category: activeCategory }],
  });

  const { data: cartItems = [] } = useQuery({
    queryKey: ["/api/cart"],
  });

  const { data: wholesalers = [] } = useQuery<UserType[]>({
    queryKey: ["/api/wholesalers"],
  });

  const categories = [
    { key: "vegetables", icon: "🥕", nameKey: "vegetables" },
    { key: "fruits", icon: "🍎", nameKey: "fruits" },
    { key: "grains", icon: "🌾", nameKey: "grains" },
    { key: "spices", icon: "🌶️", nameKey: "spices" },
  ];

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.nameHi && product.nameHi.includes(searchQuery)) ||
    (product.nameTe && product.nameTe.includes(searchQuery))
  );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Top Navigation */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div className="bg-primary w-10 h-10 rounded-full flex items-center justify-center mr-3">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{user.name}</h3>
                <p className="text-sm text-gray-600">
                  {user.userType === 'vendor' ? t('streetVendor') : t('wholesaler')}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm">
                <Languages className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsCartOpen(true)} className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-16 py-3 bg-gray-100 border-0 focus:bg-white"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVoiceActive(true)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-primary hover:text-primary-dark"
            >
              <Mic className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Voice Panel */}
      <VoicePanel 
        isActive={isVoiceActive} 
        onClose={() => setIsVoiceActive(false)}
      />

      {/* Category Tabs */}
      <div className="bg-white border-b overflow-x-auto">
        <div className="flex px-4 py-3 space-x-6">
          {categories.map((category) => (
            <Button
              key={category.key}
              variant="ghost"
              onClick={() => setActiveCategory(category.key)}
              className={`flex-shrink-0 pb-2 ${
                activeCategory === category.key
                  ? 'text-primary border-b-2 border-primary font-semibold'
                  : 'text-gray-600 hover:text-primary'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {t(category.nameKey)}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4">
        {/* Featured Offers */}
        <section className="mb-6">
          <Card className="bg-gradient-to-r from-secondary to-secondary-dark p-6 text-white">
            <h2 className="text-xl font-bold mb-2">{t('todaysSpecialOffer')}</h2>
            <p className="text-secondary-light mb-3">{t('todaysSpecialOfferEn')}</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">प्याज़ ₹25/kg</p>
                <p className="text-secondary-light line-through">₹35/kg</p>
              </div>
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                🧅
              </div>
            </div>
          </Card>
        </section>

        {/* Product Grid */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              {t(categories.find(c => c.key === activeCategory)?.nameKey || 'vegetables')}
            </h2>
            <Button variant="ghost" className="text-primary font-medium">
              {t('viewAll')}
            </Button>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
                  <div className="bg-gray-200 w-full h-32 rounded-xl mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {filteredProducts.length === 0 && !productsLoading && (
            <div className="text-center py-8">
              <p className="text-gray-500">{t('noProductsFound')}</p>
            </div>
          )}
        </section>

        {/* Nearby Wholesalers */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4">{t('nearbyWholesalers')}</h2>
          
          <div className="space-y-3">
            {wholesalers.map((wholesaler) => (
              <Card key={wholesaler.id} className="p-4 flex items-center space-x-4">
                <div className="bg-primary w-12 h-12 rounded-full flex items-center justify-center">
                  <Store className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{wholesaler.name}</h3>
                  <p className="text-sm text-gray-600">{wholesaler.address}</p>
                  <div className="flex items-center mt-1">
                    <div className="flex items-center text-yellow-500 mr-3">
                      <span className="text-xs">⭐ 4.2</span>
                    </div>
                    <span className="text-xs text-gray-500">200+ products</span>
                  </div>
                </div>
                <Button size="sm" className="bg-primary text-white">
                  {t('view')}
                </Button>
              </Card>
            ))}
          </div>
        </section>
      </main>

      {/* Floating Voice Button */}
      <Button
        onClick={() => setIsVoiceActive(true)}
        className="fixed bottom-24 right-6 w-14 h-14 rounded-full shadow-lg bg-secondary hover:bg-secondary-dark text-white z-40"
      >
        <Mic className="w-6 h-6" />
      </Button>

      {/* Cart Sheet */}
      <CartSheet isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
