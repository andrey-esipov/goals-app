const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function formatDateInput(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function formatShortDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function parseDateInput(value?: string | null) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

export function startOfWeek(date: Date, weekStartsOn: 0 | 1 = 1) {
  const utcDate = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
  const day = utcDate.getUTCDay();
  const diff = (day - weekStartsOn + 7) % 7;
  utcDate.setUTCDate(utcDate.getUTCDate() - diff);
  return utcDate;
}

export function differenceInDays(start: Date, end: Date) {
  const startUtc = Date.UTC(
    start.getUTCFullYear(),
    start.getUTCMonth(),
    start.getUTCDate(),
  );
  const endUtc = Date.UTC(
    end.getUTCFullYear(),
    end.getUTCMonth(),
    end.getUTCDate(),
  );

  return Math.floor((endUtc - startUtc) / MS_PER_DAY);
}
