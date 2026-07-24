import { observer } from 'mobx-react';
import { ScrollList } from 'mobx-restful-table';
import { FC, useContext, useMemo } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Minute, Second } from 'web-utility';

import { PageHead } from '../../../components/Layout/PageHead';
import { BookCard } from '../../../components/open-library/BookCard';
import { Book, BookModel } from '../../../models/Book';
import { I18nContext } from '../../../models/Translation';
import { skipBuilding } from '../../api/SSG';

interface BookCatalogProps {
  books: Book[];
}

export const getStaticProps = skipBuilding<BookCatalogProps>(async () => {
  const books = await new BookModel().getList({}, 1, 9);

  return { props: { books }, revalidate: Minute / Second };
});

const BookCatalog: FC<BookCatalogProps> = observer(({ books }) => {
  const i18n = useContext(I18nContext),
    store = useMemo(() => new BookModel(), []);
  const { t } = i18n;

  return (
    <Container fluid="xl" className="px-3">
      <PageHead title={`${t('book_catalog')} - ${t('open_library')}`} />

      <div className="py-5">
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold text-primary mb-3">{t('book_catalog')}</h1>
          <p className="lead text-muted">{t('book_catalog_description')}</p>
        </div>

        <ScrollList
          translator={i18n}
          store={store}
          defaultData={books}
          renderList={books => (
            <Row xs={1} md={2} lg={3} className="g-4">
              {books.map(book => (
                <Col key={book.id}>
                  <BookCard book={book} showStatus variant="catalog" className="h-100" />
                </Col>
              ))}
            </Row>
          )}
        />
      </div>
    </Container>
  );
});

export default BookCatalog;
