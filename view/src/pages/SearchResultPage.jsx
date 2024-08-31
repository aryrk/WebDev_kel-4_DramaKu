import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useGlobalState } from "../components/GlobalStateContext";

const SearchResultPage = () => {
  const { setShowNavigation, setShowFooter } = useGlobalState();

  useEffect(() => {
    setShowNavigation(true);
    setShowFooter(true);
  }, [setShowNavigation]);
  return (
    <>
      <section className="py-5 text-wheat">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-4 font-weight-bold">
              Searched/Tagged with "outsider"
            </h2>
          </div>

          <div className="row justify-content-end">
            <div className="col-6 mb-4">
              <div className="d-flex align-items-start">
                <img
                  className="img-fluid rounded"
                  src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/action-mistery-movie-poster-design-template-2ec690d65c22aa12e437d765dbf7e4af_screen.jpg?ts=1680854635"
                  alt="Blog 1"
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                  }}
                />
                <div className="ms-3">
                  <h5 className="mb-1">The Outsider</h5>
                  <p className=" mb-1">2020</p>
                  <p className=" mb-1">Crime, Drama, Horror</p>
                  <p className=" mb-1">
                    Ben Mendelsohn • Bill Camp • Jeremy Bobb
                  </p>
                  <p className="">100 views</p>
                </div>
              </div>
            </div>

            <div className="col-6 mb-4">
              <div className="d-flex align-items-start">
                <img
                  className="img-fluid rounded"
                  src="https://m.media-amazon.com/images/M/MV5BMjAxMjUxMjAzOF5BMl5BanBnXkFtZTgwNjQzOTc4NDM@._V1_.jpg"
                  alt="Blog 2"
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                  }}
                />
                <div className="ms-3">
                  <h5 className="mb-1">The Outsider</h5>
                  <p className=" mb-1">2022</p>
                  <p className=" mb-1">Action, Crime, Drama</p>
                  <p className=" mb-1">
                    Jared Leto • Tadanobu Asano • Kippei Shîna
                  </p>
                  <p className="">78 views</p>
                </div>
              </div>
            </div>

            <div className="col-6 mb-4">
              <div className="d-flex align-items-start">
                <img
                  className="img-fluid rounded"
                  src="https://m.media-amazon.com/images/M/MV5BMTIzMjczMjg3M15BMl5BanBnXkFtZTcwODkxMDk0MQ@@._V1_FMjpg_UX1000_.jpg"
                  alt="Blog 1"
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                  }}
                />
                <div className="ms-3">
                  <h5 className="mb-1">The Outsider</h5>
                  <p className=" mb-1">2022</p>
                  <p className=" mb-1">Drama, Romance, Westem</p>
                  <p className=" mb-1">
                    Tim Daly • Naomi Watts • Keith Carradine
                  </p>
                  <p className="">39 views</p>
                </div>
              </div>
            </div>
            <div className="col-6 mb-4">
              <div className="d-flex align-items-start">
                <img
                  className="img-fluid rounded"
                  src="https://m.media-amazon.com/images/M/MV5BY2E4Njk4N2UtZWFhOS00NzczLWFmNDgtMzdhMjFlNTZjMmVhL2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_QL75_UX190_CR0,4,190,281_.jpg"
                  alt="Blog 1"
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                  }}
                />
                <div className="ms-3">
                  <h5 className="mb-1">The Outsiders</h5>
                  <p className=" mb-1">1983</p>
                  <p className=" mb-1">Teen Drama, Crime, Drama</p>
                  <p className=" mb-1">
                    C. Thomas Howell • Matt Dillon • Ralph Macchio
                  </p>
                  <p className="">19 views</p>
                </div>
              </div>
            </div>
            <div className="col-6 mb-4">
              <div className="d-flex align-items-start">
                <img
                  className="img-fluid rounded"
                  src="https://m.media-amazon.com/images/M/MV5BMTQwNDMxMDc2NF5BMl5BanBnXkFtZTgwNzk5MTI5MDE@._V1_QL75_UX190_CR0,2,190,281_.jpg"
                  alt="Blog 1"
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                  }}
                />
                <div className="ms-3">
                  <h5 className="mb-1">The Outsider</h5>
                  <p className="mb-1">2014</p>
                  <p className="mb-1">Action, Adventure, Crime</p>
                  <p className="mb-1">
                    Craig Fairbrass • James Caan • Jason Patric
                  </p>
                  <p className="">18 views</p>
                </div>
              </div>
            </div>
            <div className="col-6 mb-4">
              <div className="d-flex align-items-start">
                <img
                  className="img-fluid rounded"
                  src="https://i.mydramalist.com/0wxjQ4_4f.jpg"
                  alt="Blog 1"
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                  }}
                />
                <div className="ms-3">
                  <h5 className="mb-1">The Outsider</h5>
                  <p className=" mb-1">2023</p>
                  <p className=" mb-1">Drama</p>
                  <p className=" mb-1">Yuqi Zhang • Weiguang Gao • Shi Shi</p>
                  <p className="">9 views</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SearchResultPage;
