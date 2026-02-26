import { create } from 'zustand';

type AccessibilityState = {
  voiceEnabled: boolean;
  toggleVoice: () => void;
  setVoiceEnabled: (enabled: boolean) => void;
};

export const useAccessibilityStore = create<AccessibilityState>((set) => ({
  voiceEnabled: true,
  toggleVoice: () => set((state) => ({ voiceEnabled: !state.voiceEnabled })),
  setVoiceEnabled: (enabled) => set({ voiceEnabled: enabled }),
}));
