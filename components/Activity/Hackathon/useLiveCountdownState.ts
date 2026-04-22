import { TableCellValue } from 'mobx-lark';
import { useEffect, useEffectEvent, useMemo, useState } from 'react';

import { CountdownWindow, firstTextOf, resolveCountdownState, timeOf } from './utility';

export const useLiveCountdownState = <T extends CountdownWindow>(
  items: T[],
  startTime?: TableCellValue,
  endTime?: TableCellValue,
) => {
  const [referenceTime, setReferenceTime] = useState<number | null>(null);
  const refreshReferenceTime = useEffectEvent(() => setReferenceTime(Date.now()));

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

    const timer = window.setTimeout(
      refreshReferenceTime,
      Math.max(1000, targetTime - Date.now() + 1000),
    );

    return () => window.clearTimeout(timer);
  }, [countdownState.countdownTo, referenceTime, refreshReferenceTime]);

  return countdownState;
};
