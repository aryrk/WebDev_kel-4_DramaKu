import Swal from 'sweetalert2';
import React, { createContext, useContext, useState } from "react";

const swalFun = createContext();

export const swalProvider = ({ children }) => {
    // swal with timer on top left of the screen, small size
    const notification = (icon, title) => {
        Swal.fire({
            position: 'top-end',
            icon: icon,
            title: title,
            showConfirmButton: false,
            timer: 1500
        })
    }
    return (
        <swalFun.Provider value={{ notification }}>
            {children}
        </swalFun.Provider>
    )
}

export const useSwal = () => {
    return useContext(swalFun);
}