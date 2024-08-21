import React, { useEffect } from "react";
import { withConfig } from "../Config";

import { Button, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function ElCard() {
  return (
    <Card style={{ width: "18rem" }}>
      <Card.Img
        variant="top"
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRj7yz4KJGlI2obww27tPt6iQDgeKJupAyVBA&s"
      />
      <Card.Body>
        <Card.Title>Card Title</Card.Title>
        <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Card.Text>
        <Button variant="primary">Go somewhere</Button>
      </Card.Body>
    </Card>
  );
}

const Page1 = ({ config }) => {
  // const [backendData, setBackendData] = useState([{}]);

  // useEffect(() => {
  //   fetch("/api")
  //     .then((res) => res.json())
  //     .then((data) => setBackendData(data));
  // }, [])

  // return (
  //   <div>
  //     <Navigation />

  //     <button className="btn bg-primary">Click me</button>
  //     {typeof backendData.users === "undefined" ? (
  //       <p>Loading...</p>
  //     ) : (
  //       backendData.users.map((user, i) => <p key={i}>{user}</p>)
  //     )}
  //   </div>
  // );
  useEffect(() => {
    document.title = `Page 2 - ${config.short_name}`;
  }, [config]);
  return (
    <div>
      <ElCard />
      Hai Ini Adalah Page 2<br></br>
      <a href="/">Go to home</a>
    </div>
  );
};

export default withConfig(Page1);
