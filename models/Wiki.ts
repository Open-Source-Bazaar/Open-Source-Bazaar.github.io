import { Content, ContentModel } from 'mobx-github';
import { DataObject } from 'mobx-restful';

import './Base';

export interface XContent extends Content {
  meta?: DataObject;
  children?: XContent[];
}

export const policyContentStore = new ContentModel('fpsig', 'open-source-policy');
