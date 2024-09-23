const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const path = require("path");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const saltRounds = 10;
const passport = require("passport");
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { google } = require("googleapis");
require("dotenv").config();
app.use(cors());
app.use(express.json());

const port = 5000;
const domain = "http://localhost:" + port;

const client_domain = "http://localhost:5173";

const oAuth2Client = new google.auth.OAuth2(
  process.env.EMAIL_CLIENT_ID,
  process.env.EMAIL_CLIENT_SECRET,
  client_domain + "/auth/google/callback"
);

const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const fs = require("fs");
const dir = "./public/uploads";
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });
const deleteFile = (filename) => {
  fs.unlink(filename, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
};

app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await new Promise((resolve, reject) => {
          connection.query(
            "SELECT * FROM users WHERE google_id = ?",
            [profile.id],
            (error, results) => {
              if (error) return reject(error);
              resolve(results[0]);
            }
          );
        });

        if (existingUser) {
          return done(null, existingUser);
        }

        const newUser = {
          google_id: profile.id,
          username: profile.displayName,
          email: profile.emails[0].value,
          profile_picture: profile.photos[0].value,
        };

        connection.query(
          "INSERT INTO users (google_id, username, email, profile_picture, is_verified) VALUES (?, ?, ?, ?, ?)",
          [
            newUser.google_id,
            newUser.username,
            newUser.email,
            newUser.profile_picture,
            true,
          ],
          (error, results) => {
            if (error) return done(error);
            newUser.id = results.insertId;
            done(null, newUser);
          }
        );
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static("public"));

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
const accessToken = oAuth2Client.getAccessToken();
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.EMAIL_CLIENT_ID,
    clientSecret: process.env.EMAIL_CLIENT_SECRET,
    refreshToken: REFRESH_TOKEN,
    accessToken: accessToken.token,
  },
});

const email_template = (username, email, header_text, header, inner) => {
  return `
  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="x-apple-disable-message-reformatting" />
    <title></title>
    <!-- Web Font / @font-face : BEGIN -->

    <!--[if mso]>
      <style>
        * {
          font-family: sans-serif !important;
        }
      </style>
    <![endif]-->

    <!--[if !mso]><!-->
    <link
      href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,600,700"
      rel="stylesheet"
      type="text/css"
    />
    <!--<![endif]-->

    <!-- Web Font / @font-face : END -->

    <!-- CSS Reset -->
    <style>
      html,
      body {
        font-size: 15px;
        font-weight: 300;
        letter-spacing: 0.03em;
        margin: 0 auto !important;
        padding: 0 !important;
        height: 100% !important;
        width: 100% !important;
        color: #fff;
        background: #0d253f;
      }

      * {
        font-weight: 300;
        font-size: 15px;
        color: #fff;
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%;
      }

      a {
        color: #fff;
      }

      div[style*="margin: 16px 0"] {
        margin: 0 !important;
      }

      table,
      td {
        mso-table-lspace: 0pt !important;
        mso-table-rspace: 0pt !important;
      }

      table {
        border-spacing: 0 !important;
        border-collapse: collapse !important;
        table-layout: fixed !important;
        margin: 0 auto !important;
      }

      table table table {
        table-layout: auto;
      }

      img {
        -ms-interpolation-mode: bicubic;
      }

      *[x-apple-data-detectors] {
        color: #fff !important;
        text-decoration: none !important;
      }

      .x-gmail-data-detectors,
      .x-gmail-data-detectors *,
      .aBn {
        color: #fff !important;
        border-bottom: 0 !important;
        cursor: default !important;
      }

      .x-gmail-data-detectors a:hover {
        cursor: pointer !important;
      }

      .a6S {
        display: none !important;
        opacity: 0.01 !important;
      }

      img.g-img + div {
        display: none !important;
      }

      .button-link {
        text-decoration: none !important;
      }

      @media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
        /* iPhone 6 and 6+ */
        .email-container {
          min-width: 375px !important;
        }
      }

      table.email-container tr td:last-child ul,
      table.email-container tr td:last-child p {
        margin-bottom: 0;
      }
    </style>

    <!--[if gte mso 9]>
      <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG />
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
    <![endif]-->

    <!-- Progressive Enhancements -->
    <style>
      body,
      h1,
      h2,
      h3,
      h4,
      h5,
      h6,
      p,
      a,
      ul {
        font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont,
          Helvetica, Arial, sans-serif;
      }

      .button-td,
      .button-a {
        transition: all 100ms ease-in;
      }

      .button-td:hover,
      .button-a:hover {
        background: #01b4e4 !important;
        border-color: #01b4e4 !important;
      }

      @media screen and (max-width: 480px) {
        .fluid {
          width: 100% !important;
          max-width: 100% !important;
          height: auto !important;
          margin-left: auto !important;
          margin-right: auto !important;
        }

        .stack-column,
        .stack-column-center {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
        }

        .stack-column-center {
          text-align: center !important;
        }

        .center-on-narrow {
          text-align: left !important;
          display: block !important;
          margin-left: auto !important;
          margin-right: auto !important;
          float: none !important;
        }

        table.center-on-narrow {
          display: inline-block !important;
        }
      }
    </style>
  </head>
  <body
    width="100%"
    bgcolor="#141414"
    style="background: #141414; margin: 0; mso-line-height-rule: exactly"
  >
    <center
      style="width: 100%; background: #141414; text-align: left"
      bgcolor="#141414"
    >
      <!-- Visually Hidden Preheader Text : BEGIN -->
      <div
        style="
          display: none;
          font-size: 1px;
          line-height: 1px;
          max-height: 0px;
          max-width: 0px;
          opacity: 0;
          overflow: hidden;
          mso-hide: all;
          font-family: sans-serif;
        "
      >
        ${header_text}
      </div>
      <!-- Visually Hidden Preheader Text : END -->

      <div style="max-width: 680px; margin: auto" class="email-container">
        <!--[if mso]>
        <table bgcolor="#0d253f" role="presentation" aria-hidden="true" cellspacing="0" cellpadding="0" border="0" width="680" align="center">
            <tr>
                <td valign="top">
        <![endif]-->

        <!-- Email Header : BEGIN -->
        <table
          role="presentation"
          aria-hidden="true"
          cellspacing="0"
          cellpadding="0"
          border="0"
          align="center"
          width="100%"
          style="max-width: 680px"
        >
          <tr>
            <td
              style="
                padding-top: 30px;
                padding-left: 20px;
                padding-right: 20px;
                text-align: left;
              "
            >
              <img
                style="display: block"
                src="https://i.ibb.co.com/7zzSQ3N/logo.png"
                aria-hidden="true"
                height="58"
                border="0"
              />
            </td>
          </tr>
        </table>
        <!-- Email Header : END -->

        <!-- Email Body : BEGIN -->
        <table
          class="email-container"
          role="presentation"
          aria-hidden="true"
          cellspacing="0"
          cellpadding="0"
          border="0"
          align="center"
          width="100%"
          style="max-width: 680px"
        >
          <!-- Email Body : BEGIN -->
          <tr>
            <td>
              <table
                role="presentation"
                aria-hidden="true"
                cellspacing="0"
                cellpadding="0"
                border="0"
                width="100%"
              >
                <tbody>
                  <tr>
                    <td
                      style="
                        padding: 40px 20px 0 20px;
                        text-align: left;
                        font-family: 'Source Sans Pro', -apple-system,
                          BlinkMacSystemFont, Helvetica, Arial, sans-serif;
                        color: #fff;
                      "
                    >
                      <h2
                        style="
                          font-size: 20px;
                          font-weight: 700;
                          letter-spacing: 0.08em;
                          margin: 0 0 8px 0;
                          color: #fff;
                        "
                      >
                        Hi ${username}!
                      </h2>
                      <hr
                        style="
                          text-align: left;
                          margin: 0px;
                          width: 40px;
                          height: 3px;
                          color: #525c91;
                          background-color: #525c91;
                          border-radius: 4px;
                          border: none;
                        "
                      />

                      <p style="font-size: 15px; font-weight: 300; color: #fff">
                        ${header}
                      </p>

                      ${inner}

                      <p style="font-size: 15px; font-weight: 300; color: #fff">
                        As a friendly reminder, your account details are:
                      </p>

                      <ul>
                        <li style="color: #fff">Username: ${username}</li>
                        <li style="color: #fff">
                          Email:
                          <a
                            style="color: #fff"
                            href="mailto:${email}"
                            >${email}</a
                          >
                        </li>
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Email Body : END -->
        </table>
        <!-- Email Body : END -->

        <!-- Email Footer : BEGIN -->
        <table
          class="email-container"
          role="presentation"
          aria-hidden="true"
          cellspacing="0"
          cellpadding="0"
          border="0"
          align="center"
          width="100%"
          style="max-width: 680px"
        >
          <tr>
            <td style="padding: 30px 20px 30px 20px">
              <hr
                style="
                  color: #fff;
                  height: 1px;
                  border: 0;
                  background-color: #fff;
                "
              />
            </td>
          </tr>
          <tr>
            <td
              style="
                padding: 0 20px 40px 20px;
                width: 100%;
                font-size: 13px;
                font-family: 'Source Sans Pro', Arial, sans-serif;
                text-align: left;
                color: #fff;
              "
              class="x-gmail-data-detectors"
            >
              <p style="margin: 0; padding: 0; font-size: 13px">
                You are receiving this email because you are a registered user
                on
                <a
                  style="font-size: 13px; color: #fff"
                  href="${client_domain}"
                  >${client_domain}"</a
                >.
              </p>
            </td>
          </tr>
        </table>
        <!-- Email Footer : END -->

        <!--[if mso]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </div>
    </center>
  </body>
</html>

  `;
};

// ! ===============================================  Auth ===============================================
const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.status(403).json({ message: "Access denied" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ message: "Invalid token" });
    }
  };
};

app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    username,
    email,
    password: hashedPassword,
  };

  connection.query("INSERT INTO users SET ?", newUser, (error, results) => {
    if (error)
      return res.status(500).json({ message: "Error registering user" });

    const token = jwt.sign({ id: results.insertId }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const confirmUrl = `${domain}/api/confirm-email?token=${token}`;

    transporter.sendMail({
      to: email,
      subject: "Confirm Your Email",
      // html: `<a href="${confirmUrl}">Confirm your email</a>`,
      html: email_template(
        username,
        email,
        `Hi ${username}! We need to confirm your email address in order to activate
        your account.`,
        `Thanks for signing up to Pluto Cinema. Before we can
                        continue, we need to validate your email address.`,
        `<p style="margin: 40px 0; color: #fff">
                        <a
                          style="
                            color: #fff;
                            border-radius: 20px;
                            border: 10px solid #525c91;
                            background-color: #525c91;
                            padding: 0 10px;
                            text-transform: uppercase;
                            text-decoration: none;
                            font-weight: 700;
                          "
                          href="${confirmUrl}"
                          >Activate My Account</a
                        >
                      </p>`
      ),
    });

    res.json({
      message: "Registration successful. Please check your email to confirm.",
    });
  });
});

app.get("/api/confirm-email", async (req, res) => {
  const { token } = req.query;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    connection.query(
      "UPDATE users SET is_verified = ? WHERE id = ?",
      [true, decoded.id],
      (error) => {
        if (error)
          return res.status(500).json({ message: "Error confirming email" });

        const redirectUrl = `${client_domain}/email-confirmed`;
        res.redirect(redirectUrl);
      }
    );
  } catch (err) {
    res.status(400).json({ message: "Invalid or expired token." });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  connection.query(
    "SELECT * FROM users WHERE email = ? or username = ?",
    [email, email],
    async (error, results) => {
      if (error) return res.status(500).json({ message: "Error logging in" });
      if (results.length === 0)
        return res.status(401).json({ message: "User not found" });

      const user = results[0];
      if (!user.is_verified)
        return res.status(401).json({ message: "Email not verified" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(401).json({ message: "Invalid credentials" });

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );
      res.json({ token });
    }
  );
});

// app.post("/api/forgot-password", async (req, res) => {
//   const { email } = req.body;

//   connection.query(
//     "SELECT * FROM users WHERE email = ?",
//     [email],
//     (error, results) => {
//       if (error)
//         return res.status(500).json({ message: "Error fetching user" });
//       if (results.length === 0)
//         return res.status(404).json({ message: "User not found" });

//       const user = results[0];
//       const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
//         expiresIn: "1h",
//       });
//       const resetUrl = `${domain}/reset-password?token=${token}`;

//       transporter.sendMail({
//         to: email,
//         subject: "Reset Your Password",
//         html: `<a href="${resetUrl}">Reset your password</a>`,
//       });

//       res.json({ message: "Password reset link sent to your email." });
//     }
//   );
// });

// app.post("/api/reset-password", async (req, res) => {
//   const { token, newPassword } = req.body;
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const hashedPassword = await bcrypt.hash(newPassword, 10);

//     connection.query(
//       "UPDATE users SET password = ? WHERE id = ?",
//       [hashedPassword, decoded.id],
//       (error) => {
//         if (error)
//           return res.status(500).json({ message: "Error updating password" });
//         res.json({ message: "Password updated successfully" });
//       }
//     );
//   } catch (err) {
//     res.status(400).json({ message: "Invalid or expired token." });
//   }
// });

// ! ===============================================  Auth ===============================================
// ! ===============================================  Auth Google ===============================================
app.get(
  "/api/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user.id, username: req.user.username, role: req.user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.redirect(`${client_domain}/login?token=${token}`);
  }
);

// ! ===============================================  Auth Google ===============================================

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

app.post(
  "/api/movies/comments/:movieId",
  authorize(["admin", "writer"]),
  (req, res) => {
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
  }
);

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
  const country = req.query.country || "";
  const genre = req.query.genre || "";
  const year = req.query.year || "";
  const award = req.query.award || "";

  var title_query = "";
  if (search !== "all") {
    title_query = `AND m.title LIKE "%${search}%"`;
  }
  var country_query = "";

  if (country !== "all") {
    country_query = `AND c.name = '${country}'`;
  }

  var genre_query = "";
  if (genre !== "all") {
    genre_query = `AND g.name = '${genre}'`;
  }

  var year_query = "";
  if (year !== "all") {
    year_query = `AND m.year = '${year}'`;
  }

  var award_query = "";
  if (award !== "all") {
    award_query = `AND a.name = '${award}'`;
  }

  // SQL query to search movies and join with genres
  var query = `
    SELECT m.id, m.poster, m.title, m.year, m.synopsis, m.availability, m.views, m.trailer, m.status,
           GROUP_CONCAT(g.name ORDER BY g.name ASC) AS genres
    FROM movies m
    LEFT JOIN movies_genres mg ON m.id = mg.movie_id
    LEFT JOIN genres g ON mg.genre_id = g.id
    LEFT JOIN countries c ON m.id = c.id
    LEFT JOIN movies_awards ma ON m.id = ma.movie_id
    LEFT JOIN awards a ON ma.award_id = a.id
    WHERE m.status = "accepted"
    `;
  query =
    query +
    `${title_query} ${country_query} ${year_query} ${genre_query} ${award_query} `;

  query =
    query +
    `GROUP BY m.id
    LIMIT ? OFFSET ?
  `;

  connection.query(
    query,
    [limit, offset],

    (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }

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
    }
  );
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

app.get("/api/cms/comments", authorize(["admin"]), (req, res) => {
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

app.post("/api/cms/comments/action", authorize(["admin"]), (req, res) => {
  const { ids, action } = req.body;

  const query = `UPDATE comments SET status = ? WHERE id IN (${ids.join(
    ","
  )}) AND deleted_at IS NULL`;

  connection.query(query, [action], (err, results) => {
    if (err) return res.status(500).send(err);

    res.json({ success: true });
  });
});

app.get("/api/cms/users", authorize(["admin"]), (req, res) => {
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

app.delete("/api/cms/users/:id", authorize(["admin"]), (req, res) => {
  const userId = req.params.id;

  const query = `UPDATE users SET deleted_at = NOW() WHERE id = ?`;

  connection.query(query, [userId], (err, results) => {
    if (err) return res.status(500).send(err);

    res.json({ success: true });
  });
});

app.post("/api/cms/users", authorize(["admin"]), async (req, res) => {
  const { username, email, role } = req.body;
  const hashedPassword = await bcrypt.hash("12345", 10);
  const default_password = hashedPassword;

  const query = `INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)`;

  connection.query(
    query,
    [username, email, default_password, role],
    (err, results) => {
      if (err)
        return res
          .status(500)
          .json({ error: "Database error: Failed to create user" });

      const token = jwt.sign({ id: results.insertId }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      const confirmUrl = `${domain}/api/confirm-email?token=${token}`;

      transporter.sendMail({
        to: email,
        subject: "Confirm Your Email",
        // html: `<a href="${confirmUrl}">Confirm your email</a>`,
        html: email_template(
          username,
          email,
          `Hi ${username}! We need to confirm your email address in order to activate
              your account.`,
          `Thanks for signing up to Pluto Cinema. Before we can
                              continue, we need to validate your email address.`,
          `<p style="margin: 40px 0; color: #fff">
                              <a
                                style="
                                  color: #fff;
                                  border-radius: 20px;
                                  border: 10px solid #525c91;
                                  background-color: #525c91;
                                  padding: 0 10px;
                                  text-transform: uppercase;
                                  text-decoration: none;
                                  font-weight: 700;
                                "
                                href="${confirmUrl}"
                                >Activate My Account</a
                              >
                            </p>`
        ),
      });

      res.json({ success: true });
    }
  );
});

app.put("/api/cms/users/:id", authorize(["admin"]), (req, res) => {
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
app.put("/api/cms/users/role/:id", authorize(["admin"]), (req, res) => {
  const userId = req.params.id;
  const { role } = req.body;

  const query = `UPDATE users SET role = ? WHERE id = ?`;

  connection.query(query, [role, userId], (err, results) => {
    if (err)
      return res
        .status(500)
        .json({ error: "Database error: Failed to update user" });

    res.json({ success: true });
  });
});

app.get("/api/cms/countrylist", (req, res) => {
  const query = `SELECT id, name FROM countries`;

  connection.query(query, (err, results) => {
    if (err) return res.status(500).send(err);

    // Mengubah format data agar sesuai dengan frontend
    const formattedResults = results.map((result) => ({ name: result.name }));
    res.json(formattedResults);
  });
});

app.get("/api/cms/yearlist", (req, res) => {
  const query = "SELECT DISTINCT year FROM movies ORDER BY year DESC";

  connection.query(query, (err, results) => {
    if (err) return res.status(500).send(err);

    res.json(results);
  });
});

app.get("/api/cms/genrelist", (req, res) => {
  const query = `SELECT id, name FROM genres`;

  connection.query(query, (err, results) => {
    if (err) return res.status(500).send(err);

    res.json(results);
  });
});

app.get("/api/cms/awardlist", (req, res) => {
  const query = `SELECT id, name FROM awards`;

  connection.query(query, (err, results) => {
    if (err) return res.status(500).send(err);

    res.json(results);
  });
});

app.get("/api/cms/actors", authorize(["admin", "writer"]), (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;
  const search = req.query.search ? `%${req.query.search}%` : "%%";
  const orderColumnIndex = parseInt(req.query.order) || 0;
  const orderDir = req.query.dir === "desc" ? "DESC" : "ASC";

  const orderColumns = [
    "a.id", // 0
    "c.name", // 1
    "a.name", // 2
    "a.birthdate", // 3
    "a.picture_profile", // 4
  ];

  const orderColumn = orderColumns[orderColumnIndex] || "a.id";

  const countQuery = `
    SELECT COUNT(*) as total
    FROM actors
    WHERE (name LIKE ? OR birthdate LIKE ?) AND deleted_at IS NULL
  `;
  const dataQuery = `
  SELECT a.*, c.name AS country_name
  FROM actors a
  JOIN countries c ON a.countries_id = c.id
  WHERE (a.name LIKE ? OR a.birthdate LIKE ?) AND a.deleted_at IS NULL
  ORDER BY ${orderColumn} ${orderDir}
  LIMIT ? OFFSET ?
`;

  connection.query(countQuery, [search, search], (err, countResult) => {
    if (err) return res.status(500).send(err);

    const totalActors = countResult[0].total;

    connection.query(
      dataQuery,
      [search, search, limit, offset],
      (err, dataResults) => {
        if (err) return res.status(500).send(err);

        res.json({
          actors: dataResults,
          recordsTotal: totalActors,
          recordsFiltered: totalActors,
        });
      }
    );
  });
});

app.post(
  "/api/cms/actors",
  authorize(["admin"]),
  upload.single("file"),
  async (req, res) => {
    try {
      const { filename } = req.file;
      var { country, actorName, birthDate } = req.body;
      country = country.toUpperCase();
      let country_id = 0;

      const countryQuery = `SELECT id FROM countries WHERE UPPER(name) = ?`;

      const queryDatabase = (query, params) => {
        return new Promise((resolve, reject) => {
          connection.query(query, params, (err, results) => {
            if (err) {
              return reject(err);
            }
            resolve(results);
          });
        });
      };

      const results = await queryDatabase(countryQuery, [country]);

      if (results.length === 0) {
        const countryName = country.charAt(0) + country.slice(1).toLowerCase();
        const insertCountryQuery = `INSERT INTO countries (name) VALUES (?)`;

        const insertResults = await queryDatabase(insertCountryQuery, [
          countryName,
        ]);
        country_id = insertResults.insertId;
      } else {
        country_id = results[0].id;
      }

      const query = `INSERT INTO actors (countries_id, name, picture_profile, birthdate) VALUES (?, ?, ?, ?)`;

      connection.query(
        query,
        [country_id, actorName, `/public/uploads/${filename}`, birthDate],
        (err, results) => {
          if (err) {
            return res.status(500).json({ message: "Error inserting actor" });
          }

          res.json({ success: true });
        }
      );
    } catch (error) {
      res.status(500).json({ message: "Error uploading file" });
    }
  }
);

app.put(
  "/api/cms/actors/:id",
  authorize(["admin"]),
  upload.single("img"),
  async (req, res) => {
    const actorId = req.params.id;
    var { country, name, date } = req.body;
    const filename = req.file ? req.file.filename : null;
    country = country.toUpperCase();
    let country_id = 0;

    const countryQuery = `SELECT id FROM countries WHERE UPPER(name) = ?`;

    const queryDatabase = (query, params) => {
      return new Promise((resolve, reject) => {
        connection.query(query, params, (err, results) => {
          if (err) {
            return reject(err);
          }
          resolve(results);
        });
      });
    };

    const results = await queryDatabase(countryQuery, [country]);

    if (results.length === 0) {
      const countryName = country.charAt(0) + country.slice(1).toLowerCase();
      const insertCountryQuery = `INSERT INTO countries (name) VALUES (?)`;

      const insertResults = await queryDatabase(insertCountryQuery, [
        countryName,
      ]);
      country_id = insertResults.insertId;
    } else {
      country_id = results[0].id;
    }

    const actorQuery = `SELECT picture_profile FROM actors WHERE id = ?`;

    const actorResults = await queryDatabase(actorQuery, [actorId]);

    if (actorResults.length === 0) {
      return res.status(404).json({ message: "Actor not found" });
    }

    const oldPicture = actorResults[0].picture_profile;

    const query = `UPDATE actors SET countries_id = ?, name = ?, picture_profile = ?, birthdate = ? WHERE id = ?`;

    connection.query(
      query,
      [
        country_id,
        name,
        filename ? `/public/uploads/${filename}` : oldPicture,
        date,
        actorId,
      ],
      (err, results) => {
        if (err) {
          return res.status(500).json({ message: "Error updating actor" });
        }

        if (filename && oldPicture.includes("/public/uploads/")) {
          const oldPicturePath = oldPicture.replace("/public", "");

          deleteFile(`public${oldPicturePath}`);
        }

        res.json({ success: true });
      }
    );
  }
);

app.delete("/api/cms/actors/:id", authorize(["admin"]), (req, res) => {
  const actorId = req.params.id;

  const query = `UPDATE actors SET deleted_at = NOW() WHERE id = ?`;

  connection.query(query, [actorId], (err, results) => {
    if (err) return res.status(500).send(err);

    res.json({ success: true });
  });
});

app.post(
  "/api/cms/movies",
  authorize(["admin", "writer"]),
  upload.single("poster"),
  async (req, res) => {
    try {
      const { filename } = req.file;
      var {
        title,
        alternative_title,
        year,
        country,
        synopsis,
        availability,
        genres,
        link_trailer,
        award,
        actors,
      } = req.body;

      if (typeof genres === "string") {
        genres = [genres];
      }
      if (typeof award === "string") {
        award = [award];
      }

      // ----------------- COUNTRY -----------------

      country = country.toUpperCase();
      let country_id = 0;

      const countryQuery = `SELECT id FROM countries WHERE UPPER(name) = ?`;

      const queryDatabase = (query, params) => {
        return new Promise((resolve, reject) => {
          connection.query(query, params, (err, results) => {
            if (err) {
              return reject(err);
            }
            resolve(results);
          });
        });
      };

      const results = await queryDatabase(countryQuery, [country]);

      if (results.length === 0) {
        const countryName = country.charAt(0) + country.slice(1).toLowerCase();
        const insertCountryQuery = `INSERT INTO countries (name) VALUES (?)`;

        const insertResults = await queryDatabase(insertCountryQuery, [
          countryName,
        ]);
        country_id = insertResults.insertId;
      } else {
        country_id = results[0].id;
      }
      // ----------------- COUNTRY -----------------

      // ----------------- GENRES -----------------
      var genres_id = [];
      for (let i = 0; i < genres.length; i++) {
        if (isNaN(parseInt(genres[i]))) {
          const genreName =
            genres[i].charAt(0) + genres[i].slice(1).toLowerCase();
          const insertGenreQuery = `INSERT INTO genres (name) VALUES (?)`;

          const insertResults = await queryDatabase(insertGenreQuery, [
            genreName,
          ]);
          genres_id.push(insertResults.insertId);
        } else {
          genres_id.push(parseInt(genres[i]));
        }
      }
      // ----------------- GENRES -----------------

      // ----------------- AWARD -----------------
      var award_id = [];
      for (let i = 0; i < award.length; i++) {
        if (isNaN(parseInt(award[i]))) {
          const awardName =
            award[i].charAt(0) + award[i].slice(1).toLowerCase();
          const insertAwardQuery = `INSERT INTO awards (name) VALUES (?)`;

          const insertResults = await queryDatabase(insertAwardQuery, [
            awardName,
          ]);
          award_id.push(insertResults.insertId);
        } else {
          award_id.push(parseInt(award[i]));
        }
      }
      // ----------------- AWARD -----------------

      const query = `INSERT INTO movies (countries_id, poster, title, alternative_titles, year, synopsis, availability, trailer) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

      connection.query(
        query,
        [
          country_id,
          `/public/uploads/${filename}`,
          title,
          alternative_title,
          year,
          synopsis,
          availability,
          link_trailer,
        ],
        (err, results) => {
          if (err) {
            return res.status(500).json({ message: "Error inserting movie" });
          }

          const movieId = results.insertId;

          const genresQuery = `INSERT INTO movies_genres (movie_id, genre_id) VALUES ?`;
          const genresValues = genres_id.map((genreId) => [movieId, genreId]);

          connection.query(genresQuery, [genresValues], (err, results) => {
            if (err) {
              return res
                .status(500)
                .json({ message: "Error inserting genres" });
            }
          });

          const awardQuery = `INSERT INTO movies_awards (movie_id, award_id) VALUES ?`;
          const awardValues = award_id.map((awardId) => [movieId, awardId]);

          connection.query(awardQuery, [awardValues], (err, results) => {
            if (err) {
              return res
                .status(500)
                .json({ message: "Error inserting awards" });
            }
          });

          const actorsQuery = `INSERT INTO movies_actors (movie_id, actor_id) VALUES ?`;
          const actorsValues = actors.map((actorId) => [movieId, actorId]);

          connection.query(actorsQuery, [actorsValues], (err, results) => {
            if (err) {
              return res
                .status(500)
                .json({ message: "Error inserting actors" });
            }
          });

          res.json({ success: true });
        }
      );
    } catch (error) {
      res.status(500).json({ message: "Error uploading file" });
    }
  }
);

// ! ===============================================  CMS ===============================================

app.listen(port, () => {
  console.log("Server is running on " + domain);
});
