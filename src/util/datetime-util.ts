
import { format } from 'date-fns';

export const DatetimeUtil = {
  getDatetimeStr,
} as const;

export function getDatetimeStr(date: Date) {
  /*
    [02-27-2024] 09:45 PM
    [02-27-2024] 09:49 PM
  */
  return format(date, '[MM-dd-y] HH:mm:ss.SSS');
}
