import Tts from 'react-native-tts';

const DEFAULT_LANGUAGE = 'pt-PT';
const DEFAULT_RATE = 0.5;

let initialized = false;

const init = async (): Promise<void> => {
  if (initialized) {
    return;
  }

  try {
    await Tts.getInitStatus();
  } catch (error: any) {
    if (error?.code === 'no_engine') {
      try {
        await Tts.requestInstallEngine();
      } catch (requestError) {
        // Ignore install request failures.
      }
    }
  }

  try {
    await Tts.setDefaultLanguage(DEFAULT_LANGUAGE);
  } catch (error) {
    // Ignore language errors and allow later overrides.
  }

  try {
    await Tts.setDefaultRate(DEFAULT_RATE);
  } catch (error) {
    // Keep default rate if device rejects the value.
  }

  initialized = true;
};

const speak = async (text: string): Promise<void> => {
  const trimmed = text.trim();
  if (!trimmed) {
    return;
  }

  await init();

  try {
    await Tts.stop();
  } catch (error) {
    // If stop fails, continue to speak the new message.
  }

  try {
    await Tts.speak(trimmed);
  } catch (error) {
    // Swallow errors to avoid breaking the UI.
  }
};

const stop = async (): Promise<void> => {
  try {
    await Tts.stop();
  } catch (error) {
    // Ignore stop errors.
  }
};

const setLanguage = async (lang: string): Promise<void> => {
  if (!lang) {
    return;
  }

  await init();

  try {
    await Tts.setDefaultLanguage(lang);
  } catch (error) {
    // Ignore unsupported language errors.
  }
};

export const voiceService = {
  init,
  speak,
  stop,
  setLanguage,
};
