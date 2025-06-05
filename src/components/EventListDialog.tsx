import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemButton,
  Box,
  Typography,
  Avatar,
} from "@mui/material";
import { VideoCall, LocationOn, AccessTime, Repeat } from "@mui/icons-material";
import { format, parseISO } from "date-fns";
import { CalendarEvent } from "../types/calendar";

interface EventListDialogProps {
  open: boolean;
  onClose: () => void;
  date: Date;
  events: CalendarEvent[];
  onEventClick: (eventId: string) => void;
}

const EventListDialog: React.FC<EventListDialogProps> = ({
  open,
  onClose,
  date,
  events,
  onEventClick,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6">
          Events for {format(date, "MMMM d, yyyy")}
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <List sx={{ pt: 0 }}>
          {events.map((event) => (
            <ListItem
              key={event.id}
              disablePadding
              sx={{
                borderBottom: "1px solid",
                borderColor: "divider",
                "&:last-child": {
                  borderBottom: "none",
                },
              }}
            >
              <ListItemButton
                onClick={() => {
                  onEventClick(event.id);
                  onClose();
                }}
              >
                <Box sx={{ width: "100%" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 0.5,
                    }}
                  >
                    {event.type === "appointment" && event.clientAvatar && (
                      <Avatar
                        src={event.clientAvatar}
                        sx={{
                          width: 24,
                          height: 24,
                          border: "2px solid",
                          borderColor:
                            event.type === "appointment"
                              ? "calendar.lightBlue"
                              : "calendar.lightOrange",
                        }}
                      />
                    )}
                    {event.type === "webinar" && (
                      <VideoCall
                        sx={{ fontSize: 24, color: "calendar.darkOrange" }}
                      />
                    )}
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      {event.title}
                    </Typography>
                    {event.isRecurring && (
                      <Repeat sx={{ fontSize: 16, opacity: 0.8 }} />
                    )}
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <AccessTime
                        sx={{ fontSize: 16, color: "text.secondary" }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {format(parseISO(event.startTime), "HH:mm")} -{" "}
                        {format(parseISO(event.endTime), "HH:mm")}
                      </Typography>
                    </Box>
                    {event.location && (
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <LocationOn
                          sx={{ fontSize: 16, color: "text.secondary" }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {event.location}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventListDialog;
