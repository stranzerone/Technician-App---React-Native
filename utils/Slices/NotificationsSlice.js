// notificationsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { GetNotificationsApi } from '../../service/NotificationsApis/GetNotificationsApi';

// Async thunk for fetching notifications
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (page, { rejectWithValue }) => {
    try {
      const notifications = await GetNotificationsApi(page);
      return notifications;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    data: [],
    status: 'idle',
    error: null,
    page: 1
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload.data; // Adjust based on actual API response structure
        state.page = action.payload.page_no; // Track current page
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default notificationsSlice.reducer;
