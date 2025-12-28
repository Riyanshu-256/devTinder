import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",

  // ✅ FEED MUST ALWAYS BE AN ARRAY
  initialState: [],

  reducers: {
    addFeed: (state, action) => {
      // ✅ payload should be an array of users
      return action.payload;
    },

    removeFeed: () => {
      return [];
    },
  },
});

export const { addFeed, removeFeed } = feedSlice.actions;
export default feedSlice.reducer;
