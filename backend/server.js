import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

const app = express();
const port = 8000;

app.use(cors({
    origin:'https://hungphma.github.io/my-salary-tracker/',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to salary_tracker API');
});
dotenv.config(); 
const url = process.env.MONGO_URI;
 
mongoose.connect(uri)
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
        console.log('Salary data: ', salaries); // Log the data for debugging
        res.json(salaries); // Return the data as JSON
    } catch (err) {
        res.status(500).json({ message: 'Error fetching salary data', error: err });
    }
});

app.get('/api/income', async (req, res) => {
    try {
        console.log('Fetching income data...');
        const collection = mongoose.connection.db.collection('salaryandtip');
        console.log('Collection name:', collection.collectionName); // Log the collection name for debugging

        const result = await collection.aggregate([
            { $group: { _id: null, totalIncome: {$sum: "$total"}}}
        ]).toArray();

        console.log('Aggregation result:', result); // Log the aggregation result for debugging
        if (result.length > 0){
            console.log("Total income:", result[0].totalIncome);
            res.json({ totalIncome: result[0].totalIncome });
        }
        else{
            console.log("No income data found")
            res.json({ totalIncome: 0}); // If no data, return 0
        }
    }
    catch(error){
        res.status(500).json({message: 'Error fetching income data', error: error});
    }
});

app.post('/api/salary/add', async (req, res) => {
    const { salary, tip, date } = req.body;

    if (!salary || !tip || !date) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const newSalary = {
            _id: uuidv4(),
            date,
            salary,
            tip,
            total: salary + tip
        };

        const result = await mongoose.connection.db.collection('salaryandtip').insertOne(newSalary);

        res.status(201).json({
            _id: newSalary._id, 
            ...newSalary
        });
    } catch (error) {
        console.error('Error adding salary:', error);
        res.status(500).json({ message: 'Error adding salary data' });
    }
});

app.put('/api/salary/:id', async (req, res) => {
    const {salary, tip, date} = req.body;
    console.log('Received data:', { salary, tip, date });

    const { id } = req.params;
    console.log('Received ID:', id);

    try{
        const updatedSalary = await mongoose.connection.db.collection('salaryandtip').findOneAndUpdate(
            { _id: id },
            { $set:{
                date: date,
                salary: salary,
                tip: tip,
                total: salary + tip
            }},{
                returnDocument: 'after'
            }
        );
        console.log('Updated salary data: ', updatedSalary);
        res.json(updatedSalary);
    }
    catch(error){
        res.status(500).json({message: 'Error updating salary data', error: error});
    }
});

app.delete('/api/salary/delete/:id', async (req, res) => {
    const { id } = req.params;
    console.log('Received ID for deletion:', id);

    try {
        const result = await mongoose.connection.db.collection('salaryandtip').deleteOne({ _id: id });

        console.log('Deletion result: ', result);
        res.json(result);
    } catch (error) {
        // Catch the error here and use the correct variable name
        res.status(500).json({ message: 'Error deleting salary data', error: error });
    }
});

app.listen(port, () => {
    console.log('Server is runnnig on port: ', port);
});