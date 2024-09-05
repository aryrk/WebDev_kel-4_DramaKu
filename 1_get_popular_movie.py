import requests
import json

tmdb_api_key = 'YOUR_TMDB_API_KEY'

base_url = 'https://api.themoviedb.org/3/movie/popular'

def get_API_key():
    with open('api.json') as json_file:
        data = json.load(json_file)
        data = data[0].get('tmdb_api_key')
        return data

def get_popular_movies(api_key, page=1):
    params = {
        'api_key': api_key,
        'language': 'en-US',
        'page': page
    }
    response = requests.get(base_url, params=params)
    if response.status_code == 200:
        movies_data = response.json()
        return movies_data['results']
    else:
        print(f"Failed to fetch data: {response.status_code}")
        return None

def save_to_json(data, filename):
    with open(filename, 'w') as json_file:
        json.dump(data, json_file, indent=4)

def main():
    tmdb_api_key = get_API_key()
    output_filename = 'all_popular_movies.json'
    all_movie_names = []
    page = 1
    max_requests_per_day = 100
    requests_made = 0

    while requests_made < max_requests_per_day:
        movies = get_popular_movies(tmdb_api_key, page)
        if not movies or len(movies) == 0:
            break

        for movie in movies:
            all_movie_names.append(movie['title'])
            print(f"Added movie: {movie['title']}")

        requests_made += 1
        page += 1

    unique_movie_names = list(set(all_movie_names))
    save_to_json({"movies": unique_movie_names}, output_filename)
    print(f"Data of popular movies has been saved to '{output_filename}'.")

if __name__ == '__main__':
    main()
