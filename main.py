import requests
import json
import random
import os

def get_API_key(key):
    with open('api.json') as json_file:
        data = json.load(json_file)
        return data[0].get(key)
tmdb_api_key = get_API_key("tmdb_api_key")
api_key = get_API_key("omdb_api_key")
base_url_tmdb = 'https://api.themoviedb.org/3/movie/popular'
base_url_omdb = 'http://www.omdbapi.com/'


def get_popular_movies(api_key, page=1):
    params = {
        'api_key': api_key,
        'language': 'en-US',
        'page': page
    }
    response = requests.get(base_url_tmdb, params=params)
    if response.status_code == 200:
        movies_data = response.json()
        return movies_data['results']
    else:
        print(f"Failed to fetch data: {response.status_code}")
        return None
    
def load_json(filename):
    with open(filename, 'r') as file:
        return json.load(file)

def save_to_json(data, filename):
    with open(filename, 'w') as json_file:
        json.dump(data, json_file, indent=4)

def load_movie_list(filename):
    with open(filename, 'r') as json_file:
        data = json.load(json_file)
        return data['movies']

def remove_duplicates(movie_list):
    unique_movies = list(set(movie_list))
    return unique_movies

def get_movie_data(movie_title):
    params = {
        't': movie_title, 
        'apikey': api_key,
        'plot': 'full'
    }
    
    response = requests.get(base_url_omdb, params=params)
    
    if response.status_code == 200:
        movie_data = response.json()
        return movie_data
    else:
        return None

def get_actor_details(actor_name):
    tmdb_actor_search_url = 'https://api.themoviedb.org/3/search/person'
    params = {
        'api_key': tmdb_api_key,
        'query': actor_name,
        'language': 'en-US'
    }
    response = requests.get(tmdb_actor_search_url, params=params)
    if response.status_code == 200:
        actor_data = response.json()
        if actor_data['results']:
            actor_info = actor_data['results'][0]
            actor_details = {**actor_info, 'image_url': get_profile_image_url(actor_info.get('profile_path'))}
            print(f"Found details for actor: {actor_name}")
            return actor_details
    return {'name': actor_name, 'details': 'Details not found'}

def get_profile_image_url(profile_path, size='w185'):
    base_url = 'https://image.tmdb.org/t/p/'
    if profile_path:
        return f"{base_url}{size}{profile_path}"
    return None

def process_movie_data(json_data):
    actor_details = {}
    for movie in json_data:
        actors = movie.get('Actors', '')
        actor_list = [actor.strip() for actor in actors.split(',')]
        
        for actor in actor_list:
            if actor not in actor_details:
                details = get_actor_details(actor)
                actor_details[actor] = details
                save_to_json(actor_details, 'actor_details.json')
                print(f"Added details for actor: {actor}")

    return actor_details

def get_movie_trailer_by_title(movie_title):
    print(f"Searching for trailer of {movie_title}")
    tmdb_movie_search_url = 'https://api.themoviedb.org/3/search/movie'
    params = {
        'api_key': tmdb_api_key,
        'query': movie_title,
        'language': 'en-US'
    }
    response = requests.get(tmdb_movie_search_url, params=params)
    if response.status_code == 200:
        search_results = response.json()
        if search_results['results']:
            tmdb_movie_id = search_results['results'][0]['id']
            tmdb_trailer_url = f'https://api.themoviedb.org/3/movie/{tmdb_movie_id}/videos'
            trailer_response = requests.get(tmdb_trailer_url, params={'api_key': tmdb_api_key})
            if trailer_response.status_code == 200:
                trailer_data = trailer_response.json()
                for video in trailer_data['results']:
                    if video['type'] == 'Trailer' and video['site'] == 'YouTube':
                        print(f"Found trailer for {movie_title}")
                        return f"https://www.youtube.com/watch?v={video['key']}"
    return None

def add_trailer_to_movies(json_file_path):
    with open(json_file_path, 'r') as file:
        movies = json.load(file)
    
    for movie in movies:
        movie_title = movie.get('Title')
        if movie_title:
            trailer_url = get_movie_trailer_by_title(movie_title)
            movie['trailer'] = trailer_url if trailer_url else 'Trailer not found'
    
    with open(json_file_path, 'w') as file:
        json.dump(movies, file, indent=4)
    print(f"Trailer URLs added and saved to {json_file_path}")

    
def add_streaming_info_to_movies(input_json_file, output_json_file):
    streaming_services = ['Netflix', 'Hulu', 'Amazon Prime', 'Disney+', 'HBO Max', 'Apple TV+', 'Peacock', 'Paramount+', 'Discovery+', 'Starz', 'Showtime', 'Hulu', 'Crunchyroll', 'Funimation', 'VRV', 'HBO Max', 'Apple TV+', 'Peacock', 'Paramount+', 'Discovery+', 'Starz', 'Showtime', 'Hulu', 'Crunchyroll', 'Funimation', 'VRV']
    streaming_services = list(set(streaming_services))

    with open(input_json_file, 'r') as file:
        data = json.load(file)
        
    for movie in data:
        num_services = random.randint(1, len(streaming_services))
        selected_services = random.sample(streaming_services, num_services)
        movie['Availability'] = selected_services
        print(f"Added streaming info for movie: {movie.get('Title')}")
    
    with open(output_json_file, 'w') as file:
        json.dump(data, file, indent=4)
        
def add_awards_to_movies(input_json_file, output_json_file):
    awards = ['Best Picture', 'Best Actor', 'Best Actress', 'Best Director', 'Best Original Screenplay', 'Best Adapted Screenplay', 'Best Animated Feature', 'Best International Feature', 'Best Documentary Feature', 'Best Original Score', 'Best Original Song', 'Best Sound', 'Best Production Design', 'Best Cinematography', 'Best Makeup and Hairstyling', 'Best Costume Design', 'Best Film Editing', 'Best Visual Effects', 'Best Animated Short', 'Best Documentary Short', 'Best Live Action Short']
    awards = list(set(awards))
    
    with open(input_json_file, 'r') as file:
        data = json.load(file)
        
    for movie in data:
        num_awards = random.randint(0, len(awards))
        selected_awards = random.sample(awards, num_awards)
        if num_awards > 0:
            movie['Awards'] = selected_awards
        else:
            movie['Awards'] = 'N/A'
            
        print(f"Added awards info for movie: {movie.get('Title')}")
    
    with open(output_json_file, 'w') as file:
        json.dump(data, file, indent=4)
    
def add_movie_id_to_movies(input_json_file, output_json_file):
    with open(input_json_file, 'r') as file:
        data = json.load(file)
    
    for movie in data:
        movie_id = get_movie_id_by_title(movie.get('Title'))
        movie['movie_id'] = movie_id if movie_id else 'Movie ID not found'
        
    with open(output_json_file, 'w') as file:
        json.dump(data, file, indent=4)
    print(f"Movie IDs added and saved to {output_json_file}")

def get_movie_id_by_title(movie_title):
    tmdb_movie_search_url = 'https://api.themoviedb.org/3/search/movie'
    params = {
        'api_key': tmdb_api_key,
        'query': movie_title,
        'language': 'en-US'
    }
    response = requests.get(tmdb_movie_search_url, params=params)
    if response.status_code == 200:
        search_results = response.json()
        if search_results['results']:
            return search_results['results'][0]['id']
    return None

def get_movie_reviews(movie_id):
    tmdb_reviews_url = f'https://api.themoviedb.org/3/movie/{movie_id}/reviews'
    params = {'api_key': tmdb_api_key, 'language': 'en-US'}
    response = requests.get(tmdb_reviews_url, params=params)
    print(f"Getting reviews for movie ID: {movie_id}")
    if response.status_code == 200:
        review_data = response.json()
        print(f"Found {len(review_data['results'])} reviews")
        return review_data['results']
    return []

def add_reviews_to_movies(input_json_file, output_json_file):
    with open(input_json_file, 'r') as file:
        data = json.load(file)
    
    reviews = []
    
    for movie_title in data:
        movie_id = get_movie_id_by_title(movie_title)
        if movie_id:
            data = get_movie_reviews(movie_id)
            profile_url = "N/A"
            if data:
                total_data = len(data)
                for i in range(total_data):
                    profile_url = get_profile_image_url(data[i]['author_details']['avatar_path'], 'w92')
                    data[i]['author_details']['avatar_path'] = profile_url
                  
            reviews.append({
                "Title": movie_title,
                "movie_id": movie_id,
                "Reviews": data if data else 'No reviews found',
            })
            
            save_to_json(reviews, output_json_file)
            
    
    with open(output_json_file, 'w') as file:
        json.dump(reviews, file, indent=4)
    print(f"Reviews added and saved to {output_json_file}")

def main():
    tmdb_api_key = get_API_key("tmdb_api_key")
    api_key = get_API_key("omdb_api_key")
    
    if not os.path.exists('result'):
        os.makedirs('result')

    output_filename = 'result/all_popular_movies.json'
    all_movie_names = []
    page = 1
    max_movie = 5
    movie_get = 0

    while movie_get < max_movie:
        movies = get_popular_movies(tmdb_api_key, page)
        if not movies or len(movies) == 0:
            break

        for movie in movies:
            all_movie_names.append(movie['title'])
            save_to_json({"movies": all_movie_names}, output_filename)
            print(f"Added movie: {movie['title']}")

            movie_get += 1
        page += 1

    unique_movie_names = list(set(all_movie_names))
    save_to_json({"movies": unique_movie_names}, output_filename)
    print(f"Data of popular movies has been saved to '{output_filename}'.")
    
    input_filename = 'result/all_popular_movies.json'
    output_filename_movies = 'result/all_movies_data.json'
    
    movie_list = load_movie_list(input_filename)
    
    unique_movie_list = remove_duplicates(movie_list)
    save_to_json(unique_movie_list, input_filename)
    print(f"Data film telah disimpan ke '{input_filename}' tanpa duplikasi.")
    
    all_movie_data = []

    for movie in unique_movie_list:
        movie_data = get_movie_data(movie)
        print(f"Mengambil data untuk film: {movie}")
        
        if movie_data:
            all_movie_data.append(movie_data)
            save_to_json(all_movie_data, output_filename_movies)
            print(f"Data film '{movie}' berhasil diambil.")
        else:
            print(f"Gagal mengambil data untuk film: {movie}")
            

    save_to_json(all_movie_data, output_filename_movies)
    print(f"Data semua film telah disimpan ke '{output_filename_movies}'.")
    
    add_movie_id_to_movies(output_filename_movies, output_filename_movies)
    print(f"Movie IDs have been added to '{output_filename_movies}'")
    
    add_streaming_info_to_movies(output_filename_movies, output_filename_movies)
    print(f"Streaming info has been added to '{output_filename_movies}'")
    
    add_awards_to_movies(output_filename_movies, output_filename_movies)
    print(f"Awards info has been added to '{output_filename_movies}'")

    json_data = load_json(output_filename_movies)
    actor_details = process_movie_data(json_data)
    save_to_json(actor_details, 'result/actor_details.json')
    print(f"Actor details have been saved to 'actor_details.json'.")

    json_file_path = output_filename_movies
    add_trailer_to_movies(json_file_path)

    input_json_file = input_filename
    output_json_file = 'result/movies_with_reviews.json'
    add_reviews_to_movies(input_json_file, output_json_file)

if __name__ == '__main__':
    main()
