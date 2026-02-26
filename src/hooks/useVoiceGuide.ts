import { useEffect, useRef } from 'react';
import { useAccessibilityStore } from '@/store/accessibilityStore';
import { voiceService } from '@/services/voiceService';

export const useVoiceGuide = (text: string, dependencies: any[] = []): void => {
  const voiceEnabled = useAccessibilityStore((state) => state.voiceEnabled);
  const lastSpokenRef = useRef<string | null>(null);

  useEffect(() => {
    const trimmed = text.trim();

    if (!voiceEnabled) {
      lastSpokenRef.current = null;
      return;
    }

    if (!trimmed) {
      lastSpokenRef.current = null;
      return;
    }

    if (lastSpokenRef.current === trimmed) {
      return;
    }

    lastSpokenRef.current = trimmed;
    voiceService.speak(trimmed);
  }, [text, voiceEnabled, ...dependencies]);
};
