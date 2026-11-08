import { Col, Container, Row } from 'idea-react';
import { observer } from 'mobx-react';
import { ScrollList } from 'mobx-restful-table';
import { FC, useContext, useMemo } from 'react';
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
    <Container fluid="xl" className="px-5">
      <PageHead title={`${t('book_catalog')} - ${t('open_library')}`} />

      <div className="py-12">
        <div className="text-center mb-12">
          <h1 className="fs-5xl fw-bold fg-primary mb-5">{t('book_catalog')}</h1>
          <p className="fs-lg fw-light fg-secondary">{t('book_catalog_description')}</p>
        </div>

        <ScrollList
          translator={i18n}
          store={store}
          defaultData={books}
          renderList={books => (
            <Row xs={1} md={2} lg={3} className="g-7">
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
