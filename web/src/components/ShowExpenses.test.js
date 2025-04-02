import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ShowExpense from "./ShowExpenses";
import axios from "axios";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import fetchMock from "jest-fetch-mock";

jest.mock("axios");
fetchMock.enableMocks();

describe("ShowExpense Component", () => {
  const mockExpenses = [
    {
      id: 1,
      amount: 100.5,
      date: "2025-03-22",
      typeId: 1,
      description: "Got some gas",
    },
    {
      id: 2,
      amount: 50.0,
      date: "2025-03-23",
      typeId: 2,
      description: "Stopped in Buccess",
    },
  ];

  const mockExpenseTypes = [
    { id: 1, name: "Fuel" },
    { id: 2, name: "Maintenance" },
  ];

  beforeEach(() => {
    fetchMock.doMock();
    axios.get.mockImplementation((url) => {
      if (url.includes("expenses")) {
        return Promise.resolve({ data: mockExpenses });
      }
      if (url.includes("expense-types")) {
        return Promise.resolve({ data: mockExpenseTypes });
      }
      return Promise.reject(new Error("Not Found"));
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders the component and displays expenses", async () => {
    render(
      <MemoryRouter>
        <ShowExpense />
      </MemoryRouter>
    );

    // Check for loading state
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(axios.get).toHaveBeenCalledTimes(2);
    // Wait for expenses to load

    await waitFor(() => {
      expect(screen.getByText("Got some gas")).toBeInTheDocument();
      expect(screen.getByText("Stopped in Buccess")).toBeInTheDocument();
    });

    // // Check for table headers
    expect(screen.getByText("Date")).toBeInTheDocument();
    expect(screen.getByText("Type")).toBeInTheDocument();
    expect(screen.getByText("Amount")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
  });

  test("handles deleting an expense", async () => {
    fetch.mockResponseOnce(JSON.stringify({}));
    render(
      <MemoryRouter>
        <ShowExpense />
      </MemoryRouter>
    );

    // Wait for expenses to load
    await waitFor(() => {
      expect(screen.getByText("Fuel")).toBeInTheDocument();
    });

    // Click the delete button for the first expense
    const deleteButton = screen.getAllByTestId("delete")[0];
    window.confirm = jest.fn(() => true); // Mock confirmation dialog
    fireEvent.click(deleteButton);

    // Wait for the expense to be removed
    await waitFor(() => {
      expect(screen.queryByText("Got some gas")).not.toBeInTheDocument();
    });
  });

  test("displays an error message if fetching expenses fails", async () => {
    axios.get.mockRejectedValueOnce(new Error("Failed to fetch expenses"));

    render(
      <MemoryRouter>
        <ShowExpense />
      </MemoryRouter>
    );

    // Wait for the error message
    await waitFor(() => {
      expect(screen.getByText(/no expenses found/i)).toBeInTheDocument();
    });
  });

  test("opens the Add/Edit modal when clicking the Add button", async () => {
    render(
      <MemoryRouter>
        <ShowExpense />
      </MemoryRouter>
    );

    // Wait for expenses to load
    await waitFor(() => {
      expect(screen.getByText("Fuel")).toBeInTheDocument();
    });

    // Click the "Add Expense" button
    const addButton = screen.getByTestId("add-expense");
    fireEvent.click(addButton);

    // Check if the modal is displayed
    expect(screen.getByTestId("modal-title")).toBeInTheDocument();
  });
});
