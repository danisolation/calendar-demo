import React, { useMemo, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { format } from "date-fns";
import { generateTimeSlots } from "../utils/calendarUtils";

interface TimeSuggestionDialogProps {
  open: boolean;
  onClose: () => void;
  suggestedDate: Date | null;
  selectedTimeSlot: string | null;
  onTimeSlotSelect: (time: string) => void;
}

const TimeSuggestionDialog: React.FC<TimeSuggestionDialogProps> = React.memo(
  ({ open, onClose, suggestedDate, selectedTimeSlot, onTimeSlotSelect }) => {
    // Memoize formatted date for dialog title
    const formattedDate = useMemo(() => {
      if (!suggestedDate) return null;
      return format(suggestedDate, "MMMM d, yyyy");
    }, [suggestedDate]);

    // Memoize time slots generation
    const timeSlots = useMemo(() => {
      if (!suggestedDate) return [];
      return generateTimeSlots(suggestedDate);
    }, [suggestedDate]);

    // Memoize time slot selection handler
    const handleTimeSlotClick = useCallback(
      (time: string) => {
        onTimeSlotSelect(time);
      },
      [onTimeSlotSelect]
    );

    // Memoize time slot list items
    const timeSlotItems = useMemo(() => {
      return timeSlots.map((slot) => (
        <ListItem disablePadding key={slot.time}>
          <ListItemButton
            onClick={() => handleTimeSlotClick(slot.time)}
            selected={selectedTimeSlot === slot.time}
          >
            <ListItemText primary={slot.label} />
          </ListItemButton>
        </ListItem>
      ));
    }, [timeSlots, selectedTimeSlot, handleTimeSlotClick]);

    // Memoize dialog title content
    const titleContent = useMemo(
      () => (
        <>
          Select Time
          {formattedDate && (
            <Typography variant="subtitle1" color="text.secondary">
              {formattedDate}
            </Typography>
          )}
        </>
      ),
      [formattedDate]
    );

    return (
      <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle>{titleContent}</DialogTitle>
        <DialogContent dividers>
          <List sx={{ pt: 0 }}>{timeSlotItems}</List>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    );
  }
);

TimeSuggestionDialog.displayName = "TimeSuggestionDialog";

export default TimeSuggestionDialog;
