import { Filter, ListModel } from 'mobx-restful';

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

let bookListCache: Book[] | undefined;

export class SearchBookModel extends ListModel<Book, SearchBookFilter> {
  client = ownClient;
  baseURI = 'open-library/books';

  async loadPage(page = this.pageIndex, pageSize = this.pageSize, { keywords = '' } = {}) {
    const body = bookListCache || (await this.client.get<Book[]>(this.baseURI)).body || [];

    bookListCache = body;

    const normalizedKeyword = keywords.trim().toLowerCase();
    const bookList = normalizedKeyword
      ? body.filter(({ title, author, category, language, description, isbn, tags = [] }) =>
          [title, author, category, language, description, isbn, ...tags].some(field =>
            field?.toLowerCase().includes(normalizedKeyword),
          ),
        )
      : body;
    const pageData = bookList.slice((page - 1) * pageSize, page * pageSize);

    return { pageData, totalCount: bookList.length };
  }
}
