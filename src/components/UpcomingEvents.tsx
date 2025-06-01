import React from "react";
import { Box, Typography, Paper, Avatar, Button } from "@mui/material";
import { VideoCall } from "@mui/icons-material";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { CalendarEvent } from "../types/calendar";

const UpcomingEvents: React.FC = () => {
  const selectedDate = useSelector(
    (state: RootState) => state.calendar.selectedDate
  );
  const events = useSelector((state: RootState) =>
    state.calendar.events.filter((event) =>
      event.startTime.startsWith(selectedDate)
    )
  );

  const formatTime = (time: string) => {
    return format(new Date(time), "h:mm a");
  };

  const EventCard: React.FC<{ event: CalendarEvent }> = ({ event }) => (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 2,
        bgcolor:
          event.type === "appointment"
            ? "calendar.lightBlue"
            : "calendar.lightOrange",
        color: event.type === "appointment" ? "common.white" : "text.primary",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        {event.type === "appointment" && event.clientAvatar && (
          <Avatar
            src={event.clientAvatar}
            sx={{ width: 32, height: 32, mr: 1 }}
          />
        )}
        {event.type === "webinar" && <VideoCall sx={{ mr: 1 }} />}
        <Typography variant="subtitle1" fontWeight="medium">
          {event.title}
        </Typography>
      </Box>

      <Typography variant="body2" sx={{ mb: 1 }}>
        {formatTime(event.startTime)} - {formatTime(event.endTime)}
      </Typography>

      {event.type === "appointment" && event.clientName && (
        <Button
          variant="outlined"
          size="small"
          sx={{
            color: "common.white",
            borderColor: "common.white",
            "&:hover": {
              borderColor: "common.white",
              bgcolor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          View Client Profile
        </Button>
      )}
    </Paper>
  );

  return (
    <Box sx={{ mt: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h6">Upcoming Events</Typography>
        <Button color="primary" size="small">
          View All
        </Button>
      </Box>

      {events.length === 0 ? (
        <Typography variant="body2" color="text.secondary" textAlign="center">
          No events scheduled for today
        </Typography>
      ) : (
        events.map((event) => <EventCard key={event.id} event={event} />)
      )}
    </Box>
  );
};

export default UpcomingEvents;
