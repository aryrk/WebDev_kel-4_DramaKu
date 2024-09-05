import json
import requests

tmdb_api_key = 'YOUR_TMDB_API_KEY'

def get_API_key():
    with open('api.json') as json_file:
        data = json.load(json_file)
        data = data[0].get('tmdb_api_key')
        return data

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

json_file_path = 'all_movies_data.json'
tmdb_api_key = get_API_key()
add_trailer_to_movies(json_file_path)
