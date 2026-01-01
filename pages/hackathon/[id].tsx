import { observer } from 'mobx-react';
import { GetServerSideProps } from 'next';
import { FC, useContext } from 'react';
import { Badge, Button, Card, Col, Container, Row } from 'react-bootstrap';

import { PageHead } from '../../components/Layout/PageHead';
import { generateMockHackathon, Hackathon } from '../../models/Hackathon';
import { I18nContext } from '../../models/Translation';
import styles from '../../styles/Hackathon.module.less';

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params?.id as string;
  const hackathon = generateMockHackathon(id);

  return {
    props: {
      hackathon: {
        ...hackathon,
        startDate: hackathon.startDate.toISOString(),
        endDate: hackathon.endDate.toISOString(),
        agenda: hackathon.agenda.map(item => ({
          ...item,
          startedAt: item.startedAt.toISOString(),
          endedAt: item.endedAt.toISOString(),
        })),
      },
    },
  };
};

interface HackathonDetailProps {
  hackathon: Omit<Hackathon, 'startDate' | 'endDate' | 'agenda'> & {
    startDate: string;
    endDate: string;
    agenda: Array<{
      summary: string;
      name: string;
      type: string;
      startedAt: string;
      endedAt: string;
    }>;
  };
}

const HackathonDetail: FC<HackathonDetailProps> = observer(({ hackathon }) => {
  const { t } = useContext(I18nContext);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      workshop: 'info',
      presentation: 'danger',
      coding: 'success',
      break: 'warning',
      ceremony: 'primary',
    };
    return colors[type] || 'secondary';
  };

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      gold: 'warning',
      silver: 'secondary',
      bronze: 'dark',
      special: 'info',
    };
    return colors[level] || 'primary';
  };

  return (
    <>
      <PageHead title={`${hackathon.title} - ${t('hackathon_detail')}`} />

      {/* Hero Section */}
      <section className={styles.hero}>
        <Container>
          <h1 className={`text-center ${styles.title}`}>{hackathon.title}</h1>
          <p className={`text-center ${styles.description}`}>{hackathon.description}</p>

          <Row className="mt-4 justify-content-center">
            <Col md={4}>
              <Card className={styles.infoCard}>
                <Card.Body>
                  <h5 className="text-white mb-2">📍 {t('event_location')}</h5>
                  <p className="text-white-50 mb-0">{hackathon.location}</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className={styles.infoCard}>
                <Card.Body>
                  <h5 className="text-white mb-2">⏰ {t('event_duration')}</h5>
                  <p className="text-white-50 mb-0">
                    {formatDateTime(hackathon.startDate)} - {formatDateTime(hackathon.endDate)}
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      <Container className="my-5">
        {/* Header: Agenda and Prizes side by side */}
        <Row>
          {/* Agenda Section */}
          <Col lg={6}>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>📅 {t('agenda')}</h2>
              <div className="mt-4">
                {hackathon.agenda.map((item, index) => (
                  <div key={index} className={`${styles.agendaItem} ${styles[item.type]}`}>
                    <h5 className="text-white mb-2">{item.name}</h5>
                    <p className="text-white-50 small mb-2">{item.summary}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <Badge bg={getTypeColor(item.type)} className="me-2">
                        {t(item.type as any)}
                      </Badge>
                      <div className="text-white-50 small">
                        {formatDateTime(item.startedAt)} - {formatDateTime(item.endedAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </Col>

          {/* Prizes Section - Frameless vertical cards */}
          <Col lg={6}>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>🏆 {t('prizes')}</h2>
              <div className="mt-4">
                {hackathon.prizes.map((prize, index) => (
                  <div key={index} className={styles.prizeCard}>
                    <Row className="align-items-center">
                      <Col xs={3}>
                        <img src={prize.image} alt={prize.name} className={styles.prizeImage} />
                      </Col>
                      <Col xs={9}>
                        <h5 className="text-white mb-2">{prize.name}</h5>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <Badge bg={getLevelColor(prize.level)}>{t(prize.level as any)}</Badge>
                          <span className="text-white fw-bold">
                            ¥{prize.price.toLocaleString()}
                          </span>
                        </div>
                        <div className="text-white-50 small">
                          <strong>{t('sponsor')}:</strong> {prize.sponsor} • <strong>{t('amount')}:</strong> {prize.amount}
                        </div>
                      </Col>
                    </Row>
                  </div>
                ))}
              </div>
            </section>
          </Col>
        </Row>

        {/* Mid-front: Organizations - Frameless vertical cards */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>🏢 {t('organizations')}</h2>
          <div className="mt-4">
            {hackathon.organizations.map((org, index) => (
              <div key={index} className={styles.orgCard}>
                <Row className="align-items-center mb-3">
                  <Col xs={2} md={1}>
                    <img src={org.logo} alt={org.name} className={styles.logo} />
                  </Col>
                  <Col xs={10} md={11}>
                    <h5 className="text-white mb-2">{org.name}</h5>
                    <a href={org.link} target="_blank" rel="noreferrer" className="text-info small">
                      {org.link}
                    </a>
                  </Col>
                </Row>
                <div className="text-white-50 small mb-2">
                  <strong>{t('members')}:</strong> {org.members.join(', ')}
                </div>
                <div className="text-white-50 small">
                  <strong>{t('prizes')}:</strong> {org.prizes.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Mid-back: Templates - Narrow cards, 3-4 per row */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>🛠️ {t('templates')}</h2>
          <Row className="mt-4">
            {hackathon.templates.map((template, index) => (
              <Col key={index} md={6} lg={4} xl={3}>
                <Card className={styles.templateCard}>
                  <Card.Body>
                    <h6 className="text-white mb-3">{template.name}</h6>
                    <p className="text-white-50 small mb-3">{template.summary}</p>
                    <div className="d-flex flex-column gap-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        href={template.sourceLink}
                        target="_blank"
                      >
                        {t('source_code')}
                      </Button>
                      <Button
                        variant="outline-success"
                        size="sm"
                        href={template.previewLink}
                        target="_blank"
                      >
                        {t('preview')}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        {/* Mid-back: Projects - Narrow cards, 3-4 per row */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>💡 {t('projects')}</h2>
          <Row className="mt-4">
            {hackathon.projects.map((project, index) => (
              <Col key={index} md={6} lg={4} xl={3}>
                <Card className={styles.projectCard}>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h6 className="text-white flex-grow-1">{project.name}</h6>
                      <div className={styles.scoreCircle}>{project.score}</div>
                    </div>
                    <p className="text-white-50 small mb-3">{project.summary}</p>
                    <div className="text-white-50 small mb-2">
                      <strong>{t('created_by')}:</strong> {project.createdBy}
                    </div>
                    <div className="text-white-50 small mb-2">
                      <strong>{t('group')}:</strong> {project.group.join(', ')}
                    </div>
                    <div className="text-white-50 small">
                      <strong>{t('members')}:</strong> {project.members.join(', ')}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        {/* Footer: Participants - Circular avatars only */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>👥 {t('participants')}</h2>
          <div className={styles.participantCloud}>
            {hackathon.people.map((person, index) => (
              <div key={index} className="text-center">
                <img
                  src={person.avatar}
                  alt={person.name}
                  className={styles.avatar}
                  title={person.name}
                />
              </div>
            ))}
          </div>
        </section>
      </Container>
    </>
  );
});

export default HackathonDetail;
