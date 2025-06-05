import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useCallback, useMemo } from "react";
import { CalendarEvent } from "../types/calendar";
interface CreateEventDialogProps {
  open: boolean;
  onClose: () => void;
  newEvent: Partial<CalendarEvent>;
  setNewEvent: React.Dispatch<React.SetStateAction<Partial<CalendarEvent>>>;
  recurringPattern: {
    frequency: "DAY" | "WEEK" | "MONTH" | "YEAR";
    interval: number;
    endDate?: string;
    occurrences?: number;
  };
  setRecurringPattern: React.Dispatch<
    React.SetStateAction<{
      frequency: "DAY" | "WEEK" | "MONTH" | "YEAR";
      interval: number;
      endDate?: string;
      occurrences?: number;
    }>
  >;
  useEndDate: boolean;
  setUseEndDate: React.Dispatch<React.SetStateAction<boolean>>;
  onCreateEvent: () => void;
}
const CreateEventDialog: React.FC<CreateEventDialogProps> = React.memo(
  ({
    open,
    onClose,
    newEvent,
    setNewEvent,
    recurringPattern,
    setRecurringPattern,
    useEndDate,
    setUseEndDate,
    onCreateEvent,
  }) => {
    const handleTitleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewEvent((prev) => ({ ...prev, title: e.target.value }));
      },
      [setNewEvent]
    );
    const handleStartTimeChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewEvent((prev) => ({ ...prev, startTime: e.target.value }));
      },
      [setNewEvent]
    );
    const handleEndTimeChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewEvent((prev) => ({ ...prev, endTime: e.target.value }));
      },
      [setNewEvent]
    );
    const handleTypeChange = useCallback(
      (e: any) => {
        setNewEvent((prev) => ({ ...prev, type: e.target.value }));
      },
      [setNewEvent]
    );
    const handleLocationChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewEvent((prev) => ({ ...prev, location: e.target.value }));
      },
      [setNewEvent]
    );
    const handleDescriptionChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewEvent((prev) => ({ ...prev, description: e.target.value }));
      },
      [setNewEvent]
    );
    const handleRecurringChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewEvent((prev) => ({ ...prev, isRecurring: e.target.checked }));
      },
      [setNewEvent]
    );
    const handleFrequencyChange = useCallback(
      (e: any) => {
        setRecurringPattern((prev) => ({ ...prev, frequency: e.target.value }));
      },
      [setRecurringPattern]
    );
    const handleIntervalChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setRecurringPattern((prev) => ({
          ...prev,
          interval: Number(e.target.value),
        }));
      },
      [setRecurringPattern]
    );
    const handleEndDateToggle = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setUseEndDate(e.target.checked);
      },
      [setUseEndDate]
    );
    const handleEndDateChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setRecurringPattern((prev) => ({ ...prev, endDate: e.target.value }));
      },
      [setRecurringPattern]
    );
    const handleOccurrencesChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setRecurringPattern((prev) => ({
          ...prev,
          occurrences: Number(e.target.value),
        }));
      },
      [setRecurringPattern]
    );
    const basicEventFields = useMemo(
      () => (
        <>
          <TextField
            label="Tiêu đề"
            fullWidth
            value={newEvent.title || ""}
            onChange={handleTitleChange}
          />
          <TextField
            label="Thời gian bắt đầu"
            type="datetime-local"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={newEvent.startTime || ""}
            onChange={handleStartTimeChange}
          />
          <TextField
            label="Thời gian kết thúc"
            type="datetime-local"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={newEvent.endTime || ""}
            onChange={handleEndTimeChange}
          />
          <FormControl fullWidth>
            <InputLabel>Loại</InputLabel>
            <Select
              value={newEvent.type || "appointment"}
              label="Loại"
              onChange={handleTypeChange}
            >
              <MenuItem value="appointment">Cuộc hẹn</MenuItem>
              <MenuItem value="webinar">Webinar</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Địa điểm"
            fullWidth
            value={newEvent.location || ""}
            onChange={handleLocationChange}
          />
          <TextField
            label="Mô tả"
            fullWidth
            multiline
            minRows={2}
            value={newEvent.description || ""}
            onChange={handleDescriptionChange}
          />
        </>
      ),
      [
        newEvent.title,
        newEvent.startTime,
        newEvent.endTime,
        newEvent.type,
        newEvent.location,
        newEvent.description,
        handleTitleChange,
        handleStartTimeChange,
        handleEndTimeChange,
        handleTypeChange,
        handleLocationChange,
        handleDescriptionChange,
      ]
    );
    const recurringPatternFields = useMemo(() => {
      if (!newEvent.isRecurring) return null;
      return (
        <Box sx={{ pl: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Tần suất</InputLabel>
            <Select
              value={recurringPattern.frequency}
              label="Tần suất"
              onChange={handleFrequencyChange}
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
            onChange={handleIntervalChange}
            inputProps={{ min: 1 }}
          />
          <FormControlLabel
            control={
              <Checkbox checked={useEndDate} onChange={handleEndDateToggle} />
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
              onChange={handleEndDateChange}
            />
          ) : (
            <TextField
              label="Số lần lặp"
              type="number"
              fullWidth
              value={recurringPattern.occurrences || ""}
              onChange={handleOccurrencesChange}
              inputProps={{ min: 1 }}
            />
          )}
        </Box>
      );
    }, [
      newEvent.isRecurring,
      recurringPattern.frequency,
      recurringPattern.interval,
      recurringPattern.endDate,
      recurringPattern.occurrences,
      useEndDate,
      handleFrequencyChange,
      handleIntervalChange,
      handleEndDateToggle,
      handleEndDateChange,
      handleOccurrencesChange,
    ]);
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Tạo sự kiện mới</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 2 }}
          >
            {basicEventFields}
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!newEvent.isRecurring}
                  onChange={handleRecurringChange}
                />
              }
              label="Lặp lại"
            />
            {recurringPatternFields}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Hủy</Button>
          <Button variant="contained" onClick={onCreateEvent}>
            Tạo
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
);
CreateEventDialog.displayName = "CreateEventDialog";
export default CreateEventDialog;
