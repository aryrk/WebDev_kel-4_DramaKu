import React from "react";
import { render, waitFor, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import CMSDramas from "../pages/CMS/Drama/Dramas";
import { renderWithProviders } from "../utils/test-utils";

jest.mock("../components/cmsEdit", () => ({
    useEdit: jest.fn(() => ({
        data: [
            { id: 1, name: "Movie 1", actor: "Actor 1", genre: "Genre 1", synopsis: "Synopsis 1" },
        ],
    })),
}));

const mockCancelEdit = jest.fn();
const mockEdit = jest.fn();

beforeEach(() => {
    require("../components/cmsEdit").useEdit.mockReturnValue({
        cancelEdit: mockCancelEdit,
        edit: mockEdit,
        last_edit: null,
    });
});

describe('CMSDramas', () => {
    it('should render the component correctly', () => {
        const config = {
            short_name: "TestCinema",
            server: "http://localhost:5000"
        };

        const { getByText } = renderWithProviders(
            <CMSDramas config={config} />
        );

        // Check if the 'Movies' title is rendered correctly
        expect(getByText("Movies")).toBeInTheDocument();
    });

    it('should fetch and display movies', async () => {
        const config = {
            short_name: "TestCinema",
            server: "http://localhost:5000"
        };

        // Mock the fetch call for the movie list
        global.fetch = jest.fn((url) => {
            if (url.includes("/api/cms/movielist")) {
                return Promise.resolve({
                    json: () => Promise.resolve({
                        movies: [
                            { id: 1, title: "Movie 1", actors: "Actor 1", genres: "Genre 1", synopsis: "Synopsis 1", status: "pending" },
                            { id: 2, title: "Movie 2", actors: "Actor 2", genres: "Genre 2", synopsis: "Synopsis 2", status: "accepted" }
                        ],
                        total: 2
                    })
                });
            }
        });

        const { findByText } = renderWithProviders(
            <CMSDramas config={config} />
        );

        // Wait for the async rendering to complete
        await waitFor(() => {
            // Use `findByText` directly here without wrapping it with `await`
            findByText("Movie 1").then((element) => expect(element).toBeInTheDocument());
            findByText("Actor 1").then((element) => expect(element).toBeInTheDocument());
            findByText("Genre 1").then((element) => expect(element).toBeInTheDocument());
            findByText("Synopsis 1").then((element) => expect(element).toBeInTheDocument());
            findByText("pending").then((element) => expect(element).toBeInTheDocument());

            findByText("Movie 2").then((element) => expect(element).toBeInTheDocument());
            findByText("Actor 2").then((element) => expect(element).toBeInTheDocument());
            findByText("Genre 2").then((element) => expect(element).toBeInTheDocument());
            findByText("Synopsis 2").then((element) => expect(element).toBeInTheDocument());
            findByText("accepted").then((element) => expect(element).toBeInTheDocument());
        });
    });


    // it('should handle the edit and cancel actions correctly', async () => {
    //     const config = {
    //         short_name: "TestCinema",
    //         server: "http://localhost:5000"
    //     };

    //     const { getByText } = renderWithProviders(
    //         <CMSDramas config={config} />
    //     );

    //     // Simulate edit action and ensure mock function is called
    //     fireEvent.click(getByText("Edit Movie 1")); // Assuming button exists
    //     expect(mockEdit).toHaveBeenCalledTimes(1);

    //     // Simulate cancel action and ensure mock function is called
    //     fireEvent.click(getByText("Cancel")); // Assuming cancel button exists
    //     expect(mockCancelEdit).toHaveBeenCalledTimes(1);
    // });
});
