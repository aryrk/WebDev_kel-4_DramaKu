import React, { useEffect, useState } from "react";
import $, { data } from "jquery";
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
import { loadConfigNonAsync } from "../../Config";

const token = sessionStorage.getItem("token");
var server = loadConfigNonAsync();
server.then((result) => (server = result.server));

function AddAwards({ fetchAwards }) {
  const { notification } = useSwal();
  const [award, setAward] = useState({ name: "", year: "" });

  const handleSubmit = async (e) => {
    e.preventDefault(); // Use e instead of event

    const newAward = {
      name: award.name,
      year: award.year,
    };

    try {
      const response = await fetch(server+"/api/cms/awardsList2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newAward),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to add award");
      }
      console.log("API Response:", data);

      notification("success", "Award added successfully!");
      setAward({ name: "", year: "" }); // Reset the form
      fetchAwards(); // Fetch updated awards list
    } catch (error) {
      notification("error", error.message || "Error adding award");
    }
  };

  return (
    <Form
      onSubmit={handleSubmit}
      className="bg-dark rounded-3 p-3 justify-content-start text-start mb-4"
    >
      <Container className="w-100 w-md-100 w-lg-75 m-auto">
        <Row className="align-items-center">
          <Col md={8}>
            <Form.Group as={Row} className="mb-3" controlId="formAward">
              <Form.Label column className="col-4">
                Name
              </Form.Label>
              <Col className="col-8">
                <Form.Control
                  className="bg-black border-0 text-light"
                  type="text"
                  placeholder="Enter award name"
                  value={award.name}
                  onChange={(e) => setAward({ ...award, name: e.target.value })}
                  required
                />
              </Col>
              <Form.Label column className="col-4 mt-2">
                Year
              </Form.Label>
              <Col className="col-8">
                <Form.Control
                  className="bg-black border-0 text-light mt-2"
                  type="text"
                  placeholder="Enter award year"
                  value={award.year}
                  onChange={(e) => setAward({ ...award, year: e.target.value })}
                  required
                />
              </Col>
            </Form.Group>
          </Col>
          <Col md={3} className="text-end">
            <Button
              className="rounded-3 w-100 mb-3"
              variant="primary"
              type="submit"
            >
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
  const [awards, setAwards] = useState([]);
  const [tableInitialized, setTableInitialized] = useState(false);
  // const [currentId, setCurrentId] = useState(null); // State to hold the current award ID
  // const [awardName, setAwardName] = useState(""); // State for award name
  // const [awardYear, setAwardYear] = useState(""); // State for award year
  const { notification } = useSwal();
  const { edit, cancelEdit } = useEdit();

  // useEffect(() => {
  //   console.log("Current ID updated:", currentId);
  // }, [currentId]);

  const fetchAwards = async () => {
    try {
      console.log(server);
      const response = await fetch(server+`/api/cms/awardsList2`, {
        method: "GET",
        mode: "cors",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setAwards(data.awards);
    } catch (error) {
      console.log("Error fetching award:", error);
    }
  };

  useEffect(() => {
    setShowSidebar(true);
    setActiveMenu("Awards");
    setShowNavigation(false);
    setShowFooter(false);
    fetchAwards();
  }, [server]);

  useEffect(() => {
    if (!tableInitialized && awards.length > 0) {
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
        data: awards,
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
                    onClick={() => {
                      const awardId = row.id;
                      const awardName = row.name;
                      const awardYear = row.year;
                      handleEditAward(awardId, awardName, awardYear);
                    }}
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
                    onClick={() => handleDeleteAward(no)}
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
          url: server+"/api/cms/awardsList2",
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
            // const awardId = table.row(row).data().id; // Ambil ID award dari row

            // console.log("Award ID from row:", awardId); // Tambahkan log untuk memverifikasi ID
            // row.id = awardId;
            row.id = table.row(row).data().id;

            const editBtn = document.getElementById(`editBtn${row.id}`);
            editBtn.onclick = () => {
              edit(row.id); // Panggil fungsi edit dengan ID yang benar
            };

            const CancelBtn = document.getElementById(`cancelBtn${row.id}`);
            CancelBtn.onclick = () => {
              cancelEdit(row.id);
            };

            const deleteBtn = document.getElementById(`deleteBtn${row.id}`);
            deleteBtn.onclick = () => {
              handleDeleteAward(row.id);
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
      table.rows.add(awards);
      table.draw();
    }
  }, [awards, tableInitialized]);

  const handleDeleteAward = async (id) => {
    const awardToDelete = awards.find((award) => award.id === id);

    // Jika award sudah dihapus, hentikan eksekusi delete
    if (awardToDelete && awardToDelete.deleted_at !== null) {
      notification("error", "Award already deleted!");
      return;
    }

    try {
      const response = await fetch(server+`/api/cms/awardsList2/${id}`, {
        method: "DELETE",
        mode: "cors",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        notification("success", "Award deleted successfully!");
        fetchAwards(); // Refresh awards list
      } else {
        notification("error", "Failed to delete award!");
      }
    } catch (error) {
      notification("error", "An error occurred while deleting the award");
    }
  };

  const handleEditAward = async (table) => {
    const form = document.getElementById("editForm");

    if (!form) {
      console.error("Form not found");
      return;
    }

    const formData = new FormData(form);
    const id = formData.get("id");
    const awardName = formData.get("name");
    const awardYear = formData.get("year");

    if (!id) {
      notification("error", "No ID found for award");
      return;
    }

    if (!awardName && !awardYear) {
      notification("error", "Award name and year are required");
      return;
    }

    console.log("Data to be sent:", { id, name: awardName, year: awardYear });

    const response = await fetch(server+`/api/cms/awardsList2/${id}`, {
      method: "PUT",
      mode: "cors",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: awardName, year: awardYear }),
    });

    const data = await response.json();
    console.log("Server response:", data);

    if (response.ok && data.success) {
      notification("success", "Award updated successfully");
      fetchAwards();
      if (table && table.ajax) {
        table.ajax.reload(null, false);
      }
    } else {
      notification("error", data.message || "Failed to update award");
    }
  };

  return (
    <>
      <form
        id="editForm"
        onSubmit={(event) => {
          event.preventDefault();
          handleEditAward();
        }}
      ></form>
      <Container className="tabel">
        <h1 className="text-center">Awards</h1>
        <AddAwards fetchAwards={fetchAwards} />
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
          </table>
        </div>
      </Container>
    </>
  );
}

export default CMSAwards;
