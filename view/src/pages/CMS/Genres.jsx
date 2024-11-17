import React, { useEffect, useState } from "react";
import $ from "jquery";
import DataTable from "datatables.net-dt";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faSave,
  faTrash,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import "../pagesStyle/Genres.css";
import { Container, Button, Form, Row, Col } from "react-bootstrap";
import { useGlobalState } from "../../components/GlobalStateContext";
import { useSwal } from "../../components/SweetAlert";
import { renderToString } from "react-dom/server";
import { useEdit } from "../../components/cmsEdit";
import { loadConfigNonAsync } from "../../Config";

const token = sessionStorage.getItem("token");
var server = loadConfigNonAsync();
server.then((result) => (server = result.server));

function AddGenres({ fetchGenres }) {
  const { notification } = useSwal();
  const [genre, setGenre] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newGenre = {
      name: genre,
    };

    try {
      const response = await fetch(server + "/api/cms/genresList", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newGenre),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to add genre");
      }
      console.log("API Response:", data);

      notification("success", "Genre added successfully!");
      setGenre(""); // Reset input field
      fetchGenres();
    } catch (error) {
      notification("error", error.message || "Error adding genre");
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
            <Form.Group as={Row} className="mb-3" controlId="formGenre">
              <Form.Label column className="col-4">
                Genre
              </Form.Label>
              <Col className="col-8">
                <Form.Control
                  className="bg-black border-0 text-light"
                  type="text"
                  placeholder="Enter genre"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  required
                />
              </Col>
            </Form.Group>
          </Col>
          <Col md={3} className="text-end">
            <Button
              className="rounded-3 w-100 mb-3 "
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

function CMSGenres() {
  const { setShowSidebar, setActiveMenu, setShowNavigation, setShowFooter } =
    useGlobalState();
  const [genres, setGenres] = useState([]);
  const [tableInitialized, setTableInitialized] = useState(false);

  const { cancelEdit, edit } = useEdit();
  const { notification, confirmation_action } = useSwal();

  const fetchGenres = async () => {
    try {
      // const limit = 10;
      // const offset = (page - 1) * limit;
      const response = await fetch(server + "/api/cms/genresList", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setGenres(data.genres);
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  };

  useEffect(() => {
    setShowSidebar(true);
    setActiveMenu("Genres");
    setShowNavigation(false);
    setShowFooter(false);
    fetchGenres();
  }, []);

  useEffect(() => {
    if (!tableInitialized && genres.length > 0) {
      new DataTable("#genres", {
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
        data: genres,
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
              const relation_count = row.relation_count;

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
                  {relation_count > 0 ? (
                    <Button variant="secondary" className="mx-2" disabled>
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  ) : (
                    <Button
                      variant="danger"
                      className="mx-2"
                      id={`deleteBtn${no}`}
                      onClick={() => handleDeleteGenre(no)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  )}
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
          url: server + "/api/cms/genresList",
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
            return json.genres;
          },
        },
        drawCallback: function () {
          const table = $("#genres").DataTable();
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

            try {
              const deleteBtn = document.getElementById(`deleteBtn${row.id}`);
              deleteBtn.onclick = () => {
                // handleDeleteGenre(row.id);
                confirmation_action(
                  "warning",
                  "Delete Genre",
                  "Are you sure you want to delete this genre?",
                  "Yes, delete it!",
                  () => handleDeleteGenre(row.id)
                );
              };
            } catch {}

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
      const table = $("#genres").DataTable();
      table.clear();
      table.rows.add(genres);
      table.draw();
    }
  }, [genres, tableInitialized]);

  const handleDeleteGenre = async (id) => {
    try {
      const response = await fetch(server + `/api/cms/genresList/${id}`, {
        method: "DELETE",
        mode: "cors",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        notification("success", "Genre deleted successfully!");
        fetchGenres();
        const table = $("#genres").DataTable();
        table.ajax.reload(); // Reload the table data
      } else {
        notification("error", "Failed to delete genre!");
      }
    } catch (error) {
      notification("error", "An error occurred while deleting the genre!");
    }
  };

  const handleEditGenre = async () => {
    const form = document.getElementById("editForm");
    if (!form) {
      console.error("Form not found");
      return;
    }

    const formData = new FormData(form);
    const id = formData.get("id");
    const genre = formData.get("name");

    if (!id) {
      notification("error", "No ID found for genre");
      return;
    }

    if (!genre) {
      notification("error", "Genre is required");
      return;
    }

    try {
      const response = await fetch(server + `/api/cms/genresList/${id}`, {
        method: "PUT",
        mode: "cors",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: genre }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        notification("error", errorData.message || "Failed to update genre");
        return;
      }

      const data = await response.json();
      if (data.success) {
        notification("success", "Genre updated successfully");
        fetchGenres(); // Refresh the list after editing
      } else {
        notification("error", data.message || "Failed to update genre");
      }
    } catch (error) {
      notification("error", "An error occurred while updating the genre");
    }
  };

  return (
    <>
      <form
        id="editForm"
        onSubmit={(event) => {
          event.preventDefault();
          handleEditGenre();
        }}
      ></form>
      <Container className="tabel">
        <h1 className="text-center">Genres</h1>
        <AddGenres fetchGenres={fetchGenres} />
        <div className="table-responsive">
          <table id="genres" className="display">
            <thead>
              <tr>
                <th>ID</th>
                <th>Genres</th>
                <th>Actions</th>
              </tr>
            </thead>
          </table>
        </div>
      </Container>
    </>
  );
}

export default CMSGenres;
