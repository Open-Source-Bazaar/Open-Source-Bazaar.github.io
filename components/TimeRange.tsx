import { Time } from 'idea-react';
import { FC, ReactNode } from 'react';
import { TimeData } from 'web-utility';

const normalizeTimeData = (value?: TimeData | null) =>
  value != null ? (Number.isFinite(+new Date(value)) ? value : undefined) : undefined;

export interface TimeTextProps {
  value?: TimeData | null;
  format?: string;
  fallback?: ReactNode;
}

export const TimeText: FC<TimeTextProps> = ({ value, format = 'YYYY-MM-DD', fallback }) => {
  const dateTime = normalizeTimeData(value);

  return dateTime ? <Time dateTime={dateTime} format={format} /> : <>{fallback}</>;
};

export interface TimeRangeProps {
  start?: TimeData | null;
  end?: TimeData | null;
  format?: string;
  fallback?: ReactNode;
  separator?: ReactNode;
}

export const TimeRange: FC<TimeRangeProps> = ({
  start,
  end,
  format = 'MM-DD HH:mm',
  fallback,
  separator = ' - ',
}) => {
  const startTime = normalizeTimeData(start);
  const endTime = normalizeTimeData(end);

  return !startTime && !endTime ? (
    <>{fallback}</>
  ) : (
    <>
      {startTime && <Time dateTime={startTime} format={format} />}
      {startTime && endTime && separator}
      {endTime && <Time dateTime={endTime} format={format} />}
    </>
  );
};
