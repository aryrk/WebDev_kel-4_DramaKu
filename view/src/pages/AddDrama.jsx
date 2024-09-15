import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-bootstrap/Modal";
import { withConfig } from "../Config";
import { FormDramaInput } from "./CMS/Drama/DramaInput";

const AddDrama = ({ config }) => {
  const [show, setShow] = useState(false);
  const [fullscreen, setFullscreen] = useState(true);

  const handleClose = () => setShow(false);
  function handleShow(breakpoint) {
    setFullscreen(breakpoint);
    setShow(true);
  }
  return (
    <>
      <div className="position-fixed bottom-0 end-0 m-3">
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
  );
};

export default withConfig(AddDrama);
