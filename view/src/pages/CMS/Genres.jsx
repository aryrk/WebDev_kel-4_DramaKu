import React, { useEffect } from "react";
import $ from "jquery";
import DataTable from "datatables.net-dt";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import "../pagesStyle/Genres.css";
import { Container } from "react-bootstrap";

// Langkah 1: Pisahkan data ke dalam array
const genresData = [
  { id: 1, genre: "Action" },
  { id: 2, genre: "Romance" },
  { id: 3, genre: "Horror" },
  { id: 4, genre: "Comedy" },
  { id: 5, genre: "Sci-Fi" },
  { id: 6, genre: "Drama" },
  { id: 7, genre: "Thriller" },
  { id: 8, genre: "Fantasy" },
  { id: 9, genre: "Adventure" },
  { id: 10, genre: "Mystery" },
  { id: 11, genre: "Documentary" },
];

function CMSGenres() {
  useEffect(() => {
    // Initialize DataTable
    $("#genres").DataTable({
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
      $("#genres").DataTable().destroy();
    };
  }, []);

  return (
    <Container className="tabel">
      <h1 className="text-center">Genres</h1>
      <div className="table-responsive">
        <table id="genres" className="display">
          <thead>
            <tr>
              <th>ID</th>
              <th>Genres</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {genresData.map((genre) => (
              <tr key={genre.id}>
                <td>{genre.id}</td>
                <td>{genre.genre}</td>
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

export default CMSGenres;
