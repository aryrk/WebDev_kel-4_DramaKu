import json
import requests

tmdb_api_key = 'YOUR_TMDB_API_KEY'

def get_API_key():
    with open('api.json') as json_file:
        data = json.load(json_file)
        data = data[0].get('tmdb_api_key')
        return data

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
    
    movies_with_reviews = {"movies": []}
    
    for movie_title in data.get('movies', []):
        movie_id = get_movie_id_by_title(movie_title)
        if movie_id:
            reviews = get_movie_reviews(movie_id)
            movies_with_reviews["movies"].append({
                "Title": movie_title,
                "Reviews": reviews if reviews else 'No reviews found'
            })
    
    with open(output_json_file, 'w') as file:
        json.dump(movies_with_reviews, file, indent=4)
    print(f"Reviews added and saved to {output_json_file}")


tmdb_api_key = get_API_key()
input_json_file = 'all_popular_movies.json'
output_json_file = 'movies_with_reviews.json'

add_reviews_to_movies(input_json_file, output_json_file)
