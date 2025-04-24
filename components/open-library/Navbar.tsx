import React from 'react';
import {
  Navbar,
  Nav,
  Container,
  Button,
  Form,
  FormControl,
} from 'react-bootstrap';

const NavbarComponent = () => {
  return (
    <Navbar bg="light" expand="lg" sticky="top" className="mb-4 shadow-sm">
      {/* 使用自定义的居中容器替代 Container fluid，与页面内容保持一致的宽度和居中效果 */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          width: '100%',
          boxSizing: 'border-box',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Navbar.Brand
          href="/open-library"
          className="d-flex align-items-center"
        >
          Open Library
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/open-library">Home</Nav.Link>
            <Nav.Link href="/open-library/books">Catalog</Nav.Link>
            <Nav.Link href="/open-library/about">About</Nav.Link>
            <Nav.Link href="/open-library/donate">Donate</Nav.Link>
            <Nav.Link href="/open-library/how-to-borrow">
              How to Borrow
            </Nav.Link>
            <Nav.Link href="/open-library/review">Review</Nav.Link>
          </Nav>
          <Form className="d-flex">
            <FormControl
              type="search"
              placeholder="Search Books..."
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-success">Search</Button>
          </Form>
          <Button variant="primary" className="ms-lg-2 mt-2 mt-lg-0">
            Login/Register
          </Button>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default NavbarComponent;
