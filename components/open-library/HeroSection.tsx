import React from 'react';
import { Button, Col, Container, Image, Row } from 'react-bootstrap';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  browseText: string;
  browseLink?: string;
  heroImage: string;
  heroImageAlt: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  ctaText,
  ctaLink,
  browseText,
  browseLink = '/open-library/books',
  heroImage,
  heroImageAlt,
}) => (
  <section
    className="bg-primary text-white position-relative overflow-hidden vw-100"
    style={{
      marginLeft: 'calc(-50vw + 50%)',
      marginRight: 'calc(-50vw + 50%)',
      marginTop: '0',
      paddingTop: '7.5rem',
      paddingBottom: '7.5rem',
    }}
  >
    <Container fluid="xl" className="px-3">
      <Row className="align-items-center py-5">
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
                👥 {ctaText}
              </Button>
              <Button
                variant="outline-light"
                size="lg"
                href={browseLink}
                className="mb-2 rounded-pill px-4"
              >
                📖 {browseText}
              </Button>
            </div>
          </div>
        </Col>
        <Col lg={6} className="order-1 order-lg-2 text-center mb-5 mb-lg-0">
          <div className="position-relative">
            <Image src={heroImage} alt={heroImageAlt} fluid className="shadow-lg rounded" />
          </div>
        </Col>
      </Row>
    </Container>
  </section>
);

export default HeroSection;
