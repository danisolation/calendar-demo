import React from "react";
import { Box, Typography, Paper, IconButton, Button } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { setSelectedDate } from "../store/calendarSlice";
import { CalendarEvent } from "../types/calendar";

const MainCalendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const selectedDate = useSelector(
    (state: RootState) => state.calendar.selectedDate
  );
  const events = useSelector((state: RootState) => state.calendar.events);
  const dispatch = useDispatch();

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleDateClick = (date: Date) => {
    dispatch(setSelectedDate(format(date, "yyyy-MM-dd")));
  };

  const getDaysInMonth = () => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    return eachDayOfInterval({ start, end });
  };

  const getEventsForDate = (date: Date): CalendarEvent[] => {
    return events.filter((event) =>
      event.startTime.startsWith(format(date, "yyyy-MM-dd"))
    );
  };

  const EventPreview: React.FC<{ event: CalendarEvent }> = ({ event }) => (
    <Box
      sx={{
        p: 0.5,
        mb: 0.5,
        borderRadius: 1,
        bgcolor:
          event.type === "appointment"
            ? "calendar.lightBlue"
            : "calendar.lightOrange",
        color: event.type === "appointment" ? "common.white" : "text.primary",
        fontSize: "0.75rem",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        cursor: "pointer",
        "&:hover": {
          filter: "brightness(0.95)",
        },
      }}
    >
      {format(new Date(event.startTime), "h:mm a")} - {event.title}
    </Box>
  );

  return (
    <Paper elevation={0} sx={{ p: 3, height: "100%" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 4,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h5" sx={{ mr: 2 }}>
            {format(currentMonth, "MMMM yyyy")}
          </Typography>
          <Box>
            <IconButton onClick={handlePreviousMonth} size="small">
              <ChevronLeft />
            </IconButton>
            <IconButton onClick={handleNextMonth} size="small">
              <ChevronRight />
            </IconButton>
          </Box>
        </Box>
        <Button variant="contained" color="primary">
          Today
        </Button>
      </Box>

      <Box
        sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1 }}
      >
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <Typography
            key={day}
            variant="subtitle2"
            sx={{
              textAlign: "center",
              color: "text.secondary",
              py: 1,
              fontWeight: "medium",
            }}
          >
            {day}
          </Typography>
        ))}

        {getDaysInMonth().map((day) => {
          const dayEvents = getEventsForDate(day);
          const isSelected = isSameDay(new Date(selectedDate), day);
          const isCurrentMonth = isSameMonth(day, currentMonth);

          return (
            <Paper
              key={day.toString()}
              elevation={0}
              onClick={() => handleDateClick(day)}
              sx={{
                height: 120,
                p: 1,
                cursor: "pointer",
                bgcolor: isSelected
                  ? "calendar.tileColor"
                  : isCurrentMonth
                  ? "background.paper"
                  : "action.hover",
                borderRadius: 1,
                "&:hover": {
                  bgcolor: "action.hover",
                },
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  textAlign: "right",
                  color: !isCurrentMonth ? "text.disabled" : "text.primary",
                  mb: 1,
                }}
              >
                {format(day, "d")}
              </Typography>
              <Box sx={{ overflow: "hidden" }}>
                {dayEvents.slice(0, 3).map((event) => (
                  <EventPreview key={event.id} event={event} />
                ))}
                {dayEvents.length > 3 && (
                  <Typography variant="caption" color="text.secondary">
                    +{dayEvents.length - 3} more
                  </Typography>
                )}
              </Box>
            </Paper>
          );
        })}
      </Box>
    </Paper>
  );
};

export default MainCalendar;
