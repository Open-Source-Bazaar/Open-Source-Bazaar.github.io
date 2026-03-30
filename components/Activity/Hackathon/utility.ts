import { TableCellValue, TableFormView } from 'mobx-lark';
import { formatDate } from 'web-utility';

import type { HackathonScheduleTone } from './Schedule';
import { i18n, I18nKey } from '../../../models/Translation';

export const AgendaTypeClassMap: Partial<Record<string, HackathonScheduleTone>> = {
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

export const buildAgendaTypeLabelMap = ({
  t,
}: Pick<typeof i18n, 't'>): Partial<Record<string, string>> => ({
  workshop: t('workshop'),
  presentation: t('presentation'),
  coding: t('coding'),
  break: t('break'),
  ceremony: t('ceremony'),
  enrollment: t('enrollment'),
  formation: t('formation'),
  competition: t('competition'),
  evaluation: t('evaluation'),
});

export const isPublicForm = ({ shared_limit }: TableFormView) =>
  ['anyone_editable'].includes(shared_limit as string);

export const formatMoment = (value?: TableCellValue) => (value ? formatDate(value as string) : '');

export const formatPeriod = (startedAt?: TableCellValue, endedAt?: TableCellValue) =>
  [formatMoment(startedAt), formatMoment(endedAt)].filter(Boolean).join(' - ');

export const previewText = (items: TableCellValue[], fallback: string) =>
  items
    .map(item => item?.toString())
    .filter(Boolean)
    .slice(0, 2)
    .join(' · ') || fallback;

export const agendaToneClassOf = (type: TableCellValue, index: number) => {
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

export const agendaTypeLabelOf = (
  type: TableCellValue,
  t: (key: I18nKey) => string,
  fallback = '-',
) => {
  const normalized = type?.toString().toLowerCase() || '';

  return buildAgendaTypeLabelMap({ t })[normalized] || type?.toString() || fallback;
};

export const compactSummaryOf = (
  text: TableCellValue | string[] | string | undefined,
  fallback: string,
  limit = 96,
) => {
  const source = Array.isArray(text)
    ? text
        .map(item => item?.toString())
        .filter(Boolean)
        .join(' · ')
    : text?.toString() || '';
  const normalized = source.replace(/\s+/g, ' ').trim();

  if (!normalized) return fallback;

  return normalized.length > limit ? `${normalized.slice(0, limit).trim()}...` : normalized;
};

export const dateKeyOf = (value?: TableCellValue) => {
  const dateText = formatMoment(value);

  return dateText ? dateText.slice(5, 10).replace(/\//g, '-') : '';
};

export const compactDateKeyOf = (value?: TableCellValue) => dateKeyOf(value).replace('-', '.');

export const daysBetween = (startedAt?: TableCellValue, endedAt?: TableCellValue) => {
  const start = new Date((startedAt as string) || '').getTime();
  const end = new Date((endedAt as string) || '').getTime();

  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) return 0;

  return Math.max(1, Math.ceil((end - start) / (24 * 60 * 60 * 1000)));
};

export const normalizeAgendaType = (value?: TableCellValue) =>
  value?.toString().toLowerCase() || '';
