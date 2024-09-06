import json
import os
import random

def load_json(filename):
    with open(filename, 'r') as file:
        return json.load(file)

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
    for genre in split_string(gendres, ','):
        genre_id = find_genre_id(genre_data, genre)
        if genre_id is not None:
            temp = {}
            temp['movie_id'] = movie_id
            temp['genre_id'] = genre_id
            with open('result_cleanse/movies_genres.json', 'a') as json_file:
                json.dump(temp, json_file, indent=4)
                json_file.write('\n')
        else:
            print('Genre not found:', genre)
            
def create_movie_award(movie_id, awards, award_data):
    for award in awards:
        award_id = find_award_id(award_data, award)
        if award_id is not None:
            temp = {}
            temp['movie_id'] = movie_id
            temp['award_id'] = award_id
            with open('result_cleanse/movies_awards.json', 'a') as json_file:
                json.dump(temp, json_file, indent=4)
                json_file.write('\n')
        else:
            print('Award not found:', award)
            
def create_movie_actor(movie_id, actors, actor_data):
    for actor in split_string(actors, ','):
        actor_id = find_actor_id(actor_data, actor)
        if actor_id is not None:
            temp = {}
            temp['movie_id'] = movie_id
            temp['actor_id'] = actor_id
            with open('result_cleanse/movies_actors.json', 'a') as json_file:
                json.dump(temp, json_file, indent=4)
                json_file.write('\n')
        else:
            print('Actor not found:', actor)

def cleanse_movie(movie_data, country_data, actor_data, genre_data, award_data):
    movies = []
    last_trailer = 'N/A'
    for movie in movie_data:
        if 'Response' in movie and movie['Response'] == 'False':
            continue
        
        print(movie['Title'])
        temp = {}
        temp['countries_id'] = find_country_id(country_data,split_string(movie['Country'], ',')[0])
        temp['poster'] = movie['Poster']
        temp['title'] = movie['Title']
        temp['alternative_titles'] = "-"
        rate = 0
        if 'imdbRating' in movie and movie['imdbRating'] != 'N/A':
            rate = movie['imdbRating']
            rate = float(rate)
            rate = rate/2
        temp['rate'] = rate
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
        temp['rate'] = movie['rate']
        temp['year'] = movie['year']
        temp['synopsis'] = movie['synopsis']
        temp['availability'] = movie['availability']
        temp['views'] = movie['views']
        temp['trailer'] = movie['trailer']
        new_movies.append(temp)
        
        create_movie_gendre(id, movie['genre'], genre_data)
        create_movie_award(id, movie['awards'], award_data)
        create_movie_actor(id, movie['actors'], actor_data)
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
    # sample input
    # {
    #     "Title": "Cinderella",
    #     "movie_id": 150689,
    #     "Reviews": [
    #         {
    #             "author": "Reno",
    #             "author_details": {
    #                 "name": "Reno",
    #                 "username": "Rangan",
    #                 "avatar_path": "https://image.tmdb.org/t/p/w92/6ZpVUJzqXMzH35VprEtnX0sNI3.jpg",
    #                 "rating": 7.0
    #             },
    #             "content": "> Probably the best live-shot Cinderella I've seen.\r\n\r\nDisney has done it again. Everybody knows Cinderella story and what this film gave was as it is with the help of modern CGI works. When I heard about the Disney's live-shot version is getting ready, I had a serious doubt, but not anymore. Nowadays, the filmmakers know how to pull it off a big budget movie with ease. Especially from Hollywood, if one market fails, it will raise in another as the recent example was 'Age of Extinction'. I am glad this movie met a great success despite it was not a surprise material as a story, but was as the quality of product.\r\n\r\nThe movie runs nearly for 100 minutes, that does not feel too long as the narration had a wonderful pace. Everything was awesomely handled by the director of 'Thor'. It's a new era of the live-shot movies, which borrows the stories from the fairytales, folklore and classical animations. Recent 'Maleficent' was one of the great examples and this film as well enters the book of triumph.\r\n\r\nLily James was very good, I haven't seen her much, because she's kind of a new actress in the spotlight. She's cute and adorable, I love to see her in many movies in the future. While Cate Blanchett, I never had any disbelief in her and she delivered it perfectly. An ideal movie for a family to watch at the weekend. I think children would love it, so at least watch it for them, with them.\r\n\r\n7/10",
    #             "created_at": "2015-07-30T17:29:15.252Z",
    #             "id": "55ba5eebc3a3684af1004ad4",
    #             "updated_at": "2024-05-16T15:18:27.155Z",
    #             "url": "https://www.themoviedb.org/review/55ba5eebc3a3684af1004ad4"
    #         },
    #         {
    #             "author": "Kamurai",
    #             "author_details": {
    #                 "name": "Kamurai",
    #                 "username": "Kamurai",
    #                 "avatar_path": "https://image.tmdb.org/t/p/w92/sKeC7qZLAKreuwxH4x6U3mN7Aa8.jpg",
    #                 "rating": 6.0
    #             },
    #             "content": "Good watch, could watch again, and can recommend.\r\n\r\nI'm honestly concerned that this isn't a movie that anyone is going to watch again and again, but it's a solid watch, and a definite improvement over the 1950 animated classic, though I can't say this touches \"Ever After\" for me.\r\n\r\nThe original story was somewhat lacking, but had fantastic animation for the time, along with voice acting and writing parallel with the movies of its time.  I'm somewhat sad to say that is a fair difference in quality compared to modern standards.\r\n\r\nDisney very much kept this dumbed down for younger audiences, and I expect them to have more fun with scenes like \"lizard footman eats a fly\", but in the very least they steered away from realistic cg talking animals (a creepy factor in many of the live action remakes), though they do make a very specific nod to it at the beginning of the movie.\r\n\r\nWhile I do think they managed to improve on almost ever facet of the original, it certainly isn't without flaws.\r\n\r\nThe casting is all over the place, which, I'm sure, affected the odd character development.  Oddly, the less important characters, the men, in this case, are fine, I really have zero to say other than I rather like Nonso Anozie in anything he's in, and I did think the bit about \"Kit\" was a rather inspired thing.\r\n\r\nI understand that Kate Winslet has had a villainous kick the past few years, and she plays \"stuck up snoot\" very well, but seeing Helena Bonham Carter come in to give us \"the fairy godmother who ain't got time for dat\" really makes me wonder if they just weren't paying her enough to care.  It would have made more sense to let Winslet elevate the fairy godmother (one of the only things that really wasn't) and let Carter goes Bellatrix Lestrange as the Wicked Stepmother.\r\n\r\nSophie McShera did a marvelous job of making me hate her character, and Holliday Grainger kept making me see Katherine Heigl if we could keep her away from tanning beds, so they both did a marvelous job as wicked stepsisters (honestly, probably the best performances of the movie).\r\n\r\nFor some reason though, they made a very strange decision to make all the wicked women gingers, though not with a very convincing dye job.  I don't know if it was supposed to be representative of their tacky fashion and the ability to dye hair at the time, or if Disney really thinks gingers don't have a soul, but it was a blaring message, if illegible.\r\n\r\nWhat makes me think that they don't care at all is Lily James.  She's lovely, she did a good job with the role as written, and I'm dying to see her in anything else to see if any of the oddities were her, or she's done just as good as Winslet with the roles they were given.  \r\n\r\nCinderella is traditionally a \"fairest in the land\" look, given that it's the middle of Europe, I imagine northern was exotic once upon a time, or at least certain people thought so she is traditionally very blonde and very fair.  Lily James is neither (in this, despite some of the posters), so I thought they were taking a more Germanic look with a more honey colored hair....but it is also very oddly colored, and perhaps we wouldn't have notice if it wasn't for her very prominent BLACK eyebrows (which I have nothing against, I actually think they're lovely) which would have been simple enough to die to match.  Alternatively they could have abandoned blonde altogether (plenty of versions do).  It is just very odd to spend millions of dollars to do something purposefully (and repetitively) to make it look like they don't care and objectively make their movie worse.\r\n\r\nOverall, it's this sort of attitude that seeps into the movie at different points.  It could have been a masterpiece, but instead, everyone knows it's a guaranteed paycheck on the title alone and made something that ends up being rather average despite itself.",
    #             "created_at": "2020-09-09T01:06:25.817Z",
    #             "id": "5f582a914e6742003829cb62",
    #             "updated_at": "2021-06-23T15:58:44.136Z",
    #             "url": "https://www.themoviedb.org/review/5f582a914e6742003829cb62"
    #         },
    #         {
    #             "author": "r96sk",
    #             "author_details": {
    #                 "name": "",
    #                 "username": "r96sk",
    #                 "avatar_path": "https://image.tmdb.org/t/p/w92/mwR7rFHoDcobAx1i61I3skzMW3U.jpg",
    #                 "rating": 7.0
    #             },
    #             "content": "An improvement on Disney's past attempt from 1950.\r\n\r\nI do like the animated version from the studio, but this 2015 release of <em>'Cinderella'</em> makes for a more enjoyable experience in my eyes. Lily James and Richard Madden are smart choices to play Cinderella and Prince, while Cate Blanchett is impressive as the Stepmother. Helena Bonham Carter (Fairy Godmother), Stellan Skarsg\u00e5rd (Grand Duke) and Nonso Anozie (Captain) are also noteworthy.\r\n\r\nThe premise has a few changes, the ending plays out slightly differently compared to the '50 production - to positive effect. It also makes the nastiness of Blanchett's character unmistakably clear, I actually felt hatred for her - which wasn't the case, at least to the same extent, with the original.\r\n\r\nGood viewing.",
    #             "created_at": "2020-11-14T23:14:19.144Z",
    #             "id": "5fb064cb202e1100411d9e8e",
    #             "updated_at": "2021-06-23T15:58:47.499Z",
    #             "url": "https://www.themoviedb.org/review/5fb064cb202e1100411d9e8e"
    #         },
    #         {
    #             "author": "dbgallup",
    #             "author_details": {
    #                 "name": "",
    #                 "username": "dbgallup",
    #                 "avatar_path": null,
    #                 "rating": null
    #             },
    #             "content": "The best reviewer of Cinderella (2015) might be a child, for its message of kindness and courage wrapped in the Disney classic and illuminated through the eyes and smiles of Lily James (Ella), Richard Madden (\"Mr. Kit\"), Haley Atwell (Ella's mother) et al. calls out the beauty and virtue of child-like simplicity.  I think the great accomplishment of Lily James is her non-verbal communication of this central theme to \"have courage and be kind\" in the midst of the vicissitudes of life, just as Cate Blanchett's non-verbal communication of jaded bitterness masterfully supplies the melancholy contrast of devious conniving.   James brings love into her little world while Blanchett's legacy is her two spoiled rotten daughters played marvelously by Holliday Granger and Sophie McShera.  This remake brings a lot of humor to help get the message across-- primarily in Helen Botham Carter, the hairy Godfather, I mean, the fairy Godmother-- whose quirky kindness charms and delights.  The animals too, as Ella's constant companions, add to the humor.  The casting in this film utilizes the actors' talents quite well. I found myself watching this over and over again, at least parts of it, for the sheer joy of its message.  In a world of negativity, there is something very real about simplicity and purity, if only in a love fantasy.  \r\nA final note must be added about the music-- it contributes its share to the film's message most beautifully.",
    #             "created_at": "2021-09-26T04:35:18.570Z",
    #             "id": "614ff886aaf897008f227cd4",
    #             "updated_at": "2021-09-30T16:20:51.014Z",
    #             "url": "https://www.themoviedb.org/review/614ff886aaf897008f227cd4"
    #         },
    #         {
    #             "author": "CinemaSerf",
    #             "author_details": {
    #                 "name": "CinemaSerf",
    #                 "username": "Geronimo1967",
    #                 "avatar_path": "https://image.tmdb.org/t/p/w92/yz2HPme8NPLne0mM8tBnZ5ZWJzf.jpg",
    #                 "rating": 6.0
    #             },
    #             "content": "Lily James takes the title role in this colourful telling of the original rags to riches story. Upon the death of her father, she finds herself little better than a skivvy for her acerbic stepmother Cate Blanchett and her ghastly daughters \"Drisella\" (Sophie McShera) and \"Anastasia\" (Holiday Grainger). Meantime, the handsome prince (Richard Madden) who appears to have had his breeches sprayed onto his body, is unhappy. His father (Sir Derek Jacobi) needs him to take a wife - but whom? Well, the fairy tale sets out the rest of the story and Sir Kenneth Branagh sticks faithfully enough to it. Helena Bonham Carter arrives to turn the pumpkin into a coach and... It's quite an adequate adaptation, this. The attention to detail is superb, a strong testament to the costumier's arts with a fine Patrick Doyle score (and a bit of \"Bibbiddi-Bobbiddi-Boo\") to accompany what is a well cast, and good looking film. There is certainly too much reliance on CGI, there's not a great deal of chemistry between Madden and James, and I could have done with a little more input from Blanchett, Sir Derek - and the entertaining Stellan Skarsg\u00e5rd as the \"Grand Duke\" but for the most part this flows along stylishly. The eagle-eyed amongst us might spot a young Josh C'Connor in an equally tight uniform, too! Is it Disney or \"Slipper and the Rose\" (1976)? Maybe a bit of both, but not so good as either?",
    #             "created_at": "2022-03-28T09:36:44.483Z",
    #             "id": "624181acc616ac0047854159",
    #             "updated_at": "2022-03-28T09:37:36.486Z",
    #             "url": "https://www.themoviedb.org/review/624181acc616ac0047854159"
    #         },
    #         {
    #             "author": "CinemaSerf",
    #             "author_details": {
    #                 "name": "CinemaSerf",
    #                 "username": "Geronimo1967",
    #                 "avatar_path": "https://image.tmdb.org/t/p/w92/yz2HPme8NPLne0mM8tBnZ5ZWJzf.jpg",
    #                 "rating": 6.0
    #             },
    #             "content": "Lily James takes the title role in this colourful telling of the original rags to riches story. Upon the death of her father, she finds herself little better than a skivvy for her acerbic stepmother Cate Blanchett and her ghastly daughters \"Drisella\" (Sophie McShera) and \"Anastasia\" (Holiday Grainger). Meantime, the handsome prince (Richard Madden) who appears to have had his breeches sprayed onto his body, is unhappy. His father (Sir Derek Jacobi) needs him to take a wife - but whom? Well, the fairy tale sets out the rest of the story and Sir Kenneth Branagh sticks faithfully enough to it. Helena Bonham Carter arrives to turn the pumpkin into a coach and... It's quite an adequate adaptation, this. The attention to detail is superb, a strong testament to the costumier's arts with a fine Patrick Doyle score (and a bit of \"Bibbiddi-Bobbiddi-Boo\") to accompany what is a well cast, and good looking film. There is certainly too much reliance on CGI, there's not a great deal of chemistry between Madden and James, and I could have done with a little more input from Blanchett, Sir Derek - and the entertaining Stellan Skarsg\u00e5rd as the \"Grand Duke\" but for the most part this flows along stylishly. The eagle-eyed amongst us might spot a young Josh C'Connor in an equally tight uniform, too! Is it Disney or \"Slipper and the Rose\" (1976)? Maybe a bit of both, but not so good as either?",
    #             "created_at": "2022-04-04T09:39:16.312Z",
    #             "id": "624abcc48eda8700625a639c",
    #             "updated_at": "2022-04-04T09:39:16.312Z",
    #             "url": "https://www.themoviedb.org/review/624abcc48eda8700625a639c"
    #         },
    #         {
    #             "author": "The Movie Mob",
    #             "author_details": {
    #                 "name": "The Movie Mob",
    #                 "username": "mooney240",
    #                 "avatar_path": "https://image.tmdb.org/t/p/w92/blEC280vq31MVaDcsWBXuGOsYnB.jpg",
    #                 "rating": 6.0
    #             },
    #             "content": "**Beautiful and bland at the same time.**\r\n\r\nThe story that's been told 1,000 times. Although this retelling boasts the most impressive costumes and stage design with an excellent cast, there is not much else to set it apart. Everything is familiar, draining some of the magic from this classic story.",
    #             "created_at": "2022-08-19T23:25:38.880Z",
    #             "id": "63001bf23af929007d8c2b41",
    #             "updated_at": "2022-09-03T15:17:47.651Z",
    #             "url": "https://www.themoviedb.org/review/63001bf23af929007d8c2b41"
    #         },
    #         {
    #             "author": "Andre Gonzales",
    #             "author_details": {
    #                 "name": "Andre Gonzales",
    #                 "username": "SoSmooth1982",
    #                 "avatar_path": "https://image.tmdb.org/t/p/w92/ast1oGYDI7Li9daLuOV4UxGiXj.jpg",
    #                 "rating": 6.0
    #             },
    #             "content": "I liked the live version way better then the animation one. Well acted and was surprisingly entertaining.",
    #             "created_at": "2023-06-07T21:13:18.939Z",
    #             "id": "6480f2ee64765400ad81215b",
    #             "updated_at": "2023-06-07T21:28:40.367Z",
    #             "url": "https://www.themoviedb.org/review/6480f2ee64765400ad81215b"
    #         }
    #     ]
    # },
    
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
            temp['rate'] = review['author_details']['rating']
            temp['comments'] = review['content']
            temp['comment_date'] = review['created_at']
            
            comments.append(temp)
    return comments
            
        

def main():
    movie_file = 'result/all_movies_data.json'
    actor_file = 'result/actor_details.json'
    comment_file = 'result/movies_with_reviews.json'
    
    if not os.path.exists('result_cleanse'):
        os.makedirs('result_cleanse')
    
    
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