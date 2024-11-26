// ./app/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import assetsReducer from "../Slices/AssetSlice";
import workOrdersReducer from "../Slices/WorkOrderSlice"; // Import the workOrders reducer
import buggyListReducer from "../Slices/BuggyListSlice"
import complaintsReducer from "../Slices/ComplaintsSlice"
import notificationsreducer from "../Slices/NotificationsSlice.js"
import usersreduceer from "../Slices/UsersSlice.js"
import teamsreducer from "../Slices/TeamSlice.js"
const store = configureStore({
  reducer: {
    buggyList: buggyListReducer,
    assets: assetsReducer,       // Add the assets reducer to the store
    workOrders: workOrdersReducer,// Add the workOrders reducer to the store
    complaints: complaintsReducer,
    notifications:notificationsreducer,
    users:usersreduceer,
    teams:teamsreducer,
  }
});

export default store;
