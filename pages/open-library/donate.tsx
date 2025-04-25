import React from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';

import { ContentContainer, Layout } from '../../components/open-library/Layout';

export default function DonatePage() {
  return (
    <Layout title="Donate Books - Open Library">
      <ContentContainer>
        <div className="mb-5">
          <h1 className="display-4 mb-4">书籍募捐</h1>

          <Card className="border-0 shadow-sm mb-5">
            <Card.Body className="p-4">
              <h2 className="mb-4">为什么捐赠书籍？</h2>
              <p className="lead">
                您的一本书，可能会改变他人的一生。通过捐赠书籍，您不仅能够让闲置的知识重新流动，还能够帮助更多的人获取学习资源。
              </p>
              <p>
                在 Open
                Library，我们相信知识应该是流动的。您捐赠的每一本书都将在社区成员之间传递，让更多人受益。当您捐赠一本书，您不仅是在分享一个物品，更是在分享知识、经验和思想。
              </p>
            </Card.Body>
          </Card>

          <Row className="mb-5">
            <Col lg={6} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <h3 className="mb-3">捐赠流程</h3>
                  <ol className="list-group list-group-numbered mb-4">
                    <li className="list-group-item border-0 d-flex align-items-start">
                      <div>
                        <h5 className="mb-1">填写捐赠申请</h5>
                        <p className="mb-0">
                          填写我们的在线表单，提供您想要捐赠的书籍信息。
                        </p>
                      </div>
                    </li>
                    <li className="list-group-item border-0 d-flex align-items-start">
                      <div>
                        <h5 className="mb-1">书籍登记</h5>
                        <p className="mb-0">
                          如所捐赠书籍在「fCC
                          成都社区图书馆」还未登记，请先填写书籍登记表，然后回到第
                          1 步继续捐赠。建议在移动端设备上登记，方便扫描书籍
                          ISBN 码。
                        </p>
                      </div>
                    </li>
                    <li className="list-group-item border-0 d-flex align-items-start">
                      <div>
                        <h5 className="mb-1">书籍进入图书馆</h5>
                        <p className="mb-0">
                          完成以上流程后，书籍正式进入 Open Library
                          的传递流程，开始流转于社区成员之间。
                        </p>
                      </div>
                    </li>
                  </ol>
                  <div className="text-center mt-4">
                    <a
                      href="https://open-source-bazaar.feishu.cn/share/base/form/shrcncbxU0MpcN7pzG3MLNX0GEd?prefill_%E6%93%8D%E4%BD%9C=%E6%8D%90%E8%B5%A0"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                    >
                      填写捐赠申请
                    </a>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={6} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <h3 className="mb-3">书籍登记</h3>
                  <p>
                    如果您要捐赠的书籍在我们的图书馆中还未登记，请先完成书籍登记流程。这有助于我们维护一个完整的书籍数据库，方便其他会员查找和借阅。
                  </p>
                  <p>登记时，您需要提供以下信息：</p>
                  <ul>
                    <li>书籍标题</li>
                    <li>作者</li>
                    <li>ISBN（可通过扫描获取）</li>
                    <li>出版社</li>
                    <li>出版年份</li>
                    <li>书籍类别</li>
                    <li>书籍语言</li>
                    <li>书籍简介</li>
                    <li>书籍封面照片（可选）</li>
                  </ul>
                  <div className="text-center mt-4">
                    <a
                      href="https://open-source-bazaar.feishu.cn/share/base/form/shrcnFAX8q7mnywCQOsVnIS5Dwb"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-primary"
                    >
                      书籍登记表单
                    </a>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Card className="border-0 shadow-sm mb-5">
            <Card.Body className="p-4">
              <h3 className="mb-4">我们接受什么样的书籍？</h3>
              <Row>
                <Col md={6} className="mb-4">
                  <h5 className="text-success">✓ 我们欢迎</h5>
                  <ul>
                    <li>技术类书籍（编程、设计、数据科学等）</li>
                    <li>科学类书籍</li>
                    <li>商业和管理类书籍</li>
                    <li>自我提升类书籍</li>
                    <li>文学和小说</li>
                    <li>状态良好的二手书</li>
                  </ul>
                </Col>
                <Col md={6}>
                  <h5 className="text-danger">✗ 不适合捐赠</h5>
                  <ul>
                    <li>严重破损或缺页的书籍</li>
                    <li>有大量笔记或标记的书籍</li>
                    <li>过时的技术书籍（5年以上的技术书可能已过时）</li>
                    <li>教科书和习题集</li>
                    <li>杂志和期刊</li>
                  </ul>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="border-0 shadow-sm">
            <Row className="g-0">
              <Col md={5} className="d-none d-md-block">
                <div
                  className="h-100"
                  style={{
                    backgroundImage: 'url(/images/placeholder-library.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '300px',
                  }}
                ></div>
              </Col>
              <Col md={7}>
                <Card.Body className="p-4">
                  <h3 className="mb-3">常见问题</h3>
                  <div className="accordion" id="donationFAQ">
                    <div className="accordion-item border-0 mb-3">
                      <h2 className="accordion-header">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#faq1"
                        >
                          我捐赠的书籍会怎么处理？
                        </button>
                      </h2>
                      <div id="faq1" className="accordion-collapse collapse">
                        <div className="accordion-body">
                          您捐赠的书籍将进入我们的借阅系统，供社区成员借阅。当有人申请借阅时，书籍将从当前持有者（可能是您）直接传递给下一位借阅者。
                        </div>
                      </div>
                    </div>
                    <div className="accordion-item border-0 mb-3">
                      <h2 className="accordion-header">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#faq2"
                        >
                          我可以随时取回我捐赠的书籍吗？
                        </button>
                      </h2>
                      <div id="faq2" className="accordion-collapse collapse">
                        <div className="accordion-body">
                          一旦书籍捐赠给图书馆，我们视为您已将书籍所有权转让给社区。如果您希望再次阅读这本书，可以通过正常的借阅流程申请借阅。
                        </div>
                      </div>
                    </div>
                    <div className="accordion-item border-0 mb-3">
                      <h2 className="accordion-header">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#faq3"
                        >
                          如何知道我捐赠的书籍被谁借阅了？
                        </button>
                      </h2>
                      <div id="faq3" className="accordion-collapse collapse">
                        <div className="accordion-body">
                          您可以在我们的飞书多维表格中查看每本书的借阅记录，包括当前持有者和历史借阅情况。
                        </div>
                      </div>
                    </div>
                    <div className="accordion-item border-0">
                      <h2 className="accordion-header">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#faq4"
                        >
                          我需要成为会员才能捐赠书籍吗？
                        </button>
                      </h2>
                      <div id="faq4" className="accordion-collapse collapse">
                        <div className="accordion-body">
                          是的，我们要求捐赠者成为 Open Library
                          的会员。这有助于我们建立一个基于信任的社区，并确保书籍的流转质量。
                        </div>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Col>
            </Row>
          </Card>

          <div className="text-center mt-5">
            <h3 className="mb-4">准备好捐赠书籍了吗？</h3>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <a
                href="https://open-source-bazaar.feishu.cn/share/base/form/shrcncbxU0MpcN7pzG3MLNX0GEd?prefill_%E6%93%8D%E4%BD%9C=%E6%8D%90%E8%B5%A0"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-lg"
              >
                填写捐赠申请
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
