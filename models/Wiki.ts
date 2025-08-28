import { ContentModel } from 'mobx-github';
import { treeFrom } from 'web-utility';
import { githubClient } from './Base';

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
  labels?: string[];
}

export const contentStore = new ContentModel('fpsig', 'open-source-policy');

class WikiModel {
  private contentModel = contentStore;

  async getAllContent(): Promise<WikiNode[]> {
    try {
      const items: WikiNode[] = [];
      
      // Use traverseTree to get all markdown files recursively from China/政策
      for await (const item of this.contentModel.traverseTree()) {
        if (item.type === 'file' && item.name.endsWith('.md') && item.path.startsWith('China/政策/')) {
          // Remove the 'China/政策/' prefix to get relative path within wiki
          const relativePath = item.path.replace('China/政策/', '');
          const pathParts = relativePath.split('/');
          const fileName = pathParts.pop();
          const parent_path = pathParts.length > 0 ? pathParts.join('/') : undefined;

          const wikiNode: WikiNode = {
            name: fileName || '',
            path: relativePath.replace('.md', ''),
            parent_path,
            title: fileName?.replace('.md', '') || '',
            type: item.type,
            size: item.size,
            sha: item.sha,
            url: item.url,
            html_url: item.html_url || undefined,
            git_url: item.git_url || undefined,
            download_url: item.download_url || undefined,
            content: '',
            labels: [],
          };

          items.push(wikiNode);
        }
      }

      return items;
    } catch (error) {
      console.error('Error fetching content from GitHub:', error);
      return [];
    }
  }

  async getContentTree(): Promise<WikiNode[]> {
    const allContent = await this.getAllContent();
    return treeFrom(allContent, 'path', 'parent_path', 'children');
  }

  async getWikiContent(pathParam: string): Promise<WikiNode> {
    const fullPath = pathParam.endsWith('.md') ? pathParam : `${pathParam}.md`;
    const filePath = `China/政策/${fullPath}`;

    const item = await this.contentModel.getOne(filePath);
    
    if (!item || item.type !== 'file') {
      throw new Error(`Content not found at path: ${pathParam}`);
    }

    // Decode Base64 content
    const content = item.content ? atob(item.content) : '';
    
    // Parse frontmatter
    let metadata: Record<string, string> = {};
    let markdownContent = '';
    
    if (content.startsWith('---\n')) {
      const parts = content.split('\n---\n');
      if (parts.length >= 2) {
        const frontmatter = parts[0].substring(4); // Remove first '---\n'
        markdownContent = parts.slice(1).join('\n---\n');
        
        // Simple YAML parsing for metadata
        const lines = frontmatter.split('\n');
        for (const line of lines) {
          const [key, ...valueParts] = line.split(': ');
          if (key && valueParts.length > 0) {
            metadata[key.trim()] = valueParts.join(': ').trim();
          }
        }
      }
    } else {
      markdownContent = content;
    }

    const pathParts = pathParam.split('/');
    const fileName = pathParts.pop();
    const parent_path = pathParts.length > 0 ? pathParts.join('/') : undefined;

    return {
      name: fileName || '',
      path: pathParam.replace('.md', ''),
      parent_path,
      title: metadata['name'] || fileName?.replace('.md', '') || '',
      type: item.type,
      size: item.size,
      sha: item.sha,
      url: item.url,
      html_url: item.html_url || undefined,
      git_url: item.git_url || undefined,
      download_url: item.download_url || undefined,
      content: markdownContent,
      metadata,
      labels: [],
    };
  }
}

export const wikiStore = new WikiModel();