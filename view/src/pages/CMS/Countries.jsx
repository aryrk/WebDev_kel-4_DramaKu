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

function AddCountries({ fetchCountries }) {
  const { notification } = useSwal();
  const [country, setCountry] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newCountry = {
      name: country,
    };

    try {
      const response = await fetch("/api/cms/countriesList", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newCountry),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to add country");
      }
      console.log("API Response:", data);

      notification("success", "Country added successfully!");
      setCountry(""); // Reset input field
      fetchCountries(); // Refresh list of countries
    } catch (error) {
      notification("error", error.message || "Error adding country");
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="bg-dark rounded-3 p-3 mb-4">
      <Container>
        <Row className="align-items-center">
          <Col md={8}>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column className="col-4">
                Country Name
              </Form.Label>
              <Col className="col-8">
                <Form.Control
                  type="text"
                  placeholder="Enter country name"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                />
              </Col>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Button className="rounded-3 w-100" variant="primary" type="submit">
              Submit
            </Button>
          </Col>
        </Row>
      </Container>
    </Form>
  );
}

function CMSCountries() {
  const { setShowSidebar, setActiveMenu, setShowNavigation, setShowFooter } =
    useGlobalState();
  const [countries, setCountries] = useState([]);
  const [tableInitialized, setTableInitialized] = useState(false);

  const { cancelEdit, edit } = useEdit();
  const { notification } = useSwal();

  const fetchCountries = async () => {
    try {
      const response = await fetch("/api/cms/countriesList", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setCountries(data.countries); // Update the state with fetched countries
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  useEffect(() => {
    setShowSidebar(true);
    setActiveMenu("Countries");
    setShowNavigation(false);
    setShowFooter(false);
    fetchCountries(); // Fetch countries when the component mounts
  }, []);

  useEffect(() => {
    if (!tableInitialized && countries.length > 0) {
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
        data: countries,
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
                    onClick={() => handleDeleteCountry(no)}
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
              handleDeleteCountry(row.id);
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
      table.rows.add(countries);
      table.draw();
    }
  }, [countries, tableInitialized]);

  const handleDeleteCountry = async (id) => {
    try {
      const response = await fetch(`/api/cms/countriesList/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        notification("success", "Country deleted successfully!");
        fetchCountries();
        const table = $("#countries").DataTable();
        table.ajax.reload(); // Reload the table data
      } else {
        notification("error", "Failed to delete country!");
      }
    } catch (error) {
      notification("error", "An error occurred while deleting the country");
    }
  };

  const handleEditCountry = async () => {
    const form = document.getElementById("editForm");
    if (!form) {
      console.error("Form not found");
      return;
    }

    const formData = new FormData(form);
    const id = formData.get("id");
    const country = formData.get("name");

    if (!id) {
      notification("error", "No ID found for country");
      return;
    }

    if (!country) {
      notification("error", "Country name is required");
      return;
    }

    try {
      const response = await fetch(`/api/cms/countriesList/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: country }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        notification("error", errorData.message || "Failed to update country");
        return;
      }

      const data = await response.json();
      if (data.success) {
        notification("success", "Country updated successfully");
        fetchCountries(); // Refresh the list after editing
      } else {
        notification("error", data.message || "Failed to update country");
      }
    } catch (error) {
      notification("error", "An error occurred while updating the country");
    }
  };

  return (
    <>
      <form
        id="editForm"
        onSubmit={(event) => {
          event.preventDefault();
          handleEditCountry();
        }}
      ></form>
      <Container className="tabel">
        <h1 className="text-center mb-5">Countries</h1>
        <AddCountries fetchCountries={fetchCountries} />
        <div className="table-responsive">
          <table id="countries" className="display">
            <thead>
              <tr>
                <th>ID</th>
                <th>Country</th>
                <th>Actions</th>
              </tr>
            </thead>
          </table>
        </div>
      </Container>
    </>
  );
}

export default CMSCountries;
