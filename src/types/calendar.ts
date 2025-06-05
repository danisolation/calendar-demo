export type EventType = "appointment" | "webinar";
export type ViewType = "month" | "week" | "day";
export type FilterType = "all" | "appointment" | "webinar";

export type CalendarViewType = "month" | "week" | "day";

export interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  type: EventType;
  description?: string;
  clientName?: string;
  clientAvatar?: string;
  location?: string;
  color?: string;
  isRecurring?: boolean;
  rrule?: string;
  recurringPattern?: {
    frequency: "DAY" | "WEEK" | "MONTH" | "YEAR";
    interval: number;
    endDate?: string;
    occurrences?: number;
    byweekday?: number[];
    bymonth?: number[];
    bymonthday?: number[];
    bysetpos?: number[];
  };
  originalEventId?: string;
  isRecurringInstance?: boolean;
}

export interface CalendarState {
  events: CalendarEvent[];
  selectedDate: string;
  view: CalendarViewType;
  loading: boolean;
  error: string | null;
  filter: FilterType;
  expandedEvent: string | null;
}

export interface CalendarDay {
  date: Date;
  events: CalendarEvent[];
  isToday: boolean;
  isSelected: boolean;
  isCurrentMonth: boolean;
}
