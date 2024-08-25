// import React, { useEffect, useState } from "react";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import {
  NavigationProvider,
  useNavigation,
} from "./components/NavigationContext";
import DetailPage from "./pages/DetailPage";
import Login from "./pages/Login";
import "./App.css";

function AppContent() {
  const { showNavigation } = useNavigation();

  return (
    <div>
      {showNavigation && <Navigation />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/detail" element={<DetailPage />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}
function App() {
  return (
    <NavigationProvider>
      <Router>
        <AppContent />
      </Router>
    </NavigationProvider>
  );
}

// function App() {
//   // const [backendData, setBackendData] = useState([{}]);

//   // useEffect(() => {
//   //   fetch("/api")
//   //     .then((res) => res.json())
//   //     .then((data) => setBackendData(data));
//   // }, [])

//   // return (
//   //   <div>
//   //     <Navigation />

//   //     <button className="btn bg-primary">Click me</button>
//   //     {typeof backendData.users === "undefined" ? (
//   //       <p>Loading...</p>
//   //     ) : (
//   //       backendData.users.map((user, i) => <p key={i}>{user}</p>)
//   //     )}
//   //   </div>
//   // );
//   var { showNavigation } = useNavigation();
//   return (
//     <div>
//       {showNavigation && <Navigation />}
//       <Router>
//         <Routes>
//           <Route path="/" element={<Page1 />} />
//           <Route path="/page2" element={<Page2 />} />
//           <Route path="/detail" element={<DetailPage />} />
//           <Route path="/login" element={<Login />} />
//         </Routes>
//       </Router>
//     </div>
//   );
// }

export default App;
