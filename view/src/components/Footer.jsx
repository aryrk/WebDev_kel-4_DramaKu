import React, { useEffect } from "react";
import { withConfig } from "../Config";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container, Row, Col, Button, ListGroup, Form } from "react-bootstrap";
import {
  faFacebook,
  faGithub,
  faInstagram,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";

const Footer = ({ config }) => {
  useEffect(() => {
    document.title = `Page 1 - ${config.short_name}`;
  }, [config]);

  return (
    <>
      <footer
        className="py-5"
        style={{ backgroundColor: "#212121", color: "wheat" }}
      >
        <Container>
          <Row className="g-4">
            <Col xs={12} md={4}>
              <h5>PlutoCinema</h5>
              <p>
                Kami menyediakan film terbaru dan terbaik untuk Anda. Tonton
                film sekarang juga!
              </p>
              <div className="d-flex flex-wrap">
                <Button
                  variant="link"
                  className="p-0 me-2"
                  style={{ color: "wheat" }}
                >
                  <FontAwesomeIcon icon={faTwitter} size="lg" />
                </Button>
                <Button
                  variant="link"
                  className="p-0 me-2"
                  style={{ color: "wheat" }}
                >
                  <FontAwesomeIcon icon={faFacebook} size="lg" />
                </Button>
                <Button
                  variant="link"
                  className="p-0 me-2"
                  style={{ color: "wheat" }}
                >
                  <FontAwesomeIcon icon={faInstagram} size="lg" />
                </Button>
                <Button
                  variant="link"
                  className="p-0"
                  style={{ color: "wheat" }}
                >
                  <FontAwesomeIcon icon={faGithub} size="lg" />
                </Button>
              </div>
            </Col>

            <Col xs={12} md={2}>
              <h6 className="text-uppercase">Countries</h6>
              <ListGroup variant="flush">
                <ListGroup.Item className="bg-transparent p-0 border-0">
                  <a
                    href="#"
                    className="text-decoration-none"
                    style={{ color: "wheat" }}
                  >
                    Indonesia
                  </a>
                </ListGroup.Item>
                <ListGroup.Item className="bg-transparent p-0 border-0">
                  <a
                    href="#"
                    className="text-decoration-none"
                    style={{ color: "wheat" }}
                  >
                    Jepang
                  </a>
                </ListGroup.Item>
                <ListGroup.Item className="bg-transparent p-0 border-0">
                  <a
                    href="#"
                    className="text-decoration-none"
                    style={{ color: "wheat" }}
                  >
                    Korea
                  </a>
                </ListGroup.Item>
                <ListGroup.Item className="bg-transparent p-0 border-0">
                  <a
                    href="#"
                    className="text-decoration-none"
                    style={{ color: "wheat" }}
                  >
                    Spanyol
                  </a>
                </ListGroup.Item>
              </ListGroup>
            </Col>

            <Col xs={12} md={2}>
              <h6 className="text-uppercase">Genre</h6>
              <ListGroup variant="flush">
                <ListGroup.Item className="bg-transparent p-0 border-0">
                  <a
                    href="#"
                    className="text-decoration-none"
                    style={{ color: "wheat" }}
                  >
                    Action
                  </a>
                </ListGroup.Item>
                <ListGroup.Item className="bg-transparent p-0 border-0">
                  <a
                    href="#"
                    className="text-decoration-none"
                    style={{ color: "wheat" }}
                  >
                    Biography
                  </a>
                </ListGroup.Item>
                <ListGroup.Item className="bg-transparent p-0 border-0">
                  <a
                    href="#"
                    className="text-decoration-none"
                    style={{ color: "wheat" }}
                  >
                    Comedy
                  </a>
                </ListGroup.Item>
                <ListGroup.Item className="bg-transparent p-0 border-0">
                  <a
                    href="#"
                    className="text-decoration-none"
                    style={{ color: "wheat" }}
                  >
                    Documentary
                  </a>
                </ListGroup.Item>
              </ListGroup>
            </Col>

            <Col xs={12} md={4}>
              <h6 className="text-uppercase">Subscribe to Newsletter</h6>
              <Form>
                <Form.Group controlId="formBasicEmail">
                  <Form.Control type="email" placeholder="Enter your email" />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-3">
                  Subscribe
                </Button>
              </Form>
            </Col>
          </Row>
          <hr className="my-5" />
          <p className="text-center" style={{ color: "wheat" }}>
            © Copyright 2024, All Rights Reserved by PlutoCinema
          </p>
        </Container>
      </footer>
    </>
  );
};

export default withConfig(Footer);
