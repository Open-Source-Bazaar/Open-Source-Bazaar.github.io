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
      <Container fluid>
        <Navbar.Brand href="#home" className="d-flex align-items-center">
          Open Library
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#catalog">Catalog</Nav.Link>
            <Nav.Link href="#about">About</Nav.Link>
            <Nav.Link href="#donate">Donate</Nav.Link>
            <Nav.Link href="#how-to-borrow">How to Borrow</Nav.Link>
            <Nav.Link href="#review">Review</Nav.Link>
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
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
