import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  CalendarState,
  CalendarEvent,
  FilterType,
  CalendarViewType,
} from "../types/calendar";
import { generateRecurringEventsFromRRule } from "../utils/rruleUtils";

const initialState: CalendarState = {
  events: [],
  selectedDate: new Date().toISOString().split("T")[0],
  view: "month",
  loading: false,
  error: null,
  filter: "all",
  expandedEvent: null,
};

const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    fetchEvents: (state) => {
      state.loading = true;
      state.error = null;
    },
    setEvents: (state, action: PayloadAction<CalendarEvent[]>) => {
      const allEvents: CalendarEvent[] = [];
      action.payload.forEach((event) => {
        if (event.isRecurring) {
          // Use RRule to generate recurring events
          allEvents.push(...generateRecurringEventsFromRRule(event));
        } else {
          allEvents.push(event);
        }
      });
      state.events = allEvents;
      state.loading = false;
    },
    addEvent: (state, action: PayloadAction<CalendarEvent>) => {
      if (action.payload.isRecurring) {
        // Use RRule to generate recurring events
        state.events.push(...generateRecurringEventsFromRRule(action.payload));
      } else {
        state.events.push(action.payload);
      }
    },
    updateEvent: (state, action: PayloadAction<CalendarEvent>) => {
      // Remove all instances of recurring event if it's recurring
      if (action.payload.isRecurring) {
        // Remove all instances of this recurring event
        state.events = state.events.filter(
          (event) =>
            !event.id.startsWith(action.payload.id) &&
            event.originalEventId !== action.payload.id
        );
        // Add updated recurring events
        state.events.push(...generateRecurringEventsFromRRule(action.payload));
      } else {
        const index = state.events.findIndex(
          (event) => event.id === action.payload.id
        );
        if (index !== -1) {
          state.events[index] = action.payload;
        }
      }
    },
    deleteEvent: (state, action: PayloadAction<string>) => {
      // Find the event to check if it's recurring
      const eventToDelete = state.events.find(
        (e) =>
          e.id.startsWith(action.payload) ||
          e.originalEventId === action.payload
      );

      if (eventToDelete?.isRecurring || eventToDelete?.originalEventId) {
        // Delete all instances of recurring event
        const baseId = eventToDelete.originalEventId || action.payload;
        state.events = state.events.filter(
          (event) =>
            !event.id.startsWith(baseId) &&
            event.originalEventId !== baseId &&
            event.id !== baseId
        );
      } else {
        state.events = state.events.filter(
          (event) => event.id !== action.payload
        );
      }
    },
    deleteRecurringInstance: (state, action: PayloadAction<string>) => {
      // Delete only a specific instance of a recurring event
      state.events = state.events.filter(
        (event) => event.id !== action.payload
      );
    },
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload;
    },
    setView: (state, action: PayloadAction<CalendarViewType>) => {
      state.view = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setFilter: (state, action: PayloadAction<FilterType>) => {
      state.filter = action.payload;
    },
    setExpandedEvent: (state, action: PayloadAction<string | null>) => {
      state.expandedEvent = action.payload;
    },
  },
});

export const {
  fetchEvents,
  setEvents,
  addEvent,
  updateEvent,
  deleteEvent,
  deleteRecurringInstance,
  setSelectedDate,
  setView,
  setLoading,
  setError,
  setFilter,
  setExpandedEvent,
} = calendarSlice.actions;

export default calendarSlice.reducer;
