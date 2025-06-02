import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  CalendarState,
  CalendarEvent,
  FilterType,
  CalendarViewType,
} from "../types/calendar";
import {
  format,
  addDays,
  addWeeks,
  addMonths,
  addYears,
  isSameDay,
  parseISO,
  differenceInMinutes,
  differenceInDays,
} from "date-fns";

const initialState: CalendarState = {
  events: [],
  selectedDate: new Date().toISOString().split("T")[0],
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
  const eventEndDate = parseISO(event.endTime);
  const eventDuration = differenceInMinutes(eventEndDate, startDate);

  // Determine end date for recurring pattern
  let endRecurring: Date;
  if (event.recurringPattern.endDate) {
    endRecurring = parseISO(event.recurringPattern.endDate);
  } else if (event.recurringPattern.occurrences) {
    // Calculate end date based on occurrences
    const { interval, frequency } = event.recurringPattern;
    let lastDate = startDate;
    for (let i = 1; i < event.recurringPattern.occurrences; i++) {
      switch (frequency) {
        case "DAY":
          lastDate = addDays(lastDate, interval);
          break;
        case "WEEK":
          lastDate = addWeeks(lastDate, interval);
          break;
        case "MONTH":
          lastDate = addMonths(lastDate, interval);
          break;
        case "YEAR":
          lastDate = addYears(lastDate, interval);
          break;
      }
    }
    endRecurring = lastDate;
  } else {
    // Default to 1 year if no end date or occurrences specified
    endRecurring = addYears(startDate, 1);
  }

  let currentDate = startDate;
  let occurrenceCount = 0;
  const maxOccurrences = event.recurringPattern.occurrences || Infinity;

  while (currentDate <= endRecurring && occurrenceCount < maxOccurrences) {
    // Create new event instance
    const newEventStart = currentDate;
    const newEventEnd = new Date(
      newEventStart.getTime() + eventDuration * 60000
    );

    const newEvent = {
      ...event,
      id: `${event.id}-${format(currentDate, "yyyy-MM-dd")}`,
      startTime: format(newEventStart, "yyyy-MM-dd'T'HH:mm:ss"),
      endTime: format(newEventEnd, "yyyy-MM-dd'T'HH:mm:ss"),
    };
    events.push(newEvent);
    occurrenceCount++;

    // Calculate next occurrence based on frequency
    const { interval, frequency } = event.recurringPattern;
    switch (frequency) {
      case "DAY":
        currentDate = addDays(currentDate, interval);
        break;
      case "WEEK":
        currentDate = addWeeks(currentDate, interval);
        break;
      case "MONTH":
        currentDate = addMonths(currentDate, interval);
        break;
      case "YEAR":
        currentDate = addYears(currentDate, interval);
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
  setSelectedDate,
  setView,
  setLoading,
  setError,
  setFilter,
  setExpandedEvent,
} = calendarSlice.actions;

export default calendarSlice.reducer;
