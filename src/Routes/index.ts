import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Welcome } from '@/screens/WelcomeScreen';
import { CropSelection } from '@/screens/CropSelectionScreen';
import { SoilQuestionsScreen } from '@/screens/SoilQuestionsScreen';
import { ResultScreen } from '@/screens/ResultScreen';
import { MapOfRegion } from '@/screens/MapOfRegion';
import { AreaInputScreen } from '@/screens/AreaInputScreen';
import { StaticParamList } from '@react-navigation/native';

export const RootStack = createNativeStackNavigator({
  initialRouteName: 'Welcome',
  screenOptions: {
    headerShown: false,
  },
  screens: {
    Welcome: Welcome,
    CropSelection: CropSelection,
    MapOfRegion: MapOfRegion,
    SoilQuestions: SoilQuestionsScreen,
    AreaInput: AreaInputScreen,
    Result: ResultScreen,
  },
});

type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
