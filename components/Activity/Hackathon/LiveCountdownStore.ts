import { computed, observable } from 'mobx';
import { TableCellValue } from 'mobx-lark';

import { CountdownWindow, firstTextOf, resolveCountdownState, timeOf } from './utility';

// Maximum safe delay for setTimeout (max 32-bit signed integer in ms)
const MAX_TIMEOUT_DELAY = 2_147_483_647;

export class LiveCountdownStore<T extends CountdownWindow> {
  constructor(
    readonly items: T[],
    readonly startTime?: TableCellValue,
    readonly endTime?: TableCellValue,
  ) {}

  @observable
  accessor referenceTime: number | null = null;

  @computed
  get countdownState() {
    const { referenceTime, items, startTime, endTime } = this;

    return referenceTime === null
      ? {
          nextItem: undefined as T | undefined,
          countdownTo: firstTextOf(startTime) || firstTextOf(endTime) || undefined,
        }
      : resolveCountdownState(items, referenceTime, startTime, endTime);
  }

  private timer?: number;

  tick = () => {
    this.referenceTime = Date.now();

    const targetTime = timeOf(this.countdownState.countdownTo);

    if (!Number.isFinite(targetTime)) return;

    const delay = Math.min(MAX_TIMEOUT_DELAY, Math.max(1000, targetTime - Date.now() + 1000));

    this.timer = window.setTimeout(this.tick, delay);
  };

  dispose() {
    window.clearTimeout(this.timer);
  }
}
