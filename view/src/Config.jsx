import React, { useState, useEffect } from "react";

const loadConfig = async () => {
  try {
    const response = await fetch("/manifest.json");
    const manifestData = await response.json();
    return manifestData;
  } catch (error) {
    console.error("Error loading manifest.json:", error);
    return {};
  }
};

const withConfig = (WrappedComponent) => {
  return (props) => {
    const [config, setConfig] = useState({});

    useEffect(() => {
      const fetchConfig = async () => {
        const configData = await loadConfig();
        setConfig(configData);
      };

      fetchConfig();
    }, []);

    return <WrappedComponent config={config} {...props} />;
  };
};

export { loadConfig, withConfig };
