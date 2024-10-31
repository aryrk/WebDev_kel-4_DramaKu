import React, { useState } from "react";
import { useEffect } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { loadConfigNonAsync, withConfig } from "../Config";
import { LoginBackground } from "./Login";
import { useGlobalState } from "../components/GlobalStateContext";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSwal } from "../components/SweetAlert";

var server = loadConfigNonAsync();
server.then((result) => (server = result.server));

function ResetPasswordForm() {
  const { alert } = useSwal();
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordIsValid, setPasswordIsValid] = useState(false);
  const [confirmPasswordIsValid, setConfirmPasswordIsValid] = useState(false);

  const url = new URL(window.location.href);
  const token = url.searchParams.get("token");
  if (!token) {
    alert("error", "error", "Invalid token");
    setTimeout(() => {
      window.location.href = "/login";
    }, 2000);
  }

  const checkPassword = (password) => {
    if (passwordRegex.test(password)) {
      setPasswordIsValid(true);
    } else {
      setPasswordIsValid(false);
    }
  };

  const check_confirm_password = (password, confirmPassword) => {
    if (password === confirmPassword) {
      setConfirmPasswordIsValid(true);
    } else {
      setConfirmPasswordIsValid(false);
    }
    checkPassword(password);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("error", "error", "Passwords do not match");
      return;
    }

    fetch(server+"/api/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, newPassword: password }),
    }).then((response) => {
      setPassword("");
      setConfirmPassword("");
      if (response.status != 500) {
        alert(
          "success",
          "success",
          "Password reset successfully, please login"
        );
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        alert("error", "error", "Password reset failed");
      }
    });
  };

  return (
    <center
      className="d-flex align-items-center justify-content-center position-absolute"
      style={{ height: "100vh", width: "100vw", zIndex: "1000000" }}
    >
      <div
        className="w-30 ms-5 me-5 rounded-4 text-light pt-3 bg_pallete_1"
        style={{ minWidth: "400px" }}
      >
        <span className="fs-3">Reset Your Password</span>

        <Form className="p-5 pb-4 pt-1" onSubmit={handleResetPassword}>
          <p className="d-block text-start m-0 mb-1">New Password</p>
          <InputGroup className="mb-3">
            <Form.Control
              aria-label="Password"
              aria-describedby={`basic-addon1 ${
                !passwordIsValid && password.length > 0 ? "passwordinvalid" : ""
              }`}
              className={`bg-dark border-0 text-white rounded-end ${
                !passwordIsValid && password.length > 0 ? "is-invalid" : ""
              }`}
              required
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                checkPassword(e.target.value);
              }}
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
          <p className="d-block text-start m-0 mb-1">Confirm Password</p>
          <InputGroup>
            <Form.Control
              aria-label="Password"
              aria-describedby={`basic-addon1 ${
                !confirmPasswordIsValid && confirmPassword.length > 0
                  ? "passwordinvalid"
                  : ""
              }`}
              className={`bg-dark border-0 text-white rounded-end ${
                !confirmPasswordIsValid && confirmPassword.length > 0
                  ? "is-invalid"
                  : ""
              }`}
              required
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                check_confirm_password(password, e.target.value);
              }}
            />
          </InputGroup>
          <div
            className={`invalid-feedback text-start ${
              !confirmPasswordIsValid && confirmPassword.length > 0
                ? "d-flex"
                : "d-none"
            }`}
          >
            Passwords do not match
          </div>

          <button
            className="btn border-0 bg_pallete_3 mt-1 rounded-3 w-100 mt-3"
            type="submit"
            disabled={!passwordIsValid || !confirmPasswordIsValid}
          >
            Reset Password
          </button>
        </Form>
      </div>
    </center>
  );
}

const ResetPassword = ({ config }) => {
  const { setShowNavigation, setShowFooter, setShowSidebar } = useGlobalState();
  useEffect(() => {
    document.title = `ResetPassword - ${config.short_name}`;
    setShowNavigation(false);
    setShowFooter(false);
    setShowSidebar(false);
  }, [config]);

  return (
    <div>
      <ResetPasswordForm />
      <LoginBackground />
    </div>
  );
};

export default withConfig(ResetPassword);
