import React, { createContext, useContext, useState } from "react";

const NavigationContext = createContext();

export function NavigationProvider({ children }) {
  const [showNavigation, setShowNavigation] = useState(false);

  return (
    <NavigationContext.Provider value={{ showNavigation, setShowNavigation }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  return useContext(NavigationContext);
}
