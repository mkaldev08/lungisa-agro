import { StatusBar } from 'expo-status-bar';
import './global.css';
import { createStaticNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootStack } from '@/Routes';
import { voiceService } from '@/services/voiceService';

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  useEffect(() => {
    voiceService.init();
  }, []);

  return (
    <SafeAreaProvider className='flex-1 p-4 bg-white justify-center items-center'>
      <StatusBar style="auto" />
      <Navigation />
    </SafeAreaProvider>
  );
}
