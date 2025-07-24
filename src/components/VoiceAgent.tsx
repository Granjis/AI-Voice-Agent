import { useRef, useState, useEffect } from 'react';
import { Bot, BotOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { GdmLiveAudio} from '@/hooks/useVoiceAgent';

export const VoiceAgent = () => {
  const [isListening, setIsListening] = useState(false);
  const asistenteVoz = useRef<GdmLiveAudio | null>(null);

  useEffect(() => {
    asistenteVoz.current = new GdmLiveAudio(); // se crea solo una vez
  }, []);

  const toggleListening = () => {
    if (!isListening) {
      setIsListening(true);
      asistenteVoz.current.live();
      toast.success("Asistente activado");
    } else {
      setIsListening(false);
      asistenteVoz.current.stopRecording();
      toast.info("Asistente desactivado");
    }
  };
  return (
    <div className="fixed bottom-6 right-6 z-50">

      <Button
        onClick={toggleListening}
        size="lg"
        className={`rounded-full w-14 h-14 shadow-lg transition-all duration-300 ${
          isListening 
            ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
            : 'bg-primary hover:bg-primary/90'
        }`}
      >
        {isListening ? (
          <BotOff className="w-6 h-6" />
        ) : (
          <Bot className="w-6 h-6" />
        )}
      </Button>
    </div>
  );
};