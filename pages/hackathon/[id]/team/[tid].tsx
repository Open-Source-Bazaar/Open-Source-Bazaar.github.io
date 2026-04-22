import { Avatar } from 'idea-react';
import { TableCellLocation, TableFormView } from 'mobx-lark';
import { observer } from 'mobx-react';
import { cache, compose, errorLogger } from 'next-ssr-middleware';
import { FC, useContext, useMemo, useState } from 'react';
import { Breadcrumb, Button, Card, Col, Container, Modal, Ratio, Row } from 'react-bootstrap';

import { CommentBox } from '../../../../components/Activity/CommentBox';
import { buildCountdownUnitLabels } from '../../../../components/Activity/Hackathon/constant';
import { HackathonHero } from '../../../../components/Activity/Hackathon/Hero';
import { useLiveCountdownState } from '../../../../components/Activity/Hackathon/useLiveCountdownState';
import {
  agendaTypeLabelOf,
  compactDateKeyOf,
  compactSummaryOf,
  firstTextOf,
  formatMoment,
  formatPeriod,
  isPublicForm,
  relationNameOf,
  textListOf,
  userOf,
} from '../../../../components/Activity/Hackathon/utility';
import { ProductCard } from '../../../../components/Activity/ProductCard';
import { PageHead } from '../../../../components/Layout/PageHead';
import { Activity, ActivityModel } from '../../../../models/Activity';
import {
  Agenda,
  AgendaModel,
  Member,
  MemberModel,
  Product,
  ProductModel,
  Project,
  ProjectModel,
} from '../../../../models/Hackathon';
import { i18n, I18nContext } from '../../../../models/Translation';
import styles from '../../../../styles/HackathonTeam.module.less';

export const getServerSideProps = compose<Record<'id' | 'tid', string>>(
  cache(),
  errorLogger,
  async ({ params }) => {
    if (!params?.id || !params?.tid) return { notFound: true, props: {} };

    const activity = await new ActivityModel().getOne(params!.id);
    const { appId, tableIdMap } = activity.databaseSchema || {};

    if (
      !appId ||
      !tableIdMap?.Project ||
      !tableIdMap?.Agenda ||
      !tableIdMap?.Member ||
      !tableIdMap?.Product
    )
      return { notFound: true, props: {} };

    const project = await new ProjectModel(appId, tableIdMap.Project).getOne(params!.tid);

    // Get approved members for this project
    const [agenda, members, products] = await Promise.all([
      new AgendaModel(appId, tableIdMap.Agenda).getAll(),
      new MemberModel(appId, tableIdMap.Member).getAll({
        project: project.name as string,
        status: 'approved',
      }),
      new ProductModel(appId, tableIdMap.Product).getAll({
        project: project.name as string,
      }),
    ]);
    return {
      props: {
        activity,
        project,
        agenda,
        members,
        products,
      },
    };
  },
);

interface ProjectPageProps {
  activity: Activity;
  agenda: Agenda[];
  project: Project;
  members: Member[];
  products: Product[];
}

const ProjectPage: FC<ProjectPageProps> = observer(
  ({ activity, agenda, project, members, products }) => {
    const { t } = useContext(I18nContext);
    const [showScoreModal, setShowScoreModal] = useState(false);

    const {
      name: activityName,
      databaseSchema,
      image,
      location,
      startTime,
      endTime,
      summary: activitySummary,
      type: activityType,
    } = activity;
    const { forms } = databaseSchema;
    const {
      name: displayName,
      summary: description,
      createdBy,
      score,
      rank,
      prize,
      group,
    } = project;
    const creator = userOf(createdBy);
    const displayTitle = firstTextOf(displayName) || t('projects');
    const projectDescription = textListOf(description).join(' · ');
    const projectSummary = compactSummaryOf(
      projectDescription,
      firstTextOf(activitySummary) || displayTitle,
      140,
    );
    const locationText = (location as TableCellLocation | undefined)?.full_address || '-';
    const eventRange = formatPeriod(startTime, endTime) || locationText;
    const groupName = relationNameOf(group);
    const scoreText = firstTextOf(score);
    const rankText = firstTextOf(rank);
    const prizeText = firstTextOf(prize);
    const agendaItems = [...agenda].sort(
      ({ startedAt: left }, { startedAt: right }) =>
        new Date((left as string) || 0).getTime() - new Date((right as string) || 0).getTime(),
    );
    const phaseBadges = agendaItems
      .slice(0, 4)
      .map(({ type, startedAt, endedAt }) => {
        const phase = agendaTypeLabelOf(type, t, t('agenda'));
        const start = compactDateKeyOf(startedAt);
        const end = compactDateKeyOf(endedAt);
        const period =
          start && end && start !== end
            ? `${start} - ${end}`
            : start || end || formatMoment(startedAt);

        return [phase, period].filter(Boolean).join(' ');
      })
      .filter(Boolean);
    const publicForms = useMemo(
      () =>
        Object.values(forms || {})
          .flat()
          .filter((form): form is TableFormView => Boolean(form))
          .filter(isPublicForm),
      [forms],
    );
    const primaryForm =
      (forms?.Person || []).filter(isPublicForm)[0] ||
      (forms?.Project || []).filter(isPublicForm)[0] ||
      publicForms[0];
    const scoreForm = (forms?.Evaluation || []).find(isPublicForm);
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
    const { nextItem: nextAgendaItem, countdownTo } = useLiveCountdownState(
      agendaItems,
      startTime,
      endTime,
    );
    const countdownLabel = nextAgendaItem
      ? agendaTypeLabelOf(nextAgendaItem.type, t, t('agenda'))
      : t('event_duration');
    const heroChips = [
      `${t('participants')} · ${members.length}`,
      `${t('products')} · ${products.length}`,
      groupName,
      rankText ? `#${rankText}` : '',
      scoreText ? `${t('score')} · ${scoreText}` : '',
    ].filter(Boolean);
    const creatorText = creator?.name || '';
    const heroPrimaryAction = primaryForm
      ? {
          label: t('hackathon_register_now'),
          href: primaryForm.shared_url,
          external: true as const,
        }
      : { label: t('hackathon_detail'), href: ActivityModel.getLink(activity) };

    return (
      <>
        <PageHead title={`${displayTitle} - ${activityName}`} />

        <div className={styles.page}>
          <HackathonHero
            badges={phaseBadges}
            bottomCard={
              nextAgendaItem
                ? {
                    eyebrow: t('event_duration'),
                    title: eventRange,
                    description: agendaTypeLabelOf(nextAgendaItem.type, t, t('agenda')),
                  }
                : undefined
            }
            countdownLabel={countdownLabel}
            countdownUnitLabels={buildCountdownUnitLabels({ t } as typeof i18n)}
            countdownTo={countdownTo}
            description={projectSummary}
            image={image}
            imageFallback={(activityType as string) || t('hackathon_detail')}
            locationText={locationText}
            name={`${displayTitle} ${t('hackathon_team_showcase')}`}
            navigation={navigation}
            primaryAction={heroPrimaryAction}
            secondaryAction={{ label: t('team_works'), href: '#works' }}
            chips={heroChips}
            subtitle={activityName as string}
            topCard={{
              eyebrow: t('event_description'),
              title: compactSummaryOf(projectSummary, displayTitle, 40),
              description: creatorText || locationText,
            }}
            visualChip={groupName || (activityType as string) || t('projects')}
            visualCopy={eventRange || locationText}
            visualKicker={t('main_visual')}
            visualTitle={compactSummaryOf(projectSummary, displayTitle, 52)}
          />

          <section id="overview" className={styles.section}>
            <Container>
              <header className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>{t('event_description')}</h2>
                <p className={styles.sectionSubtitle}>{displayTitle}</p>
                <div className={styles.accentLine} />
              </header>

              <article className={styles.introPanel}>
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

                <h3 className={styles.introTitle}>{displayTitle}</h3>
                <p className={styles.introText}>{projectSummary}</p>

                <ul className={styles.metaList}>
                  {groupName && <li className={styles.metaItem}>{groupName}</li>}
                  {prizeText && <li className={styles.metaItem}>{prizeText}</li>}
                  {rankText && <li className={styles.metaItem}>#{rankText}</li>}
                  {scoreText && (
                    <li className={styles.metaItem}>{`${t('score')} · ${scoreText}`}</li>
                  )}
                  <li className={styles.metaItem}>{locationText}</li>
                </ul>
              </article>

              <div className={styles.metricGrid}>
                <article className={styles.metricCard}>
                  <span className={styles.metricLabel}>{t('participants')}</span>
                  <strong className={styles.metricValue}>{members.length}</strong>
                  <span className={styles.metricMeta}>{t('team_members')}</span>
                </article>
                <article className={styles.metricCard}>
                  <span className={styles.metricLabel}>{t('products')}</span>
                  <strong className={styles.metricValue}>{products.length}</strong>
                  <span className={styles.metricMeta}>{t('team_works')}</span>
                </article>
                <article className={styles.metricCard}>
                  <span className={styles.metricLabel}>{t('event_location')}</span>
                  <strong className={styles.metricValue}>
                    {(location as TableCellLocation | undefined)?.name || '-'}
                  </strong>
                  <span className={styles.metricMeta}>{locationText}</span>
                </article>
                <article className={styles.metricCard}>
                  <span className={styles.metricLabel}>{t('score')}</span>
                  <strong className={styles.metricValue}>{scoreText || '--'}</strong>
                  <span className={styles.metricMeta}>{eventRange}</span>
                </article>
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
                {members.map(({ id, person, githubAccount, summary, skills }) => {
                  const member = userOf(person);
                  const githubName = firstTextOf(githubAccount);
                  const memberSummary = textListOf(summary).join(' · ');
                  const memberSkills = textListOf(skills).slice(0, 6);

                  return (
                    <Col as="li" key={id as string}>
                      <Card className={styles.memberCard} body>
                        <div className={styles.memberTop}>
                          <Avatar className={styles.avatar} src={member?.avatar_url} />
                          <div>
                            <h3 className={styles.memberName}>{member?.name || '-'}</h3>

                            {githubName && (
                              <a
                                className={styles.memberLink}
                                href={`https://github.com/${githubName}`}
                                target="_blank"
                                rel="noreferrer"
                              >
                                @{githubName}
                              </a>
                            )}
                          </div>
                        </div>

                        {memberSummary && <p className={styles.memberSummary}>{memberSummary}</p>}

                        {memberSkills[0] && (
                          <ul className={styles.skillList}>
                            {memberSkills.map(skill => (
                              <li key={skill} className={styles.skill}>
                                {skill}
                              </li>
                            ))}
                          </ul>
                        )}
                      </Card>
                    </Col>
                  );
                })}
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
                <div className={styles.emptyState}>{t('no_news_yet')}</div>
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

              <div className={styles.creatorGrid}>
                <article className={styles.summaryCard}>
                  <span className={styles.creatorLabel}>{t('event_description')}</span>
                  <h3 className={styles.summaryTitle}>{displayTitle}</h3>
                  <p className={styles.summaryText}>{projectSummary}</p>
                </article>

                <article className={styles.creatorCard}>
                  <span className={styles.creatorLabel}>{t('created_by')}</span>
                  <h3 className={styles.creatorValue}>{creator?.name || '-'}</h3>
                  <p className={styles.creatorText}>{locationText}</p>

                  {scoreForm && (
                    <Button className={styles.scoreButton} onClick={() => setShowScoreModal(true)}>
                      {t('score')}
                    </Button>
                  )}
                </article>
              </div>

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
  },
);

export default ProjectPage;
