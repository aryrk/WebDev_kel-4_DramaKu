import React from "react";
import {
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { RegisterForm } from "../pages/Register";
import { renderWithProviders } from "../utils/test-utils";
import userEvent from "@testing-library/user-event";

describe("RegisterForm", () => {
  it("should render a register form", () => {
    const { getByText } = renderWithProviders(<RegisterForm />);
    expect(getByText("Registration")).toBeInTheDocument();
  });
});

describe("RegisterForm", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    global.fetch = jest.fn((url, options) => {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ username: false, email: false }),
        headers: new Headers(),
        redirected: false,
        statusText: "OK",
        type: "basic",
        url: "",
      });
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("register button cannot be clicked until all field not empty", async () => {
    const { getByText, getByPlaceholderText } = renderWithProviders(
      <RegisterForm />
    );

    const username = getByPlaceholderText("Username");
    await act(async () => {
      await userEvent.type(username, "admin");
      userEvent.tab();
    });
    const usernameTaken = getByText("Username already taken");

    await act(async () => {
      expect(usernameTaken).toHaveClass("d-none");
      expect(getByText("Register")).toBeDisabled();
    });

    const email = getByPlaceholderText("Email");
    await act(async () => {
      await userEvent.type(email, "D@gmail.com");
      userEvent.tab();
    });
    const emailTaken = getByText("Email already taken");

    await act(async () => {
      expect(emailTaken).toHaveClass("d-none");
      expect(getByText("Register")).toBeDisabled();
    });

    const password = getByPlaceholderText("Password");
    await act(async () => {
      await userEvent.type(password, "Aa1asaaa");
      userEvent.tab();
    });
    const confirmPassword = getByPlaceholderText("Confirm Password");
    await act(async () => {
      await userEvent.type(confirmPassword, "Aa1asaaa");
      userEvent.tab();
    });

    await act(async () => {
      expect(getByText("Register")).not.toBeDisabled();
    });
  });
});
describe("RegisterForm", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    global.fetch = jest.fn((url, options) => {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ username: true, email: true }),
        headers: new Headers(),
        redirected: false,
        statusText: "OK",
        type: "basic",
        url: "",
      });
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should show error message if username or email already taken", async () => {
    const { getByText, getByPlaceholderText } = renderWithProviders(
      <RegisterForm />
    );

    const username = getByPlaceholderText("Username");
    await act(async () => {
      await userEvent.type(username, "admin");
      userEvent.tab();
    });

    const email = getByPlaceholderText("Email");
    await act(async () => {
      await userEvent.type(email, "mail@gmail.com");
      userEvent.tab();
    });
    const usernameTaken = getByText("Username already taken");
    const emailTaken = getByText("Email already taken");

    await act(async () => {
      expect(emailTaken).not.toHaveClass("d-none");
      expect(usernameTaken).not.toHaveClass("d-none");
      expect(getByText("Register")).toBeDisabled();
    });
  });
});

describe("RegisterForm", () => {
  it("password and confirm password should match", async () => {
    const { getByText, getByPlaceholderText } = renderWithProviders(
      <RegisterForm />
    );

    const password = getByPlaceholderText("Password");
    await act(async () => {
      await userEvent.type(password, "Aa1asaaa");
      userEvent.tab();
    });
    const confirmPassword = getByPlaceholderText("Confirm Password");
    const passwordNotMatch = getByText("Passwords do not match");
    await act(async () => {
      await userEvent.type(confirmPassword, "Aa1asaaa");
      userEvent.tab();
    });

    await act(async () => {
      expect(passwordNotMatch).toHaveClass("d-none");
    });
    await act(async () => {
      await userEvent.type(confirmPassword, "Aa1asaaaa");
      userEvent.tab();
    });


    await act(async () => {
      expect(passwordNotMatch).not.toHaveClass("d-none");
      expect(getByText("Register")).toBeDisabled();
    });

  });
});
