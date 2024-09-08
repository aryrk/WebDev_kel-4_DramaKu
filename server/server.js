const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");
app.use(cors());
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

  const countQuery = `SELECT COUNT(*) as total FROM comments WHERE movie_id = ? and status = 'accepted'`;
  const dataQuery = `
  SELECT c.*, u.username, u.profile_picture
  FROM comments c
  JOIN users u ON c.user_id = u.id
  WHERE c.movie_id = ? and c.status = 'accepted'
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
  const { userId, rate, comments } = req.body;
  const movieId = req.params.movieId;

  const query =
    "INSERT INTO comments (movie_id, user_id, rate, comments, comment_date) VALUES (?, ?, ?, ?, NOW())";
  connection.query(
    query,
    [movieId, userId, rate, comments],
    (error, result) => {
      if (error) {
        return res.status(500).json({ error: "Database error" });
      }
      res.json({
        comment: {
          id: result.insertId,
          userId: userId,
          rate: rate,
          comments: comments,
          comment_date: new Date(),
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
  WHERE id = ? and status = 'accepted'
`;

  connection.query(query, [movieId], (err, results) => {
    if (err) return res.status(500).send(err);

    res.json({ message: "Success" });
  });
});

app.get("/api/movie-details/:id", (req, res) => {
  const movieId = req.params.id;

  //   const movieQuery = `
  // SELECT m.*, c.name AS country_name, AVG(cm.rate) AS rating
  // FROM movies m
  // JOIN countries c ON m.countries_id = c.id
  // LEFT JOIN comments cm ON m.id = cm.movie_id
  // WHERE m.id = ?
  // `;

  // fix movieQuery, its not working if there is no comment
  const movieQuery = `
SELECT m.*, c.name AS country_name, IFNULL(AVG(cm.rate), 0) AS rating
FROM movies m
JOIN countries c ON m.countries_id = c.id
LEFT JOIN comments cm ON m.id = cm.movie_id
WHERE m.id = ? and m.status = 'accepted'
GROUP BY m.id
`;

  const genresQuery = `
  SELECT g.*
  FROM genres g
  JOIN movies_genres mg ON g.id = mg.genre_id
  JOIN movies m ON mg.movie_id = m.id
  WHERE mg.movie_id = ? AND m.status = 'accepted'
`;

  const actorsQuery = `
  SELECT a.*
  FROM actors a
  JOIN movies_actors ma ON a.id = ma.actor_id
  JOIN movies m ON ma.movie_id = m.id
  WHERE ma.movie_id = ? AND m.status = 'accepted'
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

app.get("/api/cms/comments", (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;

  const countQuery = "SELECT COUNT(*) as total FROM comments";
  const dataQuery = `
    SELECT c.*, u.username, m.title
    FROM comments c
    JOIN users u ON c.user_id = u.id
    JOIN movies m ON c.movie_id = m.id
    ORDER BY c.comment_date DESC , c.status ASC
    LIMIT ? OFFSET ?
  `;

  connection.query(countQuery, (err, countResult) => {
    if (err) return res.status(500).send(err);

    const totalComments = countResult[0].total;

    connection.query(dataQuery, [limit, offset], (err, dataResults) => {
      if (err) return res.status(500).send(err);

      res.json({ comments: dataResults, total: totalComments });
    });
  });
});

app.post("/api/cms/comments/approve", (req, res) => {
  const { ids } = req.body;

  const query = `UPDATE comments SET status = 'accepted' WHERE id IN (${ids.join(
    ","
  )})`;

  connection.query(query, (err, results) => {
    if (err) return res.status(500).send(err);

    res.json({ success: true });
  });
});

app.post("/api/cms/comments/reject", (req, res) => {
  const { ids } = req.body;

  const query = `UPDATE comments SET status = 'rejected' WHERE id IN (${ids.join(
    ","
  )})`;

  connection.query(query, (err, results) => {
    if (err) return res.status(500).send(err);

    res.json({ success: true });
  });
});

app.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
