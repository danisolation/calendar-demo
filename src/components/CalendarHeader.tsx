import React, { useMemo, useCallback } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  ButtonGroup,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  Today,
  ViewDay,
  ViewWeek,
  CalendarViewMonth,
} from "@mui/icons-material";
import { CalendarViewType } from "../types/calendar";
import { formatHeaderDate } from "../utils/calendarUtils";

interface CalendarHeaderProps {
  currentDate: Date;
  view: CalendarViewType;
  onPrevious: () => void;
  onNext: () => void;
  onViewChange: (view: CalendarViewType) => void;
  onCreateEvent: () => void;
  onTodayClick: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = React.memo(
  ({
    currentDate,
    view,
    onPrevious,
    onNext,
    onViewChange,
    onCreateEvent,
    onTodayClick,
  }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    // Memoize formatted date to avoid recalculation
    const formattedDate = useMemo(
      () => formatHeaderDate(currentDate, isMobile),
      [currentDate, isMobile]
    );

    // Memoize view change handlers
    const handleDayView = useCallback(
      () => onViewChange("day"),
      [onViewChange]
    );
    const handleWeekView = useCallback(
      () => onViewChange("week"),
      [onViewChange]
    );
    const handleMonthView = useCallback(
      () => onViewChange("month"),
      [onViewChange]
    );

    // Memoize view selection handler for mobile
    const handleViewSelect = useCallback(
      (e: any) => {
        onViewChange(e.target.value as CalendarViewType);
      },
      [onViewChange]
    );

    // Memoize view buttons to prevent re-renders
    const viewButtons = useMemo(
      () => (
        <ButtonGroup size="small" sx={{ display: { xs: "none", sm: "flex" } }}>
          <Button
            variant={view === "day" ? "contained" : "outlined"}
            onClick={handleDayView}
          >
            <ViewDay />
          </Button>
          <Button
            variant={view === "week" ? "contained" : "outlined"}
            onClick={handleWeekView}
          >
            <ViewWeek />
          </Button>
          <Button
            variant={view === "month" ? "contained" : "outlined"}
            onClick={handleMonthView}
          >
            <CalendarViewMonth />
          </Button>
        </ButtonGroup>
      ),
      [view, handleDayView, handleWeekView, handleMonthView]
    );

    // Memoize mobile view selector
    const mobileViewSelector = useMemo(
      () => (
        <Select
          size="small"
          value={view}
          onChange={handleViewSelect}
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
      ),
      [view, handleViewSelect]
    );

    return (
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
            {formattedDate}
          </Typography>
          <Box sx={{ display: "flex", gap: 0.5 }}>
            <IconButton
              onClick={onPrevious}
              size={isMobile ? "small" : "medium"}
              sx={{ color: "primary.main" }}
            >
              <ChevronLeft />
            </IconButton>
            <IconButton
              onClick={onNext}
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
            onClick={onCreateEvent}
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
            onClick={onTodayClick}
            startIcon={<Today />}
            sx={{ display: { xs: "none", sm: "inline-flex" } }}
          >
            Today
          </Button>
          {viewButtons}
          {mobileViewSelector}
        </Box>
      </Box>
    );
  }
);

CalendarHeader.displayName = "CalendarHeader";

export default CalendarHeader;
