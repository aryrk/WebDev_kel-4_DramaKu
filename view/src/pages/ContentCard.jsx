import React, { useEffect, useState } from "react";
import { Col, Container, Row, Image, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import { useGlobalState } from "../components/GlobalStateContext";
import "./pagesStyle/ContentCard.css";

function ContentCard() {
  const { setShowNavigation, setShowFooter, setShowSidebar } = useGlobalState();

  // Pagination state
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalMovies, setTotalMovies] = useState(0); // To track total number of movies
  const limit = 10; // Number of movies per page

  useEffect(() => {
    setShowNavigation(true);
    setShowFooter(true);
    setShowSidebar(false);
  }, [setShowNavigation]);

  // Fetch movies with limit and offset
  useEffect(() => {
    const offset = (currentPage - 1) * limit;

    fetch(`/api/all-movies?limit=${limit}&offset=${offset}`)
      .then((response) => response.json())
      .then((data) => {
        setMovies(data.movies); // Assuming the API response contains { movies: [], total: number }
        setTotalMovies(data.total); // Update total movie count
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [currentPage]);

  // Calculate total pages
  const totalPages = Math.ceil(totalMovies / limit);

  return (
    <center>
      {movies.length > 0 ? (
        <Container className="d-inline m-0 mt-5 p-0 w-100">
          <Row className="m-0 p-0 mt-2 mb-5 g-4 justify-content-center">
            {movies.map((card, idx) => (
              <Col
                sm="auto"
                key={idx}
                className="d-flex justify-content-center content_col"
              >
                <a
                  href={`/detail/${card.id}`}
                  variant="text"
                  size="sm"
                  className="content_container"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    border: "none",
                    background: "transparent",
                  }}
                >
                  <Image
                    src={card.poster}
                    alt={card.title}
                    loading="lazy"
                    className="content_image p-0 border-0"
                    fluid
                    thumbnail
                    style={{
                      borderRadius: "15px",
                      objectFit: "cover",
                    }}
                  />
                  <label
                    style={{
                      marginTop: "8px",
                      textAlign: "center",
                      fontSize: "16px",
                      width: "100%",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    className="text-white"
                  >
                    {card.title}
                  </label>
                </a>
              </Col>
            ))}
          </Row>
          {/* Pagination controls */}
          <Row>
            <Col className="d-flex justify-content-center">
              <Button
                variant="primary"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="mx-3 my-auto">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="primary"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </Col>
          </Row>
        </Container>
      ) : (
        <h1>Loading...</h1>
      )}
    </center>
  );
}

export default ContentCard;
