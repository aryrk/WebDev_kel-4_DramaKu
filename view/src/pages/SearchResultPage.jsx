import React, { useEffect, useState } from "react";
import { useGlobalState } from "../components/GlobalStateContext";
import { useLocation } from "react-router-dom"; // To get query params
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Image } from "react-bootstrap";
import { withConfig } from "../Config";
import { Link } from "react-router-dom";
import AddDrama from "./AddDrama";

const MovieCard = (props) => {
  const { id, src, title, year, genre = [], cast = [], views } = props;
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
                    {title}
                  </h5>
                  <p className="mb-1" style={{ color: "white" }}>
                    {year}
                  </p>
                  <p className="mb-1" style={{ color: "white" }}>
                    {genre.map((title, i) => (
                      <span key={i}>
                        {title}
                        {i < genre.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </p>
                  <p className="mb-1" style={{ color: "white" }}>
                    {cast.map((title, i) => (
                      <span key={i}>
                        {title}
                        {i < cast.length - 1 ? " • " : ""}
                      </span>
                    ))}
                  </p>
                  <p style={{ color: "white" }}>{views} views</p>
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

  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get("query") || "";

  useEffect(() => {
    if (searchTerm) {
      fetch(`/api/movies-search?search=${encodeURIComponent(searchTerm)}`)
        .then((response) => response.json())
        .then((data) => {
          setMovies(Array.isArray(data.movies) ? data.movies : []);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }, [searchTerm]);

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
                  genre={Array.isArray(movie.genres) ? movie.genres : []}
                  cast={Array.isArray(movie.cast) ? movie.cast : []}
                  views={movie.views || "N/A"}
                />
              ))}
            </Row>
          </Container>
        </section>
      ) : (
        <p>Tidak ada hasil. Cari dengan kata kunci lain.</p>
      )}
      <AddDrama />
    </>
  );
};

export default withConfig(SearchResultPage);
