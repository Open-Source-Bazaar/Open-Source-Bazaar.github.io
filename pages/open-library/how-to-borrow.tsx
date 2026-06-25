import { marked } from 'marked';
import Link from 'next/link';
import { observer } from 'mobx-react';
import { useContext } from 'react';
import { Button, Card, Col, Container, ListGroup, Row } from 'react-bootstrap';

import { PageHead } from '../../components/Layout/PageHead';
import { I18nContext } from '../../models/Translation';

const catalogURL =
  'https://open-source-bazaar.feishu.cn/share/base/view/shrcnvT0Lyk8LKS8KtPbO9HPPHb';
const borrowFormURL =
  'https://open-source-bazaar.feishu.cn/share/base/form/shrcnNiKwb9ApzFFGI3YkCXDdwe?prefill_%E6%93%8D%E4%BD%9C=%E5%80%9F%E5%85%A5';
const handoffFormURL =
  'https://open-source-bazaar.feishu.cn/share/base/form/shrcnuDb3oOuhMjSaXNIHEPA4Ef?prefill_%E6%93%8D%E4%BD%9C=%E5%80%9F%E5%87%BA';
const membershipFormURL =
  'https://open-source-bazaar.feishu.cn/share/base/form/shrcngQgMrhjTh6ycO1zcaEWZld';

const booksURL = '/open-library/books';

const inlineMarkupOf = (text: string) => ({
  __html: marked.parseInline(text) as string,
});

const HowToBorrowPage = observer(() => {
  const { t } = useContext(I18nContext);
  const borrowSteps = [
    {
      title: t('borrow_step_catalog_title'),
      description: t('borrow_step_catalog_description', { catalogURL, booksURL }),
    },
    {
      title: t('borrow_step_apply_title'),
      description: t('borrow_step_apply_description', { borrowFormURL }),
    },
    {
      title: t('borrow_step_handoff_title'),
      description: t('borrow_step_handoff_description', { handoffFormURL }),
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
    <Container fluid="xl" className="px-3">
      <PageHead title={t('how_to_borrow_page_title')} />

      <div className="mb-5">
        <h1 className="display-4 mb-4">{t('how_to_borrow_page')}</h1>

        <Card className="border-0 shadow-sm mb-5 p-4" body>
          <h2 className="mb-4">{t('borrowing_and_passing')}</h2>
          <p className="lead" dangerouslySetInnerHTML={inlineMarkupOf(t('borrow_model_intro'))} />
          <p dangerouslySetInnerHTML={inlineMarkupOf(t('borrow_model_description'))} />
        </Card>

        <Row className="mb-5">
          <Col lg={7} className="mb-4 mb-lg-0">
            <Card className="h-100 border-0 shadow-sm p-4" body>
              <h3 className="mb-4">{t('borrowing_process')}</h3>

              <ol className="list-unstyled d-flex flex-column gap-4 mb-0">
                {borrowSteps.map(({ title, description }, index) => (
                  <li key={title} className="d-flex position-relative z-2">
                    <span
                      className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 me-3 fw-semibold"
                      style={{ width: '50px', height: '50px' }}
                    >
                      {index + 1}
                    </span>
                    <div>
                      <h4 className="h5">{title}</h4>
                      <p className="mb-0" dangerouslySetInnerHTML={inlineMarkupOf(description)} />
                    </div>
                  </li>
                ))}
              </ol>
            </Card>
          </Col>

          <Col lg={5}>
            <Card className="border-0 shadow-sm mb-4 p-4" body>
              <h3 className="mb-3">{t('borrowing_rules')}</h3>
              <ListGroup variant="flush">
                {borrowRules.map(([term, detail]) => (
                  <ListGroup.Item key={term} className="px-0">
                    <strong>{term}：</strong>
                    {detail}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>

            <Card className="border-0 shadow-sm p-4" body>
              <h3 className="mb-3">{t('quick_links')}</h3>
              <nav className="d-grid gap-2" aria-label={t('open_library_quick_links_label')}>
                <Button
                  href={catalogURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outline-primary"
                >
                  {t('view_full_catalog')}
                </Button>
                <Button
                  href={borrowFormURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outline-primary"
                >
                  {t('fill_borrow_request')}
                </Button>
                <Button
                  href={handoffFormURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outline-primary"
                >
                  {t('fill_book_passing_form')}
                </Button>
                <Link href={booksURL} passHref legacyBehavior>
                  <Button as="a">{t('browse_book_catalog')}</Button>
                </Link>
              </nav>
            </Card>
          </Col>
        </Row>

        <Card className="border-0 shadow-sm mb-5 p-4" body>
          <h3 className="mb-4">{t('faq')}</h3>
          <Row as="dl" className="g-4 mb-0" md={2}>
            {questions.map(([question, answer]) => (
              <Col key={question}>
                <dt className="h5">{question}</dt>
                <dd className="mb-0">{answer}</dd>
              </Col>
            ))}
          </Row>
        </Card>

        <div className="text-center">
          <h3 className="mb-4">{t('ready_to_borrow')}</h3>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link href={booksURL} passHref legacyBehavior>
              <Button as="a" size="lg">
                {t('browse_book_catalog')}
              </Button>
            </Link>
            <Button
              href={membershipFormURL}
              target="_blank"
              rel="noopener noreferrer"
              variant="warning"
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
