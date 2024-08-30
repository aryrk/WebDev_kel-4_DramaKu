import React, { createContext, useContext, useState } from "react";
import $ from "jquery";
import "./sidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { withConfig } from "../Config";

const SidebarActiveContext = createContext();

var fullHeight = function () {
  $(".js-fullheight").css("height", $(window).height());
  $(window).resize(function () {
    $(".js-fullheight").css("height", $(window).height());
  });
};
fullHeight();

var toggleAside = function () {
  $("#sidebar").toggleClass("active");
  if ($(window).width() < 992) {
    $("#content").toggleClass("sidebar-content");
  } else {
    if (!$("#content").hasClass("sidebar-content")) {
      $("#content").addClass("sidebar-content");
    }
  }
  $(".inner-container").toggleClass("w-xl-90");
  $(".inner-container").toggleClass("w-xl-75");
};

const Sidebar = ({ config }) => {
  const [ActiveMenu, setActiveMenu] = useState("");

  $({ ActiveMenu }).addClass("active");

  return (
    <nav id="sidebar">
      <div className="custom-menu">
        <button
          type="button"
          id="sidebarCollapse"
          onClick={() => toggleAside()}
          className="btn btn-primary"
        >
          <FontAwesomeIcon icon={faBars} />
          <span className="sr-only">Toggle Menu</span>
        </button>
      </div>
      <div className="ps-0 pe-0 pt-5">
        <h2>
          <a href="index.html" className="logo ps-4 pe-4">
            {config.short_name}
          </a>
        </h2>
        <ul className="list-unstyled components mb-5">
          <li className="ps-4 pe-4" id="Dramas">
            <a href="#">Dramas</a>
          </li>
          <li className="ps-4 pe-4">
            <a href="#">Countries</a>
          </li>
          <li className="ps-4 pe-4">
            <a href="#">Awards</a>
          </li>
          <li className="ps-4 pe-4">
            <a href="#">Genres</a>
          </li>
          <li className="ps-4 pe-4">
            <a href="#">Actors</a>
          </li>
          <li className="ps-4 pe-4">
            <a href="#">Comments</a>
          </li>
          <li className="ps-4 pe-4">
            <a href="#">Users</a>
          </li>
          <li className="ps-4 pe-4">
            <a href="#">Logout</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};
export function ActiveMenu() {
  return useContext(SidebarActiveContext);
}

export default withConfig(Sidebar);
