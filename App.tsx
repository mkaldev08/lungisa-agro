import { StatusBar } from 'expo-status-bar';
import './global.css';
import { createStaticNavigation } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootStack } from '@/Routes';

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return (
    <SafeAreaProvider className='flex-1 p-4 bg-white'>
      <StatusBar style="auto" />
      <Navigation />
    </SafeAreaProvider>
  );
}
