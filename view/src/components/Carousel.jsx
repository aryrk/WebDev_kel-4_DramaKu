"use client";

import React, { useEffect, useState } from "react";
import { Carousel } from "flowbite-react";
import { useGlobalState } from "../components/GlobalStateContext";
import { withConfig } from "../Config";

function MovieCarousel({ config }) {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    // Fetch movies for the carousel
    fetch(`/api/all-movies?limit=5`,{
      mode: "cors",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }) // Fetch 5 movies for the carousel
      .then((response) => response.json())
      .then((data) => {
        setMovies(data.movies);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  return (
    <div className="h-56 sm:h-64 xl:h-80 2xl:h-96">
      <Carousel slideInterval={5000}>
        {movies.length > 0 ? (
          movies.map((movie, index) => (
            <img
              key={index}
              src={
                movie.poster.includes("/public/uploads/")
                  ? `${config.server}${movie.poster}`
                  : movie.poster
              }
              alt={movie.title}
            />
          ))
        ) : (
          <img
            src="https://flowbite.com/docs/images/carousel/carousel-1.svg"
            alt="Loading..."
          />
        )}
      </Carousel>
    </div>
  );
}

export default withConfig(MovieCarousel);
