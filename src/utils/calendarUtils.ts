import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { CalendarEvent, FilterType } from "../types/calendar";

/**
 * Get all days in a month including padding days from previous/next month
 */
export const getDaysInMonth = (currentDate: Date): Date[] => {
  const start = startOfWeek(startOfMonth(currentDate));
  const end = endOfWeek(endOfMonth(currentDate));
  return eachDayOfInterval({ start, end });
};

/**
 * Filter events for a specific date with optional type filter
 */
export const getEventsForDate = (
  events: CalendarEvent[],
  date: Date,
  filter: FilterType = "all"
): CalendarEvent[] => {
  return events
    .filter((event) => {
      const matchesFilter = filter === "all" || event.type === filter;
      const matchesDate = event.startTime.startsWith(
        format(date, "yyyy-MM-dd")
      );
      return matchesFilter && matchesDate;
    })
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
};

/**
 * Generate time slots for a given date (24 hour format)
 */
export const generateTimeSlots = (date: Date) => {
  const slots = [];
  let currentHour = 0;

  while (currentHour < 24) {
    slots.push({
      time: `${String(currentHour).padStart(2, "0")}:00`,
      label: `${String(currentHour).padStart(2, "0")}:00`,
    });
    currentHour++;
  }
  return slots;
};

/**
 * Check if an event should be displayed based on type filter
 */
export const shouldDisplayEvent = (
  event: CalendarEvent,
  filter: FilterType
): boolean => {
  return filter === "all" || event.type === filter;
};

/**
 * Format date for calendar header display
 */
export const formatHeaderDate = (date: Date, isMobile: boolean): string => {
  return format(date, isMobile ? "MMM yyyy" : "MMMM yyyy");
};

/**
 * Get event background color based on type
 */
export const getEventBackgroundColor = (eventType: string): string => {
  return eventType === "appointment"
    ? "calendar.lightBlue"
    : "calendar.lightOrange";
};

/**
 * Get event text color based on type
 */
export const getEventTextColor = (eventType: string): string => {
  return eventType === "appointment" ? "common.white" : "text.primary";
};
