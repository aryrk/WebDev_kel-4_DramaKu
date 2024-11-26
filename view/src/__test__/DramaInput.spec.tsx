import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import { DramaForm } from "../pages/CMS/Drama/DramaInput";
import { renderWithProviders } from "../utils/test-utils";
// import userEvent from "@testing-library/user-event";
// import { act } from "@testing-library/react";

describe('DramaForm', () => {
  it('should render the form correctly', () => {
    const { getByText } = renderWithProviders(<DramaForm />);
    expect(getByText("Title")).toBeInTheDocument();
    expect(getByText("Alternative Title")).toBeInTheDocument();
    expect(getByText("Year")).toBeInTheDocument();
    expect(getByText("Synopsis")).toBeInTheDocument();
    expect(getByText("Availability")).toBeInTheDocument();
    expect(getByText("Genres")).toBeInTheDocument();
    expect(getByText("Link Trailer")).toBeInTheDocument();
    expect(getByText("Award")).toBeInTheDocument();
  });

  it('should update the Title field correctly', async () => {
    const { findByPlaceholderText } = renderWithProviders(<DramaForm />);

    // Use `findByPlaceholderText` to allow for asynchronous rendering
    const titleInput = await findByPlaceholderText(/Enter title/i); // Adjust placeholder if necessary
    fireEvent.change(titleInput, { target: { value: "Test Drama" } });

    expect(titleInput.value).toBe("Test Drama");
  });
});
