import React, { useEffect } from "react";
import {
  Container,
  Navbar,
  Nav,
  Form,
  Button,
  NavDropdown,
  Row,
  Col,
  Image,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./componentsStyle/CustomNavbar.css";
import { withConfig } from "../Config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
// import "@fortawesome/fontawesome-free/css/all.min.css";

const CustomNavbar = ({ config }) => {
  useEffect(() => {
    document.title = `Page 1 - ${config.short_name}`;
  }, [config]);

  return (
    <>
      {/* Navbar Atas */}
      <Navbar sticky="top" expand="lg" className="navbar-custom">
        <Container>
          {/* Navbar Toggle for Mobile */}
          <Navbar.Toggle aria-controls="top-navbar-nav" className="d-lg-none" />

          {/* Brand and Search Icon for Mobile */}
          <Navbar.Brand className="mx-auto d-lg-none">
            <Image
              src="src/assets/images/logo.png"
              width={30}
              height={30}
              loading="lazy"
              className="img_contain d-inline-block align-top "
            />
            {config.short_name}
          </Navbar.Brand>
          <Nav className="ms-auto d-lg-none">
            <Nav.Link href="#search">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </Nav.Link>
          </Nav>

          {/* Navbar Collapse for Desktop */}
          <Navbar.Collapse id="top-navbar-nav" className="d-block">
            <Container>
              <Row>
                <Col>
                  <Nav className="me-auto d-none d-lg-flex align-items-center">
                    <Navbar.Brand className="me-3">
                      <Image
                        src="src/assets/images/logo.png"
                        width={30}
                        height={30}
                        loading="lazy"
                        className="d-inline-block align-top img_contain"
                      />
                      {config.short_name}
                    </Navbar.Brand>
                    <Nav.Link href="#indonesia" className="navbar-custom">
                      Indonesia
                    </Nav.Link>
                    <Nav.Link href="#japan" className="navbar-custom">
                      Japan
                    </Nav.Link>
                    <Nav.Link href="#korea" className="navbar-custom">
                      Korea
                    </Nav.Link>
                    <Nav.Link href="#spanyol" className="navbar-custom">
                      Spanyol
                    </Nav.Link>
                    <Nav.Link href="#inggris" className="navbar-custom">
                      Inggris
                    </Nav.Link>
                    <Nav.Link href="#amerika" className="navbar-custom">
                      Amerika
                    </Nav.Link>
                    <Nav.Link href="#thailand" className="navbar-custom">
                      Thailand
                    </Nav.Link>
                    <Nav.Link href="#filiphina" className="navbar-custom">
                      Filiphina
                    </Nav.Link>
                    <Nav.Link href="#taiwan" className="navbar-custom">
                      Taiwan
                    </Nav.Link>
                  </Nav>
                </Col>
                <Col className="align-items-center override-flex justify-content-center">
                  <Form className="d-none d-lg-flex w-auto">
                    <Form.Control
                      type="text"
                      placeholder="Search"
                      aria-label="Search"
                      style={{ maxWidth: "270px" }}
                    />
                    <Nav className="d-none d-lg-flex align-items-center ms-2">
                      <Nav.Link
                        href="#search"
                        className="d-flex align-items-center search-icon"
                      >
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                      </Nav.Link>
                    </Nav>
                  </Form>
                </Col>
              </Row>
            </Container>
          </Navbar.Collapse>

          {/* Navbar Collapse for Mobile */}
          {/* <Navbar.Collapse id="top-navbar-nav" className="d-lg-none">
            <Nav className="flex-column">
              <NavDropdown
                title="Countries"
                id="countries-dropdown"
                className="d-lg-none"
              >
                <NavDropdown.Item href="#indonesia">Indonesia</NavDropdown.Item>
                <NavDropdown.Item href="#japan">Japan</NavDropdown.Item>
                <NavDropdown.Item href="#korea">Korea</NavDropdown.Item>
                <NavDropdown.Item href="#korea">Spanyol</NavDropdown.Item>
                <NavDropdown.Item href="#korea">Inggris</NavDropdown.Item>
                <NavDropdown.Item href="#korea">Amerika</NavDropdown.Item>
                <NavDropdown.Item href="#korea">Thailand</NavDropdown.Item>
                <NavDropdown.Item href="#korea">Filiphina</NavDropdown.Item>
                <NavDropdown.Item href="#korea">Taiwan</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse> */}
        </Container>
      </Navbar>

      {/* Navbar Bawah */}
      <Navbar sticky="top" expand="lg" className="navbar-custom">
        <Container>
          {/* Navbar Toggle for Mobile */}
          <Navbar.Toggle
            aria-controls="bottom-navbar-nav"
            className="d-lg-none mx-auto"
          />
          <Navbar.Collapse id="bottom-navbar-nav" className="text-center">
            <Nav className="justify-content-center">
              <NavDropdown
                title="Countries"
                id="countries-dropdown"
                className="d-lg-none"
              >
                <NavDropdown.Item href="#indonesia">Indonesia</NavDropdown.Item>
                <NavDropdown.Item href="#japan">Japan</NavDropdown.Item>
                <NavDropdown.Item href="#korea">Korea</NavDropdown.Item>
                <NavDropdown.Item href="#korea">Spanyol</NavDropdown.Item>
                <NavDropdown.Item href="#korea">Inggris</NavDropdown.Item>
                <NavDropdown.Item href="#korea">Amerika</NavDropdown.Item>
                <NavDropdown.Item href="#korea">Thailand</NavDropdown.Item>
                <NavDropdown.Item href="#korea">Filiphina</NavDropdown.Item>
                <NavDropdown.Item href="#korea">Taiwan</NavDropdown.Item>
              </NavDropdown>

              <Navbar.Brand>Filter by:</Navbar.Brand>

              <NavDropdown title="Year" id="year-dropdown" className="me-2">
                <NavDropdown.Item href="#2024">2024</NavDropdown.Item>
                <NavDropdown.Item href="#2023">2023</NavDropdown.Item>
                <NavDropdown.Item href="#2022">2022</NavDropdown.Item>
                <NavDropdown.Item href="#2021">2021</NavDropdown.Item>
                <NavDropdown.Item href="#2020">2020</NavDropdown.Item>
              </NavDropdown>

              <NavDropdown title="Genre" id="genre-dropdown" className="me-2">
                <NavDropdown.Item href="#action">Action</NavDropdown.Item>
                <NavDropdown.Item href="#biography">Biography</NavDropdown.Item>
                <NavDropdown.Item href="#comedy">Comedy</NavDropdown.Item>
                <NavDropdown.Item href="#documentary">
                  Documentary
                </NavDropdown.Item>
                <NavDropdown.Item href="#family">Family</NavDropdown.Item>
              </NavDropdown>

              <NavDropdown title="Status" id="status-dropdown" className="me-2">
                <NavDropdown.Item href="#completed">Completed</NavDropdown.Item>
                <NavDropdown.Item href="#ongoing">On-Going</NavDropdown.Item>
              </NavDropdown>

              <NavDropdown
                title="Availability"
                id="availability-dropdown"
                className="me-2"
              >
                <NavDropdown.Item href="#fansub">Fansub</NavDropdown.Item>
              </NavDropdown>

              <NavDropdown title="Award" id="award-dropdown" className="me-2">
                <NavDropdown.Item href="#oscar-winning">
                  Oscar-Winning
                </NavDropdown.Item>
                <NavDropdown.Item href="#emmy-award-winning">
                  Emmy Award-Winning
                </NavDropdown.Item>
                <NavDropdown.Item href="#golden-globe-winning">
                  Golden Globe-Winning
                </NavDropdown.Item>
                <NavDropdown.Item href="#best-picture-winning">
                  Best Picture-Winning
                </NavDropdown.Item>
                <NavDropdown.Item href="#best-director-winning">
                  Best Director-Winning
                </NavDropdown.Item>
              </NavDropdown>

              <NavDropdown
                title="Sorted by"
                id="sorted-dropdown"
                className="me-2"
              >
                <NavDropdown.Item href="#alphabetics">
                  Alphabetics
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Button className="bg_pallete_3 border-0 ms-2" type="submit">
              Clear Filter
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default withConfig(CustomNavbar);
