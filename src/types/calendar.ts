export type EventType = "appointment" | "webinar";
export type ViewType = "month" | "week" | "day";
export type FilterType = "all" | EventType;

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
  recurringPattern?: {
    frequency: "daily" | "weekly" | "monthly" | "yearly";
    interval: number;
    endDate?: string;
    occurrences?: number;
  };
}

export interface CalendarState {
  events: CalendarEvent[];
  selectedDate: string;
  view: ViewType;
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
