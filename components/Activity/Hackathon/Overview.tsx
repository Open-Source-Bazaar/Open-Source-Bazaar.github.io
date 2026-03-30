import { FC } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import styles from './Overview.module.less';

export interface HackathonOverviewCard {
  description: string;
  icon: string;
  title: string;
  value: number;
}

export interface HackathonOverviewProps {
  cards: HackathonOverviewCard[];
  subtitle: string;
  themeSub: string;
  themeText: string;
  title: string;
}

const OverviewCard: FC<HackathonOverviewCard> = ({ description, icon, title, value }) => (
  <article className={styles.trackCard}>
    <span className={styles.trackIcon}>{icon}</span>
    <div className={styles.trackName}>{title}</div>
    <p className={styles.trackDesc}>{description}</p>
    <span className={styles.trackMetric}>
      {value} {title}
    </span>
  </article>
);

export const HackathonOverview: FC<HackathonOverviewProps> = ({
  cards,
  subtitle,
  themeSub,
  themeText,
  title,
}) => (
  <section className={styles.section}>
    <Container>
      <header className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <p className={styles.sectionSubtitle}>{subtitle}</p>
        <div className={styles.accentLine} />
      </header>

      <div className={styles.themePanel}>
        <div className={styles.themeText}>{themeText}</div>
        <p className={styles.themeSub}>{themeSub}</p>
      </div>

      <Row className="g-3 mt-1">
        {cards.map(card => (
          <Col key={card.title} md={6} xl={4}>
            <OverviewCard {...card} />
          </Col>
        ))}
      </Row>
    </Container>
  </section>
);
