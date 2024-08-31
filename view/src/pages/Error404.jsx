import React, { useEffect } from "react";

import { Image } from "react-bootstrap";

import { withConfig } from "../Config";
import { LoginBackground } from "./Login";
import { useGlobalState } from "../components/GlobalStateContext";

import "bootstrap/dist/css/bootstrap.min.css";
import "./pagesStyle/Error.css";

function Message(props) {
  const { config, error } = props;

  return (
    <div
      className="d-flex align-items-center justify-content-center position-absolute"
      style={{
        width: "100vw",
        height: "100vh",
        zIndex: "1000000",
        opacity: 0.8,
      }}
    >
      <center>
        <Image
          src={config.logo_png}
          loading="lazy"
          className="position-absolute error_image"
        />
        <p className="fw-bold error_fs">{error}</p>
      </center>
      <Image
        src="images/Deadpool Peekaboo noBubble.png"
        className="position-absolute bottom-0 end-0 error_image"
        loading="lazy"
        style={{ filter: "drop-shadow(rgba(0, 0, 0,0.5) 30px 50px 5px)" }}
      />
      <Image
        src="images/Deadpool Peekaboo.png"
        loading="lazy"
        className="position-absolute bottom-0 end-0 error_image"
      />
    </div>
  );
}

const Error404 = ({ config }) => {
  const { setShowNavigation, setShowFooter, setShowSidebar } = useGlobalState();
  useEffect(() => {
    setShowNavigation(false);
    setShowFooter(false);
    setShowSidebar(false);
  }, []);
  return (
    <div>
      <Message config={config} error="404" />
      <LoginBackground />
    </div>
  );
};

export default withConfig(Error404);
