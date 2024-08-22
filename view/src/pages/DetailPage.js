import React from "react";
import { Container, Row, Col, Image, Card, CardGroup } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function MovieInfo(props) {
  const {
    poster,
    judul,
    otherTitles,
    year,
    synopsis,
    genres,
    rating,
    availability,
  } = props;
  return (
    <div>
      <center>
        <Container className="mt-4 pt-1 pt-lg-0 mw-lg-75 p-0">
          <Row className="justify-content-center">
            <Col sm="auto">
              <Image
                src={poster}
                fluid
                thumbnail
                style={{ width: "342px", height: "386px" }}
                className="img_cover border-0 rounded-4 p-0"
              />
            </Col>
            <Col
              sm="auto"
              className="text-start text-break ps-4 ps-lg-0 pe-4 pe-lg-0 mt-3 mt-lg-0 pt-1 mw-sm-10 mw-lg-50"
            >
              <p className="mb-1 fs_primary fs-1 fs-lg-5">{judul}</p>
              <p className="mb-1 fs_secondary">
                Other titles:
                {otherTitles.map((title, i) => (
                  <span>
                    {" "}
                    {title}
                    {i < title.length - 1 ? ", " : ""}
                  </span>
                ))}
              </p>
              <p className="fs_secondary ">Year: Spring 2024</p>
              <p className="fs_secondary">
                Synopsis sometimes unhelpful. I don't read it throughly. But
                what helps me is the henres. I need to see the genres and
                actors. That is what i want.
              </p>
              <p className="fs_secondary mb-1">Gendre 1, Gendre 2, Gendre 3</p>
              <p className="fs_secondary mb-1">Rating: 3.5</p>
              <p className="fs_secondary mb-1">Availability: Fansub bla bla</p>
            </Col>
          </Row>
        </Container>
      </center>
    </div>
  );
}

function Actor(props) {
  const { src, name } = props;
  return (
    <Card
      style={{ width: "8rem", display: "inline-block" }}
      className="border-0 pe-2"
    >
      <Card.Img
        className="img_cover border-0 rounded-3"
        fluid
        thumbnail
        src={src}
        style={{ width: "110px", height: "141px" }}
      />
      <Card.Body className="pt-2 pb-3">
        <Card.Text className="fs-6 text-center">{name}</Card.Text>
      </Card.Body>
    </Card>
  );
}

function Trailer(props) {
  var { src } = props;
  if (src.includes("youtu.be")) {
    src = src.replace("youtu.be", "youtube.com/embed");
  }
  if (src.includes("watch?v=")) {
    src = src.replace("watch?v=", "embed/");
  }
  return (
    <center>
      <div className="ps-3 pe-3 ps-lg-0 pe-lg-0 mt-4 w-sm-100 w-lg-75 embed-responsive embed-responsive-16by9">
        <iframe
          className="embed-responsive-item rounded-3 w-100"
          src={src}
          allowFullScreen
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          style={{ height: "calc(35vw + 100px)" }}
        ></iframe>
      </div>
    </center>
  );
}

function DetailPage() {
  return (
    <div>
      <MovieInfo
        poster="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/action-mistery-movie-poster-design-template-2ec690d65c22aa12e437d765dbf7e4af_screen.jpg?ts=1680854635"
        judul="The OUTSIDER"
        otherTitles={["The OUTSIDER", "B"]}
        year="2024"
        synopsis="Synopsis sometimes unhelpful. I don't read it throughly. But what helps me is the henres. I need to see the genres and actors. That is what i want."
        genres={["Gendre 1", "Gendre 2", "Gendre 3"]}
        rating="3.5"
        availability="Fansub bla bla"
      />
      <div
        className="container-fluid w-100 w-lg-75 mt-4 ps-4 ps-lg-0"
        style={{ overflow: "hidden" }}
      >
        <div className="row">
          <div className="col-12 p-0">
            <div
              className="justify-content-center"
              style={{ whiteSpace: "nowrap", overflowY: "scroll" }}
            >
              <Actor
                src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/action-mistery-movie-poster-design-template-2ec690d65c22aa12e437d765dbf7e4af_screen.jpg?ts=1680854635"
                name="Actor 1"
              />
              <Actor
                src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/action-mistery-movie-poster-design-template-2ec690d65c22aa12e437d765dbf7e4af_screen.jpg?ts=1680854635"
                name="Actor 1"
              />
              <Actor
                src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/action-mistery-movie-poster-design-template-2ec690d65c22aa12e437d765dbf7e4af_screen.jpg?ts=1680854635"
                name="Actor 1"
              />
              <Actor
                src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/action-mistery-movie-poster-design-template-2ec690d65c22aa12e437d765dbf7e4af_screen.jpg?ts=1680854635"
                name="Actor 1"
              />
              <Actor
                src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/action-mistery-movie-poster-design-template-2ec690d65c22aa12e437d765dbf7e4af_screen.jpg?ts=1680854635"
                name="Actor 1"
              />
              <Actor
                src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/action-mistery-movie-poster-design-template-2ec690d65c22aa12e437d765dbf7e4af_screen.jpg?ts=1680854635"
                name="Actor 1"
              />
              <Actor
                src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/action-mistery-movie-poster-design-template-2ec690d65c22aa12e437d765dbf7e4af_screen.jpg?ts=1680854635"
                name="Actor 1"
              />
              <Actor
                src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/action-mistery-movie-poster-design-template-2ec690d65c22aa12e437d765dbf7e4af_screen.jpg?ts=1680854635"
                name="Actor 1"
              />
              <Actor
                src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/action-mistery-movie-poster-design-template-2ec690d65c22aa12e437d765dbf7e4af_screen.jpg?ts=1680854635"
                name="Actor 1"
              />
              <Actor
                src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/action-mistery-movie-poster-design-template-2ec690d65c22aa12e437d765dbf7e4af_screen.jpg?ts=1680854635"
                name="Actor 1"
              />
              <Actor
                src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/action-mistery-movie-poster-design-template-2ec690d65c22aa12e437d765dbf7e4af_screen.jpg?ts=1680854635"
                name="Actor 1"
              />
              <Actor
                src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/action-mistery-movie-poster-design-template-2ec690d65c22aa12e437d765dbf7e4af_screen.jpg?ts=1680854635"
                name="Actor 1"
              />
              <Actor
                src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/action-mistery-movie-poster-design-template-2ec690d65c22aa12e437d765dbf7e4af_screen.jpg?ts=1680854635"
                name="Actor 1"
              />
              <Actor
                src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/action-mistery-movie-poster-design-template-2ec690d65c22aa12e437d765dbf7e4af_screen.jpg?ts=1680854635"
                name="Actor 1"
              />
            </div>
          </div>
        </div>
      </div>

      <Trailer src="https://youtu.be/eNDKWr3Xmjk" />
    </div>
  );
}

export default DetailPage;
