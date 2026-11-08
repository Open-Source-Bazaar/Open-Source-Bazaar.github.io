import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  CloseButton,
  Col,
  Container,
  DialogBody,
  DialogHeader,
  DialogTitle,
  NativeDialog,
  Nav,
  NavItem,
  NavLink,
  Row,
} from 'idea-react';
import { TableCellLocation, TableCellUser, TableFormView } from 'mobx-lark';
import { observer } from 'mobx-react';
import { FC, useContext, useMemo, useState } from 'react';
import { Minute, Second } from 'web-utility';

import { CommentBox } from '../../../../components/Activity/CommentBox';
import { TeamMemberCard } from '../../../../components/Activity/Hackathon/TeamMember';
import {
  compactSummaryOf,
  firstTextOf,
  isPublicForm,
} from '../../../../components/Activity/Hackathon/utility';
import { ProductCard } from '../../../../components/Activity/ProductCard';
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
import { lark } from '../../../api/Lark/core';
import { skipBuilding, skipBuildingAll } from '../../../api/SSG';

export const getStaticPaths = skipBuildingAll;

export const getStaticProps = skipBuilding<ProjectPageProps, Record<'id' | 'tid', string>>(
  async ({ params }) => {
    await lark.getAccessToken();

    const activityStore = new ActivityModel();
    activityStore.client = lark.client;

    const activity = await activityStore.getOne(params!.id);
    const { appId, tableIdMap } = activity.databaseSchema || {};

    if (!appId || !tableIdMap?.Project || !tableIdMap?.Member || !tableIdMap?.Product)
      return { notFound: true };

    const projectStore = new ProjectModel(appId, tableIdMap.Project);
    projectStore.client = lark.client;

    const project = await projectStore.getOne(params!.tid);

    const memberStore = new MemberModel(appId, tableIdMap.Member);
    memberStore.client = lark.client;
    const productStore = new ProductModel(appId, tableIdMap.Product);
    productStore.client = lark.client;

    // Get approved members for this project
    const [members, products] = await Promise.all([
      memberStore.getAll({ project: project.name as string, status: 'approved' }),
      productStore.getAll({ project: project.name as string }),
    ]);

    return {
      props: { activity, project, members, products },
      revalidate: +new Date(activity.endTime as number) < Date.now() ? undefined : Minute / Second,
    };
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
              <div className="d-grid gap-7">
                <Breadcrumb aria-label={t('breadcrumb')} className={styles.breadcrumb}>
                  {currentRoute.map(({ title, href }, index, { length }) => (
                    <BreadcrumbItem key={`${title}-${index}`}>
                      {index === length - 1 ? (
                        <BreadcrumbLink active>{title}</BreadcrumbLink>
                      ) : (
                        <BreadcrumbLink href={href}>{title}</BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  ))}
                </Breadcrumb>

                <Nav as="ul" className="flex-wrap gap-5 list-unstyled" aria-label={displayTitle}>
                  {navigation.map(({ href, label }) => (
                    <NavItem key={`${href}-${label}`} as="li">
                      <NavLink className={styles.heroNavLink} href={href}>
                        {label}
                      </NavLink>
                    </NavItem>
                  ))}
                </Nav>

                <div className="d-flex flex-wrap align-items-center gap-3 md:gap-5">
                  <span className={styles.heroEyebrow}>
                    {(activityType as string) || t('hackathon_detail')}
                  </span>
                  {prize && <span className={styles.heroTag}>{prize as string}</span>}
                  {rank && <span className={styles.heroTag}>#{rank as number}</span>}
                </div>

                <h1 className={styles.introTitle}>{displayTitle}</h1>
                <p className={styles.introText}>{projectSummary}</p>

                <nav className="d-flex flex-wrap gap-5">
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

                <ul className="d-flex flex-wrap gap-3 md:gap-5 m-0 p-0 list-unstyled">
                  {heroChips.map(item => (
                    <li key={item} className={styles.metaItem}>
                      {item}
                    </li>
                  ))}
                </ul>

                <Row as="ol" className="list-unstyled g-7" xs={1} md={2} xl={4}>
                  {quickMetrics.map(({ label, value, meta }) => (
                    <Col key={`${label}-${value}`} as="li">
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

            <Row as="ul" className="list-unstyled g-7" xs={1} md={2} xl={3}>
              {members.map(member => (
                <Col key={member.id as string} as="li">
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
              <Row as="ul" className="list-unstyled g-7" xs={1} md={2}>
                {products.map(product => (
                  <Col key={product.id as string} as="li">
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

            <Row className="g-7">
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
                      className={`${styles.scoreButton} w-100 mt-5`}
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

      <NativeDialog
        size="lg"
        className={styles.scoreModal}
        open={showScoreModal}
        onClose={() => setShowScoreModal(false)}
      >
        <DialogHeader>
          <DialogTitle as="h2">{t('score')}</DialogTitle>
          <CloseButton onClick={() => setShowScoreModal(false)} />
        </DialogHeader>
        <DialogBody>
          <div className="ratio ratio-16x9">
            {showScoreModal && (
              <iframe
                className="w-100 h-100 border-0"
                title={t('score')}
                src={scoreForm?.shared_url}
              />
            )}
          </div>
        </DialogBody>
      </NativeDialog>
    </>
  );
});

export default ProjectPage;
