import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CalendarState, CalendarEvent } from "../types/calendar";
import { format, addDays, isSameDay, parseISO } from "date-fns";

const initialState: CalendarState = {
  events: [],
  selectedDate: format(new Date(), "yyyy-MM-dd"),
  view: "month",
  loading: false,
  error: null,
  filter: "all",
  expandedEvent: null,
};

const generateRecurringEvents = (event: CalendarEvent): CalendarEvent[] => {
  if (!event.isRecurring || !event.recurringPattern) return [event];

  const events: CalendarEvent[] = [];
  const startDate = parseISO(event.startTime);
  const endRecurring = event.recurringPattern.endDate
    ? parseISO(event.recurringPattern.endDate)
    : addDays(startDate, 30); // Default to 30 days if no end date

  let currentDate = startDate;
  while (currentDate <= endRecurring) {
    const newEvent = {
      ...event,
      id: `${event.id}-${format(currentDate, "yyyy-MM-dd")}`,
      startTime: format(currentDate, "yyyy-MM-dd'T'HH:mm:ss"),
      endTime: format(addDays(currentDate, 0), "yyyy-MM-dd'T'HH:mm:ss"),
    };
    events.push(newEvent);

    // Calculate next occurrence based on frequency
    switch (event.recurringPattern.frequency) {
      case "daily":
        currentDate = addDays(currentDate, event.recurringPattern.interval);
        break;
      case "weekly":
        currentDate = addDays(currentDate, 7 * event.recurringPattern.interval);
        break;
      case "monthly":
        currentDate = addDays(
          currentDate,
          30 * event.recurringPattern.interval
        );
        break;
      case "yearly":
        currentDate = addDays(
          currentDate,
          365 * event.recurringPattern.interval
        );
        break;
    }
  }

  return events;
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
          allEvents.push(...generateRecurringEvents(event));
        } else {
          allEvents.push(event);
        }
      });
      state.events = allEvents;
      state.loading = false;
    },
    addEvent: (state, action: PayloadAction<CalendarEvent>) => {
      if (action.payload.isRecurring) {
        state.events.push(...generateRecurringEvents(action.payload));
      } else {
        state.events.push(action.payload);
      }
    },
    updateEvent: (state, action: PayloadAction<CalendarEvent>) => {
      // Remove all instances of recurring event if it's recurring
      if (action.payload.isRecurring) {
        state.events = state.events.filter(
          (event) => !event.id.startsWith(action.payload.id)
        );
        state.events.push(...generateRecurringEvents(action.payload));
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
      const eventToDelete = state.events.find((e) =>
        e.id.startsWith(action.payload)
      );
      if (eventToDelete?.isRecurring) {
        // Delete all instances of recurring event
        state.events = state.events.filter(
          (event) => !event.id.startsWith(action.payload)
        );
      } else {
        state.events = state.events.filter(
          (event) => event.id !== action.payload
        );
      }
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
    setFilter: (
      state,
      action: PayloadAction<"all" | "appointment" | "webinar">
    ) => {
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
  setSelectedDate,
  setView,
  setLoading,
  setError,
  setFilter,
  setExpandedEvent,
} = calendarSlice.actions;

export default calendarSlice.reducer;
