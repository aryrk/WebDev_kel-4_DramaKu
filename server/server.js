export const maxDuration = 60;
const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const saltRounds = 10;
const passport = require("passport");
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { google } = require("googleapis");
require("dotenv").config();
const MemoryStore = require("memorystore")(session);

app.use(
  session({
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    }),
    resave: false,
    secret: "keyboard cat",
  })
);

// const client_domain = "http://localhost:5173";
// const port = 5000;
// const domain = "http://localhost:" + port;

const client_domain = process.env.CLIENT_URL;
const port = process.env.SERVER_PORT;
const domain = process.env.SERVER_URL;

const STORAGE_MODE = process.env.STORAGE_MODE;

if (STORAGE_MODE === "cloudinary") {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

const get_file_source = (file) => {
  if (STORAGE_MODE === "cloudinary") {
    return file.path;
  } else {
    return "/public/uploads/" + file.filename;
  }
};

// const corsOptions = {
//   origin: client_domain,
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   credentials: true,
//   optionsSuccessStatus: 204,
// };

const allowedDomains = [client_domain, domain + "/auth/google/callback"];
// allow all domain
// const allowedDomains = ["*"];
const corsOptions = {
  AccessControlAllowOrigin: "*",
  origin: function (origin, callback) {
    console.log("origin", origin);
    if (allowedDomains.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
      // callback(null, true);
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

const openCorsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

// app.use(cors(corsOptions));

app.use(cors());
app.use(express.json());

const oAuth2Client = new google.auth.OAuth2(
  process.env.EMAIL_CLIENT_ID,
  process.env.EMAIL_CLIENT_SECRET,
  client_domain + "/auth/google/callback"
);

const oAuth2Client_mail = new google.auth.OAuth2(
  process.env.EMAIL_CLIENT_ID,
  process.env.EMAIL_CLIENT_SECRET,
  domain + "/oauth2callback"
);

const scopes = ["https://mail.google.com/"];

// const { tokens } = await oAuth2Client.getToken(code);
// wrap in function

var REFRESH_TOKEN = "";
var accessToken = "";
var transporter = null;

transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function setupRefreshToken() {
  oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
  accessToken = oAuth2Client.getAccessToken();
  transporter = nodemailer.createTransport({
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
}

async function getAccessToken() {
  const url = oAuth2Client_mail.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });
  return url;
}

app.get("/authkey", async (req, res) => {
  // const url = oAuth2Client_mail.generateAuthUrl({
  //   access_type: "offline",
  //   scope: scopes,
  // });
  // res.redirect(url);

  res.redirect(await getAccessToken());
});

// Endpoint untuk callback setelah user login
// var REFRESH_TOKEN = process.env.REFRESH_TOKEN;
app.get("/oauth2callback", async (req, res) => {
  const code = req.query.code;
  if (code) {
    try {
      const { tokens } = await oAuth2Client_mail.getToken(code);
      oAuth2Client_mail.setCredentials(tokens);
      // res.send("Authentication successful! Tokens received.");
      // console.log("Access Token:", tokens.access_token);
      console.log("Authentication successful! Tokens received.");
      if (tokens.refresh_token) {
        // console.log("Refresh Token:", tokens.refresh_token);
        REFRESH_TOKEN = tokens.refresh_token;
        setupRefreshToken();

        res.redirect(client_domain + "/");
      }
    } catch (error) {
      console.error("Error getting token:", error);
      res.send("Error during authentication");
    }
  }
});

// oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
// accessToken = oAuth2Client.getAccessToken();

const fs = require("fs");
const { get } = require("http");
const dir = "./public/uploads";

var storage = null;

if (STORAGE_MODE === "cloudinary") {
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "plutocinema",
      format: async (req, file) => "png",
      public_id: (req, file) => {
        return Date.now() + "-" + file.originalname;
      },
    },
  });
} else {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/uploads");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
}
const upload = multer({ storage: storage });
const deleteFile = (filename) => {
  if (STORAGE_MODE === "cloudinary") {
    try {
      const result = cloudinary.uploader.destroy(publicId);
      console.log("File deleted:", result);
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  } else {
    fs.unlink(filename, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });
  }
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
      clientID: process.env.EMAIL_CLIENT_ID,
      clientSecret: process.env.EMAIL_CLIENT_SECRET,
      callbackURL: domain + "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await new Promise((resolve, reject) => {
          connection.query(
            "SELECT * FROM users WHERE (google_id = ? or email = ?) AND deleted_at IS NULL",
            [profile.id, profile.emails[0].value],
            (error, results) => {
              if (error) return reject(error);
              resolve(results[0]);
            }
          );
        });

        if (existingUser) {
          if (!existingUser.google_id) {
            connection.query(
              "UPDATE users SET google_id = ? WHERE id = ? AND deleted_at IS NULL",
              [profile.id, existingUser.id],
              (error) => {
                if (error) return done(error);
              }
            );
          }

          return done(null, existingUser);
        }

        const newUser = {
          google_id: profile.id,
          username: profile.displayName,
          email: profile.emails[0].value,
          profile_picture: profile.photos[0].value,
        };

        const password = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(password, 10);

        connection.query(
          "INSERT INTO users (google_id, username, email, profile_picture, is_verified, password) VALUES (?, ?, ?, ?, ?, ?)",
          [
            newUser.google_id,
            newUser.username,
            newUser.email,
            newUser.profile_picture,
            true,
            hashedPassword,
          ],
          (error, results) => {
            // if (error) return done(error);
            // if error, return to fallback page
            if (error) return done(null, false, { message: "Error" });

            const user = {
              id: results.insertId,
              username: newUser.username,
              email: newUser.email,
              profile_picture: newUser.profile_picture,
              role: "writer",
            };

            done(null, user);
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

// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "plutocinema",
// });

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting: " + err.stack);
    return;
  }
  console.log("Connected as id " + connection.threadId);
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

app.get("/api/checkusernames/:username", cors(corsOptions), (req, res) => {
  const username = req.params.username;
  const query = "SELECT * FROM users WHERE username = ?";

  connection.query(query, [username], (err, results) => {
    if (err) return res.status(500).send(err);

    if (results.length > 0) {
      res.json({
        username: true,
      });
    } else {
      res.json({
        username: false,
      });
    }
  });
});

app.get("/api/checkemails/:email", cors(corsOptions), (req, res) => {
  const email = req.params.email;
  const query = "SELECT * FROM users WHERE email = ?";

  connection.query(query, [email], (err, results) => {
    if (err) return res.status(500).send(err);

    if (results.length > 0) {
      res.json({
        email: true,
      });
    } else {
      res.json({
        email: false,
      });
    }
  });
});

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

      connection.query(
        "SELECT * FROM users WHERE id = ? AND deleted_at IS NULL",
        [decoded.id],
        (error, results) => {
          if (error) return res.status(500).json({ message: "Database error" });
          if (results.length === 0)
            // return res.status(403).json({ message: "User not found" });
            // clear token
            return res.status(403).json({ message: "Access denied" });
          else {
            req.user = decoded;
            next();
          }
        }
      );
    } catch (err) {
      res.status(401).json({ message: "Invalid token" });
    }
  };
};

app.get("/api/is_username_exist/:username", cors(corsOptions), (req, res) => {
  const { username } = req.params;
  connection.query(
    "SELECT * FROM users WHERE username = ? AND deleted_at IS NULL",
    [username],
    (error, results) => {
      if (error)
        return res.status(500).json({ message: "Error checking username" });

      res.json({ isExist: results.length > 0 });
    }
  );
});

app.post("/api/register", cors(corsOptions), async (req, res) => {
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

app.post("/api/login", cors(corsOptions), async (req, res) => {
  const { email, password } = req.body;

  connection.query(
    "SELECT * FROM users WHERE (email = ? or username = ?) AND is_verified = 1 AND deleted_at IS NULL",
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
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );
      res.json({ token });
    }
  );
});

app.post("/api/forgot-password", cors(corsOptions), async (req, res) => {
  const { email } = req.body;

  connection.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (error, results) => {
      if (error)
        return res.status(500).json({ message: "Error fetching user" });
      if (results.length === 0)
        return res.status(500).json({ message: "User not found" });

      const user = results[0];

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      connection.query(
        "UPDATE users SET reset_password_token = ?, reset_password_expires = ? WHERE id = ?",
        [token, new Date(Date.now() + 3600000), user.id],
        (error) => {
          if (error)
            return res
              .status(500)
              .json({ message: "Error updating reset token" });
        }
      );

      const resetUrl = `${client_domain}/reset-password?token=${token}`;

      transporter.sendMail({
        to: email,
        subject: "Reset Your Password",
        html: email_template(
          user.username,
          email,
          `Hi ${user.username}! You requested to reset your password.`,
          `We received a request to reset your password. If you did not make this request, simply ignore this email.`,
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
            href="${resetUrl}"
            >Reset Password</a
          >
        </p>`
        ),
      });

      res.json({ message: "Password reset link sent to your email." });
    }
  );
});

app.post("/api/reset-password", cors(corsOptions), async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    connection.query(
      "SELECT * FROM users WHERE id = ? and reset_password_token = ? and reset_password_expires > ?",
      [decoded.id, token, new Date()],
      (error, results) => {
        if (error)
          return res.status(500).json({ message: "Error fetching user" });
        if (results.length === 0)
          return res.status(400).json({ message: "Invalid or expired token" });

        connection.query(
          "UPDATE users SET password = ?, reset_password_token = NULL, reset_password_expires = NULL WHERE id = ?",
          [hashedPassword, decoded.id],
          (error) => {
            if (error)
              return res
                .status(500)
                .json({ message: "Error updating password" });
            res.json({ message: "Password updated successfully" });
          }
        );
      }
    );
  } catch (err) {
    res.status(400).json({ message: "Invalid or expired token." });
  }
});

// ! ===============================================  Auth ===============================================
// ! ===============================================  Auth Google ===============================================
app.get(
  "/api/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  cors(openCorsOptions),
  passport.authenticate("google", {
    failureRedirect: `${client_domain}/login`,
    session: false,
  }),
  (req, res) => {
    const user = req.user;
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.redirect(`${client_domain}/login?token=${token}`);
  }
);

// ! ===============================================  Auth Google ===============================================

app.get("/api/all-movies", cors(corsOptions), (req, res) => {
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

app.get("/api/get-movies-poster/:limit", cors(corsOptions), (req, res) => {
  const limit = req.params.limit;
  const query = `SELECT movies.poster FROM movies ORDER BY created_at DESC LIMIT ${limit}`;
  connection.query(query, (err, results) => {
    if (err) return res.status(500).send(err);

    res.json(results);
  });
});

app.get("/api/movies/comments/:id", cors(corsOptions), (req, res) => {
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
  cors(corsOptions),
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

app.post("/api/movies/update-view-count/:id", cors(corsOptions), (req, res) => {
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

app.get("/api/movies-search", cors(corsOptions), (req, res) => {
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

app.get("/api/movie-details/:id", cors(corsOptions), (req, res) => {
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

app.get(
  "/api/cms/comments",
  cors(corsOptions),
  authorize(["admin"]),
  (req, res) => {
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
  }
);

app.post(
  "/api/cms/comments/action",
  cors(corsOptions),
  authorize(["admin"]),
  (req, res) => {
    const { ids, action } = req.body;

    const query = `UPDATE comments SET status = ? WHERE id IN (${ids.join(
      ","
    )}) AND deleted_at IS NULL`;

    connection.query(query, [action], (err, results) => {
      if (err) return res.status(500).send(err);

      res.json({ success: true });
    });
  }
);

app.get(
  "/api/cms/users",
  cors(corsOptions),
  authorize(["admin"]),
  (req, res) => {
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
    WHERE username LIKE ? OR email LIKE ?
  `;

    const dataQuery = `
  SELECT *
  FROM users
  WHERE username LIKE ? OR email LIKE ?
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
  }
);

app.delete(
  "/api/cms/users/:id",
  cors(corsOptions),
  authorize(["admin"]),
  (req, res) => {
    const userId = req.params.id;

    const query = `UPDATE users SET deleted_at = NOW() WHERE id = ?`;

    connection.query(query, [userId], (err, results) => {
      if (err) return res.status(500).send(err);

      res.json({ success: true });
    });
  }
);

app.post(
  "/api/cms/users",
  cors(corsOptions),
  authorize(["admin"]),
  async (req, res) => {
    const { username, email, role } = req.body;
    const hashedPassword = await bcrypt.hash("12345", 10);
    const default_password = hashedPassword;

    const query = `INSERT INTO users (username, email, password, role, is_verified) VALUES (?, ?, ?, ?, ?)`;

    connection.query(
      query,
      [username, email, default_password, role, "1"],
      (err, results) => {
        if (err)
          return res
            .status(500)
            .json({ error: "Database error: Failed to create user" });

        const token = jwt.sign(
          { id: results.insertId },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h",
          }
        );
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
  }
);

app.put(
  "/api/cms/users/revert/:id",
  cors(corsOptions),
  authorize(["admin"]),
  (req, res) => {
    const userId = req.params.id;
    const query = `UPDATE users SET deleted_at = NULL WHERE id = ?`;

    connection.query(query, [userId], (err, results) => {
      if (err)
        return res
          .status(500)
          .json({ error: "Database error: Failed to revert user" });

      res.json({ success: true });
    });
  }
);

app.put(
  "/api/cms/users/:id",
  cors(corsOptions),
  authorize(["admin"]),
  (req, res) => {
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
  }
);
app.put(
  "/api/cms/users/role/:id",
  cors(corsOptions),
  authorize(["admin"]),
  (req, res) => {
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
  }
);

app.get("/api/cms/countrylist", cors(corsOptions), (req, res) => {
  const query = `SELECT id, name FROM countries WHERE deleted_at IS NULL`; // Only select countries that are not deleted

  connection.query(query, (err, results) => {
    if (err) return res.status(500).send(err);

    // Mengubah format data agar sesuai dengan frontend
    const formattedResults = results.map((result) => ({
      id: result.id,
      name: result.name,
    })); // Include id for potential use
    res.json(formattedResults);
  });
});

app.get("/api/cms/yearlist", cors(corsOptions), (req, res) => {
  const query = "SELECT DISTINCT year FROM movies ORDER BY year DESC";

  connection.query(query, (err, results) => {
    if (err) return res.status(500).send(err);

    res.json(results);
  });
});

app.get("/api/cms/genrelist", cors(corsOptions), (req, res) => {
  const query = `SELECT id, name FROM genres WHERE deleted_at IS NULL`;

  connection.query(query, (err, results) => {
    if (err) return res.status(500).send(err);

    const formattedResults = results.map((result) => ({
      id: result.id,
      name: result.name,
    }));
    res.json(formattedResults);
  });
});

app.get("/api/cms/awardlist", cors(corsOptions), (req, res) => {
  const query = `SELECT id, name FROM awards WHERE deleted_at IS NULL`;

  connection.query(query, (err, results) => {
    if (err) return res.status(500).send(err);

    const formattedResults = results.map((result) => ({
      id: result.id,
      name: result.name,
      year: result.year,
    }));

    res.json(formattedResults);
  });
});

app.get(
  "/api/cms/actors",
  cors(corsOptions),
  authorize(["admin", "writer"]),
  (req, res) => {
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
  }
);

app.post(
  "/api/cms/actors",
  cors(corsOptions),
  authorize(["admin"]),
  upload.single("file"),
  async (req, res) => {
    try {
      const filename = get_file_source(req.file);
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

      await queryDatabase("START TRANSACTION");

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
        [country_id, actorName, filename, birthDate],
        (err, results) => {
          if (err) {
            return res.status(500).json({ message: "Error inserting actor" });
          }

          res.json({ success: true });
        }
      );

      await queryDatabase("COMMIT");
    } catch (error) {
      await queryDatabase("ROLLBACK");
      res.status(500).json({ message: "Error uploading file" });
    }
  }
);

app.put(
  "/api/cms/actors/:id",
  cors(corsOptions),
  authorize(["admin"]),
  upload.single("img"),
  async (req, res) => {
    const actorId = req.params.id;
    var { country, name, date } = req.body;
    const filename = req.file ? get_file_source(req.file) : null;
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

    await queryDatabase("START TRANSACTION");

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
      [country_id, name, filename ? filename : oldPicture, date, actorId],
      (err, results) => {
        if (err) {
          queryDatabase("ROLLBACK");
          return res.status(500).json({ message: "Error updating actor" });
        }

        if (filename && oldPicture.includes("/public/uploads/")) {
          const oldPicturePath = oldPicture.replace("/public", "");

          deleteFile(`public${oldPicturePath}`);
        }

        res.json({ success: true });
      }
    );

    await queryDatabase("COMMIT");
  }
);

app.delete(
  "/api/cms/actors/:id",
  cors(corsOptions),
  authorize(["admin"]),
  (req, res) => {
    const actorId = req.params.id;

    const query = `UPDATE actors SET deleted_at = NOW() WHERE id = ?`;

    connection.query(query, [actorId], (err, results) => {
      if (err) return res.status(500).send(err);

      res.json({ success: true });
    });
  }
);

app.post(
  "/api/cms/movies",
  cors(corsOptions),
  authorize(["admin", "writer"]),
  upload.single("poster"),
  async (req, res) => {
    try {
      const filename = get_file_source(req.file);

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

      await queryDatabase("START TRANSACTION");

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
          filename,
          title,
          alternative_title,
          year,
          synopsis,
          availability,
          link_trailer,
        ],
        (err, results) => {
          if (err) {
            queryDatabase("ROLLBACK");
            return res.status(500).json({ message: "Error inserting movie" });
          }

          const movieId = results.insertId;

          const genresQuery = `INSERT INTO movies_genres (movie_id, genre_id) VALUES ?`;
          const genresValues = genres_id.map((genreId) => [movieId, genreId]);

          connection.query(genresQuery, [genresValues], (err, results) => {
            if (err) {
              queryDatabase("ROLLBACK");
              return res
                .status(500)
                .json({ message: "Error inserting genres" });
            }
          });

          const awardQuery = `INSERT INTO movies_awards (movie_id, award_id) VALUES ?`;
          const awardValues = award_id.map((awardId) => [movieId, awardId]);

          connection.query(awardQuery, [awardValues], (err, results) => {
            if (err) {
              queryDatabase("ROLLBACK");
              return res
                .status(500)
                .json({ message: "Error inserting awards" });
            }
          });

          const actorsQuery = `INSERT INTO movies_actors (movie_id, actor_id) VALUES ?`;
          const actorsValues = actors.map((actorId) => [movieId, actorId]);

          connection.query(actorsQuery, [actorsValues], (err, results) => {
            if (err) {
              queryDatabase("ROLLBACK");
              return res
                .status(500)
                .json({ message: "Error inserting actors" });
            }
          });

          res.json({ success: true });
          queryDatabase("COMMIT");
        }
      );
    } catch (error) {
      // await queryDatabase("ROLLBACK");
      connection.query("ROLLBACK");
      res.status(500).json({ message: "Error uploading file" });
    }
  }
);

app.get(
  "/api/cms/countriesList",
  cors(corsOptions),
  authorize(["admin"]),
  (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = parseInt(req.query.offset, 10) || 0;
    const search = req.query.search ? `%${req.query.search}%` : "%%";
    const orderColumnIndex = parseInt(req.query.order) || 0;
    const orderDir = req.query.dir === "desc" ? "DESC" : "ASC";

    const orderColumns = [
      "c.id", // 0
      "c.name", // 1
    ];

    const orderColumn = orderColumns[orderColumnIndex] || "c.id";

    const countQuery = `
    SELECT COUNT(*) as total
    FROM countries c
    WHERE c.name LIKE ?
  `;

    const dataQuery = `
  SELECT c.id, c.name
  FROM countries c
  WHERE c.name LIKE ? AND c.deleted_at IS NULL
  ORDER BY ${orderColumn} ${orderDir}
  LIMIT ? OFFSET ?
`;

    connection.query(countQuery, [search], (err, countResult) => {
      if (err) {
        console.error("Error in countQuery:", err); // Log the error
        return res.status(500).json({
          success: false,
          message: "Database error in count query",
          error: err,
        });
      }

      const totalCountries = countResult[0].total;

      connection.query(
        dataQuery,
        [search, limit, offset],
        (err, dataResults) => {
          if (err) {
            console.error("Error in dataQuery:", err); // Log the error
            return res.status(500).json({
              success: false,
              message: "Database error in data query",
              error: err,
            });
          }

          res.json({
            countries: dataResults,
            recordsTotal: totalCountries,
            recordsFiltered: totalCountries,
          });
        }
      );
    });
  }
);

app.get(
  "/api/cms/awardsList2",
  cors(corsOptions),
  authorize(["admin"]),
  (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = parseInt(req.query.offset, 10) || 0;
    const search = req.query.search ? `%${req.query.search}%` : "%%";
    const orderColumnIndex = parseInt(req.query.order) || 0;
    const orderDir = req.query.dir === "desc" ? "DESC" : "ASC";

    const orderColumns = [
      "a.id", // 0
      "a.name",
      "a.year",
    ];

    const orderColumn = orderColumns[orderColumnIndex] || "a.id";

    const countQuery = `
    SELECT COUNT(*) as total
    FROM awards a
    WHERE a.name LIKE ?
  `;

    const dataQuery = `
  SELECT a.id, a.name, a.year
  FROM awards a
  WHERE a.name LIKE ? AND a.deleted_at IS NULL
  ORDER BY ${orderColumn} ${orderDir}
  LIMIT ? OFFSET ?
`;

    connection.query(countQuery, [search], (err, countResult) => {
      if (err) {
        console.error("Count Query Error:", err);
        return res.status(500).json({
          success: false,
          message: "Database error in count query",
          error: err,
        });
      }

      const totalAwards = countResult[0].total;
      console.log("Total awards:", totalAwards);

      connection.query(
        dataQuery,
        [search, limit, offset],
        (err, dataResults) => {
          if (err) {
            console.error("Data Query Error:", err);
            return res.status(500).json({
              success: false,
              message: "Database error in data query",
              error: err,
            });
          }

          console.log("Data Results:", dataResults);

          res.json({
            awards: dataResults,
            recordsTotal: totalAwards,
            recordsFiltered: totalAwards,
          });
        }
      );
    });
  }
);

app.get(
  "/api/cms/movielist",
  cors(corsOptions),
  authorize(["admin"]),
  (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const search = req.query.search ? `%${req.query.search}%` : "%%";
    const orderColumnIndex = parseInt(req.query.order) || 0;
    const orderDir = req.query.dir === "desc" ? "DESC" : "ASC";

    const orderColumns = [
      "m.id", // 0
      "m.title",
      "m.synopsis",
      "m.status",
    ];

    const orderColumn = orderColumns[orderColumnIndex] || "m.id";

    const countQuery = `
    SELECT COUNT(*) as total
    FROM movies m
    WHERE m.title LIKE ?
  `;

    const dataQuery = `
    SELECT 
      m.id, 
      m.title, 
      GROUP_CONCAT(DISTINCT a.name) AS actors, 
      GROUP_CONCAT(DISTINCT g.name) AS genres,
      m.synopsis, 
      m.status
    FROM movies m
    LEFT JOIN movies_actors ma ON m.id = ma.movie_id
    LEFT JOIN actors a ON ma.actor_id = a.id
    LEFT JOIN movies_genres mg ON m.id = mg.movie_id
    LEFT JOIN genres g ON mg.genre_id = g.id
    WHERE m.title LIKE ?
    GROUP BY m.id
    ORDER BY ${orderColumn} ${orderDir}
    LIMIT ? OFFSET ?
  `;

    connection.query(countQuery, [search], (err, countResult) => {
      if (err) return res.status(500).send(err);

      const totalMovies = countResult[0].total;

      connection.query(
        dataQuery,
        [search, limit, offset],
        (err, dataResults) => {
          if (err) return res.status(500).send(err);

          res.json({
            movies: dataResults,
            recordsTotal: totalMovies,
            recordsFiltered: totalMovies,
          });
        }
      );
    });
  }
);

app.get(
  "/api/cms/genresList",
  cors(corsOptions),
  authorize(["admin"]),
  (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = parseInt(req.query.offset, 10) || 0;
    const search = req.query.search ? `%${req.query.search}%` : "%%";
    const orderColumnIndex = parseInt(req.query.order) || 0;
    const orderDir = req.query.dir === "desc" ? "DESC" : "ASC";

    const orderColumns = [
      "g.id", // 0
      "g.name", // 1
    ];

    const orderColumn = orderColumns[orderColumnIndex] || "g.id";

    const countQuery = `
    SELECT COUNT(*) as total
    FROM genres g
    WHERE g.name LIKE ?
  `;

    const dataQuery = `
  SELECT g.id, g.name
  FROM genres g
  WHERE g.name LIKE ? AND g.deleted_at IS NULL
  ORDER BY ${orderColumn} ${orderDir}
  LIMIT ? OFFSET ?
`;

    connection.query(countQuery, [search], (err, countResult) => {
      if (err) {
        console.error("Error in countQuery:", err); // Log the error
        return res.status(500).json({
          success: false,
          message: "Database error in count query",
          error: err,
        });
      }

      const totalGenres = countResult[0].total;

      connection.query(
        dataQuery,
        [search, limit, offset],
        (err, dataResults) => {
          if (err) {
            console.error("Error in dataQuery:", err); // Log the error
            return res.status(500).json({
              success: false,
              message: "Database error in data query",
              error: err,
            });
          }

          res.json({
            genres: dataResults,
            recordsTotal: totalGenres,
            recordsFiltered: totalGenres,
          });
        }
      );
    });
  }
);

// ----------------- CMS COUNTRY -----------------

// Menambahkan negara baru
app.post(
  "/api/cms/countriesList",
  cors(corsOptions),
  authorize(["admin"]),
  (req, res) => {
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Country name is required" });
    }

    // console.log("Country to add:", name);

    connection.query("START TRANSACTION");

    // Check if the country name already exists and hasn't been deleted
    const checkQuery = `SELECT * FROM countries WHERE name = ? AND deleted_at IS NULL`;

    connection.query(checkQuery, [name], (err, results) => {
      if (err) {
        // console.error("Error in checkQuery:", err);
        connection.query("ROLLBACK");
        return res
          .status(500)
          .json({ success: false, message: "Country name already exists" });
      }

      if (results.length > 0) {
        connection.query("ROLLBACK");
        return res
          .status(400)
          .json({ success: false, message: "Country name already exists" });
      }

      // If the country does not exist, add it to the database
      const insertQuery = `INSERT INTO countries (name) VALUES (?)`;

      connection.query(insertQuery, [name], (err, results) => {
        if (err) {
          connection.query("ROLLBACK");
          // console.error("Error in insertQuery:", err);
          return res
            .status(500)
            .json({ success: false, message: "Country name already exists" });
        }

        res.json({ success: true, message: "Country added successfully" });
        connection.query("COMMIT");
      });
    });
  }
);

app.put(
  "/api/cms/countriesList/:id",
  cors(corsOptions),
  authorize(["admin"]),
  (req, res) => {
    const countryId = req.params.id;
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Country name is required" });
    }

    connection.query("START TRANSACTION");

    const updateQuery = `UPDATE countries SET name = ? WHERE id = ? AND deleted_at IS NULL`;

    connection.query(updateQuery, [name, countryId], (err, results) => {
      if (err) {
        // console.error("Error in updateQuery:", err);
        connection.query("ROLLBACK");
        return res
          .status(500)
          .json({ success: false, message: "Database error in update query" });
      }

      if (results.affectedRows === 0) {
        connection.query("ROLLBACK");
        return res.status(404).json({
          success: false,
          message: "Country not found or already deleted",
        });
      }

      res.json({ success: true, message: "Country updated successfully" });
      connection.query("COMMIT");
    });
  }
);

app.delete(
  "/api/cms/countriesList/:id",
  cors(corsOptions),
  authorize(["admin"]),
  (req, res) => {
    const countryId = req.params.id;

    const deleteQuery = `UPDATE countries SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL`;

    connection.query(deleteQuery, [countryId], (err, results) => {
      if (err) {
        console.error("Error in deleteQuery:", err);
        return res
          .status(500)
          .json({ success: false, message: "Database error in delete query" });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Country not found or already deleted",
        });
      }

      res.json({ success: true, message: "Country deleted successfully" });
    });
  }
);

// ----------------- CMS MOVIE -----------------

app.put(
  "/api/cms/moviesList/:id",
  cors(corsOptions),
  authorize(["admin"]),
  (req, res) => {
    const movieId = req.params.id;
    const { title } = req.body;
    const { synopsis } = req.body;
    const { status } = req.body;
    const { poster } = req.body;
    const { year } = req.body;
    const { availability } = req.body;
    const { trailer } = req.body;
    const { actors } = req.body;
    const { genres } = req.body;

    if (!title || title.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Movie title is required" });
    }

    if (!synopsis || synopsis.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Movie synopsis is required" });
    }

    if (!status || status.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Movie status is required" });
    }

    if (!poster || poster.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Movie poster is required" });
    }

    if (!year || year.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Movie year is required" });
    }

    if (!availability || availability.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Movie availability is required" });
    }

    if (!trailer || trailer.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Movie trailer is required" });
    }

    if (!actors || actors.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Movie actors is required" });
    }

    if (!genres || genres.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Movie genres is required" });
    }

    const updateQuery = `UPDATE movies SET title = ? synopsis = ? status = ? poster = ? year = ? availability = ? trailer = ? actors = ? genres = ? WHERE id = ? AND deleted_at IS NULL`;

    connection.query(
      updateQuery,
      [
        title,
        synopsis,
        status,
        poster,
        year,
        availability,
        trailer,
        actors,
        genres,
        movieId,
      ],
      (err, results) => {
        if (err) {
          console.error("Error in updateQuery:", err);
          return res.status(500).json({
            success: false,
            message: "Database error in update query",
          });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({
            success: false,
            message: "Movie not found or already deleted",
          });
        }

        res.json({ success: true, message: "Movie updated successfully" });
      }
    );
  }
);

app.get(
  "/api/cms/moviesList/:id",
  cors(corsOptions),
  authorize(["admin"]),
  (req, res) => {
    const movieId = req.params.id;
    console.log("Movie ID:", movieId);

    const movieQuery = `
  SELECT m.*, c.name AS country_name, IFNULL(AVG(cm.rate), 0) AS rating
  FROM movies m
  JOIN countries c ON m.countries_id = c.id
  LEFT JOIN comments cm ON m.id = cm.movie_id
  WHERE m.id = ? and m.deleted_at IS NULL and c.deleted_at IS NULL 
  GROUP BY m.id
  `;

    const genresQuery = `
    SELECT g.*
    FROM genres g
    JOIN movies_genres mg ON g.id = mg.genre_id
    JOIN movies m ON mg.movie_id = m.id
    WHERE mg.movie_id = ? AND m.deleted_at IS NULL AND g.deleted_at IS NULL
  `;

    const actorsQuery = `
    SELECT a.*
    FROM actors a
    JOIN movies_actors ma ON a.id = ma.actor_id
    JOIN movies m ON ma.movie_id = m.id
    WHERE ma.movie_id = ? AND m.deleted_at IS NULL AND a.deleted_at IS NULL
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
  }
);

app.delete(
  "/api/cms/moviesList/:id",
  cors(corsOptions),
  authorize(["admin"]),
  (req, res) => {
    const movieId = req.params.id;

    const deleteQuery = `UPDATE movies SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL`;

    connection.query(deleteQuery, [movieId], (err, results) => {
      if (err) {
        console.error("Error in deleteQuery:", err);
        return res
          .status(500)
          .json({ success: false, message: "Database error in delete query" });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Movie not found or already deleted",
        });
      }

      res.json({ success: true, message: "Movie deleted successfully" });
    });
  }
);

// ----------------- UNTUK APPROVE MOVIE -----------------
app.post(
  "/api/cms/moviesList/approve/:id",
  cors(corsOptions),
  authorize(["admin"]),
  (req, res) => {
    const movieId = req.params.id;

    // Query untuk memperbarui status menjadi 'accepted'
    const updateQuery = `
    UPDATE movies
    SET status = 'accepted'
    WHERE id = ? AND status != 'accepted'`;

    connection.query(updateQuery, [movieId], (err, result) => {
      if (err) {
        console.error("Error approving movie:", err);
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Movie not found or already accepted",
        });
      }

      res.json({ success: true, message: "Movie approved successfully" });
    });
  }
);

// ----------------- UNTUK REJECT MOVIE -----------------
app.put(
  "/api/cms/moviesList/reject/:id",
  cors(corsOptions),
  authorize(["admin"]),
  (req, res) => {
    const movieId = req.params.id;

    // Query untuk memperbarui status menjadi 'rejected'
    const updateQuery = `
    UPDATE movies
    SET status = 'rejected'
    WHERE id = ? AND status != 'rejected'`;

    connection.query(updateQuery, [movieId], (err, result) => {
      if (err) {
        console.error("Error rejecting movie:", err);
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Movie not found or already rejected",
        });
      }

      res.json({ success: true, message: "Movie rejected successfully" });
    });
  }
);

// ----------------- CMS AWARD -----------------

app.post(
  "/api/cms/awardsList2",
  cors(corsOptions),
  authorize(["admin"]),
  (req, res) => {
    const { name, year } = req.body;
    console.log("Request Body:", req.body);

    if (!name || name.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Award name is required" });
    }

    console.log("Award name to add:", name);

    if (!year || year.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Award year is required" });
    }

    console.log("Award year to add:", year);

    // Check if the country name already exists and hasn't been deleted
    const checkQuery = `SELECT * FROM awards WHERE name = ? AND year = ? AND deleted_at IS NULL`;

    connection.query(checkQuery, [name, year], (err, results) => {
      if (err) {
        console.error("Error in checkQuery:", err);
        return res
          .status(500)
          .json({ success: false, message: "Database error in check query" });
      }

      if (results.length > 0) {
        return res
          .status(400)
          .json({ success: false, message: "Award name already exists" });
      }

      // If the country does not exist, add it to the database
      const insertQuery = `INSERT INTO awards (name, year) VALUES (?, ?)`;

      connection.query(insertQuery, [name, year], (err, results) => {
        if (err) {
          console.error("Error in insertQuery:", err);
          return res.status(500).json({
            success: false,
            message: "Database error in insert query",
          });
        }

        res.json({ success: true, message: "Award added successfully" });
      });
    });
  }
);

app.put(
  "/api/cms/awardsList2/:id",
  cors(corsOptions),
  authorize(["admin"]),
  (req, res) => {
    const awardId = req.params.id;
    const { name, year } = req.body; // Get name and year from the body

    // Validate award name
    if (!name || name.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Award name is required" });
    }

    // Validate award year
    if (!year || year.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Award year is required" });
    }

    // SQL query to update the award
    const updateQuery = `UPDATE awards SET name = ?, year = ? WHERE id = ? AND deleted_at IS NULL`;

    // Execute the query
    connection.query(updateQuery, [name, year, awardId], (err, results) => {
      if (err) {
        console.error("Error in updateQuery:", err);
        return res
          .status(500)
          .json({ success: false, message: "Database error in update query" });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Award not found or already deleted",
        });
      }

      res.json({ success: true, message: "Award updated successfully" });
    });
  }
);

app.delete(
  "/api/cms/awardsList2/:id",
  cors(corsOptions),
  authorize(["admin"]),
  (req, res) => {
    const awardId = req.params.id;

    const deleteQuery = `UPDATE awards SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL`;

    connection.query(deleteQuery, [awardId], (err, results) => {
      if (err) {
        console.error("Error in deleteQuery:", err);
        return res
          .status(500)
          .json({ success: false, message: "Database error in delete query" });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Award not found or already deleted",
        });
      }

      res.json({ success: true, message: "Award deleted successfully" });
    });
  }
);

// ----------------- CMS GENRE -----------------
app.post(
  "/api/cms/genresList",
  cors(corsOptions),
  authorize(["admin"]),
  (req, res) => {
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Genre name is required" });
    }

    console.log("Genre to add:", name);

    // Check if the country name already exists and hasn't been deleted
    const checkQuery = `SELECT * FROM genres WHERE name = ? AND deleted_at IS NULL`;

    connection.query(checkQuery, [name], (err, results) => {
      if (err) {
        console.error("Error in checkQuery:", err);
        return res
          .status(500)
          .json({ success: false, message: "Database error in check query" });
      }

      if (results.length > 0) {
        return res
          .status(400)
          .json({ success: false, message: "Genre name already exists" });
      }

      // If the country does not exist, add it to the database
      const insertQuery = `INSERT INTO genres (name) VALUES (?)`;

      connection.query(insertQuery, [name], (err, results) => {
        if (err) {
          console.error("Error in insertQuery:", err);
          return res.status(500).json({
            success: false,
            message: "Database error in insert query",
          });
        }

        res.json({ success: true, message: "Genre added successfully" });
      });
    });
  }
);

app.put(
  "/api/cms/genresList/:id",
  cors(corsOptions),
  authorize(["admin"]),
  (req, res) => {
    const genreId = req.params.id;
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Genre name is required" });
    }

    const updateQuery = `UPDATE genres SET name = ? WHERE id = ? AND deleted_at IS NULL`;

    connection.query(updateQuery, [name, genreId], (err, results) => {
      if (err) {
        console.error("Error in updateQuery:", err);
        return res
          .status(500)
          .json({ success: false, message: "Database error in update query" });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Genre not found or already deleted",
        });
      }

      res.json({ success: true, message: "Genre updated successfully" });
    });
  }
);

app.delete(
  "/api/cms/genresList/:id",
  cors(corsOptions),
  authorize(["admin"]),
  (req, res) => {
    const genreId = req.params.id;

    const deleteQuery = `UPDATE genres SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL`;

    connection.query(deleteQuery, [genreId], (err, results) => {
      if (err) {
        console.error("Error in deleteQuery:", err);
        return res
          .status(500)
          .json({ success: false, message: "Database error in delete query" });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Genre not found or already deleted",
        });
      }

      res.json({ success: true, message: "Genre deleted successfully" });
    });
  }
);

// ! ===============================================  CMS ===============================================

var server = app.listen(port, () => {
  console.log("Server is running on " + domain);
  // console.log("Create auth by opening : " + `${domain}/authkey`);
});

// set timeout 1 minute
server.timeout = 60000;
