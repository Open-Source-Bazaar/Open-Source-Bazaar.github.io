import { Filter, ListModel } from 'mobx-restful';
import { buildURLData } from 'web-utility';

import { ownClient } from './Base';

export interface BorrowHistory
  extends Record<'borrower' | 'borrowDate', string>, Partial<Record<'returnDate', string>> {}

export interface BookReview extends Record<'reviewer' | 'comment' | 'date', string> {
  rating: number;
}

export interface Book
  extends
    Record<'title' | 'author' | 'status' | 'category' | 'language', string>,
    Partial<Record<'cover' | 'currentHolder' | 'description' | 'isbn' | 'publisher', string>> {
  id: number;
  status: 'available' | 'borrowed';
  publishYear?: number;
  pageCount?: number;
  borrowHistory?: BorrowHistory[];
  reviews?: BookReview[];
  rating?: number;
  tags?: string[];
}

export type SearchBookFilter = Filter<Book> & { keywords?: string };

export interface SearchBookPage {
  data: Book[];
  totalCount: number;
}

export class SearchBookModel extends ListModel<Book, SearchBookFilter> {
  client = ownClient;
  baseURI = 'open-library/books';

  async loadPage(
    page = this.pageIndex,
    pageSize = this.pageSize,
    { keywords = '' }: SearchBookFilter = {},
  ) {
    const { body } = await this.client.get<SearchBookPage>(
      `${this.baseURI}?${buildURLData({ keywords, page, pageSize })}`,
    );
    if (!body) throw new Error('Open Library book search API returned an empty response');

    return { pageData: body.data, totalCount: body.totalCount };
  }
}
