import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getSalaries = async (req, res) => {
  try {
    const search = req.query.search?.toString() || '';
    const salaries = await prisma.salaries.findMany({
      where: {
        name: {
          contains: search,
        },
      },
    });
    

    res.json(salaries);
  } catch (error) {
    console.error("Error retrieving salaries:", error);
    res.status(500).json({ message: "Error retrieving salaries" });
  }}

  export const createSalaries = async (req, res) => {
    try {
      const {name,email,phoneNumber, salaryAmount, paidAmount, remainingAmount, startDate, endDate, timeStamp, petrolExpense, otherExpense,  } = req.body;
      const product = await prisma.salaries.create({
        data: {
          name,
          email,
          phoneNumber,
          salaryAmount,
          paidAmount,
          remainingAmount,
          startDate,
          endDate,
          timeStamp,
          petrolExpense,
          otherExpense,
        },
      });
      res.status(201).json(salaries);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ message: "Error creating product" });
    }
  }
