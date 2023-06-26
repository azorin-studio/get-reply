import { addMilliseconds, parseISO } from "date-fns"

export default function calculateRunDate(delay: number, delayUnit: string, logDate: string) {
  let msDelay = delay * 1000 * 60 * 60 * 24
  if (delayUnit === 'hours') {
    msDelay = delay * 1000 * 60 * 60
  }
  if (delayUnit === 'minutes') {
    msDelay = delay * 1000 * 60
  }
  if (delayUnit === 'seconds') {
    msDelay = delay * 1000
  }

  const run_date = addMilliseconds(parseISO(logDate), msDelay)
  return run_date.toISOString()
}