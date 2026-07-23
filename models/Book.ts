import {
  BiDataQueryOptions,
  BiDataTable,
  BiSearch,
  normalizeText,
  normalizeTextArray,
  TableCellLink,
} from 'mobx-lark';
import { DataObject } from 'mobx-restful';

import { fileURLOf, larkClient } from './Base';
import { BookTableId, LarkBitableId } from './configuration';

export interface BorrowHistory
  extends Record<'borrower' | 'borrowDate', string>, Partial<Record<'returnDate', string>> {}

export interface BookReview extends Record<'reviewer' | 'comment' | 'date', string> {
  rating: number;
}

export interface Book
  extends
    Record<'title' | 'isbn' | 'authors' | 'summary' | 'recommendation', string>,
    Partial<Record<'cover' | 'currentHolder' | 'category' | 'language' | 'publisher', string>> {
  id: string;
  amount?: number;
  donors?: string[];
  keepers?: string[];
  keeperEmails?: string[];
  link?: string;
  status: 'available' | 'borrowed';
  publishYear?: number;
  pageCount?: number;
  borrowHistory?: BorrowHistory[];
  reviews?: BookReview[];
  rating?: number;
  tags?: string[];
}

const DefaultBookAmount = 1;

export class BookModel extends BiDataTable<Book>() {
  client = larkClient;

  queryOptions: BiDataQueryOptions = { text_field_as_array: false };

  constructor(appId = LarkBitableId, tableId = BookTableId) {
    super(appId, tableId);
  }

  /** Normalize Lark book records into the shared book card/detail shape used by Open Library pages. */
  mapFields({ fields, id, ...meta }: { fields: DataObject; id: string }): Book {
    const { amount, authors, cover, donors, keepers, keeperEmails, link, summary, tags, ...rest } =
      fields;
    const normalizedTags = normalizeTextArray(tags) || [];
    const normalizedKeepers = normalizeTextArray(keepers) || [];
    const totalAmount = Number(amount) || DefaultBookAmount;
    const status = normalizedKeepers.length < totalAmount ? 'available' : 'borrowed';

    return {
      ...meta,
      id,
      ...(rest as Omit<Book, 'id'>),
      amount: Number(amount) || undefined,
      authors: normalizeText(authors),
      cover: cover ? fileURLOf(cover, true) : undefined,
      currentHolder: normalizedKeepers.join(', ') || undefined,
      donors: normalizeTextArray(donors) || [],
      keepers: normalizedKeepers,
      keeperEmails: normalizeTextArray(keeperEmails) || [],
      link: (link as TableCellLink)?.link,
      status,
      summary: normalizeText(summary),
      tags: normalizedTags,
    };
  }
}

export class SearchBookModel extends BiSearch<Book>(BookModel) {
  searchKeys = [
    'title',
    'isbn',
    'authors',
    'summary',
    'recommendation',
    'tags',
    'donors',
    'keepers',
  ];
}
