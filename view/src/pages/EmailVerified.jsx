import React from "react";
import { useEffect } from "react";

import { withConfig } from "../Config";
import { useGlobalState } from "../components/GlobalStateContext";

import "bootstrap/dist/css/bootstrap.min.css";

import "./pagesStyle/Login.css";
import { LoginBackground } from "./Login";
import { Image } from "react-bootstrap";

function Form(props) {
  const { config } = props;

  useEffect(() => {
    sessionStorage.removeItem("token");
  }, []);

  useEffect(() => {
    setTimeout(() => {
      window.location.href = "/login";
    }, 3000);
  }, []);



  return (
    <center
      className="d-flex align-items-center justify-content-center position-absolute"
      style={{ height: "100vh", width: "100vw", zIndex: "1000000" }}
    >
      <div className="w-30 ms-5 me-5 rounded-4 text-light pt-3 bg_pallete_1">
        {/* <span className="fs-5">{config.short_name}</span> */}
        <Image src={config.logo_png} className="mt-3" width={400} />
        <br />
        <div className="p-5 pb-4 pt-3 fs-1">Email Successfully Verified</div>
      </div>
    </center>
  );
}

const EmailVerified = ({ config }) => {
  const { setShowNavigation, setShowFooter, setShowSidebar } = useGlobalState();
  useEffect(() => {
    document.title = `EmailVerified - ${config.short_name}`;
    setShowNavigation(false);
    setShowFooter(false);
    setShowSidebar(false);
  }, [config]);
  return (
    <div>
      <Form config={config} />
      <LoginBackground />
    </div>
  );
};

export default withConfig(EmailVerified);
export { LoginBackground };
