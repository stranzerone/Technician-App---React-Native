import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './utils/Store/Store.js';
import MainNavigation from './MainNavigation.js';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <View style={{ flex: 1 }}>
          <MainNavigation />
        </View>
      </PersistGate>
    </Provider>
  );
};

const styles = StyleSheet.create({});
export default App;
