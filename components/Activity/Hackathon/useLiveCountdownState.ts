import { TableCellValue } from 'mobx-lark';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { CountdownWindow, firstTextOf, resolveCountdownState, timeOf } from './utility';

export const useLiveCountdownState = <T extends CountdownWindow>(
  items: T[],
  startTime?: TableCellValue,
  endTime?: TableCellValue,
) => {
  const [referenceTime, setReferenceTime] = useState<number | null>(null);
  const refreshReferenceTime = useCallback(() => setReferenceTime(Date.now()), []);

  useEffect(() => refreshReferenceTime(), [refreshReferenceTime]);

  const countdownState = useMemo(
    () =>
      referenceTime === null
        ? {
            nextItem: undefined as T | undefined,
            countdownTo: firstTextOf(startTime) || firstTextOf(endTime) || undefined,
          }
        : resolveCountdownState(items, referenceTime, startTime, endTime),
    [endTime, items, referenceTime, startTime],
  );

  useEffect(() => {
    if (referenceTime === null) return;

    const targetTime = timeOf(countdownState.countdownTo);

    if (!Number.isFinite(targetTime)) return;

    const delay = Math.min(2_147_483_647, Math.max(1000, targetTime - Date.now() + 1000));
    const timer = window.setTimeout(
      refreshReferenceTime,
      delay,
    );

    return () => window.clearTimeout(timer);
  }, [countdownState.countdownTo, referenceTime, refreshReferenceTime]);

  return countdownState;
};
