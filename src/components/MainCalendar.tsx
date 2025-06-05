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
  TextField,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
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
  addHours,
} from "date-fns";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import {
  setSelectedDate,
  setFilter,
  setExpandedEvent,
  setView,
  addEvent,
} from "../store/calendarSlice";
import { CalendarEvent, FilterType, CalendarViewType } from "../types/calendar";
import WeekView from "./WeekView";
import DayView from "./DayView";
import EventListDialog from "./EventListDialog";

const MainCalendar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [openSuggestionDialog, setOpenSuggestionDialog] = React.useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = React.useState<string | null>(
    null
  );
  const [suggestedDate, setSuggestedDate] = React.useState<Date | null>(null);

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
  }>({
    frequency: "WEEK",
    interval: 1,
  });
  const [useEndDate, setUseEndDate] = React.useState(true);

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
        height: "100%",
        minHeight: { xs: 500, sm: 600, md: 700 },
        maxHeight: {
          xs: "calc(100vh - 120px)",
          sm: "calc(100vh - 140px)",
          md: "calc(100vh - 160px)",
        },
      }}
    >
      {/* Weekday Headers */}
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
        <Box
          key={day}
          sx={{
            p: { xs: 1, sm: 1.5 },
            textAlign: "center",
            borderBottom: "1px solid",
            borderRight: "1px solid",
            borderColor: "divider",
            width: "100%",
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              color: "text.secondary",
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
            }}
          >
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
            onDoubleClick={() => {
              setSuggestedDate(day);
              setOpenSuggestionDialog(true);
            }}
            sx={{
              p: { xs: 0.5, sm: 1 },
              cursor: "pointer",
              bgcolor: isSelected ? "calendar.tileColor" : "background.paper",
              borderBottom: "1px solid",
              borderRight: "1px solid",
              borderColor: "divider",
              height: { xs: 80, sm: 100, md: 120 },
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
                mb: { xs: 0.5, sm: 1 },
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
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
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
                    fontSize: { xs: "0.625rem", sm: "0.6875rem" },
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
                gap: { xs: 0.25, sm: 0.5 },
                maxHeight: "calc(100% - 24px)",
                overflow: "hidden",
              }}
            >
              {dayEvents.slice(0, 2).map((event) => (
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
                    p: { xs: "1px 2px", sm: "2px 4px" },
                    borderRadius: 0.5,
                    bgcolor:
                      event.type === "appointment"
                        ? "calendar.lightBlue"
                        : "calendar.lightOrange",
                    color:
                      event.type === "appointment"
                        ? "common.white"
                        : "text.primary",
                    fontSize: { xs: "0.625rem", sm: "0.75rem" },
                    border: "1px solid",
                    borderColor: "divider",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    minHeight: { xs: 16, sm: 20 },
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
                      fontSize: "inherit",
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
                      fontSize: "inherit",
                    }}
                  >
                    {event.title}
                  </Typography>
                  {event.isRecurring && (
                    <Repeat
                      sx={{
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        opacity: 0.8,
                        flexShrink: 0,
                        display: { xs: "none", sm: "block" },
                      }}
                    />
                  )}
                </Box>
              ))}
              {dayEvents.length > 2 && (
                <Box
                  onClick={(e) => handleMoreEventsClick(e, day, dayEvents)}
                  sx={{
                    color: "text.secondary",
                    pl: 0.5,
                    cursor: "pointer",
                    bgcolor: "background.paper",
                    px: 1,
                    py: 0.25,
                    borderRadius: 0.5,
                    fontSize: { xs: "0.625rem", sm: "0.75rem" },
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  <Typography variant="caption" sx={{ fontSize: "inherit" }}>
                    +{dayEvents.length - 2} more
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        );
      })}
    </Box>
  );

  const expandedEvent = events.find((event) => event.id === expandedEventId);

  const handleCreateEvent = () => {
    if (!newEvent.title || !newEvent.startTime || !newEvent.endTime) return;
    let event: CalendarEvent = {
      ...newEvent,
      id: Date.now().toString(),
      isRecurring: !!newEvent.isRecurring,
    } as CalendarEvent;
    if (newEvent.isRecurring) {
      event.recurringPattern = {
        frequency: recurringPattern.frequency,
        interval: recurringPattern.interval,
        ...(useEndDate && recurringPattern.endDate
          ? { endDate: recurringPattern.endDate }
          : {}),
        ...(!useEndDate && recurringPattern.occurrences
          ? { occurrences: recurringPattern.occurrences }
          : {}),
      };
    }
    dispatch(addEvent(event));
    setOpenCreateDialog(false);
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
  };

  const handleCellDoubleClick = (date: Date) => {
    // Lấy giờ bắt đầu từ date được click
    const startTime = new Date(date);
    startTime.setMinutes(0);
    startTime.setHours(date.getHours() + 7);
    // Tạo giờ kết thúc bằng cách cộng thêm 1 giờ
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
  };

  // Generate time slots for the selected date
  const generateTimeSlots = (date: Date) => {
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

  const handleTimeSlotSelect = (time: string) => {
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
  };

  const handleCloseSuggestionDialog = () => {
    setOpenSuggestionDialog(false);
    setSuggestedDate(null);
    setSelectedTimeSlot(null);
  };

  const handleMoreEventsClick = (
    e: React.MouseEvent,
    day: Date,
    events: CalendarEvent[]
  ) => {
    e.stopPropagation();
    setSelectedDayEvents({ date: day, events });
    setOpenAllEventsDialog(true);
  };

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
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "stretch", sm: "center" },
          justifyContent: "space-between",
          gap: { xs: 1, sm: 2 },
          mb: { xs: 1, sm: 2, md: 3 },
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 0.5, sm: 1 },
            flexWrap: { xs: "wrap", sm: "nowrap" },
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: "1.125rem", sm: "1.25rem", md: "1.5rem" },
              minWidth: { xs: "100px", sm: "auto" },
            }}
          >
            {format(currentDate, isMobile ? "MMM yyyy" : "MMMM yyyy")}
          </Typography>
          <Box sx={{ display: "flex", gap: 0.5 }}>
            <IconButton
              onClick={handlePrevious}
              size={isMobile ? "small" : "medium"}
              sx={{ color: "primary.main" }}
            >
              <ChevronLeft />
            </IconButton>
            <IconButton
              onClick={handleNext}
              size={isMobile ? "small" : "medium"}
              sx={{ color: "primary.main" }}
            >
              <ChevronRight />
            </IconButton>
          </Box>
          <Button
            variant="contained"
            color="primary"
            size={isMobile ? "small" : "medium"}
            onClick={() => {
              setOpenCreateDialog(true);
              setNewEvent({
                title: "",
                startTime: "",
                endTime: "",
                type: "appointment",
                location: "",
                description: "",
                isRecurring: false,
              });
            }}
            sx={{ ml: { xs: 0, sm: 2 } }}
          >
            Tạo sự kiện
          </Button>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 0.5, sm: 1 },
            flexWrap: "wrap",
            justifyContent: { xs: "flex-start", sm: "flex-end" },
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
            sx={{
              display: { xs: "block", sm: "none" },
              minWidth: 100,
              height: 32,
            }}
          >
            <MenuItem value="day">Day</MenuItem>
            <MenuItem value="week">Week</MenuItem>
            <MenuItem value="month">Month</MenuItem>
          </Select>
        </Box>
      </Box>

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
        {view === "month" && renderMonthView()}
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

      <Dialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Tạo sự kiện mới</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Tiêu đề"
              fullWidth
              value={newEvent.title}
              onChange={(e) =>
                setNewEvent({ ...newEvent, title: e.target.value })
              }
            />
            <TextField
              label="Thời gian bắt đầu"
              type="datetime-local"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={newEvent.startTime}
              onChange={(e) =>
                setNewEvent({ ...newEvent, startTime: e.target.value })
              }
            />
            <TextField
              label="Thời gian kết thúc"
              type="datetime-local"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={newEvent.endTime}
              onChange={(e) =>
                setNewEvent({ ...newEvent, endTime: e.target.value })
              }
            />
            <FormControl fullWidth>
              <InputLabel>Loại</InputLabel>
              <Select
                value={newEvent.type}
                label="Loại"
                onChange={(e) =>
                  setNewEvent({ ...newEvent, type: e.target.value as any })
                }
              >
                <MenuItem value="appointment">Cuộc hẹn</MenuItem>
                <MenuItem value="webinar">Webinar</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Địa điểm"
              fullWidth
              value={newEvent.location}
              onChange={(e) =>
                setNewEvent({ ...newEvent, location: e.target.value })
              }
            />
            <TextField
              label="Mô tả"
              fullWidth
              multiline
              minRows={2}
              value={newEvent.description}
              onChange={(e) =>
                setNewEvent({ ...newEvent, description: e.target.value })
              }
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!newEvent.isRecurring}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, isRecurring: e.target.checked })
                  }
                />
              }
              label="Lặp lại"
            />
            {newEvent.isRecurring && (
              <Box
                sx={{ pl: 2, display: "flex", flexDirection: "column", gap: 2 }}
              >
                <FormControl fullWidth>
                  <InputLabel>Tần suất</InputLabel>
                  <Select
                    value={recurringPattern.frequency}
                    label="Tần suất"
                    onChange={(e) =>
                      setRecurringPattern({
                        ...recurringPattern,
                        frequency: e.target.value as any,
                      })
                    }
                  >
                    <MenuItem value="DAY">Hàng ngày</MenuItem>
                    <MenuItem value="WEEK">Hàng tuần</MenuItem>
                    <MenuItem value="MONTH">Hàng tháng</MenuItem>
                    <MenuItem value="YEAR">Hàng năm</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Khoảng cách lặp (số)"
                  type="number"
                  fullWidth
                  value={recurringPattern.interval}
                  onChange={(e) =>
                    setRecurringPattern({
                      ...recurringPattern,
                      interval: Number(e.target.value),
                    })
                  }
                  inputProps={{ min: 1 }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={useEndDate}
                      onChange={(e) => setUseEndDate(e.target.checked)}
                    />
                  }
                  label="Kết thúc theo ngày"
                />
                {useEndDate ? (
                  <TextField
                    label="Ngày kết thúc"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={recurringPattern.endDate || ""}
                    onChange={(e) =>
                      setRecurringPattern({
                        ...recurringPattern,
                        endDate: e.target.value,
                      })
                    }
                  />
                ) : (
                  <TextField
                    label="Số lần lặp"
                    type="number"
                    fullWidth
                    value={recurringPattern.occurrences || ""}
                    onChange={(e) =>
                      setRecurringPattern({
                        ...recurringPattern,
                        occurrences: Number(e.target.value),
                      })
                    }
                    inputProps={{ min: 1 }}
                  />
                )}
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleCreateEvent}>
            Tạo
          </Button>
        </DialogActions>
      </Dialog>

      {/* Time Suggestion Dialog */}
      <Dialog
        open={openSuggestionDialog}
        onClose={handleCloseSuggestionDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          Select Time
          {suggestedDate && (
            <Typography variant="subtitle1" color="text.secondary">
              {format(suggestedDate, "MMMM d, yyyy")}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent dividers>
          <List sx={{ pt: 0 }}>
            {suggestedDate &&
              generateTimeSlots(suggestedDate).map((slot) => (
                <ListItem disablePadding key={slot.time}>
                  <ListItemButton
                    onClick={() => handleTimeSlotSelect(slot.time)}
                    selected={selectedTimeSlot === slot.time}
                  >
                    <ListItemText primary={slot.label} />
                  </ListItemButton>
                </ListItem>
              ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSuggestionDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>

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
};

export default MainCalendar;
