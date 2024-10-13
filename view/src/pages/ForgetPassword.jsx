import React, { useState } from "react";
import { useEffect } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { withConfig } from "../Config";
import { LoginBackground } from "./Login";
import { useGlobalState } from "../components/GlobalStateContext";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSwal } from "../components/SweetAlert";

function ForgetPasswordForm() {
  const { alert } = useSwal();

  const [email, setEmail] = useState("");

  const handleForgetPassword = async (e) => {
    e.preventDefault();
    fetch("/api/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    }).then((response) => {
      setEmail("");
      if (response.status != 500) {
        alert("success", "success", "Check your email to reset your password");
      } else {
        alert("error", "error", "Email not found");
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
        <span className="fs-3">Forgot Password?</span>
        <br />
        <p className="fs-6 text-gray">
          Remember your password?{" "}
          <a href="/login" className="link">
            Login here
          </a>
        </p>
        <Form className="p-5 pb-4 pt-1" onSubmit={handleForgetPassword}>
          <p className="d-block text-start m-0 mb-1">Email Address</p>
          <InputGroup className="mb-3">
            <Form.Control
              aria-label="Email"
              aria-describedby="basic-addon1"
              className="bg-dark border-0 text-white rounded-end"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </InputGroup>

          <button
            className="btn border-0 bg_pallete_3 mt-1 rounded-3 w-100"
            type="submit"
          >
            Reset Password
          </button>
        </Form>
      </div>
    </center>
  );
}

const ForgetPassword = ({ config }) => {
  const { setShowNavigation, setShowFooter, setShowSidebar } = useGlobalState();
  useEffect(() => {
    document.title = `ForgetPassword - ${config.short_name}`;
    setShowNavigation(false);
    setShowFooter(false);
    setShowSidebar(false);
  }, [config]);

  return (
    <div>
      <ForgetPasswordForm />
      <LoginBackground />
    </div>
  );
};

export default withConfig(ForgetPassword);
