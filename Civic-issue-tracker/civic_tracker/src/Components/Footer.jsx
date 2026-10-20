import React from "react";
import { Container, Row, Col, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { IoLocation } from "react-icons/io5";
import { IoIosMail } from "react-icons/io";

function Footer() {
  return (
    <footer
      className="text-light w-100 m-0"
      style={{
        backgroundColor: "#102c28",
        padding: "40px 0 25px",
        borderRadius: 0,
        boxSizing: "border-box"
      }}
    >
      <Container fluid className="px-4 px-md-5">
        <Row className="g-4">

          <Col xs={12} md={6} lg={3}>
            <h4 className="fw-bold mb-4 d-flex align-items-center">
              <img
                width="35"
                height="35"
                className="me-3"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfBxkIlIxwNyveMs8LN3oY4eEzKX6rMeSFpCZSuM3kk9MfHZZbegMZ68g&s=10"
                alt="Logo"
              />
              Civic-Tracker
            </h4>

            <p className="fw-bold mb-2">
              Your Voice. Your Community. Your Change.
            </p>

            <p className="mb-0">
              Helping citizens report local issues and build cleaner, safer
              communities together.
            </p>
          </Col>

          <Col xs={6} md={6} lg={3}>
            <h5 className="fw-bold mb-4">Quick Links</h5>
            <Nav className="flex-column gap-2">
              <Nav.Link as={Link} to="/" className="text-light p-0">Home</Nav.Link>
              <Nav.Link as={Link} to="/dashboard" className="text-light p-0">community</Nav.Link>
              <Nav.Link as={Link} to="/about" className="text-light p-0">About Us</Nav.Link>
              <Nav.Link as={Link} to="/contact" className="text-light p-0">Contact</Nav.Link>
            </Nav>
          </Col>

          <Col xs={6} md={6} lg={3}>
            <h5 className="fw-bold mb-4">Our Services</h5>
            <p className="mb-2">Report Civic Issues</p>
            <p className="mb-2">Track Complaints</p>
            <p className="mb-2">Support Your Community</p>
          </Col>

          <Col xs={12} md={6} lg={3}>
            <h5 className="fw-bold mb-4">Contact Us</h5>
            <p className="mb-2 text-break">
              <IoIosMail className="fs-5 me-2 text-success" />
              CivicTracker@gmail.com
            </p>
            <p className="mb-0">
              <IoLocation className="fs-5 me-2 text-success" />
              Kerala, India
            </p>
          </Col>

        </Row>

        <hr className="border-secondary my-4" />

        <Row>
          <Col className="text-center">
            <p className="mb-0">
              © 2026 Civic-Tracker. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;