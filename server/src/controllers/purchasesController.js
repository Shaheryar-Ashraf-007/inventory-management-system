import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Helper function for creating standardized responses
const createResponse = (success, data = null, message = null) => ({
  success,
  data,
  message,
});

// Get all purchases with optional search
export const getPurchases = async (req, res) => {
  try {
    const search = req.query.search?.toString() || '';
    const purchases = await prisma.purchase.findMany({
      where: {
        productId: {
          contains: search,
          mode: 'insensitive', // Case-insensitive search
        },
      },
    });
    res.json(createResponse(true, purchases));
  } catch (error) {
    console.error("Error retrieving purchases:", error);
    res.status(500).json(createResponse(false, null, "Error retrieving purchases"));
  }
};

// Create a new purchase
export const createPurchase = async (req, res) => {
  try {
    const { productId, quantity, unitCost } = req.body;

    // Validate required fields and types
    if (!productId || !quantity || !unitCost) {
      return res.status(400).json(createResponse(false, null, "All fields are required"));
    }

    const parsedQuantity = parseInt(quantity, 10);
    const parsedUnitCost = parseFloat(unitCost);

    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      return res.status(400).json(createResponse(false, null, "Quantity must be a positive integer"));
    }

    if (isNaN(parsedUnitCost) || parsedUnitCost <= 0) {
      return res.status(400).json(createResponse(false, null, "Unit cost must be a positive number"));
    }

    const purchase = await prisma.purchase.create({
      data: {
        productId,
        quantity: parsedQuantity,
        unitCost: parsedUnitCost,
      },
    });
    res.status(201).json(createResponse(true, purchase));
  } catch (error) {
    console.error("Error creating purchase:", error);
    res.status(500).json(createResponse(false, null, "Error creating purchase"));
  }
};

// Delete a purchase by ID
export const deletePurchase = async (req, res) => {
  const { purchaseId } = req.params; // Extract ID from request parameters

  // Check if ID is valid
  if (!purchaseId) {
    return res.status(400).json(createResponse(false, null, "Purchase ID is required"));
  }

  try {
    const deletedPurchase = await prisma.purchase.delete({
      where: { id: purchaseId }, 
    });
    res.status(200).json(createResponse(true, deletedPurchase));
  } catch (error) {
    console.error("Error deleting purchase:", error);
    if (error.code === 'P2025') {
      // Prisma error for not found
      return res.status(404).json(createResponse(false, null, "Purchase not found"));
    }
    res.status(500).json(createResponse(false, null, "Failed to delete purchase"));
  }
};