import React, { createContext, useContext, useState } from "react";

const EditContext = createContext();

export const EditProvider = ({ children }) => {
  const [last_edit, setLastEdit] = useState(null);

  const cancelEdit = (id) => {
    const tr = document.getElementById(id);
    const tds = tr.getElementsByTagName("td");
    for (let i = 1; i < tds.length - 1; i++) {
      const td = tds[i];
      const name = td.getAttribute("name");
      if (name === "img") {
        const input = td.getElementsByTagName("input")[0];
        input.remove();
      } else {
        if (name === "undefined") {
          continue;
        } else {
          td.innerHTML = td
            .getElementsByTagName("input")[0]
            .getAttribute("old");
        }
      }
    }

    tr.getElementsByTagName("input")[0].remove();

    const editBtn = document.getElementById(`editBtn${id}`);
    const editSaveBtn = document.getElementById(`editSaveBtn${id}`);
    const deleteBtn = document.getElementById(`deleteBtn${id}`);
    const cancelBtn = document.getElementById(`cancelBtn${id}`);
    editBtn.classList.remove("d-none");
    editSaveBtn.classList.add("d-none");
    deleteBtn.classList.remove("d-none");
    cancelBtn.classList.add("d-none");

    setLastEdit(null);
  };

  const edit = (id) => {
    if (last_edit !== null) {
      cancelEdit(last_edit);
    }
    setLastEdit(id);
    const tr = document.getElementById(id);
    const tds = tr.getElementsByTagName("td");
    for (let i = 1; i < tds.length - 1; i++) {
      const td = tds[i];
      const value = td.innerText;
      const name = td.getAttribute("name");
      if (name === "img") {
        td.innerHTML =
          td.innerHTML +
          `<input type="file" name="${name}"
          form="editForm"
          onchange="document.getElementById('img${id}').src = window.URL.createObjectURL(this.files[0])"
          class="form-control">`;
      } else {
        if (name === "undefined") {
          continue;
        } else {
          var type = "text";
          if (name === "date") {
            type = "date";
          }
          td.innerHTML = `<input type="${type}" required
          value="${value}" name="${name}" old="${value}" class="form-control"
          form="editForm"
          >`;
        }
      }
    }

    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("name", "id");
    input.setAttribute("value", id);
    input.setAttribute("readOnly", true);
    input.setAttribute("hidden", true);
    input.setAttribute("form", "editForm");
    tr.appendChild(input);

    const editBtn = document.getElementById(`editBtn${id}`);
    const editSaveBtn = document.getElementById(`editSaveBtn${id}`);
    const deleteBtn = document.getElementById(`deleteBtn${id}`);
    const cancelBtn = document.getElementById(`cancelBtn${id}`);
    editBtn.classList.add("d-none");
    editSaveBtn.classList.remove("d-none");
    deleteBtn.classList.add("d-none");
    cancelBtn.classList.remove("d-none");
  };

  return (
    <EditContext.Provider value={{ last_edit, cancelEdit, edit }}>
      {children}
    </EditContext.Provider>
  );
};

export const useEdit = () => useContext(EditContext);
