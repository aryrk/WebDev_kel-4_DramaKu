import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import "./componentsStyle/Navigation.css";
import { withConfig } from "../Config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import $ from "jquery";

const CustomNavbar = ({ config }) => {
  const [show, setShow] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate(); // Initialize navigation

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

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <>
      {/* Top Navbar */}
      <Navbar sticky="top" expand="lg" className="navbar-custom">
        <Container>
          {/* Mobile Navbar Toggle */}
          <div className="d-lg-none d-flex justify-content-between align-items-center w-100">
            {/* Search Icon for Mobile */}
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
              <a href="/home" className="text-light">
                {config.short_name}
              </a>
            </Navbar.Brand>

            {/* Toggle Bottom Navbar */}
            <Button
              aria-controls="bottom-navbar-nav"
              onClick={handleToggleBottom}
              className="custom-toggler d-lg-none bg-transparent border-0 p-0 fs-4 pe-2"
            >
              <FontAwesomeIcon icon={faBars} />
            </Button>
          </div>

          {/* Desktop Navbar */}
          <Navbar.Collapse id="top-navbar-nav" className={show ? "show" : ""}>
            <Nav className="me-auto d-flex align-items-center">
              <Navbar.Brand className="me-3 d-none d-lg-flex align-items-center">
                <a href="/home" className="text-light logo_font">
                  {config.short_name}
                </a>
              </Navbar.Brand>

              {/* Navigation Links */}
              <Nav className="d-none d-lg-flex">
                {[
                  "Indonesia",
                  "Japan",
                  "Korea",
                  "Spanyol",
                  "Inggris",
                  "Amerika",
                  "Thailand",
                  "Filiphina",
                  "Taiwan",
                ].map((country) => (
                  <Nav.Link
                    key={country}
                    href={`#${country.toLowerCase()}`}
                    className="navbar-custom"
                  >
                    {country}
                  </Nav.Link>
                ))}
              </Nav>
            </Nav>

            {/* Search Form */}
            <Form className="d-flex ms-auto my-2 my-lg-0 justify-content-end">
              <Form.Control
                type="text"
                placeholder="Search"
                aria-label="Search"
                className="me-2"
                style={{ maxWidth: "280px" }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button variant="outline-light" onClick={handleSearch}>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Bottom Navbar */}
      <Navbar sticky="top" expand="lg" className="navbar-custom mt-2 p-0">
        <Container>
          <Navbar.Collapse id="bottom-navbar-nav" className="text-center">
            <Nav className="justify-content-center">
              <NavDropdown title="Countries" id="countries-dropdown">
                {[
                  "Indonesia",
                  "Japan",
                  "Korea",
                  "Spanyol",
                  "Inggris",
                  "Amerika",
                  "Thailand",
                  "Filiphina",
                  "Taiwan",
                ].map((country) => (
                  <NavDropdown.Item
                    key={country}
                    href={`#${country.toLowerCase()}`}
                  >
                    {country}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>

              <NavDropdown title="Year" id="year-dropdown" className="me-2">
                {["2024", "2023", "2022", "2021", "2020"].map((year) => (
                  <NavDropdown.Item key={year} href={`#${year}`}>
                    {year}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>

              <NavDropdown title="Genre" id="genre-dropdown" className="me-2">
                {["Action", "Biography", "Comedy", "Documentary", "Family"].map(
                  (genre) => (
                    <NavDropdown.Item
                      key={genre}
                      href={`#${genre.toLowerCase()}`}
                    >
                      {genre}
                    </NavDropdown.Item>
                  )
                )}
              </NavDropdown>

              <NavDropdown title="Status" id="status-dropdown" className="me-2">
                {["Completed", "On-Going"].map((status) => (
                  <NavDropdown.Item
                    key={status}
                    href={`#${status.toLowerCase()}`}
                  >
                    {status}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>

              <NavDropdown
                title="Availability"
                id="availability-dropdown"
                className="me-2"
              >
                <NavDropdown.Item href="#fansub">Fansub</NavDropdown.Item>
              </NavDropdown>

              <NavDropdown title="Award" id="award-dropdown" className="me-2">
                {[
                  "Oscar-Winning",
                  "Emmy Award-Winning",
                  "Golden Globe-Winning",
                  "Best Picture-Winning",
                  "Best Director-Winning",
                ].map((award) => (
                  <NavDropdown.Item
                    key={award}
                    href={`#${award.toLowerCase()}`}
                  >
                    {award}
                  </NavDropdown.Item>
                ))}
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

      {/* Optional Floating Logo */}
      <Image
        src={config.logo_png}
        loading="lazy"
        className="mt-2 ms-2 ms-xxl-3 pt-1 position-absolute top-0 left-0 align-top img_contain d-none d-xl-block"
        style={{ zIndex: "1000000000000000", width: "5vw", height: "80px" }}
      />
    </>
  );
};

export default withConfig(CustomNavbar);
