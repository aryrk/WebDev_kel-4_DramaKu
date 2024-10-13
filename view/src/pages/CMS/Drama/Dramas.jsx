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
import axios from "axios";
import { withConfig } from "../../../Config";

const token = sessionStorage.getItem("token");

function MoviePreview(props) {
  // const {
  //   title,
  //   alternative_titles,
  //   year,
  //   poster,
  //   synopsis,
  //   genres,
  //   rating,
  //   availability,
  //   config
  // } = movie;

  const { movie, config } = props;

  let {
    title,
    alternative_titles,
    year,
    poster,
    synopsis,
    genres,
    rating,
    availability,
  } = movie;

  let synopsis_cut = false;
  if (synopsis.length > 400) {
    synopsis_cut = true;
    synopsis = synopsis.substring(0, 400);
  }

  return (
    <center>
      <BackgroundPoster
        src={
          poster.includes("/public/uploads/")
            ? `${config.server}${poster}`
            : poster
        }
        zIndex={0}
        imgHeight="54vh"
      />

      <div className="w-sm-100 w-xl-90 ps-3 pe-3 ps-lg-0 pe-lg-0 mt-4 mb-4">
        <MovieInfo
          poster={
            poster.includes("/public/uploads/")
              ? `${config.server}${poster}`
              : poster
          }
          judul={title || "No Title Available"}
          otherTitles={
            alternative_titles
              ? alternative_titles.split(",")
              : ["No Alternative Titles"]
          }
          year={year || "Unknown Year"}
          synopsis={synopsis || "No synopsis available"}
          genres={movie.genres.map((genre) => genre.name)}
          rating={rating || "No rating"}
          availability={availability || "Unknown availability"}
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
                {movie.actors.map((actor) => (
                  // if (data.includes("/public/uploads/")) {
                  //   img = `${config.server}${data}`;
                  // }
                  <Actor
                    key={actor.id}
                    src={
                      actor.picture_profile != ""
                        ? actor.picture_profile.includes("/public/uploads/")
                          ? `${config.server}${actor.picture_profile}`
                          : actor.picture_profile
                        : "/images/empty_profile.jpg"
                    }
                    name={actor.name}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <Trailer src={movie.trailer} />
      </div>
    </center>
  );
}

// function MovieDetailModal(props) {
//   const { show, handleClose, handleShow, fullscreen } = props;

//   return (
//     <Modal
//       size="xl"
//       show={show}
//       fullscreen={fullscreen}
//       onHide={handleClose}
//       centered
//     >
//       <Modal.Header closeButton className="bg-dark text-white">
//         <center>
//           <Button className="bg_pallete_3 border-0 me-3" onClick={handleClose}>
//             Approve
//           </Button>
//           <Button variant="danger" onClick={handleClose}>
//             Delete
//           </Button>
//         </center>
//       </Modal.Header>
//       <Modal.Body className="bg-dark text-white">
//         <MoviePreview />
//       </Modal.Body>
//     </Modal>
//   );
// }

function MovieDetailModal(props) {
  const { show, handleClose, movieId, config } = props;
  const [movieDetails, setMovieDetails] = useState(null);

  useEffect(() => {
    // if (show && movieId) {
    //   axios
    //     .get(`/api/cms/moviesList/${movieId}`, {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     })
    //     .then((response) => {
    //       if (response.data.success) {
    //         setMovieDetails(response.data);
    //       } else {
    //         console.error(
    //           "Failed to fetch movie details:",
    //           response.data.message
    //         );
    //       }
    //     })
    //     .catch((error) => console.error("Error:", error));
    // } else {
    //   setMovieDetails(null);
    // }

    if (show && movieId) {
      fetch(`/api/cms/moviesList/${movieId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setMovieDetails(data);
        })
        .catch((error) => console.error("Error:", error));
    }
  }, [show, movieId]);

  const handleApprove = () => {
    axios
      .post(
        `/api/cms/moviesList/approve/${movieId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        if (response.data.success) {
          handleClose();
          window.location.reload();
        } else {
          console.error("Failed to approve movie:", response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error approving movie:", error);
      });
  };

  const handleReject = () => {
    axios
      .put(
        `/api/cms/moviesList/reject/${movieId}`,
        {
          status: "rejected",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        if (response.data.success) {
          handleClose();
          window.location.reload();
        } else {
          console.error("Failed to reject movie:", response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error rejecting movie:", error);
      });
  };

  return (
    <Modal size="xl" show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="bg-dark text-white">
        {/* Tampilkan tombol approve/reject hanya jika status bukan "accepted" atau "rejected" */}
        {movieDetails &&
          movieDetails.status !== "accepted" &&
          movieDetails.status !== "rejected" && (
            <center>
              <Button
                className="bg_pallete_3 border-0 me-3"
                onClick={handleApprove}
              >
                Approve
              </Button>
              <Button variant="danger" onClick={handleReject}>
                Delete
              </Button>
            </center>
          )}
      </Modal.Header>
      <Modal.Body className="bg-dark text-white">
        {/* Tampilkan Movie Preview atau pesan loading */}
        {movieDetails ? (
          <MoviePreview movie={movieDetails} config={config} />
        ) : (
          <p>Loading...</p>
        )}
      </Modal.Body>
    </Modal>
  );
}

function CMSDramas({ config }) {
  const { setShowSidebar, setActiveMenu, setShowNavigation, setShowFooter } =
    useGlobalState();
  const [show, setShow] = useState(false);
  const [fullscreen, setFullscreen] = useState(true);
  const [movie, setMovie] = useState([]);
  const [TotalMovies, setTotalMovies] = useState(0);
  const [tableInitialized, setTableInitialized] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const { cancelEdit, edit, last_edit } = useEdit();

  const handleClose = () => setShow(false);
  const handleShow = (breakpoint, movieId) => {
    setFullscreen(breakpoint);
    setSelectedMovieId(movieId);
    setShow(true);
  };

  const fetchMovie = async (page = 1) => {
    try {
      const limit = 10;
      const offset = (page - 1) * limit;
      const response = await fetch(
        `/api/cms/movielist?limit=${limit}&offset=${offset}`,
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
          {
            width: "80px",
            targets: 6,
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
              const hideButtons =
                row.status === "accepted" ||
                row.status === "rejected" ||
                row.inDatabase;

              return renderToString(
                <div className="d-flex justify-content-center">
                  <Button
                    variant="primary"
                    className={`mx-2 ${hideButtons ? "d-none" : ""}`} // Perbaiki penggunaan template literal untuk className
                    onClick={() => edit(no)}
                    id={`editBtn${no}`} // Perbaiki penggunaan template literal untuk id
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>
                  <Button
                    variant="success"
                    className={`d-none mx-2 ${hideButtons ? "d-none" : ""}`} // Perbaiki template literal di className
                    id={`editSaveBtn${no}`} // Perbaiki penggunaan template literal untuk id
                    form="editForm"
                    type="submit"
                  >
                    <FontAwesomeIcon icon={faSave} />
                  </Button>
                  <Button
                    variant="warning"
                    id={`cancelBtn${no}`} // Perbaiki penggunaan template literal untuk id
                    className={`d-none mx-2 ${hideButtons ? "d-none" : ""}`} // Perbaiki template literal di className
                    onClick={() => cancelEdit(no)}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </Button>
                </div>
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
          url: "/api/cms/movielist",
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
              handleShow("xl-down", row.id);
            };

            const CancelBtn = document.getElementById(`cancelBtn${row.id}`);
            CancelBtn.onclick = () => {
              cancelEdit(row.id);
            };

            const deleteBtn = document.getElementById(`deleteBtn${row.id}`);
            deleteBtn.onclick = () => {
              handleDeleteStatusMovie(row.id);
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

  const handleDeleteMovie = async (id) => {
    const movieToDelete = movies.find((movie) => movie.id === id);

    if (movieToDelete && movieToDelete.deleted_at !== null) {
      notification("error", "Movie already deleted!");
      return;
    }

    try {
      const response = await fetch(`/api/cms/movieList/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        notification("success", "Movie deleted successfully!");
        fetchMovies();
      } else {
        notification("error", "Failed to delete movie!");
      }
    } catch (error) {
      notification("error", "An error occurred while deleting the movie");
    }
  };

  const handleEditMovie = async () => {
    const form = document.getElementById("editForm");

    if (!form) {
      console.error("Form not found");
      return;
    }

    const formData = new FormData(form);
    const id = formData.get("id");
    const movieTitle = formData.get("title");
    const movieSynopsis = formData.get("synopsis");
    const moviePoster = formData.get("poster");
    const movieAlternativeTitles = formData.get("alternative_titles");
    const movieYear = formData.get("year");
    const movieAvailability = formData.get("availability");
    const movieTrailers = formData.get("trailer");
    const movieStatus = formData.get("status");
    const movieActors = formData.get("actors")?.split(",");
    const movieGenres = formData.get("genres")?.split(",");

    if (!id) {
      notification("error", "No ID found for movie");
      return;
    }

    if (
      !movieTitle &&
      !movieSynopsis &&
      !moviePoster &&
      !movieYear &&
      !movieAvailability &&
      !movieTrailers &&
      !movieStatus &&
      !movieActors &&
      !movieGenres
    ) {
      notification("error", "Movie data cannot be empty");
      return;
    }

    console.log("Data to be sent:", {
      id,
      title: movieTitle,
      synopsis: movieSynopsis,
      poster: moviePoster,
      alternative_titles: movieAlternativeTitles,
      year: movieYear,
      availability: movieAvailability,
      trailer: movieTrailers,
      status: movieStatus,
      actors: movieActors,
      genres: movieGenres,
    });

    try {
      const response = await fetch(`/api/cms/moviesList/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: movieTitle,
          synopsis: movieSynopsis,
          poster: moviePoster,
          alternative_titles: movieAlternativeTitles,
          year: movieYear,
          availability: movieAvailability,
          trailer: movieTrailers,
          status: movieStatus,
          actors: movieActors,
          genres: movieGenres,
        }),
      });

      const data = await response.json();

      console.log("Server response:", data);

      if (response.ok && data.success) {
        notification("success", "Movie updated successfully");
        fetchAwards();
        table.ajax.reload(null, false);
      } else {
        notification("error", data.message || "Failed to update movie");
      }
    } catch (error) {
      notification("error", "An error occurred while updating the movie");
    }
  };

  return (
    <>
      <MovieDetailModal
        config={config}
        show={show}
        handleClose={handleClose}
        // handleShow={handleShow}
        movieId={selectedMovieId}
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

export default withConfig(CMSDramas);
