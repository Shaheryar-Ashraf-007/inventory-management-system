import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/material';

const CreatePurchaseModal = ({ open, onClose, onCreate }) => {
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unitCost, setUnitCost] = useState('');
  const [totalCost, setTotalCost] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  // Calculate total cost and amount whenever quantity or unit cost changes
  useEffect(() => {
    const parsedQuantity = parseInt(quantity) || 0;
    const parsedUnitCost = parseFloat(unitCost) || 0;
    const calculatedTotalCost = parsedQuantity * parsedUnitCost;
    setTotalCost(calculatedTotalCost);
    setTotalAmount(calculatedTotalCost); // Adjust if you need a different calculation
  }, [quantity, unitCost]);

  const handleSubmit = () => {
    if (!productId || !quantity || !unitCost) {
      alert("Product ID, quantity, and unit cost are required!");
      return;
    }

    const parsedQuantity = parseInt(quantity);
    const parsedUnitCost = parseFloat(unitCost);

    onCreate({ productId, quantity: parsedQuantity, unitCost: parsedUnitCost, totalCost, totalAmount });
    
    // Reset fields
    setProductId('');
    setQuantity('');
    setUnitCost('');
    setTotalCost(0);
    setTotalAmount(0);
    
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'relative',
          bgcolor: 'background.paper',
          borderRadius: '8px',
          boxShadow: 24,
          p: 4,
          m: 'auto',
          width: '90%',
          maxWidth: 400,
          outline: 'none',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Create New Purchase</h2>
        
        <TextField
          label="Product ID"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          required
          fullWidth
          margin="normal"
          variant="outlined"
          sx={{ bgcolor: 'white' }}
        />
        
        <TextField
          label="Quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
          fullWidth
          margin="normal"
          variant="outlined"
          sx={{ bgcolor: 'white' }}
        />
        
        <TextField
          label="Unit Cost"
          type="number"
          value={unitCost}
          onChange={(e) => setUnitCost(e.target.value)}
          required
          fullWidth
          margin="normal"
          variant="outlined"
          sx={{ bgcolor: 'white' }}
        />
        
        <TextField
          label="Total Cost"
          value={totalCost.toFixed(2)} // Display fixed decimal places
          readOnly
          fullWidth
          margin="normal"
          variant="outlined"
          sx={{ bgcolor: 'white' }}
        />
        
        <TextField
          label="Total Amount"
          value={totalAmount.toFixed(2)} // Display fixed decimal places
          readOnly
          fullWidth
          margin="normal"
          variant="outlined"
          sx={{ bgcolor: 'white' }}
        />

        <div className="flex justify-end mt-4">
          <Button onClick={handleSubmit} variant="contained" color="primary" sx={{ mr: 1 }}>
            Submit
          </Button>
          <Button onClick={onClose} variant="outlined" color="secondary">
            Cancel
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default CreatePurchaseModal;