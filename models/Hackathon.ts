// Hackathon data types and mock data generator

import {
  BiDataQueryOptions,
  BiDataTable,
  normalizeText,
  TableCellRelation,
  TableCellText,
  TableCellUser,
  TableCellValue,
  TableRecord,
} from 'mobx-lark';

import { LarkBase, larkClient } from './Base';

export type Agenda = LarkBase &
  Record<'summary' | 'name' | 'type' | 'startedAt' | 'endedAt', TableCellValue>;

export class AgendaModel extends BiDataTable<Agenda>() {
  client = larkClient;

  queryOptions: BiDataQueryOptions = { text_field_as_array: false };

  extractFields({ fields: { summary, ...fields }, ...meta }: TableRecord<Agenda>) {
    return {
      ...meta,
      ...fields,
      summary: (summary as TableCellText[])!.map(normalizeText),
    };
  }
}

export type Person = LarkBase &
  Record<
    | 'name'
    | 'avatar'
    | 'gender'
    | 'age'
    | 'address'
    | 'organizations'
    | 'skills'
    | 'githubLink'
    | 'githubAccount'
    | 'createdBy',
    TableCellValue
  >;

export class PersonModel extends BiDataTable<Person>() {
  client = larkClient;

  queryOptions: BiDataQueryOptions = { text_field_as_array: false };

  extractFields({ fields: { githubLink, ...fields }, ...meta }: TableRecord<Person>) {
    return {
      ...meta,
      ...fields,
      githubLink: normalizeText(githubLink as TableCellText),
    };
  }
}

export type Organization = LarkBase &
  Record<'name' | 'logo' | 'link' | 'members' | 'prizes', TableCellValue>;

export class OrganizationModel extends BiDataTable<Organization>() {
  client = larkClient;

  queryOptions: BiDataQueryOptions = { text_field_as_array: false };

  extractFields({ fields: { link, ...fields }, ...meta }: TableRecord<Organization>) {
    return {
      ...meta,
      ...fields,
      link: normalizeText(link as TableCellText),
    };
  }
}

export type Prize = LarkBase &
  Record<
    | 'summary'
    | 'name'
    | 'image'
    | 'price'
    | 'amount'
    | 'level'
    | `${'start' | 'end'}Rank`
    | 'sponsor',
    TableCellValue
  >;

export class PrizeModel extends BiDataTable<Prize>() {
  client = larkClient;

  queryOptions: BiDataQueryOptions = { text_field_as_array: false };
}

export type Template = LarkBase &
  Record<
    'name' | 'languages' | 'tags' | 'summary' | `${'source' | 'preview'}Link` | 'products',
    TableCellValue
  >;

export class TemplateModel extends BiDataTable<Template>() {
  client = larkClient;

  queryOptions: BiDataQueryOptions = { text_field_as_array: false };

  extractFields({
    fields: { languages, tags, sourceLink, previewLink, ...fields },
    ...meta
  }: TableRecord<Template>) {
    return {
      ...meta,
      ...fields,
      languages: languages?.toString().split(/\s*,\s*/) || [],
      tags: tags?.toString().split(/\s*,\s*/) || [],
      sourceLink: normalizeText(sourceLink as TableCellText),
      previewLink: normalizeText(previewLink as TableCellText),
    };
  }
}

export type Project = LarkBase &
  Record<
    'name' | 'summary' | 'group' | 'members' | 'products' | 'score' | 'rank' | 'prize',
    TableCellValue
  >;

export class ProjectModel extends BiDataTable<Project>() {
  client = larkClient;

  queryOptions: BiDataQueryOptions = { text_field_as_array: false };

  extractFields({ fields: { members, products, ...fields }, ...meta }: TableRecord<Project>) {
    return {
      ...meta,
      ...fields,
      members: (members as TableCellRelation[])?.map(normalizeText),
      products: (products as TableCellRelation[])?.map(normalizeText),
    };
  }
}

export type Member = LarkBase &
  Record<'summary' | 'person' | 'skills' | 'githubAccount' | 'project' | 'status', TableCellValue>;

export class MemberModel extends BiDataTable<Member>() {
  client = larkClient;

  queryOptions: BiDataQueryOptions = { text_field_as_array: false };

  extractFields({
    fields: { summary, person, skills, githubAccount, ...fields },
    ...meta
  }: TableRecord<Member>) {
    return {
      ...meta,
      ...fields,
      person: (person as TableCellUser[])?.[0],
      summary: (summary as TableCellText[])!.map(normalizeText),
      skills: skills?.toString().split(/\s*,\s*/) || [],
      githubAccount: normalizeText(githubAccount as TableCellText),
    };
  }
}

export type Product = LarkBase &
  Record<
    'name' | 'project' | 'template' | 'link' | 'sourceLink' | 'file' | 'summary',
    TableCellValue
  >;

export class ProductModel extends BiDataTable<Product>() {
  client = larkClient;

  queryOptions: BiDataQueryOptions = { text_field_as_array: false };

  extractFields({ fields: { link, sourceLink, ...fields }, ...meta }: TableRecord<Product>) {
    return {
      ...meta,
      ...fields,
      link: normalizeText(link as TableCellText),
      sourceLink: normalizeText(sourceLink as TableCellText),
    };
  }
}
