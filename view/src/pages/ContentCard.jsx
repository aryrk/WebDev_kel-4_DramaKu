import React, { useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigation } from "../components/NavigationContext";
import Footer from "../components/Footer";

function ContentCard() {
  const { setShowNavigation } = useNavigation();

  useEffect(() => {
    setShowNavigation(true);
  }, [setShowNavigation]);

  const cardData = [
    {
      title: "The Outsider (2020)",
      genre: "Crime, Drama, Mystery",
      image:
        "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/action-mistery-movie-poster-design-template-2ec690d65c22aa12e437d765dbf7e4af_screen.jpg?ts=1680854635",
    },
    {
      title: "Avatar: The Way of Water (2022)",
      genre: "Action, Adventure, Fantasy",
      image:
        "https://upload.wikimedia.org/wikipedia/id/5/54/Avatar_The_Way_of_Water_poster.jpg",
    },
    {
      title: "Shang-Chi and the Legend of the Ten Rings (2021)",
      genre: "Action, Adventure, Fantasy",
      image:
        "https://awsimages.detik.net.id/community/media/visual/2021/09/23/shang-chi-and-the-legend-of-the-ten-rings.jpeg?w=1200",
    },
    {
      title: "Venom: Let There Be Carnage (2021)",
      genre: "Action, Adventure, Fantasy",
      image:
        "https://m.media-amazon.com/images/M/MV5BYTc3ZTAwYTgtMmM4ZS00MDRiLWI2Y2EtYmRiZmE0YjkzMGY1XkEyXkFqcGdeQXVyMDA4NzMyOA@@._V1_.jpg",
    },
    {
      title: "Fast X (2023)",
      genre: "Action, Adventure",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT26cCz4laFQinmeRZIyUj2rC-QUheFbYyhtg&s",
    },
    {
      title: "Minions: The Rise of Gru (2022)",
      genre: "Animation, Adventure, Comedy",
      image:
        "https://m.media-amazon.com/images/M/MV5BNDM3YWEwYTMtNmY3ZS00YzJiLWFlNWItOWFmNjY0YzA4ZDE3XkEyXkFqcGdeQXVyMTA3MDk2NDg2._V1_QL75_UX190_CR0,0,190,281_.jpg",
    },
    {
      title: "Thor: Love and Thunder (2022)",
      genre: "Action, Adventure, Fantasy",
      image: "https://pbs.twimg.com/media/FV6uYJJVUAAxK79.jpg",
    },
    {
      title: "Doctor Strange in the Multiverse of Madness (2022)",
      genre: "Action, Adventure, Fantasy",
      image:
        "https://upload.wikimedia.org/wikipedia/id/0/08/Doctor_Strange_in_the_Multiverse_of_Madness_poster.jpeg",
    },
    {
      title: "Black Panther: Wakanda Forever (2022)",
      genre: "Action, Adventure, Drama",
      image:
        "https://upload.wikimedia.org/wikipedia/id/thumb/3/3b/Black_Panther_Wakanda_Forever_poster.jpg/220px-Black_Panther_Wakanda_Forever_poster.jpg",
    },
    {
      title: "John Wick: Chapter 4 (2023)",
      genre: "Action, Crime, Thriller",
      image:
        "https://m.media-amazon.com/images/M/MV5BOTQ2NjkwZTYtMDk4Yy00MjQ4LWE0NDgtN2E4MjM1NGQ0ZTNhXkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_.jpg",
    },
    {
      title: "The Medium (2021)",
      genre: "Horror, Mystery, Thriller",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_6p04AuzrRTMfSkvleW7-oCB9hpmNRGdw1Q&s",
    },
    {
      title: "Free Guy (2021)",
      genre: "Action, Adventure, Comedy",
      image:
        "https://cdn0-production-images-kly.akamaized.net/9RYURyL6Cjo2G431LmLnxYJ2VCA=/800x1066/smart/filters:quality(75):strip_icc():format(webp)/kly-media-production/medias/3611087/original/006297700_1635044700-MV5BOTY2NzFjODctOWUzMC00MGZhLTlhNjMtM2Y2ODBiNGY1ZWRiXkEyXkFqcGdeQXVyMDM2NDM2MQ__._V1_FMjpg_UY720_.jpg",
    },
    {
      title: "Avengers: Endgame (2019)",
      genre: "Action, Adventure, Drama",
      image:
        "https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_QL75_UX190_CR0,0,190,281_.jpg",
    },
    {
      title: "Mission: Impossible – Dead Reckoning Part One (2023)",
      genre: "Action, Adventure, Thriller",
      image:
        "https://upload.wikimedia.org/wikipedia/id/8/86/MissionImpossibleDeadReckoningPartOnePoster.jpg",
    },
    {
      title: "Exhuma (2024)",
      genre: "Horror, Mystery, Thriller",
      image:
        "https://kaltimtoday.co/wp-content/uploads/2024/02/exhuma-instagram-at-cinepolisid-65de04d2c8664.webp",
    },
    {
      title: "Evil Dead Rise (2023)",
      genre: "Horror, Thriller",
      image:
        "https://m.media-amazon.com/images/M/MV5BMmZiN2VmMjktZDE5OC00ZWRmLWFlMmEtYWViMTY4NjM3ZmNkXkEyXkFqcGdeQXVyMTI2MTc2ODM3._V1_.jpg",
    },
    {
      title: "Top Gun: Maverick (2022)",
      genre: "Action, Drama",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiis_xjmEqBxaAjKRQF3z6Al8ShiHl8CvTlg&s",
    },
    {
      title: "Guardians of the Galaxy Volume 3 (2023)",
      genre: "Action, Adventure, Comedy",
      image:
        "https://lumiere-a.akamaihd.net/v1/images/id-guardiansofthegalaxy-vol3-payoffposter_6ba5c28b.jpeg",
    },
    {
      title: "Guardians of the Galaxy Volume 3 (2023)",
      genre: "Action, Adventure, Comedy",
      image:
        "https://upload.wikimedia.org/wikipedia/id/thumb/1/15/Meg_2-_The_Trench_film_cover2.jpg/220px-Meg_2-_The_Trench_film_cover2.jpg",
    },
    {
      title: "Ant-Man and the Wasp: Quantumania (2023)",
      genre: "Action, Adventure, Comedy",
      image:
        "https://upload.wikimedia.org/wikipedia/id/d/d8/AntManAndTheWaspPoster2018.jpg",
    },
  ];

  return (
    <Container style={{ marginTop: "40px" }}>
      <Row xs={1} md={3} lg={5} className="g-4">
        {cardData.map((card, idx) => (
          <Col key={idx} className="d-flex justify-content-center">
            <Button
              variant="text"
              size="sm"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                border: "none",
                background: "transparent",
                width: "250px", // Adjusted width
              }}
            >
              <img
                src={card.image}
                width="250px" // Adjusted width
                alt={card.title}
                style={{
                  borderRadius: "15px",
                  height: "350px", // Adjusted height
                  objectFit: "cover",
                }}
              />
              <label
                style={{
                  marginTop: "8px",
                  textAlign: "center",
                  fontSize: "16px", // Adjusted font size
                  color: "#f3deb2",
                  width: "100%",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {card.title}
              </label>
            </Button>
          </Col>
        ))}
      </Row>
      <Footer config={{ config }} />
    </Container>
  );
}

export default ContentCard;
