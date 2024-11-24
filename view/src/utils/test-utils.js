import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { GlobalStateProvider } from "../components/GlobalStateContext";
export function renderWithProviders(ui, { ...options } = {}) {
  return render(
    <GlobalStateProvider>
      <MemoryRouter>{ui}</MemoryRouter>
    </GlobalStateProvider>,
    options
  );
}

// import React from "react";
// import { render } from "@testing-library/react";
// import { GlobalStateProvider } from "../components/GlobalStateContext";
// import "@testing-library/jest-dom";

// global.fetch = jest.fn();

// global.fetch.mockImplementation((url) => {
//   if (url === "/manifest.json") {
//     return Promise.resolve({
//       json: () =>
//         Promise.resolve({
//           short_name: "PlutoCinema",
//           name: "PlutoChinema",
//           description:
//             "Kami menyediakan film terbaru dan terbaik untuk Anda. Tonton film sekarang juga! \n \nDibuat oleh Aryo Rakatama dan Hasna Fitriyani Khairunissa",
//           logo_png: "/images/logo.png",
//           logo_svg: "/images/logo.svg",
//           server: "http://localhost:5000",
//         }),
//     });
//   }
//   return Promise.reject(new Error("Unexpected fetch call"));
// });

// const renderWithProviders = (ui, { providerProps, ...renderOptions } = {}) => {
//   return render(
//     <GlobalStateProvider {...providerProps}>
//       <MemoryRouter>{ui}</MemoryRouter>
//     </GlobalStateProvider>,
//     renderOptions
//   );
// };

// export { renderWithProviders };
