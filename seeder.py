import mysql.connector
import json
import os

db = mysql.connector.connect(
    host="localhost",      
    user="root",            
    password="",    
    database="plutocinema"
)

cursor = db.cursor()

cursor.execute("SET FOREIGN_KEY_CHECKS = 0;")

tables = ["movies", "countries", "movies_genres", "genres", "movies_awards", 
          "awards", "movies_actors", "actors", "comments", "users"]

for table in tables:
    cursor.execute(f"DROP TABLE IF EXISTS {table}")
    
cursor.execute("SET FOREIGN_KEY_CHECKS = 1;")

cursor.execute("""
CREATE TABLE countries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
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
  alternative_titles VARCHAR(255) NOT NULL,
  year YEAR NOT NULL,
  synopsis TEXT NOT NULL,
  availability VARCHAR(255) NOT NULL,
  views INT NOT NULL,
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
  name VARCHAR(255) NOT NULL UNIQUE,
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
  name VARCHAR(255) NOT NULL UNIQUE,
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
CREATE TABLE comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  movie_id INT NOT NULL,
  username VARCHAR(255) NOT NULL,
  profile_picture VARCHAR(255),
  rate FLOAT NOT NULL,
  comments TEXT NOT NULL,
  comment_date DATE NOT NULL,
  status ENUM('pending', 'rejected', 'accepted') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  FOREIGN KEY (movie_id) REFERENCES movies(id)
)
""")

cursor.execute("""
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'writer') NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL
)
""")

def load_json_data(file_name):
    file_path = os.path.join(os.getcwd(), file_name)
    with open(file_path, 'r') as file:
        return json.load(file)

countries_data = load_json_data('result_cleanse\countries.json')
award_data = load_json_data('result_cleanse\\awards.json')
genres_data = load_json_data('result_cleanse\\genres.json')
actor_data = load_json_data('result_cleanse\\actors.json')
movie_data = load_json_data('result_cleanse\\movies.json')
comments_data = load_json_data('result_cleanse\\comments.json')
movie_actor_data = load_json_data('result_cleanse\\movies_actors.json')
movie_award_data = load_json_data('result_cleanse\\movies_awards.json')
movie_genre_data = load_json_data('result_cleanse\\movies_genres.json')

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
    cursor.execute("""
        INSERT INTO movies (countries_id, poster, title, alternative_titles, year, synopsis, availability, views, trailer, created_at, updated_at, status)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, NOW(), NOW(), %s)
    """, (movie['countries_id'], movie['poster'], movie['title'], movie['alternative_titles'], movie['year'], movie['synopsis'], movie['availability'], movie['views'], movie['trailer'], movie['status']))

for comment in comments_data:
    print(comment['username'])
    rate = 0
    if comment['rate'] != None:
        rate = comment['rate']
    profile_picture = ""
    if comment['profile_picture'] != "N/A":
        profile_picture = comment['profile_picture']
    cursor.execute("""
        INSERT INTO comments (movie_id, username, profile_picture, rate, comments, comment_date, created_at, updated_at, status)
        VALUES (%s, %s, %s, %s, %s, %s, NOW(), NOW(), %s)
    """, (comment['movie_id'], comment['username'], profile_picture,rate, comment['comments'], comment['comment_date'], comment['status']))

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
