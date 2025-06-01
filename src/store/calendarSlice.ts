import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CalendarState, CalendarEvent } from "../types/calendar";
import { format } from "date-fns";

const initialState: CalendarState = {
  events: [],
  selectedDate: format(new Date(), "yyyy-MM-dd"),
  view: "month",
  loading: false,
  error: null,
};

const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    setEvents: (state, action: PayloadAction<CalendarEvent[]>) => {
      state.events = action.payload;
    },
    addEvent: (state, action: PayloadAction<CalendarEvent>) => {
      state.events.push(action.payload);
    },
    updateEvent: (state, action: PayloadAction<CalendarEvent>) => {
      const index = state.events.findIndex(
        (event) => event.id === action.payload.id
      );
      if (index !== -1) {
        state.events[index] = action.payload;
      }
    },
    deleteEvent: (state, action: PayloadAction<string>) => {
      state.events = state.events.filter(
        (event) => event.id !== action.payload
      );
    },
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload;
    },
    setView: (state, action: PayloadAction<"month" | "week" | "day">) => {
      state.view = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setEvents,
  addEvent,
  updateEvent,
  deleteEvent,
  setSelectedDate,
  setView,
  setLoading,
  setError,
} = calendarSlice.actions;

export default calendarSlice.reducer;
