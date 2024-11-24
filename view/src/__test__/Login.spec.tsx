import React, { act } from "react";
import { fireEvent, render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import {
  renderMemoryRouterWithProvider,
  renderWithProviders,
} from "../utils/test-utils";
import { CarouselImage, LoginBackground, LoginForm } from "../pages/Login";

describe("CarouselImage", () => {
  it("should render a carousel image", () => {
    const props = {
      src: "https://via.placeholder.com/150",
    };

    const { getByAltText } = render(
      <MemoryRouter>
        <CarouselImage {...props} />
      </MemoryRouter>
    );

    const image = document.querySelector(`img[src="${props.src}"]`);
    expect(image).toBeInTheDocument();
  });
});

describe("LoginBackground", () => {
  it("should render a login background", () => {
    const { getByText } = render(
      <MemoryRouter>
        <LoginBackground />
      </MemoryRouter>
    );
    const image = document.querySelector("img");
    expect(image).toBeInTheDocument();
  });
  it("should render template image", () => {
    var SamplePoster = [
      "/samplePoster/antman.jpg",
      "/samplePoster/avatar.jpg",
      "/samplePoster/darkharvest.jpg",
      "/samplePoster/gooddoctor.jpg",
      "/samplePoster/tennet.jpg",
      "/samplePoster/thombraider.jpg",
      "/samplePoster/venom.jpg",
    ];
    const { getByText } = render(
      <MemoryRouter>
        <LoginBackground />
      </MemoryRouter>
    );
    SamplePoster.forEach((poster) => {
      const image = document.querySelector(`img[src="${poster}"]`);
      expect(image).toBeInTheDocument();
    });
  });

  it("should render fetched image", async () => {
    let posters_json = [
      {
        poster: "/samplePoster/antman.jpg",
      },
      {
        poster: "/samplePoster/avatar.jpg",
      },
      {
        poster: "/samplePoster/darkharvest.jpg",
      },
      {
        poster: "/samplePoster/gooddoctor.jpg",
      },
      {
        poster: "/samplePoster/tennet.jpg",
      },
      {
        poster: "/samplePoster/thombraider.jpg",
      },
      {
        poster: "/samplePoster/venom.jpg",
      },
    ];
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(posters_json),
        headers: new Headers(),
        redirected: false,
        statusText: "OK",
        type: "basic",
        url: "",
      })
    );

    await act(async () => {
      renderWithProviders(<LoginBackground />);
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      "[object Promise]/api/get-movies-poster/100"
    );

    posters_json.forEach((poster) => {
      const image = document.querySelector(`img[src="${poster.poster}"]`);
      expect(image).toBeInTheDocument();
    });

    jest.clearAllMocks();
  });
});

describe("LoginForm", () => {
  it("should render login form", async () => {
    const config = { short_name: "MovieDB" };
    const { getByText } = renderWithProviders(<LoginForm config={config} />);

    expect(getByText(config.short_name)).toBeInTheDocument();
  });
});

describe("LoginForm", () => {
  beforeEach(() => {
    delete window.location;
    window.location = { href: "https://localhost:5173" };
    // global.console = {
    //   ...console,
    //   log: jest.fn(),
    //   debug: jest.fn(),
    //   info: jest.fn(),
    //   warn: jest.fn(),
    //   error: jest.fn(),
    // };
  });
  afterEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
    window.location = { href: "https://localhost:5173" };
  });

  it("should not doing anything if the form is empty",  () => {
    const config = { short_name: "MovieDB" };
    const { getByText } = renderMemoryRouterWithProvider(
      <LoginForm config={config} />
    );
    const submit = getByText("Sign in");

    fireEvent.click(submit);

    expect(sessionStorage.getItem("token")).toBe(null);
    expect(window.location.href).not.toBe("/home");
  });

  it("should not login with incorrect credentials", async () => {
    global.fetch = jest.fn((url, options) => {
      if (url === "[object Promise]/api/login" && options.method === "POST") {
        return Promise.resolve({
          ok: false,
          status: 200,
          json: () =>
            Promise.resolve({
              message: "Invalid username or password",
            }),
          headers: new Headers(),
          redirected: false,
          statusText: "OK",
          type: "basic",
          url: "",
        });
      }
    });

    const config = { short_name: "MovieDB" };
    const { getByText, getByPlaceholderText } = renderMemoryRouterWithProvider(
      <LoginForm config={config} />
    );
    const username = getByPlaceholderText("Username / Email");
    const password = getByPlaceholderText("Password");
    const submit = getByText("Sign in");

    username.value = "admin";
    password.value = "admin";

    fireEvent.click(submit);

    await waitFor(() => {
      expect(sessionStorage.getItem("token")).toBe(null);
      expect(window.location.href).not.toBe("/home");
    });
  });

  it("should login with correct credentials", async () => {
    global.fetch = jest.fn((url, options) => {
      if (url === "[object Promise]/api/login" && options.method === "POST") {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () =>
            Promise.resolve({
              token: "token",
            }),
          headers: new Headers(),
          redirected: false,
          statusText: "OK",
          type: "basic",
          url: "",
        });
      }
    });

    const config = { short_name: "MovieDB" };
    const { getByText, getByPlaceholderText } = renderMemoryRouterWithProvider(
      <LoginForm config={config} />
    );
    const username = getByPlaceholderText("Username / Email");
    const password = getByPlaceholderText("Password");
    const submit = getByText("Sign in");

    username.value = "admin";
    password.value = "admin";

    fireEvent.click(submit);

    await waitFor(() => {
      expect(sessionStorage.getItem("token")).toBe("token");
      expect(window.location.href).toBe("/home");
    });
  });
});
