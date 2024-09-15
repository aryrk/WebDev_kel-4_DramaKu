import React, { useEffect, useState } from "react";
import { useGlobalState } from "../components/GlobalStateContext";
import { useLocation } from "react-router-dom"; // To get query params
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Image } from "react-bootstrap";

function MovieCard(props) {
  const { src, title, year, genre = [], cast = [], views } = props; // Default empty arrays if undefined
  return (
    <Col xs="12" sm="6" md="4" lg="3" className="mb-4">
      <div className="d-flex align-items-start h-100">
        <Container className="p-0">
          <Row className="g-0">
            <Col xs="4" sm="auto" className="p-0">
              <Image
                className="w-100 img-fluid rounded img_cover"
                src={src}
                fluid
                loading="lazy"
                style={{
                  width: "100%", // Responsively fill the width of its parent
                  height: "auto", // Maintain aspect ratio
                  maxWidth: "150px", // Maximum size for medium and larger screens
                }}
              />
            </Col>
            <Col className="p-0">
              <div className="ms-3">
                <h5 className="mb-1">{title}</h5>
                <p className="mb-1 text-muted">{year}</p>
                <p className="mb-1 text-muted">
                  {genre.map((title, i) => (
                    <span key={i}>
                      {title}
                      {i < genre.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </p>
                <p className="mb-1 text-muted">
                  {cast.map((title, i) => (
                    <span key={i}>
                      {title}
                      {i < cast.length - 1 ? " • " : ""}
                    </span>
                  ))}
                </p>
                <p className="text-muted">{views} views</p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </Col>
  );
}

const SearchResultPage = () => {
  const { setShowNavigation, setShowFooter, setShowSidebar } = useGlobalState();
  const [movies, setMovies] = useState([]);
  const location = useLocation();

  useEffect(() => {
    setShowNavigation(true);
    setShowFooter(true);
    setShowSidebar(false);
  }, [setShowNavigation]);

  // Extract search query from URL
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get("query") || ""; // Default to empty string if not found

  useEffect(() => {
    if (searchTerm) {
      fetch(`/api/movies-search?search=${encodeURIComponent(searchTerm)}`)
        .then((response) => response.json())
        .then((data) => {
          setMovies(Array.isArray(data.movies) ? data.movies : []); // Ensure movies is an array
          console.log(data.movies); // Log data.movies after state update
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
                  src={movie.poster || ""} // Provide default values if undefined
                  title={movie.title || "No Title"}
                  year={movie.year || "Unknown Year"}
                  genre={Array.isArray(movie.genres) ? movie.genres : []} // Ensure genre is an array
                  cast={Array.isArray(movie.cast) ? movie.cast : []} // Ensure cast is an array
                  views={movie.views || "N/A"}
                />
              ))}
            </Row>
          </Container>
        </section>
      ) : (
        <p>Tidak ada hasil. Cari dengan kata kunci lain.</p>
      )}
    </>
  );
};

export default SearchResultPage;
