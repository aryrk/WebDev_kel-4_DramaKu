import React, { useEffect, useState } from "react";
import { Col, Container, Row, Image } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import { useGlobalState } from "../components/GlobalStateContext";
import Pagination from "../components/Pagination"; // Import the Pagination component
import "./pagesStyle/ContentCard.css";
import { withConfig } from "../Config";

function ContentCard({ config }) {
  const { setShowNavigation, setShowFooter, setShowSidebar } = useGlobalState();

  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalMovies, setTotalMovies] = useState(0);
  const limit = 32;

  useEffect(() => {
    setShowNavigation(true);
    setShowFooter(true);
    setShowSidebar(false);
  }, [setShowNavigation]);

  useEffect(() => {
    const offset = (currentPage - 1) * limit;
    fetch(`/api/all-movies?limit=${limit}&offset=${offset}`)
      .then((response) => response.json())
      .then((data) => {
        setMovies(data.movies);
        setTotalMovies(data.total);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [currentPage]);

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
                    src={
                      card.poster.includes("/public/uploads/")
                        ? `${config.server}${card.poster}`
                        : card.poster
                    }
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
          {/* Pagination Component */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </Container>
      ) : (
        <h1>Loading...</h1>
      )}
    </center>
  );
}

export default withConfig(ContentCard);
