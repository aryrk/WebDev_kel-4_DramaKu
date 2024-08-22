import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Page2 from "./pages/page2";
import Page1 from "./pages/page1";
import DetailPage from "./pages/DetailPage";
import "./App.css";

function App() {
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

  return (
    <div>
      <Navigation />
      <Router>
        <Routes>
          <Route path="/" element={<Page1 />} />
          <Route path="/page2" element={<Page2 />} />
          <Route path="/Detail" element={<DetailPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
