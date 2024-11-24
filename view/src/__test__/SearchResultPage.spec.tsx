import React from "react";
import { MovieCard,SearchResultPage } from "../pages/SearchResultPage";
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders } from "../utils/test-utils";

describe('MovieCard', () => {
    it('should render a movie card', () => {
        const props = {
            id: 1,
            src: 'https://via.placeholder.com/150',
            title: 'Movie Title',
            year: 2021,
            views: 100
        };

        const { getByText } = render(
            <MemoryRouter>
                <MovieCard {...props} />
            </MemoryRouter>
        );

        expect(getByText(props.title)).toBeInTheDocument();
        expect(getByText(props.year.toString())).toBeInTheDocument();
        expect(getByText(props.views.toString() + " views")).toBeInTheDocument();
        const image = document.querySelector(`img[src="${props.src}"]`);
        expect(image).toBeInTheDocument();
    });

    it('shound render N/A if views is 0',()=>{
        const props = {
            id: 1,
            src: 'https://via.placeholder.com/150',
            title: 'Movie Title',
            year: 2021,
            views: 0
        };

        const { getByText } = render(
            <MemoryRouter>
                <MovieCard {...props} />
            </MemoryRouter>
        );

        expect(getByText("N/A views")).toBeInTheDocument();
    });

    it("should have move detail link", () => {
        const props = {
            id: 1,
            src: 'https://via.placeholder.com/150',
            title: 'Movie Title',
            year: 2021,
            views: 100
        };

        const { getByText } = render(
            <MemoryRouter>
                <MovieCard {...props} />
            </MemoryRouter>
        );

        const link = document.querySelector('a');
        expect(link).toBeInTheDocument();
        if (link) {
            expect(link).toHaveAttribute('href', `/detail/${props.id}`);
        }
    });

    it("should display unknown if props is not provided", () => {
        const { getByText } = render(
            <MemoryRouter>
                <MovieCard />
            </MemoryRouter>
        );

        expect(getByText("Unknown")).toBeInTheDocument();
        expect(getByText("Unknown year")).toBeInTheDocument();
        expect(getByText("N/A views")).toBeInTheDocument();
    });
});

describe('SearchResultPage', () => {
    it('should render a search result page', () => {
        const config = {
            server: "http://localhost:5000"
        };

        const { getByText } = renderWithProviders(
                <SearchResultPage config={config} />
        );

        expect(getByText("Tidak ada hasil. Cari dengan kata kunci lain.")).toBeInTheDocument();
    });
});

describe('SearchResultPage', () => {
    beforeEach(() => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                status: 200,
                json: () =>
                    Promise.resolve({
                        movies: [
                            {
                                id: 1,
                                poster: 'https://via.placeholder.com/150',
                                title: 'Dummy Movie 1',
                                year: 2022,
                                views: 120,
                            },
                            {
                                id: 2,
                                poster: 'https://via.placeholder.com/150',
                                title: 'Dummy Movie 2',
                                year: 2023,
                                views: 80,
                            },
                        ],
                    }),
            }),
        );
        
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render search results with dummy data', async () => {
        const config = { server: "http://localhost:5000" };

        const { findByText, findAllByText } = renderWithProviders(
            <SearchResultPage config={config} />
        );

        const movieTitle1 = await findByText('Dummy Movie 1');
        const movieTitle2 = await findByText('Dummy Movie 2');
        const movieYear1 = await findByText('2022');
        const movieYear2 = await findByText('2023');

        expect(movieTitle1).toBeInTheDocument();
        expect(movieTitle2).toBeInTheDocument();
        expect(movieYear1).toBeInTheDocument();
        expect(movieYear2).toBeInTheDocument();

        const views = await findAllByText(/views/);
        expect(views.length).toBe(2);
    });

});
