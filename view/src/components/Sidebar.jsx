import React from "react";
import $ from "jquery";
import "./sidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useGlobalState } from "./GlobalStateContext";
import { withConfig } from "../Config";

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

var toggleMenu = function (self) {
  $(self).next().slideToggle();
};

const Sidebar = ({ config }) => {
  const { activeMenu, setActiveMenu } = useGlobalState();

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
    $(`.components li`).removeClass("active");
    $(`#${menu}`).addClass("active");
  };

  return (
    <nav id="sidebar" className="js-fullheight">
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
          <li id="Dramas" className="ps-4 pe-4">
            <a
              href="#homeSubmenu"
              data-toggle="collapse"
              aria-expanded="false"
              className="dropdown-toggle"
              onClick={(e) => toggleMenu(e.target)}
            >
              Dramas
            </a>
            <ul
              className={`ms-0 ${
                activeMenu === "Validate" || activeMenu === "Input New Drama"
                  ? ""
                  : "collapse"
              } list-unstyled`}
              id="homeSubmenu"
            >
              <li
                className={`ps-3 ${activeMenu === "Validate" ? "active" : ""}`}
                onClick={() => handleMenuClick("Validate")}
              >
                <a href="#">Validate</a>
              </li>
              <li
                className={`ps-3 ${
                  activeMenu === "Input New Drama" ? "active" : ""
                }`}
                onClick={() => handleMenuClick("Input New Drama")}
              >
                <a href="/cms/drama/input">Input New Drama</a>
              </li>
            </ul>
          </li>
          <li
            id="Countries"
            className={`ps-4 pe-4 ${
              activeMenu === "Countries" ? "active" : ""
            }`}
            onClick={() => handleMenuClick("Countries")}
          >
            <a href="#">Countries</a>
          </li>
          <li
            id="Awards"
            className={`ps-4 pe-4 ${activeMenu === "Awards" ? "active" : ""}`}
            onClick={() => handleMenuClick("Awards")}
          >
            <a href="#">Awards</a>
          </li>
          <li
            id="Genres"
            className={`ps-4 pe-4 ${activeMenu === "Genres" ? "active" : ""}`}
            onClick={() => handleMenuClick("Genres")}
          >
            <a href="#">Genres</a>
          </li>
          <li
            id="Actors"
            className={`ps-4 pe-4 ${activeMenu === "Actors" ? "active" : ""}`}
            onClick={() => handleMenuClick("Actors")}
          >
            <a href="/cms/actors">Actors</a>
          </li>
          <li
            id="Comments"
            className={`ps-4 pe-4 ${activeMenu === "Comments" ? "active" : ""}`}
            onClick={() => handleMenuClick("Comments")}
          >
            <a href="/cms/comments">Comments</a>
          </li>
          <li
            id="Users"
            className={`ps-4 pe-4 ${activeMenu === "Users" ? "active" : ""}`}
            onClick={() => handleMenuClick("Users")}
          >
            <a href="/cms/users">Users</a>
          </li>
          <li
            id="Logout"
            className={`ps-4 pe-4 ${activeMenu === "Logout" ? "active" : ""}`}
            onClick={() => handleMenuClick("Logout")}
          >
            <a href="#">Logout</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default withConfig(Sidebar);
