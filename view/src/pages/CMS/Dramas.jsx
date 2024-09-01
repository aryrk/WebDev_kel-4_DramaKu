import React, { useEffect } from "react";
import $ from "jquery";
import DataTable from "datatables.net-dt";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import "../pagesStyle/Dramas.css";
import { Container } from "react-bootstrap";
import { useGlobalState } from "../../components/GlobalStateContext";

// Langkah 1: Pisahkan data ke dalam array
const dramasData = [
  {
    id: 1,
    drama: "The Outsider (2020)",
    actor: "Ben Mendelsohn",
    genre: "Crime, Drama, Mystery",
    synopsis:
      "A detective investigates a brutal murder that seems to have a supernatural element.",
    status: "Completed",
  },
  {
    id: 2,
    drama: "Avatar: The Way of Water (2022)",
    actor: "Sam Worthington, Zoe Saldana",
    genre: "Action, Adventure, Fantasy",
    synopsis:
      "Jake Sully lives with his newfound family formed on the planet of Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na'vi race to protect their planet.",
    status: "Completed",
  },
  {
    id: 3,
    drama: "Shang-Chi and the Legend of the Ten Rings (2021)",
    actor: "Simu Liu",
    genre: "Action, Adventure, Fantasy",
    synopsis:
      "Shang-Chi, the master of weaponry-based Kung Fu, is forced to confront his past after being drawn into the Ten Rings organization.",
    status: "Completed",
  },
  {
    id: 4,
    drama: "Venom: Let There Be Carnage (2021)",
    actor: "Tom Hardy",
    genre: "Action, Adventure, Fantasy",
    synopsis:
      "Eddie Brock attempts to reignite his career by interviewing serial killer Cletus Kasady, who becomes the host of the symbiote Carnage and escapes prison after a failed execution.",
    status: "Completed",
  },
  {
    id: 5,
    drama: "Fast X (2023)",
    actor: "Vin Diesel",
    genre: "Action, Adventure",
    synopsis:
      "Dom Toretto and his family are targeted by the vengeful son of drug kingpin Hernan Reyes.",
    status: "Ongoing",
  },
  {
    id: 6,
    drama: "Minions: The Rise of Gru (2022)",
    actor: "Steve Carell",
    genre: "Animation, Adventure, Comedy",
    synopsis:
      "The untold story of one twelve-year-old's dream to become the world's greatest supervillain.",
    status: "Completed",
  },
  {
    id: 7,
    drama: "Thor: Love and Thunder (2022)",
    actor: "Chris Hemsworth",
    genre: "Action, Adventure, Fantasy",
    synopsis:
      "Thor enlists the help of Valkyrie, Korg, and ex-girlfriend Jane Foster to fight Gorr the God Butcher, who intends to make the gods extinct.",
    status: "Completed",
  },
  {
    id: 8,
    drama: "Doctor Strange in the Multiverse of Madness (2022)",
    actor: "Benedict Cumberbatch",
    genre: "Action, Adventure, Fantasy",
    synopsis:
      "Doctor Strange, with the help of mystical allies old and new, traverses the mind-bending and dangerous alternate realities of the Multiverse to confront a mysterious new adversary.",
    status: "Completed",
  },
  {
    id: 9,
    drama: "Black Panther: Wakanda Forever (2022)",
    actor: "Letitia Wright",
    genre: "Action, Adventure, Drama",
    synopsis:
      "The people of Wakanda fight to protect their home from intervening world powers as they mourn the death of King T'Challa.",
    status: "Completed",
  },
  {
    id: 10,
    drama: "John Wick: Chapter 4 (2023)",
    actor: "Keanu Reeves",
    genre: "Action, Crime, Thriller",
    synopsis:
      "John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, Wick must face off against a new enemy with powerful alliances across the globe and forces that turn old friends into foes.",
    status: "Completed",
  },
];

function CMSDramas() {
  const { setShowSidebar, setActiveMenu, setShowNavigation, setShowFooter } =
    useGlobalState();

  useEffect(() => {
    setShowSidebar(true);
    setActiveMenu("Dramas");
    setShowNavigation(false);
    setShowFooter(false);
    // Initialize DataTable
    $("#dramas").DataTable({
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
      $("#dramas").DataTable().destroy();
    };
  }, []);

  return (
    <Container className="tabel">
      <h1 className="text-center">Dramas</h1>
      <div className="table-responsive">
        <table id="dramas" className="display">
          <thead>
            <tr>
              <th>ID</th>
              <th>Drama</th>
              <th>Actor</th>
              <th>Genre</th>
              <th>Synopsis</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {dramasData.map((drama) => (
              <tr key={drama.id}>
                <td>{drama.id}</td>
                <td>{drama.drama}</td>
                <td>{drama.actor}</td>
                <td>{drama.genre}</td>
                <td>{drama.synopsis}</td>
                <td>{drama.status}</td>
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

export default CMSDramas;
