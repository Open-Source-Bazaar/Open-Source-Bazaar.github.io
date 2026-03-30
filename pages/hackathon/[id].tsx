import {
  BiTableSchema,
  TableCellLocation,
  TableCellUser,
  TableCellValue,
  TableFormView,
} from 'mobx-lark';
import { observer } from 'mobx-react';
import { cache, compose, errorLogger } from 'next-ssr-middleware';
import { FC, useContext } from 'react';
import { formatDate } from 'web-utility';

import { HackathonActionHub } from '../../components/Activity/Hackathon/HackathonActionHub';
import { HackathonAwards } from '../../components/Activity/Hackathon/HackathonAwards';
import { HackathonHero } from '../../components/Activity/Hackathon/HackathonHero';
import { HackathonOverview } from '../../components/Activity/Hackathon/HackathonOverview';
import { HackathonParticipants } from '../../components/Activity/Hackathon/HackathonParticipants';
import { HackathonResources } from '../../components/Activity/Hackathon/HackathonResources';
import {
  HackathonSchedule,
  HackathonScheduleTone,
} from '../../components/Activity/Hackathon/HackathonSchedule';
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
import { I18nContext, I18nKey } from '../../models/Translation';

const RequiredTableKeys = [
  'Person',
  'Organization',
  'Agenda',
  'Prize',
  'Template',
  'Project',
] as const;

type RequiredTableKey = (typeof RequiredTableKeys)[number];
type FormGroupKey = 'Evaluation' | 'Person' | 'Product' | 'Project';

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

interface FormGroupMeta {
  description: I18nKey;
  eyebrow: I18nKey;
  title: I18nKey;
}

interface FormGroupView {
  description: string;
  eyebrow: string;
  key: FormGroupKey;
  links: { external: true; href: string; label: string }[];
  title: string;
}

const FormButtonBar = ['Person', 'Project', 'Product', 'Evaluation'] as const;

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

const AgendaTypeClassMap: Partial<Record<string, HackathonScheduleTone>> = {
  workshop: 'formation',
  formation: 'formation',
  presentation: 'enrollment',
  enrollment: 'enrollment',
  coding: 'competition',
  competition: 'competition',
  break: 'break',
  ceremony: 'evaluation',
  evaluation: 'evaluation',
};

const AgendaTypeLabelMap: Partial<Record<string, I18nKey>> = {
  workshop: 'workshop',
  presentation: 'presentation',
  coding: 'coding',
  break: 'break',
  ceremony: 'ceremony',
};

const isPublicForm = ({ shared_limit }: TableFormView) =>
  ['anyone_editable'].includes(shared_limit as string);

const formatMoment = (value?: TableCellValue) => (value ? formatDate(value as string) : '');

const formatPeriod = (startedAt?: TableCellValue, endedAt?: TableCellValue) =>
  [formatMoment(startedAt), formatMoment(endedAt)].filter(Boolean).join(' - ');

const previewText = (items: TableCellValue[], fallback: string) =>
  items
    .map(item => item?.toString())
    .filter(Boolean)
    .slice(0, 2)
    .join(' · ') || fallback;

const agendaToneClassOf = (type: TableCellValue, index: number) => {
  const normalized = type?.toString().toLowerCase() || '';
  const fallbackOrder: HackathonScheduleTone[] = [
    'formation',
    'enrollment',
    'competition',
    'break',
    'evaluation',
  ];

  return AgendaTypeClassMap[normalized] || fallbackOrder[index % fallbackOrder.length];
};

const agendaTypeLabelOf = (type: TableCellValue, t: (key: I18nKey) => string, fallback = '-') => {
  const normalized = type?.toString().toLowerCase() || '';
  const i18nKey = AgendaTypeLabelMap[normalized];

  return i18nKey ? t(i18nKey) : type?.toString() || fallback;
};

export const getServerSideProps = compose<{ id: string }>(
  cache(),
  errorLogger,
  async ({ params }) => {
    const activity = await new ActivityModel().getOne(params!.id);
    const schema = activity.databaseSchema as Partial<BiTableSchema> | undefined;
    const tableIdMap = schema?.tableIdMap as Partial<Record<RequiredTableKey, string>> | undefined;

    if (!schema?.appId || !tableIdMap) return { notFound: true, props: {} };

    for (const key of RequiredTableKeys) if (!tableIdMap[key]) return { notFound: true, props: {} };

    const [people, organizations, agenda, prizes, templates, projects] = await Promise.all([
      new PersonModel(schema.appId, tableIdMap.Person).getAll(),
      new OrganizationModel(schema.appId, tableIdMap.Organization).getAll(),
      new AgendaModel(schema.appId, tableIdMap.Agenda).getAll(),
      new PrizeModel(schema.appId, tableIdMap.Prize).getAll(),
      new TemplateModel(schema.appId, tableIdMap.Template).getAll(),
      new ProjectModel(schema.appId, tableIdMap.Project).getAll(),
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
  const forms = ((databaseSchema as Partial<BiTableSchema> | undefined)?.forms || {}) as Partial<
    Record<FormGroupKey, TableFormView[]>
  >;
  const summaryText = (summary as string) || '';
  const agendaItems = [...agenda].sort(
    ({ startedAt: left }, { startedAt: right }) =>
      new Date((left as string) || 0).getTime() - new Date((right as string) || 0).getTime(),
  );
  const hostTags = (host as string[] | undefined)?.slice(0, 2) || [];
  const eventRange = formatPeriod(startTime, endTime);
  const locationText = (location as TableCellLocation | undefined)?.full_address || '-';
  const heroBadges = [
    (activityType as string) || t('hackathon'),
    ...hostTags,
    formatMoment(startTime),
    formatMoment(endTime),
  ].filter((value): value is string => Boolean(value));
  const heroStats = [
    { label: t('participants'), value: people.length },
    { label: t('projects'), value: projects.length },
    { label: t('templates'), value: templates.length },
    { label: t('prizes'), value: prizes.length },
  ];
  const agendaPreview = agendaItems.slice(0, 3);

  const formGroups = FormButtonBar.flatMap<FormGroupView>(key => {
    const list = (forms[key] || []).filter(isPublicForm);

    return list[0]
      ? [
          {
            key,
            eyebrow: t(FormSectionMeta[key].eyebrow),
            title: t(FormSectionMeta[key].title),
            description: t(FormSectionMeta[key].description),
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

  const highlightCards = [
    {
      icon: '👥',
      title: t('participants'),
      value: people.length,
      description: t(FormSectionMeta.Person.description),
    },
    {
      icon: '🚀',
      title: t('projects'),
      value: projects.length,
      description: t(FormSectionMeta.Project.description),
    },
    {
      icon: '🛠',
      title: t('templates'),
      value: templates.length,
      description: previewText(
        templates.map(({ name }) => name),
        t('templates'),
      ),
    },
    {
      icon: '🏆',
      title: t('prizes'),
      value: prizes.length,
      description: previewText(
        prizes.map(({ name }) => name),
        t('hackathon_prizes'),
      ),
    },
    {
      icon: '🤝',
      title: t('organizations'),
      value: organizations.length,
      description: previewText(
        organizations.map(({ name }) => name),
        t('organizations'),
      ),
    },
    {
      icon: '📅',
      title: t('agenda'),
      value: agendaItems.length,
      description: previewText(
        agendaItems.map(({ name }) => name),
        eventRange || t('agenda'),
      ),
    },
  ];

  const scheduleItems = agendaItems.map(
    ({ id, name, type, summary, startedAt, endedAt }, index) => {
      const typeLabel = agendaTypeLabelOf(type, t);
      const description = (summary as string) || typeLabel;

      return {
        id: id as string,
        phase: String(index + 1).padStart(2, '0'),
        dateText: formatPeriod(startedAt, endedAt),
        title: name as string,
        description,
        tone: agendaToneClassOf(type, index),
        facts: [
          { label: t('type'), value: typeLabel, meta: description || eventRange || locationText },
          { label: t('start_time'), value: formatMoment(startedAt), meta: t('event_duration') },
          {
            label: t('end_time'),
            value: formatMoment(endedAt),
            meta: `${t('event_location')}: ${locationText}`,
          },
        ],
      };
    },
  );

  const prizeItems = prizes.map(
    ({ id, name, image, summary, level, sponsor, price, amount }, index) => ({
      id: id as string,
      title: name as string,
      tier: (level as string) || `#${index + 1}`,
      description: (summary as string) || previewText([sponsor, price, amount], t('prizes')),
      image,
      meta: [
        sponsor ? { label: t('sponsor'), value: sponsor as string } : null,
        price ? { label: t('price'), value: price as string } : null,
        amount ? { label: t('amount'), value: amount as string } : null,
      ].filter(Boolean) as { label: string; value: string }[],
    }),
  );

  const organizationItems = organizations.map(({ id, name, link, logo }) => ({
    id: id as string,
    name: name as string,
    href: link as string | undefined,
    logo,
  }));

  const templateItems = templates.map(
    ({ id, name, languages, tags, sourceLink, summary, previewLink }) => ({
      id: id as string,
      title: name as string,
      description: (summary as string) || '',
      languages: ((languages as string[] | undefined) || []).filter(Boolean),
      tags: ((tags as string[] | undefined) || []).filter(Boolean),
      sourceUrl: sourceLink as string | undefined,
      sourceLabel: t('source_code'),
      previewUrl: previewLink as string | undefined,
      previewLabel: t('preview'),
    }),
  );

  const projectItems = projects.map(({ id, name, score, summary, createdBy, members }) => {
    const creator = createdBy as TableCellUser | undefined;
    const scoreText = score === null || score === undefined || score === '' ? '—' : `${score}`;

    return {
      id: id as string,
      title: name as string,
      link: `${ActivityModel.getLink(activity)}/team/${id}`,
      score: scoreText,
      description: (summary as string) || '',
      meta: [
        creator
          ? {
              label: t('created_by'),
              value: creator.name || '—',
              valueHref: creator.email ? `mailto:${creator.email}` : undefined,
            }
          : { label: t('created_by'), value: '—' },
        {
          label: t('members'),
          value: (members as string[] | undefined)?.join(', ') || '—',
        },
      ],
    };
  });

  const participantItems = people.map(({ id, name, avatar, githubLink }) => ({
    id: id as string,
    name: name as string,
    avatar,
    githubLink: githubLink as string | undefined,
  }));

  return (
    <>
      <PageHead title={name as string} />

      <HackathonHero
        badges={heroBadges}
        bottomCard={
          agendaPreview[0]
            ? {
                eyebrow: t('hackathon_agenda_preview'),
                title: agendaPreview[0].name as string,
                description: formatPeriod(agendaPreview[0].startedAt, agendaPreview[0].endedAt),
              }
            : undefined
        }
        description={summaryText}
        image={image}
        imageFallback={(activityType as string) || t('hackathon')}
        locationText={locationText}
        name={name as string}
        primaryAction={
          primaryForm
            ? { label: primaryForm.title, href: primaryForm.links[0].href, external: true }
            : { label: t('hackathon_entry_flow'), href: '#entry-hub' }
        }
        secondaryAction={{ label: t('agenda'), href: '#schedule' }}
        stats={heroStats}
        subtitle={(activityType as string) || t('hackathon_detail')}
        topCard={
          primaryForm
            ? {
                eyebrow: primaryForm.eyebrow,
                title: primaryForm.title,
                description: primaryForm.description,
              }
            : undefined
        }
        visualChip={t('hackathon_detail')}
        visualCopy={summaryText}
        visualKicker={t('event_info')}
        visualTitle={eventRange || summaryText}
      />

      <HackathonOverview
        cards={highlightCards}
        subtitle={t('event_description')}
        themeSub={summaryText}
        themeText={(activityType as string) || t('hackathon')}
        title={t('event_info')}
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
          facts={[eventRange || t('event_duration'), locationText, formPreview]}
          primaryAction={
            primaryForm
              ? { label: primaryForm.title, href: primaryForm.links[0].href, external: true }
              : undefined
          }
          primaryDescription={primaryForm?.description || t('hackathon_entry_flow_description')}
          primaryTitle={primaryForm?.title || t('hackathon_entry_flow')}
          secondaryAction={
            secondaryForm
              ? { label: secondaryForm.title, href: secondaryForm.links[0].href, external: true }
              : { label: t('agenda'), href: '#schedule' }
          }
          subtitle={t('hackathon_entry_flow')}
          title={t('hackathon_action_hub')}
        />
      )}

      {scheduleItems[0] && (
        <HackathonSchedule
          items={scheduleItems}
          kicker={eventRange}
          lead={name as string}
          overviewPills={agendaItems.slice(0, 6).map(({ name }) => name as string)}
          phaseLabel={t('hackathon_phase')}
          subtitle={t('event_duration')}
          title={t('agenda')}
        />
      )}

      {(prizeItems[0] || organizationItems[0]) && (
        <HackathonAwards
          organizations={organizationItems}
          prizes={prizeItems}
          subtitle={t('hackathon_prizes')}
          supportDescription={summaryText}
          supportEyebrow={t('organizations')}
          supportTitle={previewText(
            organizations.map(({ name }) => name),
            t('organizations'),
          )}
          title={t('prizes')}
        />
      )}

      {(templateItems[0] || projectItems[0]) && (
        <HackathonResources
          projectItems={projectItems}
          projectSubtitle={t('products')}
          projectTitle={t('projects')}
          templateItems={templateItems}
          templateSubtitle={t('source_code')}
          templateTitle={t('templates')}
        />
      )}

      {participantItems[0] && (
        <HackathonParticipants
          participants={participantItems}
          subtitle={t('github_account')}
          title={t('participants')}
        />
      )}
    </>
  );
});

export default HackathonDetail;
