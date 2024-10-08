import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUsers = async (req, res) => {
  try {
    const search = req.query.search?.toString() || '';
    const users = await prisma.users.findMany({
      where: {
        name: {
          contains: search,
        },
      },

    }); 
    res.json(users);
  } catch (error) {
    console.error(error); 
    res.status(500).json({ message: "Error retrieving users" });
  } 
};
export const createUsers = async (req, res) => {
  try {
    const {userId,name, email, phoneNumber, quantity, totalAmount, paidAmount, remainingAmount,} = req.body;
    const users = await prisma.users.create({
      data: {
        userId,
        name,
        email,
        phoneNumber,
        quantity,
        totalAmount,
        paidAmount,
        remainingAmount,
      },
    });
    res.status(201).json(users);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Error creating product" });
  }}


  

