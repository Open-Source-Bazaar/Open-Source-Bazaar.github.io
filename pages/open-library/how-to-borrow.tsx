import React from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';

import { ContentContainer, Layout } from '../../components/open-library/Layout';

export default function HowToBorrowPage() {
  return (
    <Layout title="How to Borrow - Open Library">
      <ContentContainer>
        <div className="mb-5">
          <h1 className="display-4 mb-4">如何借阅</h1>

          <Card className="border-0 shadow-sm mb-5">
            <Card.Body className="p-4">
              <h2 className="mb-4">借阅与传递模式</h2>
              <p className="lead">
                在 Open Library，所有书籍均来自社区成员的捐赠，并由借阅者直接
                <strong>传递</strong>给下一位借书人。
              </p>
              <p>
                我们采用的是一种独特的"无储存"借阅模式，让书籍在会员之间自由流转，而非集中存放。这种模式不仅节省了物理空间，更重要的是促进了社区成员之间的直接交流和互动。
              </p>
            </Card.Body>
          </Card>

          <Row className="mb-5">
            <Col lg={7} className="mb-4 mb-lg-0">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <h3 className="mb-4">借阅流程</h3>
                  <div className="position-relative">
                    <div
                      className="position-absolute h-100"
                      style={{
                        left: '24px',
                        width: '2px',
                        backgroundColor: '#e9ecef',
                        zIndex: 1,
                      }}
                    ></div>

                    <div
                      className="d-flex mb-4 position-relative"
                      style={{ zIndex: 2 }}
                    >
                      <div
                        className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                        style={{ width: '50px', height: '50px', flexShrink: 0 }}
                      >
                        <h4 className="mb-0">1</h4>
                      </div>
                      <div>
                        <h5>查阅书籍</h5>
                        <p>
                          社区成员可以在{' '}
                          <a
                            href="https://open-source-bazaar.feishu.cn/share/base/view/shrcnvT0Lyk8LKS8KtPbO9HPPHb"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            fCC 成都社区图书馆
                          </a>{' '}
                          中查找自己感兴趣的书籍，或者在我们的{' '}
                          <a href="/open-library/books">书籍目录</a> 中浏览。
                        </p>
                      </div>
                    </div>

                    <div
                      className="d-flex mb-4 position-relative"
                      style={{ zIndex: 2 }}
                    >
                      <div
                        className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                        style={{ width: '50px', height: '50px', flexShrink: 0 }}
                      >
                        <h4 className="mb-0">2</h4>
                      </div>
                      <div>
                        <h5>申请借阅</h5>
                        <p>
                          找到心仪的书籍后，填写{' '}
                          <a
                            href="https://open-source-bazaar.feishu.cn/share/base/form/shrcnNiKwb9ApzFFGI3YkCXDdwe?prefill_%E6%93%8D%E4%BD%9C=%E5%80%9F%E5%85%A5"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            fCC 成都社区图书馆-书籍借入
                          </a>{' '}
                          申请，与当前持书者取得联系。
                        </p>
                      </div>
                    </div>

                    <div
                      className="d-flex mb-4 position-relative"
                      style={{ zIndex: 2 }}
                    >
                      <div
                        className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                        style={{ width: '50px', height: '50px', flexShrink: 0 }}
                      >
                        <h4 className="mb-0">3</h4>
                      </div>
                      <div>
                        <h5>线下传递</h5>
                        <p>
                          双方约定时间和传递方式，通常可用快递传递书籍。请传递者填写{' '}
                          <a
                            href="https://open-source-bazaar.feishu.cn/share/base/form/shrcnuDb3oOuhMjSaXNIHEPA4Ef?prefill_%E6%93%8D%E4%BD%9C=%E5%80%9F%E5%87%BA"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            fCC 成都社区图书馆-书籍传递
                          </a>
                          ，再将书籍传递出去。
                        </p>
                      </div>
                    </div>

                    <div
                      className="d-flex mb-4 position-relative"
                      style={{ zIndex: 2 }}
                    >
                      <div
                        className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                        style={{ width: '50px', height: '50px', flexShrink: 0 }}
                      >
                        <h4 className="mb-0">4</h4>
                      </div>
                      <div>
                        <h5>阅读与分享</h5>
                        <p>
                          借阅者在阅读完毕后，可以分享自己的阅读感悟，并在社区推荐给下一位感兴趣的成员。我们鼓励借阅者在归还前写下简短的书评。
                        </p>
                      </div>
                    </div>

                    <div
                      className="d-flex position-relative"
                      style={{ zIndex: 2 }}
                    >
                      <div
                        className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                        style={{ width: '50px', height: '50px', flexShrink: 0 }}
                      >
                        <h4 className="mb-0">5</h4>
                      </div>
                      <div>
                        <h5>继续传递</h5>
                        <p>
                          当有新的借阅者申请时，当前持书人将书籍传递给下一位读者，确保知识的持续流动。
                        </p>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={5}>
              <Card className="border-0 shadow-sm mb-4">
                <Card.Body className="p-4">
                  <h3 className="mb-3">借阅规则</h3>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item px-0">
                      <strong>借阅期限：</strong> 每本书的标准借阅期为 30
                      天，如需延长可与图书馆管理员联系。
                    </li>
                    <li className="list-group-item px-0">
                      <strong>借阅数量：</strong> 每位会员同时最多可借阅 3
                      本书。
                    </li>
                    <li className="list-group-item px-0">
                      <strong>书籍状态：</strong>{' '}
                      借阅者有责任保持书籍的良好状态，避免损坏、标记或丢失。
                    </li>
                    <li className="list-group-item px-0">
                      <strong>传递责任：</strong>{' '}
                      当前持书人负责将书籍安全传递给下一位借阅者，并承担相关的传递费用。
                    </li>
                    <li className="list-group-item px-0">
                      <strong>丢失或损坏：</strong>{' '}
                      如果书籍在您借阅期间丢失或严重损坏，请联系图书馆管理员并考虑捐赠一本相同或类似的书籍作为替代。
                    </li>
                  </ul>
                </Card.Body>
              </Card>

              <Card className="border-0 shadow-sm">
                <Card.Body className="p-4">
                  <h3 className="mb-3">快速链接</h3>
                  <div className="d-grid gap-2">
                    <a
                      href="https://open-source-bazaar.feishu.cn/share/base/view/shrcnvT0Lyk8LKS8KtPbO9HPPHb"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-primary"
                    >
                      查看完整书籍目录
                    </a>
                    <a
                      href="https://open-source-bazaar.feishu.cn/share/base/form/shrcnNiKwb9ApzFFGI3YkCXDdwe?prefill_%E6%93%8D%E4%BD%9C=%E5%80%9F%E5%85%A5"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-primary"
                    >
                      填写借阅申请
                    </a>
                    <a
                      href="https://open-source-bazaar.feishu.cn/share/base/form/shrcnuDb3oOuhMjSaXNIHEPA4Ef?prefill_%E6%93%8D%E4%BD%9C=%E5%80%9F%E5%87%BA"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-primary"
                    >
                      填写书籍传递表
                    </a>
                    <a href="/open-library/books" className="btn btn-primary">
                      浏览书籍目录
                    </a>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Card className="border-0 shadow-sm mb-5">
            <Card.Body className="p-4">
              <h3 className="mb-4">常见问题解答</h3>
              <Row>
                <Col md={6} className="mb-4">
                  <h5>如何知道一本书是否可借？</h5>
                  <p>
                    您可以在飞书多维表格或我们的网站书籍目录中查看书籍的当前状态。如果标记为"可借阅"，则表示该书可以申请借阅。
                  </p>
                </Col>
                <Col md={6} className="mb-4">
                  <h5>我需要支付借阅费用吗？</h5>
                  <p>
                    Open Library
                    不收取借阅费用，但借阅者需要承担书籍传递的相关费用（如快递费）。
                  </p>
                </Col>
                <Col md={6} className="mb-4">
                  <h5>如果当前没有人申请借我手中的书，我需要归还吗？</h5>
                  <p>
                    标准借阅期为 30
                    天。如果期满后没有新的借阅申请，您可以继续保留该书，但请随时准备传递给下一位申请者。
                  </p>
                </Col>
                <Col md={6} className="mb-4">
                  <h5>如何联系当前持书人？</h5>
                  <p>
                    当您提交借阅申请后，我们会为您提供当前持书人的联系方式，以便您们协商传递事宜。
                  </p>
                </Col>
                <Col md={6} className="mb-4">
                  <h5>如果我想长期保留一本书怎么办？</h5>
                  <p>
                    Open Library
                    的宗旨是促进知识流动，我们鼓励书籍在会员之间传递。如果您特别喜欢某本书，建议购买一本自己的副本，或者考虑捐赠一本相同的书籍给图书馆。
                  </p>
                </Col>
                <Col md={6}>
                  <h5>我可以借阅电子书吗？</h5>
                  <p>
                    目前 Open Library
                    主要提供实体书的借阅服务。我们正在考虑未来增加电子书资源，敬请期待。
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <div className="text-center">
            <h3 className="mb-4">准备好借阅了吗？</h3>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <a href="/open-library/books" className="btn btn-primary btn-lg">
                浏览书籍目录
              </a>
              <a
                href="https://open-source-bazaar.feishu.cn/share/base/form/shrcngQgMrhjTh6ycO1zcaEWZld"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-primary btn-lg"
              >
                申请成为会员
              </a>
            </div>
          </div>
        </div>
      </ContentContainer>
    </Layout>
  );
}
