import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSpeechRecognition, useSpeechSynthesis } from "@/hooks/use-speech";
import { useTranslation } from "react-i18next";
import { useLanguage } from "./language-provider";
import { Mic, MicOff } from "lucide-react";

interface VoicePanelProps {
  isActive: boolean;
  onClose: () => void;
}

export default function VoicePanel({ isActive, onClose }: VoicePanelProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { isListening, transcript, startListening, stopListening, isSupported } = useSpeechRecognition();
  const { speak } = useSpeechSynthesis();
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const voiceCommands = [
    { key: "1", nameKey: "onion", nameHi: "प्याज़", nameTe: "ఉల్లిపాయ" },
    { key: "2", nameKey: "tomato", nameHi: "टमाटर", nameTe: "టమోటా" },
    { key: "3", nameKey: "potato", nameHi: "आलू", nameTe: "బంగాళాదుంప" },
    { key: "4", nameKey: "coriander", nameHi: "धनिया", nameTe: "కొత్తిమీర" },
    { key: "5", nameKey: "chilli", nameHi: "मिर्च", nameTe: "మిర్చి" },
    { key: "6", nameKey: "ginger", nameHi: "अदरक", nameTe: "అల్లం" },
  ];

  useEffect(() => {
    if (isActive && isSupported) {
      const languageCode = language === 'hi' ? 'hi-IN' : language === 'te' ? 'te-IN' : 'en-IN';
      startListening(languageCode);
      
      // Announce voice commands
      const announcement = language === 'hi' 
        ? "प्याज़ के लिए 1 दबाएं, टमाटर के लिए 2 दबाएं"
        : "Press 1 for onion, press 2 for tomato";
      speak(announcement, languageCode);
    }
  }, [isActive, language, startListening, speak, isSupported]);

  useEffect(() => {
    if (transcript) {
      // Process voice commands
      const lowerTranscript = transcript.toLowerCase();
      
      voiceCommands.forEach((cmd) => {
        const names = [
          t(cmd.nameKey),
          cmd.nameHi,
          cmd.nameTe,
          cmd.key
        ].map(name => name.toLowerCase());
        
        if (names.some(name => lowerTranscript.includes(name))) {
          setSelectedProduct(cmd.nameKey);
          const confirmation = language === 'hi' 
            ? `${cmd.nameHi} चुना गया`
            : `${t(cmd.nameKey)} selected`;
          speak(confirmation);
        }
      });
    }
  }, [transcript, t, language, speak]);

  const handleVoiceCommand = (commandKey: string) => {
    const command = voiceCommands.find(cmd => cmd.key === commandKey);
    if (command) {
      setSelectedProduct(command.nameKey);
      const confirmation = language === 'hi' 
        ? `${command.nameHi} चुना गया`
        : `${t(command.nameKey)} selected`;
      speak(confirmation);
    }
  };

  const handleClose = () => {
    stopListening();
    onClose();
  };

  if (!isActive) return null;

  return (
    <div className="bg-primary text-white p-4">
      <div className="text-center">
        <div className="inline-block bg-white bg-opacity-20 rounded-full p-4 mb-3">
          {isListening ? (
            <Mic className="w-8 h-8 animate-pulse" />
          ) : (
            <MicOff className="w-8 h-8" />
          )}
        </div>
        
        <h3 className="text-lg font-semibold mb-2">{t('voiceOrderingActive')}</h3>
        <p className="text-primary-light mb-4">
          {language === 'hi' 
            ? "प्याज़ के लिए 1 दबाएं, टमाटर के लिए 2 दबाएं"
            : "Press 1 for onion, press 2 for tomato"
          }
        </p>
        
        {transcript && (
          <Card className="bg-white bg-opacity-20 p-3 mb-4">
            <p className="text-sm">{t('youSaid')}: {transcript}</p>
          </Card>
        )}
        
        {selectedProduct && (
          <Card className="bg-green-500 bg-opacity-30 p-3 mb-4">
            <p className="text-sm">{t('selected')}: {t(selectedProduct)}</p>
          </Card>
        )}
        
        {/* Voice Command Grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {voiceCommands.map((command) => (
            <Button
              key={command.key}
              variant="ghost"
              onClick={() => handleVoiceCommand(command.key)}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 p-3 rounded-lg text-white"
            >
              <div>
                <div className="text-2xl font-bold">{command.key}</div>
                <div className="text-sm">
                  {language === 'hi' ? command.nameHi : 
                   language === 'te' ? command.nameTe : 
                   t(command.nameKey)}
                </div>
              </div>
            </Button>
          ))}
        </div>
        
        <Button 
          onClick={handleClose}
          className="bg-white text-primary px-6 py-2 rounded-lg font-medium hover:bg-gray-100"
        >
          {t('stop')}
        </Button>
      </div>
    </div>
  );
}
