import { createSlice } from "@reduxjs/toolkit";

// Unread customer messages are a browser-local concept: the backend has no
// "seen" column, so the count lives here and is cleared when the seller opens
// the inbox. Persisted per shop id so a refresh does not lose the badge.
const STORAGE_KEY = "sellerChatUnread";

const readStored = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? parsed
      : {};
  } catch {
    return {};
  }
};

const writeStored = (map) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // Storage can be disabled; the badge then simply does not survive reloads.
  }
};

const chatNotifySlice = createSlice({
  name: "chatNotify",
  initialState: {
    unreadBySeller: readStored(),
  },
  reducers: {
    incrementUnread(state, action) {
      const id = String(action.payload);
      const unreadBySeller = {
        ...state.unreadBySeller,
        [id]: (state.unreadBySeller[id] || 0) + 1,
      };

      writeStored(unreadBySeller);

      return { unreadBySeller };
    },
    resetUnread(state, action) {
      const id = String(action.payload);

      if (!(id in state.unreadBySeller)) {
        return state;
      }

      const unreadBySeller = { ...state.unreadBySeller };
      delete unreadBySeller[id];

      writeStored(unreadBySeller);

      return { unreadBySeller };
    },
  },
});

export const { incrementUnread, resetUnread } = chatNotifySlice.actions;

export const selectUnread = (state, sellerId) =>
  (sellerId && state.chatNotify.unreadBySeller[String(sellerId)]) || 0;

export const chatNotifyReducer = chatNotifySlice.reducer;
