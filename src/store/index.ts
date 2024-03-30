import { createSlice, configureStore } from "@reduxjs/toolkit";

const categoryState = {
  category: 0,
};

const myCategoryState = createSlice({
  name: "category",
  initialState: categoryState,
  reducers: {
    recent(state) {
      state.category = 0;
    },
    music(state) {
      state.category = 10;
    },
    game(state) {
      state.category = 20;
    },
    animal(state) {
      state.category = 15;
    },
  },
});

const store = configureStore({
  reducer: { category: myCategoryState.reducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const changeCategory = myCategoryState.actions;

export default store;
