import type { NextApiRequest, NextApiResponse } from 'next';

import type { Book, SearchBookPage } from '../../../models/Book';

export const openLibraryBooks: Book[] = [
  {
    id: 1,
    title: 'Clean Code',
    author: 'Robert C. Martin',
    cover: '/images/placeholder-book.svg',
    category: 'Programming',
    language: 'English',
    status: 'available',
    description: 'A handbook of agile software craftsmanship',
    isbn: '9780132350884',
    publisher: 'Prentice Hall',
    publishYear: 2008,
    pageCount: 464,
    borrowHistory: [
      {
        borrower: 'Wang Chen',
        borrowDate: '2023-10-15',
        returnDate: '2023-11-20',
      },
      {
        borrower: 'Li Mei',
        borrowDate: '2023-08-01',
        returnDate: '2023-09-05',
      },
    ],
    reviews: [
      {
        reviewer: 'Wang Chen',
        rating: 5,
        comment:
          'This book completely changed how I approach writing code. Highly recommended for all developers!',
        date: '2023-11-25',
      },
      {
        reviewer: 'Li Mei',
        rating: 4,
        comment:
          'Great principles that have stood the test of time. Some examples are a bit dated but the concepts are solid.',
        date: '2023-09-10',
      },
    ],
  },
  {
    id: 2,
    title: 'Eloquent JavaScript',
    author: 'Marijn Haverbeke',
    cover: '/images/placeholder-book.svg',
    category: 'Programming',
    language: 'English',
    status: 'borrowed',
    currentHolder: 'Zhang Wei',
    description: 'A modern introduction to programming',
    isbn: '9781593279509',
    publisher: 'No Starch Press',
    publishYear: 2018,
    pageCount: 472,
    borrowHistory: [
      {
        borrower: 'Zhang Wei',
        borrowDate: '2024-03-10',
      },
    ],
    reviews: [
      {
        reviewer: 'Liu Jie',
        rating: 5,
        comment:
          'Perfect for beginners and intermediate JavaScript developers. The exercises are particularly helpful.',
        date: '2023-12-05',
      },
    ],
  },
  {
    id: 3,
    title: 'The Pragmatic Programmer',
    author: 'Andrew Hunt & David Thomas',
    cover: '/images/placeholder-book.svg',
    category: 'Programming',
    language: 'English',
    status: 'available',
    description: 'Your journey to mastery',
    isbn: '9780201616224',
    publisher: 'Addison-Wesley Professional',
    publishYear: 1999,
    pageCount: 352,
    borrowHistory: [
      {
        borrower: 'Chen Ming',
        borrowDate: '2023-06-15',
        returnDate: '2023-07-20',
      },
    ],
    reviews: [
      {
        reviewer: 'Chen Ming',
        rating: 4,
        comment:
          'A classic that has stood the test of time. The advice is still practical for teams of all sizes.',
        date: '2023-07-25',
      },
    ],
  },
  {
    id: 4,
    title: "You Don't Know JS",
    author: 'Kyle Simpson',
    cover: '/images/placeholder-book.svg',
    category: 'Programming',
    language: 'English',
    status: 'borrowed',
    currentHolder: 'Jane Smith',
    description: 'A book series on JavaScript',
    isbn: '9781491924464',
    publisher: "O'Reilly Media",
    publishYear: 2015,
    pageCount: 278,
    borrowHistory: [],
    reviews: [],
  },
  {
    id: 5,
    title: '深入理解计算机系统',
    author: "Randal E. Bryant & David R. O'Hallaron",
    cover: '/images/placeholder-book.svg',
    category: 'Computer Science',
    language: 'Chinese',
    status: 'borrowed',
    currentHolder: 'Li Mei',
    description: "Computer Systems: A Programmer's Perspective (Chinese Edition)",
    isbn: '9787111544937',
    publisher: '机械工业出版社',
    publishYear: 2016,
    pageCount: 731,
    borrowHistory: [
      {
        borrower: 'Li Mei',
        borrowDate: '2024-02-01',
      },
    ],
    reviews: [
      {
        reviewer: 'Zhang Wei',
        rating: 5,
        comment: '这是一本非常全面的计算机系统书籍，对理解计算机底层工作原理非常有帮助。',
        date: '2023-10-15',
      },
    ],
  },
  {
    id: 6,
    title: '算法导论',
    author: 'Thomas H. Cormen et al.',
    cover: '/images/placeholder-book.svg',
    category: 'Computer Science',
    language: 'Chinese',
    status: 'available',
    description: 'Introduction to Algorithms (Chinese Edition)',
    isbn: '9787111407010',
    publisher: '机械工业出版社',
    publishYear: 2013,
    pageCount: 780,
    borrowHistory: [],
    reviews: [],
  },
  {
    id: 7,
    title: 'JavaScript高级程序设计',
    author: 'Nicholas C. Zakas',
    cover: '/images/placeholder-book.svg',
    category: 'Programming',
    language: 'Chinese',
    status: 'available',
    description: 'Professional JavaScript for Web Developers (Chinese Edition)',
    isbn: '9787115545381',
    publisher: '人民邮电出版社',
    publishYear: 2020,
    pageCount: 984,
    borrowHistory: [],
    reviews: [],
  },
  {
    id: 8,
    title: 'CSS揭秘',
    author: 'Lea Verou',
    cover: '/images/placeholder-book.svg',
    category: 'Web Development',
    language: 'Chinese',
    status: 'borrowed',
    currentHolder: 'Wang Chen',
    description: 'CSS Secrets (Chinese Edition)',
    isbn: '9787115416940',
    publisher: '人民邮电出版社',
    publishYear: 2016,
    pageCount: 288,
    borrowHistory: [
      {
        borrower: 'Wang Chen',
        borrowDate: '2024-01-08',
      },
    ],
    reviews: [
      {
        reviewer: 'Li Mei',
        rating: 4,
        comment: '案例很实用，适合前端开发者反复翻阅。',
        date: '2023-12-18',
      },
    ],
  },
];

const includesKeyword = (field: string | undefined, keywords: string) =>
  field?.toLowerCase().includes(keywords);

const getFirstQueryParam = (value: string | string[] | undefined, defaultValue = '') =>
  Array.isArray(value) ? value[0] || defaultValue : value || defaultValue;

const filterBooks = (books: Book[], keywords = '') => {
  const searchTerm = keywords.trim().toLowerCase();

  if (!searchTerm) return books;

  return books.filter(({ title, author, category, language, description, isbn, tags = [] }) => {
    if (includesKeyword(title, searchTerm)) return true;
    if (includesKeyword(author, searchTerm)) return true;
    if (includesKeyword(category, searchTerm)) return true;
    if (includesKeyword(language, searchTerm)) return true;
    if (includesKeyword(description, searchTerm)) return true;
    if (includesKeyword(isbn, searchTerm)) return true;

    return tags.some(tag => includesKeyword(tag, searchTerm));
  });
};

export default function handler(
  { query }: NextApiRequest,
  response: NextApiResponse<Book[] | SearchBookPage>,
) {
  const keywords = getFirstQueryParam(query.keywords);
  const page = getFirstQueryParam(query.page);
  const pageSize = getFirstQueryParam(query.pageSize);

  if (!keywords && !pageSize) return response.status(200).json(openLibraryBooks);

  const pageIndex = Number(page) || 1;
  const limit = Number(pageSize) || openLibraryBooks.length;
  const safePageIndex = Math.max(1, pageIndex);
  const safeLimit = Math.max(1, limit);
  const filteredBooks = filterBooks(openLibraryBooks, keywords);
  const data = filteredBooks.slice((safePageIndex - 1) * safeLimit, safePageIndex * safeLimit);

  response.status(200).json({ data, totalCount: filteredBooks.length });
}
