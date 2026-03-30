export const getCurrentTimezone = () =>
  Intl.DateTimeFormat().resolvedOptions().timeZone ?? "UTC";

export const formatNotificationLabel = (time: string) => {
  const [hour, minute] = time.split(":").map(Number);
  const d = new Date();
  d.setHours(hour, minute, 0, 0);

  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
};

export const isoNow = () => new Date().toISOString();

