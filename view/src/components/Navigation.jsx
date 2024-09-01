import React, { useEffect, useState } from "react";
import {
  Container,
  Navbar,
  Nav,
  Form,
  Button,
  NavDropdown,
  Image,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./componentsStyle/Navbar.css";
import { withConfig } from "../Config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import $ from "jquery";

const CustomNavbar = ({ config }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    document.title = `Page 1 - ${config.short_name}`;
  }, [config]);

  const handleToggle = () => {
    setShow(!show);
    if ($("#bottom-navbar-nav").hasClass("show")) {
      $("#bottom-navbar-nav").removeClass("show");
    }
  };

  const handleToggleBottom = () => {
    setShow(false);
    $("#bottom-navbar-nav").toggleClass("show");
  };

  return (
    <>
      {/* Navbar Atas */}
      <Navbar sticky="top" expand="lg" className="navbar-custom">
        <Container>
          {/* Navbar Collapse for Mobile */}

          <div className="d-lg-none d-flex justify-content-between align-items-center w-100">
            {/* Toggle for Mobile */}
            <Button
              variant="link"
              onClick={handleToggle}
              className="p-0 custom-toggler fs-5 ps-2"
              aria-controls="top-navbar-nav"
              aria-expanded={show}
            >
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="text-white"
              />
            </Button>

            {/* Brand */}
            <Navbar.Brand className="d-flex align-items-center mx-auto">
              <Image
                src={config.logo_png}
                width={30}
                height={30}
                loading="lazy"
                className="img_contain d-inline-block align-top"
              />
              <div>{config.short_name}</div>
            </Navbar.Brand>

            <Button
              aria-controls="bottom-navbar-nav"
              onClick={handleToggleBottom}
              className="custom-toggler d-lg-none bg-transparent border-0 p-0 fs-4 pe-2"
            >
              <FontAwesomeIcon icon={faBars} />
            </Button>
          </div>

          {/* Navbar Collapse */}
          <Navbar.Collapse id="top-navbar-nav" className={show ? "show" : ""}>
            <Nav className="me-auto d-flex align-items-center">
              <Navbar.Brand className="me-3 d-none d-lg-flex align-items-center">
                <Image
                  src={config.logo_png}
                  width={30}
                  height={30}
                  loading="lazy"
                  className="d-inline-block align-top img_contain"
                />
                {config.short_name}
              </Navbar.Brand>
              <Nav className="d-none d-lg-flex">
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
              <Form className="d-flex ms-auto my-2 my-lg-0">
                <Form.Control
                  type="text"
                  placeholder="Search"
                  aria-label="Search"
                  className="me-2"
                  style={{ maxWidth: "270px" }}
                />
                <Button variant="outline-light">
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                </Button>
              </Form>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Navbar Bawah */}
      <Navbar sticky="top" expand="lg" className="navbar-custom mt-2 p-0">
        {/* Navbar Toggle for Mobile */}
        <Container>
          <Navbar.Collapse id="bottom-navbar-nav" className="text-center">
            <Nav className="justify-content-center">
              <NavDropdown title="Countries" id="countries-dropdown">
                <NavDropdown.Item href="#indonesia">Indonesia</NavDropdown.Item>
                <NavDropdown.Item href="#japan">Japan</NavDropdown.Item>
                <NavDropdown.Item href="#korea">Korea</NavDropdown.Item>
                <NavDropdown.Item href="#spanyol">Spanyol</NavDropdown.Item>
                <NavDropdown.Item href="#inggris">Inggris</NavDropdown.Item>
                <NavDropdown.Item href="#amerika">Amerika</NavDropdown.Item>
                <NavDropdown.Item href="#thailand">Thailand</NavDropdown.Item>
                <NavDropdown.Item href="#filiphina">Filiphina</NavDropdown.Item>
                <NavDropdown.Item href="#taiwan">Taiwan</NavDropdown.Item>
              </NavDropdown>

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
            <Button
              className="bg_pallete_3 border-0 ms-2 mb-3 mb-md-0"
              type="submit"
            >
              Clear Filter
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default withConfig(CustomNavbar);
