import React from "react";
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

function User(props) {
  const { no, username, email } = props;
  const { cancelEdit, edit } = useEdit();

  return (
    <tr id={no}>
      <td className="text-center">{no}</td>
      <td>{username}</td>
      <td>{email}</td>
      <td className="align-middle text-center">
        <center>
          <a href="#" className="me-2 link">
            Send first email
          </a>
          |
          <Button
            variant="primary"
            className="ms-2 me-2"
            id={`editBtn${no}`}
            onClick={() => edit(no)}
          >
            <FontAwesomeIcon icon={faEdit} />
          </Button>
          <Button
            variant="success"
            className="ms-2 me-2 d-none"
            id={`editSaveBtn${no}`}
          >
            <FontAwesomeIcon icon={faSave} />
          </Button>
          |
          <Button variant="danger" className="ms-2" id={`deleteBtn${no}`}>
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
      </td>
    </tr>
  );
}

function UserTable() {
  useEffect(() => {
    new DataTable("#actors", {
      columnDefs: [
        { width: "60px", targets: 0 },
        { width: "330px", targets: 3 },
      ],
      scrollY: "45vh",
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
        <User no="1" username="Aryrk" email="emailku@gmail.com" />
        <User no="2" username="Saepul" email="saepul@gmail.com" />
        <User no="3" username="Jamal" email="jamal@gmail.com" />
        <User no="3" username="Jamal" email="jamal@gmail.com" />
        <User no="3" username="Jamal" email="jamal@gmail.com" />
        <User no="3" username="Jamal" email="jamal@gmail.com" />
        <User no="3" username="Jamal" email="jamal@gmail.com" />
        <User no="3" username="Jamal" email="jamal@gmail.com" />
        <User no="3" username="Jamal" email="jamal@gmail.com" />
        <User no="3" username="Jamal" email="jamal@gmail.com" />
        <User no="3" username="Jamal" email="jamal@gmail.com" />
        <User no="3" username="Jamal" email="jamal@gmail.com" />
        <User no="3" username="Jamal" email="jamal@gmail.com" />
        <User no="3" username="Jamal" email="jamal@gmail.com" />
        <User no="3" username="Jamal" email="jamal@gmail.com" />
        <User no="3" username="Jamal" email="jamal@gmail.com" />
        <User no="3" username="Jamal" email="jamal@gmail.com" />
        <User no="3" username="Jamal" email="jamal@gmail.com" />
        <User no="3" username="Jamal" email="jamal@gmail.com" />
        <User no="3" username="Jamal" email="jamal@gmail.com" />
        <User no="3" username="Jamal" email="jamal@gmail.com" />
        <User no="3" username="Jamal" email="jamal@gmail.com" />
        <User no="3" username="Jamal" email="jamal@gmail.com" />
        <User no="3" username="Jamal" email="jamal@gmail.com" />
        <User no="3" username="Jamal" email="jamal@gmail.com" />
        <User no="3" username="Jamal" email="jamal@gmail.com" />
        <User no="3" username="Jamal" email="jamal@gmail.com" />
        <User no="3" username="Jamal" email="jamal@gmail.com" />
        <User no="3" username="Jamal" email="jamal@gmail.com" />
        <User no="3" username="Jamal" email="jamal@gmail.com" />
        <User no="3" username="Jamal" email="jamal@gmail.com" />
        <User no="3" username="Jamal" email="jamal@gmail.com" />
        <User no="3" username="Jamal" email="jamal@gmail.com" />
        <User no="3" username="Jamal" email="jamal@gmail.com" />
        <User no="3" username="Jamal" email="jamal@gmail.com" />
        <User no="3" username="Jamal" email="jamal@gmail.com" />
      </tbody>
    </Table>
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
