import mysql.connector
import json
import os
from dotenv import load_dotenv
import time
load_dotenv()

db = ""

def connectDB():
    global db
    while True:
        try:
            db = mysql.connector.connect(
                host=os.getenv("DB_HOST"),
                user=os.getenv("DB_USER"),
                password=os.getenv("DB_PASSWORD"),
                database=os.getenv("DB_NAME")
            )
            break
        except:
            print("Reconnecting to database in 5 seconds...")
            time.sleep(5)
            continue
    
connectDB()

cursor = db.cursor()

cursor.execute("SET FOREIGN_KEY_CHECKS = 0;")

tables = ["movies", "countries", "movies_genres", "genres", "movies_awards", 
          "awards", "movies_actors", "actors", "comments", "users", "tokens"]

for table in tables:
    cursor.execute(f"DROP TABLE IF EXISTS {table}")
    
cursor.execute("SET FOREIGN_KEY_CHECKS = 1;")

cursor.execute("""
CREATE TABLE countries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL
)
""")

cursor.execute("""
CREATE TABLE movies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  countries_id INT NOT NULL,
  poster VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  alternative_titles VARCHAR(255) NULL,
  year YEAR NOT NULL,
  synopsis TEXT NOT NULL,
  availability VARCHAR(255) NOT NULL,
  views INT NOT NULL DEFAULT 0,
  trailer VARCHAR(255) NOT NULL,
  status ENUM('pending', 'rejected', 'accepted') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  FOREIGN KEY (countries_id) REFERENCES countries(id)
)
""")

cursor.execute("""
CREATE TABLE genres (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL
)
""")

cursor.execute("""
CREATE TABLE movies_genres (
  movie_id INT NOT NULL,
  genre_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  FOREIGN KEY (movie_id) REFERENCES movies(id),
  FOREIGN KEY (genre_id) REFERENCES genres(id)
)
""")

cursor.execute("""
CREATE TABLE awards (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  year YEAR NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL
)
""")

cursor.execute("""
CREATE TABLE movies_awards (
  movie_id INT NOT NULL,
  award_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  FOREIGN KEY (movie_id) REFERENCES movies(id),
  FOREIGN KEY (award_id) REFERENCES awards(id)
)
""")

cursor.execute("""
CREATE TABLE actors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  countries_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  picture_profile VARCHAR(255) NOT NULL,
  birthdate DATE NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  FOREIGN KEY (countries_id) REFERENCES countries(id)
)
""")

cursor.execute("""
CREATE TABLE movies_actors (
  movie_id INT NOT NULL,
  actor_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  FOREIGN KEY (movie_id) REFERENCES movies(id),
  FOREIGN KEY (actor_id) REFERENCES actors(id)
)
""")

cursor.execute("""
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  profile_picture VARCHAR(255) NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  google_id VARCHAR(255) NULL,
  is_verified BOOLEAN NOT NULL DEFAULT 0,
  reset_password_token VARCHAR(255) NULL,
  reset_password_expires TIMESTAMP NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'writer') NOT NULL DEFAULT 'writer',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL
)
""")

cursor.execute("""
CREATE TABLE comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
    movie_id INT NOT NULL,
  user_id INT NOT NULL,
  rate FLOAT NOT NULL,
  comments TEXT NOT NULL,
  comment_date DATE NOT NULL,
  status ENUM('pending', 'rejected', 'accepted') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  FOREIGN KEY (movie_id) REFERENCES movies(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
)
""")

cursor.execute("""
               CREATE TABLE tokens (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  token VARCHAR(255),
  token_type VARCHAR(50), -- 'email_confirmation' atau 'password_reset'
  expires_at TIMESTAMP
);

               """)



def load_json_data(file_name):
    file_path = os.path.join(os.getcwd(), file_name)
    with open(file_path, 'r') as file:
        return json.load(file)

countries_data = load_json_data('result_cleanse/countries.json')
award_data = load_json_data('result_cleanse/awards.json')
genres_data = load_json_data('result_cleanse/genres.json')
actor_data = load_json_data('result_cleanse/actors.json')
movie_data = load_json_data('result_cleanse/movies.json')
comments_data = load_json_data('result_cleanse/comments.json')
movie_actor_data = load_json_data('result_cleanse/movies_actors.json')
movie_award_data = load_json_data('result_cleanse/movies_awards.json')
movie_genre_data = load_json_data('result_cleanse/movies_genres.json')
users_data = load_json_data('result_cleanse/users.json')

for country in countries_data:
    print(country['name'])
    cursor.execute("""
        INSERT INTO countries (name, created_at, updated_at)
        VALUES (%s, NOW(), NOW())
    """, (country['name'],))
    
for award in award_data:
    print(award['name'])
    cursor.execute("""
        INSERT INTO awards (name, year, created_at, updated_at)
        VALUES (%s, %s, NOW(), NOW())
    """, (award['name'], award['year']))

for genre in genres_data:
    print(genre['name'])
    cursor.execute("""
        INSERT INTO genres (name, created_at, updated_at)
        VALUES (%s, NOW(), NOW())
    """, (genre['name'],))

for actor in actor_data:
    print(actor['name'])
    picture = ""
    if actor['picture_profile'] != None:
        picture = actor['picture_profile']
    cursor.execute("""
        INSERT INTO actors (countries_id, name, picture_profile, birthdate, created_at, updated_at)
        VALUES (%s, %s, %s, %s, NOW(), NOW())
    """, (actor['countries_id'], actor['name'], picture, actor['birthdate']))
    
for movie in movie_data:
    print(movie['title'])
    year = movie['year']
    if not isinstance(year, int) or year < 1900 or year > 2100:
        year = time.strftime("%Y")
    cursor.execute("""
        INSERT INTO movies (countries_id, poster, title, alternative_titles, year, synopsis, availability, views, trailer, created_at, updated_at, status)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, NOW(), NOW(), %s)
    """, (movie['countries_id'], movie['poster'], movie['title'], movie['alternative_titles'], year, movie['synopsis'], movie['availability'], movie['views'], movie['trailer'], movie['status']))

for user in users_data:
    print(user['username'])
    profile_picture = ""
    if user['profile_picture'] != "N/A":
        profile_picture = user['profile_picture']
    # cursor.execute("""
    #     INSERT INTO users (username, profile_picture, email, password, role, created_at, updated_at, email_validated)
    #     VALUES (%s, %s, %s, %s, %s, NOW(), NOW(), NOW())
    # """, (user['username'], profile_picture, user['email'], user['password'], user['role']))
    cursor.execute("""
        INSERT INTO users (username, profile_picture, email, password, role, created_at, updated_at)
        VALUES (%s, %s, %s, %s, %s, NOW(), NOW())
    """, (user['username'], profile_picture, user['email'], user['password'], user['role']))

cursor.execute("""
        INSERT INTO users (username, email, password, role, created_at, updated_at, is_verified)
        VALUES (%s, %s, %s, %s, NOW(), NOW(), %s)
    """, ('admin', 'plutocinemaofficial@gmail.com','$2b$10$bu6xfSKovaVj.iXXgW9Iwed20OsdHbFV9GuvsN2E5oqNuTEr983Vi', 'admin', '1'))
    

from datetime import datetime

for comment in comments_data:
    print(comment['movie_id'])
    rate = 0
    if comment['rate'] != None:
        rate = comment['rate']
    
    try:
        comment_date = datetime.strptime(comment['comment_date'], '%Y-%m-%dT%H:%M:%S.%fZ').date()
    except ValueError:
        comment_date = datetime.now().date()
    
    cursor.execute("""
        INSERT INTO comments (movie_id, user_id, rate, comments, comment_date, status, created_at, updated_at)
        VALUES (%s, %s, %s, %s, %s, %s, NOW(), NOW())
    """, (comment['movie_id'], comment['user_id'], rate, comment['comments'], comment_date, comment['status']))

for movie_actor in movie_actor_data:
    print(movie_actor['movie_id'])
    cursor.execute("""
        INSERT INTO movies_actors (movie_id, actor_id, created_at, updated_at)
        VALUES (%s, %s, NOW(), NOW())
    """, (movie_actor['movie_id'], movie_actor['actor_id']))
    
for movie_award in movie_award_data:
    print(movie_award['movie_id'])
    cursor.execute("""
        INSERT INTO movies_awards (movie_id, award_id, created_at, updated_at)
        VALUES (%s, %s, NOW(), NOW())
    """, (movie_award['movie_id'], movie_award['award_id']))
    
for movie_genre in movie_genre_data:
    print(movie_genre['movie_id'])
    cursor.execute("""
        INSERT INTO movies_genres (movie_id, genre_id, created_at, updated_at)
        VALUES (%s, %s, NOW(), NOW())
    """, (movie_genre['movie_id'], movie_genre['genre_id']))

db.commit()

cursor.close()
db.close()
