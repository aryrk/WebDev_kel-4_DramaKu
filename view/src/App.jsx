import React from "react";

import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Users from "./pages/CMS/Users";
import Actors from "./pages/CMS/Actors";
import Register from "./pages/Register";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import Comments from "./pages/CMS/Comments";
import DetailPage from "./pages/DetailPage";
import ContentCard from "./pages/ContentCard";
import Navigation from "./components/Navigation";
import DramaInput from "./pages/CMS/Drama/DramaInput";
import SearchResultPage from "./pages/SearchResultPage";
import Error404 from "./pages/Error404";
import Countries from "./pages/CMS/Countries";
import Awards from "./pages/CMS/Awards";
import Genres from "./pages/CMS/Genres";
import Dramas from "./pages/CMS/Drama/Dramas";

import {
  GlobalStateProvider,
  useGlobalState,
} from "./components/GlobalStateContext";

import "./App.css";
import { EditProvider } from "./components/cmsEdit";
import { SwalProvider } from "./components/SweetAlert";
import EmailVerified from "./pages/EmailVerified";

function AppContent() {
  const { showFooter, showNavigation, showSidebar } = useGlobalState();
  return (
    <div>
      {showNavigation && <Navigation />}
      <div
        className={`${
          showSidebar == false
            ? ""
            : "sidebar-wrapper wrapper d-flex align-items-stretch justify-content-center w-100 h-100"
        }`}
      >
        {showSidebar && <Sidebar />}
        <div
          className={`${
            showSidebar == false
              ? ""
              : "sidebar-content wrapper d-flex align-items-stretch justify-content-center w-100 h-100"
          }`}
        >
          <Routes>
            <Route path="*" element={<Error404 />} />
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/email-confirmed" element={<EmailVerified />} />
            <Route path="/detail/:movieId" element={<DetailPage />} />
            <Route path="/home" element={<ContentCard />} />
            <Route path="/search" element={<SearchResultPage />} />
            <Route path="/cms/actors" element={<Actors />} />
            <Route path="/cms/comments" element={<Comments />} />
            <Route path="/cms/users" element={<Users />} />
            <Route path="/cms/drama/input" element={<DramaInput />} />
            <Route path="/cms/drama/validate" element={<Dramas />} />
            <Route path="/cms/countries" element={<Countries />} />
            <Route path="/cms/awards" element={<Awards />} />
            <Route path="/cms/genres" element={<Genres />} />
          </Routes>
          {/* {showFooter && <Footer />} */}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <>
      <SwalProvider>
        <EditProvider>
          <GlobalStateProvider>
            <Router>
              <AppContent />
            </Router>
          </GlobalStateProvider>
        </EditProvider>
      </SwalProvider>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "10vh",
        }}
      >
        <div style={{ flex: 1 }}>{/* Your other components go here */}</div>
        <Footer />
      </div>
    </>
  );
}

export default App;
