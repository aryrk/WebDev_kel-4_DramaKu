import json
import os
import random

def load_json(filename):
    if os.path.exists(filename):
        with open(filename, 'r') as json_file:
            return json.load(json_file)
    else:
        return []

def save_to_json(data, filename):
    with open(filename, 'w') as json_file:
        json.dump(data, json_file, indent=4)
    
def cleanse_award(data):
    awards = []
    for award in data:
        print(award['Awards'])
        for i in range(len(award['Awards'])):
            if award['Awards'][i] != 'N/A' and award['Awards'][i] != 'N' and award['Awards'][i] != 'A' and award['Awards'][i] != '/':
                awards.append(award['Awards'][i])

    awards = list(set(awards))
    new_awards = []
    id = 0
    for award in awards:
        id += 1
        temp = {}
        temp['id'] = id
        temp['name'] = award
        temp['year'] = random.randint(2000, 2020)
        new_awards.append(temp)
    return new_awards

def split_string(str, delimiter):
    return [x.strip() for x in str.split(delimiter)]

def clanse_gendre(data):
    genres = []
    for genre in data:
        if 'Genre' in genre:
            get_gendre = split_string(genre['Genre'], ',')
            for i in range(len(get_gendre)):
                genres.append(get_gendre[i])
                print(get_gendre[i])
    genres = list(set(genres))
    new_genres = []
    id = 0
    for genre in genres:
        id += 1
        temp = {}
        temp['id'] = id
        temp['name'] = genre
        new_genres.append(temp)
    return new_genres

def cleanse_country(movie_data, actor_data):
    countries = []
    for movie in movie_data:
        if 'Country' in movie:
            get_country = split_string(movie['Country'], ',')
            for i in range(len(get_country)):
                countries.append(get_country[i])
                print(get_country[i])
                
    for actor in actor_data:
        if 'country' in actor_data[actor]:
            countries.append(actor_data[actor]['country'])
            print(actor_data[actor]['country'])
            
    countries = list(set(countries))
    new_countries = []
    id = 0
    for country in countries:
        id += 1
        temp = {}
        temp['id'] = id
        temp['name'] = country
        new_countries.append(temp)
    return new_countries

def find_country_id(country_data, country_name):
    print(country_name)
    for country in country_data:
        if country['name'] == country_name:
            return country['id']
    return None

def find_actor_id(actor_data, actor_name):
    for actor in actor_data:
        if actor['name'] == actor_name or actor['key'] == actor_name:
            return actor['id']
    return None

def find_genre_id(genre_data, genre_name):
    for genre in genre_data:
        if genre['name'] == genre_name:
            return genre['id']
    return None

def find_award_id(award_data, award_name):
    for award in award_data:
        if award['name'] == award_name:
            return award['id']
    return None

def find_movie_id(movie_data, movie_title):
    for movie in movie_data:
        if movie['title'] == movie_title:
            return movie['id']
    return None

def array_to_string(array, delimiter):
    return delimiter.join(array)

def create_movie_gendre(movie_id, gendres, genre_data):
    current_data = load_json('result_cleanse/movies_genres.json')
    for genre in split_string(gendres, ','):
        genre_id = find_genre_id(genre_data, genre)
        if genre_id is not None:
            temp = {}
            temp['movie_id'] = movie_id
            temp['genre_id'] = genre_id
            current_data.append(temp)
            with open('result_cleanse/movies_genres.json', 'w') as json_file:
                json.dump(current_data, json_file, indent=4)
        else:
            print('Genre not found:', genre)
            
def create_movie_award(movie_id, awards, award_data):
    current_data = load_json('result_cleanse/movies_awards.json')
    for award in awards:
        if award == 'N/A' or award == 'N' or award == 'A' or award == '/':
            continue
        award_id = find_award_id(award_data, award)
        if award_id is not None:
            temp = {}
            temp['movie_id'] = movie_id
            temp['award_id'] = award_id
            current_data.append(temp)
            with open('result_cleanse/movies_awards.json', 'w') as json_file:
                json.dump(current_data, json_file, indent=4)
        else:
            print('Award not found:', award)
            
def create_movie_actor(movie_id, actors, actor_data):
    current_data = load_json('result_cleanse/movies_actors.json')
    for actor in split_string(actors, ','):
        actor_id = find_actor_id(actor_data, actor)
        if actor_id is not None:
            temp = {}
            temp['movie_id'] = movie_id
            temp['actor_id'] = actor_id
            current_data.append(temp)
            with open('result_cleanse/movies_actors.json', 'w') as json_file:
                json.dump(current_data, json_file, indent=4)
        else:
            print('Actor not found:', actor)

def cleanse_movie(movie_data, country_data, actor_data, genre_data, award_data):
    movies = []
    last_trailer = 'N/A'
    last_poster = 'N/A'
    for movie in movie_data:
        if 'Response' in movie and movie['Response'] == 'False':
            continue
        
        print(movie['Title'])
        temp = {}
        temp['countries_id'] = find_country_id(country_data,split_string(movie['Country'], ',')[0])
        poster = movie['Poster']
        if poster != 'N/A':
            last_poster = poster
        else:
            poster = last_poster
        temp['poster'] = poster
        temp['title'] = movie['Title']
        temp['alternative_titles'] = "-"
        temp['year'] = movie['Year']
        temp['synopsis'] = movie['Plot']
        temp['availability'] = array_to_string(movie['Availability'], ',')
        temp['views'] = 0
        temp['genre'] = movie['Genre']
        temp['awards'] = movie['Awards']
        temp['actors'] = movie['Actors']
        trailer = movie['trailer']
        if trailer != 'Trailer not found':
            last_trailer = trailer
        else:
            trailer = last_trailer
        temp['trailer'] = trailer

        movies.append(temp)
        
    picket_actors = random.sample(actor_data, 15)
    
    
    movies = list({movie['title']:movie for movie in movies}.values())
    new_movies = []
    id = 0
    for movie in movies:
        id += 1
        temp = {}
        temp['id'] = id
        temp['countries_id'] = movie['countries_id']
        temp['poster'] = movie['poster']
        temp['title'] = movie['title']
        temp['alternative_titles'] = movie['alternative_titles']
        temp['year'] = movie['year']
        temp['synopsis'] = movie['synopsis']
        temp['availability'] = movie['availability']
        temp['views'] = movie['views']
        temp['trailer'] = movie['trailer']
        temp['status'] = 'accepted'
        new_movies.append(temp)
        
        create_movie_gendre(id, movie['genre'], genre_data)
        
        if movie['awards'] != 'N/A' or movie['awards'] != 'N' or movie['awards'] != 'A' or movie['awards'] != '/':
            print(movie['awards'])
            create_movie_award(id, movie['awards'], award_data)
            
        new_pick_actors = []
        for actor in split_string(movie['actors'], ','):
            new_pick_actors.append(actor)
        new_pick_actors = list(set(new_pick_actors))
        for actor in picket_actors:
            new_pick_actors.append(actor['name'])
        
        for actor in new_pick_actors:
            create_movie_actor(id, actor, actor_data)
        
        
    return new_movies
        
        
def cleanse_actor(actor_data, country_data):
    actors = []
    for actor in actor_data:
        print(actor_data[actor]['name'])
        if 'details' in actor_data[actor] and actor_data[actor]['details'] == 'Details not found':
            continue
        temp={}
        if 'id' in actor_data[actor]:
            temp['id'] = actor_data[actor]['id']
        else:
            temp['id'] = actor_data[actor]['name']
        temp['countries_id'] = find_country_id(country_data, actor_data[actor]['country'])
        temp['name'] = actor_data[actor]['name']
        temp['key'] = actor
        temp['picture_profile'] = actor_data[actor]['image_url']
        temp['birthdate'] = actor_data[actor]['birthday']
        
        actors.append(temp)
        
    actors = list({actor['id']:actor for actor in actors}.values())
    new_actors = []
    id = 0
    for actor in actors:
        id += 1
        temp = {}
        temp['id'] = id
        temp['countries_id'] = actor['countries_id']
        temp['name'] = actor['name']
        temp['key'] = actor['key']
        temp['picture_profile'] = actor['picture_profile']
        temp['birthdate'] = actor['birthdate']
        new_actors.append(temp)
        
    return new_actors

def cleane_comments(comments_data,movie_data):
    comments = []
    id = 0
    
    for comment in comments_data:
        print(f"Movie: {comment['Title']}")
        movie_id = find_movie_id(movie_data, comment['Title'])
        if movie_id is None:
            print('Movie not found:', comment['Title'])
            continue
        
        if 'Reviews' not in comment or comment['Reviews'] == 'No reviews found':
            continue
        
        for review in comment['Reviews']:
            id += 1
            temp = {}
            temp['id'] = id
            temp['movie_id'] = movie_id
            temp['username'] = review['author']
            temp['profile_picture'] = f"https://image.tmdb.org/t/p/w92/{review['author_details']['avatar_path']}"
            if temp['profile_picture'] == 'https://image.tmdb.org/t/p/w92/None':
                temp['profile_picture'] = 'N/A'
            print(type(review['author_details']['rating']))
            rating = 0
            if review['author_details']['rating'] != None or type(review['author_details']['rating']) == float:
                rating = int(int(review['author_details']['rating'])/2)
            temp['rate'] = rating
            temp['comments'] = review['content']
            temp['comment_date'] = review['created_at']
            temp['status'] = 'accepted'
            
            comments.append(temp)
    return comments
        

def main():
    movie_file = 'result/all_movies_data.json'
    actor_file = 'result/actor_details.json'
    comment_file = 'result/movies_with_reviews.json'
    
    if os.path.exists('result_cleanse'):
        os.system('rm -rf result_cleanse')
    os.mkdir('result_cleanse')
    
    
    movie_data = load_json(movie_file)
    actor_data = load_json(actor_file)
    comment_data = load_json(comment_file)
    
    awards = cleanse_award(movie_data)
    save_to_json(awards, 'result_cleanse/awards.json')
    
    genre = clanse_gendre(movie_data)
    save_to_json(genre, 'result_cleanse/genres.json')
    
    contries = cleanse_country(movie_data, actor_data)
    save_to_json(contries, 'result_cleanse/countries.json')
    
    actors = cleanse_actor(actor_data, contries)
    save_to_json(actors, 'result_cleanse/actors.json')
    
    movies = cleanse_movie(movie_data, contries, actors, genre, awards)
    save_to_json(movies, 'result_cleanse/movies.json')
    
    comments = cleane_comments(comment_data, movies)
    save_to_json(comments, 'result_cleanse/comments.json')
    
    
main()