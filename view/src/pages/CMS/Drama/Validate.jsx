import React, { useEffect, useState } from "react";
import { useGlobalState } from "../../../components/GlobalStateContext";
import { Button, Modal, Image } from "react-bootstrap";
import { Actor, BackgroundPoster, MovieInfo, Trailer } from "../../DetailPage";

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

const Validate = () => {
  const { setShowSidebar, setActiveMenu, setShowNavigation, setShowFooter } =
    useGlobalState();
  useEffect(() => {
    setShowSidebar(true);
    setActiveMenu("Input New Drama");
    setShowNavigation(false);
    setShowFooter(false);
  }, [setShowSidebar]);

  const [show, setShow] = useState(false);
  const [fullscreen, setFullscreen] = useState(true);

  const handleClose = () => setShow(false);
  function handleShow(breakpoint) {
    setFullscreen(breakpoint);
    setShow(true);
  }

  return (
    <div>
      <MovieDetailModal
        show={show}
        handleClose={handleClose}
        handleShow={handleShow}
        fullscreen={fullscreen}
      />
      <Button variant="primary" onClick={() => handleShow("xl-down")}>
        Launch demo modal
      </Button>
    </div>
  );
};

export default Validate;
