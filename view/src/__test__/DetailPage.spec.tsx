import React from "react";
import { render, waitFor, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import DetailPage from "../pages/DetailPage";
import { renderWithProviders } from "../utils/test-utils";
import { MemoryRouter, Route } from 'react-router-dom';

describe('DetailPage', () => {
    it('should render the component correctly', () => {
        const config = {
            short_name: "TestCinema",
            server: "http://localhost:5000"
        };

        const { getByText } = renderWithProviders(
            <DetailPage config={config} />
        );

        expect(getByText("Loading...")).toBeInTheDocument();
    });
});