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
  ListGroup,
  Dropdown,
  DropdownButton,
  Row,
  Col,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./componentsStyle/Navigation.css";
import { loadConfig, loadConfigNonAsync, withConfig } from "../Config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import $, { data } from "jquery";
import { jwtDecode } from "jwt-decode";
var server = loadConfigNonAsync();
server.then((result) => (server = result.server));

const CustomNavbar = ({ config }) => {
  const [show, setShow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("all");
  const [searchCountry, setSearchCountry] = useState("all");
  const [searchYear, setSearchYear] = useState("all");
  const [searchGenre, setSearchGenre] = useState("all");
  const [searchAward, setSearchAward] = useState("all");
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(false);
  const [activeCountry, setActiveCountry] = useState("");
  const [isFilterDisabled, setIsFilterDisabled] = useState(false);
  const handleCloseModal = () => setShowMore(false);
  const handleShowMore = () => {
    setShowMore((prevState) => !prevState);
  };
  const handleCountryClick = (country) => {
    setActiveCountry(country);
    setSearchCountry(country);
    handleSearch(null, searchTerm, country);
    setShowMore(false);
  };

  // const [country, setCountry] = useState([]);

  // useEffect(() => {
  //   fetch("/api/cms/countrylist")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setCountry(data);
  //     });
  // }, []);

  const [country, setCountry] = useState([]);

  const fetchCountries = async () => {
    try {
      //   const response = await fetch(server + "/api/cms/countrylist");
      //   const data = await response.json();
      //   setCountry(data); // Update the state with fetched countries
      // console.log(data);

      var temp_server = loadConfig();
      temp_server.then((result) => {
        server = result.server;
        fetch(server + "/api/cms/countrylist")
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            setCountry(data);
          });
      });
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  useEffect(() => {
    fetchCountries(); // Fetch countries when the component mounts
  }, [server]);

  const [year, setYear] = useState([]);

  useEffect(() => {
    fetch(server + "/api/cms/yearlist")
      .then((res) => res.json())
      .then((data) => {
        setYear(data);
      });
  }, [server]);

  const [award, setAward] = useState([]);

  useEffect(() => {
    fetch(server + "/api/cms/awardlist")
      .then((res) => res.json())
      .then((data) => {
        setAward(data);
      });
  }, [server]);

  const [genre, setGenre] = useState([]);

  useEffect(() => {
    fetch(server + "/api/cms/genrelist")
      .then((res) => res.json())
      .then((data) => {
        setGenre(data);
      });
  }, [server]);

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
    navigate(
      `/search?query=${encodeURIComponent(title)}&country=${encodeURIComponent(
        country
      )}&year=${encodeURIComponent(year)}&genre=${encodeURIComponent(
        genre
      )}&award=${encodeURIComponent(award)}`
    );
    // }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    setAllowedLogin(false);

    navigate("/login");
  };

  const [remainingCountries, setRemainingCountries] = useState([]);
  const token = sessionStorage.getItem("token");
  const [LoginAllowed, setAllowedLogin] = useState(false);
  const [Username, setUsername] = useState("");

  useEffect(() => {
    try {
      const decodedToken = jwtDecode(token);
      if (Array.isArray(country)) {
        setRemainingCountries(country.slice(5));
        console.log(country);
      }

      if (decodedToken.role === "admin" || decodedToken.role === "writer") {
        setAllowedLogin(true);
        setUsername(decodedToken.username);
        console.log(decodedToken.username);
      }
    } catch (error) {}
  }, [country, token]);

  return (
    <>
      {/* Top Navbar */}
      <Navbar
        sticky="top"
        expand="lg"
        className="navbar-custom pt-2 pb-0"
        style={{ zIndex: 1000000 }}
      >
        <Container>
          {/* Mobile Navbar Toggle */}
          <div className="d-lg-none d-flex justify-content-between align-items-center w-100">
            {/* Login Button for Mobile */}
            {/* <div className="dropdown-container d-lg-none">
              {LoginAllowed ? (
                <DropdownButton
                  id="dropdown-basic-button"
                  title={Username}
                  className="user-dropdown"
                >
                  <Dropdown.Item onClick={handleLogout}>Log Out</Dropdown.Item>
                </DropdownButton>
              ) : (
                <Button
                  variant="outline-light"
                  className="me-2"
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
              )}
            </div> */}

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
                  {country.slice(0, 5).map((countryItem) => (
                    <Nav.Link
                      key={countryItem.id}
                      onClick={(e) => {
                        setActiveCountry(countryItem.name);
                        handleSearch(e, searchTerm, countryItem.name);
                      }}
                      className={`navbar-custom ${
                        activeCountry === countryItem.name ? "active" : ""
                      }`}
                    >
                      {countryItem.name}
                    </Nav.Link>
                  ))}

                  {remainingCountries.length > 0 && (
                    <Nav.Link
                      onClick={handleShowMore}
                      className="navbar-custom show-more"
                    >
                      Show More
                    </Nav.Link>
                  )}
                </Nav>
              )}
            </Nav>

            <Modal
              className="customShowMore"
              show={showMore}
              onHide={handleCloseModal}
              fullscreen={true} // This makes the modal full screen on all devices
            >
              <Modal.Body>
                <ListGroup>
                  {remainingCountries
                    .sort((a, b) => a.name.localeCompare(b.name)) // Sort alphabetically by name
                    .reduce((rows, country, index) => {
                      // For every group of 6 countries, create a new row
                      if (index % 6 === 0) {
                        rows.push(remainingCountries.slice(index, index + 6));
                      }
                      return rows;
                    }, [])
                    .map((row, rowIndex) => (
                      <Row key={rowIndex} className="mb-3">
                        {row.map((countryItem) => (
                          <Col key={countryItem.id} xs={12} sm={6} md={2}>
                            <ListGroup.Item
                              onClick={() =>
                                handleCountryClick(countryItem.name)
                              }
                              style={{ cursor: "pointer", textAlign: "center" }} // Optional: center alignment
                            >
                              {countryItem.name}
                            </ListGroup.Item>
                          </Col>
                        ))}
                      </Row>
                    ))}
                </ListGroup>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>

            {/* Search Form */}
            <Form
              className="d-flex ms-auto my-2 my-lg-0 justify-content-end"
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch(e);
              }}
            >
              {/* Login Button for Desktop */}
              <div className="dropdown-container">
                {LoginAllowed ? (
                  <DropdownButton
                    id="dropdown-basic-button"
                    title={Username}
                    className="user-dropdown"
                  >
                    <Dropdown.Item onClick={handleLogout}>
                      Log Out
                    </Dropdown.Item>
                  </DropdownButton>
                ) : (
                  <Button
                    variant="outline-light"
                    className="me-2"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </Button>
                )}
              </div>

              <Form.Control
                type="text"
                placeholder="Search"
                aria-label="Search"
                className="me-2"
                style={{ maxWidth: "280px" }}
                value={searchTerm !== "all" ? searchTerm : ""}
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
      <Navbar sticky="top" expand="lg" className="navbar-custom mt-2 p-2">
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
              onClick={(handleClearFilter) => {
                setSearchCountry("all");
                setSearchYear("all");
                setSearchGenre("all");
                setSearchAward("all");
                handleSearch(
                  handleClearFilter,
                  searchTerm,
                  "all",
                  "all",
                  "all",
                  "all"
                );
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
