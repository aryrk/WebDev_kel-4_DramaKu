import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Actors from "./pages/CMS/Actors";
import Register from "./pages/Register";
import Comments from "./pages/CMS/Comments";
import DetailPage from "./pages/DetailPage";
import Navigation from "./components/Navigation";
import Users from "./pages/CMS/Users";
import ContentCard from "./pages/ContentCard";

import Footer from "./components/Footer";

import Sidebar from "./components/Sidebar";
import {
  GlobalStateProvider,
  useGlobalState,
} from "./components/GlobalStateContext"; // Import GlobalStateContext

import "./App.css";

function AppContent() {
  const { showFooter, showNavigation, showSidebar } = useGlobalState(); // Gunakan useGlobalState

  return (
    <div>
      {showNavigation && <Navigation />}
      <div
        className={
          showSidebar &&
          "sidebar-wrapper wrapper d-flex align-items-stretch w-100 h-100"
        }
      >
        {showSidebar && <Sidebar />}
        <div
          className={
            showSidebar &&
            "sidebar-wrapper wrapper d-flex align-items-stretch w-100 h-100"
          }
        >
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/detail" element={<DetailPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cms/actors" element={<Actors />} />
            <Route path="/cms/comments" element={<Comments />} />
            <Route path="/cms/users" element={<Users />} />
            <Route path="/home" element={<ContentCard />} />
          </Routes>
          {showFooter && <Footer />}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <GlobalStateProvider>
      {" "}
      {/* Ganti NavigationProvider dan SidebarProvider dengan GlobalStateProvider */}
      <Router>
        <AppContent />
      </Router>
    </GlobalStateProvider>
  );
}

export default App;
