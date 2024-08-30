import React from "react";

import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Actors from "./pages/CMS/Actors";
import Register from "./pages/Register";
import Comments from "./pages/CMS/Comments";
import DetailPage from "./pages/DetailPage";
import Navigation from "./components/Navigation";
import Users from "./pages/CMS/Users";
import { NavigationProvider, useNavigation } from "./components/NavigationContext";

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
        <Route path="/register" element={<Register />} />
        <Route path="/cms/actors" element={<Actors />} />
        <Route path="/cms/comments" element={<Comments />} />
        <Route path="/cms/users" element={<Users />} />
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
