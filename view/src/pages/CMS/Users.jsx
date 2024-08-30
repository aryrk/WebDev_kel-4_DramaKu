import React from "react";
import { useEffect } from "react";

import $ from "jquery";
import DataTable from "datatables.net-dt";
import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";

import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useSidebar } from "../../components/SidebarContext";

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

function User(props) {
  // const { no, country, actorName, birthDate, src } = props;
  return (
    <tr>
      <td className="text-center">1</td>
      <td>Username</td>
      <td>Email</td>
      <td className="align-middle text-center">
        <center>
          <a href="#" className="me-2 link">
            Send first email
          </a>
          |
          <Button variant="primary" className="ms-2 me-2">
            <FontAwesomeIcon icon={faEdit} />
          </Button>
          |
          <Button variant="danger" className="ms-2">
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </center>
      </td>
    </tr>
  );
}

function UserTable() {
  useEffect(() => {
    new DataTable("#actors", {
      columnDefs: [
        { width: "60px", targets: 0 },
        { width: "300px", targets: 3 },
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
          <th>Username</th>
          <th>Email</th>
          <th className="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <User />
      </tbody>
    </Table>
  );
}

const Users = () => {
  const { setShowSidebar } = useSidebar();
  useEffect(() => {
    setShowSidebar(true);
  }, [setShowSidebar]);
  return (
    <center>
      <div className="w-sm-100 w-xl-75 ps-3 pe-3 ps-lg-0 pe-lg-0 mt-4 mb-4">
        <AddUser />
        <UserTable />
      </div>
    </center>
  );
};

export default Users;
