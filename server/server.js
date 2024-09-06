const express = require("express");
const app = express();
const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "plutocinema",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting: " + err.stack);
    return;
  }
  console.log("Connected as id " + connection.threadId);
});

app.get("/api/movies/comments/:id", (req, res) => {
  const movieId = req.params.id;

  const query = `
  SELECT c.*
  FROM comments c
  WHERE c.movie_id = ?
`;

  connection.query(query, [movieId], (err, results) => {
    if (err) return res.status(500).send(err);

    res.json(results);
  });
});

app.get("/api/movie-details/:id", (req, res) => {
  const movieId = req.params.id;

  const movieQuery = `
  SELECT m.*, c.name AS country_name
  FROM movies m
  JOIN countries c ON m.countries_id = c.id
  WHERE m.id = ?
`;

  const genresQuery = `
  SELECT g.*
  FROM genres g
  JOIN movies_genres mg ON g.id = mg.genre_id
  WHERE mg.movie_id = ?
`;

  const actorsQuery = `
  SELECT a.*
  FROM actors a
  JOIN movies_actors ma ON a.id = ma.actor_id
  WHERE ma.movie_id = ?
`;

  // Ambil data film
  connection.query(movieQuery, [movieId], (err, movieResults) => {
    if (err) return res.status(500).send(err);

    const movie = movieResults[0]; // Ambil film pertama (asumsi hanya satu film)

    // Ambil data genres
    connection.query(genresQuery, [movieId], (err, genresResults) => {
      if (err) return res.status(500).send(err);

      // Ambil data actors
      connection.query(actorsQuery, [movieId], (err, actorsResults) => {
        if (err) return res.status(500).send(err);

        // Gabungkan hasil
        res.json({
          ...movie,
          genres: genresResults,
          actors: actorsResults,
        });
      });
    });
  });
});

app.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
