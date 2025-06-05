import React from "react";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Button,
  IconButton,
} from "@mui/material";
import { VideoCall, ChevronRight } from "@mui/icons-material";
import { format } from "date-fns";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { CalendarEvent } from "../types/calendar";
import { setExpandedEvent } from "../store/calendarSlice";
import EventListDialog from "./EventListDialog";

const UpcomingEvents: React.FC = () => {
  const [openAllEventsDialog, setOpenAllEventsDialog] = React.useState(false);
  const dispatch = useDispatch();

  const selectedDate = useSelector(
    (state: RootState) => state.calendar.selectedDate
  );
  const events = useSelector((state: RootState) =>
    state.calendar.events.filter((event) =>
      event.startTime.startsWith(selectedDate)
    )
  );

  const handleEventClick = (eventId: string) => {
    dispatch(setExpandedEvent(eventId));
  };

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
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            {event.type === "appointment" && event.clientAvatar && (
              <Avatar
                src={event.clientAvatar}
                sx={{
                  width: 24,
                  height: 24,
                  mr: 1,
                  border: "2px solid",
                  borderColor: "common.white",
                }}
              />
            )}
            {event.type === "webinar" && (
              <VideoCall
                sx={{
                  mr: 1,
                  width: 24,
                  height: 24,
                  color: "calendar.darkOrange",
                }}
              />
            )}
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                fontSize: "0.9rem",
                lineHeight: 1.2,
              }}
            >
              {event.title}
            </Typography>
          </Box>
          <Typography
            variant="caption"
            sx={{
              display: "block",
              mb: 1,
              opacity: 0.9,
            }}
          >
            {formatTime(event.startTime)} - {formatTime(event.endTime)} GMT+8
          </Typography>
        </Box>
        {event.type === "appointment" && (
          <IconButton
            size="small"
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.1)",
              color: "common.white",
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.2)",
              },
            }}
          >
            <VideoCall fontSize="small" />
          </IconButton>
        )}
      </Box>

      {event.type === "appointment" && event.clientName && (
        <Button
          variant="text"
          size="small"
          sx={{
            color: "common.white",
            textTransform: "none",
            fontSize: "0.75rem",
            p: 0,
            "&:hover": {
              bgcolor: "transparent",
              textDecoration: "underline",
            },
          }}
        >
          View Client Profile
        </Button>
      )}
    </Paper>
  );

  return (
    <Box sx={{ mt: 2, height: "50%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{
              color: "primary.main",
              fontWeight: 600,
              mb: 0.5,
            }}
          >
            Upcoming Events
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              display: "block",
            }}
          >
            Today, {format(new Date(selectedDate), "d MMM")}
          </Typography>
        </Box>
        <Button
          endIcon={<ChevronRight />}
          onClick={() => setOpenAllEventsDialog(true)}
          sx={{
            color: "primary.main",
            textTransform: "none",
            "&:hover": {
              bgcolor: "rgba(86, 132, 174, 0.1)",
            },
          }}
        >
          View All
        </Button>
      </Box>

      <Box
        sx={{
          height: "calc(100% - 50px)",
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#888",
            borderRadius: "4px",
            "&:hover": {
              background: "#555",
            },
          },
        }}
      >
        {events.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            sx={{ py: 4 }}
          >
            No events scheduled for today
          </Typography>
        ) : (
          events.map((event) => <EventCard key={event.id} event={event} />)
        )}
      </Box>

      <EventListDialog
        open={openAllEventsDialog}
        onClose={() => setOpenAllEventsDialog(false)}
        date={new Date(selectedDate)}
        events={events}
        onEventClick={handleEventClick}
      />
    </Box>
  );
};

export default UpcomingEvents;
