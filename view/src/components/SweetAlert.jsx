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
  return (
    <swalFun.Provider value={{ notification }}>{children}</swalFun.Provider>
  );
};

export const useSwal = () => {
  return useContext(swalFun);
};
