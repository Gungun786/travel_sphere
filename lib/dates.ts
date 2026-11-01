export function dayOfYear(isoDate: string): number {
  const [year, month, day] = isoDate.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  const startOfYear = new Date(Date.UTC(year, 0, 1));
  return Math.floor((date.getTime() - startOfYear.getTime()) / 86400000) + 1;
}

function splitRange(start: number, end: number): [number, number][] {
  return end < start
    ? [[start, 366], [1, end]]
    : [[start, end]];
}

export function rangesOverlap(
  startA: number,
  endA: number,
  startB: number,
  endB: number
): boolean {
  return splitRange(startA, endA).some(([rangeStartA, rangeEndA]) =>
    splitRange(startB, endB).some(
      ([rangeStartB, rangeEndB]) =>
        rangeStartA <= rangeEndB && rangeStartB <= rangeEndA
    )
  );
}
