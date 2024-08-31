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
        style={{ backgroundColor: "#212121", color: "white" }}
      >
        <Container>
          <Row className="g-4">
            <Col xs={12} md={4}>
              <h5>{config.short_name}</h5>
              <p>{config.description}</p>
              <div className="d-flex flex-wrap">
                <Button
                  variant="link"
                  className="p-0 me-2"
                  style={{ color: "white" }}
                >
                  <FontAwesomeIcon icon={faTwitter} size="lg" />
                </Button>
                <Button
                  variant="link"
                  className="p-0 me-2"
                  style={{ color: "white" }}
                >
                  <FontAwesomeIcon icon={faFacebook} size="lg" />
                </Button>
                <Button
                  variant="link"
                  className="p-0 me-2"
                  style={{ color: "white" }}
                >
                  <FontAwesomeIcon icon={faInstagram} size="lg" />
                </Button>
                <Button
                  variant="link"
                  className="p-0"
                  style={{ color: "white" }}
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
                    style={{ color: "white" }}
                  >
                    Indonesia
                  </a>
                </ListGroup.Item>
                <ListGroup.Item className="bg-transparent p-0 border-0">
                  <a
                    href="#"
                    className="text-decoration-none"
                    style={{ color: "white" }}
                  >
                    Jepang
                  </a>
                </ListGroup.Item>
                <ListGroup.Item className="bg-transparent p-0 border-0">
                  <a
                    href="#"
                    className="text-decoration-none"
                    style={{ color: "white" }}
                  >
                    Korea
                  </a>
                </ListGroup.Item>
                <ListGroup.Item className="bg-transparent p-0 border-0">
                  <a
                    href="#"
                    className="text-decoration-none"
                    style={{ color: "white" }}
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
                    style={{ color: "white" }}
                  >
                    Action
                  </a>
                </ListGroup.Item>
                <ListGroup.Item className="bg-transparent p-0 border-0">
                  <a
                    href="#"
                    className="text-decoration-none"
                    style={{ color: "white" }}
                  >
                    Biography
                  </a>
                </ListGroup.Item>
                <ListGroup.Item className="bg-transparent p-0 border-0">
                  <a
                    href="#"
                    className="text-decoration-none"
                    style={{ color: "white" }}
                  >
                    Comedy
                  </a>
                </ListGroup.Item>
                <ListGroup.Item className="bg-transparent p-0 border-0">
                  <a
                    href="#"
                    className="text-decoration-none"
                    style={{ color: "white" }}
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
          <p className="text-center" style={{ color: "white" }}>
            © Copyright 2024, All Rights Reserved by PlutoCinema
          </p>
        </Container>
      </footer>
    </>
  );
};

export default withConfig(Footer);
