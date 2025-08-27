import { Issue, RepositoryModel } from 'mobx-github';
import { Filter, ListModel } from 'mobx-restful';
import { buildURLData } from 'web-utility';

import { githubClient, GithubSearchData, makeGithubSearchCondition } from './Base';

export interface WikiNode {
  id: number;
  title: string;
  body: string;
  html_url: string;
  created_at: string;
  updated_at: string;
  labels: string[];
  number: number;
  repository?: {
    name: string;
    full_name: string;
  };
}

export type WikiFilter = Filter<WikiNode>;

export class WikiModel extends ListModel<WikiNode, WikiFilter> {
  baseURI = 'search/issues';
  client = githubClient;

  async loadPage(
    page = this.pageIndex,
    per_page = this.pageSize,
    filter: WikiFilter = {},
  ) {
    // Search for issues labeled as 'wiki' or 'policy' in the Open-Source-Bazaar organization
    const searchQuery = [
      'org:Open-Source-Bazaar',
      'is:issue',
      'label:wiki OR label:policy',
      'state:open',
    ].join(' ');

    const { body } = await this.client.get<GithubSearchData<Issue>>(
      `${this.baseURI}?${buildURLData({ 
        page, 
        per_page, 
        q: searchQuery,
        sort: 'updated',
        order: 'desc'
      })}`,
    );

    const items: WikiNode[] = body!.items.map(issue => ({
      id: issue.id,
      title: issue.title,
      body: issue.body || '',
      html_url: issue.html_url,
      created_at: issue.created_at,
      updated_at: issue.updated_at,
      labels: issue.labels.map(label => typeof label === 'string' ? label : label.name || ''),
      number: issue.number,
      repository: issue.repository ? {
        name: issue.repository.name,
        full_name: issue.repository.full_name,
      } : undefined,
    }));

    return { pageData: items, totalCount: body!.total_count };
  }

  async getAll(): Promise<WikiNode[]> {
    const { pageData } = await this.loadPage(1, 100);
    return pageData;
  }

  async getOne(id: string | number): Promise<WikiNode> {
    const all = await this.getAll();
    const found = all.find(item => item.id.toString() === id.toString() || item.number.toString() === id.toString());
    if (!found) {
      throw new Error(`Wiki node with id ${id} not found`);
    }
    return found;
  }
}

export const wikiStore = new WikiModel();