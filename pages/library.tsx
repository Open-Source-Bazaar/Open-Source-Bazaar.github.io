import { observer } from 'mobx-react';
import { FC, useContext } from 'react';
import { Badge, Button, Card, Col, Container, ListGroup, Row, Stack } from 'react-bootstrap';

import { PageHead } from '../components/Layout/PageHead';
import { I18nContext, I18nKey } from '../models/Translation';

type LibraryStatus = 'available' | 'borrowed';

interface LibraryBook {
  id: string;
  titleKey: I18nKey;
  authorKey: I18nKey;
  descriptionKey: I18nKey;
  categoryKey: I18nKey;
  status: LibraryStatus;
  shelfCode: string;
  borrowInfoKey: I18nKey;
}

const libraryBooks: LibraryBook[] = [
  {
    id: 'cathedral-bazaar',
    titleKey: 'library_book_cathedral_title',
    authorKey: 'library_book_cathedral_author',
    descriptionKey: 'library_book_cathedral_description',
    categoryKey: 'library_category_open_source',
    status: 'available',
    shelfCode: 'OS-001',
    borrowInfoKey: 'library_book_available_note',
  },
  {
    id: 'producing-oss',
    titleKey: 'library_book_producing_oss_title',
    authorKey: 'library_book_producing_oss_author',
    descriptionKey: 'library_book_producing_oss_description',
    categoryKey: 'library_category_community',
    status: 'borrowed',
    shelfCode: 'OS-002',
    borrowInfoKey: 'library_book_borrowed_note',
  },
  {
    id: 'pro-git',
    titleKey: 'library_book_pro_git_title',
    authorKey: 'library_book_pro_git_author',
    descriptionKey: 'library_book_pro_git_description',
    categoryKey: 'library_category_engineering',
    status: 'available',
    shelfCode: 'ENG-003',
    borrowInfoKey: 'library_book_available_note',
  },
  {
    id: 'community-playbook',
    titleKey: 'library_book_community_playbook_title',
    authorKey: 'library_book_community_playbook_author',
    descriptionKey: 'library_book_community_playbook_description',
    categoryKey: 'library_category_community',
    status: 'available',
    shelfCode: 'COM-004',
    borrowInfoKey: 'library_book_available_note',
  },
  {
    id: 'governance-guide',
    titleKey: 'library_book_governance_title',
    authorKey: 'library_book_governance_author',
    descriptionKey: 'library_book_governance_description',
    categoryKey: 'library_category_governance',
    status: 'borrowed',
    shelfCode: 'GOV-005',
    borrowInfoKey: 'library_book_borrowed_note',
  },
  {
    id: 'license-handbook',
    titleKey: 'library_book_license_title',
    authorKey: 'library_book_license_author',
    descriptionKey: 'library_book_license_description',
    categoryKey: 'library_category_license',
    status: 'available',
    shelfCode: 'LIC-006',
    borrowInfoKey: 'library_book_available_note',
  },
];

const guideStepKeys: I18nKey[] = [
  'library_guide_step_1',
  'library_guide_step_2',
  'library_guide_step_3',
];

const statusVariant: Record<LibraryStatus, string> = {
  available: 'success',
  borrowed: 'secondary',
};

const statusLabelKey: Record<LibraryStatus, I18nKey> = {
  available: 'library_status_available',
  borrowed: 'library_status_borrowed',
};

const LibraryPage: FC = observer(() => {
  const { t } = useContext(I18nContext);

  return (
    <Container className="py-5">
      <PageHead title={t('open_library')} description={t('library_page_description')} />

      <section className="py-5 text-center text-md-start">
        <Badge bg="primary" pill className="mb-3">
          {t('library_badge')}
        </Badge>
        <h1 className="display-5 fw-bold mb-3">{t('library_page_title')}</h1>
        <p className="lead text-muted mb-4">{t('library_page_description')}</p>
        <Stack
          direction="horizontal"
          gap={3}
          className="justify-content-center justify-content-md-start"
        >
          <Button href="#library-catalog" variant="primary">
            {t('library_browse_catalog')}
          </Button>
          <Button href="#borrow-guide" variant="outline-primary">
            {t('library_borrow_guide')}
          </Button>
        </Stack>
      </section>

      <Row className="g-4 align-items-stretch mb-5">
        <Col md={4}>
          <Card body className="h-100 border-0 shadow-sm">
            <Card.Subtitle className="text-muted mb-2">
              {t('library_stat_total_label')}
            </Card.Subtitle>
            <Card.Title as="p" className="display-6 fw-bold mb-0">
              {libraryBooks.length}
            </Card.Title>
            <Card.Text className="text-muted mt-2">{t('library_stat_total_desc')}</Card.Text>
          </Card>
        </Col>
        <Col md={4}>
          <Card body className="h-100 border-0 shadow-sm">
            <Card.Subtitle className="text-muted mb-2">
              {t('library_stat_available_label')}
            </Card.Subtitle>
            <Card.Title as="p" className="display-6 fw-bold mb-0 text-success">
              {libraryBooks.filter(({ status }) => status === 'available').length}
            </Card.Title>
            <Card.Text className="text-muted mt-2">{t('library_stat_available_desc')}</Card.Text>
          </Card>
        </Col>
        <Col md={4}>
          <Card body className="h-100 border-0 shadow-sm">
            <Card.Subtitle className="text-muted mb-2">
              {t('library_stat_borrowed_label')}
            </Card.Subtitle>
            <Card.Title as="p" className="display-6 fw-bold mb-0 text-secondary">
              {libraryBooks.filter(({ status }) => status === 'borrowed').length}
            </Card.Title>
            <Card.Text className="text-muted mt-2">{t('library_stat_borrowed_desc')}</Card.Text>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <Col lg={8}>
          <section id="library-catalog">
            <div className="d-flex justify-content-between align-items-end gap-3 mb-3">
              <div>
                <h2 className="h3 mb-1">{t('library_catalog_title')}</h2>
                <p className="text-muted mb-0">{t('library_catalog_description')}</p>
              </div>
              <Badge bg="light" text="dark" className="border">
                {t('library_status_legend')}
              </Badge>
            </div>

            <Row as="ul" className="list-unstyled g-4" xs={1} md={2}>
              {libraryBooks.map(book => (
                <Col key={book.id} as="li">
                  <Card className="h-100 shadow-sm">
                    <Card.Body>
                      <Stack direction="horizontal" gap={2} className="mb-3">
                        <Badge bg={statusVariant[book.status]}>
                          {t(statusLabelKey[book.status])}
                        </Badge>
                        <Badge bg="light" text="dark" className="border">
                          {t(book.categoryKey)}
                        </Badge>
                      </Stack>

                      <Card.Title as="h3" className="h5">
                        {t(book.titleKey)}
                      </Card.Title>
                      <Card.Subtitle className="text-muted mb-3">{t(book.authorKey)}</Card.Subtitle>
                      <Card.Text>{t(book.descriptionKey)}</Card.Text>
                    </Card.Body>
                    <ListGroup variant="flush">
                      <ListGroup.Item className="d-flex justify-content-between gap-3">
                        <span className="text-muted">{t('library_shelf_code')}</span>
                        <span className="fw-semibold">{book.shelfCode}</span>
                      </ListGroup.Item>
                      <ListGroup.Item className="d-flex justify-content-between gap-3">
                        <span className="text-muted">{t('library_borrow_status')}</span>
                        <span>{t(book.borrowInfoKey)}</span>
                      </ListGroup.Item>
                    </ListGroup>
                  </Card>
                </Col>
              ))}
            </Row>
          </section>
        </Col>

        <Col lg={4}>
          <section id="borrow-guide" className="position-sticky" style={{ top: '5rem' }}>
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title as="h2" className="h4">
                  {t('library_borrow_guide')}
                </Card.Title>
                <Card.Text className="text-muted">
                  {t('library_borrow_guide_description')}
                </Card.Text>
                <ListGroup as="ol" numbered variant="flush">
                  {guideStepKeys.map(key => (
                    <ListGroup.Item key={key} as="li" className="px-0">
                      {t(key)}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
              <Card.Footer className="bg-white">
                <Button className="w-100" href="/bounty" variant="outline-primary">
                  {t('library_submit_books')}
                </Button>
              </Card.Footer>
            </Card>
          </section>
        </Col>
      </Row>
    </Container>
  );
});

export default LibraryPage;
