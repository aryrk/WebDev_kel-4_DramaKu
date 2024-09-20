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
  Modal,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./componentsStyle/Navigation.css";
import { withConfig } from "../Config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import $ from "jquery";

const CustomNavbar = ({ config }) => {
  const [show, setShow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("all");
  const [searchCountry, setSearchCountry] = useState("all");
  const [searchYear, setSearchYear] = useState("all");
  const [searchGenre, setSearchGenre] = useState("all");
  const [searchAward, setSearchAward] = useState("all");
  const navigate = useNavigate(); // Initialize navigation

  const [country, setCountry] = useState([]);

  useEffect(() => {
    fetch("/api/cms/countrylist")
      .then((res) => res.json())
      .then((data) => {
        setCountry(data);
      });
  }, []);

  const [year, setYear] = useState([]);

  useEffect(() => {
    fetch("/api/cms/yearlist")
      .then((res) => res.json())
      .then((data) => {
        setYear(data);
      });
  }, []);

  const [award, setAward] = useState([]);

  useEffect(() => {
    fetch("/api/cms/awardlist")
      .then((res) => res.json())
      .then((data) => {
        setAward(data);
      });
  }, []);

  const [genre, setGenre] = useState([]);
  useEffect(() => {
    fetch("/api/cms/genrelist")
      .then((res) => res.json())
      .then((data) => {
        setGenre(data);
      });
  }, []);

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

  const handleSearch = (
    event,
    title = searchTerm,
    country = searchCountry,
    year = searchYear,
    genre = searchGenre,
    award = searchAward
  ) => {
    // event.preventDefault(); // Prevent form submission
    // if (searchTerm.trim()) {
    // Navigate to the search results page and pass the search term

    navigate(
      `/search?query=${encodeURIComponent(title)}&country=${encodeURIComponent(
        country
      )}&year=${encodeURIComponent(year)}&genre=${encodeURIComponent(
        genre
      )}&award=${encodeURIComponent(award)}`
    );
    // }
  };

  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);

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

              {country && (
                <Nav className="d-none d-lg-flex">
                  {country.slice(0, 5).map((country) => (
                    <Nav.Link
                      key={country.id}
                      onClick={(e) => {
                        setSearchCountry(country.name);
                        handleSearch(e, searchTerm, country.name);
                      }}
                      // href={`#${country.name.toLowerCase()}`}
                      className="navbar-custom"
                    >
                      {country.name}
                    </Nav.Link>
                  ))}
                </Nav>
              )}
            </Nav>

            {/* Search Form */}
            <Form
              className="d-flex ms-auto my-2 my-lg-0 justify-content-end"
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch(e);
              }}
            >
              <Form.Control
                type="text"
                placeholder="Search"
                aria-label="Search"
                className="me-2"
                style={{ maxWidth: "280px" }}
                value={searchTerm != "all" ? searchTerm : ""}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  // submit search on enter
                  handleSearch(e, e.target.value);
                }}
              />
              <Button variant="outline-light" type="submit">
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
              {year && (
                <NavDropdown title="Year" id="year-dropdown" className="me-2">
                  {year.map((year) => (
                    <NavDropdown.Item
                      key={year.year}
                      onClick={(e) => {
                        setSearchYear(year.year);
                        handleSearch(e, searchTerm, searchCountry, year.year);
                      }}
                    >
                      {year.year}
                    </NavDropdown.Item>
                  ))}
                </NavDropdown>
              )}

              {genre && (
                <NavDropdown title="Genre" id="genre-dropdown" className="me-2">
                  {genre.map((genre) => (
                    <NavDropdown.Item
                      key={genre.id}
                      onClick={(e) => {
                        setSearchGenre(genre.name);
                        handleSearch(
                          e,
                          searchTerm,
                          searchCountry,
                          searchYear,
                          genre.name
                        );
                      }}
                    >
                      {genre.name}
                    </NavDropdown.Item>
                  ))}
                </NavDropdown>
              )}

              {award && (
                <NavDropdown title="Award" id="award-dropdown" className="me-2">
                  {award.map((award) => (
                    <NavDropdown.Item
                      key={award.id}
                      onClick={(e) => {
                        setSearchAward(award.name);
                        handleSearch(
                          e,
                          searchTerm,
                          searchCountry,
                          searchYear,
                          searchGenre,
                          award.name
                        );
                      }}
                    >
                      {award.name}
                    </NavDropdown.Item>
                  ))}
                </NavDropdown>
              )}

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
              onClick={(e) => {
                setSearchCountry("all");
                setSearchYear("all");
                setSearchGenre("all");
                setSearchAward("all");
                handleSearch(e, searchTerm, "all", "all", "all", "all");
              }}
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
