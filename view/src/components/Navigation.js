import React, { useEffect } from "react";
import { Container, Navbar, NavbarCollapse, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { withConfig } from "../Config";

const Navigation = ({ config }) => {
  useEffect(() => {
    document.title = `Page 1 - ${config.short_name}`;
  }, [config]);
  return (
    <Navbar className="bg-body-tertiary">
      <Container className="ms-2" type="">
        <Navbar.Brand href="#home">{config.short_name}</Navbar.Brand>
        <NavbarCollapse className="justify-content-center">
          <div className="bg_secondary rounded p-2">
            Search Drama
          </div>
        </NavbarCollapse>
      </Container>
    </Navbar>
  );
};

export default withConfig(Navigation);
