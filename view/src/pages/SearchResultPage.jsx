import React, { useEffect } from "react";

import { useGlobalState } from "../components/GlobalStateContext";

import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Image } from "react-bootstrap";

function MovieCard(props) {
  const { src, title, year, genre, cast, views } = props;
  return (
    <Col sm="6" className="mb-4 ps-0 pe-0 ps-md-1 pe-md-1">
      <div className="d-flex align-items-start">
        <Container>
          <Row>
            <Col sm="auto" className="p-0">
              <Image
                className="w-sm-100 w-md-100 img-fluid rounded img_cover"
                src={src}
                fluid
                loading="lazy"
                style={{
                  width: "150px",
                  height: "150px",
                }}
              />
            </Col>
            <Col className="p-0">
              <div className="ms-4 ms-md-3 mt-3 mt-md-0">
                <h5 className="mb-1">{title}</h5>
                <p className=" mb-1">{year}</p>
                <p className=" mb-1">
                  {genre.map((title, i) => (
                    <span key={i}>
                      {title}
                      {i < genre.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </p>
                <p className=" mb-1">
                  {cast.map((title, i) => (
                    <span key={i}>
                      {title}
                      {i < cast.length - 1 ? " • " : ""}
                    </span>
                  ))}
                </p>
                <p className="">{views} views</p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </Col>
  );
}

const SearchResultPage = () => {
  const { setShowNavigation, setShowFooter } = useGlobalState();

  useEffect(() => {
    setShowNavigation(true);
    setShowFooter(true);
  }, [setShowNavigation]);
  return (
    <>
      <section className="pt-3 pt-md-4 text-wheat">
        <center>
          <Container className="p-0 m-0 w-100 text-start">
            <div className="text-center mb-4 mb-md-5">
              <p className="fs-7 fs-md-5 font-weight-bold">
                Searched/Tagged with "outsider"
              </p>
            </div>

            <Row className="m-0">
              <MovieCard
                src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/action-mistery-movie-poster-design-template-2ec690d65c22aa12e437d765dbf7e4af_screen.jpg?ts=1680854635"
                title="The Outsider"
                year="2022"
                genre={["Action", "Crime", "Drama"]}
                cast={["Jared Leto", "Tadanobu Asano", "Kippei Shîna"]}
                views="78"
              />

              <MovieCard
                src="https://m.media-amazon.com/images/M/MV5BMjAxMjUxMjAzOF5BMl5BanBnXkFtZTgwNjQzOTc4NDM@._V1_.jpg"
                title="The Outsider"
                year="2022"
                genre={["Action", "Crime", "Drama"]}
                cast={["Jared Leto", "Tadanobu Asano", "Kippei Shîna"]}
                views="78"
              />

              <MovieCard
                src="https://m.media-amazon.com/images/M/MV5BMTIzMjczMjg3M15BMl5BanBnXkFtZTcwODkxMDk0MQ@@._V1_FMjpg_UX1000_.jpg"
                title="The Outsider"
                year="2022"
                genre={["Action", "Crime", "Drama"]}
                cast={["Jared Leto", "Tadanobu Asano", "Kippei Shîna"]}
                views="78"
              />

              <MovieCard
                src="https://m.media-amazon.com/images/M/MV5BY2E4Njk4N2UtZWFhOS00NzczLWFmNDgtMzdhMjFlNTZjMmVhL2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_QL75_UX190_CR0,4,190,281_.jpg"
                title="The Outsider"
                year="2022"
                genre={["Action", "Crime", "Drama"]}
                cast={["Jared Leto", "Tadanobu Asano", "Kippei Shîna"]}
                views="78"
              />
              <MovieCard
                src="https://m.media-amazon.com/images/M/MV5BMTQwNDMxMDc2NF5BMl5BanBnXkFtZTgwNzk5MTI5MDE@._V1_QL75_UX190_CR0,2,190,281_.jpg"
                title="The Outsider"
                year="2022"
                genre={["Action", "Crime", "Drama"]}
                cast={["Jared Leto", "Tadanobu Asano", "Kippei Shîna"]}
                views="78"
              />
              <MovieCard
                src="https://i.mydramalist.com/0wxjQ4_4f.jpg"
                title="The Outsider"
                year="2022"
                genre={["Action", "Crime", "Drama"]}
                cast={["Jared Leto", "Tadanobu Asano", "Kippei Shîna"]}
                views="78"
              />
            </Row>
          </Container>
        </center>
      </section>
    </>
  );
};

export default SearchResultPage;
