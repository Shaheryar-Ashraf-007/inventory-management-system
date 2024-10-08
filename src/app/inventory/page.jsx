"use client";

import React from 'react';
import { useGetProductsQuery } from "@/state/api";
import Header from "@/app/[components]/Header";
import { DataGrid } from "@mui/x-data-grid";
import { ErrorBoundary } from 'react-error-boundary';

const columns = [
  { field: "serialNo", headerName: "S.No", width: 70 },
  { field: "productId", headerName: "ID", width: 220 },
  { field: "name", headerName: "Product Name", width: 200 },
  { field: "price", headerName: "Price", width: 110 },
  { field: "rating", headerName: "Rating", width: 110 },
  { field: "stockQuantity", headerName: "Stock Quantity", width: 150 },
];

const ErrorFallback = ({ error }) => (
  <div className="text-center text-red-500 py-4">
    Error: {error.message}
  </div>
);

const LoadingComponent = () => (
  <div className="py-4 text-center">Loading...</div>
);

const ErrorComponent = () => (
  <div className="text-center text-red-500 py-4">
    Failed to fetch products
  </div>
);

const DataGridComponent = ({ products }) => {
  if (!Array.isArray(products) || products.length === 0) {
    return <div>No products available</div>;
  }

  return (
    <>
      <DataGrid
        rows={products}
        columns={columns}
        getRowId={(row) => row.productId}
        className="bg-white shadow rounded-lg border border-gray-200 mt-5 !text-gray-700"
      />
      <TotalInventoryAmount products={products} />
    </>
  );
};

const TotalInventoryAmount = ({ products }) => {
  const totalAmount = products.reduce((sum, product) => {
    const price = parseFloat(product.price) || 0;
    const quantity = parseInt(product.stockQuantity) || 0;
    return sum + (price * quantity);
  }, 0);

  return (
    <div className="mt-4">
      <div className="text-right font-bold">
        Total Inventory Amount: Rs {totalAmount.toFixed(2)}
      </div>
      <div className="mt-2">
        <h3 className="font-semibold">Product-wise Amount:</h3>
        <ul className="list-disc list-inside">
          {products.map((product) => {
            const price = parseFloat(product.price) || 0;
            const quantity = parseInt(product.stockQuantity) || 0;
            const productAmount = (price * quantity).toFixed(2);
            return (
              <li key={product.productId}>
                {product.name}: Rs {productAmount}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

const Inventory = () => {
  const { data: rawProducts, isError, isLoading } = useGetProductsQuery();

  const products = React.useMemo(() => {
    if (!rawProducts) return [];
    return rawProducts.map((product, index) => ({
      serialNo: index + 1, // Add serial number
      productId: product.productId || product.id || product._id,
      name: product.name || 'No Name',
      price: product.price != null ? product.price : 'N/A',
      rating: product.rating != null ? product.rating : 'N/A',
      stockQuantity: product.stockQuantity != null ? product.stockQuantity : 'N/A',
    }));
  }, [rawProducts]);

  console.log('Products:', products); // For debugging

  if (isLoading) return <LoadingComponent />;
  if (isError || !products) return <ErrorComponent />;

  return (
    <div className="flex flex-col">
      <Header name="Inventory" />
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <DataGridComponent products={products} />
      </ErrorBoundary>
    </div>
  );
};

export default Inventory;