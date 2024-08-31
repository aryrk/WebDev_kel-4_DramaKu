import React from "react";
import { useEffect } from "react";

import $ from "jquery";
import DataTable from "datatables.net-dt";
import { Button, Table } from "react-bootstrap";

import { Checkbox } from "@mui/material";

import { StarRating } from "../DetailPage";
import { useGlobalState } from "../../components/GlobalStateContext";

import "datatables.net";

import "datatables.net-dt/css/dataTables.dataTables.min.css";

function CommentsItem(props) {
  const { username, rate, drama, comments, status } = props;
  return (
    <tr>
      <td className="text-center text-light">
        <Checkbox />
      </td>
      <td>{username}</td>
      <td>
        <StarRating rating={rate} />
      </td>
      <td>{drama}</td>
      <td>{comments}</td>
      <td className="align-middle">
        <center>
          <span
            className={
              status === "Approved" ? "badge bg-success" : "badge bg-danger"
            }
            style={{ width: "80px" }}
          >
            {status}
          </span>
        </center>
      </td>
    </tr>
  );
}

function CommentsTable() {
  useEffect(() => {
    new DataTable("#comments", {
      columnDefs: [{ width: "130px", targets: 2 }],
      scrollY: "60vh",
    });

    return () => {
      $("#comments").DataTable().destroy();
    };
  }, []);
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
      <tbody>
        <CommentsItem
          username="Nara"
          rate="5"
          drama="[2024] Japan - Eye Love You"
          comments="I love this drama. It taught me a lot about money and finance. Love is not everything. We need to face the reality too. Being stoic is the best. What the most thing that I love is about the kindness. Having money is perfect."
          status="Approved"
        />
        {/* other comments */}
        <CommentsItem
          username="Aryrk"
          rate="4"
          drama="[2024] USA - The Last Dance"
          comments="Skibidi wap pap pap"
          status="Pending"
        />
        <CommentsItem
          username="Kuro"
          rate="3"
          drama="[2024] Korea - The King"
          comments="This movie is so boring. I can't stand it. I don't know why people like this movie. It's so overrated."
          status="Pending"
        />
        <CommentsItem
          username="Bob"
          rate="5"
          drama="[2024] USA - The Last Dance"
          comments="This movie is so good. I can't stand it. I don't know why people like this movie. It's so overrated."
          status="Pending"
        />
        <CommentsItem
          username="Bob"
          rate="5"
          drama="[2024] USA - The Last Dance"
          comments="This movie is so good. I can't stand it. I don't know why people like this movie. It's so overrated."
          status="Pending"
        />
        <CommentsItem
          username="Bob"
          rate="5"
          drama="[2024] USA - The Last Dance"
          comments="This movie is so good. I can't stand it. I don't know why people like this movie. It's so overrated."
          status="Pending"
        />
        <CommentsItem
          username="Bob"
          rate="5"
          drama="[2024] USA - The Last Dance"
          comments="This movie is so good. I can't stand it. I don't know why people like this movie. It's so overrated."
          status="Pending"
        />
        <CommentsItem
          username="Bob"
          rate="5"
          drama="[2024] USA - The Last Dance"
          comments="This movie is so good. I can't stand it. I don't know why people like this movie. It's so overrated."
          status="Pending"
        />
        <CommentsItem
          username="Bob"
          rate="5"
          drama="[2024] USA - The Last Dance"
          comments="This movie is so good. I can't stand it. I don't know why people like this movie. It's so overrated."
          status="Pending"
        />
        <CommentsItem
          username="Bob"
          rate="5"
          drama="[2024] USA - The Last Dance"
          comments="This movie is so good. I can't stand it. I don't know why people like this movie. It's so overrated."
          status="Pending"
        />
        <CommentsItem
          username="Bob"
          rate="5"
          drama="[2024] USA - The Last Dance"
          comments="This movie is so good. I can't stand it. I don't know why people like this movie. It's so overrated."
          status="Pending"
        />
        <CommentsItem
          username="Bob"
          rate="5"
          drama="[2024] USA - The Last Dance"
          comments="This movie is so good. I can't stand it. I don't know why people like this movie. It's so overrated."
          status="Pending"
        />
        <CommentsItem
          username="Bob"
          rate="5"
          drama="[2024] USA - The Last Dance"
          comments="This movie is so good. I can't stand it. I don't know why people like this movie. It's so overrated."
          status="Pending"
        />
        <CommentsItem
          username="Bob"
          rate="5"
          drama="[2024] USA - The Last Dance"
          comments="This movie is so good. I can't stand it. I don't know why people like this movie. It's so overrated."
          status="Pending"
        />
        <CommentsItem
          username="Bob"
          rate="5"
          drama="[2024] USA - The Last Dance"
          comments="This movie is so good. I can't stand it. I don't know why people like this movie. It's so overrated."
          status="Pending"
        />
      </tbody>
    </Table>
  );
}

function Footer() {
  return (
    <div className="d-flex justify-content-start text-start">
      <div className="justify-content-start">
        <div className="w-100">
          <a href="#" className="link">
            Select All
          </a>
        </div>
        <Button variant="primary" className="mt-3 pt-2 pb-2 ms-0">
          Approve
        </Button>
        <Button variant="danger" className="mt-3 ms-3 pt-2 pb-2">
          Delete
        </Button>
      </div>
    </div>
  );
}

const Comments = () => {
  const { setShowSidebar, setActiveMenu, setShowNavigation, setShowFooter } =
    useGlobalState();
  useEffect(() => {
    setShowSidebar(true);
    setActiveMenu("Comments");
    setShowNavigation(false);
    setShowFooter(false);
  }, [setShowSidebar]);
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
