import { observable } from 'mobx';
import { HTTPClient } from 'koajax';
import { StrapiListModel, Base } from 'mobx-strapi';

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
  year: Array<{ label: string; count: number }>;
  city: Array<{ label: string; count: number }>;
  type: Array<{ label: string; count: number }>;
  tag: Array<{ label: string; count: number }>;
}

// Strapi client configuration
const strapiClient = new HTTPClient({
  baseURI: 'https://china-ngo-db.onrender.com/api/',
  responseType: 'json',
});

export class OrganizationModel extends StrapiListModel<Organization> {
  baseURI = '/organizations';

  constructor() {
    super();
    this.client = strapiClient;
  }

  @observable
  accessor tagMap: Record<string, Organization[]> = {};

  async groupAllByTags(): Promise<Record<string, Organization[]>> {
    try {
      const allData = await this.getAll();
      const tagMap: Record<string, Organization[]> = {};

      for (const org of allData) {
        const tags = org.tags || [];
        for (const tag of tags) {
          if (!tagMap[tag]) {
            tagMap[tag] = [];
          }
          tagMap[tag].push(org);
        }
      }

      this.tagMap = tagMap;
      return tagMap;
    } catch (error) {
      console.error('Failed to fetch organizations:', error);
      return {};
    }
  }
}

export class OrganizationStatisticModel {
  private client: HTTPClient<any>;
  private collection: string;

  constructor(baseId: string, collectionId: string) {
    this.client = new HTTPClient({
      baseURI: 'https://china-ngo-db.onrender.com/api/',
      responseType: 'json',
    });
    this.collection = collectionId;
  }

  async countAll(): Promise<Array<{ label: string; count: number }>> {
    try {
      // This would need to be adapted based on the actual Strapi API structure
      const response = await this.client.get(`${this.collection}`);
      return response.body?.data || [];
    } catch (error) {
      console.error(`Failed to fetch statistics for ${this.collection}:`, error);
      return [];
    }
  }
}

// Mock constants for now - these would be configured based on the actual Strapi setup
export const COMMUNITY_BASE_ID = 'community';
export const OSC_YEAR_STATISTIC_TABLE_ID = 'organization-year-stats';
export const OSC_CITY_STATISTIC_TABLE_ID = 'organization-city-stats';
export const OSC_TYPE_STATISTIC_TABLE_ID = 'organization-type-stats';
export const OSC_TAG_STATISTIC_TABLE_ID = 'organization-tag-stats';