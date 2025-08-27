import { marked } from 'marked';
import { treeFrom } from 'web-utility';
import * as fs from 'fs';
import * as path from 'path';

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
  // Frontmatter fields
  metadata?: Record<string, string>;
  content?: string;
}

export class WikiModel {
  // For now, only use filesystem reading for simplicity

  // Method for build-time static generation
  async getAllContentStatic(): Promise<WikiNode[]> {
    const items: WikiNode[] = [];
    const policyDir = path.join(process.cwd(), 'public/wiki/policy/China/政策');
    
    if (!fs.existsSync(policyDir)) {
      return items;
    }

    const processDirectory = (dir: string, baseDir: string = '') => {
      const files = fs.readdirSync(dir);
      
      for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          const subDir = baseDir ? `${baseDir}/${file}` : file;
          processDirectory(fullPath, subDir);
        } else if (file.endsWith('.md')) {
          const relativePath = baseDir ? `${baseDir}/${file}` : file;
          const pathParts = relativePath.split('/');
          const fileName = pathParts.pop();
          const parent_path = pathParts.length > 0 ? pathParts.join('/') : undefined;
          
          const wikiNode: WikiNode = {
            name: fileName || '',
            path: relativePath.replace('.md', ''),
            parent_path,
            title: fileName?.replace('.md', '') || '',
            type: 'file',
            size: stat.size,
            sha: '',
            url: '',
            html_url: `https://github.com/fpsig/open-source-policy/blob/main/China/政策/${relativePath}`,
            git_url: '',
            download_url: `https://raw.githubusercontent.com/fpsig/open-source-policy/main/China/政策/${relativePath}`,
            content: '',
          };
          
          items.push(wikiNode);
        }
      }
    };

    processDirectory(policyDir);
    return items;
  }

  // Method for all environments - use static reading
  async getAllContent(): Promise<WikiNode[]> {
    return this.getAllContentStatic();
  }

  async getContentTree(): Promise<WikiNode[]> {
    const allContent = await this.getAllContent();
    return treeFrom(allContent, 'path', 'parent_path', 'children');
  }

  async getOne(path: string): Promise<WikiNode> {
    return this.getOneStatic(path);
  }

  // Static method for build-time reading
  async getOneStatic(pathParam: string): Promise<WikiNode> {
    const fullPath = pathParam.endsWith('.md') ? pathParam : `${pathParam}.md`;
    const filePath = path.join(process.cwd(), 'public/wiki/policy/China/政策', fullPath);
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`Content not found at path: ${pathParam}`);
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const stat = fs.statSync(filePath);
    
    // Parse frontmatter
    let metadata: Record<string, string> = {};
    let markdownContent = '';
    
    if (fileContent.startsWith('---\n')) {
      const parts = fileContent.split('\n---\n');
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
      markdownContent = fileContent;
    }

    const pathParts = pathParam.split('/');
    const fileName = pathParts.pop();
    const parent_path = pathParts.length > 0 ? pathParts.join('/') : undefined;

    return {
      name: fileName || '',
      path: pathParam.replace('.md', ''),
      parent_path,
      title: metadata['name'] || fileName?.replace('.md', '') || '',
      type: 'file',
      size: stat.size,
      sha: '',
      url: '',
      html_url: `https://github.com/fpsig/open-source-policy/blob/main/China/政策/${fullPath}`,
      git_url: '',
      download_url: `https://raw.githubusercontent.com/fpsig/open-source-policy/main/China/政策/${fullPath}`,
      content: markdownContent,
      metadata,
    };
  }
}

export const wikiStore = new WikiModel();