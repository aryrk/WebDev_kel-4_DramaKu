import React, { useEffect } from "react";
import $ from "jquery";
import DataTable from "datatables.net-dt";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import "../pagesStyle/Awards.css";
import { Container } from "react-bootstrap";

// Langkah 1: Pisahkan data ke dalam array
const awardsData = [
  { id: 1, country: "Indonesia", year: 2016, award: "Best Picture" },
  { id: 2, country: "Korea", year: 1994, award: "Best Director" },
  { id: 3, country: "Jepang", year: 2021, award: "Best Actor" },
  { id: 4, country: "Thailand", year: 2003, award: "Best Actress" },
  { id: 5, country: "Inggris", year: 1998, award: "Best Supporting Actor" },
  { id: 6, country: "Amerika", year: 2010, award: "Best Supporting Actress" },
  { id: 7, country: "Spanyol", year: 2007, award: "Best Original Screenplay" },
  { id: 8, country: "India", year: 2023, award: "Best Adapted Screenplay" },
  { id: 9, country: "Perancis", year: 1992, award: "Best Cinematography" },
  { id: 10, country: "Rusia", year: 2019, award: "Best Film Editing" },
  { id: 11, country: "Italia", year: 2005, award: "Best Production Design" },
];

function CMSAwards() {
  useEffect(() => {
    // Initialize DataTable
    $("#awards").DataTable({
      pageLength: 10, // Jumlah baris per halaman
      lengthChange: true, // Izinkan opsi untuk mengubah jumlah baris per halaman
      searching: true, // Aktifkan pencarian
      ordering: true, // Aktifkan pengurutan kolom
      info: true, // Tampilkan info tentang tabel
      paging: true, // Aktifkan pagination
      lengthMenu: [10, 25, 50],
      autoWidth: false,
    });

    return () => {
      // Cleanup DataTable saat komponen di-unmount
      $("#awards").DataTable().destroy();
    };
  }, []);

  return (
    <Container className="tabel">
      <h1 className="text-center">Awards</h1>
      <div className="table-responsive">
        <table id="awards" className="display">
          <thead>
            <tr>
              <th>ID</th>
              <th>Countries</th>
              <th>Years</th>
              <th>Awards</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {awardsData.map((award) => (
              <tr key={award.id}>
                <td>{award.id}</td>
                <td>{award.country}</td>
                <td>{award.year}</td>
                <td>{award.award}</td>
                <td>
                  <div className="actions">
                    <FontAwesomeIcon icon={faEdit} className="edit" />
                    <FontAwesomeIcon icon={faTrash} className="delete" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Container>
  );
}

export default CMSAwards;
