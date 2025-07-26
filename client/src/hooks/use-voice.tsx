import { useState, useCallback } from 'react';
import { useSpeechRecognition, useSpeechSynthesis } from './use-speech';
import { useLanguage } from '@/components/language-provider';
import { useTranslation } from 'react-i18next';

interface VoiceCommand {
  key: string;
  nameKey: string;
  nameHi: string;
  nameTe: string;
}

const voiceCommands: VoiceCommand[] = [
  { key: "1", nameKey: "onion", nameHi: "प्याज़", nameTe: "ఉల్లిపాయ" },
  { key: "2", nameKey: "tomato", nameHi: "टमाटर", nameTe: "టమోటా" },
  { key: "3", nameKey: "potato", nameHi: "आलू", nameTe: "బంగాళాదుంప" },
  { key: "4", nameKey: "coriander", nameHi: "धनिया", nameTe: "కొత్తిమీర" },
  { key: "5", nameKey: "chilli", nameHi: "मिर्च", nameTe: "మిర్చి" },
  { key: "6", nameKey: "ginger", nameHi: "अदरक", nameTe: "అల్లం" },
];

export function useVoice() {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const { isListening, transcript, startListening, stopListening, isSupported } = useSpeechRecognition();
  const { speak, isSpeaking } = useSpeechSynthesis();
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);

  const getLanguageCode = useCallback(() => {
    switch (language) {
      case 'hi': return 'hi-IN';
      case 'te': return 'te-IN';
      default: return 'en-IN';
    }
  }, [language]);

  const startVoiceSession = useCallback(() => {
    if (!isSupported) {
      alert('Voice recognition is not supported in your browser');
      return;
    }

    setIsActive(true);
    const langCode = getLanguageCode();
    startListening(langCode);
    
    // Announce voice commands
    const announcement = language === 'hi' 
      ? "प्याज़ के लिए 1 दबाएं, टमाटर के लिए 2 दबाएं"
      : language === 'te'
      ? "ఉల్లిపాయ కోసం 1 నొక్కండి, టమోటా కోసం 2 నొక్కండి"
      : "Press 1 for onion, press 2 for tomato";
    
    speak(announcement, langCode);
  }, [isSupported, getLanguageCode, startListening, language, speak]);

  const stopVoiceSession = useCallback(() => {
    setIsActive(false);
    setSelectedProduct(null);
    stopListening();
  }, [stopListening]);

  const processVoiceCommand = useCallback((transcriptText: string) => {
    const lowerTranscript = transcriptText.toLowerCase();
    
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
          : language === 'te'
          ? `${cmd.nameTe} ఎంచుకోబడింది`
          : `${t(cmd.nameKey)} selected`;
        
        speak(confirmation, getLanguageCode());
      }
    });
  }, [t, language, speak, getLanguageCode]);

  const handleVoiceCommand = useCallback((commandKey: string) => {
    const command = voiceCommands.find(cmd => cmd.key === commandKey);
    if (command) {
      setSelectedProduct(command.nameKey);
      const confirmation = language === 'hi' 
        ? `${command.nameHi} चुना गया`
        : language === 'te'
        ? `${command.nameTe} ఎంచుకోబడింది`
        : `${t(command.nameKey)} selected`;
      
      speak(confirmation, getLanguageCode());
    }
  }, [language, t, speak, getLanguageCode]);

  return {
    isActive,
    isListening,
    transcript,
    selectedProduct,
    isSpeaking,
    isSupported,
    voiceCommands,
    startVoiceSession,
    stopVoiceSession,
    processVoiceCommand,
    handleVoiceCommand,
  };
}
