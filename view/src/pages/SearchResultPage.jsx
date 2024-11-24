import React, { useEffect, useState } from "react";
import { useGlobalState } from "../components/GlobalStateContext";
import { useLocation } from "react-router-dom"; // To get query params
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Image } from "react-bootstrap";
import { loadConfigNonAsync, withConfig } from "../Config";
import { Link } from "react-router-dom";
import Shortcut from "./Shortcut";

var server = loadConfigNonAsync();
server.then((result) => (server = result.server));

const MovieCard = (props) => {
  const { id, src, title, year, views } = props;
  return (
    <Col xs="12" sm="6" md="4" lg="3" className="mb-4">
      <Link
        to={`/detail/${id}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <div className="d-flex align-items-start h-100">
          <Container className="p-0">
            <Row className="g-0">
              <Col xs="4" sm="auto" className="p-0">
                <Image
                  className="img-fluid rounded img_cover search_result_img"
                  src={src}
                  fluid
                  loading="lazy"
                />
              </Col>
              <Col className="p-0">
                <div className="ms-3">
                  <h5 className="mb-1" style={{ color: "white" }}>
                    {title === undefined ? "Unknown" : `${title}`}
                  </h5>
                  <p className="mb-1" style={{ color: "white" }}>
                    {year === undefined ? "Unknown year" : year}
                  </p>
                  <p style={{ color: "white" }}>
                    {views === undefined
                      ? "N/A views"
                      : views === 0
                      ? "N/A views"
                      : `${views} views`}
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </Link>
    </Col>
  );
};

const SearchResultPage = ({ config }) => {
  const { setShowNavigation, setShowFooter, setShowSidebar } = useGlobalState();
  const [movies, setMovies] = useState([]);
  const location = useLocation();

  useEffect(() => {
    setShowNavigation(true);
    setShowFooter(true);
    setShowSidebar(false);
  }, [setShowNavigation]);

  const searchParams = new URLSearchParams(location.search) || "";
  const searchTerm = searchParams.get("query") || "";
  const country = searchParams.get("country") || "";
  const genre = searchParams.get("genre") || "";
  const year = searchParams.get("year") || "";
  const award = searchParams.get("award") || "";

  useEffect(() => {
    fetch(
      server +
        `/api/movies-search?search=${encodeURIComponent(
          searchTerm
        )}&country=${encodeURIComponent(country)}&genre=${encodeURIComponent(
          genre
        )}&year=${encodeURIComponent(year)}&award=${encodeURIComponent(award)}`
    )
      .then((response) => response.json())
      .then((data) => {
        setMovies(Array.isArray(data.movies) ? data.movies : []);
      })
      .catch((error) => {
        // console.error("Error:", error);
      });
  }, [searchTerm, country, genre, year, award, server]);

  return (
    <>
      {movies && movies.length > 0 ? (
        <section className="pt-3 pt-md-4 text-white">
          <Container fluid="md" className="p-0">
            <div className="text-center mb-4 mb-md-5">
              <p className="fs-7 fs-md-5 font-weight-bold">
                Results for "{searchTerm}"
              </p>
            </div>
            <Row className="m-0">
              {movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  id={movie.id}
                  src={
                    movie.poster.includes("/public/uploads/")
                      ? `${config.server}${movie.poster}`
                      : movie.poster
                  }
                  title={movie.title || "No Title"}
                  year={movie.year || "Unknown Year"}
                  views={movie.views || "N/A"}
                />
              ))}
            </Row>
          </Container>
        </section>
      ) : (
        <p>Tidak ada hasil. Cari dengan kata kunci lain.</p>
      )}
      <Shortcut />
    </>
  );
};

export default withConfig(SearchResultPage);
export { SearchResultPage, MovieCard };
