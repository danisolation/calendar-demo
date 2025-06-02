import React from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Avatar,
  SelectChangeEvent,
  Chip,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  VideoCall,
  LocationOn,
  AccessTime,
  Repeat,
  Today,
} from "@mui/icons-material";
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
  parseISO,
  isToday,
} from "date-fns";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import {
  setSelectedDate,
  setFilter,
  setExpandedEvent,
} from "../store/calendarSlice";
import { CalendarEvent, FilterType } from "../types/calendar";

const MainCalendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const selectedDate = useSelector(
    (state: RootState) => state.calendar.selectedDate
  );
  const events = useSelector((state: RootState) => state.calendar.events);
  const filter = useSelector((state: RootState) => state.calendar.filter);
  const expandedEventId = useSelector(
    (state: RootState) => state.calendar.expandedEvent
  );
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

  const handleFilterChange = (event: SelectChangeEvent) => {
    dispatch(setFilter(event.target.value as FilterType));
  };

  const handleEventClick = (eventId: string) => {
    dispatch(setExpandedEvent(eventId));
  };

  const handleCloseDialog = () => {
    dispatch(setExpandedEvent(null));
  };

  const getDaysInMonth = () => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    return eachDayOfInterval({ start, end });
  };

  const getEventsForDate = (date: Date): CalendarEvent[] => {
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

  const EventPreview: React.FC<{ event: CalendarEvent }> = ({ event }) => (
    <Box
      onClick={(e) => {
        e.stopPropagation();
        handleEventClick(event.id);
      }}
      sx={{
        p: "2px 4px",
        mb: 0.5,
        borderRadius: "4px",
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
        display: "flex",
        alignItems: "center",
        gap: 0.5,
        border: "1px solid",
        borderColor: "divider",
        "&:hover": {
          filter: "brightness(0.95)",
        },
      }}
    >
      <Typography
        variant="caption"
        sx={{
          fontWeight: 500,
          minWidth: "fit-content",
        }}
      >
        {format(parseISO(event.startTime), "HH:mm")}
      </Typography>
      <Typography
        variant="caption"
        sx={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {event.title}
      </Typography>
      {event.isRecurring && (
        <Repeat
          sx={{
            fontSize: 12,
            ml: "auto",
            minWidth: "fit-content",
          }}
        />
      )}
    </Box>
  );

  const expandedEvent = events.find((event) => event.id === expandedEventId);

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, height: "100%" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="h5">
            {format(currentMonth, "MMMM yyyy")}
          </Typography>
          <Box sx={{ display: "flex", gap: 0.5 }}>
            <IconButton
              onClick={handlePreviousMonth}
              size="small"
              sx={{ color: "primary.main" }}
            >
              <ChevronLeft />
            </IconButton>
            <IconButton
              onClick={handleNextMonth}
              size="small"
              sx={{ color: "primary.main" }}
            >
              <ChevronRight />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleDateClick(new Date())}
          >
            Today
          </Button>
          <Button
            variant="contained"
            size="small"
            endIcon={<ChevronRight fontSize="small" />}
          >
            Month
          </Button>
        </Box>
      </Box>

      {/* Calendar Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
          bgcolor: "background.paper",
          borderRadius: 1,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        {/* Weekday Headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <Box
            key={day}
            sx={{
              p: 1.5,
              textAlign: "center",
              borderBottom: "1px solid",
              borderRight: "1px solid",
              borderColor: "divider",
              width: "100%",
            }}
          >
            <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
              {day}
            </Typography>
          </Box>
        ))}

        {/* Calendar Days */}
        {getDaysInMonth().map((day) => {
          const dayEvents = getEventsForDate(day);
          const isSelected = isSameDay(new Date(selectedDate), day);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const dayIsToday = isToday(day);

          return (
            <Box
              key={day.toString()}
              onClick={() => handleDateClick(day)}
              sx={{
                p: 1,
                cursor: "pointer",
                bgcolor: isSelected ? "calendar.tileColor" : "background.paper",
                borderBottom: "1px solid",
                borderRight: "1px solid",
                borderColor: "divider",
                minHeight: 120,
                maxHeight: 160,
                width: "100%",
                position: "relative",
                overflow: "hidden",
                ...(dayIsToday && {
                  "& .today-marker": {
                    display: "block",
                  },
                }),
                ...(isSelected && {
                  "& .today-marker": {
                    bgcolor: "primary.main",
                  },
                }),
                "&:hover": {
                  bgcolor: !isCurrentMonth
                    ? "background.default"
                    : isSelected
                    ? "calendar.tileColor"
                    : "action.hover",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: !isCurrentMonth
                      ? "text.disabled"
                      : dayIsToday
                      ? "primary.main"
                      : "text.primary",
                    fontWeight: dayIsToday ? 600 : 400,
                  }}
                >
                  {format(day, "d")}
                </Typography>
                {dayIsToday && (
                  <Box
                    className="today-marker"
                    sx={{
                      px: 1,
                      py: 0.25,
                      bgcolor: "primary.light",
                      color: "common.white",
                      borderRadius: 10,
                      fontSize: "0.6875rem",
                      fontWeight: 500,
                    }}
                  >
                    Today
                  </Box>
                )}
              </Box>

              {/* Events Container */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.5,
                  maxHeight: "calc(100% - 28px)",
                  overflow: "hidden",
                }}
              >
                {/* Events */}
                {dayEvents.slice(0, 3).map((event) => (
                  <Box
                    key={event.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEventClick(event.id);
                    }}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      p: "2px 4px",
                      borderRadius: 0.5,
                      bgcolor:
                        event.type === "appointment"
                          ? "calendar.lightBlue"
                          : "calendar.lightOrange",
                      color:
                        event.type === "appointment"
                          ? "common.white"
                          : "text.primary",
                      fontSize: "0.75rem",
                      border: "1px solid",
                      borderColor: "divider",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      minHeight: 20,
                      "&:hover": {
                        filter: "brightness(0.95)",
                      },
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 500,
                        minWidth: "fit-content",
                        flexShrink: 0,
                      }}
                    >
                      {format(parseISO(event.startTime), "HH:mm")}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        flex: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {event.title}
                    </Typography>
                    {event.isRecurring && (
                      <Repeat
                        sx={{
                          fontSize: "0.875rem",
                          opacity: 0.8,
                          flexShrink: 0,
                          minWidth: 16,
                        }}
                      />
                    )}
                  </Box>
                ))}
                {/* More Events Indicator */}
                {dayEvents.length > 3 && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                      pl: 0.5,
                      position: "absolute",
                      bottom: 4,
                      left: 8,
                      bgcolor: "background.paper",
                      px: 1,
                      borderRadius: 0.5,
                    }}
                  >
                    {dayEvents.length - 3} more
                  </Typography>
                )}
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Event Dialog */}
      <Dialog
        open={!!expandedEventId}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        {expandedEvent && (
          <>
            <DialogTitle
              sx={{
                bgcolor:
                  expandedEvent.type === "appointment"
                    ? "calendar.lightBlue"
                    : "calendar.lightOrange",
                color:
                  expandedEvent.type === "appointment"
                    ? "common.white"
                    : "text.primary",
                p: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                {expandedEvent.type === "appointment" &&
                  expandedEvent.clientAvatar && (
                    <Avatar src={expandedEvent.clientAvatar} />
                  )}
                {expandedEvent.type === "webinar" && (
                  <VideoCall sx={{ fontSize: 24 }} />
                )}
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, mb: 0.5 }}
                  >
                    {expandedEvent.title}
                  </Typography>
                  <Typography variant="caption">
                    {format(parseISO(expandedEvent.startTime), "EEEE, MMMM d")}
                  </Typography>
                </Box>
                {expandedEvent.isRecurring && (
                  <Repeat sx={{ fontSize: 20, opacity: 0.8 }} />
                )}
              </Box>
            </DialogTitle>
            <DialogContent sx={{ p: 2 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <AccessTime
                    fontSize="small"
                    sx={{ color: "text.secondary" }}
                  />
                  <Typography variant="body2">
                    {format(parseISO(expandedEvent.startTime), "h:mm a")} -{" "}
                    {format(parseISO(expandedEvent.endTime), "h:mm a")}
                  </Typography>
                </Box>

                {expandedEvent.location && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LocationOn
                      fontSize="small"
                      sx={{ color: "text.secondary" }}
                    />
                    <Typography variant="body2">
                      {expandedEvent.location}
                    </Typography>
                  </Box>
                )}

                {expandedEvent.isRecurring &&
                  expandedEvent.recurringPattern && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Repeat
                        fontSize="small"
                        sx={{ color: "text.secondary" }}
                      />
                      <Typography variant="body2">
                        Repeats every {expandedEvent.recurringPattern.interval}{" "}
                        {expandedEvent.recurringPattern.frequency.toLowerCase()}
                        {expandedEvent.recurringPattern.interval > 1 ? "s" : ""}
                      </Typography>
                    </Box>
                  )}

                {expandedEvent.description && (
                  <Box
                    sx={{
                      mt: 1,
                      p: 1.5,
                      bgcolor: "background.default",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {expandedEvent.description}
                    </Typography>
                  </Box>
                )}
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2, pt: 0 }}>
              <Button onClick={handleCloseDialog} color="inherit">
                Close
              </Button>
              {expandedEvent.type === "appointment" && (
                <Button variant="contained" startIcon={<VideoCall />}>
                  Join Meeting
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default MainCalendar;
