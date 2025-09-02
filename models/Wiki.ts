import { Content, ContentModel } from 'mobx-github';
import { DocumentModel, WikiNodeModel } from 'mobx-lark';
import { DataObject } from 'mobx-restful';

import { lark } from '../pages/api/Lark/core';
import './Base';
import { LarkWikiDomain, LarkWikiId } from './configuration';

export interface XContent extends Content {
  meta?: DataObject;
  children?: XContent[];
}

export const policyContentStore = new ContentModel('fpsig', 'open-source-policy');

export class MyWikiNodeModel extends WikiNodeModel {
  client = lark.client;
}

export const wikiStore = new MyWikiNodeModel(LarkWikiDomain, LarkWikiId);

export class MyDocumentModel extends DocumentModel {
  client = lark.client;
}

export const documentStore = new MyDocumentModel(LarkWikiDomain);
