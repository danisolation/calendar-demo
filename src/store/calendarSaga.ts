import { takeLatest, put, call } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import {
  setEvents,
  setLoading,
  setError,
  addEvent,
  updateEvent,
  deleteEvent,
} from "./calendarSlice";
import { CalendarEvent } from "../types/calendar";

// Mock API calls - replace with actual API endpoints
const api = {
  fetchEvents: async () => {
    // Simulate API call
    return new Promise<CalendarEvent[]>((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: "1",
            title: "First Session with Alex Stan",
            startTime: "2024-01-04T09:00:00",
            endTime: "2024-01-04T09:30:00",
            type: "appointment",
            clientName: "Alex Stan",
            clientAvatar: "/avatar.jpg",
            color: "#5684AE",
          },
          {
            id: "2",
            title: "Webinar: How to cope with trauma in professional life",
            startTime: "2024-01-04T14:00:00",
            endTime: "2024-01-04T15:30:00",
            type: "webinar",
            description: "Professional development webinar",
            color: "#F9BE81",
          },
          {
            id: "3",
            title: "Team Meeting with Sarah Johnson",
            startTime: "2024-01-05T10:00:00",
            endTime: "2024-01-05T11:00:00",
            type: "appointment",
            clientName: "Sarah Johnson",
            clientAvatar: "/avatar2.jpg",
            color: "#5684AE",
            location: "Meeting Room 1",
          },
          {
            id: "4",
            title: "Webinar: Modern Web Development",
            startTime: "2024-01-07T13:00:00",
            endTime: "2024-01-07T14:30:00",
            type: "webinar",
            description: "Learn about the latest web development trends",
            color: "#F9BE81",
          },
          {
            id: "5",
            title: "Monthly Review with Mike Brown",
            startTime: "2024-01-10T15:00:00",
            endTime: "2024-01-10T16:00:00",
            type: "appointment",
            clientName: "Mike Brown",
            clientAvatar: "/avatar3.jpg",
            color: "#5684AE",
            isRecurring: true,
            recurringPattern: {
              frequency: "MONTH",
              interval: 1,
              endDate: "2024-12-31",
            },
          },
          {
            id: "6",
            title: "Weekly Team Sync",
            startTime: "2024-01-12T09:00:00",
            endTime: "2024-01-12T10:00:00",
            type: "appointment",
            clientName: "Development Team",
            color: "#5684AE",
            isRecurring: true,
            recurringPattern: {
              frequency: "WEEK",
              interval: 1,
              endDate: "2024-03-31",
            },
          },
          {
            id: "7",
            title: "Webinar: Agile Project Management",
            startTime: "2024-01-15T11:00:00",
            endTime: "2024-01-15T12:30:00",
            type: "webinar",
            description: "Best practices in Agile methodology",
            color: "#F9BE81",
          },
          {
            id: "8",
            title: "Client Consultation - Emma Wilson",
            startTime: "2024-01-18T14:00:00",
            endTime: "2024-01-18T15:00:00",
            type: "appointment",
            clientName: "Emma Wilson",
            clientAvatar: "/avatar4.jpg",
            color: "#5684AE",
          },
          {
            id: "9",
            title: "Daily Standup",
            startTime: "2024-01-20T09:30:00",
            endTime: "2024-01-20T10:00:00",
            type: "appointment",
            clientName: "Development Team",
            color: "#5684AE",
            isRecurring: true,
            recurringPattern: {
              frequency: "DAY",
              interval: 1,
              endDate: "2024-01-31",
            },
          },
          {
            id: "10",
            title: "Webinar: Future of AI in Business",
            startTime: "2025-07-25T15:00:00",
            endTime: "2025-07-25T16:30:00",
            type: "webinar",
            description: "Exploring AI applications in modern business",
            color: "#F9BE81",
          },
        ]);
      }, 1000);
    });
  },
  createEvent: async (event: CalendarEvent) => {
    // Simulate API call
    return new Promise<CalendarEvent>((resolve) => {
      setTimeout(() => resolve(event), 1000);
    });
  },
  updateEvent: async (event: CalendarEvent) => {
    // Simulate API call
    return new Promise<CalendarEvent>((resolve) => {
      setTimeout(() => resolve(event), 1000);
    });
  },
  deleteEvent: async (id: string) => {
    // Simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 1000);
    });
  },
};

function* fetchEventsSaga() {
  try {
    yield put(setLoading(true));
    const events: CalendarEvent[] = yield call(api.fetchEvents);
    yield put(setEvents(events));
  } catch (error) {
    yield put(
      setError(
        error instanceof Error ? error.message : "Failed to fetch events"
      )
    );
  } finally {
    yield put(setLoading(false));
  }
}

function* createEventSaga(action: PayloadAction<CalendarEvent>) {
  try {
    yield put(setLoading(true));
    const newEvent: CalendarEvent = yield call(api.createEvent, action.payload);
    yield put(addEvent(newEvent));
  } catch (error) {
    yield put(
      setError(
        error instanceof Error ? error.message : "Failed to create event"
      )
    );
  } finally {
    yield put(setLoading(false));
  }
}

function* updateEventSaga(action: PayloadAction<CalendarEvent>) {
  try {
    yield put(setLoading(true));
    const updatedEvent: CalendarEvent = yield call(
      api.updateEvent,
      action.payload
    );
    yield put(updateEvent(updatedEvent));
  } catch (error) {
    yield put(
      setError(
        error instanceof Error ? error.message : "Failed to update event"
      )
    );
  } finally {
    yield put(setLoading(false));
  }
}

function* deleteEventSaga(action: PayloadAction<string>) {
  try {
    yield put(setLoading(true));
    yield call(api.deleteEvent, action.payload);
    yield put(deleteEvent(action.payload));
  } catch (error) {
    yield put(
      setError(
        error instanceof Error ? error.message : "Failed to delete event"
      )
    );
  } finally {
    yield put(setLoading(false));
  }
}

export function* calendarSaga() {
  yield takeLatest("calendar/fetchEvents", fetchEventsSaga);
  yield takeLatest("calendar/createEvent", createEventSaga);
  yield takeLatest("calendar/updateEvent", updateEventSaga);
  yield takeLatest("calendar/deleteEvent", deleteEventSaga);
}
