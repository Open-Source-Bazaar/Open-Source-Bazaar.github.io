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
