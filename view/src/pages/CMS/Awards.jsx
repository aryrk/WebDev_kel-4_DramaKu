import React, { useEffect, useState } from "react";
import $ from "jquery";
import DataTable from "datatables.net-dt";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faSave,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import "../pagesStyle/Awards.css";
import { Container, Form, Row, Col, Button } from "react-bootstrap";
import { useGlobalState } from "../../components/GlobalStateContext";
import { useEdit } from "../../components/cmsEdit";
import { useSwal } from "../../components/SweetAlert";
import { renderToString } from "react-dom/server";

// const awardsData = [
//   { id: 1, country: "Indonesia", year: 2016, award: "Best Picture" },
//   { id: 2, country: "Korea", year: 1994, award: "Best Director" },
//   { id: 3, country: "Jepang", year: 2021, award: "Best Actor" },
//   { id: 4, country: "Thailand", year: 2003, award: "Best Actress" },
//   { id: 5, country: "Inggris", year: 1998, award: "Best Supporting Actor" },
//   { id: 6, country: "Amerika", year: 2010, award: "Best Supporting Actress" },
//   { id: 7, country: "Spanyol", year: 2007, award: "Best Original Screenplay" },
//   { id: 8, country: "India", year: 2023, award: "Best Adapted Screenplay" },
//   { id: 9, country: "Perancis", year: 1992, award: "Best Cinematography" },
//   { id: 10, country: "Rusia", year: 2019, award: "Best Film Editing" },
//   { id: 11, country: "Italia", year: 2005, award: "Best Production Design" },
// ];

const token = sessionStorage.getItem("token");

function AddAwards() {
  const { notification } = useSwal();

  return (
    <Form className="bg-dark rounded-3 p-3 justify-content-start text-start mb-4">
      <Container className="w-100 w-md-100 w-lg-75 m-auto">
        <Row className="align-items-center">
          <Col md={8}>
            <Form.Group as={Row} className="mb-3" controlId="formAward">
              <Form.Label column className="col-4">
                Award
              </Form.Label>
              <Col className="col-8">
                <Form.Control
                  className="bg-black border-0 text-light"
                  type="text"
                  placeholder="Enter award"
                  required
                />
              </Col>
            </Form.Group>
          </Col>
          <Col md={3} className="text-end">
            <Button className="rounded-3 w-100" variant="primary" type="submit">
              Submit
            </Button>
          </Col>
        </Row>
      </Container>
    </Form>
  );
}

function CMSAwards() {
  const { setShowSidebar, setActiveMenu, setShowNavigation, setShowFooter } =
    useGlobalState();
  const [show, setShow] = useState(false);
  const [fullscreen, setFullscreen] = useState(true);

  const [award, setAward] = useState([]);
  const [TotalAwards, setTotalAwards] = useState(0);
  const [tableInitialized, setTableInitialized] = useState(false);

  const { cancelEdit, edit, last_edit } = useEdit();

  const handleClose = () => setShow(false);
  const handleShow = (breakpoint) => {
    setFullscreen(breakpoint);
    setShow(true);
  };

  const fetchAward = async (page = 1) => {
    try {
      const limit = 10;
      const offset = (page - 1) * limit;
      const response = await fetch(
        `/api/cms/awardsList?limit=${limit}&offset=${offset}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setAward(data.awards);
      console.log(award);
      setTotalAwards(data.total);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchAward();
  }, []);

  useEffect(() => {
    setShowSidebar(true);
    setActiveMenu("Awards");
    setShowNavigation(false);
    setShowFooter(false);
  }, []);

  useEffect(() => {
    if (!tableInitialized && award.length > 0) {
      new DataTable("#awards", {
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
            width: "80px",
            targets: 2,
          },
          {
            width: "50px",
            targets: 3,
          },
        ],
        data: award,
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
              return `<span name="award">${data}</span>`;
            },
          },
          {
            data: "year",
            render: (data) => {
              return `<span name="year">${data}</span>`;
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
          url: "/api/cms/awardsList",
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
            return json.awards;
          },
        },
        drawCallback: function () {
          const table = $("#awards").DataTable();
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
      const table = $("#awards").DataTable();
      table.clear();
      table.rows.add(award);
      table.draw();
    }
  }, [award, tableInitialized]);

  // Initialize DataTable
  // $("#awards").DataTable({
  //   pageLength: 10, // Jumlah baris per halaman
  //   lengthChange: true, // Izinkan opsi untuk mengubah jumlah baris per halaman
  //   searching: true, // Aktifkan pencarian
  //   ordering: true, // Aktifkan pengurutan kolom
  //   info: true, // Tampilkan info tentang tabel
  //   paging: true, // Aktifkan pagination
  //   lengthMenu: [10, 25, 50],
  //   autoWidth: false,
  // });

  return (
    <Container className="tabel">
      <h1 className="text-center">Awards</h1>
      <AddAwards />
      <div className="table-responsive">
        <table id="awards" className="display">
          <thead>
            <tr>
              <th>ID</th>
              <th>Award</th>
              <th>Year</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* {awardsData.map((award) => (
              <tr key={award.id}>
                <td>{award.id}</td>
                <td>{award.award}</td>
                <td>{award.year}</td>
                <td>
                  <div className="actions">
                    <FontAwesomeIcon icon={faEdit} className="edit" />
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

export default CMSAwards;
