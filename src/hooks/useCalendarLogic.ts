import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  addHours,
  format,
  parseISO,
} from "date-fns";
import { RootState } from "../store/store";
import {
  setSelectedDate,
  setExpandedEvent,
  setView,
  addEvent,
} from "../store/calendarSlice";
import { CalendarEvent, CalendarViewType } from "../types/calendar";
import { getEventsForDate } from "../utils/calendarUtils";
import { createRRuleFromForm } from "../utils/rruleUtils";

export const useCalendarLogic = () => {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [openSuggestionDialog, setOpenSuggestionDialog] = React.useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = React.useState<string | null>(
    null
  );
  const [suggestedDate, setSuggestedDate] = React.useState<Date | null>(null);
  const [openCreateDialog, setOpenCreateDialog] = React.useState(false);
  const [openAllEventsDialog, setOpenAllEventsDialog] = React.useState(false);
  const [selectedDayEvents, setSelectedDayEvents] = React.useState<{
    date: Date;
    events: CalendarEvent[];
  }>({
    date: new Date(),
    events: [],
  });
  const [newEvent, setNewEvent] = React.useState<Partial<CalendarEvent>>({
    title: "",
    startTime: "",
    endTime: "",
    type: "appointment",
    location: "",
    description: "",
    isRecurring: false,
  });
  const [recurringPattern, setRecurringPattern] = React.useState<{
    frequency: "DAY" | "WEEK" | "MONTH" | "YEAR";
    interval: number;
    endDate?: string;
    occurrences?: number;
    byweekday?: number[];
    bymonth?: number[];
    bymonthday?: number[];
    bysetpos?: number[];
  }>({
    frequency: "WEEK",
    interval: 1,
  });
  const [useEndDate, setUseEndDate] = React.useState(true);

  const selectedDate = useSelector(
    (state: RootState) => state.calendar.selectedDate
  );
  const events = useSelector((state: RootState) => state.calendar.events);
  const filter = useSelector((state: RootState) => state.calendar.filter);
  const view = useSelector((state: RootState) => state.calendar.view);
  const expandedEventId = useSelector(
    (state: RootState) => state.calendar.expandedEvent
  );
  const dispatch = useDispatch();

  const expandedEvent = events.find((event) => event.id === expandedEventId);

  const handlePrevious = useCallback(() => {
    switch (view) {
      case "month":
        setCurrentDate(subMonths(currentDate, 1));
        break;
      case "week":
        setCurrentDate(subWeeks(currentDate, 1));
        break;
      case "day":
        setCurrentDate(subDays(currentDate, 1));
        break;
    }
  }, [view, currentDate]);

  const handleNext = useCallback(() => {
    switch (view) {
      case "month":
        setCurrentDate(addMonths(currentDate, 1));
        break;
      case "week":
        setCurrentDate(addWeeks(currentDate, 1));
        break;
      case "day":
        setCurrentDate(addDays(currentDate, 1));
        break;
    }
  }, [view, currentDate]);

  const handleDateClick = useCallback(
    (date: Date) => {
      dispatch(setSelectedDate(format(date, "yyyy-MM-dd")));
    },
    [dispatch]
  );

  const handleViewChange = useCallback(
    (newView: CalendarViewType) => {
      dispatch(setView(newView));
    },
    [dispatch]
  );

  const handleEventClick = useCallback(
    (eventId: string) => {
      dispatch(setExpandedEvent(eventId));
    },
    [dispatch]
  );

  const handleCloseDialog = useCallback(() => {
    dispatch(setExpandedEvent(null));
  }, [dispatch]);

  const resetEventForm = useCallback(() => {
    setNewEvent({
      title: "",
      startTime: "",
      endTime: "",
      type: "appointment",
      location: "",
      description: "",
      isRecurring: false,
    });
    setRecurringPattern({ frequency: "WEEK", interval: 1 });
    setUseEndDate(true);
  }, []);

  const handleCreateEvent = useCallback(() => {
    if (!newEvent.title || !newEvent.startTime || !newEvent.endTime) return;

    let event: CalendarEvent = {
      ...newEvent,
      id: Date.now().toString(),
      isRecurring: !!newEvent.isRecurring,
    } as CalendarEvent;

    if (newEvent.isRecurring) {
      const startDate = parseISO(newEvent.startTime);
      event.rrule = createRRuleFromForm(recurringPattern, startDate);

      event.recurringPattern = {
        frequency: recurringPattern.frequency,
        interval: recurringPattern.interval,
        ...(useEndDate && recurringPattern.endDate
          ? { endDate: recurringPattern.endDate }
          : {}),
        ...(!useEndDate && recurringPattern.occurrences
          ? { occurrences: recurringPattern.occurrences }
          : {}),
        ...(recurringPattern.byweekday?.length
          ? { byweekday: recurringPattern.byweekday }
          : {}),
        ...(recurringPattern.bymonth?.length
          ? { bymonth: recurringPattern.bymonth }
          : {}),
        ...(recurringPattern.bymonthday?.length
          ? { bymonthday: recurringPattern.bymonthday }
          : {}),
        ...(recurringPattern.bysetpos?.length
          ? { bysetpos: recurringPattern.bysetpos }
          : {}),
      };
    }

    dispatch(addEvent(event));
    setOpenCreateDialog(false);
    resetEventForm();
  }, [newEvent, recurringPattern, useEndDate, dispatch, resetEventForm]);

  const handleCellDoubleClick = useCallback((date: Date) => {
    const startTime = new Date(date);
    startTime.setMinutes(0);
    startTime.setHours(date.getHours() + 7);

    const endTime = new Date(date);
    endTime.setHours(date.getHours() + 8);
    endTime.setMinutes(0);

    setNewEvent((prev) => ({
      ...prev,
      title: "",
      startTime: startTime.toISOString().slice(0, 16),
      endTime: endTime.toISOString().slice(0, 16),
      type: "appointment",
      location: "",
      description: "",
      isRecurring: false,
    }));
    setOpenCreateDialog(true);
  }, []);

  const handleTimeSlotSelect = useCallback(
    (time: string) => {
      if (suggestedDate) {
        const [hours] = time.split(":");
        const newDate = new Date(suggestedDate);
        newDate.setHours(parseInt(hours), 0, 0, 0);
        dispatch(setSelectedDate(format(newDate, "yyyy-MM-dd")));
        setNewEvent((prev) => ({
          ...prev,
          startTime: format(newDate, "yyyy-MM-dd'T'HH:mm"),
          endTime: format(addHours(newDate, 1), "yyyy-MM-dd'T'HH:mm"),
        }));
        setOpenSuggestionDialog(false);
        setOpenCreateDialog(true);
      }
    },
    [suggestedDate, dispatch]
  );

  const handleCloseSuggestionDialog = useCallback(() => {
    setOpenSuggestionDialog(false);
    setSuggestedDate(null);
    setSelectedTimeSlot(null);
  }, []);

  const handleMoreEventsClick = useCallback(
    (e: React.MouseEvent, day: Date, events: CalendarEvent[]) => {
      e.stopPropagation();
      setSelectedDayEvents({ date: day, events });
      setOpenAllEventsDialog(true);
    },
    []
  );

  const handleTodayClick = useCallback(() => {
    const today = new Date();
    setCurrentDate(today);
    dispatch(setSelectedDate(format(today, "yyyy-MM-dd")));
  }, [dispatch]);

  const handleCreateEventClick = useCallback(() => {
    setOpenCreateDialog(true);
    resetEventForm();
  }, [resetEventForm]);

  const handleDayDoubleClick = useCallback((date: Date) => {
    setSuggestedDate(date);
    setOpenSuggestionDialog(true);
  }, []);

  const getFilteredEventsForDate = useCallback(
    (date: Date): CalendarEvent[] => {
      return getEventsForDate(events, date, filter);
    },
    [events, filter]
  );

  return {
    // State
    currentDate,
    selectedDate,
    events,
    filter,
    view,
    expandedEvent,
    openSuggestionDialog,
    selectedTimeSlot,
    suggestedDate,
    openCreateDialog,
    openAllEventsDialog,
    selectedDayEvents,
    newEvent,
    recurringPattern,
    useEndDate,

    // Setters
    setNewEvent,
    setRecurringPattern,
    setUseEndDate,
    setOpenCreateDialog,
    setOpenAllEventsDialog,

    // Handlers
    handlePrevious,
    handleNext,
    handleDateClick,
    handleViewChange,
    handleEventClick,
    handleCloseDialog,
    handleCreateEvent,
    handleCellDoubleClick,
    handleTimeSlotSelect,
    handleCloseSuggestionDialog,
    handleMoreEventsClick,
    handleTodayClick,
    handleCreateEventClick,
    handleDayDoubleClick,
    getEventsForDate: getFilteredEventsForDate,
  };
};
