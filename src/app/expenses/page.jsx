"use client";

import React, { useState } from 'react';
import { useGetExpensesByCategoryQuery, useCreateExpenseMutation, useDeleteExpenseMutation } from '@/state/api';
import Header from "@/app/[components]/Header";
import CreateExpenseModal from './CreateExpenseModal.jsx';
import { DataGrid } from "@mui/x-data-grid";
import { ErrorBoundary } from 'react-error-boundary';
import Button from '@mui/material/Button';

const columns = (handleDeleteExpense) => [
  { field: "serial", headerName: "S.No", width: 70 },
  { field: "expenseId", headerName: "ID", width: 220 },
  { field: "category", headerName: "Category", width: 200 },
  { field: "amount", headerName: "Amount", width: 110, type: 'number' },
  { field: "timestamp", headerName: "Date/Time", width: 180 },
  {
    field: "actions",
    headerName: "Actions",
    width: 150,
    renderCell: (params) => (
      <Button 
        className='bg-red-500 text-white'
        onClick={() => handleDeleteExpense(params.row.expenseId)}
      >
        Delete
      </Button>
    ),
  },
];

const Expenses = () => {
  const { data: rawExpenses, isError, isLoading, error, refetch } = useGetExpensesByCategoryQuery();
  const [createExpense] = useCreateExpenseMutation();
  const [deleteExpense] = useDeleteExpenseMutation();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCreateExpense = async (expenseData) => {
    try {
      console.log("Creating expense with data:", expenseData);
      await createExpense(expenseData).unwrap();
      setIsModalOpen(false);
      setErrorMessage("");
      refetch();
    } catch (error) {
      console.error("Failed to create expense:", error);
      setErrorMessage("Failed to create expense");
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await deleteExpense(expenseId).unwrap();
        refetch(); // Refetch to update the expense list
      } catch (error) {
        console.error("Failed to delete expense:", error);
        setErrorMessage("Failed to delete expense. It may already be deleted or not found.");
      }
    }
  };

  const expenses = React.useMemo(() => {
    if (!rawExpenses) return [];
    return rawExpenses.map((expense, index) => ({
      serial: index + 1, // Serial number
      expenseId: expense.expenseId || expense.id || expense._id,
      category: expense.category || 'Uncategorized',
      amount: expense.amount != null ? expense.amount : 0,
      timestamp: expense.timestamp ? new Date(expense.timestamp).toLocaleString() : 'N/A',
    }));
  }, [rawExpenses]);

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Calculate category-wise totals
  const categoryWiseTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const LoadingComponent = () => (
    <div className="py-4 text-center">Loading...</div>
  );

  const ErrorComponent = ({ error }) => (
    <div className="text-center text-red-500 py-4">
      Failed to fetch expenses: {error.message}
    </div>
  );

  if (isLoading) return <LoadingComponent />;
  if (isError) return <ErrorComponent error={error} />;

  return (
    <div className="flex flex-col">
      <Header name="Expenses" />
      <div className="flex justify-between mb-4">
        <Button variant="contained" color="primary" onClick={() => setIsModalOpen(true)}>
          Create Expense
        </Button>
      </div>
      <ErrorBoundary FallbackComponent={({ error }) => <div>Error: {error.message}</div>}>
        <DataGrid
          rows={expenses}
          columns={columns(handleDeleteExpense)} // Pass the handleDeleteExpense here
          getRowId={(row) => row.expenseId}
          className="bg-white shadow rounded-lg border border-gray-200 mt-5 !text-gray-700"
        />
      </ErrorBoundary>

      <div className="flex justify-between mt-4">
        <strong>Total Amount: Rs {totalAmount.toFixed(2)}</strong>
      </div>

      <div className="mt-4">
        <h3 className="font-bold">Category-wise Totals:</h3>
        <ul>
          {Object.entries(categoryWiseTotals).map(([category, amount]) => (
            <li key={category}>
              {category}: Rs {amount.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>

      <CreateExpenseModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onCreate={handleCreateExpense} 
      />
      {errorMessage && <div className="text-red-500">{errorMessage}</div>}
    </div>
  );
};

export default Expenses;