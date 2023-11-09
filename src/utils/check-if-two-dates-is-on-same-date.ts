import dayjs from "dayjs";

export function CheckIfTwoDatesIsOnSameDay(date1: Date, date2: Date) {
  const startOfDay = dayjs(date1).startOf("date");
  const endOfDay = dayjs(date1).endOf("date");
  const dateToCheck = dayjs(date2);
  const isOnSameDate =
    dateToCheck.isAfter(startOfDay) && dateToCheck.isBefore(endOfDay);

  return isOnSameDate;
}
