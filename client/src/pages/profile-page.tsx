import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/components/language-provider";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Phone, MapPin, FileText, Shield, Languages, LogOut } from "lucide-react";

export default function ProfilePage() {
  const { user, logoutMutation } = useAuth();
  const { t } = useTranslation();
  const { language, setLanguage, supportedLanguages } = useLanguage();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="p-4">
          <div className="flex items-center">
            <User className="w-6 h-6 text-primary mr-3" />
            <h1 className="text-xl font-semibold text-gray-800">{t('profile')}</h1>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* Profile Info */}
        <Card className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
              <div className="flex items-center mt-1">
                <Badge variant="secondary" className="mr-2">
                  {user.userType === 'vendor' ? t('streetVendor') : t('wholesaler')}
                </Badge>
                {user.documentVerified && (
                  <Badge className="bg-green-100 text-green-800">
                    <Shield className="w-3 h-3 mr-1" />
                    {t('verified')}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center text-gray-600">
              <Phone className="w-5 h-5 mr-3" />
              <span>{user.mobile}</span>
            </div>
            
            {user.address && (
              <div className="flex items-start text-gray-600">
                <MapPin className="w-5 h-5 mr-3 mt-0.5" />
                <span>{user.address}</span>
              </div>
            )}

            <div className="flex items-center text-gray-600">
              <FileText className="w-5 h-5 mr-3" />
              <span>
                {t('documentType')}: {user.documentType} ({user.documentNumber})
              </span>
            </div>
          </div>
        </Card>

        {/* Language Settings */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Languages className="w-5 h-5 mr-2" />
            {t('languageSettings')}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('preferredLanguage')}
              </label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {supportedLanguages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.nativeName} ({lang.name})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Account Actions */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {t('accountActions')}
          </h3>
          
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <FileText className="w-4 h-4 mr-3" />
              {t('updateDocuments')}
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <Shield className="w-4 h-4 mr-3" />
              {t('changePassword')}
            </Button>
            
            <Button
              variant="destructive"
              className="w-full justify-start"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              <LogOut className="w-4 h-4 mr-3" />
              {logoutMutation.isPending ? t('loggingOut') : t('logout')}
            </Button>
          </div>
        </Card>

        {/* App Info */}
        <Card className="p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">VendorMart</h3>
          <p className="text-gray-600 text-sm">{t('appDescription')}</p>
          <p className="text-gray-500 text-xs mt-2">Version 1.0.0</p>
        </Card>
      </main>
    </div>
  );
}
