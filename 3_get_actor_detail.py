import json
import requests
tmdb_api_key = 'YOUR_TMDB_API_KEY'


def get_API_key():
    with open('api.json') as json_file:
        data = json.load(json_file)
        data = data[0].get('tmdb_api_key')
        return data

def load_json(filename):
    with open(filename, 'r') as file:
        return json.load(file)

def save_to_json(data, filename):
    with open(filename, 'w') as file:
        json.dump(data, file, indent=4)
        
def get_profile_image_url(profile_path, size='w185'):
    base_url = 'https://image.tmdb.org/t/p/'
    if profile_path:
        return f"{base_url}{size}{profile_path}"
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
            # actor_details = {
            #     'name': actor_info.get('name', actor_name),
            #     'profile_path': actor_info.get('profile_path', None),
            #     'image_url': get_profile_image_url(actor_info.get('profile_path'))
            # }
            # merge actor info with actor details
            actor_details = {**actor_info, 'image_url': get_profile_image_url(actor_info.get('profile_path'))}
            print(f"Found details for actor: {actor_name}")
            return actor_details
    return {'name': actor_name, 'details': 'Details not found'}

def process_movie_data(json_data):
    actor_details = {}
    for movie in json_data:
        actors = movie.get('Actors', '')
        actor_list = [actor.strip() for actor in actors.split(',')]
        
        for actor in actor_list:
            if actor not in actor_details:
                details = get_actor_details(actor)
                actor_details[actor] = details

    return actor_details

def main():
    tmdb_api_key = get_API_key()
    input_filename = 'all_movies_data.json'
    output_filename = 'actor_details.json'
    
    json_data = load_json(input_filename)
    actor_details = process_movie_data(json_data)
    save_to_json(actor_details, output_filename)
    print(f"Actor details have been saved to '{output_filename}'.")

if __name__ == '__main__':
    main()
