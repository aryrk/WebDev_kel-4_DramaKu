import React from "react";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";

import $ from "jquery";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Image,
  Row,
} from "react-bootstrap";

import { Rating } from "@mui/material";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useGlobalState } from "../components/GlobalStateContext";

import "bootstrap/dist/css/bootstrap.min.css";

import { useParams } from "react-router-dom";
import { useSwal } from "../components/SweetAlert";

function MovieInfo(props) {
  var {
    poster,
    judul,
    otherTitles,
    year,
    synopsis,
    genres,
    rating,
    availability,
  } = props;

  var synopsis_cut = false;

  if (synopsis.length > 400) {
    synopsis_cut = true;
    synopsis = synopsis.substring(0, 400);
  }

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
                  style={{ width: "342px", height: "486px" }}
                  className="img_cover border-0 rounded-4 p-0"
                />
              </center>
            </Col>
            <Col
              sm="auto"
              className="text-start text-break mw-sm-100 mw-md-35 mw-xl-50 pt-3 pt-md-0"
            >
              <p className="mb-1 fs_primary fs-1 fs-lg-5">{judul}</p>
              <p className="mb-1 fs_secondary">Other titles: {otherTitles}</p>
              <p className="fs_secondary ">Year: {year}</p>
              <p className="fs_secondary mb-3">
                {genres.map((genre, i) => (
                  <span key={i}>
                    {" "}
                    {genre}
                    {i < genre.length - 1 ? ", " : ""}
                  </span>
                ))}
              </p>
              <p className="fs_secondary">
                {synopsis}
                {synopsis_cut ? (
                  <a href="#full_plot" className="text-secondary">
                    {" "}
                    ...Read More
                  </a>
                ) : (
                  <></>
                )}
              </p>
              <p className="fs_secondary mb-1">
                Rating:{" "}
                <div id="move_rating_inline" className="d-inline">
                  {rating.toString()}
                </div>{" "}
                <div
                  id="movie_rating"
                  className="d-inline"
                  value={rating.toString()}
                >
                  <Rating
                    name="half-rating-read"
                    defaultValue={parseFloat(rating)}
                    precision={0.1}
                    readOnly
                    icon={
                      <FontAwesomeIcon
                        icon={faStar}
                        color="#ffc107"
                        className="fs_secondary"
                      />
                    }
                    emptyIcon={
                      <FontAwesomeIcon
                        icon={faStar}
                        color="#e4e5e9"
                        className="fs_secondary"
                      />
                    }
                  />
                </div>
              </p>
              <p className="fs_secondary mb-1">Availability: {availability}</p>
            </Col>
          </Row>
        </Container>
      </center>
    </div>
  );
}

function Synopsis(props) {
  var { synopsis } = props;

  return (
    <>
      {synopsis.length > 400 ? (
        <div className="text-start mt-2" id="full_plot">
          <p className="fs-3">Movie Plot :</p>
          <p className="fs_secondary">{synopsis}</p>
          <hr />
        </div>
      ) : (
        <></>
      )}
    </>
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
          className="img_cover img-thumbnail p-0 border-0 rounded-3 img-fluid"
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
          className="embed-responsive-item rounded-3 w-100 border-0"
          src={src}
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          style={{ height: "calc(35vw + 100px)" }}
          title={src}
        ></iframe>
      </div>
    </center>
  );
}

var current_filter = -1;
var comment_shown = 3;

window.filterComments = function (movieId, rating) {
  current_filter = rating;
  if (commentHidden > 0 && current_filter != -1) {
    loadMoreComments(movieId, 0);
  }
  console.log(commentHidden);

  if (commentHidden > 0) {
    setTimeout(() => {
      filterComments(movieId, rating);
    }, 1000);
    return;
  }

  $(".comment").each(function () {
    if (current_filter === -1) {
      comment_shown = commentShown;

      $(this).removeClass("d-none");
    } else {
      if (parseFloat($(this).attr("value")) === rating) {
        $(this).removeClass("d-none");
      } else {
        $(this).addClass("d-none");
      }
    }
  });

  $("#filter-helper").removeClass("d-none");
  $(".comment").each(function () {
    if (!$(this).hasClass("d-none")) {
      $("#filter-helper").addClass("d-none");
      return false;
    }
  });
};

function CommentHeader(props) {
  const { totalComments } = props;
  const { movieId } = useParams();

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
                  <select
                    className="form-select form-select-sm bg-secondary border-0"
                    onChange={(e) =>
                      filterComments(movieId, parseFloat(e.target.value))
                    }
                  >
                    <option value="-1">All star</option>
                    <option value="5">5 ⭐⭐⭐⭐⭐</option>
                    <option value="4">4 ⭐⭐⭐⭐</option>
                    <option value="3">3 ⭐⭐⭐</option>
                    <option value="2">2 ⭐⭐</option>
                    <option value="1">1 ⭐</option>
                    <option value="0">0</option>
                  </select>
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
      <div className="fs_secondary mt-3 d-none" id="filter-helper">
        No comment found!
      </div>
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
            key={i}
            icon={faStar}
            color={ratingValue <= rating ? "#ffc107" : "#e4e5e9"}
          />
        );
      })}
    </div>
  );
}

function abbreviateNumber(value) {
  if (value < 1000) {
    return value.toString();
  }

  const suffixes = ["", "K", "M", "B", "T"];
  const suffixNum = Math.floor(("" + value).length / 3);

  let shortValue = parseFloat(
    (suffixNum != 0 ? value / Math.pow(1000, suffixNum) : value).toPrecision(2)
  );

  if (shortValue % 1 != 0) {
    shortValue = shortValue.toFixed(1);
  }

  return shortValue + suffixes[suffixNum];
}

function Comment(props) {
  const { index, profile_src, username, date, rating, comment } = props;
  return (
    <Container
      className="p-0 justify-content-center align-middle mt-3 comment"
      value={rating}
    >
      <Row>
        <Col sm="2" md="1" className="p-0 col-2">
          <Image
            fluid
            loading="lazy"
            thumbnail
            src={profile_src}
            className="rounded-circle border-0 img_cover p-2 bg-transparent img_section"
            style={{ width: "60px", height: "60px" }}
          />
        </Col>
        <Col md="11" className="p-0 col-9 pe-0 pe-md-3">
          <Container className="d-grid justify-content-start mt-1 ps-0 pe-0">
            <Row>
              <Col className="d-grid justify-content-start pe-0 fs_secondary text-start">
                <strong>
                  <span className="text-break username_section">
                    {username}
                  </span>{" "}
                  <span className="d-inline-block">
                    · <div className="d-inline-block date_section">{date}</div>{" "}
                    ·{" "}
                    <div className="d-inline-block rating_section">
                      <Rating
                        name="half-rating-read"
                        defaultValue={rating}
                        precision={0.1}
                        readOnly
                        icon={
                          <FontAwesomeIcon
                            icon={faStar}
                            color="#ffc107"
                            className="fs_secondary"
                          />
                        }
                        emptyIcon={
                          <FontAwesomeIcon
                            icon={faStar}
                            color="#e4e5e9"
                            className="fs_secondary"
                          />
                        }
                      />
                    </div>
                  </span>
                </strong>
              </Col>
              <div className="w-100"></div>
              <Col
                className="justify-content-start text-start pe-0 fs_secondary text_overflow_js comment_section"
                index={index}
              >
                {comment}
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>
    </Container>
  );
}

var comments, commentCount, commentShown, commentHidden;
var comment_data;
var totalComments = 0;

window.readMore = function (btn, text) {
  $(btn).parent().html(comment_data[text]);
};

window.loadMoreComments = function (movieId, limit = 3) {
  const offset = commentShown;

  if (limit === 0) {
    limit = commentHidden;
  }
  fetch(`/api/movies/comments/${movieId}?limit=${limit}&offset=${offset}`)
    .then((response) => response.json())
    .then((data) => {
      totalComments = data.total;

      data.comments.forEach((comment) => {
        comment_data[comment.id] = comment.comments;

        var newComment = $(".comment").first().clone();
        newComment.find(".username_section").text(comment.username);
        newComment
          .find(".date_section")
          .text(new Date(comment.comment_date).toLocaleDateString("id-ID"));
        newComment.find(".comment_section").text(comment.comments);
        newComment
          .find(".img_section")
          .attr(
            "src",
            comment.profile_picture != ""
              ? comment.profile_picture
              : "/images/empty_profile.jpg"
          );

        newComment.find(".rating_section").empty();

        ReactDOM.createRoot(newComment.find(".rating_section")[0]).render(
          <Rating
            name="half-rating-read"
            defaultValue={comment.rate}
            precision={0.1}
            readOnly
            icon={
              <FontAwesomeIcon
                icon={faStar}
                color="#ffc107"
                className="fs_secondary"
              />
            }
            emptyIcon={
              <FontAwesomeIcon
                icon={faStar}
                color="#e4e5e9"
                className="fs_secondary"
              />
            }
          />
        );

        newComment.attr("value", comment.rate);

        newComment.removeClass("d-none");

        $(".comment").parent().append(newComment);

        var text = newComment.find(".text_overflow_js").text();
        if (text.length > 200) {
          newComment
            .find(".text_overflow_js")
            .html(
              text.substr(0, 200) +
                '... <button class="btn fs_secondary p-0 m-0 link border-0" onclick="readMore(this,`' +
                comment.id +
                '`)">Read more</button>'
            );
        }
      });

      commentShown += data.comments.length;
      commentHidden = totalComments - commentShown;

      comment_shown = commentShown;

      if (commentHidden <= 0) {
        $("#loadMore").addClass("d-none");
      }
    })
    .catch((error) => console.error("Error:", error));
};

function CommentSection() {
  const { movieId } = useParams();
  const [comment, setComment] = useState([]);

  useEffect(() => {
    fetch(`/api/movies/comments/${movieId}?limit=3&offset=0`)
      .then((response) => response.json())
      .then((data) => {
        setComment(data.comments);
        totalComments = data.total;
      })
      .catch((error) => console.error("Error:", error));
  }, [movieId]);
  useEffect(() => {
    if (comment) {
      comment_data = {};
      comment.forEach((c) => {
        comment_data[c.id] = c.comments;
      });

      $(".text_overflow_js").each(function () {
        var text = $(this).text();
        var originalText = text;
        var comment_key = $(this).attr("index");
        if (text.length > 200) {
          $(this).html(
            text.substr(0, 200) +
              '... <button class="btn fs_secondary p-0 m-0 link border-0" onclick="readMore(this,`' +
              comment_key +
              '`)">Read more</button>'
          );
        }
      });

      comments = $(".comment");
      commentCount = comments.length;
      commentShown = 3;
      commentHidden = totalComments - commentShown;
      comments.slice(commentShown).addClass("d-none");
      $("#load_more_comments_div").html(
        '<button id="loadMore" class="btn bg-transparent border-0 p-0 m-0 link mt-2"  onclick="loadMoreComments(`' +
          movieId +
          '`)">Load more rating ...</button>'
      );
      if (commentHidden === 0) {
        $("#loadMore").addClass("d-none");
      }
    }
  }, [comment]);

  const onNewComment = (newComment) => {
    setComment((prevComments) => [newComment, ...prevComments]);

    var currentRating = parseFloat($("#movie_rating").attr("value"));
    var newRating =
      (currentRating * totalComments + newComment.rate) / (totalComments + 1);
    totalComments++;

    $("#move_rating_inline").text(newRating.toFixed(1));
    $("#movie_rating").empty();
    ReactDOM.createRoot($("#movie_rating")[0]).render(
      <Rating
        name="half-rating-read"
        defaultValue={newRating}
        precision={0.1}
        readOnly
        icon={
          <FontAwesomeIcon
            icon={faStar}
            color="#ffc107"
            className="fs_secondary"
          />
        }
        emptyIcon={
          <FontAwesomeIcon
            icon={faStar}
            color="#e4e5e9"
            className="fs_secondary"
          />
        }
      />
    );
  };

  return (
    <>
      {comment ? (
        <>
          <section>
            <CommentHeader totalComments={abbreviateNumber(totalComments)} />
            {comment.map((comment) => (
              <Comment
                key={comment.id}
                index={comment.id}
                profile_src={
                  comment.profile_picture !== ""
                    ? comment.profile_picture
                    : "/images/empty_profile.jpg"
                }
                username={comment.username}
                date={new Date(comment.comment_date).toLocaleDateString(
                  "id-ID"
                )}
                rating={comment.rate}
                comment={comment.comments}
              />
            ))}
            {comment.length === 0 && (
              <div className="fs_secondary mt-3">Be the first to comment!</div>
            )}
          </section>
          {comment.length > 0 && (
            <div
              id="load_more_comments_div"
              className="d-flex justify-content-start"
            ></div>
          )}
          <AddComment movieId={movieId} onNewComment={onNewComment} />
        </>
      ) : (
        <p>Loading comments...</p>
      )}
    </>
  );
}

function AddComment({ movieId, onNewComment }) {
  const { notification } = useSwal();

  // ! fix after auth
  const userId = "1";
  const [rate, setRate] = useState(0);
  const [thoughts, setThoughts] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const newComment = {
      userId: userId,
      rate: rate,
      comments: thoughts,
      comment_date: new Date().toISOString(),
    };

    fetch(`/api/movies/comments/${movieId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newComment),
    })
      .then((response) => response.json())
      .then((data) => {
        // onNewComment(data.comment);
        setRate(0);
        setThoughts("");
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div className="justify-content-start mt-4 fw-normal">
      <span className="d-flex fs_primary mb-2 ps-2">Add Yours!</span>
      <div className="justify-content-start">
        <Form
          className="bg_pallete_5 p-4 pb-1 rounded-3"
          onSubmit={handleSubmit}
        >
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3} className="d-flex justify-content-start">
              Username
            </Form.Label>
            <Col>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                value={name}
                name="username"
                readOnly
                disabled
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3} className="d-flex justify-content-start">
              Rate
            </Form.Label>
            <Col className="d-flex justify-content-start pt-2">
              <Rating
                style={{ backgroundColor: "transparent" }}
                name="rate"
                value={rate}
                onChange={(event, newValue) => {
                  setRate(newValue);
                }}
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
              <Form.Control
                as="textarea"
                placeholder="Enter your thoughts"
                value={thoughts}
                name="comments"
                onChange={(e) => setThoughts(e.target.value)}
                required
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Col className="d-flex justify-content-start">
              <Button
                className="rounded-4"
                type="submit"
                onClick={() =>
                  notification(
                    "success",
                    "Comment added!\nAwaiting admin approval"
                  )
                }
              >
                Submit
              </Button>
            </Col>
          </Form.Group>
        </Form>
      </div>
    </div>
  );
}

function BackgroundPoster(props) {
  var { src, zIndex, imgHeight } = props;
  if (zIndex === undefined) {
    zIndex = "-1";
  }
  if (imgHeight === undefined) {
    imgHeight = "65vh";
  }
  return (
    <div
      className="position-absolute top-0 start-0"
      style={{ zIndex: zIndex, filter: "blur(10px)", opacity: "0.18" }}
    >
      <Image
        src={src}
        fluid
        thumbnail
        loading="lazy"
        className="h-sm-100 img_cover border-0 rounded-4 p-0"
        style={{ width: "100vw", height: imgHeight }}
      />
    </div>
  );
}

function DetailPage() {
  const { setShowNavigation, setShowFooter, setShowSidebar } = useGlobalState();
  useEffect(() => {
    setShowNavigation(true);
    setShowFooter(true);
    setShowSidebar(false);
  }, [setShowNavigation]);

  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    fetch(`/api/movie-details/${movieId}`)
      .then((response) => response.json())
      .then((data) => {
        setMovie(data);

        fetch(`/api/movies/update-view-count/${movieId}`, {
          method: "POST",
        });
      })
      .catch((error) => console.error("Error:", error));
  }, [movieId]);

  return (
    <center>
      {movie && movie.id ? (
        <div className="w-sm-100 w-xl-75 ps-3 pe-3 ps-lg-0 pe-lg-0 mt-4 mb-4">
          <MovieInfo
            poster={movie.poster}
            judul={movie.title}
            otherTitles={movie.alternative_titles}
            year={movie.year}
            synopsis={movie.synopsis}
            genres={movie.genres.map((genre) => genre.name)}
            rating={movie.rating.toFixed(1)}
            availability={movie.availability}
          />
          <div
            className="container-fluid mt-4 p-0"
            style={{ overflow: "hidden" }}
          >
            <div className="row">
              <div className="col-12 p-0">
                <div
                  className="d-flex"
                  style={{ whiteSpace: "nowrap", overflowX: "scroll" }}
                >
                  <div className="justify-content-start">
                    {movie.actors.map((actor) => (
                      <Actor
                        key={actor.id}
                        src={
                          actor.picture_profile != ""
                            ? actor.picture_profile
                            : "/images/empty_profile.jpg"
                        }
                        name={actor.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Trailer src={movie.trailer} />
          <Synopsis synopsis={movie.synopsis} />

          <CommentSection />

          <BackgroundPoster src={movie.poster} />
        </div>
      ) : movie ? (
        window.location.replace("/404")
      ) : (
        <p>Loading...</p>
      )}
    </center>
  );
}

export default DetailPage;
export { StarRating, MovieInfo, Actor, Trailer, BackgroundPoster };
