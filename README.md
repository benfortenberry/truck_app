# Truck Expense App

The **Truck Expense App** is a web application designed to help users manage and track truck-related expenses efficiently. Built with React, it provides features like adding, editing, deleting, and sorting expenses, along with a clean and responsive user interface.

---

## Features

- Add, edit, and delete truck expenses.
- Sort expenses by date, type, amount, or description.
- Responsive design for seamless use on desktop and mobile devices.
- Integrated with a backend API for managing expenses and expense types.

---

## Technologies Used

- **Frontend**: React, React Router, Bootstrap
- **Backend**: C#
- **Styling**: Bootstrap, Font Awesome
- **State Management**: React Hooks (`useState`, `useEffect`)

---


## API Endpoints

The app interacts with the following backend API endpoints:

GET /expenses: Fetch all expenses.
POST /expense: Add a new expense.
PUT /expense/:id: Edit an existing expense.
DELETE /expense/:id: Delete an expense.
GET /expense-types: Fetch all expense types.


## How to Use

Add an Expense:

Click the "Add Expense" button.
Fill in the form with the expense details and click "Add".

Edit an Expense:

Click the pencil icon next to an expense.
Update the details and click "Save".

Delete an Expense:

Click the trash icon next to an expense.
Confirm the deletion in the popup.

Sort Expenses:

Click on the column headers (Date, Type, Amount, Description) to sort the expenses.

## Future Enhancements
Add user authentication for secure access.
Implement advanced filtering options.
Add charts and graphs for expense visualization.
Support exporting expenses to CSV or PDF.