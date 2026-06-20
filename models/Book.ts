export interface BorrowHistory {
  borrower: string;
  borrowDate: string;
  returnDate?: string;
}

export interface BookReview {
  reviewer: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  cover?: string;
  status: 'available' | 'borrowed';
  category: string;
  language: string;
  currentHolder?: string;
  description?: string;
  isbn?: string;
  publisher?: string;
  publishYear?: number;
  pageCount?: number;
  borrowHistory?: BorrowHistory[];
  reviews?: BookReview[];
  rating?: number;
  tags?: string[];
}
