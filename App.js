// ./App.js
import React from 'react';
import { Provider } from 'react-redux';
import store from "./utils/ReduxToolkitSetup/Store.js"
import MainNavigation from "./MainNavigation.js"
const App = () => {
  return (
    <Provider store={store}>
     <MainNavigation />
    </Provider>
  );
};

export default App;
