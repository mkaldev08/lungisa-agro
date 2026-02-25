export type RootStackParamList = {
  Welcome: undefined;
  CropSelection: undefined;
  MapOfRegion: undefined;
  SoilQuestions: undefined;
  AreaInput: undefined;
  Result: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
