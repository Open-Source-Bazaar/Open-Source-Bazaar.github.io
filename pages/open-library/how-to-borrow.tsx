import { Button, Card, Col, Container, ListGroup, ListGroupItem, Row } from 'idea-react';
import { marked } from 'marked';
import { observer } from 'mobx-react';
import Link from 'next/link';
import { useContext } from 'react';

import { PageHead } from '../../components/Layout/PageHead';
import {
  OpenLibraryBorrowFormURL,
  OpenLibraryCatalogURL,
  OpenLibraryHandoffFormURL,
  OpenLibraryMembershipFormURL,
} from '../../models/configuration';
import { I18nContext } from '../../models/Translation';

const booksURL = '/open-library/books';

const HowToBorrowPage = observer(() => {
  const { t } = useContext(I18nContext);
  const borrowSteps = [
    {
      title: t('borrow_step_catalog_title'),
      description: t('borrow_step_catalog_description', {
        catalogURL: OpenLibraryCatalogURL,
        booksURL,
      }),
    },
    {
      title: t('borrow_step_apply_title'),
      description: t('borrow_step_apply_description', { borrowFormURL: OpenLibraryBorrowFormURL }),
    },
    {
      title: t('borrow_step_handoff_title'),
      description: t('borrow_step_handoff_description', {
        handoffFormURL: OpenLibraryHandoffFormURL,
      }),
    },
    {
      title: t('borrow_step_share_title'),
      description: t('borrow_step_share_description'),
    },
    {
      title: t('borrow_step_continue_title'),
      description: t('borrow_step_continue_description'),
    },
  ];
  const borrowRules = [
    [t('borrow_rule_period_title'), t('borrow_rule_period_detail')],
    [t('borrow_rule_quantity_title'), t('borrow_rule_quantity_detail')],
    [t('borrow_rule_condition_title'), t('borrow_rule_condition_detail')],
    [t('borrow_rule_handoff_title'), t('borrow_rule_handoff_detail')],
    [t('borrow_rule_damage_title'), t('borrow_rule_damage_detail')],
  ];
  const questions = [
    [t('borrow_faq_available_question'), t('borrow_faq_available_answer')],
    [t('borrow_faq_fee_question'), t('borrow_faq_fee_answer')],
    [t('borrow_faq_return_question'), t('borrow_faq_return_answer')],
    [t('borrow_faq_contact_question'), t('borrow_faq_contact_answer')],
    [t('borrow_faq_keep_question'), t('borrow_faq_keep_answer')],
    [t('borrow_faq_ebook_question'), t('borrow_faq_ebook_answer')],
  ];

  return (
    <Container breakpoint="xl" className="px-5">
      <PageHead title={t('how_to_borrow_page_title')} />

      <div className="mb-12">
        <h1 className="fs-5xl mb-7">{t('how_to_borrow_page')}</h1>

        <Card className="border-0 shadow-sm mb-12 p-7" body>
          <h2 className="mb-7">{t('borrowing_and_passing')}</h2>
          <p
            dangerouslySetInnerHTML={{ __html: marked(t('borrow_model_intro')) as string }}
            className="fs-lg fw-light"
          />
          <p
            dangerouslySetInnerHTML={{ __html: marked(t('borrow_model_description')) as string }}
          />
        </Card>

        <Row className="mb-12">
          <Col lg={7} className="mb-7 lg:mb-0">
            <Card className="h-100 border-0 shadow-sm p-7" body>
              <h3 className="mb-7">{t('borrowing_process')}</h3>

              <ol className="list-unstyled d-flex flex-column gap-7 mb-0">
                {borrowSteps.map(({ title, description }, index) => (
                  <li key={title} className="d-flex position-relative z-2">
                    <span
                      className="bg-primary fg-white rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 me-5 fw-semibold"
                      style={{ width: '50px', height: '50px' }}
                    >
                      {index + 1}
                    </span>
                    <div>
                      <h4 className="h5">{title}</h4>
                      <p
                        dangerouslySetInnerHTML={{ __html: marked(description) as string }}
                        className="mb-0"
                      />
                    </div>
                  </li>
                ))}
              </ol>
            </Card>
          </Col>

          <Col lg={5}>
            <Card className="border-0 shadow-sm mb-7 p-7" body>
              <h3 className="mb-5">{t('borrowing_rules')}</h3>
              <ListGroup className="list-group-flush">
                {borrowRules.map(([term, detail]) => (
                  <ListGroupItem key={term} className="px-0">
                    <strong className="me-1">{term}</strong>
                    {detail}
                  </ListGroupItem>
                ))}
              </ListGroup>
            </Card>

            <Card className="border-0 shadow-sm p-7" body>
              <h3 className="mb-5">{t('quick_links')}</h3>
              <ListGroup
                className="list-group-flush list-unstyled d-grid gap-3 mb-0"
                aria-label={t('open_library_quick_links_label')}
              >
                <ListGroupItem
                  action
                  href={OpenLibraryCatalogURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-center"
                >
                  {t('view_full_catalog')}
                </ListGroupItem>
                <ListGroupItem
                  action
                  href={OpenLibraryBorrowFormURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-center"
                >
                  {t('fill_borrow_request')}
                </ListGroupItem>
                <ListGroupItem
                  action
                  href={OpenLibraryHandoffFormURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-center"
                >
                  {t('fill_book_passing_form')}
                </ListGroupItem>
                <ListGroupItem action href={booksURL} className="text-center">
                  {t('browse_book_catalog')}
                </ListGroupItem>
              </ListGroup>
            </Card>
          </Col>
        </Row>

        <Card className="border-0 shadow-sm mb-12 p-7" body>
          <h3 className="mb-7">{t('faq')}</h3>
          <Row as="dl" className="g-7 mb-0" md={2}>
            {questions.map(([question, answer]) => (
              <Col key={question}>
                <dt className="h5">{question}</dt>
                <dd className="mb-0">{answer}</dd>
              </Col>
            ))}
          </Row>
        </Card>

        <div className="text-center">
          <h3 className="mb-7">{t('ready_to_borrow')}</h3>
          <div className="d-flex justify-content-center gap-5 flex-wrap">
            <Link href={booksURL} passHref legacyBehavior>
              <Button as="a" size="lg">
                {t('browse_book_catalog')}
              </Button>
            </Link>
            <Button
              href={OpenLibraryMembershipFormURL}
              target="_blank"
              rel="noopener noreferrer"
              theme="warning"
              size="lg"
            >
              {t('apply_for_membership')}
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
});

export default HowToBorrowPage;
