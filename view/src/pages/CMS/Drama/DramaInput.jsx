import React, { useEffect } from "react";
import { useGlobalState } from "../../../components/GlobalStateContext";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  InputGroup,
  Card,
  Image,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImageCrop from "filepond-plugin-image-crop";
import FilePondPluginImageEdit from "filepond-plugin-image-edit";
import FilepondPluginImageResize from "filepond-plugin-image-resize";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginImageTransform from "filepond-plugin-image-transform";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import Select from "react-select";

function PosterUpload() {
  registerPlugin(
    FilePondPluginImageExifOrientation,
    FilePondPluginImagePreview,
    FilePondPluginImageCrop,
    FilepondPluginImageResize,
    FilePondPluginImageTransform,
    FilePondPluginImageEdit
  );
  return (
    <center>
      <div
        style={{ width: "190px", height: "300px" }}
        className="rounded-3 mt-0 mt-md-4 ms-4 me-3"
      >
        <FilePond
          labelIdle="Drag & Drop your picture or <span class='filepond--label-action'>Browse</span>"
          allowMultiple={false}
          maxFiles={1}
          imagePreviewHeight={300}
          imageResizeTargetHeight={300}
          imageResizeTargetWidth={190}
          acceptedFileTypes={["image/*"]}
          stylePanelLayout="compact"
          imageEditAllowEdit={true}
          credits={false}
          stylePanelAspectRatio={300 / 190}
          imageCropAspectRatio="300:190"
          required={true}
          instantUpload={true}
        />
      </div>
      <Button className="bg_pallete_3 border-0 rounded-4 mt-3 ps-4 pe-4">
        Submit
      </Button>
    </center>
  );
}
function ActorCard() {
  return (
    <Card
      className="bg_pallete_1 text-light border-0 mt-3 me-4 position-relative text-start"
      style={{ width: "260px", display: "inline-block" }}
    >
      <Card.Body className="ps-1 pt-2 pb-2 pe-1">
        <Container fluid>
          <Row>
            <Col sm="auto">
              <Image
                fluid
                src="https://m.media-amazon.com/images/M/MV5BMjEzNjAzMTgzMV5BMl5BanBnXkFtZTcwNjU2NjA2NQ@@._V1_.jpg"
                style={{ width: "60px", height: "91px" }}
                className="img_cover thumbnail rounded-3"
                loading="lazy"
              />
            </Col>
            <Col>
              Freddie Highmore
              <br />
              1992-02-14
              <br />
              USA
            </Col>
          </Row>
        </Container>
      </Card.Body>
      <Button className="position-absolute bottom-0 end-0">X</Button>
    </Card>
  );
}

function AddActor() {
  return (
    <div>
      <Form.Group as={Col} md="100" className="mt-3 ms-5 me-3">
        <Form.Label>Add Actors (Up to 9)</Form.Label>
        <InputGroup hasValidation>
          <InputGroup.Text
            id="inputGroupPrepend"
            className="bg-secondary text-light border-0"
          >
            Search Actor Names:
          </InputGroup.Text>
          <Form.Control
            required
            type="text"
            className="bg_pallete_1 text-light border-0"
          />
        </InputGroup>
      </Form.Group>
      <div
        style={{
          width: "inherit",
          height: "500px",
          overflow: "auto",
          // display: "block",
        }}
        className="mt-3 mb-2"
      >
        <center>
          <ActorCard />
          <ActorCard />
          <ActorCard />
          <ActorCard />
          <ActorCard />
          <ActorCard />
          <ActorCard />
          <ActorCard />
          <ActorCard />
          <ActorCard />
          <ActorCard />
        </center>
      </div>
    </div>
  );
}
function DramaForm() {
  const option = [
    { value: "1", label: "Gendre1" },
    { value: "2", label: "Gendre2" },
  ];
  return (
    <Row>
      <Form.Group as={Col} md="5" lg="6" className="mt-3">
        <Form.Label>Tile</Form.Label>
        <Form.Control
          required
          type="text"
          className="bg_pallete_1 text-light border-0"
        />
      </Form.Group>
      <Form.Group as={Col} md="5" lg="6" className="mt-3">
        <Form.Label>Alternative Title</Form.Label>
        <Form.Control
          required
          type="text"
          className="bg_pallete_1 text-light border-0"
        />
      </Form.Group>
      <Form.Group as={Col} md="4" xl="2" className="mt-3">
        <Form.Label>Year</Form.Label>
        <Form.Control
          required
          type="number"
          min={1900}
          step={1}
          className="bg_pallete_1 text-light border-0"
        />
      </Form.Group>
      <Form.Group as={Col} md="4" className="mt-3">
        <Form.Label>Country</Form.Label>
        <Form.Control
          required
          type="text"
          className="bg_pallete_1 text-light border-0"
        />
      </Form.Group>
      <Form.Group as={Col} sm="100" className="mt-3">
        <Form.Label>Synopsis</Form.Label>
        <Form.Control
          required
          as="textarea"
          className="bg_pallete_1 text-light border-0"
        />
      </Form.Group>
      <Form.Group as={Col} sm="100" className="mt-3">
        <Form.Label>Availability</Form.Label>
        <Form.Control
          required
          type="text"
          className="bg_pallete_1 text-light border-0"
        />
      </Form.Group>
      <Form.Group as={Col} sm="100" className="mt-3">
        <Form.Label>Gendres</Form.Label>
        <Select
          isMulti
          options={option}
          className="bg_pallete_1 text-light border-0"
          classNamePrefix="select"
          styles={{
            control: (baseStyles, state) => ({
              ...baseStyles,
              backgroundColor: "#141414",
              border: "0",
            }),
            menu: (baseStyles, state) => ({
              ...baseStyles,
              backgroundColor: "#141414",
              border: "0",
            }),
            option: (baseStyles, state) => ({
              ...baseStyles,
              backgroundColor:
                state.isFocused || state.isSelected ? "#525c91" : "#141414",
              border: "0",
            }),
            multiValue: (baseStyles, state) => ({
              ...baseStyles,
              backgroundColor: "#525c91",
              color: "white",
              border: "0",
            }),
            multiValueLabel: (baseStyles, state) => ({
              ...baseStyles,
              backgroundColor: "#525c91",
              color: "white",
              border: "0",
            }),
          }}
        />
      </Form.Group>
      <Form.Group as={Col} md="6" className="mt-3">
        <Form.Label>Hai</Form.Label>
        <Form.Control
          required
          type="text"
          className="bg_pallete_1 text-light border-0"
        />
      </Form.Group>
      <Form.Group as={Col} md="6" className="mt-3">
        <Form.Label>Award</Form.Label>
        <Form.Select required className="bg-black text-light border-0">
          <option>Hai</option>
          <option>Hai</option>
          <option>Hai</option>
          <option>Hai</option>
        </Form.Select>
      </Form.Group>
    </Row>
  );
}

const DramaInput = () => {
  const { setShowSidebar, setActiveMenu } = useGlobalState();
  useEffect(() => {
    setShowSidebar(true);
    setActiveMenu("Input New Drama");
  }, [setShowSidebar]);
  return (
    <div className="inner-container w-sm-100 w-xl-90 ps-3 pe-3 ps-lg-0 pe-lg-0 mt-4 mb-4">
      <Form className="bg-dark pt-4 pb-4 rounded-3 pe-3">
        <Container>
          <Row>
            <Col sm="auto">
              <PosterUpload />
            </Col>
            <Col>
              <DramaForm />
            </Col>
          </Row>
        </Container>
        <AddActor />
      </Form>
    </div>
  );
};

export default DramaInput;
