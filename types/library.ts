export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  description: string;
  category: BookCategory;
  status: BookStatus;
  borrower?: string;
  borrowDate?: string;
  returnDate?: string;
  publisher?: string;
  year?: number;
  isbn?: string;
  pages?: number;
  language?: string;
  tags?: string[];
}

export type BookCategory = 'open-source' | 'programming' | 'community' | 'design' | 'business';

export type BookStatus = 'available' | 'borrowed';
