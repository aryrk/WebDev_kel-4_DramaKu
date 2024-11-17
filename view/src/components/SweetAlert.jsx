import Swal from "sweetalert2";
import React, { createContext, useContext, useState } from "react";

const swalFun = createContext();

export const SwalProvider = ({ children }) => {
  const notification = (icon, title) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: icon,
      title: title,
      showConfirmButton: false,
      timer: 4000,
      timerProgressBar: true,
      background: "#1c1c1c",
      color: "#fff",
    });
  };

  const alert = (icon, title, text = "") => {
    var validate_color = "#ff0000";
    switch (icon) {
      case "error":
        validate_color = "#ff0000";
        break;
      case "success":
        validate_color = "#a5dc86";
        break;
      case "warning":
        validate_color = "#ffcc00";
        break;
      case "info":
        validate_color = "#00ccff";
        break;
      default:
        validate_color = "#a5dc86";
        break;
    }

    Swal.fire({
      icon: icon,
      title: title,
      text: text,
      background: "#1c1c1c",
      confirmButtonColor: validate_color,
      color: "#fff",
    });
  };

  const confirmation_action = (
    icon,
    title,
    text,
    confirmButtonText,
    callback
  ) => {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      background: "#1c1c1c",
      color: "#fff",
      confirmButtonText: confirmButtonText,
    }).then((result) => {
      if (result.isConfirmed) {
        callback();
      }
    });
  };

  return (
    <swalFun.Provider value={{ notification, alert, confirmation_action }}>
      {children}
    </swalFun.Provider>
  );
};

export const useSwal = () => {
  return useContext(swalFun);
};
