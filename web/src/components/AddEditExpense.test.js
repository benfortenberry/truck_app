import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddEditExpense from "./AddEditExpense";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

global.fetch = jest.fn();

describe("AddEditExpense Component", () => {
  const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});

  const mockProps = {
    selectedexpense: "",
    expensetypes: [
      { id: 1, name: "Fuel" },
      { id: 2, name: "Maintenance" },
    ],
    show: true,
    onHide: jest.fn(),
  };

  beforeEach(() => {
    fetch.mockClear();
  });

  test("renders the Add Expense modal", () => {
    render(<AddEditExpense {...mockProps} />);

    // Check if the modal title is "Add Expense"
    expect(screen.getByTestId("modal-title")).toHaveTextContent("Add Expense");

    // Check if the form fields are rendered
    expect(screen.getByPlaceholderText("Date")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Amount")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Description")).toBeInTheDocument();
    expect(screen.getByText("Expense Type")).toBeInTheDocument();
  });

  test("renders the Edit Expense modal", () => {
    const editProps = {
      ...mockProps,
      selectedexpense: {
        id: 1,
        amount: 100.5,
        date: "2025-03-22",
        typeId: 1,
        description: "Gas for the truck",
      },
    };

    render(<AddEditExpense {...editProps} />);

    // Check if the modal title is "Edit Expense"
    expect(screen.getByTestId("modal-title")).toHaveTextContent("Edit Expense");

    // Check if the form fields are pre-filled with the selected expense data
    expect(screen.getByDisplayValue("2025-03-22")).toBeInTheDocument();
    expect(screen.getByDisplayValue("100.5")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Gas for the truck")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Fuel")).toBeInTheDocument();
  });

  test("handles adding a new expense", async () => {
    fetch.mockResolvedValueOnce({ ok: true });

    render(<AddEditExpense {...mockProps} />);

    // Fill out the form
    await userEvent.type(screen.getByPlaceholderText("Date"), "2025-03-25");
    await userEvent.type(screen.getByPlaceholderText("Amount"), "150.75");
    await userEvent.type(
      screen.getByTestId("description"),
      "Updated description"
    );
    await userEvent.selectOptions(
      screen.getByTestId("select-expense-type"),
      "Fuel"
    );

    // Click the Add button
    fireEvent.click(screen.getByText("Add"));

    // Wait for the API call
    await waitFor(() => {
      const expectedBody = {
        id: expect.any(Number),
        amount: "150.75",
        description: "Updated description",
        date: "2025-03-25",
        typeId: "1",
      };

      const actualBody = JSON.parse(fetch.mock.calls[0][1].body);

      expect(actualBody).toEqual(expectedBody);
    });

    // Ensure the modal is closed
    expect(mockProps.onHide).toHaveBeenCalledWith("Add");
  });

  test("handles editing an expense", async () => {
    fetch.mockResolvedValueOnce({ ok: true });

    const editProps = {
      ...mockProps,
      selectedexpense: {
        id: 1,
        amount: 100.5,
        date: "2025-03-22",
        typeId: 1,
        description: "Fuel for the truck",
      },
    };

    render(<AddEditExpense {...editProps} />);

    // Update the form fields
    await userEvent.clear(screen.getByPlaceholderText("Amount"));
    await userEvent.clear(screen.getByPlaceholderText("Date"));
    await userEvent.clear(screen.getByTestId("description"));

    await userEvent.type(screen.getByPlaceholderText("Date"), "2025-03-25");
    await userEvent.type(screen.getByPlaceholderText("Amount"), "150.75");
    await userEvent.type(
      screen.getByTestId("description"),
      "Updated description"
    );
    await userEvent.selectOptions(
      screen.getByTestId("select-expense-type"),
      "Fuel"
    );

    // Click the Save button
    fireEvent.click(screen.getByText("Save"));

    // Wait for the API call
    await waitFor(() => {
      const expectedBody = {
        id: 1,
        amount: "150.75",
        description: "Updated description",
        date: "2025-03-25",
        typeId: "1",
      };

      const actualBody = JSON.parse(fetch.mock.calls[0][1].body);

      expect(actualBody).toEqual(expectedBody);
    });

    // Ensure the modal is closed
    expect(mockProps.onHide).toHaveBeenCalledWith("Edit");
  });

  test("displays an error message if the API call fails", async () => {
    fetch.mockRejectedValueOnce(new Error("Failed to add expense"));

    render(<AddEditExpense {...mockProps} />);

    // Fill out the form
    await userEvent.type(screen.getByPlaceholderText("Date"), "2025-03-22");
    await userEvent.type(screen.getByPlaceholderText("Amount"), "150.75");
    await userEvent.type(screen.getByTestId("description"), "Oil change");
    await userEvent.selectOptions(
      screen.getByTestId("select-expense-type"),
      "Fuel"
    );

    // Click the Add button
    await userEvent.click(screen.getByText("Add"));

    // Wait for the error alert
    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
      expect(alertMock).toHaveBeenCalledWith("Failed to add expense");
    });
  });
});
