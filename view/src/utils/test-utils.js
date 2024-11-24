import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { GlobalStateProvider } from "../components/GlobalStateContext";
import { SwalProvider } from "../components/SweetAlert";

let config_json = {
  short_name: "PlutoCinema",
  name: "PlutoChinema",
  description:
    "Kami menyediakan film terbaru dan terbaik untuk Anda. Tonton film sekarang juga! \n \nDibuat oleh Aryo Rakatama dan Hasna Fitriyani Khairunissa",
  logo_png: "/images/logo.png",
  logo_svg: "/images/logo.svg",
  server: "http://localhost:5000",
};

global.loadConfigNonAsync = jest.fn().mockResolvedValue(config_json);
global.loadConfig = jest.fn().mockResolvedValue(config_json);
global.withConfig = jest.fn().mockImplementation((WrappedComponent) => {
  return (props) => {
    return <WrappedComponent config={config_json} {...props} />;
  };
});

export function renderWithProviders(ui, { ...options } = {}) {
  return render(
    <GlobalStateProvider>
      <SwalProvider>
        <MemoryRouter>{ui}</MemoryRouter>
      </SwalProvider>
    </GlobalStateProvider>,
    options
  );
}

export function renderMemoryRouterWithProvider(ui, { ...options } = {}) {
  return render(
    <GlobalStateProvider>
      <SwalProvider>
        <MemoryRouter>{ui}</MemoryRouter>
      </SwalProvider>
    </GlobalStateProvider>,
    options
  );
}