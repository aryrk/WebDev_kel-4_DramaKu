import React, { createContext, useContext, useState } from "react";


const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <SidebarContext.Provider value={{ showSidebar, setShowSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}
