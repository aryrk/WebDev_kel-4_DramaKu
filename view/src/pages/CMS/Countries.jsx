import React, { useEffect, useState } from "react";
import $, { data } from "jquery";
import DataTable from "datatables.net-dt";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faSave,
  faTrash,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import "../pagesStyle/Countries.css";
import { Container, Button, Form, Row, Col } from "react-bootstrap";
import { useGlobalState } from "../../components/GlobalStateContext";
import { useSwal } from "../../components/SweetAlert";
import { renderToString } from "react-dom/server";
import { useEdit } from "../../components/cmsEdit";

const token = sessionStorage.getItem("token");

function AddCountries() {
  const { notification } = useSwal();

  return (
    <Form
      className="bg-dark rounded-3 p-3 justify-content-start text-start mb-4"
      // onSubmit={handleSubmit}
    >
      <Container className="w-100 w-md-100 w-lg-75 m-auto">
        <Form>
          <Row className="align-items-center">
            <Col md={8}>
              <Form.Group as={Row} className="mb-3" controlId="formCountry">
                <Form.Label column className="col-4">
                  Country Name
                </Form.Label>
                <Col className="col-8">
                  <Form.Control
                    className="bg-black border-0 text-light"
                    type="text"
                    placeholder="Enter country name"
                    required
                  />
                </Col>
              </Form.Group>
            </Col>
            <Col md={3} className="text-end">
              <Button
                className="rounded-3 w-100"
                variant="primary"
                type="submit"
              >
                Submit
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </Form>
  );
}

function CMSCountries() {
  const { setShowSidebar, setActiveMenu, setShowNavigation, setShowFooter } =
    useGlobalState();
  const [show, setShow] = useState(false);
  const [fullscreen, setFullscreen] = useState(true);

  const [country, setCountry] = useState([]);
  const [TotalCountries, setTotalCountries] = useState(0);
  const [tableInitialized, setTableInitialized] = useState(false);

  const { cancelEdit, edit, last_edit } = useEdit();

  const handleClose = () => setShow(false);
  const handleShow = (breakpoint) => {
    setFullscreen(breakpoint);
    setShow(true);
  };

  const fetchCountry = async (page = 1) => {
    try {
      const limit = 10;
      const offset = (page - 1) * limit;
      const response = await fetch(
        `/api/cms/countriesList?limit=${limit}&offset=${offset}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setCountry(data.countries);
      console.log(country);
      setTotalCountries(data.total);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchCountry();
  }, []);

  useEffect(() => {
    setShowSidebar(true);
    setActiveMenu("Countries");
    setShowNavigation(false);
    setShowFooter(false);
  }, []);

  useEffect(() => {
    if (!tableInitialized && country.length > 0) {
      new DataTable("#countries", {
        scrollY: "45vh",
        columnDefs: [
          {
            width: "50px",
            targets: 0,
          },
          {
            width: "80px",
            targets: 1,
          },
          {
            width: "50px",
            targets: 2,
          },
        ],
        data: country,
        columns: [
          {
            render: function (data, type, row, meta) {
              return `<span>${
                meta.row + 1 + meta.settings._iDisplayStart
              }</span>`;
            },
          },
          {
            data: "name",
            render: (data) => {
              return `<span name="name">${data}</span>`;
            },
          },
          {
            render: function (data, type, row, meta) {
              const no = row.id;

              return renderToString(
                <div className="d-flex justify-content-center">
                  <Button
                    variant="primary"
                    className="mx-2"
                    onClick={() => edit(no)}
                    id={`editBtn${no}`}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>
                  <Button
                    variant="success"
                    className="d-none mx-2"
                    id={`editSaveBtn${no}`}
                    form="editForm"
                    type="submit"
                  >
                    <FontAwesomeIcon icon={faSave} />
                  </Button>
                  <Button
                    variant="danger"
                    className="mx-2"
                    id={`deleteBtn${no}`}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                  <Button
                    variant="warning"
                    id={`cancelBtn${no}`}
                    className="d-none mx-2"
                    onClick={() => cancelEdit(no)}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </Button>
                </div>
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
          url: "/api/cms/countriesList",
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
            return json.countries;
          },
        },
        drawCallback: function () {
          const table = $("#countries").DataTable();
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
      const table = $("#countries").DataTable();
      table.clear();
      table.rows.add(country);
      table.draw();
    }
  }, [country, tableInitialized]);

  // const table = $("#countries").DataTable({
  //   pageLength: 10,
  //   lengthChange: true,
  //   searching: true,
  //   ordering: true,
  //   info: true,
  //   paging: true,
  //   lengthMenu: [10, 25, 50],
  //   autoWidth: false,
  //   columnDefs: [
  //     {
  //       width: "50px",
  //       targets: 0,
  //     },
  //     {
  //       width: "80px",
  //       targets: 2,
  //     },
  //   ],
  // });

  // return () => {
  //   table.destroy();
  // };

  return (
    <Container className="tabel">
      <h1 className="text-center mb-5">Countries</h1>
      <AddCountries /> {/* Pindahkan form untuk menambah negara di sini */}
      <div className="table-responsive">
        <table id="countries" className="display">
          <thead>
            <tr>
              <th>ID</th>
              <th>Country</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* {countriesData.map((country) => (
              <tr key={country.id}>
                <td>{country.id}</td>
                <td>{country.name}</td>
                <td>
                  <div className="actions">
                    <Button
                      onClick={() => handleShow("xl-down")}
                      className="bg-transparent border-0"
                    >
                      <FontAwesomeIcon icon={faEdit} className="edit" />
                    </Button>
                    <FontAwesomeIcon icon={faTrash} className="delete" />
                  </div>
                </td>
              </tr>
            ))} */}
          </tbody>
        </table>
      </div>
    </Container>
  );
}

export default CMSCountries;
