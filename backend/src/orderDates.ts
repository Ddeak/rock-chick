export interface OrderingSettings {
  /** Subset of 'friday' | 'saturday' | 'sunday' — see PICKUP_DAY_OFFSETS_FROM_FRIDAY. */
  pickupDays: string[];
  /** Full lowercase weekday name, e.g. 'tuesday'. */
  cutoffDay: string;
  /** 24-hour "HH:MM", e.g. '12:00'. */
  cutoffTime: string;
  /** Dates (YYYY-MM-DD) excluded from booking regardless of cutoff/capacity. */
  blackoutDates: string[];
}

const DAY_NAME_TO_INDEX: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

// Pickup days are modeled as a single weekly "batch" anchored to Friday —
// this only supports a subset of {friday, saturday, sunday}. Supporting
// arbitrary weekdays would need a different (non-Friday-anchored) design.
const PICKUP_DAY_OFFSETS_FROM_FRIDAY: Record<string, number> = {
  friday: 0,
  saturday: 1,
  sunday: 2,
};

function dayIndexFromName(name: string): number {
  const index = DAY_NAME_TO_INDEX[name.toLowerCase()];
  if (index === undefined) {
    throw new Error(`Unknown day name: ${name}`);
  }
  return index;
}

function parseTime(time: string): { hours: number; minutes: number } {
  const [hoursStr, minutesStr] = time.split(':');
  return { hours: Number(hoursStr), minutes: Number(minutesStr) };
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function startOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

function nextOrSameDayOfWeek(date: Date, targetDayIndex: number): Date {
  const current = startOfDay(date);
  const diff = (targetDayIndex - current.getDay() + 7) % 7;
  return addDays(current, diff);
}

function toDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function getEarliestBookableFriday(now: Date, settings: OrderingSettings): Date {
  const cutoffDayIndex = dayIndexFromName(settings.cutoffDay);
  const { hours, minutes } = parseTime(settings.cutoffTime);
  const daysFromCutoffToFriday = (5 - cutoffDayIndex + 7) % 7;

  let candidateFriday = nextOrSameDayOfWeek(now, 5);

  // Bounded defensively; in practice this only ever advances a week or two.
  for (let i = 0; i < 52; i++) {
    const cutoffMoment = addDays(candidateFriday, -daysFromCutoffToFriday);
    cutoffMoment.setHours(hours, minutes, 0, 0);

    if (now < cutoffMoment) {
      return candidateFriday;
    }
    candidateFriday = addDays(candidateFriday, 7);
  }

  return candidateFriday;
}

export function getBookablePickupDates(
  now: Date,
  settings: OrderingSettings,
  weeksAhead: number,
): string[] {
  const earliestFriday = getEarliestBookableFriday(now, settings);
  const blackoutSet = new Set(settings.blackoutDates);
  const dates: string[] = [];

  for (let week = 0; week < weeksAhead; week++) {
    const friday = addDays(earliestFriday, week * 7);
    for (const day of settings.pickupDays) {
      const offset = PICKUP_DAY_OFFSETS_FROM_FRIDAY[day.toLowerCase()];
      if (offset === undefined) {
        continue;
      }
      const dateStr = toDateString(addDays(friday, offset));
      if (!blackoutSet.has(dateStr)) {
        dates.push(dateStr);
      }
    }
  }

  return dates;
}

export function isPickupDateBookable(
  candidateDateStr: string,
  now: Date,
  settings: OrderingSettings,
  weeksAhead: number,
): boolean {
  return getBookablePickupDates(now, settings, weeksAhead).includes(candidateDateStr);
}

// A weekly-cycle order only ever offers the single upcoming cycle. A
// standing order can target any bookable date reasonably far into the
// future (e.g. a Christmas order placed months ahead) — a year is a
// generous, simple bound rather than an unbounded/configurable window.
export const WEEKLY_WEEKS_AHEAD = 1;
export const STANDING_WEEKS_AHEAD = 52;
