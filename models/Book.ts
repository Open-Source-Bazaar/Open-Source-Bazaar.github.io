import { BiDataQueryOptions, BiDataTable, BiSearch } from 'mobx-lark';

import { larkClient } from './Base';
import { BookTableId, LibraryBaseId } from './configuration';

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

export class BookModel extends BiDataTable<Book>() {
  client = larkClient;

  queryOptions: BiDataQueryOptions = { text_field_as_array: false };

  constructor(appId = LibraryBaseId, tableId = BookTableId) {
    super(appId, tableId);
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
