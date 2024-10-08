import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import dashboardRoutes from './routes/dashboardRoutes.js';
import { createProduct, deleteProduct, getProducts } from './controllers/productController.js';
import { createSalaries, getSalaries } from './controllers/salariesController.js';
import { createUsers, getUsers } from './controllers/userController.js';
import { createExpense, deleteExpense, getExpensesByCategory } from './controllers/expenseController.js';
import { createPurchase, deletePurchase, getPurchases } from './controllers/purchasesController.js';


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.use('/dashboard', dashboardRoutes); //http://localhost:8000/dashboard
app.get('/products',getProducts);  //http://localhost:8000/products
app.post('/products',createProduct);
app.delete('/products/:productId', deleteProduct);
app.get('/salaries', getSalaries); 
app.post('/salaries', createSalaries);
app.get('/expenses',getExpensesByCategory);
app.post('/expenses', createExpense);
app.delete('/expenses/:expenseId', deleteExpense);
app.get('/purchases',getPurchases);
app.post('/purchases', createPurchase);
app.delete('/purchases/:purchaseId', deletePurchase); //http://localhost:8000/salaries
app.get('/users',getUsers);
app.post('/salaries', createUsers); 
 //http://localhost:8000/salaries
; 

app.get('/', (req, res) => {
  res.send('Inventory Management System API');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});