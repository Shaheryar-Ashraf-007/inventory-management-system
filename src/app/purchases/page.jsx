"use client";

import React, { useState } from 'react';
import { useCreatePurchaseMutation, useDeletePurchaseMutation, useGetPurchasesQuery } from '@/state/api';
import Header from "@/app/[components]/Header";
import CreatePurchaseModal from './CreatePurchaseModal.jsx';
import { DataGrid } from "@mui/x-data-grid";
import { ErrorBoundary } from 'react-error-boundary';
import Button from '@mui/material/Button';

// Define the columns for the DataGrid
const columns = (handleDeletePurchase) => [
  { field: "serial", headerName: "S.No", width: 70 },
  { field: "purchaseId", headerName: "Purchase Id", width: 110, type: 'number' },
  { field: "productId", headerName: "Product Id", width: 110 },
  { field: "quantity", headerName: "Quantity", width: 200 },
  { field: "unitCost", headerName: "Unit Cost", width: 110, type: 'number' },
  { field: "totalAmount", headerName: "Total Amount", width: 110, type: 'number' },
  { field: "totalCost", headerName: "Total Cost", width: 110, type: 'number' },
  { field: "timestamp", headerName: "Date/Time", width: 180 },
  {
    field: "actions",
    headerName: "Actions",
    width: 150,
    renderCell: (params) => (
      <Button 
        className='bg-red-500 text-white'
        onClick={() => handleDeletePurchase(params.row.purchaseId)}
      >
        Delete
      </Button>
    ),
  },
];

const Purchases = () => {
  const { data: rawPurchases, isError, isLoading, error, refetch } = useGetPurchasesQuery();
  const [createPurchase] = useCreatePurchaseMutation();
  const [deletePurchase] = useDeletePurchaseMutation();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCreatePurchase = async (purchaseData) => {
    try {
      console.log("Creating purchase with data:", purchaseData);
  
      const quantity = parseInt(purchaseData.quantity, 10);
      const unitCost = parseFloat(purchaseData.unitCost);
      const totalCost = parseFloat(purchaseData.totalCost);
      const totalAmount = parseFloat(purchaseData.totalAmount);
  
      // Validate input
      if (!purchaseData.productId || 
          isNaN(quantity) || quantity <= 0 || 
          isNaN(unitCost) || unitCost <= 0 || 
          isNaN(totalCost) || totalCost <= 0 || 
          isNaN(totalAmount) || totalAmount <= 0) {
        throw new Error("All fields are required and must be valid numbers.");
      }
      
      // Ensure total cost is consistent with quantity and unit cost
      if (totalCost !== quantity * unitCost || totalAmount !== totalCost) {
        throw new Error("Total Cost and Total Amount must match the calculated values.");
      }

      await createPurchase({
        productId: purchaseData.productId,
        quantity,
        unitCost,
        totalCost,
        totalAmount
      }).unwrap();
      
      setIsModalOpen(false);
      setErrorMessage("");
      refetch();
    } catch (error) {
      console.error("Failed to create purchase:", error);
      setErrorMessage("Failed to create purchase: " + (error.data?.message || error.message));
    }
  };

  const handleDeletePurchase = async (purchaseId) => {
    if (window.confirm("Are you sure you want to delete this purchase?")) {
      try {
        await deletePurchase(purchaseId).unwrap();
        refetch();
      } catch (error) {
        console.error("Failed to delete purchase:", error);
        setErrorMessage("Failed to delete purchase. It may already be deleted or not found.");
      }
    }
  };

  const purchases = React.useMemo(() => {
    console.log("rawPurchases:", rawPurchases); // Log the rawPurchases
    if (!Array.isArray(rawPurchases)) return []; // Ensure it's an array

    return rawPurchases.map((purchase, index) => ({
      serial: index + 1,
      purchaseId: purchase.purchaseId,
      productId: purchase.productId,
      quantity: purchase.quantity,
      unitCost: purchase.unitCost,
      totalCost: purchase.totalCost,
      totalAmount: purchase.totalAmount,
      timestamp: purchase.timestamp ? new Date(purchase.timestamp).toLocaleString() : 'N/A',
      category: purchase.category, 
    }));
  }, [rawPurchases]);

  const totalAmount = purchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0);

  const categoryWiseTotals = purchases.reduce((acc, purchase) => {
    const category = purchase.category || 'Uncategorized';
    acc[category] = (acc[category] || 0) + purchase.totalAmount;
    return acc;
  }, {});

  const LoadingComponent = () => (
    <div className="py-4 text-center">Loading...</div>
  );

  const ErrorComponent = ({ error }) => (
    <div className="text-center text-red-500 py-4">
      Failed to fetch purchases: {error.message}
    </div>
  );

  if (isLoading) return <LoadingComponent />;
  if (isError) return <ErrorComponent error={error} />;

  return (
    <div className="flex flex-col">
      <Header name="Purchases" />
      <div className="flex justify-between mb-4">
        <Button variant="contained" color="primary" onClick={() => setIsModalOpen(true)}>
          Create Purchase
        </Button>
      </div>
      <ErrorBoundary FallbackComponent={({ error }) => <div>Error: {error.message}</div>}>
        <DataGrid
          rows={purchases}
          columns={columns(handleDeletePurchase)}
          getRowId={(row) => row.purchaseId} // Ensure purchaseId is unique
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

      <CreatePurchaseModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onCreate={handleCreatePurchase} 
      />
      {errorMessage && <div className="text-red-500">{errorMessage}</div>}
    </div>
  );
};

export default Purchases;