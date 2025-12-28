// feedSlice.js
// This Redux Toolkit slice is responsible for managing FEED data globally
// Feed usually means the list of profiles/cards/items shown in the UI

import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  // The name of this slice in the Redux store
  name: "feed",

  // Initial state: feed is empty before API data is loaded
  initialState: null,

  reducers: {
    // addFeed:
    // Stores the complete feed data received from the API
    // Example: dispatch(addFeed(res.data))
    addFeed: (state, action) => {
      return action.payload;
    },

    // removeFeed:
    // Clears the feed data (used on logout or session expiration)
    removeFeed: () => {
      return null;
    },
  },
});

// Export actions so they can be dispatched from components
export const { addFeed, removeFeed } = feedSlice.actions;

// Export reducer to be added to the Redux store
export default feedSlice.reducer;
