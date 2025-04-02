import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { getRandomInt } from "../utils/utils";

import React, { useEffect, useState } from "react";

function AddEditExpense(props) {
  const baseExpenseApi = process.env.REACT_APP_BASE_EXPENSE_API;

  let selectedExpense = props.selectedexpense;
  let expenseTypes = props.expensetypes;

  const [newAmount, setNewAmount] = useState(0);
  const onAmountInput = ({ target: { value } }) => setNewAmount(value);

  const [newDescription, setNewDescription] = useState("");
  const onDescriptionInput = ({ target: { value } }) =>
    setNewDescription(value);

  const [newDate, setNewDate] = useState("");
  const onDateInput = ({ target: { value } }) => setNewDate(value);

  const [newTypeId, setNewTypeId] = useState("");
  const onTypeIdInput = ({ target: { value } }) => setNewTypeId(value);

  useEffect(() => {
    setNewAmount(selectedExpense?.amount);
    setNewDescription(selectedExpense?.description);
    setNewDate(selectedExpense?.date);
    setNewTypeId(selectedExpense?.typeId);
  }, [selectedExpense]);

  const addExpense = async () => {
    let newExpense = {
      amount: newAmount,
      description: newDescription,
      date: newDate,
      typeId: newTypeId,
      id: getRandomInt(1, 1000),
    };

    try {
      const response = await fetch(baseExpenseApi, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newExpense),
      });

      if (response.ok) {
        props.onHide("Add");
      } else {
        throw new Error("Failed to add expense");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const editExpense = async () => {
    let newExpense = {
      amount: newAmount,
      description: newDescription,
      date: newDate,
      typeId: newTypeId,
      id: selectedExpense.id,
    };

    try {
      const response = await fetch(baseExpenseApi, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newExpense),
      });

      if (response.ok) {
        props.onHide("Edit");
      } else {
        throw new Error("Failed to edit expense");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  if (selectedExpense === null) {
    return null;
  } else {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body className="bg-dark">
          <h4 data-testid="modal-title">
            {selectedExpense ? "Edit Expense" : "Add Expense"}
          </h4>

          <br />
          <div className="row">
            <div className="col-lg-4">
              <label>Date</label>
              <Form.Control
                type="date"
                value={newDate || ""}
                onChange={onDateInput}
                placeholder="Date"
              />
            </div>

            <div className="col-lg-4">
              <label>Expense Type</label>

              <Form.Select
                onChange={onTypeIdInput}
                  data-testid="select-expense-type"
                value={newTypeId || ""}
              >
                <option value={0}>Select One</option>
                {expenseTypes?.map((expenseType, i) => {
                  return (
                    <option value={expenseType.id} key={expenseType.id}>
                      {expenseType.name}
                    </option>
                  );
                })}
              </Form.Select>
            </div>

            <div className="col-lg-4">
              <label>Amount</label>
              <Form.Control
                type="number"
                value={newAmount || ""}
                onChange={onAmountInput}
                placeholder="Amount"
              />
            </div>
          </div>

          <div className="row mt-3 mb-3">
            <div className="col">
              <label>Description</label>
              <Form.Control
                as="textarea"
                placeholder="Description"
                data-testid="description"
                value={newDescription || ""}
                onChange={onDescriptionInput}
                rows={3}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="bg-dark">
          <Button
            className="btn-success"
            onClick={() => {
              if (selectedExpense) {
                editExpense();
              } else {
                addExpense();
              }
            }}
          >
            {selectedExpense && <span>Save</span>}
            {!selectedExpense && <span>Add</span>}
          </Button>
          <Button className="btn-secondary" onClick={props.onHide}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default AddEditExpense;
