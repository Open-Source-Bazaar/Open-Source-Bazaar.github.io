import React from 'react';
import Link from 'next/link';
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Form,
  Image,
  Stack,
} from 'react-bootstrap';
import NavbarComponent from '../../components/open-library/Navbar';
import FooterComponent from '../../components/open-library/Footer';

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
    <>
      {/* --- Navbar --- */}
      <NavbarComponent />

      <main>
        {/* --- Hero Section --- */}
        <section
          className="py-5"
          style={{
            background:
              'linear-gradient(to right, var(--bs-success-bg-subtle), var(--bs-teal-bg-subtle))',
          }}
        >
          <Container>
            <Row className="align-items-center">
              <Col md={7}>
                <h1 className="display-5 fw-bold mb-4">
                  Free knowledge flows here
                </h1>
                <p className="lead mb-4">
                  Share and borrow books in our open-source community. Join
                  freeCodeCamp Chengdu's initiative to make learning accessible
                  to everyone.
                </p>
                {/* TODO: Link this button to the actual Feishu form or member sign-up page */}
                <Button variant="success" size="lg">
                  Become a Member
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
          </Container>
        </section>

        {/* --- Featured Books Section --- */}
        <section className="py-5 bg-light">
          <Container>
            <h2 className="text-center fw-bold mb-2 h1">Featured Books</h2>
            <p className="text-center text-muted mb-5">
              Discover what our community is reading right now
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
                            View Details
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
                  Browse All Books →
                </Button>
              </Link>
            </div>
          </Container>
        </section>

        {/* --- Donation Callout Section --- */}
        <section className="py-5 bg-warning-subtle">
          <Container>
            <Row className="align-items-center">
              <Col md={7}>
                <h2 className="fw-bold mb-4 h1">Share Your Knowledge</h2>
                <p className="lead mb-4">
                  Have books collecting dust on your shelf? Donate them to our
                  community and help others learn and grow. Your contribution
                  makes a difference!
                </p>
                <Link href="/open-library/donate" passHref legacyBehavior>
                  <Button variant="warning">Donate a Book</Button>
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
          </Container>
        </section>

        {/* --- How It Works Section --- */}
        <section className="py-5">
          <Container>
            <h2 className="text-center fw-bold mb-2 h1">How It Works</h2>
            <p className="text-center text-muted mb-5">
              Three simple steps to borrow books from our community
            </p>
            <Row className="text-center g-4">
              <Col md={4}>
                <div className="mb-3">
                  <span className="d-inline-block p-3 bg-success-subtle text-success rounded-circle"></span>
                </div>
                <h3 className="fw-bold h4 mb-2">1. Find a Book</h3>
                <p className="text-muted px-md-3">
                  Browse our collection and find the book that interests you.
                  Filter by category, author, or popularity.
                </p>
              </Col>
              <Col md={4}>
                <div className="mb-3">
                  <span className="d-inline-block p-3 bg-success-subtle text-success rounded-circle"></span>
                </div>
                <h3 className="fw-bold h4 mb-2">2. Apply to Borrow</h3>
                <p className="text-muted px-md-3">
                  Submit a simple request form. We'll connect you with the book
                  owner and arrange the handover.
                </p>
              </Col>
              <Col md={4}>
                <div className="mb-3">
                  <span className="d-inline-block p-3 bg-success-subtle text-success rounded-circle"></span>
                </div>
                <h3 className="fw-bold h4 mb-2">3. Receive and Pass It On</h3>
                <p className="text-muted px-md-3">
                  Enjoy your book and return it when you're done. Consider
                  donating your own books to keep knowledge flowing.
                </p>
              </Col>
            </Row>
            <div className="text-center mt-5">
              <Link href="/open-library/how-to-borrow" passHref legacyBehavior>
                <Button
                  variant="link"
                  className="text-success text-decoration-none"
                >
                  Learn More About Borrowing →
                </Button>
              </Link>
            </div>
          </Container>
        </section>

        {/* --- Testimonials Section --- */}
        <section className="py-5 bg-light">
          <Container>
            <h2 className="text-center fw-bold mb-2 h1">Community Voices</h2>
            <p className="text-center text-muted mb-5">
              What our members say about Open Library
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
                  Read More Reviews →
                </Button>
              </Link>
            </div>
          </Container>
        </section>

        {/* --- Newsletter Section --- */}
        <section className="py-5">
          <Container>
            <Row className="justify-content-center">
              <Col lg={6}>
                <Card className="shadow-sm border-0">
                  <Card.Body className="p-4 p-md-5 text-center">
                    <h3 className="fw-bold mb-2 h2">Stay Updated</h3>
                    <p className="text-muted mb-4">
                      Subscribe to our newsletter for new book arrivals and
                      community events.
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
                          placeholder="Your email address"
                          required
                        />
                        <Button variant="success" type="submit">
                          Subscribe
                        </Button>
                      </Stack>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </section>
      </main>

      {/* --- Footer --- */}
      <FooterComponent />
    </>
  );
}
