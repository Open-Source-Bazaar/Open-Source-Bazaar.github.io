import { ContentModel } from 'mobx-github';
import { treeFrom } from 'web-utility';

import './Base';

export const policyContentStore = new ContentModel('fpsig', 'open-source-policy');

// Minimal interface and exports for compatibility
export interface WikiNode {
  name?: string;
  title: string;
  path: string;
  parent_path?: string;
  children?: WikiNode[];
  type?: string;
  size?: number;
  sha?: string;
  url?: string;
  html_url?: string;
  git_url?: string;
  download_url?: string;
  content?: string;
  metadata?: Record<string, string>;
}

export const wikiStore = {
  async getAllContent(): Promise<WikiNode[]> {
    return [];
  },
  async getWikiContent(pathParam: string): Promise<WikiNode> {
    throw new Error('Not implemented');
  }
};