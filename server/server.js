const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const saltRounds = 10;
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

app.get("/api/all-movies", (req, res) => {
  // Get limit and offset from query parameters (default: limit = 10, offset = 0)
  const limit = parseInt(req.query.limit, 10) || 10; // Default to 10 movies per page
  const offset = parseInt(req.query.offset, 10) || 0; // Default to start from the first record

  // SQL query to fetch movies with pagination
  const query = `
    SELECT m.id, m.poster, m.title 
    FROM movies m 
    WHERE m.status = "accepted"
    LIMIT ? OFFSET ?
  `;

  // Execute the query with limit and offset values
  connection.query(query, [limit, offset], (err, results) => {
    if (err) {
      return res.status(500).send(err); // Handle the error
    }

    // Also fetch the total number of accepted movies for pagination calculation
    const countQuery = `SELECT COUNT(*) as total FROM movies WHERE status = "accepted"`;

    connection.query(countQuery, (err, countResult) => {
      if (err) {
        return res.status(500).send(err);
      }

      const totalMovies = countResult[0].total;

      // Send both the movies and the total number of movies
      res.json({
        movies: results, // List of movies for the current page
        total: totalMovies, // Total number of accepted movies
      });
    });
  });
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

  // const countQuery = `SELECT COUNT(*) as total FROM comments WHERE movie_id = ? and status = 'accepted'`;
  // join users and user.deleted_at is null
  const countQuery = `
  SELECT COUNT(*) as total
  FROM comments c
  LEFT JOIN users u ON c.user_id = u.id AND u.deleted_at IS NULL
  WHERE c.movie_id = ? and c.status = 'accepted' and c.deleted_at IS NULL
  `;

  const dataQuery = `
  SELECT c.*, u.username, u.profile_picture
  FROM comments c
  LEFT JOIN users u ON c.user_id = u.id AND u.deleted_at IS NULL
  WHERE c.movie_id = ? and c.status = 'accepted' and c.deleted_at IS NULL
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
  WHERE id = ? and status = 'accepted' and deleted_at IS NULL
`;

  connection.query(query, [movieId], (err, results) => {
    if (err) return res.status(500).send(err);

    res.json({ message: "Success" });
  });
});

app.get("/api/movies-search", (req, res) => {
  const search = req.query.search || ""; // Get search term from query
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = parseInt(req.query.offset, 10) || 0;

  // SQL query to search movies and join with genres
  const query = `
    SELECT m.id, m.poster, m.title, m.year, m.synopsis, m.availability, m.views, m.trailer, m.status,
           GROUP_CONCAT(g.name ORDER BY g.name ASC) AS genres
    FROM movies m
    LEFT JOIN movies_genres mg ON m.id = mg.movie_id
    LEFT JOIN genres g ON mg.genre_id = g.id
    WHERE m.status = "accepted" AND m.title LIKE ?
    GROUP BY m.id
    LIMIT ? OFFSET ?
  `;

  connection.query(query, [`%${search}%`, limit, offset], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }

    // Count total movies that match the search
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM movies 
      WHERE status = "accepted" AND title LIKE ?
    `;

    connection.query(countQuery, [`%${search}%`], (err, countResult) => {
      if (err) {
        return res.status(500).send(err);
      }

      const totalMovies = countResult[0].total;

      // Send the search results and total count
      res.json({
        movies: results, // Movies matching the search
        total: totalMovies, // Total count of movies matching the search
      });
    });
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
WHERE m.id = ? and m.status = 'accepted' and m.deleted_at IS NULL and c.deleted_at IS NULL 
GROUP BY m.id
`;

  const genresQuery = `
  SELECT g.*
  FROM genres g
  JOIN movies_genres mg ON g.id = mg.genre_id
  JOIN movies m ON mg.movie_id = m.id
  WHERE mg.movie_id = ? AND m.status = 'accepted' AND m.deleted_at IS NULL AND g.deleted_at IS NULL
`;

  const actorsQuery = `
  SELECT a.*
  FROM actors a
  JOIN movies_actors ma ON a.id = ma.actor_id
  JOIN movies m ON ma.movie_id = m.id
  WHERE ma.movie_id = ? AND m.status = 'accepted' AND m.deleted_at IS NULL AND a.deleted_at IS NULL
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

// ! ===============================================  CMS ===============================================

app.get("/api/cms/comments", (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;
  const search = req.query.search ? `%${req.query.search}%` : "%%";
  const orderColumnIndex = parseInt(req.query.order) || 0;
  const orderDir = req.query.dir === "desc" ? "DESC" : "ASC";

  const orderColumns = [
    "c.id", // 0
    "u.username", // 1
    "c.rate", // 2
    "m.title", // 3
    "c.comments", // 4
    "c.status", // 5
  ];

  const orderColumn = orderColumns[orderColumnIndex] || "c.comment_date";

  console.log(search, orderColumn, orderDir);

  const countQuery = `
    SELECT COUNT(*) as total 
    FROM comments c
    LEFT JOIN users u ON c.user_id = u.id AND u.deleted_at IS NULL
    JOIN movies m ON c.movie_id = m.id
    WHERE (u.username LIKE ? OR c.rate LIKE ? OR m.title LIKE ? OR c.comments LIKE ? or c.status LIKE ?) AND c.deleted_at IS NULL AND m.deleted_at IS NULL
  `;

  const dataQuery = `
  SELECT c.*, u.username, m.title
  FROM comments c
  LEFT JOIN users u ON c.user_id = u.id AND u.deleted_at IS NULL
  JOIN movies m ON c.movie_id = m.id
  WHERE (u.username LIKE ? OR c.rate LIKE ? OR m.title LIKE ? OR c.comments LIKE ? or c.status LIKE ?) AND c.deleted_at IS NULL AND m.deleted_at IS NULL
  ORDER BY 
  ${orderColumn} ${orderDir},
      CASE 
          WHEN c.status = 'pending' THEN 1 
          ELSE 2 
      END
  LIMIT ? OFFSET ?
`;

  connection.query(
    countQuery,
    [search, search, search, search, search],
    (err, countResult) => {
      if (err) return res.status(500).send(err);

      const totalComments = countResult[0].total;

      connection.query(
        dataQuery,
        [search, search, search, search, search, limit, offset],
        (err, dataResults) => {
          if (err) return res.status(500).send(err);

          res.json({
            comments: dataResults,
            recordsTotal: totalComments,
            recordsFiltered: totalComments,
          });
        }
      );
    }
  );
});

app.post("/api/cms/comments/action", (req, res) => {
  const { ids, action } = req.body;

  const query = `UPDATE comments SET status = ? WHERE id IN (${ids.join(
    ","
  )}) AND deleted_at IS NULL`;

  connection.query(query, [action], (err, results) => {
    if (err) return res.status(500).send(err);

    res.json({ success: true });
  });
});

app.get("/api/cms/users", (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;
  const search = req.query.search ? `%${req.query.search}%` : "%%";
  const orderColumnIndex = parseInt(req.query.order) || 0;
  const orderDir = req.query.dir === "desc" ? "DESC" : "ASC";

  const orderColumns = [
    "id", // 0
    "username", // 1
    "email", // 2
    "role", // 3
  ];

  const orderColumn = orderColumns[orderColumnIndex] || "id";

  const countQuery = `
    SELECT COUNT(*) as total 
    FROM users
    WHERE (username LIKE ? OR email LIKE ?) AND deleted_at IS NULL
  `;

  const dataQuery = `
  SELECT *
  FROM users
  WHERE (username LIKE ? OR email LIKE ?) AND deleted_at IS NULL
  ORDER BY ${orderColumn} ${orderDir}
  LIMIT ? OFFSET ?
`;

  connection.query(countQuery, [search, search], (err, countResult) => {
    if (err) return res.status(500).send(err);

    const totalUsers = countResult[0].total;

    connection.query(
      dataQuery,
      [search, search, limit, offset],
      (err, dataResults) => {
        if (err) return res.status(500).send(err);

        res.json({
          users: dataResults,
          recordsTotal: totalUsers,
          recordsFiltered: totalUsers,
        });
      }
    );
  });
});

app.delete("/api/cms/users/:id", (req, res) => {
  const userId = req.params.id;

  const query = `UPDATE users SET deleted_at = NOW() WHERE id = ?`;

  connection.query(query, [userId], (err, results) => {
    if (err) return res.status(500).send(err);

    res.json({ success: true });
  });
});

app.post("/api/cms/users", (req, res) => {
  const { username, email, role } = req.body;

  console.log(username, email, role);

  const default_password = bcrypt.hashSync("12345", saltRounds);

  const query = `INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)`;

  connection.query(
    query,
    [username, email, default_password, role],
    (err, results) => {
      if (err)
        return res
          .status(500)
          .json({ error: "Database error: Failed to create user" });

      res.json({ success: true });
    }
  );
});

app.put("/api/cms/users/:id", (req, res) => {
  const userId = req.params.id;
  const { username, email } = req.body;

  const query = `UPDATE users SET username = ?, email = ? WHERE id = ?`;

  connection.query(query, [username, email, userId], (err, results) => {
    if (err)
      return res
        .status(500)
        .json({ error: "Database error: Failed to update user" });

    res.json({ success: true });
  });
});

// ! ===============================================  CMS ===============================================

app.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
