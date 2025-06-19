import React from 'react';
import { Button, Col, Image, Row } from 'react-bootstrap';

import { ContentContainer } from './Layout';

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  heroImage?: string;
  heroImageAlt?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title = 'freeCodeCamp 成都社区 Open Library',
  subtitle = '让知识在社区中自由流动，连接每一个热爱学习的心',
  ctaText = '加入我们',
  ctaLink = 'https://open-source-bazaar.feishu.cn/share/base/form/shrcngQgMrhjTh6ycO1zcaEWZld',
  heroImage = '/images/open-library-hero.svg',
  heroImageAlt = '社区成员分享书籍',
}) => {
  return (
    <section
      className="bg-primary text-white position-relative overflow-hidden w-100"
      style={{
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
        width: '100vw',
        marginTop: '0',
        paddingTop: '7.5rem',
        paddingBottom: '7.5rem',
      }}
    >
      <ContentContainer>
        <Row className="align-items-center min-vh-60">
          <Col lg={6} className="order-2 order-lg-1">
            <div className="position-relative">
              <h1 className="display-4 fw-bold mb-4 text-white">{title}</h1>
              <p className="lead fs-5 mb-4 text-white-50">{subtitle}</p>
              <div className="mb-4">
                <Button
                  variant="warning"
                  size="lg"
                  href={ctaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="me-3 mb-2 rounded-pill px-4 fw-bold text-dark"
                >
                  <i className="bi bi-person-plus me-2"></i>
                  {ctaText}
                </Button>
                <Button
                  variant="outline-light"
                  size="lg"
                  href="/open-library/books"
                  className="mb-2 rounded-pill px-4"
                >
                  <i className="bi bi-book me-2"></i>
                  浏览图书
                </Button>
              </div>
            </div>
          </Col>
          <Col lg={6} className="order-1 order-lg-2 text-center mb-5 mb-lg-0">
            <div className="position-relative">
              <Image
                src={heroImage}
                alt={heroImageAlt}
                fluid
                className="shadow-lg rounded"
              />
            </div>
          </Col>
        </Row>
      </ContentContainer>
    </section>
  );
};

export default HeroSection;
