const express = require("express");
const app = express();
const mysql = require("mysql2");
app.use(express.json());

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

app.get("/api/get-movies-poster/:limit", (req, res) => {
  const limit = req.params.limit;
  const query = `SELECT movies.poster FROM movies ORDER BY created_at DESC LIMIT ${limit}`;
  connection.query(query, (err, results) => {
    if (err) return res.status(500).send(err);

    res.json(results);
  });
});

app.get("/api/movies/comments/:id", (req, res) => {
  const movieId = req.params.id;
  const limit = parseInt(req.query.limit) || 3;
  const offset = parseInt(req.query.offset) || 0;

  const countQuery = `SELECT COUNT(*) as total FROM comments WHERE movie_id = ?`;
  const dataQuery = `
  SELECT c.*
  FROM comments c
  WHERE c.movie_id = ?
  LIMIT ? OFFSET ?
  `;

  connection.query(countQuery, [movieId], (err, countResult) => {
    if (err) return res.status(500).send(err);

    const totalComments = countResult[0].total;

    connection.query(
      dataQuery,
      [movieId, limit, offset],
      (err, dataResults) => {
        if (err) return res.status(500).send(err);

        res.json({ comments: dataResults, total: totalComments });
      }
    );
  });
});

app.post("/api/movies/comments/:movieId", (req, res) => {
  const { username, rate, comments, profile_picture } = req.body;
  const movieId = req.params.movieId;

  const query =
    "INSERT INTO comments (movie_id, username, rate, comments, comment_date, profile_picture) VALUES (?, ?, ?, ?, NOW(), ?)";
  connection.query(
    query,
    [movieId, username, rate, comments, profile_picture],
    (error, result) => {
      if (error) {
        return res.status(500).json({ error: "Database error" });
      }
      res.json({
        comment: {
          id: result.insertId,
          username: username,
          rate: rate,
          comments: comments,
          comment_date: new Date(),
          profile_picture: profile_picture,
        },
      });
    }
  );
});

app.post("/api/movies/update-view-count/:id", (req, res) => {
  const movieId = req.params.id;

  const query = `
  UPDATE movies
  SET views = views + 1
  WHERE id = ?
`;

  connection.query(query, [movieId], (err, results) => {
    if (err) return res.status(500).send(err);

    res.json({ message: "Success" });
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

  connection.query(movieQuery, [movieId], (err, movieResults) => {
    if (err) return res.status(500).send(err);

    const movie = movieResults[0];

    connection.query(genresQuery, [movieId], (err, genresResults) => {
      if (err) return res.status(500).send(err);

      connection.query(actorsQuery, [movieId], (err, actorsResults) => {
        if (err) return res.status(500).send(err);

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
