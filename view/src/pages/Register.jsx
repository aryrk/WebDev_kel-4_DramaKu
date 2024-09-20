import React, { useState } from "react";
import { useEffect } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { faKey } from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { withConfig } from "../Config";
import { LoginBackground } from "./Login";
import { useGlobalState } from "../components/GlobalStateContext";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSwal } from "../components/SweetAlert";

function RegisterForm() {
  const { alert } = useSwal();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();
    alert("success", data.message);
  };

  const handleGoogleRegister = () => {
    window.open("http://localhost:5000/auth/google", "_self");
  };

  return (
    <center
      className="d-flex align-items-center justify-content-center position-absolute"
      style={{ height: "100vh", width: "100vw", zIndex: "1000000" }}
    >
      <div className="w-30 ms-5 me-5 rounded-4 text-light pt-3 bg_pallete_1">
        <span className="fs-5">Registration</span>
        <Form className="p-5 pb-4 pt-3" onSubmit={handleRegister}>
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
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text
              id="basic-addon1"
              className="bg_pallete_3 border-0"
            >
              <FontAwesomeIcon icon={faGoogle} />
            </InputGroup.Text>
            <Form.Control
              placeholder="Email"
              aria-label="Email"
              aria-describedby="basic-addon1"
              className="bg-dark border-0 text-white rounded-end"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
              className="bg_dark border-0 text-white rounded-end"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </InputGroup>
          <button
            className="btn border-0 bg_pallete_3 mt-3 rounded-3 w-100"
            type="submit"
          >
            Register
          </button>
          <br />
          <button
            className="btn border-0 bg_pallete_3 mt-3 mb-4 pb-2 rounded-3 w-100"
            onClick={handleGoogleRegister}
          >
            Sign up with Google{" "}
            <FontAwesomeIcon className="ms-1" icon={faGoogle} />
          </button>
          <a href="/login" className="link">
            Already have an account? Login here!
          </a>
        </Form>
      </div>
    </center>
  );
}

const Register = ({ config }) => {
  const { setShowNavigation, setShowFooter, setShowSidebar } = useGlobalState();
  useEffect(() => {
    document.title = `Register - ${config.short_name}`;
    setShowNavigation(false);
    setShowFooter(false);
    setShowSidebar(false);
  }, [config]);

  return (
    <div>
      <RegisterForm />
      <LoginBackground />
    </div>
  );
};

export default withConfig(Register);
