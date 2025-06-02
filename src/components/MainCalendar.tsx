import React from "react";
import {
  Box,
  Typography,
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
  ButtonGroup,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  VideoCall,
  LocationOn,
  AccessTime,
  Repeat,
  Today,
  ViewDay,
  ViewWeek,
  CalendarViewMonth,
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
  addWeeks,
  subWeeks,
  addDays,
  subDays,
} from "date-fns";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import {
  setSelectedDate,
  setFilter,
  setExpandedEvent,
  setView,
} from "../store/calendarSlice";
import { CalendarEvent, FilterType, CalendarViewType } from "../types/calendar";
import WeekView from "./WeekView";
import DayView from "./DayView";

const MainCalendar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [currentDate, setCurrentDate] = React.useState(new Date());

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

  const handlePrevious = () => {
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
  };

  const handleNext = () => {
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
  };

  const handleDateClick = (date: Date) => {
    dispatch(setSelectedDate(format(date, "yyyy-MM-dd")));
  };

  const handleFilterChange = (event: SelectChangeEvent) => {
    dispatch(setFilter(event.target.value as FilterType));
  };

  const handleViewChange = (newView: CalendarViewType) => {
    dispatch(setView(newView));
  };

  const handleEventClick = (eventId: string) => {
    dispatch(setExpandedEvent(eventId));
  };

  const handleCloseDialog = () => {
    dispatch(setExpandedEvent(null));
  };

  const getDaysInMonth = () => {
    const start = startOfWeek(startOfMonth(currentDate));
    const end = endOfWeek(endOfMonth(currentDate));
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

  const renderMonthView = () => (
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
            {isMobile ? day.charAt(0) : day}
          </Typography>
        </Box>
      ))}

      {/* Calendar Days */}
      {getDaysInMonth().map((day) => {
        const dayEvents = getEventsForDate(day);
        const isSelected = isSameDay(new Date(selectedDate), day);
        const isCurrentMonth = isSameMonth(day, currentDate);
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
              minHeight: { xs: 80, sm: 120 },
              maxHeight: { xs: 120, sm: 160 },
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
                    display: { xs: "none", sm: "block" },
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
              {dayEvents.slice(0, isMobile ? 2 : 3).map((event) => (
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
                      display: { xs: "none", sm: "block" },
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
                        display: { xs: "none", sm: "block" },
                      }}
                    />
                  )}
                </Box>
              ))}
              {dayEvents.length > (isMobile ? 2 : 3) && (
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
                  {dayEvents.length - (isMobile ? 2 : 3)} more
                </Typography>
              )}
            </Box>
          </Box>
        );
      })}
    </Box>
  );

  const expandedEvent = events.find((event) => event.id === expandedEventId);

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, height: "100%" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "stretch", sm: "center" },
          justifyContent: "space-between",
          gap: 2,
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            variant="h5"
            sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
          >
            {format(currentDate, isMobile ? "MMM yyyy" : "MMMM yyyy")}
          </Typography>
          <Box sx={{ display: "flex", gap: 0.5 }}>
            <IconButton
              onClick={handlePrevious}
              size="small"
              sx={{ color: "primary.main" }}
            >
              <ChevronLeft />
            </IconButton>
            <IconButton
              onClick={handleNext}
              size="small"
              sx={{ color: "primary.main" }}
            >
              <ChevronRight />
            </IconButton>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              setCurrentDate(new Date());
              handleDateClick(new Date());
            }}
            startIcon={<Today />}
            sx={{ display: { xs: "none", sm: "inline-flex" } }}
          >
            Today
          </Button>
          <ButtonGroup
            size="small"
            sx={{ display: { xs: "none", sm: "flex" } }}
          >
            <Button
              variant={view === "day" ? "contained" : "outlined"}
              onClick={() => handleViewChange("day")}
            >
              <ViewDay />
            </Button>
            <Button
              variant={view === "week" ? "contained" : "outlined"}
              onClick={() => handleViewChange("week")}
            >
              <ViewWeek />
            </Button>
            <Button
              variant={view === "month" ? "contained" : "outlined"}
              onClick={() => handleViewChange("month")}
            >
              <CalendarViewMonth />
            </Button>
          </ButtonGroup>
          <Select
            size="small"
            value={view}
            onChange={(e) =>
              handleViewChange(e.target.value as CalendarViewType)
            }
            sx={{ display: { xs: "block", sm: "none" }, minWidth: 100 }}
          >
            <MenuItem value="day">Day</MenuItem>
            <MenuItem value="week">Week</MenuItem>
            <MenuItem value="month">Month</MenuItem>
          </Select>
        </Box>
      </Box>

      {/* Calendar Content */}
      <Box sx={{ height: "calc(100% - 100px)" }}>
        {view === "month" && renderMonthView()}
        {view === "week" && (
          <WeekView currentDate={currentDate} onEventClick={handleEventClick} />
        )}
        {view === "day" && (
          <DayView currentDate={currentDate} onEventClick={handleEventClick} />
        )}
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
