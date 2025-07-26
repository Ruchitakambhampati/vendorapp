import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import { ArrowLeft, UserPlus, ShoppingCart, Warehouse, Shield, Camera } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@shared/schema";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const registrationSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type RegistrationData = z.infer<typeof registrationSchema>;
type LoginData = z.infer<typeof loginSchema>;

export default function AuthPage() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();
  const [isLogin, setIsLogin] = useState(false);

  // Redirect if already logged in
  if (user) {
    setLocation('/');
    return null;
  }

  const registrationForm = useForm<RegistrationData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      name: "",
      mobile: "",
      address: "",
      userType: "vendor",
      documentType: "aadhaar",
      documentNumber: "",
      preferredLanguage: "hi",
    },
  });

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onRegister = (data: RegistrationData) => {
    const { confirmPassword, ...registrationData } = data;
    registerMutation.mutate(registrationData);
  };

  const onLogin = (data: LoginData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between p-4">
          <Button 
            variant="ghost" 
            onClick={() => setLocation('/')}
            className="text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-800">
            {isLogin ? t('login') : t('registration')}
          </h1>
          <div className="w-6"></div>
        </div>
      </header>

      <div className="p-6">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="order-2 md:order-1">
            <Card className="p-6">
              <div className="text-center mb-6">
                <div className="bg-primary-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserPlus className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {isLogin ? t('welcomeBack') : t('createNewAccount')}
                </h2>
                <p className="text-gray-600 mt-2">
                  {isLogin ? t('loginToYourAccount') : t('createAccountSubtitle')}
                </p>
              </div>

              {!isLogin ? (
                <Form {...registrationForm}>
                  <form onSubmit={registrationForm.handleSubmit(onRegister)} className="space-y-6">
                    {/* User Type Selection */}
                    <FormField
                      control={registrationForm.control}
                      name="userType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('userType')}</FormLabel>
                          <div className="grid grid-cols-2 gap-3">
                            <Button
                              type="button"
                              variant={field.value === 'vendor' ? 'default' : 'outline'}
                              onClick={() => field.onChange('vendor')}
                              className="p-4 h-auto flex-col"
                            >
                              <ShoppingCart className="w-6 h-6 mb-2" />
                              <span className="text-sm font-medium">{t('streetVendor')}</span>
                            </Button>
                            <Button
                              type="button"
                              variant={field.value === 'wholesaler' ? 'default' : 'outline'}
                              onClick={() => field.onChange('wholesaler')}
                              className="p-4 h-auto flex-col"
                            >
                              <Warehouse className="w-6 h-6 mb-2" />
                              <span className="text-sm font-medium">{t('wholesaler')}</span>
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Basic Information */}
                    <div className="space-y-4">
                      <FormField
                        control={registrationForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('name')} *</FormLabel>
                            <FormControl>
                              <Input placeholder={t('enterYourName')} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registrationForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('username')} *</FormLabel>
                            <FormControl>
                              <Input placeholder={t('chooseUsername')} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registrationForm.control}
                        name="mobile"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('mobile')} *</FormLabel>
                            <FormControl>
                              <Input placeholder="+91 9876543210" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registrationForm.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('businessAddress')}</FormLabel>
                            <FormControl>
                              <Textarea placeholder={t('enterCompleteAddress')} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registrationForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('password')} *</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder={t('createPassword')} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registrationForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('confirmPassword')} *</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder={t('confirmPassword')} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Document Verification */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                        <Shield className="w-5 h-5 text-yellow-600 mr-2" />
                        {t('documentVerification')}
                      </h3>
                      
                      <div className="space-y-3">
                        <FormField
                          control={registrationForm.control}
                          name="documentType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('documentType')}</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder={t('selectDocumentType')} />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="aadhaar">{t('aadhaarCard')}</SelectItem>
                                  <SelectItem value="ration">{t('rationCard')}</SelectItem>
                                  <SelectItem value="voter">{t('voterID')}</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={registrationForm.control}
                          name="documentNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('documentNumber')}</FormLabel>
                              <FormControl>
                                <Input placeholder="1234 5678 9012" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div>
                          <Label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('uploadDocumentPhoto')}
                          </Label>
                          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary transition-colors cursor-pointer">
                            <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-600">{t('clickToTakePhoto')}</p>
                            <p className="text-sm text-gray-500">{t('clickToTakePhotoEn')}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full py-4 text-lg font-semibold"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? t('creating') : t('createAccount')}
                    </Button>
                  </form>
                </Form>
              ) : (
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-6">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('username')}</FormLabel>
                          <FormControl>
                            <Input placeholder={t('enterUsername')} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('password')}</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder={t('enterPassword')} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full py-4 text-lg font-semibold"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? t('loggingIn') : t('login')}
                    </Button>
                  </form>
                </Form>
              )}

              <div className="mt-6 text-center">
                <Button 
                  variant="ghost"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary hover:text-primary-dark font-medium"
                >
                  {isLogin ? t('dontHaveAccount') : t('alreadyHaveAccount')}
                </Button>
              </div>
            </Card>
          </div>

          {/* Hero Section */}
          <div className="order-1 md:order-2 flex items-center justify-center">
            <div className="text-center">
              <div className="bg-primary w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <Warehouse className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                {t('connectWithWholesalers')}
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                {t('heroDescription')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
