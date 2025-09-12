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
  accessor tagMap: Record<string, Organization[]> = {};

  async groupAllByTags(): Promise<Record<string, Organization[]>> {
    const allData = await this.getAll();
    const tagMap = groupBy(
      allData.flatMap(org => 
        (org.tags || []).map(tag => ({ tag, org }))
      ),
      'tag'
    );
    
    const result: Record<string, Organization[]> = {};
    for (const [tag, items] of Object.entries(tagMap)) {
      result[tag] = items.map(item => item.org);
    }
    
    this.tagMap = result;
    return result;
  }
}