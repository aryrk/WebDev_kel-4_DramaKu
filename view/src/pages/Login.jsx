import React from "react";
import { useEffect, useState } from "react";

import { Col, Form, Image, InputGroup, Row } from "react-bootstrap";

import { faKey } from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { withConfig } from "../Config";
import { useGlobalState } from "../components/GlobalStateContext";

import "bootstrap/dist/css/bootstrap.min.css";

import "./pagesStyle/Login.css";

function LoginForm(props) {
  const { config } = props;
  return (
    <center
      className="d-flex align-items-center justify-content-center position-absolute"
      style={{ height: "100vh", width: "100vw", zIndex: "1000000" }}
    >
      <div className="w-30 ms-5 me-5 rounded-4 text-light pt-3 bg_pallete_1">
        <span className="fs-5">{config.short_name}</span>
        <Form className="p-5 pb-4 pt-3">
          <InputGroup className="mb-3">
            <InputGroup.Text
              id="basic-addon1"
              className="bg_pallete_3 border-0"
            >
              @
            </InputGroup.Text>
            <Form.Control
              placeholder="Username"
              aria-label="Username"
              aria-describedby="basic-addon1"
              className="bg-dark border-0 text-white rounded-end"
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text
              id="basic-addon1"
              className="bg_pallete_3 border-0"
            >
              <FontAwesomeIcon icon={faKey} />
            </InputGroup.Text>
            <Form.Control
              placeholder="Password"
              aria-label="Password"
              aria-describedby="basic-addon1"
              className="bg-dark border-0 text-white rounded-end"
            />
          </InputGroup>
          <button className="btn border-0 bg_pallete_3 mt-3 rounded-3 w-100">
            Sign in
          </button>
          <br></br>
          <button className="btn border-0 bg_pallete_3 mt-3 mb-4 pb-2 rounded-3 w-100">
            Sign in with Google{" "}
            <FontAwesomeIcon className="ms-1" icon={faGoogle} />
          </button>

          <a href="/register" className="link">
            Don't have an account yet? Sign Up
          </a>
        </Form>
      </div>
    </center>
  );
}

function CarouselImage(props) {
  const { src } = props;
  return (
    <Image
      fluid
      thumbnail
      loading="lazy"
      className="bg-transparent border-0 p-2 rounded-4 img_cover"
      style={{ width: "200px", height: "300px" }}
      src={src}
    />
  );
}

function LoginBackground(props) {
  var SamplePoster = [
    "/samplePoster/antman.jpg",
    "/samplePoster/avatar.jpg",
    "/samplePoster/darkharvest.jpg",
    "/samplePoster/gooddoctor.jpg",
    "/samplePoster/tennet.jpg",
    "/samplePoster/thombraider.jpg",
    "/samplePoster/venom.jpg",
  ];

  const [posters, setPosters] = useState([]);

  useEffect(() => {
    const fetchPosters = async () => {
      try {
        const res = await fetch("/api/get-movies-poster/100");
        const data = await res.json();
        setPosters(data);
      } catch (error) {
        console.error("Error fetching posters:", error);
      }
    };

    fetchPosters();
  }, []);

  let fixed_poster = [];

  for (let i = 0; i < posters.length; i++) {
    fixed_poster.push(posters[i].poster);
  }

  if (fixed_poster.length < 100) {
    var samplePosterLength = SamplePoster.length;
    var index = 0;
    for (let i = 0; i < 100 - fixed_poster.length; i++) {
      fixed_poster.push(SamplePoster[index]);
      index++;
      if (index >= samplePosterLength) {
        index = 0;
      }
    }
  }

  fixed_poster.sort(() => Math.random() - 0.5);

  return (
    <>
      {fixed_poster.length > 0 ? (
        <div style={{ overflow: "hidden", width: "100vw", height: "100vh" }}>
          <center>
            <div
              className="position-relative"
              style={{
                width: "1100px",
                overflow: "hidden",
                transform:
                  "skew(10deg, 10deg) translateY(-170px) translateX(500px)",
                opacity: "20%",
                filter: "blur(10px)",
              }}
            >
              <div
                style={{
                  animation: "scrollText 200s infinite",
                }}
              >
                {fixed_poster.map((poster, index) => (
                  <CarouselImage key={index} src={poster} />
                ))}
              </div>
            </div>
          </center>
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
}

const Login = ({ config }) => {
  const { setShowNavigation, setShowFooter, setShowSidebar } = useGlobalState();
  useEffect(() => {
    document.title = `Login - ${config.short_name}`;
    setShowNavigation(false);
    setShowFooter(false);
    setShowSidebar(false);
  }, [config]);
  return (
    <div>
      <LoginForm config={config} />
      <LoginBackground />
    </div>
  );
};

export default withConfig(Login);
export { LoginBackground };
