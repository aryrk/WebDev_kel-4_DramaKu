import React from 'react'
import { useNavigation } from "../components/NavigationContext";
import { useEffect } from "react";
import {LoginBackground} from "./Login"
import { Form, InputGroup } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey } from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

function RegisterForm() {
  return (
    <center
      className="d-flex align-items-center justify-content-center position-absolute"
      style={{ height: "100vh", width: "100vw", zIndex: "1000000" }}
    >
      <div
        className="w-30 ms-5 me-5 rounded-4 text-light pt-3"
        style={{ backgroundColor: "#191e2fd4" }}
      >
        <span className="fs-5">Registration</span>
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
              className="bg_pallete_1 border-0 text-white rounded-end"
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text
              id="basic-addon1"
              className="bg_pallete_3 border-0"
            >
              <FontAwesomeIcon icon={faGoogle}/>
            </InputGroup.Text>
            <Form.Control
              placeholder="Email"
              aria-label="Email"
              aria-describedby="basic-addon1"
              className="bg_pallete_1 border-0 text-white rounded-end"
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
              className="bg_pallete_1 border-0 text-white rounded-end"
            />
          </InputGroup>
          <button className="btn border-0 bg_pallete_3 mt-3 rounded-3 w-100">
            Sign Out
          </button>
          <br></br>
          <button className="btn border-0 bg_pallete_3 mt-3 mb-4 pb-2 rounded-3 w-100">
            Sign out with Google{" "}
            <FontAwesomeIcon className="ms-1" icon={faGoogle} />
          </button>

          <a href="/login" className="link">Already have an account? Login here!</a>
        </Form>
      </div>
    </center>
  );
}

const Register = () => {
    const { setShowNavigation } = useNavigation();
  useEffect(() => {
    setShowNavigation(false);
  }, [setShowNavigation]);
  return (
    <div>
      <RegisterForm/>
      <LoginBackground />
    </div>
  )
}

export default Register