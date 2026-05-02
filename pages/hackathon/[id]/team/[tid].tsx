import { TableCellLocation, TableCellUser, TableFormView } from 'mobx-lark';
import { observer } from 'mobx-react';
import { cache, compose, errorLogger } from 'next-ssr-middleware';
import { FC, useContext, useMemo, useState } from 'react';
import { Breadcrumb, Button, Col, Container, Modal, Nav, Ratio, Row } from 'react-bootstrap';

import { CommentBox } from '../../../../components/Activity/CommentBox';
import {
  compactSummaryOf,
  firstTextOf,
  isPublicForm,
} from '../../../../components/Activity/Hackathon/utility';
import { ProductCard } from '../../../../components/Activity/ProductCard';
import { TeamMemberCard } from '../../../../components/Activity/Hackathon/TeamMember';
import { PageHead } from '../../../../components/Layout/PageHead';
import { Activity, ActivityModel } from '../../../../models/Activity';
import {
  Member,
  MemberModel,
  Product,
  ProductModel,
  Project,
  ProjectModel,
} from '../../../../models/Hackathon';
import { I18nContext } from '../../../../models/Translation';
import styles from '../../../../styles/HackathonTeam.module.less';

export const getServerSideProps = compose<Record<'id' | 'tid', string>>(
  cache(),
  errorLogger,
  async ({ params }) => {
    const activity = await new ActivityModel().getOne(params!.id);
    const { appId, tableIdMap } = activity.databaseSchema || {};

    if (!appId || !tableIdMap?.Project || !tableIdMap?.Member || !tableIdMap?.Product)
      return { notFound: true };

    const project = await new ProjectModel(appId, tableIdMap.Project).getOne(params!.tid);

    // Get approved members for this project
    const [members, products] = await Promise.all([
      new MemberModel(appId, tableIdMap.Member).getAll({
        project: project.name as string,
        status: 'approved',
      }),
      new ProductModel(appId, tableIdMap.Product).getAll({
        project: project.name as string,
      }),
    ]);
    return { props: { activity, project, members, products } };
  },
);

interface ProjectPageProps {
  activity: Activity;
  project: Project;
  members: Member[];
  products: Product[];
}

const ProjectPage: FC<ProjectPageProps> = observer(({ activity, project, members, products }) => {
  const { t } = useContext(I18nContext);
  const [showScoreModal, setShowScoreModal] = useState(false);

  const {
    name: activityName,
    databaseSchema,
    location,
    summary: activitySummary,
    type: activityType,
  } = activity;
  const { forms } = databaseSchema;
  const { name: displayName, summary: description, createdBy, score, rank, prize } = project;

  const displayTitle = (displayName as string) || t('projects');
  const projectSummary = compactSummaryOf(
    description as string,
    firstTextOf(activitySummary) || displayTitle,
    140,
  );
  const locationText = (location as TableCellLocation | undefined)?.full_address || '-';
  const publicForms = useMemo(
    () =>
      Object.values(forms || {})
        .flat()
        .filter((form): form is TableFormView => Boolean(form))
        .filter(isPublicForm)
        .filter(({ shared_url }) => Boolean(shared_url)),
    [forms],
  );
  const hasShareUrl = ({ shared_url }: TableFormView) => Boolean(shared_url);
  const primaryForm =
    (forms?.Person || []).filter(isPublicForm).find(hasShareUrl) ||
    (forms?.Project || []).filter(isPublicForm).find(hasShareUrl) ||
    publicForms[0];
  const scoreForm = (forms?.Evaluation || []).filter(isPublicForm).find(hasShareUrl);
  const currentRoute = [
    { title: activityName as string, href: ActivityModel.getLink(activity) },
    { title: displayTitle },
  ];
  const navigation = [
    { href: '#overview', label: t('event_description') },
    { href: '#members', label: t('team_members') },
    { href: '#works', label: t('team_works') },
    { href: '#creator', label: t('created_by') },
  ];
  const heroChips = [
    `${t('participants')} · ${members.length}`,
    `${t('products')} · ${products.length}`,
    rank ? `#${rank}` : '',
    score ? `${t('score')} · ${score}` : '',
  ].filter(Boolean);
  const heroPrimaryAction = primaryForm
    ? {
        label: t('hackathon_register_now'),
        href: primaryForm.shared_url,
        external: true as const,
      }
    : { label: t('hackathon_detail'), href: ActivityModel.getLink(activity) };
  const quickMetrics = [
    {
      label: t('participants'),
      value: String(members.length),
      meta: t('team_members'),
    },
    {
      label: t('products'),
      value: String(products.length),
      meta: t('team_works'),
    },
    {
      label: t('created_by'),
      value: (createdBy as TableCellUser)?.name || '-',
      meta: displayTitle,
    },
    {
      label: t('score'),
      value: (score as number) || '--',
      meta: [prize, rank ? `#${rank}` : ''].filter(Boolean).join(' · ') || '--',
    },
  ];

  return (
    <>
      <PageHead title={`${displayTitle} - ${activityName}`} />

      <div className={styles.page}>
        <section id="overview" className={styles.heroSection}>
          <Container>
            <div className={styles.heroShell}>
              <div className="d-grid gap-4">
                <Breadcrumb aria-label={t('breadcrumb')} className={styles.breadcrumb}>
                  {currentRoute.map(({ title, href }, index, { length }) => (
                    <Breadcrumb.Item
                      key={`${title}-${index}`}
                      href={index === length - 1 ? undefined : href}
                      active={index === length - 1}
                    >
                      {title}
                    </Breadcrumb.Item>
                  ))}
                </Breadcrumb>

                <Nav as="ul" className="flex-wrap gap-3 list-unstyled" aria-label={displayTitle}>
                  {navigation.map(({ href, label }) => (
                    <Nav.Item as="li" key={`${href}-${label}`}>
                      <Nav.Link className={styles.heroNavLink} href={href}>
                        {label}
                      </Nav.Link>
                    </Nav.Item>
                  ))}
                </Nav>

                <div className="d-flex flex-wrap align-items-center gap-2 gap-md-3">
                  <span className={styles.heroEyebrow}>
                    {(activityType as string) || t('hackathon_detail')}
                  </span>
                  {prize && <span className={styles.heroTag}>{prize as string}</span>}
                  {rank && <span className={styles.heroTag}>#{rank as number}</span>}
                </div>

                <h1 className={styles.introTitle}>{displayTitle}</h1>
                <p className={styles.introText}>{projectSummary}</p>

                <nav className="d-flex flex-wrap gap-3">
                  <a
                    className={styles.primaryAction}
                    href={heroPrimaryAction.href}
                    {...(heroPrimaryAction.external && {
                      target: '_blank',
                      rel: 'noreferrer',
                    })}
                  >
                    {heroPrimaryAction.label}
                  </a>
                  <a className={styles.secondaryAction} href="#works">
                    {t('team_works')}
                  </a>
                </nav>

                <ul className="d-flex flex-wrap gap-2 gap-md-3 m-0 p-0 list-unstyled">
                  {heroChips.map(item => (
                    <li key={item} className={styles.metaItem}>
                      {item}
                    </li>
                  ))}
                </ul>

                <Row as="ol" className="list-unstyled g-4" xs={1} md={2} xl={4}>
                  {quickMetrics.map(({ label, value, meta }) => (
                    <Col as="li" key={`${label}-${value}`}>
                      <article className={styles.metricCard}>
                        <span className={styles.metricLabel}>{label}</span>
                        <strong className={styles.metricValue}>{value}</strong>
                        <span className={styles.metricMeta}>{meta}</span>
                      </article>
                    </Col>
                  ))}
                </Row>
              </div>
            </div>
          </Container>
        </section>

        <section id="members" className={styles.section}>
          <Container>
            <header className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{t('team_members')}</h2>
              <p className={styles.sectionSubtitle}>{displayTitle}</p>
              <div className={styles.accentLine} />
            </header>

            <Row as="ul" className="list-unstyled g-4" xs={1} md={2} xl={3}>
              {members.map(member => (
                <Col as="li" key={member.id as string}>
                  <TeamMemberCard {...member} />
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        <section id="works" className={styles.section}>
          <Container>
            <header className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{t('team_works')}</h2>
              <p className={styles.sectionSubtitle}>{displayTitle}</p>
              <div className={styles.accentLine} />
            </header>

            {products.length > 0 ? (
              <Row as="ul" className="list-unstyled g-4" xs={1} md={2}>
                {products.map(product => (
                  <Col as="li" key={product.id as string}>
                    <ProductCard className={styles.productCardOverride} {...product} />
                  </Col>
                ))}
              </Row>
            ) : (
              <div className={`${styles.emptyState} text-center`}>{t('no_news_yet')}</div>
            )}
          </Container>
        </section>

        <section id="creator" className={styles.section}>
          <Container>
            <header className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{t('created_by')}</h2>
              <p className={styles.sectionSubtitle}>{displayTitle}</p>
              <div className={styles.accentLine} />
            </header>

            <Row className="g-4">
              <Col xl={7}>
                <article className={styles.summaryCard}>
                  <span className={styles.creatorLabel}>{t('event_description')}</span>
                  <h3 className={styles.summaryTitle}>{displayTitle}</h3>
                  <p className={styles.summaryText}>{projectSummary}</p>
                </article>
              </Col>

              <Col xl={5}>
                <article className={styles.creatorCard}>
                  <span className={styles.creatorLabel}>{t('created_by')}</span>
                  <h3 className={styles.creatorValue}>
                    {(createdBy as TableCellUser)?.name || '-'}
                  </h3>
                  <p className={styles.creatorText}>{locationText}</p>

                  {scoreForm && (
                    <Button
                      className={`${styles.scoreButton} w-100 mt-3`}
                      onClick={() => setShowScoreModal(true)}
                    >
                      {t('score')}
                    </Button>
                  )}
                </article>
              </Col>
            </Row>

            <div className={styles.commentWrap}>
              <CommentBox />
            </div>
          </Container>
        </section>
      </div>

      <Modal
        size="lg"
        centered
        show={showScoreModal}
        onHide={() => setShowScoreModal(false)}
        className={styles.scoreModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>{t('score')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Ratio aspectRatio="16x9">
            <iframe
              className="w-100 h-100 border-0"
              title={t('score')}
              src={scoreForm?.shared_url}
            />
          </Ratio>
        </Modal.Body>
      </Modal>
    </>
  );
});

export default ProjectPage;
