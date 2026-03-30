import { BiTableSchema, TableCellLocation, TableCellUser, TableFormView } from 'mobx-lark';
import { observer } from 'mobx-react';
import Link from 'next/link';
import { cache, compose, errorLogger } from 'next-ssr-middleware';
import { FC, useContext } from 'react';
import { Badge, Button, Card, Col, Container, Row } from 'react-bootstrap';
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

    const { appId, tableIdMap } = (activity.databaseSchema || {}) as BiTableSchema;

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

const FormButtonBar = ['Person', 'Project', 'Product', 'Evaluation'] as const;

type FormGroupKey = (typeof FormButtonBar)[number];
type FormGroupMeta = Record<'title' | 'description' | 'eyebrow', I18nKey>;

interface FormGroup {
  key: FormGroupKey;
  list: TableFormView[];
  meta: FormGroupMeta;
}

const FormSectionMeta: Record<FormGroupKey, FormGroupMeta> = {
  Person: {
    eyebrow: 'participants',
    title: 'hackathon_participant_registration',
    description: 'hackathon_participant_registration_description',
  },
  Project: {
    eyebrow: 'hackathon_team_lead',
    title: 'hackathon_project_registration',
    description: 'hackathon_project_registration_description',
  },
  Product: {
    eyebrow: 'hackathon_submission',
    title: 'product_submission',
    description: 'hackathon_product_submission_description',
  },
  Evaluation: {
    eyebrow: 'hackathon_review',
    title: 'hackathon_evaluation_entry',
    description: 'hackathon_evaluation_entry_description',
  },
};

const isPublicForm = ({ shared_limit }: TableFormView) =>
  ['anyone_editable'].includes(shared_limit as string);

const HackathonDetail: FC<HackathonDetailProps> = observer(({ activity, hackathon }) => {
  const { t } = useContext(I18nContext);

  const {
      name,
      summary,
      location,
      startTime,
      endTime,
      databaseSchema,
      host,
      image,
      type: activityType,
    } = activity,
    { people, organizations, agenda, prizes, templates, projects } = hackathon;
  const { forms } = (databaseSchema || {}) as BiTableSchema;

  const formGroups = FormButtonBar.flatMap<FormGroup>(key => {
    const list = forms[key]?.filter(isPublicForm) || [];

    return list[0] ? [{ key, list, meta: FormSectionMeta[key] }] : [];
  });
  const primaryForm =
    formGroups.find(({ key }) => key === 'Person') ||
    formGroups.find(({ key }) => key === 'Project') ||
    formGroups[0];
  const secondaryForm =
    formGroups.find(({ key }) => key === 'Project' && key !== primaryForm?.key) ||
    formGroups.find(({ key }) => key !== primaryForm?.key);
  const heroStats = [
    { label: t('participants'), value: people.length },
    { label: t('projects'), value: projects.length },
    { label: t('templates'), value: templates.length },
    { label: t('organizations'), value: organizations.length },
  ];
  const hostTags = (host as string[] | undefined)?.slice(0, 3) || [];
  const agendaPreview = agenda.slice(0, 3);

  return (
    <>
      <PageHead title={name as string} />

      <section className={styles.hero}>
        <Container>
          <Row className="align-items-center g-4">
            <Col lg={7}>
              <ul className="list-unstyled d-flex flex-wrap gap-3 mb-3">
                <li className={styles.heroTag}>{(activityType as string) || t('hackathon')}</li>
                {hostTags.map(tag => (
                  <li key={tag} className={styles.heroTag}>
                    {tag}
                  </li>
                ))}
              </ul>

              <h1 className={styles.title}>{name as string}</h1>
              <p className={styles.description}>{summary as string}</p>

              <ul className="list-unstyled d-flex flex-wrap gap-3 mt-4 mb-0">
                {heroStats.map(({ label, value }) => (
                  <li key={label} className={styles.statChip}>
                    {value} {label}
                  </li>
                ))}
              </ul>

              <nav className="d-flex flex-wrap gap-3 mt-4">
                {primaryForm && (
                  <Button href={primaryForm.list[0].shared_url} target="_blank" rel="noreferrer">
                    {t(primaryForm.meta.title)}
                  </Button>
                )}
                {secondaryForm && (
                  <Button
                    href={secondaryForm.list[0].shared_url}
                    target="_blank"
                    rel="noreferrer"
                    variant="light"
                  >
                    {t(secondaryForm.meta.title)}
                  </Button>
                )}
                {formGroups[0] && (
                  <Button href="#entry-hub" variant="outline-light">
                    {t('hackathon_view_all_entries')}
                  </Button>
                )}
              </nav>

              <Row className="mt-4 g-3" md={2}>
                <Col>
                  <Card className={styles.infoCard} body>
                    <h5 className="text-white mb-2">📍 {t('event_location')}</h5>
                    <address className="text-white-50 mb-0 fst-normal">
                      {(location as TableCellLocation)?.full_address}
                    </address>
                  </Card>
                </Col>
                <Col>
                  <Card className={styles.infoCard} body>
                    <h5 className="text-white mb-2">⏰ {t('event_duration')}</h5>
                    <p className="text-white-50 mb-0">
                      <time dateTime={startTime as string}>{formatDate(startTime as string)}</time>{' '}
                      - <time dateTime={endTime as string}>{formatDate(endTime as string)}</time>
                    </p>
                  </Card>
                </Col>
              </Row>
            </Col>

            <Col lg={5}>
              <Card className={styles.heroVisualCard}>
                {image && (
                  <div className={styles.heroImageWrap}>
                    <LarkImage
                      src={image}
                      alt={name as string}
                      className="w-100 h-100 object-fit-cover"
                    />
                  </div>
                )}
                <Card.Body>
                  {agendaPreview[0] && (
                    <dl className="d-grid gap-3 mb-0">
                      <div className={`${styles.heroVisualHead} ${styles.heroVisualItem}`}>
                        <dt className={styles.heroVisualKicker}>{t('hackathon_agenda_preview')}</dt>
                        <dd className="fw-semibold">{agendaPreview[0].name as string}</dd>
                      </div>

                      {agendaPreview.map(({ name, startedAt, endedAt }) => (
                        <div
                          key={`${name as string}-${startedAt as string}`}
                          className={styles.heroVisualItem}
                        >
                          <dt className="fw-semibold">{name as string}</dt>
                          <dd>
                            <time dateTime={startedAt as string}>
                              {formatDate(startedAt as string)}
                            </time>{' '}
                            -{' '}
                            <time dateTime={endedAt as string}>
                              {formatDate(endedAt as string)}
                            </time>
                          </dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      <Container className="my-5">
        {formGroups[0] && (
          <section id="entry-hub" className={styles.section}>
            <hgroup className="mb-0">
              <p className={styles.sectionEyebrow}>{t('hackathon_action_hub')}</p>
              <h2 className={styles.sectionTitle}>{t('hackathon_entry_flow')}</h2>
              <p className={styles.sectionLead}>{t('hackathon_entry_flow_description')}</p>
            </hgroup>

            <Row as="ol" className="list-unstyled mt-4 g-3" md={2} xl={4}>
              {formGroups.map(({ key, list, meta }, index) => (
                <Col as="li" key={key}>
                  <Card className={styles.entryCard} body>
                    <span className={styles.entryStep}>
                      {t('hackathon_step')} {String(index + 1).padStart(2, '0')} · {t(meta.eyebrow)}
                    </span>
                    <h3 className="h5 text-white mt-2">{t(meta.title)}</h3>
                    <p className="text-white-50 mb-3">{t(meta.description)}</p>
                    <nav className="d-grid gap-2">
                      {list.map(({ name, shared_url }) => (
                        <Button
                          key={name}
                          href={shared_url}
                          target="_blank"
                          rel="noreferrer"
                          variant="light"
                        >
                          {name}
                        </Button>
                      ))}
                    </nav>
                  </Card>
                </Col>
              ))}
            </Row>
          </section>
        )}

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
                    <strong>{t('members')}:</strong>{' '}
                    {(members as string[] | undefined)?.join(', ') || '-'}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </section>

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
