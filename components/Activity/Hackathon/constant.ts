import { TableCellUser } from 'mobx-lark';

import { Activity, ActivityModel } from '../../../models/Activity';
import { Agenda, Organization, Person, Prize, Project, Template } from '../../../models/Hackathon';
import { i18n } from '../../../models/Translation';
import type { HackathonAwardsMeta } from './Awards';
import type { HackathonFAQItem } from './FAQ';
import { HackathonHeroCard, HackathonHeroNavItem } from './Hero';
import {
  agendaToneClassOf,
  agendaTypeLabelOf,
  compactSummaryOf,
  formatPeriod,
  normalizeAgendaType,
  previewText,
} from './utility';

export const RequiredTableKeys = [
  'Person',
  'Organization',
  'Agenda',
  'Prize',
  'Template',
  'Project',
] as const;

export type RequiredTableKey = (typeof RequiredTableKeys)[number];

export type FormGroupKey = 'Evaluation' | 'Person' | 'Product' | 'Project';

export interface FormGroupView extends HackathonHeroCard {
  key: FormGroupKey;
  links: (HackathonHeroNavItem & { external: true })[];
}

export const FormButtonBar = ['Person', 'Project', 'Product', 'Evaluation'] as const;

export const buildFormSectionMeta = ({ t }: Pick<typeof i18n, 't'>) => ({
  Person: {
    eyebrow: t('participants'),
    title: t('hackathon_participant_registration'),
    description: t('hackathon_participant_registration_description'),
  },
  Project: {
    eyebrow: t('hackathon_team_lead'),
    title: t('hackathon_project_registration'),
    description: t('hackathon_project_registration_description'),
  },
  Product: {
    eyebrow: t('hackathon_submission'),
    title: t('product_submission'),
    description: t('hackathon_product_submission_description'),
  },
  Evaluation: {
    eyebrow: t('hackathon_review'),
    title: t('hackathon_evaluation_entry'),
    description: t('hackathon_evaluation_entry_description'),
  },
});

export const buildScheduleReasonMap = ({
  t,
}: Pick<typeof i18n, 't'>): Partial<Record<string, string>> => ({
  enrollment: t('hackathon_schedule_reason_enrollment'),
  formation: t('hackathon_schedule_reason_formation'),
  competition: t('hackathon_schedule_reason_competition'),
  evaluation: t('hackathon_schedule_reason_evaluation'),
});

export const buildScheduleFocusMap = ({
  t,
}: Pick<typeof i18n, 't'>): Partial<Record<string, string>> => ({
  enrollment: t('hackathon_schedule_focus_enrollment'),
  formation: t('hackathon_schedule_focus_formation'),
  competition: t('hackathon_schedule_focus_competition'),
  evaluation: t('hackathon_schedule_focus_evaluation'),
});

export const buildScheduleGoalMap = ({
  t,
}: Pick<typeof i18n, 't'>): Partial<Record<string, string>> => ({
  enrollment: t('hackathon_schedule_goal_enrollment'),
  formation: t('hackathon_schedule_goal_formation'),
  competition: t('hackathon_schedule_goal_competition'),
  evaluation: t('hackathon_schedule_goal_evaluation'),
});

export const heroNavigation = ({ t }: typeof i18n) => [
  { href: '#tracks', label: t('hackathon_highlights') },
  { href: '#schedule', label: t('agenda') },
  { href: '#awards', label: t('prizes') },
  { href: '#faq', label: t('common_questions') },
];

export const buildCountdownUnitLabels = ({ t }: typeof i18n) => [
  t('countdown_days'),
  t('countdown_hours'),
  t('countdown_minutes'),
  t('countdown_seconds'),
];

export const buildHighlightCards = (
  { t }: typeof i18n,
  {
    agendaItems,
    eventRange,
    organizations,
    prizes,
    templates,
  }: {
    agendaItems: Agenda[];
    eventRange: string;
    organizations: Organization[];
    prizes: Prize[];
    templates: Template[];
  },
) => [
  {
    icon: '👥',
    title: t('participants'),
    description: buildFormSectionMeta({ t }).Person.description,
  },
  {
    icon: '🚀',
    title: t('projects'),
    description: buildFormSectionMeta({ t }).Project.description,
  },
  {
    icon: '🛠',
    title: t('templates'),
    description: previewText(
      templates.map(({ name }) => name),
      t('templates'),
    ),
  },
  {
    icon: '🏆',
    title: t('prizes'),
    description: previewText(
      prizes.map(({ name }) => name),
      t('hackathon_prizes'),
    ),
  },
  {
    icon: '🤝',
    title: t('organizations'),
    description: previewText(
      organizations.map(({ name }) => name),
      t('organizations'),
    ),
  },
  {
    icon: '📅',
    title: t('agenda'),
    description: previewText(
      agendaItems.map(({ name }) => name),
      eventRange || t('agenda'),
    ),
  },
];

export const buildJudgingCriteria = ({ t }: typeof i18n) => [
  {
    id: 'innovation',
    weight: '30%',
    title: t('hackathon_criteria_innovation_title'),
    description: t('hackathon_criteria_innovation_desc'),
  },
  {
    id: 'technical_depth',
    weight: '25%',
    title: t('hackathon_criteria_technical_title'),
    description: t('hackathon_criteria_technical_desc'),
  },
  {
    id: 'completion',
    weight: '25%',
    title: t('hackathon_criteria_completion_title'),
    description: t('hackathon_criteria_completion_desc'),
  },
  {
    id: 'presentation',
    weight: '20%',
    title: t('hackathon_criteria_presentation_title'),
    description: t('hackathon_criteria_presentation_desc'),
  },
];
export const buildScheduleItems = (
  { t }: typeof i18n,
  { agendaItems, locationText }: { agendaItems: Agenda[]; locationText: string },
) => {
  const scheduleReasonMap = buildScheduleReasonMap({ t });
  const scheduleFocusMap = buildScheduleFocusMap({ t });
  const scheduleGoalMap = buildScheduleGoalMap({ t });

  return agendaItems.map(({ id, name, type, summary, startedAt, endedAt }, index) => {
    const normalizedType = normalizeAgendaType(type);
    const typeLabel = agendaTypeLabelOf(type, t);
    const reasonText = scheduleReasonMap[normalizedType] ?? t('hackathon_schedule_reason_default');
    const focusText = scheduleFocusMap[normalizedType] ?? t('hackathon_schedule_focus_default');
    const stageGoalText = scheduleGoalMap[normalizedType] ?? t('hackathon_schedule_goal_default');
    const description = compactSummaryOf((summary as string) || reasonText, reasonText, 120);
    const windowValue = formatPeriod(startedAt, endedAt) || '-';
    const focusValue = compactSummaryOf((summary as string) || focusText, focusText, 92);

    return {
      id: id as string,
      phase: String(index + 1).padStart(2, '0'),
      dateText: formatPeriod(startedAt, endedAt),
      title: name as string,
      description,
      stageGoal: stageGoalText,
      tone: agendaToneClassOf(type, index),
      facts: [
        {
          label: t('hackathon_schedule_window_label'),
          value: windowValue,
          meta: `${typeLabel} · ${locationText}`,
        },
        {
          label: t('hackathon_schedule_reason_label'),
          value: reasonText,
          meta: t('hackathon_schedule_reason_meta'),
        },
        {
          label: t('hackathon_schedule_focus_label'),
          value: focusValue,
          meta: t('hackathon_schedule_focus_meta'),
        },
      ],
    };
  });
};

export const buildPrizeItems = ({ t }: typeof i18n, prizes: Prize[]) =>
  prizes.map(({ id, name, image, summary, level, sponsor, price, amount }, index) => ({
    id: id as string,
    title: name as string,
    tier: (level as string) || `#${index + 1}`,
    description: (summary as string) || previewText([sponsor, price, amount], t('prizes')),
    image,
    meta: [
      sponsor ? { label: t('sponsor'), value: sponsor as string } : null,
      price ? { label: t('price'), value: price as string } : null,
      amount ? { label: t('amount'), value: amount as string } : null,
    ].filter(Boolean) as HackathonAwardsMeta[],
  }));

export const buildOrganizationItems = (organizations: Organization[]) =>
  organizations.map(({ id, name, link, logo }) => ({
    id: id as string,
    name: name as string,
    href: link as string | undefined,
    logo,
  }));

export const buildTemplateItems = ({ t }: typeof i18n, templates: Template[]) =>
  templates.map(({ id, name, languages, tags, sourceLink, summary, previewLink }) => ({
    id: id as string,
    title: name as string,
    description: (summary as string) || '',
    languages: ((languages as string[] | undefined) || []).filter(Boolean),
    tags: ((tags as string[] | undefined) || []).filter(Boolean),
    sourceUrl: sourceLink as string | undefined,
    sourceLabel: t('source_code'),
    previewUrl: previewLink as string | undefined,
    previewLabel: t('preview'),
  }));

export const buildParticipantItems = (people: Person[]) =>
  people.map(({ id, name, avatar, githubLink }) => ({
    id: id as string,
    name: name as string,
    avatar,
    githubLink: githubLink as string | undefined,
  }));

export const buildFAQItems = (
  { t }: typeof i18n,
  {
    eventRange,
    locationText,
    organizationsCount,
    primaryForm,
    projectsCount,
    resourceSummary,
    scheduleOverviewPills,
    secondaryForm,
    templatesCount,
  }: {
    eventRange: string;
    locationText: string;
    organizationsCount: number;
    primaryForm?: FormGroupView;
    projectsCount: number;
    resourceSummary: string;
    scheduleOverviewPills: string[];
    secondaryForm?: FormGroupView;
    templatesCount: number;
  },
): HackathonFAQItem[] =>
  [
    primaryForm
      ? {
          id: 'registration',
          question: t('hackathon_faq_registration_question'),
          answer: `${t('hackathon_faq_registration_answer_prefix')}${primaryForm.title}。${primaryForm.description}`,
        }
      : null,
    {
      id: 'schedule',
      question: t('hackathon_faq_schedule_question'),
      answer: [eventRange, ...scheduleOverviewPills.slice(0, 3)].filter(Boolean).join(' · '),
    },
    {
      id: 'location',
      question: t('hackathon_faq_location_question'),
      answer: `${t('event_location')}：${locationText}`,
    },
    {
      id: 'resources',
      question: t('hackathon_faq_resources_question'),
      answer: `${t('templates')} ${templatesCount} · ${t('projects')} ${projectsCount} · ${t('organizations')} ${organizationsCount}。${resourceSummary}`,
    },
    secondaryForm
      ? {
          id: 'submission',
          question: t('hackathon_faq_submission_question'),
          answer: `${t('hackathon_faq_submission_answer_prefix')}${secondaryForm.title}。${secondaryForm.description}`,
        }
      : null,
  ].filter(Boolean) as HackathonFAQItem[];

export const buildProjectItems = (
  { t }: typeof i18n,
  { projects, activity }: { projects: Project[]; activity: Activity },
) =>
  projects.map(({ id, name, score, summary, createdBy, members }) => {
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
