import React from "react";
import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ContentCard from "../pages/ContentCard";
import { renderWithProviders } from "../utils/test-utils";

describe("ContentCard", () => {
    it("should render the component correctly", () => {
        const config = {
            short_name: "TestCinema",
            server: "http://localhost:5000",
        };

        const { getByText } = renderWithProviders(<ContentCard config={config} />);

        expect(getByText("Loading...")).toBeInTheDocument();
    });

    it("should fetch and display movies", async () => {
        const config = {
            short_name: "TestCinema",
            server: "http://localhost:5000",
        };

        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () =>
                    Promise.resolve({
                        movies: [
                            { id: 1, title: "Movie 1", poster: "/path/to/poster1.jpg" },
                            { id: 2, title: "Movie 2", poster: "/path/to/poster2.jpg" },
                        ],
                        total: 2,
                    }),
            })
        );

        const { findByText } = renderWithProviders(<ContentCard config={config} />);

        expect(await findByText("Movie 1")).toBeInTheDocument();
        expect(await findByText("Movie 2")).toBeInTheDocument();
    });
});
