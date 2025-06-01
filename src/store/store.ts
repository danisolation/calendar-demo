import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import calendarReducer from "./calendarSlice";
import { calendarSaga } from "./calendarSaga";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    calendar: calendarReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(calendarSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
