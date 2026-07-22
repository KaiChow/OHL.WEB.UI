export const formatLocalMinute = (value = new Date()) => {
  const localValue = new Date(value.getTime() - value.getTimezoneOffset() * 60_000);
  return localValue.toISOString().slice(0, 16).replace('T', ' ');
};
