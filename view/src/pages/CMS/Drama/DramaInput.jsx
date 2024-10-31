import React, { useEffect, useState } from "react";

import $ from "jquery";
import DataTable from "datatables.net-dt";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImageCrop from "filepond-plugin-image-crop";
import FilePondPluginImageEdit from "filepond-plugin-image-edit";
import FilepondPluginImageResize from "filepond-plugin-image-resize";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginImageTransform from "filepond-plugin-image-transform";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import {
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Table,
} from "react-bootstrap";

import { renderToString } from "react-dom/server";
import CreatableSelect from "react-select/creatable";

import { loadConfigNonAsync, withConfig } from "../../../Config";
import { useSwal } from "../../../components/SweetAlert";
import { useGlobalState } from "../../../components/GlobalStateContext";

import "bootstrap/dist/css/bootstrap.min.css";

// var files = [];
// const setFiles = (file) => {
//   files = file;
// };

var GenreRef = null;
var AwardRef = null;

const token = sessionStorage.getItem("token");
var server = loadConfigNonAsync();
server.then((result) => (server = result.server));

function PosterUpload() {
  registerPlugin(
    FilePondPluginImageExifOrientation,
    FilePondPluginImagePreview,
    FilePondPluginImageCrop,
    FilepondPluginImageResize,
    FilePondPluginImageTransform,
    FilePondPluginImageEdit
  );

  const { alert, notification } = useSwal();
  const [files, setFiles] = useState([]);
  const onSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    if (files.length === 0) {
      alert("error", "Please upload a poster");
      return;
    }
    if (actors_id.length === 0) {
      alert("error", "Please select at least one actor");
      return;
    }
    formData.append("poster", files[0].file);
    actors_id.forEach((actorId) => {
      formData.append("actors[]", actorId);
    });

    fetch(server + "/api/cms/movies", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }).then((response) => {
      if (response.status === 200) {
        notification("success", "Drama added successfully");
        e.target.reset();
        setFiles([]);

        $("#actors")
          .DataTable()
          .rows()
          .every(function (rowIdx, tableLoop, rowLoop) {
            const row = this.node();
            const checkbox = $(row).find("input[type='checkbox']")[0];
            checkbox.checked = false;
          });

        actors_id = [];
        actors_name = [];
        $("#actor-added").val("");

        const form = document.getElementById("form-drama");
        const hiddenInputs = form.querySelectorAll("input[type='hidden']");
        hiddenInputs.forEach((input) => input.remove());

        GenreRef.clearValue();
        AwardRef.clearValue();
      } else {
        notification("error", "Failed to add drama");
      }
    });
  };

  return (
    <center>
      <Form id="form-drama" onSubmit={onSubmit} />
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
          // instantUpload={true}
          form="form-drama"
          files={files}
          onupdatefiles={setFiles}
        />
      </div>
      <Button
        className="bg_pallete_3 border-0 rounded-4 mt-3 ps-4 pe-4"
        type="submit"
        form="form-drama"
      >
        Submit
      </Button>
    </center>
  );
}

var actors_id = [];
var actors_name = [];

function AddActor(props) {
  const { config } = props;
  const [actors, setActors] = useState([]);
  const [totalActors, setTotalActors] = useState(0);
  const [tableInitialized, setTableInitialized] = useState(false);
  const { alert } = useSwal();

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
  }, []);

  useEffect(() => {
    if (!tableInitialized && actors.length > 0) {
      new DataTable("#actors", {
        scrollY: "45vh",
        columnDefs: [
          { width: "60px", targets: 0 },
          { width: "150px", targets: 1 },
          { width: "180px", targets: 3 },
          { width: "140px", targets: 4 },
        ],
        data: actors,
        columns: [
          {
            render: function (data, type, row, meta) {
              return `
              <center>
              <input type="checkbox"
              class="form-check-input"
              id="actor${row.id}"
              value="${row.id}"
              />
              </center>
              `;
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

            actors_id.forEach((actorId) => {
              $(`#actor${actorId}`).prop("checked", true);
            });

            const checkbox = document.getElementById(`actor${row.id}`);
            checkbox.addEventListener("change", handleAddRemoveActor);
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

  const handleAddRemoveActor = (e) => {
    if (actors_id.length >= 20 && e.target.checked) {
      alert("error", "You can only add up to 20 actors");
      e.target.checked = false;
      return;
    }

    const actorId = parseInt(e.target.value);
    const actorName = $(e.target)
      .closest("tr")
      .find("span[name='name']")
      .text();

    if (e.target.checked) {
      actors_id.push(actorId);
      actors_name.push(actorName);
    } else {
      actors_id = actors_id.filter((actor) => actor !== actorId);
      actors_name = actors_name.filter((actor) => actor !== actorName);
    }

    $("#actor-added").val(actors_name.join(", "));
  };

  return (
    <div>
      <div
        style={{
          width: "inherit",
          // display: "block",
        }}
        className="mt-3 mb-2 ms-3 me-1 ms-md-5 me-md-5"
      >
        Add Actor (Max 20):
        <center>
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
              </tr>
            </thead>
          </Table>
        </center>
        Actor Added:
        <Form.Group as={Col} md="100">
          <InputGroup hasValidation>
            <Form.Control
              readOnly
              as="textarea"
              className="bg_pallete_1 text-light border-0"
              id="actor-added"
              style={{ height: "100px" }}
            />
          </InputGroup>
        </Form.Group>
      </div>
    </div>
  );
}

function DramaForm() {
  const [genre_option, setGenreOption] = useState([]);
  const [award_option, setAwardOption] = useState([]);

  const [countries, setCountries] = useState([]);
  const [genres, setGenres] = useState([]);
  const [awards, setAwards] = useState([]);

  const fetch_data = () => {
    fetch(server + "/api/cms/countrylist")
      .then((res) => res.json())
      .then((data) => {
        setCountries(data);
      });

    fetch(server + "/api/cms/genrelist")
      .then((res) => res.json())
      .then((data) => {
        setGenres(data);
      });

    fetch(server + "/api/cms/awardlist")
      .then((res) => res.json())
      .then((data) => {
        setAwards(data);
      });
  };

  const put_data = () => {
    setGenreOption(
      genres.map((genre) => {
        return { value: genre.id, label: genre.name };
      })
    );
    setAwardOption(
      awards.map((award) => {
        return { value: award.id, label: award.name };
      })
    );
  };

  useEffect(() => {
    fetch_data();
  }, []);

  useEffect(() => {
    put_data();
  }, [genres, awards]);

  const handleGenreChange = (newValue, actionMeta) => {
    var genre = newValue.map((genre) => genre.value);

    const form = document.getElementById("form-drama");
    if (form.querySelector("input[name='genres']")) {
      form.querySelector("input[name='genres']").remove();
    }

    genre.forEach((genreId) => {
      var input = document.createElement("input");
      input.setAttribute("type", "hidden");
      input.setAttribute("name", "genres[]");
      input.setAttribute("value", genreId);
      form.appendChild(input);
    });

    fetch_data();
    put_data();
  };

  const handleAwardChange = (newValue, actionMeta) => {
    var award = newValue.map((award) => award.value);

    const form = document.getElementById("form-drama");
    if (form.querySelector("input[name='award']")) {
      form.querySelector("input[name='award']").remove();
    }

    award.forEach((awardId) => {
      var input = document.createElement("input");
      input.setAttribute("type", "hidden");
      input.setAttribute("name", "award[]");
      input.setAttribute("value", awardId);
      form.appendChild(input);
    });

    fetch_data();
    put_data();
  };

  return (
    <>
      {countries && genres && awards && (
        <Row>
          <Form.Group as={Col} md="5" lg="6" className="mt-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              required
              type="text"
              className="bg_pallete_1 text-light border-0"
              form="form-drama"
              name="title"
            />
          </Form.Group>
          <Form.Group as={Col} md="5" lg="6" className="mt-3">
            <Form.Label>Alternative Title</Form.Label>
            <Form.Control
              // required
              type="text"
              className="bg_pallete_1 text-light border-0"
              form="form-drama"
              name="alternative_title"
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
              form="form-drama"
              name="year"
            />
          </Form.Group>
          <Form.Group as={Col} md="4" className="mt-3">
            <Form.Label>Country</Form.Label>
            <Form.Control
              required
              type="text"
              className="bg_pallete_1 text-light border-0"
              list="countries"
              autoComplete="off"
              form="form-drama"
              name="country"
              onChange={(e) => {
                fetch_data();
                put_data();
              }}
            />
            <datalist id="countries">
              {countries.map((country, index) => (
                <option key={index} value={country.name}>
                  {country.name}
                </option>
              ))}
            </datalist>
          </Form.Group>
          <Form.Group as={Col} sm="100" className="mt-3">
            <Form.Label>Synopsis</Form.Label>
            <Form.Control
              required
              as="textarea"
              className="bg_pallete_1 text-light border-0"
              form="form-drama"
              name="synopsis"
            />
          </Form.Group>
          <Form.Group as={Col} sm="100" className="mt-3">
            <Form.Label>Availability</Form.Label>
            <Form.Control
              required
              type="text"
              className="bg_pallete_1 text-light border-0"
              form="form-drama"
              name="availability"
            />
          </Form.Group>
          <Form.Group as={Col} sm="100" className="mt-3">
            <Form.Label>Genres</Form.Label>
            <CreatableSelect
              onChange={handleGenreChange}
              ref={(ref) => (GenreRef = ref)}
              isClearable
              required
              isMulti
              options={genre_option}
              form="form-drama"
              name="genres"
              className="bg_pallete_1 text-light border-0"
              classNamePrefix="select"
              id="genre"
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
            <Form.Label>Link Trailer</Form.Label>
            <Form.Control
              required
              type="text"
              className="bg_pallete_1 text-light border-0"
              form="form-drama"
              name="link_trailer"
            />
          </Form.Group>
          <Form.Group as={Col} md="6" className="mt-3">
            <Form.Label>Award</Form.Label>
            <CreatableSelect
              onChange={handleAwardChange}
              ref={(ref) => (AwardRef = ref)}
              isClearable
              required
              id="award"
              form="form-drama"
              name="award"
              isMulti
              options={award_option}
              className="bg-black text-light border-0"
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
        </Row>
      )}
    </>
  );
}

const FormDramaInput = (props) => {
  const { config } = props;

  return (
    <>
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
      <AddActor config={config} />
    </>
  );
};

const DramaInput = ({ config }) => {
  const { setShowSidebar, setActiveMenu, setShowNavigation, setShowFooter } =
    useGlobalState();
  useEffect(() => {
    setShowSidebar(true);
    setActiveMenu("Input New Drama");
    setShowNavigation(false);
    setShowFooter(false);
  }, [setShowSidebar]);
  return (
    <>
      <div className="inner-container w-sm-100 w-xl-90 ps-3 pe-3 ps-lg-0 pe-lg-0 mt-4 mb-4">
        <div className="bg-dark pt-4 pb-4 rounded-3 pe-3">
          <FormDramaInput config={config} />
        </div>
      </div>
    </>
  );
};

export default withConfig(DramaInput);
export { FormDramaInput };
