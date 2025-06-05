import React from "react";
import { Box } from "@mui/material";
import { useCalendarLogic } from "../hooks/useCalendarLogic";
import CalendarHeader from "./CalendarHeader";
import MonthView from "./MonthView";
import WeekView from "./WeekView";
import DayView from "./DayView";
import CreateEventDialog from "./CreateEventDialog";
import EventDetailsDialog from "./EventDetailsDialog";
import TimeSuggestionDialog from "./TimeSuggestionDialog";
import EventListDialog from "./EventListDialog";

const MainCalendar: React.FC = React.memo(() => {
  const {
    // State
    currentDate,
    selectedDate,
    events,
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
    filter,

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
  } = useCalendarLogic();

  return (
    <Box
      sx={{
        p: { xs: 1, sm: 2, md: 3 },
        height: "100vh",
        maxHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onViewChange={handleViewChange}
        onCreateEvent={handleCreateEventClick}
        onTodayClick={handleTodayClick}
      />

      {/* Calendar Content */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflow: "auto",
          "& > *": {
            height: "100%",
          },
        }}
      >
        {view === "month" && (
          <MonthView
            currentDate={currentDate}
            selectedDate={selectedDate}
            events={events}
            filter={filter}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
            onMoreEventsClick={handleMoreEventsClick}
            onDayDoubleClick={handleDayDoubleClick}
          />
        )}
        {view === "week" && (
          <WeekView
            currentDate={currentDate}
            onEventClick={handleEventClick}
            onCellDoubleClick={handleCellDoubleClick}
          />
        )}
        {view === "day" && (
          <DayView
            currentDate={currentDate}
            onEventClick={handleEventClick}
            onCellDoubleClick={handleCellDoubleClick}
          />
        )}
      </Box>

      {/* Event Details Dialog */}
      <EventDetailsDialog
        open={!!expandedEvent}
        onClose={handleCloseDialog}
        event={expandedEvent}
      />

      {/* Create Event Dialog */}
      <CreateEventDialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        newEvent={newEvent}
        setNewEvent={setNewEvent}
        recurringPattern={recurringPattern}
        setRecurringPattern={setRecurringPattern}
        useEndDate={useEndDate}
        setUseEndDate={setUseEndDate}
        onCreateEvent={handleCreateEvent}
      />

      {/* Time Suggestion Dialog */}
      <TimeSuggestionDialog
        open={openSuggestionDialog}
        onClose={handleCloseSuggestionDialog}
        suggestedDate={suggestedDate}
        selectedTimeSlot={selectedTimeSlot}
        onTimeSlotSelect={handleTimeSlotSelect}
      />

      {/* All Events Dialog */}
      <EventListDialog
        open={openAllEventsDialog}
        onClose={() => setOpenAllEventsDialog(false)}
        date={selectedDayEvents.date}
        events={selectedDayEvents.events}
        onEventClick={handleEventClick}
      />
    </Box>
  );
});

MainCalendar.displayName = "MainCalendar";

export default MainCalendar;
