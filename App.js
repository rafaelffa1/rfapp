import React from 'react';
import MainNavigator from './src/navigation/MainNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const App: () => Node = () => {
  return (
    <SafeAreaProvider>
      <MainNavigator />
    </SafeAreaProvider >
  );
};

export default App;
