import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Form,
  FormControl,
  InputGroup,
  Row,
} from 'react-bootstrap';

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
  const [books, setBooks] = useState<Book[]>([
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
      currentHolder: 'Zhang Wei',
      description: 'A modern introduction to programming',
    },
    {
      id: 3,
      title: 'Design Patterns',
      author: 'Erich Gamma et al.',
      cover: '/images/placeholder-book.svg',
      category: 'Programming',
      language: 'English',
      status: 'available',
      description: 'Elements of Reusable Object-Oriented Software',
    },
    {
      id: 4,
      title: "You Don't Know JS",
      author: 'Kyle Simpson',
      cover: '/images/placeholder-book.svg',
      category: 'Programming',
      language: 'English',
      status: 'available',
      description: 'A book series on JavaScript',
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
  ]);

  const [filteredBooks, setFilteredBooks] = useState<Book[]>(books);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Extract unique categories and languages for filter dropdowns
  const categories = Array.from(new Set(books.map(book => book.category)));
  const languages = Array.from(new Set(books.map(book => book.language)));

  // Apply filters when any filter changes
  useEffect(() => {
    let results = books;

    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        book =>
          book.title.toLowerCase().includes(term) ||
          book.author.toLowerCase().includes(term) ||
          (book.description && book.description.toLowerCase().includes(term)),
      );
    }

    // Apply category filter
    if (categoryFilter) {
      results = results.filter(book => book.category === categoryFilter);
    }

    // Apply language filter
    if (languageFilter) {
      results = results.filter(book => book.language === languageFilter);
    }

    // Apply status filter
    if (statusFilter) {
      results = results.filter(book => book.status === statusFilter);
    }

    setFilteredBooks(results);
  }, [searchTerm, categoryFilter, languageFilter, statusFilter, books]);

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setLanguageFilter('');
    setStatusFilter('');
  };

  return (
    <Layout title="Book Catalog - Open Library">
      <ContentContainer>
        <h1 className="mb-4">Book Catalog</h1>

        {/* Search and Filters */}
        <Card className="mb-4">
          <Card.Body>
            <Row>
              <Col md={6} className="mb-3 mb-md-0">
                <InputGroup>
                  <FormControl
                    placeholder="Search by title, author, or description..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                  <Button variant="outline-secondary">Search</Button>
                </InputGroup>
              </Col>
              <Col md={6}>
                <Row>
                  <Col sm={4}>
                    <Form.Select
                      value={categoryFilter}
                      className="mb-2 mb-sm-0"
                      onChange={e => setCategoryFilter(e.target.value)}
                    >
                      <option value="">All Categories</option>
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col sm={4}>
                    <Form.Select
                      value={languageFilter}
                      className="mb-2 mb-sm-0"
                      onChange={e => setLanguageFilter(e.target.value)}
                    >
                      <option value="">All Languages</option>
                      {languages.map(language => (
                        <option key={language} value={language}>
                          {language}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col sm={4}>
                    <Form.Select
                      value={statusFilter}
                      onChange={e => setStatusFilter(e.target.value)}
                    >
                      <option value="">All Status</option>
                      <option value="available">Available</option>
                      <option value="borrowed">Borrowed</option>
                    </Form.Select>
                  </Col>
                </Row>
              </Col>
            </Row>
            <div className="d-flex justify-content-between align-items-center mt-3">
              <div>
                <small className="text-muted">
                  Showing {filteredBooks.length} of {books.length} books
                </small>
              </div>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={resetFilters}
              >
                Reset Filters
              </Button>
            </div>
          </Card.Body>
        </Card>

        {/* Book Grid */}
        <Row xs={1} md={2} lg={3} xl={4} className="g-4">
          {filteredBooks.map(book => (
            <Col key={book.id}>
              <Card className="h-100 shadow-sm">
                <div className="text-center pt-3">
                  <Card.Img
                    variant="top"
                    src={book.cover || '/images/placeholder-book.svg'}
                    style={{ height: '180px', objectFit: 'contain' }}
                  />
                </div>
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{book.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {book.author}
                  </Card.Subtitle>
                  <Card.Text className="small text-truncate">
                    {book.description}
                  </Card.Text>
                  <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="badge bg-secondary">
                        {book.category}
                      </span>
                      <span className="badge bg-info text-dark">
                        {book.language}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span
                        className={`badge ${book.status === 'available' ? 'bg-success' : 'bg-warning text-dark'}`}
                      >
                        {book.status === 'available' ? 'Available' : 'Borrowed'}
                      </span>
                      <Button
                        variant="primary"
                        size="sm"
                        href={`/open-library/book/${book.id}`}
                      >
                        View Details
                      </Button>
                    </div>
                    {book.status === 'borrowed' && (
                      <div className="mt-2 small text-muted">
                        Currently with: {book.currentHolder}
                      </div>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* No Results */}
        {filteredBooks.length === 0 && (
          <div className="text-center my-5 py-5">
            <h3>No books found</h3>
            <p className="text-muted">Try adjusting your search or filters</p>
            <Button variant="primary" onClick={resetFilters}>
              Reset All Filters
            </Button>
          </div>
        )}
      </ContentContainer>
    </Layout>
  );
}
