import React from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';

const FooterComponent = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <Container>
        <Row>
          <Col md={4} className="mb-3 mb-md-0">
            <h5>Open Library</h5>
            <p>
              A community-driven library for sharing knowledge and stories.
              Built with open source. Powered by generosity.
            </p>
          </Col>
          <Col md={2} className="mb-3 mb-md-0">
            <h5>Quick Links</h5>
            <Nav className="flex-column">
              <Nav.Link href="#home" className="text-light px-0">
                Home
              </Nav.Link>
              <Nav.Link href="#catalog" className="text-light px-0">
                Catalog
              </Nav.Link>
              <Nav.Link href="#about" className="text-light px-0">
                About Us
              </Nav.Link>
              <Nav.Link href="#donate" className="text-light px-0">
                Donate
              </Nav.Link>
            </Nav>
          </Col>
          <Col md={3} className="mb-3 mb-md-0">
            <h5>Contact</h5>
            <p className="mb-1">Email: info@openlibrary.community</p>
            <p>Address: 123 Library Lane, Knowledge City, World</p>
          </Col>
          <Col md={3}>
            <h5>Follow Us</h5>
            <div>
              <a href="#facebook" className="text-light me-3">
                Facebook
              </a>
              <a href="#twitter" className="text-light me-3">
                Twitter
              </a>
              <a href="#instagram" className="text-light me-3">
                Instagram
              </a>
              <a href="#linkedin" className="text-light">
                Linkedin
              </a>
            </div>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col className="text-center text-muted">
            <small>
              &copy; {new Date().getFullYear()} Open Library Community. All
              Rights Reserved.
            </small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default FooterComponent;
