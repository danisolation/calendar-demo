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
