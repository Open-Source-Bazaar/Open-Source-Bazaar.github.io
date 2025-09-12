import { observable } from 'mobx';
import { StrapiListModel, Base } from 'mobx-strapi';
import { groupBy } from 'web-utility';

import { strapiClient } from './Base';

// Define the organization data structure similar to China NGO database
export interface Organization extends Base {
  name: string;
  description?: string;
  type?: string;
  city?: string;
  province?: string;
  tags?: string[];
  website?: string;
  logo?: {
    data?: {
      attributes: {
        url: string;
      };
    };
  };
  year?: number;
}

export interface OrganizationStatistic {
  year: { label: string; count: number }[];
  city: { label: string; count: number }[];
  type: { label: string; count: number }[];
  tag: { label: string; count: number }[];
}

export class OrganizationModel extends StrapiListModel<Organization> {
  baseURI = 'organizations';
  client = strapiClient;

  @observable
  accessor categoryMap: Record<string, Organization[]> = {};

  async groupAllByTags() {
    const allData = await this.getAll();

    return (this.categoryMap = groupBy(allData, item => item.tags?.[0] || 'Other'));
  }
}