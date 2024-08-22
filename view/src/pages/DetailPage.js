import React from "react";
import { Container, Row, Col, Image, Card } from "react-bootstrap";
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
        <Container className="mw-100 mt-4 pt-1 pt-lg-0 p-0 ps-0 ps-md-3 ps-lg-0">
          <Row className="justify-content-center justify-content-md-start">
            <Col sm="auto" className="pe-0 pe-md-4">
              <center>
                <Image
                  src={poster}
                  fluid
                  thumbnail
                  loading="lazy"
                  style={{ width: "342px", height: "386px" }}
                  className="img_cover border-0 rounded-4 p-0"
                />
              </center>
            </Col>
            <Col
              sm="auto"
              className="text-start text-break ps-4 ps-md-0 pe-4 pe-md-0 mt-3 mt-lg-0 pt-1 mw-sm-100 mw-md-35 mw-xl-50"
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
              <p className="fs_secondary ">Year: {year}</p>
              <p className="fs_secondary">{synopsis}</p>
              <p className="fs_secondary mb-1">
                {genres.map((genre, i) => (
                  <span>
                    {" "}
                    {genre}
                    {i < genre.length - 1 ? ", " : ""}
                  </span>
                ))}
              </p>
              <p className="fs_secondary mb-1">Rating: {rating}</p>
              <p className="fs_secondary mb-1">Availability: {availability}</p>
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
      style={{ width: "8rem", display: "inline-block", verticalAlign: "top" }}
      className="border-0 ps-0 ps-lg-3 pe-2"
    >
      <center>
        <Card.Img
          className="img_cover border-0 rounded-3"
          fluid
          thumbnail
          src={src}
          loading="lazy"
          style={{ width: "110px", height: "141px" }}
        />
      </center>
      <Card.Body className="pt-2 pb-3 ps-0 pe-0">
        <Card.Text
          className="fs-6 text-center"
          style={{ whiteSpace: "break-spaces", textTransform: "capitalize" }}
        >
          {name}
        </Card.Text>
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
      <div className="ps-3 pe-3 ps-lg-0 pe-lg-0 mt-4 embed-responsive embed-responsive-16by9">
        <iframe
          className="embed-responsive-item rounded-3 w-100"
          src={src}
          allowFullScreen
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          style={{ height: "calc(35vw + 100px)" }}
          title={src}
        ></iframe>
      </div>
    </center>
  );
}

function DetailPage() {
  return (
    <center>
      <div className="w-sm-100 w-xl-75">
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
          className="container-fluid mt-4 ps-4 ps-md-4 ps-lg-0 pe-0"
          style={{ overflow: "hidden" }}
        >
          <div className="row">
            <div className="col-12 p-0">
              <div
                className="justify-content-center pe-2"
                style={{ whiteSpace: "nowrap", overflowX: "scroll" }}
              >
                <Actor
                  src="https://m.media-amazon.com/images/M/MV5BMjA3NzcyMDcyMF5BMl5BanBnXkFtZTcwNjQwMTczMQ@@._V1_.jpg"
                  name="Ben Mendelsohn"
                />
                <Actor
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz8Yx4CXaaAUDw_hLZSz7AojAoVahex0PKAg&s"
                  name="Bill Camp"
                />
                <Actor
                  src="https://m.media-amazon.com/images/M/MV5BYzk2ZTQwNTgtZTAxMy00ZTY3LTlkZTctMWE1NTNkNTk1MjA4XkEyXkFqcGdeQXVyMjQwMDg0Ng@@._V1_QL75_UY207_CR86,0,140,207_.jpg"
                  name="Jeremy bobb"
                />
                <Actor
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX3Ihna-KxO6oHbpPpANr5gFIqsjKnQ7W3kQ&s"
                  name="mare winningham"
                />
                <Actor
                  src="https://m.media-amazon.com/images/M/MV5BNDU1ODIxMzgyMF5BMl5BanBnXkFtZTYwMTU1NzE1._V1_FMjpg_UX1000_.jpg"
                  name="paddy considine"
                />
                <Actor
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4Y0zsQI4X3znM-wlz57c8NOFjSkQPRbJ8Yw&s"
                  name="yul vazquez"
                />
                <Actor
                  src="https://m.media-amazon.com/images/M/MV5BMjM1NDk3MTQ1N15BMl5BanBnXkFtZTgwMDMwODEyMDE@._V1_.jpg"
                  name="julianne nicholson"
                />
                <Actor
                  src="https://m.media-amazon.com/images/M/MV5BZTVhOTg1ZWMtNDVlMC00M2YwLThiZjMtMTgxOWU1ZTk4ZjQ3XkEyXkFqcGdeQXVyNDM5MjI4OA@@._V1_FMjpg_UX1000_.jpg"
                  name="marc menchaca"
                />
                <Actor
                  src="https://m.media-amazon.com/images/M/MV5BMTcyMTI3NzI1Nl5BMl5BanBnXkFtZTgwNjQ3Njk2NjM@._V1_.jpg"
                  name="cynthia erivo"
                />
                <Actor
                  src="https://m.media-amazon.com/images/M/MV5BMjI2MzA0ODYyMV5BMl5BanBnXkFtZTgwNzU0NTEyNzE@._V1_.jpg"
                  name="derek cecil"
                />
                <Actor
                  src="https://m.media-amazon.com/images/M/MV5BMTQyOTEyNTE3M15BMl5BanBnXkFtZTcwNjYyODUzMQ@@._V1_FMjpg_UX1000_.jpg"
                  name="hettienne park"
                />
                <Actor
                  src="https://m.media-amazon.com/images/M/MV5BYTgzZWUyOTItZjMwNy00NjhiLWIzMGEtZjFjMDdlNDM3YTZhXkEyXkFqcGdeQXVyOTc3ODMwODk@._V1_.jpg"
                  name="scarlett blum"
                />
                <Actor
                  src="https://m.media-amazon.com/images/M/MV5BYzg2Mzc5NjEtYjY5My00YWFhLWFjZTYtYTM0MmZkZDE5YzZlXkEyXkFqcGdeQXVyNjk2Nzg2MTE@._V1_FMjpg_UX1000_.jpg"
                  name="summer fontana"
                />
                <Actor
                  src="https://m.media-amazon.com/images/M/MV5BMTMwOTQ0MDUyNF5BMl5BanBnXkFtZTcwNTQ1MzY1Mw@@._V1_.jpg"
                  name="jason baterman"
                />
              </div>
            </div>
          </div>
        </div>

        <Trailer src="https://youtu.be/eNDKWr3Xmjk" />
      </div>
    </center>
  );
}

export default DetailPage;
