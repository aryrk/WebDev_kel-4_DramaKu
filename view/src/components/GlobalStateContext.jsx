import React, { createContext, useContext, useState } from "react";

const GlobalStateContext = createContext();

export function GlobalStateProvider({ children }) {
  const [activeMenu, setActiveMenu] = useState("");
  
  const [showNavigation, setShowNavigation] = useState(false);
  
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <GlobalStateContext.Provider
      value={{
        activeMenu, setActiveMenu,         
        showNavigation, setShowNavigation, 
        showSidebar, setShowSidebar        
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
}

export function useGlobalState() {
  return useContext(GlobalStateContext);
}
