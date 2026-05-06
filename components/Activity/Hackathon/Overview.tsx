import { FC } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import styles from './Overview.module.less';

export type HackathonOverviewCard = Record<'title' | 'description' | 'icon', string>;

export type HackathonOverviewProps = Record<
  'title' | 'subtitle' | 'themeText' | 'themeSub',
  string
> & {
  cards: HackathonOverviewCard[];
};

const OverviewCard: FC<HackathonOverviewCard> = ({ description, icon, title }) => (
  <article className={styles.trackCard}>
    <span
      className={`${styles.trackIcon} d-inline-flex justify-content-center align-items-center mb-3`}
    >
      {icon}
    </span>
    <div className={styles.trackName}>{title}</div>
    <p className={`${styles.trackDesc} mt-3 mb-0`}>{description}</p>
  </article>
);

export const HackathonOverview: FC<HackathonOverviewProps> = ({
  cards,
  subtitle,
  themeSub,
  themeText,
  title,
}) => (
  <section id="tracks" className={styles.section}>
    <Container>
      <header className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <p className={styles.sectionSubtitle}>{subtitle}</p>
        <div className={styles.accentLine} />
      </header>

      <div className={`${styles.themePanel} mb-4`}>
        <div className={`${styles.themeText} mb-2`}>{themeText}</div>
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
