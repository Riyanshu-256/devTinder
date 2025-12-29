import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",

  initialState: [],

  reducers: {
    // For feed (home page users)
    addFeed: (state, action) => {
      return action.payload;
    },

    // For connections page
    addConnections: (state, action) => {
      return action.payload;
    },

    // Clear feed / connections
    removeFeed: () => {
      return [];
    },
  },
});

export const { addFeed, addConnections, removeFeed } = feedSlice.actions;
export default feedSlice.reducer;
