import React from "react";
import { Box, Typography, Paper, useTheme, useMediaQuery } from "@mui/material";
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  parseISO,
  isSameDay,
  isToday,
  differenceInMinutes,
} from "date-fns";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { CalendarEvent } from "../types/calendar";

interface WeekViewProps {
  currentDate: Date;
  onEventClick: (eventId: string) => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const CURRENT_TIME_INDICATOR_HEIGHT = 2;

const WeekView: React.FC<WeekViewProps> = ({ currentDate, onEventClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const events = useSelector((state: RootState) => state.calendar.events);
  const filter = useSelector((state: RootState) => state.calendar.filter);
  const [now, setNow] = React.useState(new Date());

  // Update current time every minute
  React.useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const weekDays = React.useMemo(() => {
    const start = startOfWeek(currentDate);
    const end = endOfWeek(currentDate);
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const getEventsForDateAndHour = (
    date: Date,
    hour: number
  ): CalendarEvent[] => {
    return events.filter((event) => {
      const eventDate = parseISO(event.startTime);
      const eventHour = eventDate.getHours();
      const matchesFilter = filter === "all" || event.type === filter;
      return matchesFilter && isSameDay(eventDate, date) && eventHour === hour;
    });
  };

  const calculateEventPosition = (event: CalendarEvent) => {
    const startTime = parseISO(event.startTime);
    const endTime = parseISO(event.endTime);
    const duration = differenceInMinutes(endTime, startTime);
    const height = (duration / 60) * 48; // 48px per hour (Google Calendar-like)
    const topOffset = (startTime.getMinutes() / 60) * 48;

    return {
      height: Math.max(height - 1, 20), // Minimum height of 20px
      top: topOffset,
    };
  };

  const currentTimeIndicatorPosition = React.useMemo(() => {
    const minutes = now.getHours() * 60 + now.getMinutes();
    return (minutes / 60) * 48;
  }, [now]);

  return (
    <Box sx={{ height: "100%", overflow: "auto" }}>
      <Box sx={{ display: "flex", minHeight: 1152 }}>
        {" "}
        {/* 48px * 24 hours */}
        {/* Time column */}
        <Box
          sx={{
            width: { xs: 46, sm: 56 },
            borderRight: "1px solid",
            borderColor: "divider",
            position: "sticky",
            left: 0,
            bgcolor: "background.paper",
            zIndex: 1,
          }}
        >
          {/* Empty cell for header alignment */}
          <Box
            sx={{
              height: 50,
              borderBottom: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
            }}
          />
          {HOURS.map((hour) => (
            <Box
              key={hour}
              sx={{
                height: 48,
                borderBottom: "1px solid",
                borderColor: "divider",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "flex-end",
                pr: 1,
                pt: 0.5,
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  fontSize: { xs: "0.65rem", sm: "0.7rem" },
                }}
              >
                {hour === 0
                  ? "12 AM"
                  : hour === 12
                  ? "12 PM"
                  : hour > 12
                  ? `${hour - 12} PM`
                  : `${hour} AM`}
              </Typography>
            </Box>
          ))}
        </Box>
        {/* Days columns */}
        <Box sx={{ display: "flex", flex: 1 }}>
          {weekDays.map((day) => (
            <Box
              key={day.toString()}
              sx={{
                flex: 1,
                borderRight: "1px solid",
                borderColor: "divider",
                minWidth: { xs: 100, sm: 120 },
                position: "relative",
              }}
            >
              {/* Day header */}
              <Box
                sx={{
                  height: 50,
                  p: 1,
                  textAlign: "center",
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  position: "sticky",
                  top: 0,
                  bgcolor: "background.paper",
                  zIndex: 2,
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    color: isToday(day) ? "primary.main" : "text.secondary",
                    fontSize: { xs: "0.7rem", sm: "0.75rem" },
                    fontWeight: 500,
                    mb: 0.5,
                  }}
                >
                  {format(day, isMobile ? "EEE" : "EEE")}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: isToday(day) ? 500 : 400,
                    color: isToday(day) ? "primary.main" : "text.primary",
                    fontSize: { xs: "1.1rem", sm: "1.25rem" },
                  }}
                >
                  {format(day, "d")}
                </Typography>
              </Box>

              {/* Current time indicator */}
              {isToday(day) && (
                <Box
                  sx={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: currentTimeIndicatorPosition,
                    zIndex: 3,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: theme.palette.error.main,
                      position: "absolute",
                      left: -4,
                      transform: "translateY(-50%)",
                    }}
                  />
                  <Box
                    sx={{
                      flex: 1,
                      height: CURRENT_TIME_INDICATOR_HEIGHT,
                      bgcolor: theme.palette.error.main,
                    }}
                  />
                </Box>
              )}

              {/* Hour cells */}
              {HOURS.map((hour) => {
                const cellEvents = getEventsForDateAndHour(day, hour);
                return (
                  <Box
                    key={hour}
                    sx={{
                      height: 48,
                      borderBottom: "1px solid",
                      borderColor: "divider",
                      position: "relative",
                      "&:hover": {
                        bgcolor: "rgba(0,0,0,0.02)",
                      },
                    }}
                  >
                    {/* Half-hour marker */}
                    <Box
                      sx={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: "50%",
                        borderBottom: "1px solid",
                        borderColor: "rgba(0,0,0,0.05)",
                      }}
                    />

                    {cellEvents.map((event) => {
                      const { height, top } = calculateEventPosition(event);
                      return (
                        <Paper
                          key={event.id}
                          onClick={() => onEventClick(event.id)}
                          sx={{
                            position: "absolute",
                            top: `${top}px`,
                            left: "1px",
                            right: "1px",
                            height: `${height}px`,
                            bgcolor:
                              event.type === "appointment"
                                ? "rgba(3, 155, 229, 0.9)" // Google Calendar blue
                                : "rgba(251, 140, 0, 0.9)", // Google Calendar orange
                            color: "#fff",
                            p: 0.75,
                            cursor: "pointer",
                            overflow: "hidden",
                            transition: "all 0.1s ease",
                            borderRadius: "3px",
                            border: "1px solid",
                            borderColor:
                              event.type === "appointment"
                                ? "rgba(3, 155, 229, 1)"
                                : "rgba(251, 140, 0, 1)",
                            "&:hover": {
                              boxShadow:
                                "0 1px 3px 0 rgba(60,64,67,0.302), 0 4px 8px 3px rgba(60,64,67,0.149)",
                              transform: "scale(1.002)",
                              zIndex: 2,
                            },
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 500,
                              fontSize: { xs: "0.65rem", sm: "0.7rem" },
                              lineHeight: 1.2,
                            }}
                          >
                            {format(parseISO(event.startTime), "HH:mm")}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              fontSize: { xs: "0.7rem", sm: "0.75rem" },
                              fontWeight: 500,
                              lineHeight: 1.2,
                            }}
                          >
                            {event.title}
                          </Typography>
                          {height > 40 && event.location && !isMobile && (
                            <Typography
                              variant="caption"
                              sx={{
                                display: "block",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                opacity: 0.9,
                                mt: 0.25,
                                fontSize: "0.65rem",
                                lineHeight: 1.2,
                              }}
                            >
                              {event.location}
                            </Typography>
                          )}
                        </Paper>
                      );
                    })}
                  </Box>
                );
              })}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default WeekView;
