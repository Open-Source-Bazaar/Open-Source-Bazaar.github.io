import { observer } from 'mobx-react';
import { FC, useContext, useMemo, useState } from 'react';
import { Badge, Button, Card, Col, Container, Form, Row, Table } from 'react-bootstrap';

import { PageHead } from '../../components/Layout/PageHead';
import { I18nContext, I18nKey } from '../../models/Translation';
import styles from './index.module.less';

type BookStatus = 'available' | 'borrowed';

type CategoryFilter = I18nKey | 'all';

interface LibraryBook {
  author: string;
  categoryKey: I18nKey;
  code: string;
  descriptionKey: I18nKey;
  dueDate?: string;
  locationKey: I18nKey;
  status: BookStatus;
  title: string;
}

const books: LibraryBook[] = [
  {
    code: 'OSB-001',
    title: 'Working in Public',
    author: 'Nadia Eghbal',
    categoryKey: 'library_category_open_source',
    status: 'available',
    locationKey: 'library_location_shelf_a',
    descriptionKey: 'library_book_working_public_desc',
  },
  {
    code: 'OSB-002',
    title: 'The Cathedral & the Bazaar',
    author: 'Eric S. Raymond',
    categoryKey: 'library_category_community',
    status: 'borrowed',
    dueDate: '2026-07-12',
    locationKey: 'library_location_checked_out',
    descriptionKey: 'library_book_cathedral_desc',
  },
  {
    code: 'OSB-003',
    title: 'Producing Open Source Software',
    author: 'Karl Fogel',
    categoryKey: 'library_category_governance',
    status: 'available',
    locationKey: 'library_location_shelf_b',
    descriptionKey: 'library_book_producing_desc',
  },
  {
    code: 'OSB-004',
    title: 'Open Source for Business',
    author: 'Heather Meeker',
    categoryKey: 'library_category_legal',
    status: 'available',
    locationKey: 'library_location_shelf_c',
    descriptionKey: 'library_book_business_desc',
  },
];

const guideKeys: [I18nKey, I18nKey][] = [
  ['library_guide_step_1_title', 'library_guide_step_1_desc'],
  ['library_guide_step_2_title', 'library_guide_step_2_desc'],
  ['library_guide_step_3_title', 'library_guide_step_3_desc'],
];

const LibraryPage: FC = observer(() => {
  const { t } = useContext(I18nContext);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [status, setStatus] = useState<BookStatus | 'all'>('all');
  const [selectedCode, setSelectedCode] = useState(books[0].code);
  const availableCount = books.filter(({ status }) => status === 'available').length;
  const categoryKeys = useMemo(() => [...new Set(books.map(({ categoryKey }) => categoryKey))], []);
  const normalizedKeyword = keyword.trim().toLowerCase();
  const filteredBooks = books.filter(book => {
    const translatedCategory = t(book.categoryKey).toLowerCase();

    return (
      (category === 'all' || book.categoryKey === category) &&
      (status === 'all' || book.status === status) &&
      (!normalizedKeyword ||
        [book.code, book.title, book.author, translatedCategory].some(item =>
          item.toLowerCase().includes(normalizedKeyword),
        ))
    );
  });
  const activeBook =
    filteredBooks.find(({ code }) => code === selectedCode) || filteredBooks[0] || books[0];

  const statusText = (status: BookStatus) =>
    status === 'available' ? t('library_status_available') : t('library_status_borrowed');

  const statusClass = (status: BookStatus) =>
    status === 'available' ? styles.statusAvailable : styles.statusBorrowed;

  return (
    <Container className={styles.libraryPage}>
      <PageHead title={t('library_page_title')} description={t('library_page_description')} />

      <Row as="header" className={`${styles.hero} mt-4 mb-5 align-items-center gy-4`}>
        <Col lg={7}>
          <Badge bg="dark" className="mb-3">
            {t('library_badge')}
          </Badge>
          <h1 className="display-5 fw-bold mb-3">{t('library_hero_title')}</h1>
          <p className="fs-5 text-muted mb-4">{t('library_hero_intro')}</p>
          <div className="d-flex flex-wrap gap-3">
            <Button size="lg" href="#catalog">
              {t('library_hero_cta_catalog')}
            </Button>
            <Button size="lg" variant="outline-secondary" href="#guide">
              {t('library_hero_cta_guide')}
            </Button>
          </div>
        </Col>
        <Col lg={5}>
          <ul className={`${styles.heroMeta} list-unstyled`}>
            <li className={styles.heroMetaItem}>
              <p className="text-muted mb-2">{t('library_stat_total')}</p>
              <strong className="display-6">{books.length}</strong>
            </li>
            <li className={styles.heroMetaItem}>
              <p className="text-muted mb-2">{t('library_stat_available')}</p>
              <strong className="display-6">{availableCount}</strong>
            </li>
            <li className={styles.heroMetaItem}>
              <p className="text-muted mb-2">{t('library_stat_process')}</p>
              <strong className="display-6">3</strong>
            </li>
          </ul>
        </Col>
      </Row>

      <section id="browse" className={`${styles.sectionCard} mb-5`}>
        <header className="mb-4 d-flex flex-column gap-3">
          <div>
            <h2 className="h3 mb-2">{t('library_browse_title')}</h2>
            <p className="text-muted mb-0">{t('library_browse_intro')}</p>
          </div>
          <Row className="g-3">
            <Col md={6} lg={5}>
              <Form.Control
                aria-label={t('library_filter_keyword')}
                placeholder={t('library_filter_keyword')}
                value={keyword}
                onChange={({ currentTarget }) => setKeyword(currentTarget.value)}
              />
            </Col>
            <Col md={3} lg={3}>
              <Form.Select
                aria-label={t('library_filter_category')}
                value={category}
                onChange={({ currentTarget }) => setCategory(currentTarget.value as CategoryFilter)}
              >
                <option value="all">{t('library_filter_all_categories')}</option>
                {categoryKeys.map(item => (
                  <option key={item} value={item}>
                    {t(item)}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={3} lg={3}>
              <Form.Select
                aria-label={t('library_filter_status')}
                value={status}
                onChange={({ currentTarget }) =>
                  setStatus(currentTarget.value as BookStatus | 'all')
                }
              >
                <option value="all">{t('library_filter_all_statuses')}</option>
                <option value="available">{t('library_status_available')}</option>
                <option value="borrowed">{t('library_status_borrowed')}</option>
              </Form.Select>
            </Col>
          </Row>
        </header>
        <Row xs={1} md={2} xl={4} className="g-4">
          {filteredBooks.map(({ code, title, author, categoryKey, status, descriptionKey }) => (
            <Col key={code}>
              <Card
                className={`${styles.bookCard} ${activeBook.code === code ? styles.activeBookCard : ''}`}
                body
              >
                <div className={`${styles.bookCover} mb-3`}>{code.split('-')[1]}</div>
                <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                  <Badge bg="light" text="dark">
                    {t(categoryKey)}
                  </Badge>
                  <Badge bg="transparent" className={statusClass(status)}>
                    {statusText(status)}
                  </Badge>
                </div>
                <Card.Title as="h3" className="h5">
                  {title}
                </Card.Title>
                <p className="text-muted mb-2">{author}</p>
                <Card.Text>{t(descriptionKey)}</Card.Text>
                <Button
                  aria-controls="book-detail"
                  className="p-0 fw-semibold"
                  variant="link"
                  onClick={() => setSelectedCode(code)}
                >
                  {t('library_view_detail')}
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
        {!filteredBooks[0] && <p className="text-muted mb-0">{t('library_empty_result')}</p>}
      </section>

      <section id="catalog" className={`${styles.sectionCard} mb-5`}>
        <header className="mb-4">
          <h2 className="h3 mb-2">{t('library_catalog_title')}</h2>
          <p className="text-muted mb-0">{t('library_catalog_intro')}</p>
        </header>
        <Table responsive hover className={`align-middle mb-0 ${styles.catalogTable}`}>
          <thead>
            <tr>
              <th>{t('library_table_code')}</th>
              <th>{t('library_table_book')}</th>
              <th>{t('library_table_status')}</th>
              <th>{t('library_table_location')}</th>
              <th>{t('library_table_due')}</th>
            </tr>
          </thead>
          <tbody>
            {books.map(({ code, title, author, status, locationKey, dueDate }) => (
              <tr key={code}>
                <td className="fw-semibold" data-label={t('library_table_code')}>
                  {code}
                </td>
                <td data-label={t('library_table_book')}>
                  <strong>{title}</strong>
                  <small className="text-muted d-block">{author}</small>
                </td>
                <td data-label={t('library_table_status')}>
                  <Badge bg="transparent" className={statusClass(status)}>
                    {statusText(status)}
                  </Badge>
                </td>
                <td data-label={t('library_table_location')}>{t(locationKey)}</td>
                <td data-label={t('library_table_due')}>
                  {dueDate || t('library_due_not_applicable')}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </section>

      <Row id="guide" className="g-4">
        <Col lg={5}>
          <section className={styles.sectionCard}>
            <h2 className="h3 mb-4">{t('library_guide_title')}</h2>
            <ol className={`${styles.guideList} list-unstyled mb-0`}>
              {guideKeys.map(([titleKey, descKey]) => (
                <li key={titleKey} className={styles.guideStep}>
                  <h3 className="h5">{t(titleKey)}</h3>
                  <p className="text-muted mb-0">{t(descKey)}</p>
                </li>
              ))}
            </ol>
          </section>
        </Col>
        <Col lg={7}>
          <section className={styles.sectionCard}>
            <h2 className="h3 mb-4">{t('library_detail_title')}</h2>
            <Row xs={1} md={2} className="g-3">
              <Col md={7}>
                <article id="book-detail" className={styles.detailPanel}>
                  <div className="d-flex justify-content-between gap-3 mb-3">
                    <strong>{activeBook.code}</strong>
                    <Badge bg="transparent" className={statusClass(activeBook.status)}>
                      {statusText(activeBook.status)}
                    </Badge>
                  </div>
                  <h3 className="h5">{activeBook.title}</h3>
                  <p className="text-muted mb-2">{activeBook.author}</p>
                  <p>{t(activeBook.descriptionKey)}</p>
                  <p className="text-muted mb-2">
                    {t('library_detail_location_prefix')}
                    {t(activeBook.locationKey)}
                  </p>
                  <p className="text-muted mb-0">
                    {t('library_detail_due_prefix')}
                    {activeBook.dueDate || t('library_due_not_applicable')}
                  </p>
                </article>
              </Col>
              <Col md={5}>
                <aside className={styles.borrowPanel}>
                  <h3 className="h5">{t('library_borrow_info_title')}</h3>
                  <p className="text-muted mb-3">{t('library_borrow_info_desc')}</p>
                  <Button disabled className="w-100">
                    {activeBook.status === 'available'
                      ? t('library_borrow_available_action')
                      : t('library_borrow_wait_action')}
                  </Button>
                </aside>
              </Col>
            </Row>
          </section>
        </Col>
      </Row>
    </Container>
  );
});

export default LibraryPage;
