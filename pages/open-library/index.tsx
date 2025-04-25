import Link from 'next/link';
import React from 'react';
import { Button, Card, Col, Form, Image, Row, Stack } from 'react-bootstrap';

import { ContentContainer, Layout } from '../../components/open-library/Layout';
import { t } from '../../models/Translation';

// TODO: Define a type for Book and Testimonial
type Book = {
  id: number;
  title: string;
  author: string;
  cover?: string; // Optional cover image URL
};

type Testimonial = {
  id: number;
  name: string;
  quote: string;
};

export default function OpenLibraryHomepage() {
  // Sample featured books data
  const featuredBooks: Book[] = [
    {
      id: 1,
      title: 'Clean Code',
      author: 'Robert C. Martin',
      cover: '/images/placeholder-book.svg',
    }, // TODO: Replace placeholder path
    {
      id: 2,
      title: 'Eloquent JavaScript',
      author: 'Marijn Haverbeke',
      cover: '/images/placeholder-book.svg',
    },
    {
      id: 3,
      title: 'Design Patterns',
      author: 'Erich Gamma et al.',
      cover: '/images/placeholder-book.svg',
    },
    {
      id: 4,
      title: "You Don't Know JS",
      author: 'Kyle Simpson',
      cover: '/images/placeholder-book.svg',
    },
  ];

  // Sample testimonials data
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Zhang Wei',
      quote:
        "Open Library helped me discover amazing tech books I couldn't find elsewhere.",
    },
    {
      id: 2,
      name: 'Li Mei',
      quote:
        "The community is so supportive. I've both borrowed and donated books here.",
    },
    {
      id: 3,
      name: 'Wang Chen',
      quote:
        'As a student, this resource has been invaluable for my studies in computer science.',
    },
  ];

  return (
    <Layout title={`${t('open_library')} - freeCodeCamp 成都社区`}>
      <main>
        {/* --- Hero Section --- */}
        <section
          className="py-5"
          style={{
            background:
              'linear-gradient(to right, var(--bs-success-bg-subtle), var(--bs-teal-bg-subtle))',
          }}
        >
          <ContentContainer>
            <Row className="align-items-center">
              <Col md={7}>
                <h1 className="display-5 fw-bold mb-4">{t('hero_title')}</h1>
                <p className="lead mb-4">{t('hero_subtitle')}</p>
                {/* TODO: Link this button to the actual Feishu form or member sign-up page */}
                <Button
                  variant="success"
                  size="lg"
                  href="https://open-source-bazaar.feishu.cn/share/base/form/shrcngQgMrhjTh6ycO1zcaEWZld"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('become_member')}
                </Button>
              </Col>
              <Col md={5} className="mt-4 mt-md-0 text-center">
                {/* TODO: Replace placeholder */}
                <Image
                  src="/images/placeholder-hero.svg"
                  alt="People sharing books"
                  fluid
                  rounded
                  className="shadow-sm"
                />
              </Col>
            </Row>
          </ContentContainer>
        </section>

        {/* --- Featured Books Section --- */}
        <section className="py-5 bg-light">
          <ContentContainer>
            <h2 className="text-center fw-bold mb-2 h1">
              {t('featured_books')}
            </h2>
            <p className="text-center text-muted mb-5">
              {t('featured_books_subtitle')}
            </p>
            <Row xs={1} sm={2} md={4} className="g-4 justify-content-center">
              {featuredBooks.map(book => (
                // TODO: Potentially move Card rendering to components/open-library/BookCard.tsx
                <Col key={book.id}>
                  <Card className="h-100 shadow-sm border-0">
                    <div className="text-center p-4">
                      <Image
                        src={book.cover || '/images/placeholder-book.svg'} // Default placeholder if cover is missing
                        alt={`${book.title} cover`}
                        style={{
                          height: '200px',
                          width: 'auto',
                          objectFit: 'contain',
                        }}
                      />
                    </div>
                    <Card.Body className="text-center d-flex flex-column">
                      <Card.Title className="fw-bold h5 mb-1">
                        {book.title}
                      </Card.Title>
                      <Card.Text className="text-muted mb-3">
                        {book.author}
                      </Card.Text>
                      <div className="mt-auto">
                        <Link
                          href={`/open-library/book/${book.id}`}
                          passHref
                          legacyBehavior
                        >
                          <Button variant="outline-success" as="a">
                            {t('view_details')}
                          </Button>
                        </Link>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
            <div className="text-center mt-5">
              <Link href="/open-library/books" passHref legacyBehavior>
                <Button
                  variant="link"
                  className="text-success text-decoration-none"
                >
                  {t('view_all_books')} &rarr;
                </Button>
              </Link>
            </div>
          </ContentContainer>
        </section>

        {/* --- Donation Callout Section --- */}
        <section className="py-5 bg-warning-subtle">
          <ContentContainer>
            <Row className="align-items-center">
              <Col md={7}>
                <h2 className="fw-bold mb-4 h1">{t('share_your_knowledge')}</h2>
                <p className="lead mb-4">{t('donation_callout_subtitle')}</p>
                <Link href="/open-library/donate" passHref legacyBehavior>
                  <Button variant="warning">{t('donate_a_book')}</Button>
                </Link>
              </Col>
              <Col md={5} className="mt-4 mt-md-0 text-center">
                {/* TODO: Replace placeholder */}
                <Image
                  src="/images/placeholder-donate.svg"
                  alt="Book donation"
                  fluid
                  rounded
                  className="shadow-sm"
                />
              </Col>
            </Row>
          </ContentContainer>
        </section>

        {/* --- How It Works Section --- */}
        <section className="py-5">
          <ContentContainer>
            <h2 className="text-center fw-bold mb-2 h1">{t('how_it_works')}</h2>
            <p className="text-center text-muted mb-5">
              {t('how_it_works_description')}
            </p>
            <Row className="text-center g-4">
              <Col md={4}>
                <div className="mb-3">
                  <span className="d-inline-block p-3 bg-success-subtle text-success rounded-circle"></span>
                </div>
                <h3 className="fw-bold h4 mb-2">{t('step_1_find_book')}</h3>
                <p className="text-muted px-md-3">{t('step_1_description')}</p>
              </Col>
              <Col md={4}>
                <div className="mb-3">
                  <span className="d-inline-block p-3 bg-success-subtle text-success rounded-circle"></span>
                </div>
                <h3 className="fw-bold h4 mb-2">{t('step_2_apply')}</h3>
                <p className="text-muted px-md-3">{t('step_2_description')}</p>
              </Col>
              <Col md={4}>
                <div className="mb-3">
                  <span className="d-inline-block p-3 bg-success-subtle text-success rounded-circle"></span>
                </div>
                <h3 className="fw-bold h4 mb-2">{t('step_3_receive')}</h3>
                <p className="text-muted px-md-3">{t('step_3_description')}</p>
              </Col>
            </Row>
            <div className="text-center mt-5">
              <Link href="/open-library/how-to-borrow" passHref legacyBehavior>
                <Button
                  variant="link"
                  className="text-success text-decoration-none"
                >
                  {t('learn_more_about_borrowing')}
                </Button>
              </Link>
            </div>
          </ContentContainer>
        </section>

        {/* --- Testimonials Section --- */}
        <section className="py-5 bg-light">
          <ContentContainer>
            <h2 className="text-center fw-bold mb-2 h1">
              {t('community_voices')}
            </h2>
            <p className="text-center text-muted mb-5">
              {t('community_voices_description')}
            </p>
            <Row xs={1} md={3} className="g-4">
              {testimonials.map(testimonial => (
                <Col key={testimonial.id}>
                  <Card className="h-100 shadow-sm border-0">
                    <Card.Body>
                      <blockquote className="blockquote mb-0">
                        <p className="fst-italic"> "{testimonial.quote}" </p>
                        <footer className="blockquote-footer mt-2">
                          {testimonial.name}
                        </footer>
                      </blockquote>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
            <div className="text-center mt-5">
              <Link href="/open-library/review" passHref legacyBehavior>
                <Button
                  variant="link"
                  className="text-success text-decoration-none"
                >
                  {t('read_more_reviews')}
                </Button>
              </Link>
            </div>
          </ContentContainer>
        </section>

        {/* --- Newsletter Section --- */}
        <section className="py-5">
          <ContentContainer>
            <Row className="justify-content-center">
              <Col lg={6}>
                <Card className="shadow-sm border-0">
                  <Card.Body className="p-4 p-md-5 text-center">
                    <h3 className="fw-bold mb-2 h2">{t('stay_updated')}</h3>
                    <p className="text-muted mb-4">
                      {t('newsletter_description')}
                    </p>
                    {/* TODO: Implement actual newsletter subscription logic */}
                    <Form onSubmit={e => e.preventDefault()}>
                      {' '}
                      {/* Prevent default form submission */}
                      <Stack
                        direction="horizontal"
                        gap={2}
                        className="mx-auto"
                        style={{ maxWidth: '400px' }}
                      >
                        <Form.Control
                          type="email"
                          placeholder={t('email_placeholder')}
                          required
                        />
                        <Button variant="success" type="submit">
                          {t('subscribe')}
                        </Button>
                      </Stack>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </ContentContainer>
        </section>
      </main>
    </Layout>
  );
}
