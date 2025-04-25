import React, { useState } from 'react';
import { Button, Card, Col, Form, Row, Tab, Tabs } from 'react-bootstrap';

import { ContentContainer, Layout } from '../../components/open-library/Layout';

// Review type definition
type Review = {
  id: number;
  bookTitle: string;
  bookAuthor: string;
  bookCover?: string;
  reviewer: string;
  rating: number;
  comment: string;
  date: string;
};

export default function ReviewPage() {
  // Sample reviews data - in a real app, this would come from an API
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 1,
      bookTitle: 'Clean Code',
      bookAuthor: 'Robert C. Martin',
      bookCover: '/images/placeholder-book.svg',
      reviewer: 'Wang Chen',
      rating: 5,
      comment:
        'This book completely changed how I approach writing code. Highly recommended for all developers!',
      date: '2023-11-25',
    },
    {
      id: 2,
      bookTitle: 'Clean Code',
      bookAuthor: 'Robert C. Martin',
      bookCover: '/images/placeholder-book.svg',
      reviewer: 'Li Mei',
      rating: 4,
      comment:
        'Great principles that have stood the test of time. Some examples are a bit dated but the concepts are solid.',
      date: '2023-09-10',
    },
    {
      id: 3,
      bookTitle: 'Eloquent JavaScript',
      bookAuthor: 'Marijn Haverbeke',
      bookCover: '/images/placeholder-book.svg',
      reviewer: 'Liu Jie',
      rating: 5,
      comment:
        'Perfect for beginners and intermediate JavaScript developers. The exercises are particularly helpful.',
      date: '2023-12-05',
    },
    {
      id: 4,
      bookTitle: 'Design Patterns',
      bookAuthor: 'Erich Gamma et al.',
      bookCover: '/images/placeholder-book.svg',
      reviewer: 'Chen Ming',
      rating: 4,
      comment:
        'A classic that has stood the test of time. The examples are in C++ and Smalltalk, but the concepts apply to any OO language.',
      date: '2023-07-25',
    },
    {
      id: 5,
      bookTitle: '深入理解计算机系统',
      bookAuthor: 'Randal E. Bryant',
      bookCover: '/images/placeholder-book.svg',
      reviewer: 'Zhang Wei',
      rating: 5,
      comment:
        '这是一本非常全面的计算机系统书籍，对理解计算机底层工作原理非常有帮助。',
      date: '2023-10-15',
    },
  ]);

  // Function to render star rating
  const renderStars = (rating: number) => {
    return (
      <div className="text-warning">
        {[...Array(5)].map((_, i) => (
          <span key={i} style={{ fontSize: '1.2rem' }}>
            {i < rating ? '\u2605' : '\u2606'}
          </span>
        ))}
      </div>
    );
  };

  return (
    <Layout title="Book Reviews - Open Library">
      <ContentContainer>
        <div className="mb-5">
          <h1 className="display-4 mb-4">书籍评价</h1>

          <Card className="border-0 shadow-sm mb-5">
            <Card.Body className="p-4">
              <h2 className="mb-4">社区书评</h2>
              <p className="lead">
                阅读是一种体验，分享让这种体验更加丰富。浏览社区成员的书评，或者分享您自己的阅读感受。
              </p>
              <div className="d-flex justify-content-end">
                <Button
                  variant="primary"
                  href="https://open-source-bazaar.feishu.cn/share/base/form/shrcnFAX8q7mnywCQOsVnIS5Dwb"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  写书评
                </Button>
              </div>
            </Card.Body>
          </Card>

          <Tabs defaultActiveKey="all" className="mb-4">
            <Tab eventKey="all" title="所有评价">
              <div className="mt-3">
                {reviews.map(review => (
                  <Card key={review.id} className="mb-4 shadow-sm">
                    <Card.Body>
                      <Row>
                        <Col md={3} className="mb-3 mb-md-0">
                          <div className="d-flex flex-column align-items-center">
                            <img
                              src={
                                review.bookCover ||
                                '/images/placeholder-book.svg'
                              }
                              alt={review.bookTitle}
                              className="img-fluid mb-2"
                              style={{ maxHeight: '150px' }}
                            />
                            <h6 className="text-center">{review.bookTitle}</h6>
                            <p className="text-muted small text-center">
                              {review.bookAuthor}
                            </p>
                          </div>
                        </Col>
                        <Col md={9}>
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5>{review.reviewer}</h5>
                            {renderStars(review.rating)}
                          </div>
                          <p className="mb-3">{review.comment}</p>
                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">
                              {new Date(review.date).toLocaleDateString(
                                'en-US',
                                {
                                  year: 'numeric',
                                  month: '2-digit',
                                  day: '2-digit',
                                },
                              )}
                            </small>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              href={`/open-library/book/${review.id}`}
                            >
                              查看书籍详情
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </Tab>
            <Tab eventKey="recent" title="最新评价">
              <div className="mt-3">
                {reviews
                  .sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime(),
                  )
                  .slice(0, 3)
                  .map(review => (
                    <Card key={review.id} className="mb-4 shadow-sm">
                      <Card.Body>
                        <Row>
                          <Col md={3} className="mb-3 mb-md-0">
                            <div className="d-flex flex-column align-items-center">
                              <img
                                src={
                                  review.bookCover ||
                                  '/images/placeholder-book.svg'
                                }
                                alt={review.bookTitle}
                                className="img-fluid mb-2"
                                style={{ maxHeight: '150px' }}
                              />
                              <h6 className="text-center">
                                {review.bookTitle}
                              </h6>
                              <p className="text-muted small text-center">
                                {review.bookAuthor}
                              </p>
                            </div>
                          </Col>
                          <Col md={9}>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <h5>{review.reviewer}</h5>
                              {renderStars(review.rating)}
                            </div>
                            <p className="mb-3">{review.comment}</p>
                            <div className="d-flex justify-content-between align-items-center">
                              <small className="text-muted">
                                {new Date(review.date).toLocaleDateString(
                                  'en-US',
                                  {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                  },
                                )}
                              </small>
                              <Button
                                variant="outline-primary"
                                size="sm"
                                href={`/open-library/book/${review.id}`}
                              >
                                查看书籍详情
                              </Button>
                            </div>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  ))}
              </div>
            </Tab>
            <Tab eventKey="top" title="高分评价">
              <div className="mt-3">
                {reviews
                  .filter(review => review.rating >= 5)
                  .map(review => (
                    <Card key={review.id} className="mb-4 shadow-sm">
                      <Card.Body>
                        <Row>
                          <Col md={3} className="mb-3 mb-md-0">
                            <div className="d-flex flex-column align-items-center">
                              <img
                                src={
                                  review.bookCover ||
                                  '/images/placeholder-book.svg'
                                }
                                alt={review.bookTitle}
                                className="img-fluid mb-2"
                                style={{ maxHeight: '150px' }}
                              />
                              <h6 className="text-center">
                                {review.bookTitle}
                              </h6>
                              <p className="text-muted small text-center">
                                {review.bookAuthor}
                              </p>
                            </div>
                          </Col>
                          <Col md={9}>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <h5>{review.reviewer}</h5>
                              {renderStars(review.rating)}
                            </div>
                            <p className="mb-3">{review.comment}</p>
                            <div className="d-flex justify-content-between align-items-center">
                              <small className="text-muted">
                                {new Date(review.date).toLocaleDateString(
                                  'en-US',
                                  {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                  },
                                )}
                              </small>
                              <Button
                                variant="outline-primary"
                                size="sm"
                                href={`/open-library/book/${review.id}`}
                              >
                                查看书籍详情
                              </Button>
                            </div>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  ))}
              </div>
            </Tab>
          </Tabs>

          <Card className="border-0 shadow-sm mb-5">
            <Card.Body className="p-4">
              <h3 className="mb-4">写下您的书评</h3>
              <p>
                阅读完一本书后，请花几分钟时间分享您的阅读体验。您的评价将帮助其他社区成员找到适合他们的书籍。
              </p>
              <div className="text-center mt-4">
                <Button
                  variant="primary"
                  size="lg"
                  href="https://open-source-bazaar.feishu.cn/share/base/form/shrcnFAX8q7mnywCQOsVnIS5Dwb"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  写书评
                </Button>
              </div>
            </Card.Body>
          </Card>

          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <h3 className="mb-4">书评指南</h3>
              <Row>
                <Col md={6} className="mb-4 mb-md-0">
                  <h5>如何写一篇有帮助的书评</h5>
                  <ul>
                    <li>简要概述书籍内容，但不要透露关键情节</li>
                    <li>分享您从书中获得的主要收获</li>
                    <li>提及书籍的优点和可能的缺点</li>
                    <li>说明适合阅读这本书的人群</li>
                    <li>分享书中让您印象深刻的观点或引用</li>
                  </ul>
                </Col>
                <Col md={6}>
                  <h5>评分参考</h5>
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <div className="d-flex align-items-center">
                        <div className="text-warning me-2">★★★★★</div>
                        <div>杰出，强烈推荐，改变思维的书籍</div>
                      </div>
                    </li>
                    <li className="mb-2">
                      <div className="d-flex align-items-center">
                        <div className="text-warning me-2">★★★★☆</div>
                        <div>非常好，值得推荐，有一些小缺点</div>
                      </div>
                    </li>
                    <li className="mb-2">
                      <div className="d-flex align-items-center">
                        <div className="text-warning me-2">★★★☆☆</div>
                        <div>好，有价值，但不突出</div>
                      </div>
                    </li>
                    <li className="mb-2">
                      <div className="d-flex align-items-center">
                        <div className="text-warning me-2">★★☆☆☆</div>
                        <div>一般，有一些有用信息，但整体平淡</div>
                      </div>
                    </li>
                    <li>
                      <div className="d-flex align-items-center">
                        <div className="text-warning me-2">★☆☆☆☆</div>
                        <div>不推荐，内容质量较低或不准确</div>
                      </div>
                    </li>
                  </ul>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </div>
      </ContentContainer>
    </Layout>
  );
}
