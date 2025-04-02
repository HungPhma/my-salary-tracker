import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

const app = express();
const port = 8000;

const allowedOrigins = [
    'http://localhost:3000', // Allow local development
    'https://hungphma.github.io', // Allow deployed frontend
  ];
  
app.use(cors({
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        // Allow requests without origin (e.g., Postman or server-side requests)
        callback(null, true);
        } else {
        callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
  
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to salary_tracker API');
});

dotenv.config(); 
const url = process.env.MONGO_URI;
 
mongoose.connect(url)
    .then(() => {
        console.log('MongoDB connected');
        console.log('Current DB Name:', mongoose.connection.name);
    })
    .catch(err => {
        console.log('Error connecting to MongoDB: ', err);
    });

app.get('/api/salary', async (req, res) => {
    try {
        const collection = mongoose.connection.db.collection('salaryandtip');
        const salaries = await collection.find().sort({ date: 1 }).toArray(); // Sort by date in ascending order

        console.log('Fetched salary data successfully');
        res.json(salaries); // Return the data as JSON
    } catch (err) {
        res.status(500).json({ message: 'Error fetching salary data', error: err });
    }
});

app.get('/api/income', async (req, res) => {
    try {
        const collection = mongoose.connection.db.collection('salaryandtip');

        const result = await collection.aggregate([
            { $group: { _id: null, totalIncome: {$sum: "$total"}}}
        ]).toArray();

        if (result.length > 0){
            console.log('Fetched income data successfully');
            res.json({ totalIncome: result[0].totalIncome });
        }
        else{
            console.log('No income data found');
            res.json({ totalIncome: 0}); // If no data, return 0
        }
    }
    catch(error){
        res.status(500).json({message: 'Error fetching income data', error: error});
    }
});

app.post('/api/salary/add', async (req, res) => {
    const { salary, tip, date } = req.body;

    if (salary === undefined || tip === undefined || date === undefined) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const salaryNumber = Number(salary);
    const tipNumber = Number(tip);

    if (isNaN(salaryNumber) || isNaN(tipNumber)) {
        return res.status(400).json({ message: 'Salary and Tip must be valid numbers' });
    }

    try {
        const newSalary = {
            _id: uuidv4(),
            date,
            salary: salaryNumber,
            tip: tipNumber,
            total: salaryNumber + tipNumber
        };

        const result = await mongoose.connection.db.collection('salaryandtip').insertOne(newSalary);

        res.status(201).json({
            _id: newSalary._id, 
            ...newSalary
        });
        console.log('Added new salary data successfully');
    } catch (error) {
        // console.error('Error adding salary:', error);
        res.status(500).json({ message: 'Error adding salary data' });
    }
});

app.put('/api/salary/:id', async (req, res) => {
    const {salary, tip, date} = req.body;
    console.log('Received data:', { salary, tip, date });

    const { id } = req.params;
    console.log('Received ID:', id);
    if (salary === undefined || tip === undefined || date === undefined) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const salaryNumber = Number(salary);
    const tipNumber = Number(tip);
    const updateDate = date;
    console.log('Update date:', updateDate);
    console.log('Salary number:', salaryNumber);
    console.log('Tip number:', tipNumber);

    if (isNaN(salaryNumber) || isNaN(tipNumber)) {
        return res.status(400).json({ message: 'Salary and Tip must be valid numbers' });
    }

    try{
        const updatedSalary = await mongoose.connection.db.collection('salaryandtip').findOneAndUpdate(
            { _id: id },
            { $set:{
                date: updateDate,
                salary: salaryNumber,
                tip: tipNumber,
                total: salaryNumber + tipNumber
            }},{
                returnDocument: 'after'
            }
        );
        console.log('Updated salary data successfully');
        res.json(updatedSalary.value);
    }
    catch(error){
        res.status(500).json({message: 'Error updating salary data', error: error});
    }
});

app.delete('/api/salary/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await mongoose.connection.db.collection('salaryandtip').deleteOne({ _id: id });

        console.log('Delete data successfully');
        res.json(result);
    } catch (error) {
        // Catch the error here and use the correct variable name
        res.status(500).json({ message: 'Error deleting salary data', error: error });
    }
});

app.listen(port, () => {
    console.log('Server is runnnig on port: ', port);
});