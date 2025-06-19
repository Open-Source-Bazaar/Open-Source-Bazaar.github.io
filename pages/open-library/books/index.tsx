import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';

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
};

export default function BookCatalog() {
  // Sample books data - in a real app, this would come from an API
  const books: Book[] = [
    {
      id: 1,
      title: 'Clean Code',
      author: 'Robert C. Martin',
      cover: '/images/placeholder-book.svg',
      category: 'Programming',
      language: 'English',
      status: 'available',
      description: 'A handbook of agile software craftsmanship',
    },
    {
      id: 2,
      title: 'Eloquent JavaScript',
      author: 'Marijn Haverbeke',
      cover: '/images/placeholder-book.svg',
      category: 'Programming',
      language: 'English',
      status: 'borrowed',
      currentHolder: 'John Doe',
      description: 'A modern introduction to programming',
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
      description:
        "Computer Systems: A Programmer's Perspective (Chinese Edition)",
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
    },
    {
      id: 7,
      title: 'JavaScript高级程序设计',
      author: 'Nicholas C. Zakas',
      cover: '/images/placeholder-book.svg',
      category: 'Programming',
      language: 'Chinese',
      status: 'available',
      description:
        'Professional JavaScript for Web Developers (Chinese Edition)',
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
    },
  ];

  return (
    <Layout>
      <ContentContainer>
        <div className="py-5">
          <div className="text-center mb-5">
            <h1 className="display-4 fw-bold text-primary mb-3">图书目录</h1>
            <p className="lead text-muted">
              浏览我们的社区共享图书馆，发现有趣的书籍
            </p>
          </div>

          <Row>
            {books.map(book => (
              <Col key={book.id} md={6} lg={4} className="mb-4">
                <Card className="h-100 shadow-sm border-0">
                  <div className="position-relative">
                    <Card.Img
                      variant="top"
                      src={book.cover}
                      alt={book.title}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    <div className="position-absolute top-0 end-0 m-2">
                      <span
                        className={`badge ${
                          book.status === 'available'
                            ? 'bg-success'
                            : 'bg-warning text-dark'
                        }`}
                      >
                        {book.status === 'available' ? '可借阅' : '已借出'}
                      </span>
                    </div>
                  </div>
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="h5 text-primary">
                      {book.title}
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {book.author}
                    </Card.Subtitle>
                    <Card.Text className="text-muted small mb-2">
                      {book.category} • {book.language}
                    </Card.Text>
                    {book.description && (
                      <Card.Text className="flex-grow-1">
                        {book.description}
                      </Card.Text>
                    )}
                    {book.status === 'borrowed' && book.currentHolder && (
                      <Card.Text className="text-info small">
                        当前持书人: {book.currentHolder}
                      </Card.Text>
                    )}
                    <div className="mt-auto">
                      <Card.Link
                        href={`/open-library/book/${book.id}`}
                        className="btn btn-outline-primary btn-sm"
                      >
                        查看详情
                      </Card.Link>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </ContentContainer>
    </Layout>
  );
}
