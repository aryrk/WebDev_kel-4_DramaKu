import React, { useState } from "react";
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
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";

import { faSave, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useGlobalState } from "../../components/GlobalStateContext";
import { useEdit } from "../../components/cmsEdit";

import "datatables.net";

import "filepond/dist/filepond.min.css";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { useSwal } from "../../components/SweetAlert";
import { renderToString } from "react-dom/server";
import { loadConfigNonAsync, withConfig } from "../../Config";

const token = sessionStorage.getItem("token");
var server = loadConfigNonAsync();
server.then((result) => (server = result.server));

function AddActor() {
  registerPlugin(
    FilePondPluginImageExifOrientation,
    FilePondPluginImagePreview,
    FilePondPluginImageCrop,
    FilepondPluginImageResize,
    FilePondPluginImageTransform,
    FilePondPluginImageEdit,
    FilePondPluginFileValidateType
  );

  const { notification } = useSwal();

  const [files, setFiles] = useState([]);

  const onSubmit = async (e) => {
    e.preventDefault();

    $("#submittext").addClass("d-none");
    $("#loading").removeClass("d-none");

    const formData = new FormData();
    if (files.length > 0) {
      formData.append("file", files[0].file);
    }
    formData.append("country", e.target.country.value);
    formData.append("actorName", e.target.actorName.value);
    formData.append("birthDate", e.target.birthDate.value);

    fetch(server + "/api/cms/actors", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      $("#submittext").removeClass("d-none");
      $("#loading").addClass("d-none");
      if (response.status === 200) {
        notification("success", "Actor added successfully");
        e.target.reset();
        setFiles([]);
        fetchActors();
      } else {
        notification("error", "Failed to add actor");
      }
    });
  };

  const [countries, setCountries] = useState([]);
  useEffect(() => {
    fetch(server + "/api/cms/countrylist")
      .then((res) => res.json())
      .then((data) => {
        setCountries(data);
      });
  }, [server]);

  return (
    <>
      {countries && (
        <Form
          onSubmit={onSubmit}
          className="bg-dark rounded-3 p-3 d-flex justify-content-start text-start mb-4"
        >
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
                      className="bg-black border-0 text-light"
                      placeholder="Country"
                      id="country"
                      name="country"
                      required
                      list="countries"
                      autoComplete="off"
                    />
                    <datalist id="countries">
                      {countries.map((country, index) => (
                        <option key={index} value={country.name} />
                      ))}
                    </datalist>
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
                      className="bg-black border-0 text-light"
                      placeholder="Actor Name"
                      id="actorName"
                      name="actorName"
                      required
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
                      className="bg-black border-0 text-light"
                      id="birthDate"
                      name="birthDate"
                      required
                      max={new Date().toISOString().split("T")[0]}
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
                          // instantUpload={true}
                          files={files}
                          onupdatefiles={setFiles}
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
              <span id="submittext">Submit</span>
              {/* loading */}
              <span id="loading" className="d-none">
                <span
                  className="spinner-border spinner-border-sm ms-2"
                  role="status"
                ></span>
                <span> Loading</span>
              </span>
            </Button>
          </Container>
        </Form>
      )}
    </>
  );
}
function ActorTable(props) {
  const { config } = props;

  const [actors, setActors] = useState([]);
  const [totalActors, setTotalActors] = useState(0);
  const [tableInitialized, setTableInitialized] = useState(false);
  const { cancelEdit, edit, last_edit } = useEdit();
  const { notification } = useSwal();

  const fetchActors = async (page = 1) => {
    try {
      const limit = 10;
      const offset = (page - 1) * limit;
      const response = await fetch(
        server + `/api/cms/actors?limit=${limit}&offset=${offset}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setActors(data.actors);
      setTotalActors(data.total);
    } catch {}
  };
  useEffect(() => {
    fetchActors();
  }, [server]);

  useEffect(() => {
    if (!tableInitialized && actors.length > 0) {
      new DataTable("#actors", {
        scrollY: "45vh",
        columnDefs: [
          { width: "60px", targets: 0 },
          { width: "150px", targets: 1 },
          { width: "180px", targets: 3 },
          { width: "140px", targets: 4 },
          { width: "110px", targets: 5 },
        ],
        data: actors,
        columns: [
          {
            render: function (data, type, row, meta) {
              return `<span>${
                meta.row + 1 + meta.settings._iDisplayStart
              }</span>`;
            },
          },
          {
            data: "country_name",
            render: function (data) {
              return `<span name="country" list="countries">${data}</span>`;
            },
          },
          {
            data: "name",
            render: function (data) {
              return `<span name="name">${data}</span>`;
            },
          },
          {
            data: "birthdate",
            render: function (data) {
              var date = data.split("T")[0];
              var d = new Date(date);
              d.setDate(d.getDate() + 1);
              return `<span name="date">${
                d.toISOString().split("T")[0]
              }</span>`;
            },
          },
          {
            data: "picture_profile",
            render: function (data, type, row, meta) {
              var id = row.id;
              var img = data;
              if (data.includes("/public/uploads/")) {
                img = `${config.server}${data}`;
              }

              return renderToString(
                <center name="img" old={img}>
                  <img
                    old={img}
                    id={`img${id}`}
                    src={img}
                    alt="actor"
                    loading="lazy"
                    style={{ width: "110px", height: "141px" }}
                    className="img_cover rounded-3"
                  />
                </center>
              );
            },
          },
          {
            render: function (data, type, row, meta) {
              const no = row.id;

              return renderToString(
                <center>
                  <Button
                    variant="primary"
                    className="mb-3 mb-sm-4"
                    onClick={() => edit(no)}
                    id={`editBtn${no}`}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>
                  <Button
                    variant="success"
                    className="mb-3 mb-sm-4 d-none"
                    id={`editSaveBtn${no}`}
                    form="editForm"
                    type="submit"
                  >
                    <FontAwesomeIcon icon={faSave} />
                  </Button>
                  <br></br>
                  <Button variant="danger" id={`deleteBtn${no}`}>
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                  <Button
                    variant="warning"
                    id={`cancelBtn${no}`}
                    className="d-none"
                    onClick={() => cancelEdit(no)}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </Button>
                </center>
              );
            },
          },
        ],
        destroy: true,
        paging: true,
        searching: true,
        ordering: true,
        serverSide: true,
        processing: true,
        ajax: {
          url: server + "/api/cms/actors",
          type: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: function (d) {
            const limit = d.length;
            const offset = d.start;
            const searchValue = d.search.value;
            const orderColumn = d.order[0].column;
            const orderDir = d.order[0].dir;

            return {
              limit: limit,
              offset: offset,
              search: searchValue,
              page: offset / limit + 1,
              order: orderColumn,
              dir: orderDir,
            };
          },
          dataSrc: function (json) {
            return json.actors;
          },
        },
        drawCallback: function () {
          const table = $("#actors").DataTable();
          table.rows().every(function (rowIdx, tableLoop, rowLoop) {
            const row = this.node();
            row.id = table.row(row).data().id;

            const editBtn = document.getElementById(`editBtn${row.id}`);
            editBtn.onclick = () => {
              edit(row.id);
            };

            const CancelBtn = document.getElementById(`cancelBtn${row.id}`);
            CancelBtn.onclick = () => {
              cancelEdit(row.id);
            };

            const deleteBtn = document.getElementById(`deleteBtn${row.id}`);
            deleteBtn.onclick = () => {
              handleDeleteUser(row.id);
            };

            const tds = row.getElementsByTagName("td");
            for (let i = 1; i < tds.length - 1; i++) {
              const td = tds[i];
              const innerElement = td.firstChild;
              const name = innerElement.getAttribute("name");
              td.setAttribute("name", name);

              try {
                const old = innerElement.getAttribute("old");
                td.setAttribute("old", old);
              } catch {}

              try {
                const list = innerElement.getAttribute("list");
                td.setAttribute("list", list);
              } catch {}
            }
          });
        },
      });
      setTableInitialized(true);
    } else if (tableInitialized) {
      const table = $("#actors").DataTable();
      table.clear();
      table.rows.add(actors);
      table.draw();
    }
  }, [actors, tableInitialized]);
  const handleDeleteUser = async (id) => {
    try {
      const response = await fetch(server + `/api/cms/actors/${id}`, {
        method: "DELETE",
        mode: "cors",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        $(`#${id}`).css("text-decoration", "line-through");
        $(`#editBtn${id}`).addClass("d-none");
        $(`#deleteBtn${id}`).addClass("d-none");

        notification("success", "Actor deleted successfully!");
      } else {
        notification("error", "Failed to delete actor!");
      }
    } catch (error) {}
  };
  const handleEdit = async () => {
    const form = document.getElementById("editForm");
    const formData = new FormData(form);
    const id = formData.get("id");
    const country = formData.get("country");
    const actorName = formData.get("name");
    const birthDate = formData.get("date");
    const picture = formData.get("img");

    try {
      const response = await fetch(server + `/api/cms/actors/${id}`, {
        method: "PUT",
        mode: "cors",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        notification("success", "Actor updated successfully");

        $(`#cancelBtn${id}`).click();

        const tr = document.getElementById(id);
        const tds = tr.getElementsByTagName("td");

        console.log(picture);
        if (picture.name !== "") {
          const reader = new FileReader();
          reader.onload = function (e) {
            $(`#img${id}`).attr("src", e.target.result);
            $(`#img${id}`).attr("old", e.target.result);
          };
          reader.readAsDataURL(picture);
        }

        for (let i = 1; i < tds.length - 1; i++) {
          try {
            const td = tds[i];
            const name = td.getAttribute("name");
            if (name === "date") {
              var date = birthDate.split("T")[0];
              var d = new Date(date);
              td.innerHTML = d.toISOString().split("T")[0];
            } else if (name === "name") {
              td.innerHTML = actorName;
            } else if (name === "country") {
              td.innerHTML = country;
            }
          } catch {}
        }
      } else {
        notification("error", "Failed to update actor");
      }
    } catch {}
  };

  return (
    <>
      <form
        id="editForm"
        onSubmit={(event) => {
          event.preventDefault();
          handleEdit();
        }}
      ></form>
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
      </Table>
    </>
  );
}

const Actors = ({ config }) => {
  const { setShowSidebar, setActiveMenu, setShowNavigation, setShowFooter } =
    useGlobalState();
  useEffect(() => {
    setShowSidebar(true);
    setActiveMenu("Actors");
    setShowNavigation(false);
    setShowFooter(false);
  }, [setShowSidebar]);
  return (
    <center className="w-100">
      <div className="inner-container w-sm-100 w-xl-90 ps-3 pe-3 ps-lg-0 pe-lg-0 mt-4 mb-4">
        <AddActor />
        <ActorTable config={config} />
      </div>
    </center>
  );
};

export default withConfig(Actors);
