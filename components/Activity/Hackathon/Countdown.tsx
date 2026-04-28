import { computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import { ObservedComponent, reaction } from 'mobx-react-helper';

export interface TimeUnit {
  scale: number;
  label: string;
}

interface TimeSection {
  value: number;
  label: string;
}

export interface CountdownProps {
  className?: string;
  endTime?: string | Date | number;
  onEnd?: () => void;
  units: TimeUnit[];
}

@observer
export class Countdown extends ObservedComponent<CountdownProps> {
  @observable
  accessor rest = 0;

  private timer?: number;

  private get target() {
    const { endTime } = this.observedProps;

    if (!endTime) return NaN;

    const ms =
      typeof endTime === 'number'
        ? endTime
        : endTime instanceof Date
          ? endTime.getTime()
          : new Date(endTime).getTime();

    return Number.isFinite(ms) ? ms : NaN;
  }

  @computed
  get timeSections(): TimeSection[] {
    const { units } = this.observedProps;
    let { rest } = this;

    return units.reduce(
      (list, { label }, index) => {
        const scale = units
          .slice(index)
          .map(({ scale }) => scale)
          .reduce((sum, scale) => sum * scale, 1);

        const value = ~~(rest / scale);
        rest -= value * scale;

        list.push({ value, label });
        return list;
      },
      [] as TimeSection[],
    );
  }

  tick = () => {
    const rest = this.target - Date.now();

    if (rest > 0) {
      this.rest = rest;
    } else {
      this.rest = 0;

      if (this.timer) {
        window.clearInterval(this.timer);
        this.timer = undefined;
        this.props.onEnd?.();
      }
    }
  };

  componentDidMount() {
    super.componentDidMount();
    this.initTimer();
  }

  @reaction((_this: Countdown) => _this.observedProps.endTime)
  initTimer() {
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
    const { className } = this.props;
    const { timeSections } = this;

    return (
      <ol className={`list-unstyled${className ? ` ${className}` : ''} m-0`}>
        {timeSections.map(({ value, label }, index) => (
          <li
            key={`${index}-${label}`}
            className="d-flex flex-column justify-content-center align-items-center"
          >
            <strong>{String(value).padStart(2, '0')}</strong>
            <span>{label}</span>
          </li>
        ))}
      </ol>
    );
  }
}
