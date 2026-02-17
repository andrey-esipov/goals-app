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
