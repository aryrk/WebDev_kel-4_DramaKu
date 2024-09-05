import requests
import json

api_key = 'keep empty'
base_url = 'http://www.omdbapi.com/'

def get_API_key():
    with open('api.json') as json_file:
        data = json.load(json_file)
        data = data[0].get('omdb_api_key')
        return data

def load_movie_list(filename):
    with open(filename, 'r') as json_file:
        data = json.load(json_file)
        return data['movies']

def remove_duplicates(movie_list):
    unique_movies = list(set(movie_list))
    return unique_movies

def save_movie_list(movie_list, filename):
    with open(filename, 'w') as json_file:
        json.dump({"movies": movie_list}, json_file, indent=4)

def get_movie_data(movie_title):
    params = {
        't': movie_title, 
        'apikey': api_key,
        'plot': 'full'
    }
    
    response = requests.get(base_url, params=params)
    
    if response.status_code == 200:
        movie_data = response.json()
        return movie_data
    else:
        return None

def save_to_json(data, filename):
    with open(filename, 'w') as json_file:
        json.dump(data, json_file, indent=4)

def main():
    api_key = get_API_key()
    
    input_filename = 'all_popular_movies.json'
    output_filename = 'all_movies_data.json'
    
    movie_list = load_movie_list(input_filename)
    
    unique_movie_list = remove_duplicates(movie_list)
    
    save_movie_list(unique_movie_list, input_filename)
    print(f"Data film telah disimpan ke '{input_filename}' tanpa duplikasi.")
    
    all_movie_data = []

    for movie in unique_movie_list:
        movie_data = get_movie_data(movie)
        print(f"Mengambil data untuk film: {movie}")
        
        if movie_data:
            all_movie_data.append(movie_data)
            save_to_json(all_movie_data, output_filename)
            print(f"Data film '{movie}' berhasil diambil.")
        else:
            print(f"Gagal mengambil data untuk film: {movie}")

    save_to_json(all_movie_data, output_filename)
    print(f"Data semua film telah disimpan ke '{output_filename}' tanpa duplikasi.")

if __name__ == '__main__':
    main()
