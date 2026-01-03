import { BiTableSchema, TableCellLocation, TableCellUser } from 'mobx-lark';
import { observer } from 'mobx-react';
import Link from 'next/link';
import { cache, compose, errorLogger } from 'next-ssr-middleware';
import { FC, useContext } from 'react';
import { Badge, Card, Col, Container, Row } from 'react-bootstrap';
import { text2color, UserRankView } from 'idea-react';
import { formatDate } from 'web-utility';

import { GitCard } from '../../components/Git/Card';
import { LarkImage } from '../../components/LarkImage';
import { PageHead } from '../../components/Layout/PageHead';
import { Activity, ActivityModel } from '../../models/Activity';
import { fileURLOf } from '../../models/Base';
import {
  Agenda,
  AgendaModel,
  Organization,
  OrganizationModel,
  Person,
  PersonModel,
  Prize,
  PrizeModel,
  Project,
  ProjectModel,
  Template,
  TemplateModel,
} from '../../models/Hackathon';
import { I18nContext, I18nKey } from '../../models/Translation';
import styles from '../../styles/Hackathon.module.less';

export const getServerSideProps = compose<{ id: string }>(
  cache(),
  errorLogger,
  async ({ params }) => {
    const activity = await new ActivityModel().getOne(params!.id);

    // @ts-expect-error Upstream compatibility
    const { appId, tableIdMap } = activity.databaseSchema as BiTableSchema;

    const [people, organizations, agenda, prizes, templates, projects] = await Promise.all([
      new PersonModel(appId, tableIdMap.Person).getAll(),
      new OrganizationModel(appId, tableIdMap.Organization).getAll(),
      new AgendaModel(appId, tableIdMap.Agenda).getAll(),
      new PrizeModel(appId, tableIdMap.Prize).getAll(),
      new TemplateModel(appId, tableIdMap.Template).getAll(),
      new ProjectModel(appId, tableIdMap.Project).getAll(),
    ]);

    return {
      props: {
        activity,
        hackathon: { people, organizations, agenda, prizes, templates, projects },
      },
    };
  },
);

interface HackathonDetailProps {
  activity: Activity;
  hackathon: {
    people: Person[];
    organizations: Organization[];
    agenda: Agenda[];
    prizes: Prize[];
    templates: Template[];
    projects: Project[];
  };
}

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const HackathonDetail: FC<HackathonDetailProps> = observer(({ activity, hackathon }) => {
  const { t } = useContext(I18nContext);

  const { name, summary, location, startTime, endTime } = activity,
    { people, organizations, agenda, prizes, templates, projects } = hackathon;

  return (
    <>
      <PageHead title={name as string} />

      {/* Hero Section */}
      <section className={styles.hero}>
        <Container>
          <h1 className={`text-center ${styles.title}`}>{name as string}</h1>
          <p className={`text-center ${styles.description}`}>{summary as string}</p>

          <Row className="mt-4 justify-content-center">
            <Col md={4}>
              <Card className={styles.infoCard}>
                <Card.Body>
                  <h5 className="text-white mb-2">📍 {t('event_location')}</h5>
                  <p className="text-white-50 mb-0">
                    {(location as TableCellLocation).full_address}
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className={styles.infoCard}>
                <Card.Body>
                  <h5 className="text-white mb-2">⏰ {t('event_duration')}</h5>
                  <p className="text-white-50 mb-0">
                    {formatDate(startTime as string)} - {formatDate(endTime as string)}
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      <Container className="my-5">
        <section className={`${styles.section} ${styles.prizeSection}`}>
          <h2 className={styles.sectionTitle}>🏆 {t('prizes')}</h2>
          <div className="mt-4">
            <UserRankView
              title={t('prizes')}
              rank={prizes.map(({ name, image, price }, index) => ({
                id: `prize-${index}`,
                name: name as string,
                avatar: fileURLOf(image),
                score: price as number,
              }))}
            />
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>📅 {t('agenda')}</h2>
          <ol className="list-unstyled mt-4">
            {agenda.map(({ name, type, summary, startedAt, endedAt }) => (
              <li
                key={name as string}
                className={`${styles.agendaItem} ${styles[type?.toString().toLowerCase() || 'break']}`}
              >
                <h5 className="text-white mb-2">{name as string}</h5>
                <p className="text-white-50 small mb-2">{summary as string}</p>
                <div className="d-flex justify-content-between align-items-center">
                  <Badge bg={text2color(type as string)} className="me-2">
                    {t(type as I18nKey)}
                  </Badge>
                  <div className="text-white-50 small">
                    {formatDate(startedAt as string)} - {formatDate(endedAt as string)}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Mid-front: Organizations - Horizontal logo layout */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>🏢 {t('organizations')}</h2>
          <nav className={styles.orgContainer}>
            {organizations.map(({ name, link, logo }) => (
              <a
                key={name as string}
                href={link as string}
                target="_blank"
                rel="noreferrer"
                title={name as string}
              >
                <LarkImage src={logo} alt={name as string} className={styles.orgLogo} />
              </a>
            ))}
          </nav>
        </section>

        {/* Mid-back: Templates - Using GitCard, 3-4 per row */}
        <section className={`${styles.section} ${styles.templateSection}`}>
          <h2 className={styles.sectionTitle}>🛠️ {t('templates')}</h2>
          <Row className="mt-4 g-3" md={2} lg={3} xl={4}>
            {templates.map(({ name, languages, tags, sourceLink, summary, previewLink }) => (
              <Col key={name as string}>
                <GitCard
                  full_name={name as string}
                  html_url={sourceLink as string}
                  languages={languages as string[]}
                  topics={tags as string[]}
                  description={summary as string}
                  homepage={previewLink as string}
                />
              </Col>
            ))}
          </Row>
        </section>

        {/* Mid-back: Projects - Narrow cards, 3-4 per row */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>💡 {t('projects')}</h2>

          <Row as="ul" className="list-unstyled mt-4 g-3" md={2} lg={3} xl={4}>
            {projects.map(({ id, name, score, summary, createdBy, members }) => (
              <Col as="li" key={name as string}>
                <Card className={styles.projectCard} body>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h6 className="text-white flex-grow-1">
                      <Link
                        className="stretched-link"
                        href={`${ActivityModel.getLink(activity)}/team/${id}`}
                      >
                        {name as string}
                      </Link>
                    </h6>
                    <div className={styles.scoreCircle}>{score as number}</div>
                  </div>
                  <p className="text-white-50 small mb-3">{summary as string}</p>
                  <div className="text-white-50 small mb-2">
                    <strong>{t('created_by')}:</strong>{' '}
                    <a href={`mailto:${(createdBy as TableCellUser)?.email}`}>
                      {(createdBy as TableCellUser)?.name}
                    </a>
                  </div>
                  <div className="text-white-50 small">
                    <strong>{t('members')}:</strong> {(members as string[]).join(', ')}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        {/* Footer: Participants - Circular avatars only */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>👥 {t('participants')}</h2>
          <nav className={styles.participantCloud}>
            {people.map(({ name, avatar, githubLink }) => (
              <a
                key={name as string}
                className="text-center"
                target="_blank"
                rel="noreferrer"
                href={githubLink as string}
              >
                <LarkImage
                  className={styles.avatar}
                  src={avatar}
                  alt={name as string}
                  title={name as string}
                />
              </a>
            ))}
          </nav>
        </section>
      </Container>
    </>
  );
});

export default HackathonDetail;
