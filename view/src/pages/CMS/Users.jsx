import React, { useState } from "react";
import { renderToString } from "react-dom/server";
import { useEffect } from "react";

import $ from "jquery";
import DataTable from "datatables.net-dt";
import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";

import { faSave, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useGlobalState } from "../../components/GlobalStateContext";
import { useEdit } from "../../components/cmsEdit";

import "datatables.net";

import "datatables.net-dt/css/dataTables.dataTables.min.css";

function AddUser() {
  return (
    <Form className="bg-dark rounded-3 p-3 d-flex justify-content-start text-start mb-4">
      <Container className="w-100 w-md-100 w-lg-75 m-auto m-md-0">
        <Row>
          <Col>
            <Form.Group
              as={Row}
              className="mb-3"
              controlId="formPlaintextEmail"
            >
              <Form.Label column sm="3" md="4" lg="3">
                Username
              </Form.Label>
              <Col sm="9" md="8" lg="9">
                <Form.Control className="bg-black border-0 text-light" />
              </Col>
            </Form.Group>

            <Form.Group
              as={Row}
              className="mb-3"
              controlId="formPlaintextPassword"
            >
              <Form.Label column sm="3" md="4" lg="3">
                Email
              </Form.Label>
              <Col sm="9" md="8" lg="9">
                <Form.Control
                  placeholder="email"
                  className="bg-black border-0 text-light"
                />
              </Col>
            </Form.Group>
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

// handle delete user function
const handleDeleteUser = async (id) => {
  try {
    const response = await fetch(`/api/cms/users/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    if (data.success) {
      notification("success", "User deleted successfully!");
      fetchUsers();
    } else {
      notification("error", "Failed to delete user!");
    }
  } catch (error) {}
};

function UserTable() {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [tableInitialized, setTableInitialized] = useState(false);
  const { cancelEdit, edit, last_edit } = useEdit();

  const fetchUsers = async (page = 1) => {
    try {
      const limit = 10;
      const offset = (page - 1) * limit;
      const response = await fetch(
        `/api/cms/users?limit=${limit}&offset=${offset}`
      );
      const data = await response.json();
      setUsers(data.users);
      setTotalUsers(data.total);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!tableInitialized && users.length > 0) {
      // new DataTable("#actors", {
      const table = $("#actors").DataTable({
        columnDefs: [
          { width: "60px", targets: 0 },
          { width: "330px", targets: 3 },
        ],
        scrollY: "45vh",
        data: users,
        columns: [
          {
            render: function (data, type, row, meta) {
              // return `<span>${meta.row + 1}</span>`;
              // times pages
              return `<span>${
                meta.row + 1 + meta.settings._iDisplayStart
              }</span>`;
            },
          },
          {
            data: "username",
          },
          {
            data: "email",
          },
          {
            render: function (data, type, row) {
              const no = row.id;
              return renderToString(
                <center>
                  <a href="#" className="me-2 link">
                    Send first email
                  </a>
                  |
                  <Button
                    variant="primary"
                    className="ms-2 me-2"
                    id={`editBtn${no}`}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>
                  <Button
                    variant="success"
                    className="ms-2 me-2 d-none"
                    id={`editSaveBtn${no}`}
                    form="editForm"
                  >
                    <FontAwesomeIcon icon={faSave} />
                  </Button>
                  |
                  <Button
                    variant="danger"
                    className="ms-2"
                    id={`deleteBtn${no}`}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                  <Button
                    variant="danger"
                    className="ms-2 d-none"
                    id={`cancelBtn${no}`}
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
          url: "/api/cms/users",
          type: "GET",
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
            return json.users;
          },
        },
        drawCallback: function () {
          // loop for each row, add id on each row
          // <tr id={no}>
          const table = $("#actors").DataTable();
          table.rows().every(function (rowIdx, tableLoop, rowLoop) {
            const row = this.node();
            row.id = table.row(row).data().id;

            // add Onlick on edit button
            const editBtn = document.getElementById(`editBtn${row.id}`);
            editBtn.onclick = () => {
              edit(row.id);
            };

            const CancelBtn = document.getElementById(`cancelBtn${row.id}`);
            CancelBtn.onclick = () => {
              cancelEdit(row.id);
            };
          });
        },
      });
      setTableInitialized(true);
    } else if (tableInitialized) {
      const table = $("#actors").DataTable();
      table.clear();
      table.rows.add(users);
      table.draw();
    }
  }, [users, tableInitialized]);
  return (
    <>
      <form id="editForm"></form>
      <Table responsive striped hover variant="dark" id="actors">
        <thead>
          <tr>
            <th className="text-center">#</th>
            <th>Username</th>
            <th>Email</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
      </Table>
    </>
  );
}

const Users = () => {
  const { setShowSidebar, setActiveMenu, setShowNavigation, setShowFooter } =
    useGlobalState();
  useEffect(() => {
    setShowSidebar(true);
    setActiveMenu("Users");
    setShowNavigation(false);
    setShowFooter(false);
  }, [setShowSidebar]);
  return (
    <center className="w-100">
      <div className="inner-container w-sm-100 w-xl-90 ps-3 pe-3 ps-lg-0 pe-lg-0 mt-4 mb-4">
        <AddUser />
        <UserTable />
      </div>
    </center>
  );
};

export default Users;
