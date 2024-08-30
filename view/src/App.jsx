import React from "react";
<<<<<<< HEAD
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

=======

import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Actors from "./pages/CMS/Actors";
import Register from "./pages/Register";
import Comments from "./pages/CMS/Comments";
import DetailPage from "./pages/DetailPage";
import Navigation from "./components/Navigation";
import Users from "./pages/CMS/Users";
>>>>>>> d25e274ee045f36b3746091154770ad78a887af9
import {
  NavigationProvider,
  useNavigation,
} from "./components/NavigationContext";
<<<<<<< HEAD
import DetailPage from "./pages/DetailPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Actors from "./pages/CMS/Actors";
import ContentCard from "./pages/ContentCard";
=======
import Sidebar from "./components/Sidebar";
import { SidebarProvider, useSidebar } from "./components/SidebarContext";

>>>>>>> d25e274ee045f36b3746091154770ad78a887af9
import "./App.css";

function AppContent() {
  const { showNavigation } = useNavigation();
  const { showSidebar } = useSidebar();

  return (
    <div>
      {showNavigation && <Navigation />}
<<<<<<< HEAD
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/detail" element={<DetailPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cms/actors" element={<Actors />} />
        <Route path="/home" element={<ContentCard />} />
      </Routes>
=======
      <div
        className={
          showSidebar &&
          "sidebar-wrapper wrapper d-flex align-items-stretch w-100 h-100"
        }
      >
        {showSidebar && <Sidebar />}
        <div
          className={showSidebar && "sidebar-content d-block w-100 h-100"}
          id="content"
        >
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
      </div>
>>>>>>> d25e274ee045f36b3746091154770ad78a887af9
    </div>
  );
}
function App() {
  return (
    <NavigationProvider>
      <SidebarProvider>
        <Router>
          <AppContent />
        </Router>
      </SidebarProvider>
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
