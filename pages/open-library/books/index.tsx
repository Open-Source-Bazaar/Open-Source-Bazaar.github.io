import { observer } from 'mobx-react';
import { useContext } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import { PageHead } from '../../../components/Layout/PageHead';
import BookCard from '../../../components/open-library/BookCard';
import { I18nContext } from '../../../models/Translation';
import { openLibraryBooks } from '../../api/open-library/books';

const BookCatalog = observer(() => {
  const { t } = useContext(I18nContext);

  return (
    <Container fluid="xl" className="px-3">
      <PageHead title={`${t('book_catalog')} - ${t('open_library')}`} />

      <div className="py-5">
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold text-primary mb-3">{t('book_catalog')}</h1>
          <p className="lead text-muted">{t('book_catalog_description')}</p>
        </div>

        <Row xs={1} md={2} lg={3} className="g-4">
          {openLibraryBooks.map(book => (
            <Col key={book.id}>
              <BookCard book={book} showStatus variant="catalog" className="h-100" />
            </Col>
          ))}
        </Row>
      </div>
    </Container>
  );
});

export default BookCatalog;
