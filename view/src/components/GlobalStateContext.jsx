import React, { createContext, useContext, useEffect, useState } from "react";

const GlobalStateContext = createContext();

export function GlobalStateProvider({ children }) {
  const [activeMenu, setActiveMenu] = useState("");

  const [showNavigation, setShowNavigation] = useState(() => {
    const savedShowNavigation = sessionStorage.getItem("showNavigation");
    return savedShowNavigation === "true" ? true : false;
  });

  useEffect(() => {
    sessionStorage.setItem("showNavigation", showNavigation);
  }, [showNavigation]);

  const [showSidebar, setShowSidebar] = useState(false);

  const [showFooter, setShowFooter] = useState(() => {
    const savedShowFooter = sessionStorage.getItem("showFooter");
    return savedShowFooter === "true" ? true : false;
  });

  useEffect(() => {
    sessionStorage.setItem("showFooter", showFooter);
  }, [showFooter]);

  return (
    <GlobalStateContext.Provider
      value={{
        activeMenu,
        setActiveMenu,
        showNavigation,
        setShowNavigation,
        showSidebar,
        setShowSidebar,
        showFooter,
        setShowFooter,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
}

export function useGlobalState() {
  return useContext(GlobalStateContext);
}
