import React from "react";
import { Box, Typography, Paper, IconButton } from "@mui/material";
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
} from "date-fns";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { setSelectedDate } from "../store/calendarSlice";

const MiniCalendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const selectedDate = useSelector(
    (state: RootState) => state.calendar.selectedDate
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

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  return (
    <Paper elevation={0} sx={{ p: 2, bgcolor: "background.default" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h6">{format(currentMonth, "MMM yyyy")}</Typography>
        <Box>
          <IconButton onClick={handlePreviousMonth} size="small">
            <ChevronLeft />
          </IconButton>
          <IconButton onClick={handleNextMonth} size="small">
            <ChevronRight />
          </IconButton>
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 0.5,
        }}
      >
        {weekDays.map((day) => (
          <Typography
            key={day}
            variant="caption"
            sx={{
              textAlign: "center",
              color: "text.secondary",
              fontWeight: "bold",
              fontSize: "0.75rem",
            }}
          >
            {day}
          </Typography>
        ))}

        {days.map((day) => {
          const isSelected = isSameDay(new Date(selectedDate), day);
          const isCurrentMonth = isSameMonth(day, currentMonth);

          return (
            <Box
              key={day.toString()}
              onClick={() => handleDateClick(day)}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 32,
                cursor: "pointer",
                borderRadius: 1,
                bgcolor: isSelected ? "primary.main" : "transparent",
                color: isSelected
                  ? "common.white"
                  : !isCurrentMonth
                  ? "text.disabled"
                  : "text.primary",
                "&:hover": {
                  bgcolor: isSelected ? "primary.dark" : "action.hover",
                },
              }}
            >
              <Typography variant="body2">{format(day, "d")}</Typography>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
};

export default MiniCalendar;
