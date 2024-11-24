import React, { useState } from "react";
import { useEffect } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { faKey } from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { loadConfigNonAsync, withConfig } from "../Config";
import { LoginBackground } from "./Login";
import { useGlobalState } from "../components/GlobalStateContext";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSwal } from "../components/SweetAlert";

var server = loadConfigNonAsync();
server.then((result) => (server = result.server));

function RegisterForm() {
  const { alert } = useSwal();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [usernameAllowed, setUsernameAllowed] = useState(false);
  const [emailAllowed, setEmailAllowed] = useState(false);
  const [passwordAllowed, setPasswordAllowed] = useState(false);
  const [passwordIsValid, setPasswordIsValid] = useState(true);

  const checkPassword = (password) => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    if (passwordRegex.test(password)) {
      setPasswordIsValid(true);
    } else {
      setPasswordIsValid(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    fetch(server + "/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    }).then((response) => {
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      if (response.status != 500) {
        alert("success", "success", "Check your email to verify your account");
      } else {
        alert(
          "error",
          "error",
          "Registration failed, username or email already exists"
        );
      }
    });
  };

  const handlePassword = (passwordVal, confirmVal) => {
    if (passwordVal && confirmVal) {
      if (passwordVal === confirmVal) {
        setPasswordAllowed(true);
      } else {
        setPasswordAllowed(false);
      }
    }
  };

  const checkusername = async (username) => {
    fetch(server + `/api/checkusernames/${username}`, {
      mode: "cors",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.username) {
          setUsernameAllowed(false);
        } else {
          setUsernameAllowed(true);
        }
      });
  };

  const checkemail = async (email) => {
    fetch(server + `/api/checkemails/${email}`, {
      mode: "cors",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.email) {
          setEmailAllowed(false);
        } else {
          setEmailAllowed(true);
        }
      });
  };

  useEffect(() => {
    sessionStorage.removeItem("token");
  }, []);

  const handleGoogleRegister = () => {
    window.open(server + "/api/auth/google", "_self");
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
            type="text"
              placeholder="Username"
              aria-label="Username"
              aria-describedby={`basic-addon1 ${
                !usernameAllowed && username.length > 0 ? "usernameinvalid" : ""
              }`}
              className={`bg-dark border-0 text-white rounded-end ${
                !usernameAllowed && username.length > 0 ? "is-invalid" : ""
              }`}
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                checkusername(e.target.value);
              }}
              required
            />
            <div
              id="usernameinvalid"
              className={`invalid-feedback d-flex ${
                !usernameAllowed && username.length > 0 ? "d-flex" : "d-none"
              }`}
            >
              Username already taken
            </div>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text
              id="basic-addon1"
              className="bg_pallete_3 border-0"
            >
              <FontAwesomeIcon icon={faGoogle} />
            </InputGroup.Text>
            <Form.Control
            type="email"
              placeholder="Email"
              aria-label="Email"
              aria-describedby={`basic-addon1 ${
                !emailAllowed && email.length > 0 ? "emailinvalid" : ""
              }`}
              className={`bg-dark border-0 text-white rounded-end ${
                !emailAllowed && email.length > 0 ? "is-invalid" : ""
              }`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                checkemail(e.target.value);
              }}
              required
            />
            <div
              id="emailinvalid"
              className={`invalid-feedback d-flex ${
                !emailAllowed && email.length > 0 ? "d-flex" : "d-none"
              }`}
            >
              Email already taken
            </div>
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
              aria-describedby={`basic-addon1 ${
                !passwordIsValid && password.length > 0 ? "passwordinvalid" : ""
              }`}
              className={`bg-dark border-0 text-white rounded-end ${
                !passwordIsValid && password.length > 0 ? "is-invalid" : ""
              }`}
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                checkPassword(e.target.value);
                handlePassword(e.target.value, confirmPassword);
              }}
              required
            />
          </InputGroup>
          <div
            className={`invalid-feedback text-start ${
              !passwordIsValid && password.length > 0 ? "d-flex" : "d-none"
            }`}
            id="passwordinvalid"
          >
            Password must contain at least:
            <ul>
              <li>1 lowercase letter</li>
              <li>1 uppercase letter</li>
              <li>1 number</li>
              <li>8 characters</li>
            </ul>
          </div>
          <InputGroup className="mb-3">
            <InputGroup.Text
              id="basic-addon1"
              className="bg_pallete_3 border-0"
            >
              <FontAwesomeIcon icon={faKey} />
            </InputGroup.Text>
            <Form.Control
              placeholder="Confirm Password"
              aria-label="Password"
              aria-describedby={`basic-addon1 ${
                !passwordAllowed && password.length && confirmPassword.length
                  ? "passwordinvalid"
                  : ""
              }`}
              className={`bg-dark border-0 text-white rounded-end ${
                !passwordAllowed && password.length && confirmPassword.length
                  ? "is-invalid"
                  : ""
              }`}
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                handlePassword(password, e.target.value);
              }}
              required
            />
            <div
              className={`invalid-feedback d-flex ${
                !passwordAllowed && password.length && confirmPassword.length
                  ? "d-flex"
                  : "d-none"
              }`}
            >
              Passwords do not match
            </div>
          </InputGroup>

          <button
            className="btn border-0 bg_pallete_3 mt-3 rounded-3 w-100"
            type="submit"
            disabled={
              !usernameAllowed ||
              !emailAllowed ||
              !passwordAllowed ||
              !passwordIsValid
            }
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
export { RegisterForm };
