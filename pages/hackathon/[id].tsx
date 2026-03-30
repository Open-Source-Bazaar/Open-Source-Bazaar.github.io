import { BiTableSchema, TableCellLocation, TableFormView } from 'mobx-lark';
import { observer } from 'mobx-react';
import { cache, compose, errorLogger } from 'next-ssr-middleware';
import { FC, useContext } from 'react';

import {
  HackathonActionHub,
  HackathonActionHubLink,
} from '../../components/Activity/Hackathon/ActionHub';
import { HackathonAwards } from '../../components/Activity/Hackathon/Awards';
import { HackathonFAQ } from '../../components/Activity/Hackathon/FAQ';
import { HackathonHero } from '../../components/Activity/Hackathon/Hero';
import { HackathonOverview } from '../../components/Activity/Hackathon/Overview';
import { HackathonParticipants } from '../../components/Activity/Hackathon/Participants';
import { HackathonResources } from '../../components/Activity/Hackathon/Resources';
import { HackathonSchedule } from '../../components/Activity/Hackathon/Schedule';
import { PageHead } from '../../components/Layout/PageHead';
import { Activity, ActivityModel } from '../../models/Activity';
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
import { I18nContext } from '../../models/Translation';
import {
  buildCountdownUnitLabels,
  buildFAQItems,
  buildHighlightCards,
  buildJudgingCriteria,
  buildOrganizationItems,
  buildParticipantItems,
  buildPrizeItems,
  buildProjectItems,
  buildScheduleItems,
  buildTemplateItems,
  FormButtonBar,
  FormGroupKey,
  FormGroupView,
  buildFormSectionMeta,
  heroNavigation,
  RequiredTableKeys,
} from '../../components/Activity/Hackathon/constant';
import {
  agendaTypeLabelOf,
  compactDateKeyOf,
  compactSummaryOf,
  dateKeyOf,
  daysBetween,
  formatMoment,
  formatPeriod,
  isPublicForm,
  normalizeAgendaType,
  previewText,
} from '../../components/Activity/Hackathon/utility';

interface HackathonDetailProps {
  activity: Activity;
  hackathon: {
    agenda: Agenda[];
    organizations: Organization[];
    people: Person[];
    prizes: Prize[];
    projects: Project[];
    templates: Template[];
  };
}

export const getServerSideProps = compose<{ id: string }>(
  cache(),
  errorLogger,
  async ({ params }) => {
    const activity = await new ActivityModel().getOne(params!.id);

    const { appId, tableIdMap } = (activity.databaseSchema || {}) as BiTableSchema;

    if (!appId || !tableIdMap) return { notFound: true, props: {} };

    for (const key of RequiredTableKeys) if (!tableIdMap[key]) return { notFound: true, props: {} };

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

const HackathonDetail: FC<HackathonDetailProps> = observer(({ activity, hackathon }) => {
  const i18n = useContext(I18nContext);
  const { t } = i18n;
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
  const formMap = (forms || {}) as Partial<Record<FormGroupKey, TableFormView[]>>;
  const summaryText = (summary as string) || '';
  const agendaItems = [...agenda].sort(
    ({ startedAt: left }, { startedAt: right }) =>
      new Date((left as string) || 0).getTime() - new Date((right as string) || 0).getTime(),
  );
  const hostTags = (host as string[] | undefined)?.slice(0, 2) || [];
  const eventRange = formatPeriod(startTime, endTime);
  const locationText = (location as TableCellLocation | undefined)?.full_address || '-';
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
  const heroBadges =
    phaseBadges[0] && phaseBadges[1]
      ? phaseBadges
      : [
          (activityType as string) || t('hackathon'),
          ...hostTags,
          formatMoment(startTime),
          formatMoment(endTime),
        ].filter((value): value is string => Boolean(value));
  const agendaPreview = agendaItems.slice(0, 3);
  const scheduleOverviewPills = agendaItems.slice(0, 6).map(({ id, name, type, startedAt }) => {
    const label = agendaTypeLabelOf(type, t, (name as string) || t('agenda'));
    const dateText = dateKeyOf(startedAt) || formatMoment(startedAt);

    return [label, dateText].filter(Boolean).join(' · ') || (id as string);
  });
  const heroStatChips = [
    activityType ? `🎯 ${activityType as string}` : `🎯 ${t('hackathon')}`,
    ...scheduleOverviewPills.slice(0, 4),
  ].filter(Boolean) as string[];
  const countdownUnitLabels = buildCountdownUnitLabels(i18n);
  const heroPrimaryActionLabel = t('hackathon_register_now');
  const scheduleKeyDates = agendaItems
    .slice(0, 6)
    .map(({ id, name, type, startedAt, endedAt }) => {
      const beginText = dateKeyOf(startedAt);
      const endText = dateKeyOf(endedAt);
      const dateLabel =
        beginText && endText && beginText !== endText
          ? `${beginText} - ${endText}`
          : beginText || endText || '-';

      return {
        id: id as string,
        date: dateLabel,
        label: (name as string) || agendaTypeLabelOf(type, t, t('agenda')),
      };
    })
    .filter(({ date, label }) => Boolean(date && label));
  const now = Date.now();
  const nextAgendaItem = agendaItems.find(({ startedAt, endedAt }) => {
    const started = new Date((startedAt as string) || 0).getTime();
    const ended = new Date((endedAt as string) || 0).getTime();

    return Number.isFinite(started) && Number.isFinite(ended) && now <= ended;
  });
  const nextAgendaStarted = nextAgendaItem?.startedAt as string | undefined;
  const nextAgendaEnded = nextAgendaItem?.endedAt as string | undefined;
  const countdownTo =
    (nextAgendaStarted && new Date(nextAgendaStarted).getTime() > now
      ? nextAgendaStarted
      : nextAgendaEnded) ||
    ((startTime as string | undefined) && new Date(startTime as string).getTime() > now
      ? (startTime as string)
      : (endTime as string | undefined));
  const countdownLabel = nextAgendaItem
    ? agendaTypeLabelOf(nextAgendaItem.type, t, t('agenda'))
    : t('event_duration');
  const enrollmentPhase = agendaItems.find(
    ({ type }) => normalizeAgendaType(type) === 'enrollment',
  );
  const formationPhase = agendaItems.find(({ type }) => normalizeAgendaType(type) === 'formation');
  const competitionPhase = agendaItems.find(
    ({ type }) => normalizeAgendaType(type) === 'competition',
  );
  const evaluationPhase = agendaItems.find(
    ({ type }) => normalizeAgendaType(type) === 'evaluation',
  );
  const scheduleNarrativeLead = [
    enrollmentPhase &&
      `${t('enrollment')} ${daysBetween(enrollmentPhase.startedAt, enrollmentPhase.endedAt)}${t('countdown_days')}`,
    formationPhase &&
      `${t('formation')} ${daysBetween(formationPhase.startedAt, formationPhase.endedAt)}${t('countdown_days')}`,
    competitionPhase &&
      `${t('competition')} ${daysBetween(competitionPhase.startedAt, competitionPhase.endedAt)}${t('countdown_days')}`,
    evaluationPhase &&
      `${t('evaluation')} ${daysBetween(evaluationPhase.startedAt, evaluationPhase.endedAt)}${t('countdown_days')}`,
  ]
    .filter(Boolean)
    .join('，');

  const formGroups = FormButtonBar.flatMap<FormGroupView>(key => {
    const list = (formMap[key] || []).filter(isPublicForm);

    return list[0]
      ? [
          {
            key,
            eyebrow: buildFormSectionMeta(i18n)[key].eyebrow,
            title: buildFormSectionMeta(i18n)[key].title,
            description: buildFormSectionMeta(i18n)[key].description,
            links: list.map(({ name, shared_url }) => ({
              label: name as string,
              href: shared_url,
              external: true as const,
            })),
          },
        ]
      : [];
  });
  const primaryForm =
    formGroups.find(({ key }) => key === 'Person') ||
    formGroups.find(({ key }) => key === 'Project') ||
    formGroups[0];
  const secondaryForm =
    formGroups.find(({ key }) => key === 'Project' && key !== primaryForm?.key) ||
    formGroups.find(({ key }) => key !== primaryForm?.key);
  const formPreview =
    formGroups
      .map(({ eyebrow }) => eyebrow)
      .filter(Boolean)
      .slice(0, 2)
      .join(' · ') || t('hackathon_action_hub');
  const actionHubFacts = [
    eventRange || t('event_duration'),
    locationText,
    ...scheduleOverviewPills.slice(0, 2),
    formPreview,
  ]
    .filter(Boolean)
    .slice(0, 4);

  const highlightCards = buildHighlightCards(i18n, {
    agendaItems,
    eventRange,
    organizations,
    prizes,
    templates,
  });

  const scheduleItems = buildScheduleItems(i18n, { agendaItems, locationText });

  const prizeItems = buildPrizeItems(i18n, prizes);

  const organizationItems = buildOrganizationItems(organizations);
  const judgingCriteria = buildJudgingCriteria(i18n);
  const supportAction = organizations.find(({ link }) => Boolean(link))?.link
    ? {
        label: t('hackathon_support_action'),
        href: organizations.find(({ link }) => Boolean(link))!.link as string,
        external: true,
      }
    : undefined;

  const templateItems = buildTemplateItems(i18n, templates);

  const projectItems = buildProjectItems(i18n, { projects, activity });

  const participantItems = buildParticipantItems(people);
  const resourceSummary = previewText(
    [templates[0]?.name, projects[0]?.name, organizations[0]?.name].filter(Boolean),
    t('hackathon_resource_zone_subtitle'),
  );
  const faqItems = buildFAQItems(i18n, {
    eventRange,
    locationText,
    organizationsCount: organizations.length,
    primaryForm,
    projectsCount: projects.length,
    resourceSummary,
    scheduleOverviewPills,
    secondaryForm,
    templatesCount: templates.length,
  });

  return (
    <div
      style={{
        background:
          'radial-gradient(circle at top left, rgba(44, 232, 255, 0.18), transparent 32%),' +
          'radial-gradient(circle at 85% 12%, rgba(255, 120, 186, 0.15), transparent 24%),' +
          'linear-gradient(180deg, #0b1328 0%, #091022 48%, #050814 100%)',
      }}
    >
      <PageHead title={name as string} />

      <HackathonHero
        badges={heroBadges}
        bottomCard={
          agendaItems[0] || agendaItems[agendaItems.length - 1]
            ? {
                eyebrow: t('event_duration'),
                title:
                  eventRange ||
                  [
                    formatMoment(agendaItems[0]?.startedAt),
                    formatMoment(agendaItems[agendaItems.length - 1]?.endedAt),
                  ]
                    .filter(Boolean)
                    .join(' - '),
                description:
                  agendaPreview[0]?.name?.toString() ||
                  agendaTypeLabelOf(agendaItems[0]?.type, t, t('agenda')),
              }
            : undefined
        }
        countdownLabel={countdownLabel}
        countdownUnitLabels={countdownUnitLabels}
        countdownTo={countdownTo}
        description={summaryText}
        image={image}
        imageFallback={(activityType as string) || t('hackathon')}
        locationText={locationText}
        name={name as string}
        navigation={heroNavigation(i18n)}
        primaryAction={
          primaryForm
            ? {
                label: heroPrimaryActionLabel,
                href: primaryForm.links[0].href,
                external: true,
              }
            : { label: heroPrimaryActionLabel, href: '#entry-hub' }
        }
        secondaryAction={{ label: t('agenda'), href: '#schedule' }}
        chips={heroStatChips}
        subtitle={(activityType as string) || t('hackathon_detail')}
        topCard={
          summaryText || activityType
            ? {
                eyebrow: t('event_description'),
                title: compactSummaryOf(
                  summaryText,
                  (activityType as string) || t('hackathon_detail'),
                  36,
                ),
                description: locationText,
              }
            : undefined
        }
        visualChip={(activityType as string) || t('hackathon_detail')}
        visualCopy={eventRange || locationText}
        visualKicker={t('main_visual')}
        visualTitle={compactSummaryOf(summaryText, t('hackathon_detail'), 48)}
      />

      <HackathonOverview
        cards={highlightCards}
        subtitle={t('hackathon_highlights_subtitle')}
        themeSub={summaryText}
        themeText={(activityType as string) || t('hackathon')}
        title={t('hackathon_highlights')}
      />

      {formGroups[0] && (
        <HackathonActionHub
          entries={formGroups.map(({ description, eyebrow, links, title }) => ({
            title,
            description,
            eyebrow,
            links,
            count: links.length,
          }))}
          facts={actionHubFacts}
          primaryAction={
            primaryForm
              ? {
                  label: primaryForm.title,
                  href: primaryForm.links[0].href,
                  external: true,
                }
              : undefined
          }
          primaryDescription={primaryForm?.description || t('hackathon_entry_flow_description')}
          primaryTitle={primaryForm?.title || t('hackathon_entry_flow')}
          subtitle={t('hackathon_entry_flow')}
          title={t('hackathon_action_hub')}
        >
          <HackathonActionHubLink
            action={
              secondaryForm
                ? {
                    label: secondaryForm.title,
                    href: secondaryForm.links[0].href,
                    external: true,
                  }
                : { label: t('agenda'), href: '#schedule' }
            }
            variant="ghost"
          />
        </HackathonActionHub>
      )}

      {scheduleItems[0] && (
        <HackathonSchedule
          items={scheduleItems}
          keyDates={scheduleKeyDates.map(({ date, label }) => ({ date, label }))}
          kicker={t('hackathon_event_schedule')}
          lead={scheduleNarrativeLead || summaryText || (name as string)}
          overviewPills={scheduleOverviewPills}
          phaseLabel={t('hackathon_phase')}
          stageGoalLabel={t('hackathon_schedule_goal_label')}
          subtitle={eventRange || t('event_description')}
          title={t('agenda')}
        />
      )}

      {(prizeItems[0] || organizationItems[0]) && (
        <HackathonAwards
          criteria={judgingCriteria}
          organizations={organizationItems}
          prizes={prizeItems}
          subtitle={t('hackathon_judging_title')}
          supportAction={supportAction}
          supportDescription={summaryText || eventRange || locationText}
          supportEyebrow={t('organizations')}
          supportTitle={previewText(
            organizations.map(({ name }) => name),
            t('organizations'),
          )}
          title={t('prizes')}
        />
      )}

      {faqItems[0] && (
        <HackathonFAQ
          items={faqItems}
          subtitle={t('hackathon_faq_subtitle')}
          title={t('common_questions')}
        />
      )}

      {participantItems[0] && (
        <HackathonParticipants
          initialVisible={8}
          participants={participantItems}
          showLessLabel={t('hackathon_show_less')}
          showMoreLabel={t('hackathon_show_more')}
          subtitle={t('hackathon_people_showcase_subtitle')}
          title={t('hackathon_people_showcase')}
        />
      )}

      {(templateItems[0] || projectItems[0]) && (
        <HackathonResources
          projectInitialVisible={2}
          projectItems={projectItems}
          projectSubtitle={t('products')}
          projectTitle={t('projects')}
          showLessLabel={t('hackathon_show_less')}
          showMoreLabel={t('hackathon_show_more')}
          templateInitialVisible={6}
          templateItems={templateItems}
          templateSubtitle={t('hackathon_resource_zone_subtitle')}
          templateTitle={t('hackathon_resource_zone')}
        />
      )}
    </div>
  );
});

export default HackathonDetail;
