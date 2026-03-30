import { BiTableSchema, TableCellLocation, TableCellUser } from 'mobx-lark';
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

type FormGroupKey = 'Person' | 'Project' | 'Product' | 'Evaluation';

interface FormLink {
  name: string;
  shared_limit?: string;
  shared_url: string;
}

interface FormGroupMeta {
  description: string;
  eyebrow: string;
  title: string;
}

interface FormGroup {
  key: FormGroupKey;
  list: FormLink[];
  meta: FormGroupMeta;
}

const FormButtonBar: FormGroupKey[] = ['Person', 'Project', 'Product', 'Evaluation'];

const FormSectionMeta: Record<FormGroupKey, FormGroupMeta> = {
  Person: {
    eyebrow: 'Participants',
    title: '参与者登记',
    description: '收集报名成员、建立参赛者池，并为后续组队和通知打底。',
  },
  Project: {
    eyebrow: 'Team Lead',
    title: '项目注册',
    description: '由队长登记项目名称、成员、赛道和一句话介绍，完成队伍锁定。',
  },
  Product: {
    eyebrow: 'Submission',
    title: '作品提交',
    description: '比赛截止前统一提交最终作品、演示链接和补充说明。',
  },
  Evaluation: {
    eyebrow: 'Review',
    title: '评审入口',
    description: '评委或导师在评审阶段使用，用于评分、复核与结果整理。',
  },
};

const isPublicForm = ({ shared_limit }: FormLink) => shared_limit === 'anyone_editable';

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
  const forms = (((databaseSchema as BiTableSchema).forms || {}) as Partial<
    Record<FormGroupKey, FormLink[]>
  >)!;
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
  const hostTags = ((host as string[] | undefined) || []).slice(0, 3);
  const agendaPreview = agenda.slice(0, 3);

  return (
    <>
      <PageHead title={name as string} />

      <section className={styles.hero}>
        <Container>
          <Row className="align-items-center g-4">
            <Col lg={7}>
              <div className={styles.heroEyebrow}>
                <span className={styles.heroTag}>{(activityType as string) || t('hackathon')}</span>
                {hostTags.map(tag => (
                  <span key={tag} className={styles.heroTag}>
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className={styles.title}>{name as string}</h1>
              <p className={styles.description}>{summary as string}</p>

              <div className={styles.heroStats}>
                {heroStats.map(({ label, value }) => (
                  <span key={label} className={styles.statChip}>
                    {value} {label}
                  </span>
                ))}
              </div>

              <div className={styles.heroActions}>
                {primaryForm && (
                  <Button href={primaryForm.list[0].shared_url} target="_blank" rel="noreferrer">
                    {primaryForm.meta.title}
                  </Button>
                )}
                {secondaryForm && (
                  <Button
                    href={secondaryForm.list[0].shared_url}
                    target="_blank"
                    rel="noreferrer"
                    variant="light"
                  >
                    {secondaryForm.meta.title}
                  </Button>
                )}
                {formGroups[0] && (
                  <Button href="#entry-hub" variant="outline-light">
                    查看全部入口
                  </Button>
                )}
              </div>

              <Row className="mt-4 g-3">
                <Col md={6}>
                  <Card className={styles.infoCard}>
                    <Card.Body>
                      <h5 className="text-white mb-2">📍 {t('event_location')}</h5>
                      <p className="text-white-50 mb-0">
                        {(location as TableCellLocation)?.full_address}
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
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
            </Col>

            <Col lg={5}>
              <Card className={styles.heroVisualCard}>
                {image && (
                  <div className={styles.heroImageWrap}>
                    <LarkImage src={image} alt={name as string} className={styles.heroImage} />
                  </div>
                )}
                <Card.Body>
                  <div className={styles.heroVisualHead}>
                    <span className={styles.heroVisualKicker}>Agenda Preview</span>
                    <strong>{agendaPreview[0]?.name as string}</strong>
                  </div>

                  <div className={styles.heroVisualList}>
                    {agendaPreview.map(({ name, startedAt, endedAt }) => (
                      <div
                        key={`${name as string}-${startedAt as string}`}
                        className={styles.heroVisualItem}
                      >
                        <strong>{name as string}</strong>
                        <span>
                          {formatDate(startedAt as string)} - {formatDate(endedAt as string)}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      <Container className="my-5">
        {formGroups[0] && (
          <section id="entry-hub" className={styles.section}>
            <p className={styles.sectionEyebrow}>Action Hub · Forms</p>
            <h2 className={styles.sectionTitle}>报名与提交流程</h2>
            <p className={styles.sectionLead}>
              入口根据活动当前配置自动生成。不同活动可以复用同一套页面结构，而不是为每次活动单开专页。
            </p>

            <Row className="mt-4 g-3" md={2} xl={4}>
              {formGroups.map(({ key, list, meta }, index) => (
                <Col key={key}>
                  <Card className={styles.entryCard} body>
                    <span className={styles.entryStep}>
                      Step {String(index + 1).padStart(2, '0')} · {meta.eyebrow}
                    </span>
                    <h3 className="h5 text-white mt-2">{meta.title}</h3>
                    <p className="text-white-50 mb-3">{meta.description}</p>
                    <div className="d-grid gap-2">
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
                    </div>
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
                    <strong>{t('members')}:</strong> {(members as string[]).join(', ')}
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
