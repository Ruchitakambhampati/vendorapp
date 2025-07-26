import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Store, Languages, Mic } from "lucide-react";

export default function WelcomePage() {
  const { setLanguage, supportedLanguages } = useLanguage();
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect to home if user is already logged in
  useEffect(() => {
    if (user) {
      setLocation('/');
    }
  }, [user, setLocation]);

  // Redirect to welcome page on app load if no user
  useEffect(() => {
    const currentPath = window.location.pathname;
    if (!user && currentPath === '/') {
      setLocation('/welcome');
    }
  }, [user, setLocation]);

  const handleLanguageSelect = (langCode: string) => {
    setLanguage(langCode);
    setLocation('/auth');
  };

  const handleVoiceEnable = () => {
    // Check for speech recognition support
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      setLocation('/auth');
    } else {
      alert('Voice recognition is not supported in your browser');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary-dark flex flex-col">
      {/* Header */}
      <header className="p-4 text-center text-white">
        <div className="flex items-center justify-center mb-2">
          <Store className="w-10 h-10 mr-3" />
          <h1 className="text-3xl font-bold">VendorMart</h1>
        </div>
        <p className="text-primary-light text-lg">Wholesale सीधे Street Vendors तक</p>
      </header>

      {/* Language Selection */}
      <div className="flex-1 flex flex-col justify-center px-6">
        <Card className="mx-auto max-w-md w-full p-8">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
            भाषा चुनें / Choose Language
          </h2>
          
          <div className="space-y-4">
            {supportedLanguages.map((lang) => (
              <Button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                className={`w-full py-4 px-6 text-lg font-medium transition-colors flex items-center justify-center ${
                  lang.code === 'hi' 
                    ? 'bg-primary hover:bg-primary-dark text-white' 
                    : lang.code === 'en'
                    ? 'bg-secondary hover:bg-secondary-dark text-white'
                    : 'border-2 border-primary text-primary hover:bg-primary hover:text-white bg-transparent'
                }`}
                variant="ghost"
              >
                <Languages className="w-5 h-5 mr-3" />
                {lang.nativeName}
              </Button>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button
              onClick={handleVoiceEnable}
              variant="ghost"
              className="text-primary hover:text-primary-dark font-medium flex items-center justify-center mx-auto"
            >
              <Mic className="w-4 h-4 mr-2" />
              Voice के लिए यहाँ दबाएं
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
