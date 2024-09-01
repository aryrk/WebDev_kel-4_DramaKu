import React, { useEffect } from "react";
import $ from "jquery";
import DataTable from "datatables.net-dt";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import "../pagesStyle/Countries.css";
import { Container } from "react-bootstrap";

function CMSCountries() {
  useEffect(() => {
    // Initialize DataTable
    $("#countries").DataTable({
      pageLength: 10, // Number of rows per page
      lengthChange: true, // Allow the option to change the number of rows per page
      searching: true, // Enable search
      ordering: true, // Enable column ordering
      info: true, // Show info about the table
      paging: true, // Enable pagination
      lengthMenu: [10, 25, 50],
      autoWidth: false,
    });

    return () => {
      // Cleanup DataTable on component unmount
      $("#countries").DataTable().destroy();
    };
  }, []);

  return (
    <Container className="tabel">
      <h1 className="text-center">Countries</h1>
      <div className="table-responsive">
        <table id="countries" className="display">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Indonesia</td>
              <td>
                <div className="actions">
                  <FontAwesomeIcon icon={faEdit} className="icon" />
                  <FontAwesomeIcon icon={faTrash} className="icon" />
                </div>
              </td>
            </tr>
            <tr>
              <td>2</td>
              <td>Korea</td>
              <td>
                <div className="actions">
                  <FontAwesomeIcon icon={faEdit} className="icon" />
                  <FontAwesomeIcon icon={faTrash} className="icon" />
                </div>
              </td>
            </tr>
            <tr>
              <td>3</td>
              <td>Jepang</td>
              <td>
                <div className="actions">
                  <FontAwesomeIcon icon={faEdit} className="icon" />
                  <FontAwesomeIcon icon={faTrash} className="icon" />
                </div>
              </td>
            </tr>
            <tr>
              <td>4</td>
              <td>Thailand</td>
              <td>
                <div className="actions">
                  <FontAwesomeIcon icon={faEdit} className="icon" />
                  <FontAwesomeIcon icon={faTrash} className="icon" />
                </div>
              </td>
            </tr>
            <tr>
              <td>5</td>
              <td>Inggris</td>
              <td>
                <div className="actions">
                  <FontAwesomeIcon icon={faEdit} className="icon" />
                  <FontAwesomeIcon icon={faTrash} className="icon" />
                </div>
              </td>
            </tr>
            <tr>
              <td>6</td>
              <td>Amerika</td>
              <td>
                <div className="actions">
                  <FontAwesomeIcon icon={faEdit} className="icon" />
                  <FontAwesomeIcon icon={faTrash} className="icon" />
                </div>
              </td>
            </tr>
            <tr>
              <td>7</td>
              <td>Spanyol</td>
              <td>
                <div className="actions">
                  <FontAwesomeIcon icon={faEdit} className="icon" />
                  <FontAwesomeIcon icon={faTrash} className="icon" />
                </div>
              </td>
            </tr>
            <tr>
              <td>8</td>
              <td>India</td>
              <td>
                <div className="actions">
                  <FontAwesomeIcon icon={faEdit} className="icon" />
                  <FontAwesomeIcon icon={faTrash} className="icon" />
                </div>
              </td>
            </tr>
            <tr>
              <td>9</td>
              <td>Perancis</td>
              <td>
                <div className="actions">
                  <FontAwesomeIcon icon={faEdit} className="icon" />
                  <FontAwesomeIcon icon={faTrash} className="icon" />
                </div>
              </td>
            </tr>
            <tr>
              <td>10</td>
              <td>Rusia</td>
              <td>
                <div className="actions">
                  <FontAwesomeIcon icon={faEdit} className="icon" />
                  <FontAwesomeIcon icon={faTrash} className="icon" />
                </div>
              </td>
            </tr>
            <tr>
              <td>11</td>
              <td>Italia</td>
              <td>
                <div className="actions">
                  <FontAwesomeIcon icon={faEdit} className="icon" />
                  <FontAwesomeIcon icon={faTrash} className="icon" />
                </div>
              </td>
            </tr>
            {/* Add more rows as needed */}
          </tbody>
        </table>
      </div>
    </Container>
  );
}

export default CMSCountries;
