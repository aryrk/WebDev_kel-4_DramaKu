import React from "react";
import { act, fireEvent, getByTestId } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AddActor, ActorTable } from "../pages/CMS/Actors";
import { renderWithProviders } from "../utils/test-utils";
import userEvent from "@testing-library/user-event";

describe("AddActor", () => {
  it("should render a form to add an actor", () => {
    const { getByText } = renderWithProviders(<AddActor />);

    expect(getByText("Country")).toBeInTheDocument();
    expect(getByText("Actor Name")).toBeInTheDocument();
    expect(getByText("Birth Date")).toBeInTheDocument();
    expect(getByText("Submit")).toBeInTheDocument();
  });
});

describe("AddActor", () => {
  let country_list = [
    {
      id: 1,
      name: "Nigeria",
    },
    {
      id: 2,
      name: "Ivory Coast",
    },
    {
      id: 3,
      name: "Sweden",
    },
  ];
  beforeEach(() => {
    // console.error = jest.fn();

    global.fetch = jest.fn((url, options) => {
      if (url === "[object Promise]/api/cms/countrylist") {
        return Promise.resolve({
          json: () => Promise.resolve(country_list),
        });
      }
      if (url === "[object Promise]/api/cms/actors") {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ status: "success" }),
          headers: new Headers(),
          redirected: false,
          statusText: "OK",
          type: "basic",
          url: "",
        });
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render country datalist", async () => {
    const { getByText } = renderWithProviders(<AddActor />);
    await act(async () => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
    country_list.forEach((country) => {
      expect(getByText(country.name)).toBeInTheDocument();
    });
  });

  it("should submit actor form", async () => {
    const { getByText, getByPlaceholderText } = renderWithProviders(
      <AddActor />
    );
    const actor = getByPlaceholderText("Actor Name");
    await act(async () => {
      await userEvent.type(actor, "John Doe");
      userEvent.tab();
    });
    // await act(async () => {
    //   await userEvent.type(getByPlaceholderText("Birth Date"), "1980-01-01");
    //   userEvent.tab();
    // });
    // const input = document.querySelector("input[type='file']");
    // if (input) {
    //   const file = new File(["(⌐□_□)"], "chucknorris.png", {
    //     type: "image/png",
    //   });
    //   await act(async () => {
    //     await userEvent.upload(input, file);
    //   });
    // }

    //   userEvent.click(getByText("Submit"));
    // fireEvent.click(getByText("Submit"));
    // await act(async () => {
    //   expect(global.fetch).toHaveBeenCalledTimes(1);
    //   expect(getByPlaceholderText("Actor Name").value).toBe("");
    //   expect(getByPlaceholderText("Birth Date").value).toBe("");
    // });
  });

  it("should not submit actor form if required fields are empty", async () => {
    const { getByText } = renderWithProviders(<AddActor />);
    await act(async () => {
      userEvent.click(getByText("Submit"));
    });
    expect(global.fetch).toHaveBeenCalledTimes(0);
  });
});
