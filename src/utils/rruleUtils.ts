import { RRule, Frequency, Weekday } from "rrule";
import { CalendarEvent } from "../types/calendar";
import { parseISO, format, addMinutes, differenceInMinutes } from "date-fns";

/**
 * Convert legacy recurring pattern to RRule string
 */
export const convertLegacyToRRule = (
  event: CalendarEvent,
  startDate: Date
): string => {
  if (!event.recurringPattern) return "";

  const {
    frequency,
    interval,
    endDate,
    occurrences,
    byweekday,
    bymonth,
    bymonthday,
    bysetpos,
  } = event.recurringPattern;

  // Map frequency to RRule frequency
  const frequencyMap: Record<string, Frequency> = {
    DAY: RRule.DAILY,
    WEEK: RRule.WEEKLY,
    MONTH: RRule.MONTHLY,
    YEAR: RRule.YEARLY,
  };

  const options: any = {
    freq: frequencyMap[frequency],
    interval: interval,
    dtstart: startDate,
  };

  // Add end condition
  if (endDate) {
    options.until = parseISO(endDate);
  } else if (occurrences) {
    options.count = occurrences;
  }

  // Add advanced options
  if (byweekday && byweekday.length > 0) {
    options.byweekday = byweekday.map((day) => new Weekday(day));
  }
  if (bymonth && bymonth.length > 0) {
    options.bymonth = bymonth;
  }
  if (bymonthday && bymonthday.length > 0) {
    options.bymonthday = bymonthday;
  }
  if (bysetpos && bysetpos.length > 0) {
    options.bysetpos = bysetpos;
  }

  const rule = new RRule(options);
  return rule.toString();
};

/**
 * Parse RRule string and generate event instances
 */
export const generateRecurringEventsFromRRule = (
  event: CalendarEvent,
  maxDate?: Date
): CalendarEvent[] => {
  if (!event.isRecurring) return [event];

  let ruleString = event.rrule;

  // If no RRule but has legacy pattern, convert it
  if (!ruleString && event.recurringPattern) {
    const startDate = parseISO(event.startTime);
    ruleString = convertLegacyToRRule(event, startDate);
  }

  if (!ruleString) return [event];

  try {
    const rule = RRule.fromString(ruleString);
    const startDate = parseISO(event.startTime);
    const endDate = parseISO(event.endTime);
    const duration = differenceInMinutes(endDate, startDate);

    // Generate occurrences (limit to avoid performance issues)
    const until = maxDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year from now
    const occurrences = rule.between(startDate, until, true);

    return occurrences.map((occurrence, index) => {
      const eventStart = occurrence;
      const eventEnd = addMinutes(eventStart, duration);

      return {
        ...event,
        id: `${event.id}-${format(occurrence, "yyyy-MM-dd-HH-mm")}`,
        startTime: format(eventStart, "yyyy-MM-dd'T'HH:mm:ss"),
        endTime: format(eventEnd, "yyyy-MM-dd'T'HH:mm:ss"),
        // Keep original event data but mark as instance
        originalEventId: event.id,
        isRecurringInstance: true,
      };
    });
  } catch (error) {
    console.error("Error parsing RRule:", error);
    return [event];
  }
};

/**
 * Create RRule from form data
 */
export const createRRuleFromForm = (
  formData: {
    frequency: "DAY" | "WEEK" | "MONTH" | "YEAR";
    interval: number;
    endDate?: string;
    occurrences?: number;
    byweekday?: number[];
    bymonth?: number[];
    bymonthday?: number[];
    bysetpos?: number[];
  },
  startDate: Date
): string => {
  const frequencyMap: Record<string, Frequency> = {
    DAY: RRule.DAILY,
    WEEK: RRule.WEEKLY,
    MONTH: RRule.MONTHLY,
    YEAR: RRule.YEARLY,
  };

  const options: any = {
    freq: frequencyMap[formData.frequency],
    interval: formData.interval,
    dtstart: startDate,
  };

  // Add end condition
  if (formData.endDate) {
    options.until = parseISO(formData.endDate);
  } else if (formData.occurrences) {
    options.count = formData.occurrences;
  }

  // Add advanced options
  if (formData.byweekday && formData.byweekday.length > 0) {
    options.byweekday = formData.byweekday.map((day) => new Weekday(day));
  }
  if (formData.bymonth && formData.bymonth.length > 0) {
    options.bymonth = formData.bymonth;
  }
  if (formData.bymonthday && formData.bymonthday.length > 0) {
    options.bymonthday = formData.bymonthday;
  }
  if (formData.bysetpos && formData.bysetpos.length > 0) {
    options.bysetpos = formData.bysetpos;
  }

  const rule = new RRule(options);
  return rule.toString();
};

/**
 * Parse RRule to human readable text
 */
export const rruleToText = (rruleString: string): string => {
  try {
    const rule = RRule.fromString(rruleString);
    return rule.toText();
  } catch (error) {
    console.error("Error parsing RRule to text:", error);
    return "Invalid recurring pattern";
  }
};

/**
 * Common RRule presets for quick selection
 */
export const RRULE_PRESETS = {
  DAILY: "FREQ=DAILY;INTERVAL=1",
  WEEKLY: "FREQ=WEEKLY;INTERVAL=1",
  MONTHLY: "FREQ=MONTHLY;INTERVAL=1",
  YEARLY: "FREQ=YEARLY;INTERVAL=1",
  WEEKDAYS: "FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR",
  WEEKENDS: "FREQ=WEEKLY;BYDAY=SA,SU",
  MONTHLY_FIRST_MONDAY: "FREQ=MONTHLY;BYDAY=1MO",
  MONTHLY_LAST_DAY: "FREQ=MONTHLY;BYMONTHDAY=-1",
};

/**
 * Validate RRule string
 */
export const validateRRule = (
  rruleString: string
): { valid: boolean; error?: string } => {
  try {
    RRule.fromString(rruleString);
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : "Invalid RRule format",
    };
  }
};
