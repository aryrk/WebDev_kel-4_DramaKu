import React from "react";
import {
  Container,
  Row,
  Col,
  Image,
  Card,
  Form,
  Button,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { Rating } from "@mui/material";
import $ from "jquery";

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
        <Container className="mw-100 pt-1 pt-lg-0 p-0">
          <Row className="justify-content-center justify-content-md-start">
            <Col sm="auto" className="pe-0 pe-md-2 ps-0 ps-md-3">
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
              className="text-start text-break mw-sm-100 mw-md-35 mw-xl-50 pt-3 pt-md-0"
            >
              <p className="mb-1 fs_primary fs-1 fs-lg-5">{judul}</p>
              <p className="mb-1 fs_secondary">
                Other titles:
                {otherTitles.map((title, i) => (
                  <span key={i}>
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
                  <span key={i}>
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
      className="border-0 ps-0 ps-lg-1 bg-transparent text-white"
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
          className="fs_secondary text-center"
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
      <div className="mt-4 embed-responsive embed-responsive-16by9">
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

function CommentHeader(props) {
  const { totalComments } = props;

  return (
    <div className="mt-3 fs_sm_secondary">
      <Container className="d-grid w-100 mb-2">
        <Row className="justify-content-sm-center">
          <Col
            sm="auto"
            md="5"
            className="d-grid justify-content-center justify-content-md-start fs_sm_secondary fs_md_primary ps-0"
          >
            ({totalComments}) People think about this drama
          </Col>
          <Col
            sm="auto"
            md="7"
            className="d-grid justify-content-center justify-content-md-end"
          >
            <Container className="pe-0 ps-0 pt-2 pt-md-0">
              <Row>
                <Col className="col-sm-5 col-md-auto">Filtered by:</Col>
                <Col className="col-7 me-0 pe-0">
                  <select className="form-select form-select-sm bg-secondary border-0">
                    <option value="5">⭐⭐⭐⭐⭐</option>
                    <option value="5">⭐⭐⭐⭐</option>
                    <option value="5">⭐⭐⭐</option>
                    <option value="5">⭐⭐</option>
                    <option value="5">⭐</option>
                  </select>
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

function StarRating(props) {
  const { rating } = props;
  return (
    <div className="d-inline">
      {[...Array(5)].map((star, i) => {
        const ratingValue = i + 1;
        return (
          <FontAwesomeIcon
            icon={faStar}
            color={ratingValue <= rating ? "#ffc107" : "#e4e5e9"}
          />
        );
      })}
    </div>
  );
}

var comments, commentCount, commentShown, commentHidden;

$(document).ready(function () {
  $(".text_overflow_js").each(function () {
    var text = $(this).text();
    var originalText = text;
    if (text.length > 200) {
      $(this).html(
        text.substr(0, 200) +
          '... <button class="btn fs_secondary p-0 m-0 text-primary border-0" onclick="readMore(this,`' +
          originalText +
          '`)">Read more</button>'
      );
    }
  });

  comments = $(".comment");
  commentCount = comments.length;
  commentShown = 3;
  commentHidden = commentCount - commentShown;
  comments.slice(commentShown).addClass("d-none");
  $("#load_more_comments_div").html(
    '<button id="loadMore" class="btn bg-transparent border-0 p-0 m-0 text-primary mt-2"  onclick="loadMoreComments()">Load more rating ...</button>'
  );
  if (commentHidden === 0) {
    $("#loadMore").addClass("d-none");
  }
});

window.readMore = function (btn, text) {
  $(btn).parent().html(text);
  console.log("read more");
};

window.loadMoreComments = function () {
  console.log("load more");
  commentShown += 3;
  commentHidden = commentCount - commentShown;
  comments.slice(0, commentShown).removeClass("d-none");
  if (commentHidden === 0) {
    $("#loadMore").addClass("d-none");
  }
};
function Comment(props) {
  const { profile_src, username, date, rating, comment } = props;

  return (
    <Container className="p-0 justify-content-center align-middle mt-3 comment">
      <Row>
        <Col sm="2" md="1" className="p-0 col-2">
          <Image
            fluid
            loading="lazy"
            thumbnail
            src={profile_src}
            className="rounded-circle border-0 img_cover p-2 bg-transparent"
            style={{ width: "60px", height: "60px" }}
          />
        </Col>
        <Col md="11" className="p-0 col-9 pe-0 pe-md-3">
          <Container className="d-grid justify-content-start mt-1 ps-0 pe-0">
            <Row>
              <Col className="d-grid justify-content-start pe-0 fs_secondary text-start">
                <strong>
                  <span className="text-break">{username}</span>{" "}
                  <span className="d-inline-block">
                    · {date} · <StarRating rating={rating} />
                  </span>
                </strong>
              </Col>
              <div className="w-100"></div>
              <Col className="justify-content-start text-start pe-0 fs_secondary text_overflow_js">
                {comment}
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>
    </Container>
  );
}

function CommentSection() {
  return (
    <section>
      <CommentHeader totalComments="10k" />
      <Comment
        profile_src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
        username="Nara"
        date="4/4/2014"
        rating="4"
        comment="It is a wonderful drama! Love it so much!!! i need long comments
                to see how it is being seen in the display. Lorem ipsum dolor
                sit amet, consectetur adipiscing elit. Donec nec odio vitae
                nunc. Donec nec odio vitae nunc. Lorem ipsum dolor sit amet,
                consectetur adipiscing elit. Donec nec odio vitae nunc. Donec
                nec odio vitae nunc. Lorem ipsum dolor sit amet, consectetur
                adipiscing elit. Donec nec odio vitae nunc. Donec nec odio vitae
                nunc. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Donec nec odio vitae nunc. Donec nec odio vitae nunc. Lorem
                ipsum dolor sit amet, consectetur adipiscing elit. Donec nec
                odio vitae nunc. Donec nec odio vitae"
      />
      <Comment
        profile_src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
        username="Nara"
        date="4/4/2014"
        rating="4"
        comment="It is a wonderful drama! Love it so much!!! i need long comments
                to see how it is being seen in the display. Lorem ipsum dolor
                sit amet, consectetur adipiscing elit. Donec nec odio vitae
                nunc. Donec nec odio vitae nunc. Lorem ipsum dolor sit amet,
                consectetur adipiscing elit. Donec nec odio vitae nunc. Donec
                nec odio vitae nunc. Lorem ipsum dolor sit amet, consectetur
                adipiscing elit. Donec nec odio vitae nunc. Donec nec odio vitae
                nunc. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Donec nec odio vitae nunc. Donec nec odio vitae nunc. Lorem
                ipsum dolor sit amet, consectetur adipiscing elit. Donec nec
                odio vitae nunc. Donec nec odio vitae"
      />
      <Comment
        profile_src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
        username="Nara"
        date="4/4/2014"
        rating="4"
        comment="It is a wonderful drama! Love it so much!!! i need long comments
                to see how it is being seen in the display. Lorem ipsum dolor
                sit amet, consectetur adipiscing elit. Donec nec odio vitae
                nunc. Donec nec odio vitae nunc. Lorem ipsum dolor sit amet,
                consectetur adipiscing elit. Donec nec odio vitae nunc. Donec
                nec odio vitae nunc. Lorem ipsum dolor sit amet, consectetur
                adipiscing elit. Donec nec odio vitae nunc. Donec nec odio vitae
                nunc. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Donec nec odio vitae nunc. Donec nec odio vitae nunc. Lorem
                ipsum dolor sit amet, consectetur adipiscing elit. Donec nec
                odio vitae nunc. Donec nec odio vitae"
      />
      <Comment
        profile_src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
        username="Nara"
        date="4/4/2014"
        rating="4"
        comment="It is a wonderful drama! Love it so much!!! i need long comments
                to see how it is being seen in the display. Lorem ipsum dolor
                sit amet, consectetur adipiscing elit. Donec nec odio vitae
                nunc. Donec nec odio vitae nunc. Lorem ipsum dolor sit amet,
                consectetur adipiscing elit. Donec nec odio vitae nunc. Donec
                nec odio vitae nunc. Lorem ipsum dolor sit amet, consectetur
                adipiscing elit. Donec nec odio vitae nunc. Donec nec odio vitae
                nunc. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Donec nec odio vitae nunc. Donec nec odio vitae nunc. Lorem
                ipsum dolor sit amet, consectetur adipiscing elit. Donec nec
                odio vitae nunc. Donec nec odio vitae"
      />
      <Comment
        profile_src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
        username="Nara"
        date="4/4/2014"
        rating="4"
        comment="It is a wonderful drama! Love it so much!!! i need long comments
                to see how it is being seen in the display. Lorem ipsum dolor
                sit amet, consectetur adipiscing elit. Donec nec odio vitae
                nunc. Donec nec odio vitae nunc. Lorem ipsum dolor sit amet,
                consectetur adipiscing elit. Donec nec odio vitae nunc. Donec
                nec odio vitae nunc. Lorem ipsum dolor sit amet, consectetur
                adipiscing elit. Donec nec odio vitae nunc. Donec nec odio vitae
                nunc. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Donec nec odio vitae nunc. Donec nec odio vitae nunc. Lorem
                ipsum dolor sit amet, consectetur adipiscing elit. Donec nec
                odio vitae nunc. Donec nec odio vitae"
      />
      <Comment
        profile_src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
        username="Nara"
        date="4/4/2014"
        rating="4"
        comment="It is a wonderful drama! Love it so much!!! i need long comments
                to see how it is being seen in the display. Lorem ipsum dolor
                sit amet, consectetur adipiscing elit. Donec nec odio vitae
                nunc. Donec nec odio vitae nunc. Lorem ipsum dolor sit amet,
                consectetur adipiscing elit. Donec nec odio vitae nunc. Donec
                nec odio vitae nunc. Lorem ipsum dolor sit amet, consectetur
                adipiscing elit. Donec nec odio vitae nunc. Donec nec odio vitae
                nunc. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Donec nec odio vitae nunc. Donec nec odio vitae nunc. Lorem
                ipsum dolor sit amet, consectetur adipiscing elit. Donec nec
                odio vitae nunc. Donec nec odio vitae"
      />
      <Comment
        profile_src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
        username="Nara"
        date="4/4/2014"
        rating="4"
        comment="It is a wonderful drama! Love it so much!!! i need long comments
                to see how it is being seen in the display. Lorem ipsum dolor
                sit amet, consectetur adipiscing elit. Donec nec odio vitae
                nunc. Donec nec odio vitae nunc. Lorem ipsum dolor sit amet,
                consectetur adipiscing elit. Donec nec odio vitae nunc. Donec
                nec odio vitae nunc. Lorem ipsum dolor sit amet, consectetur
                adipiscing elit. Donec nec odio vitae nunc. Donec nec odio vitae
                nunc. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Donec nec odio vitae nunc. Donec nec odio vitae nunc. Lorem
                ipsum dolor sit amet, consectetur adipiscing elit. Donec nec
                odio vitae nunc. Donec nec odio vitae"
      />
      <Comment
        profile_src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
        username="Nara"
        date="4/4/2014"
        rating="4"
        comment="It is a wonderful drama! Love it so much!!! i need long comments
                to see how it is being seen in the display. Lorem ipsum dolor
                sit amet, consectetur adipiscing elit. Donec nec odio vitae
                nunc. Donec nec odio vitae nunc. Lorem ipsum dolor sit amet,
                consectetur adipiscing elit. Donec nec odio vitae nunc. Donec
                nec odio vitae nunc. Lorem ipsum dolor sit amet, consectetur
                adipiscing elit. Donec nec odio vitae nunc. Donec nec odio vitae
                nunc. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Donec nec odio vitae nunc. Donec nec odio vitae nunc. Lorem
                ipsum dolor sit amet, consectetur adipiscing elit. Donec nec
                odio vitae nunc. Donec nec odio vitae"
      />
      <Comment
        profile_src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
        username="Nara"
        date="4/4/2014"
        rating="4"
        comment="It is a wonderful drama! Love it so much!!! i need long comments
                to see how it is being seen in the display. Lorem ipsum dolor
                sit amet, consectetur adipiscing elit. Donec nec odio vitae
                nunc. Donec nec odio vitae nunc. Lorem ipsum dolor sit amet,
                consectetur adipiscing elit. Donec nec odio vitae nunc. Donec
                nec odio vitae nunc. Lorem ipsum dolor sit amet, consectetur
                adipiscing elit. Donec nec odio vitae nunc. Donec nec odio vitae
                nunc. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Donec nec odio vitae nunc. Donec nec odio vitae nunc. Lorem
                ipsum dolor sit amet, consectetur adipiscing elit. Donec nec
                odio vitae nunc. Donec nec odio vitae"
      />

      <div
        id="load_more_comments_div"
        className="d-flex justify-content-start"
      ></div>
    </section>
  );
}

function AddComment() {
  return (
    <div className="justify-content-start mt-4 fw-normal">
      <span className="d-flex fs_primary mb-2 ps-2">Add Yours!</span>
      <div className="justify-content-start">
        <Form className="bg-secondary p-4 pb-1 text-light rounded-3">
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3} className="d-flex justify-content-start">
              Name
            </Form.Label>
            <Col>
              <Form.Control type="text" />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3} className="d-flex justify-content-start">
              Rate
            </Form.Label>
            <Col className="d-flex justify-content-start pt-2">
              <Rating
                style={{ backgroundColor: "transparent" }}
                name="no-value"
                defaultValue={0}
                icon={
                  <FontAwesomeIcon
                    icon={faStar}
                    color="#ffc107"
                    className="fs-5 pe-1"
                  />
                }
                emptyIcon={
                  <FontAwesomeIcon
                    icon={faStar}
                    color="#e4e5e9"
                    className="fs-5 pe-1"
                  />
                }
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3} className="d-flex justify-content-start">
              Your thoughts
            </Form.Label>
            <Col>
              <Form.Control as="textarea" />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label
              column
              sm={3}
              className="d-flex justify-content-start"
            ></Form.Label>
            <Col className="d-flex justify-content-start">
              You can only submit your comment once.
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label
              column
              sm={3}
              className="d-flex justify-content-start"
            ></Form.Label>
            <Col className="d-flex justify-content-start">
              <Button className="rounded-4">Submit</Button>
            </Col>
          </Form.Group>
        </Form>
      </div>
    </div>
  );
}

function DetailPage() {
  return (
    <center>
      <div className="w-sm-100 w-xl-75 ps-3 pe-3 ps-lg-0 pe-lg-0 mt-4 mb-4">
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
          className="container-fluid mt-4 p-0"
          style={{ overflow: "hidden" }}
        >
          <div className="row">
            <div className="col-12 p-0">
              <div
                className="justify-content-center"
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

        <CommentSection />

        <AddComment />
      </div>
    </center>
  );
}

export default DetailPage;
