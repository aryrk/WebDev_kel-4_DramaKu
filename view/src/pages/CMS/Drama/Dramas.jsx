import React, { useState, useEffect } from "react";
import $ from "jquery";
import DataTable from "datatables.net-dt";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faSave,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import "../../pagesStyle/Dramas.css";
import {
  Container,
  Button,
  Modal,
  Image,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import { useGlobalState } from "../../../components/GlobalStateContext";
import { Actor, BackgroundPoster, MovieInfo, Trailer } from "../../DetailPage";
import { useEdit } from "../../../components/cmsEdit";
import { useSwal } from "../../../components/SweetAlert";
import { renderToString } from "react-dom/server";

const token = sessionStorage.getItem("token");

function MoviePreview() {
  return (
    <center>
      <BackgroundPoster
        src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/action-mistery-movie-poster-design-template-2ec690d65c22aa12e437d765dbf7e4af_screen.jpg?ts=1680854635"
        zIndex={0}
        imgHeight="54vh"
      />

      <div className="w-sm-100 w-xl-90 ps-3 pe-3 ps-lg-0 pe-lg-0 mt-4 mb-4">
        <MovieInfo
          poster="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/action-mistery-movie-poster-design-template-2ec690d65c22aa12e437d765dbf7e4af_screen.jpg?ts=1680854635"
          judul="The OUTSIDER"
          otherTitles={["The OUTSIDER", "B"]}
          year="2024"
          synopsis="Synopsis sometimes unhelpful. I don't read it throughly. But what helps me is the henres. I need to see the genres and actors. That is what i want."
          genres={["Gendre 1", "Gendre 2", "Gendre 3"]}
          rating="3.5"
          availability="Fansub bla bla"
        />

        <div
          className="container-fluid mt-4 p-0"
          style={{ overflow: "hidden" }}
        >
          <div className="row">
            <div className="col-12 p-0">
              <div
                className="justify-content-center"
                style={{ whiteSpace: "nowrap", overflowX: "scroll" }}
              >
                <Actor
                  src="https://m.media-amazon.com/images/M/MV5BMjA3NzcyMDcyMF5BMl5BanBnXkFtZTcwNjQwMTczMQ@@._V1_.jpg"
                  name="Ben Mendelsohn"
                />
                <Actor
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz8Yx4CXaaAUDw_hLZSz7AojAoVahex0PKAg&s"
                  name="Bill Camp"
                />
                <Actor
                  src="https://m.media-amazon.com/images/M/MV5BYzk2ZTQwNTgtZTAxMy00ZTY3LTlkZTctMWE1NTNkNTk1MjA4XkEyXkFqcGdeQXVyMjQwMDg0Ng@@._V1_QL75_UY207_CR86,0,140,207_.jpg"
                  name="Jeremy bobb"
                />
                <Actor
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX3Ihna-KxO6oHbpPpANr5gFIqsjKnQ7W3kQ&s"
                  name="mare winningham"
                />
                <Actor
                  src="https://m.media-amazon.com/images/M/MV5BNDU1ODIxMzgyMF5BMl5BanBnXkFtZTYwMTU1NzE1._V1_FMjpg_UX1000_.jpg"
                  name="paddy considine"
                />
                <Actor
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4Y0zsQI4X3znM-wlz57c8NOFjSkQPRbJ8Yw&s"
                  name="yul vazquez"
                />
                <Actor
                  src="https://m.media-amazon.com/images/M/MV5BMjM1NDk3MTQ1N15BMl5BanBnXkFtZTgwMDMwODEyMDE@._V1_.jpg"
                  name="julianne nicholson"
                />
                <Actor
                  src="https://m.media-amazon.com/images/M/MV5BZTVhOTg1ZWMtNDVlMC00M2YwLThiZjMtMTgxOWU1ZTk4ZjQ3XkEyXkFqcGdeQXVyNDM5MjI4OA@@._V1_FMjpg_UX1000_.jpg"
                  name="marc menchaca"
                />
                <Actor
                  src="https://m.media-amazon.com/images/M/MV5BMTcyMTI3NzI1Nl5BMl5BanBnXkFtZTgwNjQ3Njk2NjM@._V1_.jpg"
                  name="cynthia erivo"
                />
                <Actor
                  src="https://m.media-amazon.com/images/M/MV5BMjI2MzA0ODYyMV5BMl5BanBnXkFtZTgwNzU0NTEyNzE@._V1_.jpg"
                  name="derek cecil"
                />
                <Actor
                  src="https://m.media-amazon.com/images/M/MV5BMTQyOTEyNTE3M15BMl5BanBnXkFtZTcwNjYyODUzMQ@@._V1_FMjpg_UX1000_.jpg"
                  name="hettienne park"
                />
                <Actor
                  src="https://m.media-amazon.com/images/M/MV5BYTgzZWUyOTItZjMwNy00NjhiLWIzMGEtZjFjMDdlNDM3YTZhXkEyXkFqcGdeQXVyOTc3ODMwODk@._V1_.jpg"
                  name="scarlett blum"
                />
                <Actor
                  src="https://m.media-amazon.com/images/M/MV5BYzg2Mzc5NjEtYjY5My00YWFhLWFjZTYtYTM0MmZkZDE5YzZlXkEyXkFqcGdeQXVyNjk2Nzg2MTE@._V1_FMjpg_UX1000_.jpg"
                  name="summer fontana"
                />
                <Actor
                  src="https://m.media-amazon.com/images/M/MV5BMTMwOTQ0MDUyNF5BMl5BanBnXkFtZTcwNTQ1MzY1Mw@@._V1_.jpg"
                  name="jason baterman"
                />
              </div>
            </div>
          </div>
        </div>

        <Trailer src="https://youtu.be/eNDKWr3Xmjk" />
      </div>
    </center>
  );
}

function MovieDetailModal(props) {
  const { show, handleClose, handleShow, fullscreen } = props;

  return (
    <Modal
      size="xl"
      show={show}
      fullscreen={fullscreen}
      onHide={handleClose}
      centered
    >
      <Modal.Header closeButton className="bg-dark text-white">
        <center>
          <Button className="bg_pallete_3 border-0 me-3" onClick={handleClose}>
            Approve
          </Button>
          <Button variant="danger" onClick={handleClose}>
            Delete
          </Button>
        </center>
      </Modal.Header>
      <Modal.Body className="bg-dark text-white">
        <MoviePreview />
      </Modal.Body>
    </Modal>
  );
}

// const dramasData = [
//   {
//     id: 1,
//     drama: "The Outsider (2020)",
//     actor: "Ben Mendelsohn",
//     genre: "Crime, Drama, Mystery",
//     synopsis:
//       "A detective investigates a brutal murder that seems to have a supernatural element.",
//     status: "Completed",
//   },
//   {
//     id: 2,
//     drama: "Avatar: The Way of Water (2022)",
//     actor: "Sam Worthington, Zoe Saldana",
//     genre: "Action, Adventure, Fantasy",
//     synopsis:
//       "Jake Sully lives with his newfound family formed on the planet of Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na'vi race to protect their planet.",
//     status: "Completed",
//   },
//   {
//     id: 3,
//     drama: "Shang-Chi and the Legend of the Ten Rings (2021)",
//     actor: "Simu Liu",
//     genre: "Action, Adventure, Fantasy",
//     synopsis:
//       "Shang-Chi, the master of weaponry-based Kung Fu, is forced to confront his past after being drawn into the Ten Rings organization.",
//     status: "Completed",
//   },
//   {
//     id: 4,
//     drama: "Venom: Let There Be Carnage (2021)",
//     actor: "Tom Hardy",
//     genre: "Action, Adventure, Fantasy",
//     synopsis:
//       "Eddie Brock attempts to reignite his career by interviewing serial killer Cletus Kasady, who becomes the host of the symbiote Carnage and escapes prison after a failed execution.",
//     status: "Completed",
//   },
//   {
//     id: 5,
//     drama: "Fast X (2023)",
//     actor: "Vin Diesel",
//     genre: "Action, Adventure",
//     synopsis:
//       "Dom Toretto and his family are targeted by the vengeful son of drug kingpin Hernan Reyes.",
//     status: "Ongoing",
//   },
//   {
//     id: 6,
//     drama: "Minions: The Rise of Gru (2022)",
//     actor: "Steve Carell",
//     genre: "Animation, Adventure, Comedy",
//     synopsis:
//       "The untold story of one twelve-year-old's dream to become the world's greatest supervillain.",
//     status: "Completed",
//   },
//   {
//     id: 7,
//     drama: "Thor: Love and Thunder (2022)",
//     actor: "Chris Hemsworth",
//     genre: "Action, Adventure, Fantasy",
//     synopsis:
//       "Thor enlists the help of Valkyrie, Korg, and ex-girlfriend Jane Foster to fight Gorr the God Butcher, who intends to make the gods extinct.",
//     status: "Completed",
//   },
//   {
//     id: 8,
//     drama: "Doctor Strange in the Multiverse of Madness (2022)",
//     actor: "Benedict Cumberbatch",
//     genre: "Action, Adventure, Fantasy",
//     synopsis:
//       "Doctor Strange, with the help of mystical allies old and new, traverses the mind-bending and dangerous alternate realities of the Multiverse to confront a mysterious new adversary.",
//     status: "Completed",
//   },
//   {
//     id: 9,
//     drama: "Black Panther: Wakanda Forever (2022)",
//     actor: "Letitia Wright",
//     genre: "Action, Adventure, Drama",
//     synopsis:
//       "The people of Wakanda fight to protect their home from intervening world powers as they mourn the death of King T'Challa.",
//     status: "Completed",
//   },
//   {
//     id: 10,
//     drama: "John Wick: Chapter 4 (2023)",
//     actor: "Keanu Reeves",
//     genre: "Action, Crime, Thriller",
//     synopsis:
//       "John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, Wick must face off against a new enemy with powerful alliances across the globe and forces that turn old friends into foes.",
//     status: "Completed",
//   },
// ];

function CMSDramas() {
  const { setShowSidebar, setActiveMenu, setShowNavigation, setShowFooter } =
    useGlobalState();

  const [show, setShow] = useState(false);
  const [fullscreen, setFullscreen] = useState(true);

  const [movie, setMovie] = useState([]);
  const [TotalMovies, setTotalMovies] = useState(0);
  const [tableInitialized, setTableInitialized] = useState(false);

  const { cancelEdit, edit, last_edit } = useEdit();

  const handleClose = () => setShow(false);
  const handleShow = (breakpoint) => {
    setFullscreen(breakpoint);
    setShow(true);
  };

  const fetchMovie = async (page = 1) => {
    try {
      const limit = 10;
      const offset = (page - 1) * limit;
      const response = await fetch(
        `/api/cms/moviesList?limit=${limit}&offset=${offset}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      setMovie(data.movies);
      console.log(movie);
      setTotalMovies(data.total);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchMovie();
  }, []);

  useEffect(() => {
    setShowSidebar(true);
    setActiveMenu("Movies");
    setShowNavigation(false);
    setShowFooter(false);
  }, []);

  useEffect(() => {
    if (!tableInitialized && movie.length > 0) {
      new DataTable("#movies", {
        scrollY: "45vh",
        columnDefs: [
          {
            width: "50px",
            targets: 0,
          },
          {
            width: "80px",
            targets: 1,
          },
          {
            width: "80px",
            targets: 2,
          },
          {
            width: "80px",
            targets: 3,
          },
          {
            width: "100px",
            targets: 4,
          },
          {
            width: "50px",
            targets: 5,
          },
        ],
        data: movie,
        columns: [
          {
            render: function (data, type, row, meta) {
              return `<span>${
                meta.row + 1 + meta.settings._iDisplayStart
              }</span>`;
            },
          },
          {
            data: "title",
            render: (data) => {
              return `<span name="title">${data}</span>`;
            },
          },
          {
            data: "actors",
            render: (data) => {
              return `<span name="actors">${data}</span>`;
            },
          },
          {
            data: "genres",
            render: (data) => {
              return `<span name="genres">${data}</span>`;
            },
          },
          {
            data: "synopsis",
            render: (data) => {
              return `<span name="sysnopsis">${data}</span>`;
            },
          },
          {
            data: "status",
            render: (data) => {
              return `<span name="status">${data}</span>`;
            },
          },
          {
            render: function (data, type, row, meta) {
              const no = row.id;

              return renderToString(
                <center>
                  <Button
                    variant="primary"
                    className="mb-3 mb-sm-4"
                    onClick={() => edit(no)}
                    id={`editBtn${no}`}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>
                  <Button
                    variant="success"
                    className="mb-3 mb-sm-4 d-none"
                    id={`editSaveBtn${no}`}
                    form="editForm"
                    type="submit"
                  >
                    <FontAwesomeIcon icon={faSave} />
                  </Button>
                  <br></br>
                  <Button variant="danger" id={`deleteBtn${no}`}>
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                  <Button
                    variant="warning"
                    id={`cancelBtn${no}`}
                    className="d-none"
                    onClick={() => cancelEdit(no)}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </Button>
                </center>
              );
            },
          },
        ],
        destroy: true,
        paging: true,
        searching: true,
        ordering: true,
        serverSide: true,
        processing: true,
        ajax: {
          url: "/api/cms/moviesList",
          type: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: function (d) {
            const limit = d.length;
            const offset = d.start;
            const searchValue = d.search.value;
            const orderColumn = d.order[0].column;
            const orderDir = d.order[0].dir;

            return {
              limit: limit,
              offset: offset,
              search: searchValue,
              page: offset / limit + 1,
              order: orderColumn,
              dir: orderDir,
            };
          },
          dataSrc: function (json) {
            return json.movies;
          },
        },
        drawCallback: function () {
          const table = $("#movies").DataTable();
          table.rows().every(function (rowIdx, tableLoop, rowLoop) {
            const row = this.node();
            row.id = table.row(row).data().id;

            const editBtn = document.getElementById(`editBtn${row.id}`);
            editBtn.onclick = () => {
              edit(row.id);
            };

            const CancelBtn = document.getElementById(`cancelBtn${row.id}`);
            CancelBtn.onclick = () => {
              cancelEdit(row.id);
            };

            const deleteBtn = document.getElementById(`deleteBtn${row.id}`);
            deleteBtn.onclick = () => {
              handleDeleteUser(row.id);
            };

            const tds = row.getElementsByTagName("td");
            for (let i = 1; i < tds.length - 1; i++) {
              const td = tds[i];
              const innerElement = td.firstChild;
              const name = innerElement.getAttribute("name");
              td.setAttribute("name", name);

              try {
                const old = innerElement.getAttribute("old");
                td.setAttribute("old", old);
              } catch {}

              try {
                const list = innerElement.getAttribute("list");
                td.setAttribute("list", list);
              } catch {}
            }
          });
        },
      });
      setTableInitialized(true);
    } else if (tableInitialized) {
      const table = $("#movies").DataTable();
      table.clear();
      table.rows.add(movie);
      table.draw();
    }
  }, [movie, tableInitialized]);

  return (
    <>
      <MovieDetailModal
        show={show}
        handleClose={handleClose}
        handleShow={handleShow}
        fullscreen={fullscreen}
      />
      <Container className="tabel">
        <h1 className="text-center">Movies</h1>
        <div className="table-responsive">
          <table id="movies" className="display">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Actors</th>
                <th>Genres</th>
                <th>Synopsis</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {/* {dramasData.map((drama) => (
                <tr key={drama.id}>
                  <td>{drama.id}</td>
                  <td>{drama.drama}</td>
                  <td>{drama.actor}</td>
                  <td>{drama.genre}</td>
                  <td>{drama.synopsis}</td>
                  <td>{drama.status}</td>
                  <td>
                    <div className="actions">
                      <Button
                        onClick={() => handleShow("xl-down")}
                        className="bg-transaparent border-0"
                      >
                        <FontAwesomeIcon icon={faEdit} className="edit" />
                      </Button>
                      <FontAwesomeIcon icon={faTrash} className="delete" />
                    </div>
                  </td>
                </tr>
              ))} */}
            </tbody>
          </table>
        </div>
      </Container>
    </>
  );
}

export default CMSDramas;
