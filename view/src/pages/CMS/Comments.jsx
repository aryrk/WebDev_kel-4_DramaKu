import React, { useEffect, useState } from "react";
import $ from "jquery";
import DataTable from "datatables.net-dt";
import { Button, Table } from "react-bootstrap";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import { useSwal } from "../../components/SweetAlert";

let selectedComments = [];
window.update_selected_commennt = function (checkbox, id) {
  if (checkbox.checked) {
    selectedComments.push(id);
  } else {
    selectedComments = selectedComments.filter((item) => item !== id);
  }
  console.log(selectedComments);
};

function CommentsTable() {
  const [comments, setComments] = useState([]);
  const [totalComments, setTotalComments] = useState(0);
  const [tableInitialized, setTableInitialized] = useState(false);

  const fetchComments = async (page = 1) => {
    try {
      const limit = 10;
      const offset = (page - 1) * limit;
      const response = await fetch(
        `/api/cms/comments?limit=${limit}&offset=${offset}`
      );
      const data = await response.json();
      setComments(data.comments);
      setTotalComments(data.total);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  useEffect(() => {
    if (!tableInitialized && comments.length > 0) {
      const table = $("#comments").DataTable({
        columnDefs: [
          { width: "50px", targets: 0 },
          { width: "100px", targets: 1 },
          { width: "110px", targets: 2 },
          { width: "500px", targets: 4 },
          { width: "80px", targets: 5 },
        ],
        scrollY: "60vh",
        data: comments,
        columns: [
          {
            data: "id",
            render: function (data, type, row) {
              if (row.status === "pending") {
                return `<input type="checkbox" class="form-check-input"
                onchange="update_selected_commennt(this, ${data})"
                id="comment-${data}"
               />`;
              } else {
                return ``;
              }
            },
          },
          { data: "username" },
          {
            data: "rate",
            render: function (data) {
              let activestars = "";
              for (let i = 0; i < data; i++) {
                activestars += "⭐";
              }
              let inactivestars = "";
              for (let i = data; i < 5; i++) {
                inactivestars += "⭐";
              }
              return `${activestars}<span style="filter: grayscale(100%);">${inactivestars}</span>`;
            },
          },
          { data: "title" },
          { data: "comments" },
          {
            data: "status",

            render: function (data, type, row) {
              const id = row.id;
              let badgeColor = "danger";
              if (data === "accepted") {
                badgeColor = "success";
              } else if (data === "pending") {
                badgeColor = "secondary";
              }
              return `<span id="status-${id}"
               class="badge bg-${badgeColor}">${data}</span>`;
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
          url: "/api/cms/comments",
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
            setTotalComments(json.total);
            return json.comments;
          },
        },
        drawCallback: function () {
          selectedComments.forEach((id) => {
            $(`#comment-${id}`).prop("checked", true);
          });
        },
      });
      setTableInitialized(true);
    } else if (tableInitialized) {
      const table = $("#comments").DataTable();
      table.clear();
      table.rows.add(comments);
      table.draw();
    }
  }, [comments, tableInitialized]);

  return (
    <Table responsive striped hover variant="dark" id="comments">
      <thead>
        <tr>
          <th style={{ width: "10px" }}></th>
          <th>Username</th>
          <th style={{ width: "120px" }}>Rate</th>
          <th style={{ width: "200px" }}>Drama</th>
          <th>Comments</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody></tbody>
    </Table>
  );
}

window.update_selected_comment = function (type, text) {
  selectedComments.forEach((id) => {
    $(`#status-${id}`)
      .text(text)
      .removeClass("bg-secondary")
      .removeClass("bg-danger")
      .removeClass("bg-success")
      .addClass(`bg-${type}`);

    $(`#comment-${id}`).prop("checked", false);

    selectedComments = selectedComments.filter((item) => item !== id);
  });
};

function Footer() {
  const { notification } = useSwal();

  const handleApprove = async () => {
    try {
      const response = await fetch("/api/cms/comments/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedComments }),
      });
      const data = await response.json();
      if (data.success) {
        notification("success", "Comments approved successfully!");

        update_selected_comment("success", "accepted");
      } else {
        notification("error", "Failed to approve comments!");
      }
    } catch (error) {}
  };

  const handleReject = async () => {
    try {
      const response = await fetch("/api/cms/comments/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedComments }),
      });
      const data = await response.json();
      if (data.success) {
        notification("success", "Comments rejected successfully!");

        update_selected_comment("danger", "rejected");
      } else {
        notification("error", "Failed to reject comments!");
      }
    } catch (error) {}
  };

  return (
    <div className="d-flex justify-content-start text-start">
      <div className="justify-content-start">
        <div className="w-100">
          {/* <a href="#" className="link">
            Select All
          </a> */}
        </div>
        <Button
          variant="success"
          className="mt-3 pt-2 pb-2 ms-0"
          onClick={handleApprove}
        >
          Approve
        </Button>
        <Button
          variant="danger"
          className="mt-3 ms-3 pt-2 pb-2"
          onClick={handleReject}
        >
          Reject
        </Button>
      </div>
    </div>
  );
}

const Comments = () => {
  return (
    <center className="w-100">
      <div className="inner-container w-sm-100 w-xl-90 ps-3 pe-3 ps-lg-0 pe-lg-0 mt-4 mb-4">
        <CommentsTable />
        <Footer />
      </div>
    </center>
  );
};

export default Comments;
