import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faNewspaper, faPlus } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-bootstrap/Modal";
import { withConfig } from "../Config";
import { FormDramaInput } from "./CMS/Drama/DramaInput";
import { jwtDecode } from "jwt-decode";

const token = sessionStorage.getItem("token");

const Shortcut = ({ config }) => {
  const [show, setShow] = useState(false);
  const [fullscreen, setFullscreen] = useState(true);
  const [AddDramaAllowed, setAllowedAddDrama] = useState(false);
  const [CMSAllowed, setAllowedCMS] = useState(false);

  useEffect(() => {
    try {
      const decodedToken = jwtDecode(token);
      if (decodedToken.role === "admin" || decodedToken.role === "writer") {
        setAllowedAddDrama(true);
      }
      if (decodedToken.role === "admin") {
        setAllowedCMS(true);
      }
    } catch (error) {}
  }, []);

  const handleClose = () => setShow(false);
  function handleShow(breakpoint) {
    setFullscreen(breakpoint);
    setShow(true);
  }
  return (
    <>
      {AddDramaAllowed && (
        <>
          {CMSAllowed && (
            <div className="position-fixed bottom-0 end-0 m-3">
              <Button
                size="lg"
                className="bg_pallete_3 border-0 add_drama_button rounded-circle"
                onClick={() => (window.location.href = "/cms/drama/validate")}
              >
                <FontAwesomeIcon icon={faNewspaper} />
              </Button>
            </div>
          )}
          <div
            className={`position-fixed bottom-0 end-0 m-3 ${
              CMSAllowed ? "me-5 pe-4" : ""
            }`}
          >
            <Button
              size="lg"
              className="bg_pallete_3 border-0 add_drama_button rounded-circle"
              onClick={() => handleShow("xl-down")}
            >
              <FontAwesomeIcon icon={faPlus} />
            </Button>
          </div>
          <Modal
            size="xl"
            show={show}
            fullscreen={fullscreen}
            onHide={handleClose}
            centered
          >
            <Modal.Header closeButton className="bg-dark text-white">
              <Modal.Title>Input New Drama</Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-dark text-white">
              <FormDramaInput config={config} />
            </Modal.Body>
          </Modal>
        </>
      )}
    </>
  );
};

export default withConfig(Shortcut);
