import { FC } from 'react';
import { Container } from 'react-bootstrap';

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

export interface HackathonScheduleItem {
  dateText: string;
  description: string;
  facts: HackathonScheduleFact[];
  id: string;
  phase: string;
  title: string;
  tone: HackathonScheduleTone;
}

export interface HackathonScheduleProps {
  items: HackathonScheduleItem[];
  kicker: string;
  lead: string;
  overviewPills: string[];
  subtitle: string;
  title: string;
}

const ScheduleCard: FC<HackathonScheduleItem & { phaseLabel: string }> = ({
  dateText,
  description,
  facts,
  phase,
  phaseLabel,
  title,
  tone,
}) => (
  <article className={`${styles.dayCard} ${styles[tone]}`}>
    <div className={styles.dayCardHead}>
      <span className={styles.dayNo}>
        {phaseLabel} {phase}
      </span>
      <time className={styles.dayDate}>{dateText}</time>
    </div>

    <h3 className={styles.dayTitle}>{title}</h3>
    <p className={styles.daySub}>{description}</p>

    <dl className={styles.dayAgenda}>
      {facts.map(({ label, meta, value }) => (
        <div key={`${label}-${value}`}>
          <dt className={styles.timePill}>{label}</dt>
          <dd className={styles.agendaCopy}>
            <strong>{value}</strong>
            <span>{meta}</span>
          </dd>
        </div>
      ))}
    </dl>
  </article>
);

export const HackathonSchedule: FC<HackathonScheduleProps & { phaseLabel: string }> = ({
  items,
  kicker,
  lead,
  overviewPills,
  phaseLabel,
  subtitle,
  title,
}) => (
  <section id="schedule" className={styles.section}>
    <Container>
      <header className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <p className={styles.sectionSubtitle}>{subtitle}</p>
        <div className={styles.accentLine} />
      </header>

      <hgroup className={styles.scheduleIntro}>
        <p className={styles.scheduleKicker}>{kicker}</p>
        <h3 className={styles.scheduleLead}>{lead}</h3>
      </hgroup>

      <ul className={`list-unstyled ${styles.scheduleOverview}`}>
        {overviewPills.map(pill => (
          <li key={pill} className={styles.schedulePill}>
            {pill}
          </li>
        ))}
      </ul>

      <div className={styles.scheduleDays}>
        {items.map(item => (
          <ScheduleCard key={item.id} {...item} phaseLabel={phaseLabel} />
        ))}
      </div>
    </Container>
  </section>
);
