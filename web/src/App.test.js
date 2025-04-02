import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import "@testing-library/jest-dom";

describe("App Component", () => {
  test("renders the Layout and ShowExpenses components for the root route", () => {
    render(
        <App />
    );

    // Check if the Layout component renders
    expect(screen.getByText(/Truck Expense App/i)).toBeInTheDocument();

   
  });


});