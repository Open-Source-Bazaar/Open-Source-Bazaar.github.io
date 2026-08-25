import { FC, ReactNode } from 'react';
import { Container } from 'react-bootstrap';
import { TimeData } from 'web-utility';

import { TimeRange } from '../../TimeRange';
import type { HackathonAwardsMeta } from './Awards';
import styles from './Schedule.module.less';

export type HackathonScheduleTone =
  | 'break'
  | 'competition'
  | 'enrollment'
  | 'evaluation'
  | 'formation';

export interface HackathonScheduleFact extends HackathonAwardsMeta {
  meta: string;
}

export interface HackathonScheduleItem
  extends Record<'id' | 'phase' | 'title' | 'description', string> {
  facts: HackathonScheduleFact[];

  endedAt?: TimeData;
  startedAt?: TimeData;
  stageGoal?: string;
  tone: HackathonScheduleTone;
}

export interface HackathonScheduleProps
  extends Record<'title' | 'subtitle' | 'lead' | 'kicker' | 'stageGoalLabel', string> {
  items: HackathonScheduleItem[];
  keyDates?: {
    label: string;
    startedAt?: TimeData;
    endedAt?: TimeData;
  }[];
  overviewPills: ReactNode[];
}

const ScheduleCard: FC<HackathonScheduleItem & Record<'phaseLabel' | 'stageGoalLabel', string>> = ({
  description,
  endedAt,
  facts,
  phase,
  phaseLabel,
  startedAt,
  stageGoal,
  stageGoalLabel,
  title,
  tone,
}) => (
  <article className={`${styles.dayCard} ${styles[tone]}`}>
    <div
      className={`${styles.dayCardHead} d-flex justify-content-between align-items-baseline gap-3`}
    >
      <span className={`${styles.dayNo} d-inline-flex align-items-center`}>
        {phaseLabel} {phase}
      </span>
      <span className={styles.dayDate}>
        <TimeRange start={startedAt} end={endedAt} />
      </span>
    </div>

    <h3 className={`${styles.dayTitle} mt-3 mb-2`}>{title}</h3>
    <p className={`${styles.daySub} mb-3`}>{description}</p>

    <dl className={styles.dayAgenda}>
      {facts.map(({ label, meta, value }) => (
        <div key={`${label}-${value}`}>
          <dt className={`${styles.timePill} d-inline-flex align-items-center`}>{label}</dt>
          <dd className={`${styles.agendaCopy} d-flex flex-column gap-1`}>
            <strong>{value}</strong>
            <span>{meta}</span>
          </dd>
        </div>
      ))}
    </dl>

    {stageGoal && (
      <p className={`${styles.stageGoal} d-flex flex-wrap gap-2 mt-3 pt-3`}>
        <strong>{stageGoalLabel}:</strong>
        <span>{stageGoal}</span>
      </p>
    )}
  </article>
);

export const HackathonSchedule: FC<HackathonScheduleProps & { phaseLabel: string }> = ({
  items,
  keyDates,
  kicker,
  lead,
  overviewPills,
  phaseLabel,
  stageGoalLabel,
  subtitle,
  title,
}) => (
  <section id="schedule" className={styles.section}>
    <Container>
      <header className={styles.sectionHeader}>
        <p className={`${styles.scheduleKicker} mb-1`}>{kicker}</p>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <p className={styles.sectionSubtitle}>{subtitle}</p>
        <div className={styles.accentLine} />
      </header>

      {lead && (
        <hgroup className={`${styles.scheduleIntro} text-center mb-4`}>
          <h3 className={styles.scheduleLead}>{lead}</h3>
        </hgroup>
      )}

      <ul
        className={`list-unstyled ${styles.scheduleOverview} d-flex flex-wrap justify-content-center gap-3 mb-4`}
      >
        {overviewPills.map((pill, index) => (
          <li key={index} className={styles.schedulePill}>
            {pill}
          </li>
        ))}
      </ul>

      <div className={styles.scheduleDays}>
        {items.map(item => (
          <ScheduleCard
            key={item.id}
            {...item}
            phaseLabel={phaseLabel}
            stageGoalLabel={stageGoalLabel}
          />
        ))}
      </div>

      {keyDates?.[0] && (
        <ul className={`list-unstyled ${styles.keyDates} mt-4`}>
          {keyDates.map(({ startedAt, endedAt, label }, index) => (
            <li
              key={`${startedAt || ''}-${endedAt || ''}-${label}`}
              className={`${styles.keyDateCard} d-grid gap-1 ${index % 2 ? styles.keyDateCardWarn : ''}`}
            >
              <strong className={styles.keyDateValue}>
                <TimeRange start={startedAt} end={endedAt} format="MM-DD" />
              </strong>
              <span className={styles.keyDateLabel}>{label}</span>
            </li>
          ))}
        </ul>
      )}
    </Container>
  </section>
);
