import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Badge, Button, Card, Col, Row, Tab, Tabs } from 'react-bootstrap';

import {
  ContentContainer,
  Layout,
} from '../../../components/open-library/Layout';

// Book type definition
type Book = {
  id: number;
  title: string;
  author: string;
  cover?: string;
  category: string;
  language: string;
  status: 'available' | 'borrowed';
  currentHolder?: string;
  description?: string;
  isbn?: string;
  publisher?: string;
  publishYear?: number;
  pageCount?: number;
  borrowHistory?: {
    borrower: string;
    borrowDate: string;
    returnDate?: string;
  }[];
  reviews?: {
    reviewer: string;
    rating: number;
    comment: string;
    date: string;
  }[];
};

// Mock database of books
const booksDatabase: Book[] = [
  {
    id: 1,
    title: 'Clean Code',
    author: 'Robert C. Martin',
    cover: '/images/placeholder-book.svg',
    category: 'Programming',
    language: 'English',
    status: 'available',
    description:
      "A handbook of agile software craftsmanship. Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are lost because of poorly written code. But it doesn't have to be that way.",
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
    description:
      'A modern introduction to programming. JavaScript lies at the heart of almost every modern web application, from social apps like Twitter to browser-based game frameworks like Phaser and Babylon. Though simple for beginners to pick up and play with, JavaScript is a flexible, complex language that you can use to build full-scale applications.',
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
    title: 'Design Patterns',
    author: 'Erich Gamma et al.',
    cover: '/images/placeholder-book.svg',
    category: 'Programming',
    language: 'English',
    status: 'available',
    description:
      'Elements of Reusable Object-Oriented Software. Capturing a wealth of experience about the design of object-oriented software, four top-notch designers present a catalog of simple and succinct solutions to commonly occurring design problems.',
    isbn: '9780201633610',
    publisher: 'Addison-Wesley Professional',
    publishYear: 1994,
    pageCount: 416,
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
          'A classic that has stood the test of time. The examples are in C++ and Smalltalk, but the concepts apply to any OO language.',
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
    status: 'available',
    description:
      'A book series on JavaScript. This is a series of books diving deep into the core mechanisms of the JavaScript language.',
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
    author: 'Randal E. Bryant',
    cover: '/images/placeholder-book.svg',
    category: 'Computer Science',
    language: 'Chinese',
    status: 'borrowed',
    currentHolder: 'Li Mei',
    description:
      "Computer Systems: A Programmer's Perspective (Chinese Edition). This book introduces the important and enduring concepts that underlie computer systems.",
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
        comment:
          '这是一本非常全面的计算机系统书籍，对理解计算机底层工作原理非常有帮助。',
        date: '2023-10-15',
      },
    ],
  },
];

export default function BookDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      // In a real app, this would be an API call
      const bookId = Array.isArray(id)
        ? parseInt(id[0])
        : parseInt(id as string);
      const foundBook = booksDatabase.find(b => b.id === bookId);

      setBook(foundBook || null);
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <Layout title="Loading... - Open Library">
        <ContentContainer>
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: '50vh' }}
          >
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </ContentContainer>
      </Layout>
    );
  }

  if (!book) {
    return (
      <Layout title="Book Not Found - Open Library">
        <ContentContainer>
          <div className="text-center my-5">
            <h2>Book Not Found</h2>
            <p>Sorry, we couldn't find the book you're looking for.</p>
            <Button
              variant="primary"
              onClick={() => router.push('/open-library/books')}
            >
              Return to Catalog
            </Button>
          </div>
        </ContentContainer>
      </Layout>
    );
  }

  return (
    <Layout title={`${book.title} - Open Library`}>
      <ContentContainer>
        <div className="mb-4">
          <Button
            variant="outline-secondary"
            className="mb-3"
            onClick={() => router.back()}
          >
            &larr; Back
          </Button>

          <Card className="border-0 shadow-sm">
            <Card.Body>
              <Row>
                <Col md={3} className="text-center mb-4 mb-md-0">
                  <img
                    src={book.cover || '/images/placeholder-book.svg'}
                    alt={book.title}
                    className="img-fluid"
                    style={{ maxHeight: '300px' }}
                  />
                  <div className="mt-3">
                    <Badge
                      bg={book.status === 'available' ? 'success' : 'warning'}
                      text={book.status === 'available' ? 'white' : 'dark'}
                      className="px-3 py-2"
                    >
                      {book.status === 'available'
                        ? 'Available'
                        : 'Currently Borrowed'}
                    </Badge>
                  </div>
                  {book.status === 'borrowed' && book.currentHolder && (
                    <div className="mt-2 text-muted">
                      <small>Current holder: {book.currentHolder}</small>
                    </div>
                  )}
                </Col>
                <Col md={9}>
                  <h1>{book.title}</h1>
                  <h5 className="text-muted mb-3">by {book.author}</h5>

                  <div className="mb-3">
                    <Badge bg="secondary" className="me-2">
                      {book.category}
                    </Badge>
                    <Badge bg="info" text="dark">
                      {book.language}
                    </Badge>
                  </div>

                  <p className="lead">{book.description}</p>

                  <Row className="mt-4">
                    <Col sm={6} md={3} className="mb-3">
                      <div className="text-muted small">ISBN</div>
                      <div>{book.isbn || 'N/A'}</div>
                    </Col>
                    <Col sm={6} md={3} className="mb-3">
                      <div className="text-muted small">Publisher</div>
                      <div>{book.publisher || 'N/A'}</div>
                    </Col>
                    <Col sm={6} md={3} className="mb-3">
                      <div className="text-muted small">Published</div>
                      <div>{book.publishYear || 'N/A'}</div>
                    </Col>
                    <Col sm={6} md={3} className="mb-3">
                      <div className="text-muted small">Pages</div>
                      <div>{book.pageCount || 'N/A'}</div>
                    </Col>
                  </Row>

                  <div className="mt-4">
                    {book.status === 'available' ? (
                      <Button
                        variant="primary"
                        size="lg"
                        href="https://open-source-bazaar.feishu.cn/share/base/form/shrcnNiKwb9ApzFFGI3YkCXDdwe?prefill_%E6%93%8D%E4%BD%9C=%E5%80%9F%E5%85%A5"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Request to Borrow
                      </Button>
                    ) : (
                      <Button variant="outline-primary" size="lg" disabled>
                        Currently Unavailable
                      </Button>
                    )}
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <div className="mt-4">
            <Tabs defaultActiveKey="reviews" className="mb-3">
              <Tab eventKey="reviews" title="Reviews">
                {book.reviews && book.reviews.length > 0 ? (
                  <div>
                    {book.reviews.map((review, index) => (
                      <Card key={index} className="mb-3 shadow-sm">
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <h5 className="mb-0">{review.reviewer}</h5>
                            <div>
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className="text-warning">
                                  {i < review.rating ? '\u2605' : '\u2606'}
                                </span>
                              ))}
                            </div>
                          </div>
                          <Card.Text>{review.comment}</Card.Text>
                          <Card.Text>
                            <small className="text-muted">
                              {new Date(review.date).toLocaleDateString()}
                            </small>
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    ))}
                    <div className="text-center mt-4">
                      <Button
                        variant="outline-primary"
                        href="https://open-source-bazaar.feishu.cn/share/base/form/shrcnFAX8q7mnywCQOsVnIS5Dwb"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Add Your Review
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <p className="mb-4">
                      No reviews yet. Be the first to review this book!
                    </p>
                    <Button
                      variant="primary"
                      href="https://open-source-bazaar.feishu.cn/share/base/form/shrcnFAX8q7mnywCQOsVnIS5Dwb"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Write a Review
                    </Button>
                  </div>
                )}
              </Tab>
              <Tab eventKey="history" title="Borrow History">
                {book.borrowHistory && book.borrowHistory.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Borrower</th>
                          <th>Borrow Date</th>
                          <th>Return Date</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {book.borrowHistory.map((history, index) => (
                          <tr key={index}>
                            <td>{history.borrower}</td>
                            <td>
                              {new Date(
                                history.borrowDate,
                              ).toLocaleDateString()}
                            </td>
                            <td>
                              {history.returnDate
                                ? new Date(
                                    history.returnDate,
                                  ).toLocaleDateString()
                                : '-'}
                            </td>
                            <td>
                              {history.returnDate ? (
                                <Badge bg="success">Returned</Badge>
                              ) : (
                                <Badge bg="warning" text="dark">
                                  Active
                                </Badge>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <p>This book has not been borrowed yet.</p>
                  </div>
                )}
              </Tab>
            </Tabs>
          </div>
        </div>
      </ContentContainer>
    </Layout>
  );
}
