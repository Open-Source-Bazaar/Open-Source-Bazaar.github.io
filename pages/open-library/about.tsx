import React from 'react';
import { Card, Col, Container, Image, Row } from 'react-bootstrap';

import { ContentContainer, Layout } from '../../components/open-library/Layout';

export default function AboutPage() {
  return (
    <Layout title="About - Open Library">
      <ContentContainer>
        <div className="mb-5">
          <h1 className="display-4 mb-4">关于社区图书馆</h1>

          <Card className="border-0 shadow-sm mb-5">
            <Card.Body className="p-4">
              <h2 className="mb-4">我们的使命</h2>
              <p className="lead">
                freeCodeCamp 成都社区「Open
                Library」是一个开放、共享的社区图书馆，旨在促进知识交流，推动社区成员之间的学习和成长，增强社区成员之间的互动与信任。
              </p>
              <p>
                我们深知知识的流动能够点燃创新的火花，因此，我们采用了一种独特的"无储存"借阅模式，让书籍在会员之间自由流转，而非集中存放。这种模式不仅节省了物理空间，更重要的是促进了社区成员之间的直接交流和互动。
              </p>
            </Card.Body>
          </Card>

          <Row className="mb-5">
            <Col md={6} className="mb-4 mb-md-0">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <h3 className="mb-3">我们的价值观</h3>
                  <ul className="list-unstyled">
                    <li className="mb-3">
                      <div className="d-flex">
                        <div className="me-3">
                          <span className="text-primary fw-bold fs-4">✦</span>
                        </div>
                        <div>
                          <h5>开放共享</h5>
                          <p>
                            我们相信知识应该是开放和共享的，每个人都有权利获取和贡献知识。
                          </p>
                        </div>
                      </div>
                    </li>
                    <li className="mb-3">
                      <div className="d-flex">
                        <div className="me-3">
                          <span className="text-primary fw-bold fs-4">✦</span>
                        </div>
                        <div>
                          <h5>社区驱动</h5>
                          <p>
                            我们的图书馆完全由社区成员驱动，每个人都可以贡献和受益。
                          </p>
                        </div>
                      </div>
                    </li>
                    <li className="mb-3">
                      <div className="d-flex">
                        <div className="me-3">
                          <span className="text-primary fw-bold fs-4">✦</span>
                        </div>
                        <div>
                          <h5>信任与责任</h5>
                          <p>
                            我们基于互相信任建立借阅系统，同时鼓励每个人对所借书籍负责。
                          </p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <h3 className="mb-3">我们的特色</h3>
                  <ul className="list-unstyled">
                    <li className="mb-3">
                      <div className="d-flex">
                        <div className="me-3">
                          <span className="text-success fw-bold fs-4">✓</span>
                        </div>
                        <div>
                          <h5>"无储存"借阅模式</h5>
                          <p>
                            书籍在会员之间直接流转，无需集中存放，促进社区成员之间的直接交流。
                          </p>
                        </div>
                      </div>
                    </li>
                    <li className="mb-3">
                      <div className="d-flex">
                        <div className="me-3">
                          <span className="text-success fw-bold fs-4">✓</span>
                        </div>
                        <div>
                          <h5>社区捐赠</h5>
                          <p>
                            所有书籍均来自社区成员的捐赠，体现了共享和互助的精神。
                          </p>
                        </div>
                      </div>
                    </li>
                    <li className="mb-3">
                      <div className="d-flex">
                        <div className="me-3">
                          <span className="text-success fw-bold fs-4">✓</span>
                        </div>
                        <div>
                          <h5>线上管理</h5>
                          <p>
                            通过飞书多维表格进行书籍管理和借阅记录，方便透明。
                          </p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Card className="border-0 shadow-sm mb-5">
            <Card.Body className="p-4">
              <h2 className="mb-4">我们的团队</h2>
              <p>
                Open Library 由 freeCodeCamp
                成都社区的志愿者团队运营。我们的团队成员来自各行各业，但都有一个共同的目标：促进知识共享和社区建设。
              </p>

              <Row className="mt-4">
                <Col md={4} className="mb-4 text-center">
                  <Image
                    src="/images/placeholder-profile.svg"
                    roundedCircle
                    width={120}
                    height={120}
                    className="mb-3"
                  />
                  <h5>张伟</h5>
                  <p className="text-muted">图书馆创始人</p>
                </Col>
                <Col md={4} className="mb-4 text-center">
                  <Image
                    src="/images/placeholder-profile.svg"
                    roundedCircle
                    width={120}
                    height={120}
                    className="mb-3"
                  />
                  <h5>李梅</h5>
                  <p className="text-muted">社区协调员</p>
                </Col>
                <Col md={4} className="mb-4 text-center">
                  <Image
                    src="/images/placeholder-profile.svg"
                    roundedCircle
                    width={120}
                    height={120}
                    className="mb-3"
                  />
                  <h5>王晨</h5>
                  <p className="text-muted">技术支持</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <h2 className="mb-4">加入我们</h2>
              <p>
                如果你热爱阅读，愿意分享知识，欢迎加入 freeCodeCamp
                成都社区「Open Library」，成为知识流动的一部分！
              </p>
              <p>成为会员后，你可以：</p>
              <ul>
                <li>借阅其他会员捐赠的书籍</li>
                <li>捐赠自己的书籍给社区</li>
                <li>参与社区组织的读书会和讨论</li>
                <li>结识志同道合的朋友</li>
              </ul>
              <div className="text-center mt-4">
                <a
                  href="https://open-source-bazaar.feishu.cn/share/base/form/shrcngQgMrhjTh6ycO1zcaEWZld"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-lg"
                >
                  申请成为会员
                </a>
              </div>
            </Card.Body>
          </Card>
        </div>
      </ContentContainer>
    </Layout>
  );
}
