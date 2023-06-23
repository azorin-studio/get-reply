
export default function daysBetween (first: Date, second: Date): number {
  return Math.round((second.getTime() - first.getTime()) / (1000 * 60 * 60 * 24))
}