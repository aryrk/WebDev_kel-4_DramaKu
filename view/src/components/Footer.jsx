import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const [activeCountry, setActiveCountry] = useState("");
  const [searchTerm, setSearchTerm] = useState("all");
  const [searchCountry, setSearchCountry] = useState("all");
  const [searchYear, setSearchYear] = useState("all");
  const [searchGenre, setSearchGenre] = useState("all");
  const [searchAward, setSearchAward] = useState("all");
  const navigate = useNavigate();

  const [country, setCountry] = useState([]);

  useEffect(() => {
    fetch("/api/cms/countrylist")
      .then((res) => res.json())
      .then((data) => {
        setCountry(data);
        console.log(data);
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

  const remainingCountries = country.slice(5);

  return (
    <footer
      className="py-5"
      style={{
        backgroundColor: "#212121",
        color: "white",
        width: "100%",
      }}
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
              <Button variant="link" className="p-0" style={{ color: "white" }}>
                <FontAwesomeIcon icon={faGithub} size="lg" />
              </Button>
            </div>
          </Col>

          {country && (
            <Col xs={12} md={2}>
              <h6 className="text-uppercase">Countries</h6>
              <ListGroup variant="flush">
                {country.slice(0, 5).map((countryItem) => (
                  <ListGroup.Item
                    key={countryItem.id}
                    className={`bg-transparent p-0 border-0 ${
                      activeCountry === country ? "active" : ""
                    }`}
                    onClick={(e) => {
                      setActiveCountry(countryItem.name);
                      setSearchGenre("all");
                      handleSearch(e, searchTerm, countryItem.name); // Trigger search
                    }}
                    style={{ cursor: "pointer" }} // Change cursor on hover
                  >
                    <a
                      onClick={(e) => {
                        setActiveCountry(countryItem.name); // Set the active country
                        handleSearch(e, searchTerm, countryItem.name); // Trigger search
                      }}
                      className="text-decoration-none"
                      style={{
                        color: activeCountry === country ? "cream" : "white",
                      }}
                    >
                      {countryItem.name}
                    </a>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
          )}

          {genre && (
            <Col xs={12} md={2}>
              <h6 className="text-uppercase">Genre</h6>
              <ListGroup variant="flush">
                {genre.slice(0, 5).map((genreItem) => (
                  <ListGroup.Item
                    key={genreItem.id}
                    className="bg-transparent p-0 border-0"
                    onClick={(e) => {
                      setSearchGenre(genreItem.name); // Set selected genre
                      handleSearch(
                        e,
                        searchTerm,
                        searchCountry,
                        searchYear,
                        genreItem.name
                      ); // Trigger search for genre
                    }}
                    style={{ cursor: "pointer" }} // Change cursor on hover
                  >
                    <a
                      onClick={(e) => {
                        setSearchGenre(genreItem.name); // Set selected genre
                        handleSearch(
                          e,
                          searchTerm,
                          searchCountry,
                          searchYear,
                          genreItem.name
                        ); // Trigger search for genre
                      }}
                      className="text-decoration-none"
                      style={{ color: "white" }}
                    >
                      {genreItem.name}
                    </a>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
          )}

          <Col xs={12} md={4} className="d-none">
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
  );
};

export default withConfig(Footer);
