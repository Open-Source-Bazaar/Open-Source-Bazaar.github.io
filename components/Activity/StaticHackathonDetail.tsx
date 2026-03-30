import type { FC } from 'react';
import { Badge, Button, Card, Col, Container, Row } from 'react-bootstrap';

import type { StaticHackathonProfile } from '../../constants/staticHackathons';
import styles from '../../styles/Hackathon.module.less';

const AgendaTypeLabel: Record<StaticHackathonProfile['agenda'][number]['type'], string> = {
  enrollment: '报名',
  formation: '组队',
  competition: '比赛',
  evaluation: '评审',
  break: '展示',
};

export interface StaticHackathonDetailProps {
  profile: StaticHackathonProfile;
}

export const StaticHackathonDetail: FC<StaticHackathonDetailProps> = ({ profile }) => (
  <>
    <section className={styles.hero}>
      <Container>
        <div className="text-center mb-3">
          <Badge bg="light" text="dark">
            {profile.theme}
          </Badge>
        </div>
        <h1 className={`text-center ${styles.title}`}>{profile.name}</h1>
        <p className={`text-center ${styles.description}`}>{profile.summary}</p>

        <Row className="mt-4 justify-content-center">
          <Col md={4}>
            <Card className={styles.infoCard}>
              <Card.Body>
                <h5 className="text-white mb-2">📍 活动形式</h5>
                <p className="text-white-50 mb-0">{profile.location}</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className={styles.infoCard}>
              <Card.Body>
                <h5 className="text-white mb-2">⏰ 活动时间</h5>
                <p className="text-white-50 mb-0">{profile.timeline}</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-4 g-3 justify-content-center">
          {profile.entryLinks.slice(0, 2).map(({ href, label }) => (
            <Col key={label} md="auto">
              <Button href={href} target="_blank" rel="noreferrer" size="lg">
                {label}
              </Button>
            </Col>
          ))}
        </Row>
      </Container>
    </section>

    <Container className="my-5">
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>🔗 报名与入口</h2>
        <Row className="mt-4 g-3" md={2} xl={3}>
          {profile.entryLinks.map(({ href, label, note }) => (
            <Col key={label}>
              <Card className={styles.darkCard} body>
                <h3 className="h5 text-white">{label}</h3>
                <p className="text-white-50 mb-3">{note}</p>
                <Button href={href} target="_blank" rel="noreferrer" variant="light">
                  打开链接
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>📅 活动日程</h2>
        <ol className="list-unstyled mt-4">
          {profile.agenda.map(({ endedAt, name, startedAt, summary, type }) => (
            <li key={`${name}-${startedAt}`} className={`${styles.agendaItem} ${styles[type]}`}>
              <h3 className="h5 text-white mb-2">{name}</h3>
              <p className="text-white-50 small mb-2">{summary}</p>
              <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap">
                <Badge bg="dark">{AgendaTypeLabel[type]}</Badge>
                <div className="text-white-50 small">
                  {startedAt} - {endedAt}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className={`${styles.section} ${styles.prizeSection}`}>
        <h2 className={styles.sectionTitle}>🏆 奖项设置</h2>
        <Row className="mt-4 g-3" md={2} xl={3}>
          {profile.awards.map(({ name, quota, summary }) => (
            <Col key={name}>
              <Card className={styles.lightCard} body>
                <div className="d-flex justify-content-between align-items-start gap-3">
                  <h3 className="h5 mb-2">{name}</h3>
                  <Badge bg="dark">{quota}</Badge>
                </div>
                <p className="mb-0">{summary}</p>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>🧾 参赛说明</h2>
        <Row className="mt-4 g-3" md={2}>
          {profile.notes.map(note => (
            <Col key={note}>
              <Card className={styles.darkCard} body>
                <p className="text-white-50 mb-0">{note}</p>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>❓ FAQ</h2>
        <Row className="mt-4 g-3" md={2}>
          {profile.faq.map(({ answer, question }) => (
            <Col key={question}>
              <Card className={styles.darkCard} body>
                <h3 className="h5 text-white">{question}</h3>
                <p className="text-white-50 mb-0">{answer}</p>
              </Card>
            </Col>
          ))}
        </Row>
      </section>
    </Container>
  </>
);
