import { Button } from "@/components/ui/button";
import { Home, ClipboardList, History, User } from "lucide-react";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/use-auth";

export default function BottomNavigation() {
  const [location, setLocation] = useLocation();
  const { t } = useTranslation();
  const { user } = useAuth();

  const navItems = [
    { path: "/", icon: Home, labelKey: "home" },
    { path: "/orders", icon: ClipboardList, labelKey: "orders" },
    { path: "/history", icon: History, labelKey: "history" },
    { path: "/profile", icon: User, labelKey: "profile" },
  ];

  const isProtectedRoute = ["/", "/orders", "/history", "/profile"].includes(location);

  // Only show bottom navigation for authenticated users on protected routes
  if (!user || !isProtectedRoute) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="grid grid-cols-4 h-16">
        {navItems.map((item) => {
          const isActive = location === item.path;
          const Icon = item.icon;
          
          return (
            <Button
              key={item.path}
              variant="ghost"
              onClick={() => setLocation(item.path)}
              className={`flex flex-col items-center justify-center h-full rounded-none ${
                isActive ? "text-primary" : "text-gray-400 hover:text-primary"
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs">{t(item.labelKey)}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
