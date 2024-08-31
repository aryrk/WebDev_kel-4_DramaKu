import React from "react";
import { useEffect } from "react";

import $ from "jquery";
import DataTable from "datatables.net-dt";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImageCrop from "filepond-plugin-image-crop";
import FilePondPluginImageEdit from "filepond-plugin-image-edit";
import FilepondPluginImageResize from "filepond-plugin-image-resize";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import FilePondPluginImageTransform from "filepond-plugin-image-transform";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";

import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useGlobalState } from "../../components/GlobalStateContext";

import "datatables.net";

import "filepond/dist/filepond.min.css";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

function AddActor() {
  registerPlugin(
    FilePondPluginImageExifOrientation,
    FilePondPluginImagePreview,
    FilePondPluginImageCrop,
    FilepondPluginImageResize,
    FilePondPluginImageTransform,
    FilePondPluginImageEdit
  );
  return (
    <Form className="bg-dark rounded-3 p-3 d-flex justify-content-start text-start mb-4">
      <Container>
        <Row>
          <Col>
            <Form.Group
              as={Row}
              className="mb-3"
              controlId="formPlaintextEmail"
            >
              <Form.Label column sm="3" md="4" lg="3">
                Country
              </Form.Label>
              <Col sm="9" md="8" lg="9">
                <Form.Control
                  defaultValue="email@example.com"
                  className="bg-black border-0 text-light"
                />
              </Col>
            </Form.Group>

            <Form.Group
              as={Row}
              className="mb-3"
              controlId="formPlaintextPassword"
            >
              <Form.Label column sm="3" md="4" lg="3">
                Actor Name
              </Form.Label>
              <Col sm="9" md="8" lg="9">
                <Form.Control
                  placeholder="Password"
                  className="bg-black border-0 text-light"
                />
              </Col>
            </Form.Group>
            <Form.Group
              as={Row}
              className="mb-3"
              controlId="formPlaintextPassword"
            >
              <Form.Label column sm="3" md="4" lg="3">
                Birth Date
              </Form.Label>
              <Col sm="9" md="8" lg="9">
                <Form.Control
                  type="date"
                  placeholder="Password"
                  className="bg-black border-0 text-light"
                />
              </Col>
            </Form.Group>
          </Col>
          <Col sm="5" md="6">
            <Container>
              <Row>
                <Col sm="auto" className="ps-0 pb-2 pb-md-0">
                  Upload Picture
                </Col>
                <Col className="p-0">
                  <div style={{ width: "110px", height: "141px" }}>
                    <FilePond
                      labelIdle="Drag & Drop your picture or <span class='filepond--label-action'>Browse</span>"
                      allowMultiple={false}
                      maxFiles={1}
                      imagePreviewHeight={141}
                      imageResizeTargetHeight={141}
                      imageResizeTargetWidth={110}
                      acceptedFileTypes={["image/*"]}
                      stylePanelLayout="compact"
                      imageEditAllowEdit={true}
                      credits={false}
                      stylePanelAspectRatio={141 / 110}
                      imageCropAspectRatio="141:110"
                      required={true}
                      instantUpload={true}
                    />
                  </div>
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
        <Button
          className="rounded-3 mt-4 mt-sm-0 w-sm-100"
          variant="primary"
          type="submit"
        >
          Submit
        </Button>
      </Container>
    </Form>
  );
}

function Actor(props) {
  const { no, country, actorName, birthDate, src } = props;
  return (
    <tr>
      <td className="text-center">{no}</td>
      <td>{country}</td>
      <td>{actorName}</td>
      <td className="text-center">{birthDate}</td>
      <td>
        <center>
          <img
            src={src}
            alt="actor"
            loading="lazy"
            style={{ width: "110px", height: "141px" }}
            className="img_cover rounded-3"
          />
        </center>
      </td>
      <td className="align-middle">
        <center>
          <Button variant="primary" className="mb-3 mb-sm-4">
            <FontAwesomeIcon icon={faEdit} />
          </Button>
          <br></br>
          <Button variant="danger">
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </center>
      </td>
    </tr>
  );
}

function ActorTable() {
  useEffect(() => {
    new DataTable("#actors", {
      columnDefs: [
        { width: "60px", targets: 0 },
        { width: "200px", targets: 1 },
        { width: "130px", targets: 3 },
        { width: "140px", targets: 4 },
        { width: "110px", targets: 5 },
      ],
    });
    return () => {
      $("#actors").DataTable().destroy();
    };
  }, []);
  return (
    <Table responsive striped hover variant="dark" id="actors">
      <thead>
        <tr>
          <th className="text-center">#</th>
          <th>Country</th>
          <th>Actor Name</th>
          <th style={{ width: "150px" }} className="text-center">
            Birth Date
          </th>
          <th style={{ width: "130px" }} className="text-center">
            Actor
          </th>
          <th style={{ width: "85px" }} className="text-center">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        <Actor
          no="1"
          country="USA"
          actorName="Freddie Highmore"
          birthDate="1992-02-14"
          src="https://m.media-amazon.com/images/M/MV5BMjEzNjAzMTgzMV5BMl5BanBnXkFtZTcwNjU2NjA2NQ@@._V1_.jpg"
        />
        <Actor
          no="2"
          country="USA"
          actorName="Antonia Thomas"
          birthDate="1994-02-16"
          src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQTqvrZ54xH0XPu-B70myUkhQlzedlEi9dyxH5kX_29G3tv6Wec"
        />
        <Actor
          no="2"
          country="USA"
          actorName="Paige Spara"
          birthDate="1991-02-16"
          src="https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQg3TO4ynEKIWdT9qIEVsaDfg3PPDyQGIb3DP7_-x8ey5mDwO8G"
        />
        <Actor
          no="2"
          country="USA"
          actorName="Fiona Gubelmann"
          birthDate="1981-02-16"
          src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQx7zjLO4JlM3wed_EpzRpv9Xu8OMSpGcMJNGeNc3KdnbQgPuoF"
        />
        <Actor
          no="2"
          country="USA"
          actorName="Richard Schiff"
          birthDate="1981-02-16"
          src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRKfyN1WDPJqip9d21IO7RFId2HOQQoNmqayL2NYCUZhB-hcgUm"
        />
      </tbody>
    </Table>
  );
}

const Actors = () => {
  const { setShowSidebar, setActiveMenu, setShowNavigation, setShowFooter } =
    useGlobalState();
  useEffect(() => {
    setShowSidebar(true);
    setActiveMenu("Actors");
    setShowNavigation(false);
    setShowFooter(false);
  }, [setShowSidebar]);
  return (
    <center>
      <div className="inner-container w-sm-100 w-xl-90 ps-3 pe-3 ps-lg-0 pe-lg-0 mt-4 mb-4">
        <AddActor />
        <ActorTable />
      </div>
    </center>
  );
};

export default Actors;
