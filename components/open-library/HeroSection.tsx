import { Button, Col, Container, Image, Row } from 'idea-react';
import { FC } from 'react';

export interface HeroSectionProps extends Record<
  'title' | 'subtitle' | 'ctaText' | 'ctaLink' | 'browseText' | 'heroImage' | 'heroImageAlt',
  string
> {
  browseLink?: string;
}

export const HeroSection: FC<HeroSectionProps> = ({
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
    className="bg-primary fg-white position-relative overflow-hidden vw-100"
    style={{
      marginLeft: 'calc(-50vw + 50%)',
      marginRight: 'calc(-50vw + 50%)',
      marginTop: '0',
      paddingTop: '7.5rem',
      paddingBottom: '7.5rem',
    }}
  >
    <Container fluid="xl" className="px-5">
      <Row className="align-items-center py-12">
        <Col lg={6} className="order-2 lg:order-1">
          <div className="position-relative">
            <h1 className="fs-5xl fw-bold mb-7 fg-white">{title}</h1>
            <p className="fs-lg fw-light mb-7 fg-white fg-50">{subtitle}</p>
            <div className="mb-7">
              <Button
                theme="warning"
                size="lg"
                href={ctaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="me-5 mb-3 rounded-pill px-7 fw-bold fg-black"
              >
                👥 {ctaText}
              </Button>
              <Button
                theme="secondary"
                variant="outline"
                size="lg"
                href={browseLink}
                className="mb-3 rounded-pill px-7"
              >
                📖 {browseText}
              </Button>
            </div>
          </div>
        </Col>
        <Col lg={6} className="order-1 lg:order-2 text-center mb-12 lg:mb-0">
          <div className="position-relative">
            <Image src={heroImage} alt={heroImageAlt} fluid className="shadow-lg rounded" />
          </div>
        </Col>
      </Row>
    </Container>
  </section>
);
