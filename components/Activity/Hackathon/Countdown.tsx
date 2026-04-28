import { computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import { ObservedComponent, reaction } from 'mobx-react-helper';
import { HTMLAttributes } from 'react';
import { Second, TimeData } from 'web-utility';

export interface TimeUnit {
  scale: number;
  label: string;
}

interface TimeSection {
  value: number;
  label: string;
}

export interface CountdownProps extends HTMLAttributes<HTMLOListElement> {
  units: TimeUnit[];
  endTime: TimeData;
  onEnd?: (endTime: TimeData) => any;
}

@observer
export class Countdown extends ObservedComponent<CountdownProps> {
  @observable
  accessor rest = 0;

  private timer = 0;

  get endTimestamp() {
    return +new Date(this.props.endTime || Date.now());
  }

  @computed
  get timeSections(): TimeSection[] {
    const { units } = this.observedProps;
    let { rest } = this;

    return units.reduce((list, { label }, index) => {
      const scale = units
        .slice(index)
        .map(({ scale }) => scale)
        .reduce((sum, scale) => sum * scale, 1);

      const value = ~~(rest / scale);
      rest -= value * scale;

      list.push({ value, label });
      return list;
    }, [] as TimeSection[]);
  }

  tick = () => {
    const { onEnd, endTime } = this.props,
      rest = this.endTimestamp - Date.now();

    if (rest > 0) {
      this.rest = rest;
    } else {
      this.rest = 0;
      this.stop();
      onEnd?.(endTime);
    }
  };

  stop() {
    if (this.timer) {
      window.clearInterval(this.timer);
      this.timer = 0;
    }
  }

  componentDidMount() {
    super.componentDidMount();
    this.initTimer();
  }

  @reaction(_this => _this.observedProps.endTime)
  initTimer() {
    this.stop();
    this.tick();
    this.timer = window.setInterval(this.tick, Second);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    this.stop();
  }

  render() {
    const { className = '', ...props } = this.props;
    const { timeSections } = this;

    return (
      <ol className={`list-unstyled m-0 ${className}`} {...props}>
        {timeSections.map(({ value, label }) => (
          <li key={label} className="d-flex flex-column justify-content-center align-items-center">
            <strong>{(value + '').padStart(2, '0')}</strong>
            <span>{label}</span>
          </li>
        ))}
      </ol>
    );
  }
}
