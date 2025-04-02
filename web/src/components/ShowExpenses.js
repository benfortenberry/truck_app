import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button, Toast, ToastContainer } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import AddEditExpense from "./AddEditExpense";
import { currencyFormat, expenseTypeFormat } from "../utils/utils";

const ShowExpense = () => {
  const showExpenseApi = process.env.REACT_APP_SHOW_EXPENSE_API;
  const getExpenseTypesApi = process.env.REACT_APP_GET_EXPENSE_TYPES_API;
  const deleteExpenseApi = process.env.REACT_APP_BASE_EXPENSE_API;

  const [expenseTypes, setExpenseTypes] = useState([]);

  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [showToast, setToastShow] = useState(false);
  const [sortKey, setSortKey] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const handleDelete = async (id) => {
    setIsLoading(true);
    try {
      const response = await fetch(deleteExpenseApi.concat("/") + id, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete item");
      }
      setExpenses(expenses.filter((item) => item.id !== id));
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedExpense !== null) {
      setModalShow(true);
    }
  }, [selectedExpense]);

  useEffect(() => {
    getExpenses();
    getExpenseTypes();
  }, []);

  const getExpenses = () => {
    axios
      .get(showExpenseApi)
      .then((res) => {
        setExpenses(res.data);
      })
      .catch((err) => {
        setError("Failed to fetch expenses");
      });
  };

  const getExpenseTypes = () => {
    axios
      .get(getExpenseTypesApi)
      .then((res) => {
        setExpenseTypes(res.data);
      })
      .catch((err) => {
        setError("Failed to fetch expense types");
      });
  };

  function handleSort(column) {
    let direction = "asc";
    if (sortKey === column && sortDirection === "asc") {
      direction = "desc";
    }

    const sortedExpenses = [...expenses].sort((a, b) => {
      let aValue = a[column.toLowerCase()] || "";
      let bValue = b[column.toLowerCase()] || "";

      if (column === "Date") {
        aValue = new Date(a.date);
        bValue = new Date(b.date);
      } else if (column === "Type") {
        aValue = expenseTypeFormat(a.typeId);
        bValue = expenseTypeFormat(b.typeId);
      }

      if (direction === "asc") {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });

    setSortKey(column);
    setSortDirection(direction);
    setExpenses(sortedExpenses);
  }

  if (expenses.length === 0) {
    return <h1>no expenses found</h1>;
  } else {
    return (
      <div className=" table table-responsive w-100">
        {isLoading && <p>Loading</p>}
        {error && <p>Error: {error}</p>}
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th
                onClick={() => handleSort("Date")}
                role="button"
                aria-label="Sort by Date"
              >
                Date{" "}
                {sortKey === "Date" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => handleSort("Type")}
                role="button"
                aria-label="Sort by Type"
              >
                Type{" "}
                {sortKey === "Type" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => handleSort("Amount")}
                role="button"
                aria-label="Sort by Amount"
              >
                Amount{" "}
                {sortKey === "Amount" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => handleSort("Description")}
                role="button"
                aria-label="Sort by Descirption"
              >
                Description{" "}
                {sortKey === "Description" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {expenses?.map((expense, i) => {
              return (
                <tr key={expense.id}>
                  <td>
                    {new Intl.DateTimeFormat("en-US").format(
                      new Date(expense.date)
                    )}
                  </td>
                  <td>{expenseTypeFormat(expense.typeId, expenseTypes)}</td>
                  <td>{currencyFormat(expense.amount)}</td>
                  <td>{expense.description}</td>
                  <td>
                    <Link
                      onClick={() => {
                        // setModalShow(true);
                        setSelectedExpense(expense);
                      }}
                    >
                      <i className="fa fa-pencil" aria-hidden="true"></i>
                    </Link>
                    &nbsp;&nbsp;&nbsp;
                    <Link
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you wish to delete this item?"
                          )
                        )
                          handleDelete(expense.id);
                      }}
                    >
                      <i className="fa fa-trash-o" aria-hidden="true"></i>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>

        <AddEditExpense
          selectedexpense={selectedExpense}
          expensetypes={expenseTypes}
          show={modalShow}
          onHide={(data) => {
            if (data) {
              setToastShow(true);
              getExpenses();
            }
            setModalShow(false);
            setSelectedExpense(null);
          }}
        />

        <ToastContainer position="bottom-end" className="p-3">
          <Toast
            show={showToast}
            onClose={() => setToastShow(false)}
            delay={3000}
            autohide
          >
            <Toast.Body>Success!</Toast.Body>
          </Toast>
        </ToastContainer>

        <Button
          className="btn-secondary "
          onClick={() => {
            setSelectedExpense("");
          }}
        >
          <i className="fa fa-plus" aria-hidden="true"></i>
          &nbsp;Add Expense
        </Button>
      </div>
    );
  }
};

export default ShowExpense;
