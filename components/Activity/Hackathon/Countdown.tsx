import { computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import { ObservedComponent, reaction } from 'mobx-react-helper';

import styles from './Hero.module.less';

export interface CountdownProps {
  countdownTo?: string;
  unitLabels: string[];
}

@observer
export class Countdown extends ObservedComponent<CountdownProps> {
  @observable
  accessor rest: number | null = null;

  private timer?: number;

  private get target() {
    const { countdownTo } = this.observedProps;
    const value = countdownTo ? new Date(countdownTo).getTime() : NaN;

    return Number.isFinite(value) ? value : NaN;
  }

  @computed
  get sections() {
    const { rest } = this;

    if (rest === null) return ['--', '--', '--', '--'];

    const totalSeconds = Math.floor(Math.max(0, rest) / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [days, hours, minutes, seconds].map(value => String(value).padStart(2, '0'));
  }

  tick = () => {
    this.rest = Math.max(0, this.target - Date.now());
  };

  @reaction((_this: Countdown) => _this.observedProps.countdownTo)
  componentDidMount() {
    super.componentDidMount();

    if (this.timer) {
      window.clearInterval(this.timer);
      this.timer = undefined;
    }

    this.tick();
    this.timer = window.setInterval(this.tick, 1000);
  }

  componentWillUnmount() {
    super.componentWillUnmount();

    if (this.timer) window.clearInterval(this.timer);
  }

  render() {
    const { unitLabels } = this.observedProps;
    const { sections } = this;

    return (
      <ol className={`list-unstyled ${styles.countdownGrid} m-0`}>
        {sections.map((value, index) => (
          <li
            key={`${index}-${unitLabels[index]}`}
            className={`${styles.countdownCell} d-flex flex-column justify-content-center align-items-center`}
          >
            <strong>{value}</strong>
            <span>{unitLabels[index]}</span>
          </li>
        ))}
      </ol>
    );
  }
}
