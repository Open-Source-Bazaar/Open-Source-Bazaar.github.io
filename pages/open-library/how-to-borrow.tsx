import Link from 'next/link';
import { observer } from 'mobx-react';
import { useContext } from 'react';
import { Button, Card, Col, ListGroup, Row } from 'react-bootstrap';

import { PageHead } from '../../components/Layout/PageHead';
import { ContentContainer } from '../../components/open-library/Layout';
import { I18nContext } from '../../models/Translation';

const catalogURL =
  'https://open-source-bazaar.feishu.cn/share/base/view/shrcnvT0Lyk8LKS8KtPbO9HPPHb';
const borrowFormURL =
  'https://open-source-bazaar.feishu.cn/share/base/form/shrcnNiKwb9ApzFFGI3YkCXDdwe?prefill_%E6%93%8D%E4%BD%9C=%E5%80%9F%E5%85%A5';
const handoffFormURL =
  'https://open-source-bazaar.feishu.cn/share/base/form/shrcnuDb3oOuhMjSaXNIHEPA4Ef?prefill_%E6%93%8D%E4%BD%9C=%E5%80%9F%E5%87%BA';
const membershipFormURL =
  'https://open-source-bazaar.feishu.cn/share/base/form/shrcngQgMrhjTh6ycO1zcaEWZld';

const borrowSteps = [
  {
    title: '查阅书籍',
    description: (
      <>
        社区成员可以在{' '}
        <a href={catalogURL} target="_blank" rel="noopener noreferrer">
          fCC 成都社区图书馆
        </a>{' '}
        中查找自己感兴趣的书籍，或者在我们的 <Link href="/open-library/books">书籍目录</Link>{' '}
        中浏览。
      </>
    ),
  },
  {
    title: '申请借阅',
    description: (
      <>
        找到心仪的书籍后，填写{' '}
        <a href={borrowFormURL} target="_blank" rel="noopener noreferrer">
          fCC 成都社区图书馆-书籍借入
        </a>{' '}
        申请，与当前持书者取得联系。
      </>
    ),
  },
  {
    title: '线下传递',
    description: (
      <>
        双方约定时间和传递方式，通常可用快递传递书籍。请传递者填写{' '}
        <a href={handoffFormURL} target="_blank" rel="noopener noreferrer">
          fCC 成都社区图书馆-书籍传递
        </a>
        ，再将书籍传递出去。
      </>
    ),
  },
  {
    title: '阅读与分享',
    description:
      '借阅者在阅读完毕后，可以分享自己的阅读感悟，并在社区推荐给下一位感兴趣的成员。我们鼓励借阅者在归还前写下简短的书评。',
  },
  {
    title: '继续传递',
    description: '当有新的借阅者申请时，当前持书人将书籍传递给下一位读者，确保知识的持续流动。',
  },
];

const borrowRules = [
  ['借阅期限', '每本书的标准借阅期为 30 天，如需延长可与图书馆管理员联系。'],
  ['借阅数量', '每位会员同时最多可借阅 3 本书。'],
  ['书籍状态', '借阅者有责任保持书籍的良好状态，避免损坏、标记或丢失。'],
  ['传递责任', '当前持书人负责将书籍安全传递给下一位借阅者，并承担相关的传递费用。'],
  [
    '丢失或损坏',
    '如果书籍在您借阅期间丢失或严重损坏，请联系图书馆管理员并考虑捐赠一本相同或类似的书籍作为替代。',
  ],
];

const questions = [
  [
    '如何知道一本书是否可借？',
    '您可以在飞书多维表格或我们的网站书籍目录中查看书籍的当前状态。如果标记为“可借阅”，则表示该书可以申请借阅。',
  ],
  [
    '我需要支付借阅费用吗？',
    'Open Library 不收取借阅费用，但借阅者需要承担书籍传递的相关费用（如快递费）。',
  ],
  [
    '如果当前没有人申请借我手中的书，我需要归还吗？',
    '标准借阅期为 30 天。如果期满后没有新的借阅申请，您可以继续保留该书，但请随时准备传递给下一位申请者。',
  ],
  [
    '如何联系当前持书人？',
    '当您提交借阅申请后，我们会为您提供当前持书人的联系方式，以便您们协商传递事宜。',
  ],
  [
    '如果我想长期保留一本书怎么办？',
    'Open Library 的宗旨是促进知识流动，我们鼓励书籍在会员之间传递。如果您特别喜欢某本书，建议购买一本自己的副本，或者考虑捐赠一本相同的书籍给图书馆。',
  ],
  [
    '我可以借阅电子书吗？',
    '目前 Open Library 主要提供实体书的借阅服务。我们正在考虑未来增加电子书资源，敬请期待。',
  ],
];

const HowToBorrowPage = observer(() => {
  const { t } = useContext(I18nContext);

  return (
    <ContentContainer>
        <PageHead title="How to Borrow - Open Library" />

        <div className="mb-5">
          <h1 className="display-4 mb-4">{t('how_to_borrow_page')}</h1>

          <Card className="border-0 shadow-sm mb-5 p-4" body>
            <h2 className="mb-4">{t('borrowing_and_passing')}</h2>
            <p className="lead">
              在 Open Library，所有书籍均来自社区成员的捐赠，并由借阅者直接
              <strong>传递</strong>给下一位借书人。
            </p>
            <p>
              我们采用的是一种独特的“无储存”借阅模式，让书籍在会员之间自由流转，而非集中存放。这种模式不仅节省了物理空间，更重要的是促进了社区成员之间的直接交流和互动。
            </p>
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
                        <p className="mb-0">{description}</p>
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
                <nav className="d-grid gap-2" aria-label="Open Library 快速链接">
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
                  <Link href="/open-library/books" passHref legacyBehavior>
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
              <Link href="/open-library/books" passHref legacyBehavior>
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
    </ContentContainer>
  );
});

export default HowToBorrowPage;
